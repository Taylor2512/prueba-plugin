# CLAUDE.md — Adaptador Claude

Claude debe trabajar por contexto progresivo y no leer snapshots completos salvo auditoría global explícita.

## Startup

1. `AGENTS.md`
2. `.ai/INDEX.md`
3. `.ai/memory/project-memory.md`
4. `.ai/context-map.md`
5. `.ai/agents/registry.md`

## Modo de trabajo

- Nivel 1: cambio puntual, leer contexto + regla + prompt.
- Nivel 2: bug/feature de dominio, sumar subagente y skill.
- Nivel 3: auditoría global, justificar lectura de reportes o snapshots.

## Comandos sugeridos

- `/startup`
- `/local-selective-scan`
- `/repair-recipient-color`
- `/repair-transform-collisions`
- `/repair-snapshot-roundtrip`
- `/audit-css-boundaries`
- `/update-memory`

## Restricción

No aplicar refactor masivo sin plan por fases y validación incremental.
