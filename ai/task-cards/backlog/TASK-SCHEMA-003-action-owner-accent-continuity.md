# TASK-SCHEMA-003 — Diferenciar propietario y acción del schema

## Objetivo

Conservar el color del propietario como identidad exterior y añadir un acento secundario estable para la acción cuando el diseño lo requiera.

## Alcance

- Auditar `actionMap`, tono de propietario y estados del schema.
- Definir precedencia owner → action → neutral.
- Aplicar acento sin competir con selección, error o disabled.

## Fuera de alcance

Cambios a geometría, migración CSS general y nuevas acciones.

## Archivos candidatos

Máximo 5: `actionMap.ts`, `fieldChrome.ts`, `schemaOwnershipAppearance.ts`, `Renderer.tsx` y una prueba focalizada.

## Archivos prohibidos

Canvas, Moveable, Selecto, snapshot, generator, `pdf-lib` y sidebars.

## Pasos

1. Enumerar acciones y tonos existentes.
2. Definir tabla de precedencia y accesibilidad.
3. Implementar mapas estáticos.
4. Probar propietario distinto con misma acción y viceversa.

## Validación

Typecheck, test focalizado y contraste visual en estados selected/unselected.

## Criterio de parada

Detenerse si no existe contrato explícito de acción o si el acento reduce contraste.

## Entrega final

Matriz owner/action/estado y evidencia.
