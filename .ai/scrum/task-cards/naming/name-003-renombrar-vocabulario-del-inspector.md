---
id: NAME-003
status: BACKLOG
---

# NAME-003 — Renombrar vocabulario del inspector

**Owner sugerido:** inspector  
**Riesgo:** bajo  
**Dependencias:** NAME-001, NAME-002

## Objetivo

Eliminar `CanonicalDetailSection`, `LegacyDetailSection` y nombres derivados sin cambiar UI.

## Alcance

DetailView taxonomy, builders, imports y tests.

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

- Cero canonical/legacy en inspector.
- Secciones y visibilidad sin cambios.
- Tests del inspector verdes.

## Condición de parada

Detenerse si aparece un export público, valor persistido o dependencia de tercero no cubierto por la task-card.
