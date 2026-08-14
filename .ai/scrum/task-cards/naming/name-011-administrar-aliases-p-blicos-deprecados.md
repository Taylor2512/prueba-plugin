---
id: NAME-011
status: BACKLOG
---

# NAME-011 — Administrar aliases públicos deprecados

**Owner sugerido:** public-api-reviewer  
**Riesgo:** alto  
**Dependencias:** NAME-004, NAME-005, NAME-006, NAME-007

## Objetivo

Conservar solo aliases necesarios con ventana y guía de migración.

## Alcance

Entrypoints, exports, changelog, migration guide y tests.

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

- Cada alias tiene @deprecated/removeAfter.
- API vieja y nueva probadas.
- Lista para próxima major.

## Condición de parada

Detenerse si aparece un export público, valor persistido o dependencia de tercero no cubierto por la task-card.
