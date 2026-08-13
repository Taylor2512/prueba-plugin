# Claude Code — adaptador

La autoridad neutral es `AGENTS.md`. Después usa `.ai/START.md`,
`.ai/STATE-SOURCES.md`, la task-card vigente, una route y una skill.

- Los subagentes sirven para trabajo independiente o contexto ruidoso.
- Precarga como máximo una skill principal por subagente.
- La auto-memory del proveedor es auxiliar; no sustituye las fuentes del repositorio.
- Hooks pueden imponer reglas deterministas, no duplicar governance.
- Revalida worktree, branch, HEAD y diff al reanudar o compactar.
