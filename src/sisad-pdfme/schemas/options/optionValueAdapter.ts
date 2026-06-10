import type { OptionItem } from './optionTypes';

export const resolveSelectedOptionId = (
  schemaSelected: unknown,
  options: OptionItem[],
): string | undefined => {
  if (!schemaSelected) return undefined;

  // If stored id exists in options, use it
  const byId = options.find((o) => o.optionId === String(schemaSelected));
  if (byId) return byId.optionId;

  // Try find by value
  const byValue = options.find((o) => o.value === String(schemaSelected));
  if (byValue) return byValue.optionId;

  return undefined;
};
