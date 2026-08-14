# Capability registry contract

`CapabilityRegistry` es la autoridad conceptual.

Los registries existentes de features, actions y components deben evolucionar a proyecciones
o adapters del mismo grafo, no a fuentes paralelas.

Cada definición declara como mínimo:

```ts
{
  id,
  surfaces,
  defaultEnabled,
  dependencies,
  impacts,
  resolve
}
```

UI button, keyboard shortcut, context menu y public controller consultan el mismo state.
