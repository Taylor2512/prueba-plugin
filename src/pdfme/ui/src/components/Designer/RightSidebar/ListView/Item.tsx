import React, { useEffect, useContext, useState } from 'react';
import { DraggableSyntheticListeners } from '@dnd-kit/core';
import { I18nContext } from '../../../../contexts.js';
import { GripVertical, CircleAlert, Lock, Eye, EyeOff, Trash2 } from 'lucide-react';
import { Button, Typography, Tooltip } from 'antd';
import { DESIGNER_CLASSNAME } from '../../../../constants.js';

const { Text } = Typography;

// Schema type → accent color mapping (Wix-like color coding)
const SCHEMA_TYPE_COLORS: Record<string, string> = {
  text: '#4F8EF7',
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
const getTypeColor = (type?: string) => (type ? (SCHEMA_TYPE_COLORS[type] ?? '#888') : '#888');

const iconButtonBaseStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '2px 3px',
  borderRadius: 4,
  display: 'flex',
  alignItems: 'center',
  transition: 'opacity 0.15s',
};

// Define prop types for Item component
interface Props {
  /** Content to display in the item */
  value: React.ReactNode;
  /** Schema type (used for color coding) */
  schemaType?: string;
  /** Optional icon to display */
  icon?: React.ReactNode;
  /** Custom styles for the item */
  style?: React.CSSProperties;
  /** Status indicator for the item */
  status?: 'is-warning' | 'is-danger';
  /** Title attribute for the item */
  title?: string;
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
  /** Whether to fade the item in */
  fadeIn?: boolean;
  /** Drag listeners from dnd-kit */
  listeners?: DraggableSyntheticListeners;
}

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

  return (
    <span className={DESIGNER_CLASSNAME + 'list-view-item-status'}>
      <CircleAlert size={14} />
      {statusText}
      {status === 'is-danger' ? notUniqueLabel : ''}
    </span>
  );
};

const ItemActions = ({
  readOnly,
  required,
  hidden,
  onToggleVisibility,
  onDelete,
  isHovered,
}: {
  readOnly?: boolean;
  required?: boolean;
  hidden?: boolean;
  onToggleVisibility?: () => void;
  onDelete?: () => void;
  isHovered?: boolean;
}) => (
  <div className={DESIGNER_CLASSNAME + 'list-view-item-actions'}>
    {readOnly && <Lock size={13} className={DESIGNER_CLASSNAME + 'list-view-item-lock'} />}
    {required && <span className={DESIGNER_CLASSNAME + 'list-view-item-required'}>*</span>}
    {onToggleVisibility && (
      <button
        onClick={(e) => { e.stopPropagation(); onToggleVisibility(); }}
        title={hidden ? 'Mostrar' : 'Ocultar'}
        className={DESIGNER_CLASSNAME + "button-auto"}
      >
        {hidden ? <EyeOff size={13} /> : <Eye size={13} />}
      </button>
    )}
    {onDelete && isHovered && (
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
        title="Eliminar campo"
        className={DESIGNER_CLASSNAME + "button-auto"}
      >
        <Trash2 size={13} />
      </button>
    )}
  </div>
);

// Using React.memo and forwardRef for optimized rendering
// Using TypeScript interface for prop validation instead of PropTypes
const Item = React.memo(
  React.forwardRef<HTMLLIElement, Props>(function Item(
    {
      icon,
      value,
      schemaType,
      status,
      title,
      required,
      readOnly,
      hidden,
      onToggleVisibility,
      onDelete,
      style,
      dragOverlay,
      onClick,
      onMouseEnter,
      onMouseLeave,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      dragging,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      fadeIn,
      listeners,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      sorting,
      transition,
      transform,
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

    return (
      <li
        onMouseEnter={() => { setIsHovered(true); onMouseEnter?.(); }}
        onMouseLeave={() => { setIsHovered(false); onMouseLeave?.(); }}
        ref={ref}
        className={DESIGNER_CLASSNAME + 'list-view-item'}
        style={{ '--type-accent': typeAccent } as React.CSSProperties}
        data-schema-type={schemaType}>
        <div
          className={DESIGNER_CLASSNAME + 'list-view-item-content'}
          {...props}
          onClick={onClick}>
          <Button
            {...listeners}
            className={DESIGNER_CLASSNAME + 'list-view-item-grip'}
            icon={<GripVertical size={14} />} />
          <div className={DESIGNER_CLASSNAME + 'list-view-item-icon'}>{icon}</div>
          <Text
            className={DESIGNER_CLASSNAME + 'list-view-item-value'}
            title={title || ''}>
            <ItemStatusLabel
              value={value}
              status={status}
              noKeyNameLabel={i18n('noKeyName')}
              notUniqueLabel={i18n('notUniq')}
            />
          </Text>
          <ItemActions
            readOnly={readOnly}
            required={required}
            hidden={hidden}
            onToggleVisibility={onToggleVisibility}
            onDelete={onDelete}
            isHovered={isHovered}
          />
        </div>
      </li>
    );

  }),
);

// Set display name for logging
Item.displayName = 'Item';

export default Item;
