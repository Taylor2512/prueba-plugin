/**
 * Canonical portable workspace contract.
 *
 * This is deliberately a data contract: it has no React, DOM or host
 * business semantics. Runtime collaboration state belongs in `runtime`, while
 * the template/configuration/users/documents/assignments describe the durable
 * workspace definition.
 */

export type SisadPdfmeJsonPrimitive = string | number | boolean | null;
export type SisadPdfmeJsonValue =
  | SisadPdfmeJsonPrimitive
  | SisadPdfmeJsonValue[]
  | { [key: string]: SisadPdfmeJsonValue };

export type SisadPdfmeConfigurationRef = {
  id: string;
  version?: string;
};

export type SisadPdfmeUser = {
  id: string;
  displayName: string;
  email?: string;
  initials?: string;
  color?: string;
  avatarUrl?: string;
  metadata?: Record<string, SisadPdfmeJsonValue>;
};

export type SisadPdfmeDocument = {
  id: string;
  name: string;
  order: number;
  pageCount?: number;
  sourceRef?: string;
  metadata?: Record<string, SisadPdfmeJsonValue>;
};

export type SisadPdfmeAssignment = {
  id: string;
  schemaUid: string;
  userIds: string[];
  mode: 'single' | 'shared';
  valueScope: 'shared' | 'per-user';
};

/** @deprecated Keep compatibility with existing external integrations. */
export type SisadPdfmeWorkspaceUser = SisadPdfmeUser;
/** @deprecated Keep compatibility with existing external integrations. */
export type SisadPdfmeWorkspaceDocument = SisadPdfmeDocument & { label?: string };
/** @deprecated Keep compatibility with existing external integrations. */
export type SisadPdfmeWorkspaceAssignment = SisadPdfmeAssignment;

export type SisadPdfmeRuntimeSnapshot = SisadPdfmeJsonValue;

export type SisadPdfmeWorkspace = {
  template: SisadPdfmeJsonValue;
  configuration?: SisadPdfmeConfigurationRef;
  users: SisadPdfmeUser[];
  documents: SisadPdfmeWorkspaceDocument[];
  assignments: SisadPdfmeAssignment[];
  /** Runtime snapshot is optional and never required to reconstruct template. */
  runtime?: SisadPdfmeRuntimeSnapshot;
};

export type SisadPdfmeWorkspaceIssueCode =
  | 'WORKSPACE_NOT_OBJECT'
  | 'WORKSPACE_MISSING_ARRAY'
  | 'WORKSPACE_INVALID_JSON'
  | 'WORKSPACE_DUPLICATE_ID'
  | 'WORKSPACE_DUPLICATE_ASSIGNMENT'
  | 'WORKSPACE_INVALID_ASSIGNMENT'
  | 'WORKSPACE_INVALID_REFERENCE';

export type SisadPdfmeWorkspaceIssue = {
  code: SisadPdfmeWorkspaceIssueCode;
  path: string;
  message: string;
};

export type SisadPdfmeWorkspaceValidation = {
  valid: boolean;
  issues: SisadPdfmeWorkspaceIssue[];
};

export type SisadPdfmeUserIssueCode =
  | 'USER_EMPTY_ID'
  | 'USER_DUPLICATE_ID'
  | 'USER_DUPLICATE_EMAIL'
  | 'USER_INVALID_ACTIVE_USER'
  | 'USER_METADATA_NOT_JSON_SAFE';

export type SisadPdfmeUserIssue = {
  code: SisadPdfmeUserIssueCode;
  severity: 'error' | 'warning';
  path: string;
  message: string;
};

export type SisadPdfmeUserValidation = {
  valid: boolean;
  issues: SisadPdfmeUserIssue[];
};

/** Maps host participants to the canonical identity, dropping credentials/runtime fields. */
export const normalizeSisadPdfmeWorkspaceUsers = (inputs: unknown[]): SisadPdfmeUser[] =>
  inputs.flatMap((input) => {
    if (!input || typeof input !== 'object') return [];
    const source = input as Record<string, unknown>;
    const id = typeof source.id === 'string' ? source.id.trim() : '';
    const displayName = typeof source.displayName === 'string'
      ? source.displayName.trim()
      : typeof source.name === 'string' ? source.name.trim() : '';
    if (!id) return [];
    const user: SisadPdfmeUser = { id, displayName: displayName || `User ${id}` };
    for (const key of ['email', 'initials', 'color', 'avatarUrl'] as const) {
      if (typeof source[key] === 'string' && source[key]) user[key] = source[key] as string;
    }
    if (source.metadata && typeof source.metadata === 'object' && !Array.isArray(source.metadata) && isJsonValue(source.metadata)) {
      user.metadata = source.metadata as Record<string, SisadPdfmeJsonValue>;
    }
    return [user];
  });

