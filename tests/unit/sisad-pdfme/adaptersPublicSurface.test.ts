import { describe, expect, it } from 'vitest';
import type {
  SisadPdfmeDocument,
  SisadPdfmeDocumentsAdapter,
  SisadPdfmePersistenceAdapter,
  SisadPdfmeRecipient,
  SisadPdfmeRecipientsAdapter,
  SisadPdfmeSignatureProvider,
  SisadPdfmeSignatureProviderAdapter,
} from '@/sisad-pdfme/adapters';
import {
  createDocumentsAdapter,
  createPersistenceAdapter,
  createRecipientsAdapter,
  createSignatureProviderAdapter,
} from '@/sisad-pdfme/adapters';

type _AdaptersTypeContract = {
  document: SisadPdfmeDocument;
  documentsAdapter: SisadPdfmeDocumentsAdapter;
  persistenceAdapter: SisadPdfmePersistenceAdapter;
  recipient: SisadPdfmeRecipient;
  recipientsAdapter: SisadPdfmeRecipientsAdapter;
  signatureProvider: SisadPdfmeSignatureProvider;
  signatureProviderAdapter: SisadPdfmeSignatureProviderAdapter;
};

describe('sisad-pdfme adapters public surface', () => {
  it('exposes the public adapter factories', () => {
    expect(typeof createDocumentsAdapter).toBe('function');
    expect(typeof createPersistenceAdapter).toBe('function');
    expect(typeof createRecipientsAdapter).toBe('function');
    expect(typeof createSignatureProviderAdapter).toBe('function');
  });
});
