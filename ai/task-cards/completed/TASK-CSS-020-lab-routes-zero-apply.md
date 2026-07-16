# TASK-CSS-020 — Reducir `labRoutes.css` a contratos no migrables

## Objetivo

Llevar a JSX/TSX las utilidades Tailwind estáticas restantes de `labRoutes.css` y alcanzar cero `@apply` si no compromete contratos complejos.

## Alcance

- Una sola región por pasada: controles compactos, popovers o resultados.
- Clases estáticas y variantes completas desde `constants.ts`.
- Conservar pseudoestados o selectores complejos justificados.

## Fuera de alcance

Shell, sidebars SISAD, canvas y cambios funcionales.

## Archivos candidatos

Por pasada: `labRoutes.css`, `constants.ts` y máximo 3 componentes consumidores confirmados.

## Archivos prohibidos

`sisad-pdfme.css`, `tokens.css`, Renderer, Moveable, Selecto y PDF.

## Pasos

1. Ejecutar auditoría y elegir una región.
2. Mapear selector a consumidor y estados.
3. Migrar clases completas.
4. Eliminar CSS sin consumidor.
5. Repetir únicamente en una nueva pasada documentada.

## Validación

Conteo `@apply` antes/después, typecheck, lint, prueba focalizada y captura.

## Criterio de parada

Detenerse ante selector global, portal, keyframe, tercero o dependencia no identificada.

## Entrega final

Ledger de selectores migrados y excepciones CSS justificadas.

## Cierre (2026-07-15, Claude)

`src/features/pdfcomponent/labRoutes.css` quedó como entrypoint no-op (5 líneas,
0 `@apply`): todas las utilidades Tailwind del shell del lab ya viven inline en
los componentes JSX (PageHeader/PdfmeLabPage/CompactControls/ResultsPanel/
PopoverMenu). Verificado: `grep -c "@apply"` = 0. Objetivo cumplido.
