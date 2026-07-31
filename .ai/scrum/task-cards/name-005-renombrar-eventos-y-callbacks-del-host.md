# NAME-005 — Renombrar eventos y callbacks del host

**Estado:** backlog  
**Owner sugerido:** runtime-architect  
**Riesgo:** medio  
**Dependencias:** NAME-001, NAME-002

## Objetivo

Sustituir canonical/legacy por domain event/host callback y conservar paridad.

## Alcance

Dispatcher, bridge, contracts, wrapper y tests.

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

- Una emisión.
- Callbacks onX compatibles.
- Diagnóstico host-callback-failed.

## Condición de parada

Detenerse si aparece un export público, valor persistido o dependencia de tercero no cubierto por la task-card.
