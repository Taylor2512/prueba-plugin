# TASK-QA-015 — Suite de regresión para acciones visibles

- Estado: active
- Agente principal: regression-tester
- Fecha: 2026-07-15
- Scope: `src/sisad-pdfme`
- Tipo: implementación controlada

## Resumen

Crear cobertura Playwright/Vitest para que cada botón crítico sea accionable y no vuelva a quedar como UI sin handler.

## Archivos foco

```txt
tests/playwright/action-contract-smoke.spec.ts
tests/playwright/sidebar-rail-collapse-actions.spec.ts
tests/playwright/zoom-toolbar-contract.spec.ts
tests/unit/sisad-pdfme/ui/actions/**
```

## Pasos

```txt
1. Crear helper de test para abrir `lab/multi-document-routing`.
2. Validar botones topbar:
   - Guardar
   - Más
3. Validar sidebars:
   - collapse/expand left
   - collapse/expand right
   - panel switcher
4. Validar canvas toolbar:
   - delete visible con selección
   - duplicate
   - more menu
5. Validar context menu:
   - duplicate
   - add comment
   - delete
   - lock/unlock position
   - open properties
6. Validar bottom toolbar:
   - undo/redo
   - zoom in/out/select
7. Todo botón con `data-testid` esperado.
```

## Criterios de aceptación

```txt
[ ] Si un botón existe, tiene handler.
[ ] Si no puede ejecutar, está disabled con tooltip/razón.
[ ] No hay botón `Más` ambiguo sin testId estable.
[ ] Zoom muestra porcentajes.
[ ] No se rompe canvas scroll.
```

## Validación

```bash
npx playwright test tests/playwright/action-contract-smoke.spec.ts
npx playwright test tests/playwright/sidebar-rail-collapse-actions.spec.ts
npx playwright test tests/playwright/zoom-toolbar-contract.spec.ts
npm run build
```

## Notas / guardrails

No usar clicks frágiles por texto duplicado. Preferir data-testid.
