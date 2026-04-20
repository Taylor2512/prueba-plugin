import { describe, expect, it } from 'vitest';
import type { SchemaForUI } from '@sisad-pdfme/common';
import { buildSchemaAssignments } from '@sisad-pdfme/common';
import { applySchemaCollaborativeDefaults, resolveSchemaCollaborativeMetadata } from '../../src/sisad-pdfme/ui/designerEngine.js';

describe('collaboration metadata', () => {
  it('initializes collaborative fields for newly created schemas without keeping stale locks', () => {
    const schema = {
      id: 'schema-1',
      name: 'campo-1',
      type: 'text',
      state: 'locked',
      lock: {
        lockedBy: 'user-old',
        lockedAt: 1700000000000,
      },
    } as SchemaForUI;

    const next = applySchemaCollaborativeDefaults(schema, {
      pageIndex: 2,
      pageNumber: 3,
      totalPages: 8,
      timestamp: 1700000000123,
      fileId: 'file-a',
      actorId: 'user-new',
      ownerRecipientIds: ['recipient-1', 'recipient-2'],
    });

    expect(next.schemaUid).toBe('schema-1');
    expect(next.fileId).toBe('file-a');
    expect(next.pageNumber).toBe(3);
    expect(next.ownerRecipientId).toBe('recipient-1');
    expect(next.ownerRecipientIds).toEqual(['recipient-1', 'recipient-2']);
    expect(next.createdBy).toBe('user-new');
    expect(next.lastModifiedBy).toBe('user-new');
    expect(next.createdAt).toBe(1700000000123);
    expect(next.updatedAt).toBe(1700000000123);
    expect(next.state).toBe('locked');
    expect(next.lock).toBeUndefined();
  });

  it('resolves collaboration metadata from top-level schema fields and config fallback', () => {
    const schema = {
      id: 'schema-2',
      name: 'campo-2',
      type: 'text',
      schemaUid: 'schema-uid-2',
      fileId: 'file-2',
      pageNumber: 4,
      ownerRecipientIds: ['recipient-a'],
    } as SchemaForUI;

    const metadata = resolveSchemaCollaborativeMetadata(schema);
    expect(metadata?.schemaUid).toBe('schema-uid-2');
    expect(metadata?.fileId).toBe('file-2');
    expect(metadata?.pageNumber).toBe(4);
    expect(metadata?.ownerRecipientIds).toEqual(['recipient-a']);
  });

  it('builds recipient/file/page assignments from collaborative schema fields', () => {
    const assignments = buildSchemaAssignments([
      [
        {
          id: 'schema-1',
          name: 'field-a',
          type: 'text',
          schemaUid: 'uid-a',
          fileId: 'file-a',
          ownerRecipientId: 'recipient-1',
        } as SchemaForUI,
        {
          id: 'schema-2',
          name: 'field-b',
          type: 'text',
          schemaUid: 'uid-b',
          fileId: 'file-a',
          ownerRecipientIds: ['recipient-1', 'recipient-2'],
        } as SchemaForUI,
      ],
    ]);

    expect(assignments['recipient-1']['file-a']['0']).toEqual(['uid-a', 'uid-b']);
    expect(assignments['recipient-2']['file-a']['0']).toEqual(['uid-b']);
  });
});
