# Consumer app y ejemplos vivos

## 1. Por qué importar ejemplos reales

La plataforma se vuelve vendible cuando un tercero puede:
- instalar paquetes
- copiar un ejemplo
- correrlo sin conocer el monorepo interno

## 2. Ejemplos recomendados

### `examples/editor-basic`
- editor mínimo
- built-in schemas
- template simple

### `examples/editor-enterprise`
- persistencia
- API por field
- form-json
- colaboración

### `examples/generator-node`
- generación desde Node
- export a buffer/file

### `examples/custom-schema`
- registrar y usar un field plugin nuevo

## 3. Estructura ejemplo

```text
examples/editor-basic/
  package.json
  vite.config.ts
  src/
    main.tsx
    App.tsx
    template.ts
```

## 4. `package.json` de ejemplo

```json
{
  "name": "editor-basic",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "dependencies": {
    "@platform/pdf/editor": "workspace:*",
    "@platform/pdf/schemas": "workspace:*",
    "react": "^18.3.0",
    "react-dom": "^18.3.0"
  }
}
```

## 5. Ejemplo `App.tsx`

```tsx
import React, { useEffect, useRef } from "react";
import { PdfEditor, PdfEditorEngineBuilder } from "@platform/pdf/editor";
import { builtInFields } from "@platform/pdf/schemas";
import { template } from "./template";

export default function App() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const engine = new PdfEditorEngineBuilder()
      .withCanvasFeatureToggles({ guides: true, snapLines: true, padding: true })
      .build();

    const editor = new PdfEditor({
      domContainer: ref.current,
      template,
      plugins: builtInFields,
      options: { designerEngine: engine, lang: "es" },
    });

    return () => editor.destroy?.();
  }, []);

  return <div ref={ref} style={{ width: "100%", height: "100vh" }} />;
}
```

## 6. Qué debe probar un ejemplo

- instalación limpia
- import sin rutas internas
- CSS del paquete
- build productivo
- bundle básico

## 7. Ejemplos como activos comerciales

Tus examples sirven para:
- demos internas
- demos para clientes
- test de regresión de surface API
- screenshots y sandbox público/privado
