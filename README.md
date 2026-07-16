# Paquete — análisis profundo `src/features/pdfcomponent`

Este ZIP contiene un análisis y task-cards para convertir `src/features/pdfcomponent` en una referencia de integración dinámica de `sisad-pdfme`.

## Archivos principales

- `ai/reports/pdfcomponent-integration-deep-audit-2026-07-15.md`
- `ai/reports/pdfcomponent-integration-file-matrix.csv`
- `ai/checklists/pdfcomponent-dynamic-integration-checklist.md`
- `ai/prompts/codex-pdfcomponent-dynamic-integration-refactor.md`
- `scripts/audit-pdfcomponent-duplication.mjs`
- `ai/task-cards/active/TASK-LAB-017...TASK-LAB-025.md`
- `docs/07-integraciones/07-pdfcomponent-lab-as-host-reference.md`
- `docs/13-ejemplos/04-dynamic-host-integration-examples.md`

## Uso recomendado

1. Descomprimir sobre la raíz del repo.
2. Ejecutar `node scripts/audit-pdfcomponent-duplication.mjs`.
3. Ejecutar las tareas en orden: LAB-017 → LAB-018 → LAB-020 → LAB-021 → LAB-019.
4. No tocar `src/sisad-pdfme` salvo export público mínimo y justificado.
