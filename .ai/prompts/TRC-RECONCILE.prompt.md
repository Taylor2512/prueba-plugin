# TRC-RECONCILE.prompt.md

Reconcile quality-hardening status before opening new implementation.

## Input

- cards: QH-012, QH-013, QH-014, QH-015, QH-017, QH-019, QH-020, QH-021
- latest executed evidence in reports/** and card evidence blocks
- live source/tests

## Output required

1. Per card table:
   - acceptance criterion
   - evidence found
   - verdict: CONFIRMADO | INFERIDO | HIPOTESIS | DESCONOCIDO
   - status recommendation: KEEP | PARTIAL | PASS | BACKLOG
2. Gap map from QH residuals to TRC IDs.
3. Exact files updated in .ai/** only.

## Rules

- No product code changes.
- No PASS by similarity.
- If evidence is missing, keep/open status and document blocker.
- If overlap with existing PRT/RTP is exact, extend existing card scope instead of creating parallel implementation card.
