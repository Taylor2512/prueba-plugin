import { describe, expect, it } from 'vitest';
import {
  createSchemaInspectorConfig,
  getSchemaFamilyInspectorPreset,
  getSchemaTypeInspectorPreset,
  normalizeSchemaFamily,
  resolveSchemaFamily,
} from '../../src/sisad-pdfme/schemas/schemaFamilies.js';

describe('schemaFamilies all exported functions', () => {
  it('normalizes legacy families to canonical ones', () => {
    expect(normalizeSchemaFamily('textual')).toBe('text');
    expect(normalizeSchemaFamily('media')).toBe('mediaVisual');
    expect(normalizeSchemaFamily('signature')).toBe('text');
    expect(normalizeSchemaFamily('choice')).toBe('boolean');
    expect(normalizeSchemaFamily('shape')).toBe('shapeBarcode');
    expect(normalizeSchemaFamily('barcode')).toBe('shapeBarcode');
    expect(normalizeSchemaFamily('table')).toBe('table');
  });

  it('resolves schema family by type including unknown fallback', () => {
    expect(resolveSchemaFamily('text')).toBe('text');
    expect(resolveSchemaFamily('date')).toBe('text');
    expect(resolveSchemaFamily('checkbox')).toBe('boolean');
    expect(resolveSchemaFamily('image')).toBe('mediaVisual');
    expect(resolveSchemaFamily('table')).toBe('table');
    expect(resolveSchemaFamily('qrcode')).toBe('shapeBarcode');
    expect(resolveSchemaFamily('unknown-custom')).toBe('text');
  });

  it('returns deep-cloned family presets without leaking mutations', () => {
    const first = getSchemaFamilyInspectorPreset('text');
    const second = getSchemaFamilyInspectorPreset('text');
    const initialLength = second.visibleSections.length;

    first.visibleSections.push('advanced');
    first.propertyMap.color = 'advanced';
    first.supportedActions[0].placement?.push('floating-toolbar');
    first.strategies[0].label = 'mutated';

    expect(second.visibleSections.length).toBe(initialLength);
    expect(second.propertyMap.color).toBe('style');
    expect(second.supportedActions[0].placement).not.toContain('floating-toolbar');
    expect(second.strategies[0].label).not.toBe('mutated');
  });

  it('maps schema type to preset with expected capabilities', () => {
    const mediaPreset = getSchemaTypeInspectorPreset('image');
    expect(mediaPreset.family).toBe('mediaVisual');
    expect(mediaPreset.supportsConnections).toBe(false);
    expect(mediaPreset.supportsValidation).toBe(false);

    const booleanPreset = getSchemaTypeInspectorPreset('checkbox');
    expect(booleanPreset.family).toBe('boolean');
    expect(booleanPreset.supportsConnections).toBe(true);
    expect(booleanPreset.supportsValidation).toBe(true);
  });

  it('creates inspector config from preset and applies overrides precedence', () => {
    const config = createSchemaInspectorConfig('text', {
      visibleSections: ['general', 'layout'],
      propertyMap: { color: 'advanced' },
      supportsConnections: false,
      includeCollaboration: false,
      includeValidation: true,
      supportedActions: [{ id: 'customAction', command: 'editText', label: 'custom', placement: ['inspector'] }],
      strategies: [{ id: 'customStrategy', type: 'validation', label: 'custom' }],
    });

    expect(config.visibleSections).toEqual(['general', 'layout']);
    expect(config.propertyMap?.color).toBe('advanced');
    expect(config.supportsConnections).toBe(false);
    expect(config.supportsCollaboration).toBe(false);
    expect(config.supportsValidation).toBe(true);
    expect(config.supportedActions?.[0]?.id).toBe('customAction');
    expect(config.strategies?.[0]?.id).toBe('customStrategy');
  });

  it('falls back to preset actions/strategies when overrides are empty', () => {
    const config = createSchemaInspectorConfig('boolean', {
      supportedActions: [],
      strategies: [],
      includeConnections: true,
      includeCollaboration: true,
      includeValidation: false,
    });

    expect(config.supportedActions?.length).toBeGreaterThan(0);
    expect(config.strategies?.length).toBeGreaterThan(0);
    expect(config.supportsConnections).toBe(true);
    expect(config.supportsCollaboration).toBe(true);
    expect(config.supportsValidation).toBe(false);
  });
});
