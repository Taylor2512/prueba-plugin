# TASK-ACTIONS-002 — Unificar ActionRegistry y CommandBus para botones

- Estado: active
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
