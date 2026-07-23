import type { PDFDocumentProxy } from 'pdfjs-dist';
import type { ImageType } from './types.js';
import type { Pdf2ImgOptions } from './pdf2img.js';
import type { Pdf2SizeOptions } from './pdf2size.js';
import { pdf2img as convertPdfToImages } from './pdf2img.js';
import { pdf2size as readPdfPageSizes } from './pdf2size.js';

type ConverterCanvas = HTMLCanvasElement | OffscreenCanvas;

export type PdfConverterEnvironment = {
  getDocument: (
    pdf: ArrayBuffer | Uint8Array,
  ) => Promise<PDFDocumentProxy>;
  createCanvas: (width: number, height: number) => ConverterCanvas;
  canvasToArrayBuffer: (
    canvas: ConverterCanvas,
    imageType: ImageType,
  ) => ArrayBuffer;
};

export const createEnvironmentConverters = (
  environment: PdfConverterEnvironment,
) => ({
  pdf2img: (
    pdf: ArrayBuffer | Uint8Array,
    options: Pdf2ImgOptions = {},
  ): Promise<ArrayBuffer[]> => convertPdfToImages(pdf, options, environment),

  pdf2size: (
    pdf: ArrayBuffer | Uint8Array,
    options: Pdf2SizeOptions = {},
  ) => readPdfPageSizes(pdf, options, { getDocument: environment.getDocument }),
});
