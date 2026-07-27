# Claude Code — Adaptador del repositorio

La fuente de verdad es `AGENTS.md` y `.ai/`. Este archivo no duplica playbooks.

## Uso

- Carga skills bajo demanda desde `.agents/skills/`.
- Usa subagentes solo para investigaciones independientes y con herramientas restringidas.
- Mantén un solo subagente escritor por worktree.
- Usa hooks deterministas para bloquear acciones prohibidas; no dependas de un prompt para reglas mecánicas.
- La memoria automática de Claude es auxiliar. La memoria durable del proyecto vive en `.ai/memory/`.
- Al compactar o reanudar, valida la task-card, el commit base y el estado real del working tree.
