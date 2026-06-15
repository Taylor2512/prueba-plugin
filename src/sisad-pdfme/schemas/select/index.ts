import type * as CSS from 'csstype';
import { propPanel as parentPropPanel } from '../text/propPanel.js';
import { Plugin, PropPanelWidgetProps, SchemaForUI } from '@sisad-pdfme/common';
import text from '../text/index.js';
import { TextSchema } from '../text/types.js';
import { ChevronDown } from 'lucide-react';
import { renderLucideIcon, createSchemaPlugin } from '../schemaBuilder.js';
import { createSchemaInspectorConfig } from '../schemaFamilies.js';
import { basicsFields, helpFields, dataLabelFields, COMMON_PROPERTY_MAP } from '../propPanel/commonInspectorFields.js';

const selectIcon = renderLucideIcon(ChevronDown);

interface Select extends TextSchema {
  options: string[];
}

const addOptions = (props: PropPanelWidgetProps) => {
  const { rootElement, changeSchemas, activeSchema, i18n } = props;

  rootElement.className = 'sisad-option-editor-select-root';

  const selectSchema = activeSchema as SchemaForUI & Select;
  const currentOptions = Array.isArray(selectSchema.options) ? [...selectSchema.options] : [];

  const resolveActiveSchemaId = (): string | undefined => {
    if (typeof selectSchema.id === 'string' && selectSchema.id) return selectSchema.id;
    const match = props.schemas.find(
      (schema) =>
        schema.type === selectSchema.type &&
        schema.name === selectSchema.name &&
        schema.position?.x === selectSchema.position?.x &&
        schema.position?.y === selectSchema.position?.y,
    );
    return match?.id;
  };

  const updateSchemas = () => {
    const activeSchemaId = resolveActiveSchemaId();
    if (!activeSchemaId) return;
    const currentContent = typeof selectSchema.content === 'string' ? selectSchema.content : '';
    const nextContent = currentOptions.includes(currentContent) ? currentContent : currentOptions[0] || '';
    changeSchemas([
      { key: 'options', value: [...currentOptions], schemaId: activeSchemaId },
      { key: 'content', value: nextContent, schemaId: activeSchemaId },
    ]);
  };

  const formContainer = document.createElement('div');
  formContainer.className = 'sisad-option-editor-add-row';

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = i18n('schemas.select.optionPlaceholder');
  input.className = 'sisad-option-editor-input';

  const addButton = document.createElement('button');
  addButton.type = 'button';
  addButton.textContent = '+';
  addButton.className = 'sisad-option-editor-add-btn';

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

  addButton.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    event.stopPropagation();
  });
  addButton.addEventListener('click', handleAddOption);
  input.addEventListener('keydown', (event) => {
    if (!['Enter', 'NumpadEnter'].includes(event.key)) return;
    event.preventDefault();
    event.stopPropagation();
    handleAddOption(event);
  });

  formContainer.appendChild(input);
  formContainer.appendChild(addButton);

  const optionsList = document.createElement('ul');
  optionsList.className = 'sisad-option-editor-select-list';

  const renderOptions = () => {
    optionsList.replaceChildren();
    currentOptions.forEach((option, index) => {
      const li = document.createElement('li');
      li.className = 'sisad-option-editor-select-item';

      const optionInput = document.createElement('input');
      optionInput.type = 'text';
      optionInput.value = option;
      optionInput.className = 'sisad-option-editor-input';

      optionInput.addEventListener('change', () => {
        currentOptions[index] = optionInput.value.trim();
        renderOptions();
        updateSchemas();
      });

      const removeButton = document.createElement('button');
      removeButton.type = 'button';
      removeButton.textContent = '×';
      removeButton.className = 'sisad-option-editor-remove-btn';

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

  rootElement.appendChild(formContainer);
  rootElement.appendChild(optionsList);

  renderOptions();
};

const schema: Plugin<Select> = createSchemaPlugin<Select>({
  ui: async (arg) => {
    const { schema, value, onChange, rootElement, mode } = arg;
    await text.ui(Object.assign(arg, { mode: 'viewer' }));

    if (mode !== 'viewer' && !(mode === 'form' && schema.readOnly)) {
      const buttonWidth = 30;
      const selectButton = document.createElement('button');
      selectButton.type = 'button';
      selectButton.innerHTML = selectIcon;
      const selectButtonStyle: CSS.Properties = {
        position: 'absolute',
        zIndex: -1,
        right: `-${buttonWidth}px`,
        top: '0',
        padding: '0',
        margin: '0',
        cursor: 'pointer',
        height: `${buttonWidth}px`,
        width: `${buttonWidth}px`,
      };
      Object.assign(selectButton.style, selectButtonStyle);

      rootElement.appendChild(selectButton);

      const selectElement = document.createElement('select');
      const selectElementStyle: CSS.Properties = {
        opacity: '0',
        position: 'absolute',
        width: `calc(100% + ${buttonWidth}px)`,
        height: '100%',
        top: '0',
        left: '0',
        appearance: 'initial',
      };
      Object.assign(selectElement.style, selectElementStyle);
      selectElement.value = value;

      selectElement.addEventListener('change', (e) => {
        if (onChange && e.target instanceof HTMLSelectElement) {
          onChange([{ key: 'content', value: e.target.value }]);
        }
      });

      const options = Array.isArray(schema.options) ? schema.options : [];
      const resolvedOptions = options.filter((option) => String(option || '').trim().length > 0);
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
  pdf: text.pdf,
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

        optionsContainer: {
          title: (propPanelProps as PropPanelWidgetProps).i18n('schemas.select.options'),
          type: 'string',
          widget: 'Card',
          span: 24,
          properties: { options: { widget: 'addOptions', span: 24 } },
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
