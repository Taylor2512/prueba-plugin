import { describe, expect, it } from 'vitest';
import { createSisadPdfmeConfig } from '@/sisad-pdfme/config/createSisadPdfmeConfig';
import { defaultSisadPdfmeVisibilityConfig } from '@/sisad-pdfme/config/defaultSisadPdfmeConfig';

describe('sisad-pdfme config visibility', () => {
  it('returns the default visibility block', () => {
    const resolved = createSisadPdfmeConfig();

    expect(resolved.visibility).toEqual(defaultSisadPdfmeVisibilityConfig);
    expect(resolved.runtimeOptions).toHaveProperty('visibility');
  });

  it('maps hidden catalog schema types into runtimeOptions.hiddenCatalogTypes', () => {
    const resolved = createSisadPdfmeConfig({
      visibility: {
        schemas: {
          catalog: {
            signature: false,
          },
        },
      },
    });

    expect(Array.isArray((resolved.runtimeOptions as Record<string, unknown>).hiddenCatalogTypes)).toBe(true);
    expect((resolved.runtimeOptions as Record<string, unknown>).hiddenCatalogTypes).toContain('signature');
  });
});
