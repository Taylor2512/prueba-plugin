/**
 * SelectionContextToolbar — toolbar contextual compacto para selección activa.
 *
 * Muestra acciones rápidas como eliminar, duplicar y abrir más acciones. Delega
 * el menú completo a CanvasContextMenu y no modifica schemas directamente.
 */

import React from 'react';
import type { SchemaForUI } from '@sisad-pdfme/common';
import { Copy, Ellipsis, Trash2 } from 'lucide-react';
import type { SelectionCommandSet } from '../../shared/selectionCommands.js';
import type { InteractionState } from '../../shared/interactionState.js';
import { mergeClassNames } from '../../shared/className.js';
import CanvasContextMenu from './CanvasContextMenu.js';
import type { CanvasContextMenuExternalActions } from './canvasContextMenuActions.js';
import { resolveSelectionToolbarPosition } from './floatingSurfaceGeometry.js';
import type { EffectiveCollaborationContext } from '../../../../collaborationContext.js';
import { OptionsContext } from '../../../../contexts.js';
import { asRecord } from '../../../../../shared/objectGuards.js';

/**
 * Props del toolbar contextual de selección.
 */
type SelectionContextToolbarProps = {
  position: { top: number; left: number; right: number; bottom: number; width: number; height: number } | null;
  commands?: SelectionCommandSet;
  activeElements: HTMLElement[];
  activeSchemas: SchemaForUI[];
  interactionState: InteractionState;
  contextMenuOpen?: boolean;
  /**
   * Acciones externas del menú completo. El menú de «Más» es el mismo
   * componente que el de clic derecho, así que sin esto ofrece menos opciones
   * que él sobre la misma selección.
   */
  externalActions?: CanvasContextMenuExternalActions;
  hasClipboardData?: boolean;
  restoreFocusTarget?: HTMLElement | null;
  collaborationContext?: Pick<
    EffectiveCollaborationContext,
    'actorId' | 'activeRecipientId' | 'activeRecipient' | 'recipientNameMap' | 'canEditStructure'
  >;
};

type QuickAction = {
  id: string;
  label: string;
  danger?: boolean;
  onSelect: () => void;
  disabled?: boolean;
};

type SurfaceSize = { width: number; height: number };
type SurfacePosition = { top: number; left: number };
type MenuPosition = { x: number; y: number };

const ESTIMATED_TOOLBAR_SIZE: SurfaceSize = { width: 190, height: 34 };

/**
 * Evalúa si todos los schemas seleccionados comparten un flag booleano.
 */
const getSchemaFlag = (schemas: SchemaForUI[], key: 'readOnly' | 'required' | 'hidden') =>
  schemas.length > 0 && schemas.every((schema) => {
    if (key === 'hidden') return (schema as SchemaForUI & { hidden?: boolean }).hidden === true;
    return Boolean((schema as SchemaForUI & Record<string, unknown>)[key]);
  });

const getViewportRect = () => ({
  left: 0,
  top: 0,
  width: typeof window !== 'undefined' ? window.innerWidth : 0,
  height: typeof window !== 'undefined' ? window.innerHeight : 0,
});

/**
 * Renderiza acciones rápidas junto a la selección y abre el menú completo.
 */
