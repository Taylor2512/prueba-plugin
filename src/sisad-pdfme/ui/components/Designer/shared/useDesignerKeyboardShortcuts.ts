import { useEffect, useLayoutEffect, useRef } from 'react';
import type { CommandBus } from '../../../commands/commandBus.js';
import type { SchemaForUI } from '@sisad-pdfme/common';
import { DESIGNER_CLASSNAME } from '../../../constants.js';
import {
  getShortcuts,
  resolveShortcutByKeyboardEvent,
  type ShortcutDefinition,
} from './keyboardShortcutRegistry.js';
import type { SelectionCommandSet } from './selectionCommands.js';
import { isEditableTarget, isFocusInsideDesigner, shouldSuppressDesignerShortcuts } from './interactionGuards.js';

export type ShortcutHandlerContext = {
  activeSchemas: SchemaForUI[];
  pageSchemas: SchemaForUI[];
  visibleSchemas: SchemaForUI[];
  pageCursor: number;
  canEditStructure: boolean;
  activeDocumentId?: string;
  activeUserId?: string;
};

export type ShortcutHandler = (
  event: KeyboardEvent,
  shortcut: ShortcutDefinition,
  context: ShortcutHandlerContext,
) => boolean | void;

export type DesignerShortcutHandlers = Partial<Record<string, ShortcutHandler>>;

export type UseDesignerKeyboardShortcutsParams = {
  enabled: boolean;
  activeSchemas: SchemaForUI[];
  pageCursor: number;
  schemasList: SchemaForUI[][];
  visibleSchemasList?: SchemaForUI[][];
  shortcuts?: ShortcutDefinition[];
  commandBus?: Pick<CommandBus, 'undo' | 'redo' | 'canUndo' | 'canRedo'> | null;
  selectionCommands?: SelectionCommandSet | null;
  canEditStructure: boolean;
  activeDocumentId?: string;
  activeUserId?: string;
  isModalOpen?: boolean;
  isInlineEditing?: boolean;
  handlers?: DesignerShortcutHandlers;
  onOpenShortcutPanel?: () => void;
  onOpenDetail?: () => void;
  onAddComment?: () => void;
  onInsertSchemaByType?: (type: string) => void;
  onSelectAllVisible?: () => void;
  onClearSelection?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onFitPage?: () => void;
  onFitWidth?: () => void;
  onZoom100?: () => void;
  onNextPage?: () => void;
  onPreviousPage?: () => void;
  onMove?: (direction: 'up' | 'down' | 'left' | 'right', step: 'normal' | 'fast' | 'fine', event: KeyboardEvent) => void;
  onGroup?: () => void;
  onUngroup?: () => void;
  onShowInspector?: () => void;
  onCopyStyle?: () => void;
  onPasteStyle?: () => void;
};

const getMoveStep = (event: KeyboardEvent): 'normal' | 'fast' | 'fine' => {
  if (event.altKey) return 'fine';
  if (event.shiftKey) return 'fast';
  return 'normal';
};

const DESIGNER_ROOT_SELECTOR = `.${DESIGNER_CLASSNAME}root`;

export const shouldIgnoreShortcutEvent = (
  event: KeyboardEvent,
  shortcut: ShortcutDefinition,
  context: Pick<UseDesignerKeyboardShortcutsParams, 'isModalOpen' | 'isInlineEditing'>,
) => {
  const target = event.target;
  if (context.isModalOpen || context.isInlineEditing) return true;
  if (isEditableTarget(target) || shouldSuppressDesignerShortcuts(target, { isModalOpen: false })) return true;

  const focusInsideDesigner = isFocusInsideDesigner(target, DESIGNER_ROOT_SELECTOR);

  if (!focusInsideDesigner && shortcut.scope !== 'global') {
    return true;
  }

  return false;
};

const callbackCommands: Partial<Record<string, keyof UseDesignerKeyboardShortcutsParams>> = {
  addComment: 'onAddComment',
  zoomIn: 'onZoomIn',
  zoomOut: 'onZoomOut',
  fitPage: 'onFitPage',
  fitWidth: 'onFitWidth',
  zoom100: 'onZoom100',
  nextPage: 'onNextPage',
  previousPage: 'onPreviousPage',
  selectAllVisible: 'onSelectAllVisible',
  clearSelection: 'onClearSelection',
  showInspector: 'onShowInspector',
};

const selectionCommands: Partial<Record<string, keyof SelectionCommandSet>> = {
  copy: 'copySelection',
  cut: 'cutSelection',
  paste: 'pasteSelection',
  duplicate: 'duplicateSelection',
};

const insertTypes: Record<string, string> = {
  insertText: 'text',
  insertSignature: 'signature',
  insertInitial: 'initial',
  insertName: 'name',
  insertEmail: 'email',
  insertDate: 'date',
  insertCheckbox: 'checkbox',
  insertRadio: 'radioGroup',
  insertSelect: 'select',
};

const invokeOptionalCallback = (
  current: UseDesignerKeyboardShortcutsParams,
  key: keyof UseDesignerKeyboardShortcutsParams,
) => {
  const callback = current[key];
  if (typeof callback === 'function') callback();
};

