import type { Plugin, PropPanelWidgetProps, SchemaForUI } from '@sisad-pdfme/common';
import { hex2PrintingColor, convertForPdfLayoutProps } from '../utils.js';
import { isEditable } from '../utils.js';
import { HEX_COLOR_PATTERN } from '../constants.js';
import { createSchemaPlugin, renderLucideIcon } from '../schemaBuilder.js';
import { createSchemaInspectorConfig } from '../schemaFamilies.js';
import {
  basicsFields,
  helpFields,
  dataLabelFields,
  COMMON_PROPERTY_MAP,
} from '../propPanel/commonInspectorFields.js';
import { SquareCheck } from 'lucide-react';
import type { GroupMeta } from '../../shared/schemaDesignerMeta.js';
import {
  hexAlpha,
  buildGroupWrapper,
  buildGroupContainer,
  buildGroupLabel,
  buildOptionRow,
  buildCheckboxIndicator,
  buildOptionLabel,
} from '../groupSchemaRender.js';
import {
  syncOptionGroupDesignerGeometry,
  createDesignerOptionGroupEl,
} from '../options/optionGroupFactory.js';
import { clearSchemaRoot } from '../shared/schemaDom.js';

// ─── Designer compact geometry constants ────────────────────────────────────
// The + button is rendered as an external overlay (GroupOptionFloatingAction),
// so the bounding box covers ONLY the stacked indicator squares.

import {
  CHECKBOX_GROUP_LAYOUT,
  computeOptionGroupDesignerHeightMM,
  computeOptionGroupDesignerWidthMM,
} from '../options/optionGroupLayout.js';

const DESIGNER_BOX_GAP  = CHECKBOX_GROUP_LAYOUT.boxGap;   // px (used in propPanel defaultSchema + editor)
const DESIGNER_BOX_BORDER = '#65d8de';                      // used in form/viewer indicator builders

const calculateDesignerHeight = (optionsCount: number): number =>
  computeOptionGroupDesignerHeightMM(optionsCount, CHECKBOX_GROUP_LAYOUT);

const DESIGNER_BOX_MM = computeOptionGroupDesignerWidthMM(CHECKBOX_GROUP_LAYOUT);

// ─── Types ───────────────────────────────────────────────────────────────────

type CheckboxOption = {
  optionId: string;
  label: string;
};

type CheckboxGroupSchema = SchemaForUI & {
  groupId?: string;
  group?: string;
  groupName?: string;
  options?: Array<string | CheckboxOption>;
  selectedOptionIds?: string[];
  defaultSelectedOptionIds?: string[];
  lockedAsGroup?: boolean;
  orientation?: 'vertical' | 'horizontal';
  spacing?: number;
  minSelected?: number;
  maxSelected?: number;
  color: string;
  __designer?: {
    group?: GroupMeta;
    [key: string]: unknown;
  };
};

// ─── Pure helpers ────────────────────────────────────────────────────────────

const normalizeText = (value: unknown) => String(value || '').trim();
const ensureOptionId = (value: string, index: number) => normalizeText(value) || `option_${index + 1}`;
const normalizeSelectionLimit = (value: unknown): number | undefined => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return undefined;
  return Math.floor(parsed);
};

const normalizeOptions = (schema: CheckboxGroupSchema): CheckboxOption[] => {
  const source = Array.isArray(schema.options) ? schema.options : [];
  if (!source.length) {
    return [
      { optionId: 'option_1', label: 'Casilla 1' },
      { optionId: 'option_2', label: 'Casilla 2' },
    ];
  }
  return source.map((entry, index) => {
    if (typeof entry === 'string') {
      const optionId = ensureOptionId(entry, index);
      return { optionId, label: entry || `Casilla ${index + 1}` };
    }
    const optionId = ensureOptionId(entry.optionId, index);
    return { optionId, label: normalizeText(entry.label) || optionId };
  });
};

const resolveSelectedIds = (schema: CheckboxGroupSchema): Set<string> => {
  const fromArray = Array.isArray(schema.selectedOptionIds) ? schema.selectedOptionIds : null;
  if (fromArray) return new Set(fromArray.map(normalizeText).filter(Boolean));
  const fromContent = normalizeText(schema.content);
  if (fromContent) return new Set(fromContent.split(',').map((s) => s.trim()).filter(Boolean));
  return new Set();
};

