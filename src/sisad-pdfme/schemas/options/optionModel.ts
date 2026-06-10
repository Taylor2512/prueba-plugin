import type { OptionItem } from './optionTypes';

const normalizeText = (value: unknown) => String(value || '').trim();

export const normalizeOptionId = (value: unknown, index: number): string => {
  const normalized = normalizeText(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

  return normalized || `option_${index + 1}`;
};

export const normalizeOptionsFromSource = (
  source: Array<string | OptionItem> | undefined,
): OptionItem[] => {
  const list = Array.isArray(source) ? source : [];

  if (!list.length) return [{ optionId: 'option_1', label: 'Opción 1' }];

  return list.map((entry, index) => {
    if (typeof entry === 'string') {
      const label = normalizeText(entry) || `Opción ${index + 1}`;

      return {
        optionId: normalizeOptionId(label, index),
        label,
      } as OptionItem;
    }

    const label = normalizeText(entry?.label) || `Opción ${index + 1}`;

    return {
      optionId: normalizeOptionId(entry?.optionId || label, index),
      label,
      value: entry?.value,
      disabled: !!entry?.disabled,
    } as OptionItem;
  });
};

export const ensureAtLeastOneOption = (options: OptionItem[]) =>
  options.length ? options : [{ optionId: 'option_1', label: 'Opción 1' }];
