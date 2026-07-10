import React from 'react';
import type { SchemaForUI } from '@sisad-pdfme/common';
import { Check, ChevronDown, ChevronUp, Plus, X } from 'lucide-react';
import { DESIGNER_CLASSNAME } from '../../../../constants.js';
import { mergeClassNames } from '../../shared/className.js';
import { INSPECTOR_INTERACTIVE_ATTR, stopInspectorPointerEvent } from './inspectorInteractionGuards.js';
import type { OptionItem } from '../../../../../schemas/options/optionTypes.js';
import {
  buildDefaultOptionGroupOptions,
  normalizeOptionGroupOptions,
  normalizeOptionId,
} from '../../../../../schemas/options/optionModel.js';
import {
  clampMultiOptionSelection,
  normalizeStringOptions,
  resolveCompactSelection,
  resolveMultiOptionSelection,
  resolveSingleOptionSelection,
  toggleMultiOptionSelection,
} from '../../../../../schemas/options/optionSelectionBehavior.js';
import {
  syncDesignerOptionGroupPatch,
  buildOptionGroupDesignerDimensions,
} from '../../../../../schemas/options/optionGroupFactory.js';
import { RADIO_GROUP_LAYOUT, CHECKBOX_GROUP_LAYOUT } from '../../../../../schemas/options/optionGroupLayout.js';

type ChangeSchemas = (_objs: { key: string; value: unknown; schemaId: string }[]) => void;

type SchemaOptionsEditorProps = {
  activeSchema: SchemaForUI;
  changeSchemas: ChangeSchemas;
};

type OptionGroupSchema = SchemaForUI & {
  options?: unknown[];
  content?: string;
  selectedOptionId?: string;
  defaultSelectedOptionId?: string;
  selectedOptionIds?: string[];
  minSelected?: number;
  maxSelected?: number;
  color?: string;
};

type EditorKind = 'select' | 'radio' | 'checkbox';

type EditorRow = {
  /** Stable identity: optionId for groups, the value itself for select. */
  key: string;
  label: string;
  isDefault: boolean;
};

const resolveKind = (schemaType: unknown): EditorKind | null => {
  const normalized = String(schemaType || '').trim().toLowerCase();
  if (normalized === 'select' || normalized === 'dropdown') return 'select';
  if (normalized === 'radiogroup') return 'radio';
  if (normalized === 'checkboxgroup') return 'checkbox';
  return null;
};

const KIND_COPY: Record<EditorKind, { addPlaceholder: string; defaultHint: string; itemNoun: string }> = {
  select: { addPlaceholder: 'Nueva opción…', defaultHint: 'Valor por defecto', itemNoun: 'opción' },
  radio: { addPlaceholder: 'Nueva opción…', defaultHint: 'Seleccionada por defecto', itemNoun: 'opción' },
  checkbox: { addPlaceholder: 'Nueva casilla…', defaultHint: 'Marcada por defecto', itemNoun: 'casilla' },
};

const selectionLimits = (schema: OptionGroupSchema) => ({
  minSelected: typeof schema.minSelected === 'number' ? schema.minSelected : undefined,
  maxSelected: typeof schema.maxSelected === 'number' ? schema.maxSelected : undefined,
});

/**
 * Single React editor for select/radioGroup/checkboxGroup options.
 * Renders directly under DetailSectionCard — no Ant Card, no form-render.
 * Commit semantics mirror the schema plugins exactly:
 *  - select: options[] + content (compact selection).
 *  - radioGroup: options + content/selectedOptionId/defaultSelectedOptionId + group patch/dimensions.
 *  - checkboxGroup: options + content/selectedOptionIds (clamped) + group patch/dimensions.
 */
