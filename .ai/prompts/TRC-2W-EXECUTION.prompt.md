# TRC-2W-EXECUTION.prompt.md

Execute the two-week READY TRC plan in strict order with evidence-first status handling.

## Source of truth

- .ai/scrum/views/TRC-READY-2W.md
- .ai/scrum/views/TEMPLATE-RUNTIME-CONTRACT.md
- target card under .ai/scrum/task-cards/template-runtime-contract/

## Hard rules

- Do not skip TRC-001.
- Reconcile overlap with QH/PRT/RTP before each card.
- If overlap is exact, extend existing card authority and link TRC trace.
- No parallel authorities for config/registry/snapshot/runtime-access.

## Execution loop per card

1. Read card acceptance and dependencies.
2. Characterize current behavior.
3. Implement smallest authority-preserving change.
4. Run focal gates.
5. Write evidence with executed commands/results.
6. Update status from evidence only.

## Required output per card

- objective status (achieved/partial/blocked)
- changed files
- executed commands + results
- non-executed gates + reason
- residual risks
- next card recommendation

## Stop conditions

- missing prerequisite evidence;
- unresolved authority conflict;
- failing gate without safe fix in current slice.
