import type { SchemaForUI, SchemaPageArray } from './types.js';

export const normalizeRecipientIds = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return Array.from(
      new Set(
        value
          .map((entry) => String(entry || '').trim())
          .filter(Boolean),
      ),
    );
  }

  if (typeof value === 'string') {
    return Array.from(
      new Set(
        value
          .split(',')
          .map((entry) => entry.trim())
          .filter(Boolean),
      ),
    );
  }

  return [];
};

export type SchemaAssignments = Record<string, Record<string, Record<string, string[]>>>;
export const SHARED_ASSIGNMENTS_BUCKET = '__shared__';
export type CollaborationViewFilter = {
  activeUserId?: string | null;
  isGlobalView?: boolean;
};
export type CommentAuthorIdentity = {
  authorId?: string | null;
  authorName?: string | null;
  authorColor?: string | null;
  timestamp?: number;
};

const normalizeText = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

const createEntityId = (prefix: string) =>
  typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? `${prefix}-${crypto.randomUUID()}`
    : `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const resolveSchemaAuthorId = (schema: SchemaForUI) =>
  normalizeText((schema as SchemaForUI & { createdBy?: string; lastModifiedBy?: string }).createdBy) ||
  normalizeText((schema as SchemaForUI & { createdBy?: string; lastModifiedBy?: string }).lastModifiedBy) ||
  '';

export const schemaMatchesAuthorView = (schema: SchemaForUI, filter: CollaborationViewFilter = {}) => {
  if (filter.isGlobalView) return true;

  const activeUserId = normalizeText(filter.activeUserId);
  if (!activeUserId) return true;

  const rawSchema = schema as SchemaForUI & {
    ownerRecipientId?: string;
    ownerRecipientIds?: string[] | string;
    createdBy?: string;
    lastModifiedBy?: string;
    ownerMode?: 'single' | 'multi' | 'shared';
  };
  const authorIds = normalizeRecipientIds(rawSchema.createdBy || rawSchema.lastModifiedBy);
  const ownerIds = normalizeRecipientIds(rawSchema.ownerRecipientIds || rawSchema.ownerRecipientId);

  return (
    rawSchema.ownerMode === 'shared' ||
    authorIds.includes(activeUserId) ||
    ownerIds.includes(activeUserId)
  );
};

export const filterSchemasByAuthorView = (schemas: SchemaForUI[], filter: CollaborationViewFilter = {}) =>
  schemas.filter((schema) => schemaMatchesAuthorView(schema, filter));

export const createSchemaComment = (
  text: string,
  identity: CommentAuthorIdentity = {},
  overrides: Partial<
    SchemaForUI & {
      id?: string;
      text?: string;
      resolved?: boolean;
      replies?: unknown[];
    }
  > = {},
) => ({
  id: normalizeText((overrides as { id?: string }).id) || createEntityId('comment'),
  authorId: normalizeText(identity.authorId) || undefined,
  authorName: normalizeText(identity.authorName) || undefined,
  authorColor: normalizeText(identity.authorColor) || undefined,
  timestamp: Number(identity.timestamp) || Date.now(),
  text: text.trim(),
  resolved: false,
  replies: [],
  ...(overrides as Record<string, unknown>),
});

export const createSchemaCommentAnchor = (
  anchor: Partial<
    SchemaForUI & {
      id?: string;
      schemaUid?: string;
      fileId?: string;
      pageNumber?: number;
      x?: number;
      y?: number;
      resolved?: boolean;
    }
  >,
  identity: CommentAuthorIdentity = {},
) => ({
  id: normalizeText((anchor as { id?: string }).id) || createEntityId('anchor'),
  schemaUid: normalizeText((anchor as { schemaUid?: string }).schemaUid) || undefined,
  fileId: normalizeText((anchor as { fileId?: string }).fileId) || undefined,
  pageNumber:
    typeof (anchor as { pageNumber?: number }).pageNumber === 'number'
      ? (anchor as { pageNumber?: number }).pageNumber
      : undefined,
  x: typeof (anchor as { x?: number }).x === 'number' ? (anchor as { x?: number }).x : undefined,
  y: typeof (anchor as { y?: number }).y === 'number' ? (anchor as { y?: number }).y : undefined,
  resolved: Boolean((anchor as { resolved?: boolean }).resolved),
  authorId: normalizeText(identity.authorId) || undefined,
  authorColor: normalizeText(identity.authorColor) || undefined,
});

export const upsertById = <T extends { id: string }>(items: T[] = [], nextItem: T) => {
  const index = items.findIndex((item) => item.id === nextItem.id);
  if (index < 0) return items.concat([nextItem]);
  const nextItems = items.slice();
  nextItems[index] = nextItem;
  return nextItems;
};

export const removeById = <T extends { id: string }>(items: T[] = [], id: string) =>
  items.filter((item) => item.id !== id);

type AssignmentIdentityMode = 'recipient' | 'author';

const buildAssignments = (schemas: SchemaPageArray, mode: AssignmentIdentityMode): SchemaAssignments => {
  const assignments: SchemaAssignments = {};

  schemas.forEach((page, pageIndex) => {
    page.forEach((schema) => {
      const rawSchema = schema as SchemaForUI & {
        schemaUid?: string;
        fileId?: string;
        fileTemplateId?: string;
        pageNumber?: number;
        ownerRecipientId?: string;
        ownerRecipientIds?: string[] | string;
        createdBy?: string;
        lastModifiedBy?: string;
      };
      const schemaUid = String(rawSchema.schemaUid || rawSchema.id || rawSchema.name || '').trim();
      if (!schemaUid) return;

      const fileId = String(rawSchema.fileId || rawSchema.fileTemplateId || 'default').trim() || 'default';
      const pageKey = String(
        typeof rawSchema.pageNumber === 'number' && Number.isFinite(rawSchema.pageNumber) && rawSchema.pageNumber > 0
          ? Math.trunc(rawSchema.pageNumber)
          : pageIndex + 1,
      );
      const identities =
        mode === 'author'
          ? normalizeRecipientIds(rawSchema.createdBy || rawSchema.lastModifiedBy || '__unassigned__')
          : normalizeRecipientIds(rawSchema.ownerRecipientIds || rawSchema.ownerRecipientId || '__unassigned__');
      const sharedIdentityKeys =
        mode === 'author' && rawSchema.ownerMode === 'shared'
          ? [SHARED_ASSIGNMENTS_BUCKET]
          : [];

      identities.concat(sharedIdentityKeys).forEach((identity) => {
        if (!assignments[identity]) assignments[identity] = {};
        if (!assignments[identity][fileId]) assignments[identity][fileId] = {};
        if (!assignments[identity][fileId][pageKey]) assignments[identity][fileId][pageKey] = [];
        assignments[identity][fileId][pageKey].push(schemaUid);
      });
    });
  });

  Object.values(assignments).forEach((files) => {
    Object.values(files).forEach((pages) => {
      Object.keys(pages).forEach((pageKey) => {
        pages[pageKey] = Array.from(new Set(pages[pageKey]));
      });
    });
  });

  return assignments;
};

export const buildSchemaAssignments = (schemas: SchemaPageArray): SchemaAssignments =>
  buildAssignments(schemas, 'recipient');

export const buildUserSchemaAssignments = (schemas: SchemaPageArray): SchemaAssignments =>
  buildAssignments(schemas, 'author');

export const validateCollaborativeSchemas = (schemas: SchemaPageArray) => {
  const issues: Array<{ schemaUid: string; reason: 'missing-createdBy' | 'missing-userColor' }> = [];

  schemas.forEach((page) => {
    page.forEach((schema) => {
      const rawSchema = schema as SchemaForUI & {
        schemaUid?: string;
        createdBy?: string;
        userColor?: string;
      };
      const schemaUid = String(rawSchema.schemaUid || rawSchema.id || rawSchema.name || '').trim();
      if (!schemaUid) return;
      if (!String(rawSchema.createdBy || '').trim()) {
        issues.push({ schemaUid, reason: 'missing-createdBy' });
      }
      if (!String(rawSchema.userColor || '').trim()) {
        issues.push({ schemaUid, reason: 'missing-userColor' });
      }
    });
  });

  return {
    valid: issues.length === 0,
    issues,
  };
};
