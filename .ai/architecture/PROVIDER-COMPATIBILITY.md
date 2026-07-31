# Compatibilidad Codex, Claude y GitHub Copilot

## Fuente común

`AGENTS.md`, task-cards, routes y `.agents/skills/`.

## Codex

- `AGENTS.md` jerárquico;
- skills por progressive disclosure;
- `.codex/config.toml` para compaction/permisos;
- subagentes solo para trabajo independiente.

## Claude

- `CLAUDE.md` delgado;
- `.claude/agents/` para subagentes;
- hooks para políticas deterministas;
- auto-memory auxiliar;
- `MEMORY.md` debe ser índice corto.

## Copilot

- `.github/copilot-instructions.md` repo-wide;
- `.github/instructions/*.instructions.md` con `applyTo`;
- `.github/agents/*.agent.md`;
- `.github/prompts/*.prompt.md`;
- `.agents/skills/` como origen portable.

## Drift

Los adapters no copian governance. El gate compara enlaces, IDs, comandos y
versiones contra la fuente común.
