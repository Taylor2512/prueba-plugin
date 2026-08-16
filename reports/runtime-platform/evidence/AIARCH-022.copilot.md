---
title: Partial evidence for AIARCH-022 — Migrar task-card a esquema
claim: copilot AIARCH-022
date: 2026-08-15
notes: Migration plan and discovery for task-card schema migration.
---

## Commands executed

- `rg "task-card|taskcard|task card|task-card" -n .ai src || true`
- `npx tsc --noEmit`
- `npm run lint --silent`

## Results summary

- Task-card schema locations identified; no edits applied.
- Typecheck and lint passed on current HEAD.

## Remaining work

- Implement schema migration and update ingestion scripts.

-- triaged by copilot
