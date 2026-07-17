# Context Budget

## Carga base

```txt
adaptador del proveedor
ai/start/START.md
ai/project/worktree-topology.md
ai/router/ROUTER.md
ai/router/TASK_INTAKE.md
ai/memory/project-memory.md
ai/memory/known-risks.md
ai/memory/decisions.md
```

## Carga por wave

```txt
ai/coordination/worktrees/WAVE-<n>.md
ai/task-cards/active/<task>.md
ai/playbooks/<playbook>.md
ai/rules/<rules>.md
ai/context/<context>.md
```

## Presupuesto

- 1 task-card.
- 1 agente lógico.
- 2 consultas globales `rg`.
- 8 archivos fuente abiertos.
- 5 archivos productivos por commit.
- Tests directos adicionales permitidos.
- 1 handoff por task-card.

## No cargar por defecto

```txt
ai/task-cards/completed/TASK-*.md
ai/coordination/uxqa-20260717/**
reports/**
unificados/**
dist/**
test-results/**
node_modules/**
.tailwind-migration-backups/**
```

## Excepciones

`pdf-lib`, generator, Moveable, Selecto, snapshotAdapter, `runtimeStyles.ts`, configs y geometría exigen task-card explícita y ownership exclusivo.

## Parada

Detenerse cuando:

- aparece una dependencia fuera de owned paths;
- una prueba falla en otro dominio;
- hacen falta más de 5 archivos productivos;
- la task-card exige otra auditoría global;
- el worktree no está limpio antes del commit;
- el provider está en una rama incorrecta.
