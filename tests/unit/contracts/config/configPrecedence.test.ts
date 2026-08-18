import { describe, expect, it } from 'vitest';
import {
  CONFIG_PRECEDENCE,
  resolveConfigRecord,
  resolveConfigValue,
} from '@/sisad-pdfme/config/configPrecedence';

describe('config precedence contract', () => {
  it('uses the safety-to-default ladder and preserves false overrides', () => {
    expect(CONFIG_PRECEDENCE).toEqual(['hardSafety', 'surface', 'instance', 'template', 'schema', 'default']);
    expect(resolveConfigValue({ default: true, schema: false, surface: true }, true)).toEqual({ value: true, origin: 'surface' });
    expect(resolveConfigValue({ default: true, schema: false }, true)).toEqual({ value: false, origin: 'schema' });
  });

  it('reports effective origin for each surface key', () => {
    expect(resolveConfigRecord(
      { default: { editable: true, zoom: 1 }, surface: { editable: false }, template: { zoom: 2 } },
      { editable: true, zoom: 1 },
    )).toEqual({
      value: { editable: false, zoom: 2 },
      origins: { editable: 'surface', zoom: 'template' },
    });
  });

  it('supports capability-disabled hard safety over every lower layer', () => {
    expect(resolveConfigValue({ hardSafety: false, surface: true, instance: true, template: true, schema: true }, true)).toEqual({ value: false, origin: 'hardSafety' });
  });
});
