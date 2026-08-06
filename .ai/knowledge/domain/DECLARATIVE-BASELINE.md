# Baseline de complejidad y comportamiento

Fecha de corte: 2026-07-31

## Resumen

- `src/` contiene 28 archivos y concentra la superficie declarativa de ejemplo.
- `src/sisad-pdfme/integration` contiene 3 archivos y concentra el puente reusable hacia Designer/Form/Viewer.
- El build de producción y la suite focal pasaron.
- Se capturaron dos evidencias visuales: catálogo y ejemplo multiusuario.

## Inventario por archivo y símbolo

| Archivo | Lineas | Simbolos principales | Clasificacion | Owner propuesto | Observacion |
|---|---:|---|---|---|---|
| `src//data/showcaseTemplate.js` | 158 | `buildShowcaseTemplate`, `layoutPageForTypes`, `resolveNaturalSize`, `decorateDemoSchema` | `CORE_CANDIDATE` | `runtime-architect` | Reglas de layout y receta de pagina; candidato directo a core reusable. |
| `src//Builder.js` | 127 | `createTemplate`, `appendTemplatePages`, `createUploadedDocument`, `createCollaboration`, `clone`, `create` | `CORE_CANDIDATE` | `runtime-architect` | Composicion y normalizacion de templates, documentos y collaboration. |
| `src//Bundle.js` | 170 | `normalizeHostData`, `getBundleFilename`, `buildBundle`, `buildHref` | `CORE_CANDIDATE` | `runtime-architect` | Export portable y normalizacion de host data. |
| `src//data/multiUser.js` | 62 | `MULTI_USER_RECIPIENTS`, `MULTI_USER_FAMILY_KEYS`, `applyRecipientOwnership`, `buildMultiUserShowcaseTemplate` | `ADVANCED_DEMO` / `CORE_CANDIDATE` | `collaboration-architect` | Propaga ownership y color del schema en multiusuario. |
| `src//data/runtimeConfig.js` | 58 | `CONFIG_PROFILES`, `createRuntimeConfig`, `deepMerge` | `CORE_CANDIDATE` | `config-specialist` | Merge de perfiles, overrides y defaults de ejemplo. |
| `src//data/familyCatalog.js` | 143 | `FAMILY_META`, `FAMILY`, `PRIMARY_ROUTE_GROUPS`, `FAMILYROUTE_GROUPS`, `SEMANTICROUTE`, `IMMERSIVE_ROUTE_OPTIONS` | `_UI` | `explorer` | Registry semantico de familias y rutas; data-driven. |
| `src//data/demoDocuments.js` | 29 | `DEMO_DOCUMENTS` | `_UI` | `explorer` | Fixture de documentos para demos multi-documento. |
| `src//data/labRoutes.jsx` | n/a | `getLab`, `PRIMARYROUTE_DEFINITIONS`, `buildFamilyRouteDefinitions` | `_UI` | `explorer` | Router de ejemplos y wrapper de paginas. |
| `src//pages/CatalogPage.jsx` | 115 | `CatalogPage`, `SchemasCatalogPage` | `_UI` | `explorer` | Catalogo documental, sin runtime montado. |
| `src//pages/DesignerSingleUserPage.jsx` | 116 | `DesignerSingleUserPage`, `handleTemplateChange`, `handleSave` | `_UI` | `explorer` | Demo inmersiva con estado local y controller ref. |
| `src//pages/DesignerMultiUserPage.jsx` | 184 | `DesignerMultiUserPage`, `RecipientSelect`, `handleAssignmentChange`, `handleActiveRecipientChange`, `handleRecipientsChange`, `handleSave` | `ADVANCED_DEMO` | `explorer` | Demo inmersiva con collaboration, assignments y color por recipient. |
| `src//pages/RuntimeFormPage.jsx` | 89 | `RuntimeFormPage`, `handleInputChange` | `_UI` | `explorer` | Captura de datos con `values` derivado de template. |
| `src//pages/RuntimeViewerPage.jsx` | 67 | `RuntimeViewerPage` | `_UI` | `explorer` | Vista read-only para revisar layout y prefill. |
| `src//pages/SchemaFamilyPage.jsx` | 55 | `SchemaFamilyPage` | `_UI` | `explorer` | Demo por familia de schema, parametrizada por catalogo. |
| `src//components/*.jsx` | variable | `DocumentationShell`, `ImmersiveShell`, `Topbar`, `RouteNav`, `EventLog`, `ControllerPanel`, `InfoCard`, `RouteCard`, `RuntimeViewport` | `_UI` | `explorer` | Capa visual del ejemplo; reusable entre paginas, no core. |
| `src//hooks/useRuntimeEvents.js` | n/a | `useRuntimeEvents` | `_UI` | `explorer` | Log local de callbacks y eventos del wrapper. |
| `src//index.js` | 20 | reexports de builders, bundle y multiuser | `_UI` | `explorer` | Barrel de ejemplo, sin orquestacion de runtime. |
| `src//lab.jsx` | 9 | `getLab`, reexports de catalogo/config/template | `_UI` | `explorer` | Punto de entrada para rutas de ejemplo. |
| `src/sisad-pdfme/integration/index.ts` | 220 | reexports publicos, `configurePdfjsLegacyWorker`, `getSchemaCatalog`, `normalizeTemplateForRuntime` | `CORE_CANDIDATE` | `runtime-architect` | Barrel publico reusable. |
| `src/sisad-pdfme/integration/normalizeHostData.ts` | 83 | `normalizeHostData`, `SisadPdfmeHostData*` | `CORE_CANDIDATE` | `runtime-architect` | Normaliza host data para Designer/Form/Viewer. |
| `src/sisad-pdfme/integration/schemaController.ts` | 91 | `createSchemaController`, `processSchema`, `processTemplate` | `CORE_CANDIDATE` | `runtime-architect` | Normalizacion y callbacks de schema desde integracion. |

## Comportamiento visible

- El catalogo queda en modo documental y no monta runtime.
- Los modos inmersivos usan `ImmersiveShell` y un viewport propio.
- El ejemplo multiusuario muestra el color del recipient y el ownership del schema en canvas y panel lateral.
- Las rutas siguen siendo data-driven desde el catalogo semantico.

## Errores y deuda preexistente

- `src//data/showcaseTemplate.js` y `src//data/multiUser.js` siguen consumiendo helpers internos del core mediante imports profundos. Eso es deuda de la siguiente fase, no un fallo de esta baseline.
- Existen advertencias de build ya conocidas: `use client` ignorado por Vite, variantes `min-*`/`max-*` con unidades mixtas, chunk grande y uso de `eval`.

## Baseline de verificacion

- Tests focales: `npx vitest run tests/unit//lab.test.ts tests/unit//runtimeConfig.test.ts tests/unit//ControllerPanel.test.tsx tests/unit//hells.test.tsx tests/unit/features/pdfcomponent/labs/builders.test.ts tests/unit/features/pdfcomponent/template.test.ts tests/unit/sisad-pdfme//Builder.test.ts tests/unit/sisad-pdfme//multiUser.test.ts tests/unit/sisad-pdfme/ui/components/Designer/index.test.ts`
- Build: `npm run build`
- Capturas:
  - `reports/declarative-instances/screenshots/00-catalog.png`
  - `reports/declarative-instances/screenshots/01-designer-multi-user.png`

## Siguiente paso

- Declarar un gate de frontera de lenguaje e imports publicos antes de migrar mas helpers fuera de `src/`.
