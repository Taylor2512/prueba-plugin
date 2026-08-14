# ADR RTP-007 — Form/Viewer/Snapshot/PDF value parity

Cada schema family tiene una semántica canónica de valor/empty/equality/serialization.
Form, Viewer, Snapshot y Generator consumen la misma semántica; no se crean parsers
paralelos ni truthiness shortcuts.
