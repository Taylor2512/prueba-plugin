import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { SchemaForUI } from '@sisad-pdfme/common';
import { createPortal } from 'react-dom';
import {
  CanvasContextMenuMode,
  CanvasContextMenuExternalActions,
  buildCanvasContextMenuGroups,
} from './canvasContextMenuActions.js';
import { resolveAnchoredFloatingSurfacePosition } from './floatingSurfaceGeometry.js';
import type { SelectionCommandSet } from '../../shared/selectionCommands.js';
import { mergeClassNames } from '../../shared/className.js';

export type CanvasContextMenuPosition = {
  x: number;
  y: number;
};

export type CanvasContextMenuProps = {
  open: boolean;
  mode: CanvasContextMenuMode;
  position: CanvasContextMenuPosition | null;
  commands?: SelectionCommandSet;
  externalActions?: CanvasContextMenuExternalActions;
  hasClipboardData?: boolean;
  selectionCount?: number;
  selectionSchemas: SchemaForUI[];
  activeReadOnly?: boolean;
  activeRequired?: boolean;
  activeHidden?: boolean;
  canEditStructure?: boolean;
  onClose?: () => void;
  className?: string;
};

const MENU_DIMENSIONS: Record<CanvasContextMenuMode, { width: number; height: number }> = {
  empty: { width: 248, height: 208 },
  single: { width: 248, height: 248 },
  multi: { width: 264, height: 280 },
};

