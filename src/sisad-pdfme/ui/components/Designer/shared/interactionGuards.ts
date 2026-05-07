const EDITABLE_SELECTOR = [
  'input',
  'textarea',
  'select',
  '[contenteditable=""]',
  '[contenteditable="true"]',
  '[contenteditable="plaintext-only"]',
  '[role="textbox"]',
  '.ant-input',
  '.ant-input-affix-wrapper',
  '.ant-input-number',
  '.ant-select',
  '.ant-select-selector',
  '.ant-select-dropdown',
  '.ant-picker',
  '.ant-picker-dropdown',
  '.ant-dropdown',
  '.ant-dropdown-menu',
  '.ant-popover',
  '.ant-popover-inner',
  '.ant-modal',
  '.ant-modal-content',
  '.ant-tooltip',
].join(', ');

const ANTD_POPUP_SELECTOR = [
  '.ant-select-dropdown',
  '.ant-dropdown',
  '.ant-popover',
  '.ant-modal',
  '.ant-tooltip',
  '.ant-picker-dropdown',
].join(', ');

export const isEditableTarget = (target: EventTarget | null | undefined): boolean => {
  if (!(target instanceof HTMLElement)) return false;
  return Boolean(target.closest(EDITABLE_SELECTOR) || target.matches(EDITABLE_SELECTOR));
};

export const isAntDPopupTarget = (target: EventTarget | null | undefined): boolean => {
  if (!(target instanceof HTMLElement)) return false;
  return Boolean(target.closest(ANTD_POPUP_SELECTOR) || target.matches(ANTD_POPUP_SELECTOR));
};

export const isAntDPopupOpen = (): boolean => {
  if (typeof document === 'undefined') return false;
  return Boolean(document.querySelector(ANTD_POPUP_SELECTOR));
};

export type DesignerInteractionBlockContext = {
  phase?: string;
  isModalOpen?: boolean;
  isInlineEditing?: boolean;
  isDraggingPlugin?: boolean;
  isResizing?: boolean;
  isRotating?: boolean;
};

export const shouldSuppressDesignerShortcuts = (
  eventTarget: EventTarget | null | undefined,
  context: DesignerInteractionBlockContext = {},
): boolean => {
  if (isEditableTarget(eventTarget) || isAntDPopupTarget(eventTarget) || isAntDPopupOpen()) {
    return true;
  }

  if (context.isModalOpen) return true;
  if (context.isInlineEditing) return true;
  if (context.isDraggingPlugin) return true;
  if (context.isResizing) return true;
  if (context.isRotating) return true;

  switch (context.phase) {
    case 'inline-editing':
    case 'dragging-plugin':
    case 'resizing-schema':
    case 'rotating-schema':
      return true;
    default:
      return false;
  }
};

export const shouldSuppressCanvasRegionSelection = (
  eventTarget: EventTarget | null | undefined,
  context: DesignerInteractionBlockContext & {
    isCanvasDragging?: boolean;
    isSchemaDragging?: boolean;
    externalSchemaDragActive?: boolean;
  } = {},
): boolean => {
  if (isEditableTarget(eventTarget) || isAntDPopupTarget(eventTarget) || isAntDPopupOpen()) {
    return true;
  }

  if (context.externalSchemaDragActive) return true;
  if (context.isCanvasDragging) return true;
  if (context.isSchemaDragging) return true;
  if (context.isInlineEditing) return true;
  if (context.isResizing) return true;
  if (context.isRotating) return true;
  if (context.isModalOpen) return true;

  switch (context.phase) {
    case 'inline-editing':
    case 'dragging-plugin':
    case 'resizing-schema':
    case 'rotating-schema':
      return true;
    default:
      return false;
  }
};
