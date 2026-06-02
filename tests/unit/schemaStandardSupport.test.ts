import { describe, expect, test } from 'vitest';
import {
  builtInSchemaDefinitions,
  createDefaultSchema,
  getSchemaDefinition,
  getSchemaPluginByType,
} from '../../src/sisad-pdfme/schemas/index.js';

describe('standard schema support', () => {
  test('registers number, radioGroup and checkboxGroup as built-in schemas', () => {
    const types = builtInSchemaDefinitions.map((definition) => definition.type);
    expect(types).toContain('number');
    expect(types).toContain('radioGroup');
    expect(types).toContain('checkboxGroup');
    expect(types).toContain('checkbox');
    expect(types).toContain('select');
  });

  test('creates a default number schema with numeric contract fields', () => {
    const schema = createDefaultSchema('number');

    expect(schema.type).toBe('number');
    expect(schema.name).toBe('number');
    expect(schema.decimals).toBe(0);
    expect(schema.format).toBe('free');
    expect(schema.placeholder).toBe('');
  });

  test('creates a default radioGroup schema with grouped options and designer metadata', () => {
    const schema = createDefaultSchema('radioGroup');

    expect(schema.type).toBe('radioGroup');
    expect(Array.isArray(schema.options)).toBe(true);
    expect(schema.options?.length).toBeGreaterThanOrEqual(2);
    expect(schema.selectedOptionId).toBe('option_1');
    expect(schema.defaultSelectedOptionId).toBe('option_1');
    expect((schema as { __designer?: { group?: { groupType?: string; lockedAsGroup?: boolean } } }).__designer?.group?.groupType).toBe('radio');
    expect((schema as { __designer?: { group?: { groupType?: string; lockedAsGroup?: boolean } } }).__designer?.group?.lockedAsGroup).toBe(true);
  });

  test('creates a default checkboxGroup schema with multi-select contract and designer metadata', () => {
    const schema = createDefaultSchema('checkboxGroup');

    expect(schema.type).toBe('checkboxGroup');
    expect(Array.isArray(schema.options)).toBe(true);
    expect(schema.options?.length).toBeGreaterThanOrEqual(2);
    expect(Array.isArray((schema as { selectedOptionIds?: string[] }).selectedOptionIds)).toBe(true);
    expect((schema as { __designer?: { group?: { groupType?: string; lockedAsGroup?: boolean } } }).__designer?.group?.groupType).toBe('checkbox');
    expect((schema as { __designer?: { group?: { groupType?: string; lockedAsGroup?: boolean } } }).__designer?.group?.lockedAsGroup).toBe(true);
  });

  test('resolves dropdown as an alias for select without changing the canonical contract', () => {
    expect(getSchemaPluginByType('dropdown')).toBeDefined();

    const definition = getSchemaDefinition('dropdown');
    expect(definition?.type).toBe('select');

    const schema = createDefaultSchema('dropdown');
    expect(schema.type).toBe('select');
    expect(Array.isArray(schema.options)).toBe(true);
    expect(schema.options).toHaveLength(2);
  });
});
