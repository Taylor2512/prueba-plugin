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
import { PluginsRegistry, I18nContext } from '@sisad-pdfme/ui/contexts';
import type { Translate } from '@sisad-pdfme/ui/i18n';
import type { EffectiveCollaborationContext } from '@sisad-pdfme/ui/collaborationContext';
import Item from '@sisad-pdfme/ui/components/Designer/RightSidebar/ListView/Item';
import { useMountStatus } from '@sisad-pdfme/ui/hooks';
import PluginIcon from '@sisad-pdfme/ui/components/Designer/PluginIcon';
import { DESIGNER_CLASSNAME } from '@sisad-pdfme/ui/constants';
import { resolveListViewItemDescriptor } from '@sisad-pdfme/ui/components/Designer/RightSidebar/ListView/listViewItemResolver';
import { mergeClassNames } from '@sisad-pdfme/ui/components/Designer/shared/className';
import { useLongPressRecognizer } from '@sisad-pdfme/ui/components/Designer/RightSidebar/ListView/longPressSelection';


/**
 * Resolves the human-facing row label.
 *
 * A custom `label` takes precedence over the technical schema name; fallback is
 * the generic "Campo" label.
 */
const resolveDisplayLabel = (schema: SchemaForUI, translate: Translate) => {
  const readableLabel =
    typeof (schema as SchemaForUI & { label?: string }).label === 'string' &&
    String((schema as SchemaForUI & { label?: string }).label).trim()
      ? String((schema as SchemaForUI & { label?: string }).label).trim()
      : '';
  return readableLabel || String(schema.name || '').trim() || translate('catalog.defaultFieldLabel');
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
  /**
   * Pulsación prolongada (o su equivalente de teclado, Espacio) sobre esta
   * fila. El contenedor decide qué significa: entrar a multiselección y
   * alternar membresía, vía `selectionCommands`/estado canónico — nunca un
   * store paralelo de ids seleccionados.
   */
  onLongPressSelect: (_id: string) => void;
  /** Modo de multiselección activo del contenedor; sólo para reflejo visual. */
  multiSelectMode?: boolean;
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
  onLongPressSelect,
  multiSelectMode,
  onDelete,
  schema,
  onMouseEnter,
  onMouseLeave,
  collaborationContext,
}: Props) => {
  const pluginsRegistry = useContext(PluginsRegistry);
  const translate = useContext(I18nContext);
  const { setNodeRef, listeners, isDragging, isSorting, transform, transition } = useSortable({
    id: schema.id,
  });
  const mounted = useMountStatus();
  const mountedWhileDragging = isDragging && !mounted;

  const longPress = useLongPressRecognizer({
    onLongPress: () => onLongPressSelect(schema.id),
  });

  const [pluginLabel, thisPlugin] = React.useMemo(
    () => pluginsRegistry.findWithLabelByType(schema.type),
    [pluginsRegistry, schema.type],
  );
  const itemDescriptor = React.useMemo(
    () => resolveListViewItemDescriptor(schema, collaborationContext, translate),
    [collaborationContext, schema, translate],
  );
  const collaborationColor = itemDescriptor.ownerColor || undefined;
  const primaryLabel = itemDescriptor.primaryLabel || resolveDisplayLabel(schema, translate);
  const technicalName =
    itemDescriptor.secondaryLabel || String(schema.name || '').trim() || translate('catalog.defaultFieldLabel');
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
      onClick={(event) => {
        // El long-press ya resolvió este gesto (alternar membresía); el click
        // sintético que el navegador dispara tras soltar no debe repetirlo con
        // la semántica de un click corto (reemplazar selección).
        if (longPress.consumeLongPress()) return;
        onSelect(schema.id, {
          isRange: event.shiftKey,
          isToggle: event.metaKey || event.ctrlKey,
        });
      }}
      onRowPointerDown={longPress.onPointerDown}
      onRowPointerMove={longPress.onPointerMove}
      onRowPointerUp={longPress.onPointerUp}
      onRowPointerCancel={longPress.onPointerCancel}
      onToggleSelectionKey={() => onLongPressSelect(schema.id)}
      multiSelectMode={multiSelectMode}
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
        // El layout interno (padding, gap, alturas por densidad) lo define
        // `Item`; aquí solo se declara ancho, cursor y radio para que la fila
        // ocupe todo el carril y las acciones queden pegadas al borde derecho.
        DESIGNER_CLASSNAME + 'item-auto',
        'w-full cursor-pointer rounded-lg',
      )}
    />
  );
};

export default SelectableSortableItem;
