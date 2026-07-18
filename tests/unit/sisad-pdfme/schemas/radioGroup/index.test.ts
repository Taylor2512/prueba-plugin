import { describe, expect, it } from 'vitest';
import radioGroup, { __test__ } from '@/sisad-pdfme/schemas/radioGroup/index.js';
import { createDefaultSchema, builtInSchemaDefinitions } from '@/sisad-pdfme/schemas/index.js';

describe('sisad-pdfme/schemas/radioGroup/index.ts', () => {
  it('is registered as a built-in schema and preserves option/group defaults', () => {
    const types = builtInSchemaDefinitions.map((definition) => definition.type);
    expect(types).toContain('radioGroup');

    const schema = createDefaultSchema('radioGroup') as Record<string, unknown>;
    expect(schema.type).toBe('radioGroup');
    expect(Array.isArray(schema.options)).toBe(true);
    expect((schema.options as unknown[]).length).toBeGreaterThanOrEqual(2);
    expect(schema.selectedOptionId).toBeTypeOf('string');

    const group = (schema.__designer as { group?: { groupType?: string; lockedAsGroup?: boolean } })?.group;
    expect(group?.groupType).toBe('radio');
    expect(group?.lockedAsGroup).toBe(true);
    expect(radioGroup.propPanel.widgets?.editRadioGroupOptions).toBeTypeOf('function');

    const propPanelSchema =
      typeof radioGroup.propPanel.schema === 'function'
        ? radioGroup.propPanel.schema({ i18n: (key: string) => key })
        : radioGroup.propPanel.schema;

    expect(propPanelSchema.groupId).toBeTruthy();
    expect(propPanelSchema.groupName).toBeTruthy();
    expect(propPanelSchema.lockedAsGroup).toBeTruthy();
    expect(propPanelSchema.optionsContainer).toBeTruthy();
    // groupId is a technical ID — moved to advanced section (not data)
    expect(radioGroup.propPanel.inspector.propertyMap.groupId).toBe('advanced');
    expect(radioGroup.propPanel.inspector.propertyMap.groupName).toBe('data');
    expect(radioGroup.propPanel.inspector.propertyMap.optionsContainer).toBe('data');
  });

  it('creates a stable unique optionId for new radio options', () => {
    const options = [
      { optionId: 'option_1', label: 'A' },
      { optionId: 'option_2', label: 'B' },
      { optionId: 'option_3', label: 'C' },
      { optionId: 'option_4', label: 'D' },
    ];

    const next = __test__.createNextOption('Opcion', options);

    expect(next.label).toBe('Opcion');
    expect(next.optionId).toBe('opcion_5');
    expect(options.some((option) => option.optionId === next.optionId)).toBe(false);
  });
});
