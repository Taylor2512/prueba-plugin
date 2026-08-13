# Arquitectura de asistentes IA

## Capas

```text
L0 entrypoints
  AGENTS.md · CLAUDE.md · CODEX.md · Copilot instructions

L1 execution routing
  START · STATE-SOURCES · ROUTER · active task

L2 reusable capability
  routes · skills · agents · playbooks · prompts

L3 durable knowledge
  brain · contracts · decisions · memory topics · knowledge

L4 operational state
  campaign ledger · task-cards · active pointer · handoff · evidence

L5 generated lookup
  indexes · context packs · reports

L6 enforcement
  scripts · hooks · quality gates · evals
```

## Reglas

- una fuente vigente por concepto;
- una ruta que no existe no es autoridad;
- adapters de proveedor son espejos delgados;
- estado operativo no se duplica en memoria durable;
- reportes e índices generados no son memoria;
- Git conserva el versionamiento: los paths usan nombres semánticos estables;
- scripts validan reglas mecánicas;
- prompts no reemplazan task-cards;
- subagentes aíslan ruido y no crean ownership ambiguo.
