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
import { clearSchemaRoot } from '../shared/schemaDom.js';
import { HEX_COLOR_PATTERN } from '../constants.js';
import { createSchemaInspectorConfig } from '../schemaFamilies.js';
import {
  basicsFields,
  helpFields,
  dataLabelFields,
  COMMON_PROPERTY_MAP,
} from '../propPanel/commonInspectorFields.js';
import {
  type OptionGroupLayoutConfig,
  computeOptionGroupDesignerHeightMM,
  computeOptionGroupDesignerWidthMM,
  getOptionGroupLayoutConfig,
  type OptionGroupType,
} from './optionGroupLayout.js';
import { buildDefaultOptionGroupOptions, normalizeText } from './optionModel.js';
import createOptionGroupRuntime from './optionGroupRenderer.js';
import type { GroupMeta } from '../../shared/schemaDesignerMeta.js';
import { createOptionIndicatorElement } from './optionIndicator.js';

export type OptionGroupIndicatorShape = 'square' | 'circle';

export type OptionGroupPluginConfig = {
  type: OptionGroupType;
  selectionMode: 'single' | 'multiple';
  indicatorShape: OptionGroupIndicatorShape;
};

export type SimpleOption = { optionId: string; label: string };

export type OptionGroupDesignerSchema = {
  groupId?: string;
  group?: string;
  name?: string;
  groupName?: string;
  lockedAsGroup?: boolean;
  __designer?: {
    group?: GroupMeta;
    [key: string]: unknown;
  };
};

export type OptionGroupRootRuntimeParams = {
  rootElement: HTMLElement;
  isDesigner: boolean;
  mode: 'designer' | 'form' | 'viewer';
  selectionMode: 'single' | 'multiple';
};

export type OptionGroupRuntimeSharedParams = {
  schema: {
    color?: string;
    groupName?: string;
    orientation?: 'vertical' | 'horizontal';
    spacing?: number;
    required?: boolean;
    readOnly?: boolean;
    readonly?: boolean;
    locked?: boolean;
    [key: string]: unknown;
  };
  mode: 'designer' | 'form' | 'viewer';
  editable: boolean;
  invalid: boolean;
};

export type OptionGroupDesignerDimensions = {
  width: number;
  height: number;
};

export type OptionGroupUiRenderParams = {
  rootElement: HTMLElement;
  isDesigner: boolean;
  mode: 'designer' | 'form' | 'viewer';
  selectionMode: 'single' | 'multiple';
  invalid: boolean;
  renderDesigner: () => HTMLElement;
  renderRuntime: () => HTMLElement;
};

export type OptionGroupDefaultSchemaParams = {
  id: string;
  type: OptionGroupType;
  groupId: string;
  groupName: string;
  groupType: 'checkbox' | 'radio';
  optionPrefix: string;
  selectionMode: 'single' | 'multiple';
  optionsCount?: number;
  content?: string;
  selectedOptionId?: string;
  selectedOptionIds?: string[];
  defaultSelectedOptionId?: string;
  defaultSelectedOptionIds?: string[];
  color?: string;
  name?: string;
};

export type OptionGroupDefaultSchema = {
  id: string;
  name: string;
  type: OptionGroupType;
  content: string;
  position: { x: number; y: number };
  width: number;
  height: number;
  groupId: string;
  group: string;
  groupName: string;
  lockedAsGroup: true;
  orientation: 'vertical';
  spacing: number;
  options: ReturnType<typeof buildDefaultOptionGroupOptions>;
  color: string;
  __designer: {
    group: {
      groupId: string;
      groupType: 'checkbox' | 'radio';
      groupName: string;
      lockedAsGroup: true;
    };
  };
} & (
  | {
      selectedOptionId: string;
      defaultSelectedOptionId: string;
    }
  | {
      selectedOptionIds: string[];
      defaultSelectedOptionIds: string[];
    }
);

export type OptionGroupPropPanelConfig = {
  optionsTitle: string;
  optionsWidget: string;
  groupNameTitle: string;
  groupIdTitle?: string;
  lockedAsGroupTitle?: string;
  includeMinMax?: boolean;
  minSelectedTitle?: string;
  maxSelectedTitle?: string;
  propertyMap?: Record<string, string>;
  widgets: Record<string, unknown>;
  defaultSchema: Record<string, unknown>;
};

