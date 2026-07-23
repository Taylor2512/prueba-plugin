# DEDUP-009 — builders modal custom field

**Estado:** done · **Owner:** sidebar-schema-batch · **Modelo:** GPT-5.6 Terra medium · **Worktree:** `/workspace/wt-sidebar`

## Objetivo observable

Compartir dos bloques de transformación/form state sin ocultar validaciones específicas.

## Evidencia

Reporte jscpd del 22 de julio de 2026.

## Archivos permitidos

src/sisad-pdfme/ui/components/Designer/LeftSidebarCustomFieldModal.tsx

## Archivos prohibidos

`src/sisad-pdfme/pdf-lib`, snapshot/global generator y cualquier archivo no requerido por callers o tests directos.

## Invariantes

API pública, identidad/routing/ownership, comportamiento de canvas y compatibilidad de snapshot.

## Caracterización previa

Tests create/edit/cancel/invalid.

## Diseño/patrón

Builder de draft + validator puro.

## Pasos

Aplica la skill `sisad-dry-refactor`: caracteriza el caso, crea la fuente canónica, migra callers y ejecuta los gates declarados en esta tarjeta.

## Criterios de aceptación

La coincidencia descrita en **DEDUP-009-custom-field-modal** queda eliminada o aceptada con evidencia; no se introducen clones owned nuevos ni regresiones en sus pruebas focales.

## Riesgos y rollback

Mantener un commit de caracterización separado y revertir la extracción si aumenta branching o rompe pruebas.

## Cierre

- Fuente canónica: composición `FieldControl` para ID/label/control y validador puro `isCustomFieldDraftValid`.
- Duplicidad: eliminados los dos bloques equivalentes de control textual/select (14 líneas detectadas por jscpd).
- Gates: ESLint focal y jscpd strict en verde; build bloqueado por dependencia preexistente `tslib` ausente.
- Riesgo residual: eventos y valores permanecen en cada control; save/cancel y validación conservan su contrato.

## Memory delta

Sin delta durable: la abstracción permanece local al modal.
