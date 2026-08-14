---
id: NAME-012
status: BACKLOG
---

# NAME-012 — Retirar compatibilidad obsoleta

**Owner sugerido:** architect  
**Riesgo:** alto  
**Dependencias:** NAME-011

## Objetivo

Eliminar aliases y rutas anteriores cuya falta de uso esté demostrada.

## Alcance

Solo elementos aprobados tras auditoría de consumidores.

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

- Cero consumidores.
- Major/change policy respetada.
- Gates completos verdes.

## Condición de parada

Detenerse si aparece un export público, valor persistido o dependencia de tercero no cubierto por la task-card.
