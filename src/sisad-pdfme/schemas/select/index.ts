import type * as CSS from 'csstype';
import { propPanel as parentPropPanel } from '../text/propPanel.js';
import { Plugin, PropPanelWidgetProps, SchemaForUI } from '@sisad-pdfme/common';
import text from '../text/index.js';
import { TextSchema } from '../text/types.js';
import { ChevronDown } from 'lucide-react';
import { renderLucideIcon, createSchemaPlugin } from '../schemaBuilder.js';
import { createSchemaInspectorConfig } from '../schemaFamilies.js';
import { basicsFields, helpFields, dataLabelFields, COMMON_PROPERTY_MAP } from '../propPanel/commonInspectorFields.js';
import { normalizeStringOptions, resolveCompactSelection } from '../options/optionSelectionBehavior.js';
import { markInspectorInteractive, stopInspectorPointerEvent } from '../../ui/components/Designer/RightSidebar/DetailView/inspectorInteractionGuards.js';
import { normalizeLooseText } from '../../shared/text.js';

const selectIcon = renderLucideIcon(ChevronDown);

interface Select extends TextSchema {
  options: string[];
}

const resolveSelectPdfValue = (value: unknown, options: string[]): string => {
  const normalizedValue = normalizeLooseText(value);
  if (!normalizedValue) return '';
  return options.includes(normalizedValue) ? normalizedValue : '';
};

const addOptions = (props: PropPanelWidgetProps) => {
  const { rootElement, changeSchemas, activeSchema, i18n } = props;

  rootElement.className = 'sisad-option-editor-select-root w-full min-w-0';
  rootElement.setAttribute('data-testid', 'detail-options-section');
  markInspectorInteractive(rootElement);

  const selectSchema = activeSchema as SchemaForUI & Select;
  const currentOptions = normalizeStringOptions(Array.isArray(selectSchema.options) ? selectSchema.options : []);
  const activeSchemaId = activeSchema.id;

  const updateSchemas = () => {
    if (!activeSchemaId) return;
    const currentContent = typeof selectSchema.content === 'string' ? selectSchema.content : '';
    const nextContent = resolveCompactSelection(currentContent, currentOptions);
    changeSchemas([
      { key: 'options', value: [...currentOptions], schemaId: activeSchemaId },
      { key: 'content', value: nextContent, schemaId: activeSchemaId },
    ]);
  };

  const formContainer = document.createElement('div');
  formContainer.className = 'sisad-option-editor-add-row grid items-center gap-1.5 [grid-template-columns:1fr_auto]';

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = i18n('schemas.select.optionPlaceholder');
  input.className = 'sisad-option-editor-input w-full min-w-0 rounded-lg border border-dashed border-slate-300 bg-white/85 px-2 py-1 text-[12px] text-slate-700 outline-none placeholder:text-slate-400 focus-visible:border-solid focus-visible:ring-2 focus-visible:ring-sky-500/40';
  input.setAttribute('data-testid', 'option-new-input');

  const addButton = document.createElement('button');
  addButton.type = 'button';
  addButton.className = 'sisad-option-editor-add-btn inline-flex h-[26px] flex-none items-center justify-center gap-1 whitespace-nowrap rounded-lg border border-sky-200 bg-sky-50 px-2.5 text-[11px] font-semibold text-sky-700 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition-colors hover:border-sky-300 hover:bg-sky-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/40';
  addButton.setAttribute('data-testid', 'option-add-button');
  addButton.setAttribute('aria-label', 'Agregar opción');
  const addIcon = document.createElement('span');
  addIcon.textContent = '+';
  addIcon.setAttribute('aria-hidden', 'true');
  addIcon.className = 'text-[14px] font-bold leading-none';
  addButton.appendChild(addIcon);
  addButton.appendChild(document.createTextNode('Agregar opción'));

  const handleAddOption = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
    const newValue = input.value.trim();
    if (!newValue) return;
    if (currentOptions.includes(newValue)) return;
    currentOptions.push(newValue);
    renderOptions();
    updateSchemas();
    input.value = '';
  };

  addButton.addEventListener('pointerdown', stopInspectorPointerEvent);
  addButton.addEventListener('mousedown', stopInspectorPointerEvent);
  addButton.addEventListener('click', handleAddOption);
  input.addEventListener('keydown', (event) => {
    if (!['Enter', 'NumpadEnter'].includes(event.key)) return;
    event.preventDefault();
    event.stopPropagation();
    handleAddOption(event);
  });

  formContainer.appendChild(input);
  formContainer.appendChild(addButton);

  const optionsList = document.createElement('div');
  optionsList.className = 'sisad-option-editor-list sisad-option-editor-select-list mb-2 flex max-h-[220px] flex-col gap-1.5 overflow-y-auto pr-0.5';

  const renderOptions = () => {
    optionsList.replaceChildren();
    currentOptions.forEach((option, index) => {
      const li = document.createElement('div');
      li.className = 'sisad-option-editor-row sisad-option-editor-row--select sisad-option-editor-select-item grid items-center gap-1.5 rounded-lg border border-slate-200/80 bg-white/90 px-1.5 py-1 shadow-sm transition-colors hover:border-slate-300 hover:bg-white [grid-template-columns:minmax(0,1fr)_26px]';
      li.setAttribute('data-testid', 'option-row');

      const optionInput = document.createElement('input');
      optionInput.type = 'text';
      optionInput.value = option;
      optionInput.className = 'sisad-option-editor-input w-full min-w-0 rounded-md border-0 bg-transparent px-1.5 py-1 text-[13px] text-slate-700 outline-none placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-sky-500/40';
      optionInput.setAttribute('data-testid', 'option-label-input');
      optionInput.setAttribute('aria-label', `Opción ${index + 1}`);

      optionInput.addEventListener('change', () => {
        const nextValue = optionInput.value.trim();
        if (!nextValue) return;
        if (currentOptions.some((value, currentIndex) => currentIndex !== index && value === nextValue)) return;
        currentOptions[index] = nextValue;
        renderOptions();
        updateSchemas();
      });

      const removeButton = document.createElement('button');
      removeButton.type = 'button';
      removeButton.textContent = '×';
      removeButton.className = 'sisad-option-editor-remove-btn inline-flex h-[26px] w-[26px] flex-none items-center justify-center rounded-md border-0 bg-transparent p-0 text-[16px] leading-none text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40 disabled:cursor-not-allowed disabled:opacity-40';
      removeButton.setAttribute('data-testid', 'option-delete-button');
      removeButton.setAttribute('aria-label', `Eliminar opción ${index + 1}`);

      removeButton.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        currentOptions.splice(index, 1);
        updateSchemas();
        renderOptions();
      });

      li.appendChild(optionInput);
      li.appendChild(removeButton);
      optionsList.appendChild(li);
    });
  };

  rootElement.appendChild(optionsList);
  rootElement.appendChild(formContainer);

  renderOptions();
};

