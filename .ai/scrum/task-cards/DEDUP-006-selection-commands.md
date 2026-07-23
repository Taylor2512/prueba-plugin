# DEDUP-006 — helpers selectionCommands

**Estado:** done · **Owner:** shared-batch · **Modelo:** GPT-5.6 Sol · **Worktree:** codex/shared-batch (`/workspace/wt-shared`)

## Objetivo observable

Unificar recorridos y patches repetidos preservando undo/redo y offsets.

## Evidencia

Reporte jscpd del 22 de julio de 2026.

## Archivos permitidos

src/sisad-pdfme/ui/components/Designer/shared/selectionCommands.ts

## Archivos prohibidos

`src/sisad-pdfme/pdf-lib`, snapshot/global generator y cualquier archivo no requerido por callers o tests directos.

## Invariantes

API pública, identidad/routing/ownership, comportamiento de canvas y compatibilidad de snapshot.

## Caracterización previa

Tests de duplicate/delete/align/distribute.

## Diseño/patrón

Command helpers puros, sin mega-command genérico.

## Pasos

Aplica la skill `sisad-dry-refactor`: caracteriza el caso, crea la fuente canónica, migra callers y ejecuta los gates declarados en esta tarjeta.

## Criterios de aceptación

La coincidencia descrita en **DEDUP-006-selection-commands** queda eliminada o aceptada con evidencia; no se introducen clones owned nuevos ni regresiones en sus pruebas focales.

## Riesgos y rollback

Mantener un commit de caracterización separado y revertir la extracción si aumenta branching o rompe pruebas.

## Memory delta

Actualizar métricas y decisiones solo si nace una nueva fuente canónica o política durable.

## Cierre (2026-07-23)

- Fuente canónica: `executeSelectionOps`, que aplica patches y conserva execute/undo/redo para align/distribute.
- Patrón: helper puro/acotado de comandos, sin flags de comportamiento.
- Duplicidad eliminada: dos recorridos equivalentes de materialización y commit de operaciones. jscpd focal conserva 1 coincidencia (7 líneas, 72 tokens) entre bring-forward/send-backward, aceptada porque el orden inverso es semántica de dominio y un flag recrearía ambos bloques.
- Gates: ESLint focal (sin errores; 2 warnings preexistentes de `INLINE_EDIT_REQUEST_EVENT`), 5 tests Vitest de geometría/clipboard y jscpd focal.
- Riesgo residual: ninguno sobre offsets o geometría; los cálculos `computeAlignedSchemas`/`computeDistributedSchemas` no cambiaron.
- Memory delta: no cambia una decisión durable fuera de esta tarjeta.
