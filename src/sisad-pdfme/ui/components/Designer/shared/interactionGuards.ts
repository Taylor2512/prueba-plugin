import {
  ANTD_POPUP_SELECTORS,
  DESKTOP_EDITABLE_TARGET_SELECTORS,
  buildSelectorList,
} from './interactionTargetSelectors.js';
import { resolveInteractionTarget } from './interactionTargetResolver.js';

const ANTD_POPUP_SELECTOR = buildSelectorList(ANTD_POPUP_SELECTORS);
const DESKTOP_EDITABLE_TARGET_SELECTOR = buildSelectorList(DESKTOP_EDITABLE_TARGET_SELECTORS);

/**
 * Determina si el target es un elemento de edición (input, selector, dropdown).
 */
export const isEditableTarget = (target: EventTarget | null | undefined): boolean => {
  if (!(target instanceof HTMLElement)) return false;
  const resolved = resolveInteractionTarget(target);
  if (
    resolved.kind === 'option-internal' ||
    resolved.kind === 'group-add-option' ||
    resolved.kind === 'interactive-control'
  ) {
    return true;
  }
  return Boolean(target.closest(DESKTOP_EDITABLE_TARGET_SELECTOR) || target.matches(DESKTOP_EDITABLE_TARGET_SELECTOR));
};

/**
 * Determina si el target es parte de un popup de Ant Design.
 */
export const isAntDPopupTarget = (target: EventTarget | null | undefined): boolean => {
  if (!(target instanceof HTMLElement)) return false;
  return Boolean(target.closest(ANTD_POPUP_SELECTOR) || target.matches(ANTD_POPUP_SELECTOR));
};

/**
 * Verifica si hay algún popup de Ant Design abierto en el documento.
 */
export const isAntDPopupOpen = (): boolean => {
  if (typeof document === 'undefined') return false;
  return Boolean(document.querySelector(ANTD_POPUP_SELECTOR));
};

/**
 * Verifica si el foco o el target viven dentro del árbol principal del diseñador.
 */
export const isFocusInsideDesigner = (target: EventTarget | null | undefined, designerRootSelector: string): boolean => {
  if (!(target instanceof HTMLElement)) return false;
  return Boolean(target.closest(designerRootSelector) || target.matches(designerRootSelector));
};

type ShouldSuppressDesignerShortcutsOptions = {
  isModalOpen?: boolean;
};

/**
 * Determina si los atajos del diseñador deben bloquearse para el target actual.
 * Se usa para evitar que teclas globales interfieran con inputs, popups o modales.
 */
export const shouldSuppressDesignerShortcuts = (
  target: EventTarget | null | undefined,
  options: ShouldSuppressDesignerShortcutsOptions = {},
): boolean => {
  if (options.isModalOpen) return true;
  if (isEditableTarget(target)) return true;
  if (isAntDPopupTarget(target) || isAntDPopupOpen()) return true;
  return false;
};

type ShouldSuppressCanvasRegionSelectionOptions = ShouldSuppressDesignerShortcutsOptions & {
  isInlineEditing?: boolean;
  isSchemaDragging?: boolean;
  isResizing?: boolean;
  isRotating?: boolean;
  externalSchemaDragActive?: boolean;
};

export type SchemaMutationPermissionDecision = {
  allowed: boolean;
  message?: string;
  reason?: string;
};

type SchemaMutationPermissionOptions = {
  schemaId?: string;
  source?: string;
  canEditStructure?: boolean;
  isReadonly?: boolean;
  isLockedByOtherUser?: boolean;
  schemaRecipientId?: string | null;
  activeRecipientId?: string | null;
};

/**
 * Evita que Selecto arranque sobre controles, edición o estados transitorios del canvas.
 */
export const shouldSuppressCanvasRegionSelection = (
  target: EventTarget | null | undefined,
  options: ShouldSuppressCanvasRegionSelectionOptions = {},
): boolean => {
  if (
    options.isModalOpen ||
    options.isInlineEditing ||
    options.isSchemaDragging ||
    options.isResizing ||
    options.isRotating ||
    options.externalSchemaDragActive
  ) {
    return true;
  }

  if (shouldSuppressDesignerShortcuts(target, options)) return true;

  const resolved = resolveInteractionTarget(target);
  return resolved.kind !== 'schema-root' && resolved.kind !== 'canvas-empty';
};

