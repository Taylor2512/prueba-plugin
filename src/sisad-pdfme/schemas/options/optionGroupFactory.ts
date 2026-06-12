/**
 * optionGroupFactory.ts
 *
 * Factory helpers for option-group-based schema plugins (checkboxGroup, radioGroup).
 *
 * checkboxGroup and radioGroup share:
 * - Designer DOM: createDesignerOptionBoxEl + createDesignerGroupStack from fieldChrome
 * - Runtime DOM: createOptionGroupRuntime from optionGroupRenderer
 * - Layout: optionGroupLayout constants and mm/px helpers
 *
 * Differences per type:
 * - selectionMode: 'multiple' (checkbox) | 'single' (radio)
 * - indicatorShape: 'square' (checkbox) | 'circle' (radio)
 * - layout: CHECKBOX_GROUP_LAYOUT | RADIO_GROUP_LAYOUT
 * - geometry dataset key (to avoid double-triggering sync)
 *
 * select/dropdown does NOT use this factory — it uses a compact text input
 * and has no floating + button.
 */
import {
  createDesignerOptionBoxEl,
  createDesignerGroupStack,
  DESIGNER_OPTION_BOX_BORDER,
} from '../shared/fieldChrome.js';
import {
  buildCheckboxIndicator,
  buildRadioIndicator,
} from '../groupSchemaRender.js';
import {
  type OptionGroupLayoutConfig,
  computeOptionGroupDesignerHeightMM,
  computeOptionGroupDesignerWidthMM,
  getOptionGroupLayoutConfig,
  type OptionGroupType,
} from './optionGroupLayout.js';
import createOptionGroupRuntime from './optionGroupRenderer.js';

export type OptionGroupIndicatorShape = 'square' | 'circle';

export type OptionGroupPluginConfig = {
  type: OptionGroupType;
  selectionMode: 'single' | 'multiple';
  indicatorShape: OptionGroupIndicatorShape;
};

export type SimpleOption = { optionId: string; label: string };

// ─── Backward compat ──────────────────────────────────────────────────────────
// Keep the old export so callers importing createOptionGroupPlugin don't break.
export const createOptionGroupPlugin = createOptionGroupSchemaPlugin as unknown as (config: OptionGroupPluginConfig) => { config: OptionGroupPluginConfig; layout: OptionGroupLayoutConfig };

// ─── Designer DOM builder ─────────────────────────────────────────────────────

/**
 * Creates a single designer option box element.
 * Caller must set the schema-specific data attribute after calling.
 */
export const createDesignerOptionBox = (
  option: SimpleOption,
  layout: OptionGroupLayoutConfig,
  indicatorShape: OptionGroupIndicatorShape,
  isSelected: boolean,
): HTMLDivElement => {
  const box = createDesignerOptionBoxEl(layout.boxSize);
  box.setAttribute('data-option-id', option.optionId);
  box.setAttribute('aria-label', option.label);

  const indicator =
    indicatorShape === 'square'
      ? buildCheckboxIndicator(DESIGNER_OPTION_BOX_BORDER, isSelected)
      : buildRadioIndicator('#8b8b8b', false);

  const indicatorSize = indicatorShape === 'square' ? '14px' : '18px';
  Object.assign(indicator.style, {
    width: indicatorSize,
    height: indicatorSize,
    minWidth: indicatorSize,
    minHeight: indicatorSize,
  });

  box.appendChild(indicator);
  return box;
};

/**
 * Creates the full designer stack for an option group.
 */
export const createDesignerOptionGroupEl = (
  options: SimpleOption[],
  layout: OptionGroupLayoutConfig,
  indicatorShape: OptionGroupIndicatorShape,
  selectedIds: Set<string>,
  dataAttr: string,
): HTMLDivElement => {
  const wrapper = createDesignerGroupStack(layout.boxGap);
  const safeOptions = options.length ? options : [{ optionId: 'option_1', label: 'Opción 1' }];

  for (const option of safeOptions) {
    const box = createDesignerOptionBox(option, layout, indicatorShape, selectedIds.has(option.optionId));
    box.setAttribute(dataAttr, option.optionId);
    wrapper.appendChild(box);
  }

  return wrapper;
};

// ─── Geometry sync helper ─────────────────────────────────────────────────────

const almostEqual = (a: unknown, b: number, tol = 0.1): boolean => {
  const v = Number(a);
  return Number.isFinite(v) && Math.abs(v - b) <= tol;
};

type SyncParams = {
  schema: { orientation?: string; spacing?: number; width?: number; height?: number; [key: string]: unknown };
  options: SimpleOption[];
  rootElement: HTMLElement;
  onChange?: (arg: unknown) => void;
  layout: OptionGroupLayoutConfig;
  datasetKey: string;
};

/**
 * Synchronizes legacy or oversized schemas to compact designer geometry.
 * Each schema type uses a distinct datasetKey to avoid double-sync triggers.
 */
export const syncOptionGroupDesignerGeometry = ({
  schema, options, rootElement, onChange, layout, datasetKey,
}: SyncParams): void => {
  if (!onChange) return;

  const count = Math.max(1, options.length);
  const expectedWidth = computeOptionGroupDesignerWidthMM(layout);
  const expectedHeight = computeOptionGroupDesignerHeightMM(count, layout);

  const needsSync =
    schema.orientation !== 'vertical' ||
    !almostEqual(schema.spacing, layout.boxGap) ||
    !almostEqual(schema.width, expectedWidth) ||
    !almostEqual(schema.height, expectedHeight);

  if (!needsSync) return;

  const signature = `${expectedWidth}:${expectedHeight}:${layout.boxGap}:${count}`;
  if (rootElement.dataset[datasetKey] === signature) return;
  rootElement.dataset[datasetKey] = signature;

  requestAnimationFrame(() => {
    onChange([
      { key: 'orientation', value: 'vertical' },
      { key: 'spacing', value: layout.boxGap },
      { key: 'width', value: expectedWidth },
      { key: 'height', value: expectedHeight },
    ]);
  });
};

// ─── Factory function ──────────────────────────────────────────────────────────

export { getOptionGroupLayoutConfig, computeOptionGroupDesignerHeightMM, computeOptionGroupDesignerWidthMM };
export { createOptionGroupRuntime };

/**
 * createOptionGroupSchemaPlugin
 *
 * Returns the factory config + resolved layout. checkboxGroup/radioGroup own
 * their full propPanel and pdf() implementations; they call the helpers above
 * for their ui() designer branch.
 *
 * Keeping propPanel/pdf outside the factory avoids merging divergent configs
 * (selection keys, limits, color defaults, PDF drawing logic) into a single
 * over-parameterized factory.
 */
export function createOptionGroupSchemaPlugin(config: OptionGroupPluginConfig): {
  config: OptionGroupPluginConfig;
  layout: OptionGroupLayoutConfig;
} {
  return { config, layout: getOptionGroupLayoutConfig(config.type) };
}

export default createOptionGroupPlugin;
