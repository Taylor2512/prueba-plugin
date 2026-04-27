import {
  buildSchemaAssignments,
  buildUserSchemaAssignments,
  cloneDeep,
  type Schema,
  type SchemaAssignments,
  type Template,
} from '@sisad-pdfme/common';

type RecipientLike = { id?: string | null };
type DocumentLike = { id?: string | null; fileId?: string | null; fileTemplateId?: string | null };

const normalizeText = (value: unknown) => String(value || '').trim();
const normalizePageNumber = (value: unknown) =>
  Number.isFinite(value) && Number(value) > 0 ? String(Math.trunc(Number(value))) : '1';

const ensurePageBucket = (assignments: SchemaAssignments, recipientId: string, fileId: string, pageKey: string) => {
  if (!assignments[recipientId]) assignments[recipientId] = {};
  if (!assignments[recipientId][fileId]) assignments[recipientId][fileId] = {};
  if (!assignments[recipientId][fileId][pageKey]) assignments[recipientId][fileId][pageKey] = [];
};

const dedupeAssignments = (assignments: SchemaAssignments) => {
  Object.values(assignments).forEach((fileMap) => {
    Object.values(fileMap).forEach((pageMap) => {
      Object.keys(pageMap).forEach((pageKey) => {
        pageMap[pageKey] = Array.from(new Set(pageMap[pageKey] || []));
      });
    });
  });
  return assignments;
};

const collectSchemaUids = (schemas: Schema[][] = []) => {
  const ids = new Set<string>();
  (schemas || []).forEach((page = []) => {
    (page || []).forEach((schema) => {
      const schemaUid = normalizeText(schema.schemaUid || schema.name);
      if (schemaUid) ids.add(schemaUid);
    });
  });
  return ids;
};

export const buildRecipientAssignments = (schemas: Schema[][] = []) =>
  buildSchemaAssignments(Array.isArray(schemas) ? schemas : []);

export const buildFileAssignments = (assignments: SchemaAssignments = {}, fileId?: string | null) => {
  const normalizedFileId = normalizeText(fileId);
  if (!normalizedFileId) return {};
  return Object.fromEntries(
    Object.entries(assignments || {}).map(([recipientId, files]) => [
      recipientId,
      files?.[normalizedFileId] ? { [normalizedFileId]: cloneDeep(files[normalizedFileId]) } : {},
    ]),
  );
};

export const buildPageAssignments = (
  assignments: SchemaAssignments = {},
  fileId?: string | null,
  pageNumber?: number | string | null,
) => {
  const normalizedFileId = normalizeText(fileId);
  const pageKey = normalizePageNumber(pageNumber);
  if (!normalizedFileId) return {};

  return Object.fromEntries(
    Object.entries(assignments || {}).map(([recipientId, files]) => [
      recipientId,
      files?.[normalizedFileId]?.[pageKey] ? cloneDeep(files[normalizedFileId][pageKey]) : [],
    ]),
  );
};

export const reconcileAssignments = ({
  template,
  schemas,
  assignments = {},
  recipients = [],
  documents = [],
}: {
  template?: Template | null;
  schemas?: Schema[][];
  assignments?: SchemaAssignments;
  recipients?: RecipientLike[];
  documents?: DocumentLike[];
} = {}) => {
  const sourceSchemas = Array.isArray(schemas) ? schemas : template?.schemas || [];
  const generatedAssignments = buildRecipientAssignments(sourceSchemas);
  const nextAssignments = cloneDeep(generatedAssignments);

  const recipientIds = new Set(
    (recipients || [])
      .map((recipient) => normalizeText(recipient?.id))
      .filter(Boolean),
  );
  const fileIds = new Set(
    (documents || [])
      .map((document) => normalizeText(document?.id || document?.fileId || document?.fileTemplateId))
      .filter(Boolean),
  );

  if (recipientIds.size > 0) {
    Object.keys(nextAssignments).forEach((recipientId) => {
      if (!recipientIds.has(recipientId)) delete nextAssignments[recipientId];
    });
  }

  if (fileIds.size > 0) {
    Object.values(nextAssignments).forEach((files) => {
      Object.keys(files || {}).forEach((fileId) => {
        if (!fileIds.has(fileId)) delete files[fileId];
      });
    });
  }

  const orphanAssignments = [] as Array<{
    recipientId: string;
    fileId: string;
    pageNumber: string;
    schemaUid: string;
  }>;
  const validSchemaUids = collectSchemaUids(sourceSchemas);

  Object.entries(assignments || {}).forEach(([recipientId, files]) => {
    Object.entries(files || {}).forEach(([fileId, pages]) => {
      Object.entries(pages || {}).forEach(([pageNumber, schemaUids]) => {
        (schemaUids || []).forEach((schemaUid) => {
          if (validSchemaUids.has(schemaUid)) return;
          orphanAssignments.push({ recipientId, fileId, pageNumber, schemaUid });
        });
      });
    });
  });

  return {
    assignments: dedupeAssignments(nextAssignments),
    generatedAssignments,
    orphanAssignments,
  };
};

