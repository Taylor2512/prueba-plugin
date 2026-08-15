import type { PDFDocumentProxy } from 'pdfjs-dist';
import type { ImageType } from '@sisad-pdfme/converter/types';
import type { Pdf2ImgOptions } from '@sisad-pdfme/converter/pdf2img';
import type { Pdf2SizeOptions } from '@sisad-pdfme/converter/pdf2size';
import { pdf2img as convertPdfToImages } from '@sisad-pdfme/converter/pdf2img';
import { pdf2size as readPdfPageSizes } from '@sisad-pdfme/converter/pdf2size';

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
