/**
 * overlayState — reglas de bloqueo visual para estados del canvas.
 *
 * Convierte estados de render en razones de bloqueo y decide cuándo mostrar
 * una máscara de interacción. Mantiene esta decisión fuera de Canvas.tsx.
 */

import type { CanvasRenderState } from '@sisad-pdfme/canvas/canvasRenderState';

/**
 * Razones normalizadas por las que el canvas debe bloquear interacción.
 */
export type CanvasBlockReason =
  | 'loading'
  | 'error'
  | 'permission'
  | 'saving'
  | 'modal';

/**
 * Modos de interacción considerados por la capa de overlays.
 */
export type CanvasInteractionMode =
  | 'idle'
  | 'selecting'
  | 'dragging'
  | 'resizing'
  | 'rotating'
  | 'editing-text'
  | 'dragging-new-schema';

/**
 * Deriva una razón de bloqueo desde el estado de render del canvas.
 */
export const deriveCanvasBlockReason = (
  state: CanvasRenderState,
): CanvasBlockReason | null => {
  switch (state.type) {
    case 'loading_document':
    case 'loading_page':
    case 'document_switching':
      return 'loading';
    case 'render_error':
    case 'pdf_load_error':
      return 'error';
    default:
      return null;
  }
};

/**
 * Decide si debe mostrarse máscara de bloqueo para el estado actual.
 *
 * Hoy cualquier razón de bloqueo muestra máscara; el modo queda disponible para
 * reglas futuras que dependan de drag/resize/edición.
 */
export const shouldDisplayBlockingMask = (
  blockReason: CanvasBlockReason | null,
  _interactionMode: CanvasInteractionMode,
): boolean => {
  return blockReason !== null;
};
