/**
 * PRT-130 — El schema `svg` tiene que aparecer de verdad en el PDF.
 *
 * Contrato bajo prueba:
 * - la geometría del SVG llega al content stream de la página;
 * - el viewBox y los `transform` anidados se mapean a la caja del schema;
 * - un SVG que el renderer no sabe dibujar falla en voz alta, nunca en silencio.
 *
 * El caso de partida era un no-op: el plugin invocaba `page.drawSvg`, que
 * pdf-lib 1.17.1 no implementa, así que el gráfico nunca se dibujaba y la
 * generación terminaba sin error.
 */
import { PDFArray, PDFDocument, PDFName, PDFRawStream, decodePDFRawStream } from 'pdf-lib';
import { describe, expect, it } from 'vitest';
import type { PDFRenderProps, Schema } from '@sisad-pdfme/common';
import svgSchema from '@sisad-pdfme/schemas/graphics/svg';
import {
  buildSvgViewportMatrix,
  parseSvgTransform,
  svgShapeToPathData,
  type SvgMatrix,
} from '@sisad-pdfme/schemas/graphics/svgGeometry';
import { SvgRenderError, planSvgDraw } from '@sisad-pdfme/schemas/graphics/svgRenderPlan';

const A4_HEIGHT_PT = 841.89;
const MM_TO_PT = 72 / 25.4;

/** Aplica una matriz a un punto, para aseverar dónde acaba cada esquina. */
const applySvgMatrix = (matrix: SvgMatrix, x: number, y: number) => ({
  x: matrix[0] * x + matrix[2] * y + matrix[4],
  y: matrix[1] * x + matrix[3] * y + matrix[5],
});

const buildSchema = (overrides: Partial<Schema> = {}): Schema =>
  ({
    name: 'logo',
    type: 'svg',
    position: { x: 10, y: 20 },
    width: 40,
    height: 40,
    ...overrides,
  }) as Schema;

/**
 * Operadores de la primera página del PDF ya serializado.
 *
 * Se lee del documento guardado y recargado a propósito: es exactamente lo que
 * recibe un visor, así que la aserción no depende de estructuras internas que
 * pdf-lib sólo mantiene en memoria.
 */
const readPageOperators = async (doc: PDFDocument): Promise<string> => {
  const reloaded = await PDFDocument.load(await doc.save());
  const page = reloaded.getPage(0);
  const contents = page.node.lookup(PDFName.of('Contents'));
  const streams =
    contents instanceof PDFArray
      ? contents.asArray().map((ref) => reloaded.context.lookup(ref))
      : [contents];
  return streams
    .map((stream) =>
      stream instanceof PDFRawStream ? new TextDecoder().decode(decodePDFRawStream(stream).decode()) : '',
    )
    .join('\n');
};

const renderToPage = async (value: string, schema: Schema = buildSchema()) => {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595.28, A4_HEIGHT_PT]);
  await svgSchema.pdf({
    value,
    schema,
    page,
    pdfDoc: doc,
    options: {},
    _cache: new Map(),
  } as unknown as PDFRenderProps<Schema>);
  return doc;
};

