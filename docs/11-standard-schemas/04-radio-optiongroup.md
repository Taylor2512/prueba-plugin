# RadioGroup / Opción

## Concepto

`Opción` crea un grupo lógico donde solo puede seleccionarse una opción.

## Comportamientos

- Botón `+` agrega opción al mismo grupo.
- El grupo tiene borde punteado.
- Cada opción tiene `optionId` estable.
- `selectedOptionId` solo puede apuntar a una opción existente.
- Duplicar grupo genera nuevo `groupId` y nuevos `optionId`.

## Form/Viewer/PDF

Form solo permite una opción. Viewer y PDF muestran solo la seleccionada.
