import { useCallback, useEffect, useRef, useState } from 'react';
import { cloneDeep, type SchemaForUI } from '@sisad-pdfme/common';
import type {
  SchemaComment,
  SchemaCommentAnchor,
  SchemaCollaborativeLock,
  SchemaCollaborativeState,
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

export type CollaborationSyncConfig = {
  enabled?: boolean;
  url?: string;
  protocols?: string | string[];
  sessionId?: string;
  actorId?: string;
  reconnectMs?: number;
  onEvent?: (event: CollaborationEvent) => void;
};

export type CollaborationSyncState = {
  status: 'idle' | 'connecting' | 'open' | 'closed' | 'error';
  send: (event: CollaborationEvent) => void;
  disconnect: () => void;
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
    nextSchemasList[targetPageIndex] = nextSchemasList[targetPageIndex].slice();
    nextSchemasList[targetPageIndex][schemaIndex] = updater(nextSchemasList[targetPageIndex][schemaIndex]);
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
        if (schema.state === nextState && shallowEqualRecord(schema.lock as Record<string, unknown> | undefined, nextLock)) {
          return schema;
        }
        return {
          ...schema,
          state: nextState,
          lock: nextLock,
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
        if (schema.state === 'draft' && !schema.lock) return schema;
        return {
          ...schema,
          state: 'draft',
          lock: undefined,
        };
      });
      if (updated) break;
    }
    if (!nextSchemasList.some((page, index) => page !== schemasList[index])) return schemasList;
    return nextSchemasList;
  }

  if (event.type === 'comment') {
    if (!event.schemaId || (!event.comment && !event.anchor)) return schemasList;
    for (let i = 0; i < nextSchemasList.length; i += 1) {
      const updated = updateSchemaOnPage(i, event.schemaId, (schema) => {
        const comments = Array.isArray(schema.comments) ? schema.comments.slice() : [];
        if (event.comment) {
          comments.push(cloneDeep(event.comment));
        }
        const anchors = Array.isArray(schema.commentAnchors) ? schema.commentAnchors.slice() : [];
        if (event.anchor) {
          anchors.push(cloneDeep(event.anchor));
        }
        return {
          ...schema,
          comments,
          commentAnchors: anchors,
          commentsAnchors: anchors,
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
      const patch = updateEvent.patch || {};
      const patchEntries = Object.entries(patch) as Array<[keyof SchemaForUI, unknown]>;
      const changed = patchEntries.some(([key, value]) => schema[key] !== value);
      if (!changed) return schema;
      return {
        ...schema,
        ...patch,
      };
    });
    if (updated) break;
  }
  if (!nextSchemasList.some((page, index) => page !== schemasList[index])) return schemasList;

  return nextSchemasList;
};

export const useCollaborationSync = ({
  enabled,
  url,
  protocols,
  sessionId,
  actorId,
  reconnectMs = 2500,
  onEvent,
}: CollaborationSyncConfig): CollaborationSyncState => {
  const [status, setStatus] = useState<CollaborationSyncState['status']>(enabled && url ? 'connecting' : 'idle');
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastEventRef = useRef<CollaborationEvent | null>(null);

  const disconnect = useCallback(() => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
    wsRef.current?.close();
    wsRef.current = null;
    setStatus(enabled && url ? 'closed' : 'idle');
  }, [enabled, url]);

  const send = useCallback(
    (event: CollaborationEvent) => {
      lastEventRef.current = event;
      const socket = wsRef.current;
      if (!socket || socket.readyState !== WebSocket.OPEN) return;
      socket.send(
        JSON.stringify({
          ...event,
          actorId: event.actorId || actorId,
          sessionId: event.sessionId || sessionId,
        }),
      );
    },
    [actorId, sessionId],
  );

  useEffect(() => {
    if (!enabled || !url || typeof WebSocket === 'undefined') {
      setStatus(enabled && url ? 'error' : 'idle');
      return undefined;
    }

    let canceled = false;
    const connect = () => {
      if (canceled) return;
      setStatus('connecting');
      const socket = new WebSocket(url, protocols);
      wsRef.current = socket;

      socket.onopen = () => {
        if (canceled) return;
        setStatus('open');
        if (lastEventRef.current) {
          socket.send(JSON.stringify(lastEventRef.current));
        } else {
          socket.send(JSON.stringify({ type: 'hello', sessionId, actorId }));
        }
      };

      socket.onmessage = (event) => {
        try {
          const payload = JSON.parse(String(event.data || '{}')) as CollaborationEvent;
          if (!payload || typeof payload !== 'object') return;
          if (payload.sessionId && sessionId && payload.sessionId === sessionId) return;
          onEvent?.(payload);
        } catch {
          // Ignore malformed payloads to keep collaboration resilient.
        }
      };

      socket.onerror = () => {
        if (canceled) return;
        setStatus('error');
      };

      socket.onclose = () => {
        if (canceled) return;
        setStatus('closed');
        if (reconnectMs > 0) {
          reconnectTimerRef.current = setTimeout(connect, reconnectMs);
        }
      };
    };

    connect();

    return () => {
      canceled = true;
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
      }
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, [actorId, enabled, onEvent, protocols, reconnectMs, sessionId, url]);

  return {
    status,
    send,
    disconnect,
  };
};
