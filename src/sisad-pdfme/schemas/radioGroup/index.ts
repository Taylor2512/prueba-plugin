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

const normalizeText = (value: unknown) => String(value || '').trim();
const ensureOptionId = (value: string, index: number) => normalizeText(value) || `option_${index + 1}`;

const normalizeOptions = (schema: RadioGroupSchema): RadioOption[] => {
  const source = Array.isArray(schema.options) ? schema.options : [];
  const fallbackSelected = normalizeText(schema.selectedOptionId || schema.defaultSelectedOptionId || schema.content);

  if (!source.length) {
    return [
      { optionId: fallbackSelected || 'option_1', label: 'Opción 1' },
      { optionId: 'option_2', label: 'Opción 2' },
    ];
  }

  return source.map((entry, index) => {
    if (typeof entry === 'string') {
      const optionId = ensureOptionId(entry, index);
      return { optionId, label: entry || `Opción ${index + 1}` };
    }
    const optionId = ensureOptionId(entry.optionId, index);
    return { optionId, label: normalizeText(entry.label) || optionId };
  });
};

const resolveSelectedOptionId = (schema: RadioGroupSchema, options: RadioOption[]) => {
  const current = normalizeText(schema.selectedOptionId || schema.content || schema.defaultSelectedOptionId);
  if (options.some((o) => o.optionId === current)) return current;
  const fallback = normalizeText(schema.defaultSelectedOptionId);
  if (options.some((o) => o.optionId === fallback)) return fallback;
  return options[0]?.optionId || '';
};

const resolveGroupKey = (schema: RadioGroupSchema): string =>
  schema.__designer?.group?.groupId ?? schema.groupId ?? schema.group ?? schema.name;

const syncDesignerGroupPatch = (schema: RadioGroupSchema) => ({
  '__designer.group.groupId': resolveGroupKey(schema),
  '__designer.group.groupName': normalizeText(schema.groupName) || undefined,
  '__designer.group.groupType': 'radio' as const,
  '__designer.group.lockedAsGroup': schema.lockedAsGroup !== false,
});

// ─── PropPanel options editor — DocuSign style ────────────────────────────────
const RadioOptionsEditor = (props: PropPanelWidgetProps) => {
  const { rootElement, changeSchemas, activeSchema } = props;
  const schema = activeSchema as RadioGroupSchema;

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
      Object.entries({ ...patch, ...syncDesignerGroupPatch({ ...schema, ...patch } as RadioGroupSchema) })
        .map(([key, value]) => ({ key, value, schemaId })),
    );
  };

  const currentOptions = normalizeOptions(schema);
  const currentSelected = resolveSelectedOptionId(schema, currentOptions);

  // ── Header label ──
  const header = document.createElement('div');
  Object.assign(header.style, {
    fontSize: '12px',
    fontWeight: '600',
    color: '#555',
    marginBottom: '8px',
  });
  header.textContent = 'Valores del botón de opción';
  rootElement.appendChild(header);

  // ── Options list ──
  const list = document.createElement('div');
  Object.assign(list.style, {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    marginBottom: '10px',
    maxHeight: '220px',
    overflowY: 'auto',
  });

  const commitOptions = (nextOptions: RadioOption[]) => {
    const nextSelected = nextOptions.some((o) => o.optionId === currentSelected)
      ? currentSelected
      : nextOptions[0]?.optionId || '';
    commit({
      options: nextOptions,
      content: nextSelected,
      selectedOptionId: nextSelected,
      defaultSelectedOptionId: nextSelected || undefined,
    });
  };

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

      // Checkbox indicator (DocuSign style — small square)
      const indicator = document.createElement('div');
      Object.assign(indicator.style, {
        width: '16px',
        height: '16px',
        border: '1.5px solid #d0d0d0',
        borderRadius: '2px',
        flexShrink: '0',
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
        cursor: 'pointer',
        fontSize: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '3px',
        padding: '0',
      });

      labelInput.addEventListener('change', () => {
        const nextOptions = currentOptions.map((o, i) =>
          i === index ? { ...o, label: normalizeText(labelInput.value) || o.label } : o,
        );
        commitOptions(nextOptions);
      });

      removeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const nextOptions = currentOptions.filter((_, i) => i !== index);
        commitOptions(nextOptions.length ? nextOptions : [{ optionId: 'option_1', label: 'Opción 1' }]);
      });

      row.appendChild(indicator);
      row.appendChild(labelInput);
      row.appendChild(removeBtn);
      list.appendChild(row);
    });
  };

  renderList();
  rootElement.appendChild(list);

  // ── Add option row ──
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

  const doAdd = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    const label = normalizeText(newInput.value) || `Opción ${currentOptions.length + 1}`;
    const idBase = label.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '') || 'option';
    const nextOptions = [...currentOptions, { optionId: `${idBase}_${currentOptions.length + 1}`, label }];
    commit({
      options: nextOptions,
      content: currentSelected || nextOptions[0].optionId,
      selectedOptionId: currentSelected || nextOptions[0].optionId,
      defaultSelectedOptionId: currentSelected || nextOptions[0].optionId,
    });
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

