import { Plugin, Schema } from '@sisad-pdfme/common';
import svg from '../graphics/svg.js';
import { isEditable } from '../utils.js';
import { HEX_COLOR_PATTERN } from '../constants.js';
import { Square, SquareCheck } from 'lucide-react';
import { createLucideIcon, createSchemaPlugin } from '../schemaBuilder.js';

const defaultStroke = 'currentColor';

const getCheckedIcon = (stroke = defaultStroke) => createLucideIcon(SquareCheck, { stroke });
const getUncheckedIcon = (stroke = defaultStroke) => createLucideIcon(Square, { stroke });

interface Checkbox extends Schema {
  color: string;
}

const getIcon = ({ value, color }: { value: string; color: string }) =>
  value === 'true' ? getCheckedIcon(color) : getUncheckedIcon(color);

const schema: Plugin<Checkbox> = createSchemaPlugin<Checkbox>({
  ui: (arg) => {
    const { schema, value, onChange, rootElement, mode } = arg;
    const container = document.createElement('div');
    container.style.width = '100%';
    container.style.height = '100%';

    if (isEditable(mode, schema)) {
      container.addEventListener('click', () => {
        if (onChange) onChange({ key: 'content', value: value === 'true' ? 'false' : 'true' });
      });
    }

    void svg.ui({
      ...arg,
      rootElement: container,
      mode: 'viewer',
      value: getIcon({ value, color: schema.color }),
    });

    rootElement.appendChild(container);
  },
  pdf: (arg) =>
    svg.pdf(Object.assign(arg, { value: getIcon({ value: arg.value, color: arg.schema.color }) })),
  propPanel: {
    schema: ({ i18n }) => ({
      color: {
        title: i18n('schemas.color'),
        type: 'string',
        widget: 'color',
        props: {
          disabledAlpha: true,
        },
        required: true,
        rules: [{ pattern: HEX_COLOR_PATTERN, message: i18n('validation.hexColor') }],
      },
    }),
    defaultSchema: {
      name: '',
      type: 'checkbox',
      content: 'false',
      position: { x: 0, y: 0 },
      width: 8,
      height: 8,
      color: '#000000',
    },
  },
  icon: getCheckedIcon(),
}, {
  key: 'checkbox',
  type: 'checkbox',
  label: 'Casilla de verificación',
  category: 'Opciones',
  tags: ['checkbox', 'boolean', 'selection'],
  capabilities: ['designer', 'form', 'viewer', 'selection', 'content'],
});

export default schema;