/**
 * Evalúa si una mutación sobre un schema está permitida en el contexto actual.
 */
export const evaluateSchemaMutationPermission = (
  options: SchemaMutationPermissionOptions,
): SchemaMutationPermissionDecision => {
  if (options.canEditStructure === false) {
    return { allowed: false, reason: 'structure-readonly', message: 'La estructura está bloqueada para edición.' };
  }

  if (options.isReadonly) {
    return { allowed: false, reason: 'readonly', message: 'El campo es de solo lectura.' };
  }

  if (options.isLockedByOtherUser) {
    return { allowed: false, reason: 'locked-by-other', message: 'El campo está bloqueado por otro usuario.' };
  }

  const activeRecipientId = String(options.activeRecipientId || '').trim();
  const schemaRecipientId = String(options.schemaRecipientId || '').trim();
  if (activeRecipientId && schemaRecipientId && activeRecipientId !== schemaRecipientId) {
    return { allowed: false, reason: 'recipient-mismatch', message: 'El campo pertenece a otro destinatario.' };
  }

  return { allowed: true, reason: 'allowed' };
};

const LEFT_SIDEBAR_SCROLL_LOCK_SELECTOR = buildSelectorList([
  '.sisad-pdfme-designer-left-sidebar',
  '.sisad-pdfme-designer-left-sidebar-main',
  '.sisad-pdfme-designer-left-sidebar-content',
  '.sisad-pdfme-designer-left-sidebar-group-items',
  '[data-left-sidebar-scroll]',
  '[data-sidebar-scroll-container]',
] as const);

type SidebarScrollSnapshot = {
  element: HTMLElement;
  left: number;
  top: number;
};

export type SidebarScrollLockRelease = () => void;

const collectSidebarScrollContainers = (root: HTMLElement): HTMLElement[] => {
  const candidates = Array.from(root.querySelectorAll<HTMLElement>(LEFT_SIDEBAR_SCROLL_LOCK_SELECTOR));
  const unique = new Set<HTMLElement>();
  candidates.forEach((element) => {
    if (root.contains(element)) {
      unique.add(element);
    }
  });
  return Array.from(unique);
};

const isSidebarScrollTarget = (target: EventTarget | null | undefined): boolean => {
  if (!(target instanceof HTMLElement)) return false;
  return Boolean(target.closest(LEFT_SIDEBAR_SCROLL_LOCK_SELECTOR) || target.matches(LEFT_SIDEBAR_SCROLL_LOCK_SELECTOR));
};

const restoreScrollSnapshots = (snapshots: SidebarScrollSnapshot[]) => {
  snapshots.forEach(({ element, left, top }) => {
    if (element.scrollLeft !== left) {
      element.scrollLeft = left;
    }
    if (element.scrollTop !== top) {
      element.scrollTop = top;
    }
  });
};

/**
 * Bloquea el scroll del sidebar izquierdo para evitar saltos durante DND.
 */
export const lockDesignerSidebarScroll = (
  root: HTMLElement | null | undefined,
): SidebarScrollLockRelease | null => {
  if (!root || typeof window === 'undefined' || typeof document === 'undefined') {
    return null;
  }

  const containers = collectSidebarScrollContainers(root);
  if (containers.length === 0) {
    return () => {};
  }

  const snapshots: SidebarScrollSnapshot[] = containers.map((element) => ({
    element,
    left: element.scrollLeft,
    top: element.scrollTop,
  }));

  const restore = () => restoreScrollSnapshots(snapshots);

  const preventScroll = (event: Event) => {
    if (!isSidebarScrollTarget(event.target)) {
      restore();
    }
  };

  root.addEventListener('scroll', preventScroll, { capture: true, passive: true });
  window.addEventListener('scroll', restore, { passive: true });

  return () => {
    root.removeEventListener('scroll', preventScroll, { capture: true });
    window.removeEventListener('scroll', restore);
  };
};

/**
 * Libera un lock de scroll si existe.
 */
export const unlockDesignerSidebarScroll = (release: SidebarScrollLockRelease | null | undefined) => {
  if (typeof release === 'function') {
    release();
  }
};

/**
 * Detiene la propagación de eventos de puntero en el inspector.
 */
export const stopInspectorPointerEvent = (e: React.PointerEvent | React.MouseEvent | React.DragEvent) => {
  e.stopPropagation();
};
