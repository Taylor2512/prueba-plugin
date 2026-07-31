import { describe, it, expect } from 'vitest';
import type { SchemaForUI } from '@sisad-pdfme/common';
import type { EffectiveCollaborationContext } from '@/sisad-pdfme/ui/collaborationContext';
import {
  buildDetailHeaderSummary,
} from '@/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailHeaderUtils';

const schema = (overrides: Partial<SchemaForUI> & { id: string }): SchemaForUI =>
  ({
    id: overrides.id,
    name: overrides.name || overrides.id,
    type: overrides.type || 'text',
    position: { x: 12, y: 24 },
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

describe('sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailHeaderUtils.ts', () => {
  it('keeps the owner color in the header summary', () => {
    const summary = buildDetailHeaderSummary(
      schema({
        id: 'field-1',
        ownerColor: '#D97706',
        ownerRecipientId: 'recipient-2',
      }),
      null,
      collaborationContext,
    );

    expect(summary.recipientColor).toBe('#D97706');
    expect(summary.ownerName).toBe('recipient-2');
  });

  it('imports without crashing', () => {
    expect(buildDetailHeaderSummary).toBeTypeOf('function');
  });
});
