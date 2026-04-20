# Índice de verdad actual

Esta tanda documenta la **verdad actual** del editor. Se apoya directamente en el código de `src/sisad-pdfme` y en los contratos reales del motor, del canvas, del panel derecho, de los schemas y de la colaboración.

## Archivos de referencia principales

- [src/sisad-pdfme/ui/designerEngine.ts](../src/sisad-pdfme/ui/designerEngine.ts)
- [src/sisad-pdfme/ui/components/Designer/index.tsx](../src/sisad-pdfme/ui/components/Designer/index.tsx)
- [src/sisad-pdfme/ui/types.ts](../src/sisad-pdfme/ui/types.ts)
- [src/sisad-pdfme/common/collaboration.ts](../src/sisad-pdfme/common/collaboration.ts)
- [src/sisad-pdfme/schemas/index.ts](../src/sisad-pdfme/schemas/index.ts)

## Documentos incluidos

1. `01-architect-engine-config.md`
2. `02-components-canvas-overlays.md`
3. `03-components-inline-editing.md`
4. `04-components-toolbar-selection.md`
5. `05-components-right-sidebar.md`
6. `06-components-listview-toolbar.md`
7. `07-components-detail-view.md`
8. `08-components-schema-connections.md`
9. `09-registry-schemas.md`
10. `10-module-collaboration.md`

## Objetivo de esta tanda

- Documentar los contratos reales de los archivos más importantes.
- Explicar responsabilidades, inputs, outputs, dependencias y riesgos.
- Dar ejemplos de implementación y de extensión.
- Servir como base para refactors futuros, migración a `platform/pdf` o externalización comercial.

## Alcance

La tanda no intenta replicar todas las líneas del código, sino documentar lo que más valor arquitectónico tiene. El engine ya ofrece un builder fluido para configurar sidebars, canvas, HTTP y hooks de schema; el editor ya tiene overlays on-canvas, inspector, rail de documentos, widgets de conexiones y colaboración; y el repo incluye pruebas unitarias y Playwright específicas para estos flujos.

## Uso recomendado

Lee primero `designerEngine`, luego `schemaRegistry`, después `RightSidebar` + `DetailViewContent`, y por último los overlays del canvas. Si necesitas integrar persistencia/API/JSON, ve directo a `SchemaConnectionsWidget`. Si el objetivo es colaboración multiusuario, prioriza `collaboration.ts` y los tests asociados.

## Contratos cubiertos por esta tanda

- Configuración y builder del engine.
- Overlays y toolbar contextual.
- Inspector derecho y widgets avanzados.
- Catálogo de schemas y extensibilidad.
- Colaboración y sincronización.
- Referencias a tests que validan estos flujos.
