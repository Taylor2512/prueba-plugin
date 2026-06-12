/**
 * dateSigned schema — automatically populated with the signing date.
 * readOnly: true. Cannot be edited by recipient.
 * Appearance: text-like rendering (date formatted string).
 * Auto-populates when a co-located signature field is signed.
 */
import type { Plugin } from '@sisad-pdfme/common';
import { CalendarCheck } from 'lucide-react';
import text from '../text/index.js';
import { createSchemaPlugin, renderLucideIcon } from '../schemaBuilder.js';
import { createSchemaInspectorConfig } from '../schemaFamilies.js';
import {
  helpFields,
  dataLabelFields,
  COMMON_PROPERTY_MAP,
} from '../propPanel/commonInspectorFields.js';
import type { PropPanelSchema } from '@sisad-pdfme/common';

const DATE_FORMAT_OPTIONS: Array<{ label: string; value: string }> = [
  { label: 'DD/MM/AAAA', value: 'dd/MM/yyyy' },
  { label: 'MM/DD/AAAA', value: 'MM/dd/yyyy' },
  { label: 'AAAA-MM-DD', value: 'yyyy-MM-dd' },
  { label: 'D de Mes de AAAA', value: "d 'de' MMMM 'de' yyyy" },
  { label: 'Mes D, AAAA', value: 'MMMM d, yyyy' },
];

const dateSignedPlugin: Plugin<any> = createSchemaPlugin<any>(
  {
    ui: text.ui,
    pdf: text.pdf,
    propPanel: {
      schema: ({ i18n }): Record<string, PropPanelSchema> => ({
        // readOnly is forced — not exposed as editable toggle
        dateFormat: {
          title: 'Formato de fecha',
          type: 'string',
          widget: 'select',
          span: 12,
          props: { options: DATE_FORMAT_OPTIONS },
        },
        dateLocale: {
          title: 'Idioma',
          type: 'string',
          widget: 'select',
          span: 12,
          props: {
            options: [
              { label: 'Español', value: 'es' },
              { label: 'English', value: 'en' },
              { label: 'Français', value: 'fr' },
              { label: 'Português', value: 'pt' },
            ],
          },
        },
        autoPopulateFrom: {
          title: 'Llenar desde',
          type: 'string',
          widget: 'input',
          span: 12,
          props: { placeholder: 'nombre del campo firma (vacío = automático)' },
        },
        ...helpFields(),
        ...dataLabelFields(),
      }),
      inspector: createSchemaInspectorConfig('textual', {
        propertyMap: {
          ...COMMON_PROPERTY_MAP,
          dateFormat: 'data',
          dateLocale: 'data',
          autoPopulateFrom: 'data',
        },
      }),
      defaultSchema: {
        name: '',
        type: 'dateSigned',
        content: '',
        position: { x: 0, y: 0 },
        width: 35,
        height: 7,
        readOnly: true,
        dateFormat: 'dd/MM/yyyy',
        dateLocale: 'es',
        autoPopulateFrom: '',
        fontSize: 10,
        fontColor: '#374151',
      },
    },
    icon: renderLucideIcon(CalendarCheck, { stroke: '#374151' }),
  },
  {
    key: 'dateSigned',
    type: 'dateSigned',
    label: 'Fecha de firma',
    category: 'Firma',
    tags: ['date', 'signature', 'signing', 'auto'],
    capabilities: ['designer', 'form', 'viewer', 'content'],
  },
);

export default dateSignedPlugin;
