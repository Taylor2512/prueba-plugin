# Documentación técnica — ListView / Right Sidebar

## Responsabilidad general

El bloque `ListView` representa la lista lateral derecha de campos/schemas del diseñador. Su responsabilidad es presentar el inventario editable de campos, permitir búsqueda/filtro, selección, ordenamiento por drag and drop, edición masiva de nombres y acciones colaborativas como asignación de destinatario.

## Separación de responsabilidades

- `ListView.tsx`: orquesta filtros, bulk rename, eventos runtime y layout.
- `ListViewToolbar.tsx`: renderiza controles de búsqueda, filtro, acciones bulk y badges.
- `ListViewFooter.tsx`: renderiza commit/cancel en modo edición masiva.
- `SelectableSortableContainer.tsx`: integra dnd-kit, ordenamiento y selección local.
- `SelectableSortableItem.tsx`: conecta cada schema con `useSortable` y metadata colaborativa.
- `Item.tsx`: componente visual puro de fila.
- `ListViewDragOverlay.tsx`: preview flotante durante drag.

## Contratos importantes

- El drag handle vive en `Item` mediante `listeners`.
- El click de fila se maneja por un hit target dedicado.
- Las acciones de visibilidad/eliminación detienen propagación.
- La lista conserva `data-testid` usados por pruebas E2E.
- La colaboración puede filtrar schemas y tintar iconos/badges.
- El reordenamiento en vistas filtradas se fusiona con la lista completa sin reordenar elementos invisibles.

## Riesgos a vigilar

- Si cambia el criterio de `filterSchemasForCollaborationView`, revisar que bulk rename siga alineando nombres con `viewSchemas`.
- Si se agregan más filtros, `mergeVisibleOrder` debe seguir preservando elementos no visibles.
- Si se cambia la selección múltiple, coordinar `activeSchemaIds` externo con `selectedSchemas` local.
- Si se cambia el DOM del row, preservar `data-testid="right-sidebar-field-item"` y el drag handle.
