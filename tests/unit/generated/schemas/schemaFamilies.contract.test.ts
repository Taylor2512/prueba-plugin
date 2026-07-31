import { describe, expect, it } from 'vitest';
import {
  createSchemaInspectorConfig,
  getSchemaTypeInspectorPreset,
  normalizeSchemaFamily,
  resolveSchemaFamily,
  resolveSchemaSemanticFamily,
} from '@/sisad-pdfme/schemas/schemaFamilies';

describe('schema families e inspector declarativo', () => {
  it.each([
    ['text', 'text'], ['number', 'text'], ['signature', 'text'], ['attachment', 'text'],
    ['checkbox', 'boolean'], ['radioGroup', 'boolean'], ['image', 'mediaVisual'],
    ['table', 'table'], ['qrcode', 'shapeBarcode'], ['rectangle', 'shapeBarcode'],
  ])('resuelve %s a familia %s', (type, family) => {
    expect(resolveSchemaFamily(type)).toBe(family);
  });

  it.each([
    ['signature', 'signature'], ['initials', 'signature'], ['attachment', 'action'],
    ['approve', 'action'], ['radioGroup', 'choice'], ['checkboxGroup', 'choice'],
    ['dateTime', 'dateTime'], ['image', 'media'], ['code128', 'barcode'],
  ])('resuelve familia semántica de %s', (type, family) => {
    expect(resolveSchemaSemanticFamily(type)).toBe(family);
  });

  it('normaliza familias importadas', () => {
    expect(normalizeSchemaFamily('textual')).toBe('text');
    expect(normalizeSchemaFamily('choice')).toBe('boolean');
    expect(normalizeSchemaFamily('barcode')).toBe('shapeBarcode');
  });

  it('devuelve copias aisladas de presets', () => {
    const first = getSchemaTypeInspectorPreset('text');
    const second = getSchemaTypeInspectorPreset('text');
    first.visibleSections.push('general');
    expect(second.visibleSections).not.toEqual(first.visibleSections);
  });

  it('permite overrides sin perder propertyMap base', () => {
    const config = createSchemaInspectorConfig('text', {
      visibleSections: ['general', 'validation'],
      propertyMap: { customProperty: 'advanced' },
      supportsConnections: false,
    } as any);
    expect(config.visibleSections).toEqual(['general', 'validation']);
    expect(config.propertyMap?.customProperty).toBe('advanced');
    expect(config.propertyMap?.fontSize).toBe('style');
    expect(config.supportsConnections).toBe(false);
  });
});
