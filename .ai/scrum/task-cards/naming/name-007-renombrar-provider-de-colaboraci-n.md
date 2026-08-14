---
id: NAME-007
status: BACKLOG
---

# NAME-007 — Renombrar provider de colaboración

**Owner sugerido:** collaboration-specialist  
**Riesgo:** alto  
**Dependencias:** NAME-004

## Objetivo

Cambiar provider `legacy` por `websocket` con migración de entrada.

## Alcance

Collaboration adapter, config migration, types, docs y tests.

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

- WebSocket/Yjs sin regresión.
- Alias anterior solo en migrator.
- Salida usa websocket.

## Condición de parada

Detenerse si aparece un export público, valor persistido o dependencia de tercero no cubierto por la task-card.
