---
id: SPRT-020
campaign: SISAD-PDFME-RUNTIME-HARDENING-V2
status: planned
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
- [ ] focal behavior characterized;
- [ ] implementation, if required, is host-agnostic;
- [ ] focal tests pass;
- [ ] public compatibility evaluated;
- [ ] `.ai/evidence/SPRT-020.md` created.

## Dependency
SPRT-010
