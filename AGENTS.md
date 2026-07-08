# AGENTS.md — Adaptador delgado

Este archivo existe para herramientas que leen `AGENTS.md` por defecto.

No contiene documentación del componente ni instrucciones largas. La fuente de verdad para asistentes IA está en:

```txt
ai/start/START.md
ai/router/ROUTER.md
ai/router/CONTEXT_BUDGET.md
ai/memory/project-memory.md
```

## Regla obligatoria

Antes de modificar código, un agente debe:

1. Leer `ai/start/START.md`.
2. Seguir `ai/router/ROUTER.md`.
3. Respetar `ai/router/CONTEXT_BUDGET.md`.
4. Seleccionar exactamente una task-card.
5. Cargar solo el contexto/rules/playbook indicado.

## No usar `docs/` para instrucciones de agentes

`docs/` documenta el componente `sisad-pdfme`. No debe contener agentes, prompts, task-cards ni memoria de IA.
