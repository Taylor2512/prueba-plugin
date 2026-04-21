import { describe, expect, it } from 'vitest';
import type { SchemaForUI } from '@sisad-pdfme/common';
import { buildSchemaAssignments } from '@sisad-pdfme/common';
import {
  applyCollaborationEvent,
  createYjsCollaborationProvider,
  diffCollaborationEvents,
} from '../../src/sisad-pdfme/ui/collaboration.js';

describe('collaboration sync helpers', () => {
  it('applies remote comments without mutating untouched pages', () => {
    const schema = {
      id: 'schema-1',
      name: 'field-a',
      type: 'text',
      comments: [],
    } as SchemaForUI;
    const secondSchema = {
      id: 'schema-2',
      name: 'field-b',
      type: 'text',
    } as SchemaForUI;

    const source = [[schema], [secondSchema]];
    const next = applyCollaborationEvent(source, {
      type: 'comment',
      schemaId: 'schema-1',
      comment: {
        id: 'comment-1',
        authorId: 'user-1',
        authorName: 'User 1',
        timestamp: 1700000000000,
        text: 'Need review',
      },
    });

    expect(next[0]).not.toBe(source[0]);
    expect(next[1]).toBe(source[1]);
    expect(next[0][0].comments?.[0]?.text).toBe('Need review');
  });

  it('preserves the original tree when a remote event does not match any schema', () => {
    const schema = {
      id: 'schema-1',
      name: 'field-a',
      type: 'text',
    } as SchemaForUI;

    const source = [[schema]];
    const next = applyCollaborationEvent(source, {
      type: 'update',
      schemaId: 'missing',
      patch: { readOnly: true },
    });

    expect(next).toBe(source);
  });

  it('ignores stale remote updates when the schema already has a newer timestamp', () => {
    const schema = {
      id: 'schema-1',
      name: 'field-a',
      type: 'text',
      content: 'Actual',
      updatedAt: 1700000003000,
      lastModifiedAt: 1700000003000,
    } as SchemaForUI;

    const source = [[schema]];
    const next = applyCollaborationEvent(source, {
      type: 'update',
      schemaId: 'schema-1',
      actorId: 'user-old',
      timestamp: 1700000001000,
      patch: { content: 'Obsoleto', updatedAt: 1700000001000 },
    });

    expect(next).toBe(source);
    expect(next[0][0].content).toBe('Actual');
  });

  it('deduplicates remote comments by id and updates audit metadata', () => {
    const schema = {
      id: 'schema-1',
      name: 'field-a',
      type: 'text',
      comments: [
        {
          id: 'comment-1',
          authorId: 'user-1',
          authorName: 'User 1',
          timestamp: 1700000000000,
          text: 'Existing',
        },
      ],
    } as SchemaForUI;

    const source = [[schema]];
    const next = applyCollaborationEvent(source, {
      type: 'comment',
      schemaId: 'schema-1',
      actorId: 'user-2',
      timestamp: 1700000004000,
      comment: {
        id: 'comment-1',
        authorId: 'user-2',
        authorName: 'User 2',
        timestamp: 1700000004000,
        text: 'Duplicate',
      },
    });

    expect(next[0][0].comments).toHaveLength(1);
    expect(next[0][0].comments?.[0]?.text).toBe('Duplicate');
    expect(next[0][0].commentsCount).toBe(1);
    expect(next[0][0].lastModifiedBy).toBe('user-2');
    expect(next[0][0].lastModifiedAt).toBe(1700000004000);
  });

  it('groups assignments by recipient, file and page', () => {
    const assignments = buildSchemaAssignments([
      [
        {
          id: 'schema-1',
          name: 'field-a',
          type: 'text',
          schemaUid: 'uid-a',
          fileId: 'file-1',
          ownerRecipientId: 'recipient-1',
        } as SchemaForUI,
      ],
      [
        {
          id: 'schema-2',
          name: 'field-b',
          type: 'text',
          schemaUid: 'uid-b',
          fileId: 'file-1',
          ownerRecipientIds: ['recipient-1', 'recipient-2'],
        } as SchemaForUI,
      ],
    ]);

    expect(assignments['recipient-1']['file-1']['1']).toEqual(['uid-a']);
    expect(assignments['recipient-1']['file-1']['2']).toEqual(['uid-b']);
    expect(assignments['recipient-2']['file-1']['2']).toEqual(['uid-b']);
  });

  it('builds collaboration events from schema snapshot diffs', () => {
    const before = [[{ id: 'schema-1', name: 'field-a', type: 'text' } as SchemaForUI]];
    const after = [[
      { id: 'schema-1', name: 'field-a', type: 'text', content: 'Updated' } as SchemaForUI,
      { id: 'schema-2', name: 'field-b', type: 'text' } as SchemaForUI,
    ]];

    const events = diffCollaborationEvents(before, after, {
      actorId: 'user-1',
      sessionId: 'session-1',
      timestamp: 1700000005000,
    });

    expect(events).toEqual([
      expect.objectContaining({
        type: 'update',
        schemaId: 'schema-1',
        patch: expect.objectContaining({ content: 'Updated' }),
      }),
      expect.objectContaining({
        type: 'create',
        schema: expect.objectContaining({ id: 'schema-2' }),
      }),
    ]);
  });

  it('syncs presence and history through the local yjs collaboration provider', () => {
    const provider = createYjsCollaborationProvider({
      enabled: true,
      provider: 'yjs',
      sessionId: 'test-room',
      actorId: 'sales-user-1',
      actorColor: '#2563EB',
      users: [{ id: 'sales-user-1', name: 'Ventas Ejecutivas', color: '#2563EB' }],
    });

    provider.connect();
    provider.setPresence({
      activeDocumentId: 'file-a',
      activePage: 1,
      activeSchemaIds: ['schema-1'],
      interactionPhase: 'editing',
    });
    provider.applyLocalChange({
      type: 'create',
      pageIndex: 0,
      actorId: 'sales-user-1',
      sessionId: 'test-room',
      timestamp: 1700000006000,
      schema: {
        id: 'schema-1',
        name: 'field-a',
        type: 'text',
        schemaUid: 'uid-a',
        createdBy: 'sales-user-1',
        userColor: '#2563EB',
      } as SchemaForUI,
    });

    expect(provider.getStatus()).toBe('open');
    expect(provider.getPresence()).toEqual([
      expect.objectContaining({
        userId: 'sales-user-1',
        activeDocumentId: 'file-a',
        activePage: 1,
        activeSchemaIds: ['schema-1'],
      }),
    ]);
    expect(provider.getHistory()).toEqual([
      expect.objectContaining({
        type: 'schema.created',
        actorId: 'sales-user-1',
      }),
    ]);

    provider.disconnect();
  });
});
