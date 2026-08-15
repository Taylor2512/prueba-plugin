# Canvas core con JSDoc — SISAD PDFME

Este paquete contiene copias completas de los archivos del core visual/interactivo del canvas con documentación JSDoc agregada o normalizada.

## Archivos incluidos

- `Canvas.tsx`: orquestador principal del canvas, Paper, Selecto, Moveable, overlays, menú contextual, edición inline y estado de render.
- `Guides.tsx`: adapter de reglas horizontales/verticales.
- `Mask.tsx`: overlay no interactivo para páginas no activas/bloqueadas.
- `Moveable.tsx`: adapter de `react-moveable`.
- `Padding.tsx`: overlay de padding para blank PDF.
- `Selecto.tsx`: adapter de `react-selecto`.
- `SnapLines.tsx`: overlay y cálculo de snap lines.

## Alcance

- No se modificó la intención funcional.
- No se agregaron dependencias.
- No se agregaron estilos globales ni hacks de z-index.
- La documentación se enfocó en contratos, responsabilidades, helpers, props, callbacks y riesgos de arquitectura.

## Regla de arquitectura

Estos archivos pertenecen al núcleo visual del diseñador. No deben incorporar lógica de host (`DigitalAgreements`, `ExternalForms`), reglas de firma/Uanataca ni manipulación externa del DOM fuera de los adapters explícitos.

<!-- project-tools:navigation:start -->
## Navegación generada

### Secciones

- [Canvas overlays con JSDoc — SISAD PDFME](./overlays/README.md)

### Notas

- [Reglas locales](./AGENTS.md)
- [Reporte de documentación JSDoc — Canvas core](./documentacion-canvas-core-jsdoc.md)
<!-- project-tools:navigation:end -->
