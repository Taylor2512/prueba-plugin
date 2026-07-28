import { describe, it, expect } from 'vitest';
import {
  CANONICAL_DETAIL_SECTION_ORDER,
  LEGACY_TO_CANONICAL_DETAIL_SECTION,
  CANONICAL_DETAIL_SECTION_LABELS,
  getDetailProfile,
  getDefaultOpenSections,
  getVisibleDetailSections,
  toCanonicalDetailSection,
  shouldRenderDetailSection,
  sortCanonicalDetailSections,
} from '@/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailSectionTaxonomy.js';

type DetailSectionParams = Parameters<typeof shouldRenderDetailSection>[0];
type DetailSchema = DetailSectionParams['schema'];
type CanonicalSection = Parameters<typeof sortCanonicalDetailSections>[0][number];

describe('CANONICAL_DETAIL_SECTION_ORDER', () => {
  it('contains help section between behavior and dataBindings', () => {
    const behaviorIdx = CANONICAL_DETAIL_SECTION_ORDER.indexOf('behavior');
    const helpIdx = CANONICAL_DETAIL_SECTION_ORDER.indexOf('help');
    const dataBindingsIdx = CANONICAL_DETAIL_SECTION_ORDER.indexOf('dataBindings');
    expect(helpIdx).toBeGreaterThan(behaviorIdx);
    expect(helpIdx).toBeLessThan(dataBindingsIdx);
  });

  it('contains all expected canonical sections', () => {
    const sections = [...CANONICAL_DETAIL_SECTION_ORDER];
    expect(sections).toContain('identity');
    expect(sections).toContain('box');
    expect(sections).toContain('appearance');
    expect(sections).toContain('behavior');
    expect(sections).toContain('help');
    expect(sections).toContain('dataBindings');
    expect(sections).toContain('collaboration');
    expect(sections).toContain('comments');
    expect(sections).toContain('advanced');
  });
});

describe('LEGACY_TO_CANONICAL_DETAIL_SECTION', () => {
  it('maps help -> help (identity)', () => {
    expect(LEGACY_TO_CANONICAL_DETAIL_SECTION.help).toBe('help');
  });

  it('maps all legacy sections correctly', () => {
    expect(LEGACY_TO_CANONICAL_DETAIL_SECTION.general).toBe('identity');
    expect(LEGACY_TO_CANONICAL_DETAIL_SECTION.layout).toBe('box');
    expect(LEGACY_TO_CANONICAL_DETAIL_SECTION.style).toBe('appearance');
    expect(LEGACY_TO_CANONICAL_DETAIL_SECTION.data).toBe('behavior');
    expect(LEGACY_TO_CANONICAL_DETAIL_SECTION.connections).toBe('dataBindings');
    expect(LEGACY_TO_CANONICAL_DETAIL_SECTION.validation).toBe('behavior');
    expect(LEGACY_TO_CANONICAL_DETAIL_SECTION.collaboration).toBe('collaboration');
    expect(LEGACY_TO_CANONICAL_DETAIL_SECTION.comments).toBe('comments');
    expect(LEGACY_TO_CANONICAL_DETAIL_SECTION.advanced).toBe('advanced');
  });
});

describe('CANONICAL_DETAIL_SECTION_LABELS', () => {
  it('has label for help section', () => {
    expect(CANONICAL_DETAIL_SECTION_LABELS.help).toBeTruthy();
    expect(CANONICAL_DETAIL_SECTION_LABELS.help.title).toBeTruthy();
    expect(CANONICAL_DETAIL_SECTION_LABELS.help.defaultCollapsed).toBe(true);
  });

  it('all canonical sections have labels', () => {
    for (const section of CANONICAL_DETAIL_SECTION_ORDER) {
      expect(CANONICAL_DETAIL_SECTION_LABELS[section], `missing label for ${section}`).toBeTruthy();
    }
  });
});

describe('toCanonicalDetailSection', () => {
  it('resolves help -> help', () => {
    expect(toCanonicalDetailSection('help')).toBe('help');
  });

  it('resolves legacy sections', () => {
    expect(toCanonicalDetailSection('general')).toBe('identity');
    expect(toCanonicalDetailSection('connections')).toBe('dataBindings');
    expect(toCanonicalDetailSection('validation')).toBe('validation');
  });

  it('passes through lowercase canonical sections', () => {
    expect(toCanonicalDetailSection('behavior')).toBe('behavior');
    expect(toCanonicalDetailSection('advanced')).toBe('advanced');
    expect(toCanonicalDetailSection('identity')).toBe('identity');
    // camelCase canonical names (e.g. 'dataBindings') are normalized to lowercase
    // and won't match — use the legacy alias 'connections' instead
    expect(toCanonicalDetailSection('connections')).toBe('dataBindings');
  });

  it('returns null for unknown section', () => {
    expect(toCanonicalDetailSection('')).toBeNull();
    expect(toCanonicalDetailSection('nonexistent')).toBeNull();
  });
});

