# NAME-010 — Renombrar documentación y arquitectura IA

**Estado:** backlog  
**Owner sugerido:** documentation  
**Riesgo:** bajo  
**Dependencias:** NAME-003, NAME-004, NAME-005

## Objetivo

Actualizar archivos activos, links, skills, task-cards e índices sin reescribir historia.

## Alcance

Docs, `.ai`, `.agents`, `.github` y manifests activos.

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

- Links válidos.
- Sin archivos activos canonicalize/legacy ambiguos.
- Cero instrucciones duplicadas.

## Condición de parada

Detenerse si aparece un export público, valor persistido o dependencia de tercero no cubierto por la task-card.
