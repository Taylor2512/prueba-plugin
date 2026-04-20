import React, { useState, useContext, ReactNode } from 'react';
import { useEffect, useMemo } from 'react';
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
import { SchemaForUI } from '@sisad-pdfme/common';
import type { SidebarProps } from '../../../../types.js';
import { PluginsRegistry } from '../../../../contexts.js';
import { DESIGNER_CLASSNAME } from '../../../../constants.js';
import SelectableSortableItem from './SelectableSortableItem.js';
import PluginIcon from '../../PluginIcon.js';
import ListViewDragOverlay from './ListViewDragOverlay.js';

const SelectableSortableContainer = (
  props: Pick<
    SidebarProps,
    'onEdit' | 'onSortEnd' | 'hoveringSchemaId' | 'onChangeHoveringSchemaId'
  > & {
    allSchemas: SchemaForUI[];
    visibleSchemas: SchemaForUI[];
    activeSchemaIds: string[];
  },
) => {
  const {
    allSchemas,
    visibleSchemas,
    activeSchemaIds,
    onEdit,
    onSortEnd,
    hoveringSchemaId,
    onChangeHoveringSchemaId,
  } = props;
  const [selectedSchemas, setSelectedSchemas] = useState<SchemaForUI[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const pluginsRegistry = useContext(PluginsRegistry);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 15 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const mergeVisibleOrder = (nextVisibleOrder: SchemaForUI[]) => {
    const visibleIdSet = new Set(visibleSchemas.map((schema) => schema.id));
    const orderedVisible = [...nextVisibleOrder];

    return allSchemas.map((schema) => {
      if (!visibleIdSet.has(schema.id)) return schema;
      return orderedVisible.shift() || schema;
    });
  };

  const controlledSelectedIdSet = useMemo(() => new Set(activeSchemaIds), [activeSchemaIds]);
  const selectedIdSet = useMemo(
    () => new Set([...activeSchemaIds, ...selectedSchemas.map((schema) => schema.id)]),
    [activeSchemaIds, selectedSchemas],
  );
  const isItemSelected = (itemId: string): boolean => selectedIdSet.has(itemId);

  useEffect(() => {
    if (activeId) return;
    const externalSelected = visibleSchemas.filter((schema) => controlledSelectedIdSet.has(schema.id));
    setSelectedSchemas(externalSelected);
  }, [activeId, controlledSelectedIdSet, visibleSchemas]);

  const onSelectionChanged = (id: string, isShiftSelect: boolean) => {
    if (isShiftSelect) {
      if (isItemSelected(id)) {
        const newSelectedSchemas = selectedSchemas.filter((item) => item.id !== id);
        setSelectedSchemas(newSelectedSchemas);
      } else {
        const newSelectedItem = visibleSchemas.find((schema) => schema.id === id);
        if (!newSelectedItem) return;
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
      typeof inSchema === 'string' ? allSchemas.find((schema) => schema.id === inSchema) : inSchema;

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

        if (!isItemSelected(String(active.id))) {
          setSelectedSchemas([]);
        }
      }}
      onDragEnd={({ active, over }) => {
        const overId = over?.id || '';
        if (!overId) {
          setActiveId(null);
          return;
        }

        const activeIndex = visibleSchemas.map((i) => i.id).indexOf(String(active.id));
        const overIndex = visibleSchemas.map((i) => i.id).indexOf(String(overId));

        if (activeIndex < 0 || overIndex < 0) {
          setActiveId(null);
          return;
        }

        if (selectedSchemas.length) {
          let reorderedVisible = [...visibleSchemas];
          reorderedVisible = arrayMove(reorderedVisible, activeIndex, overIndex);
          const selectedIds = new Set(
            selectedSchemas.filter((item) => item.id !== activeId).map((item) => item.id),
          );
          const trailingSelected = reorderedVisible.filter((item) => selectedIds.has(item.id));
          reorderedVisible = reorderedVisible.filter((item) => !selectedIds.has(item.id));
          reorderedVisible.splice(
            overIndex + 1,
            0,
            ...trailingSelected,
          );
          onSortEnd(mergeVisibleOrder(reorderedVisible));
          setSelectedSchemas([]);
        } else if (activeIndex !== overIndex) {
          onSortEnd(mergeVisibleOrder(arrayMove(visibleSchemas, activeIndex, overIndex)));
        }

        setActiveId(null);
      }}
      onDragCancel={() => {
        setActiveId(null);
      }}
    >
      <>
        <SortableContext items={visibleSchemas} strategy={verticalListSortingStrategy}>
          <ul className={DESIGNER_CLASSNAME + 'list-view-items-wrapper'}>
            {visibleSchemas.map((schema) => (
              <SelectableSortableItem
                key={schema.id}
                schema={schema}
                schemas={allSchemas}
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
          schemas={allSchemas}
          selectedSchemas={selectedSchemas}
          renderIcon={getPluginIcon}
        />
      </>
    </DndContext>
  );
};

export default SelectableSortableContainer;
