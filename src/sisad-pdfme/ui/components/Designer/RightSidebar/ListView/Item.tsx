/**
 * Field list item row used by the right sidebar ListView.
 *
 * This component renders the visual representation of a schema inside the
 * sortable field list. It combines the schema label, technical name, type label,
 * validation/status markers, collaboration accents, visibility controls, delete
 * affordance and the dnd-kit drag handle.
 *
 * Design contract:
 * - selection and hover state are reflected through data attributes;
 * - drag listeners are attached only to the grip button;
 * - row-level click is handled by the transparent hit target;
 * - dangerous actions stop propagation so they do not select or drag the row;
 * - owner/recipient color is exposed as `--schema-owner-color`.
 */
import React, { useEffect, useContext, useState } from 'react';
import { DraggableSyntheticListeners } from '@dnd-kit/core';
import { I18nContext } from '@sisad-pdfme/ui/contexts';
import { GripVertical, CircleAlert, Lock, Unlock, Eye, EyeOff, Trash2 } from 'lucide-react';
import { DESIGNER_CLASSNAME } from '@sisad-pdfme/ui/constants';
import { mergeClassNames } from '@sisad-pdfme/ui/components/Designer/shared/className';

// Define prop types for Item component

/**
 * Props for a single field-list row.
 *
 * The row is intentionally presentational: it receives drag listeners, status,
 * metadata and action callbacks from the sortable container.
 */
interface Props {
  densityMode?: 'compact' | 'comfortable' | 'minimal';
  /** Content to display in the item */
  value: React.ReactNode;
  /** Schema type (used for color coding) */
  schemaType?: string;
  /** Optional icon to display */
  icon?: React.ReactNode;
  /** Optional custom className */
  className?: string;
  /** Custom styles for the item */
  style?: React.CSSProperties;
  /** Status indicator for the item */
  status?: 'is-warning' | 'is-danger';
  /** Title attribute for the item (technical name when it differs from value) */
  title?: string;
  /** Human-readable schema type label, rendered as its own secondary segment */
  typeLabel?: string;
  /** Whether the item is required */
  required?: boolean;
  /** Whether the item is read-only */
  readOnly?: boolean;
  /** Whether the item's canvas position is locked (distinct from readOnly). */
  positionLocked?: boolean;
  /** Whether the item is hidden on canvas */
  hidden?: boolean;
  /** Called when visibility icon is toggled */
  onToggleVisibility?: () => void;
  /** Called when delete is requested from the item row */
  onDelete?: () => void;
  /** Toggles the schema content read-only flag without selecting the row. */
  onToggleReadOnly?: () => void;
  /** Whether the item is being dragged as an overlay */
  dragOverlay?: boolean;
  /** Click handler for the item */
  onClick?: (_event: React.MouseEvent<HTMLButtonElement>) => void;
  /**
   * Pulsación prolongada (mouse/touch/pen) sobre el hit-target de la fila.
   *
   * Se reenvían sin procesar al reconocedor de `longPressSelection`; `Item` no
   * conoce el umbral de tiempo ni la tolerancia de movimiento, sólo entrega el
   * gesto puntero a puntero.
   */
  onRowPointerDown?: (_event: React.PointerEvent<HTMLButtonElement>) => void;
  onRowPointerMove?: (_event: React.PointerEvent<HTMLButtonElement>) => void;
  onRowPointerUp?: (_event: React.PointerEvent<HTMLButtonElement>) => void;
  onRowPointerCancel?: (_event: React.PointerEvent<HTMLButtonElement>) => void;
  /**
   * Equivalente accesible del long-press: Espacio alterna membresía y entra a
   * multiselección igual que mantener pulsado, sin depender de un puntero.
   */
  onToggleSelectionKey?: () => void;
  /** Refleja el modo de multiselección activo del contenedor (ARIA/CSS). */
  multiSelectMode?: boolean;
  /** Mouse enter handler */
  onMouseEnter?: () => void;
  /** Mouse leave handler */
  onMouseLeave?: () => void;
  /** Whether the item is currently being dragged */
  dragging?: boolean;
  /** Whether items are being sorted */
  sorting?: boolean;
  /** CSS transition value */
  transition?: string;
  /** Transform data for the item */
  transform?: { x: number; y: number; scaleX: number; scaleY: number } | null;
  /** Whether the row is selected or part of an active multi-selection */
  selected?: boolean;
  /** Whether the row is being hovered */
  hovered?: boolean;
  /** Whether to fade the item in */
  fadeIn?: boolean;
  /** Drag listeners from dnd-kit */
  listeners?: DraggableSyntheticListeners;
  /** Optional author/owner accent color */
  accentColor?: string;
  /** Compact collaboration badges */
  metaBadges?: Array<{ label: string; color?: string }>;
}


