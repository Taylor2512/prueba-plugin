import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
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
import { OptionsContext } from '../../../../contexts.js';
import { asRecord } from '../../shared/objectGuards.js';
import type { SisadPdfmeVisibilityConfig } from '../../../../../config/SisadPdfmeConfig.js';

/**
 * Coordenada ancla donde debe abrirse el menú contextual.
 *
 * Normalmente proviene del evento `contextmenu` del canvas:
 *
 * - x: posición horizontal del puntero en viewport;
 * - y: posición vertical del puntero en viewport.
 */
export type CanvasContextMenuPosition = {
  /**
   * Coordenada horizontal en píxeles.
   */
  x: number;

  /**
   * Coordenada vertical en píxeles.
   */
  y: number;
};

/**
 * Props del menú contextual del canvas.
 *
 * Este componente no decide por sí mismo qué acciones existen.
 * Recibe contexto de selección, comandos, acciones externas y estado
 * colaborativo; luego delega la construcción de grupos/items a
 * `buildCanvasContextMenuGroups`.
 */
export type CanvasContextMenuProps = {
  /**
   * Controla si el menú debe mostrarse.
   */
  open: boolean;

  /**
   * Modo funcional del menú.
   *
   * empty:
   * Se abrió sobre canvas vacío.
   *
   * single:
   * Se abrió sobre un schema seleccionado.
   *
   * multi:
   * Se abrió sobre selección múltiple.
   */
  mode: CanvasContextMenuMode;

  /**
   * Posición ancla del menú.
   *
   * Si es null, el menú no se renderiza.
   */
  position: CanvasContextMenuPosition | null;

  /**
   * Comandos disponibles sobre la selección actual.
   *
   * Incluye acciones como copiar, pegar, duplicar, alinear,
   * distribuir, eliminar o editar inline según el command set.
   */
  commands?: SelectionCommandSet;

  /**
   * Acciones externas inyectadas por el host o por capas superiores.
   *
   * Permite extender el menú sin acoplar este componente a lógica de negocio.
   */
  externalActions?: CanvasContextMenuExternalActions;

  /**
   * Indica si existe contenido en clipboard compatible con el canvas.
   */
  hasClipboardData?: boolean;

  /**
   * Número de schemas seleccionados.
   */
  selectionCount?: number;

  /**
   * Schemas actualmente seleccionados.
   *
   * Se usa para decidir acciones disponibles, disabled states,
   * permisos colaborativos y labels contextuales.
   */
  selectionSchemas: SchemaForUI[];

  /**
   * Subconjunto del contexto colaborativo necesario para resolver acciones.
   *
   * Se limita a campos usados por el menú para no acoplarlo al contexto
   * completo del diseñador.
   */
  collaborationContext?: Pick<
    EffectiveCollaborationContext,
    | 'actorId'
    | 'activeRecipientId'
    | 'activeRecipient'
    | 'recipientNameMap'
    | 'canEditStructure'
  >;

  /**
   * Estado readonly del schema activo.
   */
  activeReadOnly?: boolean;

  /**
   * Estado required del schema activo.
   */
  activeRequired?: boolean;

  /**
   * Estado hidden del schema activo.
   */
  activeHidden?: boolean;

  /**
   * Indica si la estructura del diseñador puede editarse.
   *
   * Cuando es false, acciones mutantes deben quedar bloqueadas.
   */
  canEditStructure?: boolean;

  /**
   * Callback de cierre.
   *
   * Se ejecuta al presionar Escape, hacer click en backdrop
   * o seleccionar una acción habilitada.
   */
  onClose?: () => void;

  /**
   * Clases adicionales para personalizar la superficie del menú.
   */
  className?: string;
};

/**
 * Tamaños estimados por modo del menú.
 *
 * Se usan antes de medir el DOM real para calcular una posición inicial
 * que evite overflow contra los bordes del viewport.
 *
 * Luego `useLayoutEffect` recalcula usando dimensiones reales.
 */
const MENU_DIMENSIONS: Record<
  CanvasContextMenuMode,
  { width: number; height: number }
> = {
  empty: { width: 248, height: 208 },
  single: { width: 272, height: 392 },
  multi: { width: 280, height: 424 },
};

