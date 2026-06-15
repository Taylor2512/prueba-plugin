# CURRENT_STATE

## Estado esperado

`sisad-pdfme` funciona como runtime genérico de diseñador PDF con canvas, sidebars, overlays, inspector, documentos, comentarios, recipients, ownership, snapshot, Form, Viewer, Generator y externalForms.

## Estado de documentación anterior

Existían cientos de Markdown y múltiples capas de prompts/agentes. Este reset reduce ruido y contradicciones.

## Módulos existentes a reutilizar

- `schemaTypes`
- `schemaDom`
- `fieldChrome`
- `renderSchemaWithChrome`
- `actionSchemaFactory`
- `optionGroupFactory`
- `optionGroupLayout`
- `optionGroupRenderer`
- `optionValueAdapter`
- `schemaInteractionCapabilities`
- `selectableTargetGuards`
- `transformTargetGuards`
- `canvasDropPipeline`
- `selectionCommands`
- `commandBus`

No crear equivalentes paralelos.