const resolveSelectionLimits = (schema: CheckboxGroupSchema) => {
  const minSelected = normalizeSelectionLimit(schema.minSelected);
  const maxSelected = normalizeSelectionLimit(schema.maxSelected);
  return {
    minSelected,
    maxSelected: maxSelected != null && minSelected != null ? Math.max(minSelected, maxSelected) : maxSelected,
  };
};

const clampSelectedIds = (selected: Set<string>, options: CheckboxOption[], schema: CheckboxGroupSchema) => {
  const validIds = new Set(options.map((option) => option.optionId));
  const { minSelected, maxSelected } = resolveSelectionLimits(schema);
  const ordered = Array.from(selected).map(normalizeText).filter((id) => id && validIds.has(id));

  if (maxSelected != null && ordered.length > maxSelected) {
    ordered.length = maxSelected;
  }

  if (minSelected != null && ordered.length < minSelected) {
    for (const option of options) {
      if (ordered.length >= minSelected) break;
      if (!ordered.includes(option.optionId)) ordered.push(option.optionId);
    }
  }

  return new Set(ordered);
};

const toggleSelectedIds = (
  selected: Set<string>,
  optionId: string,
  options: CheckboxOption[],
  schema: CheckboxGroupSchema,
) => {
  const current = clampSelectedIds(selected, options, schema);
  const next = new Set(current);
  const { minSelected, maxSelected } = resolveSelectionLimits(schema);

  if (next.has(optionId)) {
    if (minSelected != null && next.size <= minSelected) return next;
    next.delete(optionId);
    return clampSelectedIds(next, options, schema);
  }

  if (maxSelected != null && next.size >= maxSelected) return next;
  next.add(optionId);
  return clampSelectedIds(next, options, schema);
};

const serializeSelectedIds = (ids: Set<string>) => Array.from(ids).join(',');

const resolveGroupKey = (schema: CheckboxGroupSchema): string =>
  schema.__designer?.group?.groupId ?? schema.groupId ?? schema.group ?? schema.name;

const syncDesignerGroupPatch = (schema: CheckboxGroupSchema) => ({
  '__designer.group.groupId': resolveGroupKey(schema),
  '__designer.group.groupName': normalizeText(schema.groupName) || undefined,
  '__designer.group.groupType': 'checkbox' as const,
  '__designer.group.lockedAsGroup': schema.lockedAsGroup !== false,
});

// ─── Designer compact DOM helpers ────────────────────────────────────────────

const createDesignerCheckboxGroup = ({
  options,
  selected,
}: {
  options: CheckboxOption[];
  selected: Set<string>;
}): HTMLDivElement => {
  const wrapper = createDesignerOptionGroupEl(
    options.length ? options : [{ optionId: 'option_1', label: 'Casilla 1' }],
    CHECKBOX_GROUP_LAYOUT,
    'square',
    selected,
    'data-checkbox-group-option',
  );
  wrapper.setAttribute('data-checkbox-group-root', 'true');
  return wrapper;
};

const syncDesignerCheckboxGroupGeometry = ({
  schema,
  options,
  rootElement,
  onChange,
}: {
  schema: CheckboxGroupSchema;
  options: CheckboxOption[];
  rootElement: HTMLElement;
  onChange?: (arg: unknown) => void;
}) => {
  syncOptionGroupDesignerGeometry({
    schema,
    options,
    rootElement,
    onChange,
    layout: CHECKBOX_GROUP_LAYOUT,
    datasetKey: 'cbGroupGeometrySync',
  });
};

// ─── PropPanel options editor ─────────────────────────────────────────────────

