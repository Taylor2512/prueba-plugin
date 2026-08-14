# Execution result contract

```ts
type RuntimeExecutionResult = {
  runtimeSessionId: string;
  userId?: string;
  documentIds: string[];
  completion: unknown;
  snapshot: unknown;
  pdfArtifacts: unknown[];
  errors: unknown[];
};
```

Una execution aislada produce su propio resultado.
Fan-out masivo produce una colección de `RuntimeExecutionResult`, no un mutable state común.
