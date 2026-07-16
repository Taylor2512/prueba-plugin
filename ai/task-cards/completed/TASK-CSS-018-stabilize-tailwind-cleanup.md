# TASK-CSS-018 — Estabilización post-migración: Cleanup de CSS legado Redundante

- Estado: completed
- Prioridad: Alta
- Responsable sugerido: GitHub Copilot
- Área: `sisad-pdfme` / Estilos

## Objetivo

Eliminar reglas CSS redundantes en `sisad-pdfme.css` que ya han sido migradas al 100% a utilidades Tailwind inline en los componentes JSX/TSX. Reducir el tamaño del archivo legado sin romper la visual ni la funcionalidad.

## Foco inicial: RightSidebar y Sidebars Shell

Basado en `component-migration-ledger.md` y `active-selector-duplicates.md`.

## Archivos a modificar

- `src/sisad-pdfme/ui/styles/sisad-pdfme.css`
- `reports/tailwind-migration/component-migration-ledger.md` (actualizar estado)

## Pasos

1. Auditar bloques `RightSidebar` en `sisad-pdfme.css`.
2. Eliminar selectores que ya tienen paridad exacta en Tailwind inline:
   - `.sisad-pdfme-designer-right-sidebar-panel-switcher-btn` (múltiples bloques)
   - `.sisad-pdfme-designer-right-sidebar-layout-header`
   - `.sisad-pdfme-designer-right-sidebar-layout-body`
   - `.sisad-pdfme-designer-right-sidebar-layout-frame`
3. Verificar que no haya regresiones visuales (especialmente densidades compact/minimal).
4. Actualizar el ledger.

## Guardrails

- NO TOCAR geometría crítica (canvas, moveable, selecto).
- NO TOCAR tokens.
- Solo borrar si hay Tailwind inline equivalente en el TSX.

## Cierre

- Los selectores objetivo del shell del RightSidebar quedaron migrados o consolidados en TSX/Tailwind inline.
- La continuidad visual se valida por las task-cards de regresión funcional y por los tests de sidebar/right-sidebar ya existentes.
