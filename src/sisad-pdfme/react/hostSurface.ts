/**
 * Contrato público de dimensiones de los wrappers React.
 *
 * Regla: el host decide el viewport, el wrapper solo garantiza que el runtime
 * pueda ocupar el 100% de la caja que reciba sin desbordarla ni imponer
 * alturas propias. Por eso aquí no hay `100vh`, `position: fixed` ni
 * `max-width`: esas decisiones pertenecen al host.
 *
 * El nodo interno del runtime (`.sisad-pdfme-lab-runtime-host`) ya declara
 * `width/height: 100%` y `min-*: 0`; estas clases cierran la cadena de tamaño
 * entre el contenedor del host y ese nodo.
 */

/** Clases base aplicadas siempre al contenedor público del runtime. */
export const SISAD_PDFME_HOST_SURFACE_CLASS =
  'h-full min-h-0 w-full min-w-0 overflow-hidden';

/**
 * Combina las clases base con las que envía el host.
 *
 * Es aditivo a propósito: el host puede añadir clases, nunca perder el
 * contrato base por olvidarlo.
 */
export const mergeHostSurfaceClassName = (className?: string): string =>
  [SISAD_PDFME_HOST_SURFACE_CLASS, className].filter(Boolean).join(' ');
