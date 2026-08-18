/**
 * Sortable and selectable schema-list container.
 *
 * This component bridges the right sidebar list with dnd-kit:
 * - creates drag sensors;
 * - keeps local multi-selection state for Shift selection;
 * - merges reordered visible results back into the full schema list;
 * - renders sortable rows and a body-level drag overlay;
 * - resolves plugin icons and collaboration colors for row previews.
 */
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  closestCorners,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import type { SchemaForUI } from '@sisad-pdfme/common';
import type { SidebarProps } from '@sisad-pdfme/ui/types';

import { DESIGNER_CLASSNAME } from '@sisad-pdfme/ui/constants';
import { PluginsRegistry } from '@sisad-pdfme/ui/contexts';
import PluginIcon from '@sisad-pdfme/ui/components/Designer/PluginIcon';
import { mergeClassNames } from '@sisad-pdfme/ui/components/Designer/shared/className';
import { resolveSchemaInteractionState } from '@sisad-pdfme/ui/components/Designer/shared/schemaInteractionState';
import type { SelectionCommandSet } from '@sisad-pdfme/ui/components/Designer/shared/selectionCommands';
import ListViewDragOverlay from '@sisad-pdfme/ui/components/Designer/RightSidebar/ListView/ListViewDragOverlay';
import SelectableSortableItem from '@sisad-pdfme/ui/components/Designer/RightSidebar/ListView/SelectableSortableItem';

type DensityMode = 'compact' | 'comfortable' | 'minimal';

type SelectableSortableContainerProps = Pick<
  SidebarProps,
  | 'onEdit'
  | 'onSortEnd'
  | 'hoveringSchemaId'
  | 'onChangeHoveringSchemaId'
  | 'collaborationContext'
> & {
  allSchemas: SchemaForUI[];
  visibleSchemas: SchemaForUI[];
  activeSchemaIds: string[];
  densityMode?: DensityMode;
  selectionCommands?: SelectionCommandSet;
  /**
   * Modo de multiselección: autoridad única en `RightSidebar`, que también lo
   * usa para suprimir el salto automático a Detalle mientras está activo. El
   * contenedor sólo lo LEE y pide cambios; no guarda una copia propia.
   */
  multiSelectMode?: boolean;
  onMultiSelectModeChange?: (_next: boolean) => void;
};

const DENSITY_CLASSES: Record<
  DensityMode,
  {
    body: string;
    list: string;
  }
> = {
  comfortable: {
    body: 'px-1.5 pb-2 pt-1',
    list: 'gap-1.5',
  },
  compact: {
    body: 'px-1 pb-1.5 pt-0.5',
    list: 'gap-1',
  },
  minimal: {
    body: 'px-0.5 pb-1 pt-0.5',
    list: 'gap-0.5',
  },
};

/**
 * Container responsible for selectable and sortable schema rows.
 *
 * Selection state is owned by Designer and provided through `activeSchemaIds`.
 */
