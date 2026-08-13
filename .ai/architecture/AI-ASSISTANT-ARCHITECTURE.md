# Arquitectura de asistentes IA

## Capas

```txt
L0 adapters
  AGENTS.md · CLAUDE.md · Copilot instructions · Codex adapter

L1 routing
  START · ROUTER · route manifests · task-card

L2 reusable capability
  skills · agents · subagents · playbooks · prompts

L3 project knowledge
  catalogs · registries · traceability · ADRs · source register

L4 operational state
  scrum · claims · current · handoff · evidence

L5 enforcement
  scripts · hooks · quality gates · evals
```

## Reglas

- instrucciones siempre cargadas: cortas;
- conocimiento grande: indexado y bajo demanda;
- una fuente por concepto;
- provider adapters son espejos delgados;
- estado operativo no se duplica en memoria;
- reportes generados no son memoria;
- scripts validan reglas mecánicas;
- prompts no reemplazan task-cards;
- skills encapsulan procesos repetibles;
- subagentes aíslan ruido, no distribuyen ownership ambiguo.