const schema: Plugin<Select> = createSchemaPlugin<Select>({
  ui: async (arg) => {
    const { schema, value, onChange, rootElement, mode } = arg;
    // Show a muted "Seleccionar" placeholder when no option is chosen. Uses the
    // RAW content (not resolveCompactSelection, which would force the first
    // option), so an unselected field stays empty and shows the placeholder. It
    // renders through the same styled text container and is purely visual.
    const rawValue = typeof value === 'string' ? value.trim() : '';
    const isPlaceholder = !rawValue;
    await text.ui(Object.assign(arg, {
      mode: 'viewer',
      value: isPlaceholder ? 'Seleccionar' : rawValue,
    }));

    if (isPlaceholder) {
      rootElement.dataset.selectPlaceholder = 'true';
      const placeholderColor = 'rgba(100, 116, 139, 0.75)';
      rootElement.querySelectorAll<HTMLElement>('div, span').forEach((el) => {
        el.style.color = placeholderColor;
      });
    } else {
      delete rootElement.dataset.selectPlaceholder;
    }

    // FieldChromePolicy hooks: CSS drives mode-specific chrome for the field.
    rootElement.dataset.renderMode = String(mode);
    rootElement.dataset.schemaFamily = 'option-based';
    rootElement.dataset.selectionMode = 'singleCompact';
    Object.assign(rootElement.style, {
      overflow: 'visible',
      background: 'transparent',
      border: '0',
      boxShadow: 'none',
      margin: '0',
      padding: mode === 'form' ? '0 22px 0 0' : '0',
      display: 'block',
      width: '100%',
      height: mode === 'form' ? 'auto' : '100%',
      minHeight: mode === 'form' ? '22px' : '0',
    });

    // Chevron is decorative (pointer-events:none). Shown in every UI mode so the
    // field always reads as a dropdown; the native <select> overlay (interactive)
    // MUST only mount in form mode — in designer it would capture pointer events
    // and block drag/selection/Moveable.
    const shouldShowChevron = mode !== 'pdf';
    const shouldMountNativeSelect = mode === 'form' && !schema.readOnly;

    if (shouldShowChevron) {
      const buttonWidth = 22;
      const selectButton = document.createElement('button');
      selectButton.type = 'button';
      selectButton.className = 'sisad-pdfme-select-chevron';
      selectButton.innerHTML = selectIcon;
      const selectButtonStyle: CSS.Properties = {
        // Chevron sits INSIDE the field on the right, vertically centered,
        // decorative only (clicks pass through to the native <select> overlay).
        position: 'absolute',
        zIndex: '1',
        right: '4px',
        top: '50%',
        transform: 'translateY(-50%)',
        padding: '0',
        margin: '0',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
        border: 'none',
        height: `${buttonWidth}px`,
        width: `${buttonWidth}px`,
        color: 'var(--schema-tone, #475569)',
      };
      Object.assign(selectButton.style, selectButtonStyle);
      selectButton.querySelectorAll('svg').forEach((svg) => {
        Object.assign((svg as SVGSVGElement).style, {
          width: '12px',
          height: '12px',
          display: 'block',
        });
      });

      rootElement.appendChild(selectButton);
    }

    if (shouldMountNativeSelect) {
      const selectElement = document.createElement('select');
      const selectElementStyle: CSS.Properties = {
        opacity: '0',
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: '0',
        left: '0',
        cursor: 'pointer',
        appearance: 'initial',
      };
      Object.assign(selectElement.style, selectElementStyle);
      selectElement.value = resolveCompactSelection(value, normalizeStringOptions(Array.isArray(schema.options) ? schema.options : []));

      selectElement.addEventListener('change', (e) => {
        if (onChange && e.target instanceof HTMLSelectElement) {
          onChange([{ key: 'content', value: e.target.value }]);
        }
      });

      const options = normalizeStringOptions(Array.isArray(schema.options) ? schema.options : []);
      const resolvedOptions = options;
      const needsPlaceholder = !value || !resolvedOptions.includes(value);

      if (needsPlaceholder) {
        const ph = document.createElement('option');
        ph.value = '';
        ph.disabled = true;
        ph.hidden = true;
        ph.selected = !value;
        ph.textContent = 'Seleccionar';
        selectElement.appendChild(ph);
      }
      for (const opt of resolvedOptions) {
        const el = document.createElement('option');
        el.value = opt;
        el.selected = opt === value;
        el.textContent = opt;
        selectElement.appendChild(el);
      }
      rootElement.appendChild(selectElement);
    }
  },
  pdf: async (arg) => {
    const options = normalizeStringOptions(Array.isArray((arg.schema as Select).options) ? (arg.schema as Select).options : []);
    const nextValue = resolveSelectPdfValue(arg.value, options);
    return text.pdf({
      ...arg,
      value: nextValue,
    });
  },
  propPanel: {
    ...text.propPanel,
    inspector: createSchemaInspectorConfig('textual', {
      propertyMap: {
        ...COMMON_PROPERTY_MAP,
        optionsContainer: 'data',
      },
      includeConnections: true,
    }),
    widgets: { ...parentPropPanel.widgets, addOptions },
    schema: (propPanelProps: Omit<PropPanelWidgetProps, 'rootElement'>) => {
      if (typeof parentPropPanel.schema !== 'function') {
        throw Error('Oops, is text schema no longer a function?');
      }

      // Safely call the parent schema function with proper type checking
      const parentSchema = parentPropPanel.schema(propPanelProps);

      // Create a type-safe return object
      return {
        ...basicsFields(),
        ...parentSchema,
        ...helpFields(),
        ...dataLabelFields(),
        '-------': { type: 'void', widget: 'Divider' },

        // Rendered by the DetailView as a direct React editor (SchemaOptionsEditor):
        // no Ant Card, no nested form properties. `addOptions` (imperative) stays
        // registered in `widgets` only as a legacy fallback for other hosts.
        optionsContainer: {
          title: (propPanelProps as PropPanelWidgetProps).i18n('schemas.select.options'),
          type: 'string',
          widget: 'SchemaOptionsEditor',
          span: 24,
        },
      };
    },
    defaultSchema: {
      ...(text.propPanel.defaultSchema as TextSchema),
      type: 'select',
      content: '',
      options: ['option1', 'option2'],
    },
  },
  icon: selectIcon,
}, {
  key: 'select',
  type: 'select',
  label: 'Desplegable',
  category: 'Opciones',
  tags: ['select', 'dropdown', 'options'],
  capabilities: ['designer', 'form', 'viewer', 'selection', 'content', 'prefill'],
});

export default schema;
