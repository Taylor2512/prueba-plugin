# TASK-DETAIL-015 — Sincronizar estados de acceso y labels del inspector

- Estado: active
- Agente principal: inspector-agent
- Fecha: 2026-07-15
- Scope: `src/sisad-pdfme`
- Tipo: implementación controlada

## Resumen

Cerrar la segunda pasada de estados de acceso para evitar labels paralelos. `statusLabel/statusTone` deben ser la fuente única para DetailHeader, SchemaCollaborationWidget, ListView y context menu.

## Archivos foco

```txt
src/sisad-pdfme/ui/collaboration/schemaRuntimeAccess.ts
src/sisad-pdfme/ui/components/Designer/shared/schemaInteractionState.ts
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailHeaderUtils.ts
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaCollaborationWidget.tsx
src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/Item.tsx
src/sisad-pdfme/ui/components/Designer/Canvas/overlays/**
tests/unit/sisad-pdfme/ui/components/Designer/shared/schemaInteractionState.test.ts
tests/playwright/schema-lock-state-consistency.spec.ts
```

## Pasos

```txt
1. Hacer `inspectorStatusLabel = statusLabel`.
2. Hacer `inspectorStatusTone = statusTone`.
3. Cambiar `contextMenuLockLabel`:
   - sin object lock: Bloquear posición
   - con object lock: Desbloquear posición
   - lock mío: Liberar edición
   - lock otro: Bloqueado por X
4. `collaborationLock === unknown` debe decir `Bloqueo sin responsable`, no `Bloqueado`.
5. Mantener alias legacy solo como alias directo:
   - isObjectLocked = objectLocked
   - isReadonly = readonly
   - canEdit = canEditProperties
6. Reforzar tests unitarios.
7. Agregar data-testid al menú contextual para Playwright si falta.
```

## Criterios de aceptación

```txt
[ ] No aparece `Bloqueado para edición`.
[ ] Object lock se muestra como `Posición bloqueada`.
[ ] Menú dice `Bloquear posición`, no `Bloquear edición`.
[ ] Reasignar no se bloquea por objectLocked.
[ ] Lock de otro sí bloquea edición/reasignación.
[ ] Lock mío muestra `En edición por ti`.
```

## Validación

```bash
npx vitest run tests/unit/sisad-pdfme/ui/components/Designer/shared/schemaInteractionState.test.ts
npx playwright test tests/playwright/schema-lock-state-consistency.spec.ts
npm run build
```

## Notas / guardrails

No tocar recipients ni SnapshotAdapter. Esta tarea solo sincroniza consumo de estados.

## Cierre (2026-07-15, Claude)

- [x] `inspectorStatusLabel = statusLabel` e `inspectorStatusTone` derivado del
      mismo `statusTone` (fuente única en `resolveSchemaAccessState`; se corrigió
      además un ReferenceError de `statusTone` fuera de scope).
- [x] `contextMenuLockLabel`: sin object lock → 'Bloquear posición'; con →
      'Desbloquear posición'; lock mío → 'Liberar edición'; lock de otro →
      'Bloqueado por X'. Fallback del menú contextual corregido.
- [x] `collaborationLock === 'unknown'` → 'Bloqueo sin responsable' (interaction
      state y access state).
- [x] Alias legacy directos: `isObjectLocked`/`isReadonly`/`canEdit` en ambos
      contratos.
- [x] No aparece 'Bloqueado para edición' (grep = 0). Object lock se muestra
      como 'Posición bloqueada'. Reasignar no se bloquea por objectLocked
      (`canReassign` ignora objectLocked); lock de otro sí bloquea.
- Validación: `schemaInteractionState.test.ts` (11) +
  `schemaRuntimeAccess.test.ts` (11) + e2e
  `schema-lock-state-consistency.spec.ts` en verde. Build exit 0.
