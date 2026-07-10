import type { PDFDocumentProxy } from 'pdfjs-dist';
import type { ImageType } from './types.js';

/**
 * Adaptador de entorno requerido por pdf2img.
 *
 * La función core no importa directamente PDF.js, DOM ni node-canvas.
 * En su lugar, recibe estas dependencias desde `index.browser.ts`
 * o `index.node.ts`.
 */
interface Environment {
  /** Abre el PDF y retorna un PDFDocumentProxy de PDF.js. */
  getDocument: (pdf: ArrayBuffer | Uint8Array) => Promise<PDFDocumentProxy>;

  /** Crea un canvas compatible con el entorno actual. */
  createCanvas: (width: number, height: number) => HTMLCanvasElement | OffscreenCanvas;

  /** Serializa el canvas renderizado a ArrayBuffer de imagen. */
  canvasToArrayBuffer: (
    canvas: HTMLCanvasElement | OffscreenCanvas,
    imageType: ImageType,
  ) => ArrayBuffer;
}

/**
 * Opciones para convertir un PDF a imágenes.
 */
export interface Pdf2ImgOptions {
  /** Escala de renderizado usada por PDF.js. A mayor escala, mayor resolución. */
  scale?: number;

  /** Tipo de imagen de salida. */
  imageType?: ImageType;

  /**
   * Rango de páginas basado en índice cero.
   *
   * Ejemplo:
   * - start: 0, end: 0 => solo la primera página.
   * - start: 1, end: 2 => segunda y tercera página.
   */
  range?: {
    start?: number;
    end?: number;
  };
}

/**
 * Convierte páginas de un PDF en imágenes.
 *
 * Responsabilidades:
 * - cargar el PDF desde ArrayBuffer/Uint8Array;
 * - calcular rango de páginas;
 * - renderizar cada página en canvas;
 * - serializar cada canvas a ArrayBuffer de imagen.
 *
 * Esta función es agnóstica al entorno. Browser/Node inyectan el adaptador.
 */
export async function pdf2img(
  pdf: ArrayBuffer | Uint8Array,
  options: Pdf2ImgOptions = {},
  env: Environment,
): Promise<ArrayBuffer[]> {
  try {
    const { scale = 1, imageType = 'jpeg', range = {} } = options;
    const { start = 0, end = Infinity } = range;

    const { getDocument, createCanvas, canvasToArrayBuffer } = env;

    const pdfDoc = await getDocument(pdf);
    const numPages = pdfDoc.numPages;

    /**
     * PDF.js usa páginas 1-based.
     * La API pública usa range 0-based para ser consistente con arrays.
     */
    const startPage = Math.max(start + 1, 1);
    const endPage = Math.min(end + 1, numPages);

    const results: ArrayBuffer[] = [];

    for (let pageNum = startPage; pageNum <= endPage; pageNum++) {
      const page = await pdfDoc.getPage(pageNum);
      const viewport = page.getViewport({ scale });

      /** Crea un canvas con las dimensiones exactas del viewport. */
      const canvas = createCanvas(viewport.width, viewport.height);
      if (!canvas) {
        throw new Error('Failed to create canvas');
      }

      /** Obtiene contexto 2D para renderizar la página PDF. */
      const context = canvas.getContext('2d') as CanvasRenderingContext2D;
      if (!context) {
        throw new Error('Failed to get canvas context');
      }

      /** Renderiza la página y espera a que PDF.js termine. */
      await page.render({ canvasContext: context, viewport }).promise;

      /** Convierte el canvas renderizado a imagen binaria. */
      const arrayBuffer = canvasToArrayBuffer(canvas, imageType);
      results.push(arrayBuffer);
    }

    return results;
  } catch (error) {
    throw new Error(`[@sisad-pdfme/converter] pdf2img failed: ${(error as Error).message}`);
  }
}
