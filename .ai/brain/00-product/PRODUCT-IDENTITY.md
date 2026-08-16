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

`Recipient` may remain only where public compatibility requires it. New core authorities
must use `User`.

## Nomenclature

New product code uses `SisadPdfme*` / `SISAD-PDFME`.
Historical names remain temporarily only where removing them would break compatibility and
must be retired through evidence-backed migration tasks.

See [Product boundary](./PRODUCT-BOUNDARY.md).
