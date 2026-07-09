import { cloneDeep } from './helper.js';
import type {
  CommentScope,
  SchemaComment,
  SchemaCommentReply,
  SchemaForUI,
  SchemaPageArray,
  CommentAnchor,
} from './types.js';

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
export type UserRecipientSchemaAssignments = Record<string, Record<string, Record<string, Record<string, string[]>>>>;
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

type SchemaCommentDraft = {
  id?: string;
  scope?: CommentScope;
  fileId?: string;
  pageNumber?: number;
  fieldId?: string;
  schemaUid?: string;
  authorId?: string;
  authorName?: string;
  authorColor?: string;
  timestamp?: number;
  createdAt?: number;
  text?: string;
  resolved?: boolean;
  anchor?: CommentAnchor;
  replies?: SchemaCommentReply[];
};

type CommentAnchorDraft = {
  id?: string;
  scope?: CommentScope;
  schemaUid?: string;
  fileId?: string;
  pageNumber?: number;
  fieldId?: string;
  x?: number;
  y?: number;
  resolved?: boolean;
  authorId?: string;
  authorName?: string;
  authorColor?: string;
};

const createEntityId = (prefix: string) =>
  typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? `${prefix}-${crypto.randomUUID()}`
    : `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const resolveCommentScope = (
  scope: CommentScope | undefined,
  fallback: {
    schemaUid?: string | null;
    fieldId?: string | null;
    pageNumber?: number;
  } = {},
): CommentScope => {
  if (scope === 'document' || scope === 'page' || scope === 'schema') return scope;
  if (String(fallback.schemaUid || fallback.fieldId || '').trim()) return 'schema';
  if (typeof fallback.pageNumber === 'number') return 'page';
  return 'document';
};

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
  overrides: SchemaCommentDraft = {},
): SchemaComment => ({
  ...(overrides as Record<string, unknown>),
  id: normalizeText(overrides.id) || createEntityId('comment'),
  scope: resolveCommentScope(overrides.scope, {
    schemaUid: overrides.schemaUid,
    fieldId: overrides.fieldId,
    pageNumber: overrides.pageNumber,
  }),
  fileId: normalizeText(overrides.fileId) || undefined,
  pageNumber: typeof overrides.pageNumber === 'number' ? overrides.pageNumber : undefined,
  fieldId:
    normalizeText(overrides.fieldId) ||
    normalizeText(overrides.schemaUid) ||
    undefined,
  schemaUid:
    normalizeText(overrides.schemaUid) ||
    normalizeText(overrides.fieldId) ||
    undefined,
  authorId: normalizeText(identity.authorId) || undefined,
  authorName: normalizeText(identity.authorName) || undefined,
  authorColor: normalizeText(identity.authorColor) || undefined,
  timestamp: Number(identity.timestamp) || Date.now(),
  createdAt: Number(identity.timestamp) || Date.now(),
  text: text.trim(),
  resolved: false,
  anchor: overrides.anchor ? cloneDeep(overrides.anchor) : undefined,
  replies: Array.isArray(overrides.replies) ? cloneDeep(overrides.replies) : [],
});

export const createSchemaCommentAnchor = (
  anchor: CommentAnchorDraft = {},
  identity: CommentAuthorIdentity = {},
): CommentAnchor => ({
  ...(anchor as Record<string, unknown>),
  id: normalizeText(anchor.id) || createEntityId('anchor'),
  scope: resolveCommentScope(anchor.scope, {
    schemaUid: anchor.schemaUid,
    fieldId: anchor.fieldId,
    pageNumber: anchor.pageNumber,
  }),
  schemaUid: normalizeText(anchor.schemaUid) || undefined,
  fieldId:
    normalizeText(anchor.fieldId) ||
    normalizeText(anchor.schemaUid) ||
    undefined,
  fileId: normalizeText(anchor.fileId) || undefined,
  pageNumber: typeof anchor.pageNumber === 'number' ? anchor.pageNumber : undefined,
  x: typeof anchor.x === 'number' ? anchor.x : undefined,
  y: typeof anchor.y === 'number' ? anchor.y : undefined,
  resolved: Boolean(anchor.resolved),
  authorId: normalizeText(identity.authorId) || undefined,
  authorName: normalizeText(identity.authorName) || undefined,
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
export type UserRecipientAssignmentOptions = {
  sharedRecipientKey?: string;
  unassignedUserKey?: string;
  unassignedRecipientKey?: string;
  includeSharedRecipientBucket?: boolean;
};

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

export const buildUserRecipientAssignments = (
  schemas: SchemaPageArray,
  options: UserRecipientAssignmentOptions = {},
): UserRecipientSchemaAssignments => {
  const sharedRecipientKey = normalizeText(options.sharedRecipientKey) || SHARED_ASSIGNMENTS_BUCKET;
  const unassignedUserKey = normalizeText(options.unassignedUserKey) || '__unassigned__';
  const unassignedRecipientKey = normalizeText(options.unassignedRecipientKey) || '__unassigned__';
  const includeSharedRecipientBucket = options.includeSharedRecipientBucket !== false;
  const assignments: UserRecipientSchemaAssignments = {};

  schemas.forEach((page, pageIndex) => {
    page.forEach((schema) => {
      const rawSchema = schema as SchemaForUI & {
        schemaUid?: string;
        fileId?: string;
        fileTemplateId?: string;
        pageNumber?: number;
        ownerMode?: 'single' | 'multi' | 'shared';
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
      const userIds = normalizeRecipientIds(rawSchema.createdBy || rawSchema.lastModifiedBy || unassignedUserKey);
      const recipientIds = (() => {
        const normalizedSingle = normalizeRecipientIds(rawSchema.ownerRecipientId || rawSchema.ownerRecipientIds || unassignedRecipientKey);
        const normalizedMulti = normalizeRecipientIds(rawSchema.ownerRecipientIds || rawSchema.ownerRecipientId || unassignedRecipientKey);

        if (rawSchema.ownerMode === 'single') return normalizedSingle.slice(0, 1);
        if (rawSchema.ownerMode === 'multi') return normalizedMulti;
        return normalizedMulti.length > 0 ? normalizedMulti : normalizedSingle;
      })();

      if (rawSchema.ownerMode === 'shared' && includeSharedRecipientBucket && !recipientIds.includes(sharedRecipientKey)) {
        recipientIds.push(sharedRecipientKey);
      }

      userIds.forEach((userId) => {
        if (!assignments[userId]) assignments[userId] = {};
        recipientIds.forEach((recipientId) => {
          if (!assignments[userId][recipientId]) assignments[userId][recipientId] = {};
          if (!assignments[userId][recipientId][fileId]) assignments[userId][recipientId][fileId] = {};
          if (!assignments[userId][recipientId][fileId][pageKey]) assignments[userId][recipientId][fileId][pageKey] = [];
          assignments[userId][recipientId][fileId][pageKey].push(schemaUid);
        });
      });
    });
  });

  Object.values(assignments).forEach((recipients) => {
    Object.values(recipients).forEach((files) => {
      Object.values(files).forEach((pages) => {
        Object.keys(pages).forEach((pageKey) => {
          pages[pageKey] = Array.from(new Set(pages[pageKey]));
        });
      });
    });
  });

  return assignments;
};

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
