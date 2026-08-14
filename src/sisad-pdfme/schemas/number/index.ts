import type { Plugin, Schema, UIRenderProps } from '@sisad-pdfme/common';
import { renderTextUi } from '../text/uiRender.js';
import type { TextSchema } from '../text/types.js';
import text from '../text/index.js';
import { createSchemaPlugin } from '../schemaBuilder.js';
import { createSchemaInspectorConfig } from '../schemaFamilies.js';
import { attachNumberInputGuard } from './inputGuard.js';
import {
  isAcceptableNumberInput,
  isNumericDraftPart,
  splitCurrency,
  withCanonicalNumber,
  type NumberBoundsPolicy,
  type NumberInputPolicy,
} from './inputPolicy.js';
import {
  basicsFields,
  helpFields,
  dataLabelFields,
  numberFormatFields,
  validationMinField,
  validationMaxField,
  validationMessageField,
  COMMON_PROPERTY_MAP,
} from '../propPanel/commonInspectorFields.js';

type NumberSchema = Schema & NumberBoundsPolicy;

/**
 * Tramo numérico de un draft, ya sin símbolo de moneda y con la coma decimal
 * unificada a punto para poder operar. `null` si el texto no puede ser un número.
 */
const toNumericPart = (value: unknown, schema: NumberInputPolicy): string | null => {
  const split = splitCurrency(String(value ?? '').trim(), schema);
  return split ? split.numeric.trim().replace(',', '.') : null;
};

/**
 * Keeps the input transport as string while providing a canonical number value on commit.
 *
 * Cuando el campo es de tipo moneda, el símbolo forma parte del valor canónico y
 * se conserva con la posición y el espaciado que escribió el usuario:
 * `"$ 12,50"` → `"$ 12.5"`.
 */
export const normalizeNumberDraft = (
  value: unknown,
  schema: NumberInputPolicy = {},
): string | null => {
  const raw = String(value ?? '').trim();
  const split = splitCurrency(raw, schema);
  if (!split) return null;
  const draft = split.numeric.trim().replace(',', '.');
  if (!draft || !isNumericDraftPart(draft, schema)) return null;
  const parsed = Number(draft);
  return Number.isFinite(parsed) ? withCanonicalNumber(raw, split, String(parsed)) : null;
};

export const isNumberDraft = (value: unknown, schema: NumberInputPolicy = {}): boolean =>
  isAcceptableNumberInput(String(value ?? '').trim(), schema);

export const isNumberWithinBounds = (value: unknown, schema: NumberBoundsPolicy): boolean => {
  const draft = toNumericPart(value, schema);
  if (draft === null) return false;
  const canonical = normalizeNumberDraft(draft, schema);
  if (canonical === null || canonical === '') return false;
  const decimals = Number(schema.decimals);
  const decimalPart = draft.split('.')[1] || '';
  if (Number.isFinite(decimals) && decimals >= 0 && decimalPart.length > decimals) return false;
  const parsed = Number(canonical);
  const min = Number(schema.validationMin);
  const max = Number(schema.validationMax);
  return (!Number.isFinite(min) || parsed >= min) && (!Number.isFinite(max) || parsed <= max);
};

const renderNumberUi = async (arg: UIRenderProps<NumberSchema>) => {
  let latestDraft = String(arg.value ?? '');
  const originalOnChange = arg.onChange;
  const originalStopEditing = arg.stopEditing;
  const textSchema = {
    ...arg.schema,
    type: 'text',
  } as TextSchema;

  await renderTextUi({
    ...arg,
    schema: textSchema,
    onChange: (changes) => {
      const list = Array.isArray(changes) ? changes : [changes];
      const contentChange = list.find((change) => change.key === 'content');
      if (contentChange) {
        latestDraft = String(contentChange.value ?? '');
        if (!isNumberDraft(latestDraft, arg.schema)) {
          arg.rootElement.dataset.numberValid = 'false';
          return;
        }
        arg.rootElement.dataset.numberValid = String(
          latestDraft.trim() === '' || isNumberWithinBounds(latestDraft, arg.schema),
        );
      }
      originalOnChange?.(changes);
    },
    stopEditing: () => {
      const canonical = normalizeNumberDraft(latestDraft, arg.schema);
      if (canonical !== null && isNumberWithinBounds(canonical, arg.schema)) {
        originalOnChange?.([{ key: 'content', value: canonical }]);
      } else if (latestDraft.trim() !== '') {
        originalOnChange?.([{ key: 'content', value: '' }]);
      }
      originalStopEditing?.();
    },
  } as UIRenderProps<TextSchema>);

  attachNumberInputGuard(arg.rootElement, arg.schema);
};

const schema: Plugin<NumberSchema> = createSchemaPlugin<NumberSchema>(
  {
    ui: renderNumberUi,
    pdf: text.pdf,
    propPanel: {
      schema: ({ i18n }) => ({
        // ── basics ──
        ...basicsFields(),
        // ── content ──
        placeholder: {
          title: 'Placeholder',
          type: 'string',
          widget: 'input',
          span: 12,
        },
        // ── number format ──
        ...numberFormatFields(),
        decimals: {
          title: 'Decimales',
          type: 'number',
          widget: 'inputNumber',
          span: 6,
          props: { min: 0, precision: 0 },
        },
        // ── validation ──
        validationMin: { ...validationMinField(), title: i18n('schemas.text.min') },
        validationMax: { ...validationMaxField(), title: i18n('schemas.text.max') },
        validationMessage: validationMessageField(),
        // ── help ──
        ...helpFields(),
        // ── dataLabel ──
        ...dataLabelFields(),
      }),
      inspector: createSchemaInspectorConfig('textual', {
        propertyMap: {
          ...COMMON_PROPERTY_MAP,
          decimals: 'data',
          // Junto a `decimals` porque son las tres que el runtime consume de
          // verdad. Sin mapear caerían en «Avanzado», donde la opción de moneda
          // queda fuera del alcance de quien configura el campo. El resto de
          // `numberFormatFields()` sigue sin consumidor y se queda allí.
          format: 'data',
          allowNegative: 'data',
          validationMin: 'validation',
          validationMax: 'validation',
          validationMessage: 'validation',
        },
        includeValidation: true,
        includeConnections: true,
      }),
      defaultSchema: {
        name: '',
        type: 'number',
        content: '',
        position: { x: 0, y: 0 },
        width: 45,
        height: 7,
        readOnly: false,
        required: false,
        // `0` significa "sin decimales" y hacía que cualquier coma se rechazara
        // al confirmar, vaciando el campo al perder el foco.
        decimals: 2,
        format: 'free',
        validationMessage: '',
        placeholder: '',
      },
    },
  },
  {
    key: 'number',
    type: 'number',
    label: 'Número',
    category: 'Texto',
    tags: ['number', 'numeric', 'input'],
    capabilities: ['designer', 'form', 'viewer', 'content', 'prefill'],
  },
);

export default schema;
