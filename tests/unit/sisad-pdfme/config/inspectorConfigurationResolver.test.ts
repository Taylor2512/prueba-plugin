import { describe, expect, it } from 'vitest';
import { createSisadPdfmeConfig } from '@/sisad-pdfme/config/createSisadPdfmeConfig';
import { createInspectorConfigurationResolver } from '@/sisad-pdfme/config/InspectorConfigurationResolver';
import type { ResolvedSisadPdfmeConfig } from '@/sisad-pdfme/config';

describe('createInspectorConfigurationResolver', () => {
  it('expone el estado canónico del inspector y respeta los overrides de secciones', () => {
    const resolved = createSisadPdfmeConfig();
    const source: Pick<ResolvedSisadPdfmeConfig, 'config' | 'visibility'> = {
      config: {
        ...resolved.config,
        debug: {
          ...resolved.config.debug,
          showTechnicalInspector: true,
        },
      },
      visibility: {
        ...resolved.visibility,
        inspector: {
          ...resolved.visibility.inspector,
          visible: true,
          showAdvanced: false,
          showCollaboration: false,
          showComments: false,
          sections: {
            comments: false,
            collaboration: false,
          },
        },
      },
    };

    const resolver = createInspectorConfigurationResolver(source);

    expect(resolver.inspectorVisible).toBe(true);
    expect(resolver.showTechnicalInspector).toBe(true);
    expect(resolver.showAdvanced).toBe(false);
    expect(resolver.showCollaboration).toBe(false);
    expect(resolver.showComments).toBe(false);
    expect(resolver.shouldShowSection('identity')).toBe(true);
    expect(resolver.shouldShowSection('advanced')).toBe(false);
    expect(resolver.shouldShowSection('comments')).toBe(false);
    expect(resolver.shouldShowSection('collaboration')).toBe(false);
  });
});
