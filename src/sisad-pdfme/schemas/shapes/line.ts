import type { Schema, Plugin } from '@sisad-pdfme/common';
import {
  rotatePoint,
  convertForPdfLayoutProps,
  hex2PrintingColor,
  createSvgStr,
} from '@sisad-pdfme/schemas/utils';
import { HEX_COLOR_PATTERN } from '@sisad-pdfme/schemas/constants';
import { Minus } from 'lucide-react';
import { createSchemaInspectorConfig } from '@sisad-pdfme/schemas/schemaFamilies';
import { getCanonicalDefault } from '@sisad-pdfme/schemas/runtime-normalizer';
import { resolveSchemaOwnerTone } from '@sisad-pdfme/schemas/shared/fieldChrome';

const DEFAULT_LINE_COLOR = '#000000';
const HIT_POINT_HEIGHT = 16;

interface LineSchema extends Schema {
  /** Opcional: sin color propio, el trazo usa el tono del dueño. */
  color?: string;
}

const lineSchema: Plugin<LineSchema> = {
  pdf: (arg) => {
    const { page, schema, options } = arg;
    if (schema.width === 0 || schema.height === 0) return;
    const { colorType } = options;
    const pageHeight = page.getHeight();
    const {
      width,
      height,
      rotate,
      position: { x, y },
      opacity,
    } = convertForPdfLayoutProps({ schema, pageHeight, applyRotateTranslate: false });
    const pivot = { x: x + width / 2, y: y + height / 2 };
    page.drawLine({
      start: rotatePoint({ x, y: y + height / 2 }, pivot, rotate.angle),
      end: rotatePoint({ x: x + width, y: y + height / 2 }, pivot, rotate.angle),
      thickness: height,
      color: hex2PrintingColor(schema.color ?? DEFAULT_LINE_COLOR, colorType),
      opacity: opacity,
    });
  },
  ui: (arg) => {
    const { schema, rootElement } = arg;
    Object.assign(rootElement.style, { position: 'relative', overflow: 'visible' });

    const baseStyles = {
      position: 'absolute',
      top: '50%',
      left: '0',
      transform: 'translateY(-50%)',
      width: '100%',
    } as const;

    const hitArea = document.createElement('div');
    Object.assign(hitArea.style, baseStyles, {
      height: `${HIT_POINT_HEIGHT}px`,
      backgroundColor: 'transparent',
    });

    const div = document.createElement('div');
    Object.assign(div.style, baseStyles, {
      height: '100%',
      // El trazo identifica a su destinatario salvo que tenga color propio.
      backgroundColor: schema.color || resolveSchemaOwnerTone(schema, DEFAULT_LINE_COLOR),
      pointerEvents: 'none',
    });

    rootElement.append(hitArea, div);
  },
  propPanel: {
    schema: ({ i18n }) => ({
      color: {
        title: i18n('schemas.color'),
        type: 'string',
        widget: 'color',
        props: {
          disabledAlpha: true,
        },
        required: true,
        rules: [{ pattern: HEX_COLOR_PATTERN, message: i18n('validation.hexColor') }],
      },
    }),
    inspector: createSchemaInspectorConfig('shape', {
      propertyMap: {
        color: 'style',
      },
    }),
    defaultSchema: ((): LineSchema => {
      const canonical = getCanonicalDefault(undefined as any, 'line') as Partial<LineSchema> | null;
      return {
        ...(canonical || {}),
        name: '',
        type: 'line',
        position: { x: 0, y: 0 },
        width: 50,
        height: 0.5,
        rotate: 0,
        opacity: 1,
        readOnly: true,
      } as LineSchema;
    })(),
  },
  icon: createSvgStr(Minus),
};
export default lineSchema;
