# Host independence contract

## Invariant

SISAD-PDFME must remain usable by an arbitrary consumer without importing business
concepts from that consumer.

## Allowed host input

A host may provide:

```ts
type HostRuntimeProjection = {
  user?: UserResource | null;
  document?: DocumentResource | null;
  inputs?: unknown[];
  access?: SchemaAccessProjection;
  resources?: IntegrationResources;
  signatureContext?: SignatureRuntimeContext;
  runtimeSessionId?: string | null;
  hostReference?: string | null;
};
```

`hostReference` is opaque. The reusable never interprets it as routing, request state or a
business entity identifier.

## Forbidden core semantics

Do not add host-specific:

- workflow/routing modes;
- stages/positions;
- request status;
- notification policy;
- backend entity names;
- endpoint names;
- persistence table/DTO names.

## Consumer adapter

The adapter belongs to the consuming application.

```text
consumer model
    ↓
consumer-owned adapter
    ↓
public SISAD-PDFME contracts
```

## Gate

A portable consumer smoke must use public exports only. Deep imports from Canvas, Moveable,
Selecto, internal registries, private runtime stores or schema implementation files fail
the gate.
