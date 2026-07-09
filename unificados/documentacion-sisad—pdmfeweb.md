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
- **Fecha generación:** `2026-07-09T14:57:26.715Z`
- **Extensiones incluidas:** `.md, .mdx`
- **Archivos candidatos incluidos:** `232`
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
├── plan-tailwind-completo-actualizado-sisad-pdfme.md
├── README.md
├── reports
│   └── tailwind-migration
│       ├── baseline-regression-audit.md
│       ├── component-migration-ledger.md
│       ├── deep-density-spacing-audit.md
│       ├── img-version-baseline-inventory.md
│       ├── line-by-line-style-audit.md
│       ├── pending-phases-progress.md
│       ├── README.md
│       ├── right-sidebar-scroll-tailwind-fix.md
│       ├── right-sidebar-tailwind-only-density-fix.md
│       ├── rightsidebar-detailview-tailwind-audit.md
│       ├── runtime-form-viewer-tailwind-audit.md
│       ├── schema-chrome-tailwind-audit.md
│       ├── tc-css-04-left-sidebar-tailwind.md
│       ├── tc-css-08-control-bar-toolbar-tailwind.md
│       ├── tc-css-10-schemas-visual.md
│       ├── tc-css-11-lab-audit.md
│       ├── tc-css-ownership-color.md
│       ├── ui-styles-decommission-audit.md
│       └── ui-styles-decommission-progress.md
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
| 93 | `plan-tailwind-completo-actualizado-sisad-pdfme.md` | markdown | 1118 | 99.4 | completo |
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
| 208 | `reports/tailwind-migration/component-migration-ledger.md` | markdown | 62 | 5.1 | completo |
| 209 | `reports/tailwind-migration/deep-density-spacing-audit.md` | markdown | 105 | 9.6 | completo |
| 210 | `reports/tailwind-migration/img-version-baseline-inventory.md` | markdown | 14 | 2.6 | completo |
| 211 | `reports/tailwind-migration/line-by-line-style-audit.md` | markdown | 227 | 21.6 | completo |
| 212 | `reports/tailwind-migration/pending-phases-progress.md` | markdown | 10 | 1.9 | completo |
| 213 | `reports/tailwind-migration/README.md` | markdown | 76 | 4.6 | completo |
| 214 | `reports/tailwind-migration/right-sidebar-scroll-tailwind-fix.md` | markdown | 45 | 3.4 | completo |
| 215 | `reports/tailwind-migration/right-sidebar-tailwind-only-density-fix.md` | markdown | 34 | 3.2 | completo |
| 216 | `reports/tailwind-migration/rightsidebar-detailview-tailwind-audit.md` | markdown | 13 | 2.3 | completo |
| 217 | `reports/tailwind-migration/runtime-form-viewer-tailwind-audit.md` | markdown | 20 | 1.4 | completo |
| 218 | `reports/tailwind-migration/schema-chrome-tailwind-audit.md` | markdown | 18 | 1.3 | completo |
| 219 | `reports/tailwind-migration/tc-css-04-left-sidebar-tailwind.md` | markdown | 45 | 2.8 | completo |
| 220 | `reports/tailwind-migration/tc-css-08-control-bar-toolbar-tailwind.md` | markdown | 43 | 2.5 | completo |
| 221 | `reports/tailwind-migration/tc-css-10-schemas-visual.md` | markdown | 33 | 3.7 | completo |
| 222 | `reports/tailwind-migration/tc-css-11-lab-audit.md` | markdown | 31 | 1.2 | completo |
| 223 | `reports/tailwind-migration/tc-css-ownership-color.md` | markdown | 38 | 4.0 | completo |
| 224 | `reports/tailwind-migration/ui-styles-decommission-audit.md` | markdown | 57 | 5.6 | completo |
| 225 | `reports/tailwind-migration/ui-styles-decommission-progress.md` | markdown | 25 | 1.6 | completo |
| 226 | `test-results/standard-fields-standard-f-c4dc3-s-the-expected-schema-types-chromium/error-context.md` | markdown | 576 | 28.7 | completo |
| 227 | `ai/task-cards/active/TASK-DOCS-001-ai-architecture-install.md` | markdown | 21 | 0.5 | completo |
| 228 | `ai/task-cards/backlog/TASK-CANVAS-001-protect-canvas-overflow.md` | markdown | 5 | 0.2 | completo |
| 229 | `ai/task-cards/backlog/TASK-CSS-001-tailwind-regression-stabilization.md` | markdown | 22 | 0.6 | completo |
| 230 | `ai/task-cards/backlog/TASK-VISUAL-001-img-version-baseline.md` | markdown | 12 | 0.3 | completo |
| 231 | `ai/task-cards/completed/README.md` | markdown | 3 | 0.1 | completo |
| 232 | `.tailwind-migration-backups/20260708-111736/reports/tailwind-migration/README.md` | markdown | 76 | 3.4 | completo |

## Resumen de exclusiones

- **extensión no incluida:** 1481
- **directorio ignorado: dependencia/build/salida generada:** 7

## Totales

- **KB originales candidatos:** `291.8`
- **KB incluidos en contenido:** `291.5`
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

### 0093 — `plan-tailwind-completo-actualizado-sisad-pdfme.md`

- **Lenguaje:** `markdown`
- **Líneas:** `1118`
- **Tamaño original:** `99.4 KB`
- **SHA1 corto:** `14b8faa08b`
- **Estado:** `completo`

```markdown
# Plan maestro actualizado — Migración completa CSS puro → Tailwind para SISAD PDFME

Fecha de actualización: 2026-07-09 03:30


## 1. Propósito

Este documento actualiza el plan de migración CSS puro → Tailwind tomando en cuenta:

- El contexto completo de código React/Vite (`codigo-frontend-sisad—pdmfe.md`).
- La documentación y arquitectura AI/docs (`documentacion-sisad—pdmfeweb.md`).
- El inventario CSS/Tailwind y candidatos (`styles-sisad—pdmfe.md`).
- Las regresiones visuales vistas durante la migración: header, rightSlot, RightSidebar, LeftSidebar, canvas-first, resultados y overlays.
- La necesidad de seguir migrando **cada componente JSX/TSX** sin afectar la visualización ni romper canvas, Moveable, Selecto, snapshot, runtime ni PDF.

El objetivo no es “pasar todo a Tailwind” de forma mecánica. El objetivo es **reducir CSS legacy de manera medible, conservar el baseline visual y aplicar Tailwind por capas seguras**.


## 2. Fuentes analizadas

| Archivo subido | Perfil | Fecha | Archivos incluidos | Observación |
|---|---:|---:|---:|---|
| `codigo-frontend-sisad—pdmfe.md` | React/Vite código | 2026-07-09T03:22:40.019Z | 481 | Base para matriz de JSX/TSX/JS/TS. Incluye 481 candidatos y marca varios como omitidos por presupuesto. |
| `documentacion-sisad—pdmfeweb.md` | Markdown/docs/IA | 2026-07-09T03:22:39.516Z | 217 | Base para actualizar plan, task-cards, memoria, reglas y separación `docs/` vs `ai/`. |
| `styles-sisad—pdmfe.md` | CSS/Tailwind | 2026-07-09T03:22:40.398Z | 18 | Base para decisiones CSS: Tailwind entry, bridge, candidatos, CSS activo y legacy. |


### 2.1 Métrica de acciones detectadas en código

| Acción | Cantidad de archivos |
|---|---:|
| `NO_VISUAL_MIGRATION` | 170 |
| `DO_NOT_MIGRATE` | 160 |
| `NO_VISUAL_OR_SPLIT` | 24 |
| `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | 22 |
| `MIGRATE_SCHEMA_VISUAL_SAFE` | 13 |
| `SPLIT_RULE_MIGRATE_SKIN_ONLY` | 13 |
| `KEEP_GEOMETRY_MIGRATE_SKIN_ONLY` | 7 |
| `MIGRATE_VISUAL_SAFE` | 7 |
| `MIGRATE_RIGHT_SIDEBAR_LIST_VISUAL` | 7 |
| `MIGRATE_LEFT_SIDEBAR_VISUAL` | 6 |
| `MIGRATE_JSX` | 5 |
| `KEEP_GEOMETRY_MIGRATE_MINIMAL_SKIN` | 5 |
| `MIGRATE_RIGHT_SIDEBAR_SHELL_VISUAL` | 5 |
| `KEEP_LEGACY_GEOMETRY` | 5 |
| `STABILIZE_AND_MIGRATE_JSX` | 4 |
| `MIGRATE_RUNTIME_UI_SKIN` | 4 |
| `DO_NOT_VISUAL_MIGRATE_NOW` | 3 |
| `REVIEW_BEFORE_MIGRATE` | 3 |
| `CONFIG_OR_SCRIPT_ONLY` | 2 |
| `CONFIG_VERIFY_OR_FIX` | 1 |
| `SPLIT_RULE_NEEDS_TASK_CARD` | 1 |


### 2.2 Métrica por capa

| Capa | Cantidad de archivos |
|---|---:|
| PDF/Generator | 158 |
| Core library | 56 |
| Schemas registry | 52 |
| Designer shared logic | 27 |
| Schemas logic/pdf | 24 |
| RightSidebar DetailView | 22 |
| UI logic/theme | 17 |
| Schemas visual/runtime | 13 |
| Canvas overlay skins | 13 |
| Lab data/builders | 8 |
| Converter | 8 |
| Runtime/Paper/Renderer | 7 |
| Designer dialogs/tools | 7 |
| RightSidebar ListView | 7 |
| LeftSidebar visual | 6 |
| Lab landing/host | 5 |
| Canvas core/chrome | 5 |
| RightSidebar shell/rails | 5 |
| Canvas overlay logic | 5 |
| Lab shell canvas-first | 4 |
| Runtime/UI chrome | 4 |
| Public UI entrypoints | 3 |
| Config/scripts/tests | 2 |
| Runtime component | 2 |
| Canvas Moveable/Selecto | 2 |
| Infra Tailwind | 1 |
| Designer shell | 1 |
| Designer other | 1 |
| LeftSidebar state | 1 |
| RightSidebar helpers | 1 |


## 3. Hallazgos críticos que faltaban cubrir

### 3.1 El plan anterior era fuerte en fases, pero débil en ledger por archivo

Faltaba una matriz viva que diga para cada `jsx/tsx/js/ts`:

- si se migra a Tailwind JSX;
- si se migra al bridge;
- si se conserva en CSS legacy;
- si se prohíbe tocar;
- qué test/captura valida ese cambio.

Este documento agrega la matriz completa en el apéndice.

### 3.2 Los candidatos CSS no son implementación directa

Los archivos `reports/tailwind-migration/candidates/*.candidate.css` son útiles para auditoría, pero no deben reemplazar CSS real sin revisión porque contienen declaraciones `Unsupported/manual` y algunas estructuras generadas. La migración debe usar esos candidatos como mapa, no como parche automático.

### 3.3 El bridge debe seguir a nivel raíz

`src/styles/sisad-tailwind-bridge.css` debe mantener `@apply` a nivel raíz. No envolverlo en `@layer components` porque muchas clases se generan dinámicamente o dependen de `data-*`. Si Tailwind no detecta esas clases, puede purgar reglas necesarias.

### 3.4 El Header ya fue parcialmente corregido, pero requiere estabilización visual

Se reubicó la colaboración al `PageHeader`, pero falta:

- visual del select/botones como sistema soft UI;
- validación responsive en 1366/1440/1600;
- que no reaparezcan controles nativos con borde negro;
- que `PageHeader` no supere 52px salvo navegación del navegador.

### 3.5 RightSidebar sigue siendo el siguiente bloqueo visual

Las capturas muestran que `RightSidebar` tiene header/list toolbar roto o comprimido. Es el siguiente foco antes de tocar overlays/canvas.

### 3.6 No se debe volver a pedir “continúa con todo”

A partir de ahora cada intervención debe tener una task-card única. Pedir “no pares hasta terminar todo” aumenta el riesgo de que Codex toque canvas, CSS legacy y sidebars en un solo diff.


## 4. Contrato de capas

| Capa | Migración permitida | Prohibido |
|---|---|---|
| `features/pdfcomponent` landing | Tailwind JSX directo | tocar editor core |
| `features/pdfcomponent` canvas-first shell | Tailwind JSX + `labRoutes.css` para layout complejo | wrappers que roben espacio al canvas |
| `LeftSidebar` | Tailwind JSX/bridge para tabs/search/cards | romper drag/drop/data attrs |
| `RightSidebar` | Tailwind JSX/bridge para tabs/list/detail skins | romper selección, rename, filtros, command updates |
| Canvas core | solo skin mínimo validado | overflow, transform, zoom, page geometry |
| Canvas overlays | split skin vs geometry | position/transform/z-index arbitrario |
| Schemas visual | uiRender/propPanel skin seguro | metadata, values, pdfRender |
| Runtime Form/Viewer | skin limpio por modo | chrome de diseñador en PDF |
| Generator/pdf-lib | no migrar | cualquier Tailwind |
| Tokens | conservar/tokenizar | borrar variables runtime |


## 5. CSS: estado actual y decisión por archivo

| Archivo CSS | Líneas | Estado | Decisión |
|---|---:|---|---|
| `src/styles/tailwind.css` | 11 | completo | `KEEP_SINGLE_TAILWIND_ENTRY` |
| `src/style.css` | 11 | completo | `KEEP_NEUTRALIZED` |
| `src/styles/sisad-tailwind-bridge.css` | 502 | completo | `MIGRATE_BRIDGE_TOP_LEVEL` |
| `reports/tailwind-migration/candidates/features__pdfcomponent__labRoutes.tailwind.candidate.css` | 1600 | completo | `REFERENCE_ONLY_DO_NOT_APPLY_BLINDLY` |
| `reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__canvas-interactions.tailwind.candidate.css` | 1547 | completo | `REFERENCE_ONLY_DO_NOT_APPLY_BLINDLY` |
| `reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__sisad-pdfme-global.tailwind.candidate.css` | 6417 | truncado 75.1 KB | `REFERENCE_ONLY_DO_NOT_APPLY_BLINDLY` |
| `reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__sisad-pdfme-runtime.tailwind.candidate.css` | 443 | completo | `REFERENCE_ONLY_DO_NOT_APPLY_BLINDLY` |
| `reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__tokens.tailwind.candidate.css` | 8 | completo | `REFERENCE_ONLY_DO_NOT_APPLY_BLINDLY` |
| `src/features/pdfcomponent/labRoutes.css` | 1684 | completo | `SPLIT_LAB_LAYOUT_AND_MIGRATE_BY_COMPONENT` |
| `src/sisad-pdfme/ui/styles/canvas-interactions.css` | 1492 | completo | `SPLIT_SKIN_VS_GEOMETRY` |
| `src/sisad-pdfme/ui/styles/sisad-pdfme-global.css` | 6390 | truncado 75.6 KB | `ACTIVE_LEGACY_SPLIT_BY_DOMAIN` |
| `src/sisad-pdfme/ui/styles/sisad-pdfme-runtime.css` | 240 | completo | `KEEP_RUNTIME_RULES_SPLIT_SKIN_ONLY` |
| `src/sisad-pdfme/ui/styles/tokens.css` | 374 | completo | `KEEP_TOKENS` |


## 6. Reglas de decisión por tipo de archivo

### MIGRATE_JSX

Usar en componentes visuales aislados:

- landing;
- cards;
- botones;
- filtros;
- popovers simples;
- empty states;
- headers internos no geométricos.

### MIGRATE_BRIDGE

Usar para classNames existentes que aparecen en muchos sitios:

- sidebars;
- list rows;
- control bar visual;
- inspector sections;
- runtime controls;
- Ant Design skin overrides.

### KEEP_LEGACY

Mantener en CSS legacy:

- paper geometry;
- page stacking;
- scroll canvas;
- transform/zoom;
- Moveable/Selecto;
- keyframes críticos;
- `color-mix` con variables runtime;
- `data-*` complejos;
- print/PDF.

### SPLIT_RULE

Aplicar cuando un selector mezcla:

- layout + visual;
- position + skin;
- z-index + shadow;
- pointer-events + border;
- geometry + typography.


## 7. Prompt de arranque actualizado para Codex/Claude/Copilot

