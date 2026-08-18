/**
 * note schema — read-only informative text field displayed to the recipient.
 * Cannot be edited by the recipient. Used for instructions, disclaimers, notices.
 */
import type { Plugin, Schema } from '@sisad-pdfme/common';
import { StickyNote } from 'lucide-react';
import { renderLucideIcon, createSchemaPlugin } from '@sisad-pdfme/schemas/schemaBuilder';
import { createSchemaInspectorConfig } from '@sisad-pdfme/schemas/schemaFamilies';
import { helpFields, dataLabelFields, COMMON_PROPERTY_MAP } from '@sisad-pdfme/schemas/propPanel/commonInspectorFields';
import { createNoteContainerEl, drawActionFieldChrome } from '@sisad-pdfme/schemas/actions/actionSchemaFactory';
import type { NoteSchema } from '@sisad-pdfme/schemas/actions/actionSchemaFactory';
import { clearSchemaRoot, setSchemaRootAttributes } from '@sisad-pdfme/schemas/shared/schemaDom';
import type { PropPanelSchema } from '@sisad-pdfme/common';
import { getCanonicalDefault } from '@sisad-pdfme/schemas/runtime-normalizer';

const notePlugin: Plugin<Schema> = createSchemaPlugin<Schema>(
  {
    ui: async ({ schema, rootElement }) => {
      const s = schema as NoteSchema;
      clearSchemaRoot(rootElement);
      setSchemaRootAttributes(rootElement, s);
      const { container } = createNoteContainerEl(s);
      rootElement.appendChild(container);
    },
    pdf: async ({ schema, pdfLib, page }) => {
      const s = schema as NoteSchema & { position: { x: number; y: number } };
      drawActionFieldChrome({
        schema: s,
        page,
        rgb: pdfLib.rgb,
        borderColor: [0.992, 0.878, 0.278],
        backgroundColor: [0.996, 0.988, 0.910],
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
      defaultSchema: ((): Schema => {
        const canonical = getCanonicalDefault(undefined, 'note') as Partial<Schema> | null;
        return {
          ...(canonical || {}),
          name: '',
          type: 'note',
          content: '',
          position: { x: 0, y: 0 },
          width: 80,
          height: 15,
          readOnly: true,
          visibleToRecipients: true,
          // Sin paleta ámbar materializada: el contenedor la deriva del dueño.
          fontSize: 10,
        } as Schema;
      })(),
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
