import type { OptionItem } from './optionTypes';
import { matchOptionId } from './optionSelectionBehavior';

/**
 * Adapter: stored schema value ↔ canonical optionId.
 *
 * Delegates the actual id/value matching to the single core matcher in
 * optionSelectionBehavior so checkboxGroup/radioGroup/select share one
 * resolution path. Returns undefined when the stored value matches no option
 * (the radioGroup/select UI decide their own fallback).
 */
export const resolveSelectedOptionId = (
  schemaSelected: unknown,
  options: OptionItem[],
): string | undefined => matchOptionId(schemaSelected, options);
