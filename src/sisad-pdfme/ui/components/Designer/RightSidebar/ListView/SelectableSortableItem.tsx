/**
 * Sortable row wrapper for a single schema in the right sidebar ListView.
 *
 * It connects a schema row to dnd-kit via `useSortable`, resolves plugin icon,
 * schema type label, collaboration badges and duplicate-name status, then passes
 * the visual contract down to the generic `Item` component.
 */
import React, { useContext } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { SchemaForUI } from '@sisad-pdfme/common';
import { PluginsRegistry } from '../../../../contexts.js';
import type { EffectiveCollaborationContext } from '../../../../collaborationContext.js';
import Item from './Item.js';
import { useMountStatus } from '../../../../hooks.js';
import PluginIcon from '../../PluginIcon.js';
import { DESIGNER_CLASSNAME } from '../../../../constants.js';
import { resolveListViewItemDescriptor } from './listViewItemResolver.js';


/**
 * Resolves the human-facing row label.
 *
 * A custom `label` takes precedence over the technical schema name; fallback is
 * the generic "Campo" label.
 */
const resolveDisplayLabel = (schema: SchemaForUI) => {
  const readableLabel =
    typeof (schema as SchemaForUI & { label?: string }).label === 'string' &&
    String((schema as SchemaForUI & { label?: string }).label).trim()
      ? String((schema as SchemaForUI & { label?: string }).label).trim()
      : '';
  return readableLabel || String(schema.name || '').trim() || 'Campo';
};


/**
 * Props for a sortable schema row.
 */
interface Props {
  isSelected: boolean;
  isHovering?: boolean;
  isNameDuplicate?: boolean;
  style?: React.CSSProperties;
  onSelect: (_id: string, _isShiftSelect: boolean) => void;
  onEdit: (_id: string) => void;
  onDelete?: () => void;
  schema: SchemaForUI;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  collaborationContext?: EffectiveCollaborationContext;
}

/**
 * Connects one schema row to dnd-kit sorting and collaboration-aware metadata.
 */
const SelectableSortableItem = ({
  isSelected,
  isHovering,
  isNameDuplicate,
  style,
  onSelect,
  onEdit,
  onDelete,
  schema,
  onMouseEnter,
  onMouseLeave,
  collaborationContext,
}: Props) => {
  const pluginsRegistry = useContext(PluginsRegistry);
  const { setNodeRef, listeners, isDragging, isSorting, transform, transition } = useSortable({
    id: schema.id,
  });
  const mounted = useMountStatus();
  const mountedWhileDragging = isDragging && !mounted;

  const newListeners = {
    ...listeners,
    onClick: (event: React.MouseEvent) => onSelect(schema.id, event.shiftKey),
  };

  const [pluginLabel, thisPlugin] = React.useMemo(
    () => pluginsRegistry.findWithLabelByType(schema.type),
    [pluginsRegistry, schema.type],
  );
  const itemDescriptor = React.useMemo(
    () => resolveListViewItemDescriptor(schema, collaborationContext),
    [collaborationContext, schema],
  );
  const collaborationColor = itemDescriptor.ownerColor || undefined;
  const primaryLabel = itemDescriptor.primaryLabel || resolveDisplayLabel(schema);
  const technicalName = itemDescriptor.secondaryLabel || String(schema.name || '').trim() || 'Campo';
  const schemaTypeLabel = itemDescriptor.typeLabel;
  const collaborationBadges = itemDescriptor.badges;

  let status: undefined | 'is-warning' | 'is-danger';
  if (!schema.name) {
    status = 'is-warning';
  } else if (isNameDuplicate) {
    status = 'is-danger';
  }

  return (
    <Item
      ref={setNodeRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={() => onEdit(schema.id)}
      value={primaryLabel}
      schemaType={schema.type}
      title={technicalName}
      typeLabel={schemaTypeLabel}
      className={DESIGNER_CLASSNAME + 'item-auto rounded-2xl'}
      status={status}
      required={itemDescriptor.isRequired}
      readOnly={itemDescriptor.isReadOnly}
      dragging={isDragging}
      sorting={isSorting}
      transition={transition}
      transform={transform}
      selected={isSelected}
      hovered={isHovering}
      onDelete={onDelete}
      style={style}
      fadeIn={mountedWhileDragging}
      listeners={newListeners}
      accentColor={collaborationColor}
      metaBadges={collaborationBadges}
      icon={thisPlugin && <PluginIcon plugin={thisPlugin} label={pluginLabel} size={20} styles={collaborationColor ? { color: collaborationColor } : undefined} />}
    />
  );
};

export default SelectableSortableItem;
