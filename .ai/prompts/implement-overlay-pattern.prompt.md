# Prompt: Implement Overlay Pattern

## Objetivo

Estandariza overlays de canvas: toolbar, comments, inline edit, metrics, context menu y feedback.

## Contexto obligatorio

Lee antes de actuar:

- `AGENTS.md`
- `.ai/rules/global-rules.md`
- `.ai/context/project-overview.md`
- `.ai/context/code-map.md`
- Skill relacionado en `.ai/skills`

## Restricciones

- No acoplar `sisad-pdfme` a terceros.
- No crear variantes rígidas por caso de uso.
- No romper snapshot, schema identity, canvas geometry ni sidebars.
- No introducir CSS global invasivo.
- No hacer refactor masivo sin fases.

## Tareas

1. Identifica archivos afectados.
2. Explica el problema.
3. Propón plan incremental.
4. Implementa cambios mínimos.
5. Agrega o ajusta tests.
6. Actualiza documentación.
7. Entrega resumen con riesgos.

## Criterios de aceptación

- El cambio es configurable.
- El fork sigue aislado.
- Tests relevantes pasan o se explica por qué no se pudieron ejecutar.
- Documentación actualizada si cambió contrato.
