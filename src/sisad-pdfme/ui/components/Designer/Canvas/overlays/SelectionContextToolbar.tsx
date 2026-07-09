import React from 'react';
import type { SchemaForUI } from '@sisad-pdfme/common';
import { Copy, Ellipsis, Trash2 } from 'lucide-react';
import type { SelectionCommandSet } from '../../shared/selectionCommands.js';
import type { InteractionState } from '../../shared/interactionState.js';
import { mergeClassNames } from '../../shared/className.js';
import CanvasContextMenu from './CanvasContextMenu.js';
import { resolveAnchoredFloatingSurfacePosition } from './floatingSurfaceGeometry.js';

type SelectionContextToolbarProps = {
  position: { top: number; left: number; width: number; height: number } | null;
  commands?: SelectionCommandSet;
  activeElements: HTMLElement[];
  activeSchemas: SchemaForUI[];
  interactionState: InteractionState;
  contextMenuOpen?: boolean;
};

const getSchemaFlag = (schemas: SchemaForUI[], key: 'readOnly' | 'required' | 'hidden') =>
  schemas.length > 0 && schemas.every((schema) => {
    if (key === 'hidden') return (schema as SchemaForUI & { hidden?: boolean }).hidden === true;
    return Boolean((schema as SchemaForUI & Record<string, unknown>)[key]);
  });

const SelectionContextToolbar = ({
  position,
  commands,
  activeElements,
  activeSchemas,
  interactionState,
  contextMenuOpen = false,
}: SelectionContextToolbarProps) => {
  const toolbarRef = React.useRef<HTMLDivElement | null>(null);
  const [moreMenuOpen, setMoreMenuOpen] = React.useState(false);

  React.useEffect(() => {
    if (contextMenuOpen) setMoreMenuOpen(false);
  }, [contextMenuOpen]);

  const canEditStructure = commands?.canEditStructure !== false;
  const activeReadOnly = getSchemaFlag(activeSchemas, 'readOnly');
  const activeRequired = getSchemaFlag(activeSchemas, 'required');
  const activeHidden = getSchemaFlag(activeSchemas, 'hidden');
  const selectionCount = interactionState.selectionCount;
  const isMulti = selectionCount > 1;

  const quickActions = React.useMemo(
    () =>
      [
        commands?.deleteSelection
          ? {
              id: 'delete',
              label: 'Eliminar',
              danger: true,
              onSelect: commands.deleteSelection,
              disabled: !canEditStructure,
            }
          : null,
        commands?.duplicateSelection
          ? {
              id: 'duplicate',
              label: 'Duplicar',
              onSelect: commands.duplicateSelection,
              disabled: !canEditStructure,
            }
          : null,
      ].filter((item): item is { id: string; label: string; danger?: boolean; onSelect: () => void; disabled?: boolean } => Boolean(item)),
    [canEditStructure, commands],
  );

  const openMoreMenu = React.useCallback(() => {
    setMoreMenuOpen(true);
  }, []);

  if (!position || !commands || !activeElements.length) return null;
  if (['editing', 'dragging', 'resizing', 'rotating'].includes(interactionState.phase)) return null;
  if (contextMenuOpen) return null;

  const menuPosition = resolveAnchoredFloatingSurfacePosition(
    { x: position.left, y: position.top + position.height + 8 },
    { width: 260, height: isMulti ? 280 : 248 },
    { width: typeof window !== 'undefined' ? window.innerWidth : 0, height: typeof window !== 'undefined' ? window.innerHeight : 0 },
  );

  return (
    <>
      <div
        ref={toolbarRef}
        className="sisad-pdfme-ui-selection-context-toolbar rounded-2xl border border-slate-200/80 bg-white/95 p-1 shadow-[0_14px_34px_rgba(15,23,42,0.12)] backdrop-blur-md"
        role="toolbar"
        aria-label="Barra contextual de edición"
        data-schema-interactive-control="true"
        data-overlay-interactive="true"
        data-selection-count={String(selectionCount)}
        data-interaction-phase={interactionState.phase}
        data-selection-kind={isMulti ? 'multi' : 'single'}
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
          width: 'min(100%, 15.75rem)',
        }}
      >
        <div className="flex items-center gap-1">
          {quickActions.map((btn) => (
            <button
              key={btn.id}
              type="button"
              title={btn.label}
              aria-label={btn.label}
              data-active="false"
              data-danger={btn.danger ? 'true' : 'false'}
              data-schema-interactive-control="true"
              disabled={btn.disabled}
              onMouseDown={(event) => {
                event.preventDefault();
                event.stopPropagation();
              }}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                btn.onSelect?.();
              }}
              className={mergeClassNames(
                'inline-flex min-h-8 min-w-0 items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white/90 px-2.5 py-1 text-[11.5px] font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200',
                btn.danger && 'text-red-600 hover:border-red-200 hover:bg-red-50 hover:text-red-700',
                btn.disabled && 'cursor-not-allowed opacity-50',
              )}
            >
              <span
                className={mergeClassNames(
                  'inline-flex h-[18px] w-[18px] flex-none items-center justify-center rounded-md bg-slate-50/90 text-slate-500',
                  btn.danger && 'text-red-500',
                )}
                aria-hidden="true"
              >
                {btn.id === 'delete' ? <Trash2 size={14} /> : <Copy size={14} />}
              </span>
              <span className="truncate">{btn.label}</span>
            </button>
          ))}
          <button
            type="button"
            title="Más acciones"
            aria-label="Más acciones"
            aria-haspopup="menu"
            aria-expanded={moreMenuOpen ? 'true' : 'false'}
            data-schema-interactive-control="true"
            data-overlay-interactive="true"
            onMouseDown={(event) => {
              event.preventDefault();
              event.stopPropagation();
            }}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              openMoreMenu();
            }}
            className="inline-flex min-h-8 min-w-0 items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white/90 px-2.5 py-1 text-[11.5px] font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200"
          >
            <span className="inline-flex h-[18px] w-[18px] flex-none items-center justify-center rounded-md bg-slate-50/90 text-slate-500" aria-hidden="true">
              <Ellipsis size={14} />
            </span>
            <span>Más</span>
          </button>
        </div>
      </div>
      <CanvasContextMenu
        open={moreMenuOpen}
        mode={isMulti ? 'multi' : 'single'}
        position={moreMenuOpen ? { x: menuPosition.left, y: menuPosition.top } : null}
        commands={commands}
        hasClipboardData={false}
        selectionCount={selectionCount}
        selectionSchemas={activeSchemas}
        activeReadOnly={activeReadOnly}
        activeRequired={activeRequired}
        activeHidden={activeHidden}
        canEditStructure={canEditStructure}
        onClose={() => setMoreMenuOpen(false)}
      />
    </>
  );
};

export default SelectionContextToolbar;
