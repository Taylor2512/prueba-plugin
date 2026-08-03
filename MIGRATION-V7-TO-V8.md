# Migración V7 → V8 Lean

## Replace after review

```txt
AGENTS.md
CLAUDE.md
CODEX.md
.github/copilot-instructions.md
.ai/START.md
.ai/ROUTER.md
```

## Add

Contracts, catalogs, indexes, scripts, canonical skills/agents and provider
adapters.

## Merge, never overwrite

```txt
SPRINT-CURRENT.md
CLAIMS.md
CURRENT.md
HANDOFF.md
decisions/risks existentes
```

## Deprecate for one version

Old routes, duplicate skill bodies, provider role copies, Backlog/Done
task-cards and selectors used as public hooks.

Run baseline, backup, V8 validators and provider drift before deleting anything.
