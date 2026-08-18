# TRC-STATUS-RECONCILIATION.prompt.md

Reconcile task status from evidence only.

## Targets

QH-012, QH-013, QH-014, QH-015, QH-017, QH-019, QH-020, QH-021

## Method

- read acceptance criteria from each card;
- map executed evidence (tests/gates/logs) criterion-by-criterion;
- classify each criterion: CONFIRMADO | INFERIDO | HIPOTESIS | DESCONOCIDO;
- recommend status KEEP/PARTIAL/PASS/BACKLOG with rationale;
- map unresolved criteria to TRC IDs.

## Output format

1. card summary table
2. evidence mismatch list
3. file updates in .ai/**
4. unresolved blockers

## Prohibitions

- no status promotion by functional proximity;
- no product code changes;
- no rewriting historical evidence.
