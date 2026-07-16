import { describe, expect, it } from 'vitest';
import { createLabPdfmeConfig } from '@/features/pdfcomponent/integration/createLabPdfmeConfig';

describe('features/pdfcomponent/integration/createLabPdfmeConfig', () => {
  it('propagates active recipient overrides and global view into collaboration config', () => {
    const config = createLabPdfmeConfig({
      example: {
        id: 'example-1',
        title: 'Example',
        template: { schemas: [[]] } as any,
        collaboration: {
          activeUserId: 'recipient-1',
          isGlobalView: false,
          users: [{ id: 'recipient-1', name: 'Cliente' }],
        },
      } as any,
      normalized: {
        template: { schemas: [[]] } as any,
        inputs: [],
        recipients: [{ id: 'recipient-1', name: 'Cliente' }],
        documents: [],
        activeRecipientId: 'recipient-1',
        signatureProviders: [],
      },
      activeRecipientId: 'recipient-2',
      isGlobalView: true,
    });

    expect(config.config.collaboration.activeRecipientId).toBe('recipient-2');
    expect(config.config.collaboration.isGlobalView).toBe(true);
    expect(config.runtimeOptions.collaboration?.activeRecipientId).toBe('recipient-2');
    expect(config.runtimeOptions.collaboration?.isGlobalView).toBe(true);
  });

  it('opens the docs tab by default for multi-document routing examples', () => {
    const config = createLabPdfmeConfig({
      example: {
        id: 'multi-document-routing',
        title: 'Multidocumento integral',
        template: { schemas: [[]] } as any,
        runtimeOptions: {
          uploadedDocuments: [
            { id: 'doc-a', name: 'Documento A' },
            { id: 'doc-b', name: 'Documento B' },
          ],
          rightSidebarViewMode: 'docs',
        },
      } as any,
      normalized: {
        template: { schemas: [[]] } as any,
        inputs: [],
        recipients: [],
        documents: [
          { id: 'doc-a', label: 'Documento A' },
          { id: 'doc-b', label: 'Documento B' },
        ],
        activeRecipientId: null,
        signatureProviders: [],
      },
    });

    expect(config.runtimeOptions.rightSidebarViewMode).toBe('docs');
  });
});
