import { PDFDocument } from '@sisad-pdfme/pdf-lib';
import { mm2pt } from '@sisad-pdfme/common';
import type { ImageType } from './types.js';

/**
 * Opciones de conversión de imágenes a PDF.
 *
 * Responsabilidad del módulo:
 * - recibir una o varias imágenes como ArrayBuffer;
 * - crear un PDF nuevo;
 * - insertar una imagen por página;
 * - ajustar tamaño de página, escala y márgenes;
 * - devolver el PDF final como ArrayBuffer puro.
 *
 * Notas de unidades:
 * - `size` y `margin` se expresan en milímetros porque ese es el contrato
 *   habitual del editor PDFME/SISAD para medidas de documento.
 * - Internamente pdf-lib trabaja en puntos, por eso se usa `mm2pt`.
 */
export interface Img2PdfOptions {
  /** Escala inicial aplicada a la imagen antes de calcular el encaje en página. */
  scale?: number;

  /** Tipo esperado de imagen. Actualmente el detector interno decide entre jpeg/png. */
  imageType?: ImageType;

  /** Tamaño de página en milímetros. Si no se envía, se usa el tamaño de la imagen. */
  size?: { height: number; width: number };

  /** Márgenes en milímetros, en orden CSS-like: [top, right, bottom, left]. */
  margin?: [number, number, number, number];
}

/**
 * Detecta el tipo de imagen leyendo los bytes mágicos del buffer.
 *
 * Esta función evita depender solamente de una extensión o MIME externo,
 * porque la API recibe un ArrayBuffer sin metadata de archivo.
 *
 * Firmas usadas:
 * - JPEG: FF D8
 * - PNG:  89 50 4E 47 0D 0A 1A 0A
 */
function detectImageType(buffer: ArrayBuffer): 'jpeg' | 'png' | 'unknown' {
  const bytes = new Uint8Array(buffer);

  if (bytes.length >= 2 && bytes[0] === 0xff && bytes[1] === 0xd8) {
    return 'jpeg';
  }

  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return 'png';
  }

  return 'unknown';
}

/**
 * Convierte una lista de imágenes a un PDF multipágina.
 *
 * Comportamiento:
 * - cada imagen genera una página nueva;
 * - si `size` existe, todas las páginas usan ese tamaño;
 * - si `size` no existe, la página toma el tamaño escalado de la imagen;
 * - la imagen se centra dentro del área disponible;
 * - se respeta la relación de aspecto;
 * - no se hace upscale adicional al encajar (`Math.min(..., 1)`).
 *
 * Importante para SISAD PDFME:
 * este módulo no debe conocer Designer, Canvas, Snapshot ni schemas.
 * Es una utilidad pura de conversión para el paquete converter.
 */
export async function img2pdf(
  imgs: ArrayBuffer[],
  options: Img2PdfOptions = {},
): Promise<ArrayBuffer> {
  try {
    const { scale = 1, size, margin = [0, 0, 0, 0] } = options;

    /**
     * Validación mínima de entrada.
     * Sin imágenes no se puede crear un PDF útil.
     */
    if (!Array.isArray(imgs) || imgs.length === 0) {
      throw new Error('Input must be a non-empty array of image buffers');
    }

    const doc = await PDFDocument.create();

    for (const img of imgs) {
      try {
        let image;
        const type = detectImageType(img);

        /**
         * Embebe la imagen según su tipo detectado.
         * Si el tipo no se reconoce, intenta JPG y luego PNG como fallback.
         */
        if (type === 'jpeg') {
          image = await doc.embedJpg(img);
        } else if (type === 'png') {
          image = await doc.embedPng(img);
        } else {
          try {
            image = await doc.embedJpg(img);
          } catch {
            image = await doc.embedPng(img);
          }
        }

        const page = doc.addPage();

        /**
         * Tamaño de imagen después de aplicar escala inicial.
         */
        const { width: imgWidth, height: imgHeight } = image.scale(scale);

        /**
         * Tamaño de página:
         * - tamaño explícito en mm convertido a pt;
         * - o tamaño natural de la imagen escalada.
         */
        const pageWidth = size ? mm2pt(size.width) : imgWidth;
        const pageHeight = size ? mm2pt(size.height) : imgHeight;
        page.setSize(pageWidth, pageHeight);

        /**
         * Conversión de márgenes de mm a puntos.
         */
        const topMargin = mm2pt(margin[0]);
        const rightMargin = mm2pt(margin[1]);
        const bottomMargin = mm2pt(margin[2]);
        const leftMargin = mm2pt(margin[3]);

        /**
         * Área útil de la página después de descontar márgenes.
         */
        const availableWidth = pageWidth - leftMargin - rightMargin;
        const availableHeight = pageHeight - topMargin - bottomMargin;

        /**
         * Ratio para encajar la imagen en el área disponible.
         * Se limita a 1 para evitar agrandar imágenes pequeñas.
         */
        const widthRatio = availableWidth / imgWidth;
        const heightRatio = availableHeight / imgHeight;
        const ratio = Math.min(widthRatio, heightRatio, 1);

        /**
         * Dimensiones finales y coordenadas centradas.
         * pdf-lib usa origen inferior izquierdo para dibujar.
         */
        const finalWidth = imgWidth * ratio;
        const finalHeight = imgHeight * ratio;
        const x = leftMargin + (availableWidth - finalWidth) / 2;
        const y = bottomMargin + (availableHeight - finalHeight) / 2;

        page.drawImage(image, {
          x,
          y,
          width: finalWidth,
          height: finalHeight,
        });
      } catch (error) {
        throw new Error(`Failed to process image: ${(error as Error).message}`);
      }
    }

    const pdfUint8Array = await doc.save();

    /**
     * pdf-lib devuelve Uint8Array.
     * Aquí se crea un ArrayBuffer nuevo para mantener el contrato público.
     */
    const buffer = new ArrayBuffer(pdfUint8Array.byteLength);
    const view = new Uint8Array(buffer);
    view.set(pdfUint8Array);

    return buffer;
  } catch (error) {
    throw new Error(`[@sisad-pdfme/converter] img2pdf failed: ${(error as Error).message}`);
  }
}
