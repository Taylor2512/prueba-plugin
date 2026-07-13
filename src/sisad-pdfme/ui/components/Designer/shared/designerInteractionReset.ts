/**
 * designerInteractionReset — limpia estado transitorio del diseñador.
 *
 * No toca la selección persistente ni los schemas. Solo ayuda a devolver el UI
 * a un estado neutro después de cerrar modales, menús contextuales o overlays.
 */

export type DesignerInteractionResetInput = {
  clearContextMenu?: () => void;
  clearInlineEdit?: () => void;
  clearDragState?: () => void;
  clearRegionSelection?: () => void;
  clearHoverState?: () => void;
  resumeKeyboardShortcuts?: () => void;
};

export const resetDesignerTransientInteractionState = ({
  clearContextMenu,
  clearInlineEdit,
  clearDragState,
  clearRegionSelection,
  clearHoverState,
  resumeKeyboardShortcuts,
}: DesignerInteractionResetInput = {}) => {
  clearContextMenu?.();
  clearInlineEdit?.();
  clearDragState?.();
  clearRegionSelection?.();
  clearHoverState?.();
  resumeKeyboardShortcuts?.();

  if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }

  if (typeof document !== 'undefined' && document.body instanceof HTMLElement) {
    document.body.style.pointerEvents = '';
    document.body.style.overflow = '';
  }
};
