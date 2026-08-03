# Claude Code — adaptador V8

Fuente canónica: `AGENTS.md`, `.ai/START.md`, task-card, route y skill.

- Usa subagentes para exploración, documentación o logs extensos.
- Precarga como máximo una skill en cada subagente.
- La auto-memory de Claude es auxiliar; `.ai/memory` es la memoria compartida.
- Usa hooks para reglas deterministas, no para duplicar prompts.
- Revalida worktree, branch, base y diff al reanudar o compactar.
