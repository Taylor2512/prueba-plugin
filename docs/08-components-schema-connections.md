# `SchemaConnectionsWidget.tsx`

## Propósito

Este archivo es uno de los mayores diferenciales del proyecto frente al `pdfme` original. En el estado actual ya tiene unas ~759 líneas y agrupa:
- persistencia de datos
- API/Axios
- salida JSON de formulario
- herencia de configuración HTTP
- auth manual o heredada
- validación de configuración
- runtime adapter para pruebas o consultas locales fileciteturn19file13

## Imports observables

El snippet disponible muestra que importa:
- `PropPanelWidgetProps`
- componentes de `antd`
- iconos `DatabaseZap`, `Globe2`, `FileJson2`
- `DESIGNER_CLASSNAME`
- `createSchemaDataRuntimeAdapter`
- `resolveDesignerHttpClientConfig`
- tipos:
  - `DesignerEngine`
  - `SchemaDesignerConfig`
  - `SchemaHttpAuthConfig`
  - `SchemaHttpClientConfig`
  - `SchemaFormJsonConfig`
  - `SchemaPersistenceConfig`
- helpers visuales `PairEditor`, `SectionHeader` desde `SchemaConnectionsShared` fileciteturn19file13

## Qué demuestra esto

Este widget ya no es un detalle cosmético. Es una mini-plataforma de configuración de datos embebida dentro del editor.

## Subdominios

### Persistencia
Controla almacenamiento local/sesión/clave y opciones relacionadas.

### API
Controla endpoint, método, herencia de baseURL, auth, params y mappings.

### Form JSON
Controla si el schema participa en la recolección de datos y con qué formato.

## Helpers observables

En el snippet se ven funciones como:
- `buildAuthTag`
- `buildValidationTag`
- `getMissingFields`
- `describeBoolean` fileciteturn19file13

Eso sugiere que el widget ya genera resúmenes de estado y validaciones parciales, lo cual es ideal para disclosure progresivo.

## Recomendación de documentación

Este archivo merece un documento propio de producto, no solo técnico. Hay que explicar:
- cuáles son los modos de persistencia
- cómo hereda Axios del sistema
- cómo se resuelve la auth
- cómo se mapean requests/responses
- cómo participa en el JSON del formulario

## Ejemplo de patch de configuración

```ts
updateSchemaConfig({
  persistence: {
    enabled: true,
    key: 'customer.email',
    includeHidden: false,
  },
  api: {
    enabled: true,
    endpoint: '/customers/search',
    method: 'GET',
  },
  form: {
    enabled: true,
    collect: true,
    format: 'nested',
    rootKey: 'formData',
  },
});
```

## Recomendación operativa

Si mañana separas el editor como producto, este archivo debería convertirse en una “suite de widgets de conectividad” y dividirse en:
- `SchemaPersistenceWidget`
- `SchemaApiWidget`
- `SchemaFormJsonWidget`
- `SchemaConnectionsSummary`
