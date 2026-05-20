const EDITABLE_SELECTOR = [
  'input',
  'textarea',
  'select',
  'button[role="switch"]',
  '[role="switch"]',
  '[role="checkbox"]',
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
  '.ant-switch',
  '.ant-switch-handle',
  '.ant-switch-inner',
  '.ant-checkbox',
  '.ant-checkbox-wrapper',
  '.ant-checkbox-input',
  '.ant-checkbox-inner',
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

export type DesignerInteractionMode =
  | 'idle'
  | 'dragging-plugin'
  | 'dragging-schema'
  | 'resizing-schema'
  | 'rotating-schema'
  | 'region-selecting'
  | 'inline-editing'
  | 'commenting'
  | 'panning'
  | 'command-running'
  | 'sidebar-editing';

export type DesignerInteractionState = {
  mode: DesignerInteractionMode;
  activePointerId?: number;
  activeSchemaIds: string[];
  activeFileId?: string;
  activePageIndex?: number;
  isKeyboardInputFocused: boolean;
  isDraggingFromPalette: boolean;
  isOverCanvas: boolean;
  isOverPage: boolean;
};

export type DesignerInteractionBlockContext = {
  phase?: string;
  isModalOpen?: boolean;
  isInlineEditing?: boolean;
  isDraggingPlugin?: boolean;
  isResizing?: boolean;
  isRotating?: boolean;
  isKeyboardInputFocused?: boolean;
  isDraggingFromPalette?: boolean;
  isOverCanvas?: boolean;
  isOverPage?: boolean;
};

const deriveInteractionState = (context: DesignerInteractionBlockContext = {}): DesignerInteractionState => ({
  mode:
    context.phase === 'dragging-plugin'
      ? 'dragging-plugin'
      : context.phase === 'dragging-schema'
        ? 'dragging-schema'
        : context.phase === 'resizing-schema'
          ? 'resizing-schema'
          : context.phase === 'rotating-schema'
            ? 'rotating-schema'
            : context.phase === 'inline-editing'
              ? 'inline-editing'
              : context.phase === 'commenting'
                ? 'commenting'
                : context.phase === 'panning'
                  ? 'panning'
                  : context.isDraggingPlugin
                    ? 'dragging-plugin'
                    : context.isResizing
                      ? 'resizing-schema'
                      : context.isRotating
                        ? 'rotating-schema'
                        : context.isInlineEditing
                          ? 'inline-editing'
                          : 'idle',
  activeSchemaIds: [],
  isKeyboardInputFocused: Boolean(context.isKeyboardInputFocused),
  isDraggingFromPalette: Boolean(context.isDraggingFromPalette || context.isDraggingPlugin),
  isOverCanvas: context.isOverCanvas !== false,
  isOverPage: context.isOverPage !== false,
});

export const canStartInteraction = (
  current: DesignerInteractionState,
  nextMode: DesignerInteractionMode,
  context: DesignerInteractionBlockContext = {},
): boolean => {
  if (current.mode === nextMode) return true;
  if (context.isModalOpen && nextMode !== 'command-running' && nextMode !== 'sidebar-editing') return false;
  if (current.isKeyboardInputFocused && nextMode !== 'sidebar-editing') return false;

  switch (current.mode) {
    case 'dragging-plugin':
      return nextMode !== 'region-selecting' && nextMode !== 'dragging-schema';
    case 'dragging-schema':
      return nextMode !== 'region-selecting' && nextMode !== 'dragging-plugin';
    case 'resizing-schema':
    case 'rotating-schema':
    case 'inline-editing':
    case 'commenting':
    case 'panning':
      return nextMode === 'sidebar-editing';
    default:
      break;
  }

  if (current.isDraggingFromPalette && nextMode === 'region-selecting') return false;
  if (!current.isOverCanvas && nextMode === 'region-selecting') return false;
  if (!current.isOverPage && nextMode === 'dragging-schema') return false;

  return true;
};

export const shouldSuppressDesignerShortcuts = (
  eventTarget: EventTarget | null | undefined,
  context: DesignerInteractionBlockContext = {},
): boolean => {
  if (isEditableTarget(eventTarget) || isAntDPopupTarget(eventTarget) || isAntDPopupOpen()) {
    return true;
  }

  const current = deriveInteractionState(context);
  return !canStartInteraction(current, 'command-running', context);
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

  if (context.externalSchemaDragActive || context.isCanvasDragging || context.isSchemaDragging) return true;

  const current = deriveInteractionState(context);
  return !canStartInteraction(current, 'region-selecting', context);
};
