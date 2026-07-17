import { describe, expect, it } from 'vitest';
import { createRecipientPermissionResolver } from '@/sisad-pdfme/recipients/recipientPermissionResolver';

describe('recipientPermissionResolver', () => {
  it.each(['viewer', 'reviewer', 'commenter'])('bloquea edición estructural para %s', (role) => {
    const resolver = createRecipientPermissionResolver();
    expect(resolver.canEditStructure({ id: role, label: role, role } as any)).toBe(false);
  });

  it.each(['signer', 'editor', 'coordinator', ''])('permite edición para rol %s por defecto', (role) => {
    const resolver = createRecipientPermissionResolver();
    expect(resolver.canEditStructure({ id: 'r', label: 'R', role } as any)).toBe(true);
  });

  it('bloquea recipients deshabilitados y schemas locked', () => {
    const resolver = createRecipientPermissionResolver();
    expect(resolver.canEditStructure({ id: 'r', label: 'R', disabled: true } as any)).toBe(false);
    expect(resolver.canAssign({ locked: true } as any, { id: 'r', label: 'R', role: 'signer' } as any)).toBe(false);
  });

  it('respeta overrides y flags allowUnassigned/allowShared', () => {
    const forced = createRecipientPermissionResolver({ canEditStructure: false });
    expect(forced.canEditStructure({ id: 'r', label: 'R', role: 'editor' } as any)).toBe(false);

    const resolver = createRecipientPermissionResolver({
      config: { allowUnassigned: false, allowShared: false } as any,
    });
    const editor = { id: 'r', label: 'R', role: 'editor' } as any;
    expect(resolver.canUnassign(editor)).toBe(false);
    expect(resolver.canShare(editor)).toBe(false);
  });
});
