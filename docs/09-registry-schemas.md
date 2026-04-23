# `schemaRegistry.ts`

## Rol

`schemaRegistry.ts` define el catálogo efectivo de tipos de campo que el editor puede crear, renderizar y configurar. Se ubica junto a `PluginIcon.tsx`, `LeftSidebar*` y el resto del sistema de catálogo, lo que confirma que no es solo un diccionario técnico, sino la base del modelo mental de “qué puede insertar el usuario”. fileciteturn15file1turn19file12

## Responsabilidades

- registrar tipos de schema
- asociar íconos o metadatos visuales
- alimentar el sidebar izquierdo
- servir de puente entre plugins y UX de inserción

## Relación con otros componentes

- `LeftSidebar.tsx`
- `LeftSidebarGroup.tsx`
- `LeftSidebarSearch.tsx`
- `PluginIcon.tsx`
- `detailSchemas.ts`
- `detailWidgets.tsx`

## Importancia de producto

Si comercializas la plataforma, `schemaRegistry` es casi un SDK interno. Cada nuevo tipo de campo debe entrar por aquí o por mecanismos conectados a esta capa.

## Qué debería documentar

- shape del registro
- campos mínimos que debe declarar un plugin
- cómo se agrupa por categoría
- cómo se conecta con iconografía y detalle
- cómo se ordena y se busca

## Ejemplo conceptual

```ts
registerSchema({
  type: 'customer_lookup',
  label: 'Cliente',
  category: 'Data',
  icon: CustomerIcon,
  defaults: { width: 120, height: 32 },
  supportsInlineEdit: false,
});
```

## Relación con familias y acciones declarativas

El registro de schemas está ahora vinculado con `schemaFamilies.ts` que define cinco familias canónicas:
`text`, `mediaVisual`, `boolean`, `shapeBarcode` y `table`.

Cada familia declara:
- `visibleSections` — qué pestañas aparecen en el inspector (incluyendo la nueva `'comments'`)
- `supportedActions` — acciones disponibles en toolbar y menú contextual
- `strategies` — comportamientos inyectables (validación, upload, prefill, persistencia, comentarios, bloqueo)
- `supportsComments`, `supportsLocking`, `supportsPresence` — flags de capacidades

Cuando registras un nuevo plugin, su `propPanel.inspector` puede sobrescribir el preset de familia:

```ts
propPanel: {
  inspector: createSchemaInspectorConfig('text', {
    visibleSections: ['general', 'layout', 'data', 'comments'],
    supportedActions: [
      { id: 'rename', command: 'renameVariable', label: 'Renombrar', placement: ['inspector'] },
    ],
  }),
  defaultSchema: { type: 'myField', ... },
}
```

El `pluginRegistry` expone `getFamilyByType`, `getSupportedActionsByType`, `getStrategiesByType` y `getVisibleSectionsByType` para consultas en runtime.

