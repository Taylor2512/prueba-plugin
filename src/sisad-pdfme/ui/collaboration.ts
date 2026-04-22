import { useCallback, useEffect, useMemo, useState } from 'react';
import * as Y from 'yjs';
import { Awareness } from 'y-protocols/awareness';
import { cloneDeep, upsertById, type SchemaForUI } from '@sisad-pdfme/common';
import type {
  CollaborationHistoryEntry,
  CollaborationPresence,
  CollaborationProviderName,
  CollaborationSyncConfig,
  SchemaCollaborativeLock,
  SchemaCollaborativeState,
  SchemaComment,
  SchemaCommentAnchor,
} from './designerEngine.js';

export type CollaborationEvent =
  | {
      type: 'create';
      schema: SchemaForUI;
      pageIndex?: number;
      actorId?: string;
      sessionId?: string;
      timestamp?: number;
    }
  | {
      type: 'update';
      schemaId: string;
      patch: Partial<SchemaForUI>;
      pageIndex?: number;
      actorId?: string;
      sessionId?: string;
      timestamp?: number;
    }
  | {
      type: 'comment.created';
      schemaId: string;
      comment: SchemaComment;
      anchor?: SchemaCommentAnchor;
      pageIndex?: number;
      actorId?: string;
      sessionId?: string;
      timestamp?: number;
    }
  | {
      type: 'comment.updated';
      schemaId: string;
      comment: SchemaComment;
      anchor?: SchemaCommentAnchor;
      pageIndex?: number;
      actorId?: string;
      sessionId?: string;
      timestamp?: number;
    }
  | {
      type: 'comment.deleted';
      schemaId: string;
      commentId: string;
      anchorId?: string;
      pageIndex?: number;
      actorId?: string;
      sessionId?: string;
      timestamp?: number;
    }
  | {
      type: 'delete';
      schemaId: string;
      pageIndex?: number;
      actorId?: string;
      sessionId?: string;
      timestamp?: number;
    }
  | {
      type: 'lock';
      schemaId: string;
      lock: SchemaCollaborativeLock;
      state?: SchemaCollaborativeState;
      pageIndex?: number;
      actorId?: string;
      sessionId?: string;
      timestamp?: number;
    }
  | {
      type: 'unlock';
      schemaId: string;
      pageIndex?: number;
      actorId?: string;
      sessionId?: string;
      timestamp?: number;
    }
  | {
      type: 'comment';
      schemaId?: string;
      comment?: SchemaComment;
      anchor?: SchemaCommentAnchor;
      pageIndex?: number;
      actorId?: string;
      sessionId?: string;
      timestamp?: number;
    };

export type CollaborationSyncState = {
  status: 'idle' | 'connecting' | 'open' | 'closed' | 'error';
  send: (event: CollaborationEvent) => void;
  applyLocalChange: (event: CollaborationEvent) => void;
  disconnect: () => void;
  presence: CollaborationPresence[];
  history: CollaborationHistoryEntry[];
  setPresence: (patch: Partial<CollaborationPresence>) => void;
  acquireLock: (schemaId: string, lock: SchemaCollaborativeLock, pageIndex?: number) => void;
  releaseLock: (schemaId: string, pageIndex?: number) => void;
  appendHistory: (entry: CollaborationHistoryEntry) => void;
};

type CollaborationAdapter = {
  connect: () => void;
  disconnect: () => void;
  subscribe: (listener: (event: CollaborationEvent) => void) => () => void;
  applyLocalChange: (event: CollaborationEvent) => void;
  setPresence: (patch: Partial<CollaborationPresence>) => void;
  acquireLock: (schemaId: string, lock: SchemaCollaborativeLock, pageIndex?: number) => void;
  releaseLock: (schemaId: string, pageIndex?: number) => void;
  appendHistory: (entry: CollaborationHistoryEntry) => void;
  getPresence: () => CollaborationPresence[];
  getHistory: () => CollaborationHistoryEntry[];
  getStatus: () => CollaborationSyncState['status'];
  onStatusChange?: (listener: (status: CollaborationSyncState['status']) => void) => () => void;
  onPresenceChange?: (listener: (presence: CollaborationPresence[]) => void) => () => void;
  onHistoryChange?: (listener: (history: CollaborationHistoryEntry[]) => void) => () => void;
};

type SchemaStoreEntry = {
  pageIndex: number;
  schema: SchemaForUI;
};

type CommentsStoreEntry = {
  comments?: SchemaComment[];
  commentAnchors?: SchemaCommentAnchor[];
  commentsAnchors?: SchemaCommentAnchor[];
  commentsCount?: number;
};

type LockStoreEntry = {
  lock?: SchemaCollaborativeLock;
  state?: SchemaCollaborativeState;
  pageIndex?: number;
};

type RoomEntry = {
  doc: Y.Doc;
  awareness: Awareness;
  refCount: number;
};

const ROOM_REGISTRY_KEY = '__sisad_pdfme_yjs_rooms__';
const YJS_LOCAL_PROVIDER: CollaborationProviderName = 'yjs';
const LEGACY_PROVIDER: CollaborationProviderName = 'legacy';

const getRoomsRegistry = (): Map<string, RoomEntry> => {
  const globalScope = globalThis as typeof globalThis & {
    [ROOM_REGISTRY_KEY]?: Map<string, RoomEntry>;
  };
  if (!globalScope[ROOM_REGISTRY_KEY]) {
    globalScope[ROOM_REGISTRY_KEY] = new Map<string, RoomEntry>();
  }
  return globalScope[ROOM_REGISTRY_KEY] as Map<string, RoomEntry>;
};

const acquireRoom = (sessionId: string) => {
  const registry = getRoomsRegistry();
  const current = registry.get(sessionId);
  if (current) {
    current.refCount += 1;
    return current;
  }
  const room = {
    doc: new Y.Doc(),
    awareness: undefined as unknown as Awareness,
    refCount: 1,
  };
  room.awareness = new Awareness(room.doc);
  registry.set(sessionId, room);
  return room;
};

const releaseRoom = (sessionId: string) => {
  const registry = getRoomsRegistry();
  const room = registry.get(sessionId);
  if (!room) return;
  room.refCount -= 1;
  if (room.refCount > 0) return;
  room.awareness.destroy();
  room.doc.destroy();
  registry.delete(sessionId);
};

const normalizeIndex = (pageIndex: number | undefined, length: number) => {
  if (!Number.isFinite(pageIndex as number)) return 0;
  return Math.max(0, Math.min(Math.trunc(pageIndex || 0), Math.max(0, length - 1)));
};