const CheckboxOptionsEditor = (props: PropPanelWidgetProps) => {
  const { rootElement, changeSchemas, activeSchema } = props;
  const schema = activeSchema as CheckboxGroupSchema;
  rootElement.style.width = '100%';

  const getSchemaId = (): string | undefined => {
    if (typeof schema.id === 'string' && schema.id) return schema.id;
    return props.schemas.find(
      (c) => c.type === schema.type && c.name === schema.name &&
        c.position?.x === schema.position?.x && c.position?.y === schema.position?.y,
    )?.id;
  };

  const commit = (patch: Record<string, unknown>) => {
    const schemaId = getSchemaId();
    if (!schemaId) return;
    changeSchemas(
      Object.entries({ ...patch, ...syncDesignerGroupPatch({ ...schema, ...patch } as CheckboxGroupSchema) })
        .map(([key, value]) => ({ key, value, schemaId })),
    );
  };

  const currentOptions = normalizeOptions(schema);

  const header = document.createElement('div');
  header.className = 'sisad-option-editor-header';
  header.textContent = 'Valores de las casillas';
  rootElement.appendChild(header);

  const list = document.createElement('div');
  list.className = 'sisad-option-editor-list';

  const commitOptions = (nextOptions: CheckboxOption[]) => {
    const validIds = new Set(nextOptions.map((o) => o.optionId));
    const selected = resolveSelectedIds(schema);
    const nextSelected = clampSelectedIds(new Set(Array.from(selected).filter((id) => validIds.has(id))), nextOptions, schema);
    commit({
      options: nextOptions,
      content: serializeSelectedIds(nextSelected),
      selectedOptionIds: Array.from(nextSelected),
      width: DESIGNER_BOX_MM,
      height: calculateDesignerHeight(nextOptions.length),
    });
  };

  const renderList = () => {
    clearSchemaRoot(list);
    currentOptions.forEach((option, index) => {
      const row = document.createElement('div');
      row.className = 'sisad-option-editor-row sisad-option-editor-row--checkbox';

      const indicator = document.createElement('div');
      indicator.className = 'sisad-option-editor-cb-indicator';

      const labelInput = document.createElement('input');
      labelInput.type = 'text';
      labelInput.value = option.label;
      labelInput.placeholder = `Casilla ${index + 1}`;
      labelInput.className = 'sisad-option-editor-input';

      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.textContent = '×';
      removeBtn.className = 'sisad-option-editor-remove-btn';

      labelInput.addEventListener('change', () => {
        const next = currentOptions.map((o, i) => (i === index ? { ...o, label: normalizeText(labelInput.value) || o.label } : o));
        commitOptions(next);
      });
      removeBtn.addEventListener('click', (e) => {
        e.preventDefault(); e.stopPropagation();
        const next = currentOptions.filter((_, i) => i !== index);
        commitOptions(next.length ? next : [{ optionId: 'option_1', label: 'Casilla 1' }]);
      });

      row.appendChild(indicator);
      row.appendChild(labelInput);
      row.appendChild(removeBtn);
      list.appendChild(row);
    });
  };

  renderList();
  rootElement.appendChild(list);

  const addRow = document.createElement('div');
  addRow.className = 'sisad-option-editor-add-row';

  const newInput = document.createElement('input');
  newInput.type = 'text';
  newInput.placeholder = 'Nueva casilla…';
  newInput.className = 'sisad-option-editor-input';

  const addBtn = document.createElement('button');
  addBtn.type = 'button';
  addBtn.textContent = '+';
  addBtn.className = 'sisad-option-editor-add-btn';

  const doAdd = (e: Event) => {
    e.preventDefault(); e.stopPropagation();
    const label = normalizeText(newInput.value) || `Casilla ${currentOptions.length + 1}`;
    const idBase = label.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '') || 'option';
    commitOptions([...currentOptions, { optionId: `${idBase}_${currentOptions.length + 1}`, label }]);
    newInput.value = '';
    renderList();
  };
  addBtn.addEventListener('pointerdown', (e) => e.stopPropagation());
  addBtn.addEventListener('click', doAdd);
  newInput.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === 'NumpadEnter') doAdd(e); });

  addRow.appendChild(newInput);
  addRow.appendChild(addBtn);
  rootElement.appendChild(addRow);
};

// ─── Plugin ──────────────────────────────────────────────────────────────────

