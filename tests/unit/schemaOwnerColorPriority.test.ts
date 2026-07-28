import { describe, expect, it } from 'vitest';
import { resolveSchemaOwnerColor } from '@/sisad-pdfme/collaboration/schemaOwnershipAppearance';

// owner = magenta, editor = naranja. El color de dueño debe reflejar al DUEÑO.
const users = [
  { id: 'owner-1', name: 'Avalista', color: '#D946EF' },
  { id: 'editor-1', name: 'Mesa de entrega', color: '#F97316' },
] as any;

describe('resolveSchemaOwnerColor — el color refleja al dueño, no al editor', () => {
  it('usa el color del recipient dueño (ownerRecipientIds), no el de lastModifiedBy', () => {
    expect(
      resolveSchemaOwnerColor(
        { ownerRecipientIds: ['owner-1'], lastModifiedBy: 'editor-1' } as any,
        users,
      ),
    ).toBe('#D946EF');
  });

  it('usa el color del recipient dueño (ownerRecipientId singular) sobre createdBy', () => {
    expect(
      resolveSchemaOwnerColor(
        { ownerRecipientId: 'owner-1', createdBy: 'editor-1' } as any,
        users,
      ),
    ).toBe('#D946EF');
  });

  it('cae a lastModifiedBy solo cuando no hay dueño', () => {
    expect(resolveSchemaOwnerColor({ lastModifiedBy: 'editor-1' } as any, users)).toBe('#F97316');
  });

  it('un ownerColor explícito del schema gana sobre la resolución por registro', () => {
    expect(
      resolveSchemaOwnerColor(
        { ownerColor: '#111827', ownerRecipientIds: ['owner-1'] } as any,
        users,
      ),
    ).toBe('#111827');
  });
});
