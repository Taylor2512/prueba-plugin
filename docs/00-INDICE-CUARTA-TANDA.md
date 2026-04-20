# Cuarta tanda de documentación — índice

Esta tanda descompone el sistema por archivos y piezas críticas del editor. Se apoya en la estructura actual del repositorio `src/sisad-pdfme/...`, en la separación entre `common`, `converter`, `generator`, `pdf-lib`, `schemas` y `ui`, y en componentes específicos del canvas y del inspector como `designerEngine`, `CanvasOverlayManager`, `InlineEditOverlay`, `SelectionContextToolbar`, `RightSidebar`, `ListViewToolbar`, `schemaRegistry` y `collaboration`. fileciteturn15file1

## Documentos incluidos

1. `01-designerEngine-ts.md`
2. `02-CanvasOverlayManager-tsx.md`
3. `03-InlineEditOverlay-tsx.md`
4. `04-SelectionContextToolbar-tsx.md`
5. `05-RightSidebar-tsx.md`
6. `06-ListViewToolbar-tsx.md`
7. `07-DetailViewContent-tsx.md`
8. `08-SchemaConnectionsWidget-tsx.md`
9. `09-schemaRegistry-ts.md`
10. `10-collaboration-ts.md`

## Objetivo de esta tanda

- Documentar los contratos reales de los archivos más importantes.
- Explicar responsabilidades, inputs, outputs, dependencias y riesgos.
- Dar ejemplos de implementación y de extensión.
- Servir como base para refactors futuros, migración a `platform/pdf` o externalización comercial.

## Alcance

La tanda no intenta replicar todas las líneas del código, sino documentar lo que más valor arquitectónico tiene. El engine ya ofrece un builder fluido para configurar sidebars, canvas, HTTP y hooks de schema; el editor ya tiene overlays on-canvas, inspector, rail de documentos, widgets de conexiones y colaboración; y el repo incluye pruebas unitarias y Playwright específicas para estos flujos. fileciteturn19file15turn19file17 fileciteturn15file1

## Uso recomendado

Lee primero `designerEngine`, luego `schemaRegistry`, después `RightSidebar` + `DetailViewContent`, y por último los overlays del canvas. Si necesitas integrar persistencia/API/JSON, ve directo a `SchemaConnectionsWidget`. Si el objetivo es colaboración multiusuario, prioriza `collaboration.ts` y los tests asociados. fileciteturn15file1