const executeShortcutAction = (
  event: KeyboardEvent,
  shortcut: ShortcutDefinition,
  current: UseDesignerKeyboardShortcutsParams,
): boolean => {
  const pageSchemas = current.schemasList[current.pageCursor] || [];
  const visibleSchemas = current.visibleSchemasList?.[current.pageCursor] || pageSchemas;
  const context: ShortcutHandlerContext = {
    activeSchemas: current.activeSchemas,
    pageSchemas,
    visibleSchemas,
    pageCursor: current.pageCursor,
    canEditStructure: current.canEditStructure,
    activeDocumentId: current.activeDocumentId,
    activeUserId: current.activeUserId,
  };

  if (shortcut.id === 'openShortcuts') {
    if (current.onOpenShortcutPanel) current.onOpenShortcutPanel();
    else window.dispatchEvent(new CustomEvent('sisad-pdfme:shortcut-open-panel'));
    return true;
  }
  if (shortcut.id === 'openDetail') {
    if (current.onOpenDetail) current.onOpenDetail();
    else current.selectionCommands?.openProperties?.();
    return true;
  }

  const callbackKey = callbackCommands[shortcut.id];
  if (callbackKey) {
    invokeOptionalCallback(current, callbackKey);
    return true;
  }

  if (shortcut.id === 'undo' || shortcut.id === 'redo') {
    const canExecute = shortcut.id === 'undo' ? current.commandBus?.canUndo?.() : current.commandBus?.canRedo?.();
    if (!canExecute) return false;
    void (shortcut.id === 'undo' ? current.commandBus?.undo() : current.commandBus?.redo());
    return true;
  }

  const selectionCommand = selectionCommands[shortcut.id];
  if (selectionCommand) {
    const command = current.selectionCommands?.[selectionCommand];
    if (typeof command === 'function') command();
    return true;
  }
  if (shortcut.id === 'delete') return Boolean(current.selectionCommands?.deleteSelection?.());
  if (shortcut.id === 'recipientPrevious' || shortcut.id === 'recipientNext') {
    current.selectionCommands?.changeRecipient?.(shortcut.id === 'recipientPrevious' ? 'previous' : 'next');
    return true;
  }

  if (shortcut.id === 'moveUp' || shortcut.id === 'moveDown' || shortcut.id === 'moveLeft' || shortcut.id === 'moveRight') {
    const direction = shortcut.id.slice(4).toLowerCase() as 'up' | 'down' | 'left' | 'right';
    current.onMove?.(direction, getMoveStep(event), event);
    return true;
  }

  const insertType = insertTypes[shortcut.id];
  if (insertType) {
    current.onInsertSchemaByType?.(insertType);
    return true;
  }

  if (shortcut.id === 'group' || shortcut.id === 'ungroup') {
    const callback = shortcut.id === 'group' ? current.onGroup : current.onUngroup;
    const fallback = shortcut.id === 'group'
      ? current.selectionCommands?.groupSelection
      : current.selectionCommands?.ungroupSelection;
    if (callback) callback();
    else fallback?.();
    return true;
  }

  if (shortcut.id === 'copyStyle' || shortcut.id === 'pasteStyle') {
    const callback = shortcut.id === 'copyStyle' ? current.onCopyStyle : current.onPasteStyle;
    const fallback = shortcut.id === 'copyStyle'
      ? current.selectionCommands?.copyStyle
      : current.selectionCommands?.pasteStyle;
    if (callback) callback();
    else fallback?.();
    return true;
  }

  const handler = current.handlers?.[shortcut.id] ||
    (shortcut.actionId ? current.handlers?.[shortcut.actionId] : undefined) ||
    (shortcut.commandId ? current.handlers?.[shortcut.commandId] : undefined);
  if (!handler) return false;
  return handler(event, shortcut, context) !== false;
};

export const useDesignerKeyboardShortcuts = (params: UseDesignerKeyboardShortcutsParams) => {
  const { enabled } = params;
  const paramsRef = useRef(params);

  useLayoutEffect(() => {
    paramsRef.current = params;
  }, [params]);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return undefined;

    const onKeyDown = (event: KeyboardEvent) => {
      const current = paramsRef.current;
      if (!current.enabled || event.defaultPrevented) return;

      const shortcut = resolveShortcutByKeyboardEvent(event, current.shortcuts ?? getShortcuts());
      if (!shortcut) return;

      if (shouldIgnoreShortcutEvent(event, shortcut, current)) {
        // When schemas are actively selected, allow selection- and canvas-scoped
        // shortcuts to fire even if focus drifted outside the designer root
        // (e.g. user clicked a schema on page 2 but the canvas container did not
        // receive programmatic focus).
        const canBypassFocusCheck =
          (shortcut.scope === 'selection' || shortcut.scope === 'canvas') &&
          current.activeSchemas.length > 0 &&
          !current.isModalOpen &&
          !current.isInlineEditing &&
          !isEditableTarget(event.target);
        if (!canBypassFocusCheck) return;
      }
      if (shortcut.requiresSelection && current.activeSchemas.length === 0) return;
      if (shortcut.requiresEditableStructure && !current.canEditStructure) return;
      const handled = executeShortcutAction(event, shortcut, current);
      if (!handled) return;

      if (
        shortcut.id === 'openShortcuts' ||
        shortcut.id === 'openDetail' ||
        shortcut.id === 'addComment' ||
        shortcut.id === 'duplicate' ||
        shortcut.id === 'delete' ||
        shortcut.id === 'copy' ||
        shortcut.id === 'cut' ||
        shortcut.id === 'paste' ||
        shortcut.id === 'recipientPrevious' ||
        shortcut.id === 'recipientNext' ||
        shortcut.id === 'selectAllVisible' ||
        shortcut.id === 'clearSelection' ||
        shortcut.id === 'group' ||
        shortcut.id === 'ungroup' ||
        shortcut.id === 'showInspector' ||
        shortcut.id === 'copyStyle' ||
        shortcut.id === 'pasteStyle' ||
        shortcut.id.startsWith('move') ||
        shortcut.id.startsWith('insert')
      ) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      if (shortcut.id === 'undo' || shortcut.id === 'redo') {
        event.preventDefault();
        return;
      }
    };

    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, [enabled]);
};

export default useDesignerKeyboardShortcuts;