``​`txt
Actúa como arquitecto frontend senior experto en React, Vite, Tailwind CSS, CSS cascade, editores PDF/canvas, pdfme, Moveable, Selecto, Ant Design, baseline visual y migración incremental segura.

Proyecto:
``​`txt
/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin
``​`

Plan obligatorio:
``​`txt
/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/plan-maestro-migracion-tailwind-sisad-pdfme.md
``​`

Baseline visual obligatorio:
``​`txt
/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/public/img-version
``​`

## Reglas de arranque obligatorias

1. Antes de editar, ejecuta:
``​`bash
git status --short
sed -n '1,240p' plan-maestro-migracion-tailwind-sisad-pdfme.md
find public/img-version -maxdepth 2 -type f \( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.webp" \) | sort
``​`

2. Carga contexto mínimo:
``​`bash
test -f ai/start/START.md && sed -n '1,180p' ai/start/START.md
test -f ai/router/ROUTER.md && sed -n '1,180p' ai/router/ROUTER.md
test -f ai/router/CONTEXT_BUDGET.md && sed -n '1,180p' ai/router/CONTEXT_BUDGET.md
test -f reports/tailwind-migration/line-by-line-style-audit.md && sed -n '1,260p' reports/tailwind-migration/line-by-line-style-audit.md
``​`

3. Selecciona exactamente una task-card. No mezcles fases. No “continúes con todo”.
4. Usa `rg` para localizar clases y componentes reales. No asumas nombres.
5. Si tocas JSX/TSX, decide si el estilo va a:
   - `className` Tailwind directo;
   - `src/styles/sisad-tailwind-bridge.css`;
   - CSS legacy con comentario `KEEP`;
   - o task-card separada.
6. No tocar Canvas/Moveable/Selecto/generator/pdf-lib salvo task-card explícita.
7. Genera captura antes/después cuando el cambio sea visual.
8. Ejecuta build/lint si aplica.
9. Responde con `git status --short` y lista solo archivos realmente modificados.

## Contratos no negociables

No tocar:
``​`txt
src/sisad-pdfme/ui/components/Designer/Canvas/Moveable.tsx
src/sisad-pdfme/ui/components/Designer/Canvas/Selecto.tsx
src/sisad-pdfme/ui/components/Designer/shared/designerCoordinateService.ts
src/sisad-pdfme/ui/components/Designer/shared/coordinateMath.ts
src/sisad-pdfme/ui/components/Designer/shared/schemaCollision.ts
src/sisad-pdfme/shared/snapshotAdapter.ts
src/sisad-pdfme/generator/**
src/sisad-pdfme/pdf-lib/**
``​`

No migrar a Tailwind:
``​`txt
x/y/width/height/rotation
zoom/transform/scale
paper geometry/page stacking
getBoundingClientRect
Moveable/Selecto selectors
data-schema-id/data-option-id hit-testing
snapshot metadata
pdfRender
``​`

## Formato de cierre

``​`md
# Resultado

## Task-card ejecutada
## Archivos modificados reales
## Decisión Tailwind por archivo
## CSS legacy conservado y motivo
## Validación DOM
## Capturas generadas
## Build/Lint
## Riesgos residuales
## Siguiente task-card recomendada
``​`
``​`


## 8. Task-cards actualizadas para continuar la migración

### TC-CSS-00 — Baseline, ledger e infraestructura viva
**Objetivo:** mantener congelado el baseline visual y crear un registro por componente antes de seguir migrando.
**Archivos:** `public/img-version`, `reports/tailwind-migration/*`, `src/style.css`, `src/styles/tailwind.css`, `tailwind.config.js`, `postcss.config.*`, `src/main.jsx`.
**Salida requerida:**
- `reports/tailwind-migration/component-migration-ledger.md`
- `reports/tailwind-migration/current-screenshots/*`
- Confirmación de `preflight:false`, una sola fuente Tailwind y bridge importado una vez.

### TC-CSS-01A — Header canvas-first estabilizado
**Estado:** iniciado.
**Objetivo:** el header no debe robar altura ni mostrar controles nativos.
**Archivos:** `PageHeader.jsx`, `PdfmeLabPage.jsx`, `CompactControls.jsx`, `labRoutes.css`.
**Pendiente:** pulir `rightSlot` visual, quitar bordes negros nativos, validar 1366/1440/1600 px.

### TC-CSS-01B — ResultsPanel como drawer no invasivo
**Objetivo:** que `Resultados` no tape toolbar ni canvas.
**Archivos:** `ResultsPanel.jsx`, `labRoutes.css`.
**Regla:** cerrado = pill; abierto = drawer compacto `max-height:min(300px,38dvh)`.

### TC-CSS-02 — Landing/CaseCard/Primitives Tailwind JSX
**Objetivo:** completar migración segura del catálogo sin tocar editor.
**Archivos:** `LabLandingPage.jsx`, `CaseCard.jsx`, `LabExampleDownloadButton.jsx`, `PopoverMenu.jsx`, `ui/primitives.jsx`.
**Regla:** Tailwind JSX directo permitido.

### TC-CSS-03 — Bridge base sin `@layer`
**Objetivo:** consolidar skins comunes en `src/styles/sisad-tailwind-bridge.css`.
**Regla:** bridge a nivel raíz, no dentro de `@layer components`, para evitar purge sobre clases dinámicas/data-*.

### TC-CSS-04 — LeftSidebar baseline
**Objetivo:** restaurar estética de `public/img-version`: panel blanco flotante, tabs cápsula, search pill, filtros, categorías uppercase, cards con icono centrado.
**Archivos:** `LeftSidebar*.tsx`, `PluginIcon.tsx`, `sisad-tailwind-bridge.css`, CSS legacy relacionado.
**Validación:** drag/drop, filtros, favoritos, recientes, vista compact/rich.

### TC-CSS-05 — RightSidebar ListView
**Objetivo:** corregir header superior roto/cortado, tabs, búsqueda, filtro, rows, selección y badges.
**Archivos:** `RightSidebar/ListView/**`, `RightSidebar/layout.tsx`, `RightSidebar/RightSidebar.tsx`, `SidebarSurfacePrimitives.tsx`.
**Regla:** no romper selección, rename, filtro, dnd.

### TC-CSS-06 — RightSidebar DetailView/Inspector
**Objetivo:** migrar cards, secciones, inputs, alineadores y widgets a skin compacta.
**Archivos:** `RightSidebar/DetailView/**`.
**Regla:** preservar command updates y contratos de inspector.

### TC-CSS-07 — Rails de documentos/comentarios
**Objetivo:** `DocumentsRail` y `CommentsRail` consistentes con baseline.
**Archivos:** `DocumentsRail.tsx`, `CommentsRail.tsx`, `RightSidebar.tsx`.
**Validación:** documentos, comentarios, empty states.

### TC-CSS-08 — Control bar y toolbar contextual
**Objetivo:** migrar visual de `CtlBar`, `SelectionContextToolbar`, `CanvasContextMenu` sin tocar posición crítica.
**Archivos:** `CtlBar.tsx`, `Canvas/overlays/*Toolbar*`, `CanvasContextMenu.tsx`, `canvasContextMenuActions.tsx`, `canvas-interactions.css`.
**Regla:** position/transform/z-index legacy/tokens; solo skin en Tailwind/bridge.

### TC-CSS-09 — Canvas overlay skins
**Objetivo:** drag preview, drop placeholder, commit flash, snap feedback, inline edit y comments pins.
**Regla:** no tocar `pointerGeometry`, `floatingSurfaceGeometry`, `smartPlacement`, ni `useFloatingToolbarPosition`.

### TC-CSS-10 — Field chrome por modo
**Objetivo:** separar Designer/Form/Viewer/PDF para que PDF no imprima chrome.
**Archivos:** `fieldChrome.ts`, `renderSchemaWithChrome.ts`, `schemaDom.ts`, `schemas/**/uiRender.ts`.
**Regla:** no tocar `pdfRender` salvo bug separado.

### TC-CSS-11 — Schemas visual parity
**Objetivo:** text, number, checkbox, groups, select, signing, action, media, table y shapes con visual consistente.
**Archivos:** `schemas/**/uiRender.ts`, `schemas/options/*.tsx`, `schemas/*/propPanel.ts(x)`.
**Regla:** metadata y values intactos.

### TC-CSS-12 — Runtime Form/Viewer
**Objetivo:** runtime limpio, sin chrome de diseñador, con Tailwind seguro en skins.
**Archivos:** `Form.tsx`, `Viewer.tsx`, `Preview.tsx`, `Renderer.tsx`, `StaticSchema.tsx`, `sisad-pdfme-runtime.css`.

### TC-CSS-13 — Limpieza legacy medible
**Objetivo:** eliminar CSS duplicado solo con evidencia.
**Criterios:** `rg`, screenshot aprobado, tests, comentario `MIGRATED/KEEP/TODO`.


## 9. Secuencia recomendada de ejecución

### Sprint A — estabilización visual obligatoria

1. `TC-CSS-01A` Header visual polish.
2. `TC-CSS-05` RightSidebar ListView.
3. `TC-CSS-06` RightSidebar DetailView.
4. `TC-CSS-04` LeftSidebar baseline.
5. `TC-CSS-01B` ResultsPanel.

### Sprint B — migración visual controlada

6. `TC-CSS-02` Landing completa.
7. `TC-CSS-03` Bridge base.
8. `TC-CSS-08` Control bar/toolbar/context menu.
9. `TC-CSS-09` Canvas overlay skins.

### Sprint C — runtime/schema parity

10. `TC-CSS-10` Field chrome por modo.
11. `TC-CSS-11` Schema visual parity.
12. `TC-CSS-12` Runtime Form/Viewer.

### Sprint D — limpieza legacy

13. `TC-CSS-13` Eliminación medible.
14. Actualizar docs de theming.
15. Actualizar memoria IA y checklist.


## 10. Validación obligatoria por task-card

### 10.1 Comandos base

``​`bash
npm run build
npm run lint
``​`

Si existe:

``​`bash
npm run typecheck
npm run test
``​`

### 10.2 Capturas obligatorias

``​`txt
reports/tailwind-migration/current-screenshots/
``​`

Mínimo por cada task visual:

- antes;
- después;
- viewport 1366x900;
- viewport 1440x900;
- viewport 1600x1200 si aplica.

### 10.3 Rutas base

``​`txt
http://localhost:5174
http://localhost:5174/lab/basic-designer
http://localhost:5174/lab/multi-document-routing
http://localhost:5174/lab/generator-runtime
``​`

### 10.4 DOM checks clave

``​`js
document.querySelector('.sisad-pdfme-lab-page-hero + .sisad-pdfme-lab-collaboration-bar') === null
document.querySelector('.sisad-pdfme-lab-header-collaboration') !== null
``​`

Para RightSidebar:

``​`js
Array.from(document.querySelectorAll('.sisad-pdfme-designer-right-sidebar input, .sisad-pdfme-designer-right-sidebar select, .sisad-pdfme-designer-right-sidebar button'))
  .filter(el => {
    const r = el.getBoundingClientRect()
    const visible = r.width > 0 && r.height > 0
    const iconOnly = el.getAttribute('aria-label') && r.width <= 40
    return visible && !iconOnly && (r.height < 24 || r.width < 40)
  })
``​`

Debe devolver `[]` o justificar cada caso.


## 11. Archivos nuevos recomendados para control de migración

Crear o mantener:

``​`txt
reports/tailwind-migration/component-migration-ledger.md
reports/tailwind-migration/visual-regression-checkpoints.md
reports/tailwind-migration/current-screenshots/README.md
ai/task-cards/active/
ai/memory/changelog.md
ai/memory/pending-checklist.md
``​`

### 11.1 Formato de ledger

``​`md
| Archivo | Estado | Última task | Tailwind JSX | Bridge | Legacy KEEP | Captura | Build | Riesgo |
|---|---|---|---|---|---|---|---|---|
``​`


## 12. Criterio de salida de la migración completa

La migración se considera terminada cuando:

1. Cada archivo visual JSX/TSX tiene estado en ledger.
2. Cada selector legacy tiene comentario `MIGRATED`, `KEEP`, `TODO` o `DELETE`.
3. No hay doble emisión Tailwind.
4. No hay `@layer components` en bridge crítico dinámico.
5. No se toca Moveable/Selecto.
6. Canvas page 2+ funciona.
7. Multi-recipient no muta ownerColor.
8. Form/Viewer/Generator no imprimen chrome de diseñador.
9. Capturas comparadas contra `public/img-version`.
10. Build/lint/tests focales ejecutados.
11. Documentación `docs/09-theming` actualizada.
12. Memoria IA y checklist actualizados.


# Apéndice A — Matriz prioritaria de archivos visuales

| Archivo | Capa | Acción | Prioridad | Riesgo | Validación |
|---|---|---|---|---|---|
| `src/features/pdfcomponent/CaseCard.jsx` | Lab landing/host | `MIGRATE_JSX` | P2 | Bajo | landing + screenshots |
| `src/features/pdfcomponent/CompactControls.jsx` | Lab shell canvas-first | `STABILIZE_AND_MIGRATE_JSX` | P0/P1 | Medio | DOM + screenshot multi-document-routing |
| `src/features/pdfcomponent/LabExampleDownloadButton.jsx` | Lab landing/host | `MIGRATE_JSX` | P2 | Bajo | landing + screenshots |
| `src/features/pdfcomponent/LabLandingPage.jsx` | Lab landing/host | `MIGRATE_JSX` | P2 | Bajo | landing + screenshots |
| `src/features/pdfcomponent/PageHeader.jsx` | Lab shell canvas-first | `STABILIZE_AND_MIGRATE_JSX` | P0/P1 | Medio | DOM + screenshot multi-document-routing |
| `src/features/pdfcomponent/PdfmeLabPage.jsx` | Lab shell canvas-first | `STABILIZE_AND_MIGRATE_JSX` | P0/P1 | Medio | DOM + screenshot multi-document-routing |
| `src/features/pdfcomponent/PopoverMenu.jsx` | Lab landing/host | `MIGRATE_JSX` | P2 | Bajo | landing + screenshots |
| `src/features/pdfcomponent/ResultsPanel.jsx` | Lab shell canvas-first | `STABILIZE_AND_MIGRATE_JSX` | P0/P1 | Medio | DOM + screenshot multi-document-routing |
| `src/features/pdfcomponent/ui/primitives.jsx` | Lab landing/host | `MIGRATE_JSX` | P2 | Bajo | landing + screenshots |
| `src/sisad-pdfme/schemas/barcodes/propPanel.ts` | Schemas visual/runtime | `MIGRATE_SCHEMA_VISUAL_SAFE` | P5 | Medio/Alto | form/viewer/generator parity |
| `src/sisad-pdfme/schemas/barcodes/uiRender.ts` | Schemas visual/runtime | `MIGRATE_SCHEMA_VISUAL_SAFE` | P5 | Medio/Alto | form/viewer/generator parity |
| `src/sisad-pdfme/schemas/multiVariableText/propPanel.ts` | Schemas visual/runtime | `MIGRATE_SCHEMA_VISUAL_SAFE` | P5 | Medio/Alto | form/viewer/generator parity |
| `src/sisad-pdfme/schemas/multiVariableText/uiRender.ts` | Schemas visual/runtime | `MIGRATE_SCHEMA_VISUAL_SAFE` | P5 | Medio/Alto | form/viewer/generator parity |
| `src/sisad-pdfme/schemas/options/OptionListWidget.tsx` | Schemas visual/runtime | `MIGRATE_SCHEMA_VISUAL_SAFE` | P5 | Medio/Alto | form/viewer/generator parity |
| `src/sisad-pdfme/schemas/options/optionPropPanel.tsx` | Schemas visual/runtime | `MIGRATE_SCHEMA_VISUAL_SAFE` | P5 | Medio/Alto | form/viewer/generator parity |
| `src/sisad-pdfme/schemas/propPanel/commonInspectorFields.ts` | Schemas visual/runtime | `MIGRATE_SCHEMA_VISUAL_SAFE` | P5 | Medio/Alto | form/viewer/generator parity |
| `src/sisad-pdfme/schemas/propPanel/index.ts` | Schemas visual/runtime | `MIGRATE_SCHEMA_VISUAL_SAFE` | P5 | Medio/Alto | form/viewer/generator parity |
| `src/sisad-pdfme/schemas/signature/propPanel.ts` | Schemas visual/runtime | `MIGRATE_SCHEMA_VISUAL_SAFE` | P5 | Medio/Alto | form/viewer/generator parity |
| `src/sisad-pdfme/schemas/tables/propPanel.ts` | Schemas visual/runtime | `MIGRATE_SCHEMA_VISUAL_SAFE` | P5 | Medio/Alto | form/viewer/generator parity |
| `src/sisad-pdfme/schemas/tables/uiRender.ts` | Schemas visual/runtime | `MIGRATE_SCHEMA_VISUAL_SAFE` | P5 | Medio/Alto | form/viewer/generator parity |
| `src/sisad-pdfme/schemas/text/propPanel.ts` | Schemas visual/runtime | `MIGRATE_SCHEMA_VISUAL_SAFE` | P5 | Medio/Alto | form/viewer/generator parity |
| `src/sisad-pdfme/schemas/text/uiRender.ts` | Schemas visual/runtime | `MIGRATE_SCHEMA_VISUAL_SAFE` | P5 | Medio/Alto | form/viewer/generator parity |
| `src/sisad-pdfme/ui/components/CtlBar.tsx` | Runtime/UI chrome | `MIGRATE_RUNTIME_UI_SKIN` | P6 | Medio | viewer/designer smoke |
| `src/sisad-pdfme/ui/components/ErrorScreen.tsx` | Runtime/UI chrome | `MIGRATE_RUNTIME_UI_SKIN` | P6 | Medio | viewer/designer smoke |
| `src/sisad-pdfme/ui/components/Paper.tsx` | Runtime/Paper/Renderer | `KEEP_GEOMETRY_MIGRATE_SKIN_ONLY` | P6 | Alto | form/viewer/generator parity |
| `src/sisad-pdfme/ui/components/Preview.tsx` | Runtime/Paper/Renderer | `KEEP_GEOMETRY_MIGRATE_SKIN_ONLY` | P6 | Alto | form/viewer/generator parity |
| `src/sisad-pdfme/ui/components/Renderer.tsx` | Runtime/Paper/Renderer | `KEEP_GEOMETRY_MIGRATE_SKIN_ONLY` | P6 | Alto | form/viewer/generator parity |
| `src/sisad-pdfme/ui/components/Root.tsx` | Runtime/Paper/Renderer | `KEEP_GEOMETRY_MIGRATE_SKIN_ONLY` | P6 | Alto | form/viewer/generator parity |
| `src/sisad-pdfme/ui/components/Spinner.tsx` | Runtime/UI chrome | `MIGRATE_RUNTIME_UI_SKIN` | P6 | Medio | viewer/designer smoke |
| `src/sisad-pdfme/ui/components/StaticSchema.tsx` | Runtime/Paper/Renderer | `KEEP_GEOMETRY_MIGRATE_SKIN_ONLY` | P6 | Alto | form/viewer/generator parity |
| `src/sisad-pdfme/ui/components/UnitPager.tsx` | Runtime/UI chrome | `MIGRATE_RUNTIME_UI_SKIN` | P6 | Medio | viewer/designer smoke |
| `src/sisad-pdfme/ui/components/usePreviewRuntime.ts` | Runtime/Paper/Renderer | `KEEP_GEOMETRY_MIGRATE_SKIN_ONLY` | P6 | Alto | form/viewer/generator parity |
| `src/sisad-pdfme/ui/components/Designer/index.tsx` | Designer shell | `SPLIT_RULE_NEEDS_TASK_CARD` | P0/P6 | Alto | all editor smoke tests |
| `src/sisad-pdfme/ui/components/Designer/LeftSidebar.tsx` | LeftSidebar visual | `MIGRATE_LEFT_SIDEBAR_VISUAL` | P4 | Medio | drag/drop + screenshot |
| `src/sisad-pdfme/ui/components/Designer/LeftSidebarCustomFieldModal.tsx` | LeftSidebar visual | `MIGRATE_LEFT_SIDEBAR_VISUAL` | P4 | Medio | drag/drop + screenshot |
| `src/sisad-pdfme/ui/components/Designer/LeftSidebarCustomPanel.tsx` | LeftSidebar visual | `MIGRATE_LEFT_SIDEBAR_VISUAL` | P4 | Medio | drag/drop + screenshot |
| `src/sisad-pdfme/ui/components/Designer/LeftSidebarGroup.tsx` | LeftSidebar visual | `MIGRATE_LEFT_SIDEBAR_VISUAL` | P4 | Medio | drag/drop + screenshot |
| `src/sisad-pdfme/ui/components/Designer/LeftSidebarSearch.tsx` | LeftSidebar visual | `MIGRATE_LEFT_SIDEBAR_VISUAL` | P4 | Medio | drag/drop + screenshot |
| `src/sisad-pdfme/ui/components/Designer/LeftSidebarTabs.tsx` | LeftSidebar visual | `MIGRATE_LEFT_SIDEBAR_VISUAL` | P4 | Medio | drag/drop + screenshot |
| `src/sisad-pdfme/ui/components/Designer/PluginIcon.tsx` | Designer dialogs/tools | `MIGRATE_VISUAL_SAFE` | P6 | Medio | interaction smoke |
| `src/sisad-pdfme/ui/components/Designer/SchemaDropSetupModal.tsx` | Designer dialogs/tools | `MIGRATE_VISUAL_SAFE` | P6 | Medio | interaction smoke |
| `src/sisad-pdfme/ui/components/shared/usePaperRefRegistry.ts` | Runtime/Paper/Renderer | `KEEP_GEOMETRY_MIGRATE_SKIN_ONLY` | P6 | Alto | form/viewer/generator parity |
| `src/sisad-pdfme/ui/components/Designer/Canvas/Canvas.tsx` | Canvas core/chrome | `KEEP_GEOMETRY_MIGRATE_MINIMAL_SKIN` | P6/P0 guard | Alto | scroll/page2+/select |
| `src/sisad-pdfme/ui/components/Designer/Canvas/Guides.tsx` | Canvas core/chrome | `KEEP_GEOMETRY_MIGRATE_MINIMAL_SKIN` | P6/P0 guard | Alto | scroll/page2+/select |
| `src/sisad-pdfme/ui/components/Designer/Canvas/Mask.tsx` | Canvas core/chrome | `KEEP_GEOMETRY_MIGRATE_MINIMAL_SKIN` | P6/P0 guard | Alto | scroll/page2+/select |
| `src/sisad-pdfme/ui/components/Designer/Canvas/Padding.tsx` | Canvas core/chrome | `KEEP_GEOMETRY_MIGRATE_MINIMAL_SKIN` | P6/P0 guard | Alto | scroll/page2+/select |
| `src/sisad-pdfme/ui/components/Designer/Canvas/SnapLines.tsx` | Canvas core/chrome | `KEEP_GEOMETRY_MIGRATE_MINIMAL_SKIN` | P6/P0 guard | Alto | scroll/page2+/select |
| `src/sisad-pdfme/ui/components/Designer/Comments/CommentDialog.tsx` | Designer dialogs/tools | `MIGRATE_VISUAL_SAFE` | P6 | Medio | interaction smoke |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/CommentsRail.tsx` | RightSidebar shell/rails | `MIGRATE_RIGHT_SIDEBAR_SHELL_VISUAL` | P1/P5 | Medio | documents/comments/list/detail screenshots |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DocumentsRail.tsx` | RightSidebar shell/rails | `MIGRATE_RIGHT_SIDEBAR_SHELL_VISUAL` | P1/P5 | Medio | documents/comments/list/detail screenshots |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/layout.tsx` | RightSidebar shell/rails | `MIGRATE_RIGHT_SIDEBAR_SHELL_VISUAL` | P1/P5 | Medio | documents/comments/list/detail screenshots |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/RightSidebar.tsx` | RightSidebar shell/rails | `MIGRATE_RIGHT_SIDEBAR_SHELL_VISUAL` | P1/P5 | Medio | documents/comments/list/detail screenshots |
| `src/sisad-pdfme/ui/components/Designer/shared/keyboardShortcuts.ts` | Designer dialogs/tools | `MIGRATE_VISUAL_SAFE` | P6 | Medio | interaction smoke |
| `src/sisad-pdfme/ui/components/Designer/shared/useDesignerKeyboardShortcuts.ts` | Designer dialogs/tools | `MIGRATE_VISUAL_SAFE` | P6 | Medio | interaction smoke |
| `src/sisad-pdfme/ui/components/Designer/Shortcuts/ShortcutHelpButton.tsx` | Designer dialogs/tools | `MIGRATE_VISUAL_SAFE` | P6 | Medio | interaction smoke |
| `src/sisad-pdfme/ui/components/Designer/Shortcuts/ShortcutHelpPanel.tsx` | Designer dialogs/tools | `MIGRATE_VISUAL_SAFE` | P6 | Medio | interaction smoke |
| `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/CanvasContextMenu.tsx` | Canvas overlay skins | `SPLIT_RULE_MIGRATE_SKIN_ONLY` | P6 | Alto | hit-testing + screenshots |
| `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/canvasContextMenuActions.tsx` | Canvas overlay skins | `SPLIT_RULE_MIGRATE_SKIN_ONLY` | P6 | Alto | hit-testing + screenshots |
| `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/CanvasOverlayManager.tsx` | Canvas overlay skins | `SPLIT_RULE_MIGRATE_SKIN_ONLY` | P6 | Alto | hit-testing + screenshots |
| `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/CanvasStateOverlay.tsx` | Canvas overlay skins | `SPLIT_RULE_MIGRATE_SKIN_ONLY` | P6 | Alto | hit-testing + screenshots |
| `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/CommentsOverlay.tsx` | Canvas overlay skins | `SPLIT_RULE_MIGRATE_SKIN_ONLY` | P6 | Alto | hit-testing + screenshots |
| `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/GroupOptionFloatingAction.tsx` | Canvas overlay skins | `SPLIT_RULE_MIGRATE_SKIN_ONLY` | P6 | Alto | hit-testing + screenshots |
| `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/InlineEditOverlay.tsx` | Canvas overlay skins | `SPLIT_RULE_MIGRATE_SKIN_ONLY` | P6 | Alto | hit-testing + screenshots |
| `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/InlineMetricsOverlay.tsx` | Canvas overlay skins | `SPLIT_RULE_MIGRATE_SKIN_ONLY` | P6 | Alto | hit-testing + screenshots |
| `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/SchemaDragPreview.tsx` | Canvas overlay skins | `SPLIT_RULE_MIGRATE_SKIN_ONLY` | P6 | Alto | hit-testing + screenshots |
| `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/SchemaDropCommitFlash.tsx` | Canvas overlay skins | `SPLIT_RULE_MIGRATE_SKIN_ONLY` | P6 | Alto | hit-testing + screenshots |
| `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/SchemaDropPlaceholder.tsx` | Canvas overlay skins | `SPLIT_RULE_MIGRATE_SKIN_ONLY` | P6 | Alto | hit-testing + screenshots |
| `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/SelectionContextToolbar.tsx` | Canvas overlay skins | `SPLIT_RULE_MIGRATE_SKIN_ONLY` | P6 | Alto | hit-testing + screenshots |
| `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/SnapFeedbackOverlay.tsx` | Canvas overlay skins | `SPLIT_RULE_MIGRATE_SKIN_ONLY` | P6 | Alto | hit-testing + screenshots |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/AlignWidget.tsx` | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto | detail screenshot + inspector tests |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/ButtonGroupWidget.tsx` | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto | detail screenshot + inspector tests |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/CompactConfigPanel.tsx` | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto | detail screenshot + inspector tests |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailFormSection.tsx` | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto | detail screenshot + inspector tests |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailHeaderCard.tsx` | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto | detail screenshot + inspector tests |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailHeaderUtils.ts` | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto | detail screenshot + inspector tests |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailSchemas.ts` | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto | detail screenshot + inspector tests |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailSectionCard.tsx` | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto | detail screenshot + inspector tests |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailSectionTaxonomy.ts` | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto | detail screenshot + inspector tests |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailView.tsx` | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto | detail screenshot + inspector tests |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailViewContent.tsx` | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto | detail screenshot + inspector tests |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailWidgetRegistry.tsx` | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto | detail screenshot + inspector tests |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailWidgets.tsx` | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto | detail screenshot + inspector tests |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/inspectorContracts.ts` | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto | detail screenshot + inspector tests |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/InspectorPrimitives.tsx` | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto | detail screenshot + inspector tests |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/schemaCollaborationUtils.ts` | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto | detail screenshot + inspector tests |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaCollaborationWidget.tsx` | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto | detail screenshot + inspector tests |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaConnectionsShared.tsx` | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto | detail screenshot + inspector tests |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/schemaConnectionsValidation.ts` | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto | detail screenshot + inspector tests |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaConnectionsWidget.tsx` | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto | detail screenshot + inspector tests |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaFieldCommentsWidget.tsx` | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto | detail screenshot + inspector tests |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/WidgetRenderer.tsx` | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto | detail screenshot + inspector tests |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/Item.tsx` | RightSidebar ListView | `MIGRATE_RIGHT_SIDEBAR_LIST_VISUAL` | P1/P5 | Medio | DOM + list screenshot |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/ListView.tsx` | RightSidebar ListView | `MIGRATE_RIGHT_SIDEBAR_LIST_VISUAL` | P1/P5 | Medio | DOM + list screenshot |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/ListViewDragOverlay.tsx` | RightSidebar ListView | `MIGRATE_RIGHT_SIDEBAR_LIST_VISUAL` | P1/P5 | Medio | DOM + list screenshot |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/ListViewFooter.tsx` | RightSidebar ListView | `MIGRATE_RIGHT_SIDEBAR_LIST_VISUAL` | P1/P5 | Medio | DOM + list screenshot |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/ListViewToolbar.tsx` | RightSidebar ListView | `MIGRATE_RIGHT_SIDEBAR_LIST_VISUAL` | P1/P5 | Medio | DOM + list screenshot |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/SelectableSortableContainer.tsx` | RightSidebar ListView | `MIGRATE_RIGHT_SIDEBAR_LIST_VISUAL` | P1/P5 | Medio | DOM + list screenshot |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/SelectableSortableItem.tsx` | RightSidebar ListView | `MIGRATE_RIGHT_SIDEBAR_LIST_VISUAL` | P1/P5 | Medio | DOM + list screenshot |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/shared/SidebarSurfacePrimitives.tsx` | RightSidebar shell/rails | `MIGRATE_RIGHT_SIDEBAR_SHELL_VISUAL` | P1/P5 | Medio | documents/comments/list/detail screenshots |


# Apéndice B — Matriz completa de archivos `src/**/*.js|jsx|ts|tsx`

> Esta matriz permite continuar la migración sin alucinaciones. Antes de tocar un archivo, revisar su fila.

| Archivo | Lenguaje | Líneas | Capa | Acción | Prioridad | Riesgo |
|---|---:|---:|---|---|---|---|
| `src/main.jsx` | jsx | 13 | Infra Tailwind | `CONFIG_VERIFY_OR_FIX` | P0 | Medio |
| `src/App.jsx` | jsx | 25 | Config/scripts/tests | `CONFIG_OR_SCRIPT_ONLY` | P3 | Bajo |
| `src/features/pdfcomponent/CaseCard.jsx` | jsx | 123 | Lab landing/host | `MIGRATE_JSX` | P2 | Bajo |
| `src/features/pdfcomponent/CompactControls.jsx` | jsx | 282 | Lab shell canvas-first | `STABILIZE_AND_MIGRATE_JSX` | P0/P1 | Medio |
| `src/features/pdfcomponent/LabExampleDownloadButton.jsx` | jsx | 74 | Lab landing/host | `MIGRATE_JSX` | P2 | Bajo |
| `src/features/pdfcomponent/LabLandingPage.jsx` | jsx | 242 | Lab landing/host | `MIGRATE_JSX` | P2 | Bajo |
| `src/features/pdfcomponent/PageHeader.jsx` | jsx | 420 | Lab shell canvas-first | `STABILIZE_AND_MIGRATE_JSX` | P0/P1 | Medio |
| `src/features/pdfcomponent/PdfmeLabPage.jsx` | jsx | 650 | Lab shell canvas-first | `STABILIZE_AND_MIGRATE_JSX` | P0/P1 | Medio |
| `src/features/pdfcomponent/PopoverMenu.jsx` | jsx | 114 | Lab landing/host | `MIGRATE_JSX` | P2 | Bajo |
| `src/features/pdfcomponent/ResultsPanel.jsx` | jsx | 248 | Lab shell canvas-first | `STABILIZE_AND_MIGRATE_JSX` | P0/P1 | Medio |
| `src/features/pdfcomponent/domain/labPresentation.js` | javascript | 192 | Lab data/builders | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/features/pdfcomponent/domain/labState.js` | javascript | 18 | Lab data/builders | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/features/pdfcomponent/ui/primitives.jsx` | jsx | 103 | Lab landing/host | `MIGRATE_JSX` | P2 | Bajo |
| `src/features/pdfcomponent/labs/builders/exampleTemplate.ts` | typescript | 199 | Lab data/builders | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/features/pdfcomponent/labs/builders/schemaFactory.ts` | typescript | 91 | Lab data/builders | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/features/pdfcomponent/labs/builders/schemaShowcase.ts` | typescript | 220 | Lab data/builders | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/features/pdfcomponent/labs/examples/labExamples.js` | javascript | 885 | Lab data/builders | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/features/pdfcomponent/labs/export/buildExampleBundle.ts` | typescript | 78 | Lab data/builders | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/features/pdfcomponent/labs/export/downloadExampleBundle.ts` | typescript | 25 | Lab data/builders | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/types/custom.d.ts` | typescript | 23 | Config/scripts/tests | `CONFIG_OR_SCRIPT_ONLY` | P3 | Bajo |
| `src/sisad-pdfme/assignments/index.ts` | typescript | 612 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/browser/downloads.ts` | typescript | 44 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/browser/objectUrls.ts` | typescript | 32 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/canvas/canvasRenderState.ts` | typescript | 146 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/canvas/overlayManager.ts` | typescript | 249 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/canvas/useCanvasRenderState.ts` | typescript | 171 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/collaboration/appearance.ts` | typescript | 55 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/collaboration/index.ts` | typescript | 459 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/collaboration/lockManager.ts` | typescript | 253 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/collaboration/recipientPalette.ts` | typescript | 69 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/collaboration/schemaLockGuard.ts` | typescript | 96 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/collaboration/schemaOwnershipAppearance.ts` | typescript | 157 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/commands/index.ts` | typescript | 52 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/comments/index.ts` | typescript | 199 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/common/collaboration.ts` | typescript | 364 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/common/comments.ts` | typescript | 280 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/common/constants.ts` | typescript | 31 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/common/dynamicTemplate.ts` | typescript | 319 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/common/expression.ts` | typescript | 460 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/common/helper.ts` | typescript | 284 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/common/index.ts` | typescript | 121 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/common/pluginRegistry.ts` | typescript | 63 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/common/schema.ts` | typescript | 300 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/common/types.ts` | typescript | 250 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/common/version.ts` | typescript | 1 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/context/RecipientContext.ts` | typescript | 111 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/contracts/assignments.ts` | typescript | 3 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/contracts/commands.ts` | typescript | 33 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/contracts/comments.ts` | typescript | 46 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/contracts/index.ts` | typescript | 71 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/contracts/plugins.ts` | typescript | 48 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/contracts/schema.ts` | typescript | 32 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/converter/img2pdf.ts` | typescript | 113 | Converter | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/converter/index.browser.ts` | typescript | 56 | Converter | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/converter/index.node.ts` | typescript | 35 | Converter | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/converter/index.ts` | typescript | 7 | Converter | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/converter/modules.d.ts` | typescript | 9 | Converter | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/converter/pdf2img.ts` | typescript | 64 | Converter | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/converter/pdf2size.ts` | typescript | 33 | Converter | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/converter/types.d.ts` | typescript | 1 | Converter | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/devtools/index.ts` | typescript | 68 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/documents/index.ts` | typescript | 188 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/editor/index.ts` | typescript | 24 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/externalForms/externalFormRunner.ts` | typescript | 173 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/generator/constants.ts` | typescript | 1 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/generator/generate.ts` | typescript | 167 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/generator/helper.ts` | typescript | 171 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/generator/index.ts` | typescript | 27 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/generator/preflight.ts` | typescript | 447 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/generator/types.ts` | typescript | 5 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/integration/index.ts` | typescript | 102 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/integration/schemaController.ts` | typescript | 73 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/pdf-lib/index.ts` | typescript | 4 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/runtime/options.ts` | typescript | 74 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/runtime/runtimeModes.ts` | typescript | 59 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/runtime/usePdfmeArtifacts.ts` | typescript | 213 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/runtime/usePdfmeRuntimeInstance.ts` | typescript | 227 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/schemas/constants.ts` | typescript | 2 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/groupSchemaRender.ts` | typescript | 288 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/index.ts` | typescript | 407 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/modules.d.ts` | typescript | 32 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/schemaBuilder.ts` | typescript | 167 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/schemaFamilies.ts` | typescript | 364 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/utils.ts` | typescript | 294 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/shared/commandTypes.ts` | typescript | 129 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/shared/index.ts` | typescript | 121 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/shared/interactionGuards.ts` | typescript | 167 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/shared/keyboardShortcuts.ts` | typescript | 339 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/shared/localFormStorage.ts` | typescript | 243 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/shared/localMode.ts` | typescript | 187 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/shared/localSnapshotStore.ts` | typescript | 198 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/shared/schemaDesignerMeta.ts` | typescript | 318 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/shared/schemaMigration.ts` | typescript | 124 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/shared/signatureRegistry.ts` | typescript | 166 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/shared/snapshot.ts` | typescript | 182 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/shared/snapshotAdapter.ts` | typescript | 378 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/shared/templateValidator.ts` | typescript | 323 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/templates/createDefaultTemplate.ts` | typescript | 37 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/ui/class.ts` | typescript | 299 | UI logic/theme | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/ui/collaboration.ts` | typescript | 1497 | UI logic/theme | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/ui/collaborationContext.ts` | typescript | 256 | UI logic/theme | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/ui/constants.ts` | typescript | 21 | UI logic/theme | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/ui/contexts.ts` | typescript | 14 | UI logic/theme | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/ui/Designer.tsx` | tsx | 348 | Public UI entrypoints | `DO_NOT_VISUAL_MIGRATE_NOW` | P0 guard | Alto |
| `src/sisad-pdfme/ui/designerEngine.ts` | typescript | 1433 | UI logic/theme | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/ui/Form.tsx` | tsx | 130 | Public UI entrypoints | `DO_NOT_VISUAL_MIGRATE_NOW` | P0 guard | Alto |
| `src/sisad-pdfme/ui/helper.ts` | typescript | 601 | UI logic/theme | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/ui/hooks.ts` | typescript | 495 | UI logic/theme | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/ui/i18n.ts` | typescript | 903 | UI logic/theme | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/ui/index.ts` | typescript | 25 | UI logic/theme | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/ui/theme.ts` | typescript | 63 | UI logic/theme | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/ui/types.ts` | typescript | 147 | UI logic/theme | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/ui/Viewer.tsx` | tsx | 54 | Public UI entrypoints | `DO_NOT_VISUAL_MIGRATE_NOW` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/api/colors.ts` | typescript | 109 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/api/Embeddable.ts` | typescript | 7 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/api/errors.ts` | typescript | 118 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/api/index.ts` | typescript | 20 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/api/objects.ts` | typescript | 10 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/api/operations.ts` | typescript | 873 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/api/operators.ts` | typescript | 335 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/api/PDFDocument.ts` | typescript | 1389 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/api/PDFDocumentOptions.ts` | typescript | 45 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/api/PDFEmbeddedFile.ts` | typescript | 87 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/api/PDFEmbeddedPage.ts` | typescript | 100 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/api/PDFFont.ts` | typescript | 149 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/api/PDFImage.ts` | typescript | 143 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/api/PDFJavaScript.ts` | typescript | 75 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/api/PDFPage.ts` | typescript | 1604 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/api/PDFPageOptions.ts` | typescript | 175 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/api/rotations.ts` | typescript | 84 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/api/sizes.ts` | typescript | 52 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/api/StandardFonts.ts` | typescript | 16 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/api/svg.ts` | typescript | 891 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/api/svgPath.ts` | typescript | 460 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/crypto.ts` | typescript | 1845 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/errors.ts` | typescript | 219 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/index.ts` | typescript | 63 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/PDFContext.ts` | typescript | 274 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/PDFObjectCopier.ts` | typescript | 142 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/types/fontkit.ts` | typescript | 643 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/types/index.ts` | typescript | 30 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/types/matrix.ts` | typescript | 22 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/utils/arrays.ts` | typescript | 157 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/utils/async.ts` | typescript | 8 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/utils/base64.ts` | typescript | 98 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/utils/Cache.ts` | typescript | 28 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/utils/errors.ts` | typescript | 3 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/utils/index.ts` | typescript | 11 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/utils/intersections.ts` | typescript | 237 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/utils/maths.ts` | typescript | 96 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/utils/numbers.ts` | typescript | 55 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/utils/objects.ts` | typescript | 13 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/utils/pdfDocEncoding.ts` | typescript | 69 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/utils/png.ts` | typescript | 70 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/utils/rng.ts` | typescript | 21 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/utils/strings.ts` | typescript | 191 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/utils/unicode.ts` | typescript | 373 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/utils/validators.ts` | typescript | 200 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/schemas/actions/actionSchemaFactory.ts` | typescript | 93 | Schemas logic/pdf | `NO_VISUAL_OR_SPLIT` | P3 | Medio |
| `src/sisad-pdfme/schemas/actions/approve.ts` | typescript | 156 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/actions/attachment.ts` | typescript | 211 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/actions/decline.ts` | typescript | 145 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/actions/note.ts` | typescript | 121 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/barcodes/constants.ts` | typescript | 20 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/barcodes/helper.ts` | typescript | 187 | Schemas logic/pdf | `NO_VISUAL_OR_SPLIT` | P3 | Medio |
| `src/sisad-pdfme/schemas/barcodes/index.ts` | typescript | 23 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/barcodes/pdfRender.ts` | typescript | 37 | Schemas logic/pdf | `NO_VISUAL_OR_SPLIT` | P3 | Medio |
| `src/sisad-pdfme/schemas/barcodes/propPanel.ts` | typescript | 258 | Schemas visual/runtime | `MIGRATE_SCHEMA_VISUAL_SAFE` | P5 | Medio/Alto |
| `src/sisad-pdfme/schemas/barcodes/types.ts` | typescript | 12 | Schemas logic/pdf | `NO_VISUAL_OR_SPLIT` | P3 | Medio |
| `src/sisad-pdfme/schemas/barcodes/uiRender.ts` | typescript | 97 | Schemas visual/runtime | `MIGRATE_SCHEMA_VISUAL_SAFE` | P5 | Medio/Alto |
| `src/sisad-pdfme/schemas/checkbox/index.ts` | typescript | 159 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/checkboxGroup/index.ts` | typescript | 445 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/date/date.ts` | typescript | 16 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/date/dateTime.ts` | typescript | 16 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/date/helper.ts` | typescript | 523 | Schemas logic/pdf | `NO_VISUAL_OR_SPLIT` | P3 | Medio |
| `src/sisad-pdfme/schemas/date/time.ts` | typescript | 16 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/date/types.ts` | typescript | 21 | Schemas logic/pdf | `NO_VISUAL_OR_SPLIT` | P3 | Medio |
| `src/sisad-pdfme/schemas/graphics/image.ts` | typescript | 209 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/graphics/imagehelper.ts` | typescript | 156 | Schemas logic/pdf | `NO_VISUAL_OR_SPLIT` | P3 | Medio |
| `src/sisad-pdfme/schemas/graphics/svg.ts` | typescript | 123 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/multiVariableText/helper.ts` | typescript | 89 | Schemas logic/pdf | `NO_VISUAL_OR_SPLIT` | P3 | Medio |
| `src/sisad-pdfme/schemas/multiVariableText/index.ts` | typescript | 23 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/multiVariableText/pdfRender.ts` | typescript | 21 | Schemas logic/pdf | `NO_VISUAL_OR_SPLIT` | P3 | Medio |
| `src/sisad-pdfme/schemas/multiVariableText/propPanel.ts` | typescript | 166 | Schemas visual/runtime | `MIGRATE_SCHEMA_VISUAL_SAFE` | P5 | Medio/Alto |
| `src/sisad-pdfme/schemas/multiVariableText/types.ts` | typescript | 6 | Schemas logic/pdf | `NO_VISUAL_OR_SPLIT` | P3 | Medio |
| `src/sisad-pdfme/schemas/multiVariableText/uiRender.ts` | typescript | 170 | Schemas visual/runtime | `MIGRATE_SCHEMA_VISUAL_SAFE` | P5 | Medio/Alto |
| `src/sisad-pdfme/schemas/number/index.ts` | typescript | 86 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/options/index.ts` | typescript | 8 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/options/optionGroupEditorFactory.ts` | typescript | 121 | Schemas logic/pdf | `NO_VISUAL_OR_SPLIT` | P3 | Medio |
| `src/sisad-pdfme/schemas/options/optionGroupFactory.ts` | typescript | 432 | Schemas logic/pdf | `NO_VISUAL_OR_SPLIT` | P3 | Medio |
| `src/sisad-pdfme/schemas/options/optionGroupLayout.ts` | typescript | 76 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/options/optionGroupPdfRender.ts` | typescript | 59 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/options/optionGroupRenderer.ts` | typescript | 218 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/options/OptionListWidget.tsx` | tsx | 14 | Schemas visual/runtime | `MIGRATE_SCHEMA_VISUAL_SAFE` | P5 | Medio/Alto |
| `src/sisad-pdfme/schemas/options/optionModel.ts` | typescript | 76 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/options/optionPropPanel.tsx` | tsx | 33 | Schemas visual/runtime | `MIGRATE_SCHEMA_VISUAL_SAFE` | P5 | Medio/Alto |
| `src/sisad-pdfme/schemas/options/optionSelectionBehavior.ts` | typescript | 124 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/options/optionTypes.ts` | typescript | 19 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/options/optionValueAdapter.ts` | typescript | 15 | Schemas logic/pdf | `NO_VISUAL_OR_SPLIT` | P3 | Medio |
| `src/sisad-pdfme/schemas/propPanel/commonInspectorFields.ts` | typescript | 341 | Schemas visual/runtime | `MIGRATE_SCHEMA_VISUAL_SAFE` | P5 | Medio/Alto |
| `src/sisad-pdfme/schemas/propPanel/index.ts` | typescript | 1 | Schemas visual/runtime | `MIGRATE_SCHEMA_VISUAL_SAFE` | P5 | Medio/Alto |
| `src/sisad-pdfme/schemas/radioGroup/index.ts` | typescript | 392 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/select/index.ts` | typescript | 278 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/shapes/line.ts` | typescript | 100 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/shapes/rectAndEllipse.ts` | typescript | 161 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/shared/fieldChrome.ts` | typescript | 275 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/shared/renderSchemaWithChrome.ts` | typescript | 80 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/shared/schemaDom.ts` | typescript | 116 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/shared/schemaGuards.ts` | typescript | 167 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/shared/schemaTypes.ts` | typescript | 171 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/signature/dateSigned.ts` | typescript | 136 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/signature/index.ts` | typescript | 312 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/signature/initials.ts` | typescript | 44 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/signature/propPanel.ts` | typescript | 697 | Schemas visual/runtime | `MIGRATE_SCHEMA_VISUAL_SAFE` | P5 | Medio/Alto |
| `src/sisad-pdfme/schemas/signature/providerRegistry.ts` | typescript | 217 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/signature/signingSchemaFactory.ts` | typescript | 119 | Schemas logic/pdf | `NO_VISUAL_OR_SPLIT` | P3 | Medio |
| `src/sisad-pdfme/schemas/signature/types.ts` | typescript | 325 | Schemas logic/pdf | `NO_VISUAL_OR_SPLIT` | P3 | Medio |
| `src/sisad-pdfme/schemas/signature/validation.ts` | typescript | 70 | Schemas logic/pdf | `NO_VISUAL_OR_SPLIT` | P3 | Medio |
| `src/sisad-pdfme/schemas/tables/cell.ts` | typescript | 152 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/tables/classes.ts` | typescript | 402 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/tables/dynamicTemplate.ts` | typescript | 88 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/tables/helper.ts` | typescript | 216 | Schemas logic/pdf | `NO_VISUAL_OR_SPLIT` | P3 | Medio |
| `src/sisad-pdfme/schemas/tables/index.ts` | typescript | 22 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/tables/pdfRender.ts` | typescript | 144 | Schemas logic/pdf | `NO_VISUAL_OR_SPLIT` | P3 | Medio |
| `src/sisad-pdfme/schemas/tables/propPanel.ts` | typescript | 122 | Schemas visual/runtime | `MIGRATE_SCHEMA_VISUAL_SAFE` | P5 | Medio/Alto |
| `src/sisad-pdfme/schemas/tables/tableHelper.ts` | typescript | 278 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/tables/types.ts` | typescript | 87 | Schemas logic/pdf | `NO_VISUAL_OR_SPLIT` | P3 | Medio |
| `src/sisad-pdfme/schemas/tables/uiRender.ts` | typescript | 437 | Schemas visual/runtime | `MIGRATE_SCHEMA_VISUAL_SAFE` | P5 | Medio/Alto |
| `src/sisad-pdfme/schemas/text/constants.ts` | typescript | 104 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/text/extraFormatter.ts` | typescript | 83 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/text/helper.ts` | typescript | 550 | Schemas logic/pdf | `NO_VISUAL_OR_SPLIT` | P3 | Medio |
| `src/sisad-pdfme/schemas/text/index.ts` | typescript | 23 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/text/pdfRender.ts` | typescript | 240 | Schemas logic/pdf | `NO_VISUAL_OR_SPLIT` | P3 | Medio |
| `src/sisad-pdfme/schemas/text/propPanel.ts` | typescript | 210 | Schemas visual/runtime | `MIGRATE_SCHEMA_VISUAL_SAFE` | P5 | Medio/Alto |
| `src/sisad-pdfme/schemas/text/types.ts` | typescript | 30 | Schemas logic/pdf | `NO_VISUAL_OR_SPLIT` | P3 | Medio |
| `src/sisad-pdfme/schemas/text/uiRender.ts` | typescript | 314 | Schemas visual/runtime | `MIGRATE_SCHEMA_VISUAL_SAFE` | P5 | Medio/Alto |
| `src/sisad-pdfme/schemas/textLike/textLikePresets.ts` | typescript | 44 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/textLike/textLikeSchemaFactory.ts` | typescript | 82 | Schemas logic/pdf | `NO_VISUAL_OR_SPLIT` | P3 | Medio |
| `src/sisad-pdfme/schemas/values/schemaValueAdapter.ts` | typescript | 49 | Schemas logic/pdf | `NO_VISUAL_OR_SPLIT` | P3 | Medio |
| `src/sisad-pdfme/ui/collaboration/schemaRuntimeAccess.ts` | typescript | 153 | UI logic/theme | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/ui/commands/commandBus.ts` | typescript | 163 | UI logic/theme | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/ui/commands/designerCommands.ts` | typescript | 123 | UI logic/theme | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/ui/components/AppContextProvider.tsx` | tsx | 86 | Runtime component | `REVIEW_BEFORE_MIGRATE` | P6 | Medio |
| `src/sisad-pdfme/ui/components/CtlBar.tsx` | tsx | 349 | Runtime/UI chrome | `MIGRATE_RUNTIME_UI_SKIN` | P6 | Medio |
| `src/sisad-pdfme/ui/components/ErrorScreen.tsx` | tsx | 26 | Runtime/UI chrome | `MIGRATE_RUNTIME_UI_SKIN` | P6 | Medio |
| `src/sisad-pdfme/ui/components/Paper.tsx` | tsx | 222 | Runtime/Paper/Renderer | `KEEP_GEOMETRY_MIGRATE_SKIN_ONLY` | P6 | Alto |
| `src/sisad-pdfme/ui/components/Preview.tsx` | tsx | 220 | Runtime/Paper/Renderer | `KEEP_GEOMETRY_MIGRATE_SKIN_ONLY` | P6 | Alto |
| `src/sisad-pdfme/ui/components/Renderer.tsx` | tsx | 311 | Runtime/Paper/Renderer | `KEEP_GEOMETRY_MIGRATE_SKIN_ONLY` | P6 | Alto |
| `src/sisad-pdfme/ui/components/Root.tsx` | tsx | 45 | Runtime/Paper/Renderer | `KEEP_GEOMETRY_MIGRATE_SKIN_ONLY` | P6 | Alto |
| `src/sisad-pdfme/ui/components/Spinner.tsx` | tsx | 22 | Runtime/UI chrome | `MIGRATE_RUNTIME_UI_SKIN` | P6 | Medio |
| `src/sisad-pdfme/ui/components/StaticSchema.tsx` | tsx | 61 | Runtime/Paper/Renderer | `KEEP_GEOMETRY_MIGRATE_SKIN_ONLY` | P6 | Alto |
| `src/sisad-pdfme/ui/components/UnitPager.tsx` | tsx | 100 | Runtime/UI chrome | `MIGRATE_RUNTIME_UI_SKIN` | P6 | Medio |
| `src/sisad-pdfme/ui/components/usePreviewRuntime.ts` | typescript | 602 | Runtime/Paper/Renderer | `KEEP_GEOMETRY_MIGRATE_SKIN_ONLY` | P6 | Alto |
| `src/sisad-pdfme/ui/types/customSchemaRegistry.ts` | typescript | 24 | UI logic/theme | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/ui/utils/cn.ts` | typescript | 3 | UI logic/theme | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/pdf-lib/api/form/appearances.ts` | typescript | 655 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/api/form/index.ts` | typescript | 10 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/api/form/PDFButton.ts` | typescript | 242 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/api/form/PDFCheckBox.ts` | typescript | 247 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/api/form/PDFDropdown.ts` | typescript | 637 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/api/form/PDFField.ts` | typescript | 491 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/api/form/PDFForm.ts` | typescript | 842 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/api/form/PDFOptionList.ts` | typescript | 555 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/api/form/PDFRadioGroup.ts` | typescript | 455 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/api/form/PDFSignature.ts` | typescript | 44 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/api/form/PDFTextField.ts` | typescript | 811 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/api/text/alignment.ts` | typescript | 5 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/api/text/index.ts` | typescript | 2 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/api/text/layout.ts` | typescript | 328 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/acroform/flags.ts` | typescript | 162 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/acroform/index.ts` | typescript | 15 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/acroform/PDFAcroButton.ts` | typescript | 104 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/acroform/PDFAcroCheckBox.ts` | typescript | 48 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/acroform/PDFAcroChoice.ts` | typescript | 143 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/acroform/PDFAcroComboBox.ts` | typescript | 21 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/acroform/PDFAcroField.ts` | typescript | 167 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/acroform/PDFAcroForm.ts` | typescript | 96 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/acroform/PDFAcroListBox.ts` | typescript | 19 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/acroform/PDFAcroNonTerminal.ts` | typescript | 33 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/acroform/PDFAcroPushButton.ts` | typescript | 21 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/acroform/PDFAcroRadioButton.ts` | typescript | 57 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/acroform/PDFAcroSignature.ts` | typescript | 9 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/acroform/PDFAcroTerminal.ts` | typescript | 70 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/acroform/PDFAcroText.ts` | typescript | 76 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/acroform/utils.ts` | typescript | 129 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/annotation/AppearanceCharacteristics.ts` | typescript | 133 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/annotation/BorderStyle.ts` | typescript | 31 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/annotation/flags.ts` | typescript | 90 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/annotation/index.ts` | typescript | 4 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/annotation/PDFAnnotation.ts` | typescript | 148 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/annotation/PDFWidgetAnnotation.ts` | typescript | 111 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/document/PDFCrossRefSection.ts` | typescript | 161 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/document/PDFHeader.ts` | typescript | 48 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/document/PDFTrailer.ts` | typescript | 48 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/document/PDFTrailerDict.ts` | typescript | 39 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/embedders/CMap.ts` | typescript | 65 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/embedders/CustomFontEmbedder.ts` | typescript | 237 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/embedders/CustomFontSubsetEmbedder.ts` | typescript | 89 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/embedders/FileEmbedder.ts` | typescript | 77 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/embedders/FontFlags.ts` | typescript | 45 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/embedders/JavaScriptEmbedder.ts` | typescript | 34 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/embedders/JpegEmbedder.ts` | typescript | 118 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/embedders/PDFPageEmbedder.ts` | typescript | 139 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/embedders/PngEmbedder.ts` | typescript | 69 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/embedders/StandardFontEmbedder.ts` | typescript | 121 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/interactive/ViewerPreferences.ts` | typescript | 565 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/objects/PDFArray.ts` | typescript | 179 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/objects/PDFBool.ts` | typescript | 53 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/objects/PDFDict.ts` | typescript | 220 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/objects/PDFHexString.ts` | typescript | 94 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/objects/PDFInvalidObject.ts` | typescript | 34 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/objects/PDFName.ts` | typescript | 152 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/objects/PDFNull.ts` | typescript | 30 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/objects/PDFNumber.ts` | typescript | 44 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/objects/PDFObject.ts` | typescript | 22 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/objects/PDFRawStream.ts` | typescript | 41 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/objects/PDFRef.ts` | typescript | 51 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/objects/PDFStream.ts` | typescript | 87 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/objects/PDFString.ts` | typescript | 118 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/operators/PDFOperator.ts` | typescript | 72 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/operators/PDFOperatorNames.ts` | typescript | 92 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/parser/BaseParser.ts` | typescript | 119 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/parser/ByteStream.ts` | typescript | 76 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/parser/PDFObjectParser.ts` | typescript | 302 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/parser/PDFObjectStreamParser.ts` | typescript | 65 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/parser/PDFParser.ts` | typescript | 363 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/parser/PDFXRefStreamParser.ts` | typescript | 129 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/streams/Ascii85Stream.ts` | typescript | 97 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/streams/AsciiHexStream.ts` | typescript | 77 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/streams/decode.ts` | typescript | 70 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/streams/DecodeStream.ts` | typescript | 170 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/streams/DecryptStream.ts` | typescript | 49 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/streams/FlateStream.ts` | typescript | 397 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/streams/LZWStream.ts` | typescript | 157 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/streams/RunLengthStream.ts` | typescript | 55 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/streams/Stream.ts` | typescript | 126 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/structures/PDFCatalog.ts` | typescript | 81 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/structures/PDFContentStream.ts` | typescript | 58 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/structures/PDFCrossRefStream.ts` | typescript | 238 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/structures/PDFFlateStream.ts` | typescript | 40 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/structures/PDFObjectStream.ts` | typescript | 91 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/structures/PDFPageLeaf.ts` | typescript | 244 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/structures/PDFPageTree.ts` | typescript | 192 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/syntax/CharCodes.ts` | typescript | 62 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/syntax/Delimiters.ts` | typescript | 14 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/syntax/Irregular.ts` | typescript | 10 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/syntax/Keywords.ts` | typescript | 57 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/syntax/Numeric.ts` | typescript | 26 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/syntax/Whitespace.ts` | typescript | 10 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/writers/PDFStreamWriter.ts` | typescript | 114 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/writers/PDFWriter.ts` | typescript | 146 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/utils/elements/Arc.ts` | typescript | 97 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/utils/elements/Circle.ts` | typescript | 47 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/utils/elements/Ellipse.ts` | typescript | 117 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/utils/elements/GraphElement.ts` | typescript | 14 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/utils/elements/index.ts` | typescript | 9 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/utils/elements/Line.ts` | typescript | 83 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/utils/elements/Plot.ts` | typescript | 50 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/utils/elements/Point.ts` | typescript | 37 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/utils/elements/Rectangle.ts` | typescript | 65 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/utils/elements/Segment.ts` | typescript | 81 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/schemas/text/icons/index.ts` | typescript | 30 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/ui/components/Designer/index.tsx` | tsx | 3755 | Designer shell | `SPLIT_RULE_NEEDS_TASK_CARD` | P0/P6 | Alto |
| `src/sisad-pdfme/ui/components/Designer/LeftSidebar.tsx` | tsx | 1530 | LeftSidebar visual | `MIGRATE_LEFT_SIDEBAR_VISUAL` | P4 | Medio |
| `src/sisad-pdfme/ui/components/Designer/LeftSidebarCustomFieldModal.tsx` | tsx | 365 | LeftSidebar visual | `MIGRATE_LEFT_SIDEBAR_VISUAL` | P4 | Medio |
| `src/sisad-pdfme/ui/components/Designer/LeftSidebarCustomPanel.tsx` | tsx | 111 | LeftSidebar visual | `MIGRATE_LEFT_SIDEBAR_VISUAL` | P4 | Medio |
| `src/sisad-pdfme/ui/components/Designer/LeftSidebarGroup.tsx` | tsx | 98 | LeftSidebar visual | `MIGRATE_LEFT_SIDEBAR_VISUAL` | P4 | Medio |
| `src/sisad-pdfme/ui/components/Designer/LeftSidebarSearch.tsx` | tsx | 36 | LeftSidebar visual | `MIGRATE_LEFT_SIDEBAR_VISUAL` | P4 | Medio |
| `src/sisad-pdfme/ui/components/Designer/LeftSidebarTabs.tsx` | tsx | 57 | LeftSidebar visual | `MIGRATE_LEFT_SIDEBAR_VISUAL` | P4 | Medio |
| `src/sisad-pdfme/ui/components/Designer/PluginIcon.tsx` | tsx | 125 | Designer dialogs/tools | `MIGRATE_VISUAL_SAFE` | P6 | Medio |
| `src/sisad-pdfme/ui/components/Designer/SchemaDropSetupModal.tsx` | tsx | 94 | Designer dialogs/tools | `MIGRATE_VISUAL_SAFE` | P6 | Medio |
| `src/sisad-pdfme/ui/components/Designer/schemaRegistry.ts` | typescript | 212 | Designer other | `REVIEW_BEFORE_MIGRATE` | P6 | Medio |
| `src/sisad-pdfme/ui/components/Designer/useLeftSidebarCatalogState.ts` | typescript | 155 | LeftSidebar state | `NO_VISUAL_MIGRATION` | P4 | Bajo |
| `src/sisad-pdfme/ui/components/shared/pageMetadata.ts` | typescript | 52 | Runtime component | `REVIEW_BEFORE_MIGRATE` | P6 | Medio |
| `src/sisad-pdfme/ui/components/shared/usePaperRefRegistry.ts` | typescript | 20 | Runtime/Paper/Renderer | `KEEP_GEOMETRY_MIGRATE_SKIN_ONLY` | P6 | Alto |
| `src/sisad-pdfme/ui/components/Designer/Canvas/Canvas.tsx` | tsx | 1589 | Canvas core/chrome | `KEEP_GEOMETRY_MIGRATE_MINIMAL_SKIN` | P6/P0 guard | Alto |
| `src/sisad-pdfme/ui/components/Designer/Canvas/Guides.tsx` | tsx | 100 | Canvas core/chrome | `KEEP_GEOMETRY_MIGRATE_MINIMAL_SKIN` | P6/P0 guard | Alto |
| `src/sisad-pdfme/ui/components/Designer/Canvas/Mask.tsx` | tsx | 33 | Canvas core/chrome | `KEEP_GEOMETRY_MIGRATE_MINIMAL_SKIN` | P6/P0 guard | Alto |
| `src/sisad-pdfme/ui/components/Designer/Canvas/Moveable.tsx` | tsx | 127 | Canvas Moveable/Selecto | `DO_NOT_MIGRATE` | P0 guard | Crítico |
| `src/sisad-pdfme/ui/components/Designer/Canvas/Padding.tsx` | tsx | 82 | Canvas core/chrome | `KEEP_GEOMETRY_MIGRATE_MINIMAL_SKIN` | P6/P0 guard | Alto |
| `src/sisad-pdfme/ui/components/Designer/Canvas/Selecto.tsx` | tsx | 110 | Canvas Moveable/Selecto | `DO_NOT_MIGRATE` | P0 guard | Crítico |
| `src/sisad-pdfme/ui/components/Designer/Canvas/SnapLines.tsx` | tsx | 349 | Canvas core/chrome | `KEEP_GEOMETRY_MIGRATE_MINIMAL_SKIN` | P6/P0 guard | Alto |
| `src/sisad-pdfme/ui/components/Designer/Comments/CommentDialog.tsx` | tsx | 59 | Designer dialogs/tools | `MIGRATE_VISUAL_SAFE` | P6 | Medio |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/CommentsRail.tsx` | tsx | 250 | RightSidebar shell/rails | `MIGRATE_RIGHT_SIDEBAR_SHELL_VISUAL` | P1/P5 | Medio |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/contextHeader.ts` | typescript | 19 | RightSidebar helpers | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DocumentsRail.tsx` | tsx | 250 | RightSidebar shell/rails | `MIGRATE_RIGHT_SIDEBAR_SHELL_VISUAL` | P1/P5 | Medio |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/layout.tsx` | tsx | 66 | RightSidebar shell/rails | `MIGRATE_RIGHT_SIDEBAR_SHELL_VISUAL` | P1/P5 | Medio |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/RightSidebar.tsx` | tsx | 432 | RightSidebar shell/rails | `MIGRATE_RIGHT_SIDEBAR_SHELL_VISUAL` | P1/P5 | Medio |
| `src/sisad-pdfme/ui/components/Designer/shared/actionRegistry.ts` | typescript | 495 | Designer shared logic | `NO_VISUAL_MIGRATION` | P0/P3 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/shared/canvasDropPipeline.ts` | typescript | 112 | Designer shared logic | `NO_VISUAL_MIGRATION` | P0/P3 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/shared/className.ts` | typescript | 17 | Designer shared logic | `NO_VISUAL_MIGRATION` | P0/P3 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/shared/coordinateMath.ts` | typescript | 145 | Designer shared logic | `NO_VISUAL_MIGRATION` | P0/P3 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/shared/DesignerContextSummary.tsx` | tsx | 83 | Designer shared logic | `NO_VISUAL_MIGRATION` | P0/P3 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/shared/designerCoordinateService.ts` | typescript | 182 | Designer shared logic | `NO_VISUAL_MIGRATION` | P0/P3 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/shared/designerExtensions.ts` | typescript | 98 | Designer shared logic | `NO_VISUAL_MIGRATION` | P0/P3 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/shared/designerLabels.ts` | typescript | 98 | Designer shared logic | `NO_VISUAL_MIGRATION` | P0/P3 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/shared/interactionGuards.ts` | typescript | 298 | Designer shared logic | `NO_VISUAL_MIGRATION` | P0/P3 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/shared/interactionState.ts` | typescript | 62 | Designer shared logic | `NO_VISUAL_MIGRATION` | P0/P3 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/shared/interactionTargetPolicy.ts` | typescript | 62 | Designer shared logic | `NO_VISUAL_MIGRATION` | P0/P3 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/shared/interactionTargetSelectors.ts` | typescript | 68 | Designer shared logic | `NO_VISUAL_MIGRATION` | P0/P3 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/shared/keyboardShortcutRegistry.ts` | typescript | 290 | Designer shared logic | `NO_VISUAL_MIGRATION` | P0/P3 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/shared/keyboardShortcuts.ts` | typescript | 568 | Designer dialogs/tools | `MIGRATE_VISUAL_SAFE` | P6 | Medio |
| `src/sisad-pdfme/ui/components/Designer/shared/objectGuards.ts` | typescript | 12 | Designer shared logic | `NO_VISUAL_MIGRATION` | P0/P3 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/shared/passiveTouchListeners.ts` | typescript | 38 | Designer shared logic | `NO_VISUAL_MIGRATION` | P0/P3 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/shared/recipientColor.ts` | typescript | 143 | Designer shared logic | `NO_VISUAL_MIGRATION` | P0/P3 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/shared/schemaAutoPlace.ts` | typescript | 96 | Designer shared logic | `NO_VISUAL_MIGRATION` | P0/P3 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/shared/schemaClipboard.ts` | typescript | 426 | Designer shared logic | `NO_VISUAL_MIGRATION` | P0/P3 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/shared/schemaCollision.ts` | typescript | 101 | Designer shared logic | `NO_VISUAL_MIGRATION` | P0/P3 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/shared/schemaInteractionCapabilities.ts` | typescript | 115 | Designer shared logic | `NO_VISUAL_MIGRATION` | P0/P3 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/shared/schemaTone.ts` | typescript | 90 | Designer shared logic | `NO_VISUAL_MIGRATION` | P0/P3 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/shared/schemaVariableName.ts` | typescript | 49 | Designer shared logic | `NO_VISUAL_MIGRATION` | P0/P3 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/shared/selectableTargetGuards.ts` | typescript | 34 | Designer shared logic | `NO_VISUAL_MIGRATION` | P0/P3 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/shared/selectionCommands.ts` | typescript | 885 | Designer shared logic | `NO_VISUAL_MIGRATION` | P0/P3 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/shared/selectionIdentityResolver.ts` | typescript | 115 | Designer shared logic | `NO_VISUAL_MIGRATION` | P0/P3 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/shared/transformTargetGuards.ts` | typescript | 29 | Designer shared logic | `NO_VISUAL_MIGRATION` | P0/P3 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/shared/useDesignerKeyboardShortcuts.ts` | typescript | 546 | Designer dialogs/tools | `MIGRATE_VISUAL_SAFE` | P6 | Medio |
| `src/sisad-pdfme/ui/components/Designer/shared/useResponsiveDensity.ts` | typescript | 81 | Designer shared logic | `NO_VISUAL_MIGRATION` | P0/P3 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/Shortcuts/ShortcutHelpButton.tsx` | tsx | 43 | Designer dialogs/tools | `MIGRATE_VISUAL_SAFE` | P6 | Medio |
| `src/sisad-pdfme/ui/components/Designer/Shortcuts/ShortcutHelpPanel.tsx` | tsx | 163 | Designer dialogs/tools | `MIGRATE_VISUAL_SAFE` | P6 | Medio |
| `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/CanvasContextMenu.tsx` | tsx | 242 | Canvas overlay skins | `SPLIT_RULE_MIGRATE_SKIN_ONLY` | P6 | Alto |
| `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/canvasContextMenuActions.tsx` | tsx | 921 | Canvas overlay skins | `SPLIT_RULE_MIGRATE_SKIN_ONLY` | P6 | Alto |
| `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/CanvasOverlayManager.tsx` | tsx | 141 | Canvas overlay skins | `SPLIT_RULE_MIGRATE_SKIN_ONLY` | P6 | Alto |
| `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/CanvasStateOverlay.tsx` | tsx | 158 | Canvas overlay skins | `SPLIT_RULE_MIGRATE_SKIN_ONLY` | P6 | Alto |
| `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/CommentsOverlay.tsx` | tsx | 271 | Canvas overlay skins | `SPLIT_RULE_MIGRATE_SKIN_ONLY` | P6 | Alto |
| `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/floatingSurfaceGeometry.ts` | typescript | 97 | Canvas overlay logic | `KEEP_LEGACY_GEOMETRY` | P0 guard | Alto |
| `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/GroupOptionFloatingAction.tsx` | tsx | 103 | Canvas overlay skins | `SPLIT_RULE_MIGRATE_SKIN_ONLY` | P6 | Alto |
| `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/InlineEditOverlay.tsx` | tsx | 204 | Canvas overlay skins | `SPLIT_RULE_MIGRATE_SKIN_ONLY` | P6 | Alto |
| `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/InlineMetricsOverlay.tsx` | tsx | 23 | Canvas overlay skins | `SPLIT_RULE_MIGRATE_SKIN_ONLY` | P6 | Alto |
| `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/overlayState.ts` | typescript | 40 | Canvas overlay logic | `KEEP_LEGACY_GEOMETRY` | P0 guard | Alto |
| `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/pointerGeometry.ts` | typescript | 133 | Canvas overlay logic | `KEEP_LEGACY_GEOMETRY` | P0 guard | Alto |
| `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/SchemaDragPreview.tsx` | tsx | 41 | Canvas overlay skins | `SPLIT_RULE_MIGRATE_SKIN_ONLY` | P6 | Alto |
| `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/SchemaDropCommitFlash.tsx` | tsx | 49 | Canvas overlay skins | `SPLIT_RULE_MIGRATE_SKIN_ONLY` | P6 | Alto |
| `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/SchemaDropPlaceholder.tsx` | tsx | 57 | Canvas overlay skins | `SPLIT_RULE_MIGRATE_SKIN_ONLY` | P6 | Alto |
| `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/SelectionContextToolbar.tsx` | tsx | 217 | Canvas overlay skins | `SPLIT_RULE_MIGRATE_SKIN_ONLY` | P6 | Alto |
| `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/smartPlacement.ts` | typescript | 196 | Canvas overlay logic | `KEEP_LEGACY_GEOMETRY` | P0 guard | Alto |
| `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/SnapFeedbackOverlay.tsx` | tsx | 42 | Canvas overlay skins | `SPLIT_RULE_MIGRATE_SKIN_ONLY` | P6 | Alto |
| `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/useFloatingToolbarPosition.ts` | typescript | 69 | Canvas overlay logic | `KEEP_LEGACY_GEOMETRY` | P0 guard | Alto |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/AlignWidget.tsx` | tsx | 67 | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/ButtonGroupWidget.tsx` | tsx | 83 | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/CompactConfigPanel.tsx` | tsx | 99 | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailFormSection.tsx` | tsx | 55 | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailHeaderCard.tsx` | tsx | 136 | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailHeaderUtils.ts` | typescript | 85 | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailSchemas.ts` | typescript | 430 | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailSectionCard.tsx` | tsx | 177 | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailSectionTaxonomy.ts` | typescript | 405 | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailView.tsx` | tsx | 417 | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailViewContent.tsx` | tsx | 63 | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailWidgetRegistry.tsx` | tsx | 141 | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailWidgets.tsx` | tsx | 108 | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/inspectorContracts.ts` | typescript | 366 | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/InspectorPrimitives.tsx` | tsx | 217 | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/schemaCollaborationUtils.ts` | typescript | 18 | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaCollaborationWidget.tsx` | tsx | 485 | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaConnectionsShared.tsx` | tsx | 146 | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/schemaConnectionsValidation.ts` | typescript | 83 | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaConnectionsWidget.tsx` | tsx | 825 | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaFieldCommentsWidget.tsx` | tsx | 314 | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/WidgetRenderer.tsx` | tsx | 32 | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/Item.tsx` | tsx | 341 | RightSidebar ListView | `MIGRATE_RIGHT_SIDEBAR_LIST_VISUAL` | P1/P5 | Medio |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/ListView.tsx` | tsx | 345 | RightSidebar ListView | `MIGRATE_RIGHT_SIDEBAR_LIST_VISUAL` | P1/P5 | Medio |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/ListViewDragOverlay.tsx` | tsx | 58 | RightSidebar ListView | `MIGRATE_RIGHT_SIDEBAR_LIST_VISUAL` | P1/P5 | Medio |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/ListViewFooter.tsx` | tsx | 56 | RightSidebar ListView | `MIGRATE_RIGHT_SIDEBAR_LIST_VISUAL` | P1/P5 | Medio |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/ListViewToolbar.tsx` | tsx | 238 | RightSidebar ListView | `MIGRATE_RIGHT_SIDEBAR_LIST_VISUAL` | P1/P5 | Medio |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/SelectableSortableContainer.tsx` | tsx | 217 | RightSidebar ListView | `MIGRATE_RIGHT_SIDEBAR_LIST_VISUAL` | P1/P5 | Medio |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/SelectableSortableItem.tsx` | tsx | 119 | RightSidebar ListView | `MIGRATE_RIGHT_SIDEBAR_LIST_VISUAL` | P1/P5 | Medio |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/shared/SidebarSurfacePrimitives.tsx` | tsx | 112 | RightSidebar shell/rails | `MIGRATE_RIGHT_SIDEBAR_SHELL_VISUAL` | P1/P5 | Medio |


# Apéndice C — Definición de acciones

| Acción | Significado |
|---|---|
| `CONFIG_VERIFY_OR_FIX` | Verificar config/entrypoint. Solo cambios mínimos. |
| `STABILIZE_AND_MIGRATE_JSX` | Corregir regresión visual y migrar Tailwind seguro. |
| `MIGRATE_JSX` | Tailwind directo en `className`. |
| `MIGRATE_LEFT_SIDEBAR_VISUAL` | Migrar visual LeftSidebar preservando drag/drop. |
| `MIGRATE_RIGHT_SIDEBAR_LIST_VISUAL` | Migrar ListView/toolbar/rows preservando selección. |
| `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | Migrar inspector/cards/widgets preservando commands. |
| `MIGRATE_RIGHT_SIDEBAR_SHELL_VISUAL` | Migrar tabs/rails/superficies. |
| `MIGRATE_RUNTIME_UI_SKIN` | Skin de controles runtime sin tocar geometría. |
| `MIGRATE_SCHEMA_VISUAL_SAFE` | Skin schema ui/propPanel preservando metadata y pdfRender. |
| `SPLIT_RULE_MIGRATE_SKIN_ONLY` | Separar visual de posición/geometry antes de migrar. |
| `KEEP_GEOMETRY_MIGRATE_SKIN_ONLY` | No tocar geometría; solo piel visual mínima. |
| `KEEP_GEOMETRY_MIGRATE_MINIMAL_SKIN` | Canvas: skin mínimo si es inevitable. |
| `KEEP_LEGACY_GEOMETRY` | Mantener legacy por geometría/posición. |
| `NO_VISUAL_MIGRATION` | Archivo lógico; no aplica Tailwind. |
| `NO_VISUAL_OR_SPLIT` | No visual salvo sub-sección muy concreta. |
| `DO_NOT_MIGRATE` | Prohibido migrar en esta iniciativa. |
| `DO_NOT_VISUAL_MIGRATE_NOW` | Entrada pública o API: no tocar sin task-card. |
| `SPLIT_RULE_NEEDS_TASK_CARD` | Archivo grande/riesgoso, requiere task-card propia. |
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

### 0208 — `reports/tailwind-migration/component-migration-ledger.md`

- **Lenguaje:** `markdown`
- **Líneas:** `62`
- **Tamaño original:** `5.1 KB`
- **SHA1 corto:** `8ff7eb942d`
- **Estado:** `completo`

```markdown
# Component migration ledger — Tailwind (SISAD PDFME)

Registro por componente de la migración CSS→Tailwind. Actualizado: 2026-07-09.
Regla de la sesión: **solo Tailwind en JSX/TSX** (sin editar CSS). Validación con Playwright en `/lab/multi-document-routing`.

Leyenda estado: ✅ migrado/estable · 🟡 parcial (skin aplicado, algo CSS-pinned) · ⏳ pendiente · 🔒 no tocar.

## RightSidebar — TC-CSS-05 / 06 / 07 + scroll fix

| Archivo | Estado | Última task | Tailwind JSX | Bridge | Legacy KEEP | Captura | Build | Riesgo |
|---|---|---|---|---|---|---|---|---|
| RightSidebar/RightSidebar.tsx | ✅ | scroll+densidad | sí | no | — | right-sidebar-detail-*, scroll-* | ✅ | bajo |
| RightSidebar/layout.tsx | ✅ | scroll owner (`SidebarBody` overflow-y-auto) | sí | no | — | scroll-detail-* | ✅ | bajo |
| RightSidebar/shared/SidebarSurfacePrimitives.tsx | 🟡 | densidad+textos | sí | no | font-size de header CSS-pinned | detail-* | ✅ | bajo |
| RightSidebar/DetailView/DetailViewContent.tsx | ✅ | densidad | sí | no | — | detail-* | ✅ | bajo |
| RightSidebar/DetailView/DetailHeaderCard.tsx | 🟡 | densidad | sí | no | título `.stage` CSS-pinned (0.82rem) | detail-* | ✅ | bajo |
| RightSidebar/DetailView/DetailSectionCard.tsx | 🟡 | densidad+colapso | sí | no | título/desc `[data-panel-mode=detail]` CSS-pinned | detail-* | ✅ | bajo |
| RightSidebar/DetailView/DetailFormSection.tsx | ✅ | quitar card anidada (`p-0 bg-transparent`) | sí | no | gutters de form-render | detail-* | ✅ | medio |
| RightSidebar/DetailView/InspectorPrimitives.tsx | ✅ | densidad+textos | sí | no | — | detail-* | ✅ | bajo |
| RightSidebar/DetailView/AlignWidget.tsx | ✅ | botones h-7 w-7 rounded-lg | sí | no | — | detail-* | ✅ | bajo |
| RightSidebar/DetailView/ButtonGroupWidget.tsx | ✅ | botones h-7 w-7 | sí | no | — | detail-* | ✅ | bajo |
| RightSidebar/DetailView/CompactConfigPanel.tsx | ✅ | densidad+textos | sí | no | — | detail-* | ✅ | bajo |
| RightSidebar/ListView/ListView.tsx | ✅ | densidad+scroll | sí | no | — | scroll-list-after | ✅ | bajo |
| RightSidebar/DocumentsRail.tsx | ✅ | densidad+textos | sí | no | — | scroll-documents-after | ✅ | bajo |
| RightSidebar/CommentsRail.tsx | ✅ | scroll (header shrink-0, lista flex-1) + quitó `style` inline | sí | no | tokens de color runtime | scroll-comments-after | ✅ | bajo |

## LeftSidebar — TC-CSS-04

| Archivo | Estado | Última task | Tailwind JSX | Bridge | Legacy KEEP | Captura | Build | Riesgo |
|---|---|---|---|---|---|---|---|---|
| Designer/LeftSidebar.tsx | 🟡 | densidad (shell, plugin-wrap, scroll owner) | sí | no | radio `left-sidebar-group` CSS-pinned; toggle-btn posición legacy | left-sidebar-after | ✅ | medio (dnd verificado OK) |
| Designer/LeftSidebarGroup.tsx | 🟡 | densidad card categoría | sí | no | border-radius CSS-pinned (1.2rem) | left-sidebar-after | ✅ | bajo |

## Control bar / overlays contextuales — TC-CSS-08

| Archivo | Estado | Última task | Tailwind JSX | Bridge | Legacy KEEP | Captura | Build | Riesgo |
|---|---|---|---|---|---|---|---|---|
| ui/components/CtlBar.tsx | ✅ | skin pill summary `px-2.5 py-1` | sí | no | clusters posicionados por CSS (canvas-chrome) | control-bar-toolbar-after | ✅ | bajo |
| Canvas/overlays/SelectionContextToolbar.tsx | 🟡 | skin (`p-1.5 shadow-md`) | sí | no | `style{top,left,width}` geometría; padding CSS-pinned | control-bar-toolbar-after | ✅ | medio (hit-testing verificado) |
| Canvas/overlays/CanvasContextMenu.tsx | ✅ | skin (`shadow-lg`) | sí | no | `resolveAnchoredFloatingSurfacePosition` geometría | control-bar-toolbar-after | ✅ | medio (menú abre, 9 items, in-viewport) |

## Pendientes / en curso por otra sesión (colisión — no tocar ahora)

| Área | Card | Estado | Nota |
|---|---|---|---|
| Canvas overlay skins (InlineEditOverlay, SchemaDragPreview, SchemaDropCommitFlash, SchemaDropPlaceholder) | TC-CSS-09 | 🔒 en edición paralela | esperar a que el worker termine |
| Lab shell (PageHeader, PdfmeLabPage, ResultsPanel, labRoutes.css) | TC-CSS-01A/01B | 🔒 en edición paralela | staged/modificado por otra sesión |
| CSS legacy (tokens/global/runtime/canvas-interactions) | migración `@layer`/`@apply` | 🔒 worker CSS | riesgo: `@layer` en CSS importado standalone rompe build (ver nota abajo) |
| Schemas visual (text/number/table/options…) | TC-CSS-10/11 | ⏳ | no iniciado en esta sesión |
| Runtime Form/Viewer | TC-CSS-12 | ⏳ | no iniciado |

## Notas de build

- **Riesgo recurrente (@layer):** envolver un CSS importado standalone (`ui/index.ts`, `editor/index.ts`) en `@layer base/components` rompe el build (`@layer X used but no matching @tailwind X`). Fix sistémico: no envolver esos archivos en `@layer`, o enrutarlos por el entry Tailwind (`@import` tras `@tailwind base/components`).
- Estado actual: **build ✅ (exit 0)**, **lint ✅ (0 errores, 117 warnings heredados)**.
- Ninguna de mis ediciones tocó archivos `.css`.

## Reportes de detalle
- `right-sidebar-tailwind-only-density-fix.md`
- `right-sidebar-scroll-tailwind-fix.md`
- `tc-css-04-left-sidebar-tailwind.md`
- `tc-css-08-control-bar-toolbar-tailwind.md`
```

<a id="file-0209"></a>

### 0209 — `reports/tailwind-migration/deep-density-spacing-audit.md`

- **Lenguaje:** `markdown`
- **Líneas:** `105`
- **Tamaño original:** `9.6 KB`
- **SHA1 corto:** `78c4f22192`
- **Estado:** `completo`

```markdown
# Deep Density & Spacing Audit

## 1. Estado del worktree
- git status inicial: `M src/features/pdfcomponent/ResultsPanel.jsx`, overlays en `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/**`, `src/sisad-pdfme/ui/styles/canvas-interactions.css`, `src/styles/sisad-tailwind-bridge.css`, LeftSidebar ya modificado por la fase previa, y documentos `unificados/*` ya tocados antes.
- cambios preexistentes: `TC-CSS-07` y `TC-CSS-08` estaban ya cerrados; también existían cambios previos en `LeftSidebar*`, `RightSidebar/*` y documentación unificada.
- archivos ya modificados por esta fase: `src/features/pdfcomponent/ResultsPanel.jsx`, `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/CanvasContextMenu.tsx`, `CommentsOverlay.tsx`, `GroupOptionFloatingAction.tsx`, `InlineEditOverlay.tsx`, `SchemaDragPreview.tsx`, `SchemaDropCommitFlash.tsx`, `SchemaDropPlaceholder.tsx`, `SelectionContextToolbar.tsx`, `SnapFeedbackOverlay.tsx`, `src/sisad-pdfme/ui/styles/canvas-interactions.css`, `src/styles/sisad-tailwind-bridge.css`.

## 2. Fuentes leídas
- plan: `plan-tailwind-completo-actualizado-sisad-pdfme.md`
- context pack código: `unificados/codigo-frontend-sisad—pdmfe.md`
- context pack documentación: `unificados/documentacion-sisad—pdmfeweb.md`
- context pack estilos: `unificados/styles-sisad—pdmfe.md`
- baseline: `public/img-version`
- reportes previos: `reports/tailwind-migration/pending-phases-progress.md`, `reports/tailwind-migration/img-version-baseline-inventory.md`, `reports/tailwind-migration/line-by-line-style-audit.md`

## 3. Mapa de cascada CSS
| Componente | JSX/TSX | Clase principal | Bridge | CSS legacy activo | Candidato Tailwind | Conflicto | Decisión |
|---|---|---|---|---|---|---|---|
| Header / lab shell | `src/features/pdfcomponent/PageHeader.jsx`, `PdfmeLabPage.jsx`, `CompactControls.jsx` | `.sisad-pdfme-lab-page-hero`, `.sisad-pdfme-lab-header-collaboration` | sí | `labRoutes.css` | sí | doble skin entre shell y header slot | `MIGRATE_JSX_TAILWIND` + `MIGRATE_BRIDGE_APPLY` |
| LeftSidebar | `src/sisad-pdfme/ui/components/Designer/LeftSidebar*.tsx` | `.sisad-pdfme-designer-left-sidebar*` | sí | `sisad-pdfme-global.css`, runtime CSS | sí | densidad alta, Ant overrides delicados | `MIGRATE_BRIDGE_APPLY` + `KEEP_LEGACY` |
| RightSidebar ListView | `src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/*.tsx` | `.sisad-pdfme-designer-list-view*` | sí | `sisad-pdfme-global.css` | sí | grips, rows y filtros comparten densidad | `MIGRATE_BRIDGE_APPLY` |
| RightSidebar DetailView / Inspector | `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/*.tsx` | `.sisad-pdfme-designer-detail-*` | sí | `sisad-pdfme-global.css`, runtime CSS | sí | cards, inputs Ant, align widgets | `MIGRATE_BRIDGE_APPLY` + `KEEP_LEGACY` |
| Overlays / context menus | `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/*.tsx` | `.sisad-pdfme-ui-*` | sí | `canvas-interactions.css` | sí | z-index/position runtime vs skin | `SPLIT_RULE` |
| ResultsPanel | `src/features/pdfcomponent/ResultsPanel.jsx` | `.sisad-pdfme-lab-results*` | sí | `labRoutes.css` | sí | panel flotante demasiado visible | `MIGRATE_JSX_TAILWIND` + `MIGRATE_BRIDGE_APPLY` |
| Canvas core | `Canvas.tsx`, `Moveable.tsx`, `Selecto.tsx` | `.sisad-pdfme-designer-canvas*` | sí | `canvas-interactions.css`, tokens | no | geometría, scroll, transform, snap | `DO_NOT_TOUCH` |
| Runtime Form / Viewer | runtime components y CSS | runtime classes | sí | `sisad-pdfme-runtime.css` | sí | compatibilidad PDF/runtime | `MIGRATE_BRIDGE_APPLY` + `KEEP_LEGACY` |

## 4. Auditoría por densidad
| Componente | Archivo | Problema visual | Valor actual | Valor objetivo | Acción |
|---|---|---|---|---|---|
| Header | `labRoutes.css` + JSX | aún debía medir como topbar, no card | `51px` alto en DOM | `44-52px` | mantener compacto, sin segunda fila |
| LeftSidebar | `LeftSidebar.tsx` | panel ancho pero estable | `192px` ancho, `hasHorizontalOverflow: false` | `184-196px` | conservar densidad y no tocar drag/drop |
| RightSidebar | `RightSidebar/layout.tsx` | shell pesado pero consistente | `276px` ancho, `hasHorizontalOverflow: false` | `264-288px` | mantener, sólo skin compacto |
| ListView row chrome | `ListView/Item.tsx` | grips e iconos siguen muy compactos | control small detectado en DOM | icon buttons intencionales, >= 24px salvo grip | revisar en siguiente fase si se quiere más aire |
| DetailView / Inspector | `DetailView/*.tsx` | cards y sections aún tenían aire | compactados con bridge + Tailwind | `8-12px` panel / `28-32px` inputs | mantener y no tocar geometría |
| Overlays | `overlays/*.tsx` | toolbars, menu e inline edit dominaban demasiado | compactados en clase + CSS | toolbar 24-28px, context menu 24-30px | ya calibrado |
| ResultsPanel | `ResultsPanel.jsx` | drawer seguía muy “alto contraste” | pill/drawer compactado, `shadow-lg/xl`, `p-2` | pill `28-34px`, drawer `<=38dvh` | compactación aplicada |

## 5. Reglas duplicadas o conflictivas
| Selector | Archivo A | Archivo B | Quién gana | Riesgo | Acción |
|---|---|---|---|---|---|
| `.sisad-pdfme-lab-results*` | `labRoutes.css` | `ResultsPanel.jsx` | JSX + bridge en skin | shadow/padding inflado | compactado, mantener layout en CSS |
| `.sisad-pdfme-ui-selection-context-toolbar` | `canvas-interactions.css` | `SelectionContextToolbar.tsx` | CSS legacy para posición, JSX para skin | doble padding/radius | calibrado, mantener `z-index` legacy |
| `.sisad-pdfme-ui-canvas-context-menu` | `canvas-interactions.css` | `CanvasContextMenu.tsx` | CSS legacy para position, JSX para item skin | menú demasiado grande | compactado, sin z-index arbitrario |
| `.sisad-pdfme-ui-inline-edit-overlay` | `canvas-interactions.css` | `InlineEditOverlay.tsx` | CSS legacy para overlay / JSX para visual | overlay muy voluminoso | compactado |
| `.sisad-pdfme-designer-list-view-item-grip` | `sisad-pdfme-global.css` | `ListView/Item.tsx` | CSS legacy | grip en mini density puede bajar a 16px | riesgo residual, no se tocó geometría |
| `.sisad-pdfme-designer-detail-section-card` | `sisad-tailwind-bridge.css` | `DetailSectionCard.tsx` | bridge | duplicidad de surface/spacing | ya normalizado |

## 6. Decisiones
| Decisión | Motivo | Evidencia | Riesgo |
|---|---|---|---|
| Mantener `src/styles/tailwind.css` como única entrada Tailwind | evita doble emisión | `src/style.css` neutralizado, plan y audit previo | bajo |
| Mantener `sisad-tailwind-bridge.css` a nivel raíz con `@apply` | evita purga de clases dinámicas | lectura del bridge y reportes previos | bajo |
| Tratar canvas/geometry/Moveable/Selecto como `KEEP_LEGACY` | son dominios críticos | plan, line-by-line audit, selectors sensibles | alto si se toca |
| Compactar overlays y ResultsPanel sin mover posiciones runtime | reduce aire visual sin romper hit-testing | screenshots + DOM metrics + build/lint | bajo |
| Aceptar pequeña densidad residual en list-view grips | es un icon-control intencional; no afecta overflow | DOM metrics: `hasHorizontalOverflow: false` | medio |

## 7. Conclusión de la fase
- La cascada está controlada: Tailwind queda como skin por capas seguras, con legacy conservado donde hay geometría o runtime sensible.
- La reducción adicional más clara en esta fase fue `ResultsPanel`, junto con overlays/context menus.
- El canvas sigue siendo protagonista: no se tocó `Canvas.tsx`, `Moveable.tsx`, `Selecto.tsx`, ni geometría.
- El siguiente corte razonable sigue siendo `TC-CSS-09 — Schema chrome visual / field rendering`.

## 8. Métricas DOM
- archivo: `reports/tailwind-migration/density-spacing-dom-metrics.json`
- resumen:
  - `basic-designer`: hero `51px`, LeftSidebar `192px`, RightSidebar `276px`, `hasHorizontalOverflow: false`.
  - `multi-document-routing`: hero `51px`, LeftSidebar `192px`, RightSidebar `276px`, `hasHorizontalOverflow: false`.
  - `generator-runtime`: sin overlays visibles en las rutas de navegación inicial.
  - los controles pequeños detectados en el panel derecho corresponden a icon-only / ant wrappers; no hubo overflow horizontal.

## 9. Capturas generadas
- `reports/tailwind-migration/current-screenshots/selection-toolbar-after.png`
- `reports/tailwind-migration/current-screenshots/context-menu-after.png`
- `reports/tailwind-migration/current-screenshots/inline-edit-after.png`
- `reports/tailwind-migration/current-screenshots/multi-document-routing-after-overlays.png`

## 10. Validación funcional
- `npm run build`: pasó.
- `npm run lint`: pasó con warnings heredados; la primera ejecución en paralelo mostró un `ENOENT` transitorio de Vite/ESLint, resuelto al rerun secuencial.
- validaciones DOM: sin overflow horizontal en RightSidebar, sin regressión de shell, sin tocar canvas core.

## 11. Build/Lint/Tests
- build: `pass`
- lint: `pass with inherited warnings only`
- tests focales: no se ejecutaron en esta fase; no era necesario tocar schema/runtime/generator.

## 12. Riesgos residuales
- algunos icon-controls del ListView siguen muy compactos en `mini` density; son intencionales pero podrían revisarse en `TC-CSS-09` si se busca más legibilidad.
- `ResultsPanel` quedó más compacto, pero sigue dependiendo de `labRoutes.css` para posición drawer y de bridge para skin; no conviene mezclarlo con shell/canvas.
- `labRoutes.css` y `sisad-pdfme-global.css` siguen grandes; la limpieza real de legacy queda para `TC-CSS-12`.

## 13. Siguiente fase
`TC-CSS-09 — Schema chrome visual / field rendering`

## 14. Criterio de cierre
- [x] Auditoría creada.
- [x] Cambios mapeados a hallazgos.
- [x] No se tocó canvas core.
- [x] No se tocó Moveable/Selecto.
- [x] No se tocó snapshot/generator/pdf-lib.
- [x] Build pasó.
- [x] Lint pasó o quedó en warnings heredados.
- [x] Capturas generadas.
- [x] Reporte actualizado.
```

<a id="file-0210"></a>

### 0210 — `reports/tailwind-migration/img-version-baseline-inventory.md`

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

<a id="file-0211"></a>

### 0211 — `reports/tailwind-migration/line-by-line-style-audit.md`

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

<a id="file-0212"></a>

### 0212 — `reports/tailwind-migration/pending-phases-progress.md`

- **Lenguaje:** `markdown`
- **Líneas:** `10`
- **Tamaño original:** `1.9 KB`
- **SHA1 corto:** `4912317045`
- **Estado:** `completo`

```markdown
| Fase | Estado | Archivos objetivo | Riesgo | Resultado |
|---|---|---|---|---|
| TC-CSS-07 LeftSidebar | completed | `src/sisad-pdfme/ui/components/Designer/LeftSidebar/**`, `src/styles/sisad-tailwind-bridge.css`, `src/sisad-pdfme/ui/styles/sisad-pdfme-global.css` | Medio | Compactación aplicada sin romper drag/drop |
| TC-CSS-08 Overlays | completed | `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/**`, `src/styles/sisad-tailwind-bridge.css`, `src/sisad-pdfme/ui/styles/canvas-interactions.css` | Alto | Toolbars/menus compactos sin tocar geometría |
| TC-CSS-08.5-DEEP Deep Density, Spacing & Cascade Calibration | completed | `src/features/pdfcomponent/ResultsPanel.jsx`, `src/styles/sisad-tailwind-bridge.css`, `src/sisad-pdfme/ui/styles/canvas-interactions.css`, `reports/tailwind-migration/deep-density-spacing-audit.md` | Medio | Auditado y calibrado el exceso de aire visual con métricas DOM |
| TC-CSS-09 Schema chrome | completed | `src/sisad-pdfme/schemas/**`, `src/styles/sisad-tailwind-bridge.css`, `src/sisad-pdfme/ui/styles/canvas-interactions.css` | Alto | Field chrome compactado por familia compacta sin tocar data/render |
| TC-CSS-10 Runtime | completed | `src/sisad-pdfme/ui/styles/sisad-pdfme-runtime.css`, `src/styles/sisad-tailwind-bridge.css`, `src/sisad-pdfme/ui/styles/sisad-pdfme-global.css` | Medio | Paridad Form/Viewer/PDF compactada y verificada |
| TC-CSS-11 Lab | completed | `src/features/pdfcomponent/**`, `src/styles/sisad-tailwind-bridge.css`, `src/features/pdfcomponent/labRoutes.css` | Medio | Landing y results drawer compactos; lab CSS restante revisado |
| TC-CSS-12 Cleanup | pending | `src/features/pdfcomponent/labRoutes.css`, `src/sisad-pdfme/ui/styles/*.css`, `src/styles/sisad-tailwind-bridge.css` | Medio | Reducir legacy muerto con evidencia |
| TC-CSS-13 Docs | pending | `docs/11-migraciones/tailwind-migration.md`, `docs/09-theming/tailwind-and-css-architecture.md` | Bajo | Documentación y reportes actualizados |
```

<a id="file-0213"></a>

### 0213 — `reports/tailwind-migration/README.md`

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

<a id="file-0214"></a>

### 0214 — `reports/tailwind-migration/right-sidebar-scroll-tailwind-fix.md`

- **Lenguaje:** `markdown`
- **Líneas:** `45`
- **Tamaño original:** `3.4 KB`
- **SHA1 corto:** `6a5243aba5`
- **Estado:** `completo`

```markdown
# RightSidebar — Tailwind-only scroll & layout fix

Objetivo: contrato único de altura/scroll para que el inspector no corte contenido y las secciones inferiores sean accesibles. Solo Tailwind en JSX/TSX. Sin tocar CSS.

## Causa raíz (diagnóstico DOM con Playwright/CDP)

El `SidebarBody` compartido (`.sisad-pdfme-designer-right-sidebar-layout-body`) tenía `overflow: hidden` con contenido de `scrollHeight: 1323` dentro de `clientHeight: 792`. Como no había ningún hijo con `overflow-y-auto`, **el contenido por debajo de ~792px quedaba recortado e inaccesible**. Secciones `appearance/behavior/help/dataBindings/collaboration/advanced` caían fuera del área visible sin forma de scrollear.

El resto de la cadena de altura ya estaba correcta (794px en aside → content → detail-host → detail-view → sidebar-frame → layout-body). El único eslabón roto era el overflow del body.

## Cambios aplicados (tabla)

| Archivo | Componente | Problema detectado | Cambio Tailwind aplicado | Riesgo |
|---|---|---|---|---|
| layout.tsx | `SidebarBody` | `overflow-hidden` recortaba el contenido largo | `overflow-hidden` → `overflow-y-auto overflow-x-hidden overscroll-contain` (scroll owner único; compartido por Detail/List/Documents) | bajo |
| RightSidebar.tsx | `panel-switcher-wrap` (tabs) | podía comprimirse; debe quedar fijo | `+ shrink-0` | bajo |
| RightSidebar.tsx | `detail-view-host` | `flex 0 1 auto` sin `min-h-0` (contrato frágil) | `+ flex min-h-0 flex-1 flex-col overflow-hidden` | bajo |
| CommentsRail.tsx | header | header formaba parte del scroll | `SidebarSurfaceHeader className="shrink-0"` | bajo |
| CommentsRail.tsx | lista de hilos | `style` inline con `overflowY:auto` sin `flex-1` (altura no acotada) | reemplazado por `className="flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto overflow-x-hidden overscroll-contain"` (eliminado `style` inline) | bajo |

`SidebarHeader`/`SidebarFooter` ya eran `flex-none` (= shrink-0), por eso los tabs/headers/footers no scrollean.

## Contrato de scroll final

``​`
aside   .right-sidebar          → h-full min-h-0 flex flex-col
content .right-sidebar-content  → flex min-h-0 flex-1 flex-col overflow-hidden
tabs    .panel-switcher-wrap    → shrink-0
host    .detail-view-host       → flex min-h-0 flex-1 flex-col overflow-hidden
frame   .sidebar-frame          → flex h-full min-h-0 flex-col overflow-hidden
header  SidebarHeader           → flex-none (shrink-0)
SCROLL  .layout-body (SidebarBody) → min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain   ← único scroll owner
``​`

## Validación DOM (después)

- Scroll owner (único): `.sisad-pdfme-designer-right-sidebar-layout-body` → `scrollH 1323 / clientH 792`, `overflow-y: auto`.
- Overflow horizontal: `scrollWidth 252 == clientWidth 252` → **false**.
- Secciones inferiores tras scroll: `appearance/behavior/help/dataBindings/collaboration/advanced` → todas `visible: true`.
- ListView: body `overflow-y: auto`, `canScroll: true`.
- Tabs Campos/Detalle/Comentarios/Docs: cambian. Colapso de sección: `false→true`. Edición de nombre: OK (verificado en fase previa). 0 errores de consola.

## CSS no tocado

Ninguno de los archivos `.css` prohibidos fue modificado por esta tarea. Los `.css` que aparecen en `git status` (`sisad-pdfme-global.css`, `labRoutes.css`) corresponden a trabajo externo/paralelo de la migración, no a esta tarea.
```

<a id="file-0215"></a>

### 0215 — `reports/tailwind-migration/right-sidebar-tailwind-only-density-fix.md`

- **Lenguaje:** `markdown`
- **Líneas:** `34`
- **Tamaño original:** `3.2 KB`
- **SHA1 corto:** `70bc04002c`
- **Estado:** `completo`

```markdown
# RightSidebar — Tailwind-only compact density fix

Fase: RightSidebar visual density (Tailwind JSX/TSX only). Sin CSS nuevo, sin editar `.css`.

## Auditoría (antes)

| Archivo | Componente | Problema | Cambio Tailwind propuesto | Riesgo |
|---|---|---|---|---|
| RightSidebar.tsx | `right-sidebar-content` | `rounded-3xl` gigante | `rounded-2xl` | bajo |
| RightSidebar.tsx | `panel-switcher-wrap` | `gap-3 px-4 py-3` | `gap-1.5 px-2 py-1.5` | bajo |
| RightSidebar.tsx | `panel-switcher-btn` | `rounded-full px-2.5 py-1.5 gap-2` píldora alta | `rounded-lg px-2 py-1 gap-1.5 min-h-7`, label oculto en mini | bajo |
| RightSidebar.tsx | `right-sidebar-layout-grid` | `gap-2.5` | `gap-1.5` | bajo |
| layout.tsx | `SidebarFrame` | `rounded-3xl` | `rounded-2xl` | bajo |
| layout.tsx | `SidebarHeader` | `px-4 py-3 gap-3` | `px-2.5 py-2 gap-2` | bajo |
| layout.tsx | `SidebarBody` | `px-3.5 py-3` | `px-2 py-2` | bajo |
| layout.tsx | `SidebarFooter` | `px-4 py-3` | `px-2.5 py-2` | bajo |
| SidebarSurfacePrimitives.tsx | `sidebar-surface-header` | `rounded-2xl px-3 py-3 gap-3` | `rounded-xl px-2.5 py-2 gap-2` | bajo |
| SidebarSurfacePrimitives.tsx | badges/copy | `space-y-1 mt-1 gap-1.5 text-[11px]` | `space-y-0.5 mt-0.5 gap-1 h-5 text-[10px] leading-none` | bajo |
| DetailHeaderCard.tsx | header card | `rounded-2xl`, back `h-8 w-8`, tag `text-[11px]` | `rounded-xl`, back `h-7 w-7`, tag `h-5 text-[10px] leading-none` | bajo |
| DetailSectionCard.tsx | `detail-section-card` | `rounded-2xl p-2.5 shadow-sm` | `rounded-xl p-1.5 shadow-none` | bajo |
| DetailSectionCard.tsx | head button | `rounded-xl px-2.5 py-1.5` | `rounded-lg px-2 py-1 min-h-[30px]` | bajo |
| DetailSectionCard.tsx | body | `mt-1.5 rounded-xl bg-slate-50/60 p-2.5` | `mt-1 rounded-lg bg-slate-50/50 p-1.5` | bajo |
| DetailSectionCard.tsx | description | `text-[0.62rem] leading-4` | `+ truncate leading-3` | bajo |
| DetailViewContent.tsx | sections wrap | `mt-2.5 space-y-2` | `mt-1.5 space-y-1.5` | bajo |
| DetailFormSection.tsx | form shell | `rounded-2xl bg-white/90 p-2.5 shadow-sm` | `bg-transparent p-0 shadow-none` (elimina card anidada) | medio |
| AlignWidget.tsx | grid/botones | `gap-1.5`, `h-8 w-8 rounded-xl shadow-sm`, icon 15 | `gap-1`, `h-7 w-7 rounded-lg shadow-none`, icon 14 | bajo |
| InspectorPrimitives.tsx | summary/metric | `rounded-2xl p-2.5 space-y-2.5 shadow-sm` | `rounded-xl p-1.5 space-y-1.5 shadow-none` | bajo |
| CompactConfigPanel.tsx | panel | `rounded-2xl p-2.5 shadow-sm` | `rounded-xl p-1.5 shadow-none` | bajo |
| ButtonGroupWidget.tsx | botones | `h-9 w-9 rounded-xl shadow-sm gap-2` | `h-7 w-7 rounded-lg shadow-none gap-1.5` | bajo |
| DocumentsRail.tsx | items | `rounded-2xl px-3 py-3 space-y-2` | `rounded-xl px-2 py-2 space-y-1.5` | bajo |

## Nota sobre gutters de form-render

Los estilos inline `margin-left/right: -12px` + `padding-left/right: 12px` provienen del `Row`/`Col` interno de `form-render` (gutter por defecto). El margen negativo y el padding se compensan a cero contra el borde del form-shell, por lo que **no** producen overflow. Al dejar el form-shell en `p-0 bg-transparent`, el contenido queda alineado al borde de la sección sin card anidada. No se fuerza cambio del gutter por CSS ni por schema data (prohibido). Queda como riesgo residual estético menor.
```

<a id="file-0216"></a>

### 0216 — `reports/tailwind-migration/rightsidebar-detailview-tailwind-audit.md`

- **Lenguaje:** `markdown`
- **Líneas:** `13`
- **Tamaño original:** `2.3 KB`
- **SHA1 corto:** `307fbf576f`
- **Estado:** `completo`

```markdown
| File | Component | Current state | Action | Risk |
|---|---|---|---|---|
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailViewContent.tsx` | `DetailViewContent` | Shell already split from canvas; sections still have extra vertical air | `MIGRATE_JSX_TAILWIND` | Low |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailSectionCard.tsx` | `DetailSectionCard` | Stable section wrapper with compact logic; padding can be reduced safely | `MIGRATE_JSX_TAILWIND` | Low |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/InspectorPrimitives.tsx` | Inspector primitives | Shared summary/action/metric skins still feel heavy in detail mode | `MIGRATE_BRIDGE_APPLY` | Medium |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/AlignWidget.tsx` | `AlignWidget` | Safe button grid; compact icon controls only | `MIGRATE_JSX_TAILWIND` | Low |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/CompactConfigPanel.tsx` | `CompactConfigPanel` | Shared config card used by inspector widgets; can be tightened safely | `MIGRATE_JSX_TAILWIND` | Low |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailFormSection.tsx` | Detail form shell | Form-render wrapper still carries legacy padding/shadow | `MIGRATE_BRIDGE_APPLY` | Medium |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailWidgetRegistry.tsx` | Inline edit actions | Logic-heavy registry; visual skin should come from shared selectors | `KEEP_LEGACY` | Medium |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaCollaborationWidget.tsx` | Collaboration inspector widget | Runtime-heavy widget with shared panel skin | `KEEP_LEGACY` | Medium |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaConnectionsWidget.tsx` | Connections inspector widget | Runtime-heavy widget with nested Ant controls | `KEEP_LEGACY` | Medium |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailHeaderCard.tsx` | Detail header card | Already compact and slot-driven; header skin can stay centralized | `KEEP_LEGACY` | Low |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/shared/SidebarSurfacePrimitives.tsx` | Shared sidebar header primitives | Shared chrome already centralised for list/detail surfaces | `KEEP_LEGACY` | Low |
```

<a id="file-0217"></a>

### 0217 — `reports/tailwind-migration/runtime-form-viewer-tailwind-audit.md`

- **Lenguaje:** `markdown`
- **Líneas:** `20`
- **Tamaño original:** `1.4 KB`
- **SHA1 corto:** `4effb02426`
- **Estado:** `completo`

```markdown
# TC-CSS-10 — Runtime Form / Viewer visual parity

## Scope
- Ajuste de densidad para `Form` / `Viewer` y chrome runtime compartido.
- Sin tocar `Canvas`, `Moveable`, `Selecto`, `generator` ni `pdf-lib`.

## Audit

| Archivo | Componente | Estado actual | Acción | Riesgo |
|---|---|---|---|---|
| `src/sisad-pdfme/ui/styles/sisad-pdfme-global.css` | `preview-scroll`, `control-bar`, `pager`, `zoom`, `text-btn` | Runtime visual limpio pero todavía con algo de aire en wrappers y chrome | `MIGRATE_BRIDGE_APPLY` | Bajo |
| `src/sisad-pdfme/ui/styles/sisad-pdfme-runtime.css` | Runtime density overrides | Ya concentra reglas de compatibilidad por modo | `KEEP_LEGACY` | Bajo |
| `src/styles/sisad-tailwind-bridge.css` | Runtime text-like / option-based bridge | Ya preserva skin compartido por data attributes | `KEEP_LEGACY` | Bajo |
| `src/sisad-pdfme/ui/components/Preview.tsx` | Composición runtime | Correcto, sin cambios de lógica | `DO_NOT_TOUCH` | Bajo |
| `src/sisad-pdfme/ui/components/CtlBar.tsx` | Toolbar runtime | Correcto, solo skin y densidad | `KEEP_LEGACY` | Bajo |
| `src/sisad-pdfme/ui/components/UnitPager.tsx` | Pager runtime | Correcto, compacto y estable | `KEEP_LEGACY` | Bajo |

## Result
- La compactación aplicada reduce el aire visual del runtime sin alterar el layout del documento ni la geometría del paper.
- El runtime mantiene la paridad Form/Viewer y la separación clara entre chrome y contenido.
```

<a id="file-0218"></a>

### 0218 — `reports/tailwind-migration/schema-chrome-tailwind-audit.md`

- **Lenguaje:** `markdown`
- **Líneas:** `18`
- **Tamaño original:** `1.3 KB`
- **SHA1 corto:** `9d6e86216e`
- **Estado:** `completo`

```markdown
# TC-CSS-09 — Schema chrome visual / field rendering

## Scope
- Compactar la familia `action-based` y el chrome compartido de selección de opciones sin tocar geometría, canvas, Moveable o Selecto.

## Audit

| Archivo | Componente | Estado actual | Acción | Riesgo |
|---|---|---|---|---|
| `src/sisad-pdfme/ui/styles/sisad-pdfme-global.css` | `action-button`, `note-container`, `attachment-container`, `option-group` | Visual correcto pero con aire superior al baseline compacto | `MIGRATE_BRIDGE_APPLY` / compactación segura por familia | Bajo |
| `src/styles/sisad-tailwind-bridge.css` | Runtime text-like chrome | Ya centraliza parte del runtime visual | `KEEP_LEGACY` | Bajo |
| `src/sisad-pdfme/schemas/shared/fieldChrome.ts` | Field chrome policy | Contrato estable, sin cambios de geometría | `KEEP_LEGACY` | Bajo |
| `src/sisad-pdfme/schemas/shared/renderSchemaWithChrome.ts` | Template de render | Contrato estable | `DO_NOT_TOUCH` | Bajo |
| `src/sisad-pdfme/schemas/actions/actionSchemaFactory.ts` | Note / attachment | Compacto y compatible | `KEEP_LEGACY` | Bajo |

## Result
- La compactación se aplicó solo a familias compactas y no alteró la geometría del campo.
- `basic-designer` continúa renderizando `field-chrome` y `action-based` sin overflow ni regresiones visibles.
```

<a id="file-0219"></a>

### 0219 — `reports/tailwind-migration/tc-css-04-left-sidebar-tailwind.md`

- **Lenguaje:** `markdown`
- **Líneas:** `45`
- **Tamaño original:** `2.8 KB`
- **SHA1 corto:** `f2f0066d69`
- **Estado:** `completo`

```markdown
# TC-CSS-04 — LeftSidebar baseline (Tailwind-only)

Card única del plan (Sprint A, tras RightSidebar). Solo Tailwind en JSX/TSX. Sin tocar CSS. Sin romper drag/drop, filtros, favoritos, recientes, búsqueda ni tabs.

## Alcance
Pase de densidad/consistencia para alinear el LeftSidebar con la escala ya validada en el RightSidebar, conservando la estética baseline (panel blanco flotante, tabs cápsula, search pill, filtros, categorías uppercase, cards con icono centrado).

## Archivos modificados
- `LeftSidebar.tsx`
- `LeftSidebarGroup.tsx`

## Cambios (Tailwind)
| Componente | Antes | Después |
|---|---|---|
| `left-sidebar-shell` | `rounded-3xl` | `rounded-2xl` |
| `dock-header` | `px-3.5 py-2.5` | `shrink-0 px-2.5 py-2` |
| `control-band` | `space-y-2 px-3.5 py-2.5` | `shrink-0 space-y-1.5 px-2.5 py-2` |
| `left-sidebar-main` (scroll owner) | `px-3.5 py-2.5` | `space-y-1.5 overflow-x-hidden overscroll-contain px-2 py-2` |
| search stack/wrap | `space-y-2.5` | `space-y-2` |
| `plugin-wrap` (×2) | `rounded-2xl p-1.5 shadow-sm` | `rounded-xl p-1 shadow-none` |
| `left-sidebar-group` | `rounded-[1.2rem] p-1.5 shadow-sm` | `rounded-xl p-1.5 shadow-none` |
| group title | `rounded-[0.9rem] px-2.5 py-1.5` | `min-h-[28px] rounded-lg px-2 py-1` |
| group items | `mt-1.5 space-y-[0.3125rem]` | `mt-1 space-y-1` |

## Validación funcional (Playwright, 0 errores de consola)
- Filtros Todos / Favoritos / Recientes: ✅ clican y cambian.
- Búsqueda "firma": ✅ 8 resultados.
- Cambio de tab (Estándar → Personalizado): ✅ `data-active-tab="custom"`.
- Colapsar/expandir categoría: ✅ `aria-expanded true→false`.
- Drag/drop: ✅ 38 draggable shells, 76 botones de esquema con listeners dnd-kit intactos.
- Scroll interno (`left-sidebar-main`): ✅ `overflow-y: auto`, `canScroll: true`.

## Notas / límites (Tailwind-only estricto)
- **`left-sidebar-group` border-radius** sigue en `1.2rem`: lo fija una regla CSS con selector de mayor especificidad (mismo caso que en RightSidebar). `shadow-none` y el padding SÍ aplicaron; el radio queda CSS-pinned. No se fuerza con `!important` ni editando CSS.
- **Overflow horizontal del root (`scrollWidth 208 > clientWidth 192`, 16px):** el único elemento que sobresale es `.sisad-pdfme-designer-sidebar-toggle-btn` (el handle de colapsar el panel), posicionado por CSS legacy **por diseño**, preexistente y no tocado en esta card. El contenido (grupos, botones, search) no desborda. No se recorta para no ocultar el control de colapso.

## CSS no tocado
Ninguno `.css` fue modificado en esta card. Los `.css` que figuran en `git status` (`sisad-pdfme-global.css`, `labRoutes.css`) son trabajo paralelo, ajeno a esta tarea.

## Build/Lint
- `npm run build`: ✅ pasa.
- `eslint` en los 2 archivos: ✅ 0 errores / 0 warnings.

## Capturas
`reports/tailwind-migration/current-screenshots/left-sidebar-before.png`, `left-sidebar-after.png`.
```

<a id="file-0220"></a>

### 0220 — `reports/tailwind-migration/tc-css-08-control-bar-toolbar-tailwind.md`

- **Lenguaje:** `markdown`
- **Líneas:** `43`
- **Tamaño original:** `2.5 KB`
- **SHA1 corto:** `b8ccc6fe45`
- **Estado:** `completo`

```markdown
# TC-CSS-08 — Control bar / toolbar contextual (Tailwind-only)

Card única del plan (Sprint B). Regla: **solo skin en Tailwind**; `position/transform/z-index/pointer-events/hit-testing` se conservan (legacy/tokens/`style`). No tocar Canvas/Moveable/Selecto.

## Hallazgo
Los tres archivos objetivo ya estaban **mayormente migrados a Tailwind**:
- `SelectionContextToolbar.tsx` y `CanvasContextMenu.tsx`: layout y skin en `className` Tailwind; posición vía `style={{ top,left }}` (geometría, intacta).
- `CtlBar.tsx`: clusters posicionados por CSS legacy (canvas-chrome, intacto); pills ya con skin Tailwind.

Por tanto la card se resolvió con un **pase de consistencia de skin/densidad** de bajo riesgo, sin reescribir geometría.

## Archivos modificados
- `src/sisad-pdfme/ui/components/CtlBar.tsx`
- `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/SelectionContextToolbar.tsx`
- `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/CanvasContextMenu.tsx`

## Cambios (solo skin)
| Archivo | Antes | Después |
|---|---|---|
| CtlBar summary pill | `px-3 py-2` | `px-2.5 py-1` (densidad consistente con las demás pills) |
| SelectionContextToolbar contenedor | `p-2 shadow-lg` | `p-1.5 shadow-md` (sombra flotante más ligera) |
| CanvasContextMenu contenedor | `shadow-xl` | `shadow-lg` |

**No se tocó:** `style={{ top,left,width }}`, `resolveAnchoredFloatingSurfacePosition`, `floatingSurfaceGeometry`, `data-schema-interactive-control`, z-index, pointer-events, ni ninguna lógica de acciones/comandos.

## Validación (Playwright, ruta multi-document-routing, 0 errores de consola)
- Control bar: renderiza (4 clusters, 4 pills). ✅
- Toolbar de selección: aparece al seleccionar campo; posición intacta (`top:81.6px left:504.8px` desde `style`), ancho 250px. ✅
- Menú contextual (click derecho): abre con **9 items, dentro del viewport** → hit-testing y anclaje intactos. ✅
- Cierre con Escape: ✅.

## Notas (Tailwind-only estricto)
- El padding del `selection-context-toolbar` computa `2px 4px`: lo fija CSS legacy con mayor especificidad (mismo patrón que en sidebars). El skin que sí aplica es el de sombra/estructura; el resto queda CSS-pinned. No se fuerza con `!important` ni editando CSS.

## CSS no tocado
Ningún `.css` modificado por esta card. Los `.css` en `git status` (`sisad-pdfme-global.css`, `labRoutes.css`) son trabajo paralelo ajeno.

## Build/Lint
- `npm run build`: ✅ pasa.
- `eslint` (3 archivos): ✅ 0 errores / 0 warnings.

## Capturas
`reports/tailwind-migration/current-screenshots/control-bar-toolbar-after.png`.
```

<a id="file-0221"></a>

### 0221 — `reports/tailwind-migration/tc-css-10-schemas-visual.md`

- **Lenguaje:** `markdown`
- **Líneas:** `33`
- **Tamaño original:** `3.7 KB`
- **SHA1 corto:** `137b461e8a`
- **Estado:** `completo`

```markdown
# TC-CSS-10/11 — Schemas visual + comportamiento seguro

Objetivo: mejorar visual/funcionalmente los schemas de `src/sisad-pdfme/schemas` sin romper Canvas/Moveable/Selecto/Snapshot/Form/Viewer/Generator ni geometría.

## Hallazgo importante antes de editar
Buena parte del spec **ya estaba implementada** por trabajo previo/paralelo:
- **Tarea 1 (SCHEMA VISUAL SYSTEM):** ya existe en `sisad-pdfme-global.css` (21 reglas `.sisad-pdfme-field-chrome`, incluyendo `data-schema-family` de `option-based/boolean/signing-based/action-based`, estados `selected/multi-selected/readonly`, familias `note/attachment/action-button`). **Añadirlo al bridge sería duplicación/conflicto de cascada** → NO lo dupliqué. **No edité ningún `.css`.**
- **Tareas 2/3 (option-group):** `optionGroupRenderer.ts` ya implementa `rowsInteractive = editable && !readOnly && !isViewer` (opciones internas no seleccionables en designer/viewer), `aria-checked/label/required/invalid/readonly`, `data-option-group-invalid`, clase `sisad-pdfme-option-group__option`, y sin `data-schema-id` en opciones internas. El bridge ya estiliza `__option`/`__add-button`/`[data-render-mode]`/`[data-option-labels]`. Ya cubierto.

## Cambios aplicados (Tailwind/TS seguro, sin CSS)

| Tarea | Archivo | Cambio | Riesgo |
|---|---|---|---|
| 5 select | `select/index.ts` | Separé `shouldShowChevron = mode!=='viewer'` de `shouldMountNativeSelect = mode==='form' && !readOnly`. El `<select>` invisible **ya no se monta en designer** (antes capturaba pointer events y bloqueaba drag/Moveable). Chevron sigue siendo decorativo (`pointer-events:none`). | bajo |
| 6 approve | `actions/approve.ts` | En `mode==='form'` el botón ahora llama `onChange([{content:action},{actionStatus:'approved'}])` **y** emite `CustomEvent('sisad-pdfme:schema-action')` (bubbles). Designer/viewer: visual/no interactivo. `renderMode` forwardeado al chrome. | bajo |
| 6 decline | `actions/decline.ts` | Igual, con `decline/declined`. | bajo |
| 8 signature | `signature/index.ts` | `applyFieldChrome(container, {family:'signing-based', renderMode})` → el placeholder toma el mismo chrome (borde/selected/readonly/required) que el resto vía `global.css`. Enfoque de bajo riesgo (no reestructuré el flujo complejo con `renderSchemaWithChrome`, que limpiaría el root). | bajo |

## Validación (Playwright, `/lab/multi-document-routing`, 0 errores de consola)
- `nativeSelectsInCanvas: 0` (designer ya no monta el `<select>` overlay) ✅
- Selección de campo en canvas funciona ✅
- `signingChrome: 2` (signature con `data-schema-family="signing-based"`) ✅
- `actionChrome: 4` (approve/decline/note/attachment) ✅
- 24 schemas renderizan, sin errores ✅
- Build `npm run build` ✅ (exit 0, TS compila) · lint sin errores (schemas están en el ignore pattern de eslint).

## Diferido (mayor riesgo runtime / requiere pase dedicado + validación Form/Viewer/Generator)
- **Tarea 4** (`optionGroupFactory.ts` — sync de altura mínima): toca geometría; requiere verificar callers y no romper bounding box del `+`.
- **Tarea 7** (`checkbox/index.ts` — toggle por modo designer/form/viewer + botón "convertir a grupo" solo en designer seleccionado): cambio de comportamiento; riesgo de romper Form/designer.
- **Tarea 2** (mover estilos inline del body a classNames): el renderer tiene overrides inline **intencionales** (comentario explícito: "inline beats builder; el body no debe dibujar borde/fondo ni clipear"). Migrarlo a clases requiere coordinar con `global.css` (dominio paralelo) para no reintroducir el clipping de la última fila.

## No tocado (reglas)
Canvas, Paper, Moveable, Selecto, coordenadas, x/y/width/height/rotation, snapshot, `pdf` render. Sin estilos inline nuevos (los existentes se conservan). Sin `setTimeout`.
```

<a id="file-0222"></a>

### 0222 — `reports/tailwind-migration/tc-css-11-lab-audit.md`

- **Lenguaje:** `markdown`
- **Líneas:** `31`
- **Tamaño original:** `1.2 KB`
- **SHA1 corto:** `4f4f0f1ea1`
- **Estado:** `completo`

```markdown
# TC-CSS-11 Lab Audit

## Scope
- `src/features/pdfcomponent/LabLandingPage.jsx`
- `src/features/pdfcomponent/CaseCard.jsx`
- `src/features/pdfcomponent/ResultsPanel.jsx`
- `src/features/pdfcomponent/labRoutes.css`
- `src/styles/sisad-tailwind-bridge.css`

## Summary
- The lab landing already matches the scan-first intent: compact hero, soft cards, stable grid, and no oversized wrappers.
- The results surface was already in the right shape, so this phase only tightened the drawer/pill skin to keep it visually quieter.
- No canvas, geometry, Moveable, Selecto, or runtime logic was touched.

## Visual check
- Landing remains compact and professional.
- Results drawer stays bottom-left, small, and non-invasive.
- The browser route keeps the PDF/editor as the visual protagonist.

## Captures
- `reports/tailwind-migration/current-screenshots/landing-after-tc-css-11.png`
- `reports/tailwind-migration/current-screenshots/multi-document-routing-after-tc-css-11.png`

## DOM check
- collaboration row sibling after the header: `null`
- header contains collaboration slot: `true`
- right sidebar horizontal overflow: `false`

## Validation
- `npm run build`: passed
- `npm run lint`: passed with inherited warnings only
```

<a id="file-0223"></a>

### 0223 — `reports/tailwind-migration/tc-css-ownership-color.md`

- **Lenguaje:** `markdown`
- **Líneas:** `38`
- **Tamaño original:** `4.0 KB`
- **SHA1 corto:** `3364966c37`
- **Estado:** `completo`

```markdown
# Ownership color — resolución central de tone por propietario

Objetivo: que todo schema use el color de su propietario/asignado (`ownerColor/userColor/recipientColor`) como tono de pertenencia, no colores hardcodeados/semánticos. Sin tocar Canvas/Moveable/Selecto/Paper/Snapshot/Generator ni geometría.

## Causa raíz (confirmada)
`applyFieldChrome` resolvía el tone con prioridad **incompleta**:
`ownerColor(param) ?? schema.ownerColor ?? schema.recipientColor ?? '#2563eb'`
— faltaban `userColor` y `__designer.ownerColor`, y el **param iba primero** (podía pisar el color propio del schema). El motor colaborativo devuelve `ownerColor: ownerColor || userColor`, así que schemas con solo `userColor` caían al fallback.

## Cambio aplicado (1 archivo, contenido)
`src/sisad-pdfme/schemas/shared/fieldChrome.ts`:
- **Nuevo helper exportado `resolveSchemaOwnerTone(schema, fallback)`** con prioridad completa: `ownerColor → userColor → recipientColor → __designer.ownerColor → __designer.recipientColor → fallback → #2563EB`. Deliberadamente NO lee `buttonColor/textColor/schema.color` (semánticos, no ownership).
- `applyFieldChrome` ahora usa `resolveSchemaOwnerTone(schema, ownerColor)` → el **color propio del schema tiene prioridad**, el param es solo fallback (mejora reglas 6/8: existing schemas conservan su color; el destinatario activo solo aplica a nuevos/preview/catálogo).
- Estampa `data-schema-owner-color` + variable `--schema-owner-color` en cada chrome, y añade `--schema-owner-color` a los `styleVars` de `resolveFieldChromePolicy`.

## Validación (Playwright, `/lab/multi-document-routing`, 0 errores)
- Build ✅ (exit 0, TS compila). Lint: sin errores (schemas en ignore pattern de eslint).
- 6/6 field-chrome exponen `data-schema-owner-color` + `--schema-owner-color`.
- Los schemas visibles de la escena por defecto **no traen dato de ownership** (`ownerRecipientId`/`ownerColor`/`userColor`/`recipientColor` ausentes) → muestran el fallback `#2563EB`. El fix usa el color propio **cuando existe**.

## Estado por familia (realidad del sistema)
- **text / option-based / boolean / signing-based:** ya renderizan owner color vía `--schema-tone` (border/surface en `global.css`) → correctos con el fix.
- **action-based (approve/decline/attachment/note):** su chrome es `border-0 bg-transparent` **por diseño en `global.css`**, y el contenido (botón verde/rojo, icono gris) es semántico → el owner color no es visible. Este es el caso que el usuario percibe como "no cambian".

## Por qué NO forcé el acento visible en action-based (honesto)
Hacer visible el owner color en approve/decline/attachment/note requiere un **acento** (border/ring/bar con `--schema-owner-color`) que hoy no aparece porque:
1. `global.css` fija `action-based` como `border-0 bg-transparent`, y **`global.css` NO está en los archivos permitidos** de esta tarea.
2. El bridge (permitido) **carga antes** que `global.css` → una regla `.field-chrome[...]` del bridge pierde por orden/especificidad, no puede sobrescribir el `border-0`.
3. La creación del botón (`createActionButtonEl`) vive en `schemaDom.ts`, **fuera de los archivos permitidos**.

Opciones para el siguiente pase (requieren autorización de scope):
- (a) editar `global.css` para añadir un acento owner-color en `action-based` usando la var `--schema-owner-color` que ya expongo; o
- (b) permitir tocar `schemaDom.ts`/render de cada action schema para pintar icono/acento con `resolveSchemaOwnerTone(schema)`.

La prioridad #5 del spec (resolver color desde `ownerRecipientId` + `recipientColorMap`) **no pertenece a la capa de schema** (`fieldChrome.ts` es puro, sin acceso al mapa): debe estamparse upstream por la capa de colaboración (`schemaOwnershipAppearance`), que ya debería poner `ownerColor` en el schema — el fix lo consume correctamente cuando está.

## No tocado
Canvas, Moveable, Selecto, Paper, Snapshot, Generator, `pdf` render, coordenadas x/y/w/h/rotation. Sin colores hardcodeados nuevos, sin `setTimeout`, sin `!important`, sin editar `.css`.
```

<a id="file-0224"></a>

### 0224 — `reports/tailwind-migration/ui-styles-decommission-audit.md`

- **Lenguaje:** `markdown`
- **Líneas:** `57`
- **Tamaño original:** `5.6 KB`
- **SHA1 corto:** `8f61d3ea72`
- **Estado:** `completo`

```markdown
# UI styles decommission audit

## Métrica inicial

| Archivo | Líneas | KB | Rol actual | Riesgo | Objetivo |
|---|---:|---:|---|---|---|
| `src/sisad-pdfme/ui/styles/tokens.css` | 374 | 16K | Tokens globales base | Alto si se reduce sin evidencia | Mantener solo variables realmente compartidas |
| `src/sisad-pdfme/ui/styles/sisad-pdfme-runtime.css` | 240 | 8K | Runtime/Form/Viewer shell residual | Medio | Reducir skins duplicados y dejar solo residual técnico |
| `src/sisad-pdfme/ui/styles/canvas-interactions.css` | 883 | 40K | Overlays/menus/toolbars del canvas | Alto, pero muy migrable | Bajar >20% eliminando skins ya cubiertos en TSX |
| `src/sisad-pdfme/ui/styles/sisad-pdfme-global.css` | 6408 | 172K | Shell/sidebars/schema chrome legacy mixto | Muy alto | Reducir por dominios, no en bloque |

## Imports CSS activos

| Archivo importador | CSS importado | Puede eliminarse ahora | Motivo |
|---|---|---|---|
| `src/sisad-pdfme/editor/index.ts` | `tokens.css`, `sisad-pdfme-runtime.css`, `canvas-interactions.css` | No | Entry del editor/runtime |
| `src/sisad-pdfme/ui/index.ts` | `tokens.css`, `sisad-pdfme-runtime.css`, `canvas-interactions.css` | No | Entry compartida del paquete UI |
| `src/main.jsx` | `src/styles/sisad-tailwind-bridge.css` | No | Bridge activo para hooks existentes |
| `src/App.jsx` | `src/features/pdfcomponent/labRoutes.css` | No | Lab shell sigue importando su layout |

## Selectores críticos no migrables todavía

| Selector | Archivo | Motivo | Riesgo si se migra |
|---|---|---|---|
| `.sisad-pdfme-designer-stage[data-schema-dragging="true"]` | `canvas-interactions.css` | Estado runtime del canvas | Romper drag/drop y visibilidad contextual |
| `.sisad-pdfme-ui-custom-selectable` | `canvas-interactions.css` / `fieldChrome.ts` | Chrome de schema con pseudo-elementos y data attrs | Pérdida de outline/readonly/required |
| `.sisad-pdfme-ui-schema-toolbar` | `canvas-interactions.css` | Toolbar anclada a campo con transform dinámico | Riesgo de offset y foco |
| `.sisad-pdfme-paper-*` | `sisad-pdfme-global.css` / `runtime.css` | Geometría paper/paper scale | Romper layout/zoom/print |
| `.moveable-*`, `.selecto-*` | runtime externo | Compatibilidad con librería de interacción | Romper selección y transform |
| `--schema-owner-color`, `--sisad-schema-selected-color` | `tokens.css` | Color runtime por destinatario/owner | Romper colorización por contexto |

## Selectores migrables a Tailwind JSX/TSX

| Selector | Archivo CSS | Componente dueño | Archivo JSX/TSX destino | Acción |
|---|---|---|---|---|
| `.sisad-pdfme-ui-canvas-context-menu*` | `canvas-interactions.css` | `CanvasContextMenu` | `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/CanvasContextMenu.tsx` | MIGRATE_JSX_TAILWIND |
| `.sisad-pdfme-ui-inline-edit-overlay*` | `canvas-interactions.css` | `InlineEditOverlay` | `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/InlineEditOverlay.tsx` | MIGRATE_JSX_TAILWIND |
| `.sisad-pdfme-schema-drag-preview*` | `canvas-interactions.css` | `SchemaDragPreview` | `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/SchemaDragPreview.tsx` | MIGRATE_JSX_TAILWIND |
| `.sisad-pdfme-schema-drop-placeholder*` | `canvas-interactions.css` | `SchemaDropPlaceholder` | `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/SchemaDropPlaceholder.tsx` | MIGRATE_JSX_TAILWIND |
| `.sisad-pdfme-schema-drop-commit-flash*` | `canvas-interactions.css` | `SchemaDropCommitFlash` | `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/SchemaDropCommitFlash.tsx` | MIGRATE_JSX_TAILWIND |
| `.sisad-pdfme-ui-snap-feedback*` | `canvas-interactions.css` | `SnapFeedbackOverlay` | `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/SnapFeedbackOverlay.tsx` | MIGRATE_JSX_TAILWIND |
| `.sisad-pdfme-shortcuts-*` | `canvas-interactions.css` | `ShortcutHelpButton` / `ShortcutHelpPanel` | `src/sisad-pdfme/ui/components/Designer/Shortcuts/*.tsx` | MIGRATE_JSX_TAILWIND |
| `.sisad-pdfme-designer-canvas-state-overlay .sisad-pdfme-designer-canvas-empty-state-*` | `canvas-interactions.css` | `CanvasStateOverlay` | `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/CanvasStateOverlay.tsx` | MIGRATE_JSX_TAILWIND |

## Selectores aparentemente muertos

| Selector | Archivo | Evidencia rg | Acción |
|---|---|---|---|
| `.sisad-pdfme-ui-shortcuts-launcher` | `canvas-interactions.css` | `rg -n "sisad-pdfme-ui-shortcuts-launcher" src` devolvió solo CSS | DELETE_DUPLICATE_WITH_EVIDENCE |
| `.sisad-pdfme-shortcuts-button` | `canvas-interactions.css` | El botón ya lleva Tailwind en `ShortcutHelpButton.tsx` | DELETE_DUPLICATE_WITH_EVIDENCE |
| `.sisad-pdfme-shortcuts-panel-body` | `canvas-interactions.css` | El panel ya usa Tailwind en `ShortcutHelpPanel.tsx` | DELETE_DUPLICATE_WITH_EVIDENCE |
| `.sisad-pdfme-shortcuts-groups` | `canvas-interactions.css` | El scroll/spacing ya está en JSX | DELETE_DUPLICATE_WITH_EVIDENCE |
| `.sisad-pdfme-shortcuts-group`, `.sisad-pdfme-shortcuts-row`, `.sisad-pdfme-shortcuts-key` | `canvas-interactions.css` | Las cards/rows/tags ya están pintadas con Tailwind | DELETE_DUPLICATE_WITH_EVIDENCE |
| `.sisad-pdfme-ui-canvas-context-menu*` | `canvas-interactions.css` | El componente ya trae classes completas | DELETE_DUPLICATE_WITH_EVIDENCE |
| `.sisad-pdfme-ui-inline-edit-overlay*` | `canvas-interactions.css` | El componente ya trae classes completas | DELETE_DUPLICATE_WITH_EVIDENCE |
| `.sisad-pdfme-schema-drag-preview-orb`, `.sisad-pdfme-schema-drag-preview-icon` | `canvas-interactions.css` | Los nodos ya usan Tailwind directo | DELETE_DUPLICATE_WITH_EVIDENCE |
| `.sisad-pdfme-ui-snap-feedback*` | `canvas-interactions.css` | El root y labels ya están en JSX | DELETE_DUPLICATE_WITH_EVIDENCE |
```

<a id="file-0225"></a>

### 0225 — `reports/tailwind-migration/ui-styles-decommission-progress.md`

- **Lenguaje:** `markdown`
- **Líneas:** `25`
- **Tamaño original:** `1.6 KB`
- **SHA1 corto:** `46a6e3f02a`
- **Estado:** `completo`

```markdown
# UI styles decommission progress

## Métrica por archivo

| Archivo | Líneas antes | Líneas después | Reducción | Estado |
|---|---:|---:|---:|---|
| `src/sisad-pdfme/ui/styles/tokens.css` | 374 | 383 | +9 | Conservado; normalizado a `:root` |
| `src/sisad-pdfme/ui/styles/sisad-pdfme-runtime.css` | 240 | 184 | 56 | Reducido parcialmente |
| `src/sisad-pdfme/ui/styles/canvas-interactions.css` | 883 | 567 | 316 | Reducido de forma significativa |
| `src/sisad-pdfme/ui/styles/sisad-pdfme-global.css` | 6408 | 4240 | 2168 | Reducido por dominios y wrappers |

## CSS eliminado

| Archivo | Selector/Bloque eliminado | Reemplazo Tailwind | Componente destino |
|---|---|---|---|
| `src/sisad-pdfme/ui/styles/canvas-interactions.css` | Drag preview, drop placeholder, commit flash, inline edit, snap feedback, context menu, shortcuts visuals | Tailwind en JSX/TSX y `className` inline | `Canvas` overlays y `Shortcuts` |

## CSS residual justificado

| Archivo | Selector/Bloque residual | Motivo | Fase futura |
|---|---|---|---|
| `src/sisad-pdfme/ui/styles/tokens.css` | Variables runtime/owner/recipient | Tokens globales compartidos y dinámicos | Mantener |
| `src/sisad-pdfme/ui/styles/sisad-pdfme-runtime.css` | Residual de runtime/Form/Viewer | Compatibilidad y chrome mínimo inevitable | TC-CSS-10 |
| `src/sisad-pdfme/ui/styles/canvas-interactions.css` | Selection toolbar, chrome técnico sensible | Geometría / pointer / runtime crítico | TC-CSS-08 / interacción |
| `src/sisad-pdfme/ui/styles/sisad-pdfme-global.css` | Shell, sidebars, paper, runtime layout | Cascada legacy aún compartida por múltiples vistas | TC-CSS-11 / TC-CSS-12 |
```

<a id="file-0226"></a>

### 0226 — `test-results/standard-fields-standard-f-c4dc3-s-the-expected-schema-types-chromium/error-context.md`

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

<a id="file-0227"></a>

### 0227 — `ai/task-cards/active/TASK-DOCS-001-ai-architecture-install.md`

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

<a id="file-0228"></a>

### 0228 — `ai/task-cards/backlog/TASK-CANVAS-001-protect-canvas-overflow.md`

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

<a id="file-0229"></a>

### 0229 — `ai/task-cards/backlog/TASK-CSS-001-tailwind-regression-stabilization.md`

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

<a id="file-0230"></a>

### 0230 — `ai/task-cards/backlog/TASK-VISUAL-001-img-version-baseline.md`

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

<a id="file-0231"></a>

### 0231 — `ai/task-cards/completed/README.md`

- **Lenguaje:** `markdown`
- **Líneas:** `3`
- **Tamaño original:** `0.1 KB`
- **SHA1 corto:** `cadc8883fb`
- **Estado:** `completo`

```markdown
# Completed Task Cards

Mover aquí task-cards completadas con reporte final.
```

<a id="file-0232"></a>

### 0232 — `.tailwind-migration-backups/20260708-111736/reports/tailwind-migration/README.md`

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
