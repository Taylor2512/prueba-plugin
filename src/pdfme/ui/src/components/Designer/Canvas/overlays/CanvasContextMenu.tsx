import React, { useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  CanvasContextMenuMode,
  CanvasContextMenuExternalActions,
  buildCanvasContextMenuGroups,
} from './canvasContextMenuActions.js';
import { resolveAnchoredFloatingSurfacePosition } from './floatingSurfaceGeometry.js';
import type { SelectionCommandSet } from '../../shared/selectionCommands.js';

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
  onClose?: () => void;
  className?: string;
};

const CanvasContextMenu = ({
  open,
  mode,
  position,
  commands,
  externalActions,
  hasClipboardData = false,
  onClose,
  className = '',
}: CanvasContextMenuProps) => {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const groups = useMemo(
    () =>
      buildCanvasContextMenuGroups({
        mode,
        commands,
        externalActions,
        hasClipboardData,
      }),
    [mode, commands, externalActions, hasClipboardData],
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

  if (!open || !position || typeof document === 'undefined') return null;

  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 0;
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 0;
  const MENU_WIDTH = 272;
  const MENU_HEIGHT = 320;
  const { top, left } = resolveAnchoredFloatingSurfacePosition(
    position,
    { width: MENU_WIDTH, height: MENU_HEIGHT },
    { width: viewportWidth, height: viewportHeight },
  );

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
    <div className="pdfme-ui-canvas-context-menu-layer" onContextMenu={(event) => event.preventDefault()}>
      <div
        className="pdfme-ui-canvas-context-menu-backdrop"
        aria-hidden="true"
        onMouseDown={() => onClose?.()}
      />
      <div
        ref={menuRef}
        role="menu"
        aria-orientation="vertical"
        aria-label="Canvas context menu"
        className={`pdfme-ui-canvas-context-menu ${className}`.trim()}
        style={{
          top: `${top}px`,
          left: `${left}px`,
        }}
        onContextMenu={(event) => event.preventDefault()}
        onMouseDown={(event) => event.stopPropagation()}
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
          <div key={group.id} className="pdfme-ui-canvas-context-menu-group">
            {group.label ? (
              <div className="pdfme-ui-canvas-context-menu-group-label">{group.label}</div>
            ) : null}
            {group.items.map((item) => {
              const disabled = Boolean(item.disabled);
              return (
                <button
                  key={item.id}
                  type="button"
                  role="menuitem"
                  className={`pdfme-ui-canvas-context-menu-item${item.danger ? ' is-danger' : ''}`}
                  disabled={disabled}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    if (disabled) return;
                    item.onSelect?.();
                    onClose?.();
                  }}
                >
                  <span className="pdfme-ui-canvas-context-menu-item-icon">{item.icon}</span>
                  <span className="pdfme-ui-canvas-context-menu-item-label">{item.label}</span>
                </button>
              );
            })}
            {groupIndex < groups.length - 1 ? (
              <div className="pdfme-ui-canvas-context-menu-divider" aria-hidden="true" />
            ) : null}
          </div>
        ))}
      </div>
    </div>,
    document.body,
  );
};

export default CanvasContextMenu;
