# APIs públicas y superficie de consumo

## 1. Problema actual

La API pública todavía conserva nombres heredados como `Designer`, `Form`, `Viewer` y aliases `@pdfme/*` en varias capas. Aunque el sistema ya es muy distinto, la superficie de consumo todavía no transmite plataforma propia.

## 2. Qué se considera API pública

### 2.1 Entrada de editor
- `Designer`
- `Form`
- `Viewer`
- `DesignerEngineBuilder`
- `ui/index.ts`

### 2.2 Generación y conversión
- `generate`
- `pdf2img`
- `pdf2size`
- `img2pdf`

### 2.3 Schemas
- `flatSchemaPlugins`
- `builtInSchemaDefinitions`
- `schemaBuilder`
- registros y plugins

### 2.4 Runtime adapters
- persistencia
- prefill
- request resolution
- form-json

## 3. Objetivo de la quinta tanda

Definir una nueva surface API preparada para `platform/pdf`.

## 4. Propuesta de surface API futura

```ts
@platform/pdf/editor
  PdfEditor
  PdfViewer
  PdfFormView
  PdfEditorEngineBuilder
  createEditorRuntime

@platform/pdf/generator
  generatePdf
  generatePdfBuffer

@platform/pdf/converter
  pdfToImages
  pdfToPageSizes
  imagesToPdf

@platform/pdf/schemas
  builtInFields
  registerFieldPlugin
  createSchemaBuilder

@platform/pdf/contracts
  Template
  Schema
  SchemaDesignerConfig
```

## 5. Compatibilidad temporal

Para no romper al consumidor actual:

```ts
export { PdfEditor as Designer } from "./PdfEditor";
export { PdfViewer as Viewer } from "./PdfViewer";
export { PdfFormView as Form } from "./PdfFormView";
export { PdfEditorEngineBuilder as DesignerEngineBuilder } from "./PdfEditorEngineBuilder";
```

## 6. Reglas de diseño de API pública

- nombres explícitos
- evitar siglas oscuras
- una responsabilidad por export
- reexports centralizados
- sin imports profundos desde componentes internos

## 7. Lo que NO debe ser público

- widgets de inspector
- overlays internos
- helpers de layout
- hooks específicos de sidebar
- utilidades visuales de `RightSidebar`
- detalles de `CanvasOverlayManager`

Eso debe quedar en `internal/` o simplemente no exportarse.

## 8. Ejemplo de reorganización

### Antes
```ts
import { Designer, Form, Viewer, DesignerEngineBuilder } from "@sisad-pdfme/ui";
```

### Después
```ts
import {
  PdfEditor,
  PdfFormView,
  PdfViewer,
  PdfEditorEngineBuilder,
} from "@platform/pdf/editor";
```

## 9. Índices públicos recomendados

### `src/sisad-pdfme/ui/index.ts`
Debe ser el único punto público del editor.

### `src/sisad-pdfme/generator/index.ts`
Debe exponer solo funciones estables, no helpers.

### `src/sisad-pdfme/converter/index.ts`
Debe unificar browser/node si la plataforma final lo permite.

## 10. Documentación que cada API pública debería tener

- propósito
- firma
- tipos de entrada
- tipos de salida
- side effects
- errores esperados
- ejemplo mínimo
- ejemplo avanzado

## 11. Ejemplo documentado

```ts
const engine = new PdfEditorEngineBuilder()
  .withCanvasFeatureToggles({ guides: true, snapLines: true, padding: true })
  .withHttpAxiosConfig({ baseURL: "https://api.example.com" })
  .build();

const editor = new PdfEditor({
  domContainer,
  template,
  plugins,
  options: { lang: "es", designerEngine: engine },
});
```

## 12. Recomendación final

Antes de vender o empaquetar:
- congela exports públicos
- versiona surface API
- crea changelog de breaking changes
- agrega ejemplos “copy-paste ready”
