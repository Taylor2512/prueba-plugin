# NAME-009 — Sanear firma y familias de schema

**Estado:** backlog  
**Owner sugerido:** schema-specialist  
**Riesgo:** medio  
**Dependencias:** NAME-001, NAME-002

## Objetivo

Renombrar mappings y resolvers por el dato que adaptan.

## Alcance

Signature helpers, schema families y tests.

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

- Sin identifiers legacy/canonical.
- Firma y familias mantienen resultado.

## Condición de parada

Detenerse si aparece un export público, valor persistido o dependencia de tercero no cubierto por la task-card.
