# HANDOFF — CLAUDE — WAVE 1 — W1-CLAUDE-RS-SCROLL

## Estado
completed (implementación + lint) — validación E2E/build BLOQUEADA por dependencia externa (ver abajo)

## Commit
fa8221f61aa0968ba52d3f9cd86f96fea3083039  (rama ai/claude-uxqa-20260717)

## Objetivo ejecutado
Restablecer un único propietario de scroll por panel del RightSidebar (plan §3.2).
`SidebarBody` estaba en `overflow-hidden`, por lo que DetailView/Docs/List
recortaban el contenido largo sin recuperar scroll (no se llegaba a las secciones
inferiores del inspector).

## Archivos modificados
- src/sisad-pdfme/ui/components/Designer/RightSidebar/layout.tsx
- src/sisad-pdfme/ui/components/Designer/RightSidebar/RightSidebar.tsx
- tests/playwright/right-sidebar-detail-scroll.spec.ts (nuevo)

## Cambios funcionales
- `SidebarBody`: `overflow-hidden` → `overflow-y-auto overflow-x-hidden
  overscroll-contain [scrollbar-gutter:stable]`, con `pb-3 pt-2`. Se preserva la
  transición de panel existente (`transition-[opacity,transform] ... motion-reduce`).
- Slots activos del panel-stack (fields/detail/comments/docs): se agrega
  `overflow-hidden` para que el body sea el único scroll owner y los ancestros
  (frame, panel-stack) queden recortados.
- CommentsRail YA tiene su propio scroller interno correcto
  (`overflow-y-auto overflow-x-hidden overscroll-contain`, línea 243): NO se tocó
  para evitar doble scroll.

## Cambios visuales
- Ninguno de rediseño. Sólo el contrato de overflow + `pb-3/pt-2` de respiro
  inferior. Sin CSS global, sin @apply, sin runtimeStyles.

## Contratos preservados
- selección / owner / document routing / locks / testIds: intactos.
- data-testid="detail-view", guards de interacción del inspector, CommandBus,
  ActionRegistry: sin cambios.
- Header del schema y tabs: preservados (no se movieron; el header sticky es
  refinamiento de Wave 3, ver "Fallos fuera de alcance").

## Validación
```bash
# LINT FOCAL — PASA
node_modules/.bin/eslint \
  src/sisad-pdfme/ui/components/Designer/RightSidebar/layout.tsx \
  src/sisad-pdfme/ui/components/Designer/RightSidebar/RightSidebar.tsx \
  tests/playwright/right-sidebar-detail-scroll.spec.ts --max-warnings=0
```
Resultado: exit 0 (0 errores / 0 warnings).

```bash
# PLAYWRIGHT FOCAL — BLOQUEADO (la app no carga; ver dependencia)
PLAYWRIGHT_BASE_URL=http://localhost:5199 node_modules/.bin/playwright test \
  tests/playwright/right-sidebar-detail-scroll.spec.ts \
  tests/playwright/right-sidebar-docs-tab.spec.ts --project=chromium
```
Resultado: 4 failed. CAUSA RAÍZ = error de build de la app, NO el cambio de scroll.
El spec preexistente `right-sidebar-docs-tab.spec.ts` (que no toqué) también falla
porque el laboratorio completo queda en blanco.

## Fallos fuera de alcance (DEPENDENCIA — owner: COPILOT)
Vite falla al cargar el lab:
```
✘ ERROR: No matching export in
  "src/features/pdfcomponent/labs/export/buildExampleBundle.ts"
  for import "cloneExample"
  → src/features/pdfcomponent/labs/examples/labExamples.js:4
```
- `cloneExample` no existe en `buildExampleBundle.ts`. Los exports reales son:
  inlineTemplateBasePdf, inlineRuntimeOptionsBasePdfs, getExampleBundleFilename,
  buildExampleBundle (+ tipo ExampleBundleOptions).
- La función de clonado real es `n` en `labs/builders/exampleTemplate.ts`
  (`export const n = <T>(example) => ({...})`).
- Este archivo (`src/features/pdfcomponent/**`, façade legacy `labExamples.js`) es
  del dominio de COPILOT (W1-COPILOT-LINT-HOST; plan §5.2/§5.4). NO lo edité.
- Detalle en: handoffs/CLAUDE-W1-DEP-COPILOT.md

Consecuencia: hasta que Copilot corrija el import, ni Playwright ni `vite build`
del lab pueden pasar en ninguna rama basada en 830b27f. Mi cambio queda validado
por contrato + lint; la verificación E2E se hará en el GATE de Wave 1 (worktree
merge) una vez integrado el commit de Copilot.

## Riesgos
- Bajo. Cambio de clases de overflow acotado al contrato documentado.
- El spec nuevo asume que expandir todas las secciones desborda a 620px de alto;
  si en el gate no desborda, el assert de "scrollHeight > clientHeight" habría que
  ajustar el viewport. Se validará en el gate.

## Próximo paso permitido
- Esperar handoff de CODEX (W1-CODEX-P0-HOOKS) y COPILOT (W1-COPILOT-LINT-HOST).
- Como integrador: en prueba-plugin-merge, cherry-pick CODEX → COPILOT → CLAUDE,
  luego correr lint + build + vitest + Playwright focal de Wave 1. Recién ahí mi
  spec de scroll podrá correr en verde.
