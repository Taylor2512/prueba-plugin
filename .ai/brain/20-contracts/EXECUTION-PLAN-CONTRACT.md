# Execution plan contract

ExecutionPlan es una primitive genérica de LAB/orquestación.

```ts
type ExecutionPlan = {
  id: string;
  stages: ExecutionStage[];
};

type ExecutionStage = {
  id: string;
  order: number;
  executions: ExecutionUnit[];
  completionPolicy: 'all' | 'any' | 'host';
};

type ExecutionUnit = {
  id: string;
  userId: string;
  documentIds: string[];
  runtimeSessionId: string;
  isolation: 'isolated-copy' | 'shared-document';
};
```

No introducir `sequential`, `parallel` o `massive` dentro de plugins/schemas.
Esos nombres describen shapes derivables del plan.
