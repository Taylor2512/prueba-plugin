/** Canonical, portable Template JSON contract (schemaVersion in content). */

import { getSchemaPluginByType, getSchemaSerializationPolicy } from '@sisad-pdfme/schemas';

export const PORTABLE_TEMPLATE_SCHEMA_VERSION = 1;

export const PORTABLE_TEMPLATE_FORMAT = 'sisad-pdfme-template';

export type PortableTemplateJson = {
  format: typeof PORTABLE_TEMPLATE_FORMAT;
  schemaVersion: number;
  template: {
    id: string;
    name: string;
    description?: string;
    locale?: string;
    metadata?: Record<string, unknown>;
  };
  documents: Array<Record<string, unknown>>;
  users: Array<Record<string, unknown>>;
  schemas: Array<Record<string, unknown>>;
  assignments: Array<Record<string, unknown>>;
  settings?: Record<string, unknown>;
  [key: string]: unknown;
};

export type PortableTemplateIssueCode =
  | 'JSON_PARSE_ERROR'
  | 'TEMPLATE_NOT_OBJECT'
  | 'UNSUPPORTED_SCHEMA_VERSION'
  | 'MISSING_REQUIRED_FIELD'
  | 'INVALID_JSON_VALUE'
  | 'INVALID_ENTITY_SHAPE'
  | 'DUPLICATE_ID'
  | 'UNSUPPORTED_SCHEMA_TYPE'
  | 'ORPHAN_REFERENCE'
  | 'DUPLICATE_SCHEMA_NAME';

export type PortableTemplateIssue = {
  code: PortableTemplateIssueCode;
  severity: 'error' | 'warning';
  path: string;
  entityId?: string;
  message: string;
  hint?: string;
};

export type PortableTemplateValidation = {
  valid: boolean;
  issues: PortableTemplateIssue[];
};

export type PortableTemplateOutcome = 'VALID' | 'MIGRATED' | 'UNSUPPORTED' | 'INVALID';

export type PortableTemplateParseResult = {
  template: PortableTemplateJson | null;
  valid: boolean;
  migrated: boolean;
  outcome: PortableTemplateOutcome;
  issueDetails: PortableTemplateIssue[];
  issues: string[];
};

export type PortableTemplatePipelineStage =
  | 'parse'
  | 'identify'
  | 'migrate'
  | 'validate'
  | 'hydrate';

export type PortableTemplatePipelineStep = {
  stage: PortableTemplatePipelineStage;
  status: 'ok' | 'failed' | 'skipped';
  message?: string;
};

export type HydratedPortableTemplate = {
  template: PortableTemplateJson['template'];
  documents: PortableTemplateJson['documents'];
  users: PortableTemplateJson['users'];
  schemas: PortableTemplateJson['schemas'];
  assignments: PortableTemplateJson['assignments'];
  settings: PortableTemplateJson['settings'];
};

export type PortableTemplateIngestResult = PortableTemplateParseResult & {
  hydrated: HydratedPortableTemplate | null;
  trace: PortableTemplatePipelineStep[];
};

const isObject = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const isJsonSafe = (value: unknown, seen = new Set<object>()): boolean => {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return true;
  if (typeof value === 'number') return Number.isFinite(value);
  if (!value || typeof value !== 'object' || seen.has(value)) return false;
  seen.add(value);
  return Array.isArray(value)
    ? value.every((entry) => isJsonSafe(entry, seen))
    : Object.values(value).every((entry) => isJsonSafe(entry, seen));
};

const sortKeys = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(sortKeys);
  if (!isObject(value)) return value;
  return Object.keys(value).sort().reduce<Record<string, unknown>>((result, key) => {
    result[key] = sortKeys(value[key]);
    return result;
  }, {});
};

