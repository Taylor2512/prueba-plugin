/**
 * textLikeSchemaFactory — typed factory for recipient prefill preset schemas.
 * All presets share text.ui + text.pdf rendering.
 * Normalizes SVGElement | string returned by renderLucideIcon to plain string
 * to satisfy Plugin<Schema>.icon: string.
 */
import {
  cloneDeep,
  type Plugin,
  type PropPanelSchema,
  type Schema,
} from '@sisad-pdfme/common';
import text from '../text/index.js';
import { createSchemaPlugin } from '../schemaBuilder.js';
import { createSchemaInspectorConfig } from '../schemaFamilies.js';
import {
  basicsFields,
  helpFields,
  dataLabelFields,
  COMMON_PROPERTY_MAP,
} from '../propPanel/commonInspectorFields.js';

export type TextLikePresetConfig = {
  type: string;
  label: string;
  sourceField: string;
  /** renderLucideIcon returns string | SVGElement; factory serializes SVGElement to string. */
  icon: string | SVGElement;
  category: string;
  tags: string[];
  defaultContent?: string;
};

/**
 * Creates a text-like preset Plugin<Schema>.
 * All instances share text.ui + text.pdf + a prefillSource propPanel field.
 */
export function createTextLikeSchemaPlugin(config: TextLikePresetConfig): Plugin<Schema> {
  const { type, label, sourceField, icon, category, tags } = config;
  const normalizedIcon: string =
    typeof icon === 'string' ? icon : (icon as SVGElement).outerHTML;

  return createSchemaPlugin<Schema>(
    {
      ui: text.ui,
      pdf: text.pdf,
      propPanel: {
        schema: (): Record<string, PropPanelSchema> => ({
          ...basicsFields(),
          prefillSource: {
            title: 'Fuente de datos',
            type: 'string',
            widget: 'input',
            span: 24,
            props: { placeholder: sourceField, disabled: true },
            description: `Se llena automáticamente desde ${sourceField} del destinatario.`,
          },
          ...helpFields(),
          ...dataLabelFields(),
        }),
        inspector: createSchemaInspectorConfig('textual', {
          propertyMap: { ...COMMON_PROPERTY_MAP, prefillSource: 'connections' },
          includeConnections: true,
        }),
        defaultSchema: {
          ...(cloneDeep(text.propPanel.defaultSchema) as Record<string, unknown>),
          name: '',
          type,
          content: config.defaultContent ?? '',
          readOnly: false,
          prefillSource: sourceField,
        } as unknown as Schema,
      },
      icon: normalizedIcon,
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
}