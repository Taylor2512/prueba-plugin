# Decisiones arquitectónicas

## ADR-001 — `.ai` como fuente de verdad

Los adaptadores de proveedor apuntan a `.ai` y no duplican reglas largas.

## ADR-002 — Color activo vs ownerColor

El catálogo representa el destinatario activo; los schemas existentes representan su owner original.

## ADR-003 — Runtime canvas aislado

Moveable, Selecto, canvas, toolbar e inspector pertenecen al runtime `sisad-pdfme`.

## ADR-004 — Snapshot como contrato

El snapshot preserva identidad, documento, página, recipient, owner, color, rotation, comments y firma.
