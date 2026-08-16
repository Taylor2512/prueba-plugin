---
name: sisad-portable-host-integration
description: Preserve SISAD-PDFME as a consumer-agnostic reusable platform and validate public host integration.
---

# SISAD portable host integration

Load only:

- product boundary;
- host independence contract;
- current portable task;
- public integration facade;
- nearest tests.

Rules:

- concrete consumer business semantics stay outside;
- use public APIs only;
- runtime scope is session × user × document;
- routing/workflow shape belongs to the host;
- no serialized secrets;
- no deep imports;
- prove Form/Viewer/Snapshot/PDF parity for the changed capability.
