# Memoria del proyecto

## Contexto permanente

`sisad-pdfme` es un runtime de edición y generación PDF con `Designer`, `Form`, `Viewer`, schemas, colaboración, recipients, ownership, comments, snapshots, generator y converter.

## Decisiones activas

- `.ai` es fuente de verdad para asistentes.
- El catálogo usa color de destinatario activo.
- El canvas usa ownerColor persistente por schema.
- Transformaciones deben pasar por guards y command bus.
- CSS debe permanecer bajo `.sisad-pdfme-root`.
- externalForms debe consumir snapshot y runtime, no duplicar renderer.

## Inventario base

- Código analizado: `510` archivos.
- Markdown previo: `323` archivos.
- CSS: `6` archivos.