export const resolveOptionGroupKey = (schema: OptionGroupDesignerSchema): string =>
  schema.__designer?.group?.groupId ?? schema.groupId ?? schema.group ?? schema.name ?? '';

export const syncDesignerOptionGroupPatch = (
  schema: OptionGroupDesignerSchema,
  groupType: 'checkbox' | 'radio',
) => ({
  '__designer.group.groupId': resolveOptionGroupKey(schema),
  '__designer.group.groupName': normalizeText(schema.groupName) || undefined,
  '__designer.group.groupType': groupType,
  '__designer.group.lockedAsGroup': schema.lockedAsGroup !== false,
});

export const resolveOptionGroupReadOnly = (schema: {
  readOnly?: boolean;
  readonly?: boolean;
  locked?: boolean;
}): boolean => Boolean(schema.readOnly || schema.readonly || schema.locked);

/**
 * Applies the shared runtime root sizing contract for marker-only option groups.
 * In designer mode the host geometry stays authoritative unless compact sizing
 * is explicitly requested by the caller.
 */
export const applyOptionGroupRootRuntime = ({
  rootElement,
  isDesigner,
  mode,
  selectionMode,
}: OptionGroupRootRuntimeParams): void => {
  rootElement.classList.add('sisad-pdfme-option-group-root');
  rootElement.dataset.renderMode = mode;
  rootElement.dataset.schemaFamily = 'option-based';
  rootElement.dataset.selectionMode = selectionMode;
  // Designer/viewer: the group root is transparent to pointer events so clicks
  // fall through to the .sisad-pdfme-ui-custom-selectable wrapper (Selecto/
  // Moveable target). Only form makes internal option rows interactive.
  rootElement.style.pointerEvents = mode === 'form' ? 'auto' : 'none';
  if (isDesigner) {
    rootElement.dataset.designerSelectionMode = 'root-only';
  }
};

export const buildOptionGroupRuntimeSharedParams = ({
  schema,
  mode,
  editable,
  invalid,
}: OptionGroupRuntimeSharedParams) => ({
  schema,
  mode,
  editable,
  invalid,
  color: schema.color || '#1677ff',
  orientation: schema.orientation,
  spacing: Number.isFinite(Number(schema.spacing)) ? Number(schema.spacing) : 3,
  groupName: schema.groupName,
  required: Boolean(schema.required),
  readOnly: resolveOptionGroupReadOnly(schema),
});

export const buildOptionGroupDesignerDimensions = (
  layout: OptionGroupLayoutConfig,
  optionsCount: number,
): OptionGroupDesignerDimensions => ({
  width: computeOptionGroupDesignerWidthMM(layout),
  height: computeOptionGroupDesignerHeightMM(optionsCount, layout),
});

export const renderOptionGroupUi = ({
  rootElement,
  isDesigner,
  mode,
  selectionMode,
  invalid,
  // `renderDesigner` is intentionally ignored: designer, viewer and form all
  // render the SAME compact runtime markers. Selecting a group must NOT swap to
  // a different (cyan designer-box) design — selection chrome (frame/handles/+)
  // is drawn by Moveable/Selecto on top, never inside the schema DOM.
  renderRuntime,
}: OptionGroupUiRenderParams): void => {
  clearSchemaRoot(rootElement);
  applyOptionGroupRootRuntime({
    rootElement,
    isDesigner,
    mode,
    selectionMode,
  });
  rootElement.dataset.optionGroupInvalid = String(invalid);

  rootElement.appendChild(renderRuntime());
};