// ─── Canvas UI render ─────────────────────────────────────────────────────────
const schema: Plugin<RadioGroupSchema> = createSchemaPlugin<RadioGroupSchema>(
  {
    ui: (arg) => {
      const { schema, value, onChange, rootElement, mode } = arg;
      const radioSchema = schema as RadioGroupSchema;
      const options = normalizeOptions(radioSchema);
      const selectedOptionId = resolveSelectedOptionId(radioSchema, options);
      const editable = isEditable(mode, radioSchema);
      const isDesigner = mode === 'designer';
      const color = radioSchema.color || '#1677ff';
      const gap = Number.isFinite(Number(radioSchema.spacing)) ? Number(radioSchema.spacing) : 3;
      const isHorizontal = radioSchema.orientation === 'horizontal';

      // Root wrapper — relative for + button
      const wrapper = document.createElement('div');
      Object.assign(wrapper.style, {
        position: 'relative',
        width: '100%',
        height: '100%',
      });

      // Group container — dashed border like DocuSign
      const container = document.createElement('div');
      Object.assign(container.style, {
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
        border: `1.5px dashed ${color}`,
        borderRadius: '5px',
        padding: '4px 5px 4px 5px',
        display: 'flex',
        flexDirection: isHorizontal ? 'row' : 'column',
        flexWrap: isHorizontal ? 'wrap' : 'nowrap',
        gap: `${gap}px`,
        background: `${color}0a`,
        overflow: 'hidden',
      });

      // Group label — small, above options (like "Grupo de opción" in DocuSign)
      if (radioSchema.groupName) {
        const label = document.createElement('div');
        label.textContent = radioSchema.groupName;
        Object.assign(label.style, {
          width: '100%',
          fontSize: '10px',
          fontWeight: '600',
          color: color,
          letterSpacing: '0.03em',
          lineHeight: '1.2',
          marginBottom: '2px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        });
        container.appendChild(label);
      }

      // Each option — colored box + circle + label (DocuSign style)
      options.forEach((option) => {
        const isSelected = option.optionId === selectedOptionId;

        const row = document.createElement('button');
        row.type = 'button';
        row.setAttribute('role', 'radio');
        row.setAttribute('aria-checked', isSelected ? 'true' : 'false');
        row.setAttribute('data-schema-interactive-control', 'radio-option');
        row.setAttribute('data-radio-group-option', option.optionId);
        Object.assign(row.style, {
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '2px 6px 2px 4px',
          border: `1.5px solid ${color}`,
          borderRadius: '3px',
          background: `${color}${isSelected ? '1a' : '0d'}`,
          color: color,
          cursor: editable ? 'pointer' : 'default',
          fontSize: '11px',
          textAlign: 'left',
          width: isHorizontal ? 'auto' : '100%',
          minHeight: '20px',
          flexShrink: '0',
          userSelect: 'none',
        });

        // Circle — DocuSign uses filled for selected, ring for unselected
        const circle = document.createElement('span');
        Object.assign(circle.style, {
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          border: `1.5px solid ${color}`,
          background: isSelected ? color : '#fff',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: '0',
        });
        if (isSelected) {
          const dot = document.createElement('span');
          Object.assign(dot.style, {
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            background: '#fff',
            display: 'block',
          });
          circle.appendChild(dot);
        }

        const labelSpan = document.createElement('span');
        labelSpan.textContent = option.label;
        Object.assign(labelSpan.style, {
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          flex: '1',
        });

        row.appendChild(circle);
        row.appendChild(labelSpan);

        if (editable && onChange) {
          row.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            onChange({ key: 'content', value: option.optionId });
          });
        }

        container.appendChild(row);
      });

      if (!options.length) {
        const empty = document.createElement('div');
        empty.textContent = 'Sin opciones';
        Object.assign(empty.style, { fontSize: '11px', color: color, opacity: '0.6' });
        container.appendChild(empty);
      }

      wrapper.appendChild(container);

      // ── + button below — only in designer, DocuSign style ──
      if (isDesigner) {
        const addBtn = document.createElement('button');
        addBtn.type = 'button';
        addBtn.textContent = '+';
        // Center on the schema's bottom edge so it stays hit-testable
        // (fully-outside elements get covered by the paper page in canvas stacking).
        Object.assign(addBtn.style, {
          position: 'absolute',
          bottom: '1px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          border: `2px solid ${color}`,
          background: '#fff',
          color: color,
          fontSize: '15px',
          lineHeight: '1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: '30',
          padding: '0',
          boxShadow: '0 1px 5px rgba(0,0,0,0.18)',
          fontWeight: '700',
        });
        addBtn.title = 'Agregar opción al grupo';
        addBtn.setAttribute('data-schema-interactive-control', 'radio-add-option');
        addBtn.setAttribute('data-radio-group-add-option', 'true');

        addBtn.addEventListener('pointerdown', (e) => e.stopPropagation());
        addBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const current = normalizeOptions(radioSchema);
          const n = current.length + 1;
          const newOpt: RadioOption = { optionId: `option_${n}`, label: `Opción ${n}` };
          if (onChange) onChange({ key: 'options', value: [...current, newOpt] });
        });

        wrapper.appendChild(addBtn);
      }

      rootElement.appendChild(wrapper);
    },

    pdf: async (arg) => {
      const { page, schema, options, _cache } = arg;
      const radioSchema = schema as RadioGroupSchema;
      const resolvedOptions = normalizeOptions(radioSchema);
      if (!resolvedOptions.length) return;

      const pageHeight = page.getHeight();
      const { position, width, height } = convertForPdfLayoutProps({ schema: radioSchema, pageHeight, applyRotateTranslate: false });
      const x = position.x;
      const y = position.y;
      const borderColor = hex2PrintingColor(radioSchema.color, options.colorType);
      const selectedOptionId = resolveSelectedOptionId(radioSchema, resolvedOptions);
      const rowHeight = Math.max(12, Math.floor(height / Math.max(1, resolvedOptions.length)));
      const pad = 4;
      const circleRadius = 3.5;
      const fontSize = 9;

      page.drawRectangle({ x, y, width, height, borderColor, borderWidth: 1, borderDashArray: [3, 3], color: undefined, opacity: undefined });

      if (radioSchema.groupName) {
        page.drawText(radioSchema.groupName, { x: x + pad, y: y + height - fontSize - 2, size: fontSize, color: borderColor });
      }

      resolvedOptions.forEach((option, index) => {
        const rowTop = y + height - (index + 1) * rowHeight;
        const rowCenterY = rowTop + rowHeight / 2;
        const circleCenterX = x + pad + circleRadius;
        const textX = x + pad + circleRadius * 2 + 6;
        const textY = rowTop + 2;

        page.drawCircle({ x: circleCenterX, y: rowCenterY, size: circleRadius, borderColor, borderWidth: 1, color: option.optionId === selectedOptionId ? borderColor : undefined });
        page.drawText(option.label, { x: textX, y: textY, size: fontSize, color: borderColor });
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
          properties: { options: { widget: 'editRadioGroupOptions', span: 24 } },
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
        name: '',
        type: 'radioGroup',
        content: 'option_1',
        position: { x: 0, y: 0 },
        width: 55,
        height: 24,
        groupId: 'Grupo_Opcion',
        group: 'Grupo_Opcion',
        groupName: 'Grupo de opción',
        lockedAsGroup: true,
        orientation: 'vertical',
        spacing: 3,
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
    category: 'Opciones',
    tags: ['radio', 'choice', 'selection', 'group'],
    capabilities: ['designer', 'form', 'viewer', 'selection', 'content'],
  },
);

export default schema;
