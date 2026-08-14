# Índice

- [01-basic-designer.md](./01-basic-designer.md)
- [02-multi-document-routing.md](./02-multi-document-routing.md)
- [03-generator-runtime.md](./03-generator-runtime.md)
- [04-dynamic-host-integration-s.md](./04-dynamic-host-integration-s.md)
- [06-integracion-copy-paste.md](./06-integracion-copy-paste.md)
- [07-presets-configuracion.md](./07-presets-configuracion.md)

## Contrato de montaje del host

Las rutas de `src/` son la referencia ejecutable de cómo montar
SISAD PDFME en un host real. Hay dos presentaciones y elegir mal es la causa
habitual de que el editor "se vea pequeño".

### `documentation` — catálogos

Para rutas que **no** montan runtime (`/`, `//schemas`). Conservan
ancho editorial, hero, aside y scroll de página.

### `immersive` — Designer, Form, Viewer y familias

Para toda ruta que monta runtime. El host es dueño del viewport:

```tsx
<div className="grid h-dvh min-h-0 w-full grid-rows-[auto_minmax(0,1fr)] overflow-hidden">
  <Topbar />
  <main className="min-h-0 min-w-0 overflow-hidden">
    <RuntimeViewport name="designer-single-user">
      <SisadPdfmeDesigner config={config} template={template} />
    </RuntimeViewport>
  </main>
</div>
```

Reglas que sostienen ese contrato:

- El alto sale del `grid`, nunca de `h-[78vh]` ni de `min-height` fijos.
- El runtime no se envuelve en marcos con padding ni bordes: restan ancho y
  recortan popovers y drag preview.
- La información secundaria va en drawer (desktop) o bottom sheet (móvil).
  Cerrada no renderiza nada, así que no consume ni ancho ni alto y no remonta
  el runtime.
- El topbar no reimplementa controles que el runtime ya expone (guardar,
  página, zoom, sidebars, comentarios, documentos).

### Contrato público de dimensiones

`SisadPdfmeDesigner`, `SisadPdfmeForm` y `SisadPdfmeViewer` aplican siempre
`h-full min-h-0 w-full min-w-0 overflow-hidden` a su contenedor y aceptan
`className`/`style` de forma **aditiva**. El wrapper nunca fija `100vh`,
`position: fixed` ni `max-width`: esas decisiones son del host.

### Aislamiento de estilos

`src/` puede usar la API pública (imports, props `className`/`style`)
pero no puede alcanzar los internals del runtime con CSS. El gate

```bash
npm run quality:-style-boundary
```

falla ante `.sisad-pdfme-*`, `.moveable-*`, `.selecto-*`, `[data-schema-*]`,
`transform: scale`, `zoom` y `!important` dentro de `src/`.

El baseline global (`src/style.css`) se limita a `html`, `body` y `#root`.
Tailwind preflight permanece desactivado para no alterar canvas, PDF, inputs,
Ant Design, Moveable ni Selecto; por eso los shells declaran `font-sans`,
`m-0` y `box-border` de forma explícita.

<!-- project-tools:navigation:start -->
## Navegación generada

### Notas

- [Ejemplo — Basic Designer](./01-basic-designer.md)
- [Ejemplo — Multi Document Routing](./02-multi-document-routing.md)
- [Ejemplo — Generator Runtime](./03-generator-runtime.md)
- [Ejemplos dinámicos con datos externos](./04-dynamic-host-integration-s.md)
- [Ejemplo copy/paste](./06-integracion-copy-paste.md)
- [Presets de configuración SISAD PDFME](./07-presets-configuracion.md)
- [Ejemplos declarativos JSON](./08-ejemplos-declarativos-json.md)
<!-- project-tools:navigation:end -->

<!-- sisad-architecture-hub:start -->
## Navigation

- [Ejemplo — Basic Designer](./01-basic-designer.md)
- [Ejemplo — Multi Document Routing](./02-multi-document-routing.md)
- [Ejemplo — Generator Runtime](./03-generator-runtime.md)
- [Ejemplos dinámicos con datos externos](./04-dynamic-host-integration-s.md)
- [Ejemplo copy/paste](./06-integracion-copy-paste.md)
- [Presets de configuración SISAD PDFME](./07-presets-configuracion.md)
- [Ejemplos declarativos JSON](./08-ejemplos-declarativos-json.md)

> Managed index. Update source documents, not this list.
<!-- sisad-architecture-hub:end -->
