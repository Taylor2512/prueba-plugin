# DEDUP-001 — unificar smart placement

**Estado:** done · **Owner:** canvas-batch · **Modelo:** GPT-5.6 Sol high · **Worktree:** `/workspace/wt-canvas` (`codex/canvas-batch`)

## Objetivo observable

Extraer la estructura común de los dos recorridos largos de `smartPlacement.ts` sin cambiar coordenadas, prioridades ni fallback.

## Evidencia

Reporte jscpd del 22 de julio de 2026.

## Archivos permitidos

src/sisad-pdfme/ui/components/Designer/Canvas/overlays/smartPlacement.ts

## Archivos prohibidos

`src/sisad-pdfme/pdf-lib`, snapshot/global generator y cualquier archivo no requerido por callers o tests directos.

## Invariantes

API pública, identidad/routing/ownership, comportamiento de canvas y compatibilidad de snapshot.

## Caracterización previa

Vitest de posiciones candidatas, límites de página y no-overlap.

## Diseño/patrón

Strategy interna o función de búsqueda parametrizada por eje; evitar flags booleanos opacos.

## Pasos

Aplica la skill `sisad-dry-refactor`: caracteriza el caso, crea la fuente canónica, migra callers y ejecuta los gates declarados en esta tarjeta.

## Criterios de aceptación

La coincidencia descrita en **DEDUP-001-smart-placement** queda eliminada o aceptada con evidencia; no se introducen clones owned nuevos ni regresiones en sus pruebas focales.

## Riesgos y rollback

Mantener un commit de caracterización separado y revertir la extracción si aumenta branching o rompe pruebas.

## Memory delta

`resolveDropPosition` es la fuente canónica del recorrido; las dos APIs públicas conservan su diferencia mediante estrategias de fallback explícitas (centro o `null`). El archivo pasó de 286 a 227 líneas y jscpd focal reportó 0 clones.

## Cierre

- Commit: registrado en el commit que contiene esta tarjeta.
- Gates: ESLint focal; 5 tests Vitest focales; jscpd focal (0 clones).
- Gates globales del batch: `quality:duplicates:strict` completó (99 clones de baseline, ninguno nuevo en este archivo); `lint` quedó bloqueado por un error preexistente en `useCanvasRenderState.ts`; `build` quedó bloqueado porque el entorno no resuelve `tslib` desde `form-render`.
- Riesgo residual: no cambiaron coordenadas, orden de candidatos ni contratos públicos.
