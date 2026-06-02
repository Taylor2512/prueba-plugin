import { describe, expect, it } from 'vitest';
import checkboxGroup from '@/sisad-pdfme/schemas/checkboxGroup/index.js';
import { createDefaultSchema, builtInSchemaDefinitions } from '@/sisad-pdfme/schemas/index.js';

describe('sisad-pdfme/schemas/checkboxGroup/index.ts', () => {
  it('is registered as a built-in schema and exposes the checkbox group inspector contract', () => {
    const types = builtInSchemaDefinitions.map((definition) => definition.type);
    expect(types).toContain('checkboxGroup');

    const schema = createDefaultSchema('checkboxGroup') as Record<string, unknown>;
    expect(schema.type).toBe('checkboxGroup');
    expect(Array.isArray(schema.options)).toBe(true);
    expect(Array.isArray(schema.selectedOptionIds)).toBe(true);
    expect((schema.options as unknown[]).length).toBeGreaterThanOrEqual(2);

    const group = (schema.__designer as { group?: { groupType?: string; lockedAsGroup?: boolean } })?.group;
    expect(group?.groupType).toBe('checkbox');
    expect(group?.lockedAsGroup).toBe(true);

    expect(checkboxGroup.propPanel.widgets?.editCheckboxGroupOptions).toBeTypeOf('function');

    const propPanelSchema =
      typeof checkboxGroup.propPanel.schema === 'function'
        ? checkboxGroup.propPanel.schema({ i18n: (key: string) => key })
        : checkboxGroup.propPanel.schema;

    expect(propPanelSchema.minSelected).toBeTruthy();
    expect(propPanelSchema.maxSelected).toBeTruthy();
    expect(propPanelSchema.optionsContainer).toBeTruthy();
    expect(checkboxGroup.propPanel.inspector.propertyMap.minSelected).toBe('data');
    expect(checkboxGroup.propPanel.inspector.propertyMap.maxSelected).toBe('data');
    expect(checkboxGroup.propPanel.inspector.propertyMap.optionsContainer).toBe('data');
  });
});
