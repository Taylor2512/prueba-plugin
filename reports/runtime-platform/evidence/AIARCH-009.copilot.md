---
title: Partial evidence for AIARCH-009 — Adoptar IDs de trazabilidad
claim: copilot AIARCH-009
date: 2026-08-15
notes: Inventory of traceability ID schemes and initial checks.
---

## Commands executed

- `rg "trace|ID|UC|BHV|EVT" -n .ai src || true`
- `npx tsc --noEmit`
- `npm run lint --silent`

## Results summary

- Candidate ID patterns located; no product edits performed.
- Typecheck and lint passed on current HEAD.

## Remaining work

- Define canonical ID format and update registries.

-- triaged by copilot
