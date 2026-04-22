import type * as CSS from 'csstype';
import { propPanel as parentPropPanel } from '../text/propPanel.js';
import { Plugin, PropPanelWidgetProps, SchemaForUI } from '@sisad-pdfme/common';
import text from '../text/index.js';
import { TextSchema } from '../text/types.js';
import { ChevronDown } from 'lucide-react';
import { renderLucideIcon, createSchemaPlugin } from '../schemaBuilder.js';
import { createSchemaInspectorConfig } from '../schemaFamilies.js';

const selectIcon = renderLucideIcon(ChevronDown);

interface Select extends TextSchema {
  options: string[];
}

const addOptions = (props: PropPanelWidgetProps) => {
  const { rootElement, changeSchemas, activeSchema, i18n } = props;

  rootElement.style.width = '100%';
  rootElement.style.minWidth = '0';

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

  const inputStyle = {
    width: '100%',
    padding: '6.25px 11px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  };

  const buttonStyle = { border: 'none', borderRadius: '4px', cursor: 'pointer' };

  const updateSchemas = () => {
    const activeSchemaId = resolveActiveSchemaId();
    if (!activeSchemaId) return;
    // Keep content only if it exists in options. If not, fallback to first option.
    const currentContent = typeof selectSchema.content === 'string' ? selectSchema.content : '';
    const nextContent = currentOptions.includes(currentContent) ? currentContent : currentOptions[0] || '';

    changeSchemas([
      { key: 'options', value: [...currentOptions], schemaId: activeSchemaId },
      { key: 'content', value: nextContent, schemaId: activeSchemaId },
    ]);
  };

  const formContainer = document.createElement('div');
  Object.assign(formContainer.style, {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
  });

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = i18n('schemas.select.optionPlaceholder');
  Object.assign(input.style, inputStyle, { marginRight: '10px' });

  const addButton = document.createElement('button');
  addButton.type = 'button';
  addButton.textContent = '+';
  Object.assign(addButton.style, buttonStyle, {
    width: '25px',
    height: '25px',
    padding: '4px 8px',
  });

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
    // Stop drag handlers from capturing this control in sidebars.
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
  Object.assign(optionsList.style, {
    listStyle: 'none',
    padding: '0',
    margin: '0',
    maxHeight: '220px',
    overflowY: 'auto',
    overflowX: 'hidden',
    paddingRight: '4px',
  });

  const renderOptions = () => {
    optionsList.innerHTML = '';
    currentOptions.forEach((option, index) => {
      const li = document.createElement('li');
      Object.assign(li.style, { display: 'flex', alignItems: 'center', marginBottom: '5px' });

      const optionInput = document.createElement('input');
      optionInput.type = 'text';
      optionInput.value = option;
      Object.assign(optionInput.style, inputStyle, { marginRight: '10px' });

      optionInput.addEventListener('change', () => {
        currentOptions[index] = optionInput.value.trim();
        renderOptions();
        updateSchemas();
      });

      const removeButton = document.createElement('button');
      removeButton.type = 'button';
      removeButton.textContent = 'x';
      Object.assign(removeButton.style, buttonStyle, { padding: '4px 8px' });

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
          if (onChange) onChange({ key: 'content', value: e.target.value });
        }
      });

      // Ensure schema.options is an array before mapping
      const options = Array.isArray(schema.options) ? schema.options : [];
      selectElement.innerHTML = options
        .map(
          (option) =>
            `<option value="${option}" ${option === value ? 'selected' : ''}>${option}</option>`,
        )
        .join('');
      rootElement.appendChild(selectElement);
    }
  },
  pdf: text.pdf,
  propPanel: {
    ...text.propPanel,
    inspector: createSchemaInspectorConfig('textual', {
      propertyMap: {
        optionsContainer: 'data',
      },
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
        ...parentSchema,
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
      content: 'option1',
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
