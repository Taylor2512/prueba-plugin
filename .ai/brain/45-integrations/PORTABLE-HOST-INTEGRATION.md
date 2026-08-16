# Portable host integration

## Goal

Integrate SISAD-PDFME into any React/JavaScript host through public APIs only.

## Architecture

```text
consumer application
        │
        ├─ domain / routing / persistence / authorization
        │
        ▼
consumer-owned adapter
        │
        ├─ User
        ├─ Document
        ├─ Inputs
        ├─ AccessProjection
        ├─ SignatureContext
        ├─ IntegrationResources
        └─ opaque scope
        ▼
SISAD-PDFME
        │
        ├─ Designer
        ├─ Form
        ├─ Viewer
        ├─ Snapshot
        └─ PDF / Artifacts
```

## Constraints

- no consumer business branches in Form;
- no consumer routing modes in reusable runtime;
- no deep imports from internal UI/runtime;
- no serialized secrets;
- no mandatory Axios/fetch brand;
- no host CSS reaching into private canvas internals;
- deterministic restore and generation from canonical state.

## Distribution gate

A minimal external fixture must be able to import the public facade, configure a generic
host, edit values, snapshot, restore, render Viewer and generate PDF without internal
imports.
