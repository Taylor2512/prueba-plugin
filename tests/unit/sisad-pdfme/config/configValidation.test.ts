import { describe, expect, it } from 'vitest';
import { validateSisadPdfmeConfig } from '@/sisad-pdfme/config/configValidation';

describe('validateSisadPdfmeConfig', () => {
  it('reports missing providers for provider mode and duplicate plugins', () => {
    const issues = validateSisadPdfmeConfig({
      signatures: {
        defaultMode: 'provider',
        providers: [],
      },
      schemas: {
        plugins: [
          { id: 'alpha' },
          { key: 'alpha' },
        ],
      },
    });

    expect(issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'signatures-provider-missing',
          severity: 'error',
          path: 'signatures.providers',
        }),
        expect.objectContaining({
          code: 'schema-plugin-duplicate',
          severity: 'warning',
        }),
      ]),
    );
  });

  it('warns about persistence and routing mismatches', () => {
    const issues = validateSisadPdfmeConfig({
      persistence: {
        mode: 'none',
        autosave: true,
      },
      documents: {
        mode: 'single',
        preserveDocumentSchemaRouting: false,
      },
      sidebars: {
        right: {
          panels: ['fields'],
          defaultPanel: 'comments',
        },
      },
    });

    expect(issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'persistence-autosave-without-backend',
          severity: 'warning',
        }),
        expect.objectContaining({
          code: 'documents-routing-disabled',
          severity: 'warning',
        }),
        expect.objectContaining({
          code: 'sidebar-default-panel-not-listed',
          severity: 'warning',
        }),
      ]),
    );
  });
});
