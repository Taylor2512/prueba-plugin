import {
  ANTD_POPUP_SELECTORS,
  buildSelectorList,
  DESKTOP_EDITABLE_TARGET_SELECTORS,
  DESKTOP_INTERACTIVE_EXCLUDED_SELECTORS,
} from './interactionTargetSelectors.js';

const EDITABLE_SELECTOR = buildSelectorList([
  ...DESKTOP_EDITABLE_TARGET_SELECTORS,
  ...DESKTOP_INTERACTIVE_EXCLUDED_SELECTORS,
  '.ant-dropdown-menu',
  '.ant-popover-inner',
  '.ant-modal-content',
] as const);

const ANTD_POPUP_SELECTOR = buildSelectorList(ANTD_POPUP_SELECTORS);

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

/**
 * Structured keyboard shortcut guard with IME composition support.
 *
 * Returns true when a global designer shortcut should be handled.
 * Blocks:
 *  - Events already consumed by the browser (defaultPrevented)
 *  - IME composition (isComposing) — prevents double-firing on CJK input
 *  - Open modals
 *  - Input/editable targets (unless Escape — to allow modal dismiss from input)
 *  - Inline-editing mode (only Escape/Enter/Tab pass through)
 */
export type ShortcutHandlerOpts = {
  /** Any modal/dialog/overlay is currently blocking the canvas */
  modalOpen: boolean;
  /** The canvas is in inline text-editing mode */
  inlineEditing: boolean;
  /** Current user has structural edit rights (guards destructive shortcuts) */
  canEditStructure: boolean;
};

export const shouldHandleDesignerShortcut = (
  event: KeyboardEvent,
  opts: ShortcutHandlerOpts,
): boolean => {
  if (event.defaultPrevented) return false;
  if (event.isComposing) return false;
  if (opts.modalOpen) return false;

  const target = event.target as HTMLElement | null;
  const editable =
    !!target?.closest(
      'input, textarea, select, [contenteditable=""], [contenteditable="true"], [contenteditable="plaintext-only"], [role="textbox"]',
    );

  if (editable && event.key !== 'Escape') return false;
  if (opts.inlineEditing && !['Escape', 'Enter', 'Tab'].includes(event.key)) return false;

  return true;
};

/**
 * Returns true when the keyboard event target or document.activeElement
 * is within the designer root element (identified by CSS selector).
 * Used to prevent non-global shortcuts from firing while the user
 * is interacting with elements outside the designer.
 */
export const isFocusInsideDesigner = (
  target: EventTarget | null | undefined,
  designerRootSelector: string,
): boolean => {
  if (typeof document === 'undefined') return false;
  const activeElement = document.activeElement;
  const targetInDesigner =
    target instanceof HTMLElement && Boolean(target.closest(designerRootSelector));
  const activeInDesigner =
    activeElement instanceof HTMLElement && Boolean(activeElement.closest(designerRootSelector));
  return targetInDesigner || activeInDesigner;
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

export type SchemaMutationSource =
  | 'canvas'
  | 'sidebar'
  | 'toolbar'
  | 'keyboard'
  | 'context-menu'
  | 'collaboration'
  | 'import-export'
  | 'command-bus';

export type SchemaMutationGuardContext = {
  schemaId: string;
  source: SchemaMutationSource;
  canEditStructure: boolean;
  isReadonly?: boolean;
  isLockedByOtherUser?: boolean;
  schemaRecipientId?: string | null;
  activeRecipientId?: string | null;
};

export type SchemaMutationDecision = {
  allowed: boolean;
  reason?:
    | 'readonly'
    | 'structure-disabled'
    | 'locked-by-other-user'
    | 'recipient-mismatch'
    | 'unknown';
  message?: string;
};

const normalizeNullable = (value: unknown) => {
  if (typeof value !== 'string') return null;
  const next = value.trim();
  return next || null;
};

export const evaluateSchemaMutationPermission = (
  context: SchemaMutationGuardContext,
): SchemaMutationDecision => {
  if (!context.canEditStructure) {
    return {
      allowed: false,
      reason: 'structure-disabled',
      message: 'No tienes permisos para modificar la estructura del documento.',
    };
  }

  if (context.isReadonly) {
    return {
      allowed: false,
      reason: 'readonly',
      message: 'Este campo está en modo solo lectura.',
    };
  }

  if (context.isLockedByOtherUser) {
    return {
      allowed: false,
      reason: 'locked-by-other-user',
      message: 'Este campo está bloqueado por otro usuario.',
    };
  }

  const schemaRecipientId = normalizeNullable(context.schemaRecipientId);
  const activeRecipientId = normalizeNullable(context.activeRecipientId);
  if (schemaRecipientId && activeRecipientId && schemaRecipientId !== activeRecipientId) {
    return {
      allowed: false,
      reason: 'recipient-mismatch',
      message: 'El campo pertenece a otro destinatario activo.',
    };
  }

  return { allowed: true };
};
