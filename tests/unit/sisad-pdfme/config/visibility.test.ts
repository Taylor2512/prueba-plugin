import { describe, expect, it } from 'vitest';
import { createSisadPdfmeConfig } from '@/sisad-pdfme/config/createSisadPdfmeConfig';
import {
  defaultSisadPdfmeConfig,
  defaultSisadPdfmeVisibilityConfig,
} from '@/sisad-pdfme/config/defaultSisadPdfmeConfig';

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

  it('expone una base funcional activa en el config por defecto', () => {
    const resolved = createSisadPdfmeConfig();

    expect(resolved.config.collaboration.enabled).toBe(true);
    expect(resolved.config.sidebars?.left?.allowCustomFields).toBe(true);
    expect(resolved.config.visibility?.modals?.comments).toBe(true);
    expect(resolved.config.visibility?.actions?.rename).toBe(true);
    expect(resolved.config.persistence.mode).toBe('local');
    expect(defaultSisadPdfmeConfig.visibility).toEqual(defaultSisadPdfmeVisibilityConfig);
  });
});
