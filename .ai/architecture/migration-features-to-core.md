# Migración `features/pdfcomponent` → `sisad-pdfme`

> Plan vivo. Diseño antes de implementar. Orden estricto 1→6, cada fase shippable + testeada antes de la siguiente.

## Contexto / blast radius
- Importadores reales: `src/App.jsx` + archivos internos de `features/pdfcomponent`. Radio pequeño.
- Aliases ya cubren `@sisad-pdfme/*` → `src/sisad-pdfme/*` (vite.config.js + tsconfig.json). No hace falta alias nuevo.
- Tests existentes: `tests/unit/features/pdfcomponent/domain/collaborationAppearance.test.ts`, playwright `…/collaborationAppearance.spec.ts`.
- Runner: vitest. Alias de test `@/` → `src/`.

## Hallazgo clave — duplicación real con el core
`domain/collaborationAppearance.js` solapa con:
- `ui/components/Designer/shared/recipientColor.ts` (`normalizeHexColor`, `resolveAllRecipientColors`)
- `ui/components/Designer/shared/schemaTone.ts` (`resolveSchemaTone`)
- `collaboration/index.ts` (`getSchemaOwner`)

| fn feature | equivalente core | veredicto |
|---|---|---|
| `normalizeHexUpper` | `normalizeHexColor` | dup → borrar, reusar core |
| `decorateCollaborationUsers` | `resolveAllRecipientColors` | casi-dup, solo difiere la paleta |
| `resolveSchemaOwnerColor` | parcial: `resolveSchemaTone` + `getSchemaOwner` | reconciliar |
| `decorateSchemaWithCollaboration` | ninguno | único → mover al core |
| `decorateTemplateWithCollaboration` | ninguno | único → mover al core |
| `withAlpha`, `buildCollaboratorChipStyle` | ninguno | chip UI → mover al core |

**Cuidado:** paleta feature (`DEFAULT_COLLABORATOR_COLORS`, 10 hexes) ≠ core (`DEFAULT_RECIPIENT_PALETTE`, 10 hexes distintos). Fusionar a ciegas = colores de destinatario cambian = regresión visual + snapshot roto. **Parametrizar paleta, conservar default por call-site.**

---

## Fase 1 — utilidades puras (riesgo mínimo)
Nuevos archivos:
- `browser/objectUrls.ts` — `createObjectUrl`, `revokeObjectUrls` (+ guards SSR/test)
- `browser/downloads.ts` — `downloadUrl`, `downloadJson`, `downloadBytes`
- `templates/createDefaultTemplate.ts` — factory configurable; defaults reproducen `createInitialPdfmeTemplate()` (390×400, padding [12,12,12,12], schemas [[]])
- `runtime/runtimeModes.ts` — `RUNTIME_MODES`, `isValidRuntimeMode`, `getErrorMessage`, `formatPageStatus`, `resolveInitialUxMode({ search, storedMode, fallback, allowedModes })`

NO se mueve: `UX_MODE_STORAGE_KEY = 'sisad-pdfme.lab.ux-mode'` (storage key del lab) → queda en features, pasa como parámetro.

`binary.js` / `template.js` / `labState.js` → shims re-export desde core (features sigue verde hasta Fase 6).
Tests unitarios por cada archivo nuevo.

## Fase 2 — collaboration appearance (toca runtime, riesgo medio)
- `collaboration/recipientPalette.ts` — `LAB_COLLABORATOR_PALETTE` (10 hexes feature preservados), `decorateCollaborationUsers(users, { palette, fallbackColor, preserveExplicitColor })`. Reusa `normalizeHexColor`.
- `collaboration/appearance.ts` — `withAlpha`, `buildCollaboratorChipStyle`, `resolveCollaboratorById`.
- `collaboration/schemaOwnershipAppearance.ts` — `resolveSchemaOwnerColor`, `decorateSchemaWithCollaboration`, `decorateTemplateWithCollaboration` con `ownerColorPriority`. Reusa `getSchemaOwner` de `collaboration/index.ts` (fuente única de owner-id).
- Migrar tests existentes + test de paridad de paleta default (guard de regresión).

## Fase 3 — builders de ejemplos (dividir, quitar hardcodes)
- `examples/builders/createExampleTemplate.ts` — `createSchema`, `createSchemaByType`, `createTemplate`, `createUploadedDocument`, `appendTemplatePages`
- `examples/builders/createSchemaShowcase.ts` — `createSchemaShowcasePages`, `mergeSchemaPages`
- `examples/builders/createMultiDocumentExample.ts` — ensamblado multi-doc + `createAuditMetadata`, `createCollaboration`, `createCommentAnchor`
- `examples/export/buildExampleBundle.ts` + `downloadExampleBundle.ts` — `buildLabExampleDownloadBundle/Href`, `getLabExampleDownloadFilename`, `inlineTemplateBasePdf`, `inlineRuntimeOptionsBasePdfs`

`ExampleBuilderConfig`: `pdfResolver`, `schemaDefinitions`, `plugins`, `excludeSchemaTypes`, `pageSlots`, `ownerRecipientId`, `documentId`, `startingPageNumber`.
NO al core: `LAB_PDFS`, `LAB_EXAMPLES`, `getTemplatePdfUrl('/templates/...')`, títulos, `getLabExampleActions`.

## Fase 4 — hooks runtime workbench (extraer de PdfmeLabPage)
- `runtime/usePdfmeRuntimeInstance.ts` (new Designer/Form/Viewer, destroy seguro, updateOptions)
- `runtime/usePdfmeTemplateSync.ts`
- `runtime/usePdfmeInputSync.ts`
- `runtime/usePdfmeArtifacts.ts` (generate, pdf2img/pdf2size/img2pdf, object-URL lifecycle)

