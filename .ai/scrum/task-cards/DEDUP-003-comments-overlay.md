# DEDUP-003 — comments overlay

**Estado:** ready · **Owner:** por asignar · **Modelo:** consultar router · **Worktree:** por definir

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

Actualizar métricas y decisiones solo si nace una nueva fuente canónica o política durable.
