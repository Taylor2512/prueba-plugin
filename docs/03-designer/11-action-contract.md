# Contrato de acciones del Designer

## Objetivo

Garantizar que cada botón visible del diseñador invoque una acción real y que todos los componentes consuman la misma fuente de verdad para visibilidad, permisos y estado.

## Principios

```txt
feature enabled != action visible != action enabled
```

- `feature enabled`: la capacidad existe.
- `action visible`: el usuario ve el botón/opción.
- `action enabled`: el usuario puede ejecutarla ahora.
- `disabledReason`: explica por qué no se puede ejecutar.

## API recomendada

```ts
type DesignerActionState = {
  id: string;
  visible: boolean;
  enabled: boolean;
  disabledReason: string | null;
  label: string;
  ariaLabel: string;
  testId: string;
};
```

## Reglas

- Un botón sin handler no se renderiza.
- Un botón icon-only requiere tooltip.
- Un botón deshabilitado requiere razón.
- Las acciones que modifican schema pasan por CommandBus o servicio central.
- Reasignar usa RecipientRegistry y schemaAssignmentService.
- Lock/Unlock usa estado de acceso central.

## Acciones críticas

- save
- reassign-recipient
- duplicate-schema
- delete-schema
- add-comment
- lock-position
- unlock-position
- release-edit
- open-properties
- undo/redo
- zoom-in/out/set
