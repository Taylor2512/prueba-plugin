# Dynamic config change contract

Todo update produce:

```ts
type ConfigChangeSet = {
  previousRevision: number;
  revision: number;
  changedPaths: string[];
  affectedCapabilities: string[];
  effects: ConfigEffect[];
};
```

Cada capability declara su impacto:

```text
presentation
interaction
resource
schema-registry
runtime
generator
```

No clasificar toda una rama `canvas` como un único tipo de impacto.

Remount completo es último recurso y debe estar justificado por el effect plan.
