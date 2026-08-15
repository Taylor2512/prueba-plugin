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
  resolveSchemaOwnerColorValue,
} from '@sisad-pdfme/schemas/shared/fieldChrome';
import { clearSchemaRoot } from '@sisad-pdfme/schemas/shared/schemaDom';
import { HEX_COLOR_PATTERN } from '@sisad-pdfme/schemas/constants';
import { createSchemaInspectorConfig } from '@sisad-pdfme/schemas/schemaFamilies';
import {
  basicsFields,
  helpFields,
  dataLabelFields,
  COMMON_PROPERTY_MAP,
  hexColorField,
} from '@sisad-pdfme/schemas/propPanel/commonInspectorFields';
import {
  type OptionGroupLayoutConfig,
  computeOptionGroupDesignerHeightMM,
  computeOptionGroupDesignerWidthMM,
  getOptionGroupLayoutConfig,
  type OptionGroupType,
} from '@sisad-pdfme/schemas/options/optionGroupLayout';
import { buildDefaultOptionGroupOptions, normalizeOptionText } from '@sisad-pdfme/schemas/options/optionModel';
import { createOptionGroupRuntime } from '@sisad-pdfme/schemas/options/optionGroupRenderer';
import type { GroupMeta } from '@sisad-pdfme/shared/schemaDesignerMeta';
import { createOptionIndicatorElement } from '@sisad-pdfme/schemas/options/optionIndicator';

export type OptionGroupIndicatorShape = 'square' | 'circle';

type OptionGroupPluginConfig = {
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

type OptionGroupRootRuntimeParams = {
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
  renderDesigner?: () => HTMLElement;
  renderRuntime: () => HTMLElement;
};

export type OptionGroupDefaultSchemaParams = {
  /**
   * Opcional a propósito: una plantilla no debe fijar la identidad.
   *
   * Cuando los grupos declaraban un `id` literal, cada instancia creada desde
   * la plantilla nacía con la misma identidad, así que dos grupos del mismo
   * tipo colisionaban como key de React y como unidad de completion. El resto
   * de schemas tampoco lo declaran: lo genera el designer al insertar.
   */
  id?: string;
  type: OptionGroupType;
  /**
   * Opcional por el mismo motivo que `id`.
   *
   * Un `groupId` literal en la plantilla hacía que todos los grupos del mismo
   * tipo compartieran grupo, así que seleccionar en uno alteraba al otro.
   * Ausente, `resolveOptionGroupKey` cae al `name` del schema —único por
   * documento— y cada grupo queda aislado. Agrupar varios pasa a ser una
   * decisión explícita del diseño.
   */
  groupId?: string;
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
  color?: string;
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

const resolveOptionGroupKey = (schema: OptionGroupDesignerSchema): string =>
  schema.__designer?.group?.groupId ?? schema.groupId ?? schema.group ?? schema.name ?? '';

export const syncDesignerOptionGroupPatch = (
  schema: OptionGroupDesignerSchema,
  groupType: 'checkbox' | 'radio',
) => ({
  '__designer.group.groupId': resolveOptionGroupKey(schema),
  '__designer.group.groupName': normalizeOptionText(schema.groupName) || undefined,
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
const applyOptionGroupRootRuntime = ({
  rootElement,
  isDesigner,
  mode,
  selectionMode,
}: OptionGroupRootRuntimeParams): void => {
  rootElement.classList.add('sisad-pdfme-option-group-root');
  rootElement.dataset.renderMode = mode;
  rootElement.dataset.schemaFamily = 'option-based';
  rootElement.dataset.selectionMode = selectionMode;
  // Marcador raíz estable por familia: contrato DOM para tests/hosts que la
  // unificación designer/runtime no debe perder.
  if (selectionMode === 'single') {
    rootElement.dataset.radioGroupRoot = 'true';
  } else {
    rootElement.dataset.checkboxGroupRoot = 'true';
  }
  Object.assign(rootElement.style, {
    overflow: 'visible',
    background: 'transparent',
    border: '0',
    boxShadow: 'none',
    margin: '0',
    padding: '0',
  });

  if (mode === 'form') {
    Object.assign(rootElement.style, {
      display: 'block',
      width: '100%',
      height: 'auto',
      minHeight: '22px',
      paddingRight: selectionMode === 'single' ? '22px' : '0',
      pointerEvents: 'auto',
      fontSize: 'var(--sisad-schema-font-size)',
      lineHeight: 'var(--sisad-schema-line-height)',
    });
  } else {
    Object.assign(rootElement.style, {
      display: 'block',
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
    });
  }
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
  // Sin esto el marcador nunca recibía el dueño y caía al cian de respaldo: un
  // grupo asignado a un destinatario se veía cian mientras el resto de campos
  // tomaban su color.
  ownerColor: resolveSchemaOwnerColorValue(schema),
  // El azul de antd solo entra si el schema no tiene color propio NI dueño.
  color: schema.color || resolveSchemaOwnerColorValue(schema) || '#1677ff',
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

  // Note: no auto-compact of the schema box here. The markers scale to fill the
  // box (see createOptionGroupRuntime), so the group is freely resizable; forcing
  // a fixed compact size would fight the user's resize. Sensible defaults come
  // from the schema factory and option add/remove adjusts the box explicitly.

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
  // Sin color por defecto: materializarlo hacía que todo grupo naciera azul de
  // antd y nunca adoptara el color de su destinatario.
  color = '',
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
    ...(color ? { color } : {}),
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
    color: hexColorField({
      title: i18n('schemas.color'),
      pattern: HEX_COLOR_PATTERN,
      message: i18n('validation.hexColor'),
      required: true,
    }),
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
    // Rendered by the DetailView as a direct React editor (SchemaOptionsEditor):
    // no Ant Card wrapper. The imperative `config.optionsWidget` remains
    // registered in `widgets` only as a  fallback for other hosts.
    optionsContainer: {
      title: config.optionsTitle,
      type: 'string',
      widget: 'SchemaOptionsEditor',
      span: 24,
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
const createDesignerOptionBox = (
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
 * Synchronizes  or oversized schemas to compact designer geometry.
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

;
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
