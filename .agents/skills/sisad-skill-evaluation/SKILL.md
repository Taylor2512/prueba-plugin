---
name: sisad-skill-evaluation
description: Evalúa triggers, costo, precisión y solapamiento de skills para mantener un catálogo pequeño y efectivo.
compatibility: Codex, GitHub Copilot y agentes compatibles con Agent Skills.
metadata:
  project: sisad-pdfme
  version: "4.0"
---

# Skill Evaluation

- Define casos positivos, negativos y ambiguos.
- Verifica que la descripción dispare solo cuando corresponde.
- Compara salida con/sin skill usando el mismo task.
- Mide tokens, calidad, gates y retrabajo.
- Fusiona skills solapadas y elimina las que no mejoran resultados.