const SQUARE_SVG = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <path d="M 0 0 H 100 V 100 H 0 Z" fill="#ff0000" />
</svg>`;

describe('PRT-130 — el schema svg se dibuja en el PDF', () => {
  it('emite geometría en el content stream de la página', async () => {
    const operators = await readPageOperators(await renderToPage(SQUARE_SVG));

    // `cm` = matriz del trazo, `re`/`l`/`m` = geometría, `f` = relleno.
    expect(operators).toMatch(/\bcm\b/);
    expect(operators).toMatch(/\b[ml]\b/);
    expect(operators).toMatch(/\bf\b/);
    expect(operators).toContain('1 0 0 rg');
  });

  it('deja la página vacía sólo cuando el schema no tiene contenido', async () => {
    const operators = await readPageOperators(await renderToPage(''));
    expect(operators.trim()).toBe('');
  });

  it('dibuja el SVG por defecto del plugin', async () => {
    const defaultValue = svgSchema.propPanel.defaultSchema.content;
    expect(typeof defaultValue).toBe('string');
    const operators = await readPageOperators(await renderToPage(String(defaultValue)));
    expect(operators).toMatch(/\bc\b/);
  });
});

describe('PRT-130 — el mapeo respeta viewBox, caja y transforms', () => {
  it('coloca la esquina del viewBox en la esquina de la caja del schema', () => {
    const target = { x: 100, y: 200, width: 80, height: 80 };
    const matrix = buildSvgViewportMatrix({ minX: 0, minY: 0, width: 100, height: 100 }, target);

    // El origen SVG (arriba-izquierda) cae en el borde superior de la caja PDF.
    expect(applySvgMatrix(matrix, 0, 0)).toEqual({ x: 100, y: 280 });
    // El extremo opuesto del viewBox cae en el borde inferior derecho.
    expect(applySvgMatrix(matrix, 100, 100)).toEqual({ x: 180, y: 200 });
  });

  it('centra el dibujo cuando el viewBox no tiene la proporción de la caja', () => {
    const matrix = buildSvgViewportMatrix(
      { minX: 0, minY: 0, width: 100, height: 50 },
      { x: 0, y: 0, width: 100, height: 100 },
    );
    // Escala uniforme 1 y centrado vertical: sobran 50pt repartidos.
    expect(applySvgMatrix(matrix, 0, 0)).toEqual({ x: 0, y: 75 });
    expect(applySvgMatrix(matrix, 100, 50)).toEqual({ x: 100, y: 25 });
  });

  it('respeta la caja del schema en lugar de una escala fija', () => {
    const narrow = planSvgDraw(SQUARE_SVG, { x: 0, y: 0, width: 10, height: 10 });
    const wide = planSvgDraw(SQUARE_SVG, { x: 0, y: 0, width: 200, height: 200 });
    expect(narrow[0].matrix[0]).toBeCloseTo(0.1, 10);
    expect(wide[0].matrix[0]).toBeCloseTo(2, 10);
  });

  it('compone el transform del grupo con el viewport', () => {
    const draws = planSvgDraw(
      `<svg viewBox="0 0 100 100"><g transform="translate(10 0)"><path d="M 0 0 L 1 1" fill="#000000"/></g></svg>`,
      { x: 0, y: 0, width: 100, height: 100 },
    );
    expect(draws).toHaveLength(1);
    // La traslación del grupo se mantiene en el eje X del espacio de página.
    expect(draws[0].matrix[4]).toBeCloseTo(10, 10);
  });

  it('hereda la pintura declarada en los grupos', () => {
    const [draw] = planSvgDraw(
      `<svg viewBox="0 0 10 10"><g fill="#0000ff" stroke="red" stroke-width="2"><path d="M 0 0 L 5 5"/></g></svg>`,
      { x: 0, y: 0, width: 10, height: 10 },
    );
    expect(draw.fill).toBe('#0000ff');
    expect(draw.stroke).toBe('#ff0000');
    expect(draw.strokeWidth).toBe(2);
  });

  it('usa la caja convertida del schema, no las unidades del SVG', async () => {
    const schema = buildSchema({ position: { x: 10, y: 20 }, width: 40, height: 40 });
    const draws = planSvgDraw(SQUARE_SVG, {
      x: 10 * MM_TO_PT,
      y: A4_HEIGHT_PT - 20 * MM_TO_PT - 40 * MM_TO_PT,
      width: 40 * MM_TO_PT,
      height: 40 * MM_TO_PT,
    });
    const operators = await readPageOperators(await renderToPage(SQUARE_SVG, schema));
    const expectedScale = draws[0].matrix[0].toFixed(2);
    expect(operators).toContain(expectedScale);
  });
});

describe('PRT-130 — el renderer falla en voz alta', () => {
  it('rechaza un SVG sin viewBox ni dimensiones', () => {
    expect(() => planSvgDraw('<svg><path d="M 0 0 L 1 1"/></svg>', { x: 0, y: 0, width: 10, height: 10 }))
      .toThrow(SvgRenderError);
  });

  it('rechaza elementos que no sabe dibujar en lugar de omitirlos', () => {
    expect(() =>
      planSvgDraw('<svg viewBox="0 0 10 10"><text x="0" y="0">hola</text></svg>', {
        x: 0,
        y: 0,
        width: 10,
        height: 10,
      }),
    ).toThrow(/unsupported element <text>/);
  });

  it('rechaza un documento que no produce geometría', () => {
    expect(() =>
      planSvgDraw('<svg viewBox="0 0 10 10"><g fill="none"/></svg>', {
        x: 0,
        y: 0,
        width: 10,
        height: 10,
      }),
    ).toThrow(/no drawable geometry/);
  });

  it('rechaza markup mal formado', () => {
    expect(() => planSvgDraw('<svg viewBox="0 0 10 10"><g>', { x: 0, y: 0, width: 10, height: 10 }))
      .toThrow(SvgRenderError);
  });

  it('propaga el fallo a través del plugin en lugar de generar un PDF sin el gráfico', async () => {
    await expect(renderToPage('<svg viewBox="0 0 10 10"><image href="x.png"/></svg>')).rejects.toThrow(
      SvgRenderError,
    );
  });
});

describe('PRT-130 — conversión de formas básicas', () => {
  it('convierte rect, line, polygon y circle a datos de path', () => {
    expect(svgShapeToPathData('rect', { x: '0', y: '0', width: '10', height: '5' })).toBe(
      'M 0 0 H 10 V 5 H 0 Z',
    );
    expect(svgShapeToPathData('line', { x1: '0', y1: '0', x2: '3', y2: '4' })).toBe('M 0 0 L 3 4');
    expect(svgShapeToPathData('polygon', { points: '0,0 1,0 1,1' })).toBe('M 0 0 L 1 0 L 1 1 Z');
    expect(svgShapeToPathData('circle', { cx: '5', cy: '5', r: '5' })).toMatch(/^M 0 5 C /);
  });

  it('interpreta las funciones de transform soportadas', () => {
    expect(parseSvgTransform('translate(5 6)')).toEqual([1, 0, 0, 1, 5, 6]);
    expect(parseSvgTransform('matrix(1,0,0,1,-56,0)')).toEqual([1, 0, 0, 1, -56, 0]);
    expect(parseSvgTransform('scale(2)')).toEqual([2, 0, 0, 2, 0, 0]);
    expect(parseSvgTransform('skewZ(2)')).toBeNull();
  });
});
