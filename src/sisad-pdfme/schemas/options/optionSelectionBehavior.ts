import type { OptionItem } from '@sisad-pdfme/schemas/options/optionTypes';
import { normalizeOptionText } from '@sisad-pdfme/schemas/options/optionModel';

const normalizeOptionIds = (ids: unknown, validIds: Set<string>): string[] => {
  if (!Array.isArray(ids)) return [];
  return ids.map(normalizeOptionText).filter((id) => id && validIds.has(id));
};

const getValidOptionIds = (options: OptionItem[]): Set<string> =>
  new Set(options.map((option) => option.optionId));

const normalizeKnownOptionIds = (ids: unknown, options: OptionItem[]): string[] =>
  normalizeOptionIds(ids, getValidOptionIds(options));

/**
 * Core single-option matcher: resolve a stored value to a known optionId by id
 * then by value. Returns undefined when nothing matches (no fallback applied).
 * Shared by the Strategy resolver below and the optionValueAdapter Adapter so
 * there is exactly one matching path.
 */
export const matchOptionId = (
  schemaSelected: unknown,
  options: OptionItem[],
): string | undefined => {
  const validIds = new Set(options.map((option) => option.optionId));
  const byId = normalizeOptionText(schemaSelected);
  if (byId && validIds.has(byId)) return byId;

  const byValue = options.find((option) => normalizeOptionText(option.value) === byId);
  return byValue?.optionId;
};

export const resolveSingleOptionSelection = (
  schemaSelected: unknown,
  options: OptionItem[],
  fallback?: string | null,
): string => {
  const matched = matchOptionId(schemaSelected, options);
  if (matched) return matched;

  const validIds = new Set(options.map((option) => option.optionId));
  return fallback && validIds.has(fallback) ? fallback : options[0]?.optionId || 'option_1';
};

export const resolveMultiOptionSelection = (
  schemaSelected: unknown,
  options: OptionItem[],
  fallback: string[] = [],
): string[] => {
  const validIds = getValidOptionIds(options);
  const normalized = normalizeOptionIds(schemaSelected, validIds);
  return normalized.length > 0 ? normalized : fallback.filter((id) => validIds.has(id));
};

export const toggleMultiOptionSelection = (
  selectedIds: string[],
  optionId: string,
  options: OptionItem[],
  limits?: {
    minSelected?: number;
    maxSelected?: number;
  },
): string[] => {
  const current = normalizeKnownOptionIds(selectedIds, options);
  const next = new Set(current);

  if (next.has(optionId)) {
    if (limits?.minSelected != null && next.size <= limits.minSelected) {
      return current;
    }
    next.delete(optionId);
    return Array.from(next);
  }

  if (limits?.maxSelected != null && next.size >= limits.maxSelected) {
    return current;
  }

  next.add(optionId);
  return Array.from(next);
};

export const clampMultiOptionSelection = (
  selectedIds: string[],
  options: OptionItem[],
  limits?: {
    minSelected?: number;
    maxSelected?: number;
  },
): string[] => {
  const selected = normalizeKnownOptionIds(selectedIds, options);

  if (limits?.maxSelected != null && selected.length > limits.maxSelected) {
    selected.length = limits.maxSelected;
  }

  if (limits?.minSelected != null && selected.length < limits.minSelected) {
    for (const option of options) {
      if (selected.length >= limits.minSelected) break;
      if (!selected.includes(option.optionId)) selected.push(option.optionId);
    }
  }

  return selected;
};

export const normalizeStringOptions = (options: unknown[]): string[] => {
  const normalized: string[] = [];
  const seen = new Set<string>();

  for (const option of Array.isArray(options) ? options : []) {
    const value = normalizeOptionText(option);
    if (!value || seen.has(value)) continue;
    seen.add(value);
    normalized.push(value);
  }

  return normalized;
};

export const resolveCompactSelection = (currentValue: unknown, options: string[]): string => {
  const normalizedValue = normalizeOptionText(currentValue);
  if (normalizedValue && options.includes(normalizedValue)) return normalizedValue;
  return options[0] || '';
};
