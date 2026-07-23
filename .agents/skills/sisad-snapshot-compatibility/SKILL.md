---
name: sisad-snapshot-compatibility
description: Protege roundtrip, migración legacy y metadata desconocida en snapshots SISAD PDFME.
compatibility: Codex, GitHub Copilot y agentes compatibles con Agent Skills.
metadata:
  project: sisad-pdfme
  version: "4.0"
---

# Snapshot Compatibility

Caracteriza snapshots actuales y legacy. Define migrador, no contratos paralelos. Verifica documento, página, schemaUid, ownership, colors, groups, options, comments y `__designer`. Ejecuta serialize → parse → serialize y fixtures legacy.
