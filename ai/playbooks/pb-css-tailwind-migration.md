# Playbook — Migración CSS a Tailwind inline

## Objetivo

Reducir CSS moviendo estilos seguros a JSX/TSX con Tailwind.

## Pasos

1. Leer `ai/rules/css-migration-rules.md`.
2. Ejecutar `node scripts/css-inventory.mjs`.
3. Elegir una sola zona:
   - Lab shell
   - LeftSidebar
   - RightSidebar
   - DetailView
   - ListView
   - Canvas overlays no geométricos
4. Migrar a Tailwind inline solo clases visuales.
5. No tocar geometry, zoom, Moveable, Selecto, paper/canvas.
6. Actualizar `reports/tailwind-migration/component-migration-ledger.md`.
7. Correr pruebas o baseline visual.
8. Reportar reglas CSS eliminadas y reglas conservadas.

## Cierre

- No aumenta CSS.
- No hay doble Tailwind.
- No se rompe canvas ni runtime.
