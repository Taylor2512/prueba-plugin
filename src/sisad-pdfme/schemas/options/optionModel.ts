import type { OptionItem } from './optionTypes';

export const normalizeText = (value: unknown): string => String(value || '').trim();

export type NormalizeOptionGroupSourceOptions = {
  fallbackLabelPrefix?: string;
  minimumCount?: number;
};

export const buildDefaultOptionGroupOptions = (
  fallbackLabelPrefix: string,
  minimumCount = 1,
): OptionItem[] =>
  normalizeOptionsFromSource([], {
    fallbackLabelPrefix,
    minimumCount,
  });

export const normalizeOptionGroupOptions = (
  source: Array<string | OptionItem> | undefined,
  fallbackLabelPrefix: string,
  minimumCount = 1,
): OptionItem[] =>
  normalizeOptionsFromSource(source, {
    fallbackLabelPrefix,
    minimumCount,
  });

export const normalizeOptionId = (value: unknown, index: number): string => {
  const normalized = normalizeText(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

  return normalized || `option_${index + 1}`;
};

export const normalizeOptionsFromSource = (
  source: Array<string | OptionItem> | undefined,
  options: NormalizeOptionGroupSourceOptions = {},
): OptionItem[] => {
  const list = Array.isArray(source) ? source : [];
  const fallbackLabelPrefix = options.fallbackLabelPrefix || 'Opción';
  const minimumCountValue = Number(options.minimumCount);
  const minimumCount = Math.max(1, Math.floor(Number.isFinite(minimumCountValue) ? minimumCountValue : 1));

  if (!list.length) {
    return Array.from({ length: minimumCount }, (_, index) => ({
      optionId: `option_${index + 1}`,
      label: `${fallbackLabelPrefix} ${index + 1}`,
    }));
  }

  return list.map((entry, index) => {
    if (typeof entry === 'string') {
      const label = normalizeText(entry) || `${fallbackLabelPrefix} ${index + 1}`;

      return {
        optionId: normalizeOptionId(label, index),
        label,
      } as OptionItem;
    }

    const label = normalizeText(entry?.label) || `${fallbackLabelPrefix} ${index + 1}`;

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
