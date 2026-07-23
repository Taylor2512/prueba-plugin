---
name: sisad-canvas-safety
description: Protege geometría, selección, Moveable, Selecto, overlays y multipágina al modificar el Designer.
compatibility: Codex, GitHub Copilot y agentes compatibles con Agent Skills.
metadata:
  project: sisad-pdfme
  version: "4.0"
---

# Canvas Safety

Antes de editar, identifica sistema de coordenadas, paper root, scroll y zoom. Selección e inspección son independientes de edición. No uses z-index o timeouts para ocultar colisiones. Ejecuta Playwright focal en página 1 y página >1, paneles abiertos/cerrados y selección múltiple.
