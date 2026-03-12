import React, { useState, useContext, ReactNode } from 'react';
import {
  closestCorners,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensors,
  useSensor,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SchemaForUI } from '@pdfme/common';
import type { SidebarProps } from '../../../../types.js';
import { PluginsRegistry } from '../../../../contexts.js';
import { DESIGNER_CLASSNAME } from '../../../../constants.js';
import SelectableSortableItem from './SelectableSortableItem.js';
import PluginIcon from '../../PluginIcon.js';
import ListViewDragOverlay from './ListViewDragOverlay.js';

const SelectableSortableContainer = (
  props: Pick<
    SidebarProps,
    'schemas' | 'onEdit' | 'onSortEnd' | 'hoveringSchemaId' | 'onChangeHoveringSchemaId'
  >,
) => {
  const { schemas, onEdit, onSortEnd, hoveringSchemaId, onChangeHoveringSchemaId } = props;
  const [selectedSchemas, setSelectedSchemas] = useState<SchemaForUI[]>([]);
  const [dragOverlaidItems, setClonedItems] = useState<SchemaForUI[] | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const pluginsRegistry = useContext(PluginsRegistry);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 15 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const isItemSelected = (itemId: string): boolean =>
    selectedSchemas.map((i) => i.id).includes(itemId);

  const onSelectionChanged = (id: string, isShiftSelect: boolean) => {
    if (isShiftSelect) {
      if (isItemSelected(id)) {
        const newSelectedSchemas = selectedSchemas.filter((item) => item.id !== id);
        setSelectedSchemas(newSelectedSchemas);
      } else {
        const newSelectedItem = schemas.find((schema) => schema.id === id)!;
        const newSelectedSchemas = selectedSchemas.concat(newSelectedItem);
        setSelectedSchemas(newSelectedSchemas);
      }
    } else {
      setSelectedSchemas([]);
    }
  };

  const getPluginIcon = (inSchema: string | SchemaForUI): ReactNode => {
    // Get schema by ID or use directly
    const thisSchema =
      typeof inSchema === 'string' ? schemas.find((schema) => schema.id === inSchema) : inSchema;

    if (!thisSchema) return <></>;

    const [pluginLabel, activePlugin] = pluginsRegistry.findWithLabelByType(thisSchema.type);

    if (!activePlugin) {
      return <></>;
    }

    return (
      <PluginIcon
        plugin={activePlugin}
        label={pluginLabel}
        size={20}
        styles={{ marginRight: '0.5rem' }}
      />
    );
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={({ active }) => {
        setActiveId(String(active.id));
        setClonedItems(schemas);

        if (!isItemSelected(String(active.id))) {
          const newSelectedSchemas: SchemaForUI[] = [];
          setSelectedSchemas(newSelectedSchemas);
        } else if (selectedSchemas.length > 0) {
          onSortEnd(
            selectedSchemas.reduce((ret, selectedItem) => {
              if (selectedItem.id === String(active.id)) {
                return ret;
              }
              return ret.filter((schema) => schema !== selectedItem);
            }, schemas),
          );
        }
      }}
      onDragEnd={({ active, over }) => {
        const overId = over?.id || '';

        const activeIndex = schemas.map((i) => i.id).indexOf(String(active.id));
        const overIndex = schemas.map((i) => i.id).indexOf(String(overId));

        if (selectedSchemas.length) {
          let newSchemas = [...schemas];
          newSchemas = arrayMove(newSchemas, activeIndex, overIndex);
          newSchemas.splice(
            overIndex + 1,
            0,
            ...selectedSchemas.filter((item) => item.id !== activeId),
          );
          onSortEnd(newSchemas);
          setSelectedSchemas([]);
        } else if (activeIndex !== overIndex) {
          onSortEnd(arrayMove(schemas, activeIndex, overIndex));
        }

        setActiveId(null);
      }}
      onDragCancel={() => {
        if (dragOverlaidItems) {
          onSortEnd(dragOverlaidItems);
        }

        setActiveId(null);
        setClonedItems(null);
      }}
    >
      <>
        <SortableContext items={schemas} strategy={verticalListSortingStrategy}>
          <ul className={DESIGNER_CLASSNAME + 'list-view-items-wrapper'}>
            {schemas.map((schema) => (
              <SelectableSortableItem
                key={schema.id}
                schema={schema}
                schemas={schemas}
                isSelected={isItemSelected(schema.id) || activeId === schema.id}
                isHovering={schema.id === hoveringSchemaId}
                onEdit={onEdit}
                onSelect={onSelectionChanged}
                onMouseEnter={() => onChangeHoveringSchemaId(schema.id)}
                onMouseLeave={() => onChangeHoveringSchemaId(null)}
              />
            ))}
          </ul>
        </SortableContext>
        <ListViewDragOverlay
          activeId={activeId}
          schemas={schemas}
          selectedSchemas={selectedSchemas}
          renderIcon={getPluginIcon}
        />
      </>
    </DndContext>
  );
};

export default SelectableSortableContainer;
