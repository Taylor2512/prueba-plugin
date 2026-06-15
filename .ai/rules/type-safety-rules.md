# Type Safety Rules

- No nuevos as any.
- Record<string, any> -> Record<string, unknown> si seguro.
- schema:any -> BaseSchema/SisadSchema si aplica.
- option:any -> OptionItem.
- Usar type guards.
- Usar discriminated unions.
