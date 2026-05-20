import { describe, expect, it } from 'vitest';
import {
  LEGACY_TO_CANONICAL_DETAIL_SECTION,
  toCanonicalDetailSection,
  shouldRenderDetailSection,
} from '../../src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailSectionTaxonomy.js';

describe('detailSectionTaxonomy', () => {
  it('maps legacy section keys to canonical keys', () => {
    expect(toCanonicalDetailSection('general')).toBe('identity');
    expect(toCanonicalDetailSection('layout')).toBe('box');
    expect(toCanonicalDetailSection('style')).toBe('appearance');
    expect(toCanonicalDetailSection('data')).toBe('behavior');
    expect(LEGACY_TO_CANONICAL_DETAIL_SECTION.connections).toBe('dataBindings');
  });

  it('hides empty collaboration, comments and advanced sections', () => {
    expect(
      shouldRenderDetailSection({
        section: 'collaboration',
        schema: { id: '1', name: 'campo', type: 'text' },
        schemaType: 'text',
        fields: [],
        widgets: [],
      }),
    ).toBe(false);

    expect(
      shouldRenderDetailSection({
        section: 'comments',
        schema: { id: '1', name: 'campo', type: 'text' },
        schemaType: 'text',
        fields: [],
        widgets: [],
      }),
    ).toBe(false);

    expect(
      shouldRenderDetailSection({
        section: 'advanced',
        schema: { id: '1', name: 'campo', type: 'image' },
        schemaType: 'image',
        fields: [
          { key: 'rotate', disabled: true, hidden: false, widget: '' },
          { key: 'opacity', disabled: true, hidden: false, widget: '' },
        ],
        widgets: [],
      }),
    ).toBe(false);
  });
});
