# Ejemplos de implementación e integración

## Ejemplos vivos del laboratorio SISAD

Los ejemplos consumidos por la pantalla de laboratorio viven en:

- `src/features/sisad-pdfme/example.pdf.jsx`
- `src/features/sisad-pdfme/examples/labExamples.js`

Los presets actuales cubren cuatro escenarios concretos:

- `basic-designer`
- `enterprise-collaboration`
- `multi-document-routing`
- `generator-runtime`

Cada preset se puede usar como plantilla de referencia para:

- diseñador básico
- colaboración con comentarios y locks
- scoping por documento y página
- flujo de generación / conversión

## 1. Editor mínimo

```tsx
import React from 'react';
import { Designer } from '@sisad-pdfme/ui';
import { builtInSchemaDefinitions } from '@sisad-pdfme/schemas';

export default function MinimalEditor() {
  return (
    <Designer
      plugins={builtInSchemaDefinitions}
      template={{
        basePdf: '',
        schemas: [[]],
      }}
    />
  );
}
```

## 2. Editor con engine configurado

```tsx
import React, { useMemo } from 'react';
import { Designer, DesignerEngineBuilder } from '@sisad-pdfme/ui';
import { builtInSchemaDefinitions } from '@sisad-pdfme/schemas';

export default function AdvancedEditor() {
  const engine = useMemo(
    () =>
      new DesignerEngineBuilder()
        .withCanvasFeatureToggles({
          guides: true,
          moveable: true,
          selecto: true,
          snapLines: true,
          padding: true,
          mask: false,
        })
        .withSchemaConfigStorageKey('__advancedDesigner')
        .build(),
    [],
  );

  return (
    <Designer
      plugins={builtInSchemaDefinitions}
      options={{ designerEngine: engine }}
      template={{ basePdf: '', schemas: [[]] }}
    />
  );
}
```

## 3. Engine con identidad custom

```ts
const engine = new DesignerEngineBuilder()
  .withSchemaIdentityFactory((schema) => ({
    id: schema.id,
    key: `my-app-${schema.name}`,
    namespace: 'my-app',
    version: '1',
    tags: [schema.type],
  }))
  .withAutoAttachIdentity(true)
  .build();
```

## 4. Hook de creación con persistencia

```ts
const engine = new DesignerEngineBuilder()
  .withSchemaCreationHook((schema) =>
    mergeSchemaDesignerConfig(schema, {
      persistence: {
        enabled: true,
        mode: 'local',
        key: `draft.${schema.name}`,
      },
    }),
  )
  .build();
```

## 5. Field con API configurada

```ts
const schema = mergeSchemaDesignerConfig(
  {
    id: 'field-1',
    name: 'country',
    type: 'select',
  },
  {
    api: {
      enabled: true,
      endpoint: '/catalog/countries',
      method: 'GET',
      requestMode: 'read',
      responseMapping: {
        options: 'data.items',
      },
      http: {
        inheritSystem: true,
      },
    },
  },
  engine,
);
```

## 6. Field con salida JSON

```ts
const schema = mergeSchemaDesignerConfig(
  {
    id: 'field-2',
    name: 'email',
    type: 'text',
  },
  {
    form: {
      enabled: true,
      collect: true,
      format: 'nested',
      rootKey: 'formData',
      includeEmpty: false,
      includeHidden: false,
      includeMeta: true,
    },
  },
  engine,
);
```

## 7. Runtime de formulario

```ts
import { Form } from '@sisad-pdfme/ui';

const form = new Form({
  domContainer,
  template,
  inputs: [{ client_name: 'John Doe' }],
});

form.onChangeFormJson((json) => {
  console.log('json actualizado', json);
});
```

## 8. Viewer

```ts
import { Viewer } from '@sisad-pdfme/ui';

const viewer = new Viewer({
  domContainer,
  template,
  inputs: [{ client_name: 'John Doe' }],
});
```

## 9. Convertir PDF a imágenes

```ts
import { pdf2img } from '@sisad-pdfme/converter';

const images = await pdf2img(pdfBytes);
```

## 10. Convertir imágenes a PDF

```ts
import { img2pdf } from '@sisad-pdfme/converter';

const pdfBytes = await img2pdf(imageSources);
```

## 11. Generar PDF final

```ts
import { generate } from '@sisad-pdfme/generator';

const pdf = await generate({
  template,
  inputs: [{ client_name: 'John Doe' }],
  plugins: builtInSchemaDefinitions,
});
```

## 12. Plugin custom

```ts
import type { Plugin } from '@sisad-pdfme/common';

const myPlugin: Plugin<any> = {
  ui: ({ schema }) => `<div>${schema.content}</div>`,
  pdf: async ({ schema, page }) => {
    page.drawText(schema.content, {
      x: schema.position.x,
      y: schema.position.y,
    });
  },
  propPanel: {
    schema: {
      content: { type: 'string', title: 'Texto' },
    },
  },
};
```

## Recomendaciones

- documentar cada ejemplo con contexto;
- acompañar snippets con una explicación de cuándo usarlos;
- no mostrar solo snippets de configuración: incluir flujos completos con engine y template.
