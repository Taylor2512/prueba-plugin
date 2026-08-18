# TRC Ready Plan (2 Weeks)

Execution-focused plan for the first two weeks of Template Runtime Contract hardening.

## Scope Rule

- Run only cards in READY state.
- Before each card, reconcile overlap with QH/PRT/RTP and extend existing authority if overlap is exact.
- No parallel authorities for config compiler, schema registry projection, snapshot format, or runtime access resolver.

## Sprint Goal

Produce evidence-backed closure of the contract foundation:

- reconciliation baseline;
- canonical workspace + template contracts;
- users/documents/schemas/assignments structural authority;
- fail-closed validation/import path draft.

## Week 1 (Foundation)

| Order | Card | Why now | Exit evidence |
|---|---|---|---|
| 1 | TRC-001 | Prevent reimplementation and wrong status promotion | QH reconciliation matrix with criterion-level verdicts |
| 2 | TRC-002 | Canonical workspace boundary | Typed contract + validator boundaries + no-host-business checks |
| 3 | TRC-003 | Canonical portable template JSON | Format/schemaVersion contract + parser/validator path |
| 4 | TRC-006 | Canonical user identity authority | User type + adapter mapping + validation tests |
| 5 | TRC-008 | Canonical assignment authority | Assignment contract + reference integrity tests |

## Week 2 (Structural Hardening)

| Order | Card | Why now | Exit evidence |
|---|---|---|---|
| 6 | TRC-004 | Durable schema identity | schemaUid/name/displayLabel separation + duplicate/orphan checks |
| 7 | TRC-005 | Registry-driven serialization | per-type serialize/deserialize tests from live registry |
| 8 | TRC-012 | Canonical document registry | document identity/order/page validation tests |
| 9 | TRC-014 | Config input vs resolved boundaries | existing compiler contract documented + tested |
| 10 | TRC-017 | Aggregate preflight validator | structured issue model + deterministic validation matrix |
| 11 | TRC-018 | Fail-closed import/migration pipeline | VALID/MIGRATED/UNSUPPORTED/INVALID behavior tests |

## Cross-card Gates (Minimum)

- focal unit/integration tests per card acceptance;
- typecheck and eslint for touched scope;
- evidence update in task card and linked report path;
- explicit list of non-executed gates.

## Status Policy

- PASS requires executed evidence for each acceptance criterion.
- PARTIAL remains when any criterion is unproven.
- BACKLOG remains when implementation or evidence is pending.
- Never close by proximity.

## Risks to watch

- status inflation from partial E2E coverage;
- accidental second authority around config/registry/snapshot;
- coupling reusable core to host business semantics;
- identity leaks from UI order/labels instead of durable IDs.

## Next Queue After 2 Weeks

- TRC-015
- TRC-016
- TRC-019
- TRC-020
- TRC-021
- TRC-025
- TRC-026
- TRC-027
