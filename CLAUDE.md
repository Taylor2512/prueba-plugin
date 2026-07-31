# Claude Code — adaptador delgado

Fuente canónica: `AGENTS.md` y `.ai/`.

- Carga una sola task-card, ruta y skill.
- Usa subagentes para exploración/logs que contaminarían el contexto principal.
- No uses agent teams por defecto: su coste es sustancialmente mayor.
- La memoria automática de Claude es auxiliar; `.ai/memory/` es la memoria
  durable compartida.
- Usa hooks para políticas mecánicas, no prompts largos.
- Revalida rama, worktree, commit base y diff tras compactar o reanudar.
