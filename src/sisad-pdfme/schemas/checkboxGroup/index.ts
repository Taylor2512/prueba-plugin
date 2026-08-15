import type { Plugin, PropPanelWidgetProps, SchemaForUI } from '@sisad-pdfme/common';
import { isEditable } from '@sisad-pdfme/schemas/utils';
import { createSchemaPlugin, renderLucideIcon } from '@sisad-pdfme/schemas/schemaBuilder';
import { SquareCheck } from 'lucide-react';
import type { GroupMeta } from '@sisad-pdfme/shared/schemaDesignerMeta';
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
} from '@sisad-pdfme/schemas/options/optionGroupFactory';
import {
  clampMultiOptionSelection,
  resolveMultiOptionSelection,
  toggleMultiOptionSelection,
} from '@sisad-pdfme/schemas/options/optionSelectionBehavior';
import { createOptionGroupOptionsEditor } from '@sisad-pdfme/schemas/options/optionGroupEditorFactory';
import type { OptionItem } from '@sisad-pdfme/schemas/options/optionTypes';
import {
  buildDefaultOptionGroupOptions,
  normalizeOptionId,
  normalizeOptionGroupOptions,
  normalizeOptionText,
} from '@sisad-pdfme/schemas/options/optionModel';
import { renderOptionGroupPdf } from '@sisad-pdfme/schemas/options/optionGroupPdfRender';
import { markInspectorInteractive } from '@sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/inspectorInteractionGuards';

// ─── Designer compact geometry constants ────────────────────────────────────
// The + button is rendered as an external overlay (GroupOptionFloatingAction),
// so the bounding box covers ONLY the stacked indicator squares.

import { CHECKBOX_GROUP_LAYOUT } from '@sisad-pdfme/schemas/options/optionGroupLayout';

// ─── Types ───────────────────────────────────────────────────────────────────

type CheckboxOption = OptionItem;

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

const normalizeSelectionLimit = (value: unknown): number | undefined => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return undefined;
  return Math.floor(parsed);
};

const normalizeCheckboxGroupOptions = (schema: CheckboxGroupSchema): CheckboxOption[] => {
  return normalizeOptionGroupOptions(schema.options, 'Casilla', 2);
};

const resolveSelectionLimits = (schema: CheckboxGroupSchema) => {
  const minSelected = normalizeSelectionLimit(schema.minSelected);
  const maxSelected = normalizeSelectionLimit(schema.maxSelected);
  return {
    minSelected,
    maxSelected: maxSelected != null && minSelected != null ? Math.max(minSelected, maxSelected) : maxSelected,
  };
};

const resolveSelectedIds = (schema: CheckboxGroupSchema): Set<string> =>
  new Set(
    resolveMultiOptionSelection(
      Array.isArray(schema.selectedOptionIds) && schema.selectedOptionIds.length > 0
        ? schema.selectedOptionIds
        : normalizeOptionText(schema.content).split(',').map((s) => s.trim()).filter(Boolean),
      normalizeCheckboxGroupOptions(schema),
    ),
  );

const clampSelectedIds = (selected: Set<string>, options: CheckboxOption[], schema: CheckboxGroupSchema) =>
  new Set(
    clampMultiOptionSelection(
      Array.from(selected),
      options,
      resolveSelectionLimits(schema),
    ),
  );

const toggleSelectedIds = (
  selected: Set<string>,
  optionId: string,
  options: CheckboxOption[],
  schema: CheckboxGroupSchema,
) => new Set(toggleMultiOptionSelection(Array.from(selected), optionId, options, resolveSelectionLimits(schema)));

const serializeSelectedIds = (ids: Set<string>) => Array.from(ids).join(',');

// ─── Designer compact DOM helpers ────────────────────────────────────────────

const createDesignerCheckboxGroup = ({
  options,
  selected,
}: {
  options: CheckboxOption[];
  selected: Set<string>;
}): HTMLDivElement => {
  const wrapper = createDesignerOptionGroupEl(
    options,
    CHECKBOX_GROUP_LAYOUT,
    'square',
    selected,
    'data-checkbox-group-option',
    'Casilla',
  );
  wrapper.setAttribute('data-checkbox-group-root', 'true');
  return wrapper;
};

// ─── PropPanel options editor ─────────────────────────────────────────────────

const CheckboxOptionsEditor = (props: PropPanelWidgetProps) => {
  const { rootElement, changeSchemas, activeSchema } = props;
  const schema = activeSchema as CheckboxGroupSchema;
  rootElement.style.width = '100%';
  markInspectorInteractive(rootElement);
  const schemaId = schema.id;

  const commit = (patch: Record<string, unknown>) => {
    if (!schemaId) return;
    changeSchemas(
      Object.entries({
        ...patch,
        ...syncDesignerOptionGroupPatch({ ...schema, ...patch } as CheckboxGroupSchema, 'checkbox'),
      })
        .map(([key, value]) => ({ key, value, schemaId })),
    );
  };

  let currentOptions = normalizeCheckboxGroupOptions(schema);

  const commitOptions = (nextOptions: CheckboxOption[]) => {
    currentOptions = nextOptions;
    const validIds = new Set(nextOptions.map((o) => o.optionId));
    const selected = resolveSelectedIds(schema);
    const nextSelected = clampSelectedIds(new Set(Array.from(selected).filter((id) => validIds.has(id))), nextOptions, schema);
    commit({
      options: nextOptions,
      content: serializeSelectedIds(nextSelected),
      selectedOptionIds: Array.from(nextSelected),
      ...buildOptionGroupDesignerDimensions(CHECKBOX_GROUP_LAYOUT, nextOptions.length),
    });
  };

  const editor = createOptionGroupOptionsEditor<CheckboxOption>({
    rootElement,
    headerText: 'Valores de las casillas',
    rowClassName: 'sisad-option-editor-row sisad-option-editor-row--checkbox',
    newInputPlaceholder: 'Nueva casilla…',
    optionInputPlaceholder: (index) => `Casilla ${index + 1}`,
    indicatorShape: 'square',
    indicatorColor: schema.color || '#1677ff',
    getOptions: () => currentOptions,
    setOptions: (nextOptions) => {
      currentOptions = nextOptions;
    },
    createRenamedOptions: (options, index, label) =>
      options.map((option, optionIndex) => (optionIndex === index ? { ...option, label: label || option.label } : option)),
    createRemovedOptions: (options, index) => {
      const next = options.filter((_, optionIndex) => optionIndex !== index);
      return next.length ? next : buildDefaultOptionGroupOptions('Casilla', 2);
    },
    createAddedOptions: (options, label) => {
      const clean = label || `Casilla ${options.length + 1}`;
      return [...options, { optionId: normalizeOptionId(clean, options.length), label: clean }];
    },
    onCommitOptions: commitOptions,
  });

  editor.render();
};

