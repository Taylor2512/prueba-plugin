# CURRENT_STATE.md — Estado actual operativo

Actualizado: `2026-06-01`

## Producto

Fork/paquete `sisad-pdfme` para diseño, edición y ejecución de documentos PDF con schemas, recipients, ownership, colaboración, comentarios, sidebars, generator, converter y runtime `Designer/Form/Viewer`.

## Inventario analizado

- Código consolidado: `456` archivos JS/TS/JSX/TSX.
- Markdown consolidado: `361` archivos.
- CSS consolidado: `6` archivos.
- Tests detectados en TOC: Playwright para canvas, checkboxGroup, DetailView, snapshot, no-overlap y transform; unitarios para checkboxGroup, schemaAutoPlace, schemaCollision, DetailView, snapshot y selección.

## Prioridad actual

1. Cerrar contrato de schemas estándar: `text`, `number`, `checkbox`, `checkboxGroup`, `radioGroup`, `select/dropdown`.
2. Blindar botón `+` por contexto.
3. Evitar superposición de schemas del mismo owner y validar bounding box de grupos.
4. Preservar ownerColor/recipientColor/schemaUid/documentId/pageNumber en todas las operaciones.
5. Fortalecer DetailView/ListView con modo schema individual, grupo y opción interna.
6. Garantizar parity Designer/Form/Viewer/Generator.
7. Mantener CSS minimalista y scope `.sisad-pdfme-root`.
8. Actualizar tests y matriz de casos de uso.

## Riesgos abiertos

- `checkboxGroup` puede compilar pero fallar en flujo real si no se valida con Playwright.
- Las coordenadas pueden fallar en overlays aunque `DesignerCoordinateService` esté correcto.
- `selectedOptionIds`, `content` y `checked` pueden divergir si no existe normalización centralizada.
- DetailView puede mostrar metadata técnica o texto roto si no se separa vista principal de avanzado.
- Snapshot puede preservar schemas simples pero perder group metadata si no se prueba con grupos.
