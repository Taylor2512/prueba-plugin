import { describe, expect, it } from 'vitest';
import type { SchemaForUI } from '@sisad-pdfme/common';
import { buildSchemaAssignments } from '@sisad-pdfme/common';
import { applyCollaborationEvent } from '../../src/sisad-pdfme/ui/collaboration.js';

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

    expect(assignments['recipient-1']['file-1']['0']).toEqual(['uid-a']);
    expect(assignments['recipient-1']['file-1']['1']).toEqual(['uid-b']);
    expect(assignments['recipient-2']['file-1']['1']).toEqual(['uid-b']);
  });
});
