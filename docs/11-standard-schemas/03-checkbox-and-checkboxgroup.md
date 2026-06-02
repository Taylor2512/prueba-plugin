# Checkbox y CheckboxGroup

## Checkbox individual

Campo simple para check/uncheck. Puede convertirse a grupo con el botón `+`.

## Conversión a checkboxGroup

Al pulsar `+` en checkbox individual:

1. Cambia `type` a `checkboxGroup` mediante batch.
2. Crea al menos 2 opciones.
3. Migra estado marcado a `selectedOptionIds`.
4. Preserva identidad, owner, color, documento, página y posición.

## CheckboxGroup

Grupo multi selección con:

- `options[]`
- `selectedOptionIds[]`
- `minSelected/maxSelected`
- `groupId`
- `optionId`
- `lockedAsGroup`

## DetailView

Debe permitir editar nombre de grupo, opciones, orientación, spacing, min/max y estados required/readonly.
