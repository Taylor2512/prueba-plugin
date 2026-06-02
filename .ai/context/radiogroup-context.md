# Contexto — RadioGroup / Opción

## Flujo esperado

```txt
Opción -> crea radioGroup
radioGroup -> botón + -> agrega opción exclusiva
```

## Estado mínimo

```txt
type: radioGroup
options: [{ optionId, label, value, order }]
selectedOptionId?: string
defaultSelectedOptionId?: string
orientation: vertical | horizontal
spacing: number
__designer.group.groupId
__designer.group.groupType = radio
__designer.group.lockedAsGroup = true
```

## Reglas

- Solo una opción seleccionada.
- `selectedOptionId` debe pertenecer a `options`.
- Duplicar grupo crea nuevo `groupId` y nuevos `optionId`.
- Mover grupo conserva posiciones relativas.
- Snapshot conserva group metadata.
- Form/Viewer/PDF mantienen exclusividad.
