# Contratos de datos

## Schema base

Campos críticos:

```txt
id
schemaUid
type
name
position
width
height
rotation
documentId
pageNumber
ownerRecipientId
ownerColor
required
readOnly
__designer
```

## Grupo lógico

```txt
groupId
groupType: radio | checkbox | visual
groupName
lockedAsGroup
options[]
optionId
selectedOptionId
selectedOptionIds
defaultSelectedOptionId
defaultSelectedOptionIds
```

## Reglas de preservación

- Crear schema genera identidad nueva.
- Convertir checkbox a checkboxGroup no cambia schemaUid.
- Duplicar grupo genera nuevo groupId y optionIds.
- Cambiar destinatario activo no cambia owner de schemas existentes.
- Snapshot debe reconstruir Designer/Form/Viewer/PDF igual.
