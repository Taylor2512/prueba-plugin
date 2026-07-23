---
name: sisad-dry-refactoring
description: Audita y reduce duplicidad textual, estructural, de estado, contrato, UI, documentación y proceso en SISAD PDFME.
compatibility: Codex, GitHub Copilot y agentes compatibles con Agent Skills.
metadata:
  project: sisad-pdfme
  version: "4.0"
---

# SISAD DRY Refactoring

- Obtén baseline jscpd/knip y búsquedas por símbolo.
- Clasifica con `.ai/architecture/DUPLICATION-TAXONOMY.md`.
- Verifica semántica e invariantes antes de extraer.
- Elige función pura, composición, hook, Strategy, Factory/Registry, Adapter, Facade, State Machine o Command.
- Crea tests de caracterización.
- Migra consumidores y mide antes/después.
- Nunca excluyas código propio para ocultar clones.
