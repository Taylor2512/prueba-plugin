# Playbook — Refactor de arquitectura IA/docs

## Objetivo

Modificar documentación o archivos IA respetando la estructura real del repositorio.

## Pasos

1. Leer `ai/start/START.md`.
2. Leer `ai/router/ROUTER.md`.
3. Leer `ai/router/CONTEXT_BUDGET.md`.
4. Leer `ai/memory/pending-checklist.md`.
5. Revisar `ai/task-cards/completed/completed-summary.md` solo como guardrail.
6. No crear carpetas nuevas fuera del árbol real.
7. Clasificar el cambio:
   - operativo IA -> `ai/**`
   - documentación pública -> `docs/**`
   - evidencia -> `ai/reports/**` o `reports/**`
   - script -> `scripts/**`
8. Actualizar memoria si cambia el estado de una tarea.

## Validación

- No hay carpetas paralelas.
- No se duplican docs públicas dentro de `ai/**`.
- No se duplican prompts operativos dentro de `docs/**`.
