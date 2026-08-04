import { describe, expect, it } from 'vitest';
import type { SchemaForUI } from '@sisad-pdfme/common';
import type { EffectiveCollaborationContext } from '@/sisad-pdfme/ui/collaborationContext';
import { resolveListViewItemDescriptor } from '@/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/listViewItemResolver';

const makeSchema = (overrides: Partial<SchemaForUI> & { id: string }): SchemaForUI =>
  ({
    id: overrides.id,
    name: overrides.name || overrides.id,
    type: overrides.type || 'text',
    position: { x: 0, y: 0 },
    width: 10,
    height: 10,
    ...overrides,
  }) as SchemaForUI;

const collaborationContext = {
  recipientOptions: [
    { id: 'recipient-1', name: 'Cliente Principal', color: '#2563EB' },
    { id: 'recipient-2', name: 'Avalista', color: '#D946EF' },
  ],
  recipientColorMap: new Map([
    ['recipient-1', '#2563EB'],
    ['recipient-2', '#D946EF'],
  ]),
  recipientNameMap: new Map([
    ['recipient-1', 'Cliente Principal'],
    ['recipient-2', 'Avalista'],
  ]),
  activeRecipientId: 'recipient-1',
  activeRecipient: { id: 'recipient-1', name: 'Cliente Principal', color: '#2563EB' },
  isGlobalView: false,
  canEditStructure: true,
  actorId: 'recipient-1',
  ownerRecipientId: 'recipient-1',
  ownerRecipientIds: ['recipient-1'],
  ownerRecipientName: 'Cliente Principal',
  ownerColor: '#2563EB',
  userColor: '#2563EB',
  actorColor: '#2563EB',
} as unknown as EffectiveCollaborationContext;

describe('resolveListViewItemDescriptor', () => {
  it('keeps the active owner row compact without a redundant badge', () => {
    const descriptor = resolveListViewItemDescriptor(
      makeSchema({ id: 'field-1', ownerRecipientId: 'recipient-1' }),
      collaborationContext,
    );

    expect(descriptor.badges).toEqual([]);
  });

  it('prefers the explicit ownerColor for the row accent', () => {
    const descriptor = resolveListViewItemDescriptor(
      makeSchema({ id: 'field-2', ownerColor: '#D97706', ownerRecipientId: 'recipient-2' }),
      collaborationContext,
    );

    expect(descriptor.ownerColor).toBe('#D97706');
    expect(descriptor.badges).toEqual([
      expect.objectContaining({ label: 'Asignado a Avalista', color: '#D97706' }),
    ]);
  });
});
