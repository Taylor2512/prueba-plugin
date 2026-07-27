import { describe, expect, it } from 'vitest';
import * as moduleUnderTest from '@/sisad-pdfme/ui/collaborationContext';
import { buildEffectiveCollaborationContext } from '@/sisad-pdfme/ui/collaborationContext';

describe('sisad-pdfme/ui/collaborationContext.ts', () => {
  it('imports without crashing', () => {
    expect(moduleUnderTest).toBeTruthy();
  });

  it('builds a recipient color map from collaboration recipients', () => {
    const context = buildEffectiveCollaborationContext(
      {
        recipientOptions: [
          { id: 'r1', name: 'Recipient 1', color: '#123456' },
          { id: 'r2', name: 'Recipient 2' },
        ],
        activeRecipientId: 'r1',
      } as any,
      'file-1',
    );

    expect(context.recipientColorMap.get('r1')).toBe('#123456');
    expect(context.recipientColorMap.has('r2')).toBe(false);
  });
});
