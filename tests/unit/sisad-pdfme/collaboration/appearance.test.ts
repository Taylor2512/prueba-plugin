import { describe, it, expect } from 'vitest';
import {
  decorateCollaborationUsers,
  LAB_COLLABORATOR_PALETTE,
} from '@/sisad-pdfme/collaboration/recipientPalette';
import {
  withAlpha,
  buildCollaboratorChipStyle,
  resolveCollaboratorById,
} from '@/sisad-pdfme/collaboration/appearance';
import {
  resolveSchemaOwnerColor,
  decorateSchemaWithCollaboration,
  decorateTemplateWithCollaboration,
} from '@/sisad-pdfme/collaboration/schemaOwnershipAppearance';

describe('decorateCollaborationUsers (default palette parity)', () => {
  it('assigns palette colors in order when none explicit', () => {
    const out = decorateCollaborationUsers([{ id: 'a' }, { id: 'b' }, { id: 'c' }] as any);
    expect(out.map((u) => u.color)).toEqual([
      LAB_COLLABORATOR_PALETTE[0],
      LAB_COLLABORATOR_PALETTE[1],
      LAB_COLLABORATOR_PALETTE[2],
    ]);
  });

  it('preserves explicit hex (normalized) and skips its palette slot', () => {
    const out = decorateCollaborationUsers([
      { id: 'a', color: '#2563eb' }, // == palette[0], normalized upper
      { id: 'b' },
    ] as any);
    expect(out[0].color).toBe('#2563EB');
    // b must NOT reuse the slot taken by a's explicit color
    expect(out[1].color).toBe(LAB_COLLABORATOR_PALETTE[1]);
  });

  it('expands 3-digit explicit hex', () => {
    const out = decorateCollaborationUsers([{ id: 'a', color: '#abc' }]);
    expect(out[0].color).toBe('#AABBCC');
  });
});

describe('withAlpha / chip style', () => {
  it('converts #RRGGBB to rgba', () => {
    expect(withAlpha('#2563EB', 0.1)).toBe('rgba(37, 99, 235, 0.1)');
  });
  it('returns non-6-digit unchanged', () => {
    expect(withAlpha('red', 0.1)).toBe('red');
  });
  it('builds chip style with active ring', () => {
    expect(buildCollaboratorChipStyle('#2563EB', true)).toEqual({
      color: '#2563EB',
      backgroundColor: 'rgba(37, 99, 235, 0.18)',
      boxShadow: 'inset 0 0 0 1px rgba(37, 99, 235, 0.45)',
    });
  });
  it('returns undefined for empty color', () => {
    expect(buildCollaboratorChipStyle('')).toBeUndefined();
  });
});

describe('resolveCollaboratorById', () => {
  const users = [{ id: 'u1', color: '#111111' }, { id: 'u2', color: '#222222' }];
  it('finds by trimmed id', () => {
    expect(resolveCollaboratorById(' u2 ', users)?.color).toBe('#222222');
  });
  it('returns null for missing', () => {
    expect(resolveCollaboratorById('nope', users)).toBeNull();
  });
});

describe('schema ownership appearance', () => {
  const users = [
    { id: 'owner1', color: '#AA0000' },
    { id: 'editor1', color: '#00BB00' },
  ];

  it('resolveSchemaOwnerColor prefers explicit userColor', () => {
    expect(resolveSchemaOwnerColor({ userColor: '#FF00FF', ownerRecipientId: 'owner1' } as any, users)).toBe('#FF00FF');
  });
  it('falls back to recipient color', () => {
    expect(resolveSchemaOwnerColor({ ownerRecipientId: 'owner1' } as any, users)).toBe('#AA0000');
  });
  it('returns empty when unresolved', () => {
    expect(resolveSchemaOwnerColor({} as any, users)).toBe('');
  });

  it('decorateSchemaWithCollaboration derives owner fields + colors', () => {
    const out = decorateSchemaWithCollaboration(
      { name: 's1', type: 'text', ownerRecipientId: 'owner1', lastModifiedBy: 'editor1' } as any,
      users,
    );
    expect(out.ownerRecipientId).toBe('owner1');
    expect((out as any).ownerMode).toBe('single');
    expect((out as any).ownerColor).toBe('#AA0000');
    expect((out as any).userColor).toBe('#00BB00'); // author = lastModifiedBy
  });

  it('decorateTemplateWithCollaboration maps all pages and deep-clones', () => {
    const template = { basePdf: { width: 1, height: 1 }, schemas: [[{ name: 's', type: 'text', ownerRecipientId: 'owner1' }]] } as any;
    const out = decorateTemplateWithCollaboration(template, users);
    expect(out.schemas[0][0]).toMatchObject({ ownerRecipientId: 'owner1', ownerColor: '#AA0000' });
    expect(out.schemas[0][0]).not.toBe(template.schemas[0][0]);
  });
});
