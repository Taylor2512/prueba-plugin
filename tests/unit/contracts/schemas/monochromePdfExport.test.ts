/**
 * QH-012 — gate de exportación PDF sin crominancia.
 *
 * El requisito es eliminar TODO color del PDF exportado. Comprobar que el
 * archivo empieza por `%PDF-` no demuestra nada sobre el color, así que este
 * gate descomprime los content streams del PDF generado y lee los operadores
 * de color reales que quedaron escritos en el documento.
 *
 * Operadores inspeccionados (PDF 32000-1, tabla 74):
 *   `r g b rg` / `RG` → color RGB de relleno / trazo
 *   `c m y k k`       → color CMYK
 *   `g G`             → gris
 *
 * Un PDF monocromático puede usar `rg`, pero SÓLO con las tres componentes
 * iguales. Cualquier `rg`/`RG` con componentes distintas, o cualquier `k` con
 * cromía, es crominancia filtrada.
 */
import { describe, expect, it } from 'vitest';
import { inflateSync } from 'node:zlib';
import { ColorTypes, PDFDocument, PDFName, PDFRawStream, decodePDFRawStream } from 'pdf-lib';
import { generate } from '../../../../src/sisad-pdfme/generator';
import { flatSchemaPlugins } from '../../../../src/sisad-pdfme/schemas';
import { hex2PrintingColor } from '../../../../src/sisad-pdfme/schemas/utils';

const BLANK_A4 = { width: 210, height: 297, padding: [0, 0, 0, 0] as [number, number, number, number] };

/** Campos con color explícito y saturado: si algo filtra cromía, aquí se ve. */
const buildColorfulTemplate = () => ({
  basePdf: BLANK_A4,
  schemas: [[
    {
      name: 'textoColoreado', type: 'text', position: { x: 10, y: 10 },
      width: 80, height: 12, fontColor: '#ff0000', backgroundColor: '#ffff00',
    },
    {
      name: 'rectangulo', type: 'rectangle', position: { x: 10, y: 30 },
      width: 50, height: 20, color: '#00ff00', borderColor: '#ff00ff', borderWidth: 2,
    },
    {
      name: 'elipse', type: 'ellipse', position: { x: 70, y: 30 },
      width: 40, height: 20, color: '#0000ff', borderColor: '#ff8800', borderWidth: 2,
    },
    {
      name: 'linea', type: 'line', position: { x: 10, y: 55 },
      width: 100, height: 1, color: '#ff0066',
    },
  ]],
});

/** Extrae el texto de todos los content streams del PDF. */
const readContentStreams = async (bytes: Uint8Array): Promise<string> => {
  const doc = await PDFDocument.load(bytes);
  const partes: string[] = [];

  for (const [, objeto] of doc.context.enumerateIndirectObjects()) {
    if (!(objeto instanceof PDFRawStream)) continue;
    const filtro = objeto.dict.get(PDFName.of('Filter'));
    let contenido: Uint8Array;
    try {
      contenido = String(filtro).includes('FlateDecode')
        ? new Uint8Array(inflateSync(Buffer.from(objeto.contents)))
        : decodePDFRawStream(objeto).decode();
    } catch {
      continue;
    }
    partes.push(Buffer.from(contenido).toString('latin1'));
  }
  return partes.join('\n');
};

/** Operadores de color RGB con componentes distintas entre sí. */
const findChromaticRgbOperators = (contenido: string): string[] => {
  const encontrados: string[] = [];
  const patron = /(-?[\d.]+)\s+(-?[\d.]+)\s+(-?[\d.]+)\s+(rg|RG)\b/g;
  let coincidencia: RegExpExecArray | null;
  while ((coincidencia = patron.exec(contenido)) !== null) {
    const [, r, g, b, operador] = coincidencia;
    const [rojo, verde, azul] = [Number(r), Number(g), Number(b)];
    // Tolerancia por el redondeo decimal que pdf-lib escribe en el stream.
    const maximo = Math.max(rojo, verde, azul);
    const minimo = Math.min(rojo, verde, azul);
    if (maximo - minimo > 0.001) {
      encontrados.push(`${operador}(${rojo}, ${verde}, ${azul})`);
    }
  }
  return encontrados;
};

