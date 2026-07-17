# Contexto — Worktree Coordination Context

## Foco
Ramas reutilizables, worktrees internos bajo `.worktrees/`, locks y handoffs externos, integration y fast-forward.

## Preguntas
- ¿Cuál es la fuente de verdad?
- ¿Qué identidad persiste?
- ¿Qué es actual y qué histórico?
- ¿Quién es owner?
- ¿Qué tests protegen el contrato?

## Riesgos
- Duplicar resolvers.
- Consumir internals.
- Cambiar metadata para arreglar UI.
- Ajustar tests sin contrato.
- Mezclar skin y geometría.

## Evidencia
Rutas exactas, reproducción, diff mínimo y resultado focal.
