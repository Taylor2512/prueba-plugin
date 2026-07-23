# DEDUP-003 — comments overlay

**Estado:** done · **Owner:** canvas-batch · **Modelo:** GPT-5.6 Sol high · **Worktree:** `/workspace/wt-canvas` (`codex/canvas-batch`)

## Objetivo observable

Centralizar cálculo/view-model repetido para anchors y cards sin fusionar estados visuales no equivalentes.

## Evidencia

Reporte jscpd del 22 de julio de 2026.

## Archivos permitidos

src/sisad-pdfme/ui/components/Designer/Canvas/overlays/CommentsOverlay.tsx

## Archivos prohibidos

`src/sisad-pdfme/pdf-lib`, snapshot/global generator y cualquier archivo no requerido por callers o tests directos.

## Invariantes

API pública, identidad/routing/ownership, comportamiento de canvas y compatibilidad de snapshot.

## Caracterización previa

Vitest + Playwright de comentario por documento/página/schema.

## Diseño/patrón

Funciones puras para posición y props comunes; composición para UI.

## Pasos

Aplica la skill `sisad-dry-refactor`: caracteriza el caso, crea la fuente canónica, migra callers y ejecuta los gates declarados en esta tarjeta.

## Criterios de aceptación

La coincidencia descrita en **DEDUP-003-comments-overlay** queda eliminada o aceptada con evidencia; no se introducen clones owned nuevos ni regresiones en sus pruebas focales.

## Riesgos y rollback

Mantener un commit de caracterización separado y revertir la extracción si aumenta branching o rompe pruebas.

## Memory delta

`upsertCommentAnchor` es la fuente canónica para normalizar id, coordenadas, página, texto y estado del view-model. El jscpd focal pasó de 2 clones/17 líneas a 1 clon/11 líneas; el restante es `owned-acceptable` entre los contratos serializados distintos `OverlayComment` y `OverlayAnchor`, no la construcción repetida del view-model objetivo.

## Cierre

- Commit: registrado en el commit que contiene esta tarjeta.
- Gates: ESLint focal; Vitest de import; jscpd focal (clon accionable eliminado).
- Gates globales del batch: `quality:duplicates:strict` completó (99 clones de baseline y el clon de tipos ya clasificado); `lint` quedó bloqueado por un error preexistente en `useCanvasRenderState.ts`; `build` quedó bloqueado porque el entorno no resuelve `tslib` desde `form-render`.
- Riesgo residual: el Playwright existente es un smoke placeholder y no caracteriza routing; el cambio no altera DOM, geometría ni eventos.
