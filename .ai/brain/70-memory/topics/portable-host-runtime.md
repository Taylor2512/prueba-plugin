# Portable host runtime

## Durable invariant

SISAD-PDFME receives a resolved execution context; it does not compute the consuming
application's business workflow.

Canonical isolation:

```text
runtimeSession × user × document
```

Canonical host boundary:

```text
consumer domain
→ consumer-owned adapter
→ User / Document / Inputs / Access / Resources / SignatureContext / opaque scope
→ SISAD-PDFME
```

When a requirement is discovered in a consumer, first ask whether it is a generic reusable
capability. Only the generic contract is allowed to enter this repository.
