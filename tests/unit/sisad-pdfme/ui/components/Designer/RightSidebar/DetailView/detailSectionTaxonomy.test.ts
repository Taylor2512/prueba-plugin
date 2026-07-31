import { describe, it, expect } from 'vitest';
import {
  DETAIL_SECTION_ORDER,
  DETAIL_SECTION_ALIASES,
  DETAIL_SECTION_LABELS,
  getDetailProfile,
  toDetailSectionKey,
  shouldRenderDetailSection,
  sortDetailSections,
} from '@/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailSectionTaxonomy.js';
import {
  getInspectorDefaultOpenSections,
  getInspectorVisibleDetailSections,
} from '@/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailSchemas.js';

type DetailSectionParams = Parameters<typeof shouldRenderDetailSection>[0];
type DetailSchema = DetailSectionParams['schema'];
type DetailSection = Parameters<typeof sortDetailSections>[0][number];

describe('DETAIL_SECTION_ORDER', () => {
  it('contains help section between behavior and dataBindings', () => {
    const behaviorIdx = DETAIL_SECTION_ORDER.indexOf('behavior');
    const helpIdx = DETAIL_SECTION_ORDER.indexOf('help');
    const dataBindingsIdx = DETAIL_SECTION_ORDER.indexOf('dataBindings');
    expect(helpIdx).toBeGreaterThan(behaviorIdx);
    expect(helpIdx).toBeLessThan(dataBindingsIdx);
  });

  it('contains all expected sections', () => {
    const sections = [...DETAIL_SECTION_ORDER];
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

describe('DETAIL_SECTION_ALIASES', () => {
  it('maps help -> help', () => {
    expect(DETAIL_SECTION_ALIASES.help).toBe('help');
  });

  it('maps all compatibility sections correctly', () => {
    expect(DETAIL_SECTION_ALIASES.general).toBe('identity');
    expect(DETAIL_SECTION_ALIASES.layout).toBe('box');
    expect(DETAIL_SECTION_ALIASES.style).toBe('appearance');
    expect(DETAIL_SECTION_ALIASES.data).toBe('behavior');
    expect(DETAIL_SECTION_ALIASES.connections).toBe('dataBindings');
    expect(DETAIL_SECTION_ALIASES.validation).toBe('behavior');
    expect(DETAIL_SECTION_ALIASES.collaboration).toBe('collaboration');
    expect(DETAIL_SECTION_ALIASES.comments).toBe('comments');
    expect(DETAIL_SECTION_ALIASES.advanced).toBe('advanced');
  });
});

describe('DETAIL_SECTION_LABELS', () => {
  it('has label for help section', () => {
    expect(DETAIL_SECTION_LABELS.help).toBeTruthy();
    expect(DETAIL_SECTION_LABELS.help.title).toBeTruthy();
    expect(DETAIL_SECTION_LABELS.help.defaultCollapsed).toBe(true);
  });

  it('all sections have labels', () => {
    for (const section of DETAIL_SECTION_ORDER) {
      expect(DETAIL_SECTION_LABELS[section], `missing label for ${section}`).toBeTruthy();
    }
  });
});

describe('detail section key resolution', () => {
  it('resolves help -> help', () => {
    expect(toDetailSectionKey('help')).toBe('help');
  });

  it('resolves compatibility sections', () => {
    expect(toDetailSectionKey('general')).toBe('identity');
    expect(toDetailSectionKey('connections')).toBe('dataBindings');
    expect(toDetailSectionKey('validation')).toBe('validation');
  });

  it('passes through lowercase sections', () => {
    expect(toDetailSectionKey('behavior')).toBe('behavior');
    expect(toDetailSectionKey('advanced')).toBe('advanced');
    expect(toDetailSectionKey('identity')).toBe('identity');
    // camelCase section names (e.g. 'dataBindings') are normalized to lowercase
    // and won't match — use the compatibility alias 'connections' instead
    expect(toDetailSectionKey('connections')).toBe('dataBindings');
  });

  it('returns null for unknown section', () => {
    expect(toDetailSectionKey('')).toBeNull();
    expect(toDetailSectionKey('nonexistent')).toBeNull();
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
    expect(getInspectorVisibleDetailSections('attachment')).toEqual([
      'identity',
      'behavior',
      'box',
      'appearance',
      'help',
      'dataBindings',
      'collaboration',
      'comments',
      'advanced',
    ]);
    expect(getInspectorDefaultOpenSections('attachment')).toEqual(['identity', 'behavior', 'box']);
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
    expect(getInspectorVisibleDetailSections('checkbox')).not.toContain('options');
    expect(getInspectorDefaultOpenSections('checkbox')).toEqual(['identity', 'validation', 'behavior']);
  });
});

describe('sortDetailSections', () => {
  it('orders help between behavior and dataBindings', () => {
    const unsorted = ['advanced', 'help', 'identity', 'behavior', 'dataBindings'] as DetailSection[];
    const sorted = sortDetailSections(unsorted);
    expect(sorted[0]).toBe('identity');
    const helpIdx = sorted.indexOf('help');
    const behaviorIdx = sorted.indexOf('behavior');
    const dataBindingsIdx = sorted.indexOf('dataBindings');
    expect(behaviorIdx).toBeLessThan(helpIdx);
    expect(helpIdx).toBeLessThan(dataBindingsIdx);
    expect(sorted[sorted.length - 1]).toBe('advanced');
  });

  it('deduplicates sections', () => {
    const dupes = ['help', 'help', 'identity'] as DetailSection[];
    const sorted = sortDetailSections(dupes);
    expect(sorted.filter((s) => s === 'help').length).toBe(1);
  });
});
