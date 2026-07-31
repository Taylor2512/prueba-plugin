# Baseline de complejidad y comportamiento

Fecha de corte: 2026-07-31

## Resumen

- `src/examples` contiene 28 archivos y concentra la superficie declarativa de ejemplo.
- `src/sisad-pdfme/integration` contiene 3 archivos y concentra el puente reusable hacia Designer/Form/Viewer.
- El build de producción y la suite focal pasaron.
- Se capturaron dos evidencias visuales: catálogo y ejemplo multiusuario.

## Inventario por archivo y símbolo

| Archivo | Lineas | Simbolos principales | Clasificacion | Owner propuesto | Observacion |
|---|---:|---|---|---|---|
| `src/examples/data/showcaseTemplate.js` | 158 | `buildShowcaseTemplate`, `layoutPageForTypes`, `resolveNaturalSize`, `decorateDemoSchema` | `CORE_CANDIDATE` | `runtime-architect` | Reglas de layout y receta de pagina; candidato directo a core reusable. |
| `src/examples/exampleBuilder.js` | 127 | `createTemplate`, `appendTemplatePages`, `createUploadedDocument`, `createCollaboration`, `cloneExample`, `createExample` | `CORE_CANDIDATE` | `runtime-architect` | Composicion y normalizacion de templates, documentos y collaboration. |
| `src/examples/exampleBundle.js` | 170 | `normalizeExampleHostData`, `getExampleBundleFilename`, `buildExampleBundle`, `buildExampleHref` | `CORE_CANDIDATE` | `runtime-architect` | Export portable y normalizacion de host data. |
| `src/examples/data/multiUserExample.js` | 62 | `MULTI_USER_RECIPIENTS`, `MULTI_USER_FAMILY_KEYS`, `applyRecipientOwnership`, `buildMultiUserShowcaseTemplate` | `ADVANCED_DEMO` / `CORE_CANDIDATE` | `collaboration-architect` | Propaga ownership y color del schema en multiusuario. |
| `src/examples/data/runtimeConfig.js` | 58 | `EXAMPLE_CONFIG_PROFILES`, `createRuntimeConfig`, `deepMerge` | `CORE_CANDIDATE` | `config-specialist` | Merge de perfiles, overrides y defaults de ejemplo. |
| `src/examples/data/familyCatalog.js` | 143 | `FAMILY_META`, `FAMILY_EXAMPLES`, `PRIMARY_ROUTE_GROUPS`, `FAMILY_ROUTE_GROUPS`, `SEMANTIC_ROUTE_EXAMPLES`, `IMMERSIVE_ROUTE_OPTIONS` | `EXAMPLE_UI` | `explorer` | Registry semantico de familias y rutas; data-driven. |
| `src/examples/data/demoDocuments.js` | 29 | `DEMO_DOCUMENTS` | `EXAMPLE_UI` | `explorer` | Fixture de documentos para demos multi-documento. |
| `src/examples/data/labRoutes.jsx` | n/a | `getLabExamples`, `PRIMARY_ROUTE_DEFINITIONS`, `buildFamilyRouteDefinitions` | `EXAMPLE_UI` | `explorer` | Router de ejemplos y wrapper de paginas. |
| `src/examples/pages/CatalogPage.jsx` | 115 | `CatalogPage`, `SchemasCatalogPage` | `EXAMPLE_UI` | `explorer` | Catalogo documental, sin runtime montado. |
| `src/examples/pages/DesignerSingleUserPage.jsx` | 116 | `DesignerSingleUserPage`, `handleTemplateChange`, `handleSave` | `EXAMPLE_UI` | `explorer` | Demo inmersiva con estado local y controller ref. |
| `src/examples/pages/DesignerMultiUserPage.jsx` | 184 | `DesignerMultiUserPage`, `RecipientSelect`, `handleAssignmentChange`, `handleActiveRecipientChange`, `handleRecipientsChange`, `handleSave` | `ADVANCED_DEMO` | `explorer` | Demo inmersiva con collaboration, assignments y color por recipient. |
| `src/examples/pages/RuntimeFormPage.jsx` | 89 | `RuntimeFormPage`, `handleInputChange` | `EXAMPLE_UI` | `explorer` | Captura de datos con `values` derivado de template. |
| `src/examples/pages/RuntimeViewerPage.jsx` | 67 | `RuntimeViewerPage` | `EXAMPLE_UI` | `explorer` | Vista read-only para revisar layout y prefill. |
| `src/examples/pages/SchemaFamilyPage.jsx` | 55 | `SchemaFamilyPage` | `EXAMPLE_UI` | `explorer` | Demo por familia de schema, parametrizada por catalogo. |
| `src/examples/components/*.jsx` | variable | `ExampleDocumentationShell`, `ExampleImmersiveShell`, `ExampleTopbar`, `ExampleRouteNav`, `ExampleEventLog`, `ExampleControllerPanel`, `InfoCard`, `RouteCard`, `RuntimeViewport` | `EXAMPLE_UI` | `explorer` | Capa visual del ejemplo; reusable entre paginas, no core. |
| `src/examples/hooks/useExampleRuntimeEvents.js` | n/a | `useExampleRuntimeEvents` | `EXAMPLE_UI` | `explorer` | Log local de callbacks y eventos del wrapper. |
| `src/examples/index.js` | 20 | reexports de builders, bundle y multiuser | `EXAMPLE_UI` | `explorer` | Barrel de ejemplo, sin orquestacion de runtime. |
| `src/examples/labExamples.jsx` | 9 | `getLabExamples`, reexports de catalogo/config/template | `EXAMPLE_UI` | `explorer` | Punto de entrada para rutas de ejemplo. |
| `src/sisad-pdfme/integration/index.ts` | 220 | reexports publicos, `configurePdfjsLegacyWorker`, `getSchemaCatalog`, `normalizeTemplateForRuntime` | `CORE_CANDIDATE` | `runtime-architect` | Barrel publico reusable. |
| `src/sisad-pdfme/integration/normalizeHostData.ts` | 83 | `normalizeHostData`, `SisadPdfmeHostData*` | `CORE_CANDIDATE` | `runtime-architect` | Normaliza host data para Designer/Form/Viewer. |
| `src/sisad-pdfme/integration/schemaController.ts` | 91 | `createSchemaController`, `processSchema`, `processTemplate` | `CORE_CANDIDATE` | `runtime-architect` | Normalizacion y callbacks de schema desde integracion. |

