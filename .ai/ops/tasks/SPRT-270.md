# SPRT-270 — Closeout del refactor de `src/examples`

## Scope

Auditar y cerrar las consolidaciones existentes de ejemplos, sin iniciar otro
refactor ni editar context packs generados.

## Evidence

See `reports/runtime-platform/evidence/examples-refactor-closeout-2026-08-13.md`.

## Exit status

`PARTIAL`: build, Form focal y navegacion pasan. El gate de style permanece
bloqueado por tooling drift: `package.json` declara un script cuyo archivo no
existe y el reemplazo encontrado escanea un alcance distinto.
