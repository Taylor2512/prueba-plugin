# CURRENT_STATE.md — Estado actual operativo

## Producto

Fork/paquete `sisad-pdfme` para diseño, edición y ejecución de documentos PDF con schemas, recipients, ownership, colaboración, comentarios, sidebars, generator, converter y runtime `Designer/Form/Viewer`.

## Inventario analizado

- Código consolidado: `510` archivos.
- Tests: `83` unitarios y `11` Playwright detectados en TOC.
- UI runtime: `121` archivos.
- Schemas: `56` archivos.
- PDF-lib integrado: `154` archivos.
- CSS consolidado: `6` archivos.

## Prioridad actual

1. Blindar color único por destinatario.
2. Sincronizar catálogo con destinatario activo.
3. Preservar ownerColor de schemas existentes.
4. Estabilizar resize/rotate/drag/selection.
5. Proteger snapshot round-trip.
6. Evitar duplicidad entre host, runtime y externalForms.
