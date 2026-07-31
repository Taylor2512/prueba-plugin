# NAME-001 — Inventariar y clasificar ocurrencias

**Estado:** backlog  
**Owner sugerido:** explorer  
**Riesgo:** bajo  
**Dependencias:** ninguna

## Objetivo

Crear el inventario exhaustivo y clasificar cada coincidencia antes de editar código.

## Alcance

`src`, `tests`, `docs`, `.ai`, `.agents`, `.github`, `scripts`.

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

- Inventario completo.
- Impacto público/persistido identificado.
- Rename map inicial.

## Condición de parada

Detenerse si aparece un export público, valor persistido o dependencia de tercero no cubierto por la task-card.
