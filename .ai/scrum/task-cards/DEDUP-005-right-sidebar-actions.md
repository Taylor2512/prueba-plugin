# DEDUP-005 — composición RightSidebar

**Estado:** done · **Owner:** sidebar-schema-batch · **Modelo:** GPT-5.6 Sol medium · **Worktree:** `/workspace/wt-sidebar`

## Objetivo observable

Reducir dos paneles de acciones casi iguales sin alterar navegación, accesibilidad ni permisos.

## Evidencia

Reporte jscpd del 22 de julio de 2026.

## Archivos permitidos

src/sisad-pdfme/ui/components/Designer/RightSidebar/RightSidebar.tsx

## Archivos prohibidos

`src/sisad-pdfme/pdf-lib`, snapshot/global generator y cualquier archivo no requerido por callers o tests directos.

## Invariantes

API pública, identidad/routing/ownership, comportamiento de canvas y compatibilidad de snapshot.

## Caracterización previa

Vitest de visibilidad/disabled y Playwright focal.

## Diseño/patrón

Composición declarativa de action groups.

## Pasos

Aplica la skill `sisad-dry-refactor`: caracteriza el caso, crea la fuente canónica, migra callers y ejecuta los gates declarados en esta tarjeta.

## Criterios de aceptación

La coincidencia descrita en **DEDUP-005-right-sidebar-actions** queda eliminada o aceptada con evidencia; no se introducen clones owned nuevos ni regresiones en sus pruebas focales.

## Riesgos y rollback

Mantener un commit de caracterización separado y revertir la extracción si aumenta branching o rompe pruebas.

## Cierre

- Fuente canónica: `documentsRailProps`, contrato declarativo compartido por las composiciones split y tab.
- Duplicidad: dos bloques equivalentes de 12 props pasan a una sola definición sin branching nuevo.
- Gates: ESLint focal y jscpd strict en verde; build bloqueado por dependencia preexistente `tslib` ausente.
- Riesgo residual: sin cambio de layout, routing, permisos ni callbacks; rollback mediante este commit.

## Memory delta

Sin delta durable: el contrato queda local al único componente que lo consume.
