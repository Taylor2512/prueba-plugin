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
import { CircleDot } from 'lucide-react';
import type { GroupMeta } from '../../shared/schemaDesignerMeta.js';

type RadioOption = {
  optionId: string;
  label: string;
};

type RadioGroupSchema = SchemaForUI & {
  groupId?: string;
  group?: string;
  groupName?: string;
  options?: Array<string | RadioOption>;
  selectedOptionId?: string;
  defaultSelectedOptionId?: string;
  lockedAsGroup?: boolean;
  orientation?: 'vertical' | 'horizontal';
  spacing?: number;
  color: string;
  __designer?: {
    group?: GroupMeta;
    [key: string]: unknown;
  };
};

// The + button is rendered as an external overlay (GroupOptionFloatingAction),
// so the bounding box covers ONLY the stacked indicator squares.
import {
  RADIO_GROUP_LAYOUT,
  computeOptionGroupDesignerHeightMM,
  computeOptionGroupDesignerWidthMM,
} from '../options/optionGroupLayout.js';

const DESIGNER_BOX_SIZE = RADIO_GROUP_LAYOUT.boxSize;  // px
const DESIGNER_BOX_GAP  = RADIO_GROUP_LAYOUT.boxGap;   // px

const DESIGNER_BOX_MM = computeOptionGroupDesignerWidthMM(RADIO_GROUP_LAYOUT);

import { normalizeOptionsFromSource, normalizeOptionId } from '../options/optionModel.js';
import { resolveSelectedOptionId as resolveSelectedFromOptions } from '../options/optionValueAdapter.js';
import {
  buildGroupWrapper,
  buildGroupContainer,
  buildGroupLabel,
  buildOptionRow,
  buildRadioIndicator,
  buildOptionLabel,
} from '../groupSchemaRender.js';
import {
  syncOptionGroupDesignerGeometry,
  createDesignerOptionGroupEl,
  syncDesignerOptionGroupPatch,
} from '../options/optionGroupFactory.js';
import { clearSchemaRoot } from '../shared/schemaDom.js';
import { resolveSchemaIdByIdentity } from '../shared/schemaGuards.js';

const normalizeText = (value: unknown) => String(value || '').trim();

const normalizeOptions = (schema: RadioGroupSchema): RadioOption[] => {
  const source = Array.isArray(schema.options) ? schema.options : [];

  return normalizeOptionsFromSource(source) as RadioOption[];
};

const resolveSelectedOptionId = (
  schema: RadioGroupSchema,
  options: RadioOption[],
): string => {
  return (
    resolveSelectedFromOptions(
      schema.selectedOptionId || schema.content || schema.defaultSelectedOptionId,
      options,
    ) || options[0]?.optionId || 'option_1'
  );
};

const calculateDesignerHeight = (optionsCount: number): number =>
  computeOptionGroupDesignerHeightMM(optionsCount, RADIO_GROUP_LAYOUT);


const createRuntimeCircle = ({
  selected,
  editable,
  color,
  option,
  onSelect,
}: {
  selected: boolean;
  editable: boolean;
  color: string;
  option: RadioOption;
  onSelect?: () => void;
}): HTMLButtonElement => {
  const button = document.createElement('button');

  button.type = 'button';
  button.setAttribute('role', 'radio');
  button.setAttribute('data-radio-group-option', option.optionId);
  button.setAttribute('aria-label', option.label);
  button.setAttribute('aria-checked', selected ? 'true' : 'false');

  Object.assign(button.style, {
    width: '18px',
    height: '18px',
    minWidth: '18px',
    minHeight: '18px',
    border: `1.5px solid ${color}`,
    borderRadius: '999px',
    background: selected
      ? `radial-gradient(circle at center, ${color} 0 35%, transparent 38% 100%)`
      : '#ffffff',
    boxSizing: 'border-box',
    padding: '0',
    margin: '0',
    cursor: editable ? 'pointer' : 'default',
    pointerEvents: editable ? 'auto' : 'none',
  });

  if (editable && onSelect) {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      onSelect();
    });
  }

  return button;
};

