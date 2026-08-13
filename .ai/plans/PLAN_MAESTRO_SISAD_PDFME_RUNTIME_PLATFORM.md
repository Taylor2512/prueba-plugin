# Plan Maestro — SISAD-PDFME Runtime Platform

## Meta

Cerrar SISAD-PDFME como plataforma reusable propia: runtime local-first, schemas coherentes,
PDF lifecycle seguro, paridad Form/Viewer/Generator/Snapshot, API pública estable, tests
registry-driven y Brain actualizado.

## Wave 0 — Truth + QA infrastructure

`RTP-000 → RTP-005 → RTP-010 → RTP-020`

- live source truth y drift;
- Playwright/config test authority;
- identidad/nomenclatura documental;
- inventario registry-derived + harness baseline.

## Wave 1 — Runtime protocol

`RTP-030 → RTP-040 → RTP-050 → RTP-060`

- local-first atomic transaction;
- origin/revision + controlled/uncontrolled reconciliation;
- canonical events + legacy adapters;
- lifecycle, focus, caret, IME, remount/destroy.

## Wave 2 — Schema semantics

`RTP-070 → RTP-080 → RTP-090`

- manifest incremental;
- value codecs;
- validation/touched/dirty/completion/access boundary.

## Wave 3 — Families

Tras RTP-090, worktrees disjuntos pueden ejecutar:

`RTP-100, 110, 120, 130, 140, 150, 160`.

## Wave 4 — PDF platform

`RTP-170 → RTP-180 → RTP-190 → RTP-200 → RTP-210`

Viewer parity, generator/preflight, converter/PDF.js lifecycle, snapshot/bundle/versioning y
multi-document/page routing.

## Wave 5 — Host-neutral capabilities

`RTP-220 → RTP-230 → RTP-240 → RTP-250 → RTP-260`

recipients/access, collaboration/comments, persistence/save, config profiles y controller/API.

## Wave 6 — Quality attributes

`RTP-270 → RTP-280 → RTP-290 → RTP-300 → RTP-310`

accessibility/touch, performance/memory, security/privacy, examples/docs contract tests y all-schema E2E.

## Wave 7 — Distribution + identity + Brain

`RTP-320 → RTP-330 → RTP-340`

consumer integration, nomenclature modernization y closeout/index/Brain.

## Invariante de ejecución

Una task = un writer. Máximo 8–10 archivos abiertos antes de hipótesis, máximo 5 productivos
por slice salvo task explícita. Evidence > ledger > plan.
