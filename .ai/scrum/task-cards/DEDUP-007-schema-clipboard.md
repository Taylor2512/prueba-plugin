# DEDUP-007 — adapters clipboard

**Estado:** done · **Owner:** shared-batch · **Modelo:** GPT-5.6 Sol · **Worktree:** codex/shared-batch (`/workspace/wt-shared`)

## Objetivo observable

Compartir normalización repetida en paste/duplicate sin perder documentId, pageNumber, owner o group ids.

## Evidencia

Reporte jscpd del 22 de julio de 2026.

## Archivos permitidos

src/sisad-pdfme/ui/components/Designer/shared/schemaClipboard.ts

## Archivos prohibidos

`src/sisad-pdfme/pdf-lib`, snapshot/global generator y cualquier archivo no requerido por callers o tests directos.

## Invariantes

API pública, identidad/routing/ownership, comportamiento de canvas y compatibilidad de snapshot.

## Caracterización previa

Round-trip clipboard y tests multi-document.

## Diseño/patrón

Adapter de schema clipboard + id factory inyectable.

## Pasos

Aplica la skill `sisad-dry-refactor`: caracteriza el caso, crea la fuente canónica, migra callers y ejecuta los gates declarados en esta tarjeta.

## Criterios de aceptación

La coincidencia descrita en **DEDUP-007-schema-clipboard** queda eliminada o aceptada con evidencia; no se introducen clones owned nuevos ni regresiones en sus pruebas focales.

## Riesgos y rollback

Mantener un commit de caracterización separado y revertir la extracción si aumenta branching o rompe pruebas.

## Memory delta

Actualizar métricas y decisiones solo si nace una nueva fuente canónica o política durable.

## Cierre (2026-07-23)

- Fuente canónica: `createClipboardPayload` normaliza copy/cut y `pasteClipboardItems` adapta paste/duplicate con una única regeneración de identidad.
- Patrón: Adapter de clipboard con `createId` inyectable; la estrategia de contexto conserva smart placement individual frente a delta rígido de grupos.
- Duplicidad eliminada: sanitización copy/cut y loops equivalentes de paste; jscpd focal reporta 0 clones.
- Gates: ESLint focal; 26 tests Vitest de round-trip, grupos, multipágina/metadata e identidad determinista; jscpd focal.
- Riesgo residual: ninguno conocido; documentId/fileId, pageNumber, recipient ownership y group ids siguen pasando por el adapter existente.
- Memory delta: se documenta localmente la inyección de identidad; no requiere nueva política durable.