const SelectableSortableContainer = ({
  allSchemas,
  visibleSchemas,
  activeSchemaIds,
  densityMode = 'compact',
  onEdit,
  onSortEnd,
  hoveringSchemaId,
  onChangeHoveringSchemaId,
  collaborationContext,
  selectionCommands,
  multiSelectMode = false,
  onMultiSelectModeChange,
}: SelectableSortableContainerProps) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [rangeAnchorId, setRangeAnchorId] = useState<string | null>(null);

  const pluginsRegistry = useContext(PluginsRegistry);
  const densityClasses = DENSITY_CLASSES[densityMode];

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const visibleSchemaIds = useMemo(
    () => visibleSchemas.map((schema) => schema.id),
    [visibleSchemas],
  );

  const visibleSchemaIdSet = useMemo(
    () => new Set(visibleSchemaIds),
    [visibleSchemaIds],
  );

  const selectedIdSet = useMemo(() => new Set(activeSchemaIds), [activeSchemaIds]);

  /**
   * Sale del modo de multiselección cuando la selección queda vacía.
   *
   * Escape NO se maneja aquí: el atajo global de Designer
   * (`useInitEvents`/`useDesignerKeyboardShortcuts`) ya escucha Escape en
   * todo el documento para vaciar la selección. Un segundo listener local
   * competiría por el mismo evento; en vez de eso, Designer conoce
   * `multiSelectMode` y su callback de `clearSelection` sale del modo en
   * lugar de vaciar la selección mientras está activo (ver
   * `Designer/index.tsx`, `onClearSelection`).
   */
  useEffect(() => {
    if (multiSelectMode && activeSchemaIds.length === 0) {
      onMultiSelectModeChange?.(false);
    }
  }, [activeSchemaIds.length, multiSelectMode, onMultiSelectModeChange]);

  const selectedSchemas = useMemo(
    () => visibleSchemas.filter((schema) => selectedIdSet.has(schema.id)),
    [selectedIdSet, visibleSchemas],
  );

  const duplicateNameSet = useMemo(() => {
    const counts = new Map<string, number>();

    allSchemas.forEach((schema) => {
      const normalizedName = String(schema.name || '').trim();
      if (!normalizedName) return;

      counts.set(normalizedName, (counts.get(normalizedName) || 0) + 1);
    });

    return new Set(
      [...counts.entries()]
        .filter(([, count]) => count > 1)
        .map(([name]) => name),
    );
  }, [allSchemas]);

  const mergeVisibleOrder = useCallback(
    (nextVisibleOrder: SchemaForUI[]) => {
      const orderedVisible = [...nextVisibleOrder];

      return allSchemas.map((schema) => {
        if (!visibleSchemaIdSet.has(schema.id)) return schema;
        return orderedVisible.shift() || schema;
      });
    },
    [allSchemas, visibleSchemaIdSet],
  );

  const isItemSelected = useCallback(
    (itemId: string) => selectedIdSet.has(itemId),
    [selectedIdSet],
  );

  /**
   * Delegates selection updates to Designer as the single source of truth.
   */
  const handleSelectionRequested = useCallback(
    (
      id: string,
      rawIntent: { isRange: boolean; isToggle: boolean },
    ) => {
      if (!visibleSchemaIdSet.has(id)) return;

      // Mientras el modo de multiselección está activo, un click SIN modificador
      // alterna membresía igual que uno con Ctrl/Cmd: es el contrato de "clicks
      // alternan y permanecen en Campos". Shift conserva su propio significado
      // (extender el rango), así que no se toca `isRange`.
      const intent =
        multiSelectMode && !rawIntent.isRange
          ? { ...rawIntent, isToggle: true }
          : rawIntent;

      const anchorId =
        rangeAnchorId && visibleSchemaIdSet.has(rangeAnchorId)
          ? rangeAnchorId
          : id;

      if (intent.isRange) {
        const anchorIndex = visibleSchemaIds.indexOf(anchorId);
        const targetIndex = visibleSchemaIds.indexOf(id);
        if (anchorIndex >= 0 && targetIndex >= 0) {
          const [start, end] =
            anchorIndex <= targetIndex
              ? [anchorIndex, targetIndex]
              : [targetIndex, anchorIndex];
          const rangeIds = visibleSchemaIds.slice(start, end + 1);

          if (selectionCommands?.selectSchemasByIds) {
            selectionCommands.selectSchemasByIds(rangeIds, {
              mode: intent.isToggle ? 'add' : 'replace',
              origin: 'field-list',
            });
          } else {
            onEdit(id);
          }
          if (!intent.isToggle) {
            setRangeAnchorId(id);
          }
          return;
        }
      }

      if (selectionCommands?.selectSchemasByIds) {
        selectionCommands.selectSchemasByIds([id], {
          mode: intent.isToggle ? 'toggle' : 'replace',
          origin: 'field-list',
        });
        if (!intent.isToggle && !intent.isRange) {
          setRangeAnchorId(id);
        }
        return;
      }

      if (!intent.isToggle && !intent.isRange) {
        onEdit(id);
        setRangeAnchorId(id);
      }
    },
    [
      multiSelectMode,
      onEdit,
      rangeAnchorId,
      selectionCommands,
      visibleSchemaIdSet,
      visibleSchemaIds,
    ],
  );

  /**
   * Resolves the plugin icon for a schema and tints it with collaboration color
   * when ownership/recipient metadata is available.
   */
  const getPluginIcon = useCallback(
    (schemaOrId: string | SchemaForUI): ReactNode => {
      const schema =
        typeof schemaOrId === 'string'
          ? allSchemas.find((candidate) => candidate.id === schemaOrId)
          : schemaOrId;

      if (!schema) return null;

      const [pluginLabel, activePlugin] =
        pluginsRegistry.findWithLabelByType(schema.type);

      if (!activePlugin) return null;

      const interactionState = resolveSchemaInteractionState(schema, {
        collaborationContext,
      });

      return (
        <PluginIcon
          plugin={activePlugin}
          label={pluginLabel}
          size={20}
          styles={{
            marginRight: '0.5rem',
            color: interactionState.ownerColor || undefined,
          }}
        />
      );
    },
    [allSchemas, collaborationContext, pluginsRegistry],
  );

  const resetDragState = useCallback(() => {
    setActiveId(null);
  }, []);

  /**
   * Entrada de multiselección: pulsación larga o su equivalente de teclado.
   *
   * SIEMPRE alterna, nunca reemplaza: mantener pulsado en la primera fila la
   * suma a la selección existente, no la sustituye por ella sola. Si el host
   * no expone `selectSchemasByIds` (superficie sin comandos), se degrada a
   * `onEdit`, que sólo puede reemplazar — la entrada a multi mode no aplica en
   * ese caso porque no hay forma de alternar sin la autoridad de comandos.
   */
  const handleLongPressSelect = useCallback(
    (id: string) => {
      if (!visibleSchemaIdSet.has(id)) return;
      if (!selectionCommands?.selectSchemasByIds) {
        onEdit(id);
        return;
      }
      onMultiSelectModeChange?.(true);
      selectionCommands.selectSchemasByIds([id], { mode: 'toggle', origin: 'field-list' });
    },
    [onEdit, onMultiSelectModeChange, selectionCommands, visibleSchemaIdSet],
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={({ active }) => {
        const nextActiveId = String(active.id);
        setActiveId(nextActiveId);

        if (!isItemSelected(nextActiveId)) {
          handleSelectionRequested(nextActiveId, {
            isRange: false,
            isToggle: false,
          });
        }
      }}
      onDragEnd={({ active, over }) => {
        const draggedId = String(active.id);
        const overId = over ? String(over.id) : '';

        if (!overId) {
          resetDragState();
          return;
        }

        const activeIndex = visibleSchemaIds.indexOf(draggedId);
        const overIndex = visibleSchemaIds.indexOf(overId);

        if (activeIndex < 0 || overIndex < 0) {
          resetDragState();
          return;
        }

        if (selectedSchemas.length > 1 && selectedIdSet.has(draggedId)) {
          let reorderedVisible = arrayMove(
            [...visibleSchemas],
            activeIndex,
            overIndex,
          );

          const trailingSelectedIds = new Set(
            selectedSchemas
              .filter((schema) => schema.id !== draggedId)
              .map((schema) => schema.id),
          );

          const trailingSelected = reorderedVisible.filter((schema) =>
            trailingSelectedIds.has(schema.id),
          );

          reorderedVisible = reorderedVisible.filter(
            (schema) => !trailingSelectedIds.has(schema.id),
          );

          reorderedVisible.splice(
            Math.min(overIndex + 1, reorderedVisible.length),
            0,
            ...trailingSelected,
          );

          onSortEnd(mergeVisibleOrder(reorderedVisible));
        } else if (activeIndex !== overIndex) {
          onSortEnd(
            mergeVisibleOrder(
              arrayMove([...visibleSchemas], activeIndex, overIndex),
            ),
          );
        }

        resetDragState();
      }}
      onDragCancel={resetDragState}
    >
      <div
        className={mergeClassNames(
          DESIGNER_CLASSNAME + 'list-view-sortable-shell',
          'flex min-h-0 flex-1 flex-col overflow-hidden bg-transparent',
          activeId && 'cursor-grabbing',
        )}
        data-density={densityMode}
        data-dragging={activeId ? 'true' : 'false'}
        data-multi-select-mode={multiSelectMode ? 'true' : 'false'}
      >
        <div
          className={mergeClassNames(
            'min-h-0 flex-1 overflow-y-auto overscroll-contain [scrollbar-gutter:stable]',
            densityClasses.body,
          )}
        >
          {visibleSchemas.length > 0 ? (
            <SortableContext
              items={visibleSchemaIds}
              strategy={verticalListSortingStrategy}
            >
              <ul
                className={mergeClassNames(
                  DESIGNER_CLASSNAME + 'list-view-items-wrapper',
                  'grid list-none m-0 p-0',
                  densityClasses.list,
                )}
                data-testid="right-sidebar-field-list"
                aria-label="Lista de campos del documento"
              >
                {visibleSchemas.map((schema, index) => (
                  <SelectableSortableItem
                    key={`${schema.id || 'schema'}-${index}`}
                    schema={schema}
                    densityMode={densityMode}
                    isSelected={
                      isItemSelected(schema.id) || activeId === schema.id
                    }
                    isHovering={schema.id === hoveringSchemaId}
                    isNameDuplicate={Boolean(
                      schema.name && duplicateNameSet.has(schema.name),
                    )}
                    onSelect={handleSelectionRequested}
                    onLongPressSelect={handleLongPressSelect}
                    multiSelectMode={multiSelectMode}
                    onMouseEnter={() =>
                      onChangeHoveringSchemaId(schema.id)
                    }
                    onMouseLeave={() => onChangeHoveringSchemaId(null)}
                    collaborationContext={collaborationContext}
                    onDelete={
                      selectionCommands?.canEditStructure === false
                        ? undefined
                        : () =>
                            selectionCommands?.deleteSchemasByIds?.(
                              [schema.id],
                              { origin: 'field-list' },
                            )
                    }
                  />
                ))}
              </ul>
            </SortableContext>
          ) : (
            <div
              className="mx-1 flex min-h-32 flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50/45 px-4 py-6 text-center"
              role="status"
            >
              <span
                className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm ring-1 ring-slate-200/80"
                aria-hidden="true"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M6 7h12M6 12h12M6 17h8" strokeLinecap="round" />
                </svg>
              </span>
              <p className="m-0 text-xs font-semibold text-slate-600">
                No hay campos visibles
              </p>
              <p className="m-0 mt-1 max-w-48 text-[11px] leading-relaxed text-slate-400">
                Agrega un campo o cambia los filtros.
              </p>
            </div>
          )}
        </div>
      </div>

      <ListViewDragOverlay
        activeId={activeId}
        schemas={allSchemas}
        selectedSchemas={selectedSchemas}
        renderIcon={getPluginIcon}
        densityMode={densityMode}
      />
    </DndContext>
  );
};

export default SelectableSortableContainer;
