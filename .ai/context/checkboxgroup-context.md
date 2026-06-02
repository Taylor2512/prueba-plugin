# Contexto — CheckboxGroup

## Flujo esperado

```txt
Casilla individual -> botón + -> checkboxGroup con 2 opciones
checkboxGroup -> botón + -> nueva casilla en el mismo grupo
```

## Estado mínimo

```txt
type: checkboxGroup
options: [{ optionId, label, value, order, checked? }]
selectedOptionIds: string[]
minSelected?: number
maxSelected?: number
orientation: vertical | horizontal
spacing: number
__designer.group.groupId
__designer.group.groupType = checkbox
__designer.group.lockedAsGroup = true
```

## Casos críticos

- Preservar estado marcado del checkbox original al convertir.
- Mantener `schemaUid`, owner, color, documentId, pageNumber y posición.
- Agregar opción sin solapamiento interno.
- No permitir `selectedOptionIds` apuntando a opciones eliminadas.
- Validar `minSelected/maxSelected`.
- Snapshot conserva opciones y selección.
- Form permite multiselección.
- Viewer/PDF muestran seleccionados.
