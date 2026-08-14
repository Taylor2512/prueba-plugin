# ADR RTP-005 — User/Recipient boundary

**Decision:** SISAD-PDFME adopta `User` como identidad interna de interacción. `Recipient`
permanece como concepto del host/compatibilidad temporal. La migración es staged y no
renombra todo el repositorio de una vez.

**Why:** evita filtrar routing/request semantics al reusable y separa active/assigned/audit
identity.
