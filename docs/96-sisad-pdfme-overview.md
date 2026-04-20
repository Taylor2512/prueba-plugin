# SISAD PDFME — README técnico mejorado

> Resumen ejecutivo. Para navegar la documentación viva usa [docs/README.md](README.md) y, para la verdad del código actual, el [índice de verdad actual](90-indice-verdad-actual.md).

## Qué es

SISAD PDFME es una plataforma para diseñar, visualizar, capturar, convertir y generar PDFs con un editor visual configurable. Incluye:

- diseñador con canvas interactivo;
- runtime de formulario;
- viewer;
- sistema de plugins para fields;
- configuración de persistencia por schema;
- integración HTTP para fields;
- salida JSON configurable;
- soporte de colaboración;
- conversión PDF ↔ imágenes.

## Principales capacidades

### Editor
- catálogo de fields;
- panel de detalle;
- lista de fields;
- rail de documentos;
- overlays contextuales;
- edición inline.

### Engine
- sidebars reemplazables;
- classNames y style overrides;
- feature toggles del canvas;
- hooks de schema;
- config HTTP global;
- identidad configurable.

### Schemas
- texto;
- fechas;
- selección;
- gráficos;
- códigos;
- tablas.

### Runtime
- persistencia local;
- lookup remoto por field;
- JSON de formulario.

### Infraestructura
- Vite;
- Vitest;
- Playwright.

## Instalación conceptual

```bash
npm install
npm run dev
```

## Scripts útiles

```bash
npm run dev
npm run build
npm run preview
npm run test
npm run test:e2e
```

## Importaciones base

```ts
import { Designer, Form, Viewer, DesignerEngineBuilder } from '@sisad-pdfme/ui';
import { generate } from '@sisad-pdfme/generator';
import { builtInSchemaDefinitions } from '@sisad-pdfme/schemas';
import { pdf2img, pdf2size, img2pdf } from '@sisad-pdfme/converter';
```

## Ejemplo de arranque

```tsx
import React from 'react';
import { Designer } from '@sisad-pdfme/ui';
import { builtInSchemaDefinitions } from '@sisad-pdfme/schemas';

export default function App() {
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

## Estructura

- `src/features/sisad-pdfme`: demo/lab del producto.
- `src/sisad-pdfme/common`: tipos y dominio base.
- `src/sisad-pdfme/converter`: conversiones.
- `src/sisad-pdfme/generator`: generación final.
- `src/sisad-pdfme/pdf-lib`: fork editable.
- `src/sisad-pdfme/schemas`: plugins.
- `src/sisad-pdfme/ui`: editor, viewer, form y componentes.

## Cuándo usar cada módulo

### `Designer`
Cuando necesitas construir o editar templates.

### `Form`
Cuando necesitas capturar datos con runtime de entrada.

### `Viewer`
Cuando solo necesitas ver el documento/template.

### `generator`
Cuando necesitas producir el PDF final.

### `converter`
Cuando necesitas roundtrip PDF/imagen o medir tamaños.

## Ejemplo con engine

```ts
const engine = new DesignerEngineBuilder()
  .withCanvasFeatureToggles({
    guides: true,
    moveable: true,
    selecto: true,
    snapLines: true,
    padding: true,
    mask: false,
  })
  .withHttpAxiosConfig({
    baseURL: 'https://api.company.com',
    timeoutMs: 3000,
    headers: { 'X-App': 'sisad' },
  })
  .withSchemaConfigStorageKey('__sisadDesigner')
  .withAutoAttachIdentity(true)
  .build();
```

## Objetivo de evolución

Aunque el proyecto nació como modificación de pdfme, hoy debe documentarse y evolucionar como plataforma propia. Toda nueva funcionalidad debería entrar bajo el namespace `sisad-pdfme` y con documentación alineada al código real.

## Dónde seguir

- [docs/README.md](README.md)
- [90-indice-verdad-actual.md](90-indice-verdad-actual.md)
- [91-indice-conceptual.md](91-indice-conceptual.md)
- [93-indice-roadmap-plataforma.md](93-indice-roadmap-plataforma.md)