/**
 * Renders the main field label or a warning/danger status pill.
 *
 * Warning is used for schemas without a name. Danger is used for duplicated
 * names, preserving the visible label while adding an explicit warning suffix.
 */
const ItemStatusLabel = ({
  value,
  status,
  noKeyNameLabel,
  notUniqueLabel,
}: {
  value: React.ReactNode;
  status?: 'is-warning' | 'is-danger';
  noKeyNameLabel: string;
  notUniqueLabel: string;
}) => {
  if (!status) return <>{value}</>;

  const statusText = status === 'is-warning' ? noKeyNameLabel : value;
  const tooltipText =
    typeof statusText === 'string' || typeof statusText === 'number'
      ? String(statusText)
      : noKeyNameLabel;

  return (
    <span
      title={status === 'is-danger' ? `${tooltipText} ${notUniqueLabel}` : tooltipText}
      className={mergeClassNames(DESIGNER_CLASSNAME + 'list-view-item-status', 'inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700')}
    >
      <CircleAlert size={14} />
      {statusText}
      {status === 'is-danger' ? notUniqueLabel : ''}
    </span>
  );
};


/**
 * Renders compact row actions and state badges.
 *
 * The action area is separated from the row hit target so toggling visibility
 * or deleting a schema does not accidentally select or drag the row.
 */
const ItemActions = ({
  readOnly,
  required,
  hidden,
  onToggleVisibility,
  onDelete,
  onToggleReadOnly,
  isHovered,
  label,
}: {
  readOnly?: boolean;
  required?: boolean;
  hidden?: boolean;
  onToggleVisibility?: () => void;
  onDelete?: () => void;
  onToggleReadOnly?: () => void;
  isHovered?: boolean;
  label?: string;
}) => (
    <div className={mergeClassNames(DESIGNER_CLASSNAME + 'list-view-item-actions', 'relative z-20 ml-auto flex shrink-0 items-center gap-1 pl-1')}>
      {onToggleReadOnly ? (
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleReadOnly(); }}
          aria-label={readOnly ? 'Permitir edición del campo' : 'Activar solo lectura del campo'}
          aria-pressed={readOnly === true}
          title={readOnly ? 'Permitir edición' : 'Solo lectura'}
          data-testid="right-sidebar-field-readonly-toggle"
          data-readonly={readOnly ? 'true' : 'false'}
          className={mergeClassNames(
            DESIGNER_CLASSNAME + 'list-view-item-lock-toggle',
            'pointer-events-auto inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/60',
          )}
        >
          {readOnly ? <Lock size={13} aria-hidden="true" /> : <Unlock size={13} aria-hidden="true" />}
        </button>
      ) : readOnly ? (
        <span data-testid="right-sidebar-field-badge" data-badge="readonly" className="pointer-events-auto inline-flex">
          <Lock size={13} className={mergeClassNames(DESIGNER_CLASSNAME + 'list-view-item-lock', 'text-slate-500')} />
        </span>
      ) : null}
    {required ? (
        <span
          title="Campo requerido"
          data-testid="right-sidebar-field-badge"
          data-badge="required"
          className={mergeClassNames(DESIGNER_CLASSNAME + 'list-view-item-required', 'pointer-events-auto text-xs font-semibold text-rose-600')}
        >
          *
        </span>
    ) : null}
    {onToggleVisibility ? (
        <button
          onClick={(e) => { e.stopPropagation(); onToggleVisibility(); }}
          aria-label={hidden ? 'Mostrar campo en el lienzo' : 'Ocultar campo del lienzo'}
          title={hidden ? 'Mostrar' : 'Ocultar'}
          {...(hidden ? { 'data-testid': 'right-sidebar-field-badge', 'data-badge': 'hidden' } : {})}
          className={mergeClassNames('pointer-events-auto inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50')}
        >
          {hidden ? <EyeOff size={13} /> : <Eye size={13} />}
        </button>
    ) : null}
    {onDelete ? (
        <button
          type="button"
          aria-label={`Eliminar campo ${label || ''}`.trim()}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete();
          }}
          title="Eliminar campo"
          className={mergeClassNames(
            DESIGNER_CLASSNAME + 'list-view-item-delete',
            // Semántica de peligro visible en reposo (rosa suave) y saturada en
            // hover/focus, sin llegar al rojo pleno que dominaría la fila. La
            // acción aparece solo al interactuar con la fila para bajar ruido.
            'pointer-events-auto relative z-20 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-rose-200 bg-rose-50 text-rose-500 opacity-0 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition-[background-color,border-color,box-shadow,transform,color,opacity] duration-150 group-hover:opacity-100 group-focus-within:opacity-100 hover:-translate-y-[1px] hover:border-rose-400 hover:bg-rose-100 hover:text-rose-700 hover:shadow-sm focus-visible:opacity-100 focus-visible:border-rose-400 focus-visible:bg-rose-100 focus-visible:text-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/60 focus-visible:ring-offset-1',
          )}
        >
          <Trash2 size={13} />
        </button>
    ) : null}
  </div>
);

