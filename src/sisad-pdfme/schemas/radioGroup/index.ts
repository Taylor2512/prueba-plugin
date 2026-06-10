import type { Plugin, PropPanelWidgetProps, SchemaForUI } from '@sisad-pdfme/common';
import { hex2PrintingColor, convertForPdfLayoutProps } from '../utils.js';
import { isEditable } from '../utils.js';
import { HEX_COLOR_PATTERN } from '../constants.js';
import { createSchemaPlugin, renderLucideIcon } from '../schemaBuilder.js';
import { createSchemaInspectorConfig } from '../schemaFamilies.js';
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

const DESIGNER_BOX_SIZE = 26;
const DESIGNER_BOX_GAP = 4;
const DESIGNER_PLUS_GAP = 5;
const DESIGNER_PLUS_SIZE = 24;
const DESIGNER_BOX_BORDER = '#65d8de';
const DESIGNER_BOX_BG = 'rgba(161, 239, 242, 0.58)';
const DESIGNER_CIRCLE_BORDER = '#8b8b8b';
const DESIGNER_PLUS_BG = '#4d00c8';

import { normalizeOptionsFromSource, normalizeOptionId } from '../options/optionModel.js';
import { resolveSelectedOptionId as resolveSelectedFromOptions } from '../options/optionValueAdapter.js';
import {
  buildGroupWrapper,
  buildGroupContainer,
  buildGroupLabel,
  buildOptionRow,
  buildRadioIndicator,
  buildOptionLabel,
  buildAddOptionButton,
} from '../groupSchemaRender.js';

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
      options as any,
    ) || options[0]?.optionId || 'option_1'
  );
};

const resolveGroupKey = (schema: RadioGroupSchema): string =>
  schema.__designer?.group?.groupId ??
  schema.groupId ??
  schema.group ??
  schema.name;

const syncDesignerGroupPatch = (schema: RadioGroupSchema) => ({
  '__designer.group.groupId': resolveGroupKey(schema),
  '__designer.group.groupName': normalizeText(schema.groupName) || undefined,
  '__designer.group.groupType': 'radio' as const,
  '__designer.group.lockedAsGroup': schema.lockedAsGroup !== false,
});

const calculateDesignerHeight = (optionsCount: number): number => {
  const count = Number.isFinite(optionsCount) && optionsCount >= 1 ? Math.floor(optionsCount) : 1;
  const gapCount = count > 1 ? count - 1 : 0;

  return (
    count * DESIGNER_BOX_SIZE +
    gapCount * DESIGNER_BOX_GAP +
    DESIGNER_PLUS_GAP +
    DESIGNER_PLUS_SIZE
  );
};

