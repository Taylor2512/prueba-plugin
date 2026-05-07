import { useEffect, useRef } from 'react';
import type { CommandBus } from '../../../commands/commandBus.js';
import type { SchemaForUI } from '@sisad-pdfme/common';
import {
  getShortcuts,
  isEditableTarget,
  resolveShortcutByKeyboardEvent,
  type ShortcutDefinition,
} from './keyboardShortcutRegistry.js';
import type { SelectionCommandSet } from './selectionCommands.js';

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
  commandBus?: Pick<CommandBus, 'undo' | 'redo'> | null;
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
  });

  useEffect(() => {
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
      const target = event.target;
      const editableTarget = isEditableTarget(target);

      const shortcut = resolveShortcutByKeyboardEvent(event, current.shortcuts ?? getShortcuts());
      if (!shortcut) return;

      if ((current.isModalOpen || current.isInlineEditing) && shortcut.id !== 'clearSelection') return;

      if (editableTarget && shortcut.disabledWhenEditingText && shortcut.id !== 'clearSelection') return;
      if (shortcut.requiresSelection && current.activeSchemas.length === 0) return;
      if (shortcut.requiresEditableStructure && !current.canEditStructure) return;

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

      const handler =
        current.handlers?.[shortcut.id] ||
        (shortcut.actionId ? current.handlers?.[shortcut.actionId] : undefined) ||
        (shortcut.commandId ? current.handlers?.[shortcut.commandId] : undefined);

      const handledByRegistry = handler ? handler(event, shortcut, context) : undefined;
      if (handledByRegistry === false) return;

      switch (shortcut.id) {
        case 'openShortcuts':
          if (current.onOpenShortcutPanel) {
            current.onOpenShortcutPanel();
          } else {
            window.dispatchEvent(new CustomEvent('sisad-pdfme:shortcut-open-panel'));
          }
          break;
        case 'openDetail':
          if (current.onOpenDetail) {
            current.onOpenDetail();
          } else {
            current.selectionCommands?.openProperties?.();
          }
          break;
        case 'addComment':
          current.onAddComment?.();
          break;
        case 'zoomIn':
          current.onZoomIn?.();
          break;
        case 'zoomOut':
          current.onZoomOut?.();
          break;
        case 'fitPage':
          current.onFitPage?.();
          break;
        case 'fitWidth':
          current.onFitWidth?.();
          break;
        case 'zoom100':
          current.onZoom100?.();
          break;
        case 'nextPage':
          current.onNextPage?.();
          break;
        case 'previousPage':
          current.onPreviousPage?.();
          break;
        case 'selectAllVisible':
          current.onSelectAllVisible?.();
          break;
        case 'clearSelection':
          current.onClearSelection?.();
          break;
        case 'undo':
          void current.commandBus?.undo();
          break;
        case 'redo':
          void current.commandBus?.redo();
          break;
        case 'duplicate':
          current.selectionCommands?.duplicateSelection?.();
          break;
        case 'delete':
          current.selectionCommands?.deleteSelection?.();
          break;
        case 'moveUp':
        case 'moveDown':
        case 'moveLeft':
        case 'moveRight':
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
          break;
        case 'insertText':
        case 'insertSignature':
        case 'insertInitial':
        case 'insertName':
        case 'insertEmail':
        case 'insertDate':
        case 'insertCheckbox':
        case 'insertRadio':
        case 'insertSelect':
          current.onInsertSchemaByType?.(getInsertType(shortcut.id));
          break;
        default:
          break;
      }

      if (shortcut.id === 'openShortcuts' || shortcut.id === 'openDetail' || shortcut.id === 'addComment') {
        event.preventDefault();
        event.stopPropagation();
      } else if (shortcut.id === 'undo' || shortcut.id === 'redo') {
        event.preventDefault();
      } else if (
        shortcut.id === 'duplicate' ||
        shortcut.id === 'delete' ||
        shortcut.id === 'selectAllVisible' ||
        shortcut.id === 'clearSelection' ||
        shortcut.id.startsWith('move') ||
        shortcut.id.startsWith('insert')
      ) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, [enabled, onFitPage, onFitWidth, onNextPage, onPreviousPage, onZoom100, onZoomIn, onZoomOut]);
};

export default useDesignerKeyboardShortcuts;
