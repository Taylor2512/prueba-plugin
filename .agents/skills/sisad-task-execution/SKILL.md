---
name: sisad-task-execution
description: Ejecuta una task-card SISAD PDFME de extremo a extremo con alcance, evidencia, gates y memoria delta.
compatibility: Codex, GitHub Copilot y agentes compatibles con Agent Skills.
metadata:
  project: sisad-pdfme
  version: "4.0"
---

# SISAD Task Execution

1. Lee la task-card y confirma DoR.
2. Carga una ruta y las skills aplicables.
3. Registra baseline y prior art.
4. Implementa sin ampliar alcance.
5. Ejecuta gates.
6. Revisa diff.
7. Actualiza sprint y memoria por delta.

No termines en análisis si puedes completar un cambio seguro. No inventes validaciones que no ejecutaste.
