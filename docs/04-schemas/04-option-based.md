# Option-based schemas

Incluye:

- checkbox;
- checkboxGroup;
- radioGroup;
- select/dropdown.

## Regla clave

Las opciones internas de grupos no son schemas independientes.

```txt
Root del grupo -> data-schema-id
Option interna -> data-option-id
Botón +        -> data-role="group-add-option"
```
