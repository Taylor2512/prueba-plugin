export type RuntimeSchemaAssignments = Record<
  string,
  Record<string, Record<string, string[]>>
>;

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

export const getAssignedSchemaUids = (
  assignments: RuntimeSchemaAssignments | null | undefined,
  userId: string,
  documentId: string,
  pageNumber: string | number,
): string[] => [...(assignments?.[text(userId)]?.[text(documentId)]?.[text(pageNumber)] ?? [])];
