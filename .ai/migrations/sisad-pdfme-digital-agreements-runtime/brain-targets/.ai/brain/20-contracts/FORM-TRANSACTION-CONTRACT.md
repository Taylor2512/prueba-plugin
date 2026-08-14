# Form transaction contract

```ts
interface SchemaInputTransaction {
  transactionId: string;
  unitIndex: number;
  schemaName: string;
  schemaUid?: string;
  changes: Record<string, unknown>;
  phase: 'draft' | 'commit';
  origin: 'user' | 'host' | 'prefill' | 'restore' | 'migration' | 'system';
  revision: number;
  touched: boolean;
  timestamp: number;
}
```

Reglas:
- commit/mutation local antes de callback;
- patches multi-key atómicos;
- host push no reaparece como user event;
- stale revision no pisa draft nuevo;
- sibling B nunca revierte A;
- `setInputs` no remounta por defecto;
- `inputs=[]` y `inputs=undefined` tienen semántica distinta y testeada;
- DOM no es source-of-truth.
