# Host participant / SISAD-PDFME user boundary

## Canon

SISAD-PDFME is a standalone reusable document platform. It does not know the business
entities, routing model, request model, notification model or persistence model of any host.

A host may have any external actor representation:
- person;
- signer;
- approver;
- reviewer;
- customer;
- employee;
- workflow actor;
- anonymous/session actor.

The host adapts that entity into a `SisadPdfmeUser`.

## Canonical SISAD-PDFME concept

```ts
type SisadPdfmeUser = {
  id: string;
  displayName: string;
  color?: string;
  role?: string;
  disabled?: boolean;
  capabilities?: {
    canEdit?: boolean;
    canSign?: boolean;
    canApprove?: boolean;
    canComment?: boolean;
    canEditStructure?: boolean;
  };
  hostReference?: {
    type: string;
    id: string;
  };
  metadata?: Record<string, unknown>;
};
```

`hostReference` is opaque. Core logic must not branch on its `type`.

## Internal identities

- active user: actor operating this runtime instance;
- assigned user: actor authorized/expected to interact with a schema;
- audit user: actor that created, changed or locked an object.

These identities may coincide but are not the same responsibility.

## Forbidden host leakage

Core must not require host concepts such as:
- routing order/stages;
- request/envelope state;
- notifications/channels;
- batch membership;
- backend identifiers unrelated to document interaction;
- host API DTOs.

## Legacy terminology

Existing `Recipient*`, `activeRecipientId`, `ownerRecipientId` symbols are migration debt.
They may remain as compatibility aliases while canonical internals move to `User*`.
