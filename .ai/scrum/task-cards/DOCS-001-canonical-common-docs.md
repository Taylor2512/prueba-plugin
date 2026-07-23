# DOCS-001 — documentación common canónica

**Estado:** done · **Owner:** coordinator · **Modelo:** GPT-5.6 Sol · **Worktree:** actual

## Objetivo observable

Sustituir el documento consolidado con 40% de duplicidad por índice y páginas por módulo.

## Evidencia

Reporte jscpd del 22 de julio de 2026.

## Archivos permitidos

src/sisad-pdfme/common/documentacion-common-sisad-pdfme.md

## Archivos prohibidos

`src/sisad-pdfme/pdf-lib`, snapshot/global generator y cualquier archivo no requerido por callers o tests directos.

## Invariantes

API pública, identidad/routing/ownership, comportamiento de canvas y compatibilidad de snapshot.

## Caracterización previa

Checker Markdown sin párrafos duplicados.

## Diseño/patrón

Documentación modular enlazada; salida consolidada generada fuera del gate.

## Pasos

Aplica la skill `sisad-dry-refactor`: caracteriza el caso, crea la fuente canónica, migra callers y ejecuta los gates declarados en esta tarjeta.

## Criterios de aceptación

La coincidencia descrita en **DOCS-001-canonical-common-docs** queda eliminada o aceptada con evidencia; no se introducen clones owned nuevos ni regresiones en sus pruebas focales.

## Riesgos y rollback

Mantener un commit de caracterización separado y revertir la extracción si aumenta branching o rompe pruebas.

## Memory delta

Actualizar métricas y decisiones solo si nace una nueva fuente canónica o política durable.

## Cierre (2026-07-23)

- Fuente canónica: JSDoc y tipos de cada módulo, con reglas transversales en `common/README.md`.
- Patrón: índice enlazado; el consolidado repetido se sustituyó por un mapa de responsabilidades mantenible.
- Medición: el checker Markdown analiza 138 archivos y reporta 0 párrafos duplicados.
- Gates: checker Markdown y los tres perfiles jscpd en verde; lint/build conservan bloqueos globales ajenos documentados en el sprint.
- Memory delta: se confirma la decisión durable de documentar junto al módulo propietario y no regenerar consolidaciones activas.
