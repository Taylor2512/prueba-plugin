---
id: SPRT-070
campaign: SISAD-PDFME-RUNTIME-HARDENING-V2
status: planned
---

# Snapshot user migration

## Objective
Version and migrate legacy ownership/recipient snapshots explicitly.

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
- [ ] `.ai/evidence/SPRT-070.md` created.

## Dependency
SPRT-060