const shallowEqualRecord = (left?: Record<string, unknown>, right?: Record<string, unknown>) => {
  if (left === right) return true;
  const leftKeys = Object.keys(left || {});
  const rightKeys = Object.keys(right || {});
  if (leftKeys.length !== rightKeys.length) return false;
  return leftKeys.every((key) => (left || {})[key] === (right || {})[key]);
};

const getSchemaTimestamp = (schema: SchemaForUI) =>
  Math.max(
    Number(schema.lastModifiedAt) || 0,
    Number(schema.updatedAt) || 0,
    Number(schema.createdAt) || 0,
    Number(schema.lock?.lockedAt) || 0,
  );

const isStaleEvent = (schema: SchemaForUI, eventTimestamp?: number) => {
  if (!Number.isFinite(eventTimestamp as number)) return false;
  return getSchemaTimestamp(schema) > Number(eventTimestamp);
};

const ensureTimestamp = (value?: number) => (Number.isFinite(value as number) ? Number(value) : Date.now());
const ensureSessionId = (value?: string) => String(value || 'local');

const stripSchemaForBaseStore = (schema: SchemaForUI): SchemaForUI => {
  const next = cloneDeep(schema);
  delete next.comments;
  delete next.commentAnchors;
  delete next.commentsAnchors;
  delete next.commentsCount;
  delete next.lock;
  return next;
};

const mergeAuxIntoSchema = (
  schema: SchemaForUI,
  commentsEntry?: CommentsStoreEntry | null,
  lockEntry?: LockStoreEntry | null,
): SchemaForUI => ({
  ...cloneDeep(schema),
  ...(commentsEntry
    ? {
        comments: cloneDeep(commentsEntry.comments || []),
        commentAnchors: cloneDeep(commentsEntry.commentAnchors || commentsEntry.commentsAnchors || []),
        commentsAnchors: cloneDeep(commentsEntry.commentsAnchors || commentsEntry.commentAnchors || []),
        commentsCount:
          typeof commentsEntry.commentsCount === 'number'
            ? commentsEntry.commentsCount
            : Array.isArray(commentsEntry.comments)
              ? commentsEntry.comments.length
              : 0,
      }
    : null),
  ...(lockEntry
    ? {
        lock: lockEntry.lock ? cloneDeep(lockEntry.lock) : undefined,
        state: lockEntry.state,
      }
    : null),
});

const createHistoryEntryFromEvent = (event: CollaborationEvent): CollaborationHistoryEntry => {
  const timestamp = ensureTimestamp(event.timestamp);
  const actorId = event.actorId || null;
  const schemaId = event.type === 'create' ? event.schema.id : event.schemaId;
  const schemaUid = event.type === 'create' ? event.schema.schemaUid : undefined;
  const fileId = event.type === 'create' ? event.schema.fileId || null : null;

  return {
    id:
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `${event.type}-${timestamp}-${Math.random().toString(16).slice(2)}`,
    type:
      event.type === 'create'
        ? 'schema.created'
        : event.type === 'delete'
          ? 'schema.deleted'
          : event.type === 'comment' || event.type === 'comment.created'
            ? 'comment.created'
            : event.type === 'comment.updated'
              ? 'comment.updated'
              : event.type === 'comment.deleted'
                ? 'comment.deleted'
            : event.type === 'lock' || event.type === 'unlock'
              ? 'lock.changed'
              : 'schema.updated',
    schemaId,
    schemaUid,
    fileId,
    pageIndex: event.pageIndex,
    actorId,
    timestamp,
    payload:
      event.type === 'update'
        ? cloneDeep(event.patch)
        : event.type === 'create'
          ? { schemaUid: event.schema.schemaUid, pageNumber: event.schema.pageNumber }
          : event.type === 'comment' || event.type === 'comment.created' || event.type === 'comment.updated'
            ? {
                commentId: event.comment?.id,
                schemaId: event.schemaId,
                pageNumber: event.comment?.anchor?.pageNumber || event.anchor?.pageNumber || event.pageIndex,
                text: event.comment?.text,
                resolved: event.comment?.resolved,
              }
          : event.type === 'comment.deleted'
            ? { commentId: event.commentId, anchorId: event.anchorId }
          : undefined,
  };
};

const diffSchemaPatch = (before: SchemaForUI, after: SchemaForUI) => {
  const keys = new Set([...Object.keys(before || {}), ...Object.keys(after || {})]);
  const patch: Partial<SchemaForUI> = {};
  keys.forEach((key) => {
    const left = JSON.stringify((before as Record<string, unknown>)[key]);
    const right = JSON.stringify((after as Record<string, unknown>)[key]);
    if (left !== right) {
      (patch as Record<string, unknown>)[key] = (after as Record<string, unknown>)[key];
    }
  });
  return patch;
};

const commentSignature = (comment: SchemaComment) =>
  JSON.stringify({
    ...comment,
    anchor: comment.anchor
      ? {
          ...comment.anchor,
          resolved: Boolean(comment.anchor.resolved),
        }
      : undefined,
    replies: Array.isArray(comment.replies) ? comment.replies : [],
  });

const commentCollectionSignature = (comments: SchemaComment[] = [], anchors: SchemaCommentAnchor[] = []) =>
  JSON.stringify({
    comments: comments.map((comment) => commentSignature(comment)),
    anchors: anchors.map((anchor) =>
      JSON.stringify({
        ...anchor,
        resolved: Boolean(anchor.resolved),
      }),
    ),
  });

const collectCommentLifecycleEvents = (
  before: SchemaForUI,
  after: SchemaForUI,
  metadata: Pick<CollaborationEvent, 'actorId' | 'sessionId' | 'timestamp'>,
  pageIndex?: number,
): CollaborationEvent[] => {
  const previousComments = Array.isArray(before.comments) ? before.comments : [];
  const nextComments = Array.isArray(after.comments) ? after.comments : [];
  const previousById = new Map(previousComments.map((comment) => [comment.id, comment] as const));
  const nextById = new Map(nextComments.map((comment) => [comment.id, comment] as const));
  const events: CollaborationEvent[] = [];

  previousById.forEach((previousComment, commentId) => {
    if (nextById.has(commentId)) return;
    events.push({
      type: 'comment.deleted',
      schemaId: after.id,
      commentId,
      anchorId: previousComment.anchor?.id || commentId,
      pageIndex,
      actorId: metadata.actorId,
      sessionId: metadata.sessionId,
      timestamp: metadata.timestamp,
    });
  });

  nextById.forEach((nextComment, commentId) => {
    const previousComment = previousById.get(commentId);
    if (!previousComment) {
      events.push({
        type: 'comment.created',
        schemaId: after.id,
        comment: cloneDeep(nextComment),
        anchor: nextComment.anchor ? cloneDeep(nextComment.anchor) : undefined,
        pageIndex,
        actorId: metadata.actorId,
        sessionId: metadata.sessionId,
        timestamp: metadata.timestamp,
      });
      return;
    }

    if (commentSignature(previousComment) === commentSignature(nextComment)) return;
    events.push({
      type: 'comment.updated',
      schemaId: after.id,
      comment: cloneDeep(nextComment),
      anchor: nextComment.anchor ? cloneDeep(nextComment.anchor) : undefined,
      pageIndex,
      actorId: metadata.actorId,
      sessionId: metadata.sessionId,
      timestamp: metadata.timestamp,
    });
  });

  return events;
};

