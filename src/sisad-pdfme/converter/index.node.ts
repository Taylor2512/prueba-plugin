import * as pdfjsLib from 'pdfjs-dist//build/pdf';
import { createRequire } from 'node:module';
import PDFJSWorker from 'pdfjs-dist//build/pdf.worker.js';
import { createEnvironmentConverters } from '@sisad-pdfme/converter/createEnvironmentConverters';

/**
 * Entry point para Node.js.
 *
 * Este archivo adapta las funciones core del converter al entorno Node:
 * - configura worker de PDF.js para Node;
 * - intenta cargar el paquete opcional `canvas`;
 * - convierte el canvas de Node a Buffer/ArrayBuffer;
 * - mantiene la misma API pública que el entry browser.
 */
let createCanvas: (width: number, height: number) => unknown;
const loadOptionalNodeModule = createRequire(import.meta.url);

try {
  /**
   * `canvas` es una dependencia nativa opcional.
   * Si no existe, `pdf2img` fallará al intentar crear canvas,
   * pero `pdf2size` todavía puede funcionar porque solo lee páginas.
   */
  ({ createCanvas } = loadOptionalNodeModule('canvas'));
} catch (error) {
  if (error && typeof error === 'object' && 'code' in error && error.code !== 'MODULE_NOT_FOUND') {
    throw error;
  }
}

/** Configura el worker de PDF.js para el entorno Node. */
pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJSWorker as unknown as string;

const { pdf2img, pdf2size } = createEnvironmentConverters({
  getDocument: (pdf) =>
    pdfjsLib.getDocument({ data: pdf, isEvalSupported: false }).promise,
  createCanvas: (width, height) =>
    createCanvas(width, height) as unknown as HTMLCanvasElement,
  canvasToArrayBuffer: (canvas) => {
    const nodeCanvas = canvas as unknown as { toBuffer: () => Uint8Array };
    const bytes = new Uint8Array(nodeCanvas.toBuffer());
    return bytes.buffer.slice(
      bytes.byteOffset,
      bytes.byteOffset + bytes.byteLength,
    ) as ArrayBuffer;
  },
});

export { pdf2img, pdf2size };
export * from '@sisad-pdfme/converter/index.shared';
