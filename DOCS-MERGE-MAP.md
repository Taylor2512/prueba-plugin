# Mapa de integración del overlay

## Reemplazar o actualizar

```text
docs/07-integraciones/README.md
docs/07-integraciones/01-react.md
docs/07-integraciones/02-host-app.md
docs/07-integraciones/05-global-config.md
docs/07-integraciones/06-host-adapters.md
docs/07-integraciones/08-manual-portabilidad-sisad-pdfme.md
docs/07-integraciones/09-instancias-declarativas.md
docs/08-api-reference/07-sisad-pdfme-instance-api.md
docs/08-api-reference/08-events-actions-controller.md
docs/13-ejemplos/06-integracion-copy-paste.md
docs/12-troubleshooting/05-integracion-en-otro-proyecto.md
```

## Agregar

```text
docs/07-integraciones/10-implementacion-por-fases.md
docs/07-integraciones/11-checklist-consumer-project.md
reports/portability/DOCUMENTATION-GAP-AUDIT-V2.md
reports/portability/CURRENT-IMPLEMENTATION-GAPS-V2.md
.ai/prompts/PROMPT_CODEX_MEJORAR_DOCUMENTACION_IMPLEMENTACION_SISAD_PDFME_V2.md
.ai/scrum/task-cards/PORTDOC-001-auditar-api-publica.md
.ai/scrum/task-cards/PORTDOC-002-actualizar-ejemplos.md
.ai/scrum/task-cards/PORTDOC-003-consumer-test.md
.ai/scrum/task-cards/PORTDOC-004-gate-drift-documental.md
examples/consumer/**
```

## Gates

```bash
rg "configurePdfjsLegacyWorker" docs README*.md
rg "createRecipientsAdapter.*\{" docs
rg "createDocumentsAdapter.*\{" docs
node tools/ai-quality/check-markdown-duplicates.mjs
npm run build
```
