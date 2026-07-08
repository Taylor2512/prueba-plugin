# Valores

Los valores deben indexarse por `schemaUid`.

Ejemplo:

```ts
type Values = Record<string, unknown>;
```

Nunca depender solo de `name` o `label`, porque pueden repetirse o cambiar visualmente.
