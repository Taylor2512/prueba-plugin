# Execution context contract

Unidad de aislamiento:

```ts
type RuntimeExecutionContext = {
  runtimeSessionId: string;
  activeUserId?: string | null;
  activeDocumentId: string;
  executionId?: string;
  stageId?: string;
  metadata?: Record<string, unknown>;
};
```

`runtimeSessionId`, `executionId` y `stageId` son opacos.

Mutable state se scopea por:

```text
runtimeSessionId × userId × documentId
```

No se indexa únicamente por template o schema name.
