/**
 * text-like presets: fullName, emailAddress, company, title.
 * Thin wrappers around the text schema with a fixed source hint and defaults.
 * Not independent plugins — they share text rendering and propPanel.
 */
import { cloneDeep } from '@sisad-pdfme/common';
import type { Plugin } from '@sisad-pdfme/common';
import { User, Mail, Building2, Briefcase } from 'lucide-react';
import text from '../text/index.js';
import { createSchemaPlugin, renderLucideIcon } from '../schemaBuilder.js';
import { createSchemaInspectorConfig } from '../schemaFamilies.js';
import {
  basicsFields,
  helpFields,
  dataLabelFields,
  COMMON_PROPERTY_MAP,
} from '../propPanel/commonInspectorFields.js';
import type { PropPanelSchema } from '@sisad-pdfme/common';

const createTextLikePreset = (
  type: string,
  label: string,
  sourceField: string,
  icon: SVGElement | string,
  category: string,
  tags: string[],
): Plugin<any> =>
  createSchemaPlugin<any>(
    {
      ui: text.ui,
      pdf: text.pdf,
      propPanel: {
        schema: ({ i18n }): Record<string, PropPanelSchema> => ({
          ...basicsFields(),
          prefillSource: {
            title: 'Fuente de datos',
            type: 'string',
            widget: 'input',
            span: 24,
            props: {
              placeholder: sourceField,
              disabled: true,
            },
            description: `Se llena automáticamente desde ${sourceField} del destinatario.`,
          },
          ...helpFields(),
          ...dataLabelFields(),
        }),
        inspector: createSchemaInspectorConfig('textual', {
          propertyMap: {
            ...COMMON_PROPERTY_MAP,
            prefillSource: 'connections',
          },
          includeConnections: true,
        }),
        defaultSchema: {
          ...(cloneDeep((text.propPanel as any).defaultSchema) as Record<string, unknown>),
          name: '',
          type,
          content: '',
          readOnly: false,
          prefillSource: sourceField,
        },
      },
      icon,
    },
    {
      key: type,
      type,
      label,
      category,
      tags,
      capabilities: ['designer', 'form', 'viewer', 'content', 'prefill'],
    },
  );

export const fullName = createTextLikePreset(
  'fullName',
  'Nombre completo',
  'recipient.name',
  renderLucideIcon(User, { stroke: '#374151' }),
  'Destinatario',
  ['name', 'full name', 'recipient', 'text'],
);

export const emailAddress = createTextLikePreset(
  'emailAddress',
  'Correo electrónico',
  'recipient.email',
  renderLucideIcon(Mail, { stroke: '#374151' }),
  'Destinatario',
  ['email', 'recipient', 'text'],
);

export const company = createTextLikePreset(
  'company',
  'Empresa',
  'recipient.company',
  renderLucideIcon(Building2, { stroke: '#374151' }),
  'Destinatario',
  ['company', 'organization', 'recipient', 'text'],
);

export const title = createTextLikePreset(
  'title',
  'Cargo',
  'recipient.title',
  renderLucideIcon(Briefcase, { stroke: '#374151' }),
  'Destinatario',
  ['title', 'job title', 'position', 'recipient', 'text'],
);
