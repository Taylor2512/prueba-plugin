import { describe, expect, it } from 'vitest';
import { filterSchemasByCollisionScope } from '@/sisad-pdfme/ui/components/Designer/shared/schemaCollision.js';

describe('filterSchemasByCollisionScope', () => {
  const schemas = [
    { id: 's-1', ownerRecipientId: 'rec-a', fileId: 'file-1', pageNumber: 1 },
    { id: 's-2', ownerRecipientId: 'rec-b', fileId: 'file-1', pageNumber: 1 },
    { id: 's-3', ownerRecipientIds: ['rec-a', 'rec-z'], fileId: 'file-1', pageNumber: 1 },
    { id: 's-4', ownerRecipientId: 'rec-a', fileId: 'file-1', pageNumber: 2 },
  ];

  it('returns only schemas with same owner + same file + same page', () => {
    const result = filterSchemasByCollisionScope(
      schemas,
      { id: 'new', ownerRecipientId: 'rec-a', fileId: 'file-1', pageNumber: 1 },
      undefined,
    );
    expect(result.map((s) => s.id)).toEqual(['s-1', 's-3']);
  });

  it('excludes schemas on a different page', () => {
    const result = filterSchemasByCollisionScope(
      schemas,
      { id: 'new', ownerRecipientId: 'rec-a', fileId: 'file-1', pageNumber: 2 },
    );
    expect(result.map((s) => s.id)).toEqual(['s-4']);
  });

  it('excludes schemas from a different file', () => {
    const result = filterSchemasByCollisionScope(
      schemas,
      { id: 'new', ownerRecipientId: 'rec-a', fileId: 'file-2', pageNumber: 1 },
    );
    expect(result).toHaveLength(0);
  });

  it('does not include schema being tested (self-exclusion)', () => {
    const result = filterSchemasByCollisionScope(
      schemas,
      { id: 's-1', ownerRecipientId: 'rec-a', fileId: 'file-1', pageNumber: 1 },
    );
    expect(result.map((s) => s.id)).not.toContain('s-1');
  });

  it('excludes different-owner schemas', () => {
    const result = filterSchemasByCollisionScope(
      schemas,
      { id: 'new', ownerRecipientId: 'rec-b', fileId: 'file-1', pageNumber: 1 },
    );
    expect(result.map((s) => s.id)).toEqual(['s-2']);
  });

  it('fallback ownership returns empty when no match', () => {
    const result = filterSchemasByCollisionScope(
      [{ id: 's-5', fileId: 'file-1', pageNumber: 1 }],
      { id: 'new', fileId: 'file-1', pageNumber: 1 },
      { ownerRecipientId: 'rec-b' },
    );
    expect(result).toHaveLength(0);
  });

  it('supports ownerRecipientIds array on reference schema', () => {
    const result = filterSchemasByCollisionScope(
      [
        { id: 's-a', ownerRecipientId: 'rec-a', fileId: 'file-1', pageNumber: 1 },
        { id: 's-b', ownerRecipientId: 'rec-b', fileId: 'file-1', pageNumber: 1 },
        { id: 's-c', ownerRecipientId: 'rec-c', fileId: 'file-1', pageNumber: 1 },
      ],
      { id: 'new', ownerRecipientIds: ['rec-a', 'rec-b'], fileId: 'file-1', pageNumber: 1 },
    );
    expect(result.map((s) => s.id)).toContain('s-a');
    expect(result.map((s) => s.id)).toContain('s-b');
    expect(result.map((s) => s.id)).not.toContain('s-c');
  });

  it('returns empty when schemas array is empty', () => {
    const result = filterSchemasByCollisionScope(
      [],
      { id: 'new', ownerRecipientId: 'rec-a', fileId: 'file-1', pageNumber: 1 },
    );
    expect(result).toHaveLength(0);
  });
});
