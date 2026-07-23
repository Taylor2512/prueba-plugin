# AGENTS.md — reglas raíz

## Objetivo

Trabaja con cambios pequeños, verificables y reversibles. Conserva el comportamiento público de SISAD PDFME y reduce duplicidad real sin esconderla con exclusiones injustificadas.

## Antes de editar

1. Lee `.ai/START.md` y la task-card activa.
2. Lee el `AGENTS.md` más cercano a los archivos objetivo.
3. Confirma `git status --short`; no sobrescribas cambios ajenos.
4. Clasifica la tarea con `.ai/MODEL-ROUTER.md` y `.ai/DUPLICATION-POLICY.md`.
5. Define archivos permitidos, invariantes y comandos de cierre.

## Límites

- Un solo agente escribe por task-card y worktree.
- No modifiques `src/sisad-pdfme/pdf-lib` salvo tarea explícita de vendor.
- No cambies Moveable, Selecto, geometría, snapshot o generator como efecto colateral.
- No elimines APIs públicas solo porque Knip las marque como no usadas.
- No introduzcas wrappers, hooks, factories o services que solo renombren una llamada.
- No marques una tarea como terminada sin ejecutar gates focales.

## Entrega

Reporta: objetivo, archivos modificados, patrón aplicado, duplicidad eliminada, validaciones, riesgos y delta de memoria. Actualiza la task-card; solo modifica memoria durable cuando cambie una decisión, riesgo, métrica o estado estable.
