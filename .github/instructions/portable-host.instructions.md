---
applyTo: "src/sisad-pdfme/**,.ai/**,docs/**"
---

SISAD-PDFME is consumer-agnostic.

When changing integration/runtime behavior:

- do not introduce consumer product/module names or business routing semantics;
- use User, Document, host, runtimeSession, access projection and generic providers;
- prefer public facade contracts over deep imports;
- preserve session × user × document isolation;
- never serialize host credentials/secrets;
- update the PRT task/evidence that owns the change.
