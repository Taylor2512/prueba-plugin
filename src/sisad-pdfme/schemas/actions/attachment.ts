/**
 * attachment schema — allows recipients to attach files to a document field.
 * No backend coupling. The host application is responsible for file upload handling.
 */
import type { Plugin } from '@sisad-pdfme/common';
import { Paperclip } from 'lucide-react';
import { renderLucideIcon, createSchemaPlugin } from '../schemaBuilder.js';
import { createSchemaInspectorConfig } from '../schemaFamilies.js';
import {
  basicsFields,
  helpFields,
  dataLabelFields,
  COMMON_PROPERTY_MAP,
} from '../propPanel/commonInspectorFields.js';
import type { PropPanelSchema } from '@sisad-pdfme/common';

const MIME_TYPE_OPTIONS = [
  { label: 'Cualquier archivo', value: '*' },
  { label: 'Imágenes', value: 'image/*' },
  { label: 'PDF', value: 'application/pdf' },
  { label: 'Word', value: 'application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
  { label: 'Excel', value: 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
];

const attachmentPlugin: Plugin<any> = createSchemaPlugin<any>(
  {
    ui: async ({ rootElement }) => {
      const container = document.createElement('div');
      Object.assign(container.style, {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '2px dashed #d1d5db',
        borderRadius: '6px',
        background: '#f9fafb',
        cursor: 'pointer',
        boxSizing: 'border-box',
      });
      container.innerHTML = `<span style="color:#6b7280;font-size:12px;display:flex;align-items:center;gap:6px">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
        Adjuntar archivo
      </span>`;
      rootElement.appendChild(container);
    },
    pdf: async ({ value, pdfDoc, pdfLib, page, schema }) => {
      const { position, width, height } = schema as any;
      const { x, y } = position;
      const pageHeight = page.getHeight();
      page.drawRectangle({
        x,
        y: pageHeight - y - height,
        width,
        height,
        borderColor: pdfLib.rgb(0.816, 0.835, 0.859),
        borderWidth: 1,
        color: pdfLib.rgb(0.976, 0.980, 0.984),
      });
    },
    propPanel: {
      schema: ({ i18n }): Record<string, PropPanelSchema> => ({
        ...basicsFields(),
        allowedMimeTypes: {
          title: 'Tipos de archivo',
          type: 'string',
          widget: 'select',
          span: 24,
          props: { options: MIME_TYPE_OPTIONS },
        },
        maxFiles: {
          title: 'Máx. archivos',
          type: 'number',
          widget: 'inputNumber',
          span: 8,
          props: { min: 1, max: 20, precision: 0 },
        },
        maxSizeMb: {
          title: 'Máx. tamaño (MB)',
          type: 'number',
          widget: 'inputNumber',
          span: 8,
          props: { min: 1, max: 100, precision: 0 },
        },
        allowReplace: {
          title: 'Reemplazable',
          type: 'boolean',
          widget: 'switch',
          span: 8,
        },
        showFileName: {
          title: 'Mostrar nombre',
          type: 'boolean',
          widget: 'switch',
          span: 12,
        },
        showUploadStatus: {
          title: 'Mostrar estado',
          type: 'boolean',
          widget: 'switch',
          span: 12,
        },
        ...helpFields(),
        ...dataLabelFields(),
      }),
      inspector: createSchemaInspectorConfig('textual', {
        propertyMap: {
          ...COMMON_PROPERTY_MAP,
          allowedMimeTypes: 'data',
          maxFiles: 'data',
          maxSizeMb: 'data',
          allowReplace: 'data',
          showFileName: 'data',
          showUploadStatus: 'data',
        },
        includeConnections: true,
      }),
      defaultSchema: {
        name: '',
        type: 'attachment',
        content: '',
        position: { x: 0, y: 0 },
        width: 60,
        height: 20,
        readOnly: false,
        required: false,
        allowedMimeTypes: '*',
        maxFiles: 1,
        maxSizeMb: 10,
        allowReplace: true,
        showFileName: true,
        showUploadStatus: true,
      },
    },
    icon: renderLucideIcon(Paperclip, { stroke: '#374151' }),
  },
  {
    key: 'attachment',
    type: 'attachment',
    label: 'Adjunto',
    category: 'Acción',
    tags: ['attachment', 'file', 'upload'],
    capabilities: ['designer', 'form', 'viewer'],
  },
);

export default attachmentPlugin;
