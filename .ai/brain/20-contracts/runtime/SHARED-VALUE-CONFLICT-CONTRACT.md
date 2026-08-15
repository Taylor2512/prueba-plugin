# Shared value conflict contract

Un assignment multiusuario debe declarar el scope del valor:

```ts
type SchemaValueScope = 'shared' | 'per-user';
```

`per-user`:
cada execution mantiene valor aislado.

`shared`:
cambios concurrentes usan revision/transaction.

Dos commits incompatibles sobre el mismo schema producen:

```ts
type SchemaValueConflict = {
  schemaUid: string;
  executions: string[];
  revisions: number[];
  values: unknown[];
};
```

Nunca resolver por last-write accidental sin policy explícita.