## Comportamiento visible

- El catalogo queda en modo documental y no monta runtime.
- Los modos inmersivos usan `ExampleImmersiveShell` y un viewport propio.
- El ejemplo multiusuario muestra el color del recipient y el ownership del schema en canvas y panel lateral.
- Las rutas siguen siendo data-driven desde el catalogo semantico.

## Errores y deuda preexistente

- `src/examples/data/showcaseTemplate.js` y `src/examples/data/multiUserExample.js` siguen consumiendo helpers internos del core mediante imports profundos. Eso es deuda de la siguiente fase, no un fallo de esta baseline.
- Existen advertencias de build ya conocidas: `use client` ignorado por Vite, variantes `min-*`/`max-*` con unidades mixtas, chunk grande y uso de `eval`.

## Baseline de verificacion

- Tests focales: `npx vitest run tests/unit/examples/labExamples.test.ts tests/unit/examples/runtimeConfig.test.ts tests/unit/examples/exampleControllerPanel.test.tsx tests/unit/examples/exampleShells.test.tsx tests/unit/features/pdfcomponent/labs/builders.test.ts tests/unit/features/pdfcomponent/template.test.ts tests/unit/sisad-pdfme/examples/exampleBuilder.test.ts tests/unit/sisad-pdfme/examples/multiUserExample.test.ts tests/unit/sisad-pdfme/ui/components/Designer/index.test.ts`
- Build: `npm run build`
- Capturas:
  - `reports/declarative-instances/screenshots/00-catalog.png`
  - `reports/declarative-instances/screenshots/01-designer-multi-user.png`

## Siguiente paso

- Declarar un gate de frontera de lenguaje e imports publicos antes de migrar mas helpers fuera de `src/examples`.
