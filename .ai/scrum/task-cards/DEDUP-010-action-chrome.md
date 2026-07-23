# DEDUP-010 — attachment/note chrome

**Estado:** ready · **Owner:** por asignar · **Modelo:** consultar router · **Worktree:** por definir

## Objetivo observable

Extraer la metadata visual común de schemas de acción manteniendo semántica y comportamiento.

## Evidencia

Reporte jscpd del 22 de julio de 2026.

## Archivos permitidos

src/sisad-pdfme/schemas/actions/attachment.ts; note.ts

## Archivos prohibidos

`src/sisad-pdfme/pdf-lib`, snapshot/global generator y cualquier archivo no requerido por callers o tests directos.

## Invariantes

API pública, identidad/routing/ownership, comportamiento de canvas y compatibilidad de snapshot.

## Caracterización previa

Designer/Form/Viewer/Generator focal.

## Diseño/patrón

Factory fina o helper de field chrome; no factory universal.

## Pasos

Aplica la skill `sisad-dry-refactor`: caracteriza el caso, crea la fuente canónica, migra callers y ejecuta los gates declarados en esta tarjeta.

## Criterios de aceptación

La coincidencia descrita en **DEDUP-010-action-chrome** queda eliminada o aceptada con evidencia; no se introducen clones owned nuevos ni regresiones en sus pruebas focales.

## Riesgos y rollback

Mantener un commit de caracterización separado y revertir la extracción si aumenta branching o rompe pruebas.

## Memory delta

Actualizar métricas y decisiones solo si nace una nueva fuente canónica o política durable.
