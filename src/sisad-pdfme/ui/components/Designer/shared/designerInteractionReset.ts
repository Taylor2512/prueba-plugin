/**
 * designerInteractionReset — limpia estado transitorio del diseñador.
 *
 * Contrato (TASK-INTERACTION-016):
 * - NUNCA toca la selección persistente (`activeElements`) salvo que el caller
 *   pida explícitamente `keepSelection: false` Y provea `clearSelection`.
 * - Limpia region selection, drag, pointer, context menu, inline edit.
 * - Reactiva shortcuts y libera el lock de modal (`releaseModalLock`).
 * - Restaura `body.pointerEvents/overflow` si quedaron alterados.
 * - Solo hace blur si el foco quedó huérfano: elemento desconectado del DOM o
 *   dentro de un modal desmontado/oculto. Un blur incondicional robaría el foco
 *   a inputs legítimos del diseñador.
 */

export type DesignerInteractionResetInput = {
  /**
   * `true` (default): la selección persistente no se toca.
   * `false`: se invoca `clearSelection` (única vía para limpiar selección).
   */
  keepSelection?: boolean;
  clearSelection?: () => void;
  clearContextMenu?: () => void;
  clearInlineEdit?: () => void;
  clearDragState?: () => void;
  clearRegionSelection?: () => void;
  clearHoverState?: () => void;
  clearPointerState?: () => void;
  resumeKeyboardShortcuts?: () => void;
  /** Libera isModalOpen/modal lock del contexto de interacción. */
  releaseModalLock?: () => void;
};

/** Foco huérfano: desconectado, o dentro de un modal oculto/desmontado. */
const isOrphanedFocus = (element: Element): boolean => {
  if (!element.isConnected) return true;
  const modalHost = element.closest<HTMLElement>(
    '.ant-modal-wrap, .ant-modal-root, [data-designer-modal="true"]',
  );
  if (!modalHost) return false;
  if (modalHost.style.display === 'none') return true;
  if (modalHost.getAttribute('aria-hidden') === 'true') return true;
  return !modalHost.isConnected;
};

export const resetDesignerTransientInteractionState = ({
  keepSelection = true,
  clearSelection,
  clearContextMenu,
  clearInlineEdit,
  clearDragState,
  clearRegionSelection,
  clearHoverState,
  clearPointerState,
  resumeKeyboardShortcuts,
  releaseModalLock,
}: DesignerInteractionResetInput = {}) => {
  clearContextMenu?.();
  clearInlineEdit?.();
  clearDragState?.();
  clearRegionSelection?.();
  clearHoverState?.();
  clearPointerState?.();
  resumeKeyboardShortcuts?.();
  releaseModalLock?.();

  if (!keepSelection) {
    clearSelection?.();
  }

  if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
    const activeElement = document.activeElement;
    if (activeElement !== document.body && isOrphanedFocus(activeElement)) {
      activeElement.blur();
    }
  }

  if (typeof document !== 'undefined' && document.body instanceof HTMLElement) {
    document.body.style.pointerEvents = '';
    document.body.style.overflow = '';
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('sisad-pdfme:designer-interaction-reset'));
  }
};