const buildCommentCollectionsFromEvent = (
  event: Extract<CollaborationEvent, { type: 'comment' | 'comment.created' | 'comment.updated' | 'comment.deleted' }>,
  currentComments: SchemaComment[] = [],
  currentAnchors: SchemaCommentAnchor[] = [],
): {
  comments: SchemaComment[];
  anchors: SchemaCommentAnchor[];
  commentsCount: number;
} => {
  const nextComments = currentComments.slice();
  const nextAnchors = currentAnchors.slice();

  if (event.type !== 'comment.deleted' && !event.comment) {
    return {
      comments: nextComments,
      anchors: nextAnchors,
      commentsCount: nextComments.length,
    };
  }

  if (event.type === 'comment.deleted') {
    return {
      comments: nextComments.filter((comment) => comment.id !== event.commentId),
      anchors: nextAnchors.filter((anchor) => anchor.id !== (event.anchorId || event.commentId)),
      commentsCount: Math.max(0, nextComments.filter((comment) => comment.id !== event.commentId).length),
    };
  }

  const nextComment = cloneDeep(event.comment);
  const eventAnchor = cloneDeep(event.anchor || nextComment.anchor);
  if (eventAnchor && !nextComment.anchor) {
    nextComment.anchor = cloneDeep(eventAnchor);
  }
  if (eventAnchor && !eventAnchor.id) {
    eventAnchor.id = nextComment.id;
  }

  const commentIndex = nextComments.findIndex((comment) => comment.id === nextComment.id);
  if (commentIndex < 0 || event.type === 'comment.created' || event.type === 'comment' || event.type === 'comment.updated') {
    if (commentIndex < 0) {
      nextComments.push(nextComment);
    } else {
      nextComments[commentIndex] = nextComment;
    }
  }

  if (eventAnchor) {
    const anchorIndex = nextAnchors.findIndex((anchor) => anchor.id === eventAnchor.id);
    const resolvedAnchor = {
      ...eventAnchor,
      id: eventAnchor.id || nextComment.id,
    } as SchemaCommentAnchor;
    if (anchorIndex < 0) {
      nextAnchors.push(resolvedAnchor);
    } else {
      nextAnchors[anchorIndex] = resolvedAnchor;
    }
    const commentAtIndex = nextComments.findIndex((comment) => comment.id === nextComment.id);
    if (commentAtIndex >= 0) {
      nextComments[commentAtIndex] = {
        ...nextComments[commentAtIndex],
        anchor: cloneDeep(resolvedAnchor),
      } as SchemaComment;
    }
  }

  return {
    comments: nextComments,
    anchors: nextAnchors,
    commentsCount: nextComments.length,
  };
};

