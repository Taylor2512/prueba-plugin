# TASK-001 — Corregir regresión multipágina del diseñador

## Alcance

Canvas, Paper, Renderer, StaticSchema, coordinate services, overlays, no-overlap.

## Problema

Comportamientos funcionan en página 1 pero fallan en página 2+.

## No tocar

```txt
signingSchemaFactory
approve.ts
decline.ts
attachment.ts
dateSigned.ts
providerRegistry
Form
Viewer
Generator/PDF
StepOne
StepTwo host
ContentCustomForm
Uanataca
externalForms flujo negocio
```

## Búsqueda permitida

```bash
rg "pageNumber|pageIndex|documentId|currentPage|currentPageIndex|activePage|paperPage|paperRoot|data-paper-page|data-paper-root|querySelector\(|querySelectorAll\(|closest\(|getBoundingClientRect|clientX|clientY|scrollLeft|scrollTop|offsetLeft|offsetTop" src/sisad-pdfme/ui src/sisad-pdfme/shared src/sisad-pdfme/schemas

rg "schemaAutoPlace|schemaCollision|smartPlacement|canvasDropPipeline|resolveCanvasDropTarget|DesignerCoordinateService|coordinateMath|Moveable|Selecto|GroupOptionFloatingAction|SelectionContextToolbar|SchemaDropPlaceholder|SchemaDragPreview" src/sisad-pdfme
```

## Archivos candidatos

```txt
src/sisad-pdfme/ui/components/Designer/Canvas/Canvas.tsx
src/sisad-pdfme/ui/components/Designer/Canvas/Moveable.tsx
src/sisad-pdfme/ui/components/Designer/Canvas/Selecto.tsx
src/sisad-pdfme/ui/components/Paper.tsx
src/sisad-pdfme/ui/components/Renderer.tsx
src/sisad-pdfme/ui/components/StaticSchema.tsx
src/sisad-pdfme/ui/components/Designer/shared/designerCoordinateService.ts
src/sisad-pdfme/ui/components/Designer/shared/coordinateMath.ts
src/sisad-pdfme/ui/components/Designer/shared/canvasDropPipeline.ts
src/sisad-pdfme/ui/components/Designer/shared/schemaAutoPlace.ts
src/sisad-pdfme/ui/components/Designer/shared/schemaCollision.ts
src/sisad-pdfme/ui/components/Designer/Canvas/overlays/CanvasOverlayManager.tsx
src/sisad-pdfme/ui/components/Designer/Canvas/overlays/GroupOptionFloatingAction.tsx
src/sisad-pdfme/ui/components/Designer/Canvas/overlays/SelectionContextToolbar.tsx
src/sisad-pdfme/ui/components/Designer/Canvas/overlays/smartPlacement.ts
```

## Presupuesto

Máximo 8 archivos abiertos. Máximo 5 modificados.

## Validación manual

- Drop en página 2.
- Selección en página 2.
- Move/resize en página 2.
- Botón + en página 2.
- Toolbar en página 2.
- Snapshot conserva página.
