# Agent registry

| Agent | Mode | Purpose |
|---|---|---|
| `coordinator` | read-only | Coordina WIP, claims, context manifests y evidence packets. |
| `explorer` | read-only | Investiga una pregunta y devuelve evidence packet sin editar. |
| `architect` | read-only | Decide contratos públicos, patterns, migrations y ADRs. |
| `implementer` | writer | Aplica una task-card acotada con test focal. |
| `reviewer` | read-only | Revisa diff, invariantes, riesgo y rollback. |
| `qa` | read-only | Diseña y ejecuta pruebas focales, destila logs. |
| `memory-steward` | docs-writer | Actualiza memoria por delta y ejecuta GC. |
| `traceability-steward` | docs-writer | Mantiene UC/BHV/EVT/FX/MTH/TSK/TST. |
| `token-steward` | read-only | Controla carga, compaction, subagentes y modelo. |
| `provider-adapter-steward` | docs-writer | Mantiene compatibilidad Codex/Claude/Copilot. |
| `runtime-architect` | writer | Runtime, controller, events, snapshot y artifacts. |
| `schema-specialist` | writer | Families, factories, inspector y runtime parity. |
| `canvas-specialist` | writer | Selection, geometry, Moveable, Selecto y routing. |
| `ux-designer` | writer | Responsive, sidebars, density, accessibility y visual QA. |
