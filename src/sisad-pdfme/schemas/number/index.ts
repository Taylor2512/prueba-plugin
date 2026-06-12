import type { Plugin } from '@sisad-pdfme/common';
import text from '../text/index.js';
import { createSchemaPlugin } from '../schemaBuilder.js';
import { createSchemaInspectorConfig } from '../schemaFamilies.js';
import {
  basicsFields,
  helpFields,
  dataLabelFields,
  numberFormatFields,
  validationMinField,
  validationMaxField,
  validationMessageField,
  COMMON_PROPERTY_MAP,
} from '../propPanel/commonInspectorFields.js';

const schema: Plugin<any> = createSchemaPlugin<any>(
  {
    ui: text.ui,
    pdf: text.pdf,
    propPanel: {
      schema: ({ i18n }) => ({
        // ── basics ──
        ...basicsFields(),
        // ── content ──
        placeholder: {
          title: 'Placeholder',
          type: 'string',
          widget: 'input',
          span: 12,
        },
        // ── number format ──
        ...numberFormatFields(),
        decimals: {
          title: 'Decimales',
          type: 'number',
          widget: 'inputNumber',
          span: 6,
          props: { min: 0, precision: 0 },
        },
        // ── validation ──
        validationMin: { ...validationMinField(), title: i18n('schemas.text.min') },
        validationMax: { ...validationMaxField(), title: i18n('schemas.text.max') },
        validationMessage: validationMessageField(),
        // ── help ──
        ...helpFields(),
        // ── dataLabel ──
        ...dataLabelFields(),
      }),
      inspector: createSchemaInspectorConfig('textual', {
        propertyMap: {
          ...COMMON_PROPERTY_MAP,
          decimals: 'data',
          validationMin: 'validation',
          validationMax: 'validation',
          validationMessage: 'validation',
        },
        includeValidation: true,
        includeConnections: true,
      }),
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
