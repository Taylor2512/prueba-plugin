import type { CanvasRenderState } from '../../../../../canvas/canvasRenderState.js';

export type CanvasBlockReason =
  | 'loading'
  | 'error'
  | 'permission'
  | 'saving'
  | 'modal';

export type CanvasInteractionMode =
  | 'idle'
  | 'selecting'
  | 'dragging'
  | 'resizing'
  | 'rotating'
  | 'editing-text'
  | 'dragging-new-schema';

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

export const shouldDisplayBlockingMask = (
  blockReason: CanvasBlockReason | null,
  _interactionMode: CanvasInteractionMode,
): boolean => {
  return blockReason !== null;
};
