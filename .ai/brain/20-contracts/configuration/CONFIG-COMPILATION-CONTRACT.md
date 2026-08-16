# Config compilation contract

La configuración JSON pasa por una única pipeline:

```text
raw JSON
 -> validate
 -> normalize
 -> apply profile/defaults
 -> resolve capability graph
 -> freeze
-> ResolvedConfig
```

La configuración aceptada es la representación canónica actual. Los aliases
históricos no se migran en runtime; deben eliminarse de fixtures y consumers
antes de publicar.

`ResolvedConfig` incluye:

```ts
type ResolvedConfigMeta = {
  revision: number;
  semanticHash: string;
};
```

Los componentes productivos no interpretan defaults a mano.

## Estados separados

- policy/config: persistible;
- presentation defaults: persistibles;
- session/UI state: mutable de la instancia, no policy global.

No guardar funciones, DOM nodes, AbortControllers, Blobs ni live runtime objects dentro del JSON.
