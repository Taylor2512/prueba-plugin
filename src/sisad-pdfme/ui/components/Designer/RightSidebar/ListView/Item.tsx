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
import { I18nContext } from '../../../../contexts.js';
import { GripVertical, CircleAlert, Lock, Eye, EyeOff, Trash2 } from 'lucide-react';
import { Button, Tooltip } from 'antd';
import { DESIGNER_CLASSNAME } from '../../../../constants.js';
import { mergeClassNames } from '../../shared/className.js';

/**
 * Color palette used to visually distinguish schema families in the field list.
 *
 * These colors are only visual accents. They do not determine ownership,
 * permissions or collaboration state.
 */
const SCHEMA_TYPE_COLORS: Record<string, string> = {
  text: '#4F8EF7',
  number: '#F59E0B',
  multiVariableText: '#7B61FF',
  image: '#00C2A8',
  svg: '#00C2A8',
  table: '#FF8C42',
  line: '#A0A0A0',
  rectangle: '#FFD166',
  ellipse: '#EF476F',
  checkbox: '#06D6A0',
  radioGroup: '#06D6A0',
  select: '#118AB2',
  date: '#9B5DE5',
  dateTime: '#9B5DE5',
  time: '#9B5DE5',
  qrcode: '#073B4C',
  ean13: '#073B4C',
  code39: '#073B4C',
  code128: '#073B4C',
};

/**
 * Resolves the accent color associated with a schema type.
 *
 * @param type Schema type from the plugin/runtime.
 * @returns Hex color used as fallback visual accent.
 */
const getTypeColor = (type?: string) => (type ? (SCHEMA_TYPE_COLORS[type] ?? '#888') : '#888');


// Define prop types for Item component

/**
 * Props for a single field-list row.
 *
 * The row is intentionally presentational: it receives drag listeners, status,
 * metadata and action callbacks from the sortable container.
 */
