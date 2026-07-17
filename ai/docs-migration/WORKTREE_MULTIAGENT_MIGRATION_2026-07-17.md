# Migración documental — Modelo multiagente con worktrees

## Motivo

La primera ejecución multiagente demostró que la separación por ramas era correcta, pero faltaban:

- verificación obligatoria de carpeta/rama;
- coordinación externa compartida;
- separación entre implementador e integrador;
- ownership por wave;
- ramas reutilizables;
- publicación fast-forward.

## Cambios

Se añadieron:

```txt
project/worktree-topology.md
project/git-operating-model.md
rules/worktree-rules.md
context/worktree-coordination-context.md
playbooks/pb-worktree-multiagent.md
coordination/worktrees/**
start/QUICKSTART-INTEGRATOR.md
```

Se actualizaron adaptadores, router, quickstarts, ownership, memoria y task-cards.

## Compatibilidad

- `docs/**` permanece sin cambios.
- Los agentes lógicos existentes se conservan.
- Las task-cards históricas se conservan.
- `ai/coordination/uxqa-20260717/**` se mantiene como evidencia.
- No se eliminan prompts antiguos; quedan marcados como históricos.

## Nuevo flujo

```txt
branch de agente
→ commits atómicos
→ handoff externo
→ ai/integration
→ gate
→ main fast-forward
→ realineación controlada
```
