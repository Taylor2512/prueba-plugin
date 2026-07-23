# DEDUP-011 — residuales owned del gate strict

**Estado:** done · **Owner:** coordinator · **Modelo:** GPT-5.6 Sol · **Worktree:** actual

## Objetivo observable

Clasificar los cuatro clones owned residuales de `quality:duplicates:strict` y eliminar los que compartan responsabilidad real sin tocar vendor ni geometría.

## Evidencia

Reporte strict del 23 de julio de 2026: 65 clones en 526 fuentes analizadas; 4 owned y 61 vendor.

## Archivos permitidos

`CommentsOverlay.tsx`; `SchemaDropCommitFlash.tsx`; `selectionCommands.ts`; tests focales y esta tarjeta.

## Archivos prohibidos

`src/sisad-pdfme/pdf-lib`, snapshot, generator, Moveable, Selecto y cualquier exclusión nueva.

## Invariantes

Multipágina, coordenadas y escala de pins; reduced motion y cleanup de timers; orden Z, guards y undo/redo; contratos públicos de shortcuts.

## Diseño/patrón

Contrato local para metadata de anchors, cleanup único de animación y función pura de partición por selección. No crear un wrapper para callbacks TypeScript equivalentes.

## Cierre (2026-07-23)

- Eliminados 3 clones owned-actionable: contrato de anchor, cleanup de flash y partición para orden Z.
- El clon de 8 líneas entre `UseDesignerKeyboardShortcutsParams` y `UseInitEventsParams` queda `owned-acceptable`: son fronteras tipadas distintas, sin lógica runtime; extraerlo añadiría acoplamiento sin reducir puntos de cambio.
- Medición: strict baja de 65 a 62 clones; owned baja de 4 a 1 y vendor permanece en 61.
- Gates: ESLint focal sin errores; 6 tests focales; parser strict confirma la clasificación.
- Riesgo residual: los tests de overlays continúan siendo smoke tests; no se modificó layout ni interacción pointer.

## Memory delta

Se registra que fuentes analizadas no equivalen a archivos por modificar: 526 fuentes produjeron únicamente 4 hallazgos owned en esta ola.
