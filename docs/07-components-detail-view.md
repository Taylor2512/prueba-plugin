## `DetailViewContent.tsx`

`DetailViewContent.tsx` es la pieza que materializa el inspector del schema seleccionado. Se apoya en `detailSchemas`, `detailWidgets`, `DetailHeaderCard`, `DetailSectionCard`, `DetailFormSection` y widgets especializados como `SchemaConnectionsWidget` y `SchemaCollaborationWidget`.

`DetailViewContent.tsx` es la pieza que materializa el inspector del schema seleccionado. Se apoya en `detailSchemas`, `detailWidgets`, `DetailHeaderCard`, `DetailSectionCard`, `DetailFormSection` y widgets especializados como `SchemaConnectionsWidget` y `SchemaCollaborationWidget`.

## Función arquitectónica

Es el punto donde el modelo declarativo de propiedades se convierte en UI concreta. El resumen de identidad, configuración y colaboración vive en `DetailHeaderCard`; `DetailViewContent` sólo organiza la pila de secciones.

El header ya concentra la identidad visible del schema (`schemaUid`, `createdBy`, `lastModifiedBy`) junto con los chips de configuración y colaboración.

`src/sisad-pdfme/schemas/schemaFamilies.ts` sigue siendo la fuente de verdad de `visibleSections` y `supports*`; `DetailViewContent.tsx` sólo adapta ese contrato a layout y render.

## Secciones conocidas

Según la evolución del proyecto y los documentos previos, el detalle suele agruparse en:
- General
- Style
- Layout
- Data
- Validation
- Advanced
- bloques especializados como Conexiones y Colaboración fileciteturn15file2

## Responsabilidades

- decidir qué secciones mostrar para el schema activo
- ordenar widgets por prioridad
- mantener disclosure progresivo
- delegar rendering a widgets específicos
- actuar como shell de layout, no como dueño del resumen de chips

## Recomendación de comportamiento

Por defecto, solo deberían abrirse:
- General
- Layout
- Data cuando la familia realmente la soporte

Las demás deberían quedar colapsadas, a menos que el usuario las haya abierto antes.

## Ejemplo de uso conceptual

```tsx
<DetailViewContent
  schema={activeSchema}
  schemaConfig={schemaConfig}
  designerEngine={designerEngine}
  onChangeSchema={updateSchema}
  onChangeSchemaConfig={updateSchemaConfig}
/>
```

## Contrato declarativo actual

- `src/sisad-pdfme/schemas/schemaFamilies.ts` es la fuente canónica de familias de schema para el inspector
- cada plugin puede declarar `propPanel.inspector` con `visibleSections`, `propertyMap` y flags `supports*`
- `detailSchemas.ts` mantiene compatibilidad con aliases legacy (`fieldSections`, `include*`) pero prioriza el contrato declarativo nuevo

## Qué documentar mejor

- cómo se alimenta de `detailSchemas`
- qué widgets se consideran núcleo y cuáles avanzados
- reglas para colapso y persistencia de apertura
- qué parte del resumen vive en `DetailHeaderCard` y qué parte queda en `DetailViewContent`
- tratamiento de estados vacíos cuando no hay selección
