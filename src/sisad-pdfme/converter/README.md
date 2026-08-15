# Converter comentado — SISAD PDFME

Este ZIP contiene los archivos del módulo converter con comentarios técnicos agregados sin cambiar la lógica funcional.

## Archivos incluidos

```txt
img2pdf.ts
index.browser.ts
index.node.ts
index.ts
modules.d.ts
pdf2img.ts
pdf2size.ts
types.d.ts
documentacion-converter-sisad-pdfme.md
```

## Responsabilidad del módulo

El paquete converter actúa como una capa de conversión independiente del diseñador:

- `pdf2img`: renderiza páginas PDF a imágenes.
- `pdf2size`: obtiene tamaños de páginas PDF.
- `img2pdf`: crea PDF multipágina desde imágenes.
- `index.browser`: adapta PDF.js/canvas al navegador.
- `index.node`: adapta PDF.js/node-canvas a Node.

## Regla de arquitectura

Este módulo no debe conocer:

- Designer
- Canvas
- Moveable
- Selecto
- Snapshot
- schemas
- DetailView
- reglas SISAD de negocio

Debe mantenerse como utilidad técnica reutilizable por el runtime.

<!-- project-tools:navigation:start -->
## Navegación generada

### Notas

- [Documentación técnica — `@sisad-pdfme/converter`](./documentacion-converter-sisad-pdfme.md)
<!-- project-tools:navigation:end -->
