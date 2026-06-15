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

const getInsertType = (shortcutId: string) => {
  switch (shortcutId) {
    case 'insertText':
      return 'text';
    case 'insertSignature':
      return 'signature';
    case 'insertInitial':
      return 'initial';
    case 'insertName':
      return 'name';
    case 'insertEmail':
      return 'email';
    case 'insertDate':
      return 'date';
    case 'insertCheckbox':
      return 'checkbox';
    case 'insertRadio':
      return 'radioGroup';
    case 'insertSelect':
      return 'select';
    default:
      return '';
  }
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
    if (current.onOpenShortcutPanel) {
      current.onOpenShortcutPanel();
    } else {
      window.dispatchEvent(new CustomEvent('sisad-pdfme:shortcut-open-panel'));
    }
    return true;
  }

  if (shortcut.id === 'openDetail') {
    if (current.onOpenDetail) {
      current.onOpenDetail();
      return true;
    }
    current.selectionCommands?.openProperties?.();
    return true;
  }

  if (shortcut.id === 'addComment') {
    current.onAddComment?.();
    return true;
  }

  if (shortcut.id === 'zoomIn') {
    current.onZoomIn?.();
    return true;
  }

  if (shortcut.id === 'zoomOut') {
    current.onZoomOut?.();
    return true;
  }

  if (shortcut.id === 'fitPage') {
    current.onFitPage?.();
    return true;
  }

  if (shortcut.id === 'fitWidth') {
    current.onFitWidth?.();
    return true;
  }

  if (shortcut.id === 'zoom100') {
    current.onZoom100?.();
    return true;
  }

  if (shortcut.id === 'nextPage') {
    current.onNextPage?.();
    return true;
  }

  if (shortcut.id === 'previousPage') {
    current.onPreviousPage?.();
    return true;
  }

  if (shortcut.id === 'selectAllVisible') {
    current.onSelectAllVisible?.();
    return true;
  }

  if (shortcut.id === 'clearSelection') {
    current.onClearSelection?.();
    return true;
  }

  if (shortcut.id === 'undo') {
    if (current.commandBus?.canUndo?.()) {
      void current.commandBus.undo();
      return true;
    }
    return false;
  }

  if (shortcut.id === 'redo') {
    if (current.commandBus?.canRedo?.()) {
      void current.commandBus.redo();
      return true;
    }
    return false;
  }

  if (shortcut.id === 'copy') {
    current.selectionCommands?.copySelection?.();
    return true;
  }

  if (shortcut.id === 'cut') {
    current.selectionCommands?.cutSelection?.();
    return true;
  }

  if (shortcut.id === 'paste') {
    current.selectionCommands?.pasteSelection?.();
    return true;
  }

  if (shortcut.id === 'duplicate') {
    current.selectionCommands?.duplicateSelection?.();
    return true;
  }

  if (shortcut.id === 'delete') {
    return Boolean(current.selectionCommands?.deleteSelection?.());
  }

  if (shortcut.id === 'recipientPrevious') {
    current.selectionCommands?.changeRecipient?.('previous');
    return true;
  }

  if (shortcut.id === 'recipientNext') {
    current.selectionCommands?.changeRecipient?.('next');
    return true;
  }

  if (shortcut.id === 'moveUp' || shortcut.id === 'moveDown' || shortcut.id === 'moveLeft' || shortcut.id === 'moveRight') {
    current.onMove?.(
      shortcut.id === 'moveUp'
        ? 'up'
        : shortcut.id === 'moveDown'
          ? 'down'
          : shortcut.id === 'moveLeft'
            ? 'left'
            : 'right',
      getMoveStep(event),
      event,
    );
    return true;
  }

  if (
    shortcut.id === 'insertText' ||
    shortcut.id === 'insertSignature' ||
    shortcut.id === 'insertInitial' ||
    shortcut.id === 'insertName' ||
    shortcut.id === 'insertEmail' ||
    shortcut.id === 'insertDate' ||
    shortcut.id === 'insertCheckbox' ||
    shortcut.id === 'insertRadio' ||
    shortcut.id === 'insertSelect'
  ) {
    current.onInsertSchemaByType?.(getInsertType(shortcut.id));
    return true;
  }

  if (shortcut.id === 'group') {
    if (current.onGroup) {
      current.onGroup();
    } else {
      current.selectionCommands?.groupSelection?.();
    }
    return true;
  }

  if (shortcut.id === 'ungroup') {
    if (current.onUngroup) {
      current.onUngroup();
    } else {
      current.selectionCommands?.ungroupSelection?.();
    }
    return true;
  }

  if (shortcut.id === 'showInspector') {
    current.onShowInspector?.();
    return true;
  }

  if (shortcut.id === 'copyStyle') {
    if (current.onCopyStyle) {
      current.onCopyStyle();
    } else {
      current.selectionCommands?.copyStyle?.();
    }
    return true;
  }

  if (shortcut.id === 'pasteStyle') {
    if (current.onPasteStyle) {
      current.onPasteStyle();
    } else {
      current.selectionCommands?.pasteStyle?.();
    }
    return true;
  }

  const handler =
    shortcut.id === 'copy' || shortcut.id === 'cut' || shortcut.id === 'paste'
      ? undefined
      : current.handlers?.[shortcut.id] ||
        (shortcut.actionId ? current.handlers?.[shortcut.actionId] : undefined) ||
        (shortcut.commandId ? current.handlers?.[shortcut.commandId] : undefined);

  if (!handler) return false;
  const handledByRegistry = handler(event, shortcut, context);
  return handledByRegistry !== false;
};

