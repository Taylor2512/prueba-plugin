# TASK-LAB-026 — Restore designer visual baseline after integration

**Estado:** completed

## Objetivo
Restaurar el layout base del diseñador `sisad-pdfme` después de la refactorización dinámica del lab, manteniendo la integración por datos/configuración y sin tocar geometría, zoom, Moveable ni Selecto.

## Alcance
- Auditar qué reglas del lab están afectando el layout interno del designer.
- Aislar cualquier CSS del lab que invada el subtree del diseñador.
- Normalizar un preset visual por defecto para preservar el layout clásico de 3 paneles.
- Hacer que el lab use ese preset por defecto sin duplicar recipients/documents/template.
- Mantener los wrappers públicos `SisadPdfmeDesigner`, `SisadPdfmeForm` y `SisadPdfmeViewer`.
- Agregar regresión Playwright para el baseline visual del diseñador en `/lab/multi-document-routing`.

## Fuera de alcance
- No reabrir task-cards completadas.
- No tocar `Moveable`.
- No tocar `Selecto`.
- No tocar zoom math.
- No tocar geometría del canvas.
- No usar `z-index` arbitrario.
- No resolver con CSS global sobre clases internas desde `labRoutes.css`.
- No volver a usar `DesignerEngineBuilder` ni `usePdfmeRuntimeInstance` en `PdfmeLabPage`.

## Archivos candidatos
- `src/features/pdfcomponent/PdfmeLabPage.jsx`
- `src/features/pdfcomponent/hooks/usePdfmeLabIntegration.ts`
- `src/features/pdfcomponent/integration/createLabPdfmeConfig.ts`
- `src/features/pdfcomponent/labRoutes.css`
- `src/sisad-pdfme/config/SisadPdfmeConfig.ts`
- `src/sisad-pdfme/config/defaultSisadPdfmeConfig.ts`
- `src/sisad-pdfme/config/resolveSisadPdfmeConfig.ts`
- `src/sisad-pdfme/ui/components/Designer/shared/designerUiConfig.ts`
- `src/sisad-pdfme/ui/components/Designer/shared/visibilityConfig.ts`
- `tests/playwright/lab-designer-visual-baseline-regression.spec.ts`

## Archivos prohibidos
- `Moveable`
- `Selecto`
- cálculo de zoom
- geometría del canvas

## Pasos
1. Auditar el CSS del lab y localizar reglas que afecten el subtree interno del designer.
2. Eliminar o aislar selectores del lab que afecten catálogos, sidebars internas, canvas o rails.
3. Extender la configuración pública con preset visual/layout y densidad por defecto.
4. Normalizar `createLabPdfmeConfig` para usar `classic-designer` + `three-panel` + `comfortable`.
5. Asegurar que `PdfmeLabPage` solo controle shell externo y artefactos.
6. Verificar que recipients/documents/template se registren una sola vez.
7. Crear regresión Playwright del layout base del diseñador.
8. Validar con build y Playwright.

## Validación
- `npm run build`
- `npx playwright test tests/playwright/lab-designer-visual-baseline-regression.spec.ts`

## Criterio de parada
Detenerse si el arreglo exige tocar geometría, zoom, Moveable o Selecto, o si hace falta más de 5 archivos de implementación fuera del shell/config.

## Entrega final
Baseline del diseñador restaurado en `/lab/multi-document-routing` sin romper la integración dinámica ni duplicar datos de runtime.

## Cierre
- El lab vuelve a abrir en `data-ux-mode="default"` por defecto, preservando el baseline clásico de 3 paneles.
- Se agregó regresión Playwright para validar baseline visual, docs tab y paneles laterales.

## Seguimiento P0 (2026-07-15, Claude) — CSS base + regresiones del preset

Causa raíz confirmada del layout roto: al migrar el lab a los wrappers públicos
se perdió el side-effect de `@sisad-pdfme/ui` que cargaba el CSS base.

Correcciones:
1. `src/sisad-pdfme/react/index.ts` importa `tokens.css` + `sisad-pdfme.css`
   (wrapper público visualmente autocontenido).
2. `createLabPdfmeConfig` declara `theme`/`sidebars`/`canvas` explícitos
   alineados con el preset `classic-designer`.
3. Adapter de documentos: el resolver usaba una copia local que PERDÍA
   `template`/`name` → canvas en `empty_page` sin schemas. Unificado a los
   adapters compartidos (`SisadPdfmeDocument` ahora transporta `template`).
4. Preset: valores INICIALES, no controlados (`sidebarOpenControlled: false`;
   `defaultPanel 'fields'` → `'auto'` para conservar el auto-switch a Detalle).
5. `--sisad-pdfme-rs-width` se publica desde el Designer con el ancho REAL
   resuelto en JS (el token estático dejaba el CtlBar bajo el sidebar).
6. CtlBar honra `density` explícito (incl. comfortable) y umbrales de ancho
   ajustados al área con sidebars reservados (1000/720).
7. Shell del lab: `.sisad-pdfme-lab-page` max-width 100% + overflow-x clip
   (overflow del documento venía del shell); reparado el `@layer components`
   sin directivas `@tailwind` que rompía PostCSS (500) tras la conversión
   Tailwind del archivo.
8. Specs actualizados al contrato multi-página real (17 papers): máscara
   por-página es diseño; lo prohibido es enmascarar el canvas completo o la
   página objetivo; selección múltiple es por página.

Validación: 27+ tests e2e en verde (baseline visual 2, freeze 4,
canvas-interactions 3, checkbox 2, detail-view 6, parity/rail/smoke/zoom/lock,
overflow, drag-preview), 288 unit tests de las suites tocadas, build exit 0.
