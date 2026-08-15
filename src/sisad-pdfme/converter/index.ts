/**
 * Entry point público del paquete converter.
 *
 * Por defecto reexporta la implementación browser.
 * En builds específicos, el empaquetador puede apuntar a `index.node.ts`
 * para usar la versión adaptada a Node.
 */
export { pdf2img, pdf2size, img2pdf } from '@sisad-pdfme/converter/index.browser';

/**
 * Alias semánticos más legibles para consumidores externos.
 * Mantienen compatibilidad con nombres más descriptivos:
 * - pdfToImages
 * - pdfToPageSizes
 * - imagesToPdf
 */
export { pdf2img as pdfToImages, pdf2size as pdfToPageSizes, img2pdf as imagesToPdf } from '@sisad-pdfme/converter/index.browser';

/** Tipos públicos de opciones y formato de imagen. */
export type { Pdf2ImgOptions } from '@sisad-pdfme/converter/pdf2img';
export type { Pdf2SizeOptions } from '@sisad-pdfme/converter/pdf2size';
export type { Img2PdfOptions } from '@sisad-pdfme/converter/img2pdf';
export type { ImageType } from '@sisad-pdfme/converter/types';
