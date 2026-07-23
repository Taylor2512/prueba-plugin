# DEDUP-010 — attachment/note chrome

**Estado:** done · **Owner:** sidebar-schema-batch · **Modelo:** GPT-5.6 Sol high · **Worktree:** `/workspace/wt-sidebar`

## Objetivo observable

Extraer la metadata visual común de schemas de acción manteniendo semántica y comportamiento.

## Evidencia

Reporte jscpd del 22 de julio de 2026.

## Archivos permitidos

src/sisad-pdfme/schemas/actions/attachment.ts; note.ts; actionSchemaFactory.ts (fuente canónica compartida requerida)

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

## Cierre

- Fuente canónica: `drawActionFieldChrome` en `actionSchemaFactory.ts`, factory existente de la familia action-based.
- Duplicidad: los dos bloques PDF de 10 líneas se sustituyen por metadata RGB por variante; jscpd baja de 100 a 99 clones en esta ola.
- Gates: jscpd strict en verde; TypeScript focal sin errores en archivos tocados (el gate global conserva deuda preexistente); build bloqueado por `tslib` ausente.
- Riesgo residual: se preservan coordenadas, tamaño, borde de 1 punto y colores exactos de attachment/note.

## Memory delta

Nueva fuente canónica local de familia: el chrome PDF de acciones vive en `actionSchemaFactory.ts`.
