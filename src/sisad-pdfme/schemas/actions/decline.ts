/**
 * decline schema — action button that the recipient clicks to decline a document.
 * Fires a 'decline' action event via the host callback. No business logic inside.
 */
import type { Plugin } from '@sisad-pdfme/common';
import { XCircle } from 'lucide-react';
import { renderLucideIcon, createSchemaPlugin } from '../schemaBuilder.js';
import { createSchemaInspectorConfig } from '../schemaFamilies.js';
import { helpFields, dataLabelFields, COMMON_PROPERTY_MAP } from '../propPanel/commonInspectorFields.js';
import type { PropPanelSchema } from '@sisad-pdfme/common';

const declinePlugin: Plugin<any> = createSchemaPlugin<any>(
  {
    ui: async ({ schema, rootElement, mode }) => {
      const s = schema as any;
      const label = s.label || 'Rechazar';
      const bg = s.buttonColor || '#dc2626';
      const textColor = s.buttonTextColor || '#ffffff';

      const button = document.createElement('button');
      button.type = 'button';
      Object.assign(button.style, {
        width: '100%',
        height: '100%',
        background: bg,
        color: textColor,
        border: 'none',
        borderRadius: '6px',
        fontWeight: '600',
        fontSize: `${s.fontSize || 11}px`,
        cursor: mode === 'form' ? 'pointer' : 'default',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
      });

      const svg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
      button.innerHTML = `${svg}${label}`;

      rootElement.appendChild(button);
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
        borderColor: pdfLib.rgb(0.863, 0.149, 0.149),
        borderWidth: 1,
        color: pdfLib.rgb(0.863, 0.149, 0.149),
        borderOpacity: 0,
        opacity: 0.15,
      });
    },
    propPanel: {
      schema: ({ i18n }): Record<string, PropPanelSchema> => ({
        label: {
          title: 'Etiqueta del botón',
          type: 'string',
          widget: 'input',
          span: 24,
          props: { placeholder: 'Rechazar' },
        },
        requiresReason: {
          title: 'Requiere motivo',
          type: 'boolean',
          widget: 'switch',
          span: 12,
        },
        confirmationMessage: {
          title: 'Mensaje de confirmación',
          type: 'string',
          widget: 'textarea',
          span: 24,
          props: { placeholder: '¿Confirma el rechazo?', autoSize: { minRows: 2, maxRows: 3 } },
        },
        buttonColor: {
          title: 'Color botón',
          type: 'string',
          widget: 'colorPicker',
          span: 8,
        },
        buttonTextColor: {
          title: 'Color texto',
          type: 'string',
          widget: 'colorPicker',
          span: 8,
        },
        fontSize: {
          title: 'Tamaño',
          type: 'number',
          widget: 'inputNumber',
          span: 8,
          props: { min: 8, max: 20, precision: 0 },
        },
        ...helpFields(),
        ...dataLabelFields(),
      }),
      inspector: createSchemaInspectorConfig('textual', {
        propertyMap: {
          ...COMMON_PROPERTY_MAP,
          label: 'data',
          requiresReason: 'data',
          confirmationMessage: 'data',
          buttonColor: 'style',
          buttonTextColor: 'style',
          fontSize: 'style',
        },
        includeConnections: true,
      }),
      defaultSchema: {
        name: '',
        type: 'decline',
        content: '',
        position: { x: 0, y: 0 },
        width: 40,
        height: 12,
        action: 'decline',
        label: 'Rechazar',
        requiresReason: false,
        confirmationMessage: '',
        buttonColor: '#dc2626',
        buttonTextColor: '#ffffff',
        fontSize: 11,
      },
    },
    icon: renderLucideIcon(XCircle, { stroke: '#dc2626' }),
  },
  {
    key: 'decline',
    type: 'decline',
    label: 'Rechazar',
    category: 'Acción',
    tags: ['decline', 'reject', 'action', 'button'],
    capabilities: ['designer', 'form', 'viewer'],
  },
);

export default declinePlugin;
