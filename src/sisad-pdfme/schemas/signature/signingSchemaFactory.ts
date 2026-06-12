/**
 * signingSchemaFactory — factory for text-rendered signing fields.
 *
 * Covers: dateSigned and any future auto-populated date/signing text fields.
 * Does NOT cover signature/initials (image/SVG rendering via signaturePlugin).
 *
 * Constraints:
 * - No provider registry changes.
 * - No flujo de firma changes.
 * - readOnly: true is enforced (caller may override via defaultSchemaOverrides).
 */
import { cloneDeep } from '@sisad-pdfme/common';
import type { Plugin, Schema } from '@sisad-pdfme/common';
import text from '../text/index.js';
import { createSchemaPlugin } from '../schemaBuilder.js';
import { createSchemaInspectorConfig } from '../schemaFamilies.js';
import {
  helpFields,
  dataLabelFields,
  COMMON_PROPERTY_MAP,
} from '../propPanel/commonInspectorFields.js';
import type { PropPanelSchema } from '@sisad-pdfme/common';
import type { PropPanelInspectorSectionKey } from '../../common/types.js';

export type TextSigningSchemaConfig = {
  type: string;
  label: string;
  category?: string;
  tags: string[];
  /** renderLucideIcon returns string | SVGElement; factory serializes SVGElement. */
  icon: string | SVGElement;
  /** Schema-specific propPanel fields (date format, locale, etc). */
  propPanelFields: () => Record<string, PropPanelSchema>;
  /** Inspector property map for schema-specific fields. */
  propPanelPropertyMap: Partial<Record<string, PropPanelInspectorSectionKey>>;
  /** Merged over text.propPanel.defaultSchema. Always sets readOnly: true unless overridden. */
  defaultSchemaOverrides: Record<string, unknown>;
};

/**
 * Creates a text-rendered signing Plugin<Schema>.
 * Rendered with text.ui + text.pdf. Caller provides schema-specific propPanel.
 */
export function createTextSigningSchemaPlugin(
  config: TextSigningSchemaConfig,
): Plugin<Schema> {
  const {
    type,
    label,
    category = 'Firma',
    tags,
    icon,
    propPanelFields,
    propPanelPropertyMap,
    defaultSchemaOverrides,
  } = config;

  const normalizedIcon: string =
    typeof icon === 'string' ? icon : (icon as SVGElement).outerHTML;

  return createSchemaPlugin<Schema>(
    {
      ui: text.ui,
      pdf: text.pdf,
      propPanel: {
        schema: (): Record<string, PropPanelSchema> => ({
          ...propPanelFields(),
          ...helpFields(),
          ...dataLabelFields(),
        }),
        inspector: createSchemaInspectorConfig('textual', {
          propertyMap: {
            ...COMMON_PROPERTY_MAP,
            ...propPanelPropertyMap,
          },
        }),
        defaultSchema: {
          ...(cloneDeep(text.propPanel.defaultSchema) as Record<string, unknown>),
          name: '',
          type,
          content: '',
          readOnly: true,
          ...defaultSchemaOverrides,
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
      capabilities: ['designer', 'form', 'viewer', 'content'],
    },
  );
}