export const useDesignerKeyboardShortcuts = ({
  enabled,
  activeSchemas,
  pageCursor,
  schemasList,
  visibleSchemasList,
  shortcuts,
  commandBus,
  selectionCommands,
  canEditStructure,
  activeDocumentId,
  activeUserId,
  isModalOpen,
  isInlineEditing,
  handlers,
  onOpenShortcutPanel,
  onOpenDetail,
  onAddComment,
  onInsertSchemaByType,
  onSelectAllVisible,
  onClearSelection,
  onZoomIn,
  onZoomOut,
  onFitPage,
  onFitWidth,
  onZoom100,
  onNextPage,
  onPreviousPage,
  onMove,
  onGroup,
  onUngroup,
  onShowInspector,
  onCopyStyle,
  onPasteStyle,
}: UseDesignerKeyboardShortcutsParams) => {
  const paramsRef = useRef<UseDesignerKeyboardShortcutsParams>({
    enabled,
    activeSchemas,
    pageCursor,
    schemasList,
    visibleSchemasList,
    shortcuts,
    commandBus,
    selectionCommands,
    canEditStructure,
    activeDocumentId,
    activeUserId,
    isModalOpen,
    isInlineEditing,
    handlers,
    onOpenShortcutPanel,
    onOpenDetail,
    onAddComment,
    onInsertSchemaByType,
    onSelectAllVisible,
    onClearSelection,
    onZoomIn,
    onZoomOut,
    onFitPage,
    onFitWidth,
    onZoom100,
    onNextPage,
    onPreviousPage,
    onMove,
    onGroup,
    onUngroup,
    onShowInspector,
    onCopyStyle,
    onPasteStyle,
  });

  // Use useLayoutEffect so the ref is updated before the browser paints and
  // before any synthesised keyboard events that fire immediately after a click.
  useLayoutEffect(() => {
    paramsRef.current = {
      enabled,
      activeSchemas,
      pageCursor,
      schemasList,
      visibleSchemasList,
      shortcuts,
      commandBus,
      selectionCommands,
      canEditStructure,
      activeDocumentId,
      activeUserId,
      isModalOpen,
      isInlineEditing,
      handlers,
      onOpenShortcutPanel,
      onOpenDetail,
      onAddComment,
      onInsertSchemaByType,
      onSelectAllVisible,
      onClearSelection,
      onZoomIn,
      onZoomOut,
      onFitPage,
      onFitWidth,
      onZoom100,
      onNextPage,
      onPreviousPage,
      onMove,
      onGroup,
      onUngroup,
      onShowInspector,
      onCopyStyle,
      onPasteStyle,
    };
  }, [
    activeDocumentId,
    activeSchemas,
    activeUserId,
    canEditStructure,
    commandBus,
    enabled,
    handlers,
    isInlineEditing,
    isModalOpen,
    onAddComment,
    onClearSelection,
    onFitPage,
    onFitWidth,
    onNextPage,
    onPreviousPage,
    onInsertSchemaByType,
    onMove,
    onOpenDetail,
    onOpenShortcutPanel,
    onSelectAllVisible,
    onZoom100,
    onZoomIn,
    onZoomOut,
    onGroup,
    onUngroup,
    onShowInspector,
    onCopyStyle,
    onPasteStyle,
    pageCursor,
    schemasList,
    selectionCommands,
    shortcuts,
    visibleSchemasList,
  ]);

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
  }, [enabled, onFitPage, onFitWidth, onNextPage, onPreviousPage, onZoom100, onZoomIn, onZoomOut]);
};

export default useDesignerKeyboardShortcuts;
