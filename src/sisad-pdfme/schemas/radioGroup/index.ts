import type { Plugin, PropPanelWidgetProps, SchemaForUI } from '@sisad-pdfme/common';
import { isEditable } from '../utils.js';
import { createSchemaPlugin, renderLucideIcon } from '../schemaBuilder.js';
import { CircleDot } from 'lucide-react';
import type { GroupMeta } from '../../shared/schemaDesignerMeta.js';
import type { OptionItem } from '../options/optionTypes.js';
import {
  buildDefaultOptionGroupOptions,
  normalizeOptionId,
  normalizeOptionGroupOptions,
  normalizeText,
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

import {
  RADIO_GROUP_LAYOUT,
} from '../options/optionGroupLayout.js';
import {
  createDesignerOptionGroupEl,
  syncDesignerOptionGroupPatch,
  createOptionGroupRuntime,
  buildOptionGroupRuntimeSharedParams,
  buildOptionGroupDesignerDimensions,
  buildOptionGroupDefaultSchema,
  renderOptionGroupUi,
  resolveOptionGroupReadOnly,
  createOptionGroupPropPanelConfig,
} from '../options/optionGroupFactory.js';
import {
  resolveSingleOptionSelection,
} from '../options/optionSelectionBehavior.js';
import { createOptionGroupOptionsEditor } from '../options/optionGroupEditorFactory.js';
import { markInspectorInteractive } from '../../ui/components/Designer/RightSidebar/DetailView/inspectorInteractionGuards.js';
import { renderOptionGroupPdf } from '../options/optionGroupPdfRender.js';

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

const createNextOption = (label: string, options: RadioOption[]): RadioOption => {
  const clean = normalizeText(label) || `Opción ${options.length + 1}`;
  const base = normalizeOptionId(clean, options.length).replace(/_\d+$/, '') || 'option';
  const existing = new Set(options.map((option) => option.optionId));
  let nextIndex = options.length + 1;
  let candidate = `${base}_${nextIndex}`;

  while (existing.has(candidate)) {
    nextIndex += 1;
    candidate = `${base}_${nextIndex}`;
  }

  return { optionId: candidate, label: clean };
};

// ─── PropPanel options editor ────────────────────────────────────────────────

const RadioOptionsEditor = (props: PropPanelWidgetProps) => {
  const { rootElement, changeSchemas, activeSchema } = props;
  const schema = activeSchema as RadioGroupSchema;

  rootElement.style.width = '100%';
  markInspectorInteractive(rootElement);

  let currentOptions = normalizeOptions(schema);
  let currentSelected = resolveSelectedOptionId(schema, currentOptions);
  const schemaId = schema.id;

  const commit = (patch: Record<string, unknown>) => {
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
      spacing: RADIO_GROUP_LAYOUT.boxGap,
      // width/height in mm (schema coordinate system, not CSS pixels)
      ...buildOptionGroupDesignerDimensions(RADIO_GROUP_LAYOUT, currentOptions.length),
    });
  };

  const editor = createOptionGroupOptionsEditor<RadioOption>({
    rootElement,
    headerText: 'Opciones del radio button',
    rowClassName: 'sisad-option-editor-row sisad-option-editor-row--radio',
    newInputPlaceholder: 'Nueva opción…',
    optionInputPlaceholder: (index) => `Opción ${index + 1}`,
    indicatorShape: 'circle',
    indicatorColor: schema.color || '#1677ff',
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
      return [...options, createNextOption(label, options)];
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

      const readOnlyGroup = resolveOptionGroupReadOnly(radioSchema);
      const groupInvalid = !readOnlyGroup && Boolean(radioSchema.required) && !selectedOptionId;

      renderOptionGroupUi({
        rootElement,
        isDesigner,
        mode,
        selectionMode: 'single',
        invalid: groupInvalid,
        renderDesigner: () => createDesignerOptionGroupEl(
          options,
          RADIO_GROUP_LAYOUT,
          'circle',
          new Set([selectedOptionId]),
          'data-radio-group-option',
          'Opción',
        ),
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
      const { page, schema } = arg;
      const radioSchema = schema as RadioGroupSchema;
      const resolvedOptions = normalizeOptions(radioSchema);

      if (!resolvedOptions.length) return;
      renderOptionGroupPdf({
        page,
        schema: radioSchema,
        options: resolvedOptions,
        selectionMode: 'single',
        indicatorShape: 'circle',
        selectedOptionId: resolveSelectedOptionId(radioSchema, resolvedOptions),
        color: radioSchema.color,
      });
    },

    propPanel: {
      ...createOptionGroupPropPanelConfig({
        optionsTitle: 'Opciones',
        optionsWidget: 'editRadioGroupOptions',
        groupNameTitle: 'Nombre del grupo',
        groupIdTitle: 'ID del grupo',
        lockedAsGroupTitle: 'Bloquear como grupo',
        // groupId es un ID técnico → sección advanced (no data).
        propertyMap: { groupId: 'advanced' },
        widgets: { editRadioGroupOptions: RadioOptionsEditor },
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
      }),
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

export const __test__ = {
  createNextOption,
};
