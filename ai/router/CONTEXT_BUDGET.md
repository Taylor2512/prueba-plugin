# Context Budget

## Objetivo

Evitar que los agentes carguen demasiado contexto y reabran tareas completadas.

## Carga base obligatoria por sesión

```txt
AGENTS.md o CLAUDE.md según proveedor
ai/start/START.md
ai/router/ROUTER.md
ai/router/TASK_INTAKE.md
ai/memory/project-memory.md
ai/memory/pending-checklist.md
ai/memory/known-risks.md
ai/memory/decisions.md
```

## Carga por tarea

Cargar solo:

```txt
ai/task-cards/active/<task>.md
ai/playbooks/<playbook-del-dominio>.md
ai/rules/<reglas-del-dominio>.md
ai/context/<contexto-del-dominio>.md
```

## Carga permitida como memoria histórica

```txt
ai/task-cards/completed/completed-summary.md
ai/memory/completed-checklist.md
```

## No cargar por defecto

```txt
ai/task-cards/completed/TASK-*.md
ai/archive/**
reports/**
dist/**
test-results/**
.tailwind-migration-backups/**
unificados/**
eslint_output.json
tsconfig.tsbuildinfo
```

## Presupuesto por pase

- Máximo 1 task-card activa.
- Máximo 2 consultas globales `rg` antes de abrir archivos.
- Máximo 8 archivos fuente abiertos.
- Máximo 5 archivos modificados.
- No modificar `pdf-lib`, `generator`, `Moveable`, `Selecto`, `snapshotAdapter` o geometría sin task-card explícita.
