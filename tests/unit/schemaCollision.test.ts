import { describe, expect, test } from 'vitest';
import { filterSchemasByCollisionScope } from '../../src/sisad-pdfme/ui/components/Designer/shared/schemaCollision.js';

describe('schemaCollision scope filter', () => {
  test('returns only schemas that share owner and page/file scope', () => {
    const schemas = [
      {
        id: 's-1',
        ownerRecipientId: 'recipient-a',
        fileId: 'file-1',
        pageNumber: 1,
        position: { x: 10, y: 10 },
        width: 40,
        height: 10,
      },
      {
        id: 's-2',
        ownerRecipientId: 'recipient-b',
        fileId: 'file-1',
        pageNumber: 1,
        position: { x: 10, y: 24 },
        width: 40,
        height: 10,
      },
      {
        id: 's-3',
        ownerRecipientId: 'recipient-a',
        fileId: 'file-2',
        pageNumber: 1,
        position: { x: 60, y: 10 },
        width: 40,
        height: 10,
      },
      {
        id: 's-4',
        ownerRecipientId: 'recipient-a',
        fileId: 'file-1',
        pageNumber: 2,
        position: { x: 60, y: 24 },
        width: 40,
        height: 10,
      },
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

    expect(filtered.map((schema) => schema.id)).toEqual(['s-1']);
  });

  test('uses fallback ownership for unassigned candidate schemas', () => {
    const schemas = [
      { id: 's-1', ownerRecipientId: 'recipient-a', fileId: 'file-1', pageNumber: 1 },
      { id: 's-2', ownerRecipientId: 'recipient-b', fileId: 'file-1', pageNumber: 1 },
      { id: 's-3', fileId: 'file-1', pageNumber: 1 },
    ];

    const filtered = filterSchemasByCollisionScope(
      schemas,
      {
        id: 'new',
        fileId: 'file-1',
        pageNumber: 1,
      },
      {
        ownerRecipientId: 'recipient-b',
      },
    );

    expect(filtered.map((schema) => schema.id)).toEqual(['s-2']);
  });
});
