# Plugins, schemas y ejemplos de implementación

## Filosofía de plugins

SISAD PDFME usa una arquitectura por plugins. Cada tipo de schema define cómo:

1. se representa visualmente en UI;
2. se representa finalmente en PDF;
3. se configura desde el panel de propiedades;
4. se valida o asiste con helpers;
5. aporta iconografía y metadatos al catálogo.

## Patrón estándar

Cada plugin suele incluir:

- `index.ts`
- `types.ts`
- `uiRender.ts`
- `pdfRender.ts`
- `propPanel.ts`
- `helper.ts`

## Familias observadas

- `text`
- `multiVariableText`
- `checkbox`
- `radioGroup`
- `select`
- `date`
- `graphics`
- `shapes`
- `tables`
- `barcodes`

## Ejemplo: plugin de barcodes

El módulo `schemas/barcodes/index.ts` registra distintos tipos de código apoyándose en:

- `pdfRender`
- `uiRender`
- `getPropPanelByBarcodeType`
- `createSvgStr`
- iconos Lucide

Ese plugin devuelve un `Record<BarcodeTypes, Plugin<BarcodeSchema>>`.

### Qué implica este diseño
- un mismo grupo puede exportar varios tipos;
- el panel de propiedades cambia por barcode type;
- el render PDF reutiliza helpers comunes;
- la iconografía queda desacoplada de la UI del catálogo.

### Ejemplo de uso conceptual

```ts
import barcodes from '@sisad-pdfme/schemas/barcodes';

const qrPlugin = barcodes.qrcode;
```

## Ejemplo: render PDF de barcode

El `pdfRender` del barcode:

- valida input;
- compone cache key;
- crea PNG si no está en cache;
- embebe imagen en `pdfDoc`;
- calcula `x`, `y`, `width`, `height`, `rotate`, `opacity`;
- dibuja imagen en la página.

### Lecciones de implementación

1. cachear artefactos pesados;
2. separar cálculo geométrico de generación del recurso;
3. reutilizar helpers de layout.

## Texto y multiVariableText

Estos schemas merecen documentación separada porque suelen ser los más usados.

### Responsabilidades
- render inline;
- edición de contenido;
- formato tipográfico;
- compatibilidad con panel de propiedades;
- output PDF consistente.

### Sugerencias de ejemplo

```ts
const textField = {
  id: 'schema-1',
  name: 'client_name',
  type: 'text',
  position: { x: 20, y: 30 },
  width: 60,
  height: 10,
  content: 'John Doe',
  fontSize: 12,
};
```

## Select, checkbox y radio

Estos schemas suelen interactuar con:

- validación;
- API para opciones remotas;
- salida JSON;
- persistencia;
- runtime de formulario.

Documentar estas piezas con ejemplos es imprescindible.

## Tables

Las tablas representan un caso más complejo porque combinan:

- estructura;
- layout;
- dinámicas de filas/celdas;
- generación PDF;
- render UI;
- helper específico.

## Shapes y graphics

Son plugins mixtos, orientados más a composición visual que a captura de datos, pero aún así deben documentar:

- propiedades de forma;
- colores;
- opacidad;
- layout;
- uso informativo.

## Cómo crear un plugin nuevo

```ts
import type { Plugin } from '@sisad-pdfme/common';

export type BadgeSchema = {
  id: string;
  name: string;
  type: 'badge';
  content: string;
  color?: string;
};

const badgePlugin: Plugin<BadgeSchema> = {
  ui: ({ schema }) => {
    return `<div>${schema.content}</div>`;
  },
  pdf: async ({ schema, page }) => {
    page.drawText(schema.content, {
      x: schema.position.x,
      y: schema.position.y,
    });
  },
  propPanel: {
    schema: {
      content: { type: 'string', title: 'Texto' },
      color: { type: 'string', title: 'Color' },
    },
  },
};

export default badgePlugin;
```

## Buenas prácticas para plugins

1. mantener el schema mínimo;
2. ubicar lógica compleja en helper;
3. render UI y render PDF no deben duplicar helpers geométricos;
4. exponer icono claro;
5. agregar pruebas unitarias si el plugin transforma datos o usa cache;
6. documentar limitaciones.

## Ejemplo de integración con el registro

```ts
import badgePlugin from './badge';

const plugins = {
  ...builtInSchemaDefinitions,
  badge: badgePlugin,
};
```

## Qué debe documentarse por cada plugin

- propósito;
- estructura del schema;
- ejemplo mínimo;
- ejemplo completo;
- comportamiento en UI;
- comportamiento en PDF;
- props del panel;
- limitaciones;
- recomendaciones de rendimiento.
