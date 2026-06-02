# DetailView y ListView — casos de uso

## DetailView debe distinguir

- Schema individual.
- Grupo lógico.
- Opción interna.
- Selección múltiple.

## CheckboxGroup

Mostrar:

- Identidad del grupo.
- Destinatario/owner.
- Opciones editables.
- Required/min/max.
- Caja X/Y/W/H.
- Avanzado colapsado con IDs.

## ListView

Debe evitar lista plana confusa. Preferible:

```txt
▾ beneficios · Grupo de casillas · 3 opciones
  ├ Décimos
  ├ Fondos
  └ Vacaciones
```

Si no hay anidación, mostrar badge:

```txt
beneficios · Grupo de casillas · 3 opciones · Cliente Principal
```