const createDesignerOptionBox = (option: RadioOption): HTMLDivElement => {
  const box = document.createElement('div');
  box.setAttribute('data-radio-group-option', option.optionId);
  box.setAttribute('aria-label', option.label);
  Object.assign(box.style, {
    width: `${DESIGNER_BOX_SIZE}px`,
    height: `${DESIGNER_BOX_SIZE}px`,
    minWidth: `${DESIGNER_BOX_SIZE}px`,
    minHeight: `${DESIGNER_BOX_SIZE}px`,
    maxWidth: `${DESIGNER_BOX_SIZE}px`,
    maxHeight: `${DESIGNER_BOX_SIZE}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    border: `2px solid ${DESIGNER_BOX_BORDER}`,
    borderRadius: '2px',
    background: DESIGNER_BOX_BG,
    padding: '0',
    margin: '0',
    flex: '0 0 auto',
    pointerEvents: 'none',
  });

  // Reuse the shared small radio indicator for the inner circle to
  // keep visuals consistent with checkboxGroup runtime indicators.
  const indicator = buildRadioIndicator('#8b8b8b', false);
  Object.assign(indicator.style, { width: '18px', height: '18px', minWidth: '18px', minHeight: '18px' });
  box.appendChild(indicator);
  return box;
};

const createDesignerAddButton = ({
  schema,
  onChange,
}: {
  schema: RadioGroupSchema;
  onChange?: (arg: { key: string; value: unknown }) => void;
}): HTMLButtonElement => {
  // Delegate styling to shared builder and attach the same atomic emission.
  const btn = buildAddOptionButton(DESIGNER_PLUS_BG, 'Agregar opción al grupo', 'data-radio-group-add-option');
  btn.setAttribute('data-schema-interactive-control', 'radio-add-option');

  btn.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!onChange) return;
    const currentOptions = normalizeOptions(schema);
    const nextIndex = currentOptions.length + 1;
    const nextOption: RadioOption = { optionId: `option_${nextIndex}`, label: `Opción ${nextIndex}` };
    const nextOptions = [...currentOptions, nextOption];
    onChange([
      { key: 'options', value: nextOptions },
      { key: 'orientation', value: 'vertical' },
      { key: 'spacing', value: DESIGNER_BOX_GAP },
      { key: 'width', value: DESIGNER_BOX_SIZE },
      { key: 'height', value: calculateDesignerHeight(nextOptions.length) },
    ]);
  });

  return btn;
};

const createDesignerRadioGroup = ({
  schema,
  options,
  onChange,
}: {
  schema: RadioGroupSchema;
  options: RadioOption[];
  onChange?: (arg: { key: string; value: unknown }) => void;
}): HTMLDivElement => {
  const wrapper = document.createElement('div');

  Object.assign(wrapper.style, {
    width: `${DESIGNER_BOX_SIZE}px`,
    minWidth: `${DESIGNER_BOX_SIZE}px`,
    maxWidth: `${DESIGNER_BOX_SIZE}px`,
    display: 'inline-flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: `${DESIGNER_BOX_GAP}px`,
    padding: '0',
    margin: '0',
    border: 'none',
    background: 'transparent',
    boxSizing: 'border-box',
    overflow: 'visible',
    pointerEvents: 'none',
  });

  const safeOptions = options.length
    ? options
    : [{ optionId: 'option_1', label: 'Opción 1' }];

  safeOptions.forEach((option) => {
    wrapper.appendChild(createDesignerOptionBox(option));
  });

  wrapper.appendChild(createDesignerAddButton({ schema, onChange }));

  return wrapper;
};

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
        onChange([
          { key: 'content', value: option.optionId },
          { key: 'selectedOptionId', value: option.optionId },
        ] as any);
      });
    }

    container.appendChild(row);
  });

  wrapper.appendChild(container);
  return wrapper;
};

// Helpers to keep legacy/large schemas in a compact geometry for the designer.
const almostEqualNumber = (a: unknown, b: number, tolerance = 0.1): boolean => {
  const value = Number(a);
  return Number.isFinite(value) && Math.abs(value - b) <= tolerance;
};

const syncDesignerRadioGroupGeometry = ({
  schema,
  options,
  rootElement,
  onChange,
}: {
  schema: RadioGroupSchema;
  options: RadioOption[];
  rootElement: HTMLElement;
  onChange?: (arg: { key: string; value: unknown }) => void;
}) => {
  if (!onChange) return;

  const optionsCount = Number.isFinite(options.length) && options.length >= 1 ? options.length : 1;
  const expectedWidth = DESIGNER_BOX_SIZE;
  const expectedHeight = calculateDesignerHeight(optionsCount);

  const needsSync =
    schema.orientation !== 'vertical' ||
    !almostEqualNumber(schema.spacing, DESIGNER_BOX_GAP) ||
    !almostEqualNumber(schema.width, expectedWidth) ||
    !almostEqualNumber(schema.height, expectedHeight);

  if (!needsSync) return;

  const signature = `${expectedWidth}:${expectedHeight}:${DESIGNER_BOX_GAP}:${optionsCount}`;

  if (rootElement.dataset.radioGroupGeometrySync === signature) return;

  rootElement.dataset.radioGroupGeometrySync = signature;

  requestAnimationFrame(() => {
    // Emitimos un único parche atómico para evitar problemas de dedupe/orden
    onChange([
      { key: 'orientation', value: 'vertical' },
      { key: 'spacing', value: DESIGNER_BOX_GAP },
      // Importante: NO usar Math.max. El radioGroup debe volver a su tamaño compacto.
      { key: 'width', value: expectedWidth },
      { key: 'height', value: expectedHeight },
    ] as any);
  });
};

// ─── PropPanel options editor ────────────────────────────────────────────────

const RadioOptionsEditor = (props: PropPanelWidgetProps) => {
  const { rootElement, changeSchemas, activeSchema } = props;
  const schema = activeSchema as RadioGroupSchema;

  rootElement.style.width = '100%';
  rootElement.innerHTML = '';

  let currentOptions = normalizeOptions(schema);
  let currentSelected = resolveSelectedOptionId(schema, currentOptions);

  const getSchemaId = (): string | undefined => {
    if (typeof schema.id === 'string' && schema.id) return schema.id;

    return props.schemas.find(
      (candidate) =>
        candidate.type === schema.type &&
        candidate.name === schema.name &&
        candidate.position?.x === schema.position?.x &&
        candidate.position?.y === schema.position?.y,
    )?.id;
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
        ...syncDesignerGroupPatch(nextSchema),
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
      // Forzar tamaño compacto aunque el schema previo viniera grande.
      width: DESIGNER_BOX_SIZE,
      height: calculateDesignerHeight(currentOptions.length),
    });
  };

  const header = document.createElement('div');

  Object.assign(header.style, {
    fontSize: '12px',
    fontWeight: '600',
    color: '#555',
    marginBottom: '8px',
  });

  header.textContent = 'Opciones del radio button';
  rootElement.appendChild(header);

  const list = document.createElement('div');

  Object.assign(list.style, {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    marginBottom: '10px',
    maxHeight: '220px',
    overflowY: 'auto',
  });

  const renderList = () => {
    list.innerHTML = '';

    currentOptions.forEach((option, index) => {
      const row = document.createElement('div');

      Object.assign(row.style, {
        display: 'grid',
        gridTemplateColumns: '20px 1fr 28px',
        gap: '6px',
        alignItems: 'center',
      });

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

      Object.assign(labelInput.style, {
        width: '100%',
        padding: '5px 8px',
        border: '1px solid #d9d9d9',
        borderRadius: '4px',
        fontSize: '13px',
        outline: 'none',
      });

      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.innerHTML = '&times;';

      Object.assign(removeBtn.style, {
        width: '24px',
        height: '24px',
        border: 'none',
        background: 'transparent',
        color: '#999',
        cursor: currentOptions.length > 1 ? 'pointer' : 'not-allowed',
        fontSize: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '3px',
        padding: '0',
        opacity: currentOptions.length > 1 ? '1' : '0.45',
      });

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

  Object.assign(addRow.style, {
    display: 'grid',
    gridTemplateColumns: '1fr 32px',
    gap: '6px',
    alignItems: 'center',
  });

  const newInput = document.createElement('input');
  newInput.type = 'text';
  newInput.placeholder = 'Nueva opción…';

  Object.assign(newInput.style, {
    width: '100%',
    padding: '5px 8px',
    border: '1px solid #d9d9d9',
    borderRadius: '4px',
    fontSize: '13px',
    outline: 'none',
  });

  const addBtn = document.createElement('button');
  addBtn.type = 'button';
  addBtn.textContent = '+';

  Object.assign(addBtn.style, {
    width: '28px',
    height: '28px',
    border: '1.5px solid #1677ff',
    background: '#1677ff',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
    padding: '0',
    fontWeight: '700',
  });

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
      // Forzar tamaño compacto aunque el schema previo viniera grande.
      width: DESIGNER_BOX_SIZE,
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

      rootElement.innerHTML = '';

      Object.assign(rootElement.style, {
        overflow: 'visible',
        background: 'transparent',
        border: 'none',
        boxShadow: 'none',
        padding: '0',
        margin: '0',
        width: 'max-content',
        height: 'max-content',
        pointerEvents: isDesigner ? 'none' : 'auto',
      });

      if (isDesigner) {
        // Mantener sincronizada la geometría de schemas antiguos que quedaron grandes.
        syncDesignerRadioGroupGeometry({
          schema: radioSchema,
          options,
          rootElement,
          onChange,
        });

        const designerGroup = createDesignerRadioGroup({
          schema: radioSchema,
          options,
          onChange,
        });

        rootElement.appendChild(designerGroup);
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
        color: {
          title: i18n('schemas.color'),
          type: 'string',
          widget: 'color',
          props: { disabledAlpha: true },
          required: true,
          rules: [{ pattern: HEX_COLOR_PATTERN, message: i18n('validation.hexColor') }],
        },
        groupId: {
          title: 'Etiqueta de grupo',
          type: 'string',
          description: 'ID del grupo de opción única.',
        },
        groupName: {
          title: 'Nombre del grupo',
          type: 'string',
        },
        lockedAsGroup: {
          title: 'Bloquear como grupo',
          type: 'boolean',
        },
        orientation: {
          title: 'Orientación',
          type: 'string',
          widget: 'select',
          props: {
            options: [
              { label: 'Vertical', value: 'vertical' },
              { label: 'Horizontal', value: 'horizontal' },
            ],
          },
        },
        spacing: {
          title: 'Espaciado',
          type: 'number',
          widget: 'inputNumber',
          props: { min: 0, precision: 0 },
        },
        optionsContainer: {
          title: 'Opciones',
          type: 'string',
          widget: 'card',
          span: 24,
          properties: {
            options: {
              widget: 'editRadioGroupOptions',
              span: 24,
            },
          },
        },
      }),
      inspector: createSchemaInspectorConfig('choice', {
        propertyMap: {
          color: 'style',
          groupId: 'data',
          groupName: 'data',
          lockedAsGroup: 'data',
          orientation: 'data',
          spacing: 'data',
          optionsContainer: 'data',
        },
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
        width: DESIGNER_BOX_SIZE,
        height: calculateDesignerHeight(1),
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