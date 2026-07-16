# TASK-CSS-021 — Corregir overflow y densidad del sidebar izquierdo

## Objetivo

Eliminar solapamientos visibles en cabecera, tabs, filtros y selector de layout del sidebar izquierdo, migrando su layout estático a JSX/TSX.

## Alcance

- Cabecera, búsqueda, tabs, filtros y selector lista/tarjetas/iconos.
- Overflow horizontal, truncado y focus-visible.
- Clases estáticas en componentes propietarios.

## Fuera de alcance

Catálogo completo, drag al canvas, grupos internos y borrado global de CSS.

## Archivos candidatos

Máximo 5 componentes: `LeftSidebar.tsx`, tabs, search, filtros y layout toggle; confirmar nombres reales.

## Archivos prohibidos

Renderer, canvas, DocumentsRail, snapshot, generator y PDF.

## Pasos

1. Reproducir con ancho de la captura y breakpoint mínimo.
2. Detectar `min-width`, nowrap y posicionamiento conflictivos.
3. Migrar flex/grid/gap/overflow a JSX/TSX.
4. No podar CSS global hasta una tarjeta posterior.

## Validación

Capturas normal/estrecha, navegación por teclado, typecheck y pruebas del sidebar.

## Criterio de parada

Detenerse si la corrección depende del DOM del canvas o de más de 5 componentes.

## Entrega final

Medidas, estados y capturas antes/después.
