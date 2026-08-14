---
id: NAME-008
status: BACKLOG
---

# NAME-008 — Sanear almacenamiento de comentarios

**Owner sugerido:** comments-specialist  
**Riesgo:** medio  
**Dependencias:** NAME-006

## Objetivo

Convertir `__commentAnchors` en alias versionado de entrada y usar una representación runtime.

## Alcance

Common comments, contracts, snapshot tests.

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

- Lectura anterior.
- Escritura actual.
- Attach/detach y count correctos.

## Condición de parada

Detenerse si aparece un export público, valor persistido o dependencia de tercero no cubierto por la task-card.