/**
 * Memoized, ref-forwarding schema row.
 *
 * `Item` is used both in the real list and inside drag overlays. It exposes
 * status through data attributes for tests/CSS and keeps the draggable handle
 * isolated from the rest of the row.
 */
const Item = React.memo(
  React.forwardRef<HTMLLIElement, Props>(function Item(
    {
      densityMode = 'compact',
      icon,
      value,
      schemaType,
      status,
      title,
      typeLabel,
      required,
      readOnly,
      positionLocked,
      hidden,
      onToggleVisibility,
      onDelete,
      onToggleReadOnly,
      style,
      className,
      dragOverlay,
      onClick,
      onRowPointerDown,
      onRowPointerMove,
      onRowPointerUp,
      onRowPointerCancel,
      onToggleSelectionKey,
      multiSelectMode,
      onMouseEnter,
      onMouseLeave,
      dragging,
      fadeIn,
      listeners,
      accentColor,
      metaBadges,
      sorting,
      transition,
      transform,
      selected,
      hovered,
      ...props
    },
    ref,
  ) {
    const i18n = useContext(I18nContext);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
      if (!dragOverlay) {
        return;
      }

      document.body.style.cursor = 'grabbing';

      return () => {
        document.body.style.cursor = '';
      };
    }, [dragOverlay]);

    const { x, y, scaleX, scaleY } = transform || { x: 0, y: 0, scaleX: 1, scaleY: 1 };
    const normalizedValue =
      typeof value === 'string' || typeof value === 'number' ? String(value) : undefined;
    const secondaryValue = typeof title === 'string' && title.trim() && title !== normalizedValue ? title.trim() : '';
    const normalizedTypeLabel = typeof typeLabel === 'string' && typeLabel.trim() ? typeLabel.trim() : '';
    const valueTooltip =
      [normalizedValue, secondaryValue, normalizedTypeLabel].filter(Boolean).join(' · ') ||
      secondaryValue ||
      normalizedValue ||
      '';
    const isCompactDensity = densityMode === 'compact';
    const isMinimalDensity = densityMode === 'minimal';
    // Density is the single source for size utilities (mergeClassNames is a
    // plain join and does NOT resolve conflicts): the row alto queda ~52/46/40px
    // (comfortable/compact/minimal) como fila plana, no card flotante.
    const contentDensityClass = isMinimalDensity
      ? 'min-h-[2.125rem] gap-1 px-1.5 py-0.5'
      : isCompactDensity
        ? 'min-h-[2.5rem] gap-1.25 px-1.5 py-1'
        : 'min-h-[2.875rem] gap-1.5 px-2 py-1.25';
    const iconDensityClass = isMinimalDensity ? 'h-5 w-5' : isCompactDensity ? 'h-6 w-6' : 'h-7 w-7';
    const gripDensityClass = isMinimalDensity ? 'h-5 w-4 min-w-4' : 'h-6 w-5 min-w-5';
    const valueDensityClass = isMinimalDensity
      ? 'text-[0.68rem]'
      : isCompactDensity
        ? 'text-[0.74rem]'
        : 'text-[0.78rem]';
    const metaDensityClass = densityMode === 'comfortable' ? 'flex-wrap gap-1' : 'flex-nowrap gap-1';
    const metaBadgeDensityClass = densityMode === 'comfortable'
      ? 'px-1.5 py-0 text-[0.64rem]'
      : 'max-w-[7.5rem] px-1.5 py-0 text-[0.6rem]';
    const dragStyle: React.CSSProperties = {
      transform: `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0) scale(${scaleX}, ${scaleY})`,
      transition,
      ...style,
      outline: 'none',
      // Owner accent stays subtle; selection is expressed by ring/background so
      // the row never reads like it is selected just because it has a recipient.
      ...(accentColor ? { '--schema-owner-color': accentColor } : null),
    } as React.CSSProperties;

    return (
      <li
        ref={ref}
        className={mergeClassNames(
          DESIGNER_CLASSNAME + 'list-view-item',
          // `select-none` evita el resaltado azul accidental de texto al
          // arrastrar o pasar el cursor; el estado seleccionado real se expresa
          // con ring/fondo sky y el bloqueado con el candado (nunca por color de
          // texto). `hidden` atenúa la fila sin confundirse con selección.
          'group relative select-none overflow-hidden rounded-lg border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.025)] transition-[background-color,border-color,box-shadow,opacity] duration-150 hover:border-slate-300 hover:bg-slate-50/70 hover:shadow-[0_2px_4px_rgba(15,23,42,0.035)] focus-within:ring-2 focus-within:ring-sky-100 data-[hidden=true]:opacity-60 data-[selected=true]:border-sky-300 data-[selected=true]:bg-sky-50/60 data-[selected=true]:opacity-100 data-[selected=true]:ring-1 data-[selected=true]:ring-sky-200',
          className,
        )}
        style={dragStyle}
        data-dragging={dragging ? 'true' : 'false'}
        data-sorting={sorting ? 'true' : 'false'}
        data-fade-in={fadeIn ? 'true' : 'false'}
        data-selected={selected ? 'true' : 'false'}
        data-hovered={hovered ? 'true' : 'false'}
        data-hidden={hidden ? 'true' : 'false'}
        data-readonly={readOnly ? 'true' : 'false'}
        data-position-locked={positionLocked ? 'true' : 'false'}
        data-testid="right-sidebar-field-item"
        data-schema-type={schemaType}
        data-schema-owner-color={accentColor || undefined}
        data-multi-select-mode={multiSelectMode ? 'true' : 'false'}
        role="option"
        aria-selected={selected}
        onMouseEnter={() => {
          setIsHovered(true);
          onMouseEnter?.();
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          onMouseLeave?.();
        }}
      >
        <button
          type="button"
          className={mergeClassNames(
            DESIGNER_CLASSNAME + 'list-view-item-hit-target',
            'absolute inset-0 z-0 m-0 h-auto w-auto appearance-none rounded-2xl border-0 bg-transparent p-0 text-left shadow-none outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/35',
          )}
          aria-label={valueTooltip}
          onClick={onClick}
          onPointerDown={onRowPointerDown}
          onPointerMove={onRowPointerMove}
          onPointerUp={onRowPointerUp}
          onPointerCancel={onRowPointerCancel}
          onKeyDown={(event) => {
            // Enter reproduce el click corto (reemplazar selección, abrir
            // Detalle si corresponde). Espacio reproduce el long-press
            // (alternar membresía, entrar a multiselección): es el
            // equivalente de teclado obligatorio, no un atajo adicional.
            if (event.key === 'Enter') {
              event.preventDefault();
              onClick?.(event as unknown as React.MouseEvent<HTMLButtonElement>);
            } else if (event.key === ' ') {
              event.preventDefault();
              onToggleSelectionKey?.();
            }
          }}
        />
        <div
          // Sin `w-full`: el proyecto no aplica el preflight de Tailwind, así que
          // `box-sizing` es `content-box` y un `width:100%` sumaría el padding
          // horizontal y desbordaría la fila. Como bloque, el ancho automático
          // ya llena el `li` y deja las acciones pegadas al borde derecho.
          className={mergeClassNames(DESIGNER_CLASSNAME + 'list-view-item-content', 'pointer-events-none relative z-10 flex min-w-0 items-center before:pointer-events-none before:absolute before:inset-y-1.5 before:left-0 before:w-[3px] before:rounded-r-full before:bg-[var(--schema-owner-color,_transparent)] before:opacity-55 before:content-[\'\'] group-data-[selected=true]:before:opacity-100', contentDensityClass)}
          {...props}
          aria-hidden="true">
          <button
            {...listeners}
            type="button"
            aria-label="Reordenar campo"
            className={mergeClassNames(DESIGNER_CLASSNAME + 'list-view-item-grip', 'pointer-events-auto inline-flex shrink-0 touch-none select-none items-center justify-center rounded-md border-0 bg-transparent p-0 text-slate-400 shadow-none opacity-55 transition-colors hover:bg-slate-100 hover:text-slate-700 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200 cursor-grab active:cursor-grabbing', gripDensityClass)}
          >
            <GripVertical size={14} className="pointer-events-none" />
          </button>
          <div draggable={false} className={mergeClassNames(DESIGNER_CLASSNAME + 'list-view-item-icon', 'flex shrink-0 select-none items-center justify-center rounded-md border-0 bg-transparent text-slate-600 shadow-none [&_img]:pointer-events-none [&_img]:select-none [&_svg]:pointer-events-none', iconDensityClass)}>{icon}</div>
          <div className={mergeClassNames(DESIGNER_CLASSNAME + 'list-view-item-main', 'flex min-w-0 flex-1 shrink flex-col gap-[0.125rem]')}>
            <div
              className={mergeClassNames(DESIGNER_CLASSNAME + 'list-view-item-value', 'block min-w-0 truncate font-semibold leading-tight text-slate-800', valueDensityClass)}
              data-testid="right-sidebar-field-label"
              title={normalizedValue || undefined}
            >
              <ItemStatusLabel
                value={value}
                status={status}
                noKeyNameLabel={i18n('noKeyName')}
                notUniqueLabel={i18n('notUniq')}
              />
            </div>
            {secondaryValue || normalizedTypeLabel ? (
              <div
                className={mergeClassNames(DESIGNER_CLASSNAME + 'list-view-item-secondary', 'truncate text-[10px] leading-tight text-slate-500')}
                data-testid="right-sidebar-field-technical-name"
              >
                {secondaryValue}
                {secondaryValue && normalizedTypeLabel ? ' · ' : ''}
                {normalizedTypeLabel ? (
                  <span data-testid="right-sidebar-field-type">{normalizedTypeLabel}</span>
                ) : null}
              </div>
            ) : null}
            {!isMinimalDensity && Array.isArray(metaBadges) && metaBadges.length > 0 ? (
                <div
                className={mergeClassNames(DESIGNER_CLASSNAME + 'list-view-item-meta', 'flex min-w-0 overflow-hidden', metaDensityClass)}
              >
                {metaBadges.map((badge) => (
                  <span
                    key={`${badge.label}-${badge.color || 'default'}`}
                    className={mergeClassNames(DESIGNER_CLASSNAME + 'list-view-item-meta-badge', 'inline-flex max-w-full items-center overflow-hidden text-ellipsis whitespace-nowrap rounded-full border px-2 py-0.5 text-[10px] font-medium shadow-[0_1px_2px_rgba(15,23,42,0.04)]', metaBadgeDensityClass)}
                    style={{
                      color: badge.color || '#667085',
                      background: badge.color ? `${badge.color}1A` : '#F2F4F7',
                      border: `1px solid ${badge.color ? `${badge.color}4D` : '#D0D5DD'}`,
                    }}
                  >
                    {badge.label}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
          <ItemActions
            readOnly={readOnly}
            required={required}
            hidden={hidden}
            onToggleVisibility={onToggleVisibility}
            onDelete={onDelete}
            onToggleReadOnly={onToggleReadOnly}
            isHovered={isHovered}
            label={valueTooltip}
          />
        </div>
      </li>
    );

  }),
);

// Set display name for logging
Item.displayName = 'Item';

export default Item;