export const applyCollaborationEvent = (
  schemasList: SchemaForUI[][],
  event: CollaborationEvent,
): SchemaForUI[][] => {
  const pageIndex = normalizeIndex(event.pageIndex, schemasList.length);
  const nextSchemasList = schemasList.slice();

  const updateSchemaOnPage = (targetPageIndex: number, schemaId: string, updater: (schema: SchemaForUI) => SchemaForUI) => {
    const page = nextSchemasList[targetPageIndex];
    if (!page) return false;
    const schemaIndex = page.findIndex((schema) => schema.id === schemaId);
    if (schemaIndex < 0) return false;
    const currentSchema = nextSchemasList[targetPageIndex][schemaIndex];
    const nextSchema = updater(currentSchema);
    if (nextSchema === currentSchema) return false;
    nextSchemasList[targetPageIndex] = nextSchemasList[targetPageIndex].slice();
    nextSchemasList[targetPageIndex][schemaIndex] = nextSchema;
    return true;
  };

  if (event.type === 'create') {
    const page = nextSchemasList[pageIndex] || [];
    nextSchemasList[pageIndex] = page.concat([cloneDeep(event.schema)]);
    return nextSchemasList;
  }

  if (event.type === 'delete') {
    const page = nextSchemasList[pageIndex];
    if (!page) return schemasList;
    nextSchemasList[pageIndex] = page.filter((schema) => schema.id !== event.schemaId);
    if (nextSchemasList[pageIndex].length === page.length) return schemasList;
    return nextSchemasList;
  }

  if (event.type === 'lock') {
    for (let i = 0; i < nextSchemasList.length; i += 1) {
      const updated = updateSchemaOnPage(i, event.schemaId, (schema) => {
        const nextState = event.state || 'locked';
        const nextLock = { ...event.lock };
        if (isStaleEvent(schema, event.timestamp)) return schema;
        if (schema.state === nextState && shallowEqualRecord(schema.lock as Record<string, unknown> | undefined, nextLock)) {
          return schema;
        }
        return {
          ...schema,
          state: nextState,
          lock: nextLock,
          updatedAt: event.timestamp || schema.updatedAt,
          lastModifiedAt: event.timestamp || schema.lastModifiedAt,
          lastModifiedBy: event.actorId || schema.lastModifiedBy,
        };
      });
      if (updated) break;
    }
    if (!nextSchemasList.some((page, index) => page !== schemasList[index])) return schemasList;
    return nextSchemasList;
  }

  if (event.type === 'unlock') {
    for (let i = 0; i < nextSchemasList.length; i += 1) {
      const updated = updateSchemaOnPage(i, event.schemaId, (schema) => {
        if (isStaleEvent(schema, event.timestamp)) return schema;
        if (schema.state === 'draft' && !schema.lock) return schema;
        return {
          ...schema,
          state: 'draft',
          lock: undefined,
          updatedAt: event.timestamp || schema.updatedAt,
          lastModifiedAt: event.timestamp || schema.lastModifiedAt,
          lastModifiedBy: event.actorId || schema.lastModifiedBy,
        };
      });
      if (updated) break;
    }
    if (!nextSchemasList.some((page, index) => page !== schemasList[index])) return schemasList;
    return nextSchemasList;
  }

  if (event.type === 'comment' || event.type === 'comment.created' || event.type === 'comment.updated' || event.type === 'comment.deleted') {
    if (!event.schemaId) return schemasList;
    for (let i = 0; i < nextSchemasList.length; i += 1) {
      const updated = updateSchemaOnPage(i, event.schemaId, (schema) => {
        if (isStaleEvent(schema, event.timestamp)) return schema;
        const currentComments = Array.isArray(schema.comments) ? schema.comments : [];
        const currentAnchors = Array.isArray(schema.commentAnchors) ? schema.commentAnchors : [];
        const { comments, anchors, commentsCount } = buildCommentCollectionsFromEvent(
          event,
          currentComments,
          currentAnchors,
        );
        const nextUpdatedAt = event.timestamp || schema.updatedAt;
        const nextLastModifiedAt = event.timestamp || schema.lastModifiedAt;
        const nextLastModifiedBy = event.actorId || schema.lastModifiedBy;
        const currentCount = typeof schema.commentsCount === 'number' ? schema.commentsCount : currentComments.length;
        const hasCommentStateChanges =
          commentsCount !== currentCount ||
          commentCollectionSignature(currentComments, currentAnchors) !== commentCollectionSignature(comments, anchors);
        const hasMetadataChanges =
          schema.updatedAt !== nextUpdatedAt ||
          schema.lastModifiedAt !== nextLastModifiedAt ||
          schema.lastModifiedBy !== nextLastModifiedBy;
        if (!hasCommentStateChanges && !hasMetadataChanges) return schema;
        return {
          ...schema,
          comments,
          commentAnchors: anchors,
          commentsAnchors: anchors,
          commentsCount,
          updatedAt: nextUpdatedAt,
          lastModifiedAt: nextLastModifiedAt,
          lastModifiedBy: nextLastModifiedBy,
        };
      });
      if (updated) break;
    }
    if (!nextSchemasList.some((page, index) => page !== schemasList[index])) return schemasList;
    return nextSchemasList;
  }

  for (let i = 0; i < nextSchemasList.length; i += 1) {
    const updateEvent = event as Extract<CollaborationEvent, { type: 'update' }>;
    const updated = updateSchemaOnPage(i, updateEvent.schemaId, (schema) => {
      if (isStaleEvent(schema, updateEvent.timestamp)) return schema;
      const patch = updateEvent.patch || {};
      const patchEntries = Object.entries(patch) as Array<[keyof SchemaForUI, unknown]>;
      const changed = patchEntries.some(([key, value]) => schema[key] !== value);
      if (!changed) return schema;
      return {
        ...schema,
        ...patch,
        updatedAt: Number(patch.updatedAt) || updateEvent.timestamp || schema.updatedAt,
        lastModifiedAt:
          Number(patch.lastModifiedAt) ||
          Number(patch.updatedAt) ||
          updateEvent.timestamp ||
          schema.lastModifiedAt,
        lastModifiedBy:
          (typeof patch.lastModifiedBy === 'string' && patch.lastModifiedBy) ||
          updateEvent.actorId ||
          schema.lastModifiedBy,
      };
    });
    if (updated) break;
  }
  if (!nextSchemasList.some((page, index) => page !== schemasList[index])) return schemasList;

  return nextSchemasList;
};

export const diffCollaborationEvents = (
  previousSchemasList: SchemaForUI[][],
  nextSchemasList: SchemaForUI[][],
  metadata: Pick<CollaborationEvent, 'actorId' | 'sessionId'> & { timestamp?: number },
): CollaborationEvent[] => {
  const previousById = new Map<string, { pageIndex: number; schema: SchemaForUI }>();
  const nextById = new Map<string, { pageIndex: number; schema: SchemaForUI }>();
  previousSchemasList.forEach((page, pageIndex) => {
    page.forEach((schema) => previousById.set(schema.id, { pageIndex, schema }));
  });
  nextSchemasList.forEach((page, pageIndex) => {
    page.forEach((schema) => nextById.set(schema.id, { pageIndex, schema }));
  });

  const events: CollaborationEvent[] = [];
  const timestamp = ensureTimestamp(metadata.timestamp);

  previousById.forEach((previousEntry, schemaId) => {
    if (!nextById.has(schemaId)) {
      events.push({
        type: 'delete',
        schemaId,
        pageIndex: previousEntry.pageIndex,
        actorId: metadata.actorId,
        sessionId: metadata.sessionId,
        timestamp,
      });
    }
  });

  nextById.forEach((nextEntry, schemaId) => {
    const previousEntry = previousById.get(schemaId);
    if (!previousEntry) {
      events.push({
        type: 'create',
        schema: cloneDeep(nextEntry.schema),
        pageIndex: nextEntry.pageIndex,
        actorId: metadata.actorId,
        sessionId: metadata.sessionId,
        timestamp,
      });
      return;
    }

    const patch = diffSchemaPatch(previousEntry.schema, nextEntry.schema);
    const schemaPatch = { ...(patch as Partial<SchemaForUI>) } as Partial<SchemaForUI>;
    delete (schemaPatch as Partial<SchemaForUI> & {
      comments?: SchemaComment[];
      commentAnchors?: SchemaCommentAnchor[];
      commentsAnchors?: SchemaCommentAnchor[];
      commentsCount?: number;
    }).comments;
    delete (schemaPatch as Partial<SchemaForUI> & {
      comments?: SchemaComment[];
      commentAnchors?: SchemaCommentAnchor[];
      commentsAnchors?: SchemaCommentAnchor[];
      commentsCount?: number;
    }).commentAnchors;
    delete (schemaPatch as Partial<SchemaForUI> & {
      comments?: SchemaComment[];
      commentAnchors?: SchemaCommentAnchor[];
      commentsAnchors?: SchemaCommentAnchor[];
      commentsCount?: number;
    }).commentsAnchors;
    delete (schemaPatch as Partial<SchemaForUI> & {
      comments?: SchemaComment[];
      commentAnchors?: SchemaCommentAnchor[];
      commentsAnchors?: SchemaCommentAnchor[];
      commentsCount?: number;
    }).commentsCount;
    const commentEvents = collectCommentLifecycleEvents(previousEntry.schema, nextEntry.schema, metadata, nextEntry.pageIndex);
    const hasSchemaPatch = Object.keys(schemaPatch).length > 0;
    const pageChanged = previousEntry.pageIndex !== nextEntry.pageIndex;

    if (hasSchemaPatch || pageChanged) {
      events.push({
        type: 'update',
        schemaId,
        patch: schemaPatch,
        pageIndex: nextEntry.pageIndex,
        actorId: metadata.actorId,
        sessionId: metadata.sessionId,
        timestamp,
      });
    }

    events.push(...commentEvents);
  });

  return events;
};

