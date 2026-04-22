import { describe, expect, it } from 'vitest';
import {
  createSchemaInspectorConfig,
  getSchemaTypeInspectorPreset,
  normalizeSchemaFamily,
  resolveSchemaFamily,
} from '../../src/sisad-pdfme/schemas/schemaFamilies.js';

describe('schema families', () => {
  it('maps schema types to canonical runtime families', () => {
    expect(resolveSchemaFamily('text')).toBe('text');
    expect(resolveSchemaFamily('signature')).toBe('text');
    expect(resolveSchemaFamily('checkbox')).toBe('boolean');
    expect(resolveSchemaFamily('image')).toBe('mediaVisual');
    expect(resolveSchemaFamily('qrcode')).toBe('shapeBarcode');
    expect(resolveSchemaFamily('table')).toBe('table');
  });

  it('accepts legacy family aliases when building inspector config', () => {
    expect(normalizeSchemaFamily('textual')).toBe('text');
    expect(normalizeSchemaFamily('media')).toBe('mediaVisual');

    const inspector = createSchemaInspectorConfig('textual');
    expect(inspector.supportedActions?.some((action) => action.command === 'togglePersistence')).toBe(true);
    expect(inspector.strategies?.some((strategy) => strategy.type === 'validation')).toBe(true);
  });

  it('exposes declarative metadata for supported actions and strategies', () => {
    const preset = getSchemaTypeInspectorPreset('checkbox');

    expect(preset.family).toBe('boolean');
    expect(preset.supportsComments).toBe(true);
    expect(preset.supportsLocking).toBe(true);
    expect(preset.supportsPresence).toBe(true);
    expect(preset.supportedActions.map((action) => action.command)).toContain('addComment');
    expect(preset.strategies.map((strategy) => strategy.type)).toContain('locking');
  });
});
