# CLAUDE.md — adaptador ligero

La fuente canónica de reglas es `AGENTS.md` y `.ai/`. No dupliques esas instrucciones aquí.

Al comenzar:

1. Lee `.ai/START.md`.
2. Selecciona una task-card en `.ai/scrum/task-cards/`.
3. Para exploración amplia usa un subagente read-only; para implementación conserva un único escritor.
4. Carga una skill de `.agents/skills/` solo cuando su descripción coincida con la tarea.
5. Mantén el análisis acotado: evidencia primero, parche mínimo, gates focales, memoria por delta.

No uses loops autónomos abiertos. Detente cuando se cumpla la Definition of Done o cuando el bloqueo requiera una nueva task-card.
