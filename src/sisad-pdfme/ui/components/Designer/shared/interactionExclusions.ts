/**
 * interactionExclusions — superficie única para excluir controles y modales
 * de la interacción del canvas.
 *
 * La regla es simple: cualquier target con estas marcas no debe iniciar
 * selección por región ni transformación, y los eventos deben detenerse antes
 * de llegar al canvas.
 */

export const DESIGNER_INTERACTION_EXCLUSION_SELECTOR = [
  '[data-designer-control="true"]',
  '[data-interaction-exclusion="true"]',
  '[data-designer-modal="true"]',
  '.ant-modal-root',
  '.ant-modal-mask',
  '.ant-modal-wrap',
  '.ant-modal',
  '.ant-dropdown',
  '.ant-popover',
  '.ant-tooltip',
  '.ant-select-dropdown',
  '.ant-picker-dropdown',
  'input',
  'textarea',
  'select',
  '[role="button"]',
  '[role="dialog"]',
  '[contenteditable="true"]',
].join(',');

export const isDesignerInteractionExcluded = (target: EventTarget | null | undefined): boolean => {
  if (!(target instanceof HTMLElement)) return false;
  return Boolean(target.closest(DESIGNER_INTERACTION_EXCLUSION_SELECTOR) || target.matches(DESIGNER_INTERACTION_EXCLUSION_SELECTOR));
};

export const stopDesignerControlEvent = (event: {
  preventDefault?: () => void;
  stopPropagation?: () => void;
  nativeEvent?: Event | null;
}) => {
  event.preventDefault?.();
  event.stopPropagation?.();

  const nativeEvent = event.nativeEvent as Event & { stopImmediatePropagation?: () => void } | null | undefined;
  if (nativeEvent && typeof nativeEvent.stopImmediatePropagation === 'function') {
    nativeEvent.stopImmediatePropagation();
  }
};
