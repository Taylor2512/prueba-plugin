import type { PDFDocumentProxy } from 'pdfjs-dist';
import { Size, pt2mm } from '@sisad-pdfme/common';

/**
 * Adaptador de entorno para abrir documentos PDF.
 *
 * Se inyecta desde browser o Node para mantener este módulo sin dependencia
 * directa de configuración de PDF.js ni workers.
 */
interface Environment {
  getDocument: (pdf: ArrayBuffer | Uint8Array) => Promise<PDFDocumentProxy>;
}

/** Opciones de lectura de tamaños de página. */
export interface Pdf2SizeOptions {
  /** Escala usada por PDF.js para calcular viewport. Normalmente 1. */
  scale?: number;
}

/**
 * Obtiene el tamaño de cada página de un PDF en milímetros.
 *
 * PDF.js entrega viewport en puntos/píxeles de su sistema interno.
 * `pt2mm` convierte esas dimensiones al contrato usado por PDFME/SISAD.
 */
export async function pdf2size(
  pdf: ArrayBuffer | Uint8Array,
  options: Pdf2SizeOptions = {},
  env: Environment,
): Promise<Size[]> {
  const { scale = 1 } = options;
  const { getDocument } = env;

  const pdfDoc = await getDocument(pdf);

  /**
   * Lee todas las páginas en paralelo y devuelve [{ width, height }].
   * Se fuerza rotation: 0 para obtener el tamaño base de la página.
   */
  const promises = Promise.all(
    new Array(pdfDoc.numPages).fill('').map(async (_, i) => {
      return await pdfDoc.getPage(i + 1).then((page) => {
        const { height, width } = page.getViewport({ scale, rotation: 0 });

        return { height: pt2mm(height), width: pt2mm(width) };
      });
    }),
  );

  return promises;
}
