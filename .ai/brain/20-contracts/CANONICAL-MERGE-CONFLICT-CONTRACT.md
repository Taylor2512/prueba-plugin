# Canonical merge conflict contract

Un merge conflictivo NO produce simultáneamente un winner canónico.

Resultado:

```ts
type CanonicalMergeResult =
  | { status: 'ok'; values: Record<string, unknown>; acceptedDeltas: unknown[] }
  | { status: 'conflict'; conflicts: unknown[] };
```

Igualdad semántica viene de `SchemaValueCodec.equals`, no de `JSON.stringify` genérico.

Resolución de conflicto requiere policy/handler explícito.
