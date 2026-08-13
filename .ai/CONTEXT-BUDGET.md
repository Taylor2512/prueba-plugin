# Presupuesto de contexto

## Niveles

| Nivel | Contenido | Límite |
|---|---|---:|
| L0 boot | AGENTS + sprint + task + route | 2.5k tokens / 4 archivos |
| L1 diagnóstico | símbolos, tests y evidence packets | 12k / 8 archivos |
| L2 diseño | ADR/policy focal | 10k / 4 referencias |
| L3 implementación | diff + archivos productivos | 28k / 5 archivos |
| L4 validación | salidas destiladas | 12k |
| cierre | handoff + memory delta | 4k |

Contexto activo objetivo: ≤40k. Techo operativo: 64k salvo task-card `size: L`.

## Skill budget

- nombre ≤64 caracteres;
- descripción ≤160 caracteres;
- `SKILL.md` ideal ≤4 KB;
- referencias grandes bajo `references/`;
- no precargar más de dos skills;
- aliases no duplican contenido.

## Subagent budget

- máximo dos readers;
- salida ≤1.200 tokens;
- logs crudos guardados como evidencia;
- no delegar una tarea que cuesta menos que describirla;
- no equipos multiagente por defecto.

## Marcas de agua

- 50%: resumir búsqueda y fijar hipótesis;
- 65%: crear `CONTEXT-CHECKPOINT`;
- 75%: detener exploración;
- 85%: handoff/sesión nueva, sin nuevos cambios.

## Prohibido

Archivos consolidados, conversaciones completas, todos los skills, todos los
task-cards, logs >100 líneas, coverage/vendor/backups y memoria histórica
completa.
