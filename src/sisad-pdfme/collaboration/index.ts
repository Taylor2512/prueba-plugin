import {
  filterSchemasByAuthorView,
  normalizeRecipientIds,
  resolveSchemaAuthorId,
  schemaMatchesAuthorView,
  validateCollaborativeSchemas,
  cloneDeep,
  type SchemaForUI,
  type Template,
} from '@sisad-pdfme/common';

type CollaborationState = Template | SchemaForUI[][];
type PresenceEntry = {
  userId?: string;
  name?: string | null;
  color?: string | null;
  activeDocumentId?: string | null;
  activePage?: number | null;
  activeSchemaIds?: string[];
  updatedAt?: number;
  [key: string]: unknown;
};

const normalizeText = (value: unknown) => String(value || '').trim();
const normalizeColor = (value: unknown) => normalizeText(value);

const getSchemaPages = (state: CollaborationState) =>
  Array.isArray(state) ? state : state?.schemas || [];

const updateSchemaPages = (state: CollaborationState, schemas: SchemaForUI[][]) =>
  Array.isArray(state) ? schemas : ({ ...state, schemas } as Template);

const mapSchemaState = (
  state: CollaborationState,
  schemaUid: string,
  // eslint-disable-next-line no-unused-vars
  updater: (_schema: SchemaForUI) => SchemaForUI,
) => {
  const normalizedSchemaUid = normalizeText(schemaUid);
  if (!normalizedSchemaUid) return cloneDeep(state);

  const pages = getSchemaPages(state).map((page = []) =>
    page.map((schema) => {
      const currentSchemaUid = normalizeText(schema.schemaUid || schema.id || schema.name);
      if (currentSchemaUid !== normalizedSchemaUid) return schema;
      return updater(cloneDeep(schema));
    }),
  );

  return updateSchemaPages(state, pages);
};

const findSchema = (state: CollaborationState, schemaUid: string) => {
  const normalizedSchemaUid = normalizeText(schemaUid);
  if (!normalizedSchemaUid) return null;
  const pages = getSchemaPages(state);
  for (let pageIndex = 0; pageIndex < pages.length; pageIndex += 1) {
    const page = pages[pageIndex] || [];
    for (let schemaIndex = 0; schemaIndex < page.length; schemaIndex += 1) {
      const schema = page[schemaIndex];
      const currentSchemaUid = normalizeText(schema.schemaUid || schema.id || schema.name);
      if (currentSchemaUid === normalizedSchemaUid) {
        return schema;
      }
    }
  }
  return null;
};

export const lockSchema = (
  schemaUid: string,
  state: CollaborationState,
  user: { id?: string | null; color?: string | null; reason?: string | null; sessionId?: string | null } = {},
) =>
  mapSchemaState(state, schemaUid, (schema) => ({
    ...schema,
    state: 'locked',
    userColor: normalizeColor(user.color) || schema.userColor,
    lastModifiedBy: normalizeText(user.id) || schema.lastModifiedBy,
    lock: {
      lockedBy: normalizeText(user.id) || undefined,
      lockedAt: Date.now(),
      reason: normalizeText(user.reason) || undefined,
      sessionId: normalizeText(user.sessionId) || undefined,
    },
  }));

export const unlockSchema = (
  schemaUid: string,
  state: CollaborationState,
  user: { id?: string | null; color?: string | null } = {},
) =>
  mapSchemaState(state, schemaUid, (schema) => ({
    ...schema,
    state: schema.state === 'locked' ? 'draft' : schema.state,
    userColor: normalizeColor(user.color) || schema.userColor,
    lastModifiedBy: normalizeText(user.id) || schema.lastModifiedBy,
    lock: undefined,
  }));

export const isSchemaLocked = (schemaUid: string, state: CollaborationState) => {
  const schema = findSchema(state, schemaUid);
  return Boolean(schema?.lock?.lockedBy);
};

export const getSchemaOwner = (schema: SchemaForUI) => ({
  ownerRecipientId: normalizeText(schema?.ownerRecipientId) || null,
  ownerRecipientIds: normalizeRecipientIds(schema?.ownerRecipientIds || schema?.ownerRecipientId),
  ownerMode: schema?.ownerMode || null,
  createdBy: normalizeText(schema?.createdBy) || null,
  lastModifiedBy: normalizeText(schema?.lastModifiedBy) || null,
});

export const assignSchemaOwner = (
  schemaUid: string,
  recipientId: string | null,
  state: CollaborationState,
  userId?: string | null,
) => {
  const normalizedRecipientId = normalizeText(recipientId);
  return mapSchemaState(state, schemaUid, (schema) => ({
    ...schema,
    ownerMode: normalizedRecipientId ? 'single' : 'shared',
    ownerRecipientId: normalizedRecipientId || undefined,
    ownerRecipientIds: normalizedRecipientId ? [normalizedRecipientId] : [],
    lastModifiedBy: normalizeText(userId) || schema.lastModifiedBy,
    updatedAt: Date.now(),
  }));
};

export const setSchemaAuthorColor = (
  schemaUid: string,
  color: string | null,
  state: CollaborationState,
) =>
  mapSchemaState(state, schemaUid, (schema) => ({
    ...schema,
    userColor: normalizeColor(color) || schema.userColor,
    updatedAt: Date.now(),
  }));

export const filterSchemasByCollaborationScope = (
  schemas: SchemaForUI[] = [],
  scope: {
    activeUserId?: string | null;
    activeRecipientId?: string | null;
    isGlobalView?: boolean;
  } = {},
) => {
  const filteredByAuthor = filterSchemasByAuthorView(schemas, {
    activeUserId: scope.activeUserId,
    isGlobalView: scope.isGlobalView,
  });

  const activeRecipientId = normalizeText(scope.activeRecipientId);
  if (!activeRecipientId || scope.isGlobalView) return filteredByAuthor;

  return filteredByAuthor.filter((schema) =>
    normalizeRecipientIds(schema.ownerRecipientIds || schema.ownerRecipientId).includes(activeRecipientId),
  );
};

export const buildCollaborationPresenceState = (presenceEntries: PresenceEntry[] = []) => {
  const latestByUser = new Map<string, PresenceEntry>();
  (presenceEntries || []).forEach((entry) => {
    const userId = normalizeText(entry?.userId);
    if (!userId) return;
    const current = latestByUser.get(userId);
    const nextUpdatedAt = Number(entry.updatedAt) || Date.now();
    const currentUpdatedAt = Number(current?.updatedAt) || 0;
    if (!current || nextUpdatedAt >= currentUpdatedAt) {
      latestByUser.set(userId, {
        ...entry,
        userId,
        updatedAt: nextUpdatedAt,
      });
    }
  });
  return Array.from(latestByUser.values()).sort((a, b) => (Number(b.updatedAt) || 0) - (Number(a.updatedAt) || 0));
};

export {
  normalizeRecipientIds,
  resolveSchemaAuthorId,
  schemaMatchesAuthorView,
  filterSchemasByAuthorView,
  validateCollaborativeSchemas,
};
