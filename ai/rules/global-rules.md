# Reglas globales

- `src/sisad-pdfme` es portable y no conoce hosts externos.
- Prohibido importar desde `src/features` o `src/modules` dentro de `src/sisad-pdfme`.
- Prohibido crear carpetas paralelas fuera de la arquitectura real del repo.
- Prohibido tratar `ai/task-cards/completed/TASK-*.md` como pendiente.
- Prohibido cargar `reports/**`, `dist/**`, `test-results/**`, `.tailwind-migration-backups/**` y `unificados/**` como contexto activo por defecto.
- No tocar `pdf-lib`, `generator`, `Moveable`, `Selecto`, snapshot o geometría sin task-card explícita.
- Cualquier regresión de una tarea completada debe tener una nueva task-card de regression/continuity.
