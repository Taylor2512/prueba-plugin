---
id: SPRT-030
campaign: SISAD-PDFME-RUNTIME-HARDENING-V2
status: planned
---

# Legacy Recipient terminology characterization

## Objective
Inventory Recipient-named symbols and classify public alias vs internal debt.

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
- [ ] `.ai/evidence/SPRT-030.md` created.

## Dependency
SPRT-020
