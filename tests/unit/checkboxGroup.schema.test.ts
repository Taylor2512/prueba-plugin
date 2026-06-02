import { describe, expect, test } from 'vitest';
import checkboxGroup, { __test__ } from '../../src/sisad-pdfme/schemas/checkboxGroup/index.js';
import { createDefaultSchema, builtInSchemaDefinitions } from '../../src/sisad-pdfme/schemas/index.js';

const { normalizeOptions, resolveSelectedIds, serializeSelectedIds, normalizeSelectedOptionIds, createNextOption } = __test__;

describe('checkboxGroup schema', () => {
  test('is registered as a built-in schema', () => {
    const types = builtInSchemaDefinitions.map((d) => d.type);
    expect(types).toContain('checkboxGroup');
  });

  test('createDefaultSchema returns options + selectedOptionIds + group metadata', () => {
    const schema = createDefaultSchema('checkboxGroup') as Record<string, unknown>;
    expect(schema.type).toBe('checkboxGroup');
    expect(Array.isArray(schema.options)).toBe(true);
    expect((schema.options as unknown[]).length).toBeGreaterThanOrEqual(2);
    expect(Array.isArray(schema.selectedOptionIds)).toBe(true);
    const group = (schema.__designer as { group?: { groupType?: string; lockedAsGroup?: boolean } })?.group;
    expect(group?.groupType).toBe('checkbox');
    expect(group?.lockedAsGroup).toBe(true);
  });

  test('default schema exposes the editCheckboxGroupOptions widget', () => {
    expect(checkboxGroup.propPanel.widgets?.editCheckboxGroupOptions).toBeTypeOf('function');
  });

  test('normalizeOptions fills defaults and coerces string entries', () => {
    const fromEmpty = normalizeOptions({ options: [] } as never);
    expect(fromEmpty.length).toBe(2);

    const fromStrings = normalizeOptions({ options: ['Décimos', 'Fondos'] } as never);
    expect(fromStrings[0]).toEqual({ optionId: 'Décimos', label: 'Décimos' });
    expect(fromStrings[1].label).toBe('Fondos');
  });

  test('selected ids round-trip through serialize/parse (multi-select)', () => {
    const ids = resolveSelectedIds({ content: 'option_1,option_3' } as never);
    expect(ids.has('option_1')).toBe(true);
    expect(ids.has('option_3')).toBe(true);
    expect(ids.size).toBe(2);
    expect(serializeSelectedIds(ids)).toBe('option_1,option_3');
  });

  test('selectedOptionIds array takes precedence over content', () => {
    const ids = resolveSelectedIds({ content: 'option_9', selectedOptionIds: ['option_1', 'option_2'] } as never);
    expect(Array.from(ids).sort()).toEqual(['option_1', 'option_2']);
  });

  test('normalizeSelectedOptionIds drops ids that no longer exist', () => {
    const options = [
      { optionId: 'option_1', label: 'A' },
      { optionId: 'option_2', label: 'B' },
    ];
    expect(normalizeSelectedOptionIds(['option_1', 'ghost', 'option_2'], options)).toEqual(['option_1', 'option_2']);
  });

  test('createNextOption generates a unique, stable optionId', () => {
    const options = [
      { optionId: 'decimos_1', label: 'Décimos' },
      { optionId: 'fondos_2', label: 'Fondos' },
    ];
    const next = createNextOption('Vacaciones', options);
    expect(next.label).toBe('Vacaciones');
    expect(next.optionId).toBe('vacaciones_3');
    expect(options.some((o) => o.optionId === next.optionId)).toBe(false);
  });

  test('createNextOption avoids collisions when ids already exist', () => {
    const options = [
      { optionId: 'option_1', label: 'A' },
      { optionId: 'option_2', label: 'B' },
      { optionId: 'option_3', label: 'C' },
    ];
    // label "option" with 3 options would default to option_4; force a clash
    const clash = [...options, { optionId: 'option_4', label: 'D' }];
    const next = createNextOption('option', clash);
    expect(clash.some((o) => o.optionId === next.optionId)).toBe(false);
  });
});
