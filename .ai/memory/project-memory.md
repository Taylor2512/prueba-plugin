# Project Memory — SISAD PDFME

## Objetivo

Diseñador PDF genérico tipo DocuSign/Wix con múltiples documentos, páginas, destinatarios, color por owner, no-overlap, standard schemas, snapshot oficial, Form/Viewer/Generator parity y externalForms.

## Reglas fuertes

- El color activo solo aplica a schemas nuevos.
- Schemas existentes conservan `ownerColor`.
- `checkboxGroup` y `radioGroup` son grupos lógicos.
- Options internas usan `data-option-id`.
- Root usa `data-schema-id`.
- Botón `+` usa `data-role="group-add-option"` y vive fuera del root transformable.
- `select/dropdown` edita opciones en DetailView.
- Snapshot oficial se usa para descargar, importar, guardar TXT y externalForms.

## Riesgos recurrentes

- Todo funciona solo en página 1.
- Selecto captura overlays/options.
- Moveable calcula contra página equivocada.
- CSS host rompe coordenadas.
- Snapshot pierde `pageNumber`.
- `any` oculta errores de schema.
- Wrappers triviales contaminan `src/features`.
