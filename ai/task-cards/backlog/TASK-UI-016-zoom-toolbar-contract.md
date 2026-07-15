# TASK-UI-016 — Contrato de zoom y toolbar inferior

- Estado: backlog
- Agente principal: interaction-agent
- Fecha: 2026-07-15
- Scope: `src/sisad-pdfme`
- Tipo: implementación controlada

## Resumen

Corregir contrato de zoom para que la UI siempre muestre porcentaje y el estado interno use decimal. Centralizar zoomIn/zoomOut/setZoom/fit.

## Archivos foco

```txt
src/sisad-pdfme/ui/components/CtlBar.tsx
src/sisad-pdfme/ui/components/Designer/index.tsx
src/sisad-pdfme/ui/components/Designer/shared/actionRegistry.ts
tests/playwright/zoom-toolbar-contract.spec.ts
```

## Pasos

```txt
1. Crear helper `formatZoomPercent`.
2. Crear helper `parseZoomPercent`.
3. Trigger debe mostrar 90%, no 0.9.
4. Opciones deben mapear a decimales internos.
5. Botones +/- deben usar ActionRegistry.
6. Agregar data-testid:
   - designer-zoom-select
   - designer-zoom-in
   - designer-zoom-out
   - designer-fit-page
```

## Criterios de aceptación

```txt
[ ] Zoom visible siempre es porcentaje.
[ ] Seleccionar 125% actualiza canvas.
[ ] +/- respetan límites.
[ ] No se toca transform geometry directamente.
```

## Validación

```bash
npx playwright test tests/playwright/zoom-toolbar-contract.spec.ts
npm run build
```

## Notas / guardrails
