# DEDUP-008 — taxonomía del inspector

**Estado:** done · **Owner:** sidebar-schema-batch · **Modelo:** GPT-5.6 Sol medium · **Worktree:** `/workspace/wt-sidebar`

## Objetivo observable

Eliminar metadata equivalente entre `detailSchemas.ts` y `detailSectionTaxonomy.ts` creando un contrato canónico.

## Evidencia

Reporte jscpd del 22 de julio de 2026.

## Archivos permitidos

src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailSchemas.ts; detailSectionTaxonomy.ts

## Archivos prohibidos

`src/sisad-pdfme/pdf-lib`, snapshot/global generator y cualquier archivo no requerido por callers o tests directos.

## Invariantes

API pública, identidad/routing/ownership, comportamiento de canvas y compatibilidad de snapshot.

## Caracterización previa

Tests de orden, visibilidad y labels por familia.

## Diseño/patrón

Registry declarativo de secciones.

## Pasos

Aplica la skill `sisad-dry-refactor`: caracteriza el caso, crea la fuente canónica, migra callers y ejecuta los gates declarados en esta tarjeta.

## Criterios de aceptación

La coincidencia descrita en **DEDUP-008-inspector-taxonomy** queda eliminada o aceptada con evidencia; no se introducen clones owned nuevos ni regresiones en sus pruebas focales.

## Riesgos y rollback

Mantener un commit de caracterización separado y revertir la extracción si aumenta branching o rompe pruebas.

## Cierre

- Fuente canónica: `hasMeaningfulInspectorValue` en la taxonomía del inspector.
- Duplicidad: eliminada la segunda implementación recursiva y conservada la misma semántica para arrays, records, números, booleanos y strings vacíos.
- Gates: ESLint focal y jscpd strict en verde; build ya caracterizado como bloqueado por `tslib` ausente.
- Riesgo residual: función pura; no modifica paths read/write, visibilidad, orden ni labels.

## Memory delta

Sin delta durable: `detailSectionTaxonomy.ts` ya era la fuente documentada de verdad.