/** Alias aligned with TRC naming. */
export const normalizeUsers = normalizeSisadPdfmeWorkspaceUsers;

export const indexSisadPdfmeUsers = (users: SisadPdfmeUser[]): Record<string, SisadPdfmeUser> =>
  users.reduce<Record<string, SisadPdfmeUser>>((acc, user) => {
    if (!user.id) return acc;
    acc[user.id] = user;
    return acc;
  }, {});

/** Alias aligned with TRC naming. */
export const indexUsers = indexSisadPdfmeUsers;

export const validateSisadPdfmeUsers = (
  users: SisadPdfmeUser[],
  options?: { activeUserId?: string | null },
): SisadPdfmeUserValidation => {
  const issues: SisadPdfmeUserIssue[] = [];
  const seenIds = new Set<string>();
  const seenEmails = new Set<string>();

  users.forEach((user, index) => {
    const id = typeof user.id === 'string' ? user.id.trim() : '';
    if (!id) {
      issues.push({
        code: 'USER_EMPTY_ID',
        severity: 'error',
        path: `$.users[${index}].id`,
        message: 'User id must be a non-empty string.',
      });
      return;
    }
    if (seenIds.has(id)) {
      issues.push({
        code: 'USER_DUPLICATE_ID',
        severity: 'error',
        path: `$.users[${index}].id`,
        message: `Duplicate user id "${id}".`,
      });
    }
    seenIds.add(id);

    if (typeof user.email === 'string' && user.email.trim()) {
      const normalizedEmail = user.email.trim().toLowerCase();
      if (seenEmails.has(normalizedEmail)) {
        issues.push({
          code: 'USER_DUPLICATE_EMAIL',
          severity: 'warning',
          path: `$.users[${index}].email`,
          message: `Duplicate user email "${normalizedEmail}".`,
        });
      }
      seenEmails.add(normalizedEmail);
    }

    if (user.metadata !== undefined && !isJsonValue(user.metadata)) {
      issues.push({
        code: 'USER_METADATA_NOT_JSON_SAFE',
        severity: 'error',
        path: `$.users[${index}].metadata`,
        message: 'User metadata must be JSON-safe.',
      });
    }
  });

  if (options?.activeUserId) {
    const activeUserId = options.activeUserId.trim();
    if (activeUserId && !seenIds.has(activeUserId)) {
      issues.push({
        code: 'USER_INVALID_ACTIVE_USER',
        severity: 'error',
        path: '$.runtime.activeUserId',
        message: `activeUserId "${activeUserId}" does not exist in users registry.`,
      });
    }
  }

  return {
    valid: issues.every((issue) => issue.severity !== 'error'),
    issues,
  };
};

/** Alias aligned with TRC naming. */
export const validateUsers = validateSisadPdfmeUsers;

const isJsonValue = (value: unknown, seen = new Set<object>()): value is SisadPdfmeJsonValue => {
  if (value === null || typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return typeof value !== 'number' || Number.isFinite(value);
  }
  if (typeof value !== 'object' || seen.has(value)) return false;
  seen.add(value);
  if (Array.isArray(value)) return value.every((item) => isJsonValue(item, seen));
  return Object.values(value).every((item) => isJsonValue(item, seen));
};

const duplicateIds = (values: Array<{ id: string }>, path: string, issues: SisadPdfmeWorkspaceIssue[]) => {
  const seen = new Set<string>();
  values.forEach((value, index) => {
    if (seen.has(value.id)) {
      issues.push({ code: 'WORKSPACE_DUPLICATE_ID', path: `${path}[${index}].id`, message: `Duplicate id "${value.id}".` });
    }
    seen.add(value.id);
  });
};

const collectWorkspaceSchemaUids = (template: unknown): Set<string> => {
  const schemaUids = new Set<string>();
  if (template === null || typeof template !== 'object' || Array.isArray(template)) return schemaUids;

  const visitSchema = (schema: unknown) => {
    if (!schema || typeof schema !== 'object' || Array.isArray(schema)) return;
    const record = schema as Record<string, unknown>;
    const uid = typeof record.schemaUid === 'string' && record.schemaUid.trim()
      ? record.schemaUid.trim()
      : typeof record.id === 'string' && record.id.trim()
        ? record.id.trim()
        : typeof record.name === 'string' && record.name.trim()
          ? record.name.trim()
          : '';
    if (uid) schemaUids.add(uid);
  };

  const templateRecord = template as Record<string, unknown>;
  const schemas = templateRecord.schemas;
  if (!Array.isArray(schemas)) return schemaUids;

  schemas.forEach((entry) => {
    if (Array.isArray(entry)) {
      entry.forEach(visitSchema);
      return;
    }
    visitSchema(entry);
  });

  return schemaUids;
};

