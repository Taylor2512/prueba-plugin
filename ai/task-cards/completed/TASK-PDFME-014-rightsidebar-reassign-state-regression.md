# TASK-PDFME-014 — Regresión de estado visual del botón Reasignar

## Estado

completed

## Objetivo

Asegurar que el botón `Reasignar` del RightSidebar se muestre solamente cuando corresponde y no desaparezca por pérdida de selección real.

## Condición esperada

Mostrar botón principal solo si:

```txt
assignment.enabled === true
visibility.actions.reassign === true
visibility.modals.assignment === true
selectedSchemaIds.length > 0
activeRecipient existe
canEditStructure !== false
hay recipients asignables
handler/controller disponible
```

## Tareas

- [x] Crear `resolveReassignActionState`.
- [x] Usarlo en `ListViewToolbar`.
- [x] Usarlo en menú `...` para mostrar acción deshabilitada con explicación cuando no hay selección.
- [x] Confirmar que owner accent no se confunde con selected state.
- [x] Agregar tests:
  - sin selección no muestra botón principal
  - con selección muestra botón
  - assignment disabled oculta botón
  - visibility reassign false oculta botón
  - activeRecipient missing oculta botón
  - cancelar modal conserva selección

## No hacer

- No crear modal paralelo.
- No pasar manualmente AssignmentDialog desde host.
- No duplicar recipients.
- No limpiar selección al cerrar modal.