interface Props {
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
  /** Whether the item is hidden on canvas */
  hidden?: boolean;
  /** Called when visibility icon is toggled */
  onToggleVisibility?: () => void;
  /** Called when delete is requested from the item row */
  onDelete?: () => void;
  /** Whether the item is being dragged as an overlay */
  dragOverlay?: boolean;
  /** Click handler for the item */
  onClick?: () => void;
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
    <Tooltip title={status === 'is-danger' ? `${tooltipText} ${notUniqueLabel}` : tooltipText}>
      <span className={mergeClassNames(DESIGNER_CLASSNAME + 'list-view-item-status', 'inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700')}>
        <CircleAlert size={14} />
        {statusText}
        {status === 'is-danger' ? notUniqueLabel : ''}
      </span>
    </Tooltip>
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
  isHovered,
  label,
}: {
  readOnly?: boolean;
  required?: boolean;
  hidden?: boolean;
  onToggleVisibility?: () => void;
  onDelete?: () => void;
  isHovered?: boolean;
  label?: string;
}) => (
    <div className={mergeClassNames(DESIGNER_CLASSNAME + 'list-view-item-actions', 'flex items-center gap-1.5')}>
      {readOnly ? (
        <Tooltip title="Solo lectura" placement="top">
        <span data-testid="right-sidebar-field-badge" data-badge="readonly" className="pointer-events-auto inline-flex">
          <Lock size={13} className={mergeClassNames(DESIGNER_CLASSNAME + 'list-view-item-lock', 'text-slate-500')} />
        </span>
        </Tooltip>
      ) : null}
    {required ? (
      <Tooltip title="Campo requerido" placement="top">
        <span
          data-testid="right-sidebar-field-badge"
          data-badge="required"
          className={mergeClassNames(DESIGNER_CLASSNAME + 'list-view-item-required', 'pointer-events-auto text-xs font-semibold text-rose-600')}
        >
          *
        </span>
      </Tooltip>
    ) : null}
    {onToggleVisibility ? (
      <Tooltip title={hidden ? 'Mostrar campo en el lienzo' : 'Ocultar campo del lienzo'} placement="top">
        <button
          onClick={(e) => { e.stopPropagation(); onToggleVisibility(); }}
          title={hidden ? 'Mostrar' : 'Ocultar'}
          {...(hidden ? { 'data-testid': 'right-sidebar-field-badge', 'data-badge': 'hidden' } : {})}
          className={mergeClassNames(DESIGNER_CLASSNAME + 'button-auto', 'pointer-events-auto inline-flex h-7 w-2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm')}
        >
          {hidden ? <EyeOff size={13} /> : <Eye size={13} />}
        </button>
      </Tooltip>
    ) : null}
    {onDelete && isHovered ? (
      <Tooltip title="Eliminar campo" placement="top">
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
          className={mergeClassNames(DESIGNER_CLASSNAME + 'button-auto', 'pointer-events-auto inline-flex h-7 w-7 items-center justify-center rounded-full border border-rose-200 bg-white text-rose-600 shadow-sm')}
        >
          <Trash2 size={13} />
        </button>
      </Tooltip>
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
      icon,
      value,
      schemaType,
      status,
      title,
      typeLabel,
      required,
      readOnly,
      hidden,
      onToggleVisibility,
      onDelete,
      style,
      className,
      dragOverlay,
      onClick,
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
    const typeAccent = getTypeColor(schemaType);
    const normalizedValue =
      typeof value === 'string' || typeof value === 'number' ? String(value) : undefined;
    const secondaryValue = typeof title === 'string' && title.trim() && title !== normalizedValue ? title.trim() : '';
    const normalizedTypeLabel = typeof typeLabel === 'string' && typeLabel.trim() ? typeLabel.trim() : '';
    const valueTooltip =
      [normalizedValue, secondaryValue, normalizedTypeLabel].filter(Boolean).join(' · ') ||
      secondaryValue ||
      normalizedValue ||
      '';
    const dragStyle: React.CSSProperties = {
      transform: `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0) scale(${scaleX}, ${scaleY})`,
      transition,
      ...style,
      '--type-accent': typeAccent,
      // Owner accent is exposed only as a CSS variable; the subtle left border
      // and the selection ring are drawn by CSS so real selection always wins
      // over the owner color and both never read as the same state.
      ...(accentColor ? { '--schema-owner-color': accentColor } : null),
    } as React.CSSProperties;

    return (
      <li
        ref={ref}
        className={mergeClassNames(
          DESIGNER_CLASSNAME + 'list-view-item',
          'relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white/95 shadow-sm transition-[background,border-color,box-shadow,transform] duration-150 hover:border-slate-300 hover:bg-slate-50/80 data-[selected=true]:border-sky-300 data-[selected=true]:bg-sky-50/70 data-[selected=true]:shadow-[0_0_0_1px_rgba(56,189,248,0.18)]',
          className,
        )}
        style={dragStyle}
        data-dragging={dragging ? 'true' : 'false'}
        data-sorting={sorting ? 'true' : 'false'}
        data-fade-in={fadeIn ? 'true' : 'false'}
        data-selected={selected ? 'true' : 'false'}
        data-hovered={hovered ? 'true' : 'false'}
        data-testid="right-sidebar-field-item"
        data-schema-type={schemaType}
        data-schema-owner-color={accentColor || undefined}>
        <button
          type="button"
          className={mergeClassNames(DESIGNER_CLASSNAME + 'list-view-item-hit-target', 'absolute inset-0 z-0 rounded-2xl focus-visible:outline-none')}
          aria-label={valueTooltip}
          onMouseEnter={() => { setIsHovered(true); onMouseEnter?.(); }}
          onMouseLeave={() => { setIsHovered(false); onMouseLeave?.(); }}
          onClick={onClick}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              onClick?.();
            }
          }}
        />
        <div
          className={mergeClassNames(DESIGNER_CLASSNAME + 'list-view-item-content', 'pointer-events-none relative z-10 flex items-start gap-3 px-3 py-2.5 pl-4 before:pointer-events-none before:absolute before:inset-y-2 before:left-2 before:w-[2px] before:rounded-full before:bg-[var(--schema-owner-color,_transparent)] before:opacity-30 before:content-[\'\']')}
          {...props}
          aria-hidden="true">
          <Button
            {...listeners}
            className={mergeClassNames(DESIGNER_CLASSNAME + 'list-view-item-grip', 'pointer-events-auto inline-flex h-8 w-1 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 transition-colors hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700 data-[selected=true]:border-sky-300')}
            icon={<GripVertical size={14} />} />
          <div className={mergeClassNames(DESIGNER_CLASSNAME + 'list-view-item-icon', 'flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 shadow-inner shadow-white/40')}>{icon}</div>
          <div className={mergeClassNames(DESIGNER_CLASSNAME + 'list-view-item-main', 'min-w-0 flex-1 space-y-0.5')}>
            <div
              className={mergeClassNames(DESIGNER_CLASSNAME + 'list-view-item-value', 'block text-sm font-medium leading-tight text-slate-800')}
              data-testid="right-sidebar-field-label"
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
                className={mergeClassNames(DESIGNER_CLASSNAME + 'list-view-item-secondary', 'truncate text-[11px] leading-tight text-slate-500')}
                data-testid="right-sidebar-field-technical-name"
              >
                {secondaryValue}
                {secondaryValue && normalizedTypeLabel ? ' · ' : ''}
                {normalizedTypeLabel ? (
                  <span data-testid="right-sidebar-field-type">{normalizedTypeLabel}</span>
                ) : null}
              </div>
            ) : null}
            {Array.isArray(metaBadges) && metaBadges.length > 0 ? (
              <div
                className={mergeClassNames(DESIGNER_CLASSNAME + 'list-view-item-meta', 'flex flex-wrap gap-1.5')}
              >
                {metaBadges.map((badge) => (
                  <span
                    key={`${badge.label}-${badge.color || 'default'}`}
                    className={mergeClassNames(DESIGNER_CLASSNAME + 'list-view-item-meta-badge', 'inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium')}
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
