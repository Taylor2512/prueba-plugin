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
| RESTORE-011 | runtime-architect | codex | none | main | `src/sisad-pdfme/integration/normalizeHostData.ts`, `src/sisad-pdfme/adapters/index.ts`, `src/sisad-pdfme/integration/index.ts`, `src/sisad-pdfme/examples/exampleBuilder.ts`, `src/sisad-pdfme/examples/index.ts`, `src/features/pdfcomponent/integration/normalizeLabHostData.ts`, `src/features/pdfcomponent/integration/createLabPdfmeConfig.ts`, `src/features/pdfcomponent/hooks/usePdfmeLabIntegration.ts`, `src/features/pdfcomponent/labs/builders/exampleTemplate.ts`, `src/features/pdfcomponent/labs/export/buildExampleBundle.ts`, `tests/unit/features/pdfcomponent/labs/builders.test.ts` | active | in_progress | 2026-07-31 | generalize host data composition into core integration, extract reusable example builder, and align legacy consumers |
