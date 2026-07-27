import type { SchemaForUI } from '@sisad-pdfme/common';

type CollisionSchemaLike = Partial<SchemaForUI> & {
  id?: string;
  fileId?: string | null;
  fileTemplateId?: string | null;
  pageNumber?: number | null;
  ownerRecipientId?: string | null;
  ownerRecipientIds?: string[] | string | null;
};

export type CollisionScopeFallback = {
  fileId?: string | null;
  pageNumber?: number | null;
  ownerRecipientId?: string | null;
  ownerRecipientIds?: string[] | null;
};

const normalizeCollisionText = (value: unknown) =>
  typeof value === 'string' && value.trim().length > 0 ? value.trim() : '';

const normalizeNumber = (value: unknown) => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
};

const toRecipientIdList = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value
      .map((entry) => normalizeCollisionText(entry))
      .filter((entry, index, arr) => entry.length > 0 && arr.indexOf(entry) === index);
  }
  const single = normalizeCollisionText(value);
  return single ? [single] : [];
};

const resolveSchemaOwnerRecipientIds = (schema: CollisionSchemaLike, fallback?: CollisionScopeFallback): string[] => {
  const fromSchema = toRecipientIdList(schema.ownerRecipientIds);
  if (fromSchema.length > 0) return fromSchema;

  const fromPrimary = normalizeCollisionText(schema.ownerRecipientId);
  if (fromPrimary) return [fromPrimary];

  if (!fallback) return [];
  const fromFallback = toRecipientIdList(fallback.ownerRecipientIds);
  if (fromFallback.length > 0) return fromFallback;

  const fallbackPrimary = normalizeCollisionText(fallback.ownerRecipientId);
  return fallbackPrimary ? [fallbackPrimary] : [];
};

const resolveSchemaFileId = (schema: CollisionSchemaLike, fallback?: CollisionScopeFallback) => {
  const fileId = normalizeCollisionText(schema.fileId) || normalizeCollisionText(schema.fileTemplateId);
  if (fileId) return fileId;
  return normalizeCollisionText(fallback?.fileId);
};

const resolveSchemaPageNumber = (schema: CollisionSchemaLike, fallback?: CollisionScopeFallback) => {
  const pageNumber = normalizeNumber(schema.pageNumber);
  if (typeof pageNumber === 'number') return pageNumber;
  return normalizeNumber(fallback?.pageNumber);
};

const hasCommonRecipient = (left: string[], right: string[]) => left.some((entry) => right.includes(entry));

export const filterSchemasByCollisionScope = (
  schemas: CollisionSchemaLike[],
  reference: CollisionSchemaLike,
  fallback?: CollisionScopeFallback,
) => {
  const referenceOwnerIds = resolveSchemaOwnerRecipientIds(reference, fallback);
  const referenceFileId = resolveSchemaFileId(reference, fallback);
  const referencePageNumber = resolveSchemaPageNumber(reference, fallback);
  const referenceId = normalizeCollisionText(reference.id);

  return schemas.filter((schema) => {
    if (!schema) return false;
    if (referenceId && normalizeCollisionText(schema.id) === referenceId) return false;

    if (referenceFileId) {
      const schemaFileId = resolveSchemaFileId(schema);
      if (schemaFileId && schemaFileId !== referenceFileId) return false;
    }

    if (typeof referencePageNumber === 'number') {
      const schemaPageNumber = resolveSchemaPageNumber(schema);
      if (typeof schemaPageNumber === 'number' && schemaPageNumber !== referencePageNumber) return false;
    }

    const schemaOwnerIds = resolveSchemaOwnerRecipientIds(schema);
    if (referenceOwnerIds.length > 0) {
      return schemaOwnerIds.length > 0 && hasCommonRecipient(referenceOwnerIds, schemaOwnerIds);
    }

    return schemaOwnerIds.length === 0;
  });
};