`PdfmeLabPage.jsx` conserva página/routing/estado lab; consume hooks. No mover página completa.

## Fase 5 — devtools (opt-in, no default)
`devtools/workbench/PdfmeWorkbench.tsx` + `devtools/lab-ui` solo si quieres lab empaquetado. NUNCA en el entry export principal.

## Fase 6 — reescribir imports + CSS
- Repointar `labExamples.js`, `PdfmeLabPage.jsx`, `App.jsx` al core. Quitar shims Fase 1.
- `labRoutes.css`: solo reglas workbench reutilizables → `ui/styles/sisad-pdfme-workbench.css`. Nunca tocar `.moveable-*`/`.selecto-*`/`.sisad-pdfme-designer-*`.

## Riesgos
| Riesgo | Mitigación |
|---|---|
| Cambio de color destinatario | default `LAB_COLLABORATOR_PALETTE` + test de paridad |
| Dup colaboración | reusar `normalizeHexColor`/`getSchemaOwner`, borrar dups |
| Snapshot/bundle roto | `inline*` conserva forma legacy, test compat externalForms |
| Imports rotos | shims Fase 1 mantienen features verde hasta Fase 6 |
| Bundle bloat | devtools nunca en export default |

## Criterio de aceptación
- [ ] `features/pdfcomponent` sigue funcionando
- [ ] sin lógica dup de colaboración/owner color
- [ ] `createDefaultTemplate` en core
- [ ] bundle export en core
- [ ] builders sin hardcode `/templates`
- [ ] `PdfmeLabPage` usa hooks genéricos
- [ ] lifecycle Designer/Form/Viewer reutilizable
- [ ] sin UI de lab en core productivo
- [ ] CSS lab no afecta canvas
- [ ] tests unitarios nuevos verdes
- [ ] playwright `/lab/multi-document-routing` verde
- [ ] test de paridad de paleta default verde

## Estado
- Fase 1: ✅ COMPLETA (2026-06-02). Nuevos: `browser/objectUrls.ts`, `browser/downloads.ts`, `templates/createDefaultTemplate.ts`, `runtime/runtimeModes.ts`. Shims: `utils/binary.js`, `template.js`, `domain/labState.js` (re-export vía `@/sisad-pdfme/...`). Tests: 18 verdes. `UX_MODE_STORAGE_KEY` se quedó en features.
- Fase 2: ✅ COMPLETA. `collaboration/recipientPalette.ts` (`LAB_COLLABORATOR_PALETTE` + `decorateCollaborationUsers`, reusa `normalizeHexColor`), `collaboration/appearance.ts` (`withAlpha`/`buildCollaboratorChipStyle`/`resolveCollaboratorById`), `collaboration/schemaOwnershipAppearance.ts` (`resolveSchemaOwnerColor`/`decorateSchema|TemplateWithCollaboration`, reusa `normalizeRecipientIds`). Shim `domain/collaborationAppearance.js`. Test paridad de paleta: 14 verdes.
- Fase 3: ✅ COMPLETA. `examples/builders/{schemaFactory,schemaShowcase,exampleTemplate}.ts` + `examples/export/{buildExampleBundle,downloadExampleBundle}.ts`. `labExamples.js` reescrito a capa fina: data del lab + wiring (inyecta `overridesByType=SCHEMA_EXAMPLE_OVERRIDES`, `pdfResolver=getTemplatePdfUrl`, `source='sisad-pdfme-lab'`). Output idéntico. 14 tests builders verdes.
- Fase 4: ✅ COMPLETA. `runtime/usePdfmeRuntimeInstance.ts` (mount/options/template/input sync + safe destroy, ctors inyectados) + `runtime/usePdfmeArtifacts.ts` (generate/convert + object-URL lifecycle, deps inyectadas). `PdfmeLabPage.jsx` reescrito: 4 effects + 6 refs + 2 helpers locales → 1 hook. 5 tests hook verdes (RTL+jsdom).
- Fase 5: ✅ COMPLETA. `devtools/index.ts` = barrel opt-in (hooks + builders + export + browser + collab). NO en entry default. UI del lab se queda en features (no se movió al core).
- Fase 6: ✅ CSS auditado — `labRoutes.css` SIN selectores `.moveable-*`/`.selecto-*`/`.sisad-pdfme-designer-*` (criterio #9 ok). Reglas `.sisad-pdfme-lab-runtime-host`/`canvas-shell` se dejan en su sitio (mover 30 líneas = riesgo visual sin test). Shims (`binary/template/labState/collaborationAppearance`) se MANTIENEN como capa fina de adaptación + targets de los smoke tests por archivo; eliminación física diferida (bajo valor, rompería tests por-archivo; PdfmeLabPage no testeable por bug antd ESM preexistente).

## Nota sobre tests preexistentes
`tests/unit/features/pdfcomponent/PdfmeLabPage.test.ts` y ~11 archivos en `tests/unit/sisad-pdfme` (pdf-lib/ui) fallan al COLECTAR por resolución ESM de `antd/es/theme/internal` — verificado idéntico en HEAD limpio (worktree). NO causado por esta migración. 432 tests pasan.

## Nota de aliasing
Vite NO tiene wildcard `@sisad-pdfme/*` (solo common/ui/generator/schemas/converter/pdf-lib). Para importar módulos core nuevos desde features usar `@/sisad-pdfme/<ruta>.js` (`@`→src, resuelve en vite + vitest). Alternativa futura: añadir wildcard en vite.config.js si se quiere usar `@sisad-pdfme/<subpath>`.
