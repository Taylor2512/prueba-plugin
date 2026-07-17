# Contexto — Coordinación multiagente con worktrees

## Objetivo

Permitir trabajo paralelo local sin exponer `main` a cambios parciales.

## Entidades

```txt
main
ai/integration
ai/codex
ai/claude
ai/copilot
```

## Contrato

- Cada agente trabaja en su branch/worktree.
- Cada task-card tiene owned paths.
- Los agentes crean commits atómicos.
- Los handoffs viven en una ruta externa compartida.
- El integrador aplica SHAs aceptados.
- El gate se ejecuta solo en `ai/integration`.
- `main` avanza por fast-forward.

## Problema que evita

- agentes editando `main`;
- ramas vacías mientras el trabajo queda suelto;
- coordinación no visible entre worktrees;
- commits con archivos ajenos;
- merges de ramas completas;
- conflictos difíciles de aislar;
- pruebas globales ejecutadas sobre estados parciales.

## Estado actual

La primera consolidación post-Tailwind ya llegó a `main`. La siguiente etapa es Wave 1.5 para estabilizar contratos y tests antes del polish visual.
