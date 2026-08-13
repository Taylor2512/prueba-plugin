/**
 * textLikeSchemaFactory — typed factory for recipient prefill preset schemas.
 * All presets share text.ui + text.pdf rendering.
 * Normalizes SVGElement | string returned by renderLucideIcon to plain string
 * to satisfy Plugin<Schema>.icon: string.
 */
import {
  DEFAULT_FONT_NAME,
  cloneDeep,
  getFallbackFontName,
  type Plugin,
  type PropPanel,
  type Schema,
} from '@sisad-pdfme/common';
import text from '../text/index.js';
import { createSchemaPlugin } from '../schemaBuilder.js';
import { createSchemaInspectorConfig } from '../schemaFamilies.js';
import { HEX_COLOR_PATTERN } from '../constants.js';
import {
  basicsFields,
  helpFields,
  dataLabelFields,
  hexColorFields,
  typographyFields,
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
        /*
         * Mismo bloque tipográfico que `text`: estos presets renderizan con
         * `text.ui`/`text.pdf`, así que su schema ya transporta `fontName`,
         * `fontSize`, `characterSpacing` y colores. Sin declararlos aquí el
         * inspector no ofrecía dónde tocarlos y quedaban fijos en su valor por
         * defecto.
         *
         * Queda fuera el tamaño dinámico de fuente: depende del widget
         * `UseDynamicFontSize` que registra `text`, y un campo autorrellenado
         * de solo lectura no gana nada con reajustarse al contenido.
         */
        schema: (({ options, i18n }) => {
          const font = options.font || { [DEFAULT_FONT_NAME]: { data: '', fallback: true } };

          return {
            ...basicsFields(),
            ...typographyFields({
              i18n,
              fallbackFontName: getFallbackFontName(font),
              fontNames: Object.keys(font),
            }),
            lineHeight: {
              title: i18n('schemas.text.lineHeight'),
              type: 'number',
              widget: 'inputNumber',
              props: { step: 0.1, min: 0 },
              span: 8,
            },
            ...hexColorFields(
              {
                fontColor: i18n('schemas.textColor'),
                backgroundColor: i18n('schemas.bgColor'),
              },
              { pattern: HEX_COLOR_PATTERN, message: i18n('validation.hexColor') },
            ),
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
          };
        }) as PropPanel<Schema>['schema'],
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