# Claims

Ledger vivo de escrituras concurrentes.

## Propósito

Registrar el writer activo, su worktree y su alcance para evitar solapamiento entre asistentes.

## Reglas

- Una fila se abre antes del primer parche.
- Una fila representa un solo writer y un solo worktree.
- Los readers son read-only y se limitan a dos por task-card.
- Si cambia el worktree o el writer, la fila anterior se cierra y se crea una nueva.
- La fila se libera cuando la tarea pasa a `Review`, `Done` o `Blocked`.
- Este archivo no es historial durable; los resultados finales viven en la task-card, `SPRINT-CURRENT.md` y `RETROSPECTIVE.md`.

## Tabla

| Task | Owner | Writer | Readers | Worktree | Scope | Lease | State | Updated | Notes |
|---|---|---|---|---|---|---|---|---|---|