const SchemaOptionsEditor = ({ activeSchema, changeSchemas }: SchemaOptionsEditorProps) => {
  const schema = activeSchema as OptionGroupSchema;
  const kind = resolveKind(schema.type);
  const [draft, setDraft] = React.useState('');
  const [error, setError] = React.useState('');

  if (!kind) return null;

  const copy = KIND_COPY[kind];
  const schemaId = schema.id;

  // ── Derive rows from the live schema (source of truth survives remounts) ──
  const groupNoun = kind === 'checkbox' ? 'Casilla' : 'Opción';
  const groupOptions: OptionItem[] =
    kind === 'select' ? [] : (normalizeOptionGroupOptions(schema.options, groupNoun) as OptionItem[]);
  const selectValues: string[] = kind === 'select'
    ? normalizeStringOptions(Array.isArray(schema.options) ? schema.options : [])
    : [];

  const selectDefault = kind === 'select'
    ? resolveCompactSelection(typeof schema.content === 'string' ? schema.content : '', selectValues)
    : '';
  const radioSelected = kind === 'radio'
    ? resolveSingleOptionSelection(
        schema.selectedOptionId || schema.content || schema.defaultSelectedOptionId,
        groupOptions,
        groupOptions[0]?.optionId || 'option_1',
      )
    : '';
  const checkboxSelected: Set<string> = kind === 'checkbox'
    ? new Set(
        resolveMultiOptionSelection(
          Array.isArray(schema.selectedOptionIds) && schema.selectedOptionIds.length > 0
            ? schema.selectedOptionIds
            : String(schema.content || '').split(',').map((entry) => entry.trim()).filter(Boolean),
          groupOptions,
        ),
      )
    : new Set();

  const rows: EditorRow[] =
    kind === 'select'
      ? selectValues.map((value) => ({ key: value, label: value, isDefault: value === selectDefault }))
      : groupOptions.map((option) => ({
          key: option.optionId,
          label: option.label,
          isDefault: kind === 'radio' ? option.optionId === radioSelected : checkboxSelected.has(option.optionId),
        }));

  // ── Commits (mirror plugin semantics) ──────────────────────────────────────
  const commit = (patch: Record<string, unknown>) => {
    if (!schemaId) return;
    changeSchemas(Object.entries(patch).map(([key, value]) => ({ key, value, schemaId })));
  };

  const commitSelect = (nextValues: string[], nextDefault?: string) => {
    const desired = nextDefault !== undefined ? nextDefault : (typeof schema.content === 'string' ? schema.content : '');
    commit({
      options: [...nextValues],
      content: resolveCompactSelection(desired, nextValues),
    });
  };

  const commitRadio = (nextOptions: OptionItem[], desiredSelected?: string) => {
    const safeOptions = nextOptions.length ? nextOptions : (buildDefaultOptionGroupOptions('Opción', 1) as OptionItem[]);
    const fallback = safeOptions[0]?.optionId || 'option_1';
    const nextSelected =
      desiredSelected && safeOptions.some((option) => option.optionId === desiredSelected)
        ? desiredSelected
        : safeOptions.some((option) => option.optionId === radioSelected)
          ? radioSelected
          : fallback;
    const patch: Record<string, unknown> = {
      options: safeOptions,
      content: nextSelected,
      selectedOptionId: nextSelected,
      defaultSelectedOptionId: nextSelected,
      orientation: 'vertical',
      spacing: RADIO_GROUP_LAYOUT.boxGap,
      ...buildOptionGroupDesignerDimensions(RADIO_GROUP_LAYOUT, safeOptions.length),
    };
    commit({ ...patch, ...syncDesignerOptionGroupPatch({ ...schema, ...patch } as SchemaForUI, 'radio') });
  };

  const commitCheckbox = (nextOptions: OptionItem[], desiredSelected?: Set<string>) => {
    const safeOptions = nextOptions.length ? nextOptions : (buildDefaultOptionGroupOptions('Casilla', 2) as OptionItem[]);
    const validIds = new Set(safeOptions.map((option) => option.optionId));
    const requested = Array.from(desiredSelected ?? checkboxSelected).filter((id) => validIds.has(id));
    const nextSelected = clampMultiOptionSelection(requested, safeOptions, selectionLimits(schema));
    const patch: Record<string, unknown> = {
      options: safeOptions,
      content: nextSelected.join(','),
      selectedOptionIds: nextSelected,
      ...buildOptionGroupDesignerDimensions(CHECKBOX_GROUP_LAYOUT, safeOptions.length),
    };
    commit({ ...patch, ...syncDesignerOptionGroupPatch({ ...schema, ...patch } as SchemaForUI, 'checkbox') });
  };

  // ── Row operations ─────────────────────────────────────────────────────────
  const validateLabel = (label: string, currentIndex: number): string => {
    if (!label) return 'La etiqueta no puede estar vacía.';
    const duplicated = rows.some((row, index) => index !== currentIndex && row.label === label);
    return duplicated ? 'Ya existe una opción con esa etiqueta.' : '';
  };

  const addOption = (rawLabel: string = draft) => {
    const label = rawLabel.trim();
    const validation = validateLabel(label, -1);
    if (validation) {
      setError(validation);
      return;
    }
    setError('');
    setDraft('');
    if (kind === 'select') {
      commitSelect([...selectValues, label]);
      return;
    }
    const nextOption: OptionItem = {
      optionId:
        kind === 'checkbox'
          ? normalizeOptionId(label, groupOptions.length)
          : `option_${groupOptions.length + 1}`,
      label,
    };
    const nextOptions = [...groupOptions, nextOption];
    if (kind === 'radio') commitRadio(nextOptions);
    else commitCheckbox(nextOptions);
  };

  const renameOption = (index: number, rawLabel: string) => {
    const label = rawLabel.trim();
    const validation = validateLabel(label, index);
    if (validation) {
      setError(validation);
      return;
    }
    setError('');
    if (kind === 'select') {
      const previous = selectValues[index];
      const nextValues = selectValues.map((value, valueIndex) => (valueIndex === index ? label : value));
      commitSelect(nextValues, selectDefault === previous ? label : undefined);
      return;
    }
    const nextOptions = groupOptions.map((option, optionIndex) =>
      optionIndex === index ? { ...option, label: label || option.label } : option,
    );
    if (kind === 'radio') commitRadio(nextOptions);
    else commitCheckbox(nextOptions);
  };

  const removeOption = (index: number) => {
    setError('');
    if (kind === 'select') {
      commitSelect(selectValues.filter((_, valueIndex) => valueIndex !== index));
      return;
    }
    if (groupOptions.length <= 1) return;
    const nextOptions = groupOptions.filter((_, optionIndex) => optionIndex !== index);
    if (kind === 'radio') commitRadio(nextOptions);
    else commitCheckbox(nextOptions);
  };

  const moveOption = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0) return;
    setError('');
    if (kind === 'select') {
      if (target >= selectValues.length) return;
      const nextValues = [...selectValues];
      [nextValues[index], nextValues[target]] = [nextValues[target], nextValues[index]];
      commitSelect(nextValues);
      return;
    }
    if (target >= groupOptions.length) return;
    const nextOptions = [...groupOptions];
    [nextOptions[index], nextOptions[target]] = [nextOptions[target], nextOptions[index]];
    if (kind === 'radio') commitRadio(nextOptions);
    else commitCheckbox(nextOptions);
  };

  const markDefault = (index: number) => {
    setError('');
    if (kind === 'select') {
      commitSelect(selectValues, selectValues[index]);
      return;
    }
    if (kind === 'radio') {
      commitRadio(groupOptions, groupOptions[index]?.optionId);
      return;
    }
    const optionId = groupOptions[index]?.optionId;
    if (!optionId) return;
    const nextSelected = new Set(
      toggleMultiOptionSelection(Array.from(checkboxSelected), optionId, groupOptions, selectionLimits(schema)),
    );
    commitCheckbox(groupOptions, nextSelected);
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  const interactiveAttrs = {
    [INSPECTOR_INTERACTIVE_ATTR]: 'true',
    'data-selecto-ignore': 'true',
    'data-moveable-ignore': 'true',
    'data-canvas-drop-ignore': 'true',
  } as const;

  const iconButtonClass = mergeClassNames(
    DESIGNER_CLASSNAME + 'options-editor-icon-btn',
    'inline-flex h-6 w-6 flex-none items-center justify-center rounded-md border-0 bg-transparent p-0 text-slate-400 transition-colors',
    'hover:bg-slate-100 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/40',
    'disabled:cursor-not-allowed disabled:opacity-35',
  );

  return (
    <div
      className={mergeClassNames(DESIGNER_CLASSNAME + 'options-editor', 'w-full min-w-0 space-y-1.5')}
      data-testid="detail-options-section"
      data-options-kind={kind}
      {...interactiveAttrs}
      onPointerDown={stopInspectorPointerEvent}
      onMouseDown={stopInspectorPointerEvent}
    >
      <div className={mergeClassNames(DESIGNER_CLASSNAME + 'options-editor-meta', 'flex items-baseline justify-between gap-2 px-0.5')}>
        <span className="text-[0.6rem] font-medium text-slate-500">
          {rows.length === 1 ? '1 valor' : `${rows.length} valores`}
        </span>
        <span className="truncate text-[0.58rem] text-slate-400">{copy.defaultHint}</span>
      </div>

      {rows.length === 0 ? (
        <div
          className={mergeClassNames(
            DESIGNER_CLASSNAME + 'options-editor-empty',
            'rounded-lg border border-dashed border-slate-200 bg-white/70 px-2 py-3 text-center',
          )}
          data-testid="options-empty-state"
        >
          <div className="text-[0.68rem] font-medium text-slate-600">Sin opciones</div>
          <div className="text-[0.6rem] text-slate-400">Agrega la primera {copy.itemNoun} abajo.</div>
        </div>
      ) : (
        <div className={mergeClassNames(DESIGNER_CLASSNAME + 'options-editor-list', 'max-h-[240px] space-y-1 overflow-y-auto pr-0.5')}>
          {rows.map((row, index) => (
            <div
              key={row.key}
              className={mergeClassNames(
                DESIGNER_CLASSNAME + 'options-editor-row',
                'flex items-center gap-1 rounded-lg border border-slate-200/80 bg-white/90 py-0.5 pl-1.5 pr-1 shadow-sm transition-colors hover:border-slate-300',
              )}
              data-testid="option-row"
            >
              <button
                type="button"
                className={mergeClassNames(
                  iconButtonClass,
                  'h-5 w-5 rounded-full border',
                  row.isDefault
                    ? 'border-sky-400 bg-sky-50 text-sky-600 hover:bg-sky-100 hover:text-sky-700'
                    : 'border-slate-200 text-transparent hover:text-slate-300',
                )}
                title={copy.defaultHint}
                aria-label={`${copy.defaultHint}: ${row.label}`}
                aria-pressed={row.isDefault}
                data-testid="option-default-control"
                onClick={() => markDefault(index)}
              >
                <Check size={11} strokeWidth={3} />
              </button>
              <input
                type="text"
              defaultValue={row.label}
              aria-label={`Opción ${index + 1}`}
              data-testid="option-label-input"
              className={mergeClassNames(
                DESIGNER_CLASSNAME + 'options-editor-input',
                'w-full min-w-0 flex-1 rounded-md border-0 bg-transparent px-1 py-0.5 text-[12px] text-slate-700 outline-none placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-sky-500/40',
              )}
              onChange={(event) => {
                if (event.target.value.trim() !== row.label) renameOption(index, event.target.value);
              }}
              onBlur={(event) => {
                if (event.target.value.trim() !== row.label) renameOption(index, event.target.value);
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    (event.target as HTMLInputElement).blur();
                  }
                }}
              />
              <button
                type="button"
                className={iconButtonClass}
                disabled={index === 0}
                aria-label={`Subir ${row.label}`}
                data-testid="option-move-up"
                onClick={() => moveOption(index, -1)}
              >
                <ChevronUp size={12} />
              </button>
              <button
                type="button"
                className={iconButtonClass}
                disabled={index === rows.length - 1}
                aria-label={`Bajar ${row.label}`}
                data-testid="option-move-down"
                onClick={() => moveOption(index, 1)}
              >
                <ChevronDown size={12} />
              </button>
              <button
                type="button"
                className={mergeClassNames(iconButtonClass, 'hover:bg-rose-50 hover:text-rose-600')}
                disabled={kind !== 'select' && rows.length <= 1}
                aria-label={`Eliminar opción ${index + 1}`}
                title="Eliminar opción"
                data-testid="option-delete-button"
                onClick={() => removeOption(index)}
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className={mergeClassNames(DESIGNER_CLASSNAME + 'options-editor-add', 'flex items-center gap-1.5')}>
        <input
          type="text"
          value={draft}
          placeholder={copy.addPlaceholder}
          data-testid="option-new-input"
          className={mergeClassNames(
            DESIGNER_CLASSNAME + 'options-editor-add-input',
            'w-full min-w-0 flex-1 rounded-lg border border-dashed border-slate-300 bg-white/70 px-2 py-1 text-[12px] text-slate-700 outline-none placeholder:text-slate-400 focus-visible:border-solid focus-visible:ring-2 focus-visible:ring-sky-500/40',
          )}
          onChange={(event) => {
            setDraft(event.target.value);
            if (error) setError('');
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === 'NumpadEnter') {
              event.preventDefault();
              addOption((event.target as HTMLInputElement).value);
            }
          }}
        />
        <button
          type="button"
          className={mergeClassNames(
            DESIGNER_CLASSNAME + 'options-editor-add-btn',
            'inline-flex h-[26px] flex-none items-center justify-center gap-1 whitespace-nowrap rounded-lg border border-sky-200 bg-sky-50 px-2.5 text-[11px] font-semibold text-sky-700 transition-colors',
            'hover:border-sky-300 hover:bg-sky-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/40',
          )}
          aria-label="Agregar opción"
          data-testid="option-add-button"
          onClick={() => addOption()}
        >
          <Plus size={12} strokeWidth={2.5} />
          Agregar opción
        </button>
      </div>

      {error ? (
        <div
          className={mergeClassNames(DESIGNER_CLASSNAME + 'options-editor-error', 'px-0.5 text-[0.62rem] font-medium text-rose-600')}
          role="alert"
          data-testid="options-editor-error"
        >
          {error}
        </div>
      ) : null}
    </div>
  );
};

export default SchemaOptionsEditor;