export const buildOptionGroupDefaultSchema = ({
  id,
  type,
  groupId,
  groupName,
  groupType,
  optionPrefix,
  selectionMode,
  optionsCount = 2,
  content,
  selectedOptionId,
  selectedOptionIds = [],
  defaultSelectedOptionId,
  defaultSelectedOptionIds = [],
  color = '#1677ff',
  name = '',
}: OptionGroupDefaultSchemaParams): OptionGroupDefaultSchema => {
  const dimensions = buildOptionGroupDesignerDimensions(getOptionGroupLayoutConfig(type), optionsCount);
  const safeSelectedId = selectedOptionId || defaultSelectedOptionId || 'option_1';

  return {
    id,
    name,
    type,
    content: content ?? (selectionMode === 'single' ? safeSelectedId : ''),
    position: { x: 0, y: 0 },
    ...dimensions,
    groupId,
    group: groupId,
    groupName,
    lockedAsGroup: true,
    orientation: 'vertical',
    spacing: getOptionGroupLayoutConfig(type).boxGap,
    options: buildDefaultOptionGroupOptions(optionPrefix, optionsCount),
    ...(selectionMode === 'single'
      ? {
          selectedOptionId: safeSelectedId,
          defaultSelectedOptionId: defaultSelectedOptionId || safeSelectedId,
        }
      : {
          selectedOptionIds,
          defaultSelectedOptionIds,
        }),
    color,
    __designer: {
      group: {
        groupId,
        groupType,
        groupName,
        lockedAsGroup: true,
      },
    },
  };
};

export const createOptionGroupPropPanelConfig = (config: OptionGroupPropPanelConfig) => ({
  schema: ({ i18n }: { i18n: (key: string) => string }) => ({
    ...basicsFields(),
    color: {
      title: i18n('schemas.color'),
      type: 'string',
      widget: 'color',
      props: { disabledAlpha: true },
      required: true,
      rules: [{ pattern: HEX_COLOR_PATTERN, message: i18n('validation.hexColor') }],
    },
    groupName: { title: config.groupNameTitle, type: 'string', span: 12 },
    orientation: {
      title: 'Orientación',
      type: 'string',
      widget: 'select',
      span: 12,
      props: { options: [{ label: 'Vertical', value: 'vertical' }, { label: 'Horizontal', value: 'horizontal' }] },
    },
    spacing: { title: 'Espaciado', type: 'number', widget: 'inputNumber', span: 8, props: { min: 0, precision: 0 } },
    ...(config.includeMinMax
      ? {
          minSelected: {
            title: config.minSelectedTitle || 'Mín. seleccionadas',
            type: 'number',
            widget: 'inputNumber',
            span: 8,
            props: { min: 0, precision: 0 },
          },
          maxSelected: {
            title: config.maxSelectedTitle || 'Máx. seleccionadas',
            type: 'number',
            widget: 'inputNumber',
            span: 8,
            props: { min: 0, precision: 0 },
          },
        }
      : {}),
    optionsContainer: {
      title: config.optionsTitle,
      type: 'string',
      widget: 'card',
      span: 24,
      properties: { options: { widget: config.optionsWidget, span: 24 } },
    },
    ...helpFields(),
    ...dataLabelFields(),
    groupId: { title: config.groupIdTitle || 'ID del grupo', type: 'string', span: 12, description: 'ID técnico del grupo.' },
    lockedAsGroup: { title: config.lockedAsGroupTitle || 'Bloquear como grupo', type: 'boolean', span: 12 },
  }),
  inspector: createSchemaInspectorConfig('choice', {
    propertyMap: {
      ...COMMON_PROPERTY_MAP,
      color: 'style',
      groupName: 'data',
      orientation: 'data',
      spacing: 'data',
      optionsContainer: 'data',
      ...(config.includeMinMax ? { minSelected: 'data', maxSelected: 'data' } : {}),
      ...(config.propertyMap || {}),
    },
    includeConnections: true,
  }),
  widgets: config.widgets,
  defaultSchema: config.defaultSchema,
});

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

  // Single selected/deselected logic for both shapes: respect isSelected with
  // one designer palette. (Previously radio hardcoded `false` + a different
  // gray, so designer never reflected selection while runtime did.)
  const indicator =
    createOptionIndicatorElement({
      shape: indicatorShape,
      checked: isSelected,
      color: DESIGNER_OPTION_BOX_BORDER,
      mode: 'designer',
      size: indicatorShape === 'square' ? 14 : 18,
      readOnly: true,
      disabled: true,
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
  fallbackLabelPrefix = 'Opción',
): HTMLDivElement => {
  const wrapper = createDesignerGroupStack(layout.boxGap);
  const safeOptions = options.length ? options : buildDefaultOptionGroupOptions(fallbackLabelPrefix, 1);

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

export default createOptionGroupSchemaPlugin;
