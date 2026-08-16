# Canvas overlays con JSDoc — SISAD PDFME

Este paquete contiene copias completas de los archivos enviados, con documentación JSDoc agregada o normalizada.

## Alcance

- No se cambió lógica funcional.
- No se modificaron imports/exports intencionalmente.
- No se agregaron dependencias.
- La documentación se enfoca en responsabilidades, contratos de props/tipos, helpers geométricos, reglas de overlays, menú contextual, toolbar contextual, drag/drop, comentarios y snap feedback.

## Archivos incluidos

- `CanvasContextMenu.tsx`
- `canvasContextMenuActions.tsx`
- `CanvasOverlayManager.tsx`
- `CanvasStateOverlay.tsx`
- `CommentsOverlay.tsx`
- `floatingSurfaceGeometry.ts`
- `GroupOptionFloatingAction.tsx`
- `InlineEditOverlay.tsx`
- `InlineMetricsOverlay.tsx`
- `overlayState.ts`
- `pointerGeometry.ts`
- `SchemaDragPreview.tsx`
- `SchemaDropCommitFlash.tsx`
- `SchemaDropPlaceholder.tsx`
- `SelectionContextToolbar.tsx`
- `smartPlacement.ts`
- `SnapFeedbackOverlay.tsx`
- `useFloatingToolbarPosition.ts`

## Nota de arquitectura

Estos módulos pertenecen a la capa visual/interactiva del canvas. Deben seguir sin contener reglas de negocio del host, persistencia HTTP, manipulación directa de Moveable/Selecto ni hacks de z-index para ocultar problemas.

<!-- project-tools:navigation:start -->
## Navegación generada

### Notas

- [Reporte de documentación JSDoc](./documentacion-canvas-overlays-jsdoc.md)
<!-- project-tools:navigation:end -->
