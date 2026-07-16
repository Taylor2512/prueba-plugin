# TASK-QA-017 — Deriva de specs: panel Docs por defecto + rename del switcher

- Estado: backlog
- Tipo: regression (suite de tests)
- Origen: TASK-LAB-029 (docs default en multidocumento, completada) + rename de
  clase del panel-switcher en RightSidebar (TASK-REGRESSION-021, activa).

## Síntoma

En `/lab/multi-document-routing` el panel derecho abre en **Docs** por defecto
(`aside[data-panel-mode="docs"]`), por lo que la lista de Campos no se monta y
tres specs quedan rojos por buscar elementos del panel Campos sin cambiar de
pestaña primero:

- `tests/playwright/list-view-regression.spec.ts` — `.sisad-pdfme-designer-list-view` no visible.
- `tests/playwright/detail-view-options-listview.spec.ts` — `right-sidebar-field-list` / `detail-options-section` no encontrados.
- `tests/playwright/right-sidebar-visual-polish.spec.ts` — además el switcher pasó de
  `bg-gradient-to-b` a `bg-[linear-gradient(...)]`; la aserción `toHaveClass(/bg-gradient-to-b/)`
  quedó desactualizada.

## Causa

No es regresión de producto: es deriva de la suite frente a dos cambios ya
integrados/en curso (docs default + skin del switcher). El render de la lista y
los testids del ListView están intactos (verificado: al seleccionar la pestaña
"Abrir panel Campos" se montan las 11 filas con `right-sidebar-field-list`,
`right-sidebar-field-label`, `right-sidebar-field-technical-name`).

## Acción propuesta

1. En las specs de ListView, seleccionar la pestaña Campos (`getByRole('tab',
   { name: 'Abrir panel Campos' }).click()`) antes de asertar la lista.
2. Actualizar la aserción del switcher en `right-sidebar-visual-polish` al skin
   vigente (`bg-[linear-gradient(...)]`) — coordinar con el dueño de
   TASK-REGRESSION-021 para congelar el contrato de clase.

## Validación

- `npx playwright test tests/playwright/list-view-regression.spec.ts tests/playwright/detail-view-options-listview.spec.ts tests/playwright/right-sidebar-visual-polish.spec.ts`
