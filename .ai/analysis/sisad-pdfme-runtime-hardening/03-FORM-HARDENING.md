# Form hardening strategy

Canonical pipeline:

```text
mount
 -> hydrate template/inputs
 -> resolve active user
 -> resolve document
 -> resolve access/assignment
 -> render
 -> prefill/restore
 -> draft
 -> local mutation
 -> validate
 -> atomic transaction
 -> commit
 -> touched/dirty
 -> notify host
 -> reconcile revision
 -> completion
 -> Viewer/Snapshot/PDF
 -> dispose
```

Target transaction metadata:

```ts
type SchemaInputTransaction = {
  transactionId: string;
  unitIndex: number;
  schemaUid: string;
  schemaName: string;
  changes: Array<{ key: string; value: unknown }>;
  phase: 'draft' | 'commit';
  origin: 'user' | 'host' | 'prefill' | 'restore' | 'migration' | 'system';
  revision: number;
  touched?: boolean;
  timestamp: number;
};
```

Do not force full render per keystroke. Preserve caret, focus and IME composition.
