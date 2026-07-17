# INTEGRACIÓN WAVE 1 — BLOQUEADA (integrador: CLAUDE)

Fecha: 2026-07-17

## Veredicto
NO MERGE (regla plan §9). No se integra Wave 1 hasta resolver la brecha de
coordinación descrita abajo.

## Estado real por rama (base = 830b27f)
- ai/claude-uxqa-20260717: LIMPIO. 1 commit fa8221f.
  - layout.tsx, RightSidebar.tsx, tests/playwright/right-sidebar-detail-scroll.spec.ts
  - lint focal OK. E2E pendiente (app no carga por blocker de labExamples).
- ai/codex-uxqa-20260717: VACÍO. Sin commits vs base. Handoff CODEX-wave1.md sin SHA.
- ai/copilot-uxqa-20260717: 1 commit ab52464 (solo tests smoke:
  template.test.ts, utils/binary.test.ts). NO incluye el fix de labExamples.js.
  Sin handoff COPILOT aún.

## Brecha de coordinación (crítica)
El checkout COMPARTIDO `prueba-plugin` (rama main) tiene ediciones SIN COMMIT que
un agente (CODEX, según CODEX-wave1.md) hizo DIRECTAMENTE en main, violando la
regla 1 (cada agente en su worktree):

```
 M src/features/pdfcomponent/labs/examples/labExamples.js        (dominio COPILOT)
 M .../RightSidebar/ListView/Item.tsx                            (ListView)
 M .../RightSidebar/ListView/ListView.tsx                        (ListView)
 M .../RightSidebar/ListView/SelectableSortableContainer.tsx     (ListView)
 M .../RightSidebar/RightSidebar.tsx                             (OWNED por CLAUDE)
 M .../RightSidebar/layout.tsx                                   (OWNED por CLAUDE)
```

Problemas:
1. Trabajo en el checkout equivocado (main), no en prueba-plugin-codex.
2. Edita archivos OWNED por Claude (RightSidebar.tsx, layout.tsx) — duplica/pisa
   W1-CLAUDE-RS-SCROLL, que ya está resuelto y commiteado limpio en fa8221f.
3. Hace el fix de Copilot (labExamples.js) — y encima probablemente sigue roto:
   importa `cloneExample` desde `builders/exampleTemplate.ts`, que exporta `n`,
   no `cloneExample`.
4. El trabajo real de W1-CODEX-P0-HOOKS (SisadPdfmeForm.tsx compiler +
   SchemaDropCommitFlash.tsx hooks condicionales) NO está hecho en ningún lado.

## Acción del integrador
- No se cherry-pickea nada de Codex (rama vacía).
- No se tocan las ediciones sueltas de main (no son de Claude; revertirlas sería
  destructivo y no es mi decisión).
- Se espera decisión del orquestador (usuario) sobre cómo rescatar/descartar el
  trabajo suelto de main y reencauzar a Codex a su worktree/tarea.

## Camino limpio propuesto (cuando el usuario lo apruebe)
1. Codex: mover su trabajo a prueba-plugin-codex, separado por dominio:
   - conservar SOLO su P0 real (hooks/compiler) en su rama;
   - descartar sus cambios de RightSidebar scroll (ya cubiertos por Claude fa8221f);
   - pasar ListView y labExamples a los owners correctos vía handoff.
2. Copilot: commitear el fix real de labExamples.js en su rama y entregar handoff.
3. Recién entonces: gate Wave 1 en prueba-plugin-merge, orden CODEX → COPILOT →
   CLAUDE, con lint + build + vitest + Playwright focal.
