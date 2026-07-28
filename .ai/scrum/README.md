# Scrum ligero para agentes

## Artefactos

- `PRODUCT-BACKLOG.md`: backlog canónico priorizado.
- `ACTIVE.md`: tareas activas y en revisión, generadas desde `SPRINT-CURRENT.md`.
- `COMPLETED.md`: tareas cerradas, generadas desde `SPRINT-CURRENT.md`.
- `BOARD.md`: panel operativo corto.
- `CLAIMS.md`: leases vivas de escritura y lectura.
- `SPRINT-CURRENT.md`: fuente única de estado, owner, modelo y worktree.
- Task-card: alcance técnico, ownership y aceptación.
- `RETROSPECTIVE.md`: aprendizaje del sprint.

## Arquitectura multi-asistente

Scrum separa cuatro responsabilidades para evitar colisiones:

- `Backlog` define qué existe y qué se prioriza.
- `Active` muestra lo que está en curso o en revisión.
- `Board` resume el estado operativo en una vista corta.
- `Claims` registra quién escribe, en qué worktree y sobre qué archivos.
- `Completed` consolida lo ya cerrado.
- `Sprint` consolida el estado canónico y la evidencia durable.

La tarea siempre vive en una task-card; el claim vive en `CLAIMS.md`; el estado vive en `SPRINT-CURRENT.md`.
`ACTIVE.md` y `COMPLETED.md` se regeneran con `npm run maintenance:sync-scrum-views`.

## Roles

- `Coordinator`: asigna writer, readers y reviewer.
- `Writer`: único escritor por task-card.
- `Reader`: hasta dos lectores read-only por task-card.
- `Reviewer`: valida el diff sin editar.
- `Memory Steward`: consolida deltas durables.

## Flujo

Backlog → Ready → Claimed → In Progress → Review → Done / Blocked.

## Reglas de paralelismo

- Un writer por task-card.
- Un worktree por writer.
- Dos readers read-only como máximo por task-card.
- Dos writers nunca comparten archivos ni fronteras protegidas.
- Si dos tareas chocan en la misma frontera, se serializan o se dividen antes de editar.
- `CLAIMS.md` se actualiza antes del primer parche y al liberar la tarea.
- `SPRINT-CURRENT.md` sigue siendo la fuente de verdad del estado.

## Límites

- WIP total: 3.
- Un agente write por task.
- Un worktree por task write.
- Review separado para tareas L.
