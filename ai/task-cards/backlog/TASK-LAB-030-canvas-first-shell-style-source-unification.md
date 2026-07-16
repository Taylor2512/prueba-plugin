# TASK-LAB-030 — Unificar fuente de estilos del shell canvas-first

## Objetivo

Eliminar conflictos entre estilos inline, Tailwind y CSS del shell del lab, conservando el diseño canvas-first y corrigiendo alturas y densidad inconsistentes.

## Alcance

- Header, contenedor principal y límites de sidebars.
- Resolver discrepancias de 44/48 px con una sola fuente.
- Mantener responsive y colapso existentes.

## Fuera de alcance

Contenido interno de sidebars, schemas, guías y migración completa de `labRoutes.css`.

## Archivos candidatos

Máximo 5: `PdfmeLabPage.tsx`, `PageHeader.tsx`, `labRoutes.css`, `constants.ts` y una prueba del shell.

## Archivos prohibidos

Renderer, Moveable, Selecto, snapshots, generator y PDF.

## Pasos

1. Inventariar medidas y clases duplicadas.
2. Elegir Tailwind JSX/TSX para layout estático y tokens para valores semánticos.
3. Eliminar solo reglas duplicadas confirmadas.
4. Verificar viewport de la captura y breakpoint estrecho.

## Validación

Typecheck, prueba del shell y capturas con sidebars abiertos/cerrados.

## Criterio de parada

Detenerse si el cambio exige alterar el contrato del canvas o más de 5 archivos.

## Entrega final

Mapa de fuentes de estilo antes/después y medidas finales.
