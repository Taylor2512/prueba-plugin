# ADR RTP-006 — Canonical User assignment index

**Decision target:** después de characterization, la estructura reusable preferida es
`userId -> documentId -> pageNumber -> schemaUid[]`; metadata de auditoría vive separada.
Snapshot migrations preservan formatos anteriores explícitamente.
