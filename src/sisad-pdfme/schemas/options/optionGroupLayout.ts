/**
 * optionGroupLayout.ts
 *
 * Shared layout constants and helpers for designer-mode compact rendering of
 * option-based group schemas (checkboxGroup, radioGroup).
 *
 * All px values are DOM pixels at 96 dpi. Schema geometry (width/height) must
 * be in millimetres — use PX_PER_MM to convert.
 *
 * The + button is rendered as an external overlay (GroupOptionFloatingAction),
 * so the bounding box covers ONLY the stacked option indicator squares.
 */

export const PX_PER_MM = 96 / 25.4;

export type OptionGroupType = 'checkboxGroup' | 'radioGroup';

const OPTION_GROUP_TYPES: ReadonlySet<string> = new Set(['checkboxgroup', 'radiogroup']);

export type OptionGroupLayoutConfig = {
  /** Width/height of each indicator square, px. */
  boxSize: number;
  /** Vertical gap between indicator squares, px. */
  boxGap: number;
};

export const CHECKBOX_GROUP_LAYOUT: OptionGroupLayoutConfig = {
  boxSize: 22,
  boxGap: 4,
};

export const RADIO_GROUP_LAYOUT: OptionGroupLayoutConfig = {
  boxSize: 26,
  boxGap: 4,
};

export const getOptionGroupLayoutConfig = (type: OptionGroupType): OptionGroupLayoutConfig =>
  type === 'radioGroup' ? RADIO_GROUP_LAYOUT : CHECKBOX_GROUP_LAYOUT;

/**
 * Returns the schema HEIGHT in millimetres for n options.
 * Formula: n * boxSize + (n-1) * boxGap
 * The + button is not part of the schema; no clearance space needed.
 */
export const computeOptionGroupDesignerHeightMM = (
  optionsCount: number,
  config: OptionGroupLayoutConfig,
): number => {
  const n = Math.max(1, Math.floor(Number.isFinite(optionsCount) ? optionsCount : 1));
  const gapCount = n > 1 ? n - 1 : 0;
  const px = n * config.boxSize + gapCount * config.boxGap;
  return parseFloat((px / PX_PER_MM).toFixed(4));
};

/**
 * Returns the schema WIDTH in millimetres (one indicator square wide).
 */
export const computeOptionGroupDesignerWidthMM = (
  config: OptionGroupLayoutConfig,
): number => parseFloat((config.boxSize / PX_PER_MM).toFixed(4));

/** Convenience helpers keyed by schema type. */
export const optionGroupDesignerHeightMM = (type: OptionGroupType, optionsCount: number): number =>
  computeOptionGroupDesignerHeightMM(optionsCount, getOptionGroupLayoutConfig(type));

export const optionGroupDesignerWidthMM = (type: OptionGroupType): number =>
  computeOptionGroupDesignerWidthMM(getOptionGroupLayoutConfig(type));

export const normalizeOptionGroupType = (type: string): OptionGroupType | null => {
  const normalized = String(type || '').trim().toLowerCase();
  if (normalized === 'checkboxgroup') return 'checkboxGroup';
  if (normalized === 'radiogroup') return 'radioGroup';
  return null;
};

export const isOptionGroupType = (type: string): boolean => OPTION_GROUP_TYPES.has(String(type || '').trim().toLowerCase());
