---
name: sisad-inspector-contract
description: Consolida DetailView/ListView mediante contratos de widgets, property paths y access state canónico.
compatibility: Codex, GitHub Copilot y agentes compatibles con Agent Skills.
metadata:
  project: sisad-pdfme
  version: "4.0"
---

# Inspector Contract

Cada control visible debe declarar lectura, escritura, path, visibilidad, disabled, validación y layout. El inspector consume estado de acceso canónico; no infiere bloqueo por CSS. Comparte campos comunes por composición y perfiles de familia.
