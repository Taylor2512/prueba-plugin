# Compatibilidad de proveedores

## Fuente común

`AGENTS.md`, `.ai/START.md`, `.ai/STATE-SOURCES.md`, task-cards, routes y
`.agents/skills/`.

## Codex

- usa `AGENTS.md` jerárquico;
- progressive disclosure para skills;
- configuración específica del proveedor es opcional y no se asume presente;
- subagentes solo para trabajo independiente.

## Claude

- `CLAUDE.md` delgado;
- `.claude/agents/` para perfiles especializados;
- hooks para políticas deterministas;
- auto-memory auxiliar.

## GitHub Copilot

- `.github/copilot-instructions.md` repo-wide;
- `.github/instructions/*.instructions.md`;
- `.github/agents/*.agent.md`;
- `.github/prompts/*.prompt.md`;
- `.agents/skills/` como capability portable.

## Drift

Los adapters no copian governance. El gate valida que sigan apuntando a la
autoridad neutral y que no creen reglas funcionales divergentes.

<!-- SISAD-PDFME-CONSOLIDATION:.ai/architecture/PROVIDER-COMPATIBILITY.md:START -->
## Same-branch execution policy

This project intentionally does not use worktrees for Claude/Codex/Copilot concurrency.

All provider adapters must enforce:
- exact file claims;
- no overlapping writers;
- one integrator lease;
- no destructive Git;
- shared Brain and skills.

Model selection is task-profile based; see `.ai/providers/MODEL-ROUTING.json`.
<!-- SISAD-PDFME-CONSOLIDATION:.ai/architecture/PROVIDER-COMPATIBILITY.md:END -->
