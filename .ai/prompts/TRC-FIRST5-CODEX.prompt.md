# TRC-FIRST5-CODEX.prompt.md

Execute only the first critical TRC wave with strict evidence reconciliation.

## Scope

- TRC-001
- TRC-002
- TRC-003
- TRC-006 + TRC-008
- TRC-004 + TRC-005

## Hard constraints

- Do not open a parallel authority if QH/PRT/RTP already owns exact contract scope.
- Keep canonical authorities: config compiler, schema runtime manifest projection, snapshot format, runtime access resolver.
- No product-business semantics in reusable core.

## Execution order

1. Reconcile QH statuses with evidence (TRC-001).
2. Define workspace contract and validator (TRC-002).
3. Define canonical template JSON + version contract (TRC-003).
4. Formalize users and assignments contracts (TRC-006/TRC-008).
5. Enforce schema identity and registry-driven serialization (TRC-004/TRC-005).

## Required output

- changed files
- executed commands and results
- acceptance checklist per task
- residual gaps and mapped next TRC IDs
- explicit non-executed gates
