# `designerEngine.ts`

## Rol en la arquitectura

`designerEngine.ts` es el centro de gravedad del editor. Define el contrato del motor de configuración del diseñador, resuelve la configuración persistida por schema, mezcla configuración HTTP, aplica hooks de identidad y de creación, y expone un `DesignerEngineBuilder` fluido para componer el comportamiento del editor desde fuera. En el estado actual del proyecto, esta pieza ya no actúa como una simple utilidad, sino como un **kernel de plataforma**. El builder expone métodos para conectar renderers de sidebars, toggles del canvas, estilos, componentes del canvas, configuración HTTP tipo Axios y políticas de schema como `configStorageKey`, `identityFactory`, `onCreate` y `autoAttachIdentity`. fileciteturn19file15turn19file17

## Responsabilidades principales

### 1. Construcción fluida del engine

El builder soporta al menos:
- `withLeftSidebar`
- `withRightSidebar`
- `withLeftSidebarProps`
- `withRightSidebarProps`
- `withCanvasFeatureToggles`
- `withCanvasStyleOverrides`
- `withCanvasClassNames`
- `withCanvasComponents`
- `withCanvasUseDefaultStyles`
- `withHttpAxiosConfig`
- `withSchemaConfigStorageKey`
- `withSchemaIdentityFactory`
- `withSchemaCreationHook`
- `withAutoAttachIdentity`
- `build`
- `buildOptions` fileciteturn19file15turn19file17

Esto demuestra que el engine no depende de una sola UI concreta. Más bien, permite inyectar superficies y comportamientos, lo cual lo vuelve apropiado para venderse o reutilizarse como plataforma.

### 2. Gestión de configuración por schema

Según la documentación existente del proyecto, el engine persiste configuración específica de cada schema dentro de una clave configurable (`configStorageKey`) y expone helpers como `getSchemaDesignerConfig`, `setSchemaDesignerConfig`, `mergeSchemaDesignerConfig` y `resolveDesignerHttpClientConfig`. Esto conecta el motor con el almacenamiento de opciones de persistencia, API, JSON de formulario, metadata y hooks de identidad. fileciteturn15file2

### 3. Política de identidad y hooks

También soporta:
- `identityFactory`
- `onCreate`
- `autoAttachIdentity`

Esto permite asignar identidad estable a los campos, lo cual es importante para persistencia, colaboración, deduplicación y sincronización de cambios. La propia documentación del proyecto ya remarca que la identidad es clave para rastrear campos incluso si cambian nombre o estructura. fileciteturn15file2

## Dependencias lógicas

`designerEngine.ts` vive en la capa UI, pero conversa con:
- `common` para tipos y schemas
- `RightSidebar` y `LeftSidebar` a través de props configurables
- widgets de detalle para leer/escribir configuración de schema
- runtime adapters para persistencia o peticiones
- `schemaRegistry` y procesos de creación de campos

## Contratos importantes

### `DesignerEngine`
Es el objeto de configuración resuelto. Debe tratarse como estado estructural y no como estado efímero de render.

### `DesignerEngineBuilder`
Es el punto de entrada ideal para inicializar el editor desde una app host.

### `buildOptions`
Es la forma más segura de acoplar el engine a opciones de UI sin mutar la configuración original.

## Qué mejorar

1. Renombrar públicamente el archivo y la API si el objetivo es producto propio:
   - `designerEngine.ts` → `editorEngine.ts` o `pdfEditorEngine.ts`
   - `DesignerEngineBuilder` → `PdfEditorEngineBuilder`

2. Separar claramente:
   - configuración estructural del editor
   - runtime efímero de interacciones
   - configuración por schema
   - conectores de datos

3. Añadir documentación de tipos exportados de forma más explícita.

## Ejemplo de uso

```ts
import { DesignerEngineBuilder } from '@sisad-pdfme/ui';
import LeftSidebar from './custom/LeftSidebar';
import RightSidebar from './custom/RightSidebar';

const engine = new DesignerEngineBuilder()
  .withLeftSidebar(LeftSidebar)
  .withRightSidebar(RightSidebar)
  .withCanvasFeatureToggles({
    guides: true,
    snapLines: true,
    padding: true,
    mask: false,
  })
  .withHttpAxiosConfig({
    inheritSystem: true,
    timeout: 10000,
  })
  .withSchemaConfigStorageKey('__designer')
  .withAutoAttachIdentity(true)
  .build();
```

## Recomendación operativa

Todo cambio transversal del editor debería pasar por el engine antes de tocar componentes individuales. Si una mejora afecta paneles, canvas o configuración persistida, el primer lugar que debe revisarse es este archivo.