const flattenLegacySchemas = (schemas: unknown): Array<Record<string, unknown>> => {
  if (!Array.isArray(schemas)) return [];
  if (schemas.every((entry) => entry && typeof entry === 'object' && !Array.isArray(entry))) {
    return schemas as Array<Record<string, unknown>>;
  }
  const flattened: Array<Record<string, unknown>> = [];
  schemas.forEach((pageSchemas, pageIndex) => {
    if (!Array.isArray(pageSchemas)) return;
    pageSchemas.forEach((schema, schemaIndex) => {
      if (!isObject(schema)) return;
      flattened.push({
        schemaUid:
          typeof schema.schemaUid === 'string' && schema.schemaUid.trim()
            ? schema.schemaUid
            : `legacy-${pageIndex}-${schemaIndex}`,
        pageIndex,
        name: typeof schema.name === 'string' && schema.name.trim() ? schema.name : `legacy-${pageIndex}-${schemaIndex}`,
        displayLabel: typeof schema.displayLabel === 'string' && schema.displayLabel.trim()
          ? schema.displayLabel
          : (typeof schema.name === 'string' && schema.name.trim() ? schema.name : `legacy-${pageIndex}-${schemaIndex}`),
        position: isObject(schema.position) ? schema.position : { x: 0, y: 0 },
        width: typeof schema.width === 'number' ? schema.width : 1,
        height: typeof schema.height === 'number' ? schema.height : 1,
        rotation: typeof schema.rotation === 'number' ? schema.rotation : 0,
        readOnly: schema.readOnly === true,
        positionLocked: schema.positionLocked === true || schema.locked === true,
        hidden: schema.hidden === true,
        required: schema.required === true,
        ...schema,
      });
    });
  });
  return flattened;
};

const migrateLegacyTemplate = (value: Record<string, unknown>): PortableTemplateJson => ({
  format: PORTABLE_TEMPLATE_FORMAT,
  schemaVersion: PORTABLE_TEMPLATE_SCHEMA_VERSION,
  template: {
    id: typeof value.id === 'string' && value.id.trim() ? value.id : 'template-legacy',
    name: typeof value.name === 'string' && value.name.trim() ? value.name : 'Template migrado',
    description: typeof value.description === 'string' ? value.description : '',
    locale: typeof value.locale === 'string' ? value.locale : 'es',
    metadata: isObject(value.metadata) ? (value.metadata as Record<string, unknown>) : {},
  },
  documents: Array.isArray(value.documents) ? (value.documents as Array<Record<string, unknown>>) : [],
  users: Array.isArray(value.users) ? (value.users as Array<Record<string, unknown>>) : [],
  schemas: flattenLegacySchemas(value.schemas),
  assignments: Array.isArray(value.assignments) ? (value.assignments as Array<Record<string, unknown>>) : [],
  settings: isObject(value.settings) ? (value.settings as Record<string, unknown>) : {},
});

const collectDuplicateIds = (
  values: unknown[],
  path: string,
  issues: PortableTemplateIssue[],
) => {
  const seen = new Set<string>();
  values.forEach((entry, index) => {
    if (!isObject(entry) || typeof entry.id !== 'string' || !entry.id.trim()) return;
    const id = entry.id.trim();
    if (seen.has(id)) {
      issues.push({
        code: 'DUPLICATE_ID',
        severity: 'error',
        path: `${path}[${index}].id`,
        entityId: id,
        message: `Duplicate id "${id}".`,
      });
    }
    seen.add(id);
  });
};