const CanvasContextMenu = ({
  open,
  mode,
  position,
  commands,
  externalActions,
  hasClipboardData = false,
  selectionCount = 0,
  selectionSchemas,
  activeReadOnly = false,
  activeRequired = false,
  activeHidden = false,
  canEditStructure = true,
  onClose,
  className = '',
}: CanvasContextMenuProps) => {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [resolvedPosition, setResolvedPosition] = useState<{ top: number; left: number } | null>(null);
  const groups = useMemo(
    () =>
      buildCanvasContextMenuGroups({
        mode,
        commands,
        externalActions,
        hasClipboardData,
        selectionCount,
        selectionSchemas,
        activeReadOnly,
        activeRequired,
        activeHidden,
        canEditStructure,
      }),
    [mode, commands, externalActions, hasClipboardData, selectionCount, selectionSchemas, activeReadOnly, activeRequired, activeHidden, canEditStructure],
  );

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose?.();
      }
    };

    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, [open, onClose]);

  useEffect(() => {
    if (!open || !menuRef.current) return;
    const firstEnabledItem = menuRef.current.querySelector<HTMLButtonElement>('button:not(:disabled)');
    firstEnabledItem?.focus();
  }, [open, mode]);

  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 0;
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 0;
  const estimatedSize = MENU_DIMENSIONS[mode];
  const estimatedPosition = useMemo(() => {
    if (!position) return null;
    return resolveAnchoredFloatingSurfacePosition(
      position,
      estimatedSize,
      { width: viewportWidth, height: viewportHeight },
    );
  }, [estimatedSize, position, viewportHeight, viewportWidth]);

  useLayoutEffect(() => {
    if (!open || !position) return;
    const menuNode = menuRef.current;
    if (!menuNode || typeof window === 'undefined') return;

    const rect = menuNode.getBoundingClientRect();
    const measuredSize = {
      width: Math.max(rect.width, estimatedSize.width),
      height: Math.max(rect.height, estimatedSize.height),
    };
    const nextPosition = resolveAnchoredFloatingSurfacePosition(
      position,
      measuredSize,
      { width: window.innerWidth, height: window.innerHeight },
    );

    setResolvedPosition((current) => {
      if (current && current.top === nextPosition.top && current.left === nextPosition.left) {
        return current;
      }
      return nextPosition;
    });
  }, [estimatedSize, open, position, groups]);

  if (!open || !position || typeof document === 'undefined') return null;
  const menuPosition = resolvedPosition ?? estimatedPosition ?? {
    top: position.y,
    left: position.x,
  };

  const focusMenuItem = (delta: number) => {
    const menuNode = menuRef.current;
    if (!menuNode) return;
    const items = Array.from(menuNode.querySelectorAll<HTMLButtonElement>('button:not(:disabled)'));
    if (!items.length) return;

    const currentIndex = items.findIndex((item) => item === document.activeElement);
    const nextIndex = currentIndex < 0 ? 0 : (currentIndex + delta + items.length) % items.length;
    items[nextIndex]?.focus();
  };

  return createPortal(
    <div className="sisad-pdfme-ui-canvas-context-menu-layer fixed inset-0 z-[80]" onContextMenu={(event) => event.preventDefault()}>
      <div
        className="sisad-pdfme-ui-canvas-context-menu-backdrop absolute inset-0 bg-transparent"
        aria-hidden="true"
        onMouseDown={() => onClose?.()}
      />
      <div
        ref={menuRef}
        role="menu"
        aria-orientation="vertical"
        aria-label={
          mode === 'empty'
            ? 'Menú contextual del canvas vacío'
            : mode === 'multi'
              ? 'Menú contextual de selección múltiple'
              : 'Menú contextual del esquema'
        }
        data-mode={mode}
        data-selection-count={String(selectionCount)}
        data-selection-kind={selectionCount > 1 ? 'multi' : 'single'}
        className={mergeClassNames(
          'sisad-pdfme-ui-canvas-context-menu absolute min-w-[17rem] overflow-hidden rounded-2xl border border-slate-200 bg-white/95 p-2 text-sm text-slate-700 shadow-2xl backdrop-blur-md',
          className,
        )}
        style={{
          top: `${menuPosition.top}px`,
          left: `${menuPosition.left}px`,
        }}
        onContextMenu={(event) => event.preventDefault()}
        onMouseDown={(event) => event.stopPropagation()}
        onPointerDownCapture={(event) => event.stopPropagation()}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown') {
            event.preventDefault();
            focusMenuItem(1);
          } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            focusMenuItem(-1);
          } else if (event.key === 'Home') {
            event.preventDefault();
            focusMenuItem(-999);
          } else if (event.key === 'End') {
            event.preventDefault();
            focusMenuItem(999);
          }
        }}
        >
        {groups.map((group, groupIndex) => (
          <div key={group.id} className="sisad-pdfme-ui-canvas-context-menu-group space-y-1 py-1 first:pt-0 last:pb-0">
            {group.label ? (
              <div className="sisad-pdfme-ui-canvas-context-menu-group-label px-2 pb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">{group.label}</div>
            ) : null}
            {group.items
              .filter((item) => !item.hidden)
              .map((item) => {
                const disabled = Boolean(item.disabled);
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="menuitem"
                    className={mergeClassNames(
                      'sisad-pdfme-ui-canvas-context-menu-item flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left text-sm font-medium transition',
                      item.danger ? 'text-rose-700 hover:bg-rose-50' : 'text-slate-700 hover:bg-slate-50',
                      disabled && 'cursor-not-allowed opacity-40',
                    )}
                    disabled={disabled}
                    title={item.disabled && item.disabledReason ? item.disabledReason : item.label}
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      if (disabled) return;
                      item.onSelect?.();
                      onClose?.();
                    }}
                  >
                    <span className="sisad-pdfme-ui-canvas-context-menu-item-icon inline-flex h-6 w-6 items-center justify-center rounded-lg bg-slate-50 text-slate-500">{item.icon}</span>
                    <span className="sisad-pdfme-ui-canvas-context-menu-item-label min-w-0 flex-1 truncate">{item.label}</span>
                  </button>
                );
              })}
            {groupIndex < groups.length - 1 ? (
              <div className="sisad-pdfme-ui-canvas-context-menu-divider my-1 h-px bg-slate-200" aria-hidden="true" />
            ) : null}
          </div>
        ))}
      </div>
    </div>,
    document.body,
  );
};

export default CanvasContextMenu;
