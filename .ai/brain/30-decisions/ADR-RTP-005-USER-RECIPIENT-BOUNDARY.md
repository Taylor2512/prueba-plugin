# ADR RTP-005 — User/Recipient boundary

**Decision:** SISAD-PDFME adopta `User` como única identidad interna de interacción.
`Recipient` sólo puede existir en un adapter de entrada del host y no forma parte
del core reusable. No se conservan aliases por compatibilidad hipotética.

**Why:** evita filtrar routing/request semantics al reusable y separa active/assigned/audit
identity. La migración pre-producción puede ser breaking; Git conserva la historia.
