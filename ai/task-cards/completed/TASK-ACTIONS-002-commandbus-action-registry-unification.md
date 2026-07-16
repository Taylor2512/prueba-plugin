# TASK-ACTIONS-002 — Unificar ActionRegistry y CommandBus para botones

- Estado: completed
- Agente principal: interaction-agent
- Fecha: 2026-07-15
- Scope: `src/sisad-pdfme`
- Tipo: implementación controlada

## Resumen

Crear un contrato único para acciones del diseñador, de modo que botones, context menu, toolbar flotante, DetailView y sidebars consuman el mismo estado de acción. Evita que un botón se vea activo pero no tenga acción real.

## Archivos foco

```txt
src/sisad-pdfme/ui/components/Designer/shared/actionRegistry.ts
src/sisad-pdfme/ui/commands/commandBus.ts
src/sisad-pdfme/ui/commands/designerCommands.ts
src/sisad-pdfme/ui/components/Designer/Canvas/overlays/canvasContextMenuActions.tsx
src/sisad-pdfme/ui/components/Designer/Canvas/overlays/CanvasContextMenu.tsx
src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/ListViewToolbar.tsx
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/**
```

## Pasos

```txt
1. Definir `DesignerActionDescriptor`.
2. Definir `DesignerActionContext`.
3. Crear `resolveDesignerActionState(actionId, context)`.
4. Mapear acciones existentes:
   - save
   - more
   - toggle-left-sidebar
   - toggle-right-sidebar
   - switch-right-panel-fields
   - switch-right-panel-detail
   - switch-right-panel-comments
   - switch-right-panel-documents
   - select-schema
   - open-properties
   - reassign-recipient
   - duplicate-schema
   - delete-schema
   - add-comment
   - hide-schema
   - lock-position
   - unlock-position
   - release-edit
   - bring-front
   - send-back
   - toggle-required
   - undo
   - redo
   - zoom-in
   - zoom-out
   - set-zoom
   - fit-to-page
5. Reemplazar condiciones sueltas por `resolveDesignerActionState`.
6. Mantener compatibilidad con handlers existentes.
7. Agregar logs solo bajo `debug.enabled`.
```

## Criterios de aceptación

```txt
[ ] Un botón visible sin handler no puede renderizarse.
[ ] Un botón deshabilitado muestra razón por tooltip/menu.
[ ] Reasignar usa el mismo action state en ListView, DetailView y context menu.
[ ] Lock/Unlock usa la semántica correcta: posición, no edición.
[ ] Zoom select muestra porcentaje, no decimal.
```

## Validación

```bash
npx vitest run tests/unit/sisad-pdfme/ui/actions
npm run build
```

## Notas / guardrails

No cambiar la geometría ni el comportamiento de selección. Unificar estado de acciones, no rediseñar canvas.

## Cierre (2026-07-15, Claude)

Implementado `designerActionState.ts`: `DesignerActionDescriptor`,
`DesignerActionContext`, `resolveDesignerActionState(actionId, context)` sobre
el ActionRegistry (alias kebab-case consolidados en
`actionRegistry.DESIGNER_ACTION_ALIASES` + `resolveActionDefinition`). Acciones
de chrome registradas (save/more/undo/redo/set-zoom/toggle-sidebars/
switch-right-panel-*/reassign-recipient/lock-position/unlock-position/
release-edit/select-schema/open-properties).

- [x] Un botón visible sin handler no puede renderizarse (razón
      `missing-handler`; adoptado en CtlBar y en el gating de Reasignar).
- [x] Un botón deshabilitado muestra razón (`describeDisabledReason` → title).
- [x] Reasignar usa el mismo action state: `resolveReassignActionState` delega
      en `resolveDesignerActionState('reassign-recipient')`; DetailView usa el
      mismo `canReassign`/accessState; context menu usa `contextMenuLockLabel`.
- [x] Lock/Unlock con semántica de posición ('Bloquear posición'; registry
      `lockToggle` corregido).
- [x] Zoom select muestra porcentaje (ver TASK-UI-016).
- Validación: `npx vitest run tests/unit/sisad-pdfme/ui/actions` (12 tests) +
  build exit 0. Sin cambios de geometría/selección.