/** Operadores CMYK con cualquier componente cromática. */
const findChromaticCmykOperators = (contenido: string): string[] => {
  const encontrados: string[] = [];
  const patron = /(-?[\d.]+)\s+(-?[\d.]+)\s+(-?[\d.]+)\s+(-?[\d.]+)\s+(k|K)\b/g;
  let coincidencia: RegExpExecArray | null;
  while ((coincidencia = patron.exec(contenido)) !== null) {
    const [, c, m, y, , operador] = coincidencia;
    if (Number(c) > 0.001 || Number(m) > 0.001 || Number(y) > 0.001) {
      encontrados.push(`${operador}(${c}, ${m}, ${y})`);
    }
  }
  return encontrados;
};

describe('hex2PrintingColor — contrato de grayscale', () => {
  it('convierte un hex cromático a luminancia neutra Rec.709', () => {
    const color = hex2PrintingColor('#1677ff', 'grayscale') as { red: number; green: number; blue: number };
    expect(color.red).toBe(color.green);
    expect(color.green).toBe(color.blue);
  });

  it('blanco y negro sobreviven sin desplazamiento', () => {
    const negro = hex2PrintingColor('#000000', 'grayscale') as { red: number };
    const blanco = hex2PrintingColor('#ffffff', 'grayscale') as { red: number };
    expect(negro.red).toBeCloseTo(0, 6);
    expect(blanco.red).toBeCloseTo(1, 6);
  });

  it('un color de destinatario pierde la cromía', () => {
    for (const hex of ['#2563EB', '#DC2626', '#059669', '#D97706']) {
      const color = hex2PrintingColor(hex, 'grayscale') as { red: number; green: number; blue: number };
      expect(color.red, hex).toBe(color.green);
      expect(color.green, hex).toBe(color.blue);
    }
  });

  it('un color YA construido como objeto tampoco puede saltarse el modo', () => {
    // Ésta era la fuga: `typeof color === 'object'` devolvía el color intacto,
    // así que un plugin que construyera su color con `rgb()` reintroducía
    // crominancia sin que ningún test lo detectara.
    const objeto = { type: ColorTypes.RGB, red: 1, green: 0, blue: 0 } as const;
    const color = hex2PrintingColor(objeto, 'grayscale') as { red: number; green: number; blue: number };
    expect(color.red).toBe(color.green);
    expect(color.green).toBe(color.blue);
  });

  it('sin modo grayscale el color se conserva tal cual', () => {
    const color = hex2PrintingColor('#ff0000') as { red: number; green: number; blue: number };
    expect(color.red).toBeGreaterThan(color.green);
  });

  it('un hex inválido falla en vez de emitir un color silencioso', () => {
    expect(() => hex2PrintingColor('no-es-color', 'grayscale')).toThrow();
  });
});

describe('exportación monocromática end-to-end', () => {
  it('un template con colores saturados no deja ningún operador cromático', async () => {
    const bytes = await generate({
      template: buildColorfulTemplate() as never,
      inputs: [{}],
      options: { colorType: 'grayscale' },
      plugins: flatSchemaPlugins as never,
    });

    const contenido = await readContentStreams(bytes);
    expect(contenido.length, 'el PDF debe tener content streams legibles').toBeGreaterThan(0);

    const rgbCromatico = findChromaticRgbOperators(contenido);
    const cmykCromatico = findChromaticCmykOperators(contenido);

    expect(rgbCromatico, 'ningún operador RGB puede tener componentes distintas').toEqual([]);
    expect(cmykCromatico, 'ningún operador CMYK puede tener cromía').toEqual([]);
  });

  it('sin grayscale el MISMO template sí conserva color: el gate discrimina', async () => {
    // Control negativo: si esta aserción fallara, el gate anterior estaría
    // pasando por construcción y no probaría nada.
    const bytes = await generate({
      template: buildColorfulTemplate() as never,
      inputs: [{}],
      options: {},
      plugins: flatSchemaPlugins as never,
    });

    const contenido = await readContentStreams(bytes);
    const rgbCromatico = findChromaticRgbOperators(contenido);
    expect(rgbCromatico.length, 'sin grayscale debe haber color real en el PDF').toBeGreaterThan(0);
  });
});
