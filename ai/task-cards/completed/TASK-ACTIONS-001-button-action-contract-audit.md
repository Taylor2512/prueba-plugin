# TASK-ACTIONS-001 — Auditoría completa de botones y acciones

- Estado: completed
- Agente principal: interaction-agent
- Fecha: 2026-07-15
- Scope: `src/sisad-pdfme`
- Tipo: implementación controlada

## Resumen

Auditar cada botón visible del diseñador y confirmar que todos tengan acción real, estado visible/enabled consistente, `aria-label`, `data-testid` y cobertura mínima. Esta tarea NO cambia lógica profunda; primero inventaría y reporta.

## Archivos foco

```txt
src/sisad-pdfme/ui/components/Designer/**/*.tsx
src/sisad-pdfme/ui/components/CtlBar.tsx
src/sisad-pdfme/ui/commands/**
src/sisad-pdfme/ui/components/Designer/shared/actionRegistry.ts
src/sisad-pdfme/ui/components/Designer/Canvas/overlays/**
scripts/audit-buttons-actions.mjs
reports/action-audit/**
```

## Pasos

```txt
1. Ejecutar `node scripts/audit-buttons-actions.mjs`.
2. Generar `reports/action-audit/button-action-inventory.md`.
3. Clasificar cada botón:
   - CONNECTED
   - MISSING_HANDLER
   - HIDDEN_BY_CONFIG
   - DISABLED_WITH_REASON
   - DUPLICATED_ACTION
   - VISUAL_ONLY_BUT_SHOULD_BE_BUTTON
4. Auditar áreas:
   - topbar/header
   - left sidebar
   - right sidebar
   - list view
   - detail view
   - canvas floating toolbar
   - canvas context menu
   - bottom zoom toolbar
5. Para cada botón registrar:
   - label visible
   - aria-label
   - data-testid
   - handler
   - command/action id
   - visibility source
   - disabled reason
   - permisos requeridos
6. No aplicar refactors hasta tener inventario.
```

## Criterios de aceptación

```txt
[ ] Existe `reports/action-audit/button-action-inventory.md`.
[ ] Todo botón tiene clasificación.
[ ] Todo botón sin handler queda listado con ruta exacta.
[ ] Todo botón duplicado queda listado con acción canónica sugerida.
[ ] No se modificó Canvas geometry/Moveable/Selecto.
```

## Validación

```bash
node scripts/audit-buttons-actions.mjs
npm run build
```

## Notas / guardrails

No crear wrappers ni nuevos menús. Esta task solo prepara inventario para la unificación.

## Cierre (2026-07-15, Claude)

- [x] Existe `reports/action-audit/button-action-inventory.md` (tabla cruda de
      237 candidatos + clasificación curada por área).
- [x] Todo botón clasificado (CONNECTED / HIDDEN_BY_CONFIG /
      DISABLED_WITH_REASON / DUPLICATED_ACTION); MISSING_HANDLER = 0 tras
      aplicar el contrato `missing-handler` en CtlBar y ListViewToolbar.
- [x] Duplicados listados con acción canónica (collapse handle vs rail; zoom
      select por densidad usa builder único).
- [x] Sin cambios en Canvas geometry/Moveable/Selecto.
- Validación: `node scripts/audit-buttons-actions.mjs` + `npm run build` exit 0.
