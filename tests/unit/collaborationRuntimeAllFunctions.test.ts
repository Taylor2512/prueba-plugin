import { describe, expect, it } from 'vitest';
import type { SchemaForUI } from '@sisad-pdfme/common';
import {
  applyCollaborationEvent,
  createYjsCollaborationProvider,
  diffCollaborationEvents,
} from '../../src/sisad-pdfme/ui/collaboration.js';

const schema = (patch: Partial<SchemaForUI> = {}): SchemaForUI =>
  ({
    id: patch.id || 'schema-1',
    name: patch.name || 'campo',
    type: patch.type || 'text',
    position: patch.position || { x: 0, y: 0 },
    width: patch.width || 10,
    height: patch.height || 10,
    ...patch,
  }) as SchemaForUI;

describe('collaboration runtime exported functions', () => {
  it('applies create/delete/update events and respects page index', () => {
    const source = [[schema({ id: 'a' })], [schema({ id: 'b' })]];

    const created = applyCollaborationEvent(source, {
      type: 'create',
      schema: schema({ id: 'c' }),
      pageIndex: 1,
      timestamp: 10,
    });
    expect(created[1].map((s) => s.id)).toEqual(['b', 'c']);

    const updated = applyCollaborationEvent(created, {
      type: 'update',
      schemaId: 'c',
      pageIndex: 1,
      patch: { content: 'nuevo' },
      actorId: 'u1',
      timestamp: 11,
    });
    expect(updated[1].find((s) => s.id === 'c')?.content).toBe('nuevo');

    const deleted = applyCollaborationEvent(updated, {
      type: 'delete',
      schemaId: 'a',
      pageIndex: 0,
      timestamp: 12,
    });
    expect(deleted[0].find((s) => s.id === 'a')).toBeUndefined();
  });

  it('applies lock/unlock events and keeps metadata', () => {
    const source = [[schema({ id: 'lock-1', state: 'draft' })]];

    const locked = applyCollaborationEvent(source, {
      type: 'lock',
      schemaId: 'lock-1',
      lock: { lockedBy: 'u1', lockedAt: 100 },
      state: 'locked',
      actorId: 'u1',
      timestamp: 100,
    });
    expect(locked[0][0].state).toBe('locked');
    expect(locked[0][0].lock?.lockedBy).toBe('u1');

    const unlocked = applyCollaborationEvent(locked, {
      type: 'unlock',
      schemaId: 'lock-1',
      actorId: 'u2',
      timestamp: 200,
    });
    expect(unlocked[0][0].state).toBe('draft');
    expect(unlocked[0][0].lock).toBeUndefined();
    expect(unlocked[0][0].lastModifiedBy).toBe('u2');
  });

  it('handles comment lifecycle including delete and anchor sync', () => {
    const source = [[schema({ id: 'c1', comments: [], commentAnchors: [] })]];

    const created = applyCollaborationEvent(source, {
      type: 'comment.created',
      schemaId: 'c1',
      actorId: 'u1',
      timestamp: 10,
      comment: {
        id: 'comment-1',
        text: 'Hola',
        timestamp: 10,
        anchor: { id: 'comment-1', pageNumber: 1, x: 1, y: 2 },
      },
      anchor: { id: 'comment-1', pageNumber: 1, x: 1, y: 2 },
    });
    expect(created[0][0].commentsCount).toBe(1);
    expect(created[0][0].commentAnchors?.length).toBe(1);

    const removed = applyCollaborationEvent(created, {
      type: 'comment.deleted',
      schemaId: 'c1',
      actorId: 'u2',
      timestamp: 20,
      commentId: 'comment-1',
    });

    expect(removed[0][0].comments).toEqual([]);
    expect(removed[0][0].commentAnchors).toEqual([]);
    expect(removed[0][0].commentsCount).toBe(0);
  });

  it('diffs schemas into create/delete/update events', () => {
    const previous = [[schema({ id: 'a', name: 'old' })]];
    const next = [[schema({ id: 'b', name: 'new' }), schema({ id: 'a', name: 'changed' })]];

    const events = diffCollaborationEvents(previous, next, {
      actorId: 'u1',
      sessionId: 's1',
      timestamp: 999,
    });

    expect(events.some((event) => event.type === 'create' && 'schema' in event && event.schema.id === 'b')).toBe(true);
    expect(events.some((event) => event.type === 'update' && 'schemaId' in event && event.schemaId === 'a')).toBe(true);
    expect(events.some((event) => event.type === 'delete' && 'schemaId' in event && event.schemaId === 'a')).toBe(false);
  });

  it('yjs provider manages status, presence and history in local mode', () => {
    const provider = createYjsCollaborationProvider({
      enabled: true,
      sessionId: 'session-test',
      actorId: 'u1',
      actorColor: '#111111',
      users: [{ id: 'u1', name: 'User 1', color: '#111111' }],
    });

    provider.connect();
    expect(provider.getStatus()).toBe('open');

    provider.setPresence({ name: 'User 1', role: 'editor' });
    const presence = provider.getPresence();
    expect(presence.some((entry) => entry.userId === 'u1')).toBe(true);

    provider.appendHistory({
      id: 'h1',
      type: 'create',
      actorId: 'u1',
      timestamp: Date.now(),
      schemaId: 'schema-1',
      pageIndex: 0,
      summary: 'created',
    });
    expect(provider.getHistory().some((entry) => entry.id === 'h1')).toBe(true);

    provider.disconnect();
    expect(['closed', 'idle']).toContain(provider.getStatus());
  });
});
