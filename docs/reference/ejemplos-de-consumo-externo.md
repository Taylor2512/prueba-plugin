# Ejemplos de consumo externo

## 1. Editor embebido mínimo

```tsx
import React, { useEffect, useRef } from "react";
import { PdfEditor, PdfEditorEngineBuilder } from "@platform/pdf/editor";
import { builtInFields } from "@platform/pdf/schemas";

export function EmbeddedEditor({ template }) {
  const hostRef = useRef(null);

  useEffect(() => {
    if (!hostRef.current) return;

    const engine = new PdfEditorEngineBuilder()
      .withCanvasFeatureToggles({ guides: true, snapLines: true, padding: true })
      .build();

    const editor = new PdfEditor({
      domContainer: hostRef.current,
      template,
      plugins: builtInFields,
      options: {
        lang: "es",
        designerEngine: engine,
      },
    });

    return () => editor.destroy?.();
  }, [template]);

  return <div ref={hostRef} style={{ height: "100vh" }} />;
}
```

## 2. Viewer simple

```tsx
import { PdfViewer } from "@platform/pdf/editor";

export function TemplateViewer({ template, inputs }) {
  return (
    <PdfViewer
      template={template}
      inputs={inputs}
      options={{ lang: "es" }}
    />
  );
}
```

## 3. Form runtime

```tsx
import { PdfFormView } from "@platform/pdf/editor";

export function FormScreen({ template, onChangeFormJson }) {
  return (
    <PdfFormView
      template={template}
      options={{ lang: "es" }}
      onChangeFormJson={onChangeFormJson}
    />
  );
}
```

## 4. Generación PDF

```ts
import { generatePdf } from "@platform/pdf/generator";

const bytes = await generatePdf({
  template,
  inputs: [{ fullName: "Jhonn Montenegro" }],
});
```

## 5. Conversión PDF a imágenes

```ts
import { pdfToImages, pdfToPageSizes } from "@platform/pdf/converter";

const sizes = await pdfToPageSizes(pdfBytes);
const images = await pdfToImages(pdfBytes, {
  scale: 2,
  imageType: "png",
});
```

## 6. Registro de field custom

```ts
import { registerFieldPlugin } from "@platform/pdf/schemas";

registerFieldPlugin({
  type: "signatureStamp",
  label: "Signature stamp",
  category: "signatures",
  createDefault() {
    return {
      name: "signature_stamp",
      type: "signatureStamp",
      position: { x: 24, y: 24 },
      width: 120,
      height: 36,
    };
  },
  uiRender: SignatureStampUi,
  pdfRender: SignatureStampPdf,
});
```

## 7. Engine con API heredada

```ts
const engine = new PdfEditorEngineBuilder()
  .withHttpAxiosConfig({
    baseURL: "https://api.example.com",
    headers: {
      Authorization: "Bearer token",
    },
  })
  .build();
```

## 8. Observaciones

Estos ejemplos deben acompañarse luego con:
- template mínimo JSON
- esquema de field custom
- ejemplo de persistencia + form-json + request mapping
