# Auditoría inicial de plugins y contrato de inspector

Resumen rápido: se analizaron los plugins exportados en `src/sisad-pdfme/schemas/index.ts`. A continuación se listan los plugins principales, la familia del inspector que usan (según `createSchemaInspectorConfig`) y notas sobre `propPanel` / `propertyMap` / `widgets` y `defaultSchema`.

- text
  - familia: `textual`
  - propPanel: sí (`text/propPanel.ts`)
  - propertyMap: ninguno declarado explícitamente
  - widgets: `UseDynamicFontSize`
  - defaultSchema (claves relevantes): `name`, `type`, `content`, `fontName`, `fontSize`, `fontColor`, `backgroundColor`, `dynamicFontSize`, `opacity`
  - supportsConnections/supportsCollaboration: no declarado

- multiVariableText
  - familia: `textual`
  - propPanel: sí (`multiVariableText/propPanel.ts`)
  - propertyMap: `{ dynamicVarContainer: 'data' }`
  - widgets: `mapDynamicVariables`
  - defaultSchema: extiende `text` (type: `multiVariableText`)

- select
  - familia: `textual`
  - propPanel: extiende `text` (`select/index.ts`)
  - propertyMap: `{ optionsContainer: 'data' }`
  - widgets: `addOptions`

- checkbox
  - familia: `choice`
  - propPanel: sí (`checkbox/index.ts`)
  - propertyMap: `{ color: 'style' }`

- radioGroup
  - familia: `choice`
  - propPanel: sí (`radioGroup/index.ts`)
  - propertyMap: `{ color: 'style', group: 'data' }`

- image
  - familia: `media`
  - propPanel: esquema vacío / inspector: `media` (`graphics/image.ts`)
  - defaultSchema contiene `content` (data URI), tamaño, rotate, opacity

- svg
  - familia: `media`
  - propPanel: esquema vacío / inspector: `media` (`graphics/svg.ts`)

- signature
  - familia: `signature`
  - propPanel: sí (`signature/propPanel.ts`)
  - propertyMap: maps placeholderText -> `data`, colors -> `style`

- shapes (line, rectangle, ellipse)
  - familia: `shape`
  - propPanel: sí (line.ts, rectAndEllipse.ts)
  - propertyMap: color/borderColor/borderWidth/radius -> `style`

- table
  - familia: `table`
  - propPanel: sí (`tables/propPanel.ts`)
  - propertyMap: mapping de showHead/repeatHead -> `data`, estilos (tableStyles/headStyles/bodyStyles/columnStyles) -> `style`

- barcodes (varios tipos)
  - familia: `barcode`
  - propPanel: factory `getPropPanelByBarcodeType` (`barcodes/propPanel.ts`)
  - propertyMap: barColor/backgroundColor/textColor -> `style`, `includetext` -> `data`

- date / time / dateTime
  - familia: `textual`
  - propPanel: sí (`date/helper.ts`)
  - propertyMap: `{ format: 'data', locale: 'data' }`

Observaciones globales:
- El proyecto ya cuenta con `schemaFamilies.ts` y fábrica `createSchemaInspectorConfig` que normaliza presets por familia.
- La mayoría de plugins delegan al contrato `createSchemaInspectorConfig(...)` en lugar de declarar explícitamente `visibleSections` o `supports*` flags. Esto facilita aplicar presets, pero requiere estandarizar `PropPanelInspectorConfig` para habilitar `supportsConnections` y `supportsCollaboration` cuando proceda.
- No se han detectado propiedades `createdBy`, `createdAt`, `lastModifiedBy`, `lastModifiedAt`, `userColor` ni `comments` en `defaultSchema`—esta ausencia requiere extender el tipo `Schema` en `src/sisad-pdfme/common/types.ts`.
- Los `propPanel` existentes ya usan `propertyMap` para mapear controles complejos a secciones (`data` o `style`), lo que facilita migración a la nueva estructura basada en familias.

Siguientes pasos recomendados (ejecución inmediata):
1. Generar una matriz completa (CSV/MD) con todas las propiedades por plugin (puedo generarla ahora).
2. Extender `Schema` en `src/sisad-pdfme/common/types.ts` añadiendo campos multiusuario (`createdBy`, `createdAt`, `lastModifiedBy`, `lastModifiedAt`, `userColor`, `comments`).
3. Añadir tests que verifiquen la preservación de `name` único y que `type` no sea editable en el inspector.

Si confirmas, procedo con el paso 2: aplicar extensión de `Schema` en `src/sisad-pdfme/common/types.ts` y crear pruebas mínimas de compatibilidad.
