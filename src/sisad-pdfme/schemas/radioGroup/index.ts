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
import type { OptionItem } from '../options/optionTypes.js';
import {
  buildDefaultOptionGroupOptions,
  normalizeOptionGroupOptions,
} from '../options/optionModel.js';

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
} from '../options/optionGroupLayout.js';

const DESIGNER_BOX_SIZE = RADIO_GROUP_LAYOUT.boxSize;  // px
const DESIGNER_BOX_GAP  = RADIO_GROUP_LAYOUT.boxGap;   // px
import {
  syncOptionGroupDesignerGeometry,
  createDesignerOptionGroupEl,
  syncDesignerOptionGroupPatch,
  createOptionGroupRuntime,
  buildOptionGroupRuntimeSharedParams,
  buildOptionGroupDesignerDimensions,
  buildOptionGroupDefaultSchema,
  renderOptionGroupUi,
  resolveOptionGroupReadOnly,
} from '../options/optionGroupFactory.js';
import {
  resolveSingleOptionSelection,
} from '../options/optionSelectionBehavior.js';
import { createOptionGroupEditor } from '../options/optionGroupEditorFactory.js';
import { resolveSchemaIdByIdentity } from '../shared/schemaGuards.js';

type RadioOption = OptionItem;

const normalizeOptions = (schema: RadioGroupSchema): RadioOption[] => {
  return normalizeOptionGroupOptions(schema.options, 'Opción') as RadioOption[];
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

// ─── PropPanel options editor ────────────────────────────────────────────────

const RadioOptionsEditor = (props: PropPanelWidgetProps) => {
  const { rootElement, changeSchemas, activeSchema } = props;
  const schema = activeSchema as RadioGroupSchema;

  rootElement.style.width = '100%';

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
      : buildDefaultOptionGroupOptions('Opción', 1);

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
      ...buildOptionGroupDesignerDimensions(RADIO_GROUP_LAYOUT, currentOptions.length),
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
      return nextOptions.length ? nextOptions : buildDefaultOptionGroupOptions('Opción', 1);
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

      const readOnlyGroup = resolveOptionGroupReadOnly(radioSchema);
      const groupInvalid = !readOnlyGroup && Boolean(radioSchema.required) && !selectedOptionId;

      renderOptionGroupUi({
        rootElement,
        isDesigner,
        mode,
        selectionMode: 'single',
        invalid: groupInvalid,
        renderDesigner: () => {
          syncOptionGroupDesignerGeometry({
            schema: radioSchema,
            options,
            rootElement,
            onChange,
            layout: RADIO_GROUP_LAYOUT,
            datasetKey: 'radioGroupGeometrySync',
          });

          return createDesignerOptionGroupEl(
            options,
            RADIO_GROUP_LAYOUT,
            'circle',
            new Set([selectedOptionId]),
            'data-radio-group-option',
            'Opción',
          );
        },
        renderRuntime: () => createOptionGroupRuntime({
          options,
          selectionMode: 'single',
          selectedOptionId,
          readOnly: readOnlyGroup,
          ...buildOptionGroupRuntimeSharedParams({
            schema: radioSchema,
            mode,
            editable,
            invalid: groupInvalid,
          }),
          resolveSelection: ({ option }) => ({
            content: option.optionId,
            selectedOptionId: option.optionId,
          }),
          onChange,
        }),
      });
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
        ...buildOptionGroupDefaultSchema({
          id: 'radio-group-default',
          type: 'radioGroup',
          groupId: 'Grupo_Opcion',
          groupName: 'Grupo de opción',
          groupType: 'radio',
          optionPrefix: 'Opción',
          selectionMode: 'single',
          optionsCount: 2,
          content: 'option_1',
          selectedOptionId: 'option_1',
          defaultSelectedOptionId: 'option_1',
          color: '#1677ff',
        }),
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