// Runtime builder: reuse shared render helpers to avoid duplicating DOM logic
// between checkboxGroup and radioGroup.
const createRuntimeRadioGroup = ({
  schema,
  options,
  selectedOptionId,
  editable,
  color,
  onChange,
}: {
  schema: RadioGroupSchema;
  options: RadioOption[];
  selectedOptionId: string;
  editable: boolean;
  color: string;
  onChange?: (arg: { key: string; value: unknown }) => void;
}): HTMLDivElement => {
  const wrapper = buildGroupWrapper();
  const spacing = Number.isFinite(Number(schema.spacing)) ? Number(schema.spacing) : DESIGNER_BOX_GAP;
  const container = buildGroupContainer({ color, gap: spacing, isHorizontal: schema.orientation === 'horizontal' });

  if (schema.groupName) container.appendChild(buildGroupLabel(schema.groupName, color));

  options.forEach((option) => {
    const selected = option.optionId === selectedOptionId;
    const row = buildOptionRow({ color, isHorizontal: schema.orientation === 'horizontal', editable, role: 'radio', optionId: option.optionId, dataAttr: 'data-radio-group-option' });
    row.setAttribute('aria-checked', selected ? 'true' : 'false');
    row.appendChild(buildRadioIndicator(color, selected));
    row.appendChild(buildOptionLabel(option.label, color));

    if (editable && onChange) {
      row.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        (onChange as unknown as (changes: Array<{ key: string; value: unknown }>) => void)([
          { key: 'content', value: option.optionId },
          { key: 'selectedOptionId', value: option.optionId },
        ]);
      });
    }

    container.appendChild(row);
  });

  wrapper.appendChild(container);
  return wrapper;
};


// ─── PropPanel options editor ────────────────────────────────────────────────