export const validateSisadPdfmeTemplate = (value: unknown): PortableTemplateValidation => {
  const issues: PortableTemplateIssue[] = [];
  if (!isObject(value)) {
    return {
      valid: false,
      issues: [
        {
          code: 'TEMPLATE_NOT_OBJECT',
          severity: 'error',
          path: '$',
          message: 'Template payload must be an object.',
        },
      ],
    };
  }

  if (!isJsonSafe(value)) {
    issues.push({
      code: 'INVALID_JSON_VALUE',
      severity: 'error',
      path: '$',
      message: 'Template payload contains non JSON-safe values.',
    });
    return { valid: false, issues };
  }

  const template = value as Record<string, unknown>;
  if (template.format !== PORTABLE_TEMPLATE_FORMAT) {
    issues.push({
      code: 'MISSING_REQUIRED_FIELD',
      severity: 'error',
      path: '$.format',
      message: `format must be "${PORTABLE_TEMPLATE_FORMAT}".`,
    });
  }
  if (template.schemaVersion !== PORTABLE_TEMPLATE_SCHEMA_VERSION) {
    issues.push({
      code: 'UNSUPPORTED_SCHEMA_VERSION',
      severity: 'error',
      path: '$.schemaVersion',
      message: `Unsupported schemaVersion "${String(template.schemaVersion)}".`,
    });
  }

  const registries: Array<{ key: keyof PortableTemplateJson }> = [
    { key: 'documents' },
    { key: 'users' },
    { key: 'schemas' },
    { key: 'assignments' },
  ];
  registries.forEach(({ key }) => {
    const valueAtKey = template[key];
    if (!Array.isArray(valueAtKey)) {
      issues.push({
        code: 'MISSING_REQUIRED_FIELD',
        severity: 'error',
        path: `$.${key}`,
        message: `${key} must be an array.`,
      });
      return;
    }
    collectDuplicateIds(valueAtKey, `$.${key}`, issues);
  });

  const users = Array.isArray(template.users) ? template.users : [];
  const userIds = new Set(
    users
      .map((user) => (isObject(user) && typeof user.id === 'string' ? user.id.trim() : ''))
      .filter(Boolean),
  );
  const schemas = Array.isArray(template.schemas) ? template.schemas : [];
  const seenSchemaUids = new Set<string>();
  const seenSchemaNames = new Set<string>();
  const schemaUids = new Set(
    schemas
      .map((schema) => (isObject(schema) && typeof schema.schemaUid === 'string' ? schema.schemaUid.trim() : ''))
      .filter(Boolean),
  );
  const documents = Array.isArray(template.documents) ? template.documents : [];
  const documentIds = new Set(
    documents
      .map((document) => (isObject(document) && typeof document.id === 'string' ? document.id.trim() : ''))
      .filter(Boolean),
  );

  schemas.forEach((schema, index) => {
    if (!isObject(schema)) {
      issues.push({
        code: 'INVALID_ENTITY_SHAPE',
        severity: 'error',
        path: `$.schemas[${index}]`,
        message: 'Schema entry must be an object.',
      });
      return;
    }
    if (typeof schema.schemaUid !== 'string' || !schema.schemaUid.trim()) {
      issues.push({
        code: 'INVALID_ENTITY_SHAPE',
        severity: 'error',
        path: `$.schemas[${index}].schemaUid`,
        message: 'Schema requires schemaUid.',
      });
    } else {
      const schemaUid = schema.schemaUid.trim();
      if (seenSchemaUids.has(schemaUid)) {
        issues.push({
          code: 'DUPLICATE_ID',
          severity: 'error',
          path: `$.schemas[${index}].schemaUid`,
          entityId: schemaUid,
          message: `Duplicate schemaUid "${schemaUid}".`,
        });
      }
      seenSchemaUids.add(schemaUid);
    }
    if (typeof schema.type !== 'string' || !schema.type.trim()) {
      issues.push({
        code: 'INVALID_ENTITY_SHAPE',
        severity: 'error',
        path: `$.schemas[${index}].type`,
        message: 'Schema requires a non-empty type.',
      });
    } else if (!getSchemaPluginByType(schema.type)) {
      issues.push({
        code: 'UNSUPPORTED_SCHEMA_TYPE',
        severity: 'error',
        path: `$.schemas[${index}].type`,
        message: `Unsupported schema type "${schema.type}".`,
      });
    } else if (!getSchemaSerializationPolicy(schema.type).validate(schema)) {
      issues.push({
        code: 'INVALID_ENTITY_SHAPE',
        severity: 'error',
        path: `$.schemas[${index}]`,
        message: `Schema type "${schema.type}" failed its registry serialization policy.`,
      });
    }
    const schemaPath = `$.schemas[${index}]`;
    if (typeof schema.name !== 'string' || !schema.name.trim()) {
      issues.push({ code: 'MISSING_REQUIRED_FIELD', severity: 'error', path: `${schemaPath}.name`, message: 'Schema requires a non-empty name.' });
    }
    if (typeof schema.displayLabel !== 'string' || !schema.displayLabel.trim()) {
      issues.push({ code: 'MISSING_REQUIRED_FIELD', severity: 'error', path: `${schemaPath}.displayLabel`, message: 'Schema requires a non-empty displayLabel.' });
    }
    const documentScope = typeof schema.documentId === 'string' ? schema.documentId.trim() : '';
    const pageScope = typeof schema.pageIndex === 'number' ? schema.pageIndex : 0;
    if (typeof schema.name === 'string' && schema.name.trim()) {
      const nameKey = `${documentScope}::${pageScope}::${schema.name.trim()}`;
      if (seenSchemaNames.has(nameKey)) {
        issues.push({ code: 'DUPLICATE_SCHEMA_NAME', severity: 'error', path: `${schemaPath}.name`, message: `Duplicate schema name "${schema.name.trim()}" in the same document/page scope.` });
      }
      seenSchemaNames.add(nameKey);
    }
    const position = schema.position;
    if (!isObject(position) || typeof position.x !== 'number' || !Number.isFinite(position.x) || typeof position.y !== 'number' || !Number.isFinite(position.y) || position.x < 0 || position.y < 0) {
      issues.push({ code: 'INVALID_ENTITY_SHAPE', severity: 'error', path: `${schemaPath}.position`, message: 'Schema position requires finite non-negative x and y.' });
    }
    const width = schema.width ?? (isObject(schema.size) ? schema.size.width : undefined);
    const height = schema.height ?? (isObject(schema.size) ? schema.size.height : undefined);
    if (typeof width !== 'number' || !Number.isFinite(width) || width <= 0) {
      issues.push({ code: 'INVALID_ENTITY_SHAPE', severity: 'error', path: `${schemaPath}.width`, message: 'Schema width must be a positive finite number.' });
    }
    if (typeof height !== 'number' || !Number.isFinite(height) || height <= 0) {
      issues.push({ code: 'INVALID_ENTITY_SHAPE', severity: 'error', path: `${schemaPath}.height`, message: 'Schema height must be a positive finite number.' });
    }
    if (typeof schema.rotation !== 'number' || !Number.isFinite(schema.rotation)) {
      issues.push({ code: 'INVALID_ENTITY_SHAPE', severity: 'error', path: `${schemaPath}.rotation`, message: 'Schema rotation must be finite.' });
    }
    for (const flag of ['readOnly', 'positionLocked', 'hidden', 'required'] as const) {
      if (typeof schema[flag] !== 'boolean') {
        issues.push({ code: 'INVALID_ENTITY_SHAPE', severity: 'error', path: `${schemaPath}.${flag}`, message: `Schema ${flag} must be boolean.` });
      }
    }
    if (schema.pageIndex !== undefined && (typeof schema.pageIndex !== 'number' || !Number.isInteger(schema.pageIndex) || schema.pageIndex < 0)) {
      issues.push({
        code: 'INVALID_ENTITY_SHAPE',
        severity: 'error',
        path: `$.schemas[${index}].pageIndex`,
        message: 'Schema pageIndex must be a non-negative integer.',
      });
    }
    if (schema.documentId !== undefined && typeof schema.documentId === 'string' && schema.documentId.trim()) {
      if (!documentIds.has(schema.documentId.trim())) {
        issues.push({
          code: 'ORPHAN_REFERENCE',
          severity: 'error',
          path: `$.schemas[${index}].documentId`,
          entityId: schema.documentId.trim(),
          message: 'Schema references an unknown document.',
        });
      }
    }
  });

  const assignments = Array.isArray(template.assignments) ? template.assignments : [];
  assignments.forEach((assignment, index) => {
    if (!isObject(assignment)) {
      issues.push({
        code: 'INVALID_ENTITY_SHAPE',
        severity: 'error',
        path: `$.assignments[${index}]`,
        message: 'Assignment entry must be an object.',
      });
      return;
    }
    if (typeof assignment.schemaUid !== 'string' || !assignment.schemaUid.trim()) {
      issues.push({
        code: 'INVALID_ENTITY_SHAPE',
        severity: 'error',
        path: `$.assignments[${index}].schemaUid`,
        message: 'Assignment requires schemaUid.',
      });
    } else if (!schemaUids.has(assignment.schemaUid.trim())) {
      issues.push({
        code: 'ORPHAN_REFERENCE',
        severity: 'error',
        path: `$.assignments[${index}].schemaUid`,
        entityId: assignment.schemaUid.trim(),
        message: 'Assignment references an unknown schemaUid.',
      });
    }
    if (!Array.isArray(assignment.userIds)) {
      issues.push({
        code: 'INVALID_ENTITY_SHAPE',
        severity: 'error',
        path: `$.assignments[${index}].userIds`,
        message: 'Assignment requires userIds array.',
      });
      return;
    }
    assignment.userIds.forEach((userId, userIndex) => {
      if (typeof userId !== 'string' || !userIds.has(userId.trim())) {
        issues.push({
          code: 'ORPHAN_REFERENCE',
          severity: 'error',
          path: `$.assignments[${index}].userIds[${userIndex}]`,
          entityId: typeof userId === 'string' ? userId : undefined,
          message: 'Assignment references an unknown user.',
        });
      }
    });
  });

  return {
    valid: issues.every((issue) => issue.severity !== 'error'),
    issues,
  };
};

