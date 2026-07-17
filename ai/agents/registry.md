# Agent Registry

## Agentes lógicos

- `designer-runtime-agent.md`: Designer, Paper, Renderer, runtime y configuración.
- `canvas-agent.md`: multipágina, paper registry, scroll, grilla, rulers y overlays.
- `interaction-agent.md`: Moveable, Selecto, shortcuts, selección, drag/resize/rotate y hit-testing.
- `css-tailwind-agent.md`: Tailwind-first, tokens y CSS técnico residual.
- `visual-baseline-agent.md`: baseline visual y regresión.
- `schema-agent.md`: familias, options, signing, actions, media, tables y valores.
- `inspector-agent.md`: DetailView, ListView, rails y widgets.
- `snapshot-agent.md`: roundtrip, metadata, import/export y migraciones.
- `lab-shell-agent.md`: `src/features/pdfcomponent/**`.
- `docs-architecture-agent.md`: arquitectura `ai/**`, memoria, reglas y task-cards.

## Proveedores ejecutores

| Proveedor | Worktree | Rama |
|---|---|---|
| Codex | `prueba-plugin-codex` | `ai/codex` |
| Claude | `prueba-plugin-claude` | `ai/claude` |
| Copilot | `prueba-plugin-copilot` | `ai/copilot` |

Un proveedor no es dueño permanente de un dominio. La wave asigna una task-card y un agente lógico.

## Integrador

```txt
worktree: prueba-plugin-merge
branch: ai/integration
```

El integrador no implementa trabajo de las ramas mientras el gate está abierto.
