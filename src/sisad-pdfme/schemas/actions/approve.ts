/**
 * approve schema — action button that the recipient clicks to approve a document.
 * Fires an 'approve' action event via the host callback. No business logic inside.
 * The host app handles confirmation, audit trail, and routing.
 */
import type { Plugin } from '@sisad-pdfme/common';
import { CheckCircle } from 'lucide-react';
import { renderLucideIcon, createSchemaPlugin } from '../schemaBuilder.js';
import { createSchemaInspectorConfig } from '../schemaFamilies.js';
import { helpFields, dataLabelFields, COMMON_PROPERTY_MAP } from '../propPanel/commonInspectorFields.js';
import type { PropPanelSchema } from '@sisad-pdfme/common';

const approvePlugin: Plugin<any> = createSchemaPlugin<any>(
  {
    ui: async ({ schema, rootElement, mode }) => {
      const s = schema as any;
      const label = s.label || 'Aprobar';
      const bg = s.buttonColor || '#16a34a';
      const textColor = s.buttonTextColor || '#ffffff';

      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = label;
      Object.assign(button.style, {
        width: '100%',
        height: '100%',
        background: mode === 'designer' ? bg : bg,
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

      const svg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`;
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
        borderColor: pdfLib.rgb(0.086, 0.639, 0.290),
        borderWidth: 1,
        color: pdfLib.rgb(0.086, 0.639, 0.290),
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
          props: { placeholder: 'Aprobar' },
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
          props: { placeholder: '¿Confirma la aprobación?', autoSize: { minRows: 2, maxRows: 3 } },
        },
        auditEventName: {
          title: 'Nombre de evento (auditoría)',
          type: 'string',
          widget: 'input',
          span: 24,
          props: { placeholder: 'document.approved' },
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
          auditEventName: 'connections',
          buttonColor: 'style',
          buttonTextColor: 'style',
          fontSize: 'style',
        },
        includeConnections: true,
      }),
      defaultSchema: {
        name: '',
        type: 'approve',
        content: '',
        position: { x: 0, y: 0 },
        width: 40,
        height: 12,
        action: 'approve',
        label: 'Aprobar',
        requiresReason: false,
        confirmationMessage: '',
        auditEventName: 'document.approved',
        buttonColor: '#16a34a',
        buttonTextColor: '#ffffff',
        fontSize: 11,
      },
    },
    icon: renderLucideIcon(CheckCircle, { stroke: '#16a34a' }),
  },
  {
    key: 'approve',
    type: 'approve',
    label: 'Aprobar',
    category: 'Acción',
    tags: ['approve', 'action', 'button'],
    capabilities: ['designer', 'form', 'viewer'],
  },
);

export default approvePlugin;
