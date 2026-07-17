# Router

| Dominio | Agente | Context | Rules | Playbook |
|---|---|---|---|---|
| IA docs | docs-architecture-agent | ai-docs-context | ai-docs-rules | pb-ai-docs-refactor |
| Git/worktrees | integration-agent | worktree-coordination-context | worktree-rules | pb-worktree-multiagent |
| Tests | test-infrastructure-agent | testing-context | testing-rules | pb-test-stabilization |
| Tailwind | css-tailwind-agent | css-tailwind-context | css-migration-rules | pb-css-tailwind-migration |
| Canvas | canvas-agent | canvas-multipage-context | canvas-rules | pb-canvas-multipage |
| Interacción | interaction-agent | selection-transform-context | moveable-selecto-rules | pb-selection-transform |
| Inspector | inspector-agent | inspector-context | inspector-rules | pb-inspector |
| Schemas | schema-agent | schema-families-context | schema-rules | pb-schema-families |
| Snapshot | snapshot-agent | snapshot-context | snapshot-rules | pb-snapshot |
| Runtime | designer-runtime-agent | runtime-config-context | global-rules | pb-runtime-integration |
| Lab | lab-shell-agent | lab-host-context | global-rules | pb-lab-host |
| Visual | visual-baseline-agent | visual-baseline-context | visual-regression-rules | pb-visual-regression |
| A11y | accessibility-agent | accessibility-context | accessibility-rules | pb-accessibility |

## Preferencias de proveedor

- Codex: core, hooks, adapters, Canvas e interacción.
- Claude: inspector, composición, scroll y topbar.
- Copilot: host lab, LeftSidebar, test infra y accesibilidad.

Prioridad: wave → task active → pending → backlog autorizado → completed como guardrail.
