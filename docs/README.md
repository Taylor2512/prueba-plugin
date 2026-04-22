# Documentación de SISAD PDFME

Esta carpeta concentra la documentación técnica del proyecto. La estructura está dividida por capas para separar la verdad actual del código, la lectura conceptual, el roadmap y el material histórico.

## Capas de documentación

### Verdad actual del código

- [90-indice-verdad-actual.md](90-indice-verdad-actual.md)
- [01-architect-engine-config.md](01-architect-engine-config.md)
- [02-components-canvas-overlays.md](02-components-canvas-overlays.md)
- [03-components-inline-editing.md](03-components-inline-editing.md)
- [04-components-toolbar-selection.md](04-components-toolbar-selection.md)
- [05-components-right-sidebar.md](05-components-right-sidebar.md)
- [06-components-listview-toolbar.md](06-components-listview-toolbar.md)
- [07-components-detail-view.md](07-components-detail-view.md)
- [08-components-schema-connections.md](08-components-schema-connections.md)
- [09-registry-schemas.md](09-registry-schemas.md)
- [10-module-collaboration.md](10-module-collaboration.md)

### Visión conceptual y funcional

- [91-indice-conceptual.md](91-indice-conceptual.md)
- [20-architecture-platform-engine.md](20-architecture-platform-engine.md)
- [21-canvas-interactions.md](21-canvas-interactions.md)
- [22-inspector-right-panel.md](22-inspector-right-panel.md)
- [23-schema-config-persistence-api-formjson.md](23-schema-config-persistence-api-formjson.md)
- [24-collaboration-sync-comments.md](24-collaboration-sync-comments.md)
- [25-testing-quality-roadmap.md](25-testing-quality-roadmap.md)

### Roadmap de plataforma y empaquetado

- [93-indice-roadmap-plataforma.md](93-indice-roadmap-plataforma.md)
- [94-indice-roadmap-empaquetado.md](94-indice-roadmap-empaquetado.md)
- [95-indice-roadmap-operativo.md](95-indice-roadmap-operativo.md)
- [30-types-transversal-contracts.md](30-types-transversal-contracts.md)
- [31-public-apis-consumer-surface.md](31-public-apis-consumer-surface.md)
- [32-schema-families-extension-guide.md](32-schema-families-extension-guide.md)
- [33-rename-guide-platform-pdf.md](33-rename-guide-platform-pdf.md)
- [34-product-matrix-sdk-commercialization.md](34-product-matrix-sdk-commercialization.md)
- [35-packaging-roadmap.md](35-packaging-roadmap.md)
- [36-commercial-adoption-checklist.md](36-commercial-adoption-checklist.md)
- [37-platform-pdf-migration-plan.md](37-platform-pdf-migration-plan.md)

### Histórico, referencia e índices

- [92-indice-historico.md](92-indice-historico.md)
- [96-sisad-pdfme-overview.md](96-sisad-pdfme-overview.md)
- [97-indice-generado.md](97-indice-generado.md)
- [reference/README.md](reference/README.md)
- [../documentacion-unificada.md](../documentacion-unificada.md)

## Orden recomendado de lectura

1. [90-indice-verdad-actual.md](90-indice-verdad-actual.md)
2. [01-architect-engine-config.md](01-architect-engine-config.md)
3. [08-components-schema-connections.md](08-components-schema-connections.md)
4. [10-module-collaboration.md](10-module-collaboration.md)
5. [91-indice-conceptual.md](91-indice-conceptual.md)
6. [93-indice-roadmap-plataforma.md](93-indice-roadmap-plataforma.md)

## Regla de verdad

- La capa `01-10` documenta el estado actual respaldado por el código.
- La capa `20-25` explica el mapa conceptual.
- La capa `30-37` es roadmap y no debe leerse como implementación existente.
- `reference/` y `documentacion-unificada.md` son apoyo histórico, no fuente de verdad.

## Referencias de código

- Motor y configuración: [../src/sisad-pdfme/ui/designerEngine.ts](../src/sisad-pdfme/ui/designerEngine.ts)
- Editor raíz y carga múltiple: [../src/sisad-pdfme/ui/components/Designer/index.tsx](../src/sisad-pdfme/ui/components/Designer/index.tsx)
- Tipos del runtime: [../src/sisad-pdfme/ui/types.ts](../src/sisad-pdfme/ui/types.ts)
- Colaboración: [../src/sisad-pdfme/common/collaboration.ts](../src/sisad-pdfme/common/collaboration.ts)
- Generación: [../src/sisad-pdfme/generator/generate.ts](../src/sisad-pdfme/generator/generate.ts)
- Conversores: [../src/sisad-pdfme/converter/index.browser.ts](../src/sisad-pdfme/converter/index.browser.ts)
- Schemas: [../src/sisad-pdfme/schemas/index.ts](../src/sisad-pdfme/schemas/index.ts)
