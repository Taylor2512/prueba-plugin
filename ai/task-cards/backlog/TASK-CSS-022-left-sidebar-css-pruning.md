# TASK-CSS-022 — Podar CSS legado del sidebar izquierdo

## Objetivo

Eliminar de `sisad-pdfme.css` únicamente las reglas del sidebar izquierdo ya sustituidas por clases JSX/TSX.

## Alcance

Selectores con consumidor comprobado en TASK-CSS-021 y sus estados.

## Fuera de alcance

RightSidebar, schemas, canvas y reglas compartidas no trazadas.

## Archivos candidatos

`sisad-pdfme.css`, máximo 3 consumidores afectados y una prueba visual.

## Archivos prohibidos

`tokens.css`, Renderer, Moveable, Selecto, snapshot y PDF.

## Pasos

1. Comparar ledger de TASK-CSS-021 con búsquedas de consumidores.
2. Borrar reglas huérfanas por bloques pequeños.
3. Validar todos los estados y breakpoints.

## Validación

Conteo `@apply`, búsqueda de selectores, typecheck y capturas.

## Criterio de parada

Detenerse si un selector tiene consumidor incierto o alcance global.

## Entrega final

Lista exacta de reglas retiradas y delta cuantitativo.