const createLegacyCollaborationProvider = ({
  enabled,
  url,
  protocols,
  sessionId,
  actorId,
  reconnectMs = 2500,
}: CollaborationSyncConfig): CollaborationAdapter => {
  let status: CollaborationSyncState['status'] = enabled && url ? 'connecting' : 'idle';
  let socket: WebSocket | null = null;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  let lastEvent: CollaborationEvent | null = null;
  const listeners = new Set<(event: CollaborationEvent) => void>();
  const statusListeners = new Set<(nextStatus: CollaborationSyncState['status']) => void>();

  const setStatus = (nextStatus: CollaborationSyncState['status']) => {
    status = nextStatus;
    statusListeners.forEach((listener) => listener(nextStatus));
  };

  const disconnect = () => {
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
    socket?.close();
    socket = null;
    setStatus(enabled && url ? 'closed' : 'idle');
  };

  const connect = () => {
    if (!enabled || !url || typeof WebSocket === 'undefined') {
      setStatus(enabled && url ? 'error' : 'idle');
      return;
    }

    let canceled = false;
    const openSocket = () => {
      if (canceled) return;
      setStatus('connecting');
      socket = new WebSocket(url, protocols);

      socket.onopen = () => {
        if (canceled) return;
        setStatus('open');
        if (lastEvent) {
          socket?.send(JSON.stringify(lastEvent));
        } else {
          socket?.send(JSON.stringify({ type: 'hello', sessionId, actorId }));
        }
      };

      socket.onmessage = (event) => {
        try {
          const payload = JSON.parse(String(event.data || '{}')) as CollaborationEvent;
          if (!payload || typeof payload !== 'object') return;
          if (payload.sessionId && sessionId && payload.sessionId === sessionId) return;
          listeners.forEach((listener) => listener(payload));
        } catch {
          // Ignore malformed payloads.
        }
      };

      socket.onerror = () => {
        if (canceled) return;
        setStatus('error');
      };

      socket.onclose = () => {
        if (canceled) return;
        setStatus('closed');
        if (reconnectMs > 0) reconnectTimer = setTimeout(openSocket, reconnectMs);
      };
    };

    openSocket();

    return () => {
      canceled = true;
      disconnect();
    };
  };

  return {
    connect,
    disconnect,
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    applyLocalChange: (event) => {
      lastEvent = event;
      if (!socket || socket.readyState !== WebSocket.OPEN) return;
      socket.send(
        JSON.stringify({
          ...event,
          actorId: event.actorId || actorId,
          sessionId: event.sessionId || sessionId,
        }),
      );
    },
    setPresence: () => undefined,
    acquireLock: (schemaId, lock, pageIndex) => {
      lastEvent = { type: 'lock', schemaId, lock, pageIndex, actorId, sessionId, timestamp: Date.now() };
      if (socket?.readyState === WebSocket.OPEN) socket.send(JSON.stringify(lastEvent));
    },
    releaseLock: (schemaId, pageIndex) => {
      lastEvent = { type: 'unlock', schemaId, pageIndex, actorId, sessionId, timestamp: Date.now() };
      if (socket?.readyState === WebSocket.OPEN) socket.send(JSON.stringify(lastEvent));
    },
    appendHistory: () => undefined,
    getPresence: () => [],
    getHistory: () => [],
    getStatus: () => status,
    onStatusChange: (listener) => {
      statusListeners.add(listener);
      return () => statusListeners.delete(listener);
    },
  };
};