const RadioOptionsEditor = (props: PropPanelWidgetProps) => {
  const { rootElement, changeSchemas, activeSchema } = props;
  const schema = activeSchema as RadioGroupSchema;

  rootElement.style.width = '100%';
  clearSchemaRoot(rootElement);

  let currentOptions = normalizeOptions(schema);
  let currentSelected = resolveSelectedOptionId(schema, currentOptions);

  const getSchemaId = (): string | undefined => {
    return resolveSchemaIdByIdentity(props.schemas, schema);
  };

  const commit = (patch: Record<string, unknown>) => {
    const schemaId = getSchemaId();
    if (!schemaId) return;

    const nextSchema = {
      ...schema,
      ...patch,
    } as RadioGroupSchema;

    changeSchemas(
      Object.entries({
        ...patch,
        ...syncDesignerOptionGroupPatch(nextSchema, 'radio'),
      }).map(([key, value]) => ({ key, value, schemaId })),
    );
  };

  const commitOptions = (nextOptions: RadioOption[]) => {
    currentOptions = nextOptions.length
      ? nextOptions
      : [{ optionId: 'option_1', label: 'Opción 1' }];

    currentSelected = currentOptions.some((option) => option.optionId === currentSelected)
      ? currentSelected
      : currentOptions[0]?.optionId || 'option_1';

    commit({
      options: currentOptions,
      content: currentSelected,
      selectedOptionId: currentSelected,
      defaultSelectedOptionId: currentSelected,
      orientation: 'vertical',
      spacing: DESIGNER_BOX_GAP,
      // width/height in mm (schema coordinate system, not CSS pixels)
      width: DESIGNER_BOX_MM,
      height: calculateDesignerHeight(currentOptions.length),
    });
  };

  const header = document.createElement('div');
  header.className = 'sisad-option-editor-header';
  header.textContent = 'Opciones del radio button';
  rootElement.appendChild(header);

  const list = document.createElement('div');
  list.className = 'sisad-option-editor-list';

  const renderList = () => {
    clearSchemaRoot(list);

    currentOptions.forEach((option, index) => {
      const row = document.createElement('div');
      row.className = 'sisad-option-editor-row sisad-option-editor-row--radio';

      const indicator = createRuntimeCircle({
        selected: option.optionId === currentSelected,
        editable: true,
        color: schema.color || '#1677ff',
        option,
        onSelect: () => {
          currentSelected = option.optionId;

          commit({
            content: option.optionId,
            selectedOptionId: option.optionId,
            defaultSelectedOptionId: option.optionId,
          });

          renderList();
        },
      });

      const labelInput = document.createElement('input');
      labelInput.type = 'text';
      labelInput.value = option.label;
      labelInput.placeholder = `Opción ${index + 1}`;
      labelInput.className = 'sisad-option-editor-input';

      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.textContent = '×';
      removeBtn.className = 'sisad-option-editor-remove-btn';
      removeBtn.dataset.disabled = String(currentOptions.length <= 1);

      labelInput.addEventListener('change', () => {
        const nextOptions = currentOptions.map((item, optionIndex) =>
          optionIndex === index
            ? {
                ...item,
                label: normalizeText(labelInput.value) || item.label,
              }
            : item,
        );

        commitOptions(nextOptions);
        renderList();
      });

      removeBtn.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (currentOptions.length <= 1) return;

        const nextOptions = currentOptions.filter((_, optionIndex) => optionIndex !== index);
        commitOptions(nextOptions);
        renderList();
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
  newInput.placeholder = 'Nueva opción…';
  newInput.className = 'sisad-option-editor-input';

  const addBtn = document.createElement('button');
  addBtn.type = 'button';
  addBtn.textContent = '+';
  addBtn.className = 'sisad-option-editor-add-btn';

  const doAdd = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();

    const label = normalizeText(newInput.value) || `Opción ${currentOptions.length + 1}`;
    const nextIndex = currentOptions.length + 1;

    const nextOption: RadioOption = {
      optionId: `option_${nextIndex}`,
      label,
    };

    const nextOptions = [...currentOptions, nextOption];

    currentOptions = nextOptions;
    currentSelected = currentSelected || nextOption.optionId;

    commit({
      options: nextOptions,
      content: currentSelected,
      selectedOptionId: currentSelected,
      defaultSelectedOptionId: currentSelected,
      orientation: 'vertical',
      spacing: DESIGNER_BOX_GAP,
      // width/height in mm (schema coordinate system, not CSS pixels)
      width: DESIGNER_BOX_MM,
      height: calculateDesignerHeight(nextOptions.length),
    });

    newInput.value = '';
    renderList();
  };

  addBtn.addEventListener('pointerdown', (event) => event.stopPropagation());
  addBtn.addEventListener('click', doAdd);

  newInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === 'NumpadEnter') {
      doAdd(event);
    }
  });

  addRow.appendChild(newInput);
  addRow.appendChild(addBtn);
  rootElement.appendChild(addRow);
};

// ─── Plugin ──────────────────────────────────────────────────────────────────

