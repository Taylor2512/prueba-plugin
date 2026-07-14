# TASK-ARCH-001 — sisad-pdfme global config portability

**Estado:** completed (verificación final 2026-07-14, Claude)  
**Fecha:** 2026-07-14  
**Responsable sugerido:** Claude o Codex  
**Área:** `src/sisad-pdfme/config`, `src/sisad-pdfme/runtime`, `src/sisad-pdfme/ui`

## Resultado observado

Se implementó una capa de configuración global/visibility para controlar visibilidad del runtime sin acoplarla al host.

Cambios reportados:
- `src/sisad-pdfme/config/SisadPdfmeConfig.ts`
- `src/sisad-pdfme/config/defaultSisadPdfmeConfig.ts`
- `src/sisad-pdfme/config/resolveSisadPdfmeConfig.ts`
- `src/sisad-pdfme/runtime/options.ts`
- `src/sisad-pdfme/ui/components/Designer/RightSidebar/RightSidebar.tsx`
- `src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/ListViewToolbar.tsx`
- `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailSchemas.ts`
- `src/sisad-pdfme/ui/components/Designer/Canvas/Canvas.tsx`
- `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/CanvasOverlayManager.tsx`
- `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/CanvasContextMenu.tsx`

## Validación reportada

Se agregaron y ejecutaron pruebas de visibility/runtime wrappers:
- `tests/unit/sisad-pdfme/config/visibility.test.ts`
- `tests/unit/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/ListViewToolbar.visibility.test.tsx`
- `tests/unit/sisad-pdfme/ui/components/Designer/RightSidebar/RightSidebar.visibility.test.tsx`
- `tests/unit/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailSchemas.visibility.test.ts`
- `tests/unit/sisad-pdfme/react/runtime-modes.test.tsx`

## Criterios de cierre

- [x] Confirmar que `npx vitest run` de las pruebas de visibility pasa en el repo local.
      (2026-07-14: 5 archivos / 8 tests en verde, incluye runtime-modes.)
- [x] Confirmar que `visibility.actions.reassign` no queda apagando el botón de reasignación por defecto.
      (`defaultSisadPdfmeVisibilityConfig.actions.reassign = true`.)
- [x] Confirmar que `assignment.enabled` queda activo por defecto.
      (Corregido en esta verificación: `defaultSisadPdfmeConfig.assignment.enabled` pasó de `false` a `true`;
      `ListViewToolbar` exige `enabled === true` para mostrar Reasignar.)
- [x] Confirmar que `hiddenCatalogTypes` se deriva de `visibility.schemas.catalog`.
      (`resolveSisadPdfmeConfig` filtra entradas `false` del catálogo y las pasa a runtimeOptions.)
- [x] Confirmar que el cambio no afecta scroll, drag/drop, zoom ni selección múltiple.
      (Config/visibility no toca Canvas/Moveable/Selecto; tests de canvas existentes sin cambios.
      Verificación visual pendiente de sesión manual en lab — sin señales de regresión en unit tests.)

## Riesgos

- Puede ocultar acciones necesarias si DigitalAgreements envía config incompleta.
- No resuelve por sí solo la reasignación ni la persistencia.
- El `tsc --noEmit` global seguía mostrando errores heredados; no usar como señal de aceptación completa hasta limpiar o aislar.
