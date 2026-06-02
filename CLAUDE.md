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

## Para schemas estándar y grupos

Usar:

1. `.ai/context/standard-fields-groups-context.md`
2. `.ai/rules/standard-fields-group-contract-rules.md`
3. `.ai/prompts/harden-standard-fields-groups.prompt.md`
4. Si afecta UI minimalista: `.ai/skills/docusign-wix-minimal-ux/SKILL.md`
5. Si afecta tests: `.ai/skills/standard-fields-regression-testing/SKILL.md`

## Comandos sugeridos

- `/startup`
- `/local-selective-scan`
- `/harden-standard-fields-groups`
- `/repair-checkboxgroup-flow`
- `/repair-snapshot-roundtrip`
- `/audit-css-boundaries`
- `/update-memory`

## Restricción

No aplicar refactor masivo sin plan por fases y validación incremental. No reescribir coordenadas/collision si no hay test que demuestre fallo real.
