import { describe, expect, test } from 'vitest';
import { resolveSmartDropPosition } from '../../src/sisad-pdfme/ui/components/Designer/Canvas/overlays/smartPlacement.js';
import { filterSchemasByCollisionScope } from '../../src/sisad-pdfme/ui/components/Designer/shared/schemaCollision.js';

describe('schema auto placement', () => {
  test('moves candidate when same-owner schema already occupies target area', () => {
    const pageSize = { width: 210, height: 297 };
    const schemaSize = { width: 45, height: 12 };
    const candidate = { x: 40, y: 60 };

    const existingSchemas = [
      {
        id: 'same-owner',
        position: { x: 40, y: 60 },
        width: 45,
        height: 12,
        ownerRecipientId: 'recipient-a',
        fileId: 'file-1',
        pageNumber: 1,
      },
      {
        id: 'other-owner',
        position: { x: 40, y: 60 },
        width: 45,
        height: 12,
        ownerRecipientId: 'recipient-b',
        fileId: 'file-1',
        pageNumber: 1,
      },
    ];

    const collisionScopedSchemas = filterSchemasByCollisionScope(existingSchemas, {
      id: 'new-schema',
      ownerRecipientId: 'recipient-a',
      fileId: 'file-1',
      pageNumber: 1,
    });

    const result = resolveSmartDropPosition({
      candidate,
      pageSize,
      schemaSize,
      existingSchemas: collisionScopedSchemas,
      stepMm: 6,
      maxAttempts: 12,
    });

    expect(result).not.toEqual(candidate);
    expect(result.x).toBeGreaterThanOrEqual(candidate.x);
    expect(result.y).toBeGreaterThanOrEqual(candidate.y);
  });

  test('keeps candidate when only other-owner schema overlaps', () => {
    const pageSize = { width: 210, height: 297 };
    const schemaSize = { width: 45, height: 12 };
    const candidate = { x: 40, y: 60 };

    const existingSchemas = [
      {
        id: 'other-owner',
        position: { x: 40, y: 60 },
        width: 45,
        height: 12,
        ownerRecipientId: 'recipient-b',
        fileId: 'file-1',
        pageNumber: 1,
      },
    ];

    const collisionScopedSchemas = filterSchemasByCollisionScope(existingSchemas, {
      id: 'new-schema',
      ownerRecipientId: 'recipient-a',
      fileId: 'file-1',
      pageNumber: 1,
    });

    const result = resolveSmartDropPosition({
      candidate,
      pageSize,
      schemaSize,
      existingSchemas: collisionScopedSchemas,
      stepMm: 6,
      maxAttempts: 12,
    });

    expect(collisionScopedSchemas).toHaveLength(0);
    expect(result).toEqual(candidate);
  });
});
