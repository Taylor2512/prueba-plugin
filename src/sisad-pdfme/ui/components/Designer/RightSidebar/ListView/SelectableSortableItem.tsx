import React, { useContext } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { SchemaForUI } from '@sisad-pdfme/common';
import { PluginsRegistry, I18nContext } from '../../../../contexts.js';
import { resolveSchemaCollaborationState } from '../../../../collaborationContext.js';
import type { EffectiveCollaborationContext } from '../../../../collaborationContext.js';
import Item from './Item.js';
import { useMountStatus } from '../../../../hooks.js';
import PluginIcon from '../../PluginIcon.js';
import { DESIGNER_CLASSNAME } from '../../../../constants.js';

interface Props {
  isSelected: boolean;
  isHovering?: boolean;
  isNameDuplicate?: boolean;
  style?: React.CSSProperties;
  onSelect: (_id: string, _isShiftSelect: boolean) => void;
  onEdit: (_id: string) => void;
  schema: SchemaForUI;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  collaborationContext?: EffectiveCollaborationContext;
}
const SelectableSortableItem = ({
  isSelected,
  isHovering,
  isNameDuplicate,
  style,
  onSelect,
  onEdit,
  schema,
  onMouseEnter,
  onMouseLeave,
  collaborationContext,
}: Props) => {
  const i18n = useContext(I18nContext);
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
  const collaborationState = React.useMemo(
    () => resolveSchemaCollaborationState(schema, collaborationContext),
    [collaborationContext, schema],
  );
  const collaborationColor = collaborationState.userColor || collaborationState.ownerColor || undefined;
  const collaborationBadges = React.useMemo(() => {
    const items: Array<{ label: string; color?: string }> = [];
    if (collaborationState.isShared) {
      items.push({ label: 'Compartido', color: collaborationColor });
    } else if (collaborationState.isOwnerOther) {
      items.push({ label: 'Ajeno', color: collaborationColor });
    } else if (collaborationState.isOwnerActive) {
      items.push({ label: 'Propio', color: collaborationColor });
    }
    if (collaborationState.ownerRecipientName) {
      items.push({ label: collaborationState.ownerRecipientName, color: collaborationColor });
    }
    return items.slice(0, 2);
  }, [collaborationColor, collaborationState]);

  let status: undefined | 'is-warning' | 'is-danger';
  if (!schema.name) {
    status = 'is-warning';
  } else if (isNameDuplicate) {
    status = 'is-danger';
  }

  let title = i18n('edit');
  if (status === 'is-warning') {
    title = i18n('plsInputName');
  } else if (status === 'is-danger') {
    title = i18n('fieldMustUniq');
  }

  return (
    <Item
      ref={setNodeRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={() => onEdit(schema.id)}
      icon={thisPlugin && <PluginIcon plugin={thisPlugin} label={pluginLabel} size={20} />}
      value={schema.name}
      schemaType={schema.type}
      className={DESIGNER_CLASSNAME + 'item-auto'}
      status={status}
      title={title}
      required={schema.required}
      readOnly={schema.readOnly}
      dragging={isDragging}
      sorting={isSorting}
      transition={transition}
      transform={transform}
      selected={isSelected}
      hovered={isHovering}
      style={style}
      fadeIn={mountedWhileDragging}
      listeners={newListeners}
      accentColor={collaborationColor}
      metaBadges={collaborationBadges}
    />
  );
};

export default SelectableSortableItem;
