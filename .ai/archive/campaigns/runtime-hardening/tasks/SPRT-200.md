---
id: SPRT-200
campaign: SISAD-PDFME-RUNTIME-HARDENING-V2
status: planned
---

# Multi-instance concurrency

## Objective
Run two+ Form instances with independent users/documents simultaneously.

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
- [ ] `.ai/evidence/SPRT-200.md` created.

## Dependency
SPRT-190