export const createYjsCollaborationProvider = ({
  enabled,
  sessionId,
  actorId,
  actorColor,
  users,
}: CollaborationSyncConfig): CollaborationAdapter => {
  const safeSessionId = ensureSessionId(sessionId);
  const safeActorId = String(actorId || 'local');
  let room: RoomEntry | null = null;
  let status: CollaborationSyncState['status'] = enabled ? 'connecting' : 'idle';
  const eventListeners = new Set<(event: CollaborationEvent) => void>();
  const statusListeners = new Set<(nextStatus: CollaborationSyncState['status']) => void>();
  const presenceListeners = new Set<(presence: CollaborationPresence[]) => void>();
  const historyListeners = new Set<(history: CollaborationHistoryEntry[]) => void>();
  const localOrigin = { actorId: safeActorId, sessionId: safeSessionId };
  const cleanupFns: Array<() => void> = [];

  const setStatus = (nextStatus: CollaborationSyncState['status']) => {
    status = nextStatus;
    statusListeners.forEach((listener) => listener(nextStatus));
  };

  const emitPresence = () => {
    const values = room
      ? Array.from(room.awareness.getStates().values())
          .map((entry) => entry as CollaborationPresence | null)
          .filter((entry): entry is CollaborationPresence => Boolean(entry?.userId))
          .sort((left, right) => right.updatedAt - left.updatedAt)
      : [];
    presenceListeners.forEach((listener) => listener(values));
  };

  const emitHistory = () => {
    const values = room
      ? cloneDeep(room.doc.getArray<CollaborationHistoryEntry>('history').toArray())
      : [];
    historyListeners.forEach((listener) => listener(values));
  };

  const getStores = () => {
    if (!room) throw new Error('Collaboration room not connected');
    return {
      schemasMap: room.doc.getMap<SchemaStoreEntry>('schemas'),
      commentsMap: room.doc.getMap<CommentsStoreEntry>('comments'),
      locksMap: room.doc.getMap<LockStoreEntry>('locks'),
      historyArray: room.doc.getArray<CollaborationHistoryEntry>('history'),
    };
  };

  const connect = () => {
    if (!enabled) {
      setStatus('idle');
      return;
    }
    room = acquireRoom(safeSessionId);
    setStatus('open');

    const { schemasMap, commentsMap, locksMap, historyArray } = getStores();

    const handleSchemaChanges = (event: Y.YMapEvent<SchemaStoreEntry>, transaction: Y.Transaction) => {
      if (transaction.origin === localOrigin) return;
      event.changes.keys.forEach((change, schemaId) => {
        const nextEntry = schemasMap.get(schemaId);
        const prevEntry = change.oldValue as SchemaStoreEntry | undefined;
        if (change.action === 'delete') {
          eventListeners.forEach((listener) =>
            listener({
              type: 'delete',
              schemaId,
              pageIndex: prevEntry?.pageIndex,
              sessionId: safeSessionId,
              timestamp: Date.now(),
            }),
          );
          return;
        }

        if (!nextEntry) return;
        const mergedNext = mergeAuxIntoSchema(
          nextEntry.schema,
          commentsMap.get(schemaId),
          locksMap.get(schemaId),
        );

        if (change.action === 'add') {
          eventListeners.forEach((listener) =>
            listener({
              type: 'create',
              schema: mergedNext,
              pageIndex: nextEntry.pageIndex,
              sessionId: safeSessionId,
              timestamp: Date.now(),
            }),
          );
          return;
        }

        const mergedPrev = prevEntry
          ? mergeAuxIntoSchema(prevEntry.schema, commentsMap.get(schemaId), locksMap.get(schemaId))
          : undefined;
        const patch = mergedPrev ? diffSchemaPatch(mergedPrev, mergedNext) : mergedNext;
        eventListeners.forEach((listener) =>
          listener({
            type: 'update',
            schemaId,
            patch,
            pageIndex: nextEntry.pageIndex,
            sessionId: safeSessionId,
            timestamp: Date.now(),
          }),
        );
      });
    };

    const handleCommentChanges = (event: Y.YMapEvent<CommentsStoreEntry>, transaction: Y.Transaction) => {
      if (transaction.origin === localOrigin) return;
      event.changes.keys.forEach((change, schemaId) => {
        const nextEntry = commentsMap.get(schemaId);
        const previousEntry = (change.oldValue as CommentsStoreEntry | undefined) || undefined;
        const previousSchema = {
          id: schemaId,
          name: schemaId,
          type: 'text',
          comments: cloneDeep(previousEntry?.comments || []),
          commentAnchors: cloneDeep(previousEntry?.commentAnchors || previousEntry?.commentsAnchors || []),
          commentsAnchors: cloneDeep(previousEntry?.commentsAnchors || previousEntry?.commentAnchors || []),
          commentsCount:
            typeof previousEntry?.commentsCount === 'number'
              ? previousEntry.commentsCount
              : Array.isArray(previousEntry?.comments)
                ? previousEntry.comments.length
                : 0,
          position: { x: 0, y: 0 },
          width: 1,
          height: 1,
        } as SchemaForUI;
        const nextSchema = {
          id: schemaId,
          name: schemaId,
          type: 'text',
          comments: cloneDeep(nextEntry?.comments || []),
          commentAnchors: cloneDeep(nextEntry?.commentAnchors || nextEntry?.commentsAnchors || []),
          commentsAnchors: cloneDeep(nextEntry?.commentsAnchors || nextEntry?.commentAnchors || []),
          commentsCount:
            typeof nextEntry?.commentsCount === 'number'
              ? nextEntry.commentsCount
              : Array.isArray(nextEntry?.comments)
                ? nextEntry.comments.length
                : 0,
          position: { x: 0, y: 0 },
          width: 1,
          height: 1,
        } as SchemaForUI;

        const commentEvents = collectCommentLifecycleEvents(
          previousSchema,
          nextSchema,
          { sessionId: safeSessionId, timestamp: Date.now() },
        );

        if (commentEvents.length > 0) {
          commentEvents.forEach((listenerEvent) => eventListeners.forEach((listener) => listener(listenerEvent)));
          return;
        }

        if (change.action === 'delete' || !nextEntry) return;
        eventListeners.forEach((listener) =>
          listener({
            type: 'update',
            schemaId,
            patch: {
              comments: cloneDeep(nextEntry.comments || []),
              commentAnchors: cloneDeep(nextEntry.commentAnchors || nextEntry.commentsAnchors || []),
              commentsAnchors: cloneDeep(nextEntry.commentsAnchors || nextEntry.commentAnchors || []),
              commentsCount:
                typeof nextEntry.commentsCount === 'number'
                  ? nextEntry.commentsCount
                  : Array.isArray(nextEntry.comments)
                    ? nextEntry.comments.length
                    : 0,
            },
            sessionId: safeSessionId,
            timestamp: Date.now(),
          }),
        );
      });
    };

    const handleLockChanges = (event: Y.YMapEvent<LockStoreEntry>, transaction: Y.Transaction) => {
      if (transaction.origin === localOrigin) return;
      event.changes.keys.forEach((change, schemaId) => {
        const nextEntry = locksMap.get(schemaId);
        const prevEntry = change.oldValue as LockStoreEntry | undefined;
        if (change.action === 'delete' || !nextEntry?.lock) {
          eventListeners.forEach((listener) =>
            listener({
              type: 'unlock',
              schemaId,
              pageIndex: prevEntry?.pageIndex,
              sessionId: safeSessionId,
              timestamp: Date.now(),
            }),
          );
          return;
        }
        eventListeners.forEach((listener) =>
          listener({
            type: 'lock',
            schemaId,
            lock: cloneDeep(nextEntry.lock),
            state: nextEntry.state,
            pageIndex: nextEntry.pageIndex,
            sessionId: safeSessionId,
            timestamp: Date.now(),
          }),
        );
      });
    };

    schemasMap.observe(handleSchemaChanges);
    commentsMap.observe(handleCommentChanges);
    locksMap.observe(handleLockChanges);
    const handleHistoryChanges = () => emitHistory();
    historyArray.observe(handleHistoryChanges);
    room.awareness.on('change', emitPresence);

    cleanupFns.push(
      () => schemasMap.unobserve(handleSchemaChanges),
      () => commentsMap.unobserve(handleCommentChanges),
      () => locksMap.unobserve(handleLockChanges),
      () => historyArray.unobserve(handleHistoryChanges),
      () => room?.awareness.off('change', emitPresence),
    );

    const currentUser = (users || []).find((user) => user.id === safeActorId);
    room.awareness.setLocalState({
      userId: safeActorId,
      name: currentUser?.name || safeActorId,
      color: actorColor || currentUser?.color || null,
      role: currentUser?.role || null,
      activeSchemaIds: [],
      updatedAt: Date.now(),
    } satisfies CollaborationPresence);
    schemasMap.forEach((entry, schemaId) => {
      const mergedSchema = mergeAuxIntoSchema(entry.schema, commentsMap.get(schemaId), locksMap.get(schemaId));
      eventListeners.forEach((listener) =>
        listener({
          type: 'create',
          schema: mergedSchema,
          pageIndex: entry.pageIndex,
          sessionId: safeSessionId,
          timestamp: Date.now(),
        }),
      );
    });
    emitPresence();
    emitHistory();
  };

  const disconnect = () => {
    cleanupFns.splice(0).forEach((cleanup) => cleanup());
    if (room) {
      room.awareness.setLocalState(null);
      releaseRoom(safeSessionId);
      room = null;
    }
    setStatus(enabled ? 'closed' : 'idle');
  };

  const appendHistory = (entry: CollaborationHistoryEntry) => {
    if (!room || !enabled) return;
    const { historyArray } = getStores();
    room.doc.transact(() => {
      historyArray.push([cloneDeep(entry)]);
    }, localOrigin);
    emitHistory();
  };

  const applyLocalChange = (event: CollaborationEvent) => {
    if (!room || !enabled) return;
    const timestamp = ensureTimestamp(event.timestamp);
    const { schemasMap, commentsMap, locksMap } = getStores();

    room.doc.transact(() => {
      if (event.type === 'create') {
        schemasMap.set(event.schema.id, {
          pageIndex: event.pageIndex || 0,
          schema: stripSchemaForBaseStore({
            ...cloneDeep(event.schema),
            updatedAt: timestamp,
            lastModifiedAt: timestamp,
            lastModifiedBy: event.actorId || safeActorId,
          }),
        });
        if (event.schema.comments || event.schema.commentAnchors || event.schema.commentsAnchors) {
          commentsMap.set(event.schema.id, {
            comments: cloneDeep(event.schema.comments || []),
            commentAnchors: cloneDeep(event.schema.commentAnchors || event.schema.commentsAnchors || []),
            commentsAnchors: cloneDeep(event.schema.commentsAnchors || event.schema.commentAnchors || []),
            commentsCount:
              typeof event.schema.commentsCount === 'number'
                ? event.schema.commentsCount
                : Array.isArray(event.schema.comments)
                  ? event.schema.comments.length
                  : 0,
          });
        }
        if (event.schema.lock) {
          locksMap.set(event.schema.id, {
            lock: cloneDeep(event.schema.lock),
            state: event.schema.state,
            pageIndex: event.pageIndex,
          });
        }
        appendHistory(createHistoryEntryFromEvent({ ...event, timestamp }));
        return;
      }

      if (event.type === 'delete') {
        schemasMap.delete(event.schemaId);
        commentsMap.delete(event.schemaId);
        locksMap.delete(event.schemaId);
        appendHistory(createHistoryEntryFromEvent({ ...event, timestamp }));
        return;
      }

      if (event.type === 'lock') {
        const currentEntry = schemasMap.get(event.schemaId);
        if (currentEntry) {
          schemasMap.set(event.schemaId, {
            ...currentEntry,
            pageIndex: event.pageIndex ?? currentEntry.pageIndex,
            schema: {
              ...currentEntry.schema,
              state: event.state || 'locked',
              updatedAt: timestamp,
              lastModifiedAt: timestamp,
              lastModifiedBy: event.actorId || safeActorId,
            },
          });
        }
        locksMap.set(event.schemaId, {
          lock: cloneDeep(event.lock),
          state: event.state || 'locked',
          pageIndex: event.pageIndex,
        });
        appendHistory(createHistoryEntryFromEvent({ ...event, timestamp }));
        return;
      }

      if (event.type === 'unlock') {
        const currentEntry = schemasMap.get(event.schemaId);
        if (currentEntry) {
          schemasMap.set(event.schemaId, {
            ...currentEntry,
            pageIndex: event.pageIndex ?? currentEntry.pageIndex,
            schema: {
              ...currentEntry.schema,
              state: 'draft',
              updatedAt: timestamp,
              lastModifiedAt: timestamp,
              lastModifiedBy: event.actorId || safeActorId,
            },
          });
        }
        locksMap.delete(event.schemaId);
        appendHistory(createHistoryEntryFromEvent({ ...event, timestamp }));
        return;
      }

      if (event.type === 'comment' || event.type === 'comment.created' || event.type === 'comment.updated' || event.type === 'comment.deleted') {
        if (!event.schemaId) return;
        const current = commentsMap.get(event.schemaId) || {};
        const currentComments = Array.isArray(current.comments) ? current.comments.slice() : [];
        const currentAnchors = Array.isArray(current.commentAnchors || current.commentsAnchors)
          ? cloneDeep(current.commentAnchors || current.commentsAnchors || [])
          : [];
        const { comments: nextComments, anchors: nextAnchors, commentsCount } = buildCommentCollectionsFromEvent(
          event,
          currentComments,
          currentAnchors,
        );
        commentsMap.set(event.schemaId, {
          comments: nextComments,
          commentAnchors: nextAnchors,
          commentsAnchors: nextAnchors,
          commentsCount,
        });

        const currentEntry = schemasMap.get(event.schemaId);
        if (currentEntry) {
          schemasMap.set(event.schemaId, {
            ...currentEntry,
            schema: {
              ...currentEntry.schema,
              updatedAt: timestamp,
              lastModifiedAt: timestamp,
              lastModifiedBy: event.actorId || safeActorId,
            },
          });
        }

        appendHistory(createHistoryEntryFromEvent({ ...event, timestamp }));
        return;
      }

      const currentEntry = schemasMap.get(event.schemaId);
      if (!currentEntry) return;
      const patch = cloneDeep(event.patch || {});
      const {
        comments,
        commentAnchors,
        commentsAnchors,
        commentsCount,
        lock,
        ...schemaPatch
      } = patch as Partial<SchemaForUI>;
      schemasMap.set(event.schemaId, {
        pageIndex: event.pageIndex ?? currentEntry.pageIndex,
        schema: {
          ...currentEntry.schema,
          ...schemaPatch,
          updatedAt:
            Number(schemaPatch.updatedAt) ||
            timestamp,
          lastModifiedAt:
            Number(schemaPatch.lastModifiedAt) ||
            Number(schemaPatch.updatedAt) ||
            timestamp,
          lastModifiedBy:
            (typeof schemaPatch.lastModifiedBy === 'string' && schemaPatch.lastModifiedBy) ||
            event.actorId ||
            safeActorId,
        },
      });
      if (comments || commentAnchors || commentsAnchors || typeof commentsCount === 'number') {
        commentsMap.set(event.schemaId, {
          comments: cloneDeep(comments || []),
          commentAnchors: cloneDeep(commentAnchors || commentsAnchors || []),
          commentsAnchors: cloneDeep(commentsAnchors || commentAnchors || []),
          commentsCount:
            typeof commentsCount === 'number'
              ? commentsCount
              : Array.isArray(comments)
                ? comments.length
                : 0,
        });
      }
      if (typeof lock !== 'undefined' || schemaPatch.state === 'locked') {
        if (lock) {
          locksMap.set(event.schemaId, {
            lock: cloneDeep(lock),
            state: (schemaPatch.state as SchemaCollaborativeState | undefined) || 'locked',
            pageIndex: event.pageIndex ?? currentEntry.pageIndex,
          });
        } else {
          locksMap.delete(event.schemaId);
        }
      }
      appendHistory(createHistoryEntryFromEvent({ ...event, timestamp }));
    }, localOrigin);
  };

  const setPresence = (patch: Partial<CollaborationPresence>) => {
    if (!room || !enabled) return;
    const current = (room.awareness.getLocalState() || {}) as CollaborationPresence;
    room.awareness.setLocalState({
      ...current,
      userId: safeActorId,
      color: current.color || actorColor || null,
      updatedAt: Date.now(),
      ...patch,
    } satisfies CollaborationPresence);
    emitPresence();
  };

  const acquireLockForSchema = (schemaId: string, lock: SchemaCollaborativeLock, pageIndex?: number) => {
    applyLocalChange({
      type: 'lock',
      schemaId,
      lock: {
        ...cloneDeep(lock),
        lockedBy: lock.lockedBy || safeActorId,
        lockedAt: lock.lockedAt || Date.now(),
        sessionId: lock.sessionId || safeSessionId,
      },
      pageIndex,
      actorId: safeActorId,
      sessionId: safeSessionId,
      timestamp: Date.now(),
    });
  };

  const releaseLockForSchema = (schemaId: string, pageIndex?: number) => {
    applyLocalChange({
      type: 'unlock',
      schemaId,
      pageIndex,
      actorId: safeActorId,
      sessionId: safeSessionId,
      timestamp: Date.now(),
    });
  };

  return {
    connect,
    disconnect,
    subscribe: (listener) => {
      eventListeners.add(listener);
      return () => eventListeners.delete(listener);
    },
    applyLocalChange,
    setPresence,
    acquireLock: acquireLockForSchema,
    releaseLock: releaseLockForSchema,
    appendHistory,
    getPresence: () =>
      room
        ? Array.from(room.awareness.getStates().values())
            .map((entry) => entry as CollaborationPresence | null)
            .filter((entry): entry is CollaborationPresence => Boolean(entry?.userId))
        : [],
    getHistory: () =>
      room ? cloneDeep(room.doc.getArray<CollaborationHistoryEntry>('history').toArray()) : [],
    getStatus: () => status,
    onStatusChange: (listener) => {
      statusListeners.add(listener);
      return () => statusListeners.delete(listener);
    },
    onPresenceChange: (listener) => {
      presenceListeners.add(listener);
      return () => presenceListeners.delete(listener);
    },
    onHistoryChange: (listener) => {
      historyListeners.add(listener);
      return () => historyListeners.delete(listener);
    },
  };
};

