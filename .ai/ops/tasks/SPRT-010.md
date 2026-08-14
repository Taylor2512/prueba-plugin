---
id: SPRT-010
campaign: SISAD-PDFME-RUNTIME-HARDENING-V2
status: planned
---

# Tooling install/import safety

## Objective
Characterize and repair installer/importer/test-installer partial/conflict behavior.

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
- [ ] `.ai/evidence/SPRT-010.md` created.

## Dependency
SPRT-000