describe('shouldRenderDetailSection - help', () => {
  const schemaWithTooltip = { tooltip: 'Some help', type: 'text', position: { x: 0, y: 0 }, width: 50, height: 10 } as DetailSchema;
  const emptySchema = { type: 'text', position: { x: 0, y: 0 }, width: 50, height: 10 } as DetailSchema;

  it('renders when tooltip field present in fields array', () => {
    const result = shouldRenderDetailSection({
      section: 'help',
      schema: schemaWithTooltip,
      schemaType: 'text',
      fields: [{ key: 'tooltip', widget: 'textarea' }],
      context: { hasHelpContent: true },
    });
    expect(result).toBe(true);
  });

  it('renders when helpText field present', () => {
    const result = shouldRenderDetailSection({
      section: 'help',
      schema: { ...emptySchema, helpText: 'Description' },
      schemaType: 'text',
      fields: [{ key: 'helpText', widget: 'textarea' }],
      context: { hasHelpContent: true },
    });
    expect(result).toBe(true);
  });

  it('does not render when no help fields or values', () => {
    const result = shouldRenderDetailSection({
      section: 'help',
      schema: emptySchema,
      schemaType: 'text',
      fields: [],
    });
    expect(result).toBe(false);
  });
});

describe('shouldRenderDetailSection - advanced', () => {
  const schema = { type: 'text', position: { x: 0, y: 0 }, width: 50, height: 10 } as DetailSchema;

  it('hides technical section when there is no real metadata', () => {
    expect(
      shouldRenderDetailSection({
        section: 'advanced',
        schema,
        schemaType: 'text',
        fields: [{ key: 'schemaUid', widget: 'input' }],
        context: { hasAdvancedOverrides: false },
      }),
    ).toBe(false);
  });

  it('renders technical section when metadata is present', () => {
    expect(
      shouldRenderDetailSection({
        section: 'advanced',
        schema: { ...schema, schemaUid: 'schema-1' },
        schemaType: 'text',
        fields: [{ key: 'schemaUid', widget: 'input' }],
        context: { hasAdvancedOverrides: true },
      }),
    ).toBe(true);
  });
});

describe('detail section visibility by type', () => {
  it('uses attachment-specific sections and defaults', () => {
    expect(getVisibleDetailSections('attachment')).toEqual([
      'identity',
      'behavior',
      'box',
      'dataBindings',
      'help',
      'collaboration',
      'advanced',
    ]);
    expect(getDefaultOpenSections('attachment')).toEqual(['identity', 'behavior', 'box']);
  });

  // Contrato alineado con la matriz de docs/03-designer/12-inspector-taxonomy.md §3:
  // Formato es transversal a todas las familias y las reglas de llenado dejan de
  // ser exclusivas de los campos de texto.
  it('exposes a profile contract per schema family', () => {
    expect(getDetailProfile('select').visibleSections).toContain('options');
    expect(getDetailProfile('checkboxgroup').defaultOpenSections).toEqual(['identity', 'options', 'validation']);
    expect(getDetailProfile('attachment').visibleSections).toContain('appearance');
    expect(getDetailProfile('note').visibleSections).toContain('appearance');
    expect(getDetailProfile('signature').visibleSections).toContain('appearance');
    expect(getDetailProfile('signature').defaultOpenSections).toEqual(['identity', 'behavior', 'validation']);
  });

  it('does not treat signature-specific controls as standalone appearance content', () => {
    const signatureDrivenSchema = {
      type: 'signature',
      position: { x: 0, y: 0 },
      width: 50,
      height: 10,
      signatureMode: 'provider',
      signatureDisplay: {
        showSignerName: true,
      },
      signatureProviderKey: 'provider-x',
      signatureProviderConfig: {
        label: 'Proveedor externo',
      },
    } as DetailSchema;

    expect(
      shouldRenderDetailSection({
        section: 'appearance',
        schema: signatureDrivenSchema,
        schemaType: 'signature',
        fields: [
          { key: 'signatureMode', widget: 'SignatureModeWidget' },
          { key: 'signatureDisplay', widget: 'card' },
          { key: 'signatureProviderKey', widget: 'SignatureProviderWidget' },
          { key: 'signatureProviderConfig', widget: 'SignatureProviderConfigWidget' },
        ],
        context: { supportsAppearance: true },
      }),
    ).toBe(false);
  });

  it('does not route checkbox fields into the option-group profile', () => {
    expect(getVisibleDetailSections('checkbox')).not.toContain('options');
    expect(getDefaultOpenSections('checkbox')).toEqual(['identity', 'validation', 'behavior']);
  });
});

describe('sortCanonicalDetailSections', () => {
  it('orders help between behavior and dataBindings', () => {
    const unsorted = ['advanced', 'help', 'identity', 'behavior', 'dataBindings'] as CanonicalSection[];
    const sorted = sortCanonicalDetailSections(unsorted);
    expect(sorted[0]).toBe('identity');
    const helpIdx = sorted.indexOf('help');
    const behaviorIdx = sorted.indexOf('behavior');
    const dataBindingsIdx = sorted.indexOf('dataBindings');
    expect(behaviorIdx).toBeLessThan(helpIdx);
    expect(helpIdx).toBeLessThan(dataBindingsIdx);
    expect(sorted[sorted.length - 1]).toBe('advanced');
  });

  it('deduplicates sections', () => {
    const dupes = ['help', 'help', 'identity'] as CanonicalSection[];
    const sorted = sortCanonicalDetailSections(dupes);
    expect(sorted.filter((s) => s === 'help').length).toBe(1);
  });
});
