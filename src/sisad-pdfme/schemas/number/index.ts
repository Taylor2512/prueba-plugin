import type { Plugin, Schema, UIRenderProps } from '@sisad-pdfme/common';
import { renderTextUi } from '../text/uiRender.js';
import type { TextSchema } from '../text/types.js';
import text from '../text/index.js';
import { createSchemaPlugin } from '../schemaBuilder.js';
import { createSchemaInspectorConfig } from '../schemaFamilies.js';
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

type NumberSchema = Schema & {
  decimals?: number;
  validationMin?: number;
  validationMax?: number;
};

const NUMBER_DRAFT_PATTERN = /^-?(?:\d+(?:[.,]\d*)?|[.,]\d*)?$/;

/** Keeps the input transport as string while providing a canonical number value on commit. */
export const normalizeNumberDraft = (value: unknown): string | null => {
  const draft = String(value ?? '').trim().replace(',', '.');
  if (!draft || !NUMBER_DRAFT_PATTERN.test(draft)) return null;
  const parsed = Number(draft);
  return Number.isFinite(parsed) ? String(parsed) : null;
};

export const isNumberDraft = (value: unknown): boolean => {
  const draft = String(value ?? '').trim().replace(',', '.');
  return draft === '' || NUMBER_DRAFT_PATTERN.test(draft);
};

export const isNumberWithinBounds = (value: unknown, schema: NumberSchema): boolean => {
  const draft = String(value ?? '').trim().replace(',', '.');
  const canonical = normalizeNumberDraft(draft);
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
        if (!isNumberDraft(latestDraft)) {
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
      const canonical = normalizeNumberDraft(latestDraft);
      if (canonical !== null && isNumberWithinBounds(canonical, arg.schema)) {
        originalOnChange?.([{ key: 'content', value: canonical }]);
      } else if (latestDraft.trim() !== '') {
        originalOnChange?.([{ key: 'content', value: '' }]);
      }
      originalStopEditing?.();
    },
  } as UIRenderProps<TextSchema>);
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
        decimals: 0,
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
