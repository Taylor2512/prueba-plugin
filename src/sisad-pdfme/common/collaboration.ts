import { cloneDeep } from './helper.js';
import type { SchemaComment, SchemaForUI, SchemaPageArray, CommentAnchor } from './types.js';

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
      anchor?: CommentAnchor;
      replies?: unknown[];
    }
  > = {},
): SchemaComment => ({
  ...(overrides as Record<string, unknown>),
  id: normalizeText((overrides as { id?: string }).id) || createEntityId('comment'),
  fileId: normalizeText((overrides as { fileId?: string }).fileId) || undefined,
  pageNumber:
    typeof (overrides as { pageNumber?: number }).pageNumber === 'number'
      ? (overrides as { pageNumber?: number }).pageNumber
      : undefined,
  fieldId:
    normalizeText((overrides as { fieldId?: string; schemaUid?: string }).fieldId) ||
    normalizeText((overrides as { fieldId?: string; schemaUid?: string }).schemaUid) ||
    undefined,
  schemaUid:
    normalizeText((overrides as { schemaUid?: string; fieldId?: string }).schemaUid) ||
    normalizeText((overrides as { schemaUid?: string; fieldId?: string }).fieldId) ||
    undefined,
  authorId: normalizeText(identity.authorId) || undefined,
  authorName: normalizeText(identity.authorName) || undefined,
  authorColor: normalizeText(identity.authorColor) || undefined,
  timestamp: Number(identity.timestamp) || Date.now(),
  createdAt: Number(identity.timestamp) || Date.now(),
  text: text.trim(),
  resolved: false,
  anchor: overrides.anchor ? cloneDeep(overrides.anchor) : undefined,
  replies: [],
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
): CommentAnchor => ({
  ...(anchor as Record<string, unknown>),
  id: normalizeText((anchor as { id?: string }).id) || createEntityId('anchor'),
  schemaUid: normalizeText((anchor as { schemaUid?: string }).schemaUid) || undefined,
  fieldId:
    normalizeText((anchor as { fieldId?: string; schemaUid?: string }).fieldId) ||
    normalizeText((anchor as { fieldId?: string; schemaUid?: string }).schemaUid) ||
    undefined,
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
