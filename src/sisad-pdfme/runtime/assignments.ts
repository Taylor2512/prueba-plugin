export type RuntimeSchemaAssignments = Record<
  string,
  Record<string, Record<string, string[]>>
>;

export type LegacySchemaAssignments = Record<
  string,
  Record<string, Record<string, string[]>>
>;

export type AssignmentMigrationOptions = {
  fallbackUserId?: string;
  documentId?: string;
};

const text = (value: unknown): string => String(value ?? '').trim();

const add = (
  result: RuntimeSchemaAssignments,
  userId: string,
  documentId: string,
  pageNumber: string,
  schemaUids: unknown,
) => {
  if (!userId || !documentId || !pageNumber || !Array.isArray(schemaUids)) return;
  const page = (result[userId] ??= {})[documentId] ??= {};
  page[pageNumber] = Array.from(new Set([
    ...(page[pageNumber] ?? []),
    ...schemaUids.map(text).filter(Boolean),
  ]));
};

/** Normalizes the canonical user × document × page index without shared state. */
export const normalizeRuntimeSchemaAssignments = (
  source: RuntimeSchemaAssignments | null | undefined,
): RuntimeSchemaAssignments => {
  const result: RuntimeSchemaAssignments = {};
  Object.entries(source ?? {}).forEach(([userId, documents]) => {
    Object.entries(documents ?? {}).forEach(([documentId, pages]) => {
      Object.entries(pages ?? {}).forEach(([pageNumber, schemaUids]) => {
        add(result, text(userId), text(documentId), text(pageNumber), schemaUids);
      });
    });
  });
  return result;
};

/**
 * Migrates the legacy recipient × document × page shape into the generic
 * runtime index. The legacy top-level key is treated as a user only when the
 * host explicitly opts into that interpretation; otherwise a fallback user is
 * required, preventing accidental identity inference.
 */
export const migrateLegacySchemaAssignments = (
  source: LegacySchemaAssignments | null | undefined,
  options: AssignmentMigrationOptions = {},
): RuntimeSchemaAssignments => {
  const fallbackUserId = text(options.fallbackUserId);
  const documentId = text(options.documentId);
  if (!fallbackUserId && !documentId) return {};
  const result: RuntimeSchemaAssignments = {};
  Object.entries(source ?? {}).forEach(([legacyKey, documents]) => {
    const userId = fallbackUserId || text(legacyKey);
    Object.entries(documents ?? {}).forEach(([legacyDocumentId, pages]) => {
      const targetDocumentId = documentId || text(legacyDocumentId);
      Object.entries(pages ?? {}).forEach(([pageNumber, schemaUids]) => {
        add(result, userId, targetDocumentId, text(pageNumber), schemaUids);
      });
    });
  });
  return result;
};

export const getAssignedSchemaUids = (
  assignments: RuntimeSchemaAssignments | null | undefined,
  userId: string,
  documentId: string,
  pageNumber: string | number,
): string[] => [...(assignments?.[text(userId)]?.[text(documentId)]?.[text(pageNumber)] ?? [])];