export const removeSchemaFromAssignments = (
  schemaUid: string,
  assignments: SchemaAssignments = {},
) => {
  const normalizedSchemaUid = normalizeText(schemaUid);
  if (!normalizedSchemaUid) return cloneDeep(assignments || {});

  const nextAssignments = cloneDeep(assignments || {});
  Object.values(nextAssignments).forEach((files) => {
    Object.values(files).forEach((pages) => {
      Object.keys(pages).forEach((pageKey) => {
        pages[pageKey] = (pages[pageKey] || []).filter((value) => value !== normalizedSchemaUid);
      });
    });
  });
  return dedupeAssignments(nextAssignments);
};

export const moveSchemaAssignment = (
  schemaUid: string,
  assignments: SchemaAssignments = {},
  target: {
    fromRecipientId?: string | null;
    fromFileId?: string | null;
    fromPageNumber?: number | string | null;
    toRecipientId: string;
    toFileId: string;
    toPageNumber: number | string;
  },
) => {
  const nextAssignments = removeSchemaFromAssignments(schemaUid, assignments);
  const recipientId = normalizeText(target?.toRecipientId);
  const fileId = normalizeText(target?.toFileId);
  const pageKey = normalizePageNumber(target?.toPageNumber);
  const normalizedSchemaUid = normalizeText(schemaUid);

  if (!recipientId || !fileId || !pageKey || !normalizedSchemaUid) return nextAssignments;
  ensurePageBucket(nextAssignments, recipientId, fileId, pageKey);
  nextAssignments[recipientId][fileId][pageKey].push(normalizedSchemaUid);
  return dedupeAssignments(nextAssignments);
};

export const getAssignmentsForRecipient = (
  assignments: SchemaAssignments = {},
  recipientId?: string | null,
) => {
  const normalizedRecipientId = normalizeText(recipientId);
  if (!normalizedRecipientId) return {};
  return cloneDeep(assignments?.[normalizedRecipientId] || {});
};

export const getAssignmentsForFile = (
  assignments: SchemaAssignments = {},
  fileId?: string | null,
) => {
  const normalizedFileId = normalizeText(fileId);
  if (!normalizedFileId) return {};
  return Object.fromEntries(
    Object.entries(assignments || {})
      .filter(([, files]) => Boolean(files?.[normalizedFileId]))
      .map(([recipientId, files]) => [recipientId, cloneDeep(files[normalizedFileId])]),
  );
};

export const getAssignmentsForPage = (
  assignments: SchemaAssignments = {},
  fileId?: string | null,
  pageNumber?: number | string | null,
) => {
  const normalizedFileId = normalizeText(fileId);
  const pageKey = normalizePageNumber(pageNumber);
  if (!normalizedFileId) return {};
  return Object.fromEntries(
    Object.entries(assignments || {}).map(([recipientId, files]) => [
      recipientId,
      cloneDeep(files?.[normalizedFileId]?.[pageKey] || []),
    ]),
  );
};

export const validateAssignmentsConsistency = ({
  assignments = {},
  schemas = [],
}: {
  assignments?: SchemaAssignments;
  schemas?: Schema[][];
} = {}) => {
  const errors: string[] = [];
  const warnings: string[] = [];
  const validSchemaUids = collectSchemaUids(schemas);

  Object.entries(assignments || {}).forEach(([recipientId, files]) => {
    if (!recipientId) errors.push('Assignment has an empty recipient id.');
    Object.entries(files || {}).forEach(([fileId, pages]) => {
      if (!fileId) errors.push(`Recipient ${recipientId} has assignments without file id.`);
      Object.entries(pages || {}).forEach(([pageKey, schemaUids]) => {
        if (!Array.isArray(schemaUids)) {
          errors.push(`Recipient ${recipientId} file ${fileId} page ${pageKey} is not an array.`);
          return;
        }
        const duplicated = schemaUids.filter((schemaUid, index) => schemaUids.indexOf(schemaUid) !== index);
        if (duplicated.length > 0) {
          warnings.push(
            `Recipient ${recipientId} file ${fileId} page ${pageKey} has duplicated schema ids: ${Array.from(new Set(duplicated)).join(', ')}`,
          );
        }
        schemaUids.forEach((schemaUid) => {
          if (validSchemaUids.size > 0 && !validSchemaUids.has(schemaUid)) {
            errors.push(`Schema '${schemaUid}' in recipient ${recipientId} does not exist in template.`);
          }
        });
      });
    });
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

export { buildSchemaAssignments, buildUserSchemaAssignments };