const schema: Plugin<RadioGroupSchema> = createSchemaPlugin<RadioGroupSchema>(
  {
    ui: (arg) => {
      const { schema, onChange, rootElement, mode } = arg;

      const radioSchema = schema as RadioGroupSchema;
      const options = normalizeOptions(radioSchema);
      const selectedOptionId = resolveSelectedOptionId(radioSchema, options);
      const editable = isEditable(mode, radioSchema);
      const isDesigner = mode === 'designer';
      const color = radioSchema.color || '#1677ff';

      clearSchemaRoot(rootElement);

      rootElement.classList.add('sisad-pdfme-option-group-root');
      rootElement.style.pointerEvents = isDesigner ? 'none' : 'auto';

      if (isDesigner) {
        syncOptionGroupDesignerGeometry({
          schema: radioSchema,
          options,
          rootElement,
          onChange,
          layout: RADIO_GROUP_LAYOUT,
          datasetKey: 'radioGroupGeometrySync',
        });

        rootElement.appendChild(
          createDesignerOptionGroupEl(options, RADIO_GROUP_LAYOUT, 'circle', new Set([selectedOptionId]), 'data-radio-group-option'),
        );
        return;
      }

      const runtimeGroup = createRuntimeRadioGroup({
        schema: radioSchema,
        options,
        selectedOptionId,
        editable,
        color,
        onChange,
      });

      rootElement.appendChild(runtimeGroup);
    },

    pdf: async (arg) => {
      const { page, schema, options } = arg;
      const radioSchema = schema as RadioGroupSchema;
      const resolvedOptions = normalizeOptions(radioSchema);

      if (!resolvedOptions.length) return;

      const pageHeight = page.getHeight();

      const { position, height } = convertForPdfLayoutProps({
        schema: radioSchema,
        pageHeight,
        applyRotateTranslate: false,
      });

      const x = position.x;
      const y = position.y;
      const borderColor = hex2PrintingColor(radioSchema.color, options.colorType);
      const selectedOptionId = resolveSelectedOptionId(radioSchema, resolvedOptions);

      const circleRadius = 3.4;
      const step = DESIGNER_BOX_SIZE * 0.72;
      const startY = y + height - circleRadius;

      resolvedOptions.forEach((option, index) => {
        const circleCenterX = x + circleRadius + 1;
        const circleCenterY = startY - index * step;

        page.drawCircle({
          x: circleCenterX,
          y: circleCenterY,
          size: circleRadius,
          borderColor,
          borderWidth: 1,
          color: option.optionId === selectedOptionId ? borderColor : undefined,
        });
      });
    },

    propPanel: {
      schema: ({ i18n }) => ({
        // ── basics ──
        ...basicsFields(),
        // ── color ──
        color: {
          title: i18n('schemas.color'),
          type: 'string',
          widget: 'color',
          props: { disabledAlpha: true },
          required: true,
          rules: [{ pattern: HEX_COLOR_PATTERN, message: i18n('validation.hexColor') }],
        },
        // ── options / group config ──
        groupName: { title: 'Nombre del grupo', type: 'string', span: 12 },
        orientation: {
          title: 'Orientación',
          type: 'string',
          widget: 'select',
          span: 12,
          props: { options: [{ label: 'Vertical', value: 'vertical' }, { label: 'Horizontal', value: 'horizontal' }] },
        },
        spacing: { title: 'Espaciado', type: 'number', widget: 'inputNumber', span: 8, props: { min: 0, precision: 0 } },
        optionsContainer: {
          title: 'Opciones',
          type: 'string',
          widget: 'card',
          span: 24,
          properties: { options: { widget: 'editRadioGroupOptions', span: 24 } },
        },
        // ── help ──
        ...helpFields(),
        // ── dataLabel ──
        ...dataLabelFields(),
        // ── advanced ──
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
          optionsContainer: 'data',
          groupId: 'advanced',
          lockedAsGroup: 'advanced',
        },
        includeConnections: true,
      }),
      widgets: {
        editRadioGroupOptions: RadioOptionsEditor,
      },
      defaultSchema: {
        id: 'radio-group-default',
        name: '',
        type: 'radioGroup',
        content: 'option_1',
        position: { x: 0, y: 0 },
        width: DESIGNER_BOX_MM,
        height: calculateDesignerHeight(2),
        groupId: 'Grupo_Opcion',
        group: 'Grupo_Opcion',
        groupName: 'Grupo de opción',
        lockedAsGroup: true,
        orientation: 'vertical',
        spacing: DESIGNER_BOX_GAP,
        options: [
          { optionId: 'option_1', label: 'Opción 1' },
          { optionId: 'option_2', label: 'Opción 2' },
        ],
        selectedOptionId: 'option_1',
        defaultSelectedOptionId: 'option_1',
        color: '#1677ff',
        __designer: {
          group: {
            groupId: 'Grupo_Opcion',
            groupType: 'radio',
            groupName: 'Grupo de opción',
            lockedAsGroup: true,
          },
        },
      },
    },

    icon: renderLucideIcon(CircleDot, { stroke: 'currentColor' }),
  },
  {
    key: 'radioGroup',
    type: 'radioGroup',
    label: 'Opción',
    category: 'Selecciones',
    tags: ['radio', 'choice', 'selection', 'group'],
    capabilities: ['designer', 'form', 'viewer', 'selection', 'content'],
  },
);

export default schema;
