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
import { mergeClassNames } from '../../shared/className.js';


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
  densityMode?: 'compact' | 'comfortable' | 'minimal';
  isSelected: boolean;
  isHovering?: boolean;
  isNameDuplicate?: boolean;
  style?: React.CSSProperties;
  onSelect: (
    _id: string,
    _intent: { isRange: boolean; isToggle: boolean },
  ) => void;
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
  densityMode = 'compact',
  isSelected,
  isHovering,
  isNameDuplicate,
  style,
  onSelect,
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
      onClick={(event) =>
        onSelect(schema.id, {
          isRange: event.shiftKey,
          isToggle: event.metaKey || event.ctrlKey,
        })
      }
      value={primaryLabel}
      schemaType={schema.type}
      title={technicalName}
      typeLabel={schemaTypeLabel}
      status={status}
      required={itemDescriptor.isRequired}
      readOnly={itemDescriptor.isReadOnly}
      dragging={isDragging}
      sorting={isSorting}
      transition={transition}
      transform={transform}
      selected={isSelected}
      hovered={isHovering}
      densityMode={densityMode}
      onDelete={onDelete}
      style={style}
      fadeIn={mountedWhileDragging}
      listeners={listeners}
      accentColor={collaborationColor}
      metaBadges={collaborationBadges}
      icon={thisPlugin && <PluginIcon plugin={thisPlugin} label={pluginLabel} size={20} styles={collaborationColor ? { color: collaborationColor } : undefined} />}
      className={mergeClassNames(
        DESIGNER_CLASSNAME + 'item-auto',
        'flex items-center gap-[0.5rem] p-[0.375rem] cursor-pointer rounded-2xl',
      )}
    />
  );
};

export default SelectableSortableItem;
