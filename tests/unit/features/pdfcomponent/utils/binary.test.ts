import { describe, it, expect } from 'vitest';
import { normalizeHostData } from '@/sisad-pdfme/integration/normalizeHostData';

describe('sisad-pdfme/integration normalizeHostData barrel', () => {
  it('normaliza datos de host sin depender del árbol de features', () => {
    const normalized = normalizeHostData({
      template: { schemas: [[]] } as never,
      recipients: [{ id: 'u1', name: 'User 1' }],
      documents: [{ id: 'doc-1', name: 'Documento 1' }],
      signatureProviders: [{ key: 'provider-1', label: 'Provider 1' }],
    });

    expect(normalized.recipients).toHaveLength(1);
    expect(normalized.documents).toHaveLength(1);
    expect(normalized.signatureProviders).toHaveLength(1);
    expect(normalized.activeRecipientId).toBe('u1');
  });
});
