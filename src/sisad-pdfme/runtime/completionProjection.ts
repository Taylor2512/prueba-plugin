export type CompletionSchemaRecord = {
  schemaUid: string;
  documentId: string;
  required?: boolean;
  visible?: boolean;
  accessible?: boolean;
  assignedUserIds?: string[];
  interaction?: { touched: boolean; valid: boolean; completed: boolean };
};

export type UserCompletionProjection = {
  userId: string;
  requiredTotal: number;
  requiredCompleted: number;
  assignedTotal: number;
  assignedInteracted: number;
  validTotal: number;
  invalidTotal: number;
  pendingSchemaUids: string[];
  complete: boolean;
};

export type DocumentCompletionProjection = {
  documentId: string;
  users: UserCompletionProjection[];
  schemaTotal: number;
  schemaCompleted: number;
  invalidSchemas: string[];
  complete: boolean;
};

export type ExecutionCompletionProjection = {
  runtimeSessionId: string;
  users: UserCompletionProjection[];
  documents: DocumentCompletionProjection[];
  complete: boolean;
};

const relevant = (schema: CompletionSchemaRecord, userId: string): boolean => {
  if (schema.visible === false || schema.accessible === false) return false;
  return !schema.assignedUserIds?.length || schema.assignedUserIds.includes(userId);
};

export const projectUserCompletion = (
  userId: string,
  schemas: CompletionSchemaRecord[],
): UserCompletionProjection => {
  const relevantSchemas = schemas.filter((schema) => relevant(schema, userId));
  const required = relevantSchemas.filter((schema) => schema.required);
  const assigned = relevantSchemas.filter((schema) => schema.assignedUserIds?.includes(userId));
  const completed = (schema: CompletionSchemaRecord) => schema.interaction?.completed === true;
  const valid = (schema: CompletionSchemaRecord) => schema.interaction?.valid !== false;
  return {
    userId,
    requiredTotal: required.length,
    requiredCompleted: required.filter(completed).length,
    assignedTotal: assigned.length,
    assignedInteracted: assigned.filter((schema) => schema.interaction?.touched === true).length,
    validTotal: relevantSchemas.filter(valid).length,
    invalidTotal: relevantSchemas.filter((schema) => !valid(schema)).length,
    pendingSchemaUids: relevantSchemas.filter((schema) => schema.required && !completed(schema)).map((schema) => schema.schemaUid),
    complete: required.every(completed) && relevantSchemas.every(valid),
  };
};

export const projectDocumentCompletion = (
  documentId: string,
  userIds: string[],
  schemas: CompletionSchemaRecord[],
): DocumentCompletionProjection => {
  const documentSchemas = schemas.filter((schema) => schema.documentId === documentId && schema.visible !== false);
  const users = userIds.map((userId) => projectUserCompletion(userId, documentSchemas));
  const completedSchemas = new Set(users.flatMap((user) => user.pendingSchemaUids));
  const invalidSchemas = documentSchemas.filter((schema) => schema.interaction?.valid === false).map((schema) => schema.schemaUid);
  return {
    documentId,
    users,
    schemaTotal: documentSchemas.length,
    schemaCompleted: documentSchemas.filter((schema) => !schema.required || schema.interaction?.completed === true).length,
    invalidSchemas,
    complete: invalidSchemas.length === 0 && documentSchemas.every((schema) => !schema.required || schema.interaction?.completed === true) && completedSchemas.size === 0,
  };
};

export const projectExecutionCompletion = (
  runtimeSessionId: string,
  userIds: string[],
  documentIds: string[],
  schemas: CompletionSchemaRecord[],
): ExecutionCompletionProjection => {
  const documents = documentIds.map((documentId) => projectDocumentCompletion(documentId, userIds, schemas));
  const users = userIds.map((userId) => projectUserCompletion(userId, schemas));
  return { runtimeSessionId, users, documents, complete: documents.every((document) => document.complete) };
};
