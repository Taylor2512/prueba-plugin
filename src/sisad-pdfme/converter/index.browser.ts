import * as pdfjsLib from 'pdfjs-dist//build/pdf';
import PDFJSWorkerUrl from 'pdfjs-dist//build/pdf.worker.min.js?url';
import { createEnvironmentConverters } from './createEnvironmentConverters.js';

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

const { pdf2img, pdf2size } = createEnvironmentConverters({
  getDocument: (pdf) =>
    pdfjsLib.getDocument({ data: pdf, isEvalSupported: false }).promise,
  createCanvas: (width, height) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
  },
  canvasToArrayBuffer: (canvas, imageType) => {
    const dataUrl = (canvas as HTMLCanvasElement).toDataURL(`image/${imageType}`);
    return dataURLToArrayBuffer(dataUrl);
  },
});

export { pdf2img, pdf2size };
export * from './index.shared.js';