/** Validates durable shape and rejects host/runtime objects before serialization. */
export const validateSisadPdfmeWorkspace = (value: unknown): SisadPdfmeWorkspaceValidation => {
  const issues: SisadPdfmeWorkspaceIssue[] = [];
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return { valid: false, issues: [{ code: 'WORKSPACE_NOT_OBJECT', path: '$', message: 'Workspace must be an object.' }] };
  }
  const workspace = value as Record<string, unknown>;
  for (const key of ['users', 'documents', 'assignments']) {
    if (!Array.isArray(workspace[key])) {
      issues.push({ code: 'WORKSPACE_MISSING_ARRAY', path: `$.${key}`, message: `${key} must be an array.` });
    }
  }
  if (!isJsonValue(workspace.template)) {
    issues.push({ code: 'WORKSPACE_INVALID_JSON', path: '$.template', message: 'template must be JSON-safe.' });
  }
  if (workspace.runtime !== undefined && !isJsonValue(workspace.runtime)) {
    issues.push({ code: 'WORKSPACE_INVALID_JSON', path: '$.runtime', message: 'runtime must be JSON-safe.' });
  }
  const users = Array.isArray(workspace.users) ? workspace.users : [];
  const documents = Array.isArray(workspace.documents) ? workspace.documents : [];
  const assignments = Array.isArray(workspace.assignments) ? workspace.assignments : [];
  const schemaUids = collectWorkspaceSchemaUids(workspace.template);
  const hasSchemaRegistry = schemaUids.size > 0;
  const userIdRegistry = new Set(
    normalizeSisadPdfmeWorkspaceUsers(users).map((user) => user.id),
  );
  const withId = (item: unknown): item is { id: string } => !!item && typeof item === 'object' && typeof (item as Record<string, unknown>).id === 'string';
  duplicateIds(users.filter(withId), '$.users', issues);
  duplicateIds(documents.filter(withId), '$.documents', issues);
  duplicateIds(assignments.filter(withId), '$.assignments', issues);
  const normalizedUsers = normalizeSisadPdfmeWorkspaceUsers(users);
  const userValidation = validateSisadPdfmeUsers(normalizedUsers);
  userValidation.issues
    .filter((issue) => issue.severity === 'error')
    .forEach((issue) => {
      issues.push({
        code: 'WORKSPACE_INVALID_REFERENCE',
        path: issue.path,
        message: issue.message,
      });
    });

  const seenAssignmentSchemaUids = new Set<string>();
  if (assignments.length > 0 && !hasSchemaRegistry) {
    issues.push({
      code: 'WORKSPACE_INVALID_REFERENCE',
      path: '$.template.schemas',
      message: 'Assignment validation requires a schema registry in template.schemas.',
    });
  }

  assignments.forEach((assignment: unknown, index) => {
    const assignmentRecord = assignment && typeof assignment === 'object' ? assignment as Record<string, unknown> : null;
    if (!assignmentRecord) {
      issues.push({
        code: 'WORKSPACE_INVALID_ASSIGNMENT',
        path: `$.assignments[${index}]`,
        message: 'Assignment must be an object.',
      });
      return;
    }

    const schemaUid = typeof assignmentRecord.schemaUid === 'string' ? assignmentRecord.schemaUid.trim() : '';
    const userIds = Array.isArray(assignmentRecord.userIds)
      ? assignmentRecord.userIds.filter((userId): userId is string => typeof userId === 'string' && userId.trim().length > 0)
      : [];
    const mode = assignmentRecord.mode;
    const valueScope = assignmentRecord.valueScope;

    if (!schemaUid) {
      issues.push({
        code: 'WORKSPACE_INVALID_ASSIGNMENT',
        path: `$.assignments[${index}].schemaUid`,
        message: 'Assignment requires a schemaUid.',
      });
    } else {
      if (hasSchemaRegistry && !schemaUids.has(schemaUid)) {
        issues.push({
          code: 'WORKSPACE_INVALID_REFERENCE',
          path: `$.assignments[${index}].schemaUid`,
          message: `Assignment references an unknown schema "${schemaUid}".`,
        });
      }
      if (seenAssignmentSchemaUids.has(schemaUid)) {
        issues.push({
          code: 'WORKSPACE_DUPLICATE_ASSIGNMENT',
          path: `$.assignments[${index}].schemaUid`,
          message: `Duplicate assignment for schemaUid "${schemaUid}".`,
        });
      }
      seenAssignmentSchemaUids.add(schemaUid);
    }

    if (userIds.length === 0) {
      issues.push({
        code: 'WORKSPACE_INVALID_ASSIGNMENT',
        path: `$.assignments[${index}].userIds`,
        message: 'Assignment requires at least one userId.',
      });
    }

    if (mode !== 'single' && mode !== 'shared') {
      issues.push({
        code: 'WORKSPACE_INVALID_ASSIGNMENT',
        path: `$.assignments[${index}].mode`,
        message: 'Assignment mode must be "single" or "shared".',
      });
    }

    if (valueScope !== 'shared' && valueScope !== 'per-user') {
      issues.push({
        code: 'WORKSPACE_INVALID_ASSIGNMENT',
        path: `$.assignments[${index}].valueScope`,
        message: 'Assignment valueScope must be "shared" or "per-user".',
      });
    }

    const duplicatedUserIds = userIds.filter((userId, userIndex) => userIds.indexOf(userId) !== userIndex);
    duplicatedUserIds.forEach((userId) => {
      const firstIndex = userIds.indexOf(userId);
      const duplicateIndex = userIds.findIndex((value, index) => value === userId && index > firstIndex);
      issues.push({
        code: 'WORKSPACE_DUPLICATE_ID',
        path: `$.assignments[${index}].userIds[${duplicateIndex >= 0 ? duplicateIndex : 0}]`,
        message: `Duplicate userId "${userId}" in assignment.`,
      });
    });

    userIds.forEach((userId, userIndex) => {
      if (!userIdRegistry.has(userId)) {
        issues.push({
          code: 'WORKSPACE_INVALID_REFERENCE',
          path: `$.assignments[${index}].userIds[${userIndex}]`,
          message: 'Assignment references an unknown user.',
        });
      }
    });
  });

  documents.forEach((document: unknown, index) => {
    const record = document && typeof document === 'object' ? document as Record<string, unknown> : null;
    if (!record) {
      issues.push({
        code: 'WORKSPACE_INVALID_REFERENCE',
        path: `$.documents[${index}]`,
        message: 'Document must be an object.',
      });
      return;
    }
    const name = typeof record.name === 'string' ? record.name.trim() : '';
    const label = typeof record.label === 'string' ? record.label.trim() : '';
    if (!name && !label) {
      issues.push({
        code: 'WORKSPACE_INVALID_REFERENCE',
        path: `$.documents[${index}].name`,
        message: 'Document requires a stable display name.',
      });
    }
    if (record.order !== undefined && (typeof record.order !== 'number' || !Number.isFinite(record.order))) {
      issues.push({
        code: 'WORKSPACE_INVALID_REFERENCE',
        path: `$.documents[${index}].order`,
        message: 'Document order must be a finite number when provided.',
      });
    }
  });

  const seenDocumentOrders = new Set<number>();
  documents.forEach((document: unknown, index) => {
    const record = document && typeof document === 'object' ? document as Record<string, unknown> : null;
    if (!record || typeof record.order !== 'number' || !Number.isFinite(record.order)) return;
    if (seenDocumentOrders.has(record.order)) {
      issues.push({
        code: 'WORKSPACE_DUPLICATE_ID',
        path: `$.documents[${index}].order`,
        message: `Duplicate document order "${record.order}".`,
      });
    }
    seenDocumentOrders.add(record.order);
  });

  if (workspace.runtime && typeof workspace.runtime === 'object' && !Array.isArray(workspace.runtime)) {
    const runtime = workspace.runtime as Record<string, unknown>;
    const activeDocumentId = runtime.activeDocumentId;
    if (typeof activeDocumentId === 'string' && activeDocumentId.trim()) {
      const documentIds = new Set(
        documents
          .map((item) => (item && typeof item === 'object' ? (item as Record<string, unknown>).id : undefined))
          .filter((id): id is string => typeof id === 'string' && id.trim().length > 0),
      );
      if (!documentIds.has(activeDocumentId.trim())) {
        issues.push({
          code: 'WORKSPACE_INVALID_REFERENCE',
          path: '$.runtime.activeDocumentId',
          message: `activeDocumentId "${activeDocumentId}" references an unknown document.`,
        });
      }
    }
  }
  return { valid: issues.length === 0, issues };
};
