import { describe, expect, it, vi } from 'vitest';

import { normalizeHostData } from '@/sisad-pdfme/integration/normalizeHostData';

describe('normalizeHostData', () => {
  it('normaliza host data usando adapters y conserva referencias derivadas', () => {
    const recipientsAdapter = {
      toRecipient: vi.fn((input: { id: string; name: string }) => ({
        id: input.id,
        name: input.name,
      })),
      toRecipients: vi.fn((inputs: Array<{ id: string; name: string }>) =>
        inputs.map((input) => ({ id: input.id, name: input.name })),
      ),
    };
    const documentsAdapter = {
      toDocument: vi.fn((input: { id: string; label: string }) => ({
        id: input.id,
        label: input.label,
        name: input.label,
      })),
      toDocuments: vi.fn((inputs: Array<{ id: string; label: string }>) =>
        inputs.map((input) => ({ id: input.id, label: input.label, name: input.label })),
      ),
    };
    const signaturesAdapter = {
      toProvider: vi.fn((input: { key: string; label: string }) => ({
        key: input.key,
        label: input.label,
      })),
      toProviders: vi.fn((inputs: Array<{ key: string; label: string }>) =>
        inputs.map((input) => ({ key: input.key, label: input.label })),
      ),
    };
    const template = { schemas: [[{ type: 'text' }]] };
    const inputs = [{ value: 'persisted' }];

    const normalized = normalizeHostData({
      template,
      inputs,
      recipients: [{ id: 'alice', name: 'Alice' }],
      documents: [{ id: 'doc-1', label: 'Documento 1' }],
      signatureProviders: [{ key: 'prov-1', label: 'Firma 1' }],
      adapters: {
        recipients: recipientsAdapter as never,
        documents: documentsAdapter as never,
        signatures: signaturesAdapter as never,
      },
    });

    expect(recipientsAdapter.toRecipients).toHaveBeenCalledWith([{ id: 'alice', name: 'Alice' }]);
    expect(documentsAdapter.toDocuments).toHaveBeenCalledWith([{ id: 'doc-1', label: 'Documento 1' }]);
    expect(signaturesAdapter.toProviders).toHaveBeenCalledWith([{ key: 'prov-1', label: 'Firma 1' }]);
    expect(normalized.inputs).toEqual(inputs);
    expect(normalized.inputs).not.toBe(inputs);
    expect(normalized.recipients).toEqual([{ id: 'alice', name: 'Alice' }]);
    expect(normalized.documents).toEqual([{ id: 'doc-1', label: 'Documento 1', name: 'Documento 1' }]);
    expect(normalized.signatureProviders).toEqual([{ key: 'prov-1', label: 'Firma 1' }]);
    expect(normalized.activeRecipientId).toBe('alice');
    expect(normalized.template).not.toBe(template);
    expect(normalized.template).toEqual(template);
  });

  it('usa el template como fuente de inputs cuando el host no los entrega', () => {
    const normalized = normalizeHostData({
      template: { schemas: [[{ type: 'text' }], [{ type: 'signature' }]] },
      recipients: [],
      documents: [],
      signatureProviders: [],
    });

    expect(Array.isArray(normalized.inputs)).toBe(true);
    expect(normalized.activeRecipientId).toBe('');
    expect(normalized.recipients).toHaveLength(0);
    expect(normalized.documents).toHaveLength(0);
    expect(normalized.signatureProviders).toHaveLength(0);
  });
});
