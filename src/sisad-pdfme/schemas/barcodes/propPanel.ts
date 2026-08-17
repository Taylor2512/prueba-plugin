import type { PropPanel } from '@sisad-pdfme/common';
import type { BarcodeSchema } from '@sisad-pdfme/schemas/barcodes/types';
import {
  DEFAULT_BARCODE_COLOR,
  DEFAULT_BARCODE_BG_COLOR,
  DEFAULT_BARCODE_INCLUDETEXT,
} from '@sisad-pdfme/schemas/barcodes/constants';
import { DEFAULT_OPACITY, HEX_COLOR_PATTERN } from '@sisad-pdfme/schemas/constants';
import { createSchemaInspectorConfig } from '@sisad-pdfme/schemas/schemaFamilies';
import { hexColorFields } from '@sisad-pdfme/schemas/propPanel/commonInspectorFields';
import { getCanonicalDefault } from '@sisad-pdfme/schemas/runtime-normalizer';

const defaultColors = {
  backgroundColor: DEFAULT_BARCODE_BG_COLOR,
  barColor: DEFAULT_BARCODE_COLOR,
};
const defaultTextColors = { textColor: DEFAULT_BARCODE_COLOR };
const defaultIncludetext = { includetext: DEFAULT_BARCODE_INCLUDETEXT };
const position = { x: 0, y: 0 };
const default40x20 = { width: 40, height: 20 };

const barcodeDefaults: { defaultSchema: BarcodeSchema }[] = [
  {
    defaultSchema: ((): BarcodeSchema => {
      const canonical = getCanonicalDefault(undefined as any, 'qrcode') as Partial<BarcodeSchema> | null;
      return {
        ...(canonical || {}),
        name: '',
        type: 'qrcode',
        content: 'https://sisad-pdfme.com/',
        position,
        ...defaultColors,
        width: 30,
        height: 30,
        rotate: 0,
        opacity: DEFAULT_OPACITY,
      } as BarcodeSchema;
    })(),
  },
  {
    defaultSchema: ((): BarcodeSchema => {
      const canonical = getCanonicalDefault(undefined as any, 'japanpost') as Partial<BarcodeSchema> | null;
      return {
        ...(canonical || {}),
        name: '',
        type: 'japanpost',
        content: '6540123789-A-K-Z',
        position,
        ...defaultColors,
        ...defaultTextColors,
        ...defaultIncludetext,
        width: 80,
        height: 7.2,
        rotate: 0,
        opacity: DEFAULT_OPACITY,
      } as BarcodeSchema;
    })(),
  },
  {
    defaultSchema: ((): BarcodeSchema => {
      const canonical = getCanonicalDefault(undefined as any, 'ean13') as Partial<BarcodeSchema> | null;
      return {
        ...(canonical || {}),
        name: '',
        type: 'ean13',
        content: '2112345678900',
        position,
        ...defaultColors,
        ...defaultTextColors,
        ...defaultIncludetext,
        ...default40x20,
        height: 16,
        rotate: 0,
        opacity: DEFAULT_OPACITY,
      } as BarcodeSchema;
    })(),
  },
  {
    defaultSchema: ((): BarcodeSchema => {
      const canonical = getCanonicalDefault(undefined as any, 'ean8') as Partial<BarcodeSchema> | null;
      return {
        ...(canonical || {}),
        name: '',
        type: 'ean8',
        content: '02345673',
        position,
        ...defaultColors,
        ...defaultTextColors,
        ...defaultIncludetext,
        ...default40x20,
        rotate: 0,
        opacity: DEFAULT_OPACITY,
      } as BarcodeSchema;
    })(),
  },
  {
    defaultSchema: ((): BarcodeSchema => {
      const canonical = getCanonicalDefault(undefined as any, 'code39') as Partial<BarcodeSchema> | null;
      return {
        ...(canonical || {}),
        name: '',
        type: 'code39',
        content: 'THIS IS CODE 39',
        position,
        ...defaultColors,
        ...defaultTextColors,
        ...defaultIncludetext,
        ...default40x20,
        opacity: DEFAULT_OPACITY,
      } as BarcodeSchema;
    })(),
  },
  {
    defaultSchema: ((): BarcodeSchema => {
      const canonical = getCanonicalDefault(undefined as any, 'code128') as Partial<BarcodeSchema> | null;
      return {
        ...(canonical || {}),
        name: '',
        type: 'code128',
        content: 'This is Code 128!',
        position,
        ...defaultColors,
        ...defaultTextColors,
        ...defaultIncludetext,
        ...default40x20,
        rotate: 0,
        opacity: DEFAULT_OPACITY,
      } as BarcodeSchema;
    })(),
  },
  {
    defaultSchema: ((): BarcodeSchema => {
      const canonical = getCanonicalDefault(undefined as any, 'nw7') as Partial<BarcodeSchema> | null;
      return {
        ...(canonical || {}),
        name: '',
        type: 'nw7',
        content: 'A0123456789B',
        position,
        ...defaultColors,
        ...defaultTextColors,
        ...defaultIncludetext,
        ...default40x20,
        rotate: 0,
        opacity: DEFAULT_OPACITY,
      } as BarcodeSchema;
    })(),
  },
  {
    defaultSchema: ((): BarcodeSchema => {
      const canonical = getCanonicalDefault(undefined as any, 'itf14') as Partial<BarcodeSchema> | null;
      return {
        ...(canonical || {}),
        name: '',
        type: 'itf14',
        content: '04601234567893',
        position,
        ...defaultColors,
        ...defaultTextColors,
        ...defaultIncludetext,
        ...default40x20,
        height: 12,
        rotate: 0,
        opacity: DEFAULT_OPACITY,
      } as BarcodeSchema;
    })(),
  },
  {
    defaultSchema: ((): BarcodeSchema => {
      const canonical = getCanonicalDefault(undefined as any, 'upca') as Partial<BarcodeSchema> | null;
      return {
        ...(canonical || {}),
        name: '',
        type: 'upca',
        content: '416000336108',
        position,
        ...defaultColors,
        ...defaultTextColors,
        ...defaultIncludetext,
        ...default40x20,
        height: 16,
        rotate: 0,
        opacity: DEFAULT_OPACITY,
      } as BarcodeSchema;
    })(),
  },
  {
    defaultSchema: ((): BarcodeSchema => {
      const canonical = getCanonicalDefault(undefined as any, 'upce') as Partial<BarcodeSchema> | null;
      return {
        ...(canonical || {}),
        name: '',
        type: 'upce',
        content: '00123457',
        position,
        ...defaultColors,
        ...defaultTextColors,
        ...defaultIncludetext,
        ...default40x20,
        rotate: 0,
        opacity: DEFAULT_OPACITY,
      } as BarcodeSchema;
    })(),
  },
  {
    defaultSchema: ((): BarcodeSchema => {
      const canonical = getCanonicalDefault(undefined as any, 'gs1datamatrix') as Partial<BarcodeSchema> | null;
      return {
        ...(canonical || {}),
        name: '',
        type: 'gs1datamatrix',
        content: '(01)03453120000011(17)191125(10)ABCD1234',
        position,
        ...defaultColors,
        width: 30,
        height: 30,
        rotate: 0,
        opacity: DEFAULT_OPACITY,
      } as BarcodeSchema;
    })(),
  },
  {
    defaultSchema: ((): BarcodeSchema => {
      const canonical = getCanonicalDefault(undefined as any, 'pdf417') as Partial<BarcodeSchema> | null;
      return {
        ...(canonical || {}),
        name: '',
        type: 'pdf417',
        content: 'This is PDF417!',
        position,
        ...defaultColors,
        width: 40,
        height: 16,
        rotate: 0,
        opacity: DEFAULT_OPACITY,
      } as BarcodeSchema;
    })(),
  },
];

