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
import type { EffectiveCollaborationContext } from '../../../../collaborationContext.js';

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
  collaborationContext?: Pick<
    EffectiveCollaborationContext,
    'actorId' | 'activeRecipientId' | 'activeRecipient' | 'recipientNameMap' | 'canEditStructure'
  >;
  activeReadOnly?: boolean;
  activeRequired?: boolean;
  activeHidden?: boolean;
  canEditStructure?: boolean;
  onClose?: () => void;
  className?: string;
};

const MENU_DIMENSIONS: Record<CanvasContextMenuMode, { width: number; height: number }> = {
  empty: { width: 248, height: 208 },
  single: { width: 272, height: 392 },
  multi: { width: 280, height: 424 },
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
  collaborationContext,
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
        collaborationContext,
        activeReadOnly,
        activeRequired,
        activeHidden,
        canEditStructure,
      }),
    [mode, commands, externalActions, hasClipboardData, selectionCount, selectionSchemas, collaborationContext, activeReadOnly, activeRequired, activeHidden, canEditStructure],
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
    <div className="sisad-pdfme-ui-canvas-context-menu-layer fixed inset-0" onContextMenu={(event) => event.preventDefault()}>
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
          'sisad-pdfme-ui-canvas-context-menu absolute min-w-[210px] overflow-hidden rounded-2xl border border-slate-200/80 bg-white/96 p-1.5 text-[11.5px] text-slate-700 shadow-[0_16px_38px_rgba(15,23,42,0.12)] ring-1 ring-slate-100/60 backdrop-blur-md',
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
          <div key={group.id} className="sisad-pdfme-ui-canvas-context-menu-group space-y-0.5 py-[3px] first:pt-0 last:pb-0">
            {group.label ? (
              <div className="sisad-pdfme-ui-canvas-context-menu-group-label px-2 pt-0.5 text-[9.5px] font-bold uppercase tracking-[0.16em] text-slate-400">
                {group.label}
              </div>
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
                      'sisad-pdfme-ui-canvas-context-menu-item flex h-7 w-full items-center gap-2 rounded-xl border border-slate-200/80 bg-white/90 px-2.5 text-left text-[11.5px] font-semibold text-slate-700 shadow-[0_1px_0_rgba(15,23,42,0.02)] transition hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200',
                      item.danger && 'text-red-600 hover:border-red-200 hover:bg-red-50 hover:text-red-700',
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
                    <span
                      className={mergeClassNames(
                        'sisad-pdfme-ui-canvas-context-menu-item-icon inline-flex h-[18px] w-[18px] flex-none items-center justify-center rounded-md bg-slate-50/90 text-slate-500 transition',
                        item.danger && 'text-red-500',
                      )}
                    >
                      {item.icon}
                    </span>
                    <span className="sisad-pdfme-ui-canvas-context-menu-item-label min-w-0 flex-1 truncate">{item.label}</span>
                  </button>
                );
              })}
            {groupIndex < groups.length - 1 ? (
              <div className="sisad-pdfme-ui-canvas-context-menu-divider my-1 h-px bg-slate-100" aria-hidden="true" />
            ) : null}
          </div>
        ))}
      </div>
    </div>,
    document.body,
  );
};

export default CanvasContextMenu;
