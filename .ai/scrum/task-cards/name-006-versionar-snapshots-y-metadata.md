# NAME-006 — Versionar snapshots y metadata

**Estado:** backlog  
**Owner sugerido:** snapshot-specialist  
**Riesgo:** alto  
**Dependencias:** NAME-001, NAME-002

## Objetivo

Reemplazar legacy por preV2/V1/V2 y aislar migraciones en el borde.

## Alcance

Snapshot, adapter, schema migration, meta, fixtures y tests.

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

- Round-trip actual.
- Import antiguo.
- Aliases públicos deprecados.

## Condición de parada

Detenerse si aparece un export público, valor persistido o dependencia de tercero no cubierto por la task-card.
