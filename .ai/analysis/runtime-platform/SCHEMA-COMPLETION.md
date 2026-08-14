# Schema completion analysis

## Separaciones obligatorias

```text
value
interaction
validation
completion
```

no son equivalentes.

Por schema se necesita poder proyectar:

- touched;
- dirty;
- committed;
- valid;
- completed;
- interactionCount;
- origin;
- revision;
- transactionId;
- initialValue;
- currentValue.

## Reglas

- prefill no implica touched;
- volver al valor inicial conserva touched y puede limpiar dirty;
- `0` no es vacío;
- `false` no es vacío por defecto;
- `[]` depende del codec/policy;
- visual/computed no se vuelven editables para poder "completarlos";
- un schema de otro User no bloquea completion del User activo;
- dependencies legítimas usan eventos `system`, no side effects ocultos.