const schema: Plugin<CheckboxGroupSchema> = createSchemaPlugin<CheckboxGroupSchema>(
  {
    ui: (arg) => {
      const { schema, rootElement, mode, onChange, value } = arg;
      const cbSchema = schema as CheckboxGroupSchema;
      const options = normalizeOptions(cbSchema);
      const isDesigner = mode === 'designer';
      const selected = clampSelectedIds(
        !isDesigner && typeof value === 'string' && value.trim()
          ? new Set(value.split(',').map((s) => s.trim()).filter(Boolean))
          : resolveSelectedIds(cbSchema),
        options,
        cbSchema,
      );
      const editable = isEditable(mode, cbSchema);
      const color = cbSchema.color || '#1677ff';

      clearSchemaRoot(rootElement);

      Object.assign(rootElement.style, {
        overflow: 'visible',
        background: 'transparent',
        border: 'none',
        boxShadow: 'none',
        padding: '0',
        margin: '0',
        pointerEvents: isDesigner ? 'none' : 'auto',
      });

      if (isDesigner) {
        // Sync legacy/oversized schemas to compact geometry
        syncDesignerCheckboxGroupGeometry({ schema: cbSchema, options, rootElement, onChange });

        const designerGroup = createDesignerCheckboxGroup({ options, selected });
        rootElement.appendChild(designerGroup);
        return;
      }

      // ── Form / Viewer mode: labeled runtime ──────────────────────────────
      const gap = Number.isFinite(Number(cbSchema.spacing)) ? Number(cbSchema.spacing) : 3;
      const isHorizontal = cbSchema.orientation === 'horizontal';

      const wrapper = buildGroupWrapper();
      wrapper.setAttribute('data-checkbox-group-root', 'true');
      const container = buildGroupContainer({ color, gap, isHorizontal });

      if (cbSchema.groupName) {
        container.appendChild(buildGroupLabel(cbSchema.groupName, color));
      }

      options.forEach((option) => {
        const isChecked = selected.has(option.optionId);
        const row = buildOptionRow({
          color, isHorizontal, editable,
          role: 'checkbox',
          optionId: option.optionId,
          dataAttr: 'data-checkbox-group-option',
        });
        row.setAttribute('aria-checked', isChecked ? 'true' : 'false');
        row.appendChild(buildCheckboxIndicator(color, isChecked));
        row.appendChild(buildOptionLabel(option.label, color));

        if (editable && onChange) {
          row.addEventListener('click', (e) => {
            e.preventDefault(); e.stopPropagation();
            const next = toggleSelectedIds(selected, option.optionId, options, cbSchema);
            onChange([
              { key: 'content', value: serializeSelectedIds(next) },
              { key: 'selectedOptionIds', value: Array.from(next) },
            ]);
          });
        }
        container.appendChild(row);
      });

      wrapper.appendChild(container);
      rootElement.appendChild(wrapper);
    },

    pdf: async (arg) => {
      const { page, schema, options } = arg;
      const cbSchema = schema as CheckboxGroupSchema;
      const resolvedOptions = normalizeOptions(cbSchema);
      if (!resolvedOptions.length) return;

      const pageHeight = page.getHeight();
      const { position, width, height } = convertForPdfLayoutProps({ schema: cbSchema, pageHeight, applyRotateTranslate: false });
      const x = position.x;
      const y = position.y;
      const borderColor = hex2PrintingColor(cbSchema.color, options.colorType);
      const selected = resolveSelectedIds(cbSchema);
      const rowHeight = Math.max(12, Math.floor(height / Math.max(1, resolvedOptions.length)));
      const pad = 4;
      const boxSize = 7;
      const fontSize = 9;

      page.drawRectangle({ x, y, width, height, borderColor, borderWidth: 1, borderDashArray: [3, 3], color: undefined, opacity: undefined });

      if (cbSchema.groupName) {
        page.drawText(cbSchema.groupName, { x: x + pad, y: y + height - fontSize - 2, size: fontSize, color: borderColor });
      }

      resolvedOptions.forEach((option, index) => {
        const rowTop = y + height - (index + 1) * rowHeight;
        const rowCenterY = rowTop + rowHeight / 2;
        const boxX = x + pad;
        const boxY = rowCenterY - boxSize / 2;
        const textX = boxX + boxSize + 6;
        const textY = rowTop + 2;
        const isChecked = selected.has(option.optionId);

        page.drawRectangle({ x: boxX, y: boxY, width: boxSize, height: boxSize, borderColor, borderWidth: 1, color: isChecked ? borderColor : undefined });
        page.drawText(option.label, { x: textX, y: textY, size: fontSize, color: borderColor });
      });
    },

    propPanel: {
      schema: ({ i18n }) => ({
        ...basicsFields(),
        color: {
          title: i18n('schemas.color'),
          type: 'string',
          widget: 'color',
          props: { disabledAlpha: true },
          required: true,
          rules: [{ pattern: HEX_COLOR_PATTERN, message: i18n('validation.hexColor') }],
        },
        groupName: { title: 'Nombre del grupo', type: 'string', span: 12 },
        orientation: {
          title: 'Orientación',
          type: 'string',
          widget: 'select',
          span: 12,
          props: { options: [{ label: 'Vertical', value: 'vertical' }, { label: 'Horizontal', value: 'horizontal' }] },
        },
        spacing: { title: 'Espaciado', type: 'number', widget: 'inputNumber', span: 8, props: { min: 0, precision: 0 } },
        minSelected: { title: 'Mín. seleccionadas', type: 'number', widget: 'inputNumber', span: 8, props: { min: 0, precision: 0 } },
        maxSelected: { title: 'Máx. seleccionadas', type: 'number', widget: 'inputNumber', span: 8, props: { min: 0, precision: 0 } },
        optionsContainer: {
          title: 'Casillas',
          type: 'string',
          widget: 'card',
          span: 24,
          properties: { options: { widget: 'editCheckboxGroupOptions', span: 24 } },
        },
        ...helpFields(),
        ...dataLabelFields(),
        groupId: { title: 'ID del grupo', type: 'string', span: 12, description: 'ID técnico del grupo.' },
        lockedAsGroup: { title: 'Bloquear como grupo', type: 'boolean', span: 12 },
      }),
      inspector: createSchemaInspectorConfig('choice', {
        propertyMap: {
          ...COMMON_PROPERTY_MAP,
          color: 'style',
          groupName: 'data',
          orientation: 'data',
          spacing: 'data',
          minSelected: 'data',
          maxSelected: 'data',
          optionsContainer: 'data',
          groupId: 'advanced',
          lockedAsGroup: 'advanced',
        },
        includeConnections: true,
      }),
      widgets: { editCheckboxGroupOptions: CheckboxOptionsEditor },
      defaultSchema: {
        id: 'checkbox-group-default',
        name: '',
        type: 'checkboxGroup',
        content: '',
        position: { x: 0, y: 0 },
        width: DESIGNER_BOX_MM,
        height: calculateDesignerHeight(2),
        groupId: 'Grupo_Casillas',
        group: 'Grupo_Casillas',
        groupName: 'Grupo de casillas',
        lockedAsGroup: true,
        orientation: 'vertical',
        spacing: DESIGNER_BOX_GAP,
        options: [
          { optionId: 'option_1', label: 'Casilla 1' },
          { optionId: 'option_2', label: 'Casilla 2' },
        ],
        selectedOptionIds: [],
        defaultSelectedOptionIds: [],
        color: '#1677ff',
        __designer: {
          group: {
            groupId: 'Grupo_Casillas',
            groupType: 'checkbox',
            groupName: 'Grupo de casillas',
            lockedAsGroup: true,
          },
        },
      },
    },
    icon: renderLucideIcon(SquareCheck, { stroke: 'currentColor' }),
  },
  {
    key: 'checkboxGroup',
    type: 'checkboxGroup',
    label: 'Grupo de casillas',
    category: 'Opciones',
    tags: ['checkbox', 'choice', 'selection', 'group', 'multi'],
    capabilities: ['designer', 'form', 'viewer', 'selection', 'content'],
  },
);

// Exposed for unit tests — pure helpers, no side effects.
export const __test__ = {
  normalizeOptions,
  resolveSelectedIds,
  serializeSelectedIds,
  resolveSelectionLimits,
  clampSelectedIds,
  toggleSelectedIds,
  calculateDesignerHeight,
  /** Drops selected ids that no longer exist in the option set. */
  normalizeSelectedOptionIds: (selected: string[], options: CheckboxOption[]) => {
    const valid = new Set(options.map((o) => o.optionId));
    return selected.filter((id) => valid.has(id));
  },
  /** Generates a stable, unique optionId from a label against current options. */
  createNextOption: (label: string, options: CheckboxOption[]): CheckboxOption => {
    const clean = normalizeText(label) || `Casilla ${options.length + 1}`;
    const base = clean.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '') || 'option';
    let candidate = `${base}_${options.length + 1}`;
    const existing = new Set(options.map((o) => o.optionId));
    let i = options.length + 1;
    while (existing.has(candidate)) {
      i += 1;
      candidate = `${base}_${i}`;
    }
    return { optionId: candidate, label: clean };
  },
};

export default schema;
