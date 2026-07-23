# DEDUP-004 — inline edit overlay

**Estado:** done · **Owner:** canvas-batch · **Modelo:** GPT-5.6 Sol high · **Worktree:** `/workspace/wt-canvas` (`codex/canvas-batch`)

## Objetivo observable

Compartir setup y commit/cancel de dos ramas de edición manteniendo controles por tipo.

## Evidencia

Reporte jscpd del 22 de julio de 2026.

## Archivos permitidos

src/sisad-pdfme/ui/components/Designer/Canvas/overlays/InlineEditOverlay.tsx

## Archivos prohibidos

`src/sisad-pdfme/pdf-lib`, snapshot/global generator y cualquier archivo no requerido por callers o tests directos.

## Invariantes

API pública, identidad/routing/ownership, comportamiento de canvas y compatibilidad de snapshot.

## Caracterización previa

Tests de Enter/Escape/blur/readOnly.

## Diseño/patrón

Primitive + Strategy de editor por schema.

## Pasos

Aplica la skill `sisad-dry-refactor`: caracteriza el caso, crea la fuente canónica, migra callers y ejecuta los gates declarados en esta tarjeta.

## Criterios de aceptación

La coincidencia descrita en **DEDUP-004-inline-edit-overlay** queda eliminada o aceptada con evidencia; no se introducen clones owned nuevos ni regresiones en sus pruebas focales.

## Riesgos y rollback

Mantener un commit de caracterización separado y revertir la extracción si aumenta branching o rompe pruebas.

## Memory delta

`editorInteractionProps` es el primitive común para draft, cancelación e interacciones, con `editorCommitStrategies` como variantes explícitas para input simple y multilínea. El archivo pasó de 238 a 230 líneas y jscpd focal reportó 0 clones.

## Cierre

- Commit: registrado en el commit que contiene esta tarjeta.
- Gates: ESLint focal; Vitest de import; jscpd focal (0 clones).
- Gates globales del batch: `quality:duplicates:strict` completó (99 clones de baseline, ninguno nuevo en este archivo); `lint` quedó bloqueado por un error preexistente en `useCanvasRenderState.ts`; `build` quedó bloqueado porque el entorno no resuelve `tslib` desde `form-render`.
- Riesgo residual: la suite disponible no ejercita Enter/Escape/blur/readOnly; se preservaron handlers, condiciones y props existentes.
