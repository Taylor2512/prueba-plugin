---
id: SPRT-150
campaign: SISAD-PDFME-RUNTIME-HARDENING-V2
status: planned
---

# Choice boolean family hardening

## Objective
Close checkbox/select/radio/group semantics and atomic selection.

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
- [ ] `.ai/evidence/SPRT-150.md` created.

## Dependency
SPRT-140
