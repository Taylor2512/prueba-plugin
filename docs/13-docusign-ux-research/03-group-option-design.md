# Diseño de grupos de opciones/casillas

## RadioGroup

```txt
┌ - - - - - ┐
│  ◯ Opción │
│  ◯ Opción │
└ - - - - - ┘
     +
```

- Exclusivo: solo una opción seleccionada.
- `+` agrega option al mismo groupId.
- `selectedOptionId` es fuente de verdad.

## CheckboxGroup

```txt
┌ - - - - - ┐
│  ☐ Item   │
│  ☑ Item   │
└ - - - - - ┘
     +
```

- Multi-selección.
- `selectedOptionIds` es fuente de verdad.
- min/max selected valida Form y PDF.

## Selección

- Click en group root selecciona grupo.
- Options internas no son schemas.
- Botón `+` no es seleccionable.
