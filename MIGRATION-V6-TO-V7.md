# Migración V6 → V7

## Replace after review

```txt
AGENTS.md
CLAUDE.md
.github/copilot-instructions.md
.ai/START.md
.ai/ROUTER.md
.ai/CONTEXT-BUDGET.md
.ai/CONTEXT-POLICY.md
.ai/MODEL-ROUTER.md
.ai/ORCHESTRATION.md
.ai/OBSERVABILITY.md
```

## Merge, never replace blindly

```txt
.ai/scrum/SPRINT-CURRENT.md
.ai/scrum/PRODUCT-BACKLOG.md
.ai/scrum/CLAIMS.md
.ai/memory/CURRENT.md
.ai/memory/HANDOFF.md
.ai/memory/DECISIONS.md
.ai/memory/RISKS.md
```

## Deprecations

- `.ai/tasks/ACTIVE.md` → `.ai/scrum/SPRINT-CURRENT.md`
- duplicate DRY skill alias → canonical `sisad-dry-refactor`
- duplicate orchestration alias → canonical `sisad-task-orchestration`

Conservar aliases durante una versión y registrar consumidores antes de borrar.
