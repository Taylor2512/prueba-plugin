import { describe, expect, test } from 'vitest';
import { changeSchemas } from '../../src/sisad-pdfme/ui/helper.js';
import { pluginRegistry } from '../../src/sisad-pdfme/common/pluginRegistry.js';
import { flatSchemaPlugins } from '../../src/sisad-pdfme/schemas/index.js';
import type { SchemaForUI } from '../../src/sisad-pdfme/common/types.js';

// Mirrors the batch the checkbox "+" affordance dispatches via onChange.
const conversionBatch = (schema: SchemaForUI) => {
  const wasChecked = schema.content === 'true';
  return [
    { key: 'type', value: 'checkboxGroup', schemaId: schema.id },
    { key: 'groupName', value: 'Grupo de casillas', schemaId: schema.id },
    { key: 'groupId', value: 'Grupo_Casillas', schemaId: schema.id },
    { key: 'lockedAsGroup', value: true, schemaId: schema.id },
    { key: 'orientation', value: 'vertical', schemaId: schema.id },
    { key: 'spacing', value: 3, schemaId: schema.id },
    { key: 'height', value: 24, schemaId: schema.id },
    { key: 'width', value: 55, schemaId: schema.id },
    {
      key: 'options',
      value: [
        { optionId: 'option_1', label: 'Casilla 1' },
        { optionId: 'option_2', label: 'Casilla 2' },
      ],
      schemaId: schema.id,
    },
    { key: 'content', value: wasChecked ? 'option_1' : '', schemaId: schema.id },
    { key: 'selectedOptionIds', value: wasChecked ? ['option_1'] : [], schemaId: schema.id },
    { key: '__designer.group.groupId', value: 'Grupo_Casillas', schemaId: schema.id },
    { key: '__designer.group.groupType', value: 'checkbox', schemaId: schema.id },
    { key: '__designer.group.groupName', value: 'Grupo de casillas', schemaId: schema.id },
    { key: '__designer.group.lockedAsGroup', value: true, schemaId: schema.id },
  ];
};

describe('checkbox → checkboxGroup conversion (changeSchemas contract)', () => {
  const registry = pluginRegistry(flatSchemaPlugins);

  const runConversion = (checkbox: SchemaForUI) => {
    let committed: SchemaForUI[] = [];
    changeSchemas({
      objs: conversionBatch(checkbox),
      schemas: [checkbox],
      basePdf: { width: 210, height: 297, padding: [0, 0, 0, 0] },
      pluginsRegistry: registry,
      pageSize: { width: 210, height: 297 },
      commitSchemas: (next) => {
        committed = (Array.isArray(next[0]) ? (next as SchemaForUI[][])[0] : (next as SchemaForUI[])) || [];
      },
    });
    return committed[0] as SchemaForUI & {
      options?: unknown[];
      selectedOptionIds?: string[];
      __designer?: { group?: Record<string, unknown> };
    };
  };

  const baseCheckbox = (): SchemaForUI =>
    ({
      id: 'cb-1',
      schemaUid: 'uid-cb-1',
      name: 'acepta',
      type: 'checkbox',
      content: 'false',
      position: { x: 12, y: 20 },
      width: 8,
      height: 8,
      color: '#2563EB',
      ownerRecipientId: 'recipient-1',
      ownerColor: '#2563EB',
      __designer: { schemaUid: 'uid-cb-1', recipientColor: '#2563EB' },
    }) as unknown as SchemaForUI;

  test('produces a checkboxGroup with options and group metadata', () => {
    const result = runConversion(baseCheckbox());
    expect(result.type).toBe('checkboxGroup');
    expect(result.options).toHaveLength(2);
    expect(result.__designer?.group?.groupType).toBe('checkbox');
    expect(result.__designer?.group?.lockedAsGroup).toBe(true);
  });

  test('preserves identity and owner (no schemaUid/owner regeneration)', () => {
    const result = runConversion(baseCheckbox()) as SchemaForUI & {
      ownerRecipientId?: string;
      ownerColor?: string;
    };
    expect(result.id).toBe('cb-1');
    expect(result.name).toBe('acepta');
    expect(result.position).toEqual({ x: 12, y: 20 });
    // owner/recipient color preserved through the conversion
    expect(result.ownerRecipientId).toBe('recipient-1');
    expect(result.__designer?.recipientColor ?? (result as { ownerColor?: string }).ownerColor).toBe('#2563EB');
  });

  test('a checked checkbox seeds the first option as selected', () => {
    const checked = { ...baseCheckbox(), content: 'true' } as SchemaForUI;
    const result = runConversion(checked);
    expect(result.selectedOptionIds).toEqual(['option_1']);
    expect(result.content).toBe('option_1');
  });

  test('an unchecked checkbox starts with no selection', () => {
    const result = runConversion(baseCheckbox());
    expect(result.selectedOptionIds).toEqual([]);
    expect(result.content).toBe('');
  });
});
