# Schema completion contract

```ts
type SchemaInteractionState = {
  schemaUid: string;
  schemaName: string;
  schemaType: string;
  userId?: string;
  documentId: string;
  runtimeSessionId: string;

  touched: boolean;
  dirty: boolean;
  committed: boolean;
  valid: boolean;
  completed: boolean;

  interactionCount: number;
  initialValue: unknown;
  currentValue: unknown;

  lastOrigin:
    | 'user'
    | 'host'
    | 'prefill'
    | 'restore'
    | 'migration'
    | 'system';

  revision: number;
  lastTransactionId?: string;
};
```

Completion se deriva de manifest + codec + validation + access + required + interaction kind.

Prohibido `Boolean(value)` como completion genérico.
