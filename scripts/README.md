# Scripts IA y worktrees internos

- `apply-ai-architecture.sh`: instala la arquitectura.
- `validate-ai-architecture.py`: valida estructura documental.
- `bootstrap-ai-worktrees.sh`: crea `.worktrees/{merge,codex,claude,copilot}`.
- `migrate-sibling-worktrees-to-embedded.sh`: mueve worktrees antiguos registrados.
- `ai-worktree-status.sh`: muestra estado de main y agentes.
- `ai-worktree-diff.sh`: compara una rama con main.
- `ai-open-workspace.sh`: abre el workspace multi-root.
- `ai-sync-worktrees-after-gate.sh`: realinea ramas limpias después del gate.
- `verify-embedded-worktree-isolation.sh`: valida que `.worktrees` no contamine Git o contexto.
- `ai-context-ignore.json`: exclusiones para generadores.
