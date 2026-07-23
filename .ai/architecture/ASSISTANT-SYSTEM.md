# Arquitectura del sistema de asistentes

```text
Usuario / Product Owner
        │
        ▼
Coordinator ── Scrum board + task-card + model router
        │
        ├─ Explorer / DRY Auditor (read-only)
        ├─ Architect (read-only, decisiones)
        ├─ Implementer (worktree, write)
        ├─ Specialist (canvas/schema/snapshot, solo si aplica)
        └─ QA Reviewer (read-only, evidencia)
        │
        ▼
Memory Curator ── delta durable + métricas + handoff
```

## Separación de responsabilidades

- Coordinator no programa; define scope, dependencias y WIP.
- Explorer no modifica; devuelve mapa de archivos y evidencia.
- Architect elige patrón y frontera; no crea parches.
- Implementer trabaja en una task-card y un worktree.
- QA valida comportamiento y regresiones; no arregla silenciosamente.
- Memory Curator conserva decisiones y estado, no logs.

## Paralelismo

- Máximo tres agentes activos por epic.
- Solo tareas independientes usan worktrees paralelos.
- Un archivo no tiene dos agentes write simultáneos.
- El Coordinator sintetiza resultados; los subagentes no se encadenan indefinidamente.
