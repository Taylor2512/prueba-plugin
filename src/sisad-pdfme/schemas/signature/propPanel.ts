import type { PropPanel, PropPanelSchema } from '@sisad-pdfme/common';
import type { SignatureSchema } from './types.js';
import { DEFAULT_OPACITY, HEX_COLOR_PATTERN } from '../constants.js';
import { createSchemaInspectorConfig } from '../schemaFamilies.js';

const buildColorField = (title: string): PropPanelSchema => ({
  title,
  type: 'string',
  widget: 'color',
  props: {
    disabledAlpha: true,
  },
  rules: [{ pattern: HEX_COLOR_PATTERN, message: 'Usa un color hexadecimal valido.' }],
});

export const propPanel: PropPanel<SignatureSchema> = {
  schema: {
    placeholderText: {
      title: 'Texto de ayuda',
      type: 'string',
      span: 24,
    },
    strokeColor: {
      ...buildColorField('Color del trazo'),
      span: 8,
    },
    borderColor: {
      ...buildColorField('Color del borde'),
      span: 8,
    },
    backgroundColor: {
      ...buildColorField('Color de fondo'),
      span: 8,
    },
  },
  inspector: createSchemaInspectorConfig('signature', {
    propertyMap: {
      placeholderText: 'data',
      strokeColor: 'style',
      borderColor: 'style',
      backgroundColor: 'style',
    },
  }),
  defaultSchema: {
    name: '',
    type: 'signature',
    content: '',
    position: { x: 0, y: 0 },
    width: 46,
    height: 18,
    rotate: 0,
    opacity: DEFAULT_OPACITY,
    placeholderText: 'Firmar aqui',
    strokeColor: '#8A5A00',
    borderColor: '#D6B46B',
    backgroundColor: '#FFF9ED',
  },
};