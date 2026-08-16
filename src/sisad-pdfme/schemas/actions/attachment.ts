/**
 * attachment schema — allows recipients to attach files to a document field.
 * No backend coupling. The host application is responsible for file upload handling.
 */
import type { Plugin, Schema } from '@sisad-pdfme/common';
import { Paperclip } from 'lucide-react';
import { renderLucideIcon, createSchemaPlugin } from '@sisad-pdfme/schemas/schemaBuilder';
import { createSchemaInspectorConfig } from '@sisad-pdfme/schemas/schemaFamilies';
import {
  basicsFields,
  helpFields,
  dataLabelFields,
  COMMON_PROPERTY_MAP,
} from '@sisad-pdfme/schemas/propPanel/commonInspectorFields';
import { createAttachmentContainerEl, drawActionFieldChrome } from '@sisad-pdfme/schemas/actions/actionSchemaFactory';
import type { AttachmentSchema } from '@sisad-pdfme/schemas/actions/actionSchemaFactory';
import { clearSchemaRoot, setSchemaRootAttributes } from '@sisad-pdfme/schemas/shared/schemaDom';
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
    ui: async ({ schema, rootElement, mode, value, onChange }) => {
      const s = schema as AttachmentSchema & {
        readOnly?: boolean;
        allowedMimeTypes?: string;
        maxSizeMb?: number;
        maxFiles?: number;
        allowReplace?: boolean;
        showFileName?: boolean;
        showUploadStatus?: boolean;
      };
      clearSchemaRoot(rootElement);
      setSchemaRootAttributes(rootElement, s);
      const container = createAttachmentContainerEl(s);
      rootElement.appendChild(container);

      const fileName = typeof value === 'string' ? value.trim() : '';
      const labelEl = container.querySelector('.sisad-pdfme-attachment-label');
      const setLabel = (text: string) => {
        if (labelEl?.lastChild) labelEl.lastChild.textContent = ` ${text}`;
      };
      // Reflect current state: filename (if showFileName) or generic "attached".
      if (fileName) setLabel(s.showFileName === false ? 'Archivo adjunto' : fileName);

      // Picker only in form, for the owner's editable field. Designer/viewer show
      // the card as a placeholder/state — never a native file dialog.
      const editable = mode === 'form' && !s.readOnly;
      // Already attached + replacement disabled → lock to current state.
      if (!editable || (fileName && s.allowReplace === false)) return;

      const maxFiles = Number(s.maxFiles) > 0 ? Math.floor(Number(s.maxFiles)) : 1;
      const input = document.createElement('input');
      input.type = 'file';
      input.style.display = 'none';
      if (maxFiles > 1) input.multiple = true;
      const mimes = String(s.allowedMimeTypes || '*');
      if (mimes && mimes !== '*') input.accept = mimes;

      const maxBytes = Number(s.maxSizeMb) > 0 ? Number(s.maxSizeMb) * 1024 * 1024 : 0;
      const mimeAllowed = (file: File): boolean => {
        if (!mimes || mimes === '*') return true;
        return mimes.split(',').map((m) => m.trim()).some((pattern) => {
          if (!pattern) return false;
          if (pattern.endsWith('/*')) return file.type.startsWith(pattern.slice(0, -1));
          return file.type === pattern;
        });
      };

      const fail = (msg: string) => {
        if (s.showUploadStatus !== false) setLabel(msg);
        input.value = '';
      };

      input.addEventListener('change', () => {
        const files = Array.from(input.files || []);
        if (!files.length) return;
        if (files.length > maxFiles) return fail(`Máx. ${maxFiles} archivo${maxFiles > 1 ? 's' : ''}`);
        const badMime = files.find((f) => !mimeAllowed(f));
        if (badMime) return fail('Tipo no permitido');
        const tooBig = maxBytes ? files.find((f) => f.size > maxBytes) : undefined;
        if (tooBig) return fail(`Máx. ${s.maxSizeMb} MB`);

        const names = files.map((f) => f.name);
        if (onChange) onChange([{ key: 'content', value: names.join(', ') }]);
        const display =
          s.showFileName === false
            ? `${names.length} archivo${names.length > 1 ? 's' : ''}`
            : names.length > 1
              ? `${names.length} archivos`
              : names[0];
        setLabel(display);
      });

      container.style.cursor = 'pointer';
      container.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        input.click();
      });
      rootElement.appendChild(input);
    },
    pdf: async ({ pdfLib, page, schema }) => {
      const s = schema as AttachmentSchema & { position: { x: number; y: number } };
      drawActionFieldChrome({
        schema: s,
        page,
        rgb: pdfLib.rgb,
        borderColor: [0.816, 0.835, 0.859],
        backgroundColor: [0.976, 0.980, 0.984],
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
          allowedMimeTypes: 'validation',
          maxFiles: 'validation',
          maxSizeMb: 'validation',
          allowReplace: 'validation',
          showFileName: 'validation',
          showUploadStatus: 'validation',
        },
        includeConnections: true,
      }),
      defaultSchema: ((): Schema => {
        try {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const { normalizePluginDefaultSchema } = require('@sisad-pdfme/schemas/normalizers');
          const canonical = normalizePluginDefaultSchema(undefined as any, 'attachment') as Partial<Schema>;
          return {
            ...(canonical as Schema),
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
          } as Schema;
        } catch (e) {
          return {
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
          } as Schema;
        }
      })(),
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
