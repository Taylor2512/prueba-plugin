# User completion contract

```ts
type UserCompletionProjection = {
  userId: string;
  requiredTotal: number;
  requiredCompleted: number;
  assignedTotal: number;
  assignedInteracted: number;
  validTotal: number;
  invalidTotal: number;
  pendingSchemaUids: string[];
  complete: boolean;
};
```

Sólo se consideran schemas accesibles y relevantes para ese User.

Un schema asignado exclusivamente a otro User no bloquea el completion actual.
