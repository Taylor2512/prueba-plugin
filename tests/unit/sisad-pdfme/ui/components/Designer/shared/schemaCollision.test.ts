import { describe, expect, it } from 'vitest';
import { filterSchemasByCollisionScope } from '@/sisad-pdfme/ui/components/Designer/shared/schemaCollision.js';

describe('sisad-pdfme/ui/components/Designer/shared/schemaCollision.ts', () => {
  it('filters by the same owner, document/page scope and accepts fallback ownership', () => {
    const schemas = [
      { id: 's-1', ownerRecipientId: 'recipient-a', fileId: 'file-1', pageNumber: 1 },
      { id: 's-2', ownerRecipientId: 'recipient-b', fileId: 'file-1', pageNumber: 1 },
      { id: 's-3', ownerRecipientIds: ['recipient-a', 'recipient-z'], fileId: 'file-1', pageNumber: 1 },
      { id: 's-4', ownerRecipientId: 'recipient-a', fileId: 'file-1', pageNumber: 2 },
    ];

    const filtered = filterSchemasByCollisionScope(
      schemas,
      {
        id: 'new',
        ownerRecipientId: 'recipient-a',
        fileId: 'file-1',
        pageNumber: 1,
      },
      undefined,
    );

    expect(filtered.map((schema) => schema.id)).toEqual(['s-1', 's-3']);

    const fallback = filterSchemasByCollisionScope(
      [{ id: 's-5', fileId: 'file-1', pageNumber: 1 }],
      { id: 'new', fileId: 'file-1', pageNumber: 1 },
      { ownerRecipientId: 'recipient-b' },
    );

    expect(fallback).toEqual([]);
  });
});