const SelectionContextToolbar = ({
  position,
  commands,
  activeElements,
  activeSchemas,
  interactionState,
  contextMenuOpen = false,
  externalActions,
  hasClipboardData = false,
  restoreFocusTarget,
  collaborationContext,
}: SelectionContextToolbarProps) => {
  const toolbarRef = React.useRef<HTMLDivElement | null>(null);
  const moreButtonRef = React.useRef<HTMLButtonElement | null>(null);
  const [moreMenuOpen, setMoreMenuOpen] = React.useState(false);
  const [focusReturnTarget, setFocusReturnTarget] = React.useState<HTMLElement | null>(null);
  const [toolbarSize, setToolbarSize] = React.useState<SurfaceSize>(ESTIMATED_TOOLBAR_SIZE);
  const [toolbarPosition, setToolbarPosition] = React.useState<SurfacePosition>(() =>
    position ? resolveSelectionToolbarPosition(position, ESTIMATED_TOOLBAR_SIZE, getViewportRect()) : { top: 0, left: 0 },
  );
  const [menuPosition, setMenuPosition] = React.useState<MenuPosition | null>(null);
  const options = React.useContext(OptionsContext);
  const actionsVisibility = asRecord(asRecord(options)?.visibility)?.actions as Record<string, boolean> | null;

  React.useEffect(() => {
    if (contextMenuOpen) setMoreMenuOpen(false);
  }, [contextMenuOpen]);

  const canEditStructure = commands?.canEditStructure !== false;
  const activeReadOnly = getSchemaFlag(activeSchemas, 'readOnly');
  const activeRequired = getSchemaFlag(activeSchemas, 'required');
  const activeHidden = getSchemaFlag(activeSchemas, 'hidden');
  const selectionCount = interactionState.selectionCount;
  const isMulti = selectionCount > 1;

  /**
   * Acciones rápidas visibles directamente en el toolbar compacto.
   */
  const quickActions = React.useMemo(
    () =>
      ([
        actionsVisibility?.delete === false || !commands?.deleteSelection
          ? null
          : {
              id: 'delete',
              label: 'Eliminar',
              danger: true,
              onSelect: commands.deleteSelection,
              disabled: !canEditStructure,
            },
        // Misma polaridad que `delete`: la condición marca cuándo NO hay acción.
        // Estaba invertida, así que «Duplicar» solo intentaba pintarse cuando
        // el comando no existía —y por eso no aparecía nunca.
        actionsVisibility?.duplicate === false || !commands?.duplicateSelection
          ? null
          : {
              id: 'duplicate',
              label: 'Duplicar',
              onSelect: commands.duplicateSelection,
              disabled: !canEditStructure,
            },
      ] as Array<QuickAction | null>).filter((item): item is QuickAction => item !== null),
    [actionsVisibility?.delete, actionsVisibility?.duplicate, canEditStructure, commands],
  );

  /**
   * Abre el menú contextual completo anclado al toolbar.
   */
  const openMoreMenu = React.useCallback(() => {
    const schemaId = activeSchemas.find((schema) => typeof schema?.id === 'string' && schema.id.trim())?.id;
    if (typeof document !== 'undefined' && schemaId) {
      const escapedId = typeof CSS !== 'undefined' && typeof CSS.escape === 'function'
        ? CSS.escape(schemaId)
        : schemaId.replace(/"/g, '\\"');
      setFocusReturnTarget(document.querySelector<HTMLElement>(`[data-schema-id="${escapedId}"]`));
    } else {
      setFocusReturnTarget(moreButtonRef.current);
    }
    setMoreMenuOpen(true);
  }, [activeSchemas]);

  const closeMoreMenu = React.useCallback(() => {
    setMoreMenuOpen(false);
    requestAnimationFrame(() => (focusReturnTarget ?? moreButtonRef.current)?.focus({ preventScroll: true }));
  }, [focusReturnTarget]);

  const handleToolbarKeyDown = React.useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    event.stopPropagation();

    if (moreMenuOpen) {
      closeMoreMenu();
      return;
    }

    requestAnimationFrame(() => {
      (restoreFocusTarget ?? activeElements[0] ?? moreButtonRef.current)?.focus({ preventScroll: true });
    });
  }, [activeElements, closeMoreMenu, moreMenuOpen, restoreFocusTarget]);

  React.useLayoutEffect(() => {
    const toolbarNode = toolbarRef.current;
    if (!toolbarNode || !position) return;

    const updateLayout = () => {
      const canvasRoot = toolbarNode.closest('.sisad-pdfme-designer-canvas') as HTMLElement | null;
      const viewportRect = canvasRoot
        ? {
            left: canvasRoot.scrollLeft,
            top: canvasRoot.scrollTop,
            width: canvasRoot.clientWidth,
            height: canvasRoot.clientHeight,
          }
        : getViewportRect();
      const nextToolbarPosition = resolveSelectionToolbarPosition(position, toolbarSize, viewportRect);
      const anchorRect = moreButtonRef.current?.getBoundingClientRect();
      const nextMenuPosition = moreMenuOpen
        ? anchorRect
          ? { x: anchorRect.left, y: anchorRect.bottom + 8 }
          : { x: nextToolbarPosition.left, y: nextToolbarPosition.top + toolbarSize.height + 8 }
        : null;

      setToolbarPosition((current) =>
        current.top === nextToolbarPosition.top && current.left === nextToolbarPosition.left
          ? current
          : nextToolbarPosition,
      );
      setMenuPosition((current) =>
        current?.x === nextMenuPosition?.x && current?.y === nextMenuPosition?.y
          ? current
          : nextMenuPosition,
      );
    };

    updateLayout();

    if (typeof ResizeObserver === 'undefined') return undefined;

    const observer = new ResizeObserver(updateLayout);
    observer.observe(toolbarNode);

    return () => observer.disconnect();
  }, [moreMenuOpen, position, toolbarSize]);

  React.useLayoutEffect(() => {
    const toolbarNode = toolbarRef.current;
    if (!toolbarNode) return;

    const updateToolbarSize = () => {
      const rect = toolbarNode.getBoundingClientRect();
      const next = {
        width: Math.max(ESTIMATED_TOOLBAR_SIZE.width, Math.ceil(rect.width)),
        height: Math.max(ESTIMATED_TOOLBAR_SIZE.height, Math.ceil(rect.height)),
      };
      setToolbarSize((current) =>
        current.width === next.width && current.height === next.height ? current : next,
      );
    };

    updateToolbarSize();

    if (typeof ResizeObserver === 'undefined') return undefined;

    const observer = new ResizeObserver(updateToolbarSize);
    observer.observe(toolbarNode);

    return () => observer.disconnect();
  }, [activeElements.length, contextMenuOpen, interactionState.phase, moreMenuOpen, quickActions.length]);

  if (!position || !commands || !activeElements.length) return null;
  if (['editing', 'dragging', 'resizing', 'rotating'].includes(interactionState.phase)) return null;
  if (contextMenuOpen) return null;

  return (
    <>
      <div
        ref={toolbarRef}
        className="sisad-pdfme-ui-selection-context-toolbar pointer-events-auto absolute inline-flex h-[34px] w-max rounded-[10px] border border-slate-200 bg-white p-[3px] shadow-[0_6px_18px_rgba(15,23,42,0.10)] backdrop-blur-md transition-[opacity,transform] duration-[var(--wix-reveal-dur)] ease-out motion-reduce:transition-none"
        role="toolbar"
        aria-label="Barra contextual de edición"
        data-designer-control="true"
        data-interaction-exclusion="true"
        data-schema-interactive-control="true"
        data-overlay-interactive="true"
        data-selection-count={String(selectionCount)}
        data-interaction-phase={interactionState.phase}
        data-selection-kind={isMulti ? 'multi' : 'single'}
        style={{
          top: `${toolbarPosition.top}px`,
          left: `${toolbarPosition.left}px`,
          opacity: 1,
          transform: 'translateY(0) scale(1)',
        }}
        onPointerDownCapture={(event) => event.stopPropagation()}
        onMouseDownCapture={(event) => event.stopPropagation()}
        onKeyDown={handleToolbarKeyDown}
      >
        <div className="flex items-center gap-1">
          {quickActions.map((btn) => (
            <button
              key={btn.id}
              type="button"
              aria-label={btn.label}
              data-active="false"
              data-danger={btn.danger ? 'true' : 'false'}
              data-designer-control="true"
              data-schema-interactive-control="true"
              disabled={btn.disabled}
              onPointerDown={(event) => event.stopPropagation()}
              onMouseDown={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                btn.onSelect?.();
              }}
              className={mergeClassNames(
                // `border-solid` explícito: los <button> traen `border-style:
                // outset` del UA y preflight está off (daría un borde biselado).
                'inline-flex h-7 min-w-0 items-center gap-1 rounded-[7px] border border-solid border-transparent bg-white px-2 py-0 text-[12px] font-medium text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30',
                btn.danger && 'text-slate-700 hover:bg-red-50 hover:text-red-600',
                btn.disabled && 'cursor-not-allowed opacity-50',
              )}
            >
              <span
                className={mergeClassNames(
                  'inline-flex h-[18px] w-[18px] flex-none items-center justify-center rounded-md text-slate-500',
                  btn.danger && 'text-current',
                )}
                aria-hidden="true"
              >
                {btn.id === 'delete' ? <Trash2 size={14} /> : <Copy size={14} />}
              </span>
              <span className="truncate">{btn.label}</span>
            </button>
          ))}
          <button
            ref={moreButtonRef}
            type="button"
            aria-label="Más acciones"
            aria-haspopup="menu"
            aria-expanded={moreMenuOpen ? 'true' : 'false'}
            data-designer-control="true"
            data-interaction-exclusion="true"
            data-schema-interactive-control="true"
            data-overlay-interactive="true"
            onPointerDown={(event) => event.stopPropagation()}
            onMouseDown={(event) => event.stopPropagation()}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              openMoreMenu();
            }}
            className="inline-flex h-7 min-w-0 items-center gap-1 rounded-[7px] border border-solid border-transparent bg-white px-2 py-0 text-[12px] font-medium text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30"
          >
            <span className="inline-flex h-[16px] w-[16px] flex-none items-center justify-center rounded-md text-slate-500" aria-hidden="true">
              <Ellipsis size={14} />
            </span>
            <span>Más</span>
          </button>
        </div>
      </div>
      <CanvasContextMenu
        open={moreMenuOpen}
        mode={isMulti ? 'multi' : 'single'}
        position={moreMenuOpen ? menuPosition ?? { x: toolbarPosition.left, y: toolbarPosition.top + toolbarSize.height + 8 } : null}
        commands={commands}
        externalActions={externalActions}
        hasClipboardData={hasClipboardData}
        selectionCount={selectionCount}
        selectionSchemas={activeSchemas}
        collaborationContext={collaborationContext}
        activeReadOnly={activeReadOnly}
        activeRequired={activeRequired}
        activeHidden={activeHidden}
        canEditStructure={canEditStructure}
        restoreFocusTarget={focusReturnTarget ?? restoreFocusTarget ?? null}
        onClose={closeMoreMenu}
      />
    </>
  );
};

export default SelectionContextToolbar;
