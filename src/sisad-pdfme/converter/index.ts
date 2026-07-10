/**
 * Entry point público del paquete converter.
 *
 * Por defecto reexporta la implementación browser.
 * En builds específicos, el empaquetador puede apuntar a `index.node.ts`
 * para usar la versión adaptada a Node.
 */
export { pdf2img, pdf2size, img2pdf } from './index.browser.js';

/**
 * Alias semánticos más legibles para consumidores externos.
 * Mantienen compatibilidad con nombres más descriptivos:
 * - pdfToImages
 * - pdfToPageSizes
 * - imagesToPdf
 */
export { pdf2img as pdfToImages, pdf2size as pdfToPageSizes, img2pdf as imagesToPdf } from './index.browser.js';

/** Tipos públicos de opciones y formato de imagen. */
export type { Pdf2ImgOptions } from './pdf2img.js';
export type { Pdf2SizeOptions } from './pdf2size.js';
export type { Img2PdfOptions } from './img2pdf.js';
export type { ImageType } from './types.js';
