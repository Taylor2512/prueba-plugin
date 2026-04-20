# Entry points, exports y surface API

## 1. Problema

Hoy el proyecto todavía conserva una surface API heredada y mezclada. Para un producto reusable, el consumidor debe tener pocos entrypoints, claros y estables.

## 2. Entry points recomendados

### `@platform/pdf/editor`
Debe exportar:
- `PdfEditor`
- `PdfViewer`
- `PdfFormView`
- `PdfEditorEngineBuilder`
- `createEditorRuntime`
- tipos públicos del editor

### `@platform/pdf/generator`
- `generatePdf`
- `generatePdfBuffer`
- tipos de generación

### `@platform/pdf/converter`
- `pdfToImages`
- `pdfToPageSizes`
- `imagesToPdf`

### `@platform/pdf/schemas`
- `builtInFields`
- `registerFieldPlugin`
- `createSchemaBuilder`

### `@platform/pdf/contracts`
- `Template`
- `Schema`
- `SchemaDesignerConfig`
- `SchemaRequestConfig`
- `SchemaFormConfig`
- `SchemaPersistenceConfig`

### `@platform/pdf/collaboration`
- `createCollaborationChannel`
- `createCommentaryStore`
- `applyRemoteChange`
- tipos de locks/awareness/comments

## 3. Qué NO exportar

- `RightSidebar`
- `ListViewToolbar`
- `DetailViewContent`
- `SchemaConnectionsWidget`
- `CanvasOverlayManager`
- helpers de layout internos
- componentes de catálogo internos

Eso debe seguir siendo implementación del paquete `editor`.

## 4. API pública mínima del editor

```ts
import {
  PdfEditor,
  PdfEditorEngineBuilder,
} from "@platform/pdf/editor";

const engine = new PdfEditorEngineBuilder()
  .withCanvasFeatureToggles({ guides: true, snapLines: true, padding: true })
  .withHttpAxiosConfig({ baseURL: "https://api.example.com" })
  .build();

new PdfEditor({
  domContainer,
  template,
  plugins,
  options: {
    lang: "es",
    designerEngine: engine,
  },
});
```

## 5. Superficie avanzada opcional

En vez de exponer todo en el root export, usar subpaths:

```json
{
  "exports": {
    ".": "./dist/index.js",
    "./testing": "./dist/testing.js",
    "./styles": "./dist/styles.css",
    "./experimental": "./dist/experimental.js"
  }
}
```

## 6. Modo `experimental`

Todo lo inestable puede vivir bajo:
- `@platform/pdf/editor/experimental`
- `@platform/pdf/collaboration/experimental`

## 7. Contratos de estabilidad

### Stable
No debe romperse sin versión mayor.

### Beta
Puede cambiar con aviso.

### Experimental
Puede romperse sin aviso formal.

## 8. Recomendación documental

Cada entrypoint debe tener:
- README corto
- quick start
- API table
- ejemplo real
- breaking changes
