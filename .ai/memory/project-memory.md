# Project Memory — Designer PDF

## Objetivo

Construir y estabilizar el componente diseñador PDF de `sisad-pdfme`:

- visual compacto;
- multipágina/multidocumento;
- schema plugins;
- owner/recipient colors;
- canvas interactions;
- DetailView/ListView;
- command bus;
- snapshot;
- compatibilidad Form/Viewer/Generator;
- UX funcional tipo DocuSign/Wix.

## Reglas fuertes

- El color del destinatario activo solo aplica a schemas nuevos.
- Schemas existentes conservan owner/color original.
- `checkboxGroup` y `radioGroup` son grupos lógicos.
- Las opciones internas no son schemas.
- Root usa `data-schema-id`.
- Options usan `data-option-id`.
- Botón + usa `data-role="group-add-option"` y vive fuera del root transformable.
- No-overlap por `owner + documentId + pageNumber`.
- Snapshot preserva metadata.
- No duplicar runtime en hosts.

## Prioridad de tareas

1. Multipágina.
2. Guards Selecto/Moveable.
3. Option groups.
4. Schema object model.
5. Type safety.
6. Inspector sections.
7. Visual compact.
8. Wrappers cleanup.
