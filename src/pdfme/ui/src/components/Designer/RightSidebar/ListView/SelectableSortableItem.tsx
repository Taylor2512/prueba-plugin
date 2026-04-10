import React, { useContext } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { SchemaForUI } from '@pdfme/common';
import { PluginsRegistry, I18nContext } from '../../../../contexts.js';
import Item from './Item.js';
import { useMountStatus } from '../../../../hooks.js';
import PluginIcon from '../../PluginIcon.js';
import { DESIGNER_CLASSNAME } from '../../../../constants.js';

interface Props {
  isSelected: boolean;
  isHovering?: boolean;
  style?: React.CSSProperties;
  onSelect: (id: string, isShiftSelect: boolean) => void;
  onEdit: (id: string) => void;
  schema: SchemaForUI;
  schemas: SchemaForUI[];
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}
const SelectableSortableItem = ({
  isSelected,
  isHovering,
  style,
  onSelect,
  onEdit,
  schema,
  schemas,
  onMouseEnter,
  onMouseLeave,
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

  const [pluginLabel, thisPlugin] = pluginsRegistry.findWithLabelByType(schema.type);

  let status: undefined | 'is-warning' | 'is-danger';
  if (!schema.name) {
    status = 'is-warning';
  } else if (schemas.find((s) => schema.name && s.name === schema.name && s.id !== schema.id)) {
    status = 'is-danger';
  }

  let title = i18n('edit');
  if (status === 'is-warning') {
    title = i18n('plsInputName');
  } else if (status === 'is-danger') {
    title = i18n('fieldMustUniq');
  }

  const selectedStyle = isSelected
    ? {
        background: 'rgba(240, 165, 0, 0.10)',
        boxShadow: 'inset 0 0 0 1px rgba(240, 165, 0, 0.18)',
        opacity: isSorting || isDragging ? 0.72 : 1,
      }
    : isHovering
      ? {
          background: 'rgba(255, 255, 255, 0.03)',
        }
      : ({} as React.CSSProperties);

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
      style={{ ...style, ...selectedStyle }}
      fadeIn={mountedWhileDragging}
      listeners={newListeners}
    />
  );
};

export default SelectableSortableItem;
