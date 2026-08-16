# Product boundary — SISAD-PDFME

## Canon

SISAD-PDFME is a standalone reusable PDF platform.

It owns:

- Designer, Form and Viewer surfaces;
- schemas and schema families;
- document/page rendering;
- assignments and generic User ownership;
- runtime access projection;
- validation and completion projection;
- signatures, initials and generic artifacts;
- snapshots and deterministic PDF generation;
- transport-neutral data/resource adapters;
- generic host integration contracts.

It does **not** own or know:

- names of consuming products or application modules;
- business workflows or business routing modes;
- request lifecycle/status of a host product;
- notification channels;
- host-specific database entities;
- host-specific endpoints;
- business-specific policy names;
- host-specific persistence projections.

## Host rule

A consumer may translate its own domain into the public SISAD-PDFME contracts.

The reusable receives only generic runtime context:

```text
Host domain
   ↓ adapter
User + Document + Inputs + Access + Resources + SignatureContext + opaque scope
   ↓
SISAD-PDFME
```

The reverse dependency is forbidden.

## Design test

A new consumer must be able to integrate without editing internal SISAD-PDFME modules.

A new schema must not require changes in a consumer application to make the reusable
internally consistent.

## Naming rule

Do not introduce consumer product/module names into:

- `src/sisad-pdfme/**`;
- canonical `.ai/brain/**`;
- reusable contracts;
- reusable task acceptance criteria;
- reusable skills.

Consumer-specific integration notes belong in the consumer repository, not here.
