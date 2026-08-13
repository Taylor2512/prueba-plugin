# Codex — adaptador

La autoridad neutral es `AGENTS.md`. Después usa `.ai/START.md`,
`.ai/STATE-SOURCES.md`, la task-card vigente, una route y una skill.

- Usa el modelo/esfuerzo mínimo que pueda pasar los gates de la tarea.
- Evita writers concurrentes sobre los mismos paths.
- Guarda evidencia extensa en la ubicación declarada por la task-card.
- No cargues todos los skills, routes, task-cards, reportes o índices.
- Revalida worktree, branch, HEAD y diff antes de editar.
