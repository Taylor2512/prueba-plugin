import { describe, expect, test } from 'vitest';
import type { SchemaForUI } from '@/sisad-pdfme/common/index.js';
import { duplicateSchemas } from '@/sisad-pdfme/ui/components/Designer/shared/schemaClipboard.js';

const makeBaseContext = () => ({
  pageIndex: 0,
  pageCount: 1,
  pageSize: { width: 210, height: 297 },
  existingSchemas: [] as SchemaForUI[],
});

describe('schemaClipboard group identity remap', () => {
  test('duplicates radioGroup with new groupId and remapped optionIds', () => {
    const source = {
      id: 'radio-source',
      schemaUid: 'radio-source',
      name: 'radio_source',
      type: 'radioGroup',
      position: { x: 12, y: 14 },
      width: 55,
      height: 24,
      groupId: 'group-radio-source',
      group: 'group-radio-source',
      options: [
        { optionId: 'option_1', label: 'A' },
        { optionId: 'option_2', label: 'B' },
      ],
      selectedOptionId: 'option_2',
      defaultSelectedOptionId: 'option_2',
      content: 'option_2',
      __designer: {
        group: {
          groupId: 'group-radio-source',
          groupType: 'radio',
          lockedAsGroup: true,
        },
      },
    } as unknown as SchemaForUI;

    const [duplicated] = duplicateSchemas([source], makeBaseContext());

    const duplicatedRecord = duplicated as SchemaForUI & {
      groupId?: string;
      group?: string;
      options?: Array<{ optionId: string; label: string }>;
      selectedOptionId?: string;
      defaultSelectedOptionId?: string;
      content?: string;
      __designer?: { group?: { groupId?: string } };
    };

    expect(duplicatedRecord.groupId).not.toBe('group-radio-source');
    expect(duplicatedRecord.group).toBe(duplicatedRecord.groupId);
    expect(duplicatedRecord.__designer?.group?.groupId).toBe(duplicatedRecord.groupId);

    const optionIds = (duplicatedRecord.options || []).map((option) => option.optionId);
    expect(optionIds).toHaveLength(2);
    expect(optionIds).not.toContain('option_1');
    expect(optionIds).not.toContain('option_2');
    expect(optionIds).toContain(duplicatedRecord.selectedOptionId || '');
    expect(duplicatedRecord.defaultSelectedOptionId).toBe(duplicatedRecord.selectedOptionId);
    expect(duplicatedRecord.content).toBe(duplicatedRecord.selectedOptionId);
  });

  test('duplicates visual grouped schemas with shared new groupId', () => {
    const first = {
      id: 'schema-a',
      schemaUid: 'schema-a',
      name: 'field_a',
      type: 'text',
      content: 'a',
      position: { x: 10, y: 10 },
      width: 30,
      height: 8,
      __designer: {
        group: {
          groupId: 'visual-group-source',
          groupType: 'visual',
          lockedAsGroup: false,
        },
      },
    } as unknown as SchemaForUI;

    const second = {
      id: 'schema-b',
      schemaUid: 'schema-b',
      name: 'field_b',
      type: 'text',
      content: 'b',
      position: { x: 10, y: 24 },
      width: 30,
      height: 8,
      __designer: {
        group: {
          groupId: 'visual-group-source',
          groupType: 'visual',
          lockedAsGroup: false,
        },
      },
    } as unknown as SchemaForUI;

    const duplicated = duplicateSchemas([first, second], makeBaseContext());

    const nextGroupIdA = (duplicated[0] as SchemaForUI & { __designer?: { group?: { groupId?: string } } }).__designer?.group?.groupId;
    const nextGroupIdB = (duplicated[1] as SchemaForUI & { __designer?: { group?: { groupId?: string } } }).__designer?.group?.groupId;

    expect(nextGroupIdA).toBeTruthy();
    expect(nextGroupIdB).toBeTruthy();
    expect(nextGroupIdA).toBe(nextGroupIdB);
    expect(nextGroupIdA).not.toBe('visual-group-source');
  });
});