const schema: Plugin<CheckboxGroupSchema> = createSchemaPlugin<CheckboxGroupSchema>(
  {
    ui: (arg) => {
      const { schema, rootElement, mode, onChange, value } = arg;
      const cbSchema = schema as CheckboxGroupSchema;
      const options = normalizeCheckboxGroupOptions(cbSchema);
      const isDesigner = mode === 'designer';
      const selected = clampSelectedIds(
        !isDesigner && typeof value === 'string' && value.trim()
          ? new Set(value.split(',').map((s) => s.trim()).filter(Boolean))
          : resolveSelectedIds(cbSchema),
        options,
        cbSchema,
      );
      const editable = isEditable(mode, cbSchema);

      // ── Form / Viewer mode: labeled runtime ──────────────────────────────
      const limits = resolveSelectionLimits(cbSchema);
      const readOnlyGroup = resolveOptionGroupReadOnly(cbSchema);
      const minRequired = limits.minSelected ?? (cbSchema.required ? 1 : 0);
      const groupInvalid =
        !readOnlyGroup &&
        ((minRequired > 0 && selected.size < minRequired) ||
          (limits.maxSelected != null && selected.size > limits.maxSelected));

      renderOptionGroupUi({
        rootElement,
        isDesigner,
        mode,
        selectionMode: 'multiple',
        invalid: groupInvalid,
        renderDesigner: () => createDesignerCheckboxGroup({ options, selected }),
        renderRuntime: () => createOptionGroupRuntime({
          options,
          selectionMode: 'multiple',
          selectedOptionIds: Array.from(selected),
          readOnly: readOnlyGroup,
          ...buildOptionGroupRuntimeSharedParams({
            schema: cbSchema,
            mode,
            editable,
            invalid: groupInvalid,
          }),
          resolveSelection: ({ option, currentSelection }) => {
            const next = toggleSelectedIds(
              new Set(currentSelection.selectedOptionIds),
              option.optionId,
              options,
              cbSchema,
            );

            return {
              content: serializeSelectedIds(next),
              selectedOptionIds: Array.from(next),
            };
          },
          onChange,
        }),
      });
    },

    pdf: async (arg) => {
      const { page, schema } = arg;
      const cbSchema = schema as CheckboxGroupSchema;
      const resolvedOptions = normalizeCheckboxGroupOptions(cbSchema);
      if (!resolvedOptions.length) return;
      renderOptionGroupPdf({
        page,
        schema: cbSchema,
        options: resolvedOptions,
        selectionMode: 'multiple',
        indicatorShape: 'square',
        selectedOptionIds: Array.from(resolveSelectedIds(cbSchema)),
        color: cbSchema.color,
      });
    },

    propPanel: {
      ...createOptionGroupPropPanelConfig({
        optionsTitle: 'Casillas',
        optionsWidget: 'editCheckboxGroupOptions',
        groupNameTitle: 'Nombre del grupo',
        groupIdTitle: 'ID del grupo',
        lockedAsGroupTitle: 'Bloquear como grupo',
        includeMinMax: true,
        minSelectedTitle: 'Mín. seleccionadas',
        maxSelectedTitle: 'Máx. seleccionadas',
        propertyMap: {
          minSelected: 'data',
          maxSelected: 'data',
        },
        widgets: { editCheckboxGroupOptions: CheckboxOptionsEditor },
        defaultSchema: {
          ...buildOptionGroupDefaultSchema({
            type: 'checkboxGroup',
            groupName: 'Grupo de casillas',
            groupType: 'checkbox',
            optionPrefix: 'Casilla',
            selectionMode: 'multiple',
            optionsCount: 2,
                }),
        },
      }),
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
  normalizeCheckboxGroupOptions,
  resolveSelectedIds,
  serializeSelectedIds,
  resolveSelectionLimits,
  clampSelectedIds,
  toggleSelectedIds,
  buildOptionGroupDesignerDimensions,
  /** Drops selected ids that no longer exist in the option set. */
  normalizeSelectedOptionIds: (selected: string[], options: CheckboxOption[]) => {
    const valid = new Set(options.map((o) => o.optionId));
    return selected.filter((id) => valid.has(id));
  },
  /** Generates a stable, unique optionId from a label against current options. */
  createNextOption: (label: string, options: CheckboxOption[]): CheckboxOption => {
    const clean = normalizeOptionText(label) || `Casilla ${options.length + 1}`;
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
