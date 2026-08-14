# Config compilation contract

La configuración JSON pasa por una única pipeline:

```text
raw JSON
 -> migrate
 -> validate
 -> normalize
 -> apply profile/defaults
 -> resolve capability graph
 -> freeze
 -> ResolvedConfig
```

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
