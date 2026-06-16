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

import { normalizeOptionsFromSource } from '../options/optionModel.js';
import {
  syncOptionGroupDesignerGeometry,
  createDesignerOptionGroupEl,
  syncDesignerOptionGroupPatch,
  createOptionGroupRuntime,
} from '../options/optionGroupFactory.js';
import {
  resolveSingleOptionSelection,
} from '../options/optionSelectionBehavior.js';
import { createOptionGroupEditor } from '../options/optionGroupEditorFactory.js';
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
  return resolveSingleOptionSelection(
    schema.selectedOptionId || schema.content || schema.defaultSelectedOptionId,
    options,
    options[0]?.optionId || 'option_1',
  );
};

const calculateDesignerHeight = (optionsCount: number): number =>
  computeOptionGroupDesignerHeightMM(optionsCount, RADIO_GROUP_LAYOUT);

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

  const commitOptions = (nextOptions: RadioOption[], nextSelected?: string) => {
    currentOptions = nextOptions.length
      ? nextOptions
      : [{ optionId: 'option_1', label: 'Opción 1' }];

    currentSelected = nextSelected && currentOptions.some((option) => option.optionId === nextSelected)
      ? nextSelected
      : currentOptions.some((option) => option.optionId === currentSelected)
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

  const editor = createOptionGroupEditor<RadioOption>({
    rootElement,
    headerText: 'Opciones del radio button',
    rowClassName: 'sisad-option-editor-row sisad-option-editor-row--radio',
    newInputPlaceholder: 'Nueva opción…',
    optionInputPlaceholder: (index) => `Opción ${index + 1}`,
    createIndicator: (option) => {
      const button = document.createElement('button');

      button.type = 'button';
      button.setAttribute('role', 'radio');
      button.setAttribute('data-radio-group-option', option.optionId);
      button.setAttribute('aria-label', option.label);
      button.setAttribute('aria-checked', option.optionId === currentSelected ? 'true' : 'false');

      Object.assign(button.style, {
        width: '18px',
        height: '18px',
        minWidth: '18px',
        minHeight: '18px',
        border: `1.5px solid ${schema.color || '#1677ff'}`,
        borderRadius: '999px',
        background: option.optionId === currentSelected
          ? `radial-gradient(circle at center, ${schema.color || '#1677ff'} 0 35%, transparent 38% 100%)`
          : '#ffffff',
        boxSizing: 'border-box',
        padding: '0',
        margin: '0',
        cursor: 'pointer',
        pointerEvents: 'auto',
      });

      button.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        currentSelected = option.optionId;
        commitOptions(currentOptions, option.optionId);
        editor.render();
      });

      return button;
    },
    getOptions: () => currentOptions,
    setOptions: (nextOptions) => {
      currentOptions = nextOptions;
    },
    createRenamedOptions: (options, index, label) =>
      options.map((item, optionIndex) =>
        optionIndex === index ? { ...item, label: label || item.label } : item,
      ),
    createRemovedOptions: (options, index) => {
      if (options.length <= 1) return options;
      const nextOptions = options.filter((_, optionIndex) => optionIndex !== index);
      return nextOptions.length ? nextOptions : [{ optionId: 'option_1', label: 'Opción 1' }];
    },
    createAddedOptions: (options, label) => {
      const clean = label || `Opción ${options.length + 1}`;
      const nextIndex = options.length + 1;
      const nextOption: RadioOption = {
        optionId: `option_${nextIndex}`,
        label: clean,
      };
      return [...options, nextOption];
    },
    onCommitOptions: (nextOptions) => {
      commitOptions(nextOptions);
    },
  });

  editor.render();
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
      // FieldChromePolicy hooks: let CSS drive mode-specific group chrome.
      rootElement.dataset.renderMode = mode;
      rootElement.dataset.schemaFamily = 'option-based';
      rootElement.dataset.selectionMode = 'single';
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

      const radioFlags = radioSchema as { readonly?: boolean; locked?: boolean };
      const readOnlyGroup = Boolean(radioSchema.readOnly || radioFlags.readonly || radioFlags.locked);
      const groupInvalid = !readOnlyGroup && Boolean(radioSchema.required) && !selectedOptionId;
      rootElement.dataset.optionGroupInvalid = String(groupInvalid);
      rootElement.appendChild(
        createOptionGroupRuntime({
          options,
          selectionMode: 'single',
          selectedOptionId,
          editable,
          color,
          orientation: radioSchema.orientation,
          spacing: Number.isFinite(Number(radioSchema.spacing)) ? Number(radioSchema.spacing) : DESIGNER_BOX_GAP,
          groupName: radioSchema.groupName,
          mode,
          required: Boolean(radioSchema.required),
          readOnly: readOnlyGroup,
          invalid: groupInvalid,
          resolveSelection: ({ option }) => ({
            content: option.optionId,
            selectedOptionId: option.optionId,
          }),
          onChange,
        }),
      );
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
