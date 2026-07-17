# Contrato de exclusión para worktrees internos

## Ubicación canónica

```txt
.worktrees/merge
.worktrees/codex
.worktrees/claude
.worktrees/copilot
```

## Regla

`.worktrees/` es parte de la topología local, pero no del contenido lógico de `main`. Debe quedar excluido de Git, ripgrep, context packs, inventarios CSS, documentación consolidada, ESLint global, TypeScript broad includes, Tailwind content broad globs, Vitest discovery y Playwright artifact discovery.

## Visualización

Abrir `SISAD-PDFME-MULTIAGENT.code-workspace` permite ver main y cada worktree como raíz independiente sin navegar manualmente entre carpetas.

## Validación

```bash
./scripts/verify-embedded-worktree-isolation.sh
```