/** Normalizes a template in-place shape without introducing a wrapper format. */
export const normalizePortableTemplate = (value: unknown): PortableTemplateParseResult => {
  if (!isObject(value)) {
    const issueDetails: PortableTemplateIssue[] = [
      {
        code: 'TEMPLATE_NOT_OBJECT',
        severity: 'error',
        path: '$',
        message: 'Template payload must be an object.',
      },
    ];
    return {
      template: null,
      valid: false,
      migrated: false,
      outcome: 'INVALID',
      issueDetails,
      issues: issueDetails.map((issue) => issue.message),
    };
  }

  const looksCanonical = value.format === PORTABLE_TEMPLATE_FORMAT;
  const migrated = !looksCanonical;
  const candidate = looksCanonical ? (value as PortableTemplateJson) : migrateLegacyTemplate(value);
  const sorted = sortKeys(candidate) as PortableTemplateJson;
  const validation = validateSisadPdfmeTemplate(sorted);

  if (!validation.valid) {
    const hasUnsupported = validation.issues.some((issue) => issue.code === 'UNSUPPORTED_SCHEMA_VERSION');
    return {
      template: null,
      valid: false,
      migrated,
      outcome: hasUnsupported ? 'UNSUPPORTED' : 'INVALID',
      issueDetails: validation.issues,
      issues: validation.issues.map((issue) => issue.message),
    };
  }

  return {
    template: sorted,
    valid: true,
    migrated,
    outcome: migrated ? 'MIGRATED' : 'VALID',
    issueDetails: [],
    issues: [],
  };
};

