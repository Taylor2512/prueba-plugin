# TRC Day-by-Day Plan (10 Working Days)

Operational breakdown of the 2-week READY plan.

## Day 1

- Primary card: TRC-001
- Goal: reconcile QH statuses with live evidence only
- Deliverables: criterion-level matrix, residual mapping to TRC
- Exit: no status promoted without executed evidence

## Day 2

- Primary card: TRC-002
- Goal: canonical SisadPdfmeWorkspace contract + validator boundary
- Deliverables: type contract draft, validator scope, portability constraints
- Exit: no React/DOM/host-business coupling in contract module

## Day 3

- Primary card: TRC-003
- Goal: canonical template JSON format and schemaVersion rules
- Deliverables: format contract, parse and validation path
- Exit: schemaVersion in payload and no filename-based versioning

## Day 4

- Primary cards: TRC-006 and TRC-007
- Goal: user registry model and normalization authority
- Deliverables: user type, normalize/index/validate flow, invalid user cases
- Exit: duplicate or invalid user references fail closed

## Day 5

- Primary card: TRC-008
- Goal: assignment registry contract and reference integrity
- Deliverables: assignment shape, validator rules, conflict cases
- Exit: clear separation from readOnly, positionLocked and collab lock

## Day 6

- Primary card: TRC-004
- Goal: durable schema identity separation
- Deliverables: schemaUid contract, name/displayLabel distinction, orphan checks
- Exit: no identity from labels/order/visual state

## Day 7

- Primary card: TRC-005
- Goal: registry-driven schema serialization policy
- Deliverables: per-type serialization hooks, round-trip tests by registry
- Exit: no switch-per-type authority duplication

## Day 8

- Primary cards: TRC-012 and TRC-014
- Goal: document registry and config pipeline boundaries
- Deliverables: document validation, InputConfig vs ResolvedConfig contract
- Exit: no second config manager, no filename identity for docs

## Day 9

- Primary card: TRC-017
- Goal: aggregate preflight validator
- Deliverables: structured issue model and minimum validation matrix
- Exit: deterministic issue payload and fail-closed behavior

## Day 10

- Primary card: TRC-018
- Goal: import and migration fail-closed pipeline
- Deliverables: VALID/MIGRATED/UNSUPPORTED/INVALID outcomes and tests
- Exit: no silent healing on broken payloads

## Daily mandatory gates

- targeted tests for acceptance criteria
- typecheck and eslint in changed scope
- evidence update in card and report path
- explicit non-executed gates list

## Daily rollback rule

If a day fails on unresolved authority conflict or missing prerequisite evidence, stop status promotion and open blocker notes immediately.
