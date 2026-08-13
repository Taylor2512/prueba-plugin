# START — SISAD-PDFME Runtime Platform

Repo:
`/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin`

## Identidad

SISAD-PDFME es el producto actual. Está inspirado históricamente en pdfme, pero no debes
tratarlo como un wrapper/fork a parchear. Usa sus contratos actuales como autoridad.

## Inicio

1. `git status --short`, branch y HEAD.
2. Lee `.ai/brain/00-product/PRODUCT-IDENTITY.md`.
3. Lee `.ai/plans/PLAN_MAESTRO_SISAD_PDFME_RUNTIME_PLATFORM.md`.
4. Lee solo la task activa; comienza en `RTP-000`.
5. Source vivo > context pack.

## Regla de contexto

No abras todos los 613 Markdown ni los 403 source files. Usa `.ai/index/runtime-platform/*.jsonl`
para localizar y abre máximo 8–10 archivos antes de fijar hipótesis.

## Principios

- local-first Form;
- transacciones atómicas;
- origin/revision;
- manifest incremental, no registry paralelo;
- codec común por familia;
- Form/Viewer/Generator/Snapshot parity;
- lifecycle explícito PDF.js/File/Blob/object URL;
- host adapters/providers, no business logic en reusable;
- una task por sesión/write slice.

## Cierre

Evidence exacta, comandos exactos, resultados exactos, blockers, HEAD y siguiente task.

## Claude
Usa skills existentes de runtime-parity, schema-family, public-api, quality-evidence y context-engineering. Para Haiku: no reanalices el repo completo; ejecuta una task acotada y deja handoff al agotar contexto.
