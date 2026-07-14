# Done vs Pending

## Done protegido

Ver `ai/task-cards/completed/completed-summary.md`.

No cargar por defecto:

```txt
ai/task-cards/completed/**
reports/**
dist/**
test-results/**
.tailwind-migration-backups/**
unificados/**
```

## Pending activo

```txt
ai/task-cards/active/**
```

## Pending futuro

```txt
ai/task-cards/backlog/**
```

## Regla para agentes

Antes de implementar:

1. Leer `ai/start/START.md`.
2. Leer `ai/router/ROUTER.md`.
3. Leer `ai/router/CONTEXT_BUDGET.md`.
4. Leer `ai/memory/pending-checklist.md`.
5. Leer solo la task-card asignada.
6. Consultar `completed-summary.md` solo para no romper fixes previos.

No usar `completed/**` como fuente de tareas pendientes.
