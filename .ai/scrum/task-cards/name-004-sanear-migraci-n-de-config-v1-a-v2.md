# NAME-004 — Sanear migración de Config V1 a V2

**Estado:** backlog  
**Owner sugerido:** runtime-architect  
**Riesgo:** medio  
**Dependencias:** NAME-001, NAME-002

## Objetivo

Nombrar source/target y rutas deprecadas con precisión; mantener una única config runtime.

## Alcance

Config migration, validation, resolver y tests.

## No alcance

- No modificar Canvas, Moveable, Selecto ni geometría.
- No reescribir reportes históricos.
- No hacer reemplazo global.
- No eliminar compatibilidad pública sin evidencia.

## Evidencia requerida

- Baseline antes/después.
- Archivos modificados.
- Renames y aliases.
- Tests ejecutados.
- Riesgos y pendientes.

## Criterios de aceptación

- No mutación.
- Config v2 preserva precedencia.
- Aliases solo viven en migrator.

## Condición de parada

Detenerse si aparece un export público, valor persistido o dependencia de tercero no cubierto por la task-card.
