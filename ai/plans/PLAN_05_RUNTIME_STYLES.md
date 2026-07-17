# Plan 05 — Decomisión runtimeStyles

## Exclusividad

Una sola rama modifica `runtimeStyles.ts`.

## Clasificación

### KEEP_TECHNICAL
Moveable, Selecto, Scena Guides, print/PDF, terceros, pseudoelementos técnicos y variables calculadas.

### MIGRATE_TO_TAILWIND
Fondos, bordes, tipografía, spacing local, sombras y estados visuales.

### DELETE_DEAD
Solo con cero referencias y tests.

## Evidencia

Selector, consumidor, razón, destino y prueba.

## Cierre

runtimeStyles contiene solo CSS técnico documentado.