/**
 * Menú contextual flotante del canvas del diseñador.
 *
 * Responsabilidades:
 *
 * - renderizar acciones contextuales según modo y selección;
 * - posicionarse cerca del puntero sin salirse del viewport;
 * - cerrar con Escape o click fuera;
 * - soportar navegación básica por teclado;
 * - renderizarse mediante portal para no quedar atrapado por overflow
 *   del canvas o contenedores intermedios;
 * - delegar la lógica de acciones a `buildCanvasContextMenuGroups`.
 *
 * Este componente no debe manipular schemas directamente. Las acciones
 * se ejecutan mediante comandos o callbacks externos recibidos por props.
 */
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
  const options = React.useContext(OptionsContext);
  const visibility = asRecord(asRecord(options)?.visibility);
  const canvasVisibility = asRecord(visibility?.canvas);
  /**
   * Referencia al nodo raíz del menú.
   *
   * Se usa para:
   *
   * - medir dimensiones reales;
   * - enfocar el primer item habilitado;
   * - navegar entre botones con teclado.
   */
  const menuRef = useRef<HTMLDivElement | null>(null);

  /**
   * Posición final calculada con dimensiones reales del menú.
   *
   * Antes de medir el DOM se usa `estimatedPosition`.
   */
  const [resolvedPosition, setResolvedPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  /**
   * Grupos de acciones visibles en el menú contextual.
   *
   * La construcción queda fuera de este componente para mantener separada
   * la lógica de permisos, labels, disabled states y comandos disponibles.
   */
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
        visibility: visibility as SisadPdfmeVisibilityConfig,
      }),
    [
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
      visibility,
    ],
  );

  /**
   * Cierra el menú al presionar Escape.
   *
   * El listener se registra en capture phase para funcionar aunque el foco
   * esté dentro de un botón del menú.
   */
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

  /**
   * Enfoca automáticamente el primer item habilitado cuando se abre el menú.
   *
   * Esto mejora accesibilidad y permite navegar inmediatamente con teclado.
   */
  useEffect(() => {
    if (!open || !menuRef.current) return;

    const firstEnabledItem =
      menuRef.current.querySelector<HTMLButtonElement>('button:not(:disabled)');

    firstEnabledItem?.focus();
  }, [open, mode]);

  /**
   * Dimensiones actuales del viewport.
   *
   * Se leen solo en cliente; en SSR o entornos sin window quedan en cero.
   */
  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 0;
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 0;

  /**
   * Tamaño estimado del menú según modo.
   *
   * Sirve como fallback antes de poder medir el nodo real.
   */
  const estimatedSize = MENU_DIMENSIONS[mode];

  /**
   * Posición inicial estimada.
   *
   * Evita que el menú se pinte inicialmente fuera del viewport mientras
   * `useLayoutEffect` calcula la posición real.
   */
  const estimatedPosition = useMemo(() => {
    if (!position) return null;

    return resolveAnchoredFloatingSurfacePosition(
      position,
      estimatedSize,
      { width: viewportWidth, height: viewportHeight },
    );
  }, [estimatedSize, position, viewportHeight, viewportWidth]);

  /**
   * Recalcula la posición usando dimensiones reales del menú.
   *
   * Se ejecuta en layout effect para reducir saltos visuales entre el render
   * inicial y el ajuste final de posición.
   */
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
      if (
        current &&
        current.top === nextPosition.top &&
        current.left === nextPosition.left
      ) {
        return current;
      }

      return nextPosition;
    });
  }, [estimatedSize, open, position, groups]);

  /**
   * No renderiza si:
   *
   * - el menú está cerrado;
   * - no existe posición ancla;
   * - no existe document, por ejemplo en SSR.
   */
  if (!open || !position || typeof document === 'undefined' || canvasVisibility?.contextMenu === false) return null;

  /**
   * Posición efectiva del menú.
   *
   * Prioridad:
   *
   * 1. posición medida real;
   * 2. posición estimada;
   * 3. posición cruda del puntero.
   */
  const menuPosition = resolvedPosition ??
    estimatedPosition ?? {
      top: position.y,
      left: position.x,
    };

  /**
   * Mueve el foco entre items habilitados del menú.
   *
   * @param delta Dirección del movimiento.
   * Valores positivos avanzan; valores negativos retroceden.
   */
  const focusMenuItem = (delta: number) => {
    const menuNode = menuRef.current;
    if (!menuNode) return;

    const items = Array.from(
      menuNode.querySelectorAll<HTMLButtonElement>('button:not(:disabled)'),
    );

    if (!items.length) return;

    const currentIndex = items.findIndex((item) => item === document.activeElement);

    const nextIndex =
      currentIndex < 0
        ? 0
        : (currentIndex + delta + items.length) % items.length;

    items[nextIndex]?.focus();
  };

  return createPortal(
    <div
      className="sisad-pdfme-ui-canvas-context-menu-layer fixed inset-0"
      onContextMenu={(event) => event.preventDefault()}
    >
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
          <div
            key={group.id}
            className="sisad-pdfme-ui-canvas-context-menu-group space-y-0.5 py-[3px] first:pt-0 last:pb-0"
          >
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
                      item.danger &&
                        'text-red-600 hover:border-red-200 hover:bg-red-50 hover:text-red-700',
                      disabled && 'cursor-not-allowed opacity-40',
                    )}
                    disabled={disabled}
                    title={
                      item.disabled && item.disabledReason
                        ? item.disabledReason
                        : item.label
                    }
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

                    <span className="sisad-pdfme-ui-canvas-context-menu-item-label min-w-0 flex-1 truncate">
                      {item.label}
                    </span>
                  </button>
                );
              })}

            {groupIndex < groups.length - 1 ? (
              <div
                className="sisad-pdfme-ui-canvas-context-menu-divider my-1 h-px bg-slate-100"
                aria-hidden="true"
              />
            ) : null}
          </div>
        ))}
      </div>
    </div>,
    document.body,
  );
};

export default CanvasContextMenu;
