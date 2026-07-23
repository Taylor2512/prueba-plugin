import { describe, expect, test, vi, beforeEach } from 'vitest';
import {
  createSelectionCommands,
  type SelectionCommandsContext,
} from '@/sisad-pdfme/ui/components/Designer/shared/selectionCommands.js';
import type { SchemaForUI } from '@/sisad-pdfme/common/index.js';

const message = vi.hoisted(() => ({
  success: vi.fn(),
  warning: vi.fn(),
}));

vi.mock('antd', () => ({ message }));

const makeActiveElement = (id: string) => {
  const element = document.createElement('div');
  element.id = id;
  return element;
};

const makeSchema = (overrides: Partial<SchemaForUI> & { id: string }): SchemaForUI =>
  ({
    name: overrides.id,
    type: 'text',
    content: '',
    position: { x: 10, y: 10 },
    width: 40,
    height: 20,
    ...overrides,
  }) as SchemaForUI;

describe('selectionCommands behavior', () => {
  beforeEach(() => {
    message.success.mockClear();
    message.warning.mockClear();
  });

  test('groups and ungroups active schemas without touching unrelated schemas', () => {
    const schemaA = makeSchema({ id: 'a' });
    const schemaB = makeSchema({ id: 'b' });
    const schemaC = makeSchema({ id: 'c' });
    const commitSchemas = vi.fn();
    const context: SelectionCommandsContext = {
      activeElements: [makeActiveElement('a'), makeActiveElement('b')],
      schemasList: [[schemaA, schemaB, schemaC]],
      pageCursor: 0,
      pageSize: { width: 200, height: 120 },
      changeSchemas: vi.fn(),
      commitSchemas,
      removeSchemas: vi.fn(),
      onOpenProperties: vi.fn(),
    };

    const commands = createSelectionCommands(context);
    commands.groupSelection?.();

    expect(commitSchemas).toHaveBeenCalledTimes(1);
    const grouped = commitSchemas.mock.calls[0][0] as SchemaForUI[];
    expect(grouped[0].__designer?.group?.groupId).toBeDefined();
    expect(grouped[0].__designer?.group?.groupId).toBe(grouped[1].__designer?.group?.groupId);
    expect(grouped[2].__designer?.group).toBeUndefined();

    commitSchemas.mockClear();
    const ungroupContext: SelectionCommandsContext = {
      ...context,
      activeElements: [makeActiveElement('a')],
      schemasList: [grouped],
    };
    createSelectionCommands(ungroupContext).ungroupSelection?.();

    const ungrouped = commitSchemas.mock.calls[0][0] as SchemaForUI[];
    expect(ungrouped[0].__designer?.group).toBeUndefined();
    expect(ungrouped[1].__designer?.group).toBeUndefined();
    expect(ungrouped[2].__designer?.group).toBeUndefined();
  });

  test('converts checkbox into checkboxGroup and adds group options with unique ids', () => {
    const schema = makeSchema({
      id: 'checkbox-1',
      type: 'checkbox',
      width: 30,
      content: 'true',
    });
    const changeSchemas = vi.fn();
    const commands = createSelectionCommands({
      activeElements: [makeActiveElement('checkbox-1')],
      schemasList: [[schema]],
      pageCursor: 0,
      pageSize: { width: 200, height: 120 },
      changeSchemas,
      commitSchemas: vi.fn(),
      removeSchemas: vi.fn(),
      onOpenProperties: vi.fn(),
    });

    commands.convertCheckboxToGroup?.();

    expect(changeSchemas).toHaveBeenCalled();
    const checkboxChanges = changeSchemas.mock.calls[0][0] as Array<{ key: string; value: unknown }>;
    expect(checkboxChanges).toEqual(expect.arrayContaining([
      expect.objectContaining({ key: 'type', value: 'checkboxGroup' }),
      expect.objectContaining({ key: 'groupId', value: 'Grupo_Casillas' }),
      expect.objectContaining({ key: 'selectedOptionIds', value: ['option_1'] }),
    ]));

    changeSchemas.mockClear();
    const radioSchema = makeSchema({
      id: 'radio-1',
      type: 'radioGroup',
      options: [
        { optionId: 'option_1', label: 'A' },
        { optionId: 'option_2', label: 'B' },
      ],
    }) as SchemaForUI & { options: Array<{ optionId: string; label: string }> };
    const radioCommands = createSelectionCommands({
      activeElements: [makeActiveElement('radio-1')],
      schemasList: [[radioSchema]],
      pageCursor: 0,
      pageSize: { width: 200, height: 120 },
      changeSchemas,
      commitSchemas: vi.fn(),
      removeSchemas: vi.fn(),
      onOpenProperties: vi.fn(),
    });

    radioCommands.addGroupOption?.();
    const optionChanges = changeSchemas.mock.calls[0][0] as Array<{ key: string; value: unknown }>;
    const optionsPatch = optionChanges.find((entry) => entry.key === 'options')?.value as Array<{ optionId: string; label: string }>;
    expect(optionsPatch).toHaveLength(3);
    expect(optionsPatch[2]?.label).toBe('Opción 3');
    expect(new Set(optionsPatch.map((option) => option.optionId)).size).toBe(3);
  });

  test('deletes and duplicates the active selection through the page-level contract', () => {
    const schemaA = makeSchema({ id: 'a' });
    const schemaB = makeSchema({ id: 'b' });
    const removeSchemas = vi.fn();
    const commitSchemas = vi.fn();
    const commands = createSelectionCommands({
      activeElements: [makeActiveElement('a')],
      schemasList: [[schemaA, schemaB]],
      pageCursor: 0,
      pageSize: { width: 200, height: 120 },
      changeSchemas: vi.fn(),
      commitSchemas,
      removeSchemas,
      onOpenProperties: vi.fn(),
    });

    expect(commands.deleteSelection()).toBe(true);
    expect(removeSchemas).toHaveBeenCalledWith(['a']);

    commands.duplicateSelection();
    expect(commitSchemas).toHaveBeenCalled();
    const duplicated = commitSchemas.mock.calls.at(-1)?.[0] as SchemaForUI[];
    expect(duplicated.length).toBeGreaterThan(2);
  });

  test('moves the active selection to either z-order edge without losing schemas', () => {
    const schemaA = makeSchema({ id: 'a' });
    const schemaB = makeSchema({ id: 'b' });
    const schemaC = makeSchema({ id: 'c' });
    const commitSchemas = vi.fn();
    const context: SelectionCommandsContext = {
      activeElements: [makeActiveElement('b')],
      schemasList: [[schemaA, schemaB, schemaC]],
      pageCursor: 0,
      pageSize: { width: 200, height: 120 },
      changeSchemas: vi.fn(),
      commitSchemas,
      removeSchemas: vi.fn(),
      onOpenProperties: vi.fn(),
    };
    const commands = createSelectionCommands(context);

    commands.bringForward();
    expect((commitSchemas.mock.calls.at(-1)?.[0] as SchemaForUI[]).map(({ id }) => id)).toEqual(['a', 'c', 'b']);

    commands.sendBackward();
    expect((commitSchemas.mock.calls.at(-1)?.[0] as SchemaForUI[]).map(({ id }) => id)).toEqual(['b', 'a', 'c']);
  });
});
