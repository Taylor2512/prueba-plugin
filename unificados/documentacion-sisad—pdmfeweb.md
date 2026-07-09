# Contexto para IA — Documentación Markdown

> Generado con `ai-context-pack.mjs v1.2.0`.

## Cómo usar este archivo con un proveedor de IA

- Usa las rutas relativas como referencia; no asumas archivos que no estén listados.
- Prioriza la tabla de archivos y los símbolos antes de proponer cambios.
- Cuando sugieras modificaciones, menciona la ruta exacta del archivo afectado.
- Los secretos, tokens y cadenas largas se redactan automáticamente salvo que se use `--no-redact`.

## Metadatos

- **Carpeta base:** `prueba-plugin`
- **Perfil:** `docs`
- **Modo:** `compact`
- **Fecha generación:** `2026-07-09T03:22:39.516Z`
- **Extensiones incluidas:** `.md, .mdx`
- **Archivos candidatos incluidos:** `217`
- **Límite por archivo:** `120 KB`
- **Límite total de contenido:** `1800 KB`

## Estructura incluida

```text
prueba-plugin
├── .github
│   └── copilot-instructions.md
├── .tailwind-migration-backups
│   └── 20260708-111736
│       └── reports
│           └── tailwind-migration
│               └── README.md
├── AGENTS.md
├── ai
│   ├── adapters
│   │   └── README.md
│   ├── agents
│   │   ├── canvas-agent.md
│   │   ├── css-tailwind-agent.md
│   │   ├── designer-runtime-agent.md
│   │   ├── docs-architecture-agent.md
│   │   ├── inspector-agent.md
│   │   ├── interaction-agent.md
│   │   ├── lab-shell-agent.md
│   │   ├── README.md
│   │   ├── registry.md
│   │   ├── schema-agent.md
│   │   ├── snapshot-agent.md
│   │   └── visual-baseline-agent.md
│   ├── baselines
│   │   ├── img-version-baseline-protocol.md
│   │   └── README.md
│   ├── checklists
│   │   ├── done-vs-pending.md
│   │   ├── global-validation.md
│   │   ├── improvement-backlog.md
│   │   ├── manual-ui-regression.md
│   │   ├── README.md
│   │   └── tailwind-migration.md
│   ├── context
│   │   ├── ai-docs-context.md
│   │   ├── canvas-multipage-context.md
│   │   ├── css-tailwind-context.md
│   │   ├── inspector-context.md
│   │   ├── README.md
│   │   ├── schema-families-context.md
│   │   ├── selection-transform-context.md
│   │   ├── snapshot-context.md
│   │   └── visual-baseline-context.md
│   ├── docs-migration
│   │   └── MIGRATION_FROM_OLD_STRUCTURE.md
│   ├── memory
│   │   ├── changelog.md
│   │   ├── completed-checklist.md
│   │   ├── decisions.md
│   │   ├── known-risks.md
│   │   ├── memory-update-protocol.md
│   │   ├── pending-checklist.md
│   │   ├── project-memory.md
│   │   ├── README.md
│   │   └── session-handoff.md
│   ├── playbooks
│   │   ├── pb-ai-docs-refactor.md
│   │   ├── pb-canvas-multipage.md
│   │   ├── pb-css-tailwind-migration.md
│   │   ├── pb-inspector.md
│   │   ├── pb-schema-families.md
│   │   ├── pb-selection-transform.md
│   │   ├── pb-snapshot.md
│   │   ├── pb-visual-regression.md
│   │   └── README.md
│   ├── project
│   │   ├── architecture-principles.md
│   │   ├── definition-of-done.md
│   │   ├── file-ownership-map.md
│   │   ├── glossary.md
│   │   ├── goals.md
│   │   ├── non-goals.md
│   │   └── scope.md
│   ├── prompts
│   │   ├── claude-diagnose-or-implement.md
│   │   ├── codex-master-prompt.md
│   │   ├── copilot-task-context.md
│   │   ├── create-task-card.md
│   │   ├── README.md
│   │   └── update-memory.md
│   ├── README.md
│   ├── reports
│   │   ├── README.md
│   │   └── report-template.md
│   ├── router
│   │   ├── CONTEXT_BUDGET.md
│   │   ├── ROUTER.md
│   │   └── TASK_INTAKE.md
│   ├── rules
│   │   ├── ai-docs-rules.md
│   │   ├── canvas-rules.md
│   │   ├── css-migration-rules.md
│   │   ├── global-rules.md
│   │   ├── inspector-rules.md
│   │   ├── moveable-selecto-rules.md
│   │   ├── README.md
│   │   ├── schema-rules.md
│   │   └── snapshot-rules.md
│   ├── skills
│   │   ├── canvas-multipage-skill.md
│   │   ├── inspector-skill.md
│   │   ├── memory-update-skill.md
│   │   ├── moveable-selecto-skill.md
│   │   ├── option-groups-skill.md
│   │   ├── prompting-skill.md
│   │   ├── README.md
│   │   ├── snapshot-safety-skill.md
│   │   ├── tailwind-migration-skill.md
│   │   └── visual-regression-skill.md
│   ├── start
│   │   ├── QUICKSTART-CLAUDE.md
│   │   ├── QUICKSTART-CODEX.md
│   │   ├── QUICKSTART-COPILOT.md
│   │   └── START.md
│   ├── subagents
│   │   ├── anti-hallucination-reviewer.md
│   │   ├── baseline-visual-critic.md
│   │   ├── code-docs-writer.md
│   │   ├── css-auditor.md
│   │   ├── legacy-css-guardian.md
│   │   ├── memory-curator.md
│   │   ├── prompt-engineer.md
│   │   ├── README.md
│   │   ├── regression-tester.md
│   │   └── tailwind-migrator.md
│   ├── task-cards
│   │   ├── active
│   │   │   └── TASK-DOCS-001-ai-architecture-install.md
│   │   ├── backlog
│   │   │   ├── TASK-CANVAS-001-protect-canvas-overflow.md
│   │   │   ├── TASK-CSS-001-tailwind-regression-stabilization.md
│   │   │   └── TASK-VISUAL-001-img-version-baseline.md
│   │   ├── completed
│   │   │   └── README.md
│   │   └── README.md
│   ├── templates
│   │   ├── agent-template.md
│   │   ├── checklist-template.md
│   │   ├── decision-template.md
│   │   ├── memory-update-template.md
│   │   ├── README.md
│   │   ├── skill-template.md
│   │   └── task-card-template.md
│   └── tree.md
├── CLAUDE.md
├── docs
│   ├── 00-introduccion
│   │   ├── 01-que-es-sisad-pdfme.md
│   │   ├── 02-para-que-sirve.md
│   │   ├── 03-glosario.md
│   │   ├── 04-arquitectura-general.md
│   │   └── README.md
│   ├── 01-instalacion
│   │   ├── 01-requisitos.md
│   │   ├── 02-instalacion.md
│   │   ├── 03-configuracion-vite.md
│   │   ├── 04-importacion-estilos.md
│   │   └── README.md
│   ├── 02-conceptos
│   │   ├── 01-template.md
│   │   ├── 02-documents-pages.md
│   │   ├── 03-schemas.md
│   │   ├── 04-recipients.md
│   │   ├── 05-assignments.md
│   │   ├── 06-runtime-modes.md
│   │   ├── 07-snapshot.md
│   │   └── README.md
│   ├── 03-designer
│   │   ├── 01-designer-overview.md
│   │   ├── 02-props.md
│   │   ├── 03-canvas.md
│   │   ├── 04-left-sidebar.md
│   │   ├── 05-right-sidebar.md
│   │   ├── 06-detail-view.md
│   │   ├── 07-list-view.md
│   │   ├── 08-toolbar-commandbus.md
│   │   ├── 09-comments.md
│   │   ├── 10-multi-documento.md
│   │   └── README.md
│   ├── 04-schemas
│   │   ├── 01-schema-base.md
│   │   ├── 02-familias.md
│   │   ├── 03-text-like.md
│   │   ├── 04-option-based.md
│   │   ├── 05-signing-based.md
│   │   ├── 06-action-based.md
│   │   ├── 07-media-barcode-table-shapes.md
│   │   ├── 08-custom-schemas.md
│   │   ├── 09-inspector-contract.md
│   │   ├── 10-docusing-mapping.md
│   │   └── README.md
│   ├── 05-runtime
│   │   ├── 01-form.md
│   │   ├── 02-viewer.md
│   │   ├── 03-values.md
│   │   ├── 04-validation.md
│   │   ├── 05-recipient-filtering.md
│   │   └── README.md
│   ├── 06-generator
│   │   ├── 01-generator-overview.md
│   │   ├── 02-pdf-output.md
│   │   ├── 03-fonts-assets.md
│   │   └── README.md
│   ├── 07-integraciones
│   │   ├── 01-react.md
│   │   ├── 02-host-app.md
│   │   ├── 03-signature-providers.md
│   │   ├── 04-external-forms.md
│   │   └── README.md
│   ├── 08-api-reference
│   │   ├── 01-designer-api.md
│   │   ├── 02-form-api.md
│   │   ├── 03-viewer-api.md
│   │   ├── 04-generator-api.md
│   │   ├── 05-plugin-api.md
│   │   └── README.md
│   ├── 09-theming
│   │   ├── 01-tokens-css.md
│   │   ├── 02-tailwind-bridge.md
│   │   ├── 03-baseline-visual.md
│   │   ├── 04-css-migration.md
│   │   └── README.md
│   ├── 10-testing-qa
│   │   ├── 01-manual-checklist.md
│   │   ├── 02-regression-matrix.md
│   │   ├── 03-playwright.md
│   │   ├── 04-vitest.md
│   │   └── README.md
│   ├── 11-migraciones
│   │   ├── 01-legacy-templates.md
│   │   ├── 02-snapshot-versioning.md
│   │   ├── 03-pdfme-upstream.md
│   │   └── README.md
│   ├── 12-troubleshooting
│   │   ├── 01-canvas.md
│   │   ├── 02-pdf-worker.md
│   │   ├── 03-tailwind-regressions.md
│   │   ├── 04-runtime.md
│   │   └── README.md
│   ├── 13-ejemplos
│   │   ├── 01-basic-designer.md
│   │   ├── 02-multi-document-routing.md
│   │   ├── 03-generator-runtime.md
│   │   └── README.md
│   ├── 14-seguridad
│   │   ├── 01-archivos.md
│   │   ├── 02-firma.md
│   │   └── README.md
│   └── README.md
├── MANIFEST.md
├── plan-maestro-migracion-tailwind-sisad-pdfme.md
├── README.md
├── reports
│   └── tailwind-migration
│       ├── baseline-regression-audit.md
│       ├── img-version-baseline-inventory.md
│       ├── line-by-line-style-audit.md
│       └── README.md
├── scripts
│   └── README.md
├── SEPARATION-CONTRACT.md
└── test-results
    └── standard-fields-standard-f-c4dc3-s-the-expected-schema-types-chromium
        └── error-context.md
```

## Archivos incluidos

| # | Ruta | Lenguaje | Líneas | KB original | Estado |
|---:|---|---|---:|---:|---|
| 1 | `README.md` | markdown | 48 | 2.0 | completo |
| 2 | `docs/README.md` | markdown | 31 | 0.7 | completo |
| 3 | `docs/00-introduccion/01-que-es-sisad-pdfme.md` | markdown | 27 | 0.9 | completo |
| 4 | `docs/00-introduccion/02-para-que-sirve.md` | markdown | 24 | 0.7 | completo |
| 5 | `docs/00-introduccion/03-glosario.md` | markdown | 17 | 0.7 | completo |
| 6 | `docs/00-introduccion/04-arquitectura-general.md` | markdown | 29 | 0.7 | completo |
| 7 | `docs/00-introduccion/README.md` | markdown | 6 | 0.2 | completo |
| 8 | `docs/01-instalacion/01-requisitos.md` | markdown | 11 | 0.3 | completo |
| 9 | `docs/01-instalacion/02-instalacion.md` | markdown | 29 | 0.6 | completo |
| 10 | `docs/01-instalacion/03-configuracion-vite.md` | markdown | 13 | 0.4 | completo |
| 11 | `docs/01-instalacion/04-importacion-estilos.md` | markdown | 18 | 0.5 | completo |
| 12 | `docs/01-instalacion/README.md` | markdown | 6 | 0.2 | completo |
| 13 | `docs/02-conceptos/01-template.md` | markdown | 22 | 0.4 | completo |
| 14 | `docs/02-conceptos/02-documents-pages.md` | markdown | 15 | 0.3 | completo |
| 15 | `docs/02-conceptos/03-schemas.md` | markdown | 22 | 0.3 | completo |
| 16 | `docs/02-conceptos/04-recipients.md` | markdown | 16 | 0.3 | completo |
| 17 | `docs/02-conceptos/05-assignments.md` | markdown | 12 | 0.3 | completo |
| 18 | `docs/02-conceptos/06-runtime-modes.md` | markdown | 12 | 0.3 | completo |
| 19 | `docs/02-conceptos/07-snapshot.md` | markdown | 19 | 0.3 | completo |
| 20 | `docs/02-conceptos/README.md` | markdown | 9 | 0.3 | completo |
| 21 | `docs/03-designer/01-designer-overview.md` | markdown | 16 | 0.4 | completo |
| 22 | `docs/03-designer/02-props.md` | markdown | 24 | 0.5 | completo |
| 23 | `docs/03-designer/03-canvas.md` | markdown | 17 | 0.4 | completo |
| 24 | `docs/03-designer/04-left-sidebar.md` | markdown | 17 | 0.3 | completo |
| 25 | `docs/03-designer/05-right-sidebar.md` | markdown | 14 | 0.3 | completo |
| 26 | `docs/03-designer/06-detail-view.md` | markdown | 25 | 0.3 | completo |
| 27 | `docs/03-designer/07-list-view.md` | markdown | 14 | 0.3 | completo |
| 28 | `docs/03-designer/08-toolbar-commandbus.md` | markdown | 14 | 0.2 | completo |
| 29 | `docs/03-designer/09-comments.md` | markdown | 11 | 0.2 | completo |
| 30 | `docs/03-designer/10-multi-documento.md` | markdown | 10 | 0.3 | completo |
| 31 | `docs/03-designer/README.md` | markdown | 12 | 0.4 | completo |
| 32 | `docs/04-schemas/01-schema-base.md` | markdown | 23 | 0.3 | completo |
| 33 | `docs/04-schemas/02-familias.md` | markdown | 12 | 0.4 | completo |
| 34 | `docs/04-schemas/03-text-like.md` | markdown | 24 | 0.2 | completo |
| 35 | `docs/04-schemas/04-option-based.md` | markdown | 18 | 0.3 | completo |
| 36 | `docs/04-schemas/05-signing-based.md` | markdown | 13 | 0.3 | completo |
| 37 | `docs/04-schemas/06-action-based.md` | markdown | 15 | 0.2 | completo |
| 38 | `docs/04-schemas/07-media-barcode-table-shapes.md` | markdown | 22 | 0.3 | completo |
| 39 | `docs/04-schemas/08-custom-schemas.md` | markdown | 15 | 0.3 | completo |
| 40 | `docs/04-schemas/09-inspector-contract.md` | markdown | 22 | 0.4 | completo |
| 41 | `docs/04-schemas/10-docusing-mapping.md` | markdown | 17 | 0.4 | completo |
| 42 | `docs/04-schemas/README.md` | markdown | 12 | 0.5 | completo |
| 43 | `docs/05-runtime/01-form.md` | markdown | 13 | 0.2 | completo |
| 44 | `docs/05-runtime/02-viewer.md` | markdown | 10 | 0.2 | completo |
| 45 | `docs/05-runtime/03-values.md` | markdown | 11 | 0.2 | completo |
| 46 | `docs/05-runtime/04-validation.md` | markdown | 13 | 0.2 | completo |
| 47 | `docs/05-runtime/05-recipient-filtering.md` | markdown | 10 | 0.2 | completo |
| 48 | `docs/05-runtime/README.md` | markdown | 7 | 0.2 | completo |
| 49 | `docs/06-generator/01-generator-overview.md` | markdown | 10 | 0.2 | completo |
| 50 | `docs/06-generator/02-pdf-output.md` | markdown | 8 | 0.2 | completo |
| 51 | `docs/06-generator/03-fonts-assets.md` | markdown | 8 | 0.2 | completo |
| 52 | `docs/06-generator/README.md` | markdown | 5 | 0.2 | completo |
| 53 | `docs/07-integraciones/01-react.md` | markdown | 12 | 0.3 | completo |
| 54 | `docs/07-integraciones/02-host-app.md` | markdown | 18 | 0.3 | completo |
| 55 | `docs/07-integraciones/03-signature-providers.md` | markdown | 14 | 0.3 | completo |
| 56 | `docs/07-integraciones/04-external-forms.md` | markdown | 9 | 0.2 | completo |
| 57 | `docs/07-integraciones/README.md` | markdown | 6 | 0.2 | completo |
| 58 | `docs/08-api-reference/01-designer-api.md` | markdown | 10 | 0.3 | completo |
| 59 | `docs/08-api-reference/02-form-api.md` | markdown | 9 | 0.2 | completo |
| 60 | `docs/08-api-reference/03-viewer-api.md` | markdown | 7 | 0.1 | completo |
| 61 | `docs/08-api-reference/04-generator-api.md` | markdown | 9 | 0.2 | completo |
| 62 | `docs/08-api-reference/05-plugin-api.md` | markdown | 14 | 0.2 | completo |
| 63 | `docs/08-api-reference/README.md` | markdown | 7 | 0.2 | completo |
| 64 | `docs/09-theming/01-tokens-css.md` | markdown | 14 | 0.2 | completo |
| 65 | `docs/09-theming/02-tailwind-bridge.md` | markdown | 10 | 0.3 | completo |
| 66 | `docs/09-theming/03-baseline-visual.md` | markdown | 11 | 0.2 | completo |
| 67 | `docs/09-theming/04-css-migration.md` | markdown | 11 | 0.2 | completo |
| 68 | `docs/09-theming/README.md` | markdown | 6 | 0.2 | completo |
| 69 | `docs/10-testing-qa/01-manual-checklist.md` | markdown | 26 | 0.3 | completo |
| 70 | `docs/10-testing-qa/02-regression-matrix.md` | markdown | 10 | 0.3 | completo |
| 71 | `docs/10-testing-qa/03-playwright.md` | markdown | 12 | 0.2 | completo |
| 72 | `docs/10-testing-qa/04-vitest.md` | markdown | 10 | 0.2 | completo |
| 73 | `docs/10-testing-qa/README.md` | markdown | 6 | 0.2 | completo |
| 74 | `docs/11-migraciones/01-legacy-templates.md` | markdown | 10 | 0.3 | completo |
| 75 | `docs/11-migraciones/02-snapshot-versioning.md` | markdown | 9 | 0.2 | completo |
| 76 | `docs/11-migraciones/03-pdfme-upstream.md` | markdown | 12 | 0.2 | completo |
| 77 | `docs/11-migraciones/README.md` | markdown | 5 | 0.2 | completo |
| 78 | `docs/12-troubleshooting/01-canvas.md` | markdown | 14 | 0.3 | completo |
| 79 | `docs/12-troubleshooting/02-pdf-worker.md` | markdown | 9 | 0.2 | completo |
| 80 | `docs/12-troubleshooting/03-tailwind-regressions.md` | markdown | 10 | 0.3 | completo |
| 81 | `docs/12-troubleshooting/04-runtime.md` | markdown | 16 | 0.2 | completo |
| 82 | `docs/12-troubleshooting/README.md` | markdown | 6 | 0.2 | completo |
| 83 | `docs/13-ejemplos/01-basic-designer.md` | markdown | 11 | 0.2 | completo |
| 84 | `docs/13-ejemplos/02-multi-document-routing.md` | markdown | 10 | 0.2 | completo |
| 85 | `docs/13-ejemplos/03-generator-runtime.md` | markdown | 9 | 0.1 | completo |
| 86 | `docs/13-ejemplos/README.md` | markdown | 5 | 0.2 | completo |
| 87 | `docs/14-seguridad/01-archivos.md` | markdown | 9 | 0.2 | completo |
| 88 | `docs/14-seguridad/02-firma.md` | markdown | 5 | 0.2 | completo |
| 89 | `docs/14-seguridad/README.md` | markdown | 4 | 0.1 | completo |
| 90 | `AGENTS.md` | markdown | 26 | 0.7 | completo |
| 91 | `CLAUDE.md` | markdown | 23 | 0.5 | completo |
| 92 | `MANIFEST.md` | markdown | 177 | 6.1 | completo |
| 93 | `plan-maestro-migracion-tailwind-sisad-pdfme.md` | markdown | 1036 | 204.3 | truncado 110.9 KB |
| 94 | `SEPARATION-CONTRACT.md` | markdown | 35 | 0.5 | completo |
| 95 | `.github/copilot-instructions.md` | markdown | 15 | 0.4 | completo |
| 96 | `ai/README.md` | markdown | 38 | 0.8 | completo |
| 97 | `ai/tree.md` | markdown | 26 | 0.4 | completo |
| 98 | `scripts/README.md` | markdown | 21 | 0.4 | completo |
| 99 | `ai/adapters/README.md` | markdown | 3 | 0.1 | completo |
| 100 | `ai/agents/canvas-agent.md` | markdown | 37 | 0.6 | completo |
| 101 | `ai/agents/css-tailwind-agent.md` | markdown | 37 | 0.6 | completo |
| 102 | `ai/agents/designer-runtime-agent.md` | markdown | 37 | 0.6 | completo |
| 103 | `ai/agents/docs-architecture-agent.md` | markdown | 37 | 0.6 | completo |
| 104 | `ai/agents/inspector-agent.md` | markdown | 37 | 0.6 | completo |
| 105 | `ai/agents/interaction-agent.md` | markdown | 37 | 0.6 | completo |
| 106 | `ai/agents/lab-shell-agent.md` | markdown | 37 | 0.6 | completo |
| 107 | `ai/agents/README.md` | markdown | 3 | 0.1 | completo |
| 108 | `ai/agents/registry.md` | markdown | 12 | 1.3 | completo |
| 109 | `ai/agents/schema-agent.md` | markdown | 37 | 0.6 | completo |
| 110 | `ai/agents/snapshot-agent.md` | markdown | 37 | 0.6 | completo |
| 111 | `ai/agents/visual-baseline-agent.md` | markdown | 37 | 0.6 | completo |
| 112 | `ai/baselines/img-version-baseline-protocol.md` | markdown | 29 | 0.4 | completo |
| 113 | `ai/baselines/README.md` | markdown | 3 | 0.1 | completo |
| 114 | `ai/checklists/done-vs-pending.md` | markdown | 12 | 0.2 | completo |
| 115 | `ai/checklists/global-validation.md` | markdown | 8 | 0.2 | completo |
| 116 | `ai/checklists/improvement-backlog.md` | markdown | 9 | 0.3 | completo |
| 117 | `ai/checklists/manual-ui-regression.md` | markdown | 19 | 0.4 | completo |
| 118 | `ai/checklists/README.md` | markdown | 3 | 0.1 | completo |
| 119 | `ai/checklists/tailwind-migration.md` | markdown | 11 | 0.3 | completo |
| 120 | `ai/context/ai-docs-context.md` | markdown | 3 | 0.1 | completo |
| 121 | `ai/context/canvas-multipage-context.md` | markdown | 9 | 0.2 | completo |
| 122 | `ai/context/css-tailwind-context.md` | markdown | 23 | 0.6 | completo |
| 123 | `ai/context/inspector-context.md` | markdown | 3 | 0.1 | completo |
| 124 | `ai/context/README.md` | markdown | 3 | 0.1 | completo |
| 125 | `ai/context/schema-families-context.md` | markdown | 5 | 0.2 | completo |
| 126 | `ai/context/selection-transform-context.md` | markdown | 3 | 0.2 | completo |
| 127 | `ai/context/snapshot-context.md` | markdown | 3 | 0.1 | completo |
| 128 | `ai/context/visual-baseline-context.md` | markdown | 18 | 0.2 | completo |
| 129 | `ai/docs-migration/MIGRATION_FROM_OLD_STRUCTURE.md` | markdown | 30 | 0.7 | completo |
| 130 | `ai/memory/changelog.md` | markdown | 7 | 0.3 | completo |
| 131 | `ai/memory/completed-checklist.md` | markdown | 7 | 0.3 | completo |
| 132 | `ai/memory/decisions.md` | markdown | 21 | 0.8 | completo |
| 133 | `ai/memory/known-risks.md` | markdown | 10 | 0.5 | completo |
| 134 | `ai/memory/memory-update-protocol.md` | markdown | 29 | 0.6 | completo |
| 135 | `ai/memory/pending-checklist.md` | markdown | 15 | 0.5 | completo |
| 136 | `ai/memory/project-memory.md` | markdown | 20 | 0.8 | completo |
| 137 | `ai/memory/README.md` | markdown | 13 | 0.4 | completo |
| 138 | `ai/memory/session-handoff.md` | markdown | 13 | 0.5 | completo |
| 139 | `ai/playbooks/pb-ai-docs-refactor.md` | markdown | 7 | 0.2 | completo |
| 140 | `ai/playbooks/pb-canvas-multipage.md` | markdown | 6 | 0.2 | completo |
| 141 | `ai/playbooks/pb-css-tailwind-migration.md` | markdown | 9 | 0.3 | completo |
| 142 | `ai/playbooks/pb-inspector.md` | markdown | 6 | 0.1 | completo |
| 143 | `ai/playbooks/pb-schema-families.md` | markdown | 6 | 0.2 | completo |
| 144 | `ai/playbooks/pb-selection-transform.md` | markdown | 6 | 0.1 | completo |
| 145 | `ai/playbooks/pb-snapshot.md` | markdown | 6 | 0.1 | completo |
| 146 | `ai/playbooks/pb-visual-regression.md` | markdown | 8 | 0.2 | completo |
| 147 | `ai/playbooks/README.md` | markdown | 3 | 0.1 | completo |
| 148 | `ai/project/architecture-principles.md` | markdown | 34 | 1.0 | completo |
| 149 | `ai/project/definition-of-done.md` | markdown | 12 | 0.4 | completo |
| 150 | `ai/project/file-ownership-map.md` | markdown | 14 | 0.8 | completo |
| 151 | `ai/project/glossary.md` | markdown | 16 | 0.7 | completo |
| 152 | `ai/project/goals.md` | markdown | 24 | 0.9 | completo |
| 153 | `ai/project/non-goals.md` | markdown | 12 | 0.3 | completo |
| 154 | `ai/project/scope.md` | markdown | 38 | 0.6 | completo |
| 155 | `ai/prompts/claude-diagnose-or-implement.md` | markdown | 7 | 0.2 | completo |
| 156 | `ai/prompts/codex-master-prompt.md` | markdown | 5 | 0.3 | completo |
| 157 | `ai/prompts/copilot-task-context.md` | markdown | 11 | 0.2 | completo |
| 158 | `ai/prompts/create-task-card.md` | markdown | 11 | 0.2 | completo |
| 159 | `ai/prompts/README.md` | markdown | 3 | 0.1 | completo |
| 160 | `ai/prompts/update-memory.md` | markdown | 3 | 0.1 | completo |
| 161 | `ai/reports/README.md` | markdown | 3 | 0.1 | completo |
| 162 | `ai/reports/report-template.md` | markdown | 10 | 0.1 | completo |
| 163 | `ai/router/CONTEXT_BUDGET.md` | markdown | 45 | 0.8 | completo |
| 164 | `ai/router/ROUTER.md` | markdown | 27 | 1.2 | completo |
| 165 | `ai/router/TASK_INTAKE.md` | markdown | 15 | 0.4 | completo |
| 166 | `ai/rules/ai-docs-rules.md` | markdown | 6 | 0.2 | completo |
| 167 | `ai/rules/canvas-rules.md` | markdown | 3 | 0.1 | completo |
| 168 | `ai/rules/css-migration-rules.md` | markdown | 8 | 0.3 | completo |
| 169 | `ai/rules/global-rules.md` | markdown | 7 | 0.2 | completo |
| 170 | `ai/rules/inspector-rules.md` | markdown | 3 | 0.1 | completo |
| 171 | `ai/rules/moveable-selecto-rules.md` | markdown | 5 | 0.2 | completo |
| 172 | `ai/rules/README.md` | markdown | 3 | 0.1 | completo |
| 173 | `ai/rules/schema-rules.md` | markdown | 3 | 0.1 | completo |
| 174 | `ai/rules/snapshot-rules.md` | markdown | 3 | 0.1 | completo |
| 175 | `ai/skills/canvas-multipage-skill.md` | markdown | 29 | 0.4 | completo |
| 176 | `ai/skills/inspector-skill.md` | markdown | 29 | 0.4 | completo |
| 177 | `ai/skills/memory-update-skill.md` | markdown | 29 | 0.4 | completo |
| 178 | `ai/skills/moveable-selecto-skill.md` | markdown | 29 | 0.4 | completo |
| 179 | `ai/skills/option-groups-skill.md` | markdown | 29 | 0.4 | completo |
| 180 | `ai/skills/prompting-skill.md` | markdown | 29 | 0.4 | completo |
| 181 | `ai/skills/README.md` | markdown | 3 | 0.1 | completo |
| 182 | `ai/skills/snapshot-safety-skill.md` | markdown | 29 | 0.4 | completo |
| 183 | `ai/skills/tailwind-migration-skill.md` | markdown | 29 | 0.4 | completo |
| 184 | `ai/skills/visual-regression-skill.md` | markdown | 29 | 0.4 | completo |
| 185 | `ai/start/QUICKSTART-CLAUDE.md` | markdown | 15 | 0.4 | completo |
| 186 | `ai/start/QUICKSTART-CODEX.md` | markdown | 34 | 0.7 | completo |
| 187 | `ai/start/QUICKSTART-COPILOT.md` | markdown | 18 | 0.4 | completo |
| 188 | `ai/start/START.md` | markdown | 76 | 1.2 | completo |
| 189 | `ai/subagents/anti-hallucination-reviewer.md` | markdown | 13 | 0.3 | completo |
| 190 | `ai/subagents/baseline-visual-critic.md` | markdown | 13 | 0.3 | completo |
| 191 | `ai/subagents/code-docs-writer.md` | markdown | 13 | 0.3 | completo |
| 192 | `ai/subagents/css-auditor.md` | markdown | 13 | 0.3 | completo |
| 193 | `ai/subagents/legacy-css-guardian.md` | markdown | 13 | 0.3 | completo |
| 194 | `ai/subagents/memory-curator.md` | markdown | 13 | 0.3 | completo |
| 195 | `ai/subagents/prompt-engineer.md` | markdown | 13 | 0.3 | completo |
| 196 | `ai/subagents/README.md` | markdown | 3 | 0.1 | completo |
| 197 | `ai/subagents/regression-tester.md` | markdown | 13 | 0.3 | completo |
| 198 | `ai/subagents/tailwind-migrator.md` | markdown | 13 | 0.3 | completo |
| 199 | `ai/task-cards/README.md` | markdown | 11 | 0.2 | completo |
| 200 | `ai/templates/agent-template.md` | markdown | 7 | 0.1 | completo |
| 201 | `ai/templates/checklist-template.md` | markdown | 5 | 0.1 | completo |
| 202 | `ai/templates/decision-template.md` | markdown | 7 | 0.1 | completo |
| 203 | `ai/templates/memory-update-template.md` | markdown | 7 | 0.1 | completo |
| 204 | `ai/templates/README.md` | markdown | 3 | 0.1 | completo |
| 205 | `ai/templates/skill-template.md` | markdown | 7 | 0.1 | completo |
| 206 | `ai/templates/task-card-template.md` | markdown | 11 | 0.2 | completo |
| 207 | `reports/tailwind-migration/baseline-regression-audit.md` | markdown | 27 | 5.2 | completo |
| 208 | `reports/tailwind-migration/img-version-baseline-inventory.md` | markdown | 14 | 2.6 | completo |
| 209 | `reports/tailwind-migration/line-by-line-style-audit.md` | markdown | 227 | 21.6 | completo |
| 210 | `reports/tailwind-migration/README.md` | markdown | 76 | 4.6 | completo |
| 211 | `test-results/standard-fields-standard-f-c4dc3-s-the-expected-schema-types-chromium/error-context.md` | markdown | 576 | 28.7 | completo |
| 212 | `ai/task-cards/active/TASK-DOCS-001-ai-architecture-install.md` | markdown | 21 | 0.5 | completo |
| 213 | `ai/task-cards/backlog/TASK-CANVAS-001-protect-canvas-overflow.md` | markdown | 5 | 0.2 | completo |
| 214 | `ai/task-cards/backlog/TASK-CSS-001-tailwind-regression-stabilization.md` | markdown | 22 | 0.6 | completo |
| 215 | `ai/task-cards/backlog/TASK-VISUAL-001-img-version-baseline.md` | markdown | 12 | 0.3 | completo |
| 216 | `ai/task-cards/completed/README.md` | markdown | 3 | 0.1 | completo |
| 217 | `.tailwind-migration-backups/20260708-111736/reports/tailwind-migration/README.md` | markdown | 76 | 3.4 | completo |

## Resumen de exclusiones

- **extensión no incluida:** 1442
- **directorio ignorado: dependencia/build/salida generada:** 7

## Totales

- **KB originales candidatos:** `346.9`
- **KB incluidos en contenido:** `253.3`
- **Comentarios reducidos:** `desactivada`
- **JSON de datos en React:** `omitido por defecto`
- **Redacción de secretos:** `activa`

---

# Contenido consolidado

<a id="file-0001"></a>

### 0001 — `README.md`

- **Lenguaje:** `markdown`
- **Líneas:** `48`
- **Tamaño original:** `2.0 KB`
- **SHA1 corto:** `96190e4652`
- **Estado:** `completo`

```markdown
/

# SISAD PDFME — Arquitectura Markdown separada

Este paquete reorganiza la documentación del proyecto en dos mundos separados:

1. `docs/` contiene **solo documentación del componente `sisad-pdfme`**: qué es, para qué sirve, cómo se instala, cómo se implementa, cómo se configuran Designer/Form/Viewer/Generator, schemas, recipients, snapshots, theming, troubleshooting, QA y ejemplos.
2. `ai/` contiene **todo lo relacionado con asistentes de IA**: Codex, Claude, GitHub Copilot, agentes, subagentes, skills, memoria, task-cards, reglas, playbooks, prompts y checklist operativo.

Regla principal:

``​`txt
Nada sobre agentes de IA debe vivir dentro de docs/.
Nada sobre documentación funcional del componente debe duplicarse dentro de ai/ salvo resúmenes mínimos de contexto para ahorrar tokens.
``​`

## Estructura rápida

``​`txt
sisad-pdfme-md-architecture/
├── README.md
├── AGENTS.md                     # Adaptador delgado para herramientas que leen AGENTS.md
├── CLAUDE.md                     # Adaptador delgado para Claude
├── .github/copilot-instructions.md
├── docs/                         # Documentación pública/técnica del componente
└── ai/                           # Sistema operativo de IA
``​`

## Instalación sugerida

Copiar el contenido en la raíz del proyecto:

``​`bash
cp -R sisad-pdfme-md-architecture/docs ./docs
cp -R sisad-pdfme-md-architecture/ai ./ai
cp sisad-pdfme-md-architecture/AGENTS.md ./AGENTS.md
cp sisad-pdfme-md-architecture/CLAUDE.md ./CLAUDE.md
mkdir -p .github
cp sisad-pdfme-md-architecture/.github/copilot-instructions.md ./.github/copilot-instructions.md
``​`

## Principio SOLID aplicado a Markdown

- **SRP:** `docs/` documenta producto/componente; `ai/` orquesta asistentes.
- **OCP:** agregar nuevos procesos con nuevas task-cards sin reescribir todo.
- **ISP:** cada agente carga solo el contexto que necesita.
- **DIP:** los prompts dependen de contratos (`router`, `task-cards`, `rules`), no de documentos gigantes.
- **DRY:** una sola fuente de verdad por tema.
```

<a id="file-0002"></a>

### 0002 — `docs/README.md`

- **Lenguaje:** `markdown`
- **Líneas:** `31`
- **Tamaño original:** `0.7 KB`
- **SHA1 corto:** `76f5a4f734`
- **Estado:** `completo`

```markdown
# Documentación de `sisad-pdfme`

Esta carpeta contiene **solo documentación completa del componente `sisad-pdfme`**.

Aquí se explica:

- qué es `sisad-pdfme`;
- para qué sirve;
- cómo implementarlo;
- cómo usar Designer, Form, Viewer y Generator;
- cómo configurar schemas, recipients, documents, assignments, snapshots, comments y theming;
- cómo crear schemas custom;
- cómo validar el comportamiento;
- cómo solucionar errores comunes.

## Prohibición explícita

En `docs/` no debe existir contenido de:

``​`txt
agentes de IA
subagentes
skills de IA
prompts para Codex/Claude/Copilot
memoria de IA
task-cards para IA
presupuesto de tokens
ruteo de modelos
``​`

Todo eso vive en `ai/`.
```

<a id="file-0003"></a>

### 0003 — `docs/00-introduccion/01-que-es-sisad-pdfme.md`

- **Lenguaje:** `markdown`
- **Líneas:** `27`
- **Tamaño original:** `0.9 KB`
- **SHA1 corto:** `999aab38d2`
- **Estado:** `completo`

```markdown
# Qué es `sisad-pdfme`

`sisad-pdfme` es un componente reutilizable para diseñar, llenar, visualizar y generar documentos PDF con campos posicionados sobre páginas.

Permite crear experiencias tipo diseñador PDF empresarial:

- cargar uno o varios documentos PDF;
- arrastrar campos sobre páginas;
- asignar campos a recipients/destinatarios;
- configurar propiedades del campo en un inspector;
- guardar snapshots versionados;
- renderizar formularios interactivos;
- visualizar documentos en modo readonly;
- generar PDF final con valores.

## Piezas principales

``​`txt
Designer  -> diseña campos sobre PDF
Form      -> captura valores interactivos
Viewer    -> muestra valores en solo lectura
Generator -> produce PDF final
``​`

## Enfoque

El componente debe ser genérico. No debe contener reglas específicas de SISAD Web, Uanataca, flujos externos o negocio de formularios.
```

<a id="file-0004"></a>

### 0004 — `docs/00-introduccion/02-para-que-sirve.md`

- **Lenguaje:** `markdown`
- **Líneas:** `24`
- **Tamaño original:** `0.7 KB`
- **SHA1 corto:** `80fc9bf616`
- **Estado:** `completo`

```markdown
# Para qué sirve

`sisad-pdfme` sirve para construir flujos donde un documento PDF necesita campos configurables:

- contratos;
- acuerdos digitales;
- solicitudes de crédito;
- formularios externos;
- documentos con firma;
- formularios por destinatario;
- flujos multi-documento.

## Casos de uso típicos

1. Un administrador diseña una plantilla.
2. Asigna campos a recipients.
3. Guarda un snapshot.
4. Un usuario llena el formulario.
5. Un visor revisa el resultado.
6. El sistema genera el PDF final.

## Qué no hace

No debe reemplazar backend de firma, almacenamiento documental, reglas de negocio o autenticación. Se integra con esos sistemas mediante adaptadores.
```

<a id="file-0005"></a>

### 0005 — `docs/00-introduccion/03-glosario.md`

- **Lenguaje:** `markdown`
- **Líneas:** `17`
- **Tamaño original:** `0.7 KB`
- **SHA1 corto:** `a0f5ef2766`
- **Estado:** `completo`

```markdown
# Glosario

| Término | Significado |
|---|---|
| Template | Estructura completa de documentos, schemas y configuración. |
| Document | PDF cargado dentro del diseñador. |
| Page | Página específica de un documento. |
| Schema | Campo colocado sobre el PDF. |
| Recipient | Destinatario/dueño de campos. |
| Assignment | Relación explícita entre field y recipient/flujo. |
| Snapshot | Estado serializable del diseñador. |
| Designer | Runtime de edición visual. |
| Form | Runtime de captura interactiva. |
| Viewer | Runtime de lectura. |
| Generator | Motor de salida PDF. |
| Field chrome | Visual auxiliar de un campo en Designer/Form/Viewer. |
| Owner color | Color que identifica al recipient dueño del campo. |
```

<a id="file-0006"></a>

### 0006 — `docs/00-introduccion/04-arquitectura-general.md`

- **Lenguaje:** `markdown`
- **Líneas:** `29`
- **Tamaño original:** `0.7 KB`
- **SHA1 corto:** `1fb01ee45f`
- **Estado:** `completo`

```markdown
# Arquitectura general del componente

``​`txt
sisad-pdfme/
├── ui/
│   ├── Designer
│   ├── Form
│   ├── Viewer
│   └── components
├── schemas/
│   ├── text-like
│   ├── option-based
│   ├── signing-based
│   ├── action-based
│   ├── media
│   └── shared
├── runtime/
├── generator/
├── shared/
├── commands/
└── styles/
``​`

## Principios

- Designer controla canvas, sidebars, overlays, toolbar, selección y configuración.
- Form/Viewer consumen el mismo modelo de schemas.
- Generator usa el snapshot y los valores finales.
- Host apps solo pasan datos, callbacks y adaptadores.
```

<a id="file-0007"></a>

### 0007 — `docs/00-introduccion/README.md`

- **Lenguaje:** `markdown`
- **Líneas:** `6`
- **Tamaño original:** `0.2 KB`
- **SHA1 corto:** `260d344ca8`
- **Estado:** `completo`

```markdown
# Índice

- [01-que-es-sisad-pdfme.md](./01-que-es-sisad-pdfme.md)
- [02-para-que-sirve.md](./02-para-que-sirve.md)
- [03-glosario.md](./03-glosario.md)
- [04-arquitectura-general.md](./04-arquitectura-general.md)
```

<a id="file-0008"></a>

### 0008 — `docs/01-instalacion/01-requisitos.md`

- **Lenguaje:** `markdown`
- **Líneas:** `11`
- **Tamaño original:** `0.3 KB`
- **SHA1 corto:** `2ca6c68474`
- **Estado:** `completo`

```markdown
# Requisitos

- React.
- TypeScript recomendado.
- Vite o bundler compatible.
- PDF.js o runtime PDF configurado según el empaquetado del proyecto.
- CSS tokens importados una sola vez.

## Recomendación

Importar estilos del componente en un punto central de la aplicación para evitar duplicidad de cascada.
```

<a id="file-0009"></a>

### 0009 — `docs/01-instalacion/02-instalacion.md`

- **Lenguaje:** `markdown`
- **Líneas:** `29`
- **Tamaño original:** `0.6 KB`
- **SHA1 corto:** `131c24ad52`
- **Estado:** `completo`

```markdown
# Instalación

Ejemplo conceptual:

``​`bash
npm install @sisad-pdfme/core
``​`

En monorepo/local, consumir desde el path interno:

``​`ts
import { Designer, Form, Viewer, generate } from '@/sisad-pdfme';
``​`

## Estilos

``​`ts
import '@/sisad-pdfme/ui/styles/tokens.css';
import '@/sisad-pdfme/ui/styles/sisad-pdfme-global.css';
import '@/sisad-pdfme/ui/styles/canvas-interactions.css';
import '@/sisad-pdfme/ui/styles/sisad-pdfme-runtime.css';
``​`

Si se usa Tailwind bridge, importar una sola vez:

``​`ts
import '@/styles/tailwind.css';
import '@/styles/sisad-tailwind-bridge.css';
``​`
```

<a id="file-0010"></a>

### 0010 — `docs/01-instalacion/03-configuracion-vite.md`

- **Lenguaje:** `markdown`
- **Líneas:** `13`
- **Tamaño original:** `0.4 KB`
- **SHA1 corto:** `5f0483a471`
- **Estado:** `completo`

```markdown
# Configuración con Vite

## PDF worker

Verificar que el worker de PDF.js sea accesible según la estrategia del proyecto.

## Assets

Los PDFs, imágenes de ejemplo y fuentes deben servirse desde rutas accesibles por el navegador.

## Tailwind

Si el proyecto usa Tailwind, mantener `preflight: false` para no alterar canvas, Ant Design, inputs o medidas de PDF.
```

<a id="file-0011"></a>

### 0011 — `docs/01-instalacion/04-importacion-estilos.md`

- **Lenguaje:** `markdown`
- **Líneas:** `18`
- **Tamaño original:** `0.5 KB`
- **SHA1 corto:** `8e582de49a`
- **Estado:** `completo`

```markdown
# Importación de estilos

## Regla

Los estilos de `sisad-pdfme` deben importarse una sola vez.

## Orden sugerido

``​`ts
import './styles/tailwind.css';
import './sisad-pdfme/ui/styles/tokens.css';
import './sisad-pdfme/ui/styles/sisad-pdfme-global.css';
import './sisad-pdfme/ui/styles/canvas-interactions.css';
import './sisad-pdfme/ui/styles/sisad-pdfme-runtime.css';
import './styles/sisad-tailwind-bridge.css';
``​`

El orden puede variar según el proyecto, pero debe documentarse y no duplicarse.
```

<a id="file-0012"></a>

### 0012 — `docs/01-instalacion/README.md`

- **Lenguaje:** `markdown`
- **Líneas:** `6`
- **Tamaño original:** `0.2 KB`
- **SHA1 corto:** `1a88ecf821`
- **Estado:** `completo`

```markdown
# Índice

- [01-requisitos.md](./01-requisitos.md)
- [02-instalacion.md](./02-instalacion.md)
- [03-configuracion-vite.md](./03-configuracion-vite.md)
- [04-importacion-estilos.md](./04-importacion-estilos.md)
```

<a id="file-0013"></a>

### 0013 — `docs/02-conceptos/01-template.md`

- **Lenguaje:** `markdown`
- **Líneas:** `22`
- **Tamaño original:** `0.4 KB`
- **SHA1 corto:** `6e6a124a54`
- **Estado:** `completo`

```markdown
# Template

Un template contiene los documentos PDF, schemas, recipients, configuración y metadata.

## Estructura conceptual

``​`ts
type Template = {
  documents: PdfDocument[];
  schemas: SchemaForUI[][];
  recipients?: Recipient[];
  assignments?: Assignment[];
  version?: string;
  metadata?: Record<string, unknown>;
};
``​`

## Reglas

- Debe ser serializable.
- No debe contener objetos DOM.
- Debe preservar identidad de schemas.
```

<a id="file-0014"></a>

### 0014 — `docs/02-conceptos/02-documents-pages.md`

- **Lenguaje:** `markdown`
- **Líneas:** `15`
- **Tamaño original:** `0.3 KB`
- **SHA1 corto:** `ae6d793efe`
- **Estado:** `completo`

```markdown
# Documents y Pages

Cada schema debe conocer el documento y página donde vive.

Campos críticos:

``​`txt
documentId
pageNumber
pageIndex
``​`

## Regla multipágina

Nunca asumir página 1. Todo drop, selección, move, resize, overlay y snapshot debe conservar la página real.
```

<a id="file-0015"></a>

### 0015 — `docs/02-conceptos/03-schemas.md`

- **Lenguaje:** `markdown`
- **Líneas:** `22`
- **Tamaño original:** `0.3 KB`
- **SHA1 corto:** `fd7d9be2d5`
- **Estado:** `completo`

```markdown
# Schemas

Un schema representa un campo sobre el PDF.

Campos mínimos:

``​`ts
type BaseSchema = {
  schemaUid: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  documentId?: string;
  pageNumber?: number;
  ownerRecipientId?: string;
  ownerColor?: string;
};
``​`

Los schemas pueden extender esta base según familia.
```

<a id="file-0016"></a>

### 0016 — `docs/02-conceptos/04-recipients.md`

- **Lenguaje:** `markdown`
- **Líneas:** `16`
- **Tamaño original:** `0.3 KB`
- **SHA1 corto:** `9852c9c4a0`
- **Estado:** `completo`

```markdown
# Recipients

Los recipients representan usuarios, firmantes o actores del documento.

``​`ts
type Recipient = {
  id: string;
  name: string;
  role?: 'signer' | 'viewer' | 'coordinator' | string;
  color?: string;
};
``​`

## Regla de color

El color activo se usa para nuevos schemas. Los schemas existentes conservan su `ownerColor` original.
```

<a id="file-0017"></a>

### 0017 — `docs/02-conceptos/05-assignments.md`

- **Lenguaje:** `markdown`
- **Líneas:** `12`
- **Tamaño original:** `0.3 KB`
- **SHA1 corto:** `8e96704d27`
- **Estado:** `completo`

```markdown
# Assignments

Un assignment define una relación explícita entre campo, recipient, documento o flujo.

Se usa para:

- visibilidad por destinatario;
- edición por destinatario;
- flujos secuenciales;
- integración con backend.

Debe ser serializable y no reemplaza `ownerRecipientId`, lo complementa.
```

<a id="file-0018"></a>

### 0018 — `docs/02-conceptos/06-runtime-modes.md`

- **Lenguaje:** `markdown`
- **Líneas:** `12`
- **Tamaño original:** `0.3 KB`
- **SHA1 corto:** `b9a1b1513c`
- **Estado:** `completo`

```markdown
# Runtime modes

`sisad-pdfme` debe distinguir modos:

| Modo | Propósito |
|---|---|
| designer | Editar estructura y campos. |
| form | Capturar valores. |
| viewer | Ver valores en solo lectura. |
| pdf | Generar salida final. |

Cada schema debe declarar cómo se ve y comporta por modo.
```

<a id="file-0019"></a>

### 0019 — `docs/02-conceptos/07-snapshot.md`

- **Lenguaje:** `markdown`
- **Líneas:** `19`
- **Tamaño original:** `0.3 KB`
- **SHA1 corto:** `3e68b2d140`
- **Estado:** `completo`

```markdown
# Snapshot

El snapshot es el estado serializable del diseñador.

Debe preservar:

``​`txt
schemaUid
documentId
pageNumber
x/y/width/height/rotation
ownerRecipientId
ownerColor
options
selected values
__designer
``​`

No debe incluir referencias DOM ni funciones.
```

<a id="file-0020"></a>

### 0020 — `docs/02-conceptos/README.md`

- **Lenguaje:** `markdown`
- **Líneas:** `9`
- **Tamaño original:** `0.3 KB`
- **SHA1 corto:** `c5be0b5c3f`
- **Estado:** `completo`

```markdown
# Índice

- [01-template.md](./01-template.md)
- [02-documents-pages.md](./02-documents-pages.md)
- [03-schemas.md](./03-schemas.md)
- [04-recipients.md](./04-recipients.md)
- [05-assignments.md](./05-assignments.md)
- [06-runtime-modes.md](./06-runtime-modes.md)
- [07-snapshot.md](./07-snapshot.md)
```

<a id="file-0021"></a>

### 0021 — `docs/03-designer/01-designer-overview.md`

- **Lenguaje:** `markdown`
- **Líneas:** `16`
- **Tamaño original:** `0.4 KB`
- **SHA1 corto:** `5d5c213aa6`
- **Estado:** `completo`

```markdown
# Designer

El Designer es el runtime visual para crear y configurar campos sobre documentos PDF.

Incluye:

- LeftSidebar: catálogo de fields.
- Canvas/Paper: superficie PDF.
- RightSidebar: inspector, lista, documentos y comentarios.
- Toolbars y overlays.
- Moveable/Selecto.
- CommandBus.

## Dueño de responsabilidades

El Designer controla UI interna. El host no debe duplicar sidebars, inspector, zoom o selección.
```

<a id="file-0022"></a>

### 0022 — `docs/03-designer/02-props.md`

- **Lenguaje:** `markdown`
- **Líneas:** `24`
- **Tamaño original:** `0.5 KB`
- **SHA1 corto:** `80920c580b`
- **Estado:** `completo`

```markdown
# Props del Designer

Ejemplo conceptual:

``​`tsx
<Designer
  template={template}
  plugins={plugins}
  recipients={recipients}
  activeRecipientId={activeRecipientId}
  onChangeTemplate={setTemplate}
  onSave={handleSave}
/>
``​`

## Props comunes

| Prop | Descripción |
|---|---|
| template | Estado del documento. |
| plugins | Registro de schemas. |
| recipients | Destinatarios. |
| activeRecipientId | Destinatario activo. |
| onChangeTemplate | Callback de cambio. |
```

<a id="file-0023"></a>

### 0023 — `docs/03-designer/03-canvas.md`

- **Lenguaje:** `markdown`
- **Líneas:** `17`
- **Tamaño original:** `0.4 KB`
- **SHA1 corto:** `1cb35f1838`
- **Estado:** `completo`

```markdown
# Canvas

El canvas contiene las páginas PDF y overlays de schemas.

## Reglas críticas

- No modificar geometría con CSS host.
- No asumir página 1.
- No usar `setTimeout` para coordenadas.
- No forzar z-index arbitrario.
- Respetar scroll y zoom.

## Validación mínima

- Drop en página 2.
- Selección en página 2.
- Move/resize/rotate en página 2.
```

<a id="file-0024"></a>

### 0024 — `docs/03-designer/04-left-sidebar.md`

- **Lenguaje:** `markdown`
- **Líneas:** `17`
- **Tamaño original:** `0.3 KB`
- **SHA1 corto:** `3c27c73d8a`
- **Estado:** `completo`

```markdown
# LeftSidebar

El LeftSidebar muestra el catálogo de schemas disponibles.

## Debe permitir

- buscar fields;
- filtrar por familia;
- arrastrar al canvas;
- mostrar favoritos/recientes;
- respetar modo compacto.

## No debe contener

- lógica de negocio del host;
- renderers duplicados;
- configuración avanzada que pertenece al inspector.
```

<a id="file-0025"></a>

### 0025 — `docs/03-designer/05-right-sidebar.md`

- **Lenguaje:** `markdown`
- **Líneas:** `14`
- **Tamaño original:** `0.3 KB`
- **SHA1 corto:** `f6f5cabeb3`
- **Estado:** `completo`

```markdown
# RightSidebar

El RightSidebar agrupa:

- DetailView / inspector;
- ListView;
- Documents rail;
- Comments rail.

## Reglas

- No duplicar paneles desde el host.
- La selección actual debe sincronizarse con DetailView.
- ListView debe usar `schemaUid` como identidad.
```

<a id="file-0026"></a>

### 0026 — `docs/03-designer/06-detail-view.md`

- **Lenguaje:** `markdown`
- **Líneas:** `25`
- **Tamaño original:** `0.3 KB`
- **SHA1 corto:** `9a0d4e73c7`
- **Estado:** `completo`

```markdown
# DetailView

DetailView configura el schema seleccionado.

Secciones recomendadas:

``​`txt
identity
content
options
signature
appearance
validation
dataLabel
help
location
autoPlace
permissions
collaboration
conditional
comments
advanced
``​`

Cada familia de schema declara qué secciones usa.
```

<a id="file-0027"></a>

### 0027 — `docs/03-designer/07-list-view.md`

- **Lenguaje:** `markdown`
- **Líneas:** `14`
- **Tamaño original:** `0.3 KB`
- **SHA1 corto:** `a9de2f69ab`
- **Estado:** `completo`

```markdown
# ListView

ListView muestra los schemas del documento/página actual o del contexto filtrado.

Debe permitir:

- buscar campos;
- filtrar por tipo/familia;
- seleccionar schema;
- renombrar si aplica;
- ver owner/recipient;
- navegar a la página del campo.

No debe mutar schemas directamente sin CommandBus o update centralizado.
```

<a id="file-0028"></a>

### 0028 — `docs/03-designer/08-toolbar-commandbus.md`

- **Lenguaje:** `markdown`
- **Líneas:** `14`
- **Tamaño original:** `0.2 KB`
- **SHA1 corto:** `2f34578d29`
- **Estado:** `completo`

```markdown
# Toolbar y CommandBus

El CommandBus centraliza acciones:

- undo/redo;
- duplicate;
- delete;
- align;
- distribute;
- lock/unlock;
- assign recipient;
- update schema.

Las toolbars deben disparar comandos, no mutar estado de forma paralela.
```

<a id="file-0029"></a>

### 0029 — `docs/03-designer/09-comments.md`

- **Lenguaje:** `markdown`
- **Líneas:** `11`
- **Tamaño original:** `0.2 KB`
- **SHA1 corto:** `38686bdb8e`
- **Estado:** `completo`

```markdown
# Comentarios

Los comentarios pueden asociarse a:

- documento;
- página;
- schema;
- recipient;
- coordenadas.

Deben preservarse en snapshot y no interferir con selección/Moveable/Selecto.
```

<a id="file-0030"></a>

### 0030 — `docs/03-designer/10-multi-documento.md`

- **Lenguaje:** `markdown`
- **Líneas:** `10`
- **Tamaño original:** `0.3 KB`
- **SHA1 corto:** `1cde812891`
- **Estado:** `completo`

```markdown
# Multidocumento

El diseñador debe soportar múltiples PDFs en un mismo template.

Reglas:

- cada schema conserva `documentId`;
- el canvas renderiza por documento activo;
- snapshot conserva documentos y schemas;
- no-overlap se evalúa por document/page/owner.
```

<a id="file-0031"></a>

### 0031 — `docs/03-designer/README.md`

- **Lenguaje:** `markdown`
- **Líneas:** `12`
- **Tamaño original:** `0.4 KB`
- **SHA1 corto:** `2365c2eb3c`
- **Estado:** `completo`

```markdown
# Índice

- [01-designer-overview.md](./01-designer-overview.md)
- [02-props.md](./02-props.md)
- [03-canvas.md](./03-canvas.md)
- [04-left-sidebar.md](./04-left-sidebar.md)
- [05-right-sidebar.md](./05-right-sidebar.md)
- [06-detail-view.md](./06-detail-view.md)
- [07-list-view.md](./07-list-view.md)
- [08-toolbar-commandbus.md](./08-toolbar-commandbus.md)
- [09-comments.md](./09-comments.md)
- [10-multi-documento.md](./10-multi-documento.md)
```

<a id="file-0032"></a>

### 0032 — `docs/04-schemas/01-schema-base.md`

- **Lenguaje:** `markdown`
- **Líneas:** `23`
- **Tamaño original:** `0.3 KB`
- **SHA1 corto:** `aa452c62b5`
- **Estado:** `completo`

```markdown
# Schema base

Todo schema debe conservar:

``​`txt
schemaUid
type
name/label
documentId
pageNumber
x/y/width/height
ownerRecipientId
ownerColor
required
readOnly
locked
hidden
__designer
``​`

## Identidad

`schemaUid` es la identidad técnica. `name`/`label` son visuales.
```

<a id="file-0033"></a>

### 0033 — `docs/04-schemas/02-familias.md`

- **Lenguaje:** `markdown`
- **Líneas:** `12`
- **Tamaño original:** `0.4 KB`
- **SHA1 corto:** `94bded8294`
- **Estado:** `completo`

```markdown
# Familias de schemas

| Familia | Schemas |
|---|---|
| text-like | text, number, date, fullName, email, company, title |
| option-based | checkbox, checkboxGroup, radioGroup, select/dropdown |
| signing-based | signature, initials, dateSigned |
| action-based | attachment, note, approve, decline |
| media | image, svg, stamp |
| barcode | qrCode, code128, ean13, pdf417 |
| table | table |
| shape | line, rect, ellipse |
```

<a id="file-0034"></a>

### 0034 — `docs/04-schemas/03-text-like.md`

- **Lenguaje:** `markdown`
- **Líneas:** `24`
- **Tamaño original:** `0.2 KB`
- **SHA1 corto:** `acb945a71c`
- **Estado:** `completo`

```markdown
# Text-like schemas

Incluye:

- text;
- number;
- date;
- dateTime;
- time;
- fullName;
- emailAddress;
- company;
- title.

Comparten:

- placeholder;
- defaultValue;
- required;
- readOnly;
- validation;
- appearance;
- dataLabel;
- tooltip.
```

<a id="file-0035"></a>

### 0035 — `docs/04-schemas/04-option-based.md`

- **Lenguaje:** `markdown`
- **Líneas:** `18`
- **Tamaño original:** `0.3 KB`
- **SHA1 corto:** `ddd8bcfd18`
- **Estado:** `completo`

```markdown
# Option-based schemas

Incluye:

- checkbox;
- checkboxGroup;
- radioGroup;
- select/dropdown.

## Regla clave

Las opciones internas de grupos no son schemas independientes.

``​`txt
Root del grupo -> data-schema-id
Option interna -> data-option-id
Botón +        -> data-role="group-add-option"
``​`
```

<a id="file-0036"></a>

### 0036 — `docs/04-schemas/05-signing-based.md`

- **Lenguaje:** `markdown`
- **Líneas:** `13`
- **Tamaño original:** `0.3 KB`
- **SHA1 corto:** `b66f935ee7`
- **Estado:** `completo`

```markdown
# Signing-based schemas

Incluye:

- signature;
- initials;
- dateSigned.

## Reglas

- La firma representa una acción/estado, no solo una imagen.
- `dateSigned` normalmente es readOnly y se autocompleta.
- Providers externos se integran por adaptador, no dentro del schema visual.
```

<a id="file-0037"></a>

### 0037 — `docs/04-schemas/06-action-based.md`

- **Lenguaje:** `markdown`
- **Líneas:** `15`
- **Tamaño original:** `0.2 KB`
- **SHA1 corto:** `26486dbe2a`
- **Estado:** `completo`

```markdown
# Action-based schemas

Incluye:

- attachment;
- note;
- approve;
- decline.

## Comportamiento

- Designer: placeholder/configuración.
- Form: acción real.
- Viewer: estado final.
- PDF: representación final limpia.
```

<a id="file-0038"></a>

### 0038 — `docs/04-schemas/07-media-barcode-table-shapes.md`

- **Lenguaje:** `markdown`
- **Líneas:** `22`
- **Tamaño original:** `0.3 KB`
- **SHA1 corto:** `f11b8f47d2`
- **Estado:** `completo`

```markdown
# Media, Barcode, Table y Shapes

## Media

- image;
- svg;
- stamp.

## Barcode

- qrCode;
- code128;
- ean13;
- pdf417.

## Table

Tabla debe separar controles de edición en Designer y render limpio en Viewer/PDF.

## Shapes

line, rect, ellipse deben renderizar sin chrome invasivo.
```

<a id="file-0039"></a>

### 0039 — `docs/04-schemas/08-custom-schemas.md`

- **Lenguaje:** `markdown`
- **Líneas:** `15`
- **Tamaño original:** `0.3 KB`
- **SHA1 corto:** `14c4e70d46`
- **Estado:** `completo`

```markdown
# Schemas custom

Un schema custom debe declarar:

- key estable;
- default schema;
- designer renderer;
- form renderer si aplica;
- viewer renderer;
- pdf renderer si aplica;
- inspector contract;
- value adapter;
- snapshot compatibility.

No debe guardar datos sensibles en el schema.
```

<a id="file-0040"></a>

### 0040 — `docs/04-schemas/09-inspector-contract.md`

- **Lenguaje:** `markdown`
- **Líneas:** `22`
- **Tamaño original:** `0.4 KB`
- **SHA1 corto:** `9619bd6ae8`
- **Estado:** `completo`

```markdown
# Contrato del inspector por schema

Cada schema debe declarar qué secciones usa:

``​`ts
type SchemaInspectorContract = {
  sections: {
    basics?: boolean;
    content?: boolean;
    options?: boolean;
    appearance?: boolean;
    validation?: boolean;
    dataLabel?: boolean;
    help?: boolean;
    location?: boolean;
    collaboration?: boolean;
    advanced?: boolean;
  };
};
``​`

Esto evita que cada schema invente su propio sidebar.
```

<a id="file-0041"></a>

### 0041 — `docs/04-schemas/10-docusing-mapping.md`

- **Lenguaje:** `markdown`
- **Líneas:** `17`
- **Tamaño original:** `0.4 KB`
- **SHA1 corto:** `e5e5259286`
- **Estado:** `completo`

```markdown
# Mapping funcional DocuSign-like

No se copia UI ni marca; se usa como referencia de procesos.

| DocuSign | SISAD PDFME |
|---|---|
| SignHere | signature |
| InitialHere | initials |
| DateSigned | dateSigned |
| Text | text |
| Number | number |
| Checkbox | checkbox |
| RadioGroup | radioGroup |
| List | select/dropdown |
| SignerAttachment | attachment |
| Note | note |
| Approve/Decline | approve/decline |
```

<a id="file-0042"></a>

### 0042 — `docs/04-schemas/README.md`

- **Lenguaje:** `markdown`
- **Líneas:** `12`
- **Tamaño original:** `0.5 KB`
- **SHA1 corto:** `7ca5af78fc`
- **Estado:** `completo`

```markdown
# Índice

- [01-schema-base.md](./01-schema-base.md)
- [02-familias.md](./02-familias.md)
- [03-text-like.md](./03-text-like.md)
- [04-option-based.md](./04-option-based.md)
- [05-signing-based.md](./05-signing-based.md)
- [06-action-based.md](./06-action-based.md)
- [07-media-barcode-table-shapes.md](./07-media-barcode-table-shapes.md)
- [08-custom-schemas.md](./08-custom-schemas.md)
- [09-inspector-contract.md](./09-inspector-contract.md)
- [10-docusing-mapping.md](./10-docusing-mapping.md)
```

<a id="file-0043"></a>

### 0043 — `docs/05-runtime/01-form.md`

- **Lenguaje:** `markdown`
- **Líneas:** `13`
- **Tamaño original:** `0.2 KB`
- **SHA1 corto:** `8fd2c7f8ed`
- **Estado:** `completo`

```markdown
# Form

Form renderiza schemas interactivos para captura de valores.

Debe respetar:

- recipient activo;
- required;
- readOnly;
- locked;
- hidden;
- valores por `schemaUid`;
- validación por schema.
```

<a id="file-0044"></a>

### 0044 — `docs/05-runtime/02-viewer.md`

- **Lenguaje:** `markdown`
- **Líneas:** `10`
- **Tamaño original:** `0.2 KB`
- **SHA1 corto:** `4da19e48b2`
- **Estado:** `completo`

```markdown
# Viewer

Viewer muestra el documento en solo lectura.

Reglas:

- nunca editable;
- no mostrar controles de Designer;
- respetar visibilidad por recipient si aplica;
- mostrar valores finales limpios.
```

<a id="file-0045"></a>

### 0045 — `docs/05-runtime/03-values.md`

- **Lenguaje:** `markdown`
- **Líneas:** `11`
- **Tamaño original:** `0.2 KB`
- **SHA1 corto:** `e108513923`
- **Estado:** `completo`

```markdown
# Valores

Los valores deben indexarse por `schemaUid`.

Ejemplo:

``​`ts
type Values = Record<string, unknown>;
``​`

Nunca depender solo de `name` o `label`, porque pueden repetirse o cambiar visualmente.
```

<a id="file-0046"></a>

### 0046 — `docs/05-runtime/04-validation.md`

- **Lenguaje:** `markdown`
- **Líneas:** `13`
- **Tamaño original:** `0.2 KB`
- **SHA1 corto:** `c2bbe4faf3`
- **Estado:** `completo`

```markdown
# Validación

Validar según familia:

- required;
- min/max;
- regex;
- date format;
- selected options;
- attachment required;
- signature required.

La validación debe producir mensajes de usuario, no errores técnicos.
```

<a id="file-0047"></a>

### 0047 — `docs/05-runtime/05-recipient-filtering.md`

- **Lenguaje:** `markdown`
- **Líneas:** `10`
- **Tamaño original:** `0.2 KB`
- **SHA1 corto:** `c780d717e4`
- **Estado:** `completo`

```markdown
# Filtrado por recipient

Un schema es visible si:

- pertenece al recipient activo;
- es shared/global;
- existe assignment explícito;
- es contextual readonly permitido.

En vista global se ven todos los schemas no hidden.
```

<a id="file-0048"></a>

### 0048 — `docs/05-runtime/README.md`

- **Lenguaje:** `markdown`
- **Líneas:** `7`
- **Tamaño original:** `0.2 KB`
- **SHA1 corto:** `1501525d81`
- **Estado:** `completo`

```markdown
# Índice

- [01-form.md](./01-form.md)
- [02-viewer.md](./02-viewer.md)
- [03-values.md](./03-values.md)
- [04-validation.md](./04-validation.md)
- [05-recipient-filtering.md](./05-recipient-filtering.md)
```

<a id="file-0049"></a>

### 0049 — `docs/06-generator/01-generator-overview.md`

- **Lenguaje:** `markdown`
- **Líneas:** `10`
- **Tamaño original:** `0.2 KB`
- **SHA1 corto:** `7268116b9a`
- **Estado:** `completo`

```markdown
# Generator

Generator produce PDF final usando template + valores.

## Reglas

- No debe imprimir chrome de Designer.
- Debe usar valores finales de Viewer/Form.
- Debe respetar páginas/documentos.
- Debe conservar salida limpia.
```

<a id="file-0050"></a>

### 0050 — `docs/06-generator/02-pdf-output.md`

- **Lenguaje:** `markdown`
- **Líneas:** `8`
- **Tamaño original:** `0.2 KB`
- **SHA1 corto:** `4114424bdc`
- **Estado:** `completo`

```markdown
# Salida PDF

La salida debe:

- preservar dimensiones de página;
- ubicar campos con coordenadas correctas;
- renderizar textos, checks, firmas, imágenes, tablas y barcodes;
- no incluir toolbars, labels técnicos ni bordes de edición.
```

<a id="file-0051"></a>

### 0051 — `docs/06-generator/03-fonts-assets.md`

- **Lenguaje:** `markdown`
- **Líneas:** `8`
- **Tamaño original:** `0.2 KB`
- **SHA1 corto:** `69d69cbacd`
- **Estado:** `completo`

```markdown
# Fuentes y assets

Para generación PDF:

- registrar fuentes si se usan;
- validar imágenes embebidas;
- asegurar disponibilidad de SVG/barcodes;
- controlar fallback de fuentes.
```

<a id="file-0052"></a>

### 0052 — `docs/06-generator/README.md`

- **Lenguaje:** `markdown`
- **Líneas:** `5`
- **Tamaño original:** `0.2 KB`
- **SHA1 corto:** `904b672be2`
- **Estado:** `completo`

```markdown
# Índice

- [01-generator-overview.md](./01-generator-overview.md)
- [02-pdf-output.md](./02-pdf-output.md)
- [03-fonts-assets.md](./03-fonts-assets.md)
```

<a id="file-0053"></a>

### 0053 — `docs/07-integraciones/01-react.md`

- **Lenguaje:** `markdown`
- **Líneas:** `12`
- **Tamaño original:** `0.3 KB`
- **SHA1 corto:** `89a0951e1e`
- **Estado:** `completo`

```markdown
# Integración React

Ejemplo conceptual:

``​`tsx
function Editor() {
  const [template, setTemplate] = useState(initialTemplate);
  return <Designer template={template} onChangeTemplate={setTemplate} />;
}
``​`

El host debe controlar negocio, no duplicar UI interna del diseñador.
```

<a id="file-0054"></a>

### 0054 — `docs/07-integraciones/02-host-app.md`

- **Lenguaje:** `markdown`
- **Líneas:** `18`
- **Tamaño original:** `0.3 KB`
- **SHA1 corto:** `e743ece694`
- **Estado:** `completo`

```markdown
# Integración con host app

El host puede controlar:

- carga de documentos;
- recipients;
- guardado;
- navegación externa;
- permisos de negocio;
- callbacks.

No debe controlar:

- zoom interno;
- sidebars internas;
- selección;
- Moveable/Selecto;
- inspector.
```

<a id="file-0055"></a>

### 0055 — `docs/07-integraciones/03-signature-providers.md`

- **Lenguaje:** `markdown`
- **Líneas:** `14`
- **Tamaño original:** `0.3 KB`
- **SHA1 corto:** `bac4056946`
- **Estado:** `completo`

```markdown
# Signature providers

Los proveedores de firma externos deben integrarse mediante adapter/registry.

El schema `signature` no debe depender directamente de un proveedor específico.

Configuración ejemplo:

``​`ts
signature: {
  mode: 'provider',
  providerKey: 'oneshot'
}
``​`
```

<a id="file-0056"></a>

### 0056 — `docs/07-integraciones/04-external-forms.md`

- **Lenguaje:** `markdown`
- **Líneas:** `9`
- **Tamaño original:** `0.2 KB`
- **SHA1 corto:** `0731422ee0`
- **Estado:** `completo`

```markdown
# External Forms

ExternalForms debe consumir `Form` y `Viewer`, no reconstruir renderers manuales.

Flujo:

``​`txt
snapshot -> resolve document -> resolve recipient -> Form -> values -> Viewer -> Generator
``​`
```

<a id="file-0057"></a>

### 0057 — `docs/07-integraciones/README.md`

- **Lenguaje:** `markdown`
- **Líneas:** `6`
- **Tamaño original:** `0.2 KB`
- **SHA1 corto:** `c0d01a24ce`
- **Estado:** `completo`

```markdown
# Índice

- [01-react.md](./01-react.md)
- [02-host-app.md](./02-host-app.md)
- [03-signature-providers.md](./03-signature-providers.md)
- [04-external-forms.md](./04-external-forms.md)
```

<a id="file-0058"></a>

### 0058 — `docs/08-api-reference/01-designer-api.md`

- **Lenguaje:** `markdown`
- **Líneas:** `10`
- **Tamaño original:** `0.3 KB`
- **SHA1 corto:** `f871049016`
- **Estado:** `completo`

```markdown
# API Reference — Designer

| Prop | Tipo | Descripción |
|---|---|---|
| template | Template | Estado editable. |
| plugins | PluginRegistry | Schemas disponibles. |
| recipients | Recipient[] | Destinatarios. |
| activeRecipientId | string | Destinatario activo. |
| onChangeTemplate | function | Cambio de template. |
| onSave | function | Guardado. |
```

<a id="file-0059"></a>

### 0059 — `docs/08-api-reference/02-form-api.md`

- **Lenguaje:** `markdown`
- **Líneas:** `9`
- **Tamaño original:** `0.2 KB`
- **SHA1 corto:** `c80a492504`
- **Estado:** `completo`

```markdown
# API Reference — Form

| Prop | Descripción |
|---|---|
| template | Snapshot/template. |
| values | Valores por schemaUid. |
| onChangeValues | Callback de valores. |
| activeRecipientId | Recipient actual. |
| readonly | Bloqueo global opcional. |
```

<a id="file-0060"></a>

### 0060 — `docs/08-api-reference/03-viewer-api.md`

- **Lenguaje:** `markdown`
- **Líneas:** `7`
- **Tamaño original:** `0.1 KB`
- **SHA1 corto:** `068eb504e6`
- **Estado:** `completo`

```markdown
# API Reference — Viewer

Viewer recibe template y valores para mostrar salida readonly.

``​`tsx
<Viewer template={template} values={values} />
``​`
```

<a id="file-0061"></a>

### 0061 — `docs/08-api-reference/04-generator-api.md`

- **Lenguaje:** `markdown`
- **Líneas:** `9`
- **Tamaño original:** `0.2 KB`
- **SHA1 corto:** `b8ecf20142`
- **Estado:** `completo`

```markdown
# API Reference — Generator

Ejemplo conceptual:

``​`ts
const pdfBytes = await generate({ template, values });
``​`

Debe usarse con snapshots válidos y assets disponibles.
```

<a id="file-0062"></a>

### 0062 — `docs/08-api-reference/05-plugin-api.md`

- **Lenguaje:** `markdown`
- **Líneas:** `14`
- **Tamaño original:** `0.2 KB`
- **SHA1 corto:** `28df9240a3`
- **Estado:** `completo`

```markdown
# API Reference — Plugins

Un plugin de schema declara:

- type;
- label;
- icon;
- default schema;
- designer render;
- form render;
- viewer render;
- pdf render;
- inspector contract;
- value adapter.
```

<a id="file-0063"></a>

### 0063 — `docs/08-api-reference/README.md`

- **Lenguaje:** `markdown`
- **Líneas:** `7`
- **Tamaño original:** `0.2 KB`
- **SHA1 corto:** `909177b8db`
- **Estado:** `completo`

```markdown
# Índice

- [01-designer-api.md](./01-designer-api.md)
- [02-form-api.md](./02-form-api.md)
- [03-viewer-api.md](./03-viewer-api.md)
- [04-generator-api.md](./04-generator-api.md)
- [05-plugin-api.md](./05-plugin-api.md)
```

<a id="file-0064"></a>

### 0064 — `docs/09-theming/01-tokens-css.md`

- **Lenguaje:** `markdown`
- **Líneas:** `14`
- **Tamaño original:** `0.2 KB`
- **SHA1 corto:** `9343a350dd`
- **Estado:** `completo`

```markdown
# Tokens CSS

`tokens.css` es la fuente de verdad visual.

No eliminar variables críticas:

``​`txt
--sisad-pdfme-*
--paper-*
--schema-owner-color
--active-recipient-color
``​`

Los tokens pueden mapearse a Tailwind, pero no deben duplicarse.
```

<a id="file-0065"></a>

### 0065 — `docs/09-theming/02-tailwind-bridge.md`

- **Lenguaje:** `markdown`
- **Líneas:** `10`
- **Tamaño original:** `0.3 KB`
- **SHA1 corto:** `4c1edc4360`
- **Estado:** `completo`

```markdown
# Tailwind Bridge

El bridge permite migrar estilos sin romper classNames existentes.

Reglas:

- no activar preflight;
- no tocar geometría/paper/zoom;
- no tocar `.moveable-*` ni `.selecto-*` desde host;
- no duplicar reglas entre CSS legacy y Tailwind.
```

<a id="file-0066"></a>

### 0066 — `docs/09-theming/03-baseline-visual.md`

- **Lenguaje:** `markdown`
- **Líneas:** `11`
- **Tamaño original:** `0.2 KB`
- **SHA1 corto:** `146d6c7273`
- **Estado:** `completo`

```markdown
# Baseline visual

Si existe una carpeta de capturas baseline, usarla para regresión visual.

Ejemplo:

``​`txt
public/img-version
``​`

El objetivo de Tailwind es preservar la intención visual, no rediseñar sin control.
```

<a id="file-0067"></a>

### 0067 — `docs/09-theming/04-css-migration.md`

- **Lenguaje:** `markdown`
- **Líneas:** `11`
- **Tamaño original:** `0.2 KB`
- **SHA1 corto:** `17f85d9e2f`
- **Estado:** `completo`

```markdown
# Migración CSS a Tailwind

Clasificar cada regla:

1. JSX Tailwind.
2. Bridge `@apply`.
3. CSS legacy por geometría.
4. Token.
5. Eliminar duplicado.

Nunca migrar ciegamente reglas de canvas, transform, scale, paper o overlays.
```

<a id="file-0068"></a>

### 0068 — `docs/09-theming/README.md`

- **Lenguaje:** `markdown`
- **Líneas:** `6`
- **Tamaño original:** `0.2 KB`
- **SHA1 corto:** `22db8aad9f`
- **Estado:** `completo`

```markdown
# Índice

- [01-tokens-css.md](./01-tokens-css.md)
- [02-tailwind-bridge.md](./02-tailwind-bridge.md)
- [03-baseline-visual.md](./03-baseline-visual.md)
- [04-css-migration.md](./04-css-migration.md)
```

<a id="file-0069"></a>

### 0069 — `docs/10-testing-qa/01-manual-checklist.md`

- **Lenguaje:** `markdown`
- **Líneas:** `26`
- **Tamaño original:** `0.3 KB`
- **SHA1 corto:** `e6decdfdca`
- **Estado:** `completo`

```markdown
# Checklist manual

## Canvas

- Drop página 1.
- Drop página 2+.
- Selección simple.
- Selección múltiple.
- Move/resize/rotate.
- Zoom.
- Scroll.

## Schemas

- Text.
- CheckboxGroup.
- RadioGroup.
- Signature.
- Attachment.
- Table.

## Snapshot

- Export.
- Import.
- Roundtrip.
```

<a id="file-0070"></a>

### 0070 — `docs/10-testing-qa/02-regression-matrix.md`

- **Lenguaje:** `markdown`
- **Líneas:** `10`
- **Tamaño original:** `0.3 KB`
- **SHA1 corto:** `3c7393a74d`
- **Estado:** `completo`

```markdown
# Regression Matrix

| Área | Validación |
|---|---|
| Canvas | multipágina y coordenadas |
| Selecto | root only |
| Moveable | transforma root correcto |
| Snapshot | metadata preservada |
| Runtime | Form/Viewer parity |
| PDF | sin chrome de diseñador |
```

<a id="file-0071"></a>

### 0071 — `docs/10-testing-qa/03-playwright.md`

- **Lenguaje:** `markdown`
- **Líneas:** `12`
- **Tamaño original:** `0.2 KB`
- **SHA1 corto:** `f947fc4b54`
- **Estado:** `completo`

```markdown
# Playwright

Usar Playwright para:

- canvas real;
- drag/drop;
- multipágina;
- visual baseline;
- Form/Viewer parity;
- snapshots.

No reemplaza tests unitarios de contratos.
```

<a id="file-0072"></a>

### 0072 — `docs/10-testing-qa/04-vitest.md`

- **Lenguaje:** `markdown`
- **Líneas:** `10`
- **Tamaño original:** `0.2 KB`
- **SHA1 corto:** `e3a971dfef`
- **Estado:** `completo`

```markdown
# Vitest

Usar Vitest para:

- value adapters;
- schema factories;
- inspector contracts;
- snapshot adapters;
- runtime access helpers;
- validation rules.
```

<a id="file-0073"></a>

### 0073 — `docs/10-testing-qa/README.md`

- **Lenguaje:** `markdown`
- **Líneas:** `6`
- **Tamaño original:** `0.2 KB`
- **SHA1 corto:** `0d4cbe0a18`
- **Estado:** `completo`

```markdown
# Índice

- [01-manual-checklist.md](./01-manual-checklist.md)
- [02-regression-matrix.md](./02-regression-matrix.md)
- [03-playwright.md](./03-playwright.md)
- [04-vitest.md](./04-vitest.md)
```

<a id="file-0074"></a>

### 0074 — `docs/11-migraciones/01-legacy-templates.md`

- **Lenguaje:** `markdown`
- **Líneas:** `10`
- **Tamaño original:** `0.3 KB`
- **SHA1 corto:** `38182c9db7`
- **Estado:** `completo`

```markdown
# Migración de templates legacy

Debe existir compatibilidad de lectura para snapshots antiguos.

Reglas:

- normalizar `schemaUid` si falta;
- completar `documentId/pageNumber` si se puede inferir;
- preservar valores existentes;
- no mutar destructivamente sin versión.
```

<a id="file-0075"></a>

### 0075 — `docs/11-migraciones/02-snapshot-versioning.md`

- **Lenguaje:** `markdown`
- **Líneas:** `9`
- **Tamaño original:** `0.2 KB`
- **SHA1 corto:** `cc8ccb2439`
- **Estado:** `completo`

```markdown
# Versionado de snapshot

Todo snapshot debe indicar versión.

``​`ts
snapshotVersion: 'v1' | 'v2' | 'v3'
``​`

Las migraciones deben ser puras, testeables e idempotentes.
```

<a id="file-0076"></a>

### 0076 — `docs/11-migraciones/03-pdfme-upstream.md`

- **Lenguaje:** `markdown`
- **Líneas:** `12`
- **Tamaño original:** `0.2 KB`
- **SHA1 corto:** `997acdd38b`
- **Estado:** `completo`

```markdown
# Migración desde pdfme upstream

`sisad-pdfme` puede partir de contratos de pdfme, pero añade:

- recipients;
- ownership;
- multidocumento;
- comments;
- command bus;
- inspector avanzado;
- runtime access;
- snapshot extendido.
```

<a id="file-0077"></a>

### 0077 — `docs/11-migraciones/README.md`

- **Lenguaje:** `markdown`
- **Líneas:** `5`
- **Tamaño original:** `0.2 KB`
- **SHA1 corto:** `50d3f7c4ed`
- **Estado:** `completo`

```markdown
# Índice

- [01-legacy-templates.md](./01-legacy-templates.md)
- [02-snapshot-versioning.md](./02-snapshot-versioning.md)
- [03-pdfme-upstream.md](./03-pdfme-upstream.md)
```

<a id="file-0078"></a>

### 0078 — `docs/12-troubleshooting/01-canvas.md`

- **Lenguaje:** `markdown`
- **Líneas:** `14`
- **Tamaño original:** `0.3 KB`
- **SHA1 corto:** `4a1358e971`
- **Estado:** `completo`

```markdown
# Troubleshooting — Canvas

## No puedo seleccionar en página 2

Revisar:

- data attributes de página;
- coordenadas relativas;
- Selecto targets;
- filtros por document/page.

## El canvas no hace scroll

Revisar `overflow` en contenedores host y canvas.
```

<a id="file-0079"></a>

### 0079 — `docs/12-troubleshooting/02-pdf-worker.md`

- **Lenguaje:** `markdown`
- **Líneas:** `9`
- **Tamaño original:** `0.2 KB`
- **SHA1 corto:** `212341e608`
- **Estado:** `completo`

```markdown
# Troubleshooting — PDF worker

Síntomas:

- PDF no carga;
- fake worker;
- error de ruta en Vite.

Revisar configuración del worker y assets públicos.
```

<a id="file-0080"></a>

### 0080 — `docs/12-troubleshooting/03-tailwind-regressions.md`

- **Lenguaje:** `markdown`
- **Líneas:** `10`
- **Tamaño original:** `0.3 KB`
- **SHA1 corto:** `44caa579d9`
- **Estado:** `completo`

```markdown
# Troubleshooting — Regresiones Tailwind

Problemas comunes:

- doble entrada Tailwind;
- preflight activo;
- `overflow-hidden` pisando canvas;
- CSS host tocando internals;
- `@apply` purgado si se usa en capa incorrecta;
- duplicidad entre bridge y CSS legacy.
```

<a id="file-0081"></a>

### 0081 — `docs/12-troubleshooting/04-runtime.md`

- **Lenguaje:** `markdown`
- **Líneas:** `16`
- **Tamaño original:** `0.2 KB`
- **SHA1 corto:** `23db82aa14`
- **Estado:** `completo`

```markdown
# Troubleshooting — Runtime

## Campos no visibles

Revisar:

- activeRecipientId;
- isGlobalView;
- hidden;
- ownerRecipientId;
- assignments;
- runtime mode.

## Viewer editable

Viewer nunca debe permitir edición.
```

<a id="file-0082"></a>

### 0082 — `docs/12-troubleshooting/README.md`

- **Lenguaje:** `markdown`
- **Líneas:** `6`
- **Tamaño original:** `0.2 KB`
- **SHA1 corto:** `6f7bb50c72`
- **Estado:** `completo`

```markdown
# Índice

- [01-canvas.md](./01-canvas.md)
- [02-pdf-worker.md](./02-pdf-worker.md)
- [03-tailwind-regressions.md](./03-tailwind-regressions.md)
- [04-runtime.md](./04-runtime.md)
```

<a id="file-0083"></a>

### 0083 — `docs/13-ejemplos/01-basic-designer.md`

- **Lenguaje:** `markdown`
- **Líneas:** `11`
- **Tamaño original:** `0.2 KB`
- **SHA1 corto:** `023ba70296`
- **Estado:** `completo`

```markdown
# Ejemplo — Basic Designer

Usar para validar carga básica de PDF y arrastre de schemas.

Validar:

- PDF visible;
- LeftSidebar;
- RightSidebar;
- Drop text;
- Save snapshot.
```

<a id="file-0084"></a>

### 0084 — `docs/13-ejemplos/02-multi-document-routing.md`

- **Lenguaje:** `markdown`
- **Líneas:** `10`
- **Tamaño original:** `0.2 KB`
- **SHA1 corto:** `203cd7c609`
- **Estado:** `completo`

```markdown
# Ejemplo — Multi Document Routing

Valida:

- múltiples documentos;
- múltiples páginas;
- recipients;
- ownership;
- vista usuario/global;
- todos los schemas estándar.
```

<a id="file-0085"></a>

### 0085 — `docs/13-ejemplos/03-generator-runtime.md`

- **Lenguaje:** `markdown`
- **Líneas:** `9`
- **Tamaño original:** `0.1 KB`
- **SHA1 corto:** `7dfe3c5843`
- **Estado:** `completo`

```markdown
# Ejemplo — Generator Runtime

Valida:

- Form;
- Viewer;
- generación PDF;
- valores por schemaUid;
- parity de schemas.
```

<a id="file-0086"></a>

### 0086 — `docs/13-ejemplos/README.md`

- **Lenguaje:** `markdown`
- **Líneas:** `5`
- **Tamaño original:** `0.2 KB`
- **SHA1 corto:** `6577f28fa7`
- **Estado:** `completo`

```markdown
# Índice

- [01-basic-designer.md](./01-basic-designer.md)
- [02-multi-document-routing.md](./02-multi-document-routing.md)
- [03-generator-runtime.md](./03-generator-runtime.md)
```

<a id="file-0087"></a>

### 0087 — `docs/14-seguridad/01-archivos.md`

- **Lenguaje:** `markdown`
- **Líneas:** `9`
- **Tamaño original:** `0.2 KB`
- **SHA1 corto:** `4886a2eead`
- **Estado:** `completo`

```markdown
# Seguridad — Archivos

Validar:

- tamaño máximo;
- tipo MIME;
- nombres seguros;
- no exponer rutas locales;
- no guardar binarios sensibles en snapshot.
```

<a id="file-0088"></a>

### 0088 — `docs/14-seguridad/02-firma.md`

- **Lenguaje:** `markdown`
- **Líneas:** `5`
- **Tamaño original:** `0.2 KB`
- **SHA1 corto:** `9630badfc3`
- **Estado:** `completo`

```markdown
# Seguridad — Firma

La firma se integra por providers externos.

No guardar claves privadas, archivos P12 o secretos dentro del snapshot del diseñador.
```

<a id="file-0089"></a>

### 0089 — `docs/14-seguridad/README.md`

- **Lenguaje:** `markdown`
- **Líneas:** `4`
- **Tamaño original:** `0.1 KB`
- **SHA1 corto:** `b5cdef2452`
- **Estado:** `completo`

```markdown
# Índice

- [01-archivos.md](./01-archivos.md)
- [02-firma.md](./02-firma.md)
```

<a id="file-0090"></a>

### 0090 — `AGENTS.md`

- **Lenguaje:** `markdown`
- **Líneas:** `26`
- **Tamaño original:** `0.7 KB`
- **SHA1 corto:** `98f2f02ef3`
- **Estado:** `completo`

```markdown
# AGENTS.md — Adaptador delgado

Este archivo existe para herramientas que leen `AGENTS.md` por defecto.

No contiene documentación del componente ni instrucciones largas. La fuente de verdad para asistentes IA está en:

``​`txt
ai/start/START.md
ai/router/ROUTER.md
ai/router/CONTEXT_BUDGET.md
ai/memory/project-memory.md
``​`

## Regla obligatoria

Antes de modificar código, un agente debe:

1. Leer `ai/start/START.md`.
2. Seguir `ai/router/ROUTER.md`.
3. Respetar `ai/router/CONTEXT_BUDGET.md`.
4. Seleccionar exactamente una task-card.
5. Cargar solo el contexto/rules/playbook indicado.

## No usar `docs/` para instrucciones de agentes

`docs/` documenta el componente `sisad-pdfme`. No debe contener agentes, prompts, task-cards ni memoria de IA.
```

<a id="file-0091"></a>

### 0091 — `CLAUDE.md`

- **Lenguaje:** `markdown`
- **Líneas:** `23`
- **Tamaño original:** `0.5 KB`
- **SHA1 corto:** `3fa63667b9`
- **Estado:** `completo`

```markdown
# CLAUDE.md — Adaptador para Claude

Claude debe usar la misma fuente de verdad que Codex y Copilot:

``​`txt
ai/start/START.md
``​`

## Modo de trabajo

- No leer todos los `.md`.
- No hacer auditorías globales salvo que una task-card lo pida.
- No tocar áreas fuera de scope.
- Si la tarea excede el presupuesto, detenerse y proponer nueva task-card.

## Carga inicial máxima

``​`txt
ai/start/START.md
ai/router/ROUTER.md
ai/router/CONTEXT_BUDGET.md
ai/memory/project-memory.md
``​`
```

<a id="file-0092"></a>

### 0092 — `MANIFEST.md`

- **Lenguaje:** `markdown`
- **Líneas:** `177`
- **Tamaño original:** `6.1 KB`
- **SHA1 corto:** `5ee2a64d65`
- **Estado:** `completo`

```markdown
# Manifest

- `.github/copilot-instructions.md`
- `AGENTS.md`
- `CLAUDE.md`
- `README.md`
- `ai/README.md`
- `ai/adapters/README.md`
- `ai/adapters/claude.md`
- `ai/adapters/codex.md`
- `ai/adapters/copilot.md`
- `ai/agents/README.md`
- `ai/agents/claude-agent.md`
- `ai/agents/codex-agent.md`
- `ai/agents/copilot-agent.md`
- `ai/agents/docs-agent.md`
- `ai/agents/registry.md`
- `ai/baselines/README.md`
- `ai/baselines/img-version.md`
- `ai/checklists/README.md`
- `ai/checklists/done.md`
- `ai/checklists/preflight.md`
- `ai/context/README.md`
- `ai/context/canvas-context.md`
- `ai/context/css-tailwind-context.md`
- `ai/context/inspector-context.md`
- `ai/context/runtime-context.md`
- `ai/context/schema-context.md`
- `ai/context/snapshot-context.md`
- `ai/docs-migration/README.md`
- `ai/memory/README.md`
- `ai/memory/decisions.md`
- `ai/memory/memory-update-protocol.md`
- `ai/memory/project-memory.md`
- `ai/memory/session-handoff.md`
- `ai/playbooks/PB-canvas.md`
- `ai/playbooks/PB-css-tailwind.md`
- `ai/playbooks/PB-inspector.md`
- `ai/playbooks/PB-schema.md`
- `ai/playbooks/PB-snapshot.md`
- `ai/playbooks/README.md`
- `ai/project/README.md`
- `ai/project/active-sprint.md`
- `ai/project/objectives.md`
- `ai/project/roadmap.md`
- `ai/project/scope.md`
- `ai/prompts/README.md`
- `ai/prompts/diagnose-only.prompt.md`
- `ai/prompts/execute-task-card.prompt.md`
- `ai/prompts/update-memory.prompt.md`
- `ai/reports/README.md`
- `ai/router/CONTEXT_BUDGET.md`
- `ai/router/README.md`
- `ai/router/ROUTER.md`
- `ai/router/context-map.md`
- `ai/rules/README.md`
- `ai/rules/canvas-rules.md`
- `ai/rules/css-rules.md`
- `ai/rules/docs-rules.md`
- `ai/rules/global-designer-rules.md`
- `ai/rules/no-loop-rules.md`
- `ai/rules/schema-rules.md`
- `ai/rules/snapshot-rules.md`
- `ai/rules/type-safety-rules.md`
- `ai/skills/README.md`
- `ai/skills/skill-canvas-debug.md`
- `ai/skills/skill-inspector-design.md`
- `ai/skills/skill-schema-contract.md`
- `ai/skills/skill-tailwind-migration.md`
- `ai/start/CLAUDE.md`
- `ai/start/CODEX.md`
- `ai/start/COPILOT.md`
- `ai/start/README.md`
- `ai/start/START.md`
- `ai/subagents/README.md`
- `ai/subagents/canvas-subagent.md`
- `ai/subagents/memory-subagent.md`
- `ai/subagents/schema-subagent.md`
- `ai/subagents/visual-regression-subagent.md`
- `ai/task-cards/README.md`
- `ai/task-cards/TASK-CANVAS-001-multipage.md`
- `ai/task-cards/TASK-CSS-001-tailwind-regression-repair.md`
- `ai/task-cards/TASK-DOCS-001-component-docs.md`
- `ai/task-cards/TASK-INSPECTOR-001-sections.md`
- `ai/task-cards/TASK-SCHEMA-001-option-based.md`
- `ai/task-cards/TASK-SNAPSHOT-001-roundtrip.md`
- `ai/templates/README.md`
- `ai/templates/report-template.md`
- `ai/templates/task-card-template.md`
- `docs/00-introduccion/01-que-es-sisad-pdfme.md`
- `docs/00-introduccion/02-para-que-sirve.md`
- `docs/00-introduccion/03-glosario.md`
- `docs/00-introduccion/04-arquitectura-general.md`
- `docs/00-introduccion/README.md`
- `docs/01-instalacion/01-requisitos.md`
- `docs/01-instalacion/02-instalacion.md`
- `docs/01-instalacion/03-configuracion-vite.md`
- `docs/01-instalacion/04-importacion-estilos.md`
- `docs/01-instalacion/README.md`
- `docs/02-conceptos/01-template.md`
- `docs/02-conceptos/02-documents-pages.md`
- `docs/02-conceptos/03-schemas.md`
- `docs/02-conceptos/04-recipients.md`
- `docs/02-conceptos/05-assignments.md`
- `docs/02-conceptos/06-runtime-modes.md`
- `docs/02-conceptos/07-snapshot.md`
- `docs/02-conceptos/README.md`
- `docs/03-designer/01-designer-overview.md`
- `docs/03-designer/02-props.md`
- `docs/03-designer/03-canvas.md`
- `docs/03-designer/04-left-sidebar.md`
- `docs/03-designer/05-right-sidebar.md`
- `docs/03-designer/06-detail-view.md`
- `docs/03-designer/07-list-view.md`
- `docs/03-designer/08-toolbar-commandbus.md`
- `docs/03-designer/09-comments.md`
- `docs/03-designer/10-multi-documento.md`
- `docs/03-designer/README.md`
- `docs/04-schemas/01-schema-base.md`
- `docs/04-schemas/02-familias.md`
- `docs/04-schemas/03-text-like.md`
- `docs/04-schemas/04-option-based.md`
- `docs/04-schemas/05-signing-based.md`
- `docs/04-schemas/06-action-based.md`
- `docs/04-schemas/07-media-barcode-table-shapes.md`
- `docs/04-schemas/08-custom-schemas.md`
- `docs/04-schemas/09-inspector-contract.md`
- `docs/04-schemas/10-docusing-mapping.md`
- `docs/04-schemas/README.md`
- `docs/05-runtime/01-form.md`
- `docs/05-runtime/02-viewer.md`
- `docs/05-runtime/03-values.md`
- `docs/05-runtime/04-validation.md`
- `docs/05-runtime/05-recipient-filtering.md`
- `docs/05-runtime/README.md`
- `docs/06-generator/01-generator-overview.md`
- `docs/06-generator/02-pdf-output.md`
- `docs/06-generator/03-fonts-assets.md`
- `docs/06-generator/README.md`
- `docs/07-integraciones/01-react.md`
- `docs/07-integraciones/02-host-app.md`
- `docs/07-integraciones/03-signature-providers.md`
- `docs/07-integraciones/04-external-forms.md`
- `docs/07-integraciones/README.md`
- `docs/08-api-reference/01-designer-api.md`
- `docs/08-api-reference/02-form-api.md`
- `docs/08-api-reference/03-viewer-api.md`
- `docs/08-api-reference/04-generator-api.md`
- `docs/08-api-reference/05-plugin-api.md`
- `docs/08-api-reference/README.md`
- `docs/09-theming/01-tokens-css.md`
- `docs/09-theming/02-tailwind-bridge.md`
- `docs/09-theming/03-baseline-visual.md`
- `docs/09-theming/04-css-migration.md`
- `docs/09-theming/README.md`
- `docs/10-testing-qa/01-manual-checklist.md`
- `docs/10-testing-qa/02-regression-matrix.md`
- `docs/10-testing-qa/03-playwright.md`
- `docs/10-testing-qa/04-vitest.md`
- `docs/10-testing-qa/README.md`
- `docs/11-migraciones/01-legacy-templates.md`
- `docs/11-migraciones/02-snapshot-versioning.md`
- `docs/11-migraciones/03-pdfme-upstream.md`
- `docs/11-migraciones/README.md`
- `docs/12-troubleshooting/01-canvas.md`
- `docs/12-troubleshooting/02-pdf-worker.md`
- `docs/12-troubleshooting/03-tailwind-regressions.md`
- `docs/12-troubleshooting/04-runtime.md`
- `docs/12-troubleshooting/README.md`
- `docs/13-ejemplos/01-basic-designer.md`
- `docs/13-ejemplos/02-multi-document-routing.md`
- `docs/13-ejemplos/03-generator-runtime.md`
- `docs/13-ejemplos/README.md`
- `docs/14-seguridad/01-archivos.md`
- `docs/14-seguridad/02-firma.md`
- `docs/14-seguridad/README.md`
- `docs/README.md`
```

<a id="file-0093"></a>

### 0093 — `plan-maestro-migracion-tailwind-sisad-pdfme.md`

- **Lenguaje:** `markdown`
- **Líneas:** `1036`
- **Tamaño original:** `204.3 KB`
- **SHA1 corto:** `e9a87fec7d`
- **Estado:** `truncado 110.9 KB`

```markdown
# Plan maestro de migración CSS → Tailwind — SISAD PDFME

**Proyecto:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin`

**Fecha:** 2026-07-08

**Objetivo:** migrar progresivamente de CSS puro a Tailwind sin degradar la visualización ni romper comportamiento del diseñador PDF.

> Este documento está diseñado para ser usado por Codex/Claude como plan de implementación por fases. No es un prompt corto: es una guía operativa con inventario, reglas, riesgos, task-cards, validación y matriz por archivo.

## 1. Fuentes investigadas

Se analizó el paquete consolidado subido por el usuario, compuesto por código React/Vite, documentación `.ai`/docs y CSS/Tailwind. Los hallazgos principales son:

| Fuente                               | Contenido                                           | Métrica relevante                                                                                                                           |
| ------------------------------------ | --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `codigo-frontend-sisad—pdmfe.md`  | Código React/Vite consolidado                      | 481 archivos candidatos incluidos; tabla con rutas, líneas, estado y estructura.                                                            |
| `documentacion-sisad—pdmfeweb.md` | Documentación`.ai`, reglas, task-cards, reportes | 78 documentos incluidos; define presupuesto, límites, router y reglas del diseñador.                                                       |
| `styles-sisad—pdmfe.md`           | CSS, Tailwind, bridge y candidatos                  | 18 archivos CSS/Tailwind incluidos; incluye`labRoutes`, `global`, `canvas-interactions`, `runtime`, `tokens`, bridge y candidatos. |
| `public/img-version`               | Baseline visual externo al archivo                  | Debe inventariarse en repo real; contiene capturas de la versión previa a Tailwind.                                                         |

**Conclusión de investigación:** el proyecto ya no está en estado inicial de migración. Tailwind está instalado/configurado, `src/style.css` aparece neutralizado, existe `src/styles/tailwind.css`, existe `src/styles/sisad-tailwind-bridge.css`, hay candidatos generados y un reporte `line-by-line-style-audit.md`. La tarea correcta ahora es **consolidar, corregir regresiones y migrar por capas**, no reiniciar ni reemplazar todo.

## 2. Restricciones arquitectónicas obligatorias

La documentación del proyecto limita el alcance al diseñador: Designer, Canvas, Schemas, LeftSidebar, RightSidebar, DetailView, ListView, Toolbar contextual, Moveable, Selecto, CommandBus, Snapshot, CSS visual y compatibilidad Form/Viewer/Generator. No incluye negocio SISAD, Uanataca, StepOne/StepTwo ni firma backend.

| Regla                             | Implicación en migración Tailwind                                                                                                 |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| PDF/canvas es protagonista        | El lab host no debe encajonar el editor ni robar alto útil.                                                                        |
| No tocar geometría por estética | `x/y/width/height/rotation/zoom/transform/paper scale` no se convierten a utilidades Tailwind.                                    |
| Moveable/Selecto protegidos       | No tocar`.moveable-*`, `.selecto-*`, guards, coordenadas ni hit-testing desde CSS host.                                         |
| CSS scoped                        | Todo core visual debe vivir bajo`.sisad-pdfme-root` o clases del lab; no reset global `body/html`.                              |
| Snapshot estable                  | No perder`schemaUid`, `documentId`, `pageNumber`, owner/recipient metadata, group/options, selected values ni `__designer`. |
| Form/Viewer/PDF limpios           | La migración del designer no debe imprimir chrome en PDF ni contaminar runtime.                                                    |
| Baseline visual                   | Las imágenes de`public/img-version` son fuente de verdad visual para restaurar intención previa.                                |

## 3. Estado actual detectado

### 3.1 Infraestructura Tailwind

| Archivo                                        | Estado                                                                                             | Riesgo                                                         | Acción requerida                                                           |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `tailwind.config.js`                         | Existe;`content` incluye index/src/tests; `preflight:false`; tokens `colors.sisad` mapeados. | Bajo si solo hay un config activo.                             | Validar que no exista`tailwind.config.cjs` activo o editar solo uno.      |
| `postcss.config.js` y `postcss.config.mjs` | Ambos aparecen en inventario.                                                                      | Medio: toolchain/IA puede editar el equivocado.                | Confirmar cuál lee Vite y eliminar/neutralizar duplicado si no hace falta. |
| `src/styles/tailwind.css`                    | Entrada canónica con`@tailwind base/components/utilities`.                                      | Bajo.                                                          | Mantener como única fuente.                                                |
| `src/style.css`                              | Neutralizado; conserva comentario para`<link>` de `index.html`.                                | Bajo si no reintroduce`@tailwind`.                           | No volver a poner directivas Tailwind aquí.                                |
| `src/styles/sisad-tailwind-bridge.css`       | Bridge top-level`@apply`, no `@layer components`.                                              | Medio si se copia a`@layer` y Tailwind purga clases runtime. | Mantener top-level para selectores dinámicos/data-*.                       |

### 3.2 Contadores de candidatos CSS

El reporte de migración generó candidatos que sirven como mapa, no como reemplazo automático. La propia auditoría muestra muchas declaraciones manuales no convertibles:

| CSS origen                                            | Bloques candidatos | Declaraciones manuales/unsupported | Interpretación                                               |
| ----------------------------------------------------- | ------------------ | ---------------------------------- | ------------------------------------------------------------- |
| `src/sisad-pdfme/ui/styles/tokens.css`              | 0                  | 0                                  | No migrar a className; mantener como fuente de verdad.        |
| `src/sisad-pdfme/ui/styles/sisad-pdfme-global.css`  | 772                | 1814                               | Archivo masivo: migrar por secciones, alto riesgo.            |
| `src/sisad-pdfme/ui/styles/canvas-interactions.css` | 176                | 508                                | Overlays/transform/pointer-events: migrar solo skins.         |
| `src/sisad-pdfme/ui/styles/sisad-pdfme-runtime.css` | 65                 | 88                                 | Migrar skins runtime; conservar Ant/data attrs/PDF.           |
| `src/features/pdfcomponent/labRoutes.css`           | 203                | 435                                | Migrar host visual; conservar canvas-first y drawer geometry. |

### 3.3 Riesgo principal

El error más probable no está en Tailwind como tecnología, sino en **duplicar la responsabilidad visual**: clases Tailwind directas sobre componentes que ya tenían CSS legacy activo y variables runtime. Por eso el plan evita un reemplazo masivo y exige matriz de equivalencia por selector/componente.

## 4. Principios de migración

| Tipo de regla            | Destino correcto                         | Ejemplos                                                            |
| ------------------------ | ---------------------------------------- | ------------------------------------------------------------------- |
| Visual puro              | Tailwind JSX o bridge                    | padding, gap, flex, border, bg, text, rounded, shadow, hover.       |
| Clase estable compartida | `src/styles/sisad-tailwind-bridge.css` | sidebars, control bar, cards, badges, inspector section skin.       |
| Geometría runtime       | CSS legacy/tokens                        | paper, page, scale, transform, top/left runtime, zoom, x/y, rulers. |
| Overlays interactivos    | Mixto: skin Tailwind, posición legacy   | drag preview, context toolbar, drop placeholder, inline edit.       |
| Ant Design               | CSS legacy de compatibilidad             | .ant-select-selector, .ant-btn, collapse, form item, inputs.        |
| Variables/tokens         | `tokens.css` + `tailwind.config.js`  | color, spacing, radius, shadows, z-index, owner color.              |
| CSS muerto/duplicado     | Eliminar solo con evidencia              | demo huérfano, doble PostCSS/Tailwind, selectores no usados.       |

## 5. Baseline visual obligatorio

Antes de migrar otro bloque, Codex debe inventariar y usar las capturas de:

``​`bash
/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/public/img-version
``​`

### 5.1 Comando de inventario

``​`bash
find public/img-version -maxdepth 2 -type f \( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.webp" \) | sort
``​`

### 5.2 Reporte requerido

Crear `reports/tailwind-migration/img-version-baseline-inventory.md` con:

| Imagen        | Vista inferida                               | Componentes visibles                   | Reglas visuales a preservar                   |
| ------------- | -------------------------------------------- | -------------------------------------- | --------------------------------------------- |
| `<archivo>` | LEFT_SIDEBAR / RIGHT_SIDEBAR / CANVAS / etc. | Paleta, tabs, campos, panel, documento | Densidad, sombras, bordes, tamaños, spacing. |

### 5.3 Elementos de baseline a preservar

- LeftSidebar blanco flotante, bordes redondeados grandes, sombra suave, título `DISEÑADOR / CAMPOS`, tabs en cápsula, search pill, filtros pill, categorías uppercase y cards de campos con icono centrado.
- Canvas con grilla clara, PDF centrado, rulers oscuros y campos celeste suave con borde punteado azul.
- RightSidebar con tabs superiores en cápsula, documentos/comentarios/lista/detalle; rows compactas e inspector con secciones redondeadas.
- Toolbars flotantes compactas, no invasivas y sin tapar campos.

## 6. Plan general por fases

| Fase    | Nombre                           | Qué hacer                                                                                               | Alcance                                               | Salida                                                               |
| ------- | -------------------------------- | -------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- | -------------------------------------------------------------------- |
| Fase 0  | Freeze visual y respaldo         | Capturar estado actual, inventariar`public/img-version`, crear rama/commit de seguridad.               | Sin cambios de código.                               | Rollback listo.                                                      |
| Fase 1  | Infra Tailwind                   | Confirmar una sola entrada Tailwind, un solo config efectivo, bridge importado una vez, preflight false. | Config/entrypoints.                                   | No hay doble emisión.                                               |
| Fase 2  | Matriz CSS                       | Actualizar auditoría line-by-line con estado actual post-regresión.                                    | CSS reales + candidatos.                              | Cada bloque tiene acción: MIGRATE_JSX, BRIDGE, KEEP, SPLIT, DELETE. |
| Fase 3  | Restaurar canvas-first           | Corregir`PdfmeLabPage`, `PageHeader`, `ResultsPanel`, `labRoutes` sin tocar core.                | Host/lab.                                             | Canvas ocupa máximo espacio y baseline visual vuelve.               |
| Fase 4  | Landing y lab host               | Migrar landing/cards/filtros/controles a Tailwind JSX directo.                                           | features/pdfcomponent.                                | Landing moderna sin afectar editor.                                  |
| Fase 5  | Bridge base                      | Expandir bridge top-level para root/layout/sidebars/control bar/inspector skins.                         | sisad-tailwind-bridge.css.                            | ClassNames existentes conservados.                                   |
| Fase 6  | LeftSidebar                      | Restaurar baseline y migrar visual seguro por componentes.                                               | LeftSidebar*.tsx + CSS skin.                          | Drag/drop no se rompe.                                               |
| Fase 7  | RightSidebar/ListView/DetailView | Compactar y migrar skin, no selección ni Ant internals.                                                 | RightSidebar/**.                                      | Tabs, list rows e inspector consistentes.                            |
| Fase 8  | Canvas interactions skins        | Migrar solo skin de toolbar/context menu/badges; conservar overlays geometry.                            | canvas-interactions + overlays.                       | Hit-testing, drag/drop, botón + intactos.                           |
| Fase 9  | Field chrome/runtime             | Separar designer/form/viewer/pdf; migrar skins sin tocar metadata.                                       | fieldChrome, renderSchemaWithChrome, schema uiRender. | PDF no imprime chrome.                                               |
| Fase 10 | Reducción legacy                | Eliminar duplicados con evidencia y comentarios KEEP/TODO.                                               | CSS legacy.                                           | Menos CSS sin regressions.                                           |
| Fase 11 | Validación total                | Build/typecheck/tests focales/screenshot diff/manual matrix.                                             | Rutas principales.                                    | Aprobación visual y funcional.                                      |

## 7. Plan detallado por archivo CSS

| Archivo                                                                                                                                               | Líneas | Estado           | Acción                   | Plan específico                                                                                               |
| ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | ---------------- | ------------------------- | -------------------------------------------------------------------------------------------------------------- |
| src/styles/tailwind.css                                                                                                                               | 11      | completo         | INFRA_CANONICAL           | Mantener como única entrada Tailwind; no duplicar directivas.                                                 |
| src/style.css                                                                                                                                         | 11      | completo         | INFRA_NEUTRALIZE          | Debe quedar neutralizado o sin @tailwind para evitar doble emisión.                                           |
| src/styles/sisad-tailwind-bridge.css                                                                                                                  | 415     | completo         | MIGRATE_BRIDGE            | Bridge top-level @apply para clases existentes; no usar @layer si purga clases dinámicas.                     |
| reports/tailwind-migration/candidates/features__pdfcomponent__labRoutes.tailwind.candidate.css                                                        | 1600    | completo         | REFERENCE_ONLY            | Archivo candidato generado; no copiar ciegamente, usar como mapa de @apply/manual.                             |
| reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__canvas-interactions.tailwind.candidate.css                                             | 1547    | completo         | REFERENCE_ONLY            | Archivo candidato generado; no copiar ciegamente, usar como mapa de @apply/manual.                             |
| reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__sisad-pdfme-global.tailwind.candidate.css                                              | 6417    | truncado 75.1 KB | REFERENCE_ONLY            | Archivo candidato generado; no copiar ciegamente, usar como mapa de @apply/manual.                             |
| reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__sisad-pdfme-runtime.tailwind.candidate.css                                             | 443     | completo         | REFERENCE_ONLY            | Archivo candidato generado; no copiar ciegamente, usar como mapa de @apply/manual.                             |
| reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__tokens.tailwind.candidate.css                                                          | 8       | completo         | REFERENCE_ONLY            | Archivo candidato generado; no copiar ciegamente, usar como mapa de @apply/manual.                             |
| src/features/pdfcomponent/labRoutes.css                                                                                                               | 1550    | completo         | SPLIT_LAB_CSS             | Migrar visual seguro; conservar canvas-first, drawer fixed, media compleja y gradientes críticos.             |
| src/sisad-pdfme/ui/styles/canvas-interactions.css                                                                                                     | 1492    | completo         | SPLIT_CANVAS_INTERACTIONS | Migrar skins de toolbar/menu; conservar overlays, transform, pointer-events, z-index tokens, botón +.         |
| src/sisad-pdfme/ui/styles/sisad-pdfme-global.css                                                                                                      | 6383    | truncado 75.6 KB | SPLIT_GLOBAL_CSS          | Migrar por sección; conservar paper geometry, Ant, Moveable/Selecto, keyframes, field chrome crítico.        |
| src/sisad-pdfme/ui/styles/sisad-pdfme-runtime.css                                                                                                     | 240     | completo         | SPLIT_RUNTIME_CSS         | Migrar skins runtime; conservar import global, density attrs, Ant overrides y PDF/print.                       |
| src/sisad-pdfme/ui/styles/tokens.css                                                                                                                  | 374     | completo         | KEEP_TOKEN_SOURCE         | Fuente de verdad de tokens, variables runtime, z-index, paper y owner color; no convertir a clases estáticas. |
| .tailwind-migration-backups/20260708-111736/reports/tailwind-migration/candidates/features__pdfcomponent__labRoutes.tailwind.candidate.css            | 1600    | completo         | REFERENCE_ONLY            | Archivo candidato generado; no copiar ciegamente, usar como mapa de @apply/manual.                             |
| .tailwind-migration-backups/20260708-111736/reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__canvas-interactions.tailwind.candidate.css | 1547    | completo         | REFERENCE_ONLY            | Archivo candidato generado; no copiar ciegamente, usar como mapa de @apply/manual.                             |
| .tailwind-migration-backups/20260708-111736/reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__sisad-pdfme-global.tailwind.candidate.css  | 6417    | truncado 75.1 KB | REFERENCE_ONLY            | Archivo candidato generado; no copiar ciegamente, usar como mapa de @apply/manual.                             |
| .tailwind-migration-backups/20260708-111736/reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__sisad-pdfme-runtime.tailwind.candidate.css | 443     | completo         | REFERENCE_ONLY            | Archivo candidato generado; no copiar ciegamente, usar como mapa de @apply/manual.                             |
| .tailwind-migration-backups/20260708-111736/reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__tokens.tailwind.candidate.css              | 8       | completo         | REFERENCE_ONLY            | Archivo candidato generado; no copiar ciegamente, usar como mapa de @apply/manual.                             |

### 7.1 `src/sisad-pdfme/ui/styles/tokens.css`

**Decisión:** no migrar a JSX. Este archivo es la fuente de verdad. Solo se amplía el mapa en `tailwind.config.js` cuando haga falta.

Mantener:

- `--color-*`, `--sisad-editor-*`, `--space-*`, `--radius-*`, `--shadow-*`.
- `--sisad-pdfme-rs-width`, `--sisad-pdfme-ls-width`, `--sisad-pdfme-chrome-z`, `--sisad-pdfme-chrome-height`.
- tokens de paper, schema tone, owner color, moveable y z-index.

Prohibido:

- convertir z-index/paper/owner color a clases estáticas.
- borrar dark tokens sin `rg` y task-card.

### 7.2 `src/sisad-pdfme/ui/styles/sisad-pdfme-global.css`

**Decisión:** no migrar completo. Dividir por secciones. Este archivo contiene skins migrables y reglas críticas mezcladas.

Migrar a bridge/JSX:

- chips, badges, cards, panel surfaces, inspector section skins, list item skins, empty state typography.

Conservar legacy:

- scoped reset `.sisad-pdfme-root *`, scrollbars, Ant overrides, keyframes, field chrome mode-specific, option-group roots, paper/canvas geometry, Moveable/Selecto compatibility.

Procedimiento:

1. Localizar sección por comentario real.
2. Crear equivalencia en bridge o JSX.
3. Validar visual.
4. Reemplazar bloque por comentario `MIGRATED` o mantener con `KEEP`.
5. No mezclar migración de inspector con canvas en la misma task-card.

### 7.3 `src/sisad-pdfme/ui/styles/canvas-interactions.css`

**Decisión:** migrar solo piel visual. El motor de interacción debe quedarse en CSS legacy/tokens.

Migrable:

- fondo/borde/radius/shadow de `SelectionContextToolbar`, `CanvasContextMenu`, badges, buttons.

No migrable:

- `position: fixed/absolute` ligado a punteros, `transform: translate3d`, `scale`, `pointer-events`, `z-index`, keyframes, `data-interaction-phase`, `data-role=group-add-option`, ocultamientos durante drag/transform.

Validación obligatoria: drag/drop, selección simple/múltiple, botón `+`, página 2+, context menu, inline edit y snap feedback.

### 7.4 `src/features/pdfcomponent/labRoutes.css`

**Decisión:** migración host-first. Aquí sí se puede usar más Tailwind directo, pero conservar reglas canvas-first.

Migrable:

- landing, cards, filters, toolbar visual, compact controls, hero metrics, popover content.

Conservar:

- `height:100dvh`, `grid-template-rows`, `min-height:0`, drawer `fixed`, media queries complejas, gradientes si mantienen identidad visual, sr-only si ya funciona.

Riesgo: si JSX Tailwind y CSS legacy controlan el mismo `height/overflow/padding`, se rompe el canvas.

### 7.5 `src/sisad-pdfme/ui/styles/sisad-pdfme-runtime.css`

**Decisión:** conservar como punto de carga de global y migrar skins de runtime/inspector con cuidado.

Migrable:

- summary cards, chips, panel skins, typography.

Conservar:

- `@import './sisad-pdfme-global.css'`, density data attrs, Ant selectors, variable de chrome, reglas PDF/print.

### 7.6 Archivos candidatos y backups

Los candidatos `reports/tailwind-migration/candidates/*.tailwind.candidate.css` y `.tailwind-migration-backups/**` son **referencias**, no deben importarse en producción. Usarlos para ver qué reglas tienen `@apply` equivalente y qué quedó como manual. No copiarlos ciegamente.

## 8. Plan detallado por componentes React/lab

| Archivo                                                        | Líneas | Acción             | Plan                                                                                      |
| -------------------------------------------------------------- | ------- | ------------------- | ----------------------------------------------------------------------------------------- |
| src/features/pdfcomponent/CaseCard.jsx                         | 123     | MIGRATE_LAB_JSX     | Migrar visual host/landing/cards/header/results con Tailwind directo y mantener acciones. |
| src/features/pdfcomponent/CompactControls.jsx                  | 280     | MIGRATE_LAB_JSX     | Migrar visual host/landing/cards/header/results con Tailwind directo y mantener acciones. |
| src/features/pdfcomponent/LabExampleDownloadButton.jsx         | 74      | MIGRATE_LAB_JSX     | Migrar visual host/landing/cards/header/results con Tailwind directo y mantener acciones. |
| src/features/pdfcomponent/LabLandingPage.jsx                   | 242     | MIGRATE_LAB_JSX     | Migrar visual host/landing/cards/header/results con Tailwind directo y mantener acciones. |
| src/features/pdfcomponent/PageHeader.jsx                       | 415     | MIGRATE_LAB_JSX     | Migrar visual host/landing/cards/header/results con Tailwind directo y mantener acciones. |
| src/features/pdfcomponent/PdfmeLabPage.jsx                     | 637     | MIGRATE_LAB_JSX     | Migrar visual host/landing/cards/header/results con Tailwind directo y mantener acciones. |
| src/features/pdfcomponent/PopoverMenu.jsx                      | 114     | MIGRATE_LAB_JSX     | Migrar visual host/landing/cards/header/results con Tailwind directo y mantener acciones. |
| src/features/pdfcomponent/ResultsPanel.jsx                     | 248     | MIGRATE_LAB_JSX     | Migrar visual host/landing/cards/header/results con Tailwind directo y mantener acciones. |
| src/features/pdfcomponent/domain/labPresentation.js            | 192     | MIGRATE_LAB_JSX     | Migrar visual host/landing/cards/header/results con Tailwind directo y mantener acciones. |
| src/features/pdfcomponent/domain/labState.js                   | 18      | MIGRATE_LAB_JSX     | Migrar visual host/landing/cards/header/results con Tailwind directo y mantener acciones. |
| src/features/pdfcomponent/ui/primitives.jsx                    | 103     | MIGRATE_LAB_JSX     | Migrar visual host/landing/cards/header/results con Tailwind directo y mantener acciones. |
| src/features/pdfcomponent/labs/builders/exampleTemplate.ts     | 199     | KEEP_LAB_DATA_LOGIC | No migrar estilos; mantener fixtures/builders/export fuera del core.                      |
| src/features/pdfcomponent/labs/builders/schemaFactory.ts       | 91      | KEEP_LAB_DATA_LOGIC | No migrar estilos; mantener fixtures/builders/export fuera del core.                      |
| src/features/pdfcomponent/labs/builders/schemaShowcase.ts      | 220     | KEEP_LAB_DATA_LOGIC | No migrar estilos; mantener fixtures/builders/export fuera del core.                      |
| src/features/pdfcomponent/labs/examples/labExamples.js         | 885     | KEEP_LAB_DATA_LOGIC | No migrar estilos; mantener fixtures/builders/export fuera del core.                      |
| src/features/pdfcomponent/labs/export/buildExampleBundle.ts    | 78      | KEEP_LAB_DATA_LOGIC | No migrar estilos; mantener fixtures/builders/export fuera del core.                      |
| src/features/pdfcomponent/labs/export/downloadExampleBundle.ts | 25      | KEEP_LAB_DATA_LOGIC | No migrar estilos; mantener fixtures/builders/export fuera del core.                      |

### 8.1 Orden de ejecución lab

1. `src/features/pdfcomponent/PdfmeLabPage.jsx`: restaurar canvas-first; quitar wrappers/card/padding que reduzcan el área útil. Mantener `commonOptions.collaboration`.
2. `src/features/pdfcomponent/PageHeader.jsx`: compactar topbar y mover acciones secundarias a menú. Quitar botón textual `Controles` como elemento externo grande.
3. `src/features/pdfcomponent/ResultsPanel.jsx`: cerrar como pill y abrir como drawer no invasivo, preferible bottom-left, `max-height:min(300px,38dvh)`.
4. `src/features/pdfcomponent/LabLandingPage.jsx` y `CaseCard.jsx`: Tailwind JSX directo, card `relative`, filtros, buscador, recomendado, acción secundaria en menú.
5. `src/features/pdfcomponent/labRoutes.css`: eliminar duplicados solo después de validar screenshot.

## 9. Plan detallado por core `sisad-pdfme/ui`

| Área                        | Archivos | Ejemplos                                                                                                                                                                                                                                                                                                                                                                                                         | Plan                                                                                           |
| ---------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| MIGRATE_LEFT_SIDEBAR_VISUAL  | 7        | src/sisad-pdfme/ui/components/Designer/LeftSidebar.tsx, src/sisad-pdfme/ui/components/Designer/LeftSidebarCustomFieldModal.tsx, src/sisad-pdfme/ui/components/Designer/LeftSidebarCustomPanel.tsx, src/sisad-pdfme/ui/components/Designer/LeftSidebarGroup.tsx, src/sisad-pdfme/ui/components/Designer/LeftSidebarSearch.tsx...                                                                                  | Recuperar baseline visual y migrar cards/tabs/search a Tailwind/bridge; no romper drag/drop.   |
| MIGRATE_RIGHT_SIDEBAR_VISUAL | 36       | src/sisad-pdfme/schemas/propPanel/commonInspectorFields.ts, src/sisad-pdfme/ui/components/Designer/RightSidebar/CommentsRail.tsx, src/sisad-pdfme/ui/components/Designer/RightSidebar/contextHeader.ts, src/sisad-pdfme/ui/components/Designer/RightSidebar/DocumentsRail.tsx, src/sisad-pdfme/ui/components/Designer/RightSidebar/layout.tsx...                                                                 | Migrar skins de paneles/listas/inspector; conservar Ant y selección.                          |
| CONTROL_BAR_REVIEW           | 2        | src/sisad-pdfme/ui/components/CtlBar.tsx, src/sisad-pdfme/ui/components/UnitPager.tsx                                                                                                                                                                                                                                                                                                                            | Compactar y migrar skin; mantener posicionamiento y densidad por tokens.                       |
| CANVAS_VISUAL_WITH_GUARDS    | 6        | src/sisad-pdfme/ui/components/Paper.tsx, src/sisad-pdfme/ui/components/Designer/Canvas/Canvas.tsx, src/sisad-pdfme/ui/components/Designer/Canvas/Guides.tsx, src/sisad-pdfme/ui/components/Designer/Canvas/Mask.tsx, src/sisad-pdfme/ui/components/Designer/Canvas/Padding.tsx...                                                                                                                                | Revisar visual; conservar overflow/scroll/position/transform en CSS/tokens.                    |
| OVERLAY_SKIN_ONLY            | 18       | src/sisad-pdfme/ui/components/Designer/Canvas/overlays/CanvasContextMenu.tsx, src/sisad-pdfme/ui/components/Designer/Canvas/overlays/canvasContextMenuActions.tsx, src/sisad-pdfme/ui/components/Designer/Canvas/overlays/CanvasOverlayManager.tsx, src/sisad-pdfme/ui/components/Designer/Canvas/overlays/CanvasStateOverlay.tsx, src/sisad-pdfme/ui/components/Designer/Canvas/overlays/CommentsOverlay.tsx... | Tailwind solo para skin; posición, transform, z-index, pointer-events críticos se conservan. |
| RUNTIME_COMPAT_VALIDATE      | 5        | src/sisad-pdfme/ui/Form.tsx, src/sisad-pdfme/ui/Viewer.tsx, src/sisad-pdfme/ui/components/Preview.tsx, src/sisad-pdfme/ui/components/Renderer.tsx, src/sisad-pdfme/ui/components/StaticSchema.tsx                                                                                                                                                                                                                | No rediseñar; validar que Form/Viewer/PDF no hereden chrome de designer.                      |
| UI_CORE_REVIEW               | 56       | src/sisad-pdfme/ui/class.ts, src/sisad-pdfme/ui/collaboration.ts, src/sisad-pdfme/ui/collaborationContext.ts, src/sisad-pdfme/ui/constants.ts, src/sisad-pdfme/ui/contexts.ts...                                                                                                                                                                                                                                 | Migrar visual solo por componentes, con bridge y validación.                                  |

### 9.1 LeftSidebar

Restaurar baseline: panel flotante blanco, border-radius grande, sombra suave, `DISEÑADOR / CAMPOS`, tabs en cápsula, search pill, filtros pill, categorías uppercase y field cards con icono centrado. Migración recomendada: componentes TSX para estructura y bridge para clases existentes. No romper `useDraggable`, plugin metadata, `data-*`, owner color ni `canvasDropPipeline`.

### 9.2 RightSidebar/ListView/DetailView

Migrar skin y densidad, no lógica. Rows objetivo 44–52px; tabs 32–38px; inspector inputs 32–36px. Mantener Ant overrides donde apliquen. Evitar borders azules fuertes repetidos por row; usar accent fino para active y hover sutil.

### 9.3 Canvas y overlays

No continuar migrando `Canvas.tsx` si la clase Tailwind toca `overflow`, `position`, `height` o background que el CSS legacy ya controla. Revisar que `.sisad-pdfme-designer-canvas` conserve `overflow:auto` y `min-height:0`. Overlays solo migran skin; z-index/transform/position quedan en CSS/tokens.

### 9.4 Control bar

El control bar puede usar Tailwind para `inline-flex`, `rounded-full`, `border`, `bg-white/95`, `shadow-sm`, pero la ubicación y `--chrome-*` deben quedarse en legacy/tokens. Densidad máxima: `h-8` aproximado; evitar toolbars con padding grande.

## 10. Plan por familias de schemas y runtime

| Acción                      | Archivos | Interpretación                                                                     |
| ---------------------------- | -------- | ----------------------------------------------------------------------------------- |
| SCHEMA_LOGIC_KEEP            | 67       | Mantener lógica de schema; solo validar contratos visuales si aplica.              |
| SCHEMA_RENDER_VALIDATE       | 18       | Revisar visual por familia; no tocar valores, adapters, snapshot ni PDF render.     |
| MIGRATE_RIGHT_SIDEBAR_VISUAL | 1        | Migrar skins de paneles/listas/inspector; conservar Ant y selección.               |
| FIELD_CHROME_TASK            | 3        | Migrar visual compartido por modo; preservar x/y/size/ownerColor/readonly/required. |

### 10.1 Reglas por familia

| Familia      | Archivos guía                                                                   | Qué migrar                                  | Qué no tocar                                                                          |
| ------------ | -------------------------------------------------------------------------------- | -------------------------------------------- | -------------------------------------------------------------------------------------- |
| Text-like    | `schemas/text`, `number`, `date`, `textLike`                             | skin input/readonly/invalid por modo         | value adapters, pdfRender, formatter.                                                  |
| Option-based | `checkbox`, `checkboxGroup`, `radioGroup`, `select`, `schemas/options` | skin visual de markers y options             | `options`, `groupId`, `optionId`, `selectedOptionIds`, botón + target policy. |
| Signing      | `signature`, `initials`, `dateSigned`                                      | placeholder/skin designer/form/viewer        | provider registry, validation, signing data.                                           |
| Actions      | `approve`, `decline`, `attachment`, `note`                               | skin de botones, dashed border, note surface | business state/action semantics.                                                       |
| Media        | `graphics/image`, `svg`, `barcodes`                                        | placeholder/image/barcode container skin     | quiet zone, render value, pdf render.                                                  |
| Table        | `schemas/tables`                                                               | viewer/form skin, toolbar if designer        | cell model, dynamic template, PDF render.                                              |

### 10.2 Field chrome

`fieldChrome.ts` y `renderSchemaWithChrome.ts` ya aplican el patrón Template Method: limpiar root, estampar atributos/chrome y renderizar inner schema. La migración debe apoyarse en `data-render-mode`, `data-schema-family`, `data-schema-readonly`, `data-schema-required`, `--schema-tone` y owner color. No modificar `x/y/width/height/rotation` desde ahí.

## 11. Matriz de archivos críticos de alto riesgo

| Archivo                                                                                       | Líneas | Acción                      | Motivo                                                                                         |
| --------------------------------------------------------------------------------------------- | ------- | ---------------------------- | ---------------------------------------------------------------------------------------------- |
| src/sisad-pdfme/ui/Form.tsx                                                                   | 130     | RUNTIME_COMPAT_VALIDATE      | No rediseñar; validar que Form/Viewer/PDF no hereden chrome de designer.                      |
| src/sisad-pdfme/ui/Viewer.tsx                                                                 | 54      | RUNTIME_COMPAT_VALIDATE      | No rediseñar; validar que Form/Viewer/PDF no hereden chrome de designer.                      |
| src/sisad-pdfme/schemas/propPanel/commonInspectorFields.ts                                    | 341     | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección.                          |
| src/sisad-pdfme/schemas/shared/fieldChrome.ts                                                 | 275     | FIELD_CHROME_TASK            | Migrar visual compartido por modo; preservar x/y/size/ownerColor/readonly/required.            |
| src/sisad-pdfme/schemas/shared/renderSchemaWithChrome.ts                                      | 80      | FIELD_CHROME_TASK            | Migrar visual compartido por modo; preservar x/y/size/ownerColor/readonly/required.            |
| src/sisad-pdfme/schemas/shared/schemaDom.ts                                                   | 116     | FIELD_CHROME_TASK            | Migrar visual compartido por modo; preservar x/y/size/ownerColor/readonly/required.            |
| src/sisad-pdfme/ui/components/CtlBar.tsx                                                      | 349     | CONTROL_BAR_REVIEW           | Compactar y migrar skin; mantener posicionamiento y densidad por tokens.                       |
| src/sisad-pdfme/ui/components/Paper.tsx                                                       | 222     | CANVAS_VISUAL_WITH_GUARDS    | Revisar visual; conservar overflow/scroll/position/transform en CSS/tokens.                    |
| src/sisad-pdfme/ui/components/Preview.tsx                                                     | 220     | RUNTIME_COMPAT_VALIDATE      | No rediseñar; validar que Form/Viewer/PDF no hereden chrome de designer.                      |
| src/sisad-pdfme/ui/components/Renderer.tsx                                                    | 311     | RUNTIME_COMPAT_VALIDATE      | No rediseñar; validar que Form/Viewer/PDF no hereden chrome de designer.                      |
| src/sisad-pdfme/ui/components/StaticSchema.tsx                                                | 61      | RUNTIME_COMPAT_VALIDATE      | No rediseñar; validar que Form/Viewer/PDF no hereden chrome de designer.                      |
| src/sisad-pdfme/ui/components/UnitPager.tsx                                                   | 100     | CONTROL_BAR_REVIEW           | Compactar y migrar skin; mantener posicionamiento y densidad por tokens.                       |
| src/sisad-pdfme/ui/components/Designer/LeftSidebar.tsx                                        | 1530    | MIGRATE_LEFT_SIDEBAR_VISUAL  | Recuperar baseline visual y migrar cards/tabs/search a Tailwind/bridge; no romper drag/drop.   |
| src/sisad-pdfme/ui/components/Designer/LeftSidebarCustomFieldModal.tsx                        | 365     | MIGRATE_LEFT_SIDEBAR_VISUAL  | Recuperar baseline visual y migrar cards/tabs/search a Tailwind/bridge; no romper drag/drop.   |
| src/sisad-pdfme/ui/components/Designer/LeftSidebarCustomPanel.tsx                             | 111     | MIGRATE_LEFT_SIDEBAR_VISUAL  | Recuperar baseline visual y migrar cards/tabs/search a Tailwind/bridge; no romper drag/drop.   |
| src/sisad-pdfme/ui/components/Designer/LeftSidebarGroup.tsx                                   | 98      | MIGRATE_LEFT_SIDEBAR_VISUAL  | Recuperar baseline visual y migrar cards/tabs/search a Tailwind/bridge; no romper drag/drop.   |
| src/sisad-pdfme/ui/components/Designer/LeftSidebarSearch.tsx                                  | 36      | MIGRATE_LEFT_SIDEBAR_VISUAL  | Recuperar baseline visual y migrar cards/tabs/search a Tailwind/bridge; no romper drag/drop.   |
| src/sisad-pdfme/ui/components/Designer/LeftSidebarTabs.tsx                                    | 57      | MIGRATE_LEFT_SIDEBAR_VISUAL  | Recuperar baseline visual y migrar cards/tabs/search a Tailwind/bridge; no romper drag/drop.   |
| src/sisad-pdfme/ui/components/Designer/useLeftSidebarCatalogState.ts                          | 155     | MIGRATE_LEFT_SIDEBAR_VISUAL  | Recuperar baseline visual y migrar cards/tabs/search a Tailwind/bridge; no romper drag/drop.   |
| src/sisad-pdfme/ui/components/Designer/Canvas/Canvas.tsx                                      | 1589    | CANVAS_VISUAL_WITH_GUARDS    | Revisar visual; conservar overflow/scroll/position/transform en CSS/tokens.                    |
| src/sisad-pdfme/ui/components/Designer/Canvas/Guides.tsx                                      | 100     | CANVAS_VISUAL_WITH_GUARDS    | Revisar visual; conservar overflow/scroll/position/transform en CSS/tokens.                    |
| src/sisad-pdfme/ui/components/Designer/Canvas/Mask.tsx                                        | 33      | CANVAS_VISUAL_WITH_GUARDS    | Revisar visual; conservar overflow/scroll/position/transform en CSS/tokens.                    |
| src/sisad-pdfme/ui/components/Designer/Canvas/Moveable.tsx                                    | 127     | PROTECT_GEOMETRY_INTERACTION | No migrar geometría/hit-testing; cambios visuales solo con evidencia y tests.                 |
| src/sisad-pdfme/ui/components/Designer/Canvas/Padding.tsx                                     | 82      | CANVAS_VISUAL_WITH_GUARDS    | Revisar visual; conservar overflow/scroll/position/transform en CSS/tokens.                    |
| src/sisad-pdfme/ui/components/Designer/Canvas/Selecto.tsx                                     | 110     | PROTECT_GEOMETRY_INTERACTION | No migrar geometría/hit-testing; cambios visuales solo con evidencia y tests.                 |
| src/sisad-pdfme/ui/components/Designer/Canvas/SnapLines.tsx                                   | 349     | CANVAS_VISUAL_WITH_GUARDS    | Revisar visual; conservar overflow/scroll/position/transform en CSS/tokens.                    |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/CommentsRail.tsx                          | 250     | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección.                          |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/contextHeader.ts                          | 19      | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección.                          |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DocumentsRail.tsx                         | 250     | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección.                          |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/layout.tsx                                | 66      | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección.                          |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/RightSidebar.tsx                          | 432     | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección.                          |
| src/sisad-pdfme/ui/components/Designer/shared/canvasDropPipeline.ts                           | 112     | PROTECT_GEOMETRY_INTERACTION | No migrar geometría/hit-testing; cambios visuales solo con evidencia y tests.                 |
| src/sisad-pdfme/ui/components/Designer/shared/coordinateMath.ts                               | 145     | PROTECT_GEOMETRY_INTERACTION | No migrar geometría/hit-testing; cambios visuales solo con evidencia y tests.                 |
| src/sisad-pdfme/ui/components/Designer/shared/schemaCollision.ts                              | 101     | PROTECT_GEOMETRY_INTERACTION | No migrar geometría/hit-testing; cambios visuales solo con evidencia y tests.                 |
| src/sisad-pdfme/ui/components/Designer/shared/selectableTargetGuards.ts                       | 34      | PROTECT_GEOMETRY_INTERACTION | No migrar geometría/hit-testing; cambios visuales solo con evidencia y tests.                 |
| src/sisad-pdfme/ui/components/Designer/shared/transformTargetGuards.ts                        | 29      | PROTECT_GEOMETRY_INTERACTION | No migrar geometría/hit-testing; cambios visuales solo con evidencia y tests.                 |
| src/sisad-pdfme/ui/components/Designer/Canvas/overlays/CanvasContextMenu.tsx                  | 242     | OVERLAY_SKIN_ONLY            | Tailwind solo para skin; posición, transform, z-index, pointer-events críticos se conservan. |
| src/sisad-pdfme/ui/components/Designer/Canvas/overlays/canvasContextMenuActions.tsx           | 921     | OVERLAY_SKIN_ONLY            | Tailwind solo para skin; posición, transform, z-index, pointer-events críticos se conservan. |
| src/sisad-pdfme/ui/components/Designer/Canvas/overlays/CanvasOverlayManager.tsx               | 141     | OVERLAY_SKIN_ONLY            | Tailwind solo para skin; posición, transform, z-index, pointer-events críticos se conservan. |
| src/sisad-pdfme/ui/components/Designer/Canvas/overlays/CanvasStateOverlay.tsx                 | 158     | OVERLAY_SKIN_ONLY            | Tailwind solo para skin; posición, transform, z-index, pointer-events críticos se conservan. |
| src/sisad-pdfme/ui/components/Designer/Canvas/overlays/CommentsOverlay.tsx                    | 271     | OVERLAY_SKIN_ONLY            | Tailwind solo para skin; posición, transform, z-index, pointer-events críticos se conservan. |
| src/sisad-pdfme/ui/components/Designer/Canvas/overlays/floatingSurfaceGeometry.ts             | 97      | OVERLAY_SKIN_ONLY            | Tailwind solo para skin; posición, transform, z-index, pointer-events críticos se conservan. |
| src/sisad-pdfme/ui/components/Designer/Canvas/overlays/GroupOptionFloatingAction.tsx          | 103     | OVERLAY_SKIN_ONLY            | Tailwind solo para skin; posición, transform, z-index, pointer-events críticos se conservan. |
| src/sisad-pdfme/ui/components/Designer/Canvas/overlays/InlineEditOverlay.tsx                  | 204     | OVERLAY_SKIN_ONLY            | Tailwind solo para skin; posición, transform, z-index, pointer-events críticos se conservan. |
| src/sisad-pdfme/ui/components/Designer/Canvas/overlays/InlineMetricsOverlay.tsx               | 23      | OVERLAY_SKIN_ONLY            | Tailwind solo para skin; posición, transform, z-index, pointer-events críticos se conservan. |
| src/sisad-pdfme/ui/components/Designer/Canvas/overlays/overlayState.ts                        | 40      | OVERLAY_SKIN_ONLY            | Tailwind solo para skin; posición, transform, z-index, pointer-events críticos se conservan. |
| src/sisad-pdfme/ui/components/Designer/Canvas/overlays/pointerGeometry.ts                     | 133     | OVERLAY_SKIN_ONLY            | Tailwind solo para skin; posición, transform, z-index, pointer-events críticos se conservan. |
| src/sisad-pdfme/ui/components/Designer/Canvas/overlays/SchemaDragPreview.tsx                  | 41      | OVERLAY_SKIN_ONLY            | Tailwind solo para skin; posición, transform, z-index, pointer-events críticos se conservan. |
| src/sisad-pdfme/ui/components/Designer/Canvas/overlays/SchemaDropCommitFlash.tsx              | 49      | OVERLAY_SKIN_ONLY            | Tailwind solo para skin; posición, transform, z-index, pointer-events críticos se conservan. |
| src/sisad-pdfme/ui/components/Designer/Canvas/overlays/SchemaDropPlaceholder.tsx              | 57      | OVERLAY_SKIN_ONLY            | Tailwind solo para skin; posición, transform, z-index, pointer-events críticos se conservan. |
| src/sisad-pdfme/ui/components/Designer/Canvas/overlays/SelectionContextToolbar.tsx            | 217     | OVERLAY_SKIN_ONLY            | Tailwind solo para skin; posición, transform, z-index, pointer-events críticos se conservan. |
| src/sisad-pdfme/ui/components/Designer/Canvas/overlays/smartPlacement.ts                      | 196     | OVERLAY_SKIN_ONLY            | Tailwind solo para skin; posición, transform, z-index, pointer-events críticos se conservan. |
| src/sisad-pdfme/ui/components/Designer/Canvas/overlays/SnapFeedbackOverlay.tsx                | 42      | OVERLAY_SKIN_ONLY            | Tailwind solo para skin; posición, transform, z-index, pointer-events críticos se conservan. |
| src/sisad-pdfme/ui/components/Designer/Canvas/overlays/useFloatingToolbarPosition.ts          | 69      | OVERLAY_SKIN_ONLY            | Tailwind solo para skin; posición, transform, z-index, pointer-events críticos se conservan. |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/AlignWidget.tsx                | 67      | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección.                          |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/ButtonGroupWidget.tsx          | 83      | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección.                          |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/CompactConfigPanel.tsx         | 99      | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección.                          |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailFormSection.tsx          | 55      | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección.                          |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailHeaderCard.tsx           | 136     | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección.                          |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailHeaderUtils.ts           | 85      | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección.                          |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailSchemas.ts               | 430     | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección.                          |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailSectionCard.tsx          | 177     | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección.                          |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailSectionTaxonomy.ts       | 405     | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección.                          |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailView.tsx                 | 417     | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección.                          |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailViewContent.tsx          | 63      | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección.                          |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailWidgetRegistry.tsx       | 141     | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección.                          |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailWidgets.tsx              | 108     | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección.                          |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/inspectorContracts.ts          | 366     | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección.                          |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/InspectorPrimitives.tsx        | 217     | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección.                          |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/schemaCollaborationUtils.ts    | 18      | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección.                          |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaCollaborationWidget.tsx  | 485     | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección.                          |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaConnectionsShared.tsx    | 146     | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección.                          |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/schemaConnectionsValidation.ts | 83      | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección.                          |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaConnectionsWidget.tsx    | 825     | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección.                          |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaFieldCommentsWidget.tsx  | 314     | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección.                          |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/WidgetRenderer.tsx             | 32      | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección.                          |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/Item.tsx                         | 341     | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección.                          |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/ListView.tsx                     | 345     | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección.                          |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/ListViewDragOverlay.tsx          | 58      | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección.                          |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/ListViewFooter.tsx               | 56      | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección.                          |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/ListViewToolbar.tsx              | 238     | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección.                          |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/SelectableSortableContainer.tsx  | 217     | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección.                          |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/SelectableSortableItem.tsx       | 119     | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección.                          |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/shared/SidebarSurfacePrimitives.tsx       | 112     | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección.                          |

## 12. Estrategia de reducción de CSS legacy

La reducción de CSS debe ser medible y reversible. Cada bloque legacy debe terminar en uno de estos estados:

| Estado                      | Comentario requerido                                                             | Ejemplo                                          |
| --------------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------ |
| Migrado                     | `/* MIGRATED: covered by src/styles/sisad-tailwind-bridge.css */`              | skin de card/sidebar ya movido al bridge.        |
| Conservado por geometría   | `/* KEEP: paper geometry and page stacking. Do not migrate. */`                | paper scale, page root, canvas page.             |
| Conservado por interacción | `/* KEEP: Moveable/Selecto/hit-testing compatibility. */`                      | selecto/moveable, target guards, pointer-events. |
| Conservado por Ant          | `/* KEEP: Ant Design compatibility override. */`                               | .ant-select-selector, .ant-btn, collapse.        |
| Pendiente                   | `/* TODO(TAILWIND): migrate in TC-CSS-XX after visual regression coverage. */` | section card animations.                         |
| Eliminado                   | Commit message + reporte con`rg`                                               | selector no usado y sin generación runtime.     |

Criterios para eliminar:

1. `rg` confirma que el selector no se usa.
2. No es generado por librería, runtime ni `data-*`.
3. No aparece en tests ni visual baseline.
4. Hay equivalente Tailwind/bridge validado.
5. Screenshot antes/después aprobado.

## 13. Task-cards propuestas para Codex

| Task-card | Nombre                            | Objetivo                                                                                                 | Archivos                                                    | Restricción                                      |
| --------- | --------------------------------- | -------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------- |
| TC-CSS-00 | Baseline visual e infraestructura | Inventariar`public/img-version`, capturas actuales, confirmar única entrada Tailwind, config/postcss. | style.css, tailwind.css, tailwind.config, postcss, main.jsx | No editar core UI.                                |
| TC-CSS-01 | Restaurar canvas-first lab shell  | Corregir PageHeader/PdfmeLabPage/ResultsPanel/labRoutes para no encajonar canvas.                        | features/pdfcomponent                                       | No tocar src/sisad-pdfme excepto si falla import. |
| TC-CSS-02 | Landing y CaseCard Tailwind       | Migrar landing/cards/filtros a Tailwind JSX directo.                                                     | LabLandingPage, CaseCard, primitives                        | No tocar editor.                                  |
| TC-CSS-03 | Bridge root/layout/control bar    | Expandir bridge con tokens`sisad` y clases existentes sin `@layer`.                                  | sisad-tailwind-bridge.css                                   | No tocar geometry.                                |
| TC-CSS-04 | LeftSidebar baseline              | Migrar visual search/tabs/filters/cards manteniendo drag/drop.                                           | LeftSidebar*.tsx, global/bridge                             | No canvasDropPipeline.                            |
| TC-CSS-05 | RightSidebar ListView baseline    | Compactar tabs, toolbar, rows, badges.                                                                   | RightSidebar/ListView/**                                    | No romper selección/rename/filter.               |
| TC-CSS-06 | RightSidebar DetailView baseline  | Migrar section cards/inputs/widgets visual con Ant compat.                                               | DetailView/**, runtime/global                               | No romper inspector command update.               |
| TC-CSS-07 | Canvas toolbar/context menu skins | Migrar skins, conservar z-index/transform/position.                                                      | canvas-interactions, overlays                               | Validar hit-testing y botón +.                   |
| TC-CSS-08 | Field chrome por modo             | Separar designer/form/viewer/pdf visual.                                                                 | fieldChrome, renderSchemaWithChrome, global/runtime         | No tocar geometry/metadata.                       |
| TC-CSS-09 | Schema family visual parity       | Validar text/option/action/media/table/signing visual y runtime.                                         | schemas/**/uiRender/index                                   | No tocar pdfRender salvo bug.                     |
| TC-CSS-10 | Limpieza legacy                   | Eliminar duplicados y demo huérfano con evidencia.                                                      | CSS legacy/reportes                                         | Solo tras validación visual.                     |

## 14. Validación requerida

### 14.1 Comandos

``​`bash
npm run build
npm run typecheck  # si existe
npm run lint       # si existe y no bloquea por reglas externas
``​`

Tests focalizados sugeridos:

``​`bash
npx vitest run tests/unit/features/pdfcomponent
npx vitest run tests/unit/sisad-pdfme/ui
npx vitest run tests/unit/sisad-pdfme/schemas
npx playwright test tests/playwright/multi-document-routing-design.spec.ts --project=chromium
npx playwright test tests/playwright/form-viewer-generator-parity.spec.ts --project=chromium
``​`

### 14.2 Checklist manual

| Ruta                        | Validaciones mínimas                                                                                                                                                |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| /                           | Landing usa baseline/estética correcta; filtros y búsqueda funcionan; cards abren rutas y descarga plantilla.                                                      |
| /lab/multi-document-routing | Header compacto; canvas máximo; LeftSidebar/RightSidebar baseline; drag/drop; selección; move/resize/rotate; página 2+; multi-recipient; Results no tapa toolbar. |
| /lab/generator-runtime      | Form limpio; Viewer limpio; generator no rompe; PDF final sin chrome/fondos.                                                                                         |

### 14.3 Screenshot regression

Guardar capturas actuales en `reports/tailwind-migration/current-screenshots` y comparar contra `public/img-version`. No se exige pixel-perfect, sí densidad, jerarquía, tamaño de paneles, espacio de canvas y chrome de campos.

## 15. Criterios de aceptación

- No hay doble emisión Tailwind.
- No hay `preflight` activo.
- El editor conserva o recupera la estética de `public/img-version`.
- El canvas vuelve a ser protagonista y no queda encerrado en una card del host.
- LeftSidebar y RightSidebar mantienen baseline visual y densidad.
- No se tocó Moveable/Selecto/coordinate service/schema collision/snapshot por diseño.
- No hay nuevas reglas globales fuera de `.sisad-pdfme-root` o clases del lab.
- No hay nuevos `as any`.
- Form/Viewer/Generator conservan comportamiento y PDF final no imprime chrome.
- Todo CSS eliminado tiene evidencia `rg` + screenshot + validación.

## 16. Prompt operativo para Codex

``​`txt
Actúa como arquitecto frontend senior experto en React, Vite, Tailwind, CSS cascade y editores PDF/canvas. Ejecuta la task-card TC-CSS-00 primero. Usa /Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/public/img-version como baseline visual obligatorio. No rediseñes desde cero: restaura intención visual previa y corrige regresiones de Tailwind.

Reglas: preflight false, no tocar Moveable/Selecto, no migrar geometry/paper/transform/zoom/x/y/width/height/rotation a Tailwind, no borrar tokens.css, no crear runtime paralelo, no tocar generator/pdf-lib/snapshot. Mantén bridge top-level @apply, no @layer components para clases runtime.

Flujo: inventario visual -> capturas actuales -> infraestructura Tailwind -> canvas-first lab shell -> bridge -> sidebars -> overlays skins -> field chrome -> cleanup legacy. Cada bloque CSS debe clasificarse como MIGRATE_JSX, MIGRATE_BRIDGE, KEEP_LEGACY, TOKENIZE, DELETE_DUPLICATE, SPLIT_RULE o NEEDS_TASK_CARD. Implementa cambios reales por task-card y entrega reporte con validación.
``​`

## Apéndice A — Inventario completo de archivos de código y decisión de migración

> Esta tabla cubre todos los archivos incluidos en `codigo-frontend-sisad—pdmfe.md`. La decisión no significa que todos deban editarse; marca el rol del archivo durante la migración CSS/Tailwind.

| Archivo                                                                                       | Líneas | Estado                        | Decisión                    | Nota                                                                                           |
| --------------------------------------------------------------------------------------------- | ------- | ----------------------------- | ---------------------------- | ---------------------------------------------------------------------------------------------- |
| package.json                                                                                  | 98      | completo                      | INFRA_VALIDATE               | Verificar scripts, dependencias Tailwind, no ejecutar migración destructiva.                  |
| vite.config.js                                                                                | 24      | completo                      | NO_SCOPE_REVIEW              | Revisar solo si aparece en dependencias de CSS visual.                                         |
| tailwind.config.js                                                                            | 80      | completo                      | INFRA_VALIDATE               | Dejar una sola configuración activa; preflight false; tokens sisad mapeados.                  |
| postcss.config.js                                                                             | 6       | completo                      | INFRA_DEDUP                  | Dejar un solo PostCSS config si el toolchain no requiere ambos.                                |
| postcss.config.mjs                                                                            | 6       | completo                      | INFRA_DEDUP                  | Dejar un solo PostCSS config si el toolchain no requiere ambos.                                |
| eslint.config.cjs                                                                             | 126     | completo                      | NO_SCOPE_REVIEW              | Revisar solo si aparece en dependencias de CSS visual.                                         |
| tsconfig.json                                                                                 | 65      | completo                      | NO_SCOPE_REVIEW              | Revisar solo si aparece en dependencias de CSS visual.                                         |
| src/main.jsx                                                                                  | 13      | completo                      | INFRA_ENTRY                  | Importar tailwind.css y bridge una sola vez; evitar imports duplicados.                        |
| src/App.jsx                                                                                   | 25      | completo                      | ROUTING_ONLY                 | No tocar diseño core; solo rutas de laboratorio.                                              |
| src/features/pdfcomponent/CaseCard.jsx                                                        | 123     | completo                      | MIGRATE_LAB_JSX              | Migrar visual host/landing/cards/header/results con Tailwind directo y mantener acciones.      |
| src/features/pdfcomponent/CompactControls.jsx                                                 | 280     | completo                      | MIGRATE_LAB_JSX              | Migrar visual host/landing/cards/header/results con Tailwind directo y mantener acciones.      |
| src/features/pdfcomponent/LabExampleDownloadButton.jsx                                        | 74      | completo                      | MIGRATE_LAB_JSX              | Migrar visual host/landing/cards/header/results con Tailwind directo y mantener acciones.      |
| src/features/pdfcomponent/LabLandingPage.jsx                                                  | 242     | completo                      | MIGRATE_LAB_JSX              | Migrar visual host/landing/cards/header/results con Tailwind directo y mantener acciones.      |
| src/features/pdfcomponent/PageHeader.jsx                                                      | 415     | completo                      | MIGRATE_LAB_JSX              | Migrar visual host/landing/cards/header/results con Tailwind directo y mantener acciones.      |
| src/features/pdfcomponent/PdfmeLabPage.jsx                                                    | 637     | completo                      | MIGRATE_LAB_JSX              | Migrar visual host/landing/cards/header/results con Tailwind directo y mantener acciones.      |
| src/features/pdfcomponent/PopoverMenu.jsx                                                     | 114     | completo                      | MIGRATE_LAB_JSX              | Migrar visual host/landing/cards/header/results con Tailwind directo y mantener acciones.      |
| src/features/pdfcomponent/ResultsPanel.jsx                                                    | 248     | completo                      | MIGRATE_LAB_JSX              | Migrar visual host/landing/cards/header/results con Tailwind directo y mantener acciones.      |
| src/features/pdfcomponent/domain/labPresentation.js                                           | 192     | completo                      | MIGRATE_LAB_JSX              | Migrar visual host/landing/cards/header/results con Tailwind directo y mantener acciones.      |
| src/features/pdfcomponent/domain/labState.js                                                  | 18      | completo                      | MIGRATE_LAB_JSX              | Migrar visual host/landing/cards/header/results con Tailwind directo y mantener acciones.      |
| src/features/pdfcomponent/ui/primitives.jsx                                                   | 103     | completo                      | MIGRATE_LAB_JSX              | Migrar visual host/landing/cards/header/results con Tailwind directo y mantener acciones.      |
| src/features/pdfcomponent/labs/builders/exampleTemplate.ts                                    | 199     | completo                      | KEEP_LAB_DATA_LOGIC          | No migrar estilos; mantener fixtures/builders/export fuera del core.                           |
| src/features/pdfcomponent/labs/builders/schemaFactory.ts                                      | 91      | completo                      | KEEP_LAB_DATA_LOGIC          | No migrar estilos; mantener fixtures/builders/export fuera del core.                           |
| src/features/pdfcomponent/labs/builders/schemaShowcase.ts                                     | 220     | completo                      | KEEP_LAB_DATA_LOGIC          | No migrar estilos; mantener fixtures/builders/export fuera del core.                           |
| src/features/pdfcomponent/labs/examples/labExamples.js                                        | 885     | completo                      | KEEP_LAB_DATA_LOGIC          | No migrar estilos; mantener fixtures/builders/export fuera del core.                           |
| src/features/pdfcomponent/labs/export/buildExampleBundle.ts                                   | 78      | completo                      | KEEP_LAB_DATA_LOGIC          | No migrar estilos; mantener fixtures/builders/export fuera del core.                           |
| src/features/pdfcomponent/labs/export/downloadExampleBundle.ts                                | 25      | completo                      | KEEP_LAB_DATA_LOGIC          | No migrar estilos; mantener fixtures/builders/export fuera del core.                           |
| .eslintrc.cjs                                                                                 | 49      | completo                      | NO_SCOPE_REVIEW              | Revisar solo si aparece en dependencias de CSS visual.                                         |
| playwright.config.ts                                                                          | 27      | completo                      | NO_SCOPE_REVIEW              | Revisar solo si aparece en dependencias de CSS visual.                                         |
| test-script.js                                                                                | 5       | completo                      | NO_SCOPE_REVIEW              | Revisar solo si aparece en dependencias de CSS visual.                                         |
| vite.config copy.js                                                                           | 487     | completo                      | NO_SCOPE_REVIEW              | Revisar solo si aparece en dependencias de CSS visual.                                         |
| vitest.config.ts                                                                              | 22      | completo                      | NO_SCOPE_REVIEW              | Revisar solo si aparece en dependencias de CSS visual.                                         |
| scripts/delete-existing-markdown.mjs                                                          | 54      | completo                      | NO_SCOPE_REVIEW              | Revisar solo si aparece en dependencias de CSS visual.                                         |
| scripts/migrate-design-to-tailwind.mjs                                                        | 864     | completo                      | NO_SCOPE_REVIEW              | Revisar solo si aparece en dependencias de CSS visual.                                         |
| src/types/custom.d.ts                                                                         | 23      | completo                      | NO_SCOPE_REVIEW              | Revisar solo si aparece en dependencias de CSS visual.                                         |
| src/sisad-pdfme/assignments/index.ts                                                          | 612     | completo                      | NO_SCOPE_REVIEW              | Revisar solo si aparece en dependencias de CSS visual.                                         |
| src/sisad-pdfme/browser/downloads.ts                                                          | 44      | completo                      | NO_SCOPE_REVIEW              | Revisar solo si aparece en dependencias de CSS visual.                                         |
| src/sisad-pdfme/browser/objectUrls.ts                                                         | 32      | completo                      | NO_SCOPE_REVIEW              | Revisar solo si aparece en dependencias de CSS visual.                                         |
| src/sisad-pdfme/canvas/canvasRenderState.ts                                                   | 146     | completo                      | NO_SCOPE_REVIEW              | Revisar solo si aparece en dependencias de CSS visual.                                         |
| src/sisad-pdfme/canvas/overlayManager.ts                                                      | 249     | completo                      | NO_SCOPE_REVIEW              | Revisar solo si aparece en dependencias de CSS visual.                                         |
| src/sisad-pdfme/canvas/useCanvasRenderState.ts                                                | 171     | completo                      | NO_SCOPE_REVIEW              | Revisar solo si aparece en dependencias de CSS visual.                                         |
| src/sisad-pdfme/collaboration/appearance.ts                                                   | 55      | completo                      | NO_SCOPE_REVIEW              | Revisar solo si aparece en dependencias de CSS visual.                                         |
| src/sisad-pdfme/collaboration/index.ts                                                        | 459     | completo                      | NO_SCOPE_REVIEW              | Revisar solo si aparece en dependencias de CSS visual.                                         |
| src/sisad-pdfme/collaboration/lockManager.ts                                                  | 253     | completo                      | NO_SCOPE_REVIEW              | Revisar solo si aparece en dependencias de CSS visual.                                         |
| src/sisad-pdfme/collaboration/recipientPalette.ts                                             | 69      | completo                      | NO_SCOPE_REVIEW              | Revisar solo si aparece en dependencias de CSS visual.                                         |
| src/sisad-pdfme/collaboration/schemaLockGuard.ts                                              | 96      | completo                      | NO_SCOPE_REVIEW              | Revisar solo si aparece en dependencias de CSS visual.                                         |
| src/sisad-pdfme/collaboration/schemaOwnershipAppearance.ts                                    | 157     | completo                      | NO_SCOPE_REVIEW              | Revisar solo si aparece en dependencias de CSS visual.                                         |
| src/sisad-pdfme/commands/index.ts                                                             | 52      | completo                      | NO_SCOPE_REVIEW              | Revisar solo si aparece en dependencias de CSS visual.                                         |
| src/sisad-pdfme/comments/index.ts                                                             | 199     | completo                      | NO_SCOPE_REVIEW              | Revisar solo si aparece en dependencias de CSS visual.                                         |
| src/sisad-pdfme/common/collaboration.ts                                                       | 364     | completo                      | NO_SCOPE_REVIEW              | Revisar solo si aparece en dependencias de CSS visual.                                         |
| src/sisad-pdfme/common/comments.ts                                                            | 280     | completo                      | NO_SCOPE_REVIEW              | Revisar solo si aparece en dependencias de CSS visual.                                         |
| src/sisad-pdfme/common/constants.ts                                                           | 31      | omitido minificado            | NO_SCOPE_REVIEW              | Revisar solo si aparece en dependencias de CSS visual.                                         |
| src/sisad-pdfme/common/dynamicTemplate.ts                                                     | 319     | completo                      | NO_SCOPE_REVIEW              | Revisar solo si aparece en dependencias de CSS visual.                                         |
| src/sisad-pdfme/common/expression.ts                                                          | 460     | completo                      | NO_SCOPE_REVIEW              | Revisar solo si aparece en dependencias de CSS visual.                                         |
| src/sisad-pdfme/common/helper.ts                                                              | 284     | completo                      | NO_SCOPE_REVIEW              | Revisar solo si aparece en dependencias de CSS visual.                                         |
| src/sisad-pdfme/common/index.ts                                                               | 121     | completo                      | NO_SCOPE_REVIEW              | Revisar solo si aparece en dependencias de CSS visual.                                         |
| src/sisad-pdfme/common/pluginRegistry.ts                                                      | 63      | completo                      | NO_SCOPE_REVIEW              | Revisar solo si aparece en dependencias de CSS visual.                                         |
| src/sisad-pdfme/common/schema.ts                                                              | 300     | completo                      | NO_SCOPE_REVIEW              | Revisar

/* ... CONTENIDO OMITIDO PARA REDUCIR PESO: 95402 caracteres. Usa --mode full o sube --max-file-kb si necesitas este archivo completo. ... */

or componentes, con bridge y validación.                                  |
| src/sisad-pdfme/ui/components/Designer/shared/keyboardShortcutRegistry.ts                     | 290     | completo                      | UI_CORE_REVIEW               | Migrar visual solo por componentes, con bridge y validación.                                  |
| src/sisad-pdfme/ui/components/Designer/shared/keyboardShortcuts.ts                            | 568     | completo                      | UI_CORE_REVIEW               | Migrar visual solo por componentes, con bridge y validación.                                  |
| src/sisad-pdfme/ui/components/Designer/shared/objectGuards.ts                                 | 12      | completo                      | UI_CORE_REVIEW               | Migrar visual solo por componentes, con bridge y validación.                                  |
| src/sisad-pdfme/ui/components/Designer/shared/passiveTouchListeners.ts                        | 38      | completo                      | UI_CORE_REVIEW               | Migrar visual solo por componentes, con bridge y validación.                                  |
| src/sisad-pdfme/ui/components/Designer/shared/recipientColor.ts                               | 143     | completo                      | UI_CORE_REVIEW               | Migrar visual solo por componentes, con bridge y validación.                                  |
| src/sisad-pdfme/ui/components/Designer/shared/schemaAutoPlace.ts                              | 96      | completo                      | UI_CORE_REVIEW               | Migrar visual solo por componentes, con bridge y validación.                                  |
| src/sisad-pdfme/ui/components/Designer/shared/schemaClipboard.ts                              | 426     | completo                      | UI_CORE_REVIEW               | Migrar visual solo por componentes, con bridge y validación.                                  |
| src/sisad-pdfme/ui/components/Designer/shared/schemaCollision.ts                              | 101     | truncado 2.3 KB               | PROTECT_GEOMETRY_INTERACTION | No migrar geometría/hit-testing; cambios visuales solo con evidencia y tests.                 |
| src/sisad-pdfme/ui/components/Designer/shared/schemaInteractionCapabilities.ts                | 115     | omitido por presupuesto total | UI_CORE_REVIEW               | Migrar visual solo por componentes, con bridge y validación.                                  |
| src/sisad-pdfme/ui/components/Designer/shared/schemaTone.ts                                   | 90      | omitido por presupuesto total | UI_CORE_REVIEW               | Migrar visual solo por componentes, con bridge y validación.                                  |
| src/sisad-pdfme/ui/components/Designer/shared/schemaVariableName.ts                           | 49      | omitido por presupuesto total | UI_CORE_REVIEW               | Migrar visual solo por componentes, con bridge y validación.                                  |
| src/sisad-pdfme/ui/components/Designer/shared/selectableTargetGuards.ts                       | 34      | omitido por presupuesto total | PROTECT_GEOMETRY_INTERACTION | No migrar geometría/hit-testing; cambios visuales solo con evidencia y tests.                 |
| src/sisad-pdfme/ui/components/Designer/shared/selectionCommands.ts                            | 885     | omitido por presupuesto total | UI_CORE_REVIEW               | Migrar visual solo por componentes, con bridge y validación.                                  |
| src/sisad-pdfme/ui/components/Designer/shared/selectionIdentityResolver.ts                    | 115     | omitido por presupuesto total | UI_CORE_REVIEW               | Migrar visual solo por componentes, con bridge y validación.                                  |
| src/sisad-pdfme/ui/components/Designer/shared/transformTargetGuards.ts                        | 29      | omitido por presupuesto total | PROTECT_GEOMETRY_INTERACTION | No migrar geometría/hit-testing; cambios visuales solo con evidencia y tests.                 |
| src/sisad-pdfme/ui/components/Designer/shared/useDesignerKeyboardShortcuts.ts                 | 546     | omitido por presupuesto total | UI_CORE_REVIEW               | Migrar visual solo por componentes, con bridge y validación.                                  |
| src/sisad-pdfme/ui/components/Designer/shared/useResponsiveDensity.ts                         | 81      | omitido por presupuesto total | UI_CORE_REVIEW               | Migrar visual solo por componentes, con bridge y validación.                                  |
| src/sisad-pdfme/ui/components/Designer/Shortcuts/ShortcutHelpButton.tsx                       | 43      | omitido por presupuesto total | UI_CORE_REVIEW               | Migrar visual solo por componentes, con bridge y validación.                                  |
| src/sisad-pdfme/ui/components/Designer/Shortcuts/ShortcutHelpPanel.tsx                        | 163     | omitido por presupuesto total | UI_CORE_REVIEW               | Migrar visual solo por componentes, con bridge y validación.                                  |
| src/sisad-pdfme/ui/components/Designer/Canvas/overlays/CanvasContextMenu.tsx                  | 242     | omitido por presupuesto total | OVERLAY_SKIN_ONLY            | Tailwind solo para skin; posición, transform, z-index, pointer-events críticos se conservan. |
| src/sisad-pdfme/ui/components/Designer/Canvas/overlays/canvasContextMenuActions.tsx           | 921     | omitido por presupuesto total | OVERLAY_SKIN_ONLY            | Tailwind solo para skin; posición, transform, z-index, pointer-events críticos se conservan. |
| src/sisad-pdfme/ui/components/Designer/Canvas/overlays/CanvasOverlayManager.tsx               | 141     | omitido por presupuesto total | OVERLAY_SKIN_ONLY            | Tailwind solo para skin; posición, transform, z-index, pointer-events críticos se conservan. |
| src/sisad-pdfme/ui/components/Designer/Canvas/overlays/CanvasStateOverlay.tsx                 | 158     | omitido por presupuesto total | OVERLAY_SKIN_ONLY            | Tailwind solo para skin; posición, transform, z-index, pointer-events críticos se conservan. |
| src/sisad-pdfme/ui/components/Designer/Canvas/overlays/CommentsOverlay.tsx                    | 271     | omitido por presupuesto total | OVERLAY_SKIN_ONLY            | Tailwind solo para skin; posición, transform, z-index, pointer-events críticos se conservan. |
| src/sisad-pdfme/ui/components/Designer/Canvas/overlays/floatingSurfaceGeometry.ts             | 97      | omitido por presupuesto total | OVERLAY_SKIN_ONLY            | Tailwind solo para skin; posición, transform, z-index, pointer-events críticos se conservan. |
| src/sisad-pdfme/ui/components/Designer/Canvas/overlays/GroupOptionFloatingAction.tsx          | 103     | omitido por presupuesto total | OVERLAY_SKIN_ONLY            | Tailwind solo para skin; posición, transform, z-index, pointer-events críticos se conservan. |
| src/sisad-pdfme/ui/components/Designer/Canvas/overlays/InlineEditOverlay.tsx                  | 204     | omitido por presupuesto total | OVERLAY_SKIN_ONLY            | Tailwind solo para skin; posición, transform, z-index, pointer-events críticos se conservan. |
| src/sisad-pdfme/ui/components/Designer/Canvas/overlays/InlineMetricsOverlay.tsx               | 23      | omitido por presupuesto total | OVERLAY_SKIN_ONLY            | Tailwind solo para skin; posición, transform, z-index, pointer-events críticos se conservan. |
| src/sisad-pdfme/ui/components/Designer/Canvas/overlays/overlayState.ts                        | 40      | omitido por presupuesto total | OVERLAY_SKIN_ONLY            | Tailwind solo para skin; posición, transform, z-index, pointer-events críticos se conservan. |
| src/sisad-pdfme/ui/components/Designer/Canvas/overlays/pointerGeometry.ts                     | 133     | omitido por presupuesto total | OVERLAY_SKIN_ONLY            | Tailwind solo para skin; posición, transform, z-index, pointer-events críticos se conservan. |
| src/sisad-pdfme/ui/components/Designer/Canvas/overlays/SchemaDragPreview.tsx                  | 41      | omitido por presupuesto total | OVERLAY_SKIN_ONLY            | Tailwind solo para skin; posición, transform, z-index, pointer-events críticos se conservan. |
| src/sisad-pdfme/ui/components/Designer/Canvas/overlays/SchemaDropCommitFlash.tsx              | 49      | omitido por presupuesto total | OVERLAY_SKIN_ONLY            | Tailwind solo para skin; posición, transform, z-index, pointer-events críticos se conservan. |
| src/sisad-pdfme/ui/components/Designer/Canvas/overlays/SchemaDropPlaceholder.tsx              | 57      | omitido por presupuesto total | OVERLAY_SKIN_ONLY            | Tailwind solo para skin; posición, transform, z-index, pointer-events críticos se conservan. |
| src/sisad-pdfme/ui/components/Designer/Canvas/overlays/SelectionContextToolbar.tsx            | 217     | omitido por presupuesto total | OVERLAY_SKIN_ONLY            | Tailwind solo para skin; posición, transform, z-index, pointer-events críticos se conservan. |
| src/sisad-pdfme/ui/components/Designer/Canvas/overlays/smartPlacement.ts                      | 196     | omitido por presupuesto total | OVERLAY_SKIN_ONLY            | Tailwind solo para skin; posición, transform, z-index, pointer-events críticos se conservan. |
| src/sisad-pdfme/ui/components/Designer/Canvas/overlays/SnapFeedbackOverlay.tsx                | 42      | omitido por presupuesto total | OVERLAY_SKIN_ONLY            | Tailwind solo para skin; posición, transform, z-index, pointer-events críticos se conservan. |
| src/sisad-pdfme/ui/components/Designer/Canvas/overlays/useFloatingToolbarPosition.ts          | 69      | omitido por presupuesto total | OVERLAY_SKIN_ONLY            | Tailwind solo para skin; posición, transform, z-index, pointer-events críticos se conservan. |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/AlignWidget.tsx                | 67      | omitido por presupuesto total | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección.                          |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/ButtonGroupWidget.tsx          | 83      | omitido por presupuesto total | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección.                          |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/CompactConfigPanel.tsx         | 99      | omitido por presupuesto total | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección.                          |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailFormSection.tsx          | 55      | omitido por presupuesto total | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección.                          |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailHeaderCard.tsx           | 136     | omitido por presupuesto total | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección.                          |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailHeaderUtils.ts           | 85      | omitido por presupuesto total | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección.                          |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailSchemas.ts               | 430     | omitido por presupuesto total | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección.                          |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailSectionCard.tsx          | 177     | omitido por presupuesto total | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección.                          |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailSectionTaxonomy.ts       | 405     | omitido por presupuesto total | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección.                          |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailView.tsx                 | 417     | omitido por presupuesto total | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección.                          |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailViewContent.tsx          | 63      | omitido por presupuesto total | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección.                          |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailWidgetRegistry.tsx       | 141     | omitido por presupuesto total | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección.                          |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailWidgets.tsx              | 108     | omitido por presupuesto total | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección.                          |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/inspectorContracts.ts          | 366     | omitido por presupuesto total | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección.                          |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/InspectorPrimitives.tsx        | 217     | omitido por presupuesto total | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección.                          |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/schemaCollaborationUtils.ts    | 18      | omitido por presupuesto total | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección.                          |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaCollaborationWidget.tsx  | 485     | omitido por presupuesto total | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección.                          |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaConnectionsShared.tsx    | 146     | omitido por presupuesto total | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección.                          |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/schemaConnectionsValidation.ts | 83      | omitido por presupuesto total | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección.                          |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaConnectionsWidget.tsx    | 825     | omitido por presupuesto total | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección.                          |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaFieldCommentsWidget.tsx  | 314     | omitido por presupuesto total | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección.                          |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/WidgetRenderer.tsx             | 32      | omitido por presupuesto total | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección.                          |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/Item.tsx                         | 341     | omitido por presupuesto total | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección.                          |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/ListView.tsx                     | 345     | omitido por presupuesto total | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección.                          |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/ListViewDragOverlay.tsx          | 58      | omitido por presupuesto total | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección.                          |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/ListViewFooter.tsx               | 56      | omitido por presupuesto total | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección.                          |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/ListViewToolbar.tsx              | 238     | omitido por presupuesto total | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección.                          |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/SelectableSortableContainer.tsx  | 217     | omitido por presupuesto total | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección.                          |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/SelectableSortableItem.tsx       | 119     | omitido por presupuesto total | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección.                          |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/shared/SidebarSurfacePrimitives.tsx       | 112     | omitido por presupuesto total | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección.                          |

## Apéndice B — Inventario completo de CSS/Tailwind

| Archivo                                                                                                                                               | Líneas | Estado           | Decisión                 | Nota                                                                                                           |
| ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | ---------------- | ------------------------- | -------------------------------------------------------------------------------------------------------------- |
| src/styles/tailwind.css                                                                                                                               | 11      | completo         | INFRA_CANONICAL           | Mantener como única entrada Tailwind; no duplicar directivas.                                                 |
| src/style.css                                                                                                                                         | 11      | completo         | INFRA_NEUTRALIZE          | Debe quedar neutralizado o sin @tailwind para evitar doble emisión.                                           |
| src/styles/sisad-tailwind-bridge.css                                                                                                                  | 415     | completo         | MIGRATE_BRIDGE            | Bridge top-level @apply para clases existentes; no usar @layer si purga clases dinámicas.                     |
| reports/tailwind-migration/candidates/features__pdfcomponent__labRoutes.tailwind.candidate.css                                                        | 1600    | completo         | REFERENCE_ONLY            | Archivo candidato generado; no copiar ciegamente, usar como mapa de @apply/manual.                             |
| reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__canvas-interactions.tailwind.candidate.css                                             | 1547    | completo         | REFERENCE_ONLY            | Archivo candidato generado; no copiar ciegamente, usar como mapa de @apply/manual.                             |
| reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__sisad-pdfme-global.tailwind.candidate.css                                              | 6417    | truncado 75.1 KB | REFERENCE_ONLY            | Archivo candidato generado; no copiar ciegamente, usar como mapa de @apply/manual.                             |
| reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__sisad-pdfme-runtime.tailwind.candidate.css                                             | 443     | completo         | REFERENCE_ONLY            | Archivo candidato generado; no copiar ciegamente, usar como mapa de @apply/manual.                             |
| reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__tokens.tailwind.candidate.css                                                          | 8       | completo         | REFERENCE_ONLY            | Archivo candidato generado; no copiar ciegamente, usar como mapa de @apply/manual.                             |
| src/features/pdfcomponent/labRoutes.css                                                                                                               | 1550    | completo         | SPLIT_LAB_CSS             | Migrar visual seguro; conservar canvas-first, drawer fixed, media compleja y gradientes críticos.             |
| src/sisad-pdfme/ui/styles/canvas-interactions.css                                                                                                     | 1492    | completo         | SPLIT_CANVAS_INTERACTIONS | Migrar skins de toolbar/menu; conservar overlays, transform, pointer-events, z-index tokens, botón +.         |
| src/sisad-pdfme/ui/styles/sisad-pdfme-global.css                                                                                                      | 6383    | truncado 75.6 KB | SPLIT_GLOBAL_CSS          | Migrar por sección; conservar paper geometry, Ant, Moveable/Selecto, keyframes, field chrome crítico.        |
| src/sisad-pdfme/ui/styles/sisad-pdfme-runtime.css                                                                                                     | 240     | completo         | SPLIT_RUNTIME_CSS         | Migrar skins runtime; conservar import global, density attrs, Ant overrides y PDF/print.                       |
| src/sisad-pdfme/ui/styles/tokens.css                                                                                                                  | 374     | completo         | KEEP_TOKEN_SOURCE         | Fuente de verdad de tokens, variables runtime, z-index, paper y owner color; no convertir a clases estáticas. |
| .tailwind-migration-backups/20260708-111736/reports/tailwind-migration/candidates/features__pdfcomponent__labRoutes.tailwind.candidate.css            | 1600    | completo         | REFERENCE_ONLY            | Archivo candidato generado; no copiar ciegamente, usar como mapa de @apply/manual.                             |
| .tailwind-migration-backups/20260708-111736/reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__canvas-interactions.tailwind.candidate.css | 1547    | completo         | REFERENCE_ONLY            | Archivo candidato generado; no copiar ciegamente, usar como mapa de @apply/manual.                             |
| .tailwind-migration-backups/20260708-111736/reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__sisad-pdfme-global.tailwind.candidate.css  | 6417    | truncado 75.1 KB | REFERENCE_ONLY            | Archivo candidato generado; no copiar ciegamente, usar como mapa de @apply/manual.                             |
| .tailwind-migration-backups/20260708-111736/reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__sisad-pdfme-runtime.tailwind.candidate.css | 443     | completo         | REFERENCE_ONLY            | Archivo candidato generado; no copiar ciegamente, usar como mapa de @apply/manual.                             |
| .tailwind-migration-backups/20260708-111736/reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__tokens.tailwind.candidate.css              | 8       | completo         | REFERENCE_ONLY            | Archivo candidato generado; no copiar ciegamente, usar como mapa de @apply/manual.                             |

## Apéndice C — Resumen por decisión

| Decisión                    | Cantidad de archivos | Líneas aprox. | Nota                                                                                           |
| ---------------------------- | -------------------- | -------------- | ---------------------------------------------------------------------------------------------- |
| DO_NOT_TOUCH_VISUAL          | 166                  | 27140          | Fuera de migración visual; motor PDF/generator/converter.                                     |
| SCHEMA_LOGIC_KEEP            | 67                   | 10024          | Mantener lógica de schema; solo validar contratos visuales si aplica.                         |
| NO_SCOPE_REVIEW              | 64                   | 10586          | Revisar solo si aparece en dependencias de CSS visual.                                         |
| UI_CORE_REVIEW               | 56                   | 16789          | Migrar visual solo por componentes, con bridge y validación.                                  |
| MIGRATE_RIGHT_SIDEBAR_VISUAL | 36                   | 7596           | Migrar skins de paneles/listas/inspector; conservar Ant y selección.                          |
| OVERLAY_SKIN_ONLY            | 18                   | 3004           | Tailwind solo para skin; posición, transform, z-index, pointer-events críticos se conservan. |
| SCHEMA_RENDER_VALIDATE       | 18                   | 3227           | Revisar visual por familia; no tocar valores, adapters, snapshot ni PDF render.                |
| MIGRATE_LAB_JSX              | 11                   | 2446           | Migrar visual host/landing/cards/header/results con Tailwind directo y mantener acciones.      |
| MIGRATE_LEFT_SIDEBAR_VISUAL  | 7                    | 2352           | Recuperar baseline visual y migrar cards/tabs/search a Tailwind/bridge; no romper drag/drop.   |
| PROTECT_GEOMETRY_INTERACTION | 7                    | 658            | No migrar geometría/hit-testing; cambios visuales solo con evidencia y tests.                 |
| CANVAS_VISUAL_WITH_GUARDS    | 6                    | 2375           | Revisar visual; conservar overflow/scroll/position/transform en CSS/tokens.                    |
| KEEP_LAB_DATA_LOGIC          | 6                    | 1498           | No migrar estilos; mantener fixtures/builders/export fuera del core.                           |
| RUNTIME_COMPAT_VALIDATE      | 5                    | 776            | No rediseñar; validar que Form/Viewer/PDF no hereden chrome de designer.                      |
| FIELD_CHROME_TASK            | 3                    | 471            | Migrar visual compartido por modo; preservar x/y/size/ownerColor/readonly/required.            |
| PROTECT_SNAPSHOT             | 3                    | 684            | No tocar por CSS; preservar metadata y roundtrip.                                              |
| CONTROL_BAR_REVIEW           | 2                    | 449            | Compactar y migrar skin; mantener posicionamiento y densidad por tokens.                       |
| INFRA_DEDUP                  | 2                    | 12             | Dejar un solo PostCSS config si el toolchain no requiere ambos.                                |
| INFRA_VALIDATE               | 2                    | 178            | Verificar scripts, dependencias Tailwind, no ejecutar migración destructiva.                  |
| INFRA_ENTRY                  | 1                    | 13             | Importar tailwind.css y bridge una sola vez; evitar imports duplicados.                        |
| ROUTING_ONLY                 | 1                    | 25             | No tocar diseño core; solo rutas de laboratorio.                                              |

## Apéndice D — Mapa rápido de exclusiones

| Excluir                                                 | Motivo                                                        |
| ------------------------------------------------------- | ------------------------------------------------------------- |
| `src/sisad-pdfme/pdf-lib/**`                          | Motor PDF; no tiene migración visual.                        |
| `src/sisad-pdfme/generator/**`                        | Generación PDF; solo compatibilidad visual final.            |
| `src/sisad-pdfme/converter/**`                        | Conversión PDF/imagen; fuera de UI.                          |
| `Moveable.tsx`, `Selecto.tsx`                       | Interacción y hit-testing; no tocar desde migración visual. |
| `designerCoordinateService.ts`, `coordinateMath.ts` | Geometría y conversión coordenadas.                         |
| `schemaCollision.ts`, `canvasDropPipeline.ts`       | Drop/collision; no tocar por estilo.                          |
| `snapshotAdapter.ts`, `schemaMigration.ts`          | Persistencia y roundtrip de metadata.                         |
| `tokens.css`                                          | Fuente de verdad visual y runtime; no eliminar.               |
```

<a id="file-0094"></a>

### 0094 — `SEPARATION-CONTRACT.md`

- **Lenguaje:** `markdown`
- **Líneas:** `35`
- **Tamaño original:** `0.5 KB`
- **SHA1 corto:** `723877d456`
- **Estado:** `completo`

```markdown
# Contrato de separación

## `docs/`

Solo documentación del componente `sisad-pdfme`:

- qué es;
- cómo se usa;
- API;
- schemas;
- Designer/Form/Viewer/Generator;
- theming;
- QA;
- troubleshooting.

## `ai/`

Solo operación de asistentes IA:

- agentes;
- subagentes;
- skills;
- memoria;
- task-cards;
- prompts;
- reglas;
- budgets.

## Validación rápida

``​`bash
rg "Codex|Claude|Copilot|agente|subagente|task-card|prompt|tokens|memoria IA" docs
``​`

Ese comando no debería devolver contenido operativo de IA.
```

<a id="file-0095"></a>

### 0095 — `.github/copilot-instructions.md`

- **Lenguaje:** `markdown`
- **Líneas:** `15`
- **Tamaño original:** `0.4 KB`
- **SHA1 corto:** `ba602f0a1f`
- **Estado:** `completo`

```markdown
# GitHub Copilot Instructions — Adaptador delgado

La documentación real vive en:

``​`txt
ai/start/START.md
``​`

Copilot debe seguir estas reglas mínimas:

- No tocar `Moveable`, `Selecto`, geometría, snapshot ni generator salvo task-card explícita.
- No introducir `any` nuevo.
- No duplicar canvas, sidebars, toolbar, renderer ni runtime.
- Mantener metadata de schemas y contratos de Form/Viewer/Generator.
- Preferir cambios pequeños y focalizados.
```

<a id="file-0096"></a>

### 0096 — `ai/README.md`

- **Lenguaje:** `markdown`
- **Líneas:** `38`
- **Tamaño original:** `0.8 KB`
- **SHA1 corto:** `9a45bd1b1c`
- **Estado:** `completo`

```markdown
# ai/ — Fuente de verdad para asistentes IA

Esta carpeta centraliza todo lo que un asistente necesita para trabajar sin alucinar ni gastar tokens de más.

## Filosofía

- Una sola fuente de verdad.
- Un proceso por tarea.
- Documentación modular.
- Memoria actualizable.
- Agentes con responsabilidades separadas.
- Task-cards pequeñas y verificables.

## Orden de lectura recomendado

``​`txt
1. start/START.md
2. router/ROUTER.md
3. router/CONTEXT_BUDGET.md
4. memory/project-memory.md
5. project/scope.md
6. task-cards/<task>.md
7. context/<context>.md
8. rules/<rule>.md
9. playbooks/<playbook>.md
``​`

## Nunca cargar por defecto

``​`txt
- todos los archivos ai/**
- reportes históricos largos
- candidates generados completos
- screenshots completos
- código completo del proyecto
- node_modules
- dist/build
``​`
```

<a id="file-0097"></a>

### 0097 — `ai/tree.md`

- **Lenguaje:** `markdown`
- **Líneas:** `26`
- **Tamaño original:** `0.4 KB`
- **SHA1 corto:** `fc8813dbfc`
- **Estado:** `completo`

```markdown
# Tree

``​`txt
ai/
├── start
├── project
├── memory
├── router
├── agents
├── subagents
├── skills
├── context
├── rules
├── playbooks
├── task-cards
│   ├── active
│   ├── backlog
│   └── completed
├── checklists
├── prompts
├── baselines
├── reports
├── templates
├── adapters
└── docs-migration
``​`
```

<a id="file-0098"></a>

### 0098 — `scripts/README.md`

- **Lenguaje:** `markdown`
- **Líneas:** `21`
- **Tamaño original:** `0.4 KB`
- **SHA1 corto:** `0e32d4fbf2`
- **Estado:** `completo`

```markdown
# Scripts

## Instalar arquitectura

``​`bash
bash scripts/install-architecture.sh /ruta/proyecto
``​`

## Eliminar Markdown anteriores

``​`bash
node scripts/delete-existing-markdown.mjs /ruta/proyecto --dry-run
node scripts/delete-existing-markdown.mjs /ruta/proyecto --confirm --backup
``​`

## Eliminar carpetas vacías

``​`bash
bash scripts/clean-empty-dirs.sh /ruta/proyecto --dry-run
bash scripts/clean-empty-dirs.sh /ruta/proyecto --confirm
``​`
```

<a id="file-0099"></a>

### 0099 — `ai/adapters/README.md`

- **Lenguaje:** `markdown`
- **Líneas:** `3`
- **Tamaño original:** `0.1 KB`
- **SHA1 corto:** `f5c142520b`
- **Estado:** `completo`

```markdown
# Adapters

Adaptadores para herramientas. Los archivos raíz deben ser copias delgadas de estos o apuntar a `ai/start/START.md`.
```

<a id="file-0100"></a>

### 0100 — `ai/agents/canvas-agent.md`

- **Lenguaje:** `markdown`
- **Líneas:** `37`
- **Tamaño original:** `0.6 KB`
- **SHA1 corto:** `d47611924c`
- **Estado:** `completo`

```markdown
# Canvas Agent

## Responsabilidad

Gestiona multipágina, papers, scroll, grilla, rulers y overlays sin tocar Moveable/Selecto sin permiso.

## Puede tocar

Ver `ai/project/file-ownership-map.md`.

## No puede tocar

- Archivos fuera de su dominio.
- Negocio SISAD externo.
- Generator/pdf-lib/snapshot/Moveable/Selecto salvo task-card explícita.

## Entrada mínima

``​`txt
START.md
ROUTER.md
CONTEXT_BUDGET.md
task-card activa
contexto del dominio
regla del dominio
playbook del dominio
``​`

## Salida esperada

``​`md
# Resultado
## Diagnóstico
## Archivos modificados
## Validación
## Riesgos
``​`
```

<a id="file-0101"></a>

### 0101 — `ai/agents/css-tailwind-agent.md`

- **Lenguaje:** `markdown`
- **Líneas:** `37`
- **Tamaño original:** `0.6 KB`
- **SHA1 corto:** `ad5b3442d4`
- **Estado:** `completo`

```markdown
# CSS Tailwind Agent

## Responsabilidad

Migra estilos por capas, conserva tokens, bridge y CSS legacy crítico.

## Puede tocar

Ver `ai/project/file-ownership-map.md`.

## No puede tocar

- Archivos fuera de su dominio.
- Negocio SISAD externo.
- Generator/pdf-lib/snapshot/Moveable/Selecto salvo task-card explícita.

## Entrada mínima

``​`txt
START.md
ROUTER.md
CONTEXT_BUDGET.md
task-card activa
contexto del dominio
regla del dominio
playbook del dominio
``​`

## Salida esperada

``​`md
# Resultado
## Diagnóstico
## Archivos modificados
## Validación
## Riesgos
``​`
```

<a id="file-0102"></a>

### 0102 — `ai/agents/designer-runtime-agent.md`

- **Lenguaje:** `markdown`
- **Líneas:** `37`
- **Tamaño original:** `0.6 KB`
- **SHA1 corto:** `8c329ce715`
- **Estado:** `completo`

```markdown
# Designer Runtime Agent

## Responsabilidad

Mantiene el flujo principal Designer/Paper/Renderer sin mezclar negocio externo.

## Puede tocar

Ver `ai/project/file-ownership-map.md`.

## No puede tocar

- Archivos fuera de su dominio.
- Negocio SISAD externo.
- Generator/pdf-lib/snapshot/Moveable/Selecto salvo task-card explícita.

## Entrada mínima

``​`txt
START.md
ROUTER.md
CONTEXT_BUDGET.md
task-card activa
contexto del dominio
regla del dominio
playbook del dominio
``​`

## Salida esperada

``​`md
# Resultado
## Diagnóstico
## Archivos modificados
## Validación
## Riesgos
``​`
```

<a id="file-0103"></a>

### 0103 — `ai/agents/docs-architecture-agent.md`

- **Lenguaje:** `markdown`
- **Líneas:** `37`
- **Tamaño original:** `0.6 KB`
- **SHA1 corto:** `53e4b75611`
- **Estado:** `completo`

```markdown
# Docs Architecture Agent

## Responsabilidad

Mantiene ai/ sin duplicidad, memoria, reglas, prompts y task-cards.

## Puede tocar

Ver `ai/project/file-ownership-map.md`.

## No puede tocar

- Archivos fuera de su dominio.
- Negocio SISAD externo.
- Generator/pdf-lib/snapshot/Moveable/Selecto salvo task-card explícita.

## Entrada mínima

``​`txt
START.md
ROUTER.md
CONTEXT_BUDGET.md
task-card activa
contexto del dominio
regla del dominio
playbook del dominio
``​`

## Salida esperada

``​`md
# Resultado
## Diagnóstico
## Archivos modificados
## Validación
## Riesgos
``​`
```

<a id="file-0104"></a>

### 0104 — `ai/agents/inspector-agent.md`

- **Lenguaje:** `markdown`
- **Líneas:** `37`
- **Tamaño original:** `0.6 KB`
- **SHA1 corto:** `12e137aa72`
- **Estado:** `completo`

```markdown
# Inspector Agent

## Responsabilidad

Mantiene DetailView/ListView, secciones, widgets y edición por CommandBus.

## Puede tocar

Ver `ai/project/file-ownership-map.md`.

## No puede tocar

- Archivos fuera de su dominio.
- Negocio SISAD externo.
- Generator/pdf-lib/snapshot/Moveable/Selecto salvo task-card explícita.

## Entrada mínima

``​`txt
START.md
ROUTER.md
CONTEXT_BUDGET.md
task-card activa
contexto del dominio
regla del dominio
playbook del dominio
``​`

## Salida esperada

``​`md
# Resultado
## Diagnóstico
## Archivos modificados
## Validación
## Riesgos
``​`
```

<a id="file-0105"></a>

### 0105 — `ai/agents/interaction-agent.md`

- **Lenguaje:** `markdown`
- **Líneas:** `37`
- **Tamaño original:** `0.6 KB`
- **SHA1 corto:** `fb125f0f62`
- **Estado:** `completo`

```markdown
# Interaction Agent

## Responsabilidad

Protege Selecto, Moveable, shortcuts, selección, drag/resize/rotate y hit-testing.

## Puede tocar

Ver `ai/project/file-ownership-map.md`.

## No puede tocar

- Archivos fuera de su dominio.
- Negocio SISAD externo.
- Generator/pdf-lib/snapshot/Moveable/Selecto salvo task-card explícita.

## Entrada mínima

``​`txt
START.md
ROUTER.md
CONTEXT_BUDGET.md
task-card activa
contexto del dominio
regla del dominio
playbook del dominio
``​`

## Salida esperada

``​`md
# Resultado
## Diagnóstico
## Archivos modificados
## Validación
## Riesgos
``​`
```

<a id="file-0106"></a>

### 0106 — `ai/agents/lab-shell-agent.md`

- **Lenguaje:** `markdown`
- **Líneas:** `37`
- **Tamaño original:** `0.6 KB`
- **SHA1 corto:** `189a3546af`
- **Estado:** `completo`

```markdown
# Lab Shell Agent

## Responsabilidad

Gestiona src/features/pdfcomponent, landing, labs, ResultsPanel y shell canvas-first.

## Puede tocar

Ver `ai/project/file-ownership-map.md`.

## No puede tocar

- Archivos fuera de su dominio.
- Negocio SISAD externo.
- Generator/pdf-lib/snapshot/Moveable/Selecto salvo task-card explícita.

## Entrada mínima

``​`txt
START.md
ROUTER.md
CONTEXT_BUDGET.md
task-card activa
contexto del dominio
regla del dominio
playbook del dominio
``​`

## Salida esperada

``​`md
# Resultado
## Diagnóstico
## Archivos modificados
## Validación
## Riesgos
``​`
```

<a id="file-0107"></a>

### 0107 — `ai/agents/README.md`

- **Lenguaje:** `markdown`
- **Líneas:** `3`
- **Tamaño original:** `0.1 KB`
- **SHA1 corto:** `89e1142ffd`
- **Estado:** `completo`

```markdown
# Agents

Cada agente representa un dominio principal. Un agente no debe cambiar de dominio durante una task-card.
```

<a id="file-0108"></a>

### 0108 — `ai/agents/registry.md`

- **Lenguaje:** `markdown`
- **Líneas:** `12`
- **Tamaño original:** `1.3 KB`
- **SHA1 corto:** `d039b85c28`
- **Estado:** `completo`

```markdown
# Agent Registry

- `designer-runtime-agent.md` — Designer Runtime Agent: Mantiene el flujo principal Designer/Paper/Renderer sin mezclar negocio externo.
- `canvas-agent.md` — Canvas Agent: Gestiona multipágina, papers, scroll, grilla, rulers y overlays sin tocar Moveable/Selecto sin permiso.
- `interaction-agent.md` — Interaction Agent: Protege Selecto, Moveable, shortcuts, selección, drag/resize/rotate y hit-testing.
- `css-tailwind-agent.md` — CSS Tailwind Agent: Migra estilos por capas, conserva tokens, bridge y CSS legacy crítico.
- `visual-baseline-agent.md` — Visual Baseline Agent: Compara estado actual contra public/img-version y detecta regresiones visuales.
- `schema-agent.md` — Schema Agent: Gestiona familias de schemas, option groups, text-like, actions, media, table y signing.
- `inspector-agent.md` — Inspector Agent: Mantiene DetailView/ListView, secciones, widgets y edición por CommandBus.
- `snapshot-agent.md` — Snapshot Agent: Protege snapshot roundtrip, metadata, import/export y migraciones.
- `lab-shell-agent.md` — Lab Shell Agent: Gestiona src/features/pdfcomponent, landing, labs, ResultsPanel y shell canvas-first.
- `docs-architecture-agent.md` — Docs Architecture Agent: Mantiene ai/ sin duplicidad, memoria, reglas, prompts y task-cards.
```

<a id="file-0109"></a>

### 0109 — `ai/agents/schema-agent.md`

- **Lenguaje:** `markdown`
- **Líneas:** `37`
- **Tamaño original:** `0.6 KB`
- **SHA1 corto:** `6ffb8e7544`
- **Estado:** `completo`

```markdown
# Schema Agent

## Responsabilidad

Gestiona familias de schemas, option groups, text-like, actions, media, table y signing.

## Puede tocar

Ver `ai/project/file-ownership-map.md`.

## No puede tocar

- Archivos fuera de su dominio.
- Negocio SISAD externo.
- Generator/pdf-lib/snapshot/Moveable/Selecto salvo task-card explícita.

## Entrada mínima

``​`txt
START.md
ROUTER.md
CONTEXT_BUDGET.md
task-card activa
contexto del dominio
regla del dominio
playbook del dominio
``​`

## Salida esperada

``​`md
# Resultado
## Diagnóstico
## Archivos modificados
## Validación
## Riesgos
``​`
```

<a id="file-0110"></a>

### 0110 — `ai/agents/snapshot-agent.md`

- **Lenguaje:** `markdown`
- **Líneas:** `37`
- **Tamaño original:** `0.6 KB`
- **SHA1 corto:** `217aafeb06`
- **Estado:** `completo`

```markdown
# Snapshot Agent

## Responsabilidad

Protege snapshot roundtrip, metadata, import/export y migraciones.

## Puede tocar

Ver `ai/project/file-ownership-map.md`.

## No puede tocar

- Archivos fuera de su dominio.
- Negocio SISAD externo.
- Generator/pdf-lib/snapshot/Moveable/Selecto salvo task-card explícita.

## Entrada mínima

``​`txt
START.md
ROUTER.md
CONTEXT_BUDGET.md
task-card activa
contexto del dominio
regla del dominio
playbook del dominio
``​`

## Salida esperada

``​`md
# Resultado
## Diagnóstico
## Archivos modificados
## Validación
## Riesgos
``​`
```

<a id="file-0111"></a>

### 0111 — `ai/agents/visual-baseline-agent.md`

- **Lenguaje:** `markdown`
- **Líneas:** `37`
- **Tamaño original:** `0.6 KB`
- **SHA1 corto:** `1ace93bb6d`
- **Estado:** `completo`

```markdown
# Visual Baseline Agent

## Responsabilidad

Compara estado actual contra public/img-version y detecta regresiones visuales.

## Puede tocar

Ver `ai/project/file-ownership-map.md`.

## No puede tocar

- Archivos fuera de su dominio.
- Negocio SISAD externo.
- Generator/pdf-lib/snapshot/Moveable/Selecto salvo task-card explícita.

## Entrada mínima

``​`txt
START.md
ROUTER.md
CONTEXT_BUDGET.md
task-card activa
contexto del dominio
regla del dominio
playbook del dominio
``​`

## Salida esperada

``​`md
# Resultado
## Diagnóstico
## Archivos modificados
## Validación
## Riesgos
``​`
```

<a id="file-0112"></a>

### 0112 — `ai/baselines/img-version-baseline-protocol.md`

- **Lenguaje:** `markdown`
- **Líneas:** `29`
- **Tamaño original:** `0.4 KB`
- **SHA1 corto:** `713dc9eacb`
- **Estado:** `completo`

```markdown
# public/img-version Baseline Protocol

## Carpeta

``​`txt
public/img-version
``​`

## Uso

1. Inventariar imágenes.
2. Crear contact sheet.
3. Clasificar por componente.
4. Capturar estado actual.
5. Comparar intención visual.
6. Reportar regresiones.

## Comparación no pixel-perfect

Evaluar:

- densidad;
- spacing;
- jerarquía;
- proporción canvas/sidebars;
- field chrome;
- toolbars;
- legibilidad;
- consistencia.
```

<a id="file-0113"></a>

### 0113 — `ai/baselines/README.md`

- **Lenguaje:** `markdown`
- **Líneas:** `3`
- **Tamaño original:** `0.1 KB`
- **SHA1 corto:** `48f5436d50`
- **Estado:** `completo`

```markdown
# Baselines

Protocolos de referencia visual y funcional.
```

<a id="file-0114"></a>

### 0114 — `ai/checklists/done-vs-pending.md`

- **Lenguaje:** `markdown`
- **Líneas:** `12`
- **Tamaño original:** `0.2 KB`
- **SHA1 corto:** `3d97a52b18`
- **Estado:** `completo`

```markdown
# Done vs Pending

## Done

- [x] Definir arquitectura IA unificada.

## Pending

- [ ] Instalar en proyecto real.
- [ ] Migrar documentación útil.
- [ ] Ejecutar TASK-VISUAL-001.
- [ ] Ejecutar TASK-CSS-001.
```

<a id="file-0115"></a>

### 0115 — `ai/checklists/global-validation.md`

- **Lenguaje:** `markdown`
- **Líneas:** `8`
- **Tamaño original:** `0.2 KB`
- **SHA1 corto:** `6b13b22f44`
- **Estado:** `completo`

```markdown
# Global Validation Checklist

- [ ] Build pasa.
- [ ] No hay `any` nuevo.
- [ ] Metadata preservada.
- [ ] No se tocó negocio externo.
- [ ] No se duplicó arquitectura.
- [ ] Nueva memoria si hubo decisión.
```

<a id="file-0116"></a>

### 0116 — `ai/checklists/improvement-backlog.md`

- **Lenguaje:** `markdown`
- **Líneas:** `9`
- **Tamaño original:** `0.3 KB`
- **SHA1 corto:** `458028787a`
- **Estado:** `completo`

```markdown
# Improvement Backlog

| Prioridad | Punto | Estado |
|---|---|---|
| Alta | Estabilizar Tailwind post-migración | Pendiente |
| Alta | Inventariar baseline visual | Pendiente |
| Media | Reducir duplicidad docs/.ai | Pendiente |
| Media | Mejorar RightSidebar density | Pendiente |
| Media | Mejorar LeftSidebar truncation | Pendiente |
```

<a id="file-0117"></a>

### 0117 — `ai/checklists/manual-ui-regression.md`

- **Lenguaje:** `markdown`
- **Líneas:** `19`
- **Tamaño original:** `0.4 KB`
- **SHA1 corto:** `8477f3209e`
- **Estado:** `completo`

```markdown
# Manual UI Regression

## `/lab/multi-document-routing`

- [ ] Header compacto.
- [ ] Canvas protagonista.
- [ ] LeftSidebar se parece al baseline.
- [ ] RightSidebar se parece al baseline.
- [ ] Drag/drop funciona.
- [ ] Selección funciona.
- [ ] Página 2+ funciona.
- [ ] Multi-recipient funciona.
- [ ] ResultsPanel no tapa toolbar.

## `/lab/generator-runtime`

- [ ] Form limpio.
- [ ] Viewer limpio.
- [ ] PDF sin chrome.
```

<a id="file-0118"></a>

### 0118 — `ai/checklists/README.md`

- **Lenguaje:** `markdown`
- **Líneas:** `3`
- **Tamaño original:** `0.1 KB`
- **SHA1 corto:** `82829bf2f0`
- **Estado:** `completo`

```markdown
# Checklists

Checklists vivos para validar tareas y controlar pendientes.
```

<a id="file-0119"></a>

### 0119 — `ai/checklists/tailwind-migration.md`

- **Lenguaje:** `markdown`
- **Líneas:** `11`
- **Tamaño original:** `0.3 KB`
- **SHA1 corto:** `c8385f7167`
- **Estado:** `completo`

```markdown
# Tailwind Migration Checklist

- [ ] `preflight:false`.
- [ ] Una sola entrada Tailwind.
- [ ] Bridge importado una vez.
- [ ] `tokens.css` intacto.
- [ ] Geometry legacy preservada.
- [ ] Baseline `public/img-version` revisado.
- [ ] No reglas host contra `.moveable-*` ni `.selecto-*`.
- [ ] Canvas scroll funciona.
- [ ] PDF final sin chrome no deseado.
```

<a id="file-0120"></a>

### 0120 — `ai/context/ai-docs-context.md`

- **Lenguaje:** `markdown`
- **Líneas:** `3`
- **Tamaño original:** `0.1 KB`
- **SHA1 corto:** `67baed74a9`
- **Estado:** `completo`

```markdown
# AI Docs Context

La carpeta `ai/` es fuente de verdad. Documentación antigua puede migrarse, pero no duplicarse.
```

<a id="file-0121"></a>

### 0121 — `ai/context/canvas-multipage-context.md`

- **Lenguaje:** `markdown`
- **Líneas:** `9`
- **Tamaño original:** `0.2 KB`
- **SHA1 corto:** `ece653064c`
- **Estado:** `completo`

```markdown
# Canvas Multipage Context

Flujo crítico:

``​`txt
event → page target → coordinate conversion → schema metadata → render page → overlay rect
``​`

Validar siempre página 2+.
```

<a id="file-0122"></a>

### 0122 — `ai/context/css-tailwind-context.md`

- **Lenguaje:** `markdown`
- **Líneas:** `23`
- **Tamaño original:** `0.6 KB`
- **SHA1 corto:** `4312247736`
- **Estado:** `completo`

```markdown
# CSS/Tailwind Context

## Fuentes principales

``​`txt
src/styles/tailwind.css
src/style.css
src/styles/sisad-tailwind-bridge.css
src/sisad-pdfme/ui/styles/tokens.css
src/sisad-pdfme/ui/styles/sisad-pdfme-global.css
src/sisad-pdfme/ui/styles/canvas-interactions.css
src/sisad-pdfme/ui/styles/sisad-pdfme-runtime.css
src/features/pdfcomponent/labRoutes.css
reports/tailwind-migration/*
``​`

## Decisiones

- Tailwind sin preflight.
- Una sola entrada Tailwind.
- Bridge a nivel raíz si hay clases dinámicas.
- Geometry/paper/transform no migran.
- `public/img-version` es baseline visual.
```

<a id="file-0123"></a>

### 0123 — `ai/context/inspector-context.md`

- **Lenguaje:** `markdown`
- **Líneas:** `3`
- **Tamaño original:** `0.1 KB`
- **SHA1 corto:** `f0d0387668`
- **Estado:** `completo`

```markdown
# Inspector Context

Inspector usa secciones declarativas. Widgets actualizan schema por command/update centralizado, no por mutación directa.
```

<a id="file-0124"></a>

### 0124 — `ai/context/README.md`

- **Lenguaje:** `markdown`
- **Líneas:** `3`
- **Tamaño original:** `0.1 KB`
- **SHA1 corto:** `c3611876d7`
- **Estado:** `completo`

```markdown
# Contexts

Contextos focales. Cargar solo uno por task-card.
```

<a id="file-0125"></a>

### 0125 — `ai/context/schema-families-context.md`

- **Lenguaje:** `markdown`
- **Líneas:** `5`
- **Tamaño original:** `0.2 KB`
- **SHA1 corto:** `0fa8b1385a`
- **Estado:** `completo`

```markdown
# Schema Families Context

Familias: text-like, boolean, option-based, signing-based, action-based, media, shape, table.

Cada familia define render, inspector, value adapter y compatibilidad Form/Viewer/PDF.
```

<a id="file-0126"></a>

### 0126 — `ai/context/selection-transform-context.md`

- **Lenguaje:** `markdown`
- **Líneas:** `3`
- **Tamaño original:** `0.2 KB`
- **SHA1 corto:** `82c62bc253`
- **Estado:** `completo`

```markdown
# Selection Transform Context

Selecto selecciona roots con `data-schema-id`. Moveable transforma roots. Excluir option internals, botón +, toolbar, inputs, contenteditable y overlays.
```

<a id="file-0127"></a>

### 0127 — `ai/context/snapshot-context.md`

- **Lenguaje:** `markdown`
- **Líneas:** `3`
- **Tamaño original:** `0.1 KB`
- **SHA1 corto:** `a7320fffe0`
- **Estado:** `completo`

```markdown
# Snapshot Context

Snapshot preserva document/page, geometry, ownership, options, selected values y `__designer`.
```

<a id="file-0128"></a>

### 0128 — `ai/context/visual-baseline-context.md`

- **Lenguaje:** `markdown`
- **Líneas:** `18`
- **Tamaño original:** `0.2 KB`
- **SHA1 corto:** `ed7a71662f`
- **Estado:** `completo`

```markdown
# Visual Baseline Context

Baseline visual obligatorio:

``​`txt
public/img-version
``​`

Comparar intención visual, no pixel-perfect:

- densidad;
- jerarquía;
- spacing;
- paneles;
- sidebars;
- field chrome;
- toolbars;
- canvas-first.
```

<a id="file-0129"></a>

### 0129 — `ai/docs-migration/MIGRATION_FROM_OLD_STRUCTURE.md`

- **Lenguaje:** `markdown`
- **Líneas:** `30`
- **Tamaño original:** `0.7 KB`
- **SHA1 corto:** `d174ca7040`
- **Estado:** `completo`

```markdown
# Migración desde estructura anterior

## Estructuras antiguas detectadas

``​`txt
.ai/**
docs/**
reports/tailwind-migration/**
README.md
AGENTS.md/CLAUDE.md si existen
``​`

## Estrategia

1. No borrar nada inicialmente.
2. Copiar contenido útil a `ai/`.
3. Reemplazar adaptadores raíz por archivos delgados.
4. Marcar docs antiguos como históricos.
5. Eliminar duplicidad solo después de validar.

## Mapeo

| Antiguo | Nuevo |
|---|---|
| `.ai/context/*` | `ai/context/*` |
| `.ai/rules/*` | `ai/rules/*` |
| `.ai/playbooks/*` | `ai/playbooks/*` |
| `.ai/task-cards/*` | `ai/task-cards/backlog/*` |
| `docs/*` | `ai/project` o documentación externa estable |
| `reports/*` | conservar como evidencia, no cargar por defecto |
```

<a id="file-0130"></a>

### 0130 — `ai/memory/changelog.md`

- **Lenguaje:** `markdown`
- **Líneas:** `7`
- **Tamaño original:** `0.3 KB`
- **SHA1 corto:** `5d210f5aa5`
- **Estado:** `completo`

```markdown
# Changelog

## 2026-07 — Arquitectura IA unificada

- Se propone `ai/` como carpeta única para documentación operativa de asistentes.
- Se separan agentes, subagentes, skills, memoria, reglas, contextos y task-cards.
- Se agregan adaptadores para Codex, Claude y GitHub Copilot.
```

<a id="file-0131"></a>

### 0131 — `ai/memory/completed-checklist.md`

- **Lenguaje:** `markdown`
- **Líneas:** `7`
- **Tamaño original:** `0.3 KB`
- **SHA1 corto:** `4dd59c5b4c`
- **Estado:** `completo`

```markdown
# Checklist completado

- [x] Separar idea de core `sisad-pdfme` y host/lab.
- [x] Definir Tailwind sin preflight.
- [x] Definir baseline visual `public/img-version`.
- [x] Definir necesidad de task-cards pequeñas.
- [x] Identificar que `tokens.css` no debe eliminarse.
```

<a id="file-0132"></a>

### 0132 — `ai/memory/decisions.md`

- **Lenguaje:** `markdown`
- **Líneas:** `21`
- **Tamaño original:** `0.8 KB`
- **SHA1 corto:** `dcc68139c4`
- **Estado:** `completo`

```markdown
# Decisions

## DEC-001 — Carpeta única de IA

Toda la fuente de verdad de asistentes vive en `ai/`. Archivos raíz para Codex/Claude/Copilot son adaptadores delgados.

## DEC-002 — Contexto por task-card

Cada tarea carga máximo una task-card, un contexto, una regla y un playbook.

## DEC-003 — Tailwind sin preflight

Tailwind debe mantener `preflight: false` para no alterar Ant Design, canvas, PDF, Moveable, Selecto ni inputs.

## DEC-004 — Baseline visual en public/img-version

Las imágenes de `public/img-version` son referencia de intención visual previa a Tailwind.

## DEC-005 — CSS de geometría no migra a Tailwind

Paper, transform, zoom, x/y/width/height, Moveable/Selecto y z-index crítico permanecen en CSS/tokens o inline controlado.
```

<a id="file-0133"></a>

### 0133 — `ai/memory/known-risks.md`

- **Lenguaje:** `markdown`
- **Líneas:** `10`
- **Tamaño original:** `0.5 KB`
- **SHA1 corto:** `5a94ec27e9`
- **Estado:** `completo`

```markdown
# Riesgos conocidos

| Riesgo | Impacto | Mitigación |
|---|---|---|
| IA carga todo el proyecto | Alto consumo de tokens | Router + context budget |
| Prompts globales | Cambios grandes y regresiones | Task-cards cerradas |
| Tailwind pisa geometry | Canvas roto | Mantener geometry legacy |
| Doble fuente CSS | Layout impredecible | Una entrada Tailwind + bridge controlado |
| Baseline visual olvidado | Rediseño accidental | `public/img-version` como referencia |
| Agentes duplican reglas | Alucinaciones/inconsistencias | Adaptadores delgados |
```

<a id="file-0134"></a>

### 0134 — `ai/memory/memory-update-protocol.md`

- **Lenguaje:** `markdown`
- **Líneas:** `29`
- **Tamaño original:** `0.6 KB`
- **SHA1 corto:** `33997c1ad5`
- **Estado:** `completo`

```markdown
# Protocolo de actualización de memoria

Actualizar memoria solo si ocurrió una decisión estable o cambio relevante.

## Cuándo actualizar

- Nueva decisión arquitectónica.
- Cambio en estructura de carpetas.
- Cambio de regla global.
- Task-card completada con impacto futuro.
- Riesgo nuevo detectado.

## Qué no guardar

- Logs transitorios.
- Errores ya corregidos sin impacto futuro.
- Preferencias temporales.
- Detalles duplicados de reportes.

## Formato

``​`md
## YYYY-MM-DD — Título
- Decisión:
- Motivo:
- Archivos afectados:
- Riesgo:
- Próxima acción:
``​`
```

<a id="file-0135"></a>

### 0135 — `ai/memory/pending-checklist.md`

- **Lenguaje:** `markdown`
- **Líneas:** `15`
- **Tamaño original:** `0.5 KB`
- **SHA1 corto:** `bbbcfe5a95`
- **Estado:** `completo`

```markdown
# Checklist pendiente

## Alta prioridad

- [ ] Instalar arquitectura `ai/` en el proyecto.
- [ ] Migrar documentación útil de `.ai/` antigua a `ai/` nueva.
- [ ] Crear task-card activa para estabilizar Tailwind post-migración.
- [ ] Generar inventario visual de `public/img-version`.
- [ ] Asegurar una sola entrada Tailwind.

## Media prioridad

- [ ] Reducir duplicidad entre `docs/`, `.ai/` y reportes.
- [ ] Crear checklist semanal de mejoras completadas.
- [ ] Crear prompts específicos por agente.
```

<a id="file-0136"></a>

### 0136 — `ai/memory/project-memory.md`

- **Lenguaje:** `markdown`
- **Líneas:** `20`
- **Tamaño original:** `0.8 KB`
- **SHA1 corto:** `61d83b8d4d`
- **Estado:** `completo`

```markdown
# Project Memory — SISAD PDFME

## Estado actual

El proyecto `sisad-pdfme` es un diseñador PDF con laboratorios bajo `src/features/pdfcomponent`, core bajo `src/sisad-pdfme`, y migración visual en progreso de CSS puro a Tailwind.

## Reglas persistentes

- `src/sisad-pdfme` es core reutilizable.
- `src/features/pdfcomponent` es host/lab.
- No mezclar lógica de negocio SISAD dentro del core.
- No tocar Moveable/Selecto/geometría sin task-card explícita.
- `public/img-version` es baseline visual para regresiones Tailwind.
- Tailwind debe tener `preflight: false`.
- `tokens.css` es fuente de verdad visual.
- Bridge Tailwind conserva classNames existentes.

## Riesgo activo

La migración Tailwind puede romper layout por doble fuente de verdad: Tailwind JSX + bridge + CSS legacy. Corregir por capas.
```

<a id="file-0137"></a>

### 0137 — `ai/memory/README.md`

- **Lenguaje:** `markdown`
- **Líneas:** `13`
- **Tamaño original:** `0.4 KB`
- **SHA1 corto:** `ac52c3150b`
- **Estado:** `completo`

```markdown
# Memoria

La memoria evita repetir decisiones y reduce tokens. Debe mantenerse corta, objetiva y actualizada.

## Tipos

- `project-memory.md`: estado general estable.
- `decisions.md`: decisiones arquitectónicas.
- `session-handoff.md`: qué continuar en la siguiente sesión.
- `changelog.md`: cambios por fecha.
- `known-risks.md`: riesgos activos.
- `completed-checklist.md`: completado verificable.
- `pending-checklist.md`: pendientes priorizados.
```

<a id="file-0138"></a>

### 0138 — `ai/memory/session-handoff.md`

- **Lenguaje:** `markdown`
- **Líneas:** `13`
- **Tamaño original:** `0.5 KB`
- **SHA1 corto:** `0e3dece9b6`
- **Estado:** `completo`

```markdown
# Session Handoff

## Último foco

Se solicitó reorganizar toda la arquitectura Markdown para IA y documentación, centralizando agentes, skills, memoria, objetivos, checklists y task-cards.

## Próximo paso sugerido

Instalar esta estructura y migrar progresivamente contenido existente desde `.ai`, `docs` y reportes hacia `ai/` evitando duplicidad.

## Atención

No eliminar documentación antigua hasta validar que sus contenidos importantes ya están referenciados o migrados.
```

<a id="file-0139"></a>

### 0139 — `ai/playbooks/pb-ai-docs-refactor.md`

- **Lenguaje:** `markdown`
- **Líneas:** `7`
- **Tamaño original:** `0.2 KB`
- **SHA1 corto:** `4d945ecb85`
- **Estado:** `completo`

```markdown
# Playbook — AI Docs Refactor

1. Inventariar documentación existente.
2. Clasificar por SRP: context/rules/playbooks/memory/task-cards.
3. Migrar sin duplicar.
4. Crear adaptadores delgados.
5. Actualizar memoria.
```

<a id="file-0140"></a>

### 0140 — `ai/playbooks/pb-canvas-multipage.md`

- **Lenguaje:** `markdown`
- **Líneas:** `6`
- **Tamaño original:** `0.2 KB`
- **SHA1 corto:** `8fc2ea38b4`
- **Estado:** `completo`

```markdown
# Playbook — Canvas Multipage

1. Buscar cálculo de page target.
2. Validar drop página 2.
3. Validar selección/move/resize página 2.
4. Validar snapshot.
```

<a id="file-0141"></a>

### 0141 — `ai/playbooks/pb-css-tailwind-migration.md`

- **Lenguaje:** `markdown`
- **Líneas:** `9`
- **Tamaño original:** `0.3 KB`
- **SHA1 corto:** `a2c148115a`
- **Estado:** `completo`

```markdown
# Playbook — CSS/Tailwind Migration

1. Confirmar baseline visual.
2. Verificar una sola entrada Tailwind.
3. Clasificar CSS: JSX, bridge, legacy, token, eliminar.
4. Migrar primero host/lab.
5. Migrar sidebars e inspector con bridge.
6. Mantener geometry legacy.
7. Validar `/lab/multi-document-routing` y `/lab/generator-runtime`.
```

<a id="file-0142"></a>

### 0142 — `ai/playbooks/pb-inspector.md`

- **Lenguaje:** `markdown`
- **Líneas:** `6`
- **Tamaño original:** `0.1 KB`
- **SHA1 corto:** `697ce25f25`
- **Estado:** `completo`

```markdown
# Playbook — Inspector

1. Identificar secciones.
2. Revisar widgets.
3. Validar commands.
4. Validar ListView/DetailView.
```

<a id="file-0143"></a>

### 0143 — `ai/playbooks/pb-schema-families.md`

- **Lenguaje:** `markdown`
- **Líneas:** `6`
- **Tamaño original:** `0.2 KB`
- **SHA1 corto:** `1fa2ea1b2c`
- **Estado:** `completo`

```markdown
# Playbook — Schema Families

1. Identificar familia.
2. Revisar plugin/render/value/inspector.
3. Validar Designer/Form/Viewer/PDF.
4. Validar snapshot.
```

<a id="file-0144"></a>

### 0144 — `ai/playbooks/pb-selection-transform.md`

- **Lenguaje:** `markdown`
- **Líneas:** `6`
- **Tamaño original:** `0.1 KB`
- **SHA1 corto:** `491e3b602a`
- **Estado:** `completo`

```markdown
# Playbook — Selection/Transform

1. Revisar target guards.
2. Excluir overlays/options/toolbar.
3. Validar shortcuts.
4. Validar Moveable root-only.
```

<a id="file-0145"></a>

### 0145 — `ai/playbooks/pb-snapshot.md`

- **Lenguaje:** `markdown`
- **Líneas:** `6`
- **Tamaño original:** `0.1 KB`
- **SHA1 corto:** `b8e5bd6f15`
- **Estado:** `completo`

```markdown
# Playbook — Snapshot

1. Identificar metadata.
2. Revisar import/export.
3. Validar roundtrip.
4. No tocar generator salvo task explícita.
```

<a id="file-0146"></a>

### 0146 — `ai/playbooks/pb-visual-regression.md`

- **Lenguaje:** `markdown`
- **Líneas:** `8`
- **Tamaño original:** `0.2 KB`
- **SHA1 corto:** `07c8625404`
- **Estado:** `completo`

```markdown
# Playbook — Visual Regression

1. Inventariar `public/img-version`.
2. Crear contact sheet.
3. Capturar estado actual.
4. Comparar intención visual.
5. Crear reporte de regresiones.
6. Corregir por componente.
```

<a id="file-0147"></a>

### 0147 — `ai/playbooks/README.md`

- **Lenguaje:** `markdown`
- **Líneas:** `3`
- **Tamaño original:** `0.1 KB`
- **SHA1 corto:** `9c0f5c1b4f`
- **Estado:** `completo`

```markdown
# Playbooks

Procedimientos. Cargar uno por task-card.
```

<a id="file-0148"></a>

### 0148 — `ai/project/architecture-principles.md`

- **Lenguaje:** `markdown`
- **Líneas:** `34`
- **Tamaño original:** `1.0 KB`
- **SHA1 corto:** `3bbdda567e`
- **Estado:** `completo`

```markdown
# Principios de arquitectura

## SOLID aplicado a documentación y código

### SRP — Single Responsibility

Cada archivo Markdown tiene una responsabilidad:

- `context`: qué saber.
- `rules`: qué no romper.
- `playbooks`: cómo ejecutar.
- `task-cards`: qué hacer ahora.
- `memory`: qué recordar.
- `reports`: qué se evidenció.

### OCP — Open/Closed

Agregar nuevos agentes, skills o task-cards sin editar archivos base. El router referencia categorías, no hardcodea todo.

### LSP — Sustitución

Codex, Claude y Copilot deben poder usar el mismo flujo con adaptadores delgados.

### ISP — Interface Segregation

No dar a todos los agentes todo el contexto. Cada agente recibe solo el contexto necesario.

### DIP — Dependency Inversion

Las instrucciones dependen de contratos (`task-card`, `rules`, `context`) y no de un modelo específico.

## Principio anti-duplicidad

No duplicar reglas en `AGENTS.md`, `CLAUDE.md` y Copilot. Esos archivos solo apuntan a `ai/start/START.md`.
```

<a id="file-0149"></a>

### 0149 — `ai/project/definition-of-done.md`

- **Lenguaje:** `markdown`
- **Líneas:** `12`
- **Tamaño original:** `0.4 KB`
- **SHA1 corto:** `ac8d73607a`
- **Estado:** `completo`

```markdown
# Definition of Done

Una task-card se considera completa cuando:

- La causa raíz está identificada.
- Los archivos modificados respetan el presupuesto.
- No se tocó un proceso fuera del alcance.
- Se preservó metadata crítica.
- Se ejecutó validación focal.
- Se registraron riesgos residuales.
- Se actualizó memoria si hubo decisión nueva.
- Se propuso nueva task-card si quedó trabajo fuera de alcance.
```

<a id="file-0150"></a>

### 0150 — `ai/project/file-ownership-map.md`

- **Lenguaje:** `markdown`
- **Líneas:** `14`
- **Tamaño original:** `0.8 KB`
- **SHA1 corto:** `d6f4d78588`
- **Estado:** `completo`

```markdown
# Mapa de propiedad de archivos

| Área | Rutas | Dueño lógico |
|---|---|---|
| Core Designer | `src/sisad-pdfme/ui/Designer.tsx`, `ui/components/Designer/**` | designer-runtime-agent |
| Canvas | `ui/components/Designer/Canvas/**` | canvas-agent |
| Moveable/Selecto | `Canvas/Moveable.tsx`, `Canvas/Selecto.tsx` | interaction-agent |
| Schemas | `src/sisad-pdfme/schemas/**` | schema-agent |
| Inspector | `RightSidebar/DetailView/**` | inspector-agent |
| ListView | `RightSidebar/ListView/**` | listview-agent |
| CSS/Tailwind | `ui/styles/**`, `src/styles/**`, `labRoutes.css` | css-tailwind-agent |
| Labs | `src/features/pdfcomponent/**` | lab-shell-agent |
| Snapshot | `shared/snapshotAdapter.ts`, metadata utils | snapshot-agent |
| AI docs | `ai/**` | docs-architecture-agent |
```

<a id="file-0151"></a>

### 0151 — `ai/project/glossary.md`

- **Lenguaje:** `markdown`
- **Líneas:** `16`
- **Tamaño original:** `0.7 KB`
- **SHA1 corto:** `9bf3d089f7`
- **Estado:** `completo`

```markdown
# Glosario

| Término | Significado |
|---|---|
| Core | Código reutilizable de `src/sisad-pdfme` |
| Host/Lab | Rutas y ejemplos bajo `src/features/pdfcomponent` |
| Schema | Campo/elemento configurable sobre PDF |
| Recipient | Usuario/destinatario propietario de campos |
| Owner color | Color asociado al recipient dueño del schema |
| Form | Runtime editable por usuario final |
| Viewer | Runtime readonly |
| Generator/PDF | Salida final sin chrome visual |
| Chrome | Decoración visual del campo o editor |
| Paper geometry | Posición, escala y dimensiones reales de página PDF |
| Task-card | Unidad mínima ejecutable por IA |
| Bridge Tailwind | CSS con `@apply` que conserva classNames existentes |
```

<a id="file-0152"></a>

### 0152 — `ai/project/goals.md`

- **Lenguaje:** `markdown`
- **Líneas:** `24`
- **Tamaño original:** `0.9 KB`
- **SHA1 corto:** `7efd77b117`
- **Estado:** `completo`

```markdown
# Objetivos del proyecto

## Objetivo general

Construir y estabilizar `sisad-pdfme` como componente diseñador PDF reutilizable, compatible con múltiples documentos, páginas, recipients, schemas estándar, runtime Form/Viewer/Generator y flujo visual tipo DocuSign sin copiar marca ni UI propietaria.

## Objetivos técnicos

- Diseñador multipágina y multidocumento confiable.
- Selección, Moveable, Selecto, shortcuts y overlays estables.
- Schemas configurables por familia.
- Inspector modular y compacto.
- Snapshot roundtrip sin pérdida de metadata.
- Migración visual CSS → Tailwind sin romper geometría.
- Separación entre core `sisad-pdfme` y laboratorios/host.
- Compatibilidad con Codex, Claude y Copilot mediante task-cards.

## Objetivos de IA

- Reducir tokens.
- Evitar loops de análisis.
- Evitar alucinaciones de archivos inexistentes.
- Mantener memoria viva y decisiones registradas.
- Dividir tareas grandes en pasos verificables.
```

<a id="file-0153"></a>

### 0153 — `ai/project/non-goals.md`

- **Lenguaje:** `markdown`
- **Líneas:** `12`
- **Tamaño original:** `0.3 KB`
- **SHA1 corto:** `e36b204d41`
- **Estado:** `completo`

```markdown
# No objetivos

No hacer por defecto:

- Reescribir el diseñador desde cero.
- Crear un segundo renderer.
- Crear un segundo snapshot.
- Crear otra implementación de Moveable/Selecto.
- Copiar DocuSign visualmente.
- Migrar toda la geometría a Tailwind.
- Cambiar reglas de negocio SISAD desde `sisad-pdfme`.
- Resolver permisos con CSS.
```

<a id="file-0154"></a>

### 0154 — `ai/project/scope.md`

- **Lenguaje:** `markdown`
- **Líneas:** `38`
- **Tamaño original:** `0.6 KB`
- **SHA1 corto:** `fcde91cbba`
- **Estado:** `completo`

```markdown
# Alcance y límites

## Dentro del alcance

``​`txt
Designer
Canvas
Schemas
LeftSidebar
RightSidebar
DetailView
ListView
Toolbar contextual
Moveable/Selecto como integración protegida
CommandBus
Snapshot designer
CSS visual / Tailwind migration
Laboratorios de ejemplo
Baselines visuales
``​`

## Fuera del alcance por defecto

``​`txt
StepOne
StepTwo host de negocio
ContentCustomForm
Uanataca
liveness
APIs SISAD
workflow externo
firma real backend
infra backend
``​`

## Contrato de compatibilidad

Form/Viewer/Generator no son foco principal, pero no deben romperse. Cualquier cambio en Designer debe preservar metadata y render compatible.
```

<a id="file-0155"></a>

### 0155 — `ai/prompts/claude-diagnose-or-implement.md`

- **Lenguaje:** `markdown`
- **Líneas:** `7`
- **Tamaño original:** `0.2 KB`
- **SHA1 corto:** `88becdf291`
- **Estado:** `completo`

```markdown
# Claude Diagnose/Implement Prompt

Modo diagnóstico: no modificar código, producir causa raíz y task-card.

Modo implementación: modificar solo archivos de la task-card, validar y reportar.

Siempre respetar contexto budget.
```

<a id="file-0156"></a>

### 0156 — `ai/prompts/codex-master-prompt.md`

- **Lenguaje:** `markdown`
- **Líneas:** `5`
- **Tamaño original:** `0.3 KB`
- **SHA1 corto:** `11b889949e`
- **Estado:** `completo`

```markdown
# Codex Master Prompt

Lee `ai/start/START.md`. Enruta con `ai/router/ROUTER.md`. Usa presupuesto de `ai/router/CONTEXT_BUDGET.md`.

Trabaja una sola task-card. Antes de editar, declara Router decision. No hagas auditoría global salvo que la task lo pida.
```

<a id="file-0157"></a>

### 0157 — `ai/prompts/copilot-task-context.md`

- **Lenguaje:** `markdown`
- **Líneas:** `11`
- **Tamaño original:** `0.2 KB`
- **SHA1 corto:** `b91e9208a8`
- **Estado:** `completo`

```markdown
# Copilot Task Context

Pega esto antes de trabajar con Copilot:

``​`txt
Tarea: <task-card>
Fuente: ai/start/START.md
No tocar Moveable/Selecto/snapshot/generator/pdf-lib.
Preservar metadata de schemas.
Cambios pequeños y focalizados.
``​`
```

<a id="file-0158"></a>

### 0158 — `ai/prompts/create-task-card.md`

- **Lenguaje:** `markdown`
- **Líneas:** `11`
- **Tamaño original:** `0.2 KB`
- **SHA1 corto:** `35dba9ed5a`
- **Estado:** `completo`

```markdown
# Prompt — Crear task-card

Convierte la petición del usuario en una task-card cerrada con:

- objetivo;
- alcance;
- archivos candidatos;
- archivos prohibidos;
- pasos;
- validación;
- criterio de parada.
```

<a id="file-0159"></a>

### 0159 — `ai/prompts/README.md`

- **Lenguaje:** `markdown`
- **Líneas:** `3`
- **Tamaño original:** `0.1 KB`
- **SHA1 corto:** `c01bdd8aad`
- **Estado:** `completo`

```markdown
# Prompts

Prompts reutilizables. No reemplazan task-cards.
```

<a id="file-0160"></a>

### 0160 — `ai/prompts/update-memory.md`

- **Lenguaje:** `markdown`
- **Líneas:** `3`
- **Tamaño original:** `0.1 KB`
- **SHA1 corto:** `12f8d1fb49`
- **Estado:** `completo`

```markdown
# Prompt — Actualizar memoria

Actualiza memoria solo si hubo decisión estable. Usa `ai/memory/memory-update-protocol.md`.
```

<a id="file-0161"></a>

### 0161 — `ai/reports/README.md`

- **Lenguaje:** `markdown`
- **Líneas:** `3`
- **Tamaño original:** `0.1 KB`
- **SHA1 corto:** `b29048ecba`
- **Estado:** `completo`

```markdown
# Reports

Guardar reportes generados por tareas. No cargar reportes históricos salvo evidencia necesaria.
```

<a id="file-0162"></a>

### 0162 — `ai/reports/report-template.md`

- **Lenguaje:** `markdown`
- **Líneas:** `10`
- **Tamaño original:** `0.1 KB`
- **SHA1 corto:** `bcbebd6b00`
- **Estado:** `completo`

```markdown
# Report Template

## Task-card
## Diagnóstico
## Evidencia
## Archivos modificados
## Cambios
## Validación
## Riesgos
## Nueva task-card
```

<a id="file-0163"></a>

### 0163 — `ai/router/CONTEXT_BUDGET.md`

- **Lenguaje:** `markdown`
- **Líneas:** `45`
- **Tamaño original:** `0.8 KB`
- **SHA1 corto:** `cdb52f770b`
- **Estado:** `completo`

```markdown
# CONTEXT_BUDGET

## Presupuesto estándar

``​`txt
1 task-card
1 contexto
1 regla principal
1 playbook
2-3 comandos rg
8 archivos abiertos
5 archivos modificados
1 proceso por pasada
``​`

## Presupuesto extendido

Solo para auditorías explícitas pedidas por el usuario:

``​`txt
1 auditoría
máximo 20 archivos inspeccionados
máximo 0-3 archivos modificados
reporte obligatorio
sin cambios de lógica
``​`

## Criterio de parada

Detenerse si:

- se requiere tocar otro dominio;
- se exceden 5 archivos modificados;
- se necesita `Moveable`, `Selecto`, snapshot o generator sin task-card;
- no hay evidencia suficiente;
- un archivo buscado no existe.

## Anti-token

No cargar:

- todo `codigo-sisad-pdfme.txt`;
- todos los markdown;
- todos los CSS completos si solo se toca un selector;
- reportes históricos salvo evidencia necesaria.
```

<a id="file-0164"></a>

### 0164 — `ai/router/ROUTER.md`

- **Lenguaje:** `markdown`
- **Líneas:** `27`
- **Tamaño original:** `1.2 KB`
- **SHA1 corto:** `b15fc986ff`
- **Estado:** `completo`

```markdown
# ROUTER — Selección de task-card

## Tabla de enrutamiento

| Señal del usuario | Task-card sugerida | Contexto | Regla | Playbook |
|---|---|---|---|---|
| Tailwind, CSS, diseño, visual | TASK-CSS-* | css-tailwind-context | css-migration-rules | pb-css-tailwind-migration |
| Baseline visual, screenshots | TASK-VISUAL-* | visual-baseline-context | visual-regression-rules | pb-visual-regression |
| Página 2, multipágina, coordenadas | TASK-CANVAS-* | canvas-multipage-context | canvas-rules | pb-canvas-multipage |
| Selección, mover, resize, rotate | TASK-INTERACTION-* | selection-transform-context | moveable-selecto-rules | pb-selection-transform |
| checkboxGroup/radioGroup/select | TASK-SCHEMA-* | schema-families-context | schema-rules | pb-schema-families |
| DetailView/ListView/Inspector | TASK-INSPECTOR-* | inspector-context | inspector-rules | pb-inspector |
| Snapshot/import/export | TASK-SNAPSHOT-* | snapshot-context | snapshot-rules | pb-snapshot |
| Memoria/documentación IA | TASK-DOCS-* | ai-docs-context | ai-docs-rules | pb-ai-docs-refactor |

## Resultado requerido antes de editar

``​`md
## Router decision
- Task-card:
- Contexto:
- Regla:
- Playbook:
- Archivos candidatos:
- Archivos prohibidos:
- Presupuesto:
``​`
```

<a id="file-0165"></a>

### 0165 — `ai/router/TASK_INTAKE.md`

- **Lenguaje:** `markdown`
- **Líneas:** `15`
- **Tamaño original:** `0.4 KB`
- **SHA1 corto:** `d006b1ade0`
- **Estado:** `completo`

```markdown
# TASK INTAKE — Plantilla para entender una petición

## Preguntas internas

1. ¿Qué proceso toca?
2. ¿Es bug, diseño, refactor, migración o documentación?
3. ¿Cuál es la evidencia?
4. ¿Qué archivos candidatos existen?
5. ¿Qué archivos están prohibidos?
6. ¿Qué metadata no se puede perder?
7. ¿Qué validación mínima prueba el cambio?

## Salida

Crear o seleccionar task-card.
```

<a id="file-0166"></a>

### 0166 — `ai/rules/ai-docs-rules.md`

- **Lenguaje:** `markdown`
- **Líneas:** `6`
- **Tamaño original:** `0.2 KB`
- **SHA1 corto:** `e52914eba1`
- **Estado:** `completo`

```markdown
# AI Docs Rules

- No duplicar instrucciones entre adaptadores.
- `ai/` es fuente de verdad.
- Memoria debe ser corta, verificable y útil.
- Cada archivo Markdown tiene única responsabilidad.
```

<a id="file-0167"></a>

### 0167 — `ai/rules/canvas-rules.md`

- **Lenguaje:** `markdown`
- **Líneas:** `3`
- **Tamaño original:** `0.1 KB`
- **SHA1 corto:** `b8b492add4`
- **Estado:** `completo`

```markdown
# Canvas Rules

No usar `pages[0]`, `pageNumber || 1`, ni query selector del primer paper para operaciones multipágina. Siempre resolver página real.
```

<a id="file-0168"></a>

### 0168 — `ai/rules/css-migration-rules.md`

- **Lenguaje:** `markdown`
- **Líneas:** `8`
- **Tamaño original:** `0.3 KB`
- **SHA1 corto:** `e3a14cffa5`
- **Estado:** `completo`

```markdown
# CSS Migration Rules

- Tailwind `preflight: false`.
- Una entrada Tailwind.
- `tokens.css` se conserva.
- Geometry, transform, zoom, paper, z-index crítico y Moveable/Selecto no se migran a utilidades Tailwind.
- Bridge conserva classNames existentes.
- Usar `public/img-version` para baseline.
```

<a id="file-0169"></a>

### 0169 — `ai/rules/global-rules.md`

- **Lenguaje:** `markdown`
- **Líneas:** `7`
- **Tamaño original:** `0.2 KB`
- **SHA1 corto:** `5b90db1367`
- **Estado:** `completo`

```markdown
# Global Rules

- No tocar negocio externo por defecto.
- No duplicar arquitectura.
- No crear `any` nuevo.
- No asumir archivos inexistentes.
- No cargar todo el proyecto.
```

<a id="file-0170"></a>

### 0170 — `ai/rules/inspector-rules.md`

- **Lenguaje:** `markdown`
- **Líneas:** `3`
- **Tamaño original:** `0.1 KB`
- **SHA1 corto:** `5b0775e76b`
- **Estado:** `completo`

```markdown
# Inspector Rules

Widgets no mutan schemas directamente. Usar command/update centralizado.
```

<a id="file-0171"></a>

### 0171 — `ai/rules/moveable-selecto-rules.md`

- **Lenguaje:** `markdown`
- **Líneas:** `5`
- **Tamaño original:** `0.2 KB`
- **SHA1 corto:** `5b2b00215c`
- **Estado:** `completo`

```markdown
# Moveable/Selecto Rules

- Selecto solo roots `[data-schema-id]`.
- Excluir `[data-option-id]`, `[data-role="group-add-option"]`, inputs, toolbar y controles Moveable.
- No resolver hit-testing con z-index.
```

<a id="file-0172"></a>

### 0172 — `ai/rules/README.md`

- **Lenguaje:** `markdown`
- **Líneas:** `3`
- **Tamaño original:** `0.1 KB`
- **SHA1 corto:** `c368a81ce2`
- **Estado:** `completo`

```markdown
# Rules

Reglas duras. Cargar solo la regla principal de la task-card.
```

<a id="file-0173"></a>

### 0173 — `ai/rules/schema-rules.md`

- **Lenguaje:** `markdown`
- **Líneas:** `3`
- **Tamaño original:** `0.1 KB`
- **SHA1 corto:** `63343cb73b`
- **Estado:** `completo`

```markdown
# Schema Rules

Preservar schemaUid, documentId, pageNumber, ownerRecipientId, colors, groupId, optionId, selected values, options y `__designer`.
```

<a id="file-0174"></a>

### 0174 — `ai/rules/snapshot-rules.md`

- **Lenguaje:** `markdown`
- **Líneas:** `3`
- **Tamaño original:** `0.1 KB`
- **SHA1 corto:** `a9cb230906`
- **Estado:** `completo`

```markdown
# Snapshot Rules

No crear snapshot paralelo. No perder metadata. Todo roundtrip debe conservar el modelo.
```

<a id="file-0175"></a>

### 0175 — `ai/skills/canvas-multipage-skill.md`

- **Lenguaje:** `markdown`
- **Líneas:** `29`
- **Tamaño original:** `0.4 KB`
- **SHA1 corto:** `12598b28b2`
- **Estado:** `completo`

```markdown
# Canvas Multipage Skill

## Objetivo

Validar drop, selección, move, resize y snapshot en páginas 2+.

## Entradas

- Task-card activa.
- Contexto focal.
- Regla del dominio.
- Archivos candidatos.

## Pasos

1. Confirmar alcance.
2. Buscar evidencia con `rg`.
3. Clasificar riesgos.
4. Implementar cambio mínimo.
5. Validar.
6. Reportar.

## Salida

``​`md
## Cambios
## Validación
## Riesgos
``​`
```

<a id="file-0176"></a>

### 0176 — `ai/skills/inspector-skill.md`

- **Lenguaje:** `markdown`
- **Líneas:** `29`
- **Tamaño original:** `0.4 KB`
- **SHA1 corto:** `65a96616a9`
- **Estado:** `completo`

```markdown
# Inspector Skill

## Objetivo

Mejorar DetailView/ListView sin romper CommandBus.

## Entradas

- Task-card activa.
- Contexto focal.
- Regla del dominio.
- Archivos candidatos.

## Pasos

1. Confirmar alcance.
2. Buscar evidencia con `rg`.
3. Clasificar riesgos.
4. Implementar cambio mínimo.
5. Validar.
6. Reportar.

## Salida

``​`md
## Cambios
## Validación
## Riesgos
``​`
```

<a id="file-0177"></a>

### 0177 — `ai/skills/memory-update-skill.md`

- **Lenguaje:** `markdown`
- **Líneas:** `29`
- **Tamaño original:** `0.4 KB`
- **SHA1 corto:** `366cba8f07`
- **Estado:** `completo`

```markdown
# Memory Update Skill

## Objetivo

Actualizar memoria con decisiones útiles.

## Entradas

- Task-card activa.
- Contexto focal.
- Regla del dominio.
- Archivos candidatos.

## Pasos

1. Confirmar alcance.
2. Buscar evidencia con `rg`.
3. Clasificar riesgos.
4. Implementar cambio mínimo.
5. Validar.
6. Reportar.

## Salida

``​`md
## Cambios
## Validación
## Riesgos
``​`
```

<a id="file-0178"></a>

### 0178 — `ai/skills/moveable-selecto-skill.md`

- **Lenguaje:** `markdown`
- **Líneas:** `29`
- **Tamaño original:** `0.4 KB`
- **SHA1 corto:** `552c697266`
- **Estado:** `completo`

```markdown
# Moveable Selecto Skill

## Objetivo

Proteger targets, guards, overlays y shortcuts.

## Entradas

- Task-card activa.
- Contexto focal.
- Regla del dominio.
- Archivos candidatos.

## Pasos

1. Confirmar alcance.
2. Buscar evidencia con `rg`.
3. Clasificar riesgos.
4. Implementar cambio mínimo.
5. Validar.
6. Reportar.

## Salida

``​`md
## Cambios
## Validación
## Riesgos
``​`
```

<a id="file-0179"></a>

### 0179 — `ai/skills/option-groups-skill.md`

- **Lenguaje:** `markdown`
- **Líneas:** `29`
- **Tamaño original:** `0.4 KB`
- **SHA1 corto:** `8a6936b3ca`
- **Estado:** `completo`

```markdown
# Option Groups Skill

## Objetivo

Gestionar checkboxGroup/radioGroup/select y botón +.

## Entradas

- Task-card activa.
- Contexto focal.
- Regla del dominio.
- Archivos candidatos.

## Pasos

1. Confirmar alcance.
2. Buscar evidencia con `rg`.
3. Clasificar riesgos.
4. Implementar cambio mínimo.
5. Validar.
6. Reportar.

## Salida

``​`md
## Cambios
## Validación
## Riesgos
``​`
```

<a id="file-0180"></a>

### 0180 — `ai/skills/prompting-skill.md`

- **Lenguaje:** `markdown`
- **Líneas:** `29`
- **Tamaño original:** `0.4 KB`
- **SHA1 corto:** `d464c75fe4`
- **Estado:** `completo`

```markdown
# Prompting Skill

## Objetivo

Diseñar prompts/task-cards de bajo consumo de tokens.

## Entradas

- Task-card activa.
- Contexto focal.
- Regla del dominio.
- Archivos candidatos.

## Pasos

1. Confirmar alcance.
2. Buscar evidencia con `rg`.
3. Clasificar riesgos.
4. Implementar cambio mínimo.
5. Validar.
6. Reportar.

## Salida

``​`md
## Cambios
## Validación
## Riesgos
``​`
```

<a id="file-0181"></a>

### 0181 — `ai/skills/README.md`

- **Lenguaje:** `markdown`
- **Líneas:** `3`
- **Tamaño original:** `0.1 KB`
- **SHA1 corto:** `ae3dd5bc05`
- **Estado:** `completo`

```markdown
# Skills

Skills son procedimientos reutilizables. Cada skill describe entradas, pasos y salida esperada.
```

<a id="file-0182"></a>

### 0182 — `ai/skills/snapshot-safety-skill.md`

- **Lenguaje:** `markdown`
- **Líneas:** `29`
- **Tamaño original:** `0.4 KB`
- **SHA1 corto:** `d07842165a`
- **Estado:** `completo`

```markdown
# Snapshot Safety Skill

## Objetivo

Preservar metadata en import/export/roundtrip.

## Entradas

- Task-card activa.
- Contexto focal.
- Regla del dominio.
- Archivos candidatos.

## Pasos

1. Confirmar alcance.
2. Buscar evidencia con `rg`.
3. Clasificar riesgos.
4. Implementar cambio mínimo.
5. Validar.
6. Reportar.

## Salida

``​`md
## Cambios
## Validación
## Riesgos
``​`
```

<a id="file-0183"></a>

### 0183 — `ai/skills/tailwind-migration-skill.md`

- **Lenguaje:** `markdown`
- **Líneas:** `29`
- **Tamaño original:** `0.4 KB`
- **SHA1 corto:** `46a4de90f8`
- **Estado:** `completo`

```markdown
# Tailwind Migration Skill

## Objetivo

Migrar CSS puro a Tailwind por capas sin afectar geometría.

## Entradas

- Task-card activa.
- Contexto focal.
- Regla del dominio.
- Archivos candidatos.

## Pasos

1. Confirmar alcance.
2. Buscar evidencia con `rg`.
3. Clasificar riesgos.
4. Implementar cambio mínimo.
5. Validar.
6. Reportar.

## Salida

``​`md
## Cambios
## Validación
## Riesgos
``​`
```

<a id="file-0184"></a>

### 0184 — `ai/skills/visual-regression-skill.md`

- **Lenguaje:** `markdown`
- **Líneas:** `29`
- **Tamaño original:** `0.4 KB`
- **SHA1 corto:** `0024fde237`
- **Estado:** `completo`

```markdown
# Visual Regression Skill

## Objetivo

Usar public/img-version como baseline y comparar visualmente.

## Entradas

- Task-card activa.
- Contexto focal.
- Regla del dominio.
- Archivos candidatos.

## Pasos

1. Confirmar alcance.
2. Buscar evidencia con `rg`.
3. Clasificar riesgos.
4. Implementar cambio mínimo.
5. Validar.
6. Reportar.

## Salida

``​`md
## Cambios
## Validación
## Riesgos
``​`
```

<a id="file-0185"></a>

### 0185 — `ai/start/QUICKSTART-CLAUDE.md`

- **Lenguaje:** `markdown`
- **Líneas:** `15`
- **Tamaño original:** `0.4 KB`
- **SHA1 corto:** `ed2809f6a5`
- **Estado:** `completo`

```markdown
# Quickstart — Claude

Claude tiende a analizar ampliamente. Este proyecto exige foco.

## Regla principal

Claude debe responder primero con la decisión de router y no con un plan global.

## Modo diagnóstico

Usar `ai/prompts/claude-diagnose-or-implement.md` en modo `diagnose-only` cuando el usuario pida análisis.

## Modo implementación

Usar una sola task-card. No mezclar Tailwind, schemas, canvas, runtime y snapshot en la misma pasada.
```

<a id="file-0186"></a>

### 0186 — `ai/start/QUICKSTART-CODEX.md`

- **Lenguaje:** `markdown`
- **Líneas:** `34`
- **Tamaño original:** `0.7 KB`
- **SHA1 corto:** `e11f67a97b`
- **Estado:** `completo`

```markdown
# Quickstart — Codex

Codex puede procesar prompts largos, pero debe trabajar con contexto controlado.

## Comando mental obligatorio

``​`txt
No revises todo. Enruta, selecciona task-card, inspecciona con rg y modifica poco.
``​`

## Flujo

1. Leer `ai/start/START.md`.
2. Leer `ai/router/ROUTER.md`.
3. Leer `ai/router/CONTEXT_BUDGET.md`.
4. Elegir una task-card.
5. Ejecutar máximo 2-3 búsquedas `rg`.
6. Abrir máximo 8 archivos.
7. Modificar máximo 5 archivos.
8. Ejecutar build/tests focales.
9. Actualizar memoria si hubo decisión.

## Formato de entrega

``​`md
# Resultado
## Task-card ejecutada
## Diagnóstico
## Archivos modificados
## Cambios
## Validación
## Riesgos
## Nueva task-card
``​`
```

<a id="file-0187"></a>

### 0187 — `ai/start/QUICKSTART-COPILOT.md`

- **Lenguaje:** `markdown`
- **Líneas:** `18`
- **Tamaño original:** `0.4 KB`
- **SHA1 corto:** `25c1d20639`
- **Estado:** `completo`

```markdown
# Quickstart — GitHub Copilot

Copilot funciona mejor con reglas cortas y archivos cercanos.

## Antes de usar Copilot Chat

Pega este contexto mínimo:

``​`txt
Fuente de verdad: ai/start/START.md.
Tarea actual: ai/task-cards/active/<task>.md.
No tocar Moveable/Selecto/snapshot/generator/pdf-lib.
Preservar metadata de schemas.
``​`

## Archivos puente

`.github/copilot-instructions.md` solo debe apuntar a esta carpeta y contener restricciones mínimas.
```

<a id="file-0188"></a>

### 0188 — `ai/start/START.md`

- **Lenguaje:** `markdown`
- **Líneas:** `76`
- **Tamaño original:** `1.2 KB`
- **SHA1 corto:** `9ec0f5b2de`
- **Estado:** `completo`

```markdown
# START — Entrada única para cualquier asistente IA

Antes de modificar código, sigue este flujo.

## 1. Identifica el tipo de tarea

Usa:

``​`txt
ai/router/ROUTER.md
``​`

## 2. Aplica presupuesto

Usa:

``​`txt
ai/router/CONTEXT_BUDGET.md
``​`

## 3. Carga memoria mínima

Usa:

``​`txt
ai/memory/project-memory.md
ai/memory/decisions.md
ai/memory/session-handoff.md
``​`

## 4. Selecciona solo una task-card

Usa:

``​`txt
ai/task-cards/active/<task>.md
``​`

Si no existe, créala desde:

``​`txt
ai/templates/task-card-template.md
``​`

## 5. Carga contexto, regla y playbook focal

Ejemplo para migración Tailwind visual:

``​`txt
context/css-tailwind-context.md
rules/css-migration-rules.md
playbooks/pb-css-tailwind-migration.md
``​`

## 6. Declara antes de editar

``​`md
## Router decision
- Task-card:
- Contexto:
- Regla:
- Playbook:
- Archivos candidatos:
- Archivos prohibidos:
- Presupuesto:
``​`

## 7. Criterio de parada

Detente si necesitas:

- más de 5 archivos modificados;
- más de 8 archivos abiertos;
- tocar un proceso distinto;
- tocar `Moveable`, `Selecto`, snapshot, generator o pdf-lib sin task-card explícita;
- resolver por CSS un problema de permisos, metadata o geometría.
```

<a id="file-0189"></a>

### 0189 — `ai/subagents/anti-hallucination-reviewer.md`

- **Lenguaje:** `markdown`
- **Líneas:** `13`
- **Tamaño original:** `0.3 KB`
- **SHA1 corto:** `d230715996`
- **Estado:** `completo`

```markdown
# Anti Hallucination Reviewer

## Propósito

Verifica rutas, fuentes y supuestos antes de responder.

## Uso recomendado

Invocar dentro de una task-card cuando el agente principal necesite validación especializada.

## Restricción

No modificar código por sí solo. Debe apoyar al agente principal.
```

<a id="file-0190"></a>

### 0190 — `ai/subagents/baseline-visual-critic.md`

- **Lenguaje:** `markdown`
- **Líneas:** `13`
- **Tamaño original:** `0.3 KB`
- **SHA1 corto:** `37394993a3`
- **Estado:** `completo`

```markdown
# Baseline Visual Critic

## Propósito

Compara screenshots actuales contra public/img-version y detecta regresiones.

## Uso recomendado

Invocar dentro de una task-card cuando el agente principal necesite validación especializada.

## Restricción

No modificar código por sí solo. Debe apoyar al agente principal.
```

<a id="file-0191"></a>

### 0191 — `ai/subagents/code-docs-writer.md`

- **Lenguaje:** `markdown`
- **Líneas:** `13`
- **Tamaño original:** `0.3 KB`
- **SHA1 corto:** `3119370085`
- **Estado:** `completo`

```markdown
# Code Docs Writer

## Propósito

Documenta código y procesos sin duplicar instrucciones.

## Uso recomendado

Invocar dentro de una task-card cuando el agente principal necesite validación especializada.

## Restricción

No modificar código por sí solo. Debe apoyar al agente principal.
```

<a id="file-0192"></a>

### 0192 — `ai/subagents/css-auditor.md`

- **Lenguaje:** `markdown`
- **Líneas:** `13`
- **Tamaño original:** `0.3 KB`
- **SHA1 corto:** `35548eaf33`
- **Estado:** `completo`

```markdown
# Css Auditor

## Propósito

Clasifica reglas CSS en JSX Tailwind, bridge, legacy, tokenizar o eliminar.

## Uso recomendado

Invocar dentro de una task-card cuando el agente principal necesite validación especializada.

## Restricción

No modificar código por sí solo. Debe apoyar al agente principal.
```

<a id="file-0193"></a>

### 0193 — `ai/subagents/legacy-css-guardian.md`

- **Lenguaje:** `markdown`
- **Líneas:** `13`
- **Tamaño original:** `0.3 KB`
- **SHA1 corto:** `78fc351432`
- **Estado:** `completo`

```markdown
# Legacy Css Guardian

## Propósito

Impide borrar geometry, tokens, paper, Moveable/Selecto y PDF rules.

## Uso recomendado

Invocar dentro de una task-card cuando el agente principal necesite validación especializada.

## Restricción

No modificar código por sí solo. Debe apoyar al agente principal.
```

<a id="file-0194"></a>

### 0194 — `ai/subagents/memory-curator.md`

- **Lenguaje:** `markdown`
- **Líneas:** `13`
- **Tamaño original:** `0.3 KB`
- **SHA1 corto:** `806d5e0f68`
- **Estado:** `completo`

```markdown
# Memory Curator

## Propósito

Actualiza memoria y decisiones sin guardar ruido.

## Uso recomendado

Invocar dentro de una task-card cuando el agente principal necesite validación especializada.

## Restricción

No modificar código por sí solo. Debe apoyar al agente principal.
```

<a id="file-0195"></a>

### 0195 — `ai/subagents/prompt-engineer.md`

- **Lenguaje:** `markdown`
- **Líneas:** `13`
- **Tamaño original:** `0.3 KB`
- **SHA1 corto:** `4b67b6eb29`
- **Estado:** `completo`

```markdown
# Prompt Engineer

## Propósito

Convierte peticiones amplias en task-cards ejecutables.

## Uso recomendado

Invocar dentro de una task-card cuando el agente principal necesite validación especializada.

## Restricción

No modificar código por sí solo. Debe apoyar al agente principal.
```

<a id="file-0196"></a>

### 0196 — `ai/subagents/README.md`

- **Lenguaje:** `markdown`
- **Líneas:** `3`
- **Tamaño original:** `0.1 KB`
- **SHA1 corto:** `1c4930a3aa`
- **Estado:** `completo`

```markdown
# Subagents

Los subagentes son apoyo especializado. No son dueños de procesos completos.
```

<a id="file-0197"></a>

### 0197 — `ai/subagents/regression-tester.md`

- **Lenguaje:** `markdown`
- **Líneas:** `13`
- **Tamaño original:** `0.3 KB`
- **SHA1 corto:** `29944ce9f5`
- **Estado:** `completo`

```markdown
# Regression Tester

## Propósito

Diseña validación focal y checklists manuales.

## Uso recomendado

Invocar dentro de una task-card cuando el agente principal necesite validación especializada.

## Restricción

No modificar código por sí solo. Debe apoyar al agente principal.
```

<a id="file-0198"></a>

### 0198 — `ai/subagents/tailwind-migrator.md`

- **Lenguaje:** `markdown`
- **Líneas:** `13`
- **Tamaño original:** `0.3 KB`
- **SHA1 corto:** `83e0c6bcd5`
- **Estado:** `completo`

```markdown
# Tailwind Migrator

## Propósito

Aplica clases Tailwind solo en componentes seguros.

## Uso recomendado

Invocar dentro de una task-card cuando el agente principal necesite validación especializada.

## Restricción

No modificar código por sí solo. Debe apoyar al agente principal.
```

<a id="file-0199"></a>

### 0199 — `ai/task-cards/README.md`

- **Lenguaje:** `markdown`
- **Líneas:** `11`
- **Tamaño original:** `0.2 KB`
- **SHA1 corto:** `462e0a9187`
- **Estado:** `completo`

```markdown
# Task Cards

Las task-cards son unidades cerradas. Una ejecución IA debe trabajar sobre una sola task-card.

## Carpetas

``​`txt
active/     tareas en curso
backlog/    tareas propuestas
completed/  tareas completadas
``​`
```

<a id="file-0200"></a>

### 0200 — `ai/templates/agent-template.md`

- **Lenguaje:** `markdown`
- **Líneas:** `7`
- **Tamaño original:** `0.1 KB`
- **SHA1 corto:** `8617592eba`
- **Estado:** `completo`

```markdown
# Agent Name

## Responsabilidad
## Puede tocar
## No puede tocar
## Contexto requerido
## Salida esperada
```

<a id="file-0201"></a>

### 0201 — `ai/templates/checklist-template.md`

- **Lenguaje:** `markdown`
- **Líneas:** `5`
- **Tamaño original:** `0.1 KB`
- **SHA1 corto:** `cbafdb655c`
- **Estado:** `completo`

```markdown
# Checklist

- [ ] Punto 1
- [ ] Punto 2
- [ ] Validación
```

<a id="file-0202"></a>

### 0202 — `ai/templates/decision-template.md`

- **Lenguaje:** `markdown`
- **Líneas:** `7`
- **Tamaño original:** `0.1 KB`
- **SHA1 corto:** `dbc94b6065`
- **Estado:** `completo`

```markdown
# DEC-XXX — Título

## Decisión
## Motivo
## Alternativas
## Riesgos
## Consecuencias
```

<a id="file-0203"></a>

### 0203 — `ai/templates/memory-update-template.md`

- **Lenguaje:** `markdown`
- **Líneas:** `7`
- **Tamaño original:** `0.1 KB`
- **SHA1 corto:** `72745ea4dd`
- **Estado:** `completo`

```markdown
## YYYY-MM-DD — Título

- Decisión:
- Motivo:
- Archivos afectados:
- Riesgo:
- Próxima acción:
```

<a id="file-0204"></a>

### 0204 — `ai/templates/README.md`

- **Lenguaje:** `markdown`
- **Líneas:** `3`
- **Tamaño original:** `0.1 KB`
- **SHA1 corto:** `d6fcb2dc12`
- **Estado:** `completo`

```markdown
# Templates

Plantillas para extender la arquitectura sin duplicar estilo.
```

<a id="file-0205"></a>

### 0205 — `ai/templates/skill-template.md`

- **Lenguaje:** `markdown`
- **Líneas:** `7`
- **Tamaño original:** `0.1 KB`
- **SHA1 corto:** `4a4c617a39`
- **Estado:** `completo`

```markdown
# Skill Name

## Objetivo
## Entradas
## Procedimiento
## Validación
## Salida
```

<a id="file-0206"></a>

### 0206 — `ai/templates/task-card-template.md`

- **Lenguaje:** `markdown`
- **Líneas:** `11`
- **Tamaño original:** `0.2 KB`
- **SHA1 corto:** `1daacb0946`
- **Estado:** `completo`

```markdown
# TASK-XXX — Título

## Objetivo
## Alcance
## Fuera de alcance
## Archivos candidatos
## Archivos prohibidos
## Pasos
## Validación
## Criterio de parada
## Entrega final
```

<a id="file-0207"></a>

### 0207 — `reports/tailwind-migration/baseline-regression-audit.md`

- **Lenguaje:** `markdown`
- **Líneas:** `27`
- **Tamaño original:** `5.2 KB`
- **SHA1 corto:** `afb07eaabc`
- **Estado:** `completo`

```markdown
# Baseline regression audit

| Componente | Imagen baseline usada | Diseño antes de Tailwind | Estado actual | Regresión detectada | Causa probable | Acción |
|---|---|---|---|---|---|---|
| Tailwind infrastructure | `4.47.10` + current screenshots | Una sola fuente visual, sin doble emisión | Ya unificado alrededor de `src/styles/tailwind.css` | Riesgo de duplicidad histórica resuelto | `style.css` y `tailwind.css` competían | Mantener una sola entrada y `preflight:false` |
| Lab shell | `4.47.10` | Shell ligero, paneles flotantes, PDF protagonista | Compacto y limpio en ruta actual | Menor consumo de alto y más aire útil | Host shell había encajonado el canvas | Conservar `canvas-first` y evitar card grande |
| PageHeader | `4.47.10` | Barra compacta, sin bloque técnico pesado | Se redujo y el botón textual se retiró | Residuo de densidad en el command center | `PopoverMenu` label y header action stack | Mantener icon-only en canvas-first |
| PdfmeLabPage | `4.47.10` / `4.47.21` | Canvas sin card pesada, grid claro | Restaurado a layout de máximo espacio | Regresión histórica de `min-h`/card visual | Wrappers Tailwind alrededor del shell | Mantener `height:100dvh` + `min-height:0` |
| ResultsPanel | `4.47.44` / `4.48.22` | panel auxiliar discreto | Drawer compacto abajo a la izquierda | Antes competía con el lado derecho | Drawer fixed grande | Mantener `max-height: min(300px, 38dvh)` y pill pequeña |
| LeftSidebar | `4.47.10` | Panel flotante blanco, categorías claras, cards densas | Muy cercano al baseline | Algunas etiquetas largas aún quedan al límite | Sidebar compact demasiado estrecha | Conservar compact mode y revisar labels solo si vuelve a truncar |
| LeftSidebar tabs/search | `4.47.10` | Pills, search compacta, filtros rápidos | Se mantiene compacto | Sin regresión grave visible | Densidad correcta ya aplicada | Mantener paddings y alturas reducidas |
| LeftSidebar groups/cards | `4.47.10` / `4.47.38` | Títulos uppercase, counts, cards de campo suaves | Denso y usable | Riesgo de truncado en categorías largas | `ellipsis` + ancho reducido | Ajustar solo si la vista vuelve a cortar texto |
| Canvas shell | `4.47.10` | Grilla clara, PDF centrado, rulers oscuros | Preservado en la ruta actual | Regresión previa de overflow y wrappers | Tailwind directo sobre canvas | Mantener CSS legacy para geometría/scroll |
| PDF paper area | `4.47.10` / `4.47.38` | Documento centrado con campos celestes y borde punteado | Se ve correcto | Ninguna nueva regresión fuerte | Contenedores host reducidos | No tocar geometry ni transform |
| Field chrome | `4.47.21` / `4.47.30` | Campos con borde punteado azul y selección clara | Se conserva | Ninguna crítica nueva | CSS legacy + runtime siguen activos | Mantener visual skin, no geométrico |
| Selected schema chrome | `4.47.30` / `4.48.15` | Handles azules, marca central, toolbar pequeña | Sigue visible y compacta | Menor invasión visual que antes | Overlay/toolbar compactados | Mantener overlays ligeros |
| Context toolbar | `4.47.30` / `4.48.07` | Toolbar flotante compacta | Compacta pero aún sensible | Podía crecer demasiado con Tailwind | Padding/shadow excesivos en overlays | Mantener reducciones en `SelectionContextToolbar` |
| Bottom toolbar / zoom | `4.47.10` | Control bar inferior centrada y pequeña | Preservada | Regresión menor cuando se expandía en compact mode | Densidad y controles adicionales | Mantener versiones compactas de page nav/zoom |
| Page navigator | `4.47.10` | Control centrado flotante | Sigue presente | Sin regresión importante | Shell compacto correcto | Mantener tamaño reducido |
| RightSidebar tabs | `4.47.10` / `4.47.44` / `4.48.22` | Cápsulas compactas y claras | Se mantiene consistente | Algunas vistas podían quedar apretadas | Espaciado excesivo o panel ancho | Conservar densidad del layout y tabs icon-first |
| Documents panel | `4.47.52` / `4.48.22` | Lista clara de documentos cargados | Coincide bastante | Sin regresión grave | Layout correcto | Mantener cards y rows compactos |
| Comments panel | `4.47.44` | Empty state simple y legible | Coincide con la intención | Sin regresión grave | Panel correcto | Mantener texto breve y aire moderado |
| ListView | `4.47.10` / `4.47.52` | Filas compactas con iconos y estado | Mejorada respecto al estado roto | Puede truncar si el ancho baja demasiado | Densidad de rows + sidebar ancho | Mantener filas 44-52px aprox. |
| DetailView | `4.47.21` / `4.47.58` | Cards por sección: identidad, caja, apariencia, comportamiento | Preservado y compacto | Menor tensión visual que antes | Compactación de inspector | Mantener secciones y botones pequeños |
| Position/alignment controls | `4.47.58` | Botones cuadrados compactos | Correcto | Sin regresión crítica | Layout del inspector ya reduce aire | No migrar geometría a Tailwind |
| Option groups | `4.47.10` / `4.48.15` | Selection chrome y menus pequeños | Correcto | Riesgo histórico de toolbar grande | Overlays demasiado densos | Mantener micro-overlays y tokens |
| Runtime Form | `public/img-version` no aporta evidencia directa | Layout de formulario limpio y protagonista | Ruta actual no se rompió | Riesgo indirecto por wrappers del host | Host lab puede influir en viewport | Validar en `/lab/generator-runtime` |
```

<a id="file-0208"></a>

### 0208 — `reports/tailwind-migration/img-version-baseline-inventory.md`

- **Lenguaje:** `markdown`
- **Líneas:** `14`
- **Tamaño original:** `2.6 KB`
- **SHA1 corto:** `2784331fc8`
- **Estado:** `completo`

```markdown
# Baseline visual inventory

| Imagen | Componente o vista inferida | Elementos visibles | Observaciones |
|---|---|---|---|
| `public/img-version/Captura de pantalla 2026-07-08 a la(s) 4.47.10 p. m..jpg` | `MULTI_DOCUMENT` | LeftSidebar, canvas, right sidebar list, page navigator, bottom control bar, field chrome | Baseline principal del editor multidocumento. Paneles blancos flotantes, PDF centrado y denso. |
| `public/img-version/Captura de pantalla 2026-07-08 a la(s) 4.47.21 p. m..jpg` | `RIGHT_SIDEBAR_DETAIL` | LeftSidebar, canvas, right sidebar inspector, selection chrome, floating action buttons | Inspector compacto con secciones redondeadas y jerarquía clara. |
| `public/img-version/Captura de pantalla 2026-07-08 a la(s) 4.47.30 p. m..jpg` | `RIGHT_SIDEBAR_DETAIL` | LeftSidebar, canvas, selected field chrome, inspector sections, floating action toolbar | Muestra selección activa con toolbar contextual compacta. |
| `public/img-version/Captura de pantalla 2026-07-08 a la(s) 4.47.38 p. m..jpg` | `RIGHT_SIDEBAR_DETAIL` | LeftSidebar, canvas, selected field chrome, inspector cards, page navigator | Refuerza la intención de PDF protagonista y panel de detalle liviano. |
| `public/img-version/Captura de pantalla 2026-07-08 a la(s) 4.47.44 p. m..jpg` | `RIGHT_SIDEBAR_COMMENTS` | LeftSidebar, canvas, comments tab, empty comments state | Comentarios vacíos con copy breve y layout limpio. |
| `public/img-version/Captura de pantalla 2026-07-08 a la(s) 4.47.52 p. m..jpg` | `RIGHT_SIDEBAR_DOCUMENTS` | LeftSidebar, canvas, documents tab, document cards, upload control | Lista de documentos cargados con cards compactas. |
| `public/img-version/Captura de pantalla 2026-07-08 a la(s) 4.47.58 p. m..jpg` | `RIGHT_SIDEBAR_DETAIL` | LeftSidebar, canvas, inspector, identity card, box controls, alignment controls | Inspector de detalle con cards por sección y botones cuadrados compactos. |
| `public/img-version/Captura de pantalla 2026-07-08 a la(s) 4.48.07 p. m..jpg` | `RIGHT_SIDEBAR_DETAIL` | LeftSidebar, canvas, floating action menu, inspector sections | Toolbar contextual desplegada sin robar protagonismo al documento. |
| `public/img-version/Captura de pantalla 2026-07-08 a la(s) 4.48.15 p. m..jpg` | `RIGHT_SIDEBAR_DOCUMENTS` | LeftSidebar, canvas, documents list, page navigator, bottom control bar | Vista de documentos cargados con separación visual clara. |
| `public/img-version/Captura de pantalla 2026-07-08 a la(s) 4.48.22 p. m..jpg` | `RIGHT_SIDEBAR_DOCUMENTS` | LeftSidebar, canvas, document list, right panel tabs | Confirma que la densidad de la barra derecha es compacta y navegable. |
```

<a id="file-0209"></a>

### 0209 — `reports/tailwind-migration/line-by-line-style-audit.md`

- **Lenguaje:** `markdown`
- **Líneas:** `227`
- **Tamaño original:** `21.6 KB`
- **SHA1 corto:** `d6e6a2c776`
- **Estado:** `completo`

```markdown
# Auditoría line-by-line — Migración CSS → Tailwind (SISAD-PDFME)

Fecha: 2026-07-08
Autor: arquitecto frontend (revisión Codex sobre código real)
Alcance: clasificación por bloque/selector de todas las hojas CSS reales del proyecto.

## Leyenda de acciones

| Acción | Significado |
|---|---|
| `MIGRATE_JSX` | Mover a `className` Tailwind directo en el componente JSX/TSX |
| `MIGRATE_BRIDGE` | Mover a `@apply` en `src/styles/sisad-tailwind-bridge.css` |
| `KEEP_LEGACY` | Mantener en CSS legacy (geometría, paper, transform, zoom, variables runtime, Ant, Moveable/Selecto) |
| `TOKENIZE` | Consolidar como variable/token (tokens.css o `tailwind.config.js`) |
| `DELETE_DUPLICATE` | Eliminar por duplicada / muerta / cubierta por regla equivalente |
| `SPLIT_RULE` | Dividir porque mezcla layout + visual + estado + geometría |
| `NEEDS_TASK_CARD` | Requiere task-card separada (riesgo alto: canvas/Moveable/Selecto/runtime) |

## Mapa de carga (grafo de imports real)

``​`
index.html         → /src/style.css           (@tailwind base/components/utilities)   ← DUPLICADO
src/main.jsx       → styles/tailwind.css       (@tailwind base/components/utilities)
                   → styles/sisad-tailwind-bridge.css
src/App.jsx        → features/pdfcomponent/labRoutes.css
ui/index.ts        → ui/styles/tokens.css
   & editor/index.ts  ui/styles/sisad-pdfme-runtime.css  →(@import) ui/styles/sisad-pdfme-global.css
                      ui/styles/canvas-interactions.css
(sin import)       → ui/styles/sisad-pdfme-demo.css       ← HUÉRFANO (no cargado)
``​`

**Hallazgos de infraestructura (críticos):**

1. **Doble emisión de Tailwind.** `index.html` enlaza `/src/style.css` (que emite `@tailwind base/components/utilities`) y además `main.jsx` importa `styles/tailwind.css` (idénticas 3 directivas). Tailwind se genera **dos veces**. → `DELETE_DUPLICATE` en `style.css` (neutralizado, `tailwind.css` queda como única fuente).
2. **`sisad-pdfme-demo.css` es huérfano** — no lo importa ningún módulo (solo aparece en `metadata/*` y en el script de migración). → `NEEDS_TASK_CARD` (borrar tras confirmación de owner; carga fuentes de Google que ya provee global.css).
3. **`sisad-pdfme-global.css` (6342 líneas, 173 KB) SÍ está activo**: se carga vía `@import './sisad-pdfme-global.css'` en la línea 1 de `sisad-pdfme-runtime.css`. No es código muerto.
4. **`@apply` en el bridge debe permanecer a nivel raíz (NO dentro de `@layer components`).** Verificado empíricamente: las reglas dentro de `@layer` son purgadas por Tailwind si el content-scanner no detecta la clase; muchos selectores del bridge dependen de clases generadas por el runtime en runtime/`data-*`. Top-level `@apply` se emite siempre (comportamiento actual, sin regresión).

---

## 1) `src/style.css` (3 líneas)

| Selector/Bloque | Líneas | Categoría | Acción | Motivo | Destino |
|---|---:|---|---|---|---|
| `@tailwind base/components/utilities` | 1-3 | Config | `DELETE_DUPLICATE` | Duplica `styles/tailwind.css` importado por main.jsx → doble build de Tailwind | Neutralizado a comentario |

## 2) `src/styles/tailwind.css` (3 líneas)

| Selector/Bloque | Líneas | Categoría | Acción | Motivo | Destino |
|---|---:|---|---|---|---|
| `@tailwind base/components/utilities` | 1-3 | Config | `KEEP_LEGACY` | Única entrada Tailwind canónica (main.jsx). preflight off vía config | — |

## 3) `src/styles/sisad-tailwind-bridge.css` (157 líneas)

| Selector/Bloque | Líneas | Categoría | Acción | Motivo |
|---|---:|---|---|---|
| `.sisad-pdfme-root`, `-page`, `-grid`, `-workspace` | 14-28 | B Layout | `MIGRATE_BRIDGE` (hecho) | Layout puro flex/overflow seguro. **Ojo**: `bg-slate-50/900` hardcode en vez de token `bg-sisad-bg` → mejorar a token |
| `.sisad-pdfme-designer-*` root/workspace/stage/canvas | 30-49 | B Layout | `MIGRATE_BRIDGE` (hecho) | flex/min-0/overflow seguro |
| `.sisad-pdfme-ui-control-bar*` cluster/pill/summary | 51-88 | D Chrome | `MIGRATE_BRIDGE` (hecho, parcial) | inline-flex/border/bg/blur OK. Posiciones `top-2/left-1/2/-translate-x-1/2` son seguras (no dependen de coord. runtime) |
| `.sisad-pdfme-designer-left-sidebar*` | 90-116 | E Sidebars | `MIGRATE_BRIDGE` (hecho) | visual/typography seguro. Ancho colapsado permanece en legacy |
| `.sisad-pdfme-option-group-*[data-render-mode]` | 118-137 | I Option groups | `MIGRATE_BRIDGE` (hecho) | Preserva `data-render-mode`/`data-option-labels` |
| `.sisad-pdfme-lab-results-drawer*` | 139-157 | K Lab | `MIGRATE_BRIDGE` (hecho) | drawer visual. `fixed`/`top` geometría queda en labRoutes.css |

**Acción aplicada:** reorganizado en secciones comentadas (A–K) sin `@layer` (decisión de purga). Tokens `bg-sisad-*` preferidos sobre `slate` hardcode donde es seguro.

## 4) `src/sisad-pdfme/ui/styles/tokens.css` (374 líneas) — categoría A

| Bloque | Líneas | Acción | Motivo |
|---|---:|---|---|
| COLOR PALETTE (`--color-*`) | 4-197 | `KEEP_LEGACY` + `TOKENIZE` | Fuente de verdad. Semánticos `--sisad-editor-*` ya mapeados en `tailwind.config.js` (`colors.sisad.*`) |
| SPACING / RADIUS / TYPOGRAPHY | 198-244 | `KEEP_LEGACY` | Escala interna del diseñador. Radius ya mapeado (`rounded-sisad-*`) |
| SHADOW / Z-INDEX / TRANSITION / BLUR | 246-289 | `KEEP_LEGACY` | Shadow mapeado (`shadow-sisad-*`). z-index runtime |
| Dark theme legacy | 291-302 | `NEEDS_TASK_CARD` | Verificar uso real antes de tocar |
| **RUNTIME/PDFME LAYOUT TOKENS** (`--sisad-pdfme-rs-width`, `-ls-width`, `-chrome-z`, `-chrome-height`, `-stage-*`, `-paper-*` implícitos) | 304-334 | `KEEP_LEGACY` (prohibido migrar) | Geometría de paper/sidebars/chrome. Runtime lee estas variables |
| INTERACTION TOKENS (`--moveable-color`, `--schema-tone`, `--wix-*`) | 339-353 | `KEEP_LEGACY` | Moveable/overlays/timing |
| SISAD EDITOR SEMANTIC TOKENS | 355-373 | `KEEP_LEGACY` (fuente de `colors.sisad`) | Puente tokens↔Tailwind. **No** convertir a clases estáticas |

**Veredicto tokens.css: 0 eliminaciones, 0 migraciones a className. Se mantiene íntegro.** El único trabajo de tokenización es ampliar el mapeo en `tailwind.config.js` si se requieren nuevas utilidades (spacing/typography) — task-card opcional.

## 5) `src/features/pdfcomponent/labRoutes.css` (1430 líneas) — categoría K (Lab)

| Bloque | Líneas | Categoría | Acción | Motivo |
|---|---:|---|---|---|
| `.sisad-pdfme-lab-landing/-page` base + gradientes | 1-35 | K/C | `SPLIT_RULE` → `KEEP_LEGACY` geometría | `min-height:100vh`, `padding clamp()`, radial-gradients, vars `--sisad-pdfme-z-*`, `isolation`. Gradientes multi-capa no valen la pena en `@apply` |
| `.sisad-pdfme-lab-editor-shell/-topbar/-debug` | 37-49 | B Layout | `MIGRATE_JSX` | grid/gap/padding triviales |
| Cards compartidas (hero/toolbar/results/workspace/card) borde+bg+blur | 53-64 | K Visual | `MIGRATE_BRIDGE` | Superficie glassmorphism reutilizable → clase bridge `sisad-pdfme-lab-surface` |
| `.sisad-pdfme-lab-hero` + `[data-density='compact']` | 66-112 | K/L | `SPLIT_RULE` | Layout grid → JSX; `z-index: var(--z-header)` y density-attrs → KEEP |
| `.sisad-pdfme-lab-page-details*` | 114-139 | K Visual | `MIGRATE_JSX` | `<details>` visual + `::-webkit-details-marker` KEEP (pseudo no soportado por @apply) |
| `.sisad-pdfme-lab-page-topbar/-copy/-kicker/h1` | 141-183 | K/B | `SPLIT_RULE` | grid-template-columns con `minmax/fr` → KEEP; typografía → JSX; `clamp()` en h1 → KEEP |
| `.sisad-pdfme-lab-page-rail/-context` | 185-199 | B Layout | `MIGRATE_JSX` | flex/grid seguro |
| `.sisad-pdfme-lab-workspace[data-ux-mode=canvas-first] .section-heading` (sr-only) | 201-211 | B | `MIGRATE_JSX` | patrón `sr-only` de Tailwind exacto → usar `sr-only` |
| `.sisad-pdfme-lab-page-actions*` | 213-256 | K Visual | `MIGRATE_JSX` | flex/pill visual |
| Métricas (`-hero-summary/-metrics/-metric`) scroll-x | 258-318 | K Visual | `SPLIT_RULE` | flex + `scrollbar-width:none` + `::-webkit-scrollbar` KEEP; gradiente card → bridge |
| Colaboración (`-collaboration-*`) barra/chips/select | 320-444 | K Visual | `MIGRATE_JSX` (parcial) | grid/flex/pills. `::-webkit-details-marker` KEEP |
| Chip buttons + tonos (`-chip-button`, `-chip-tone-*`) | 446-501 | K Visual | `MIGRATE_JSX` | Tonos = paleta fija → utilidades Tailwind arbitrary o clases tono. transición KEEP simple |
| Cards de catálogo lab (`-card*`, hover, `::before`) | 503-687 | K/L | `SPLIT_RULE` | Layout → JSX; `::before` overlay + hover transform → KEEP (animación) |
| Toolbar lab (`-toolbar*`) | 689-703 | K | `MIGRATE_JSX` | grid/flex |
| CompactControls (`-compact-controls*`, `-compact-icon-button`) | 693-723 | D/K | `MIGRATE_JSX` | botones icon 32px, estados hover/active |
| **Popover** (`-popover*` panel/section/item/grid) | 725-889 | K/D | `SPLIT_RULE` | `position:absolute; top:42px; right:0; z-index:var(--z-popover)` KEEP; interior visual → JSX/bridge |
| Controles lab (`-control-group/-label/-select/-button/-status`) | 891-950 | K Visual | `MIGRATE_JSX` | inputs/botones visuales |
| Image grid | 952-977 | B/K | `MIGRATE_JSX` | grid auto-fit |
| **Workspace/canvas shell** (`-workspace`, `-canvas-shell`, `-runtime-host`) | 979-1012 | C Canvas | `KEEP_LEGACY` | `min-height: clamp(30rem,72vh,56rem)`, overflow, canvas host. **Geometría — no migrar** |
| Results (`-results*` summary/body/badge) | 1014-1057 | K Visual | `SPLIT_RULE` | visual → JSX; `[open]` state + `::-webkit-details-marker` KEEP |
| Advanced tools `<details>` | 1059-1090 | K Visual | `MIGRATE_JSX` | visual |
| `@media (max-width:900px / 640px)` | 1092-1244 | B/K Responsive | `KEEP_LEGACY` (o MIGRATE_JSX con `md:`/`sm:`) | Media queries complejas; migración a breakpoints Tailwind = task-card |
| **TASK-LAB-001 canvas-first shell** (`[data-ux-mode='canvas-first']` 100dvh grid) | 1246-1276 | C Canvas | `KEEP_LEGACY` (crítico) | `height:100dvh`, `grid-template-rows: auto 1fr`, geometría canvas-first. **No migrar** |
| **TASK-LAB-002 results drawer** (`-results-drawer` fixed) | 1278-1364 | K/C | `SPLIT_RULE` → `KEEP_LEGACY` posición | `position:fixed; top:calc(var(--lab-topbar-height)+…)`, `pointer-events` KEEP; skin visual → bridge (ya en bridge) |
| Compact header hide rules `[data-density='compact'] … {display:none}` | 1366-1376 | K State | `KEEP_LEGACY` | Estado por data-attr, se resuelve mejor en CSS |
| Collaboration popovers compact + recipient-dot/option/status-list | 1378-1430 | K Visual | `MIGRATE_JSX` | visual; `recipient-dot` color viene por style inline (owner color) → no tocar |

**Resumen labRoutes:** ~55 bloques. Geometría canvas-first / drawer / canvas-shell / media queries = KEEP. El resto es visual migrable a JSX/bridge de forma incremental (task-cards LAB por sección para permitir validación visual por ruta).

## 6) `src/sisad-pdfme/ui/styles/sisad-pdfme-runtime.css` (391 líneas, sin contar el @import)

| Bloque | Líneas | Categoría | Acción | Motivo |
|---|---:|---|---|---|
| `@import './sisad-pdfme-global.css'` | 1 | infra | `KEEP_LEGACY` | Punto de carga real de global.css |
| Left-sidebar density grids (`[data-left-sidebar-density]` rich/compact/mini) | 3-32 | E Sidebars | `KEEP_LEGACY` | `grid-template-columns`/gap por densidad = geometría de layout condicional |
| List-view density (`-list-view-*`, `[data-list-density]`) | 34-104 | F Inspector | `SPLIT_RULE` | min-w/overflow/ellipsis → bridge; dimensiones px por densidad → KEEP |
| Detail header density (`[data-detail-header-density]`) | 106-119 | F | `KEEP_LEGACY` | estado por data-attr |
| Right-sidebar density switcher | 121-159 | E | `KEEP_LEGACY` | dimensiones/gap por densidad |
| Inspector summary/metric chips | 161-251 | F Inspector | `MIGRATE_BRIDGE` (mayoría) | flex/gap/ellipsis/pill; `.ant-tag`/`.ant-btn` overrides → KEEP (Ant) |
| Left-sidebar dock header/recipient/control-band | 253-346 | E/G | `SPLIT_RULE` | typography/pill → bridge; `owner color` via var → KEEP |
| Stage typography scaling (`.sisad-pdfme-designer-stage …`) | 348-384 | E/F | `MIGRATE_BRIDGE` | font-size overrides; `.ant-input/.ant-select-selector` → KEEP |
| `[data-left-sidebar-variant='compact'] .control-bar { --chrome-height }` | 385-391 | D | `KEEP_LEGACY` | fija variable de chrome (geometría) |

## 7) `src/sisad-pdfme/ui/styles/canvas-interactions.css` (1509 líneas) — categorías C/D/N/L

Contadores: `transform` 45, `translate3d` 8, `scale()` 21, `position:fixed` 3, `position:absolute` 17, `z-index` 14, `pointer-events` 26, `moveable` 1.

| Bloque | Líneas | Categoría | Acción | Motivo |
|---|---:|---|---|---|
| Cabecera + drag preview/placeholder base | 1-311 | C/N | `KEEP_LEGACY` | `transform: translate3d`, fixed positioning, pointer-events, overlays. **Prohibido migrar** |
| Selection Context Toolbar + micro pill | 312-658 | D Chrome | `SPLIT_RULE` | skin visual (bg/border/radius/shadow) → bridge; `position/transform/z-index` KEEP |
| Inline Metrics | 659-674 | D | `MIGRATE_BRIDGE` | badge visual |
| Inline Edit Overlay | 675-779 | C/N | `KEEP_LEGACY` | overlay de edición sobre coordenadas |
| Snap Feedback | 780-806 | C | `KEEP_LEGACY` | feedback de snap (geometría) |
| Control bar phase states | 807-827 | L/N | `KEEP_LEGACY` | interaction-phase por data-attr |
| Schema Interaction Affordances/Details (hover/active/outline) | 828-957 | C/N | `KEEP_LEGACY` | outline/`schema-tone`, hit-testing visual. **No z-index arbitrario** |
| Interaction/Hover overlays | 958-982 | C/N | `KEEP_LEGACY` | overlays owner-color aware |
| Caption Badge | 983-1060 | D | `SPLIT_RULE` | skin badge → bridge; visibilidad por estado KEEP |
| Schema mini-toolbar | 1061-1148 | D | `SPLIT_RULE` | skin → bridge; posición sobre field KEEP |
| Span Auto Helper | 1124-1148 | B | `MIGRATE_BRIDGE` | helper de layout |
| Canvas Context Menu | 1149-1386 | D | `SPLIT_RULE` | menú flotante: skin → bridge; `position/z-index` KEEP |
| SelectionContextToolbar refinamiento + micro | 1387-1485 | D | `SPLIT_RULE` | idem |
| Option group floating action (botón +) + hide en drag/transform | 1486-1509 | I/N | `KEEP_LEGACY` | Botón `+` NO debe ser target Moveable/Selecto; oculto en drag/transform. **Crítico negocio** |

**Veredicto:** núcleo (overlays/transform/drag/drop/snap/schema affordances/botón +) = KEEP. Solo los *skins* de toolbars/badges/menús flotantes son migrables → task-card con validación de que no cambia hit-testing.

## 8) `src/sisad-pdfme/ui/styles/sisad-pdfme-global.css` (6342 líneas) — TODAS las categorías

Clasificación por sección (comentarios reales del archivo). Contadores clave: `transform: scale` 17, `data-canvas-page` 13, `data-paper` 6, `moveable`/`selecto` 9 c/u, `@keyframes` 14, `ant-` 95.

| Sección | Líneas aprox | Categoría | Acción | Motivo |
|---|---:|---|---|---|
| `.sisad-pdfme-root` aliases + `box-sizing` reset scoped | 4-46 | A/M | `KEEP_LEGACY` | Aliases de variables + `box-sizing` **scoped** (no global reset → OK) |
| Schema field chrome tokens (`--sisad-schema-*`) | 22-31 | A/H | `KEEP_LEGACY`/`TOKENIZE` | Tokens de chrome de campo (owner color, radius) |
| RadioGroup/CheckboxGroup compacto + botón + | ~694-781 | I Option groups | `KEEP_LEGACY` | Botón `+` `data-role`, celdas dibujadas por plugin. No romper |
| Zoom select compact | 782-988 | D | `SPLIT_RULE` | skin → bridge; Ant select KEEP |
| Tab list icon-only pills + accent | 989-1099 | E/L | `SPLIT_RULE` | skin → bridge; accent line/keyframe KEEP |
| Chip filters | 1100-1234 | G | `MIGRATE_BRIDGE` | pills uniformes |
| Compact mode 2-col + compact card tile + icon/label | 1235-1554 | G Catálogo | `SPLIT_RULE` | layout tile → bridge; `data-view-mode`/`data-schema-*` + owner color KEEP |
| Favorite toggle (estrella) | 1555-1863 | G | `SPLIT_RULE` | skin → bridge; toggle state KEEP |
| Sidebar toggle button base + left | 1864-2131 | E | `SPLIT_RULE` | skin → bridge; ancho colapsado/transform KEEP |
| Ant grid gutters reset + compact ant-form-item | 2132-2286 | M Ant | `KEEP_LEGACY` | Compatibilidad Ant Design |
| Position indicator / overflow badge | 2287-2605 | F | `MIGRATE_BRIDGE` | badges/chips |
| Ant-collapse overrides (schema config) | 2606-3352 | M/F | `KEEP_LEGACY` | Ant compat de alta especificidad |
| Left sidebar compact variant (DocuSign-like) + breakpoints | 3353-3517 | E | `KEEP_LEGACY` | densidad/breakpoints de layout |
| Compact catalog neutraliza owner colors inline | 3518-3568 | G | `KEEP_LEGACY` | interactúa con estilos inline del runtime |
| Compact stage harmonization | 3569-3745 | E/D | `SPLIT_RULE` | skin → bridge; densidad KEEP |
| List view item structure | 3746-3897 | F | `SPLIT_RULE` | estructura flex → bridge; `.ant-btn` dims KEEP |
| Canvas empty state title/hint | 3882-3897 | K | `MIGRATE_BRIDGE` | typografía |
| Documents rail (Header/Empty/Item list) | 3898-4155 | E | `SPLIT_RULE` | skin → bridge; `.ant-btn` specificity KEEP |
| **Global Keyframes** (14 `@keyframes`) | 4161-4302 | L Animaciones | `KEEP_LEGACY` | No eliminar sin buscar referencias; usados por animaciones sidebar/tabs |
| Right sidebar entrance + panel switcher + ripple + active slide | 4303-4460 | E/L | `KEEP_LEGACY` | Animaciones dependientes de estado |
| Detail header card premium + stat cells + context strip | 4461-4722 | F | `SPLIT_RULE` | skin → bridge; animaciones KEEP |
| Section cards staggered + head/body reveal | 4723-4847 | F/L | `KEEP_LEGACY` | animación stagger `nth-child` |
| Align widget / button group / color picker | 4848-5070 | F | `SPLIT_RULE` | grid/skin → bridge; interacción KEEP |
| Schema config widget animations | 5071-5168 | F/L | `KEEP_LEGACY` | animaciones |
| Form fields right sidebar (input focus/stepper/select/checkbox) | 5169-5226 | F/M | `KEEP_LEGACY` | Ant inputs + focus states |
| Right sidebar scrollbar refinement | 5227-5252 | E | `KEEP_LEGACY` | `::-webkit-scrollbar` (pseudo no @apply) |
| Left sidebar toggle / control bar transitions / draggable hover lift | 5253-5341 | D/E/L | `KEEP_LEGACY` | transiciones + transform hover |
| Reduced motion overrides | 5342-5376 | L | `KEEP_LEGACY` | `@media (prefers-reduced-motion)` |
| Compact detail refinements 1-11 (panel switcher, header, section, align, formatter, color, layout) | 5377-5683 | F | `KEEP_LEGACY` | densidad de layout de alta especificidad |
| Reduced-motion additions | 5684-5845 | L | `KEEP_LEGACY` | idem |
| **Schema shared visual chrome** | 5846-5916 | H Field chrome | `NEEDS_TASK_CARD` | Interactúa con `fieldChrome.ts`. Migrar rounded/border/bg pero **preservar** owner color/positioning |
| **Field chrome — generic + FieldChromePolicy (mode-scoped)** TASK-012 | 5917-6016 | H/J | `KEEP_LEGACY` | Modo `form/viewer/pdf`, readonly, invalid. owner tint via var. **No tocar x/y/rotation/required/readonly** |
| text-like by render mode TASK-014 | 6017-6038 | H/J | `KEEP_LEGACY` | modo-específico |
| Option editor widget (propPanel) | 6039-6149 | I | `SPLIT_RULE` | skin editor → bridge; checkbox indicator KEEP |
| **Option group schema root** (reemplaza Object.assign de checkbox/radioGroup) | 6150-6272 | I Option groups | `KEEP_LEGACY` (crítico) | Sizing marker stack, `data-option-id`, marker-only groups, oculta texto en runtime. **Preservar selectedOptionIds/options/groupId** |
| Select propPanel editor | 6273-6295 | I | `SPLIT_RULE` | skin → bridge |
| Note schema (informative) | 6296-6321 | J Runtime | `SPLIT_RULE` | skin → bridge; modo KEEP |
| Attachment schema (dashed border) | 6322-6342 | J Runtime | `SPLIT_RULE` | skin → bridge; input nativo/UI propia KEEP |

**Veredicto global.css:** el archivo mezcla masivamente skin (migrable) con geometría/estado/Ant/animaciones/chrome de campo (KEEP). La migración segura es **por sección con validación visual por ruta**, no en bloque. La reducción de duplicidad real está en los *skins* de sidebars/inspector/badges/toolbars. Todo lo relativo a paper, `data-canvas-page`, `transform: scale`, Moveable/Selecto, botón `+`, field-chrome por modo y option-group root = **KEEP_LEGACY**.

## 9) `src/sisad-pdfme/ui/styles/sisad-pdfme-demo.css` (65 líneas)

| Bloque | Líneas | Categoría | Acción | Motivo |
|---|---:|---|---|---|
| `@import` Google Fonts + tokens | 1-2 | infra | `DELETE_DUPLICATE` | Archivo huérfano (no importado). Fuentes ya en global.css |
| `body`, `.app-shell`, `.main-nav*` | 4-66 | O Muertas | `NEEDS_TASK_CARD` | No referenciado en JSX/TSX activo. Confirmar con owner antes de borrar el archivo completo |

---

## Resumen cuantitativo

| Acción | Bloques (aprox) |
|---|---:|
| `MIGRATE_JSX` | ~18 (lab) |
| `MIGRATE_BRIDGE` | ~16 |
| `KEEP_LEGACY` | ~48 (geometría/paper/Ant/Moveable/Selecto/animaciones/chrome/option-root) |
| `TOKENIZE` | tokens.css íntegro + mapeo config (~2) |
| `DELETE_DUPLICATE` | 3 (style.css, demo @import, doble Tailwind) |
| `SPLIT_RULE` | ~22 |
| `NEEDS_TASK_CARD` | 6 (demo.css, dark tokens, field-chrome shared, canvas-interactions skins, global skins por sección, labRoutes media→breakpoints) |

**Total bloques/selectores-grupo analizados: ~115** distribuidos en 9 archivos.

## Task-cards derivadas (para ejecución con validación visual)

- **TC-CSS-01** — Migrar skins de `labRoutes.css` a JSX/bridge por sección (header, popover, cards, controls) validando `/lab/multi-document-routing`. Mantener canvas-first/drawer/media geometría.
- **TC-CSS-02** — Migrar skins de sidebars/inspector en `global.css` a bridge (`@apply`), validando densidades y Ant compat.
- **TC-CSS-03** — Migrar skins de toolbars/badges/menús flotantes en `canvas-interactions.css` verificando que hit-testing, overlays y botón `+` no cambian.
- **TC-CSS-04** — Field chrome shared (`global.css` 5846-5916 + `fieldChrome.ts`): rounded/border/bg a Tailwind preservando owner color, x/y, required/readonly. Validar Form/Viewer/PDF.
- **TC-CSS-05** — Confirmar y eliminar `sisad-pdfme-demo.css` + dark tokens legacy no usados.
- **TC-CSS-06** — Migrar `@media` de labRoutes a breakpoints Tailwind (`sm:`/`md:`) — opcional, cosmético.
```

<a id="file-0210"></a>

### 0210 — `reports/tailwind-migration/README.md`

- **Lenguaje:** `markdown`
- **Líneas:** `76`
- **Tamaño original:** `4.6 KB`
- **SHA1 corto:** `61e9dcef41`
- **Estado:** `completo`

```markdown
# Tailwind Migration Report

Fecha: 2026-07-08T16:17:36.008Z
Modo: apply
Root: /Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin

## Objetivo

Migración incremental de diseños a Tailwind preservando comportamiento, canvas, geometría, Moveable, Selecto, snapshot y metadata.

## Archivos creados/actualizados

- backup package.json -> .tailwind-migration-backups/20260708-111736/package.json
- update package.json
- unchanged src/main.jsx
- backup reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__tokens.tailwind.candidate.css -> .tailwind-migration-backups/20260708-111736/reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__tokens.tailwind.candidate.css
- update reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__tokens.tailwind.candidate.css
- backup reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__sisad-pdfme-global.tailwind.candidate.css -> .tailwind-migration-backups/20260708-111736/reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__sisad-pdfme-global.tailwind.candidate.css
- update reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__sisad-pdfme-global.tailwind.candidate.css
- backup reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__canvas-interactions.tailwind.candidate.css -> .tailwind-migration-backups/20260708-111736/reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__canvas-interactions.tailwind.candidate.css
- update reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__canvas-interactions.tailwind.candidate.css
- backup reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__sisad-pdfme-runtime.tailwind.candidate.css -> .tailwind-migration-backups/20260708-111736/reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__sisad-pdfme-runtime.tailwind.candidate.css
- update reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__sisad-pdfme-runtime.tailwind.candidate.css
- backup reports/tailwind-migration/candidates/features__pdfcomponent__labRoutes.tailwind.candidate.css -> .tailwind-migration-backups/20260708-111736/reports/tailwind-migration/candidates/features__pdfcomponent__labRoutes.tailwind.candidate.css
- update reports/tailwind-migration/candidates/features__pdfcomponent__labRoutes.tailwind.candidate.css

## Candidatos CSS generados

- src/sisad-pdfme/ui/styles/tokens.css → reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__tokens.tailwind.candidate.css
  - bloques convertidos: 0
  - declaraciones manuales/unsupported: 0
- src/sisad-pdfme/ui/styles/sisad-pdfme-global.css → reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__sisad-pdfme-global.tailwind.candidate.css
  - bloques convertidos: 772
  - declaraciones manuales/unsupported: 1814
- src/sisad-pdfme/ui/styles/canvas-interactions.css → reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__canvas-interactions.tailwind.candidate.css
  - bloques convertidos: 176
  - declaraciones manuales/unsupported: 508
- src/sisad-pdfme/ui/styles/sisad-pdfme-runtime.css → reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__sisad-pdfme-runtime.tailwind.candidate.css
  - bloques convertidos: 65
  - declaraciones manuales/unsupported: 88
- src/features/pdfcomponent/labRoutes.css → reports/tailwind-migration/candidates/features__pdfcomponent__labRoutes.tailwind.candidate.css
  - bloques convertidos: 203
  - declaraciones manuales/unsupported: 435

## Advertencias

- tailwind.config.js ya existe; revisa manualmente que tenga content y preflight:false.
- postcss.config.js ya existe; revisa manualmente que tenga tailwindcss y autoprefixer.
- No se sobrescribió src/styles/tailwind.css; ya existe.
- No se sobrescribió src/styles/sisad-tailwind-bridge.css; ya existe.

## Próximo paso recomendado

1. Ejecutar la app y validar /lab/multi-document-routing.
2. Comparar visualmente Designer, Form, Viewer y PDF.
3. Migrar por task-card, no todo de golpe.
4. Mantener classNames existentes hasta que Playwright confirme comportamiento.
5. No reemplazar reglas de canvas, Moveable, Selecto ni geometría por Tailwind sin evidencia.

## Validación manual mínima

- Designer mantiene grid, sidebars, toolbar, zoom y selección.
- Form/Viewer siguen filtrando por recipient activo.
- CheckboxGroup/RadioGroup no muestran labels técnicos no deseados.
- Attachment, image, svg, barcode y table conservan comportamiento.
- Página 2+ conserva coordenadas, overlays y toolbar.
- PDF generado no imprime chrome/fondos no deseados.

## Archivos que NO deben tocarse solo por diseño

- Moveable.tsx
- Selecto.tsx
- designerCoordinateService.ts
- schemaCollision.ts
- snapshotAdapter.ts
- generator/pdf-lib
```

<a id="file-0211"></a>

### 0211 — `test-results/standard-fields-standard-f-c4dc3-s-the-expected-schema-types-chromium/error-context.md`

- **Lenguaje:** `markdown`
- **Líneas:** `576`
- **Tamaño original:** `28.7 KB`
- **SHA1 corto:** `8d1e443f41`
- **Estado:** `completo`

```markdown
# Page snapshot

``​`yaml
- main [ref=e3]:
  - generic [ref=e4]:
    - generic [ref=e5]:
      - generic [ref=e6]:
        - generic [ref=e7]:
          - generic [ref=e8]: Lab
          - generic [ref=e9]: Diseñador
        - heading "Multidocumento integral" [level=1] [ref=e10]
      - button "Controles" [ref=e15]:
        - img [ref=e17]
        - text: Controles
    - region "Colaboración del ejemplo" [ref=e20]:
      - generic "Colaboración" [ref=e21]:
        - generic [ref=e22]:
          - generic [ref=e23]: Usuario
          - combobox "Seleccionar usuario activo" [ref=e24]:
            - option "Cliente Principal" [selected]
            - option "Avalista"
            - option "Mesa de entrega"
        - button "Usuario activo" [ref=e26]
        - button "Estado" [ref=e28]
  - region "Canvas" [ref=e29]:
    - generic [ref=e30]:
      - heading "Canvas" [level=2] [ref=e31]
      - paragraph [ref=e32]:
        - text: La superficie de edición se monta dentro del runtime de
        - code [ref=e33]: sisad-pdfme
        - text: .
    - generic [ref=e37]:
      - generic [ref=e38]:
        - generic [ref=e39]:
          - button "Cerrar catálogo de campos" [expanded] [ref=e40] [cursor=pointer]:
            - img [ref=e41]
          - generic [ref=e45]:
            - generic [ref=e46]:
              - generic [ref=e47]: Diseñador
              - generic [ref=e48]:
                - generic [ref=e49]: Campos
                - 'generic "Color del destinatario activo #2563EB" [ref=e50]'
            - generic [ref=e51]:
              - tablist "Tipos de campo" [ref=e52]:
                - tab "Campos estándar" [selected] [ref=e53] [cursor=pointer]:
                  - img [ref=e54]
                - tab "Campos personalizados" [ref=e56] [cursor=pointer]:
                  - img [ref=e57]
                - tab "Herramientas de prerrellenado" [ref=e60] [cursor=pointer]:
                  - img [ref=e61]
              - generic [ref=e64]:
                - generic [ref=e65]:
                  - img [ref=e67]
                  - textbox "Buscar campos" [ref=e70]
                - generic [ref=e72]:
                  - button "Todos" [ref=e73] [cursor=pointer]:
                    - generic [ref=e74]: Todos
                  - button "Favoritos (0)" [ref=e75] [cursor=pointer]:
                    - generic [ref=e76]: Favoritos (0)
                  - button "Recientes (0)" [ref=e77] [cursor=pointer]:
                    - generic [ref=e78]: Recientes (0)
                  - button "Vista detalle (lista)" [ref=e79] [cursor=pointer]:
                    - img [ref=e81]
            - generic [ref=e82]:
              - generic [ref=e83]:
                - button "Alternar categoría Firmas" [expanded] [ref=e84] [cursor=pointer]:
                  - generic [ref=e85]: Firmas
                  - generic [ref=e86]: "3"
                - generic [ref=e87]:
                  - generic [ref=e90]:
                    - button "Datesigned" [ref=e91]:
                      - generic "Datesigned" [ref=e93]:
                        - img [ref=e94]
                      - generic [ref=e98]: Datesigned
                    - button "Marcar favorito": ★
                  - generic [ref=e101]:
                    - button "Initials" [ref=e102]:
                      - generic "Initials" [ref=e104]:
                        - img [ref=e105]
                      - generic [ref=e108]: Initials
                    - button "Marcar favorito": ★
                  - generic [ref=e111]:
                    - button "Firma" [ref=e112]:
                      - generic "Firma" [ref=e114]:
                        - img [ref=e115]
                      - generic [ref=e118]: Firma
                    - button "Marcar favorito": ★
              - generic [ref=e119]:
                - button "Alternar categoría Texto" [expanded] [ref=e120] [cursor=pointer]:
                  - generic [ref=e121]: Texto
                  - generic [ref=e122]: "2"
                - generic [ref=e123]:
                  - generic [ref=e126]:
                    - button "Número Número" [ref=e127]:
                      - generic "Número" [ref=e128]
                      - generic [ref=e130]: Número
                    - button "Marcar favorito": ★
                  - generic [ref=e133]:
                    - button "Texto" [ref=e134]:
                      - generic "Texto" [ref=e136]:
                        - img [ref=e137]
                      - generic [ref=e143]: Texto
                    - button "Marcar favorito": ★
              - generic [ref=e144]:
                - button "Alternar categoría Imagen y medios" [expanded] [ref=e145] [cursor=pointer]:
                  - generic [ref=e146]: Imagen y medios
                  - generic [ref=e147]: "2"
                - generic [ref=e148]:
                  - generic [ref=e151]:
                    - button "Imagen" [ref=e152]:
                      - generic "Imagen" [ref=e154]:
                        - img [ref=e155]
                      - generic [ref=e160]: Imagen
                    - button "Marcar favorito": ★
                  - generic [ref=e163]:
                    - button "SVG" [ref=e164]:
                      - generic "SVG" [ref=e166]:
                        - img [ref=e167]
                      - generic [ref=e172]: SVG
                    - button "Marcar favorito": ★
              - generic [ref=e173]:
                - button "Alternar categoría Selecciones" [expanded] [ref=e174] [cursor=pointer]:
                  - generic [ref=e175]: Selecciones
                  - generic [ref=e176]: "4"
                - generic [ref=e177]:
                  - generic [ref=e180]:
                    - button "Casilla" [ref=e181]:
                      - generic "Casilla" [ref=e183]:
                        - img [ref=e184]
                      - generic [ref=e188]: Casilla
                    - button "Marcar favorito": ★
                  - generic [ref=e191]:
                    - button "Grupo de Casillas" [ref=e192]:
                      - generic "Grupo de Casillas" [ref=e194]:
                        - img [ref=e195]
                      - generic [ref=e199]: Grupo de Casillas
                    - button "Marcar favorito": ★
                  - generic [ref=e202]:
                    - button "Opción" [ref=e203]:
                      - generic "Opción" [ref=e205]:
                        - img [ref=e206]
                      - generic [ref=e210]: Opción
                    - button "Marcar favorito": ★
                  - generic [ref=e213]:
                    - button "Lista Desplegable" [ref=e214]:
                      - generic "Lista Desplegable" [ref=e216]:
                        - img [ref=e217]
                      - generic [ref=e220]: Lista Desplegable
                    - button "Marcar favorito": ★
              - generic [ref=e221]:
                - button "Alternar categoría Fecha y Hora" [expanded] [ref=e222] [cursor=pointer]:
                  - generic [ref=e223]: Fecha y Hora
                  - generic [ref=e224]: "3"
                - generic [ref=e225]:
                  - generic [ref=e228]:
                    - button "Fecha" [ref=e229]:
                      - generic "Fecha" [ref=e231]:
                        - img [ref=e232]
                      - generic [ref=e235]: Fecha
                    - button "Marcar favorito": ★
                  - generic [ref=e238]:
                    - button "Fecha Y Hora" [ref=e239]:
                      - generic "Fecha Y Hora" [ref=e241]:
                        - img [ref=e242]
                      - generic [ref=e247]: Fecha Y Hora
                    - button "Marcar favorito": ★
                  - generic [ref=e250]:
                    - button "Hora" [ref=e251]:
                      - generic "Hora" [ref=e253]:
                        - img [ref=e254]
                      - generic [ref=e258]: Hora
                    - button "Marcar favorito": ★
              - generic [ref=e259]:
                - button "Alternar categoría QR y Códigos" [expanded] [ref=e260] [cursor=pointer]:
                  - generic [ref=e261]: QR y Códigos
                  - generic [ref=e262]: "12"
                - generic [ref=e263]:
                  - generic [ref=e266]:
                    - button "Código de barras" [ref=e267]:
                      - generic "Código de barras" [ref=e269]:
                        - img [ref=e270]
                      - generic [ref=e272]: Código de barras
                    - button "Marcar favorito": ★
                  - generic [ref=e275]:
                    - button "Código de barras" [ref=e276]:
                      - generic "Código de barras" [ref=e278]:
                        - img [ref=e279]
                      - generic [ref=e281]: Código de barras
                    - button "Marcar favorito": ★
                  - generic [ref=e284]:
                    - button "Código de barras" [ref=e285]:
                      - generic "Código de barras" [ref=e287]:
                        - img [ref=e288]
                      - generic [ref=e290]: Código de barras
                    - button "Marcar favorito": ★
                  - generic [ref=e293]:
                    - button "Código de barras" [ref=e294]:
                      - generic "Código de barras" [ref=e296]:
                        - img [ref=e297]
                      - generic [ref=e299]: Código de barras
                    - button "Marcar favorito": ★
                  - generic [ref=e302]:
                    - button "DataMatrix" [ref=e303]:
                      - generic "DataMatrix" [ref=e305]:
                        - img [ref=e306]
                      - generic [ref=e308]: DataMatrix
                    - button "Marcar favorito": ★
                  - generic [ref=e311]:
                    - button "Código de barras" [ref=e312]:
                      - generic "Código de barras" [ref=e314]:
                        - img [ref=e315]
                      - generic [ref=e317]: Código de barras
                    - button "Marcar favorito": ★
                  - generic [ref=e320]:
                    - button "Japan Post" [ref=e321]:
                      - generic "Japan Post" [ref=e323]:
                        - img [ref=e324]
                      - generic [ref=e326]: Japan Post
                    - button "Marcar favorito": ★
                  - generic [ref=e329]:
                    - button "NW7" [ref=e330]:
                      - generic "NW7" [ref=e332]:
                        - img [ref=e333]
                      - generic [ref=e335]: NW7
                    - button "Marcar favorito": ★
                  - generic [ref=e338]:
                    - button "PDF417" [ref=e339]:
                      - generic "PDF417" [ref=e341]:
                        - img [ref=e342]
                      - generic [ref=e344]: PDF417
                    - button "Marcar favorito": ★
                  - generic [ref=e347]:
                    - button "Código QR" [ref=e348]:
                      - generic "Código QR" [ref=e350]:
                        - img [ref=e351]
                      - generic [ref=e358]: Código QR
                    - button "Marcar favorito": ★
                  - generic [ref=e361]:
                    - button "Código de barras" [ref=e362]:
                      - generic "Código de barras" [ref=e364]:
                        - img [ref=e365]
                      - generic [ref=e367]: Código de barras
                    - button "Marcar favorito": ★
                  - generic [ref=e370]:
                    - button "Código de barras" [ref=e371]:
                      - generic "Código de barras" [ref=e373]:
                        - img [ref=e374]
                      - generic [ref=e376]: Código de barras
                    - button "Marcar favorito": ★
              - generic [ref=e377]:
                - button "Alternar categoría Estructura" [expanded] [ref=e378] [cursor=pointer]:
                  - generic [ref=e379]: Estructura
                  - generic [ref=e380]: "4"
                - generic [ref=e381]:
                  - generic [ref=e384]:
                    - button "Óvalo" [ref=e385]:
                      - generic "Óvalo" [ref=e387]:
                        - img [ref=e388]
                      - generic [ref=e391]: Óvalo
                    - button "Marcar favorito": ★
                  - generic [ref=e394]:
                    - button "Línea" [ref=e395]:
                      - generic "Línea" [ref=e397]:
                        - img [ref=e398]
                      - generic [ref=e400]: Línea
                    - button "Marcar favorito": ★
                  - generic [ref=e403]:
                    - button "Rectángulo" [ref=e404]:
                      - generic "Rectángulo" [ref=e406]:
                        - img [ref=e407]
                      - generic [ref=e410]: Rectángulo
                    - button "Marcar favorito": ★
                  - generic [ref=e413]:
                    - button "Tabla" [ref=e414]:
                      - generic "Tabla" [ref=e416]:
                        - img [ref=e417]
                      - generic [ref=e420]: Tabla
                    - button "Marcar favorito": ★
              - generic [ref=e421]:
                - button "Alternar categoría Acción" [expanded] [ref=e422] [cursor=pointer]:
                  - generic [ref=e423]: Acción
                  - generic [ref=e424]: "4"
                - generic [ref=e425]:
                  - generic [ref=e428]:
                    - button "Approve" [ref=e429]:
                      - generic "Approve" [ref=e431]:
                        - img [ref=e432]
                      - generic [ref=e436]: Approve
                    - button "Marcar favorito": ★
                  - generic [ref=e439]:
                    - button "Attachment" [ref=e440]:
                      - generic "Attachment" [ref=e442]:
                        - img [ref=e443]
                      - generic [ref=e446]: Attachment
                    - button "Marcar favorito": ★
                  - generic [ref=e449]:
                    - button "Decline" [ref=e450]:
                      - generic "Decline" [ref=e452]:
                        - img [ref=e453]
                      - generic [ref=e458]: Decline
                    - button "Marcar favorito": ★
                  - generic [ref=e461]:
                    - button "Note" [ref=e462]:
                      - generic "Note" [ref=e464]:
                        - img [ref=e465]
                      - generic [ref=e469]: Note
                    - button "Marcar favorito": ★
              - generic [ref=e470]:
                - button "Alternar categoría Destinatario" [expanded] [ref=e471] [cursor=pointer]:
                  - generic [ref=e472]: Destinatario
                  - generic [ref=e473]: "4"
                - generic [ref=e474]:
                  - generic [ref=e477]:
                    - button "Company" [ref=e478]:
                      - generic "Company" [ref=e480]:
                        - img [ref=e481]
                      - generic [ref=e486]: Company
                    - button "Marcar favorito": ★
                  - generic [ref=e489]:
                    - button "Emailaddress" [ref=e490]:
                      - generic "Emailaddress" [ref=e492]:
                        - img [ref=e493]
                      - generic [ref=e497]: Emailaddress
                    - button "Marcar favorito": ★
                  - generic [ref=e500]:
                    - button "Fullname" [ref=e501]:
                      - generic "Fullname" [ref=e503]:
                        - img [ref=e504]
                      - generic [ref=e508]: Fullname
                    - button "Marcar favorito": ★
                  - generic [ref=e511]:
                    - button "Title" [ref=e512]:
                      - generic "Title" [ref=e514]:
                        - img [ref=e515]
                      - generic [ref=e519]: Title
                    - button "Marcar favorito": ★
        - generic [ref=e520]:
          - generic:
            - generic [ref=e522]:
              - generic "Editando" [ref=e523]
              - generic [ref=e524]: Doc · Pág 1/14
            - generic [ref=e526]:
              - button "Página anterior" [disabled] [ref=e527]:
                - generic:
                  - img
              - button "Pág 1/14" [ref=e528] [cursor=pointer]:
                - generic [ref=e529]: Pág 1/14
              - button "Página siguiente" [ref=e530] [cursor=pointer]:
                - img [ref=e532]
            - generic [ref=e535]:
              - button "Guardar" [ref=e536] [cursor=pointer]:
                - img [ref=e538]
                - generic [ref=e542]: Guardar
              - button "Más acciones" [ref=e543] [cursor=pointer]:
                - img [ref=e545]
            - generic [ref=e550]:
              - button "Deshacer" [ref=e551] [cursor=pointer]:
                - img [ref=e553]
              - button "Rehacer" [ref=e556] [cursor=pointer]:
                - img [ref=e558]
              - button "Ajustar página" [ref=e561] [cursor=pointer]:
                - img [ref=e563]
              - generic [ref=e568]:
                - button "Reducir zoom" [ref=e569] [cursor=pointer]:
                  - img [ref=e571]
                - generic [ref=e572] [cursor=pointer]:
                  - generic [ref=e574]:
                    - combobox [ref=e576]
                    - generic "100%" [ref=e577]
                  - generic:
                    - img:
                      - img
                - button "Aumentar zoom" [ref=e578] [cursor=pointer]:
                  - img [ref=e580]
          - button "Ocultar panel derecho" [pressed] [ref=e581]:
            - img [ref=e582]
          - complementary "Panel derecho del diseñador" [ref=e585]:
            - generic [ref=e586]:
              - tablist "Panel derecho" [ref=e588]:
                - tab "Abrir panel Campos" [selected] [ref=e589] [cursor=pointer]:
                  - img [ref=e592]
                - tab "Abrir panel Detalle" [disabled] [ref=e596]:
                  - img [ref=e599]
                - tab "Abrir panel Comentarios" [ref=e600] [cursor=pointer]:
                  - img [ref=e603]
                - tab "Abrir panel Docs" [ref=e605] [cursor=pointer]:
                  - img [ref=e608]
              - generic [ref=e612]:
                - generic [ref=e613]:
                  - generic [ref=e614]:
                    - generic [ref=e615]:
                      - generic [ref=e617]:
                        - strong [ref=e619]: Campos
                        - generic [ref=e621]: 11/11
                      - button "Renombrar" [ref=e624] [cursor=pointer]:
                        - generic [ref=e625]: Renombrar
                    - generic [ref=e626]:
                      - generic [ref=e627]:
                        - img [ref=e629]
                        - textbox "Buscar campo o nombre" [ref=e632]
                      - generic [ref=e635] [cursor=pointer]:
                        - generic [ref=e637]:
                          - combobox [ref=e639]
                          - generic "Todos los tipos" [ref=e640]
                        - generic:
                          - img:
                            - img
                  - separator [ref=e641]
                - generic "Lista de campos del documento" [ref=e642]:
                  - list [ref=e643]:
                    - listitem [ref=e644] [cursor=pointer]:
                      - button "contract_name" [ref=e645]
                      - generic [ref=e646]:
                        - button [ref=e647]:
                          - img [ref=e649]
                        - img [ref=e659]
                        - generic [ref=e665]: contract_name
                    - listitem [ref=e666] [cursor=pointer]:
                      - button "contract_date" [ref=e667]
                      - generic [ref=e668]:
                        - button [ref=e669]:
                          - img [ref=e671]
                        - img [ref=e681]
                        - generic [ref=e687]: contract_date
                    - listitem [ref=e688] [cursor=pointer]:
                      - button "contract_stage" [ref=e689]
                      - generic [ref=e690]:
                        - button [ref=e691]:
                          - img [ref=e693]
                        - img [ref=e703]
                        - generic [ref=e706]: contract_stage
                    - listitem [ref=e707] [cursor=pointer]:
                      - button "approval_mode" [ref=e708]
                      - generic [ref=e709]:
                        - button [ref=e710]:
                          - img [ref=e712]
                        - img [ref=e722]
                        - generic [ref=e726]: approval_mode
                    - listitem [ref=e727] [cursor=pointer]:
                      - button "required_documents" [ref=e728]
                      - generic [ref=e729]:
                        - button [ref=e730]:
                          - img [ref=e732]
                        - img [ref=e742]
                        - generic [ref=e746]: required_documents
                    - listitem [ref=e747] [cursor=pointer]:
                      - button "routing-primary-showcase_attachment" [ref=e748]
                      - generic [ref=e749]:
                        - button [ref=e750]:
                          - img [ref=e752]
                        - img [ref=e762]
                        - generic [ref=e765]: routing-primary-showcase_attachment
                    - listitem [ref=e766] [cursor=pointer]:
                      - button "routing-primary-showcase_approve" [ref=e767]
                      - generic [ref=e768]:
                        - button [ref=e769]:
                          - img [ref=e771]
                        - img [ref=e781]
                        - generic [ref=e785]: routing-primary-showcase_approve
                    - listitem [ref=e786] [cursor=pointer]:
                      - button "routing-primary-showcase_note" [ref=e787]
                      - generic [ref=e788]:
                        - button [ref=e789]:
                          - img [ref=e791]
                        - img [ref=e801]
                        - generic [ref=e805]: routing-primary-showcase_note
                        - img [ref=e807]
                    - listitem [ref=e810] [cursor=pointer]:
                      - button "routing-primary-showcase_decline" [ref=e811]
                      - generic [ref=e812]:
                        - button [ref=e813]:
                          - img [ref=e815]
                        - img [ref=e825]
                        - generic [ref=e830]: routing-primary-showcase_decline
                    - listitem [ref=e831] [cursor=pointer]:
                      - button "routing-primary-showcase_title" [ref=e832]
                      - generic [ref=e833]:
                        - button [ref=e834]:
                          - img [ref=e836]
                        - img [ref=e846]
                        - generic [ref=e850]: routing-primary-showcase_title
                    - listitem [ref=e851] [cursor=pointer]:
                      - button "routing-primary-showcase_emailaddress" [ref=e852]
                      - generic [ref=e853]:
                        - button [ref=e854]:
                          - img [ref=e856]
                        - img [ref=e866]
                        - generic [ref=e870]: routing-primary-showcase_emailaddress
                  - status [ref=e871]
          - generic [ref=e874]:
            - generic [ref=e875]:
              - generic "contract_name" [ref=e877] [cursor=pointer]:
                - generic [ref=e880]: Contrato principal
                - text: contract_name · text
              - generic "contract_date" [ref=e881] [cursor=pointer]:
                - generic [ref=e884]: 2026-05-01
                - text: contract_date · text
              - generic "contract_stage" [ref=e885] [cursor=pointer]:
                - generic [ref=e888]: Pendiente
                - text: contract_stage · select
              - generic "approval_mode" [ref=e889] [cursor=pointer]:
                - radiogroup "Modo de aprobación" [ref=e891]:
                  - generic [ref=e892]:
                    - radio "Firma" [checked] [disabled] [ref=e893]
                    - radio "Revisión" [disabled] [ref=e896]
              - generic "required_documents" [ref=e898] [cursor=pointer]:
                - group "Documentos requeridos" [ref=e900]:
                  - generic [ref=e901]:
                    - checkbox "Cédula" [checked] [disabled] [ref=e902]:
                      - img [ref=e904]
                    - checkbox "RUC" [disabled] [ref=e906]
                    - checkbox "Contrato firmado" [checked] [disabled] [ref=e908]:
                      - img [ref=e910]
                - text: required_documents · checkboxGroup
              - generic "routing-primary-showcase_attachment" [ref=e912] [cursor=pointer]:
                - generic [ref=e915]:
                  - img [ref=e916]
                  - text: Adjuntar archivo
                - text: routing-primary-showcase_attachment · attachment
              - generic "routing-primary-showcase_approve" [ref=e918] [cursor=pointer]:
                - button "Aprobar" [ref=e921]:
                  - img [ref=e922]
                  - text: Aprobar
                - text: routing-primary-showcase_approve · approve
              - generic "Solo lectura" [ref=e924] [cursor=pointer]:
                - generic [ref=e926]: Nota informativa
                - text: solo lectura
              - generic "routing-primary-showcase_decline" [ref=e927] [cursor=pointer]:
                - button "Rechazar" [ref=e930]:
                  - img [ref=e931]
                  - text: Rechazar
                - text: routing-primary-showcase_decline · decline
              - generic "routing-primary-showcase_title" [ref=e934] [cursor=pointer]: routing-primary-showcase_title · title
              - generic "routing-primary-showcase_emailaddress" [ref=e938] [cursor=pointer]: routing-primary-showcase_emailaddress · emailAddress
            - generic [ref=e942]:
              - generic "routing-primary-showcase_company" [ref=e944] [cursor=pointer]: routing-primary-showcase_company · company
              - generic "routing-primary-showcase_fullname" [ref=e948] [cursor=pointer]: routing-primary-showcase_fullname · fullName
              - generic "routing-primary-showcase_table" [ref=e952] [cursor=pointer]:
                - generic [ref=e953]:
                  - generic [ref=e957]: Name
                  - generic [ref=e961]: City
                  - generic [ref=e965]: Description
                  - generic [ref=e969]: Alice
                  - generic [ref=e977]: New York
                  - generic [ref=e985]: Alice is a freelance web designer and developer
                  - generic [ref=e993]: Bob
                  - generic [ref=e1001]: Paris
                  - generic [ref=e1009]: Bob is a freelance illustrator and graphic designer
                - text: routing-primary-showcase_table · table
              - generic "routing-primary-showcase_date" [ref=e1014] [cursor=pointer]: routing-primary-showcase_date · date
              - generic "routing-primary-showcase_datetime" [ref=e1018] [cursor=pointer]: routing-primary-showcase_datetime · dateTime
              - generic "routing-primary-showcase_time" [ref=e1022] [cursor=pointer]: routing-primary-showcase_time · time
            - generic [ref=e1026]:
              - generic "Solo lectura" [ref=e1028] [cursor=pointer]:
                - generic [ref=e1031]: 08/07/2026
                - text: solo lectura
              - generic "routing-primary-showcase_signature" [ref=e1032] [cursor=pointer]: routing-primary-showcase_signature · signature
              - generic "routing-primary-showcase_initials" [ref=e1035] [cursor=pointer]: routing-primary-showcase_initials · initials
              - generic "routing-primary-showcase_code128" [ref=e1038] [cursor=pointer]:
                - img [ref=e1041]
                - text: routing-primary-showcase_code128 · code128
              - generic "routing-primary-showcase_code39" [ref=e1042] [cursor=pointer]:
                - img [ref=e1045]
                - text: routing-primary-showcase_code39 · code39
              - generic "routing-primary-showcase_ean13" [ref=e1046] [cursor=pointer]:
                - img [ref=e1049]
                - text: routing-primary-showcase_ean13 · ean13
            - generic "routing-primary-showcase_ean8" [ref=e1052] [cursor=pointer]:
              - img [ref=e1055]
              - text: routing-primary-showcase_ean8 · ean8
      - status [ref=e1076]
  - region "Resultados":
    - button "Resultados Colapsado" [ref=e1077] [cursor=pointer]:
      - text: Resultados
      - generic [ref=e1078]: Colapsado
``​`
```

<a id="file-0212"></a>

### 0212 — `ai/task-cards/active/TASK-DOCS-001-ai-architecture-install.md`

- **Lenguaje:** `markdown`
- **Líneas:** `21`
- **Tamaño original:** `0.5 KB`
- **SHA1 corto:** `f2f3ba2c11`
- **Estado:** `completo`

```markdown
# TASK-DOCS-001 — Instalar arquitectura IA unificada

## Objetivo

Instalar carpeta `ai/` como fuente de verdad y adaptar Codex, Claude y Copilot con archivos puente.

## Alcance

- Copiar estructura `ai/`.
- Mantener `AGENTS.md`, `CLAUDE.md`, `.github/copilot-instructions.md` como adaptadores.
- No eliminar documentación antigua aún.

## Validación

- `ai/start/START.md` existe.
- `AGENTS.md` apunta a `ai/start/START.md`.
- No hay reglas duplicadas extensas en adaptadores.

## No tocar

Código de runtime.
```

<a id="file-0213"></a>

### 0213 — `ai/task-cards/backlog/TASK-CANVAS-001-protect-canvas-overflow.md`

- **Lenguaje:** `markdown`
- **Líneas:** `5`
- **Tamaño original:** `0.2 KB`
- **SHA1 corto:** `b627c8aae1`
- **Estado:** `completo`

```markdown
# TASK-CANVAS-001 — Proteger overflow/scroll de Canvas post Tailwind

## Objetivo

Verificar que utilidades Tailwind no pisen `overflow:auto`, height, scale o page geometry.
```

<a id="file-0214"></a>

### 0214 — `ai/task-cards/backlog/TASK-CSS-001-tailwind-regression-stabilization.md`

- **Lenguaje:** `markdown`
- **Líneas:** `22`
- **Tamaño original:** `0.6 KB`
- **SHA1 corto:** `d84b87ba9a`
- **Estado:** `completo`

```markdown
# TASK-CSS-001 — Estabilizar regresiones Tailwind

## Objetivo

Usar `public/img-version` como baseline para corregir regresiones visuales introducidas por la migración Tailwind.

## Archivos candidatos

``​`txt
src/style.css
src/styles/tailwind.css
src/styles/sisad-tailwind-bridge.css
src/features/pdfcomponent/labRoutes.css
src/features/pdfcomponent/PageHeader.jsx
src/features/pdfcomponent/PdfmeLabPage.jsx
src/features/pdfcomponent/ResultsPanel.jsx
src/sisad-pdfme/ui/styles/*.css
``​`

## No tocar

Moveable, Selecto, geometry, snapshot, generator/pdf-lib.
```

<a id="file-0215"></a>

### 0215 — `ai/task-cards/backlog/TASK-VISUAL-001-img-version-baseline.md`

- **Lenguaje:** `markdown`
- **Líneas:** `12`
- **Tamaño original:** `0.3 KB`
- **SHA1 corto:** `17d6a2d828`
- **Estado:** `completo`

```markdown
# TASK-VISUAL-001 — Inventario baseline public/img-version

## Objetivo

Inventariar imágenes de `public/img-version`, crear contact sheet y reporte de intención visual.

## Salida

``​`txt
reports/tailwind-migration/img-version-baseline-inventory.md
reports/tailwind-migration/img-version-contact-sheet.jpg
``​`
```

<a id="file-0216"></a>

### 0216 — `ai/task-cards/completed/README.md`

- **Lenguaje:** `markdown`
- **Líneas:** `3`
- **Tamaño original:** `0.1 KB`
- **SHA1 corto:** `cadc8883fb`
- **Estado:** `completo`

```markdown
# Completed Task Cards

Mover aquí task-cards completadas con reporte final.
```

<a id="file-0217"></a>

### 0217 — `.tailwind-migration-backups/20260708-111736/reports/tailwind-migration/README.md`

- **Lenguaje:** `markdown`
- **Líneas:** `76`
- **Tamaño original:** `3.4 KB`
- **SHA1 corto:** `c58b615818`
- **Estado:** `completo`

```markdown
# Tailwind Migration Report

Fecha: 2026-07-08T16:17:35.937Z
Modo: apply
Root: /Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin

## Objetivo

Migración incremental de diseños a Tailwind preservando comportamiento, canvas, geometría, Moveable, Selecto, snapshot y metadata.

## Archivos creados/actualizados

- mkdir reports/tailwind-migration
- mkdir reports/tailwind-migration/candidates
- backup package.json -> .tailwind-migration-backups/20260708-111735/package.json
- update package.json
- update tailwind.config.js
- update postcss.config.js
- mkdir src/styles
- update src/styles/tailwind.css
- update src/styles/sisad-tailwind-bridge.css
- backup src/main.jsx -> .tailwind-migration-backups/20260708-111735/src/main.jsx
- update src/main.jsx
- update reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__tokens.tailwind.candidate.css
- update reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__sisad-pdfme-global.tailwind.candidate.css
- update reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__canvas-interactions.tailwind.candidate.css
- update reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__sisad-pdfme-runtime.tailwind.candidate.css
- update reports/tailwind-migration/candidates/features__pdfcomponent__labRoutes.tailwind.candidate.css

## Candidatos CSS generados

- src/sisad-pdfme/ui/styles/tokens.css → reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__tokens.tailwind.candidate.css
  - bloques convertidos: 0
  - declaraciones manuales/unsupported: 0
- src/sisad-pdfme/ui/styles/sisad-pdfme-global.css → reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__sisad-pdfme-global.tailwind.candidate.css
  - bloques convertidos: 772
  - declaraciones manuales/unsupported: 1814
- src/sisad-pdfme/ui/styles/canvas-interactions.css → reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__canvas-interactions.tailwind.candidate.css
  - bloques convertidos: 176
  - declaraciones manuales/unsupported: 508
- src/sisad-pdfme/ui/styles/sisad-pdfme-runtime.css → reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__sisad-pdfme-runtime.tailwind.candidate.css
  - bloques convertidos: 65
  - declaraciones manuales/unsupported: 88
- src/features/pdfcomponent/labRoutes.css → reports/tailwind-migration/candidates/features__pdfcomponent__labRoutes.tailwind.candidate.css
  - bloques convertidos: 203
  - declaraciones manuales/unsupported: 435

## Advertencias

- Dependencias Tailwind no instaladas. Ejecuta con --install para instalar tailwindcss postcss autoprefixer.

## Próximo paso recomendado

1. Ejecutar la app y validar /lab/multi-document-routing.
2. Comparar visualmente Designer, Form, Viewer y PDF.
3. Migrar por task-card, no todo de golpe.
4. Mantener classNames existentes hasta que Playwright confirme comportamiento.
5. No reemplazar reglas de canvas, Moveable, Selecto ni geometría por Tailwind sin evidencia.

## Validación manual mínima

- Designer mantiene grid, sidebars, toolbar, zoom y selección.
- Form/Viewer siguen filtrando por recipient activo.
- CheckboxGroup/RadioGroup no muestran labels técnicos no deseados.
- Attachment, image, svg, barcode y table conservan comportamiento.
- Página 2+ conserva coordenadas, overlays y toolbar.
- PDF generado no imprime chrome/fondos no deseados.

## Archivos que NO deben tocarse solo por diseño

- Moveable.tsx
- Selecto.tsx
- designerCoordinateService.ts
- schemaCollision.ts
- snapshotAdapter.ts
- generator/pdf-lib
```

---

## Prompt sugerido para IA

```text
Analiza este contexto de proyecto. Primero identifica arquitectura, rutas críticas, dependencias y posibles riesgos. Luego responde únicamente con cambios accionables, citando rutas relativas exactas. No inventes archivos no presentes en la tabla. Si falta contexto, indícalo explícitamente.
```
