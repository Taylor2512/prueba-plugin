# ADR RTP-006 — Canonical User assignment index

**Decision:** la estructura reusable es
`userId -> documentId -> pageNumber -> schemaUid[]`; metadata de auditoría vive separada.
Los snapshots nuevos sólo usan la representación actual. Los migradores de formatos
pre-producción se eliminan después de migrar fixtures y tests.