const cloneRecords = (values: Array<Record<string, unknown>>): Array<Record<string, unknown>> =>
  values.map((value) => ({ ...value }));

export const hydratePortableTemplate = (template: PortableTemplateJson): HydratedPortableTemplate => ({
  template: { ...template.template },
  documents: cloneRecords(template.documents),
  users: cloneRecords(template.users),
  schemas: cloneRecords(template.schemas),
  assignments: cloneRecords(template.assignments),
  settings: template.settings ? { ...template.settings } : undefined,
});

export const serializePortableTemplate = (value: unknown): string => {
  const result = normalizePortableTemplate(value);
  if (!result.valid || !result.template) throw new TypeError(result.issues.join('; '));
  const serialized = {
    ...result.template,
    schemas: result.template.schemas.map((schema) =>
      getSchemaSerializationPolicy(String(schema.type)).serialize(schema as never),
    ),
  };
  return JSON.stringify(serialized, null, 2);
};

export const parsePortableTemplate = (payload: string): PortableTemplateParseResult => {
  try {
    return normalizePortableTemplate(JSON.parse(payload));
  } catch {
    const issueDetails: PortableTemplateIssue[] = [
      {
        code: 'JSON_PARSE_ERROR',
        severity: 'error',
        path: '$',
        message: 'payload must be valid JSON',
      },
    ];
    return {
      template: null,
      valid: false,
      migrated: false,
      outcome: 'INVALID',
      issueDetails,
      issues: issueDetails.map((issue) => issue.message),
    };
  }
};

export const ingestPortableTemplate = (payload: string | unknown): PortableTemplateIngestResult => {
  const parsed = typeof payload === 'string' ? parsePortableTemplate(payload) : normalizePortableTemplate(payload);
  const parseError = parsed.issueDetails.some((issue) => issue.code === 'JSON_PARSE_ERROR');

  const trace: PortableTemplatePipelineStep[] = [
    {
      stage: 'parse',
      status: typeof payload === 'string' ? (parseError ? 'failed' : 'ok') : 'skipped',
      message: typeof payload === 'string' ? undefined : 'Object input provided directly.',
    },
    {
      stage: 'identify',
      status: parseError ? 'skipped' : 'ok',
      message: parseError ? 'Cannot identify format due to parse failure.' : (parsed.migrated ? 'Legacy shape identified.' : 'Canonical shape identified.'),
    },
    {
      stage: 'migrate',
      status: parseError ? 'skipped' : (parsed.migrated ? 'ok' : 'skipped'),
      message: parseError ? 'Cannot migrate due to parse failure.' : (parsed.migrated ? 'Legacy payload migrated to canonical envelope.' : 'Migration not required.'),
    },
    {
      stage: 'validate',
      status: parseError ? 'skipped' : (parsed.valid ? 'ok' : 'failed'),
      message: parseError ? 'Cannot validate due to parse failure.' : (parsed.valid ? 'Validation passed.' : `Validation failed with outcome ${parsed.outcome}.`),
    },
  ];

  if (!parsed.valid || !parsed.template) {
    trace.push({
      stage: 'hydrate',
      status: 'skipped',
      message: 'Hydration skipped because the template is not valid.',
    });
    return {
      ...parsed,
      hydrated: null,
      trace,
    };
  }

  trace.push({
    stage: 'hydrate',
    status: 'ok',
    message: 'Hydration produced canonical entities.',
  });

  return {
    ...parsed,
    hydrated: hydratePortableTemplate(parsed.template),
    trace,
  };
};
