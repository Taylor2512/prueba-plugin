# Optimistic concurrency contract

El store no acepta una `revision` arbitraria como verdad del cliente.

Commit:

```ts
commit({
  expectedRevision,
  scope,
  schemaUid,
  value,
  executionId
})
```

Regla:

```text
storedRevision === expectedRevision
  -> accept
  -> store assigns next revision

otherwise
  -> explicit conflict
```

Shared values usan una identidad lógica compartida de documento/scope independiente de la
sesión efímera de cada Form.

El store expone cleanup por scope/document/instance.
