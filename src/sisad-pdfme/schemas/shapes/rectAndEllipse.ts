import { Plugin, Schema, mm2pt } from '@sisad-pdfme/common';
import { HEX_COLOR_PATTERN } from '@sisad-pdfme/schemas/constants';
import { hex2PrintingColor, convertForPdfLayoutProps, createSvgStr } from '@sisad-pdfme/schemas/utils';
import { toRadians } from 'pdf-lib';
import { Circle, Square } from 'lucide-react';
import { createSchemaInspectorConfig } from '@sisad-pdfme/schemas/schemaFamilies';
import { isRecord } from '@sisad-pdfme/shared/objectGuards';
import { resolveSchemaOwnerTone } from '@sisad-pdfme/schemas/shared/fieldChrome';
import { hexColorFields } from '@sisad-pdfme/schemas/propPanel/commonInspectorFields';

interface ShapeSchema extends Schema {
  type: 'ellipse' | 'rectangle';
  borderWidth: number;
  /** Opcionales: sin color propio, el borde usa el tono del dueño. */
  borderColor?: string;
  color?: string;
  radius?: number;
}

const shape: Plugin<ShapeSchema> = {
  ui: (arg) => {
    const { schema, rootElement } = arg;
    const div = document.createElement('div');
    div.style.width = '100%';
    div.style.height = '100%';
    div.style.boxSizing = 'border-box';
    if (schema.type === 'ellipse') {
      div.style.borderRadius = '50%';
    } else if (schema.radius && schema.radius > 0) {
      div.style.borderRadius = `${schema.radius}mm`;
    }
    div.style.borderWidth = `${schema.borderWidth ?? 0}mm`;
    // El borde identifica al destinatario salvo que la forma tenga color propio.
    const shapeTone = schema.borderColor || resolveSchemaOwnerTone(schema, '#000000');
    div.style.borderStyle = schema.borderWidth ? 'solid' : 'none';
    div.style.borderColor = shapeTone;
    div.style.backgroundColor = schema.color ?? 'transparent';

    rootElement.appendChild(div);
  },
  pdf: (arg) => {
    const { schema, page, options } = arg;
    if (!schema.color && !schema.borderColor && !schema.borderWidth) return;
    const { colorType } = options;
    const pageHeight = page.getHeight();
    const cArg = { schema, pageHeight };
    const { position, width, height, rotate, opacity } = convertForPdfLayoutProps(cArg);
    const {
      position: { x: x4Ellipse, y: y4Ellipse },
    } = convertForPdfLayoutProps({ ...cArg, applyRotateTranslate: false });
    const borderWidth = schema.borderWidth ? mm2pt(schema.borderWidth) : 0;

    const drawOptions = {
      rotate,
      borderWidth,
      borderColor: hex2PrintingColor(schema.borderColor || '#000000', colorType),
      color: hex2PrintingColor(schema.color, colorType),
      opacity,
      borderOpacity: opacity,
    };
    if (schema.type === 'ellipse') {
      page.drawEllipse({
        x: x4Ellipse + width / 2,
        y: y4Ellipse + height / 2,
        xScale: width / 2 - borderWidth / 2,
        yScale: height / 2 - borderWidth / 2,
        ...drawOptions,
      });
    } else if (schema.type === 'rectangle') {
      const radius = schema.radius ?? 0;

      page.drawRectangle({
        x:
          position.x +
          borderWidth * ((1 - Math.sin(toRadians(rotate))) / 2) +
          Math.tan(toRadians(rotate)) * Math.PI ** 2,
        y:
          position.y +
          borderWidth * ((1 + Math.sin(toRadians(rotate))) / 2) +
          Math.tan(toRadians(rotate)) * Math.PI ** 2,
        width: width - borderWidth,
        height: height - borderWidth,
        ...(radius ? { radius: mm2pt(radius) } : {}),
        ...drawOptions,
      });
    }
  },
  propPanel: {
    schema: ({ i18n }) => ({
      borderWidth: {
        title: i18n('schemas.borderWidth'),
        type: 'number',
        widget: 'inputNumber',
        props: { min: 0, step: 1 },
        span: 12,
      },
      ...hexColorFields(
        {
          borderColor: { title: i18n('schemas.borderColor'), span: 12 },
          color: i18n('schemas.color'),
        },
        { pattern: HEX_COLOR_PATTERN, message: i18n('validation.hexColor') },
      ),
      radius: {
        title: i18n('schemas.radius'),
        type: 'number',
        widget: 'inputNumber',
        props: { min: 0, step: 1 },
        span: 12,
      },
    }),
    inspector: createSchemaInspectorConfig('shape', {
      propertyMap: {
        borderWidth: 'style',
        borderColor: 'style',
        color: 'style',
        radius: 'style',
      },
    }),
    defaultSchema: ((): ShapeSchema => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { normalizePluginDefaultSchema } = require('@sisad-pdfme/schemas/normalizers');
        // Call normalizer with `undefined` plugin to obtain canonical defaults
        // using only the type, avoiding references to `shape` before initialization.
        const canonical = normalizePluginDefaultSchema(undefined as any, 'rectangle') as Partial<ShapeSchema>;
        return {
          ...(canonical as ShapeSchema),
          name: '',
          type: 'rectangle',
          position: { x: 0, y: 0 },
          width: 62.5,
          height: 37.5,
          rotate: 0,
          opacity: 1,
          borderWidth: 1,
          color: '',
          readOnly: true,
          radius: 0,
        } as ShapeSchema;
      } catch (e) {
        return {
          name: '',
          type: 'rectangle',
          position: { x: 0, y: 0 },
          width: 62.5,
          height: 37.5,
          rotate: 0,
          opacity: 1,
          borderWidth: 1,
          color: '',
          readOnly: true,
          radius: 0,
        } as ShapeSchema;
      }
    })(),
  },
};

const getPropPanelSchema = (type: 'rectangle' | 'ellipse') => ({
  ...shape.propPanel,
  defaultSchema: {
    ...shape.propPanel.defaultSchema,
    type,
  },
});

export const rectangle = {
  ...shape,
  propPanel: getPropPanelSchema('rectangle'),
  icon: createSvgStr(Square),
};

export const ellipse = {
  ...shape,
  propPanel: getPropPanelSchema('ellipse'),
  icon: createSvgStr(Circle),
};
