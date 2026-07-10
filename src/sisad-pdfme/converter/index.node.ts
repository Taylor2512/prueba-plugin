import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
import PDFJSWorker from 'pdfjs-dist/legacy/build/pdf.worker.js';
import type { Pdf2ImgOptions } from './pdf2img.js';
import type { Pdf2SizeOptions } from './pdf2size.js';
import { pdf2img as _pdf2img } from './pdf2img.js';
import { pdf2size as _pdf2size } from './pdf2size.js';

/**
 * Entry point para Node.js.
 *
 * Este archivo adapta las funciones core del converter al entorno Node:
 * - configura worker de PDF.js para Node;
 * - intenta cargar el paquete opcional `canvas`;
 * - convierte el canvas de Node a Buffer/ArrayBuffer;
 * - mantiene la misma API pública que el entry browser.
 */
let createCanvas: (width: number, height: number) => any;

try {
  /**
   * `canvas` es una dependencia nativa opcional.
   * Si no existe, `pdf2img` fallará al intentar crear canvas,
   * pero `pdf2size` todavía puede funcionar porque solo lee páginas.
   */
  ({ createCanvas } = require('canvas'));
} catch {
  // canvas module not available
}

/** Configura el worker de PDF.js para el entorno Node. */
pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJSWorker as unknown as string;

/**
 * Convierte un PDF a imágenes desde Node.
 *
 * La lógica de iterar páginas/renderizar vive en `pdf2img.ts`.
 * Aquí solo se inyectan funciones específicas de Node/PDF.js/canvas.
 */
export const pdf2img = async (
  pdf: ArrayBuffer | Uint8Array,
  options: Pdf2ImgOptions = {},
): Promise<ArrayBuffer[]> =>
  _pdf2img(pdf, options, {
    /** Carga documento con PDF.js deshabilitando eval por seguridad. */
    getDocument: (pdf) => pdfjsLib.getDocument({ data: pdf, isEvalSupported: false }).promise,

    /** Crea canvas mediante el paquete nativo `canvas`. */
    createCanvas: (width, height) => createCanvas(width, height) as unknown as HTMLCanvasElement,

    /**
     * Serializa el canvas de Node a Buffer y luego lo expone como ArrayBuffer.
     * Se usa `any` porque los tipos de node-canvas no coinciden con DOM Canvas.
     */
    canvasToArrayBuffer: (canvas) => {
      const nodeCanvas = canvas as any;
      const buffer = nodeCanvas.toBuffer();
      return new Uint8Array(buffer).buffer;
    },
  });

/**
 * Obtiene tamaños de páginas PDF en Node.
 * No requiere canvas, solo PDF.js.
 */
export const pdf2size = async (pdf: ArrayBuffer | Uint8Array, options: Pdf2SizeOptions = {}) =>
  _pdf2size(pdf, options, {
    getDocument: (pdf) => pdfjsLib.getDocument({ data: pdf, isEvalSupported: false }).promise,
  });

/** Reexporta tipos públicos del paquete converter. */
export type { Img2PdfOptions } from './img2pdf.js';
export type { Pdf2ImgOptions } from './pdf2img.js';
export type { Pdf2SizeOptions } from './pdf2size.js';

/** img2pdf es independiente del entorno. */
export { img2pdf } from './img2pdf.js';
