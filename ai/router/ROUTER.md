# Router de tareas IA

## 1. Selección de dominio lógico

| Dominio | Agente lógico | Playbook | Rules | Context |
|---|---|---|---|---|
| Arquitectura IA | docs-architecture-agent | `pb-ai-docs-refactor.md` | `ai-docs-rules.md`, `global-rules.md` | `ai-docs-context.md` |
| Coordinación Git | docs-architecture-agent | `pb-worktree-multiagent.md` | `worktree-rules.md` | `worktree-coordination-context.md` |
| CSS/Tailwind | css-tailwind-agent | `pb-css-tailwind-migration.md` | `css-migration-rules.md` | `css-tailwind-context.md` |
| Canvas | canvas-agent | `pb-canvas-multipage.md` | `canvas-rules.md`, `moveable-selecto-rules.md` | `canvas-multipage-context.md` |
| Interacción | interaction-agent | `pb-selection-transform.md` | `moveable-selecto-rules.md`, `global-rules.md` | `selection-transform-context.md` |
| Inspector | inspector-agent | `pb-inspector.md` | `inspector-rules.md` | `inspector-context.md` |
| Schemas | schema-agent | `pb-schema-families.md` | `schema-rules.md` | `schema-families-context.md` |
| Snapshot | snapshot-agent | `pb-snapshot.md` | `snapshot-rules.md` | `snapshot-context.md` |
| Visual QA | visual-baseline-agent | `pb-visual-regression.md` | `css-migration-rules.md` | `visual-baseline-context.md` |
| Host lab | lab-shell-agent | playbook de task-card | `global-rules.md` | contexto de integración lab |

## 2. Selección de proveedor

La wave asigna el proveedor. Predisposición:

| Proveedor | Trabajo preferente |
|---|---|
| Codex | lógica pura, hooks, adapters, Canvas, interacción, resolvers, tests focales |
| Claude | arquitectura visual, inspector, composición, scroll, topbar, integración semántica |
| Copilot | host lab, LeftSidebar, lint, test infra, accesibilidad, cambios repetitivos acotados |

La predisposición no permite invadir ownership.

## 3. Prioridad de fuentes

1. `ai/coordination/worktrees/WAVE-<n>.md`
2. `ai/task-cards/active/**`
3. `ai/memory/pending-checklist.md`
4. `ai/task-cards/backlog/**` solo si se solicita
5. `completed-summary.md` como guardrail

## 4. Reglas

- No crear otra arquitectura fuera de `ai/**`, `docs/**`, `scripts/**` o `reports/**`.
- Documentación pública va en `docs/**`.
- Estado y memoria estable van en `ai/memory/**`.
- Coordinación viva va en la ruta externa declarada.
- Evidencia va en `ai/reports/**` o `reports/**`.
- CSS visual se migra a Tailwind en JSX/TSX.
- Geometría y terceros requieren task-card explícita.
