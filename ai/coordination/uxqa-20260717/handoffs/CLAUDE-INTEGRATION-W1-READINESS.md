# INTEGRACIÓN WAVE 1 — READINESS (integrador: CLAUDE)

Fecha: 2026-07-17 (supersede parcialmente a CLAUDE-INTEGRATION-W1-BLOCKED.md)

## Estado actual por rama (base = ai/uxqa-integration-20260717 @ 830b27f)

- ai/claude-uxqa-20260717 — LISTO
  - fa8221f (scroll single-owner). Owned-only. Lint focal OK.
- ai/copilot-uxqa-20260717 — LISTO
  - ab52464 (smoke tests) + 14ff144 (fix canónico labExamples.js:
    `cloneExample` desde `labs/builders/exampleTemplate`, que SÍ lo exporta —
    línea 156). Cambia solo owned paths (labExamples.js + 2 tests). Handoff
    COPILOT-wave1.md completo con ambos SHAs; build reportado exit 0.
- ai/codex-uxqa-20260717 — NO LISTO
  - Rama VACÍA (sin commits vs base). Falta W1-CODEX-P0-HOOKS real
    (SisadPdfmeForm.tsx + SchemaDropCommitFlash.tsx). CODEX-wave1.md sigue siendo
    el handoff inválido (describe el trabajo rogue en main, sin SHA).

## Checklist §7
- [x] main sin cambios productivos sueltos
- [ ] Codex en su worktree con commit hooks-only
- [x] Copilot ab52464 + fix canónico labExamples.js
- [x] Claude commit de scroll intacto
- [ ] tres handoffs completos (falta Codex válido)
- [~] cero intersecciones no autorizadas (0 entre ramas commiteadas hoy; se
      reverifica en el gate)
- [ ] gate Wave 1 en prueba-plugin-merge

## Bloqueo
ÚNICO pendiente: commit hooks-only de Codex + handoff válido con SHA.

## Plan de gate (cuando Codex entregue)
En prueba-plugin-merge:
1. Verificar ownership por rama:
   git diff --name-only ai/uxqa-integration-20260717..ai/codex-uxqa-20260717
   git diff --name-only ai/uxqa-integration-20260717..ai/copilot-uxqa-20260717
   git diff --name-only ai/uxqa-integration-20260717..ai/claude-uxqa-20260717
   Rechazar cualquier archivo fuera de ownership.
2. cherry-pick: Codex → ab52464 → 14ff144 → fa8221f (Claude).
3. Gate: npm run lint && npm run build && npx vitest run
4. Playwright focal:
   drag-preview-and-canvas-scroll-regression.spec.ts
   right-sidebar-detail-scroll.spec.ts
   right-sidebar-docs-tab.spec.ts
5. Sin modificar expected/snapshots. Fallos → clasificar por commit/owner.