const resolveProviderName = (config: CollaborationSyncConfig): CollaborationProviderName =>
  config.provider || (config.url ? LEGACY_PROVIDER : YJS_LOCAL_PROVIDER);

const createCollaborationAdapter = (config: CollaborationSyncConfig): CollaborationAdapter =>
  resolveProviderName(config) === YJS_LOCAL_PROVIDER
    ? createYjsCollaborationProvider(config)
    : createLegacyCollaborationProvider(config);

export const useCollaborationSync = ({
  enabled,
  url,
  protocols,
  sessionId,
  provider,
  actorId,
  actorColor,
  users,
  reconnectMs = 2500,
  onEvent,
}: CollaborationSyncConfig & { onEvent?: (event: CollaborationEvent) => void }): CollaborationSyncState => {
  const [status, setStatus] = useState<CollaborationSyncState['status']>(
    enabled ? (provider || url ? 'connecting' : 'idle') : 'idle',
  );
  const [presence, setPresenceState] = useState<CollaborationPresence[]>([]);
  const [history, setHistoryState] = useState<CollaborationHistoryEntry[]>([]);
  const adapter = useMemo(
    () =>
      createCollaborationAdapter({
        enabled,
        url,
        protocols,
        sessionId,
        provider,
        actorId,
        actorColor,
        users,
        reconnectMs,
      }),
    [actorColor, actorId, enabled, protocols, provider, reconnectMs, sessionId, url, users],
  );

  useEffect(() => {
    const unsubscribeEvent = adapter.subscribe((event) => onEvent?.(event));
    const unsubscribeStatus = adapter.onStatusChange?.((nextStatus) => setStatus(nextStatus));
    const unsubscribePresence = adapter.onPresenceChange?.((nextPresence) => setPresenceState(nextPresence));
    const unsubscribeHistory = adapter.onHistoryChange?.((nextHistory) => setHistoryState(nextHistory));

    adapter.connect();
    setStatus(adapter.getStatus());
    setPresenceState(adapter.getPresence());
    setHistoryState(adapter.getHistory());

    return () => {
      unsubscribeEvent();
      unsubscribeStatus?.();
      unsubscribePresence?.();
      unsubscribeHistory?.();
      adapter.disconnect();
    };
  }, [adapter, onEvent]);

  const applyLocalChange = useCallback(
    (event: CollaborationEvent) => {
      adapter.applyLocalChange(event);
      setHistoryState(adapter.getHistory());
    },
    [adapter],
  );

  const setPresence = useCallback(
    (patch: Partial<CollaborationPresence>) => {
      adapter.setPresence(patch);
      setPresenceState(adapter.getPresence());
    },
    [adapter],
  );

  const appendHistory = useCallback(
    (entry: CollaborationHistoryEntry) => {
      adapter.appendHistory(entry);
      setHistoryState(adapter.getHistory());
    },
    [adapter],
  );

  const acquireLock = useCallback(
    (schemaId: string, lock: SchemaCollaborativeLock, pageIndex?: number) => {
      adapter.acquireLock(schemaId, lock, pageIndex);
      setHistoryState(adapter.getHistory());
    },
    [adapter],
  );

  const releaseLock = useCallback(
    (schemaId: string, pageIndex?: number) => {
      adapter.releaseLock(schemaId, pageIndex);
      setHistoryState(adapter.getHistory());
    },
    [adapter],
  );

  return {
    status,
    send: applyLocalChange,
    applyLocalChange,
    disconnect: adapter.disconnect,
    presence,
    history,
    setPresence,
    acquireLock,
    releaseLock,
    appendHistory,
  };
};
