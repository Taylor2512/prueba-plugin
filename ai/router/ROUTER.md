# Router de tareas IA

## Prioridad de fuentes

1. `ai/task-cards/active/**`
2. `ai/task-cards/backlog/**` solo si el usuario lo solicita o si una active lo referencia.
3. `ai/memory/pending-checklist.md`
4. `ai/task-cards/completed/completed-summary.md` solo como guardrail de no regresión.

## Rutas por dominio

| Dominio | Agente | Playbook | Rules | Context |
|---|---|---|---|---|
| Arquitectura IA | `docs-architecture-agent` | `pb-ai-docs-refactor.md` | `ai-docs-rules.md`, `global-rules.md` | `ai-docs-context.md` |
| CSS/Tailwind | `css-tailwind-agent` | `pb-css-tailwind-migration.md` | `css-migration-rules.md` | `css-tailwind-context.md` |
| Canvas | `canvas-agent` | `pb-canvas-multipage.md` | `canvas-rules.md`, `moveable-selecto-rules.md` | `canvas-multipage-context.md` |
| Interacción | `interaction-agent` | `pb-selection-transform.md` | `moveable-selecto-rules.md`, `global-rules.md` | `selection-transform-context.md` |
| Inspector | `inspector-agent` | `pb-inspector.md` | `inspector-rules.md` | `inspector-context.md` |
| Schemas | `schema-agent` | `pb-schema-families.md` | `schema-rules.md` | `schema-families-context.md` |
| Snapshot | `snapshot-agent` | `pb-snapshot.md` | `snapshot-rules.md` | `snapshot-context.md` |
| Visual QA | `visual-baseline-agent` | `pb-visual-regression.md` | `css-migration-rules.md` | `visual-baseline-context.md` |

## Reglas de enrutamiento

- Si una tarea menciona carpetas IA, no crear carpetas nuevas fuera de `ai/**`, `docs/**`, `scripts/**` o `reports/**`.
- Si una tarea menciona documentación pública, escribir en `docs/**`.
- Si una tarea menciona memoria, estado, handoff o pendientes, escribir en `ai/memory/**`.
- Si una tarea menciona prompts o agentes, escribir en `ai/prompts/**`, `ai/agents/**`, `ai/subagents/**`, `ai/skills/**`, `ai/playbooks/**` o `ai/rules/**`.
- Si una tarea menciona evidencias, escribir en `ai/reports/**` o `reports/**` según corresponda.
- Si una tarea menciona CSS, primero revisar `reports/tailwind-migration/**` y luego modificar `src/**`.
