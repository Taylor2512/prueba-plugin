/**
 * attachment schema — allows recipients to attach files to a document field.
 * No backend coupling. The host application is responsible for file upload handling.
 */
import type { Plugin, Schema } from '@sisad-pdfme/common';
import { Paperclip } from 'lucide-react';
import { renderLucideIcon, createSchemaPlugin } from '../schemaBuilder.js';
import { createSchemaInspectorConfig } from '../schemaFamilies.js';
import {
  basicsFields,
  helpFields,
  dataLabelFields,
  COMMON_PROPERTY_MAP,
} from '../propPanel/commonInspectorFields.js';
import { createAttachmentContainerEl } from './actionSchemaFactory.js';
import type { AttachmentSchema } from './actionSchemaFactory.js';
import { clearSchemaRoot, setSchemaRootAttributes } from '../shared/schemaDom.js';
import type { PropPanelSchema } from '@sisad-pdfme/common';

const MIME_TYPE_OPTIONS = [
  { label: 'Cualquier archivo', value: '*' },
  { label: 'Imágenes', value: 'image/*' },
  { label: 'PDF', value: 'application/pdf' },
  { label: 'Word', value: 'application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
  { label: 'Excel', value: 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
];

const attachmentPlugin: Plugin<Schema> = createSchemaPlugin<Schema>(
  {
    ui: async ({ schema, rootElement }) => {
      const s = schema as AttachmentSchema;
      clearSchemaRoot(rootElement);
      setSchemaRootAttributes(rootElement, s);
      const container = createAttachmentContainerEl(s);
      rootElement.appendChild(container);
    },
    pdf: async ({ value, pdfDoc, pdfLib, page, schema }) => {
      const s = schema as AttachmentSchema & { position: { x: number; y: number } };
      const { position, width, height } = s;
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
