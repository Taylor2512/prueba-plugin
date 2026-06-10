# onChange Candidates (auto-generated)

Resumen corto: agrupo las ocurrencias de `onChange(` encontradas en `src/` por riesgo para la migración a emisiones atómicas `onChange([{...}])`.

## Low risk (schema-level handlers — safe para cambios automáticos)
- src/sisad-pdfme/schemas/radioGroup/index.ts
- src/sisad-pdfme/schemas/barcodes/uiRender.ts
- src/sisad-pdfme/schemas/checkbox/index.ts
- src/sisad-pdfme/schemas/select/index.ts
- src/sisad-pdfme/schemas/checkboxGroup/index.ts
- src/sisad-pdfme/schemas/multiVariableText/uiRender.ts
- src/sisad-pdfme/schemas/signature/index.ts
- src/sisad-pdfme/schemas/schemaBuilder.ts
- src/sisad-pdfme/schemas/text/uiRender.ts
- src/sisad-pdfme/schemas/date/helper.ts
- src/sisad-pdfme/schemas/graphics/svg.ts
- src/sisad-pdfme/schemas/graphics/image.ts
- src/sisad-pdfme/schemas/tables/uiRender.ts
- src/sisad-pdfme/schemas/options/optionPropPanel.tsx
- src/sisad-pdfme/schemas/options/optionGroupRenderer.ts

## Medium risk (designer-level flows; revisar antes de cambios automáticos)
- src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaConnectionsShared.tsx
- src/sisad-pdfme/ui/components/usePreviewRuntime.ts

## High risk (React UI props / internal drafts — NO modificar automáticamente)
- src/sisad-pdfme/ui/components/Designer/SchemaDropSetupModal.tsx
- src/sisad-pdfme/ui/components/Designer/LeftSidebarSearch.tsx
- src/sisad-pdfme/ui/components/Designer/LeftSidebarCustomFieldModal.tsx

## Observaciones y recomendaciones
- La mayoría de archivos bajo `src/sisad-pdfme/schemas/` ya emiten `onChange([{ key, value }])` — por tanto no requieren conversiones adicionales.
- Evitar convertir handlers de componentes React (`onChange={(e)=>...}`) que no sean el `onChange` provisto por `createSchemaPlugin`.
- Siguiente paso recomendado: revisar los archivos "Medium risk" y crear un adaptador que, cuando corresponda, convierta cambios de draft (`onChange('field', value)`) a un patch atómico al confirmar.

## Siguiente lote sugerido (conservador)
- No hay cambios de bajo riesgo pendientes en `schemas/` que necesiten transformarse — proceder con revisión manual de `Medium risk`.

---
Generado automáticamente por el asistente para guiar la migración atómica de `onChange`.
