---
id: SPRT-020
campaign: SISAD-PDFME-RUNTIME-HARDENING-V2
status: done
---

# Dedup and ordering baseline

## Objective
Establish semantic dedup ratchet, stable naming and documentation/order gates.

## Product boundary
SISAD-PDFME only. No external-project source or business semantics.

## Rules
- live source/tests > exported packs;
- one writer;
- preserve dirty-tree work;
- characterize before refactor;
- keep Designer stable unless this task explicitly targets Designer;
- canonical reusable identity is User;
- evidence before PASS.

## Acceptance
- [x] focal behavior characterized;
- [x] implementation, if required, is host-agnostic;
- [x] focal tests pass;
- [x] public compatibility evaluated;
- [x] evidence recorded in `reports/runtime-platform/evidence/SPRT-020.md`.

## Dependency
SPRT-010
