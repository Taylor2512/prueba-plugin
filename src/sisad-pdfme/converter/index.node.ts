import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
import PDFJSWorker from 'pdfjs-dist/legacy/build/pdf.worker.js';
import { createCanvas } from 'canvas';
import { pdf2img as _pdf2img, Pdf2ImgOptions } from './pdf2img.js';
import { pdf2size as _pdf2size, Pdf2SizeOptions } from './pdf2size.js';

pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJSWorker as unknown as string;

export const pdf2img = async (
  pdf: ArrayBuffer | Uint8Array,
  options: Pdf2ImgOptions = {},
): Promise<ArrayBuffer[]> =>
  _pdf2img(pdf, options, {
    getDocument: (pdf) => pdfjsLib.getDocument({ data: pdf, isEvalSupported: false }).promise,
    createCanvas: (width, height) => createCanvas(width, height) as unknown as HTMLCanvasElement,
    canvasToArrayBuffer: (canvas) => {
      // Node canvas from the 'canvas' package - treat as any to avoid typing mismatches
      const nodeCanvas = canvas as any;
      const buffer = nodeCanvas.toBuffer();
      return new Uint8Array(buffer).buffer;
    },
  });

export const pdf2size = async (pdf: ArrayBuffer | Uint8Array, options: Pdf2SizeOptions = {}) =>
  _pdf2size(pdf, options, {
    getDocument: (pdf) => pdfjsLib.getDocument({ data: pdf, isEvalSupported: false }).promise,
  });

export { img2pdf } from './img2pdf.js';
