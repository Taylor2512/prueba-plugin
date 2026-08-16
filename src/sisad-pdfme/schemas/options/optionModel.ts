import type { OptionItem } from '@sisad-pdfme/schemas/options/optionTypes';
import { normalizeLooseText } from '@sisad-pdfme/shared/text';

export const normalizeOptionText = normalizeLooseText;
export const normalizeText = normalizeOptionText;

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
  const normalized = normalizeOptionText(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

  return normalized || `option_${index + 1}`;
};

const normalizeOptionsFromSource = (
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
      const label = normalizeOptionText(entry) || `${fallbackLabelPrefix} ${index + 1}`;

      return {
        optionId: normalizeOptionId(label, index),
        label,
      } as OptionItem;
    }

    const label = normalizeOptionText(entry?.label) || `${fallbackLabelPrefix} ${index + 1}`;

    return {
      optionId: normalizeOptionId(entry?.optionId || label, index),
      label,
      value: entry?.value,
      disabled: !!entry?.disabled,
    } as OptionItem;
  });
};

export const ensureAtLeastOneOption = (options: OptionItem[]) =>
  options.length ? options : buildDefaultOptionGroupOptions('Opción', 1);
