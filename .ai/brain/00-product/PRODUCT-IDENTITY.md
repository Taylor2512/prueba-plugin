# Product Identity — SISAD-PDFME

## Canon

- Name: **SISAD-PDFME**.
- Identity: standalone reusable platform for designing, filling, viewing, generating and
  transporting PDF documents using schemas, collaboration and declarative configuration.
- Historical origin: inspired by pdfme.
- Forbidden: describing the current product as merely a modified pdfme distribution.
- Boundary: consumer-agnostic. Concrete applications adapt to SISAD-PDFME; SISAD-PDFME
  does not adapt its core model to a named consumer.

## Public surfaces

```text
Designer
Form
Viewer
Generator
Snapshot
Integration API
Providers / adapters
```

## Canonical runtime vocabulary

Use generic product language:

- User;
- Document;
- runtimeSession;
- assignment;
- access projection;
- resource/provider;
- artifact;
- host / consumer.

`User` is the only core identity. Host adapters may translate an external
recipient-shaped input at the boundary, but the reusable core does not retain
Recipient compatibility semantics.

## Nomenclature

New product code uses `SisadPdfme*` / `SISAD-PDFME`.
Historical names are removed when the current source, fixtures, tests and docs
have been migrated. See [pre-production canonization](../30-decisions/ADR-PREPRODUCTION-CANONIZATION.md).

See [Product boundary](./PRODUCT-BOUNDARY.md).
