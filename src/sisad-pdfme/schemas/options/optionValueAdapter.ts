import type { OptionItem } from './optionTypes';
import { matchOptionId } from './optionSelectionBehavior';
import { buildDefaultOptionGroupOptions } from './optionModel.js';

type CheckboxToGroupPatchSchema = {
  width?: number;
};

export const buildCheckboxToGroupPatch = (
  schema: CheckboxToGroupPatchSchema,
  wasChecked: boolean,
): Array<{ key: string; value: unknown }> => {
  const options = buildDefaultOptionGroupOptions('Casilla', 2);
  return [
    { key: 'type', value: 'checkboxGroup' },
    { key: 'groupName', value: 'Grupo de casillas' },
    { key: 'groupId', value: 'Grupo_Casillas' },
    { key: 'lockedAsGroup', value: true },
    { key: 'orientation', value: 'vertical' },
    { key: 'spacing', value: 3 },
    { key: 'height', value: 24 },
    { key: 'width', value: Math.max(55, Number(schema.width) || 0) },
    { key: 'options', value: options },
    { key: 'content', value: wasChecked ? 'option_1' : '' },
    { key: 'selectedOptionIds', value: wasChecked ? ['option_1'] : [] },
    { key: '__designer.group.groupId', value: 'Grupo_Casillas' },
    { key: '__designer.group.groupType', value: 'checkbox' },
    { key: '__designer.group.groupName', value: 'Grupo de casillas' },
    { key: '__designer.group.lockedAsGroup', value: true },
  ];
};

/**
 * Adapter: stored schema value ↔  optionId.
 *
 * Delegates the actual id/value matching to the single core matcher in
 * optionSelectionBehavior so checkboxGroup/radioGroup/select share one
 * resolution path. Returns undefined when the stored value matches no option
 * (the radioGroup/select UI decide their own fallback).
 */
const resolveOptionValueSelectedId = (
  schemaSelected: unknown,
  options: OptionItem[],
): string | undefined => matchOptionId(schemaSelected, options);

export const resolveSelectedOptionId = resolveOptionValueSelectedId;
