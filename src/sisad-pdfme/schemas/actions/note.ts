/**
 * note schema — read-only informative text field displayed to the recipient.
 * Cannot be edited by the recipient. Used for instructions, disclaimers, notices.
 */
import type { Plugin } from '@sisad-pdfme/common';
import { StickyNote } from 'lucide-react';
import { renderLucideIcon, createSchemaPlugin } from '../schemaBuilder.js';
import { createSchemaInspectorConfig } from '../schemaFamilies.js';
import { helpFields, dataLabelFields, COMMON_PROPERTY_MAP } from '../propPanel/commonInspectorFields.js';
import type { PropPanelSchema } from '@sisad-pdfme/common';

const notePlugin: Plugin<any> = createSchemaPlugin<any>(
  {
    ui: async ({ schema, rootElement }) => {
      const s = schema as any;
      const bg = s.noteBackground || '#fefce8';
      const border = s.noteBorderColor || '#fde047';
      const textColor = s.noteTextColor || '#713f12';

      const container = document.createElement('div');
      Object.assign(container.style, {
        width: '100%',
        height: '100%',
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: '4px',
        padding: '4px 8px',
        boxSizing: 'border-box',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'flex-start',
      });
      const text = document.createElement('span');
      Object.assign(text.style, {
        color: textColor,
        fontSize: `${s.fontSize || 10}px`,
        lineHeight: '1.4',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
      });
      text.textContent = s.content || 'Nota informativa';
      container.appendChild(text);
      rootElement.appendChild(container);
    },
    pdf: async ({ schema, pdfDoc, pdfLib, page }) => {
      const s = schema as any;
      const { position, width, height } = s;
      const { x, y } = position;
      const pageHeight = page.getHeight();
      page.drawRectangle({
        x,
        y: pageHeight - y - height,
        width,
        height,
        borderColor: pdfLib.rgb(0.992, 0.878, 0.278),
        borderWidth: 1,
        color: pdfLib.rgb(0.996, 0.988, 0.910),
      });
    },
    propPanel: {
      schema: ({ i18n }): Record<string, PropPanelSchema> => ({
        content: {
          title: 'Texto de la nota',
          type: 'string',
          widget: 'textarea',
          span: 24,
          props: { autoSize: { minRows: 2, maxRows: 6 }, maxLength: 4000 },
        },
        visibleToRecipients: {
          title: 'Visible para destinatarios',
          type: 'boolean',
          widget: 'switch',
          span: 12,
        },
        noteBackground: {
          title: 'Fondo',
          type: 'string',
          widget: 'colorPicker',
          span: 8,
        },
        noteBorderColor: {
          title: 'Borde',
          type: 'string',
          widget: 'colorPicker',
          span: 8,
        },
        noteTextColor: {
          title: 'Texto',
          type: 'string',
          widget: 'colorPicker',
          span: 8,
        },
        fontSize: {
          title: 'Tamaño',
          type: 'number',
          widget: 'inputNumber',
          span: 8,
          props: { min: 6, max: 24, precision: 0 },
        },
        ...helpFields(),
        ...dataLabelFields(),
      }),
      inspector: createSchemaInspectorConfig('textual', {
        propertyMap: {
          ...COMMON_PROPERTY_MAP,
          content: 'data',
          visibleToRecipients: 'data',
          noteBackground: 'style',
          noteBorderColor: 'style',
          noteTextColor: 'style',
          fontSize: 'style',
        },
        includeConnections: true,
      }),
      defaultSchema: {
        name: '',
        type: 'note',
        content: '',
        position: { x: 0, y: 0 },
        width: 80,
        height: 15,
        readOnly: true,
        visibleToRecipients: true,
        noteBackground: '#fefce8',
        noteBorderColor: '#fde047',
        noteTextColor: '#713f12',
        fontSize: 10,
      },
    },
    icon: renderLucideIcon(StickyNote, { stroke: '#ca8a04' }),
  },
  {
    key: 'note',
    type: 'note',
    label: 'Nota',
    category: 'Acción',
    tags: ['note', 'informative', 'text', 'readonly'],
    capabilities: ['designer', 'form', 'viewer'],
  },
);

export default notePlugin;
