import type { Plugin } from '@sisad-pdfme/common';
import text from '../text/index.js';
import { createSchemaPlugin } from '../schemaBuilder.js';
import { createSchemaInspectorConfig } from '../schemaFamilies.js';

const schema: Plugin<any> = createSchemaPlugin<any>(
  {
    ui: text.ui,
    pdf: text.pdf,
    propPanel: {
      schema: ({ i18n }) => ({
        placeholder: {
          title: 'Placeholder',
          type: 'string',
          widget: 'input',
          span: 12,
        },
        min: {
          title: i18n('schemas.text.min'),
          type: 'number',
          widget: 'inputNumber',
          span: 6,
        },
        max: {
          title: i18n('schemas.text.max'),
          type: 'number',
          widget: 'inputNumber',
          span: 6,
        },
        decimals: {
          title: 'Decimales',
          type: 'number',
          widget: 'inputNumber',
          span: 6,
          props: { min: 0, precision: 0 },
        },
        format: {
          title: 'Formato',
          type: 'string',
          widget: 'select',
          span: 12,
          props: {
            options: [
              { label: 'Libre', value: 'free' },
              { label: 'Moneda', value: 'currency' },
              { label: 'Porcentaje', value: 'percent' },
              { label: 'Entero', value: 'integer' },
            ],
          },
        },
        validationMessage: {
          title: 'Mensaje de validación',
          type: 'string',
          widget: 'input',
          span: 24,
        },
      }),
      inspector: createSchemaInspectorConfig('textual'),
      defaultSchema: {
        name: '',
        type: 'number',
        content: '',
        position: { x: 0, y: 0 },
        width: 45,
        height: 7,
        readOnly: false,
        required: false,
        decimals: 0,
        format: 'free',
        validationMessage: '',
        placeholder: '',
      },
    },
  },
  {
    key: 'number',
    type: 'number',
    label: 'Número',
    category: 'Texto',
    tags: ['number', 'numeric', 'input'],
    capabilities: ['designer', 'form', 'viewer', 'content', 'prefill'],
  },
);

export default schema;
