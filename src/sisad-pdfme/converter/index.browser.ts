import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
import PDFJSWorkerUrl from 'pdfjs-dist/legacy/build/pdf.worker.min.js?url';
import type { Pdf2ImgOptions } from './pdf2img.js';
import type { Pdf2SizeOptions } from './pdf2size.js';
import { pdf2img as _pdf2img } from './pdf2img.js';
import { pdf2size as _pdf2size } from './pdf2size.js';

/**
 * Entry point para navegador.
 *
 * Este archivo adapta las funciones core del converter al entorno browser:
 * - configura el worker de PDF.js usando el import `?url` de Vite/bundler;
 * - crea canvas con `document.createElement('canvas')`;
 * - convierte canvas a imagen con `toDataURL`;
 * - transforma el data URL resultante a ArrayBuffer.
 *
 * La lógica real de conversión vive en `pdf2img.ts` y `pdf2size.ts`.
 * Este archivo solo inyecta dependencias del entorno.
 */
pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJSWorkerUrl as string;

/**
 * Convierte un data URL base64 a ArrayBuffer.
 *
 * Uso típico:
 * canvas.toDataURL('image/jpeg') -> dataURLToArrayBuffer(...)
 */
function dataURLToArrayBuffer(dataURL: string): ArrayBuffer {
  /** Extrae la parte base64 después de la coma del data URL. */
  const base64String = dataURL.split(',')[1];

  /** Decodifica Base64 a string binario. */
  const byteString = atob(base64String);

  /** Copia cada byte a un Uint8Array respaldado por ArrayBuffer. */
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uintArray = new Uint8Array(arrayBuffer);

  for (let i = 0; i < byteString.length; i++) {
    uintArray[i] = byteString.charCodeAt(i);
  }

  return arrayBuffer;
}

/**
 * Convierte un PDF a imágenes desde navegador.
 *
 * El core `pdf2img` recibe un adaptador de entorno para no depender
 * directamente de DOM, PDF.js ni canvas. Aquí se provee ese adaptador.
 */
export const pdf2img = async (
  pdf: ArrayBuffer | Uint8Array,
  options: Pdf2ImgOptions = {},
): Promise<ArrayBuffer[]> =>
  _pdf2img(pdf, options, {
    /** Carga documento con PDF.js deshabilitando eval por seguridad. */
    getDocument: (pdf) => pdfjsLib.getDocument({ data: pdf, isEvalSupported: false }).promise,

    /** Crea un canvas DOM estándar para renderizar cada página. */
    createCanvas: (width, height) => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      return canvas;
    },

    /** Serializa el canvas al tipo de imagen solicitado. */
    canvasToArrayBuffer: (canvas, imageType) => {
      const dataUrl = (canvas as HTMLCanvasElement).toDataURL(`image/${imageType}`);
      return dataURLToArrayBuffer(dataUrl);
    },
  });

/**
 * Obtiene tamaños de páginas PDF en navegador.
 *
 * La medición real vive en `pdf2size.ts`; aquí solo se inyecta PDF.js.
 */
export const pdf2size = async (pdf: ArrayBuffer | Uint8Array, options: Pdf2SizeOptions = {}) =>
  _pdf2size(pdf, options, {
    getDocument: (pdf) => pdfjsLib.getDocument({ data: pdf, isEvalSupported: false }).promise,
  });

/** Reexporta tipos públicos del paquete converter. */
export type { Img2PdfOptions } from './img2pdf.js';
export type { Pdf2ImgOptions } from './pdf2img.js';
export type { Pdf2SizeOptions } from './pdf2size.js';

/** img2pdf no necesita adaptación especial de entorno browser. */
export { img2pdf } from './img2pdf.js';
