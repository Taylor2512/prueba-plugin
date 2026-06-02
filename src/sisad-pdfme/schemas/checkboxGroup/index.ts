import type { Plugin, PropPanelWidgetProps, SchemaForUI } from '@sisad-pdfme/common';
import { hex2PrintingColor, convertForPdfLayoutProps } from '../utils.js';
import { isEditable } from '../utils.js';
import { HEX_COLOR_PATTERN } from '../constants.js';
import { createSchemaPlugin, renderLucideIcon } from '../schemaBuilder.js';
import { createSchemaInspectorConfig } from '../schemaFamilies.js';
import { SquareCheck } from 'lucide-react';
import type { GroupMeta } from '../../shared/schemaDesignerMeta.js';

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

const normalizeText = (value: unknown) => String(value || '').trim();
const ensureOptionId = (value: string, index: number) => normalizeText(value) || `option_${index + 1}`;

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

// Selected ids stored in `content` as comma-joined string, or in selectedOptionIds
const resolveSelectedIds = (schema: CheckboxGroupSchema): Set<string> => {
  const fromArray = Array.isArray(schema.selectedOptionIds) ? schema.selectedOptionIds : null;
  if (fromArray) return new Set(fromArray.map(normalizeText).filter(Boolean));
  const fromContent = normalizeText(schema.content);
  if (fromContent) return new Set(fromContent.split(',').map((s) => s.trim()).filter(Boolean));
  return new Set();
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
  Object.assign(header.style, { fontSize: '12px', fontWeight: '600', color: '#555', marginBottom: '8px' });
  header.textContent = 'Valores de las casillas';
  rootElement.appendChild(header);

  const list = document.createElement('div');
  Object.assign(list.style, { display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '10px', maxHeight: '220px', overflowY: 'auto' });

  const commitOptions = (nextOptions: CheckboxOption[]) => {
    const validIds = new Set(nextOptions.map((o) => o.optionId));
    const selected = resolveSelectedIds(schema);
    const nextSelected = new Set(Array.from(selected).filter((id) => validIds.has(id)));
    commit({
      options: nextOptions,
      content: serializeSelectedIds(nextSelected),
      selectedOptionIds: Array.from(nextSelected),
    });
  };

  const renderList = () => {
    list.innerHTML = '';
    currentOptions.forEach((option, index) => {
      const row = document.createElement('div');
      Object.assign(row.style, { display: 'grid', gridTemplateColumns: '18px 1fr 28px', gap: '6px', alignItems: 'center' });

      const indicator = document.createElement('div');
      Object.assign(indicator.style, { width: '16px', height: '16px', border: '1.5px solid #d0d0d0', borderRadius: '2px', flexShrink: '0' });

      const labelInput = document.createElement('input');
      labelInput.type = 'text';
      labelInput.value = option.label;
      labelInput.placeholder = `Casilla ${index + 1}`;
      Object.assign(labelInput.style, { width: '100%', padding: '5px 8px', border: '1px solid #d9d9d9', borderRadius: '4px', fontSize: '13px', outline: 'none' });

      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.innerHTML = '&times;';
      Object.assign(removeBtn.style, { width: '24px', height: '24px', border: 'none', background: 'transparent', color: '#999', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '3px', padding: '0' });

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
  Object.assign(addRow.style, { display: 'grid', gridTemplateColumns: '1fr 32px', gap: '6px', alignItems: 'center' });

  const newInput = document.createElement('input');
  newInput.type = 'text';
  newInput.placeholder = 'Nueva casilla…';
  Object.assign(newInput.style, { width: '100%', padding: '5px 8px', border: '1px solid #d9d9d9', borderRadius: '4px', fontSize: '13px', outline: 'none' });

  const addBtn = document.createElement('button');
  addBtn.type = 'button';
  addBtn.textContent = '+';
  Object.assign(addBtn.style, { width: '28px', height: '28px', border: '1.5px solid #1677ff', background: '#1677ff', color: '#fff', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', padding: '0', fontWeight: '700' });

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

const checkMarkSvg = (color: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;

const schema: Plugin<CheckboxGroupSchema> = createSchemaPlugin<CheckboxGroupSchema>(
  {
    ui: (arg) => {
      const { schema, rootElement, mode, onChange, value } = arg;
      const cbSchema = schema as CheckboxGroupSchema;
      const options = normalizeOptions(cbSchema);
      const isDesigner = mode === 'designer';
      // In form/viewer, the external `value` (comma-joined ids) is the source of truth
      // when present; designer reads from the schema itself.
      const externalIds =
        !isDesigner && typeof value === 'string' && value.trim()
          ? new Set(value.split(',').map((s) => s.trim()).filter(Boolean))
          : null;
      const selected = externalIds ?? resolveSelectedIds(cbSchema);
      const editable = isEditable(mode, cbSchema);
      const color = cbSchema.color || '#1677ff';
      const gap = Number.isFinite(Number(cbSchema.spacing)) ? Number(cbSchema.spacing) : 3;
      const isHorizontal = cbSchema.orientation === 'horizontal';

      const wrapper = document.createElement('div');
      Object.assign(wrapper.style, { position: 'relative', width: '100%', height: '100%' });
      wrapper.setAttribute('data-checkbox-group-root', 'true');

      const container = document.createElement('div');
      Object.assign(container.style, {
        width: '100%', height: '100%', boxSizing: 'border-box',
        border: `1.5px dashed ${color}`, borderRadius: '5px', padding: '4px 5px',
        display: 'flex', flexDirection: isHorizontal ? 'row' : 'column',
        flexWrap: isHorizontal ? 'wrap' : 'nowrap', gap: `${gap}px`,
        background: `${color}0a`, overflow: 'hidden',
      });

      if (cbSchema.groupName) {
        const label = document.createElement('div');
        label.textContent = cbSchema.groupName;
        Object.assign(label.style, { width: '100%', fontSize: '10px', fontWeight: '600', color, letterSpacing: '0.03em', lineHeight: '1.2', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' });
        container.appendChild(label);
      }

      options.forEach((option) => {
        const isChecked = selected.has(option.optionId);
        const row = document.createElement('button');
        row.type = 'button';
        row.setAttribute('role', 'checkbox');
        row.setAttribute('aria-checked', isChecked ? 'true' : 'false');
        row.setAttribute('data-checkbox-group-option', option.optionId);
        Object.assign(row.style, {
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          padding: '2px 6px 2px 4px', border: `1.5px solid ${color}`, borderRadius: '3px',
          background: `${color}${isChecked ? '1a' : '0d'}`, color,
          cursor: editable ? 'pointer' : 'default', fontSize: '11px', textAlign: 'left',
          width: isHorizontal ? 'auto' : '100%', minHeight: '20px', flexShrink: '0', userSelect: 'none',
        });

        const box = document.createElement('span');
        Object.assign(box.style, {
          width: '12px', height: '12px', borderRadius: '2px',
          border: `1.5px solid ${color}`, background: isChecked ? color : '#fff',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: '0',
        });
        if (isChecked) {
          const mark = document.createElement('span');
          Object.assign(mark.style, { width: '9px', height: '9px', display: 'block' });
          mark.innerHTML = checkMarkSvg('#fff');
          box.appendChild(mark);
        }

        const labelSpan = document.createElement('span');
        labelSpan.textContent = option.label;
        Object.assign(labelSpan.style, { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: '1' });

        row.appendChild(box);
        row.appendChild(labelSpan);

        if (editable && onChange) {
          row.addEventListener('click', (e) => {
            e.preventDefault(); e.stopPropagation();
            const next = new Set(selected);
            if (next.has(option.optionId)) next.delete(option.optionId);
            else next.add(option.optionId);
            onChange([
              { key: 'content', value: serializeSelectedIds(next) },
              { key: 'selectedOptionIds', value: Array.from(next) },
            ]);
          });
        }

        container.appendChild(row);
      });

      wrapper.appendChild(container);

      if (isDesigner) {
        const addBtn = document.createElement('button');
        addBtn.type = 'button';
        addBtn.textContent = '+';
        // Positioned with its center on the schema's bottom edge so it stays
        // within the hit-testable bounds (anything poking fully outside is
        // covered by the paper page in the canvas stacking order).
        Object.assign(addBtn.style, {
          position: 'absolute', bottom: '1px', left: '50%', transform: 'translateX(-50%)',
          width: '20px', height: '20px', borderRadius: '50%', border: `2px solid ${color}`,
          background: '#fff', color, fontSize: '15px', lineHeight: '1',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', zIndex: '30', padding: '0', boxShadow: '0 1px 5px rgba(0,0,0,0.18)', fontWeight: '700',
        });
        addBtn.title = 'Agregar casilla al grupo';
        addBtn.setAttribute('data-checkbox-group-add-option', 'true');
        addBtn.addEventListener('pointerdown', (e) => e.stopPropagation());
        addBtn.addEventListener('click', (e) => {
          e.preventDefault(); e.stopPropagation();
          const current = normalizeOptions(cbSchema);
          const n = current.length + 1;
          if (onChange) onChange({ key: 'options', value: [...current, { optionId: `option_${n}`, label: `Casilla ${n}` }] });
        });
        wrapper.appendChild(addBtn);
      }

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
        color: {
          title: i18n('schemas.color'),
          type: 'string',
          widget: 'color',
          props: { disabledAlpha: true },
          required: true,
          rules: [{ pattern: HEX_COLOR_PATTERN, message: i18n('validation.hexColor') }],
        },
        groupId: { title: 'Etiqueta de grupo', type: 'string', description: 'ID del grupo de casillas.' },
        groupName: { title: 'Nombre del grupo', type: 'string' },
        lockedAsGroup: { title: 'Bloquear como grupo', type: 'boolean' },
        orientation: {
          title: 'Orientación',
          type: 'string',
          widget: 'select',
          props: { options: [{ label: 'Vertical', value: 'vertical' }, { label: 'Horizontal', value: 'horizontal' }] },
        },
        spacing: { title: 'Espaciado', type: 'number', widget: 'inputNumber', props: { min: 0, precision: 0 } },
        minSelected: { title: 'Mínimo seleccionadas', type: 'number', widget: 'inputNumber', props: { min: 0, precision: 0 } },
        maxSelected: { title: 'Máximo seleccionadas', type: 'number', widget: 'inputNumber', props: { min: 0, precision: 0 } },
        optionsContainer: {
          title: 'Casillas',
          type: 'string',
          widget: 'card',
          span: 24,
          properties: { options: { widget: 'editCheckboxGroupOptions', span: 24 } },
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
          minSelected: 'data',
          maxSelected: 'data',
          optionsContainer: 'data',
        },
      }),
      widgets: { editCheckboxGroupOptions: CheckboxOptionsEditor },
      defaultSchema: {
        name: '',
        type: 'checkboxGroup',
        content: '',
        position: { x: 0, y: 0 },
        width: 55,
        height: 24,
        groupId: 'Grupo_Casillas',
        group: 'Grupo_Casillas',
        groupName: 'Grupo de casillas',
        lockedAsGroup: true,
        orientation: 'vertical',
        spacing: 3,
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