export const getPropPanelByBarcodeType = (barcodeType: string): PropPanel<BarcodeSchema> => {
  const barcodeHasText =
    barcodeType !== 'qrcode' && barcodeType !== 'gs1datamatrix' && barcodeType !== 'pdf417';

  const defaults = barcodeDefaults.find(({ defaultSchema }) => defaultSchema.type === barcodeType);

  if (!defaults)
    throw new Error(`[@sisad-pdfme/schemas/barcodes] No default for barcode type ${barcodeType}`);

  return {
    schema: ({ i18n }) => ({
      ...hexColorFields(
        {
          barColor: i18n('schemas.barcodes.barColor'),
          backgroundColor: i18n('schemas.bgColor'),
        },
        { pattern: HEX_COLOR_PATTERN, message: i18n('validation.hexColor') },
      ),
      ...(barcodeHasText
        ? {
            textColor: {
              title: i18n('schemas.textColor'),
              type: 'string',
              widget: 'color',
              props: {
                disabledAlpha: true,
              },
            },
            includetext: {
              title: i18n('schemas.barcodes.includetext'),
              type: 'boolean',
              widget: 'switch',
            },
          }
        : {}),
    }),
    inspector: createSchemaInspectorConfig('barcode', {
      propertyMap: {
        barColor: 'style',
        backgroundColor: 'style',
        textColor: 'style',
        includetext: 'data',
      },
    }),
    ...defaults,
  };
};