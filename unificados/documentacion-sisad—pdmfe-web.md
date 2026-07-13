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
- **Fecha generación:** `2026-07-13T06:15:57.025Z`
- **Extensiones incluidas:** `.md, .mdx`
- **Archivos candidatos incluidos:** `263`
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
│   │   │   ├── TASK-CANVAS-002-snap-lines-and-sidebar-compactness.md
│   │   │   ├── TASK-DOCS-001-ai-architecture-install.md
│   │   │   ├── TASK-INSPECTOR-001-detailview-density.md
│   │   │   ├── TASK-LAB-001-results-panel-placement.md
│   │   │   └── TASK-SCHEMA-001-option-indicator-docusign.md
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
├── Investigación UX y arquitectura para Dynamic Forms.md
├── MANIFEST.md
├── plan-accion-ux-ui-sidebar-derecho-sisad-pdfme.md
├── plan-integracion-detailview-wix-sisad-pdfme.md
├── plan-post-codex-sisad-pdfme.md
├── plan-profundo-sisad-pdfme-diseniador.md
├── README.md
├── reports
│   ├── designer-deep-audit
│   │   ├── duplication-map.md
│   │   └── risk-map.md
│   ├── jsdoc-missing-report.md
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
│       ├── tc-css-option-group-selection-fix.md
│       ├── tc-css-ownership-color.md
│       ├── ui-styles-decommission-audit.md
│       └── ui-styles-decommission-progress.md
├── scripts
│   └── README.md
└── src
    └── sisad-pdfme
        ├── common
        │   ├── documentacion-common-sisad-pdfme.md
        │   └── README.md
        ├── converter
        │   ├── documentacion-converter-sisad-pdfme.md
        │   └── README.md
        ├── runtime
        │   ├── documentacion-runtime-sisad-pdfme.md
        │   └── README.md
        └── ui
            ├── components
            │   ├── Designer
            │   │   ├── Canvas
            │   │   │   ├── documentacion-canvas-core-jsdoc.md
            │   │   │   ├── overlays
            │   │   │   │   └── …
            │   │   │   └── README.md
            │   │   └── RightSidebar
            │   │       ├── DetailView
            │   │       │   └── …
            │   │       ├── documentacion-right-sidebar-rails-jsdoc.md
            │   │       ├── ListView
            │   │       │   └── …
            │   │       └── README.md
            │   ├── documentacion-runtime-preview-base-jsdoc.md
            │   └── README.md
            ├── documentacion-ui-runtime-sisad-pdfme.md
            └── README.md
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
| 92 | `Investigación UX y arquitectura para Dynamic Forms.md` | markdown | 249 | 31.8 | completo |
| 93 | `MANIFEST.md` | markdown | 177 | 6.1 | completo |
| 94 | `plan-accion-ux-ui-sidebar-derecho-sisad-pdfme.md` | markdown | 635 | 17.4 | completo |
| 95 | `plan-integracion-detailview-wix-sisad-pdfme.md` | markdown | 686 | 23.2 | completo |
| 96 | `plan-post-codex-sisad-pdfme.md` | markdown | 2144 | 50.1 | completo |
| 97 | `plan-profundo-sisad-pdfme-diseniador.md` | markdown | 1720 | 47.8 | completo |
| 98 | `.github/copilot-instructions.md` | markdown | 15 | 0.4 | completo |
| 99 | `ai/README.md` | markdown | 38 | 0.8 | completo |
| 100 | `ai/tree.md` | markdown | 26 | 0.4 | completo |
| 101 | `reports/jsdoc-missing-report.md` | markdown | 2254 | 78.0 | completo |
| 102 | `scripts/README.md` | markdown | 21 | 0.4 | completo |
| 103 | `ai/adapters/README.md` | markdown | 3 | 0.1 | completo |
| 104 | `ai/agents/canvas-agent.md` | markdown | 37 | 0.6 | completo |
| 105 | `ai/agents/css-tailwind-agent.md` | markdown | 37 | 0.6 | completo |
| 106 | `ai/agents/designer-runtime-agent.md` | markdown | 37 | 0.6 | completo |
| 107 | `ai/agents/docs-architecture-agent.md` | markdown | 37 | 0.6 | completo |
| 108 | `ai/agents/inspector-agent.md` | markdown | 37 | 0.6 | completo |
| 109 | `ai/agents/interaction-agent.md` | markdown | 37 | 0.6 | completo |
| 110 | `ai/agents/lab-shell-agent.md` | markdown | 37 | 0.6 | completo |
| 111 | `ai/agents/README.md` | markdown | 3 | 0.1 | completo |
| 112 | `ai/agents/registry.md` | markdown | 12 | 1.3 | completo |
| 113 | `ai/agents/schema-agent.md` | markdown | 37 | 0.6 | completo |
| 114 | `ai/agents/snapshot-agent.md` | markdown | 37 | 0.6 | completo |
| 115 | `ai/agents/visual-baseline-agent.md` | markdown | 37 | 0.6 | completo |
| 116 | `ai/baselines/img-version-baseline-protocol.md` | markdown | 29 | 0.4 | completo |
| 117 | `ai/baselines/README.md` | markdown | 3 | 0.1 | completo |
| 118 | `ai/checklists/done-vs-pending.md` | markdown | 12 | 0.2 | completo |
| 119 | `ai/checklists/global-validation.md` | markdown | 8 | 0.2 | completo |
| 120 | `ai/checklists/improvement-backlog.md` | markdown | 9 | 0.3 | completo |
| 121 | `ai/checklists/manual-ui-regression.md` | markdown | 19 | 0.4 | completo |
| 122 | `ai/checklists/README.md` | markdown | 3 | 0.1 | completo |
| 123 | `ai/checklists/tailwind-migration.md` | markdown | 11 | 0.3 | completo |
| 124 | `ai/context/ai-docs-context.md` | markdown | 3 | 0.1 | completo |
| 125 | `ai/context/canvas-multipage-context.md` | markdown | 9 | 0.2 | completo |
| 126 | `ai/context/css-tailwind-context.md` | markdown | 23 | 0.6 | completo |
| 127 | `ai/context/inspector-context.md` | markdown | 3 | 0.1 | completo |
| 128 | `ai/context/README.md` | markdown | 3 | 0.1 | completo |
| 129 | `ai/context/schema-families-context.md` | markdown | 5 | 0.2 | completo |
| 130 | `ai/context/selection-transform-context.md` | markdown | 3 | 0.2 | completo |
| 131 | `ai/context/snapshot-context.md` | markdown | 3 | 0.1 | completo |
| 132 | `ai/context/visual-baseline-context.md` | markdown | 18 | 0.2 | completo |
| 133 | `ai/docs-migration/MIGRATION_FROM_OLD_STRUCTURE.md` | markdown | 30 | 0.7 | completo |
| 134 | `ai/memory/changelog.md` | markdown | 7 | 0.3 | completo |
| 135 | `ai/memory/completed-checklist.md` | markdown | 7 | 0.3 | completo |
| 136 | `ai/memory/decisions.md` | markdown | 21 | 0.8 | completo |
| 137 | `ai/memory/known-risks.md` | markdown | 10 | 0.5 | completo |
| 138 | `ai/memory/memory-update-protocol.md` | markdown | 29 | 0.6 | completo |
| 139 | `ai/memory/pending-checklist.md` | markdown | 15 | 0.5 | completo |
| 140 | `ai/memory/project-memory.md` | markdown | 20 | 0.8 | completo |
| 141 | `ai/memory/README.md` | markdown | 13 | 0.4 | completo |
| 142 | `ai/memory/session-handoff.md` | markdown | 13 | 0.5 | completo |
| 143 | `ai/playbooks/pb-ai-docs-refactor.md` | markdown | 7 | 0.2 | completo |
| 144 | `ai/playbooks/pb-canvas-multipage.md` | markdown | 6 | 0.2 | completo |
| 145 | `ai/playbooks/pb-css-tailwind-migration.md` | markdown | 9 | 0.3 | completo |
| 146 | `ai/playbooks/pb-inspector.md` | markdown | 6 | 0.1 | completo |
| 147 | `ai/playbooks/pb-schema-families.md` | markdown | 6 | 0.2 | completo |
| 148 | `ai/playbooks/pb-selection-transform.md` | markdown | 6 | 0.1 | completo |
| 149 | `ai/playbooks/pb-snapshot.md` | markdown | 6 | 0.1 | completo |
| 150 | `ai/playbooks/pb-visual-regression.md` | markdown | 8 | 0.2 | completo |
| 151 | `ai/playbooks/README.md` | markdown | 3 | 0.1 | completo |
| 152 | `ai/project/architecture-principles.md` | markdown | 34 | 1.0 | completo |
| 153 | `ai/project/definition-of-done.md` | markdown | 12 | 0.4 | completo |
| 154 | `ai/project/file-ownership-map.md` | markdown | 14 | 0.8 | completo |
| 155 | `ai/project/glossary.md` | markdown | 16 | 0.7 | completo |
| 156 | `ai/project/goals.md` | markdown | 24 | 0.9 | completo |
| 157 | `ai/project/non-goals.md` | markdown | 12 | 0.3 | completo |
| 158 | `ai/project/scope.md` | markdown | 38 | 0.6 | completo |
| 159 | `ai/prompts/claude-diagnose-or-implement.md` | markdown | 7 | 0.2 | completo |
| 160 | `ai/prompts/codex-master-prompt.md` | markdown | 5 | 0.3 | completo |
| 161 | `ai/prompts/copilot-task-context.md` | markdown | 11 | 0.2 | completo |
| 162 | `ai/prompts/create-task-card.md` | markdown | 11 | 0.2 | completo |
| 163 | `ai/prompts/README.md` | markdown | 3 | 0.1 | completo |
| 164 | `ai/prompts/update-memory.md` | markdown | 3 | 0.1 | completo |
| 165 | `ai/reports/README.md` | markdown | 3 | 0.1 | completo |
| 166 | `ai/reports/report-template.md` | markdown | 10 | 0.1 | completo |
| 167 | `ai/router/CONTEXT_BUDGET.md` | markdown | 45 | 0.8 | completo |
| 168 | `ai/router/ROUTER.md` | markdown | 27 | 1.2 | completo |
| 169 | `ai/router/TASK_INTAKE.md` | markdown | 15 | 0.4 | completo |
| 170 | `ai/rules/ai-docs-rules.md` | markdown | 6 | 0.2 | completo |
| 171 | `ai/rules/canvas-rules.md` | markdown | 3 | 0.1 | completo |
| 172 | `ai/rules/css-migration-rules.md` | markdown | 8 | 0.3 | completo |
| 173 | `ai/rules/global-rules.md` | markdown | 7 | 0.2 | completo |
| 174 | `ai/rules/inspector-rules.md` | markdown | 3 | 0.1 | completo |
| 175 | `ai/rules/moveable-selecto-rules.md` | markdown | 5 | 0.2 | completo |
| 176 | `ai/rules/README.md` | markdown | 3 | 0.1 | completo |
| 177 | `ai/rules/schema-rules.md` | markdown | 3 | 0.1 | completo |
| 178 | `ai/rules/snapshot-rules.md` | markdown | 3 | 0.1 | completo |
| 179 | `ai/skills/canvas-multipage-skill.md` | markdown | 29 | 0.4 | completo |
| 180 | `ai/skills/inspector-skill.md` | markdown | 29 | 0.4 | completo |
| 181 | `ai/skills/memory-update-skill.md` | markdown | 29 | 0.4 | completo |
| 182 | `ai/skills/moveable-selecto-skill.md` | markdown | 29 | 0.4 | completo |
| 183 | `ai/skills/option-groups-skill.md` | markdown | 29 | 0.4 | completo |
| 184 | `ai/skills/prompting-skill.md` | markdown | 29 | 0.4 | completo |
| 185 | `ai/skills/README.md` | markdown | 3 | 0.1 | completo |
| 186 | `ai/skills/snapshot-safety-skill.md` | markdown | 29 | 0.4 | completo |
| 187 | `ai/skills/tailwind-migration-skill.md` | markdown | 29 | 0.4 | completo |
| 188 | `ai/skills/visual-regression-skill.md` | markdown | 29 | 0.4 | completo |
| 189 | `ai/start/QUICKSTART-CLAUDE.md` | markdown | 15 | 0.4 | completo |
| 190 | `ai/start/QUICKSTART-CODEX.md` | markdown | 34 | 0.7 | completo |
| 191 | `ai/start/QUICKSTART-COPILOT.md` | markdown | 18 | 0.4 | completo |
| 192 | `ai/start/START.md` | markdown | 76 | 1.2 | completo |
| 193 | `ai/subagents/anti-hallucination-reviewer.md` | markdown | 13 | 0.3 | completo |
| 194 | `ai/subagents/baseline-visual-critic.md` | markdown | 13 | 0.3 | completo |
| 195 | `ai/subagents/code-docs-writer.md` | markdown | 13 | 0.3 | completo |
| 196 | `ai/subagents/css-auditor.md` | markdown | 13 | 0.3 | completo |
| 197 | `ai/subagents/legacy-css-guardian.md` | markdown | 13 | 0.3 | completo |
| 198 | `ai/subagents/memory-curator.md` | markdown | 13 | 0.3 | completo |
| 199 | `ai/subagents/prompt-engineer.md` | markdown | 13 | 0.3 | completo |
| 200 | `ai/subagents/README.md` | markdown | 3 | 0.1 | completo |
| 201 | `ai/subagents/regression-tester.md` | markdown | 13 | 0.3 | completo |
| 202 | `ai/subagents/tailwind-migrator.md` | markdown | 13 | 0.3 | completo |
| 203 | `ai/task-cards/README.md` | markdown | 11 | 0.2 | completo |
| 204 | `ai/templates/agent-template.md` | markdown | 7 | 0.1 | completo |
| 205 | `ai/templates/checklist-template.md` | markdown | 5 | 0.1 | completo |
| 206 | `ai/templates/decision-template.md` | markdown | 7 | 0.1 | completo |
| 207 | `ai/templates/memory-update-template.md` | markdown | 7 | 0.1 | completo |
| 208 | `ai/templates/README.md` | markdown | 3 | 0.1 | completo |
| 209 | `ai/templates/skill-template.md` | markdown | 7 | 0.1 | completo |
| 210 | `ai/templates/task-card-template.md` | markdown | 11 | 0.2 | completo |
| 211 | `reports/designer-deep-audit/duplication-map.md` | markdown | 24 | 1.4 | completo |
| 212 | `reports/designer-deep-audit/risk-map.md` | markdown | 19 | 1.1 | completo |
| 213 | `reports/tailwind-migration/baseline-regression-audit.md` | markdown | 27 | 5.2 | completo |
| 214 | `reports/tailwind-migration/component-migration-ledger.md` | markdown | 62 | 5.1 | completo |
| 215 | `reports/tailwind-migration/deep-density-spacing-audit.md` | markdown | 105 | 9.6 | completo |
| 216 | `reports/tailwind-migration/img-version-baseline-inventory.md` | markdown | 14 | 2.6 | completo |
| 217 | `reports/tailwind-migration/line-by-line-style-audit.md` | markdown | 227 | 21.6 | completo |
| 218 | `reports/tailwind-migration/pending-phases-progress.md` | markdown | 10 | 1.9 | completo |
| 219 | `reports/tailwind-migration/README.md` | markdown | 76 | 4.6 | completo |
| 220 | `reports/tailwind-migration/right-sidebar-scroll-tailwind-fix.md` | markdown | 45 | 3.4 | completo |
| 221 | `reports/tailwind-migration/right-sidebar-tailwind-only-density-fix.md` | markdown | 34 | 3.2 | completo |
| 222 | `reports/tailwind-migration/rightsidebar-detailview-tailwind-audit.md` | markdown | 13 | 2.3 | completo |
| 223 | `reports/tailwind-migration/runtime-form-viewer-tailwind-audit.md` | markdown | 20 | 1.4 | completo |
| 224 | `reports/tailwind-migration/schema-chrome-tailwind-audit.md` | markdown | 18 | 1.3 | completo |
| 225 | `reports/tailwind-migration/tc-css-04-left-sidebar-tailwind.md` | markdown | 45 | 2.8 | completo |
| 226 | `reports/tailwind-migration/tc-css-08-control-bar-toolbar-tailwind.md` | markdown | 43 | 2.5 | completo |
| 227 | `reports/tailwind-migration/tc-css-10-schemas-visual.md` | markdown | 33 | 3.7 | completo |
| 228 | `reports/tailwind-migration/tc-css-11-lab-audit.md` | markdown | 31 | 1.2 | completo |
| 229 | `reports/tailwind-migration/tc-css-option-group-selection-fix.md` | markdown | 38 | 4.3 | completo |
| 230 | `reports/tailwind-migration/tc-css-ownership-color.md` | markdown | 38 | 4.0 | completo |
| 231 | `reports/tailwind-migration/ui-styles-decommission-audit.md` | markdown | 57 | 5.6 | completo |
| 232 | `reports/tailwind-migration/ui-styles-decommission-progress.md` | markdown | 25 | 1.6 | completo |
| 233 | `ai/task-cards/active/TASK-CANVAS-002-snap-lines-and-sidebar-compactness.md` | markdown | 36 | 1.1 | completo |
| 234 | `ai/task-cards/active/TASK-DOCS-001-ai-architecture-install.md` | markdown | 21 | 0.5 | completo |
| 235 | `ai/task-cards/active/TASK-INSPECTOR-001-detailview-density.md` | markdown | 55 | 1.7 | completo |
| 236 | `ai/task-cards/active/TASK-LAB-001-results-panel-placement.md` | markdown | 35 | 1.1 | completo |
| 237 | `ai/task-cards/active/TASK-SCHEMA-001-option-indicator-docusign.md` | markdown | 49 | 1.7 | completo |
| 238 | `ai/task-cards/backlog/TASK-CANVAS-001-protect-canvas-overflow.md` | markdown | 5 | 0.2 | completo |
| 239 | `ai/task-cards/backlog/TASK-CSS-001-tailwind-regression-stabilization.md` | markdown | 22 | 0.6 | completo |
| 240 | `ai/task-cards/backlog/TASK-VISUAL-001-img-version-baseline.md` | markdown | 12 | 0.3 | completo |
| 241 | `ai/task-cards/completed/README.md` | markdown | 3 | 0.1 | completo |
| 242 | `src/sisad-pdfme/common/documentacion-common-sisad-pdfme.md` | markdown | 784 | 21.6 | completo |
| 243 | `src/sisad-pdfme/common/README.md` | markdown | 33 | 1.9 | completo |
| 244 | `src/sisad-pdfme/converter/documentacion-converter-sisad-pdfme.md` | markdown | 168 | 4.8 | completo |
| 245 | `src/sisad-pdfme/converter/README.md` | markdown | 42 | 0.9 | completo |
| 246 | `src/sisad-pdfme/runtime/documentacion-runtime-sisad-pdfme.md` | markdown | 151 | 4.6 | completo |
| 247 | `src/sisad-pdfme/runtime/README.md` | markdown | 15 | 0.7 | completo |
| 248 | `src/sisad-pdfme/ui/documentacion-ui-runtime-sisad-pdfme.md` | markdown | 168 | 5.7 | completo |
| 249 | `src/sisad-pdfme/ui/README.md` | markdown | 38 | 2.2 | completo |
| 250 | `.tailwind-migration-backups/20260708-111736/reports/tailwind-migration/README.md` | markdown | 76 | 3.4 | completo |
| 251 | `src/sisad-pdfme/ui/components/documentacion-runtime-preview-base-jsdoc.md` | markdown | 30 | 1.6 | completo |
| 252 | `src/sisad-pdfme/ui/components/README.md` | markdown | 28 | 1.1 | completo |
| 253 | `src/sisad-pdfme/ui/components/Designer/Canvas/documentacion-canvas-core-jsdoc.md` | markdown | 18 | 0.9 | completo |
| 254 | `src/sisad-pdfme/ui/components/Designer/Canvas/README.md` | markdown | 24 | 1.2 | completo |
| 255 | `src/sisad-pdfme/ui/components/Designer/RightSidebar/documentacion-right-sidebar-rails-jsdoc.md` | markdown | 15 | 1.0 | completo |
| 256 | `src/sisad-pdfme/ui/components/Designer/RightSidebar/README.md` | markdown | 18 | 0.7 | completo |
| 257 | `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/documentacion-canvas-overlays-jsdoc.md` | markdown | 21 | 0.7 | completo |
| 258 | `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/README.md` | markdown | 35 | 1.3 | completo |
| 259 | `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/documentacion-detailview-inspector-jsdoc.md` | markdown | 42 | 1.6 | completo |
| 260 | `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/documentacion-detailview-options-comments-jsdoc.md` | markdown | 38 | 1.4 | completo |
| 261 | `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/README.md` | markdown | 20 | 1.0 | completo |
| 262 | `src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/documentacion-listview-jsdoc.md` | markdown | 31 | 1.8 | completo |
| 263 | `src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/README.md` | markdown | 24 | 0.8 | completo |

## Resumen de exclusiones

- **extensión no incluida:** 1563
- **directorio ignorado: dependencia/build/salida generada:** 7

## Totales

- **KB originales candidatos:** `481.5`
- **KB incluidos en contenido:** `481.3`
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

### 0092 — `Investigación UX y arquitectura para Dynamic Forms.md`

- **Lenguaje:** `markdown`
- **Líneas:** `249`
- **Tamaño original:** `31.8 KB`
- **SHA1 corto:** `7f02b6c708`
- **Estado:** `completo`

```markdown
# Investigación UX y arquitectura para Dynamic Forms

## Alcance y supuestos

El objetivo de esta investigación es definir cómo evolucionar **dynamic_forms** desde un constructor centrado en formularios hacia un **builder capaz de crear formularios, páginas y sitios web**, mejorando visualización, interacción y arquitectura sin perder su condición de producto **standalone** y desacoplado del consumidor empresarial. La documentación interna subida a la conversación confirma precisamente esa restricción y, además, establece como principio rector que no conviene ampliar el catálogo visual antes de consolidar el contrato entre editor, esquema, preview, publicación y runtime. fileciteturn8file0 fileciteturn11file6

También quedan dos supuestos explícitos del encargo: todavía **no se había especificado el formato preferido de entrega** y, por tanto, las opciones razonables siguen siendo **HTML** para revisión colaborativa y **PDF** para distribución ejecutiva; además, aunque se subieron dos ZIP llamados `imagenes_dynamic_forms(2).zip` y `imagenes_wix(3).zip`, en esta sesión **no fue posible extraer programáticamente su inventario interno de imágenes**, por lo que el catálogo exhaustivo por archivo individual queda marcado como **“no especificado”** allí donde no existe verificación directa. En consecuencia, el análisis visual comparativo se apoya en tres fuentes complementarias: nombres de los ZIP, documentación/código del producto actual y benchmarking oficial de Wix y otras plataformas comparables.

En la documentación interna sí quedó verificado que el producto actual usa un workspace compuesto por **topbar, rail, drawer, canvas, inspector, bottom panel y managers flotantes**, con separación entre `workspaceViewport` y `canvasDeviceMode`, un Insert Center todavía MVP, inspector schema-driven, Form Manager, Rule Manager, adapters local/REST y smoke tests básicos para apertura, inserción, drag and drop, preview y auditoría responsive. También se documenta que **Pages, Layers, Theme, Data e Integrations** siguen teniendo madurez parcial. fileciteturn9file0 fileciteturn9file13

## Resumen ejecutivo

La conclusión principal es clara: **dynamic_forms no necesita parecerse a Wix en todo; necesita adoptar la estructura mental que hace que Wix, Squarespace, Framer o Webflow se sientan como “constructores de experiencias” y no solo como editores de campos**. En el estado actual, dynamic_forms ya tiene piezas importantes de un estudio de edición serio —canvas, inspector, rail, paneles, managers, drag overlays, focus ring, reduced motion y una base de schema/layout consistente—, pero todavía enfrenta tres límites: poca profundidad en navegación por intención, insuficiente madurez de los managers de páginas/tema/datos/integraciones y una prioridad arquitectónica pendiente entre schema, reglas, preview, publicación y runtime. fileciteturn9file0 fileciteturn9file3 fileciteturn9file15

Wix, en su oferta oficial en español, se posiciona como un creador híbrido donde el usuario puede empezar por IA, por plantilla o desde cero, con **más de 900 plantillas**, edición de **arrastrar y soltar** con precisión de píxel, **landing pages**, vista móvil editable, paneles de negocio, SEO, CRM, reservas y una biblioteca amplia de recursos y animaciones. Squarespace comunica un patrón parecido, pero con un tono más curado: IA + plantillas + drag and drop + páginas prediseñadas + marketing integrado. Webflow y Framer, por su parte, empujan un modelo más “sistema de diseño/CMS first”, donde las páginas y los componentes reutilizables son ciudadanos de primera clase. Typeform y Jotform muestran la otra mitad del problema: cómo convertir el formulario en experiencia, lógica conversacional, automatización y extensión hacia landing pages o apps. citeturn16view0turn18view0turn18view1turn18view2turn18view3turn17view0turn17view1turn17view2turn5view0turn5view2turn15view0turn15view1turn15view2turn15view3

La implicación estratégica es que **dynamic_forms debe reposicionarse como “Dynamic Builder Studio”** con un modelo de documento jerárquico: páginas, secciones, contenedores, grupos, campos, contenido, acciones, media, reglas y datos. La documentación interna ya camina en esa dirección: propone una experiencia final con topbar compacta, rail por intención, panel izquierdo invocable, canvas jerárquico, inspector contextual, managers especializados, preview fiel y workspaces de settings/submissions; además, el modelo de nodos contempla layout con `absolute`, `flow`, `grid` y `flex`, responsive por breakpoint, rules, bindings, acciones y accesibilidad. fileciteturn11file6 fileciteturn11file18 fileciteturn10file15

La decisión de producto más importante no es “agregar más widgets”, sino **reordenar la experiencia**. Hoy, el producto parece tener la base de un editor técnico; la mejora debe convertirlo en un **estudio visual**. Eso implica: inicio por objetivo, panel de páginas y secciones antes que lista de campos, presets de bloques, responsive semántico, gestor de tema, gestor de assets, estados de publicación visibles, microinteracciones más claras y un runtime de reglas real antes de escalar la promesa de sitios completos. La propia documentación interna ya lo sugiere: “el canvas manda; los paneles asisten”. fileciteturn11file6

## Metodología y estado actual del producto

La metodología pedida tiene sentido y conviene conservarla como estándar operativo del proyecto, incluso aunque en esta sesión no se haya podido ejecutar completa sobre el contenido de los ZIP. El proceso recomendado consta de cuatro tramos: **descompresión**, **catalogación**, **etiquetado** y **comparación**. La catalogación debe registrar nombre de archivo, peso, resolución, tipo de captura, familia UI, patrones visuales y variantes; el etiquetado debe ser mixto, con heurísticas automáticas para detectar paneles, barras, modales, canvas, cards, grids y estados, y revisión manual para corregir ambigüedades; la comparación debe medir consistencia de UI, jerarquía visual, densidad informativa, contraste, legibilidad, claridad de estados, escalabilidad responsive y alineación WCAG.

Ese enfoque encaja bien con el estado documentado del producto. La base interna ya ofrece un ecosistema compatible con una evolución a builder visual más serio: React 19, Vite 8, Tailwind 4, `@dnd-kit/core`, smoke tests, baseline visual con Playwright y un shell de edición desacoplado. También se confirma que la auditoría responsive actual existe, pero todavía se centra en el breakpoint detectado y en variantes del inspector/drawer más que en el reflow real de todos los componentes o en errores de overflow horizontal, foco atrapado, DnD inválido, publicación end-to-end y documentos grandes. fileciteturn8file0 fileciteturn9file0

A nivel visual, la documentación interna detecta fortalezas y riesgos muy concretos. Entre lo positivo: un solo CSS global, tokens, sombras, radios, tamaños del workspace, scrollbars, focus ring y soporte a `prefers-reduced-motion`. Entre lo problemático: el fondo radial aplicado al `body`, el `color-scheme: light` forzado y una escala de z-index incompleta que todavía no contempla explícitamente `canvasOverlay`, `dragOverlay`, `backdrop`, `popover`, `contextMenu`, `tooltip`, `bottomSheet`, `toast` o `commandPalette`. Eso importa mucho para un builder que quiere pasar de “editor de formularios” a “editor de páginas”, porque la superposición de capas, menus y ayudas contextuales deja de ser un detalle de CSS y se vuelve parte crítica de la experiencia de autoría. fileciteturn9file15

También resulta relevante que el modelo recomendado por la documentación interna ya contempla **páginas**, **nodos jerárquicos**, **reglas**, **assets** y **dataSources**, junto con categorías de catálogo como `primitive`, `variantPreset`, `treePreset`, `managedBlock`, `integration`, `reusableReference`, `managerLauncher` y `overlay`. Es decir: la arquitectura conceptual ya está más cerca de un **site builder modular** que de un simple constructor plano de campos. Lo que falta no es tanto inventar el modelo, sino completar la relación entre navegación, presets, runtime, publicación y gestores especializados. fileciteturn11file18 fileciteturn10file15

En accesibilidad, las recomendaciones de este informe se apoyan en estándares primarios. W3C recomienda usar **WCAG 2.2** como referencia vigente; el criterio 1.4.3 exige una relación de contraste mínima de **4.5:1** para texto normal y **3:1** para texto grande; el criterio 2.4.7 exige un **indicador visible de foco** para toda interfaz operable por teclado; el criterio 2.5.8 fija un tamaño mínimo de objetivo táctil/puntero de **24 × 24 CSS px** o, alternativamente, suficiente espaciado; y `prefers-reduced-motion` debe respetar la preferencia del usuario para reducir o reemplazar animaciones no esenciales. citeturn11view0turn13view0turn13view2turn19view0turn12view0

## Catálogo verificable y análisis comparativo entre ZIP A y ZIP B

### Catálogo verificable del material recibido

La siguiente tabla refleja **lo verificable de forma directa en esta sesión**. Dado que no se pudo descomprimir ni enumerar el contenido interno de ambos ZIP, los campos exigidos por imagen individual se marcan como **“no especificado”** cuando no existe evidencia verificable.

| Conjunto | Archivo recibido | Tamaño | Resolución | Tipo de componente UI | Etiquetas visuales | Número de variantes | Estado de verificación |
|---|---|---:|---:|---|---|---:|---|
| ZIP A | `imagenes_dynamic_forms(2).zip` | no especificado | no especificado | no especificado | no especificado | no especificado | Recibido, pero sin extracción interna verificable |
| ZIP B | `imagenes_wix(3).zip` | no especificado | no especificado | no especificado | no especificado | no especificado | Recibido, pero sin extracción interna verificable |

### Catálogo funcional inferido por componente

Aunque el inventario por imagen no quedó accesible, sí es posible construir un **catálogo funcional inferido** de los componentes relevantes para comparar ambos conjuntos, usando el nombre de los ZIP, la documentación actual de dynamic_forms y las superficies oficiales de Wix. Esta tabla es útil para orientar el rediseño porque organiza el análisis por **familia de componente**, que es como debe evolucionar el sistema de diseño del producto.

| Componente | ZIP A dinámico_forms | ZIP B Wix | Lectura UX |
|---|---|---|---|
| Topbar / barra principal | Confirmada en docs como parte del workspace. fileciteturn9file0 | Wix usa entrada clara a edición, publicación y paneles de negocio. citeturn16view0turn18view2 | Dynamic Forms debe convertir la topbar en barra de intención: documento, página, preview, publicar, estado y device mode |
| Rail lateral | Confirmado: rail + drawer + paneles. fileciteturn9file0 | Wix expone biblioteca, negocio, SEO, marketing y mobile view. citeturn16view0turn18view0turn18view2 | El rail actual debe pasar de “herramientas técnicas” a “navegación por objetivo” |
| Canvas | Confirmado y ya central en la visión objetivo interna. fileciteturn11file6 | Wix enfatiza canvas fluido y edición pixel-perfect. citeturn18view0 | El canvas debe ser el centro visual y el contexto primario de edición |
| Inspector | Confirmado y schema-driven. fileciteturn9file0 | Wix es menos “form-heavy” y más progresivo/contextual. citeturn18view0turn16view0 | El inspector debe volverse más progresivo y menos denso por defecto |
| Insert / Add panel | Insert Center aún MVP. fileciteturn9file0 | Wix muestra biblioteca amplia de componentes, gráficos y animaciones. citeturn16view0turn18view0 | Insertar debe reorganizarse por bloques, secciones y presets, no solo por controles |
| Páginas | Parcial: Pages requiere mayor densidad y profundidad. fileciteturn9file0 | Wix crea sitios completos, landing pages y múltiples páginas. citeturn18view3turn16view0 | Pages no puede seguir siendo secundaria; debe ser un primer espacio de navegación |
| Tema / branding | Parcial: Theme requiere profundidad. fileciteturn9file0 | Wix propaga tipografías, colores y estilos por el sitio. citeturn16view0turn18view0 | Theme Manager debe ser global, no solo propiedades dispersas |
| Datos / reglas | Rule Manager existe, pero el runtime de reglas aún se documenta como hueco de prioridad. fileciteturn9file0 fileciteturn9file15 | Wix y competidores conectan negocio, CRM, reservas, analytics y SEO. citeturn18view2turn16view0 | Expandir a “sitios” sin motor de reglas y data sólido generaría deuda rápida |
| Responsive | Auditoría actual limitada; docs piden responsive semántico. fileciteturn10file1 fileciteturn11file5 | Wix permite revisar y ajustar vista móvil; Squarespace y Elementor también lo priorizan. citeturn18view2turn17view0turn14view2 | El responsive debe estar modelado a nivel de documento y no solo de viewport |
| Estados / overlays | Hay drag overlay y feature flags de guías, grid y snapping; z-index todavía incompleto. fileciteturn9file2 fileciteturn9file3 fileciteturn9file15 | Wix comunica feedback de generación y de adición contextual. citeturn16view0turn18view0 | Hace falta un sistema coherente de overlays, estados y feedback contextual |

### Similitudes y diferencias por componente

La diferencia central entre ZIP A y ZIP B no es cosmética; es **de modelo mental**. Dynamic_forms, según la evidencia interna, ya tiene un editor serio pero orientado a documento/formulario. Wix, según su producto oficial, opera como un **orquestador de creación web completa**: IA, plantillas, canvas libre, páginas, negocios, mobile view, SEO, CRM, marketing y dashboard. Donde dynamic_forms hoy muestra superficies parciales —Pages, Theme, Data, Integrations— Wix muestra cadenas de valor completas y conectadas. fileciteturn9file0 citeturn16view0turn18view0turn18view2

La similitud importante es que ambos comparten una base útil para converger: canvas visual, componentes editables, paneles laterales, posibilidades de drag and drop y personalización. La diferencia importante es que en Wix el usuario percibe inmediatamente que puede construir **sitios**; en dynamic_forms, por la documentación disponible, todavía se percibe principalmente que puede construir **formularios con superficies adicionales**. Esa es exactamente la brecha UX que conviene cerrar. fileciteturn11file6 citeturn18view0turn17view0turn5view0

## Benchmarking oficial de competidores

### Comparativa estratégica

| Competidor | Posicionamiento oficial | Fortalezas relevantes para Dynamic Forms | Riesgos si se copia sin filtro | Fuente oficial |
|---|---|---|---|---|
| Wix | Creador híbrido con IA, plantillas, drag and drop, landing pages, móvil, SEO, CRM y panel de negocio. | Excelente modelo de “de idea a sitio publicado”, biblioteca amplia, vista móvil editable, integración de negocio. | Puede llevar a sobrecargar el producto con módulos comerciales antes de madurar schema/runtime. | citeturn16view0turn18view0turn18view1turn18view2turn18view3 |
| Squarespace | Editor más curado: IA + plantillas + drag and drop + páginas y funciones + marketing. | Muy buen patrón para páginas prediseñadas, bloques curados y flujo simple de publicación. | Riesgo de quedarse en una experiencia “bonita pero rígida” si no se conserva la flexibilidad del canvas. | citeturn17view0turn17view1turn17view2 |
| Webflow | Plataforma visual para sitios/pages con CMS componible, reusable components y herramientas para marketing. | Excelente referencia para componentes reutilizables, CMS visual y page building serio. | Exceso de complejidad si se traslada su gramática completa a usuarios de negocio. | citeturn5view0turn4view3turn4view5 |
| Framer | Builder profesional con CMS conectado al canvas, SEO, rendimiento fuerte y colaboración. | Gran inspiración para sincronía entre contenido y canvas, publishing, previews sociales y performance. | Riesgo de priorizar estética/motion sin cerrar antes reglas, datos y contratos internos. | citeturn5view2turn14view0 |
| Typeform | Plataforma de formularios conversacionales con automatización, analytics y landing page builder. | Muy fuerte para formularios adaptativos, experiencia conversacional y analítica de drop-off. | Si se extrapola demasiado, puede empujar el producto hacia flujos lineales y no hacia páginas jerárquicas. | citeturn8view0turn15view0turn15view1 |
| Jotform | Constructor no-code de formularios con lógica condicional, pagos, integraciones y extensiones como Apps. | Referencia fuerte para ecosistema alrededor del formulario: apps, pagos, workflows e integraciones. | Riesgo de derivar hacia “suite utilitaria” sin una experiencia de builder visual coherente. | citeturn15view2turn15view3turn15view4 |

### Patrones que conviene absorber

El patrón más valioso del benchmark es la **entrada por intención**. Wix y Squarespace no obligan al usuario a pensar primero en el control UI; le dejan pensar en el resultado: sitio, landing, tienda, blog, portafolio, cita, reserva, campaña o formulario. Dynamic_forms debería absorber exactamente esa lógica y reorganizar su rail, Insert Center y catálogo alrededor de **página, sección, formulario, contenido, acción, media, datos, integraciones y publicación**. citeturn16view0turn17view1turn5view0

El segundo patrón es la **progresividad del editor**. Webflow y Framer reservan más densidad técnica para situaciones donde el usuario ya está dentro del ciclo de edición. No saturan el lienzo desde el minuto uno. Dynamic_forms debería heredar eso: paneles compactos, inspector progresivo, gestores especializados en overlays o drawers grandes y una topbar corta, con estados visibles de guardado, preview y publicación. citeturn5view0turn5view2 fileciteturn11file6

El tercer patrón es la **coherencia entre canvas y sistema de contenido**. Framer conecta CMS y canvas; Webflow une CMS visual y page building; Typeform y Jotform extienden el formulario hacia automatización, landing y apps. Para Dynamic Forms, eso se traduce en una idea muy concreta: **no separar el documento visual del documento de datos**. Páginas, nodos, reglas, datos y assets deben vivir dentro de un único documento versionado, con publicación consistente y preview fiel. citeturn5view0turn5view2turn15view0turn15view3 fileciteturn11file18

## Recomendaciones de UX, navegación, arquitectura y ejemplos

### Lista priorizada de cambios

| Tipo | Cambio recomendado | Prioridad | Razonamiento | Esfuerzo |
|---|---|---|---|---|
| Modificar | Reposicionar el producto como **studio** y no como simple form builder | Alta | Cambia la percepción del producto y ordena todo lo demás | Media |
| Modificar | Convertir **Pages** en un panel de primer nivel con sitemap, slugs y estados | Alta | Sin páginas de primer nivel no hay arquitectura real de sitio | Alta |
| Modificar | Rediseñar **Insert Center** por intención: secciones, formularios, contenido, media, CTA, data | Alta | Hoy el Insert Center se documenta como MVP; debe pasar a ser motor de creación | Alta |
| Añadir | Biblioteca de **bloques/presets**: hero, two-column, FAQ, pricing, testimonial, contact, lead form | Alta | Es la forma más rápida de pasar de formulario a página/sitio | Alta |
| Modificar | Hacer el **inspector contextual y progresivo** | Alta | Menos fricción inicial, más profundidad cuando hace falta | Media |
| Añadir | **Theme Manager** real: color, tipografía, radio, spacing, botones, campos, superficies | Alta | Wix y Squarespace muestran que la marca debe propagarse globalmente | Media |
| Añadir | **Asset Manager** y media panel de primer nivel | Alta | Sitios y landing pages viven de media, no solo de campos | Alta |
| Modificar | Diseñar un **responsive semántico** por documento y componente | Alta | La documentación ya pide separar viewport del canvas/device mode | Alta |
| Modificar | Completar el **runtime de reglas** antes de escalar la promesa del producto | Alta | La documentación interna identifica este punto como estructural | Alta |
| Eliminar | Fondo radial global en `body` y modo claro forzado | Media | Rompe embebibilidad y flexibilidad temática | Baja |
| Modificar | Formalizar sistema de **overlays/z-index** | Media | Imprescindible para menu, popover, drag overlays, command palette y toasts | Media |
| Añadir | **Preflight** visible con checklist de accesibilidad, responsive y publicación | Media | Hace tangible la calidad antes de publicar | Media |
| Añadir | Historial, clipboard, autosave y versionado visibles en UI | Media | Mejoran confianza y control del editor | Alta |
| Añadir | **Data Manager** e **Integrations Manager** con resúmenes compactos + modal avanzado | Media | Evita inflar el inspector | Alta |
| Eliminar | Campos y acciones “huérfanos” expuestos sin narrativa de uso | Media | El catálogo debe hablar en bloques y resultados, no en widgets aislados | Baja |

### Navegación, layout responsive, accesibilidad y microinteracciones

La navegación recomendada es una combinación de **rail por intención + panel izquierdo invocable + inspector contextual + managers especializados**. Esa dirección coincide con la visión interna ya documentada y es consistente con la forma en que Wix, Squarespace y Webflow distribuyen complejidad. El rail debería contener: **Insertar, Secciones, Páginas, Capas, Tema, Recursos, Datos, Integraciones, Preview y Publicar**. El panel izquierdo no debe intentar mostrarlo todo a la vez; debe actuar como superficie especializada. fileciteturn11file6 citeturn16view0turn17view1turn5view0

En responsive, la recomendación no es “apilar todo” sino distinguir entre **responsive de aplicación** y **responsive de documento**, algo que la documentación interna ya destaca. En desktop, conviene usar layout de tres zonas: rail + panel + canvas + inspector. En tablet, el inspector debe pasar a overlay lateral y el panel izquierdo debe ocupar ancho variable. En móvil, el canvas debe entrar en **focus mode**, con rail reducido, bottom sheet para inspector y edición por bloques, no por propiedades avanzadas. Las propias reglas internas sugeridas ya apuntan a que en móvil los `Field` vayan a `width: 100%`, altura mínima suficiente y los `Heading` usen `clamp` y `overflow-wrap`. fileciteturn9file0 fileciteturn11file5

En accesibilidad, hay cuatro mínimos no negociables. Primero, contraste AA: **4.5:1** para texto normal y **3:1** para texto grande. Segundo, **foco visible** en todos los elementos operables por teclado. Tercero, targets de al menos **24 × 24 CSS px**, idealmente más generosos en móvil y en controles críticos. Cuarto, respeto a `prefers-reduced-motion`, reduciendo animaciones no esenciales o sustituyéndolas por transiciones de opacidad. Dynamic_forms ya tiene foco y reduced motion documentados, lo cual es una buena base. citeturn13view0turn13view2turn19view0turn12view0 fileciteturn9file15

Las microinteracciones deben ayudar al entendimiento, no decorar. Para este producto, convienen especialmente estas: halo de selección consistente; drop zones con estados **válido/invalidado**; toast discreto de guardado; badge persistente de draft/no publicado; breadcrumb de página/sección; indicador de foco en canvas; skeleton breve al cargar presets; confirmación optimista al publicar; y modo reducido de motion que reemplace desplazamientos grandes por disoluciones breves. Esta lógica encaja tanto con las guías WCAG y MDN como con las prácticas observables en productos como Wix, Framer y Typeform. citeturn12view0turn13view2turn18view0turn14view0turn15view1

### Arquitectura de componentes recomendada

La arquitectura recomendada debe separar con disciplina **superficies de navegación**, **superficies de edición** y **servicios de dominio**, un principio que aparece explícitamente en la documentación interna. Eso evitará que el inspector, el catálogo o los managers absorban lógica de reglas, bindings o red de publicación. El documento central debe seguir siendo un **BuilderDocument JSON versionado** con `pages`, `nodes`, `rules`, `assets` y `dataSources`, y no JSX o HTML final. fileciteturn11file7 fileciteturn11file18 fileciteturn11file6

``​`mermaid
flowchart LR
  A[BuilderShell] --> B[Workspace Rail]
  A --> C[Left Panel]
  A --> D[Canvas]
  A --> E[Inspector]
  A --> F[Managers]

  C --> C1[Insertar]
  C --> C2[Secciones]
  C --> C3[Páginas]
  C --> C4[Capas]
  C --> C5[Tema]
  C --> C6[Recursos]
  C --> C7[Datos]
  C --> C8[Integraciones]

  D --> G[Documento JSON]
  E --> G
  F --> G

  G --> H[Preview]
  G --> I[Preflight]
  G --> J[Publish Service]
  J --> K[Runtime]
``​`

La estructura de componentes debería parecerse a esto:

| Capa | Responsabilidad | Qué debe evitar |
|---|---|---|
| `BuilderShell` | Orquestar layout, paneles y estado global de workspace | Lógica de negocio por componente |
| `WorkspaceRail` | Navegación por intención | Contener formularios complejos |
| `WorkspaceDrawer` | Superficies grandes: páginas, secciones, presets, recursos | Duplicar el inspector |
| `Canvas` | Edición visual, selección, drop zones, overlays y focus mode | Resolver datos/red/publicación |
| `Inspector` | Configuración contextual de nodo seleccionado | Ejecutar reglas o integraciones directamente |
| `Managers` | Flujos especializados: form, rules, theme, assets, data | Vivir permanentemente abiertos |
| `Registry` | Definición de primitives, presets, blocks y overlays | Lógica visual embebida de consumidor específico |
| `Adapters` | Persistencia, publicación, runtime, fuentes de datos | Mezclarse con render visual |
| `Runtime` | Render del documento publicado y evaluación de reglas | Incorporar dependencias de editor |

Ese modelo además encaja con el tipo de nodo ya documentado internamente, donde `layout.mode` contempla `absolute`, `flow`, `grid` y `flex`, y donde cada nodo puede incorporar `binding`, `validation`, `ruleIds` y `actionIds`. La oportunidad de UX está en hacer visible esa potencia sin obligar al usuario a entenderla toda desde el principio. fileciteturn10file15 fileciteturn11file0

### Wireframes y flujos sugeridos

``​`mermaid
flowchart TD
  A[Inicio del builder] --> B{Modo de entrada}
  B --> C[Empezar con plantilla]
  B --> D[Empezar con IA]
  B --> E[Empezar desde cero]

  C --> F[Elegir preset de sitio o formulario]
  D --> F
  E --> F

  F --> G[Canvas con página inicial]
  G --> H[Agregar secciones y bloques]
  H --> I[Configurar tema global]
  I --> J[Conectar datos e integraciones]
  J --> K[Revisar tablet y mobile]
  K --> L[Preflight]
  L --> M[Publicar]
  M --> N[Runtime y submissions]
``​`

``​`mermaid
flowchart LR
  A[Rail por intención] --> B[Panel de páginas]
  A --> C[Panel de secciones]
  A --> D[Insert Center]
  D --> E[Hero]
  D --> F[Formulario]
  D --> G[Testimonio]
  D --> H[CTA]
  D --> I[FAQ]
  D --> J[Footer]
``​`

Como ejemplos visuales de referencia oficial, las superficies más útiles para estudiar son: la portada/editor híbrido y biblioteca de componentes de Wix, el constructor de páginas y bloques de Squarespace, el page building con CMS visual de Webflow, el CMS conectado al canvas y SEO en Framer, y la lógica conversacional/adaptativa de Typeform y Jotform. citeturn16view0turn17view0turn5view0turn5view2turn8view0turn8view1

## Plan de implementación y roadmap

La documentación interna ya propone un roadmap general de **12 a 16 semanas** con fases de diagnóstico, fundamentos de workspace, sistema visual, canvas, responsive, inspector, managers, Insert Center, páginas/reglas, preview/publicación, backend/integraciones y QA. Esa secuencia es sólida y conviene conservarla, pero con un ajuste táctico: la expansión hacia “sitios” debe empezar en UX y navegación, pero **no debe adelantarse al cierre del modelo de documento y del runtime de reglas**. fileciteturn10file1 fileciteturn10file15

### Roadmap recomendado

| Tramo | Objetivo | Resultado esperado | Esfuerzo |
|---|---|---|---|
| Diagnóstico | Baseline visual, descompresión reproducible, inventario de superficies y mapa del estado | Catálogo real de ZIP, baseline Playwright, matriz de componentes | Media |
| Fundamentos | Limpiar shell, overlays, z-index, theming global y estado de workspace | Builder más estable y embebible | Media |
| Navegación | Rail por intención, panel de páginas, secciones e Insert Center rediseñado | Cambio perceptivo de “form builder” a “studio” | Alta |
| Sistema de bloques | Presets de hero, section, form block, CTA, FAQ, testimonial y footer | Aceleración de creación de páginas/sitios | Alta |
| Responsive | Breakpoints semánticos, mobile focus mode y reglas por componente | Páginas realmente editables en desktop/tablet/mobile | Alta |
| Profundidad funcional | Theme Manager, Asset Manager, Data Manager, Integrations Manager | Builder escalable y menos dependiente del inspector | Alta |
| Runtime y publicación | Reglas reales, preflight, preview fiel y publicación consistente | Sitios y formularios publicables con confianza | Alta |
| Calidad | E2E, visual regression, accesibilidad, rendimiento y documentos grandes | Menos deuda al crecer catálogo y flujos | Media |

### Cronología sugerida

``​`mermaid
flowchart LR
  A[Semanas 1-2\nDiagnóstico y baseline] --> B[Semanas 3-4\nShell, overlays y theming]
  B --> C[Semanas 5-7\nPages + Sections + Insert Center]
  C --> D[Semanas 8-9\nResponsive semántico]
  D --> E[Semanas 10-12\nManagers: Theme, Assets, Data]
  E --> F[Semanas 13-14\nRules, preflight y publicación]
  F --> G[Semanas 15-16\nQA, accesibilidad y rollout]
``​`

### Criterio de priorización por recomendación

| Recomendación | Dependencia crítica | Riesgo si se pospone | Esfuerzo |
|---|---|---|---|
| Panel de páginas + sitemap | Estado de documento | El producto seguirá percibiéndose como editor de formularios | Alta |
| Insert Center por intención | Registry y catálogo | El crecimiento de componentes seguirá desordenado | Alta |
| Theme Manager | Tokens y primitives | Branding inconsistente y trabajo repetitivo | Media |
| Asset Manager | Publicación y storage | Sitios pobres en media o media dispersa | Alta |
| Responsive semántico | Layout por nodo | Mala experiencia tablet/mobile y más bugs de overflow | Alta |
| Z-index y overlays | Shell y CSS base | Menús, popovers y DnD poco fiables | Media |
| Runtime de reglas real | Backend + preview + runtime | Sitios/formularios dinámicos poco confiables | Alta |
| Preflight + publish UX | Publicación | Más errores al pasar de edición a producción | Media |
| Accesibilidad sistemática | Design system | Deuda técnica acumulativa y problemas de usabilidad | Media |
| Baseline visual automatizado | QA | Cada mejora visual puede romper el editor silenciosamente | Baja |

La recomendación final de implementación es **empezar por la estructura de experiencia y no por el detalle gráfico**. Si se intenta embellecer antes de ordenar Pages, Sections, Insert Center, Theme y publicación, Dynamic Forms solo obtendrá una interfaz más pulida para una promesa todavía incompleta. En cambio, si se siguen el orden y los principios ya sugeridos por la documentación interna —schema como fuente de verdad, core desacoplado, canvas central y paneles asistentes—, el producto puede evolucionar de forma creíble hacia un constructor de formularios, páginas y sitios web con una base más robusta y más fácil de mantener. fileciteturn11file6 fileciteturn10file15
```

<a id="file-0093"></a>

### 0093 — `MANIFEST.md`

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

<a id="file-0094"></a>

### 0094 — `plan-accion-ux-ui-sidebar-derecho-sisad-pdfme.md`

- **Lenguaje:** `markdown`
- **Líneas:** `635`
- **Tamaño original:** `17.4 KB`
- **SHA1 corto:** `a580193503`
- **Estado:** `completo`

```markdown
# Plan de acción UX/UI y comportamiento — SISAD PDFME

## Objetivo

Corregir las regresiones visuales y de interacción observadas en el diseñador `multi-document-routing`, priorizando:

1. que el botón flotante de colapso del sidebar derecho **no aparezca cuando el panel está colapsado**;
2. que el rail colapsado sea la única vía visible para reabrir el panel;
3. que documentos, inspector, validaciones y asignación/bloqueo funcionen con una jerarquía clara;
4. que el canvas conserve su protagonismo sin tocar Moveable, Selecto, Paper, coordenadas, zoom ni generator.

---

# 1. Diagnóstico principal

## 1.1 Causa del botón superpuesto del sidebar derecho

En `src/sisad-pdfme/ui/components/Designer/index.tsx`, el `SidebarCollapseHandle` derecho se renderiza siempre que el sidebar no esté detached:

``​`tsx
{!rightSidebarDetached ? (
  <SidebarCollapseHandle
    side="right"
    expanded={sidebarOpen}
    ...
  />
) : null}
``​`

La condición no comprueba `sidebarOpen`. Por eso, al colapsar el panel, el botón sigue flotando sobre el rail.

Además, el CSS lo posiciona desde el `stage`:

``​`css
.sisad-pdfme-designer-stage > .sisad-pdfme-designer-right-sidebar-toggle-btn {
  top: 3.75rem;
  right: 0.75rem;
}
``​`

Cuando el panel está cerrado, el botón vuelve a `right: 0.75rem`, exactamente sobre la zona del rail. El resultado visual es la superposición observada sobre el icono de Campos/Capas.

## 1.2 Comportamiento objetivo

### Panel expandido

- Mostrar un botón de colapso integrado visualmente en el panel.
- El botón puede estar dentro del encabezado o en el borde interno del panel.
- No debe flotar sobre el canvas ni sobre los tabs.

### Panel colapsado

- No renderizar `SidebarCollapseHandle`.
- Mantener únicamente el `SidebarRail` con los modos:
  - Campos;
  - Propiedades;
  - Comentarios;
  - Documentos.
- Al pulsar cualquier icono del rail:
  1. seleccionar ese modo;
  2. abrir el sidebar;
  3. enfocar el encabezado del panel correspondiente.

El rail pasa a ser el mecanismo de reapertura. No se necesita un segundo botón de “expandir”.

---

# 2. Corrección inmediata del sidebar derecho

## Archivos

``​`text
src/sisad-pdfme/ui/components/Designer/index.tsx
src/sisad-pdfme/ui/components/Designer/RightSidebar/RightSidebar.tsx
src/sisad-pdfme/ui/components/Designer/shared/SidebarCollapseHandle.tsx
src/sisad-pdfme/ui/components/Designer/shared/SidebarRail.tsx
src/sisad-pdfme/ui/styles/sisad-pdfme-global.css
src/sisad-pdfme/ui/styles/sisad-pdfme-sidebar.css
``​`

## 2.1 Renderizar el handle solo cuando está abierto

Cambio mínimo en `Designer/index.tsx`:

``​`tsx
{!rightSidebarDetached && sidebarOpen ? (
  <SidebarCollapseHandle
    side="right"
    expanded
    presentation={rightSidebarPresentation}
    density={rightSidebarPresentation === 'overlay' ? 'compact' : 'full'}
    labelExpanded="Ocultar panel derecho"
    labelCollapsed="Mostrar panel derecho"
    onToggle={() => setSidebarOpen(false)}
    className={`${DESIGNER_CLASSNAME}right-sidebar-toggle-btn`}
  />
) : null}
``​`

No pasar `expanded={false}` al handle derecho. En estado cerrado no debe existir en el DOM.

## 2.2 Abrir desde el rail

El rail debe recibir un callback único:

``​`ts
type RightSidebarMode = 'fields' | 'detail' | 'comments' | 'docs';

const openModeFromRail = (mode: RightSidebarMode) => {
  setInternalViewMode(mode);
  onViewModeChange?.(mode);
  setSidebarOpen(true);
};
``​`

Cada botón del rail debe usar:

``​`tsx
onClick={() => openModeFromRail(item.key)}
aria-label={`Abrir ${item.label}`}
aria-controls={rootId}
aria-expanded={false}
``​`

## 2.3 Integrar el botón de cierre dentro del panel expandido

La opción más estable es mover el handle al `panel-switcher-wrap` o al header principal de `RightSidebar`, en lugar de posicionarlo desde el `stage`.

Diseño recomendado:

``​`text
[ Campos | Propiedades | Comentarios | Documentos ] [ ‹ ]
``​`

- botón de 28 × 28 px;
- sin posición absoluta;
- tooltip controlado;
- `aria-label="Ocultar panel derecho"`;
- no debe desplazar los tabs de forma perceptible.

Después de integrarlo, eliminar la regla global de posición del toggle derecho en el stage.

## 2.4 Dimensiones del rail

``​`text
Ancho: 44 px
Padding superior: 8 px
Botón: 32 × 32 px
Separación: 6 px
Radio: 10–12 px
Indicador activo: borde izquierdo o fondo tonal suave
``​`

No usar pills verticales grandes. No colocar sombras fuertes en cada botón.

---

# 3. Panel de documentos

## Problemas observados

- El título dice “Selecciona una página”, pero la lista representa documentos.
- El contador `2` aparece separado y sin contexto.
- El botón `Subir` queda apretado o parcialmente cortado.
- La acción eliminar está visualmente separada de la tarjeta activa.
- La tarjeta activa tiene demasiado fondo y altura.
- Documento y página se mezclan en la misma jerarquía.

## Comportamiento objetivo

### Header

``​`text
Documentos                         [Subir]
2 documentos
``​`

No usar “Selecciona una página” si la lista principal es documental.

### Ítem

``​`text
[icono] Declaración de datos        [⋮]
        14 páginas · Página 1 activa
``​`

El menú `⋮` debe contener:

- Cambiar nombre, si aplica.
- Reemplazar PDF.
- Eliminar documento.

No mostrar un botón rojo de papelera flotando fuera de la tarjeta.

### Selección

- Un clic cambia el documento activo.
- No cambiar zoom de manera automática.
- No restablecer el scroll del canvas salvo que cambie de página/documento.
- La selección activa debe tener un acento del color del usuario, no un gran bloque azul.

## Archivos

``​`text
src/sisad-pdfme/ui/components/Designer/RightSidebar/DocumentsRail.tsx
src/sisad-pdfme/ui/components/Designer/RightSidebar/layout.tsx
src/sisad-pdfme/ui/components/Designer/RightSidebar/RightSidebar.tsx
``​`

---

# 4. DetailView e inspector

## 4.1 Anchura real y diseño responsive

Las métricas actuales sitúan el sidebar derecho alrededor de 276 px. El inspector debe diseñarse para esa anchura, no para 340–400 px.

### Reglas

- Usar `minmax(0, 1fr)` en todas las columnas.
- Cada input debe tener `min-width: 0`.
- No permitir que labels reduzcan el ancho útil del input.
- Evitar grids fijos que fuercen tres campos en una sola fila.

## 4.2 Ubicación y tamaño

Distribución objetivo:

``​`text
Alineación
[8 botones en grid 4 × 2]

X                  Y
[input]            [input]

Ancho              Alto
[input]            [input]

Rotación
[input ancho completo]
``​`

Los valores no pueden verse cortados como `9?` o `1?`.

Usar `InputNumber` con:

- ancho 100%;
- mínimo 0;
- step correcto;
- validación visible;
- no cambiar valor con rueda del mouse si el control no tiene foco.

## 4.3 Formato

Dividir internamente:

``​`text
TIPOGRAFÍA
Fuente | Tamaño

ESTILO
Negrita | Cursiva | Subrayado

ALINEACIÓN
Horizontal
Vertical

ESPACIADO
Altura de línea | Espaciado

COLORES
Texto | Fondo
``​`

No presentar los nueve botones como una matriz sin subtítulos.

Ocultar propiedades no aplicables al tipo de schema. Por ejemplo, un action schema no necesita toda la configuración tipográfica de un campo de texto.

## 4.4 Perfiles de expansión

Para `select`:

- `identity`: abierto;
- `options`: abierto;
- `validation`: cerrado;
- `interaction`: cerrado;
- `box`: cerrado;
- `appearance`: cerrado;
- `collaboration`: cerrado;
- `advanced`: oculto o cerrado.

Solo una o dos secciones abiertas por defecto. Abrir varias secciones produce un panel excesivamente largo.

## Archivos

``​`text
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailSchemas.ts
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailSectionTaxonomy.ts
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/schemaDetailProfiles.ts
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailSectionCard.tsx
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/AlignWidget.tsx
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/InspectorNumberInput.tsx
``​`

---

# 5. Dropdown de validación

## Problemas

- El popup ocupa demasiada altura.
- Cubre las secciones siguientes.
- Las opciones son demasiado grandes.
- No aprovecha el espacio lateral disponible.

## Solución

En `InspectorSelect.tsx`:

- portal al `document.body`;
- `popupClassName="sisad-inspector-select-popup"`;
- `listHeight={224}`;
- placement dinámico o `bottomRight` para el sidebar derecho;
- ancho mínimo 220 px y máximo 280 px;
- altura de fila 32–36 px;
- scroll interno cuando existan más opciones;
- cierre con Escape;
- devolver foco al trigger.

CSS:

``​`css
.sisad-inspector-select-popup {
  min-width: 220px;
  max-width: min(280px, calc(100vw - 24px));
}

.sisad-inspector-select-popup .ant-select-item {
  min-height: 34px;
  padding: 6px 10px;
}
``​`

No resolverlo aumentando z-index de forma arbitraria.

---

# 6. Editor de opciones

## Problemas

- Las acciones de mover/eliminar tienen poco contraste.
- El indicador de valor predeterminado no es suficientemente claro.
- El input y botón “Agregar” quedan apretados.
- Reordenar con flechas genera demasiados controles repetidos.

## Diseño objetivo

``​`text
☰  Pendiente                         ● Predeterminado  ⋮
☰  Aprobado                                             ⋮
☰  Rechazado                                            ⋮

[Nueva opción…                         ] [Agregar]
``​`

- usar drag handle para reordenar;
- menú `⋮` para eliminar o duplicar;
- radio/check explícito para valor predeterminado;
- Enter agrega opción;
- Escape limpia el input;
- impedir nombres vacíos o duplicados según política;
- conservar `optionId` al renombrar o reordenar;
- ningún evento debe propagarse al canvas o crear otro schema.

## Archivos

``​`text
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaOptionsEditor.tsx
src/sisad-pdfme/schemas/options/optionModel.ts
src/sisad-pdfme/schemas/options/optionValueAdapter.ts
``​`

---

# 7. Asignación y bloqueo

## Problemas críticos

- El panel muestra “Bloqueado para edición”, mientras el modal muestra “Bloqueado” y la tarjeta inferior puede indicar “En edición por ti”.
- Se expone `recipient-1` en lugar del nombre visible.
- El propietario aparece también como co-propietario.
- “Avanzado” se abre por defecto y domina el modal.
- Se muestran timestamps epoch sin formato.
- `Bloqueado por` se representa como input, aunque debería ser informativo.
- El modal no prioriza las acciones Guardar/Cancelar.

## Modelo de estado único

Crear o consolidar:

``​`ts
type SchemaAccessState = {
  collaborationLock: 'none' | 'mine' | 'other';
  objectLocked: boolean;
  readOnly: boolean;
  canEdit: boolean;
  canMove: boolean;
  canDelete: boolean;
  lockOwnerId: string | null;
  lockOwnerLabel: string | null;
  statusLabel: string;
  statusTone: 'neutral' | 'info' | 'warning' | 'danger';
};
``​`

Usar el mismo resolver en:

- canvas chrome;
- DetailHeader;
- ListView;
- SchemaCollaborationWidget;
- toolbar contextual;
- menú contextual.

## Modal objetivo

``​`text
Gestionar asignación y acceso

Estado
[ En edición por ti ]

Propietario
[ Cliente Principal · Firmante ]

Co-propietarios
[ Seleccionar participantes… ]

Bloqueo
Bloqueado por Cliente Principal
Desde 12 jul 2026, 10:02

Opciones técnicas ▸

Cancelar                         Guardar cambios
``​`

### Reglas

- Excluir al propietario principal de `coOwners`.
- Resolver todos los IDs con `recipientNameMap`/usuarios.
- `Avanzado` cerrado por defecto.
- Ocultar datos técnicos en producción salvo `developerMode`.
- Formatear fechas con `Intl.DateTimeFormat`.
- Modal con `max-height: 80dvh`.
- Body con scroll interno.
- Footer sticky siempre visible.
- No permitir guardar un owner dentro de co-owners duplicado.

## Archivos

``​`text
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaCollaborationWidget.tsx
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/schemaCollaborationUtils.ts
src/sisad-pdfme/ui/components/Designer/shared/schemaInteractionState.ts
src/sisad-pdfme/collaboration/lockManager.ts
src/sisad-pdfme/collaboration/schemaLockGuard.ts
``​`

---

# 8. Canvas y overlays

## Problemas observados

- La toolbar contextual puede cubrir un schema vecino.
- El tooltip técnico `contract_stage` aparece mientras ya existe el label inferior del schema.
- La medición, toolbar, tooltip y selección se muestran simultáneamente.
- `Resultados` y zoom compiten en la parte inferior.

## Acciones

1. Mantener la geometría existente de overlays.
2. Aplicar una política visual:
   - toolbar al seleccionar;
   - métrica solo durante resize/move o hover breve;
   - tooltip técnico solo cuando no esté abierta la toolbar;
   - inline edit únicamente durante edición.
3. Reducir la toolbar a:

``​`text
Eliminar | Duplicar | Más
``​`

4. Cerrar toolbar al hacer click fuera o pulsar Escape.
5. Convertir `Resultados` en un elemento de status bar o separarlo al menos 8–12 px del zoom.

No modificar:

``​`text
Canvas.tsx
Moveable.tsx
Selecto.tsx
Paper.tsx
coordinateMath.ts
designerCoordinateService.ts
``​`

Los ajustes deben limitarse a skins, políticas de visibilidad y composición de overlays existentes.

---

# 9. Orden de implementación

## P0 — Regresiones funcionales y de confianza

1. Ocultar el `SidebarCollapseHandle` derecho cuando `sidebarOpen === false`.
2. Reabrir el panel únicamente desde los iconos del rail.
3. Mover el botón de cierre al encabezado del panel expandido.
4. Unificar estados de bloqueo y nombres de usuario.
5. Cerrar “Avanzado” por defecto en asignación/bloqueo.
6. Evitar propietario duplicado en co-propietarios.
7. Corregir inputs numéricos cortados del inspector.
8. Limitar y portar el popup de validación.

## P1 — Jerarquía y densidad

1. Rediseñar `DocumentsRail`.
2. Ajustar perfiles de secciones del inspector.
3. Reorganizar Formato por subgrupos.
4. Simplificar editor de opciones.
5. Reducir superficies anidadas y sombras.
6. Mejorar estados hover/focus/active del rail.

## P2 — Comportamiento fino

1. Preservar scroll y zoom al abrir/cerrar paneles.
2. En overlay, Escape cierra el panel.
3. El modo seleccionado del rail se conserva al reabrir.
4. Restaurar foco al botón que abrió el panel.
5. Cerrar popups cuando cambia schema/documento.
6. Evitar overlays simultáneos innecesarios.

---

# 10. Pruebas obligatorias

## `tests/e2e/sidebar-collapse-parity.spec.ts`

``​`text
- panel derecho abierto: existe botón Ocultar panel derecho;
- panel derecho cerrado: NO existe right-sidebar-toggle-btn;
- panel cerrado: existe rail con 4 modos;
- click Campos abre panel en fields;
- click Propiedades abre panel en detail;
- click Comentarios abre panel en comments;
- click Documentos abre panel en docs;
- rail no tiene botones superpuestos;
- aria-expanded y aria-controls correctos;
- navegación completa con teclado;
- no hay overflow horizontal.
``​`

## `tests/e2e/inspector-detailview-profiles.spec.ts`

``​`text
- select abre identity y options solamente;
- validation popup cabe en viewport;
- X/Y/ancho/alto/rotación no se cortan;
- no existen secciones vacías;
- formato solo muestra propiedades aplicables.
``​`

## `tests/e2e/schema-lock-state-consistency.spec.ts`

``​`text
- lock mío => “En edición por ti” en header, modal, lista y menú;
- lock ajeno => “Bloqueado por <nombre>”;
- ningún ID técnico visible fuera de developerMode;
- owner no aparece duplicado como co-owner;
- advanced cerrado por defecto;
- Guardar/Cancelar siempre visibles.
``​`

## `tests/e2e/documents-rail.spec.ts`

``​`text
- muestra conteo correcto de documentos;
- seleccionar documento cambia el activo;
- subir PDF no queda cortado;
- eliminar está dentro del menú del ítem;
- no confunde documento con página;
- mantiene zoom al cambiar de tab del sidebar.
``​`

## Comandos

``​`bash
npm run build
npm run lint
npx playwright test tests/e2e/sidebar-collapse-parity.spec.ts --project=chromium
npx playwright test tests/e2e/inspector-detailview-profiles.spec.ts --project=chromium
npx playwright test tests/e2e/schema-lock-state-consistency.spec.ts --project=chromium
npx playwright test tests/e2e/documents-rail.spec.ts --project=chromium
``​`

---

# 11. Criterios de aceptación

``​`text
[ ] El botón flotante derecho no existe cuando el sidebar está colapsado.
[ ] El rail es la única vía visible para reabrir el sidebar.
[ ] El botón de cierre no tapa tabs, Guardar ni iconos del rail.
[ ] Los cuatro iconos del rail son accesibles y abren su modo correspondiente.
[ ] El panel de documentos distingue documento y página.
[ ] El botón Subir nunca queda cortado.
[ ] X/Y/ancho/alto/rotación se leen completos a 276 px.
[ ] El popup de validación no cubre todo el inspector.
[ ] El editor de opciones conserva optionId y no crea schemas accidentales.
[ ] No se muestran IDs como recipient-1 al usuario final.
[ ] El propietario no aparece duplicado como co-propietario.
[ ] El estado de bloqueo coincide en canvas, inspector, lista y modal.
[ ] Avanzado está cerrado por defecto y los timestamps están formateados.
[ ] Guardar y Cancelar permanecen visibles en el modal.
[ ] Abrir/cerrar paneles no cambia zoom ni selección.
[ ] No se modifican Moveable, Selecto, Paper, SnapshotAdapter, Generator ni pdf-lib.
``​`

---

# 12. Nota sobre los archivos de contexto

El archivo nombrado como backend continúa apuntando a la carpeta `prueba-plugin` y no contiene controladores, servicios o entidades C#. Este plan está basado en el frontend React/TypeScript, estilos y documentación de SISAD PDFME. Para analizar persistencia o contratos backend del Dynamic Builder se debe regenerar el paquete C# desde la carpeta correcta.
```

<a id="file-0095"></a>

### 0095 — `plan-integracion-detailview-wix-sisad-pdfme.md`

- **Lenguaje:** `markdown`
- **Líneas:** `686`
- **Tamaño original:** `23.2 KB`
- **SHA1 corto:** `f2c32986ef`
- **Estado:** `completo`

```markdown
# Plan integral de mejoras — SISAD PDFME Designer DetailView, Canvas, Sidebars y UX tipo Wix

**Fecha:** 2026-07-13
**Ruta de validación:** `http://localhost:5174/lab/multi-document-routing`
**Archivos base analizados:**

- `codigo-frontend-sisad—pdmfe(14).md`
- `documentacion-sisad—pdmfe-web(4).md`
- `styles-sisad—pdmfe(14).md`
- capturas del diseñador, RightSidebar ListView, DetailView, secciones `Opciones`, `Reglas de llenado`, `Formato`, `Asignación y bloqueo`, `Ubicación y tamaño`

---

## 1. Diagnóstico ejecutivo

El diseñador ya tiene una base fuerte: catálogo izquierdo, canvas con selección, panel derecho con lista/detalle/documentos/comentarios, perfiles por schema, widgets de inspector, owner color, collapse handle compartido y una arquitectura de task-cards. El problema actual está en la **conexión completa entre lo visual y lo funcional**.

La prioridad no debe ser “decorar” el RightSidebar, sino asegurar que cada control visible tenga un contrato real:

``​`txt
Control visible
→ propiedad real del schema
→ widget correcto
→ onChange conectado
→ CommandBus / update centralizado
→ access state respetado
→ snapshot roundtrip
→ Form/Viewer/PDF compatible si aplica
→ test unitario/E2E
``​`

Problemas principales detectados en las capturas:

1. **RightSidebar ListView:** visualmente todos los campos parecen seleccionados por la barra azul. Debe reservarse la barra/accent azul para selección real o estado activo.
2. **DetailHeader:** el chip “Bloqueado para edición” aparece demasiado agresivo y puede no coincidir con el estado real del canvas/lista.
3. **Información del campo:** existe input `Nombre del campo` y botón `Renombrar campo`, duplicando intención.
4. **Opciones:** la sección ya es útil, pero necesita reordenamiento más claro, drag handle y validación de opción vacía/duplicada.
5. **Reglas de llenado:** el `Select` de validación aparece sin ancho/placeholder útil; debe ocupar todo el ancho y mostrar opciones proporcionales al schema.
6. **Formato:** los inputs de opacidad, fuente, tamaño, espaciado, altura de línea, colores y botones de formato están desbalanceados. Algunos controles no tienen ancho suficiente o están en una grilla incompatible con un sidebar estrecho.
7. **Ubicación y tamaño:** `X`, `Y`, `Ancho`, `Alto`, `Rotación` se cortan por columnas pequeñas. La grilla no debe usar 3 columnas fijas en un panel estrecho.
8. **Asignación y bloqueo:** repite título, estado y chips; debe mostrar un resumen colaborativo compacto y conectar acciones reales de lock/unlock/assign.
9. **Resultados:** sigue flotando cerca del zoom/canvas; debe moverse a barra inferior o drawer.
10. **Wix-like UX:** falta una estrategia de inspector progresivo: primero controles frecuentes, luego avanzado, con paneles que responden al contexto y no todo abierto como formulario pesado.

---

## 2. Principios obligatorios para la siguiente pasada

### 2.1. No tocar en esta pasada

``​`txt
src/sisad-pdfme/pdf-lib/**
src/sisad-pdfme/generator/**
src/sisad-pdfme/shared/snapshotAdapter.ts
src/sisad-pdfme/ui/components/Designer/Canvas/Moveable.tsx
src/sisad-pdfme/ui/components/Designer/Canvas/Selecto.tsx
StepOne / StepTwo host / ContentCustomForm negocio / Uanataca
``​`

Solo se toca Canvas si una función visible del inspector depende de selección o focus y no hay otra vía. La geometría visual se corrige desde widgets, layout y command/update, no con hacks de z-index.

### 2.2. No más CSS disperso

Toda corrección visual debe ir en:

``​`txt
src/styles/sisad-tailwind-bridge.css
src/sisad-pdfme/ui/styles/sisad-pdfme-sidebar.css
src/sisad-pdfme/ui/styles/tokens.css
``​`

o directamente en `className` Tailwind del componente, si el cambio pertenece al componente y no a reglas legacy.

### 2.3. Cada componente visual debe tener funcionamiento real

No mostrar controles que no persisten. Ejemplo:

``​`txt
Si Formato muestra fontName → debe leer/escribir schema.fontName.
Si Formato muestra opacity → debe leer/escribir schema.opacity y renderizarlo.
Si Reglas muestra validation → debe persistir schema.validation.
Si Ubicación muestra x/y/width/height → debe actualizar schema con CommandBus/update central.
Si Bloqueo muestra Gestionar → debe abrir modal o ejecutar action real.
``​`

---

## 3. Investigación Wix aplicada al diseñador SISAD PDFME

Wix Studio usa un inspector contextual para editar propiedades de elementos, secciones y páginas, incluyendo resizing por breakpoint, diseño, interacciones y contenido/CMS. Para SISAD PDFME, esto se traduce en un `DetailView` por perfiles: cada schema muestra solo propiedades aplicables y un modo avanzado colapsado.

Ideas Wix que sí conviene adoptar:

1. **Inspector progresivo:** mostrar primero diseño, contenido, layout y comportamiento frecuente; ocultar técnico.
2. **Breakpoints / responsive mental model:** aunque PDF no sea responsive como web, sí se puede usar la idea de “contexto activo”: documento, página, destinatario y modo runtime.
3. **Layers panel:** RightSidebar ListView debe funcionar como panel de capas: jerarquía, selección difícil en canvas, localizar elemento, ordenar, bloquear.
4. **Align/distribute/match size:** debe funcionar solo con selección múltiple y comunicar cuándo está deshabilitado.
5. **CMS/dynamic pages:** para SISAD, esto inspira `dataBindings`: fieldKey, dataLabel, JSON path, datos conectados y repetición de campos por plantilla.
6. **Responsive AI / auto layout:** no copiar IA, pero sí crear sugerencias automáticas: “ajustar ancho”, “alinear al campo anterior”, “distribuir campos seleccionados”, “normalizar tamaños”.
7. **Stacks / spacing directo:** para grupos de opciones, permitir editar spacing/orientation desde inspector y con + en canvas.

---

## 4. Plan por fases

## Fase 0 — Auditoría focalizada antes de modificar

Crear reporte:

``​`bash
mkdir -p reports/detailview-functional-audit

rg "InspectorNumberInput|InspectorColorInput|InspectorSelect|InspectorSwitch|InspectorField|DetailSectionCard|DetailFormSection|AlignWidget|ButtonGroupWidget|detailWidgetRegistry|detailSchemas|schemaDetailProfiles|WidgetRenderer" src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView > reports/detailview-functional-audit/inspector-widgets.txt

rg "opacity|fontName|fontSize|characterSpacing|lineHeight|textColor|backgroundColor|bgColor|x:|y:|width|height|rotation|rotate|readOnly|readonly|locked|required|validation|dataLabel|tooltip" src/sisad-pdfme > reports/detailview-functional-audit/schema-properties.txt

rg "onChange|updateSchema|setSchema|commandBus|executeCommand|selectionCommands|bulk|patch|fieldName|commit" src/sisad-pdfme/ui/components/Designer/RightSidebar src/sisad-pdfme/ui/commands src/sisad-pdfme/ui/components/Designer/shared > reports/detailview-functional-audit/update-paths.txt

rg "Resultados|Colapsado|bottom: 12|z-index: 70|lab-results|results" src reports tests > reports/detailview-functional-audit/results-panel.txt
``​`

Criterio de cierre:

``​`txt
[ ] Listar controles visibles del DetailView.
[ ] Mapear cada control a propiedad real.
[ ] Mapear cada propiedad a update path.
[ ] Marcar controles visibles sin persistencia.
[ ] Marcar funciones existentes no usadas.
``​`

---

## Fase 1 — Crear contrato `InspectorWidgetContract`

### Objetivo

Conectar visual + funcionalidad + persistencia en una sola definición.

### Archivos

``​`txt
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/inspectorContracts.ts
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailWidgetRegistry.tsx
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/WidgetRenderer.tsx
``​`

### Contrato recomendado

``​`ts
export type InspectorWidgetContract = {
  id: string;
  section: InspectorSectionKey;
  label: string;
  description?: string;
  propertyPath: string;
  widget: 'text' | 'number' | 'select' | 'switch' | 'color' | 'buttonGroup' | 'align' | 'optionEditor' | 'definitionList' | 'custom';
  read: (schema: SchemaForUI, context: InspectorContext) => unknown;
  write: (value: unknown, schema: SchemaForUI, context: InspectorContext) => SchemaPatch | DesignerCommand;
  visibleWhen?: (schema: SchemaForUI, context: InspectorContext) => boolean;
  disabledWhen?: (schema: SchemaForUI, context: InspectorContext) => boolean;
  validate?: (value: unknown, schema: SchemaForUI, context: InspectorContext) => string | null;
  layout?: {
    colSpan?: 1 | 2 | 3 | 'full';
    minWidth?: number;
    compact?: boolean;
  };
};
``​`

### Reglas

- No usar widgets que solo pintan UI sin `write`.
- No mutar schema directo dentro del widget.
- No meter lógica de tipo de schema en el JSX final; usar `visibleWhen` y perfil.

---

## Fase 2 — Layout adaptativo para `Ubicación y tamaño`

### Problema visual

En las capturas, `Ancho`, `Alto` y `Rotación` quedan cortados. El layout actual intenta meter demasiadas columnas en un panel estrecho.

### Cambio requerido

Crear componente:

``​`txt
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/widgets/GeometryFields.tsx
``​`

### Diseño objetivo

Para panel `< 360px`:

``​`txt
Alineación
[8 botones en 4x2]

Posición
[X mm] [Y mm]

Tamaño
[Ancho mm] [Alto mm]

Rotación
[Rotación °]  ancho completo
``​`

Para panel `>= 360px`:

``​`txt
X | Y
Ancho | Alto
Rotación full
``​`

### Implementación Tailwind

``​`tsx
<div className="grid grid-cols-2 gap-2" data-inspector-grid="geometry">
  <InspectorNumberInput className="min-w-0" inputClassName="w-full min-w-[96px]" label="X mm" />
  <InspectorNumberInput className="min-w-0" inputClassName="w-full min-w-[96px]" label="Y mm" />
  <InspectorNumberInput className="min-w-0" inputClassName="w-full min-w-[96px]" label="Ancho mm" />
  <InspectorNumberInput className="min-w-0" inputClassName="w-full min-w-[96px]" label="Alto mm" />
  <InspectorNumberInput className="col-span-2 min-w-0" inputClassName="w-full" label="Rotación" />
</div>
``​`

### Cambiar `InspectorNumberInput`

El componente debe aceptar:

``​`ts
inputClassName?: string;
suffix?: string;
precision?: number;
controls?: boolean;
fullWidth?: boolean;
``​`

Y renderizar:

``​`tsx
<label className={mergeClassNames('flex min-w-0 flex-col gap-1 text-[11px] text-slate-600', className)}>
  <span className="truncate font-semibold">{label}</span>
  <InputNumber
    className={mergeClassNames('w-full min-w-0', inputClassName)}
    controls={controls ?? false}
    suffix={suffix}
  />
</label>
``​`

### Tests

``​`txt
[ ] X/Y/Ancho/Alto/Rotación no se cortan en panel 320px.
[ ] Rotación ocupa ancho completo.
[ ] Cambiar X/Y actualiza canvas.
[ ] Cambiar width/height actualiza canvas.
[ ] Campos readonly se ven deshabilitados.
``​`

---

## Fase 3 — Layout adaptativo para `Formato`

### Problema visual

La sección `Formato` mezcla entradas numéricas, select de fuente, botones de formato, color pickers e inputs HEX en una grilla que no cabe bien.

### Nuevo componente

``​`txt
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/widgets/AppearanceFields.tsx
``​`

### Distribución objetivo

``​`txt
Opacidad            Fuente
[ 100% slider/input ][Roboto ▼]

Tamaño              Espaciado
[13]                [0]

Formato
[B] [I] [U] [Alineación horizontal]
[Alineación vertical]

Color del texto
[swatch] [#000000] [pipeta/restablecer]

Color del fondo
[swatch] [Heredar / #FFFFFF] [reset]
``​`

### Cambios funcionales

1. `opacity` debe mostrarse como porcentaje, no `1.0`.
2. `fontName` debe ocupar ancho completo si el panel es estrecho.
3. `fontSize`, `spacing`, `lineHeight` deben usar números compactos, pero no menores a `80px`.
4. `dynamicFontSize` debe ser un switch claro, no checkbox pequeño perdido.
5. Colores deben usar componente único `ColorField`.
6. No mostrar `Formato` en schemas que no soportan propiedades visuales.

### Crear `ColorField`

``​`txt
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/widgets/ColorField.tsx
``​`

Props:

``​`ts
type ColorFieldProps = {
  label: string;
  value?: string;
  inheritedValue?: string;
  inheritLabel?: string;
  allowInherit?: boolean;
  onChange: (value: string | null, mode?: 'custom' | 'inherit') => void;
  disabled?: boolean;
};
``​`

Estados:

``​`txt
- Heredar color del destinatario.
- Usar color personalizado.
- Restablecer.
- Validar HEX.
``​`

---

## Fase 4 — Conectar AlignWidget y ButtonGroupWidget a comandos reales

### Problema

Los botones de alineación se ven, pero deben comunicar cuándo están deshabilitados y ejecutar comandos reales.

### Archivos

``​`txt
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/AlignWidget.tsx
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/ButtonGroupWidget.tsx
src/sisad-pdfme/ui/components/Designer/shared/actionRegistry.ts
src/sisad-pdfme/ui/commands/designerCommands.ts
src/sisad-pdfme/ui/commands/commandBus.ts
``​`

### Contrato

``​`ts
type InspectorAction = {
  id: string;
  label: string;
  icon: ReactNode;
  requiresSelection?: 'single' | 'multi';
  disabledReason?: string;
  execute: (context: InspectorContext) => void;
};
``​`

### Reglas

- Alinear izquierda/centro/derecha puede funcionar con 1 o N campos.
- Distribuir horizontal/vertical requiere N >= 3.
- Igualar ancho/alto requiere N >= 2.
- Si hay campos bloqueados o readonly, excluirlos o deshabilitar con tooltip.

---

## Fase 5 — Unificar estado real de bloqueo/readonly

### Problema observado

En la captura `contract_stage` aparece “Bloqueado para edición”. Ese estado debe coincidir con canvas, ListView, toolbar flotante y acciones.

### Archivos

``​`txt
src/sisad-pdfme/ui/components/Designer/shared/schemaInteractionState.ts
src/sisad-pdfme/ui/components/Designer/shared/schemaInteractionCapabilities.ts
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/schemaInteractionState.ts
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailHeaderCard.tsx
src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/Item.tsx
src/sisad-pdfme/ui/components/Designer/Canvas/overlays/SelectionContextToolbar.tsx
``​`

### Crear/fortalecer resolver

``​`ts
export type SchemaAccessViewModel = {
  selectable: boolean;
  inspectable: boolean;
  editable: boolean;
  movable: boolean;
  resizable: boolean;
  deletable: boolean;
  duplicable: boolean;
  lockState: 'unlocked' | 'locked-by-me' | 'locked-by-other';
  readonlyState: 'editable' | 'readonly' | 'runtime-readonly';
  label: string;
  reason?: string;
};
``​`

### Resultado esperado

``​`txt
Si DetailView dice bloqueado:
- Canvas no permite drag/resize.
- Toolbar no permite eliminar/duplicar si política lo bloquea.
- ListView muestra el mismo candado.
- Inputs se deshabilitan.
``​`

---

## Fase 6 — Inspector por perfil de schema

### Usar secciones oficiales

``​`txt
identity        Información del campo
content         Contenido
options         Opciones
validation      Reglas de llenado
fileRules       Reglas del archivo
signature       Firma
action          Acción
behavior        Interacción
box             Ubicación y tamaño
appearance      Formato
dataBindings    Datos y conexiones
comments        Comentarios
collaboration   Asignación y acceso
advanced        Técnico
``​`

### Matriz por tipo

| Schema | Secciones visibles |
|---|---|
| text | identity, content, validation, behavior, box, appearance, dataBindings, collaboration, advanced |
| number | identity, content, validation, numberFormat, behavior, box, appearance, dataBindings, collaboration, advanced |
| select | identity, options, validation, behavior, box, appearance, dataBindings, collaboration, advanced |
| checkbox | identity, validation, behavior, box, appearance, collaboration, advanced |
| checkboxGroup | identity, options, validation, behavior, box, appearance, collaboration, advanced |
| radioGroup | identity, options, validation, behavior, box, appearance, collaboration, advanced |
| signature | identity, signature, behavior, box, collaboration, advanced |
| dateSigned | identity, signature, box, appearance, collaboration, advanced |
| attachment | identity, fileRules, validation, behavior, box, appearance, collaboration, advanced |
| approve/decline | identity, action, validation, behavior, box, appearance, collaboration, advanced |
| note | identity, content, behavior, box, appearance, collaboration, advanced |
| image/svg/barcode | identity, content/source, box, appearance, dataBindings, advanced |
| line/rect/ellipse/table | identity, structure, box, appearance, advanced |

### Regla

No renderizar sección sin widgets visibles. No mostrar `Opciones` en `approve`, `decline`, `attachment`, `signature`, `image`. No mostrar `Formato` si el schema no consume esas propiedades.

---

## Fase 7 — Conectar funciones existentes no utilizadas

### Candidatos ya existentes a integrar

``​`txt
selectionPolicy.ts
interactionTargetResolver.ts
schemaInteractionState.ts
schemaInteractionCapabilities.ts
actionRegistry.ts
commandBus.ts
designerCommands.ts
schemaTone.ts
recipientColor.ts
SchemaOptionsEditor.tsx
InspectorOptionEditor.tsx
SidebarCollapseHandle.tsx
SidebarRail.tsx
CatalogLayoutToggle.tsx
``​`

### Integración esperada

1. `detailWidgetRegistry` debe renderizar widgets desde contratos, no desde `switch` disperso.
2. `SchemaOptionsEditor` debe ser el editor único para `select`, `radioGroup`, `checkboxGroup`.
3. `InspectorOptionEditor.tsx` no debe ser solo re-export si se requieren props normalizadas; debe actuar como adapter mínimo.
4. `actionRegistry` debe alimentar `AlignWidget`, toolbar contextual y menús de lista/canvas.
5. `schemaInteractionState` debe alimentar DetailHeader, inputs disabled y ListView.
6. `schemaTone` debe alimentar DetailHeader, ListView, field chrome y PluginIcon.

---

## Fase 8 — Mejorar RightSidebar ListView como panel de capas

### Problema

La barra azul izquierda aparece en todas las tarjetas, por lo que deja de indicar selección.

### Cambios

- Estado normal: sin barra azul; borde gris suave.
- Hover: fondo suave.
- Seleccionado: barra azul + fondo azul claro.
- Locked: candado y chip; no barra roja.
- Owner color: punto o borde sutil, no confundirlo con selección.

### Fila recomendada

``​`txt
[drag] [icono] Nombre visible               [estado]
              Tipo · Destinatario · Pág. N
``​`

Acciones por fila:

``​`txt
Localizar en documento
Abrir propiedades
Renombrar
Duplicar
Cambiar destinatario
Bloquear/desbloquear
Eliminar
``​`

---

## Fase 9 — Reubicar `Resultados`

### Problema

La píldora `Resultados · Vacío` queda cerca del zoom y canvas.

### Cambio recomendado

En lab:

``​`txt
Barra inferior: Resultados 0 · Sin errores · Última validación OK
``​`

En producción:

``​`txt
Drawer inferior solo si hay warning/error.
``​`

Archivos:

``​`txt
src/features/pdfcomponent/ResultsPanel.jsx
src/features/pdfcomponent/PdfmeLabPage.jsx
src/features/pdfcomponent/labRoutes.css
src/styles/sisad-tailwind-bridge.css
``​`

---

## Fase 10 — Tests obligatorios

``​`txt
tests/e2e/inspector-geometry-layout.spec.ts
tests/e2e/inspector-format-layout.spec.ts
tests/e2e/inspector-widget-persistence.spec.ts
tests/e2e/inspector-access-sync.spec.ts
tests/e2e/listview-layer-panel.spec.ts
tests/e2e/results-panel-placement.spec.ts
tests/e2e/wix-like-inspector-progressive.spec.ts
``​`

Casos mínimos:

``​`txt
[ ] X/Y/Ancho/Alto/Rotación no se cortan.
[ ] Cambiar X actualiza canvas.
[ ] Cambiar ancho actualiza canvas.
[ ] Opacity 80% persiste como 0.8.
[ ] Color text/background persiste y renderiza.
[ ] Select options agregar/eliminar/reordenar persiste.
[ ] Sección Opciones no aparece en approve/decline.
[ ] Campos bloqueados deshabilitan inputs.
[ ] ListView selecciona y localiza schema.
[ ] Resultados no tapa zoom ni sidebar.
``​`

---

## 5. Prompt listo para Codex

``​`txt
Actúa como arquitecto frontend senior experto en React, TypeScript, Tailwind, pdfme, editores tipo Wix/Figma/DocuSign, inspectors schema-driven, CommandBus, SOLID y Playwright.

Proyecto:
~/Documents/Taylor/frontend/prueba-plugin

Ruta de validación:
http://localhost:5174/lab/multi-document-routing

Objetivo de esta pasada:
Mejorar el RightSidebar DetailView y conectar cada control visible con funcionamiento real. En especial corregir las secciones Formato y Ubicación y tamaño, cuyos inputs se cortan o no tienen ancho suficiente, y asegurar que cada widget visible persista su valor en el schema por la vía correcta.

No tocar:
- pdf-lib
- generator
- SnapshotAdapter
- Moveable
- Selecto
- StepOne / StepTwo host / ContentCustomForm negocio / Uanataca
- geometría global del canvas salvo consumo de comandos existentes

Primero audita:
1. widgets del DetailView;
2. propiedades visibles vs propiedades persistidas;
3. funciones existentes no conectadas;
4. estilos que cortan inputs;
5. tests existentes.

Archivos candidatos:
- src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/InspectorNumberInput.tsx
- src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/InspectorColorInput.tsx
- src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/InspectorSelect.tsx
- src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/InspectorSwitch.tsx
- src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailSectionCard.tsx
- src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailFormSection.tsx
- src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/AlignWidget.tsx
- src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/ButtonGroupWidget.tsx
- src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailWidgetRegistry.tsx
- src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailSchemas.ts
- src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/WidgetRenderer.tsx
- src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaOptionsEditor.tsx
- src/sisad-pdfme/ui/components/Designer/shared/actionRegistry.ts
- src/sisad-pdfme/ui/commands/commandBus.ts
- src/sisad-pdfme/ui/commands/designerCommands.ts
- src/styles/sisad-tailwind-bridge.css
- src/sisad-pdfme/ui/styles/sisad-pdfme-sidebar.css

Implementa:
1. InspectorNumberInput con inputClassName, suffix, precision, controls=false, min-width seguro.
2. GeometryFields para Ubicación y tamaño con layout 2 columnas + rotación full width.
3. AppearanceFields para Formato con layout progresivo.
4. ColorField único para color texto/fondo con herencia de owner color.
5. AlignWidget conectado a actionRegistry/CommandBus, con disabledReason.
6. shouldRenderDetailSection para ocultar secciones vacías.
7. access state unificado para bloquear inputs si schema está locked/readonly.
8. ListView como layer panel: barra azul solo en selected.
9. ResultsPanel reubicado fuera de canvas/zoom.

No uses setTimeout, z-index arbitrario ni !important nuevo.
No muestres controles sin persistencia.
No agregues `as any` nuevo.

Entrega:
- diagnóstico corto;
- archivos modificados;
- funciones conectadas;
- funciones eliminadas/no usadas;
- tests ejecutados;
- riesgos pendientes.
``​`

---

## 6. Criterios de aceptación global

``​`txt
[ ] Cada control visible tiene propiedad real.
[ ] Cada propiedad visible persiste en schema.
[ ] Cada update pasa por vía centralizada.
[ ] Formato no corta inputs ni colores.
[ ] Ubicación y tamaño no corta X/Y/Ancho/Alto/Rotación.
[ ] Align/distribute funciona o muestra disabled reason.
[ ] Estado locked/readonly coincide en canvas, ListView y DetailView.
[ ] ListView funciona como panel de capas.
[ ] Resultados no tapa canvas/zoom/sidebars.
[ ] Secciones por schema son proporcionales.
[ ] Build, lint y E2E críticos pasan.
``​`
```

<a id="file-0096"></a>

### 0096 — `plan-post-codex-sisad-pdfme.md`

- **Lenguaje:** `markdown`
- **Líneas:** `2144`
- **Tamaño original:** `50.1 KB`
- **SHA1 corto:** `38f1a7cdf6`
- **Estado:** `completo`

```markdown
# Plan post-Codex — SISAD PDFME Designer

**Fecha:** 2026-07-12
**Proyecto:** `~/Documents/Taylor/frontend/prueba-plugin`
**Ruta de validación principal:** `http://localhost:5174/lab/multi-document-routing`
**Objetivo:** consolidar lo que Codex ya implementó y continuar con una hoja de ruta ordenada para mejorar sidebars, inspector, catálogo, propagación de color, comportamiento por schema, densidad visual y pruebas Playwright, sin tocar canvas, geometría ni generación PDF.

---

## 0. Resumen ejecutivo

Codex ya realizó una tercera pasada enfocada en **owner color** y **collapse parity** entre sidebars. Esa pasada dejó una base importante:

- Se creó `SidebarCollapseHandle` como componente compartido.
- `LeftSidebar` ya usa el handle compartido.
- `RightSidebar` ya no desaparece al colapsar; ahora conserva un rail compacto.
- Se reforzó la propagación de `ownerColor`, `userColor`, `recipientColor` y `__designer.*`.
- `PluginIcon` normaliza `stroke/fill` hacia `currentColor` para que el color activo no quede bloqueado por SVGs fijos.
- Se corrigieron labels de ayuda del inspector a `Ayuda del campo`.
- Se agregaron pruebas Playwright para paridad de collapse.
- Build, lint y specs críticas quedaron en verde.

La siguiente fase no debe repetir lo mismo. Debe enfocarse en:

1. Validar que lo hecho por Codex no introduzca regresiones visuales o semánticas.
2. Separar definitivamente `CatalogLayout` de `SidebarDensity`.
3. Compactar realmente el LeftSidebar sin romper `drag`, favoritos, recientes ni modos.
4. Normalizar el RightSidebar como inspector profesional por tipo de schema.
5. Corregir editor de opciones para `select`, `radioGroup` y `checkboxGroup`.
6. Eliminar acciones duplicadas y secciones vacías.
7. Garantizar que todo schema muestre solo funcionalidades proporcionales a su tipo.
8. Fortalecer Playwright por caso de uso real.

---

## 1. Estado actual detectado en la pasada de Codex

### 1.1 Cambios realizados por Codex

#### Owner color / schema tone

Archivos tocados:

``​`txt
src/sisad-pdfme/collaboration/schemaOwnershipAppearance.ts
src/sisad-pdfme/ui/components/Designer/shared/schemaTone.ts
src/sisad-pdfme/schemas/shared/fieldChrome.ts
src/sisad-pdfme/ui/components/Designer/PluginIcon.tsx
``​`

Cambios principales:

- `schemaOwnershipAppearance.ts` amplió las fuentes de color:

``​`txt
schema.ownerColor
schema.userColor
schema.recipientColor
schema.__designer.collaboration.recipientColor
schema.__designer.ownerColor
schema.__designer.recipientColor
fallback.actorColor
recipient.color
``​`

- `schemaTone.ts` ahora revisa más fuentes antes de caer en `borderColor`, `strokeColor` o `color`.
- `fieldChrome.ts` agregó `resolveSchemaOwnerStyleVars` para estandarizar variables CSS.
- `PluginIcon.tsx` normaliza SVGs del catálogo para que `stroke` y `fill` usen `currentColor`, salvo `none`, `transparent`, `url(...)` o `currentColor`.

#### Collapse parity

Archivos tocados:

``​`txt
src/sisad-pdfme/ui/components/Designer/shared/SidebarCollapseHandle.tsx
src/sisad-pdfme/ui/components/Designer/LeftSidebar.tsx
src/sisad-pdfme/ui/components/Designer/index.tsx
src/sisad-pdfme/ui/components/Designer/RightSidebar/RightSidebar.tsx
src/sisad-pdfme/ui/styles/sisad-pdfme-global.css
``​`

Cambios principales:

- Se creó `SidebarCollapseHandle` con props:

``​`ts
type SidebarCollapseHandleProps = {
  side: 'left' | 'right';
  expanded: boolean;
  presentation: 'docked' | 'overlay';
  density?: 'full' | 'comfortable' | 'compact' | 'mini';
  labelExpanded: string;
  labelCollapsed: string;
  onToggle: () => void;
  className?: string;
};
``​`

- `LeftSidebar` reemplazó su botón propio por `SidebarCollapseHandle`.
- `Designer/index.tsx` reemplazó el toggle derecho por `SidebarCollapseHandle`.
- `RightSidebar` introdujo:

``​`txt
data-sidebar-collapsed
data-right-sidebar-expanded
right-sidebar-collapsed-rail
right-sidebar-collapsed-rail-btn
``​`

- El CSS del botón izquierdo dejó de usar offset negativo:

``​`css
right: 0.5rem;
top: 0.875rem;
``​`

#### Inspector labels

Archivos tocados:

``​`txt
src/sisad-pdfme/schemas/propPanel/commonInspectorFields.ts
src/sisad-pdfme/schemas/signature/propPanel.ts
``​`

Cambio:

``​`txt
Texto de ayuda / Texto de ayuda (tooltip) → Ayuda del campo
``​`

#### Tests agregados o ejecutados

Archivo agregado:

``​`txt
tests/e2e/sidebar-collapse-parity.spec.ts
``​`

Specs ejecutadas:

``​`bash
npm run build
npm run lint
npx playwright test tests/e2e/schema-owner-color.spec.ts tests/e2e/left-sidebar-view-modes.spec.ts tests/e2e/schema-options-editor.spec.ts tests/e2e/schema-lock-state-consistency.spec.ts tests/e2e/sidebar-collapse-parity.spec.ts --project=chromium
npx playwright test tests/e2e/inspector-detailview-profiles.spec.ts --project=chromium
``​`

Resultado reportado:

``​`txt
build OK
lint OK
7 passed
3 passed
``​`

---

## 2. Restricciones que deben mantenerse

### 2.1 Archivos que NO deben tocarse en esta hoja de ruta

Esta línea de trabajo no debe modificar:

``​`txt
src/sisad-pdfme/ui/components/Designer/Canvas/**
src/sisad-pdfme/ui/components/Paper.tsx
src/sisad-pdfme/ui/components/Renderer.tsx salvo validación de variables ya existentes
src/sisad-pdfme/ui/components/Moveable*.tsx
src/sisad-pdfme/ui/components/Selecto*.tsx
src/sisad-pdfme/pdf-lib/**
src/sisad-pdfme/generator/**
src/sisad-pdfme/**/SnapshotAdapter*
``​`

### 2.2 Temas fuera de alcance

No mezclar esta hoja de ruta con:

``​`txt
- drag/drop profundo;
- coordenadas;
- zoom;
- no-overlap;
- generator/pdf-lib;
- externalForms;
- Uanataca/OneShot;
- StepOne;
- lógica de negocio de SISAD Web;
- refactor general del repository.
``​`

### 2.3 Regla de implementación

Cada fase debe cerrar con:

``​`bash
npm run build
npm run lint
npx playwright test <spec-relacionado> --project=chromium
``​`

Si una fase requiere tocar más de 6 archivos productivos, detenerse y dividirla en otra task-card.

---

## 3. Problemas residuales después de Codex

### 3.1 El worktree tiene cambios previos no controlados

Codex reportó:

``​`txt
D SEPARATION-CONTRACT.md
D plan-tailwind-completo-actualizado-sisad-pdfme.md
?? tests/e2e/sidebar-drag-scroll-guard.spec.ts
?? unificados/
``​`

Acción obligatoria:

``​`bash
git status --short
git diff --stat
git diff --name-only
``​`

Antes de continuar, clasificar cambios:

| Estado                  | Acción                           |
| ----------------------- | --------------------------------- |
| Cambios de esta fase    | mantener                          |
| Cambios previos útiles | mover a commit separado           |
| Cambios accidentales    | revertir                          |
| Archivos`unificados/` | revisar si son generados o basura |
| Docs eliminados         | confirmar si deben restaurarse    |

### 3.2 `SidebarCollapseHandle` todavía usa `title` nativo

Codex creó un componente compartido, pero mantiene:

``​`tsx
title={label}
``​`

Esto contradice el diagnóstico previo: los tooltips nativos negros cubren la UI y no son controlables.

Acción:

- Reemplazar `title` por `Tooltip` controlado o prop opcional.
- Si se decide mantener `title` por accesibilidad mínima, no usarlo en iconos que ya tengan tooltip visual.
- Mantener `aria-label` siempre.

### 3.3 El rail derecho funciona pero no está completamente alineado visualmente con el izquierdo

Codex dejó un rail compacto funcional, pero el mismo reporte indica que todavía falta afinar densidad y miniatura de tabs.

Acción:

- Sustituir el placeholder `RS` por icono contextual.
- Alinear tamaño, borde, radio, hover y active state con rail izquierdo.
- Evitar que el rail derecho parezca un componente distinto.

### 3.4 `CatalogLayout` y `SidebarDensity` siguen siendo conceptos mezclados

Aún debe resolverse el problema principal del LeftSidebar:

``​`ts
type CatalogLayout = 'list' | 'tiles' | 'icons';
type SidebarDensity = 'comfortable' | 'compact' | 'narrow';
``​`

La vista es elección del usuario. La densidad es respuesta al ancho. No se deben convertir mutuamente.

### 3.5 El selector de vista sigue siendo ambiguo

El ciclo `rich → compact → mini → rich` debe reemplazarse por control segmentado o menú explícito.

### 3.6 El catálogo mantiene superficies anidadas

Debe revisarse:

``​`txt
left-sidebar-plugin-wrap
Button
PluginIcon container
favorite button
``​`

La meta es una sola superficie interactiva por item.

### 3.7 Riesgo en `PluginIcon` al normalizar SVGs

La normalización de `stroke/fill` a `currentColor` es útil para owner color, pero debe validarse que no rompa iconos semánticos o multicolor en catálogo.

Acciones:

- Agregar tests visuales o snapshots de iconos críticos.
- Confirmar que approve/decline mantienen su color semántico cuando aplica.
- Confirmar que el catálogo sí toma `activeRecipientColor`.

### 3.8 Inspector todavía requiere limpieza por perfil de schema

Debe verificarse que cada schema muestre solo secciones útiles.

Problemas a evitar:

``​`txt
- Options en schemas sin opciones.
- Formato en schemas no visuales.
- Técnico abierto por defecto.
- Secciones vacías.
- Switches que requieren doble click.
- Editor de opciones que crea otro schema accidentalmente.
- Labels artificiales: Caja, Comportamiento, Datos conectados, Avanzado.
``​`

---

## 4. Hoja de ruta por fases

## Fase 0 — Congelar estado y separar cambios previos

### Objetivo

Evitar que la siguiente pasada mezcle cambios de Codex con cambios previos del worktree.

### Comandos

``​`bash
git status --short
git diff --stat
git diff --name-only
git diff -- src/sisad-pdfme/ui/components/Designer/shared/SidebarCollapseHandle.tsx
git diff -- src/sisad-pdfme/ui/components/Designer/RightSidebar/RightSidebar.tsx
git diff -- src/sisad-pdfme/ui/components/Designer/LeftSidebar.tsx
git diff -- src/sisad-pdfme/ui/components/Designer/index.tsx
git diff -- src/sisad-pdfme/ui/components/Designer/PluginIcon.tsx
git diff -- src/sisad-pdfme/collaboration/schemaOwnershipAppearance.ts
git diff -- src/sisad-pdfme/schemas/shared/fieldChrome.ts
git diff -- src/sisad-pdfme/ui/components/Designer/shared/schemaTone.ts
``​`

### Acciones

1. Crear un branch limpio si no existe:

``​`bash
git checkout -b chore/sisad-pdfme-post-codex-plan
``​`

2. Separar commits:

``​`txt
commit 1: owner color resolvers + PluginIcon
commit 2: SidebarCollapseHandle + LeftSidebar/RightSidebar parity
commit 3: inspector labels + tests
commit 4: documentación/plan
``​`

3. No continuar si hay archivos eliminados sin explicación:

``​`txt
SEPARATION-CONTRACT.md
plan-tailwind-completo-actualizado-sisad-pdfme.md
``​`

### Criterio de aceptación

- `git status --short` entendido y documentado.
- No hay cambios accidentales mezclados con la siguiente fase.
- Existe una lista de archivos previos no tocados.

---

## Fase 1 — Validar y endurecer owner color

### Objetivo

Asegurar que todos los schemas consuman el mismo contrato de color del usuario/destinatario sin confundirlo con color semántico.

### Archivos a revisar

``​`txt
src/sisad-pdfme/collaboration/schemaOwnershipAppearance.ts
src/sisad-pdfme/ui/components/Designer/shared/schemaTone.ts
src/sisad-pdfme/schemas/shared/fieldChrome.ts
src/sisad-pdfme/ui/components/Designer/PluginIcon.tsx
src/sisad-pdfme/ui/components/Renderer.tsx
src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/Item.tsx
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailHeaderCard.tsx
src/sisad-pdfme/schemas/**/index.ts
src/sisad-pdfme/schemas/actions/*.ts
src/sisad-pdfme/schemas/signature/*.ts
src/sisad-pdfme/schemas/options/*.ts
``​`

### Fuente de verdad

Usar un solo orden:

``​`txt
1. schema.ownerColor
2. schema.userColor
3. schema.recipientColor
4. schema.__designer?.collaboration?.recipientColor
5. schema.__designer?.ownerColor
6. schema.__designer?.recipientColor
7. fallback.actorColor / activeRecipientColor
8. recipient.color
9. #2563EB
``​`

### Acciones

1. Revisar si existen resolvers paralelos:

``​`bash
rg "ownerColor|userColor|recipientColor|__designer.*recipientColor|resolveSchemaOwner|schemaTone|schema-owner-color|--schema-owner-color" src/sisad-pdfme
``​`

2. Eliminar o redirigir helpers duplicados hacia el facade central.
3. Asegurar que `resolveSchemaOwnerStyleVars` retorne variables estables:

``​`ts
{
  '--schema-owner-color': tone,
  '--schema-tone': tone,
  '--schema-border-tone': tone,
  '--schema-text-tone': tone,
}
``​`

4. Validar por schema:

| Schema         | Owner color               | Semantic color     | Reglas                                |
| -------------- | ------------------------- | ------------------ | ------------------------------------- |
| text           | borde, fondo sutil, label | ninguno            | debe heredar owner tone               |
| number         | borde, fondo sutil, label | ninguno            | debe heredar owner tone               |
| select         | borde, chevron/focus      | ninguno            | no usar color fijo                    |
| checkbox       | borde/indicador           | check visual       | owner tone en contorno/chrome         |
| checkboxGroup  | root/borde/indicadores    | selección interna | opciones no son schemas               |
| radioGroup     | root/borde/indicadores    | punto seleccionado | opciones no son schemas               |
| signature      | borde/placeholder         | firma/provider     | no hardcodear provider                |
| initials       | borde/placeholder         | firma/provider     | mismo contrato que signature          |
| dateSigned     | borde/texto               | fecha automática  | readOnly                              |
| approve        | owner accent externo      | verde              | no reemplazar verde                   |
| decline        | owner accent externo      | rojo               | no reemplazar rojo                    |
| attachment     | owner accent/borde        | icono archivo      | reglas archivo aparte                 |
| note           | owner accent/borde        | color informativo  | no mezclar con comentario             |
| image/svg      | selección/borde          | contenido visual   | no recolorear imagen                  |
| barcode/qr     | selección/borde          | barras/código     | color del código es propiedad propia |
| table          | selección/borde          | estilo tabla       | owner solo chrome                     |
| rectangle/line | selección/borde          | forma visual       | color de forma separado               |

### Tests

Actualizar o crear:

``​`txt
tests/e2e/schema-owner-color.spec.ts
``​`

Casos mínimos:

``​`txt
- Usuario A crea text, checkbox, checkboxGroup, radioGroup, select, signature, initials, approve, decline, attachment, note.
- Cambiar a Usuario B.
- Los schemas existentes conservan color A.
- Schema nuevo usa color B.
- Canvas wrapper, ListView item y DetailHeader muestran el mismo owner color.
- approve/decline mantienen verde/rojo semántico, pero owner accent coincide.
``​`

Comandos:

``​`bash
npm run build
npm run lint
npx playwright test tests/e2e/schema-owner-color.spec.ts --project=chromium
``​`

---

## Fase 2 — Corregir `PluginIcon` con política segura de color

### Objetivo

Evitar que iconos del catálogo bloqueen el color del destinatario sin romper iconos semánticos o multicolor.

### Problema

Codex normalizó `stroke/fill` a `currentColor`. Es correcto para la mayoría del catálogo, pero puede ser peligroso para iconos que usan colores semánticos.

### Acciones

1. Crear una política explícita:

``​`ts
type PluginIconColorMode = 'owner' | 'semantic' | 'original';
``​`

2. Para catálogo de schemas estándar usar:

``​`txt
owner
``​`

3. Para iconos semánticos de acciones usar:

``​`txt
semantic
``​`

4. Para SVGs externos o imágenes usar:

``​`txt
original
``​`

5. Evitar normalización global sin perfil.

### Archivos candidatos

``​`txt
src/sisad-pdfme/ui/components/Designer/PluginIcon.tsx
src/sisad-pdfme/schemas/schemaFamilies.ts
src/sisad-pdfme/schemas/**/index.ts
src/sisad-pdfme/ui/components/Designer/LeftSidebar.tsx
``​`

### Tests

Agregar en `left-sidebar-view-modes.spec.ts`:

``​`txt
- iconos del catálogo cambian con activeRecipientColor.
- approve/decline conservan semántica cuando el schema lo requiere.
- SVG con fill="none" no se rompe.
- SVG con url(...) no se transforma.
``​`

---

## Fase 3 — Unificar definitivamente collapse de sidebars

### Objetivo

Completar lo iniciado por Codex: ambos laterales deben compartir comportamiento, diseño, accesibilidad y modo rail.

### Estado actual

Codex ya creó:

``​`txt
SidebarCollapseHandle
LeftSidebar usa handle
RightSidebar usa handle
RightSidebar colapsado muestra rail
``​`

### Pendientes

#### 3.1 Eliminar `title` nativo del handle

Archivo:

``​`txt
src/sisad-pdfme/ui/components/Designer/shared/SidebarCollapseHandle.tsx
``​`

Cambiar:

``​`tsx
title={label}
``​`

Por una estrategia controlada:

``​`tsx
<Tooltip title={label} placement={side === 'left' ? 'right' : 'left'}>
  <button ... />
</Tooltip>
``​`

Si no se desea Ant Design aquí, crear:

``​`txt
SidebarTooltip
``​`

pero mantenerlo genérico.

#### 3.2 Normalizar rail izquierdo y derecho

Crear contrato:

``​`ts
type SidebarRailItem = {
  key: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  disabled?: boolean;
  badge?: number | string;
  onClick: () => void;
};
``​`

Crear componente compartido:

``​`txt
src/sisad-pdfme/ui/components/Designer/shared/SidebarRail.tsx
``​`

Usar para:

``​`txt
LeftSidebar collapsed rail
RightSidebar collapsed rail
``​`

#### 3.3 Reemplazar placeholder `RS`

El rail derecho no debe mostrar `RS`. Debe mostrar el modo activo:

``​`txt
Campos
Propiedades
Comentarios
Documentos
``​`

con iconos y tooltips.

#### 3.4 Alinear atributos

Ambos sidebars deben exponer:

``​`txt
data-sidebar-side="left|right"
data-sidebar-expanded="true|false"
data-sidebar-collapsed="true|false"
data-sidebar-density="comfortable|compact|narrow"
data-sidebar-presentation="docked|overlay"
aria-expanded="true|false"
``​`

### Archivos a modificar

``​`txt
src/sisad-pdfme/ui/components/Designer/shared/SidebarCollapseHandle.tsx
src/sisad-pdfme/ui/components/Designer/shared/SidebarRail.tsx
src/sisad-pdfme/ui/components/Designer/LeftSidebar.tsx
src/sisad-pdfme/ui/components/Designer/RightSidebar/RightSidebar.tsx
src/sisad-pdfme/ui/components/Designer/index.tsx
src/sisad-pdfme/ui/styles/sisad-pdfme-global.css
``​`

### Tests

Actualizar:

``​`txt
tests/e2e/sidebar-collapse-parity.spec.ts
``​`

Casos:

``​`txt
- LeftSidebar expandido muestra handle completo y no cortado.
- LeftSidebar colapsado muestra rail y handle.
- RightSidebar expandido muestra handle equivalente.
- RightSidebar colapsado muestra rail, no desaparece totalmente.
- Ambos tienen aria-expanded correcto.
- No existen tooltips nativos negros por title.
- No hay overflow horizontal.
- El canvas sigue visible.
- El rail derecho permite reabrir modo fields/detail/comments/docs.
``​`

---

## Fase 4 — Separar `CatalogLayout` de `SidebarDensity`

### Objetivo

Resolver la causa raíz del LeftSidebar: los nombres actuales mezclan vista, densidad y ancho.

### Problema actual

Conceptos mezclados:

``​`txt
CatalogViewMode: rich | compact | mini
Densidad: full | comfortable | compact | mini
Ancho real del sidebar
``​`

Mapeo real:

``​`txt
rich    → list
compact → tiles
mini    → icons
``​`

### Nuevo contrato

``​`ts
export type CatalogLayout = 'list' | 'tiles' | 'icons';
export type SidebarDensity = 'comfortable' | 'compact' | 'narrow';
``​`

### Reglas

`CatalogLayout` define:

``​`txt
list   → fila horizontal con icono + texto
tiles  → tarjeta compacta con icono arriba + texto
icons  → solo iconos
``​`

`SidebarDensity` define:

``​`txt
comfortable → padding/gap mayor
compact     → padding/gap medio
narrow      → padding/gap mínimo
``​`

La densidad nunca debe cambiar:

``​`txt
- orientación;
- visibilidad del texto;
- número semántico de columnas;
- significado del tooltip;
- selección del usuario.
``​`

### Acciones

1. Crear alias de compatibilidad temporal:

``​`ts
type LegacyCatalogViewMode = 'rich' | 'compact' | 'mini';

function normalizeCatalogLayout(value: LegacyCatalogViewMode | CatalogLayout): CatalogLayout {
  if (value === 'rich') return 'list';
  if (value === 'compact') return 'tiles';
  if (value === 'mini') return 'icons';
  return value;
}
``​`

2. Reemplazar `viewMode` interno por `catalogLayout`.
3. Mantener compatibilidad de props públicas durante una fase:

``​`txt
viewMode deprecated
catalogLayout recomendado
``​`

4. Persistir la elección:

``​`txt
sisad-pdfme:catalog-layout
``​`

5. No persistir densidad.

### Archivos candidatos

``​`txt
src/sisad-pdfme/ui/components/Designer/LeftSidebar.tsx
src/sisad-pdfme/ui/components/Designer/SidebarButtons.tsx
src/sisad-pdfme/ui/components/Designer/LeftSidebarGroup.tsx
src/sisad-pdfme/ui/components/Designer/types.ts
src/sisad-pdfme/ui/styles/sisad-pdfme-sidebar.css
src/sisad-pdfme/ui/styles/sisad-pdfme-global.css
src/styles/sisad-tailwind-bridge.css
``​`

### CSS a eliminar o transformar

Buscar:

``​`bash
rg "data-view-mode|left-sidebar-density|compact|mini|rich" src/sisad-pdfme/ui/styles src/styles/sisad-tailwind-bridge.css
``​`

Eliminar reglas como:

``​`css
[data-left-sidebar-density='mini'] [data-view-mode='compact'] {
  grid-template-columns: minmax(0, 1fr);
}
``​`

### Tests

Actualizar:

``​`txt
tests/e2e/left-sidebar-view-modes.spec.ts
``​`

Casos:

``​`txt
- list mantiene filas horizontales en density comfortable/compact/narrow.
- tiles mantiene tarjetas en dos columnas cuando hay ancho suficiente.
- icons mantiene solo iconos.
- resize no cambia layout elegido por el usuario.
- density solo cambia spacing, no orientación.
``​`

---

## Fase 5 — Rediseñar selector de vista del catálogo

### Objetivo

Eliminar el botón cíclico ambiguo.

### Estado actual

Hay un botón que cambia:

``​`txt
rich → compact → mini → rich
``​`

y muestra el icono de la próxima vista, no la actual.

### Nuevo diseño

Control segmentado:

``​`txt
[Lista] [Tarjetas] [Iconos]
``​`

En UI compacta:

``​`txt
[≡] [▦] [⠿]
``​`

con tooltip controlado.

### Acciones

1. Crear componente:

``​`txt
src/sisad-pdfme/ui/components/Designer/shared/CatalogLayoutToggle.tsx
``​`

Props:

``​`ts
type CatalogLayoutToggleProps = {
  value: CatalogLayout;
  onChange: (layout: CatalogLayout) => void;
  density: SidebarDensity;
};
``​`

2. Reemplazar botón cíclico en `LeftSidebar`.
3. Eliminar `title` nativo.
4. Usar `aria-pressed` por botón.
5. Soportar teclado con flechas.

### Tests

``​`txt
- Click en Lista cambia a list.
- Click en Tarjetas cambia a tiles.
- Click en Iconos cambia a icons.
- La vista seleccionada se conserva tras resize.
- La vista seleccionada se conserva al colapsar/expandir sidebar.
``​`

---

## Fase 6 — Compactar LeftSidebar sin perder funciones

### Objetivo

Hacer el catálogo más compacto, predecible y consistente con estilo tipo DocuSign/Wix, usando Tailwind/bridge existente.

### Problemas actuales

``​`txt
- Header alto.
- Tabs sin texto pero con tooltips nativos.
- Filtros grandes.
- Categorías como tarjetas pesadas.
- Items con superficie dentro de superficie.
- Favoritos duplicados.
- Resultados flotante invade el catálogo.
``​`

### Nuevo layout del header

Altura objetivo: `124–140px`.

``​`txt
Fila 1: Campos · ● Cliente principal                    [collapse]
Fila 2: [Estándar] [Personalizados] [Prefill]
Fila 3: Buscar campo...
Fila 4: Todos | ★ Favoritos | Recientes                 [Vista]
``​`

### Diseño de `list`

``​`txt
Altura: 36–40 px
Icono: 20–22 px
Gap: 8 px
Padding horizontal: 8–10 px
Label: 11.5–12 px
Sombra: ninguna
Borde: hover/active solamente
``​`

### Diseño de `tiles`

``​`txt
Altura: 52–58 px
Columnas: auto-fill minmax(96px, 1fr) o 2 columnas según ancho
Icono: 22–24 px
Label: una línea
Padding: 6–8 px
Sin card interna del icono
``​`

### Diseño de `icons`

``​`txt
Botón: 38–42 px
Icono: 18–22 px
Grid: repeat(auto-fill, minmax(38px, 1fr))
Gap: 5–6 px
Tooltip obligatorio
Sin estrella flotante
``​`

### Acciones por componente

#### `LeftSidebarGroup`

- Añadir chevron visible.
- Reducir padding del header.
- Eliminar card pesada en modo icons.
- Mantener contador compacto.

#### `SidebarButtons` / item del catálogo

- Una sola superficie visible.
- Wrapper sin fondo/borde/sombra.
- Button controla hover/focus/drag.
- `PluginIcon` sin tarjeta interna.
- Favorito integrado según layout:
  - list: estrella al final.
  - tiles: visible en hover o si activo.
  - icons: oculto o en menú contextual.

#### Filtros

Cambiar:

``​`txt
Todos, Favoritos (0), Recientes (1)
``​`

por:

``​`txt
Todos | ★ 0 | Recientes 1
``​`

### Archivos candidatos

``​`txt
src/sisad-pdfme/ui/components/Designer/LeftSidebar.tsx
src/sisad-pdfme/ui/components/Designer/LeftSidebarGroup.tsx
src/sisad-pdfme/ui/components/Designer/SidebarButtons.tsx
src/sisad-pdfme/ui/components/Designer/PluginIcon.tsx
src/sisad-pdfme/ui/styles/sisad-pdfme-sidebar.css
src/sisad-pdfme/ui/styles/sisad-pdfme-global.css
src/styles/sisad-tailwind-bridge.css
``​`

### Tests

``​`txt
- list muestra al menos 14 items en 700px útiles.
- tiles muestra 10–14 items.
- icons muestra 24–36 items.
- favoritos funciona igual en los tres layouts.
- recientes no queda colapsado accidentalmente.
- drag bloquea scroll del sidebar durante arrastre.
``​`

---

## Fase 7 — Corregir inserción por click/double click del catálogo

### Objetivo

Evitar inserciones duplicadas de schemas.

### Problema

Si `onClick` y `onDoubleClick` ejecutan `onSchemaClick`, el navegador puede disparar:

``​`txt
click
click
dblclick
``​`

Resultado posible: 2 o 3 schemas creados.

### Decisión recomendada

Contrato simple:

``​`txt
Click simple: insertar una vez
Drag: colocar con precisión
Doble click: sin acción adicional
``​`

### Acciones

1. Buscar handlers duplicados:

``​`bash
rg "onDoubleClick|onClick.*onSchemaClick|onSchemaClick" src/sisad-pdfme/ui/components/Designer
``​`

2. Eliminar `onDoubleClick` si duplica inserción.
3. Si se mantiene doble click, implementar guard:

``​`ts
const clickGuard = useRef<number | null>(null);
``​`

pero preferir no hacerlo.

4. Agregar telemetría opcional solo en dev para detectar doble inserción.

### Tests

``​`txt
- doble click sobre item del catálogo crea solo un schema.
- click simple crea solo un schema.
- drag crea un schema en coordenada esperada.
``​`

---

## Fase 8 — Reubicar “Resultados · Colapsado”

### Objetivo

Evitar que el panel de resultados tape el LeftSidebar o el canvas.

### Problema

Está fijado al viewport con:

``​`txt
position: fixed
bottom: 12px
left: 12px
z-index: 70
``​`

### Opciones

#### Opción A — Barra inferior del laboratorio

``​`txt
Resultados 0 · Sin errores · Última validación: OK
``​`

#### Opción B — Pill dentro del canvas workspace

Anclado al workspace, no al viewport.

#### Opción C — Drawer inferior

Se abre solo cuando hay resultados, warnings o errores.

### Recomendación

Implementar Opción A para laboratorio y Opción C para producción si aplica.

### Archivos a buscar

``​`bash
rg "Resultados|Colapsado|results|collapsed|bottom: 12|z-index: 70" src tests
``​`

### Tests

``​`txt
- Resultados no tapa últimos items del LeftSidebar.
- Resultados no tapa zoom toolbar.
- Resultados no genera overflow horizontal.
``​`

---

## Fase 9 — Inspector: taxonomía final por tipo de schema

### Objetivo

El DetailView debe mostrar solo lo que corresponde al tipo de schema, sin duplicidades ni secciones vacías.

### Labels oficiales

| Key               | Label visible          | Contenido                             |
| ----------------- | ---------------------- | ------------------------------------- |
| `identity`      | Información del campo | nombre, tipo, label visible           |
| `content`       | Contenido              | valor/texto principal                 |
| `options`       | Opciones               | select/radio/checkboxGroup            |
| `validation`    | Reglas de llenado      | requerido, validación, mensaje error |
| `fileRules`     | Reglas del archivo     | max files, tipos, tamaño, reemplazo  |
| `signature`     | Firma                  | tipo/proveedor si aplica              |
| `action`        | Acción                | approve/decline/note actions          |
| `behavior`      | Interacción           | readonly, hidden, editable            |
| `box`           | Ubicación y tamaño   | x, y, ancho, alto, rotación          |
| `appearance`    | Formato                | font, color, opacity                  |
| `dataBindings`  | Datos y conexiones     | fieldKey, API, JSON, persistencia     |
| `comments`      | Comentarios            | comentarios del campo                 |
| `collaboration` | Asignación y acceso   | owner, lock, permisos                 |
| `advanced`      | Técnico               | IDs y metadata debug                  |

### Labels prohibidos

| Evitar              | Usar                                             |
| ------------------- | ------------------------------------------------ |
| Caja                | Ubicación y tamaño                             |
| Comportamiento      | Interacción                                     |
| Validación         | Reglas de llenado                                |
| Avanzado            | Técnico                                         |
| Datos conectados    | Datos y conexiones                               |
| Colaboración       | Asignación y acceso                             |
| Bloqueado genérico | En edición / Bloqueado por / Bloquear posición |

### Política de secciones vacías

Crear o reforzar:

``​`ts
export function shouldRenderDetailSection(
  section: InspectorSectionKey,
  profile: InspectorProfile,
  schema: SchemaForUI,
  context: InspectorContext,
): boolean;
``​`

Reglas:

``​`txt
- No renderizar sección sin widgets visibles.
- No renderizar sección con solo guiones o placeholders.
- Técnico colapsado por defecto.
- Datos y conexiones oculto si no hay configuración ni soporte.
- Formato oculto si no hay propiedades visuales reales.
- Opciones oculto si el schema no soporta opciones.
``​`

### Perfiles por schema

#### `text`

Secciones:

``​`txt
identity
content
validation
behavior
box
appearance
dataBindings
comments
collaboration
advanced
``​`

Abiertas por defecto:

``​`txt
identity
content
validation
``​`

#### `number`

Secciones:

``​`txt
identity
content
validation
numberFormat
behavior
box
appearance
dataBindings
collaboration
advanced
``​`

#### `select`

Secciones:

``​`txt
identity
options
validation
behavior
box
appearance
dataBindings
collaboration
advanced
``​`

Abiertas por defecto:

``​`txt
identity
options
``​`

#### `checkbox`

Secciones:

``​`txt
identity
validation
behavior
box
appearance
collaboration
advanced
``​`

No mostrar `options`.

#### `checkboxGroup`

Secciones:

``​`txt
identity
options
validation
behavior
box
appearance
collaboration
advanced
``​`

Abiertas por defecto:

``​`txt
identity
options
``​`

#### `radioGroup`

Igual a `checkboxGroup`, pero selección única.

#### `signature`

Secciones:

``​`txt
identity
signature
behavior
box
appearance
dataBindings
comments
collaboration
advanced
``​`

No mostrar `options`.

#### `initials`

Mismo perfil que signature, con `signatureKind = initials`.

#### `dateSigned`

``​`txt
identity
content/date format
box
appearance
dataBindings
collaboration
advanced
``​`

Debe ser readOnly.

#### `attachment`

``​`txt
identity
fileRules
behavior
box
appearance
dataBindings
comments
collaboration
advanced
``​`

#### `approve` / `decline`

``​`txt
identity
action
behavior
box
appearance
dataBindings
collaboration
advanced
``​`

Designer no ejecuta acción; solo representa.

#### `note`

``​`txt
identity
content
behavior
box
appearance
comments
collaboration
advanced
``​`

#### `image` / `svg`

``​`txt
identity
media
box
appearance
collaboration
advanced
``​`

#### `barcode` / `qr`

``​`txt
identity
code
box
appearance
dataBindings
collaboration
advanced
``​`

#### `table`

``​`txt
identity
table
box
appearance
dataBindings
collaboration
advanced
``​`

### Archivos candidatos

``​`txt
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailSchemas.ts
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailSectionTaxonomy.ts
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/schemaDisplayInfo.ts
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/schemaInteractionState.ts
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailViewContent.tsx
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailHeaderCard.tsx
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/widgets/*.tsx
src/sisad-pdfme/schemas/**/propPanel.ts
``​`

### Tests

``​`txt
tests/e2e/inspector-detailview-profiles.spec.ts
``​`

Casos:

``​`txt
- text no muestra options.
- select muestra options principal.
- checkbox individual no muestra options.
- checkboxGroup muestra options y selection rules.
- radioGroup muestra options y selección única.
- signature muestra signature y no options.
- attachment muestra fileRules.
- approve/decline muestra action.
- no hay secciones vacías.
- Técnico siempre colapsado por defecto.
``​`

---

## Fase 10 — Corregir editor de opciones

### Objetivo

Evitar que al agregar opciones se cree accidentalmente un schema de imagen, firma u otro tipo.

### Problema reportado

En el inspector, al agregar una opción nueva, por alguna razón se crea un schema de imagen o firma. Esto indica conflicto de eventos, foco, submit o command bus.

### Archivos candidatos

``​`txt
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/widgets/InspectorOptionEditor.tsx
src/sisad-pdfme/schemas/options/optionModel.ts
src/sisad-pdfme/schemas/options/optionSelectionBehavior.ts
src/sisad-pdfme/schemas/options/optionValueAdapter.ts
src/sisad-pdfme/schemas/select/index.ts
src/sisad-pdfme/schemas/checkboxGroup/index.ts
src/sisad-pdfme/schemas/radioGroup/index.ts
src/sisad-pdfme/ui/components/Designer/commandBus*
``​`

### Diagnóstico técnico

Buscar:

``​`bash
rg "Agregar opción|addOption|options|onSubmit|preventDefault|stopPropagation|command|insertSchema|createSchema|onKeyDown" src/sisad-pdfme
``​`

Hipótesis:

1. Botón dentro de `<form>` sin `type="button"` dispara submit.
2. `Enter` en input burbujea y activa handler global de inserción.
3. El editor comparte `onSchemaClick` o command de catálogo.
4. El foco queda en catálogo izquierdo y no en inspector.
5. `onKeyDown` global interpreta tecla como shortcut.

### Reglas de corrección

``​`tsx
<button type="button" ...>
``​`

En acciones internas del option editor:

``​`ts
event.preventDefault();
event.stopPropagation();
``​`

Solo si se confirma que el evento burbujea al canvas/command bus.

### Contrato de datos

``​`ts
type SchemaOption = {
  id: string;
  optionId?: string;
  label: string;
  value: string;
  disabled?: boolean;
  order?: number;
};
``​`

### Reglas por tipo

``​`txt
select:
- selectedValue/defaultValue
- una opción activa por valor

radioGroup:
- selectedOptionId/defaultSelectedOptionId
- selección única

checkboxGroup:
- selectedOptionIds/defaultSelectedOptionIds
- selección múltiple
``​`

### Tests

``​`txt
tests/e2e/schema-options-editor.spec.ts
``​`

Casos:

``​`txt
- agregar opción en select no crea schema nuevo.
- agregar opción en radioGroup no crea schema nuevo.
- agregar opción en checkboxGroup no crea schema nuevo.
- eliminar opción no elimina schema root.
- renombrar opción actualiza canvas/form/viewer.
- reordenar opción conserva ids.
- Enter en input no inserta schema.
- Botón Agregar opción tiene type button.
``​`

---

## Fase 11 — Switches de inspector con un solo click

### Objetivo

Corregir switches que a veces requieren doble click.

### Hipótesis

``​`txt
- Overlay/pointer-events sobre el switch.
- Label capturando evento y luego switch lo recibe en segundo click.
- Remount del DetailView reseteando estado local.
- onChange actualiza schema pero el componente vuelve a montar con valor anterior.
- Switch mezclando checked/defaultChecked.
``​`

### Archivos candidatos

``​`txt
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/widgets/InspectorSwitch.tsx
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/widgets/InspectorField.tsx
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailViewContent.tsx
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/schemaInteractionState.ts
``​`

### Acciones

1. Verificar controlled component:

``​`tsx
checked={Boolean(value)}
onChange={(next) => update(next)}
``​`

2. No usar `defaultChecked`.
3. No renderizar switch dentro de label si el label genera doble evento.
4. Agregar `data-testid` para switches críticos.
5. Verificar que no haya overlay absoluto encima.

### Tests

``​`txt
- solo lectura cambia con un click.
- obligatorio cambia con un click.
- mostrar nombre en attachment cambia con un click.
- reemplazo en attachment cambia con un click.
- checked en checkbox cambia con un click en Form y no en Designer si aplica.
``​`

---

## Fase 12 — Reducir duplicidad de acciones entre toolbar, context menu e inspector

### Objetivo

Cada acción debe vivir en un lugar claro.

### Regla de ownership de acciones

| Acción                       | Lugar principal               | También permitido                    |
| ----------------------------- | ----------------------------- | ------------------------------------- |
| Eliminar                      | toolbar/context menu          | inspector footer si hay confirmación |
| Duplicar                      | toolbar/context menu          | lista campos menú fila               |
| Agregar comentario            | context menu / comments panel | toolbar si schema seleccionado        |
| Bloquear                      | Asignación y acceso          | context menu rápido                  |
| Ocultar                       | Interacción                  | context menu rápido                  |
| Traer al frente/enviar atrás | context menu                  | toolbar si multiselect                |
| Renombrar campo               | Información del campo        | lista de campos                       |
| Editar opciones               | Opciones                      | no en canvas                          |
| Configurar archivo            | Reglas del archivo            | no en canvas                          |
| Configurar firma              | Firma                         | no en canvas                          |

### Acciones

1. Auditar duplicidades:

``​`bash
rg "Eliminar|Duplicar|Agregar comentario|Bloquear|Ocultar|Traer al frente|Enviar atrás|Renombrar|Abrir propiedades" src/sisad-pdfme/ui/components/Designer
``​`

2. Crear mapa central:

``​`ts
type SchemaActionKey =
  | 'delete'
  | 'duplicate'
  | 'comment'
  | 'lock'
  | 'hide'
  | 'bringForward'
  | 'sendBackward'
  | 'rename'
  | 'openProperties';
``​`

3. Deshabilitar acciones si schema está bloqueado por otro usuario.
4. El inspector no debe duplicar botones rápidos salvo que cambien configuración persistente.

### Tests

``​`txt
- schema bloqueado por otro usuario no permite eliminar ni mover.
- schema bloqueado por mí permite editar si política lo permite.
- toolbar y context menu reflejan mismo disabled state.
- inspector muestra estado coherente.
``​`

---

## Fase 13 — Comentarios con coordenadas y anclas tipo Office/PDF

### Objetivo

Implementar comentarios anclados a coordenadas del PDF y a schemas, mostrando ícono lateral según la posición.

### Estado de contexto

Ya existen módulos de comentarios/anclas en core:

``​`txt
src/sisad-pdfme/comments/index.ts
src/sisad-pdfme/common/comments.ts
``​`

Se debe usar esa capa core, no inventar otra estructura.

### Contrato funcional

Cuando el usuario hace click en `Agregar comentario`:

1. Capturar coordenada del click en sistema del documento:

``​`txt
documentId
pageNumber
x
y
schemaUid opcional
``​`

2. Crear comentario top-level o de schema:

``​`ts
createSchemaComment(text, identity, overrides)
createSchemaCommentAnchor(anchor, identity)
``​`

3. Mostrar ícono lateral junto al PDF, alineado verticalmente con `y`.
4. Al hacer click en el ícono, abrir hilo del comentario.
5. Permitir mover ancla.
6. Permitir resolver/reabrir.
7. Guardar en snapshot.

### Archivos candidatos

``​`txt
src/sisad-pdfme/comments/index.ts
src/sisad-pdfme/common/comments.ts
src/sisad-pdfme/ui/components/Designer/RightSidebar/CommentsRail.tsx
src/sisad-pdfme/ui/components/Designer/Canvas/overlays/*Comment*.tsx
src/sisad-pdfme/ui/components/Designer/contextMenu*
src/sisad-pdfme/ui/components/Designer/shared/designerCoordinateService.ts
``​`

### Reglas de seguridad

- No usar coordenadas viewport como fuente final.
- Convertir a coordenadas del documento/página.
- Preservar `documentId`, `pageNumber`, `schemaUid`.
- No guardar comentarios dentro de `formData`.
- No mezclar comentarios con schemas.

### Tests

``​`txt
tests/e2e/schema-comments-anchors.spec.ts
``​`

Casos:

``​`txt
- click derecho/agregar comentario guarda documentId/pageNumber/x/y.
- ícono lateral aparece en la página correcta.
- click en ícono abre comentario.
- mover comentario actualiza x/y.
- comentario asociado a schema aparece en CommentsRail.
- resolver comentario cambia estado.
- snapshot round-trip conserva comentarios.
``​`

---

## Fase 14 — Modal de campos personalizados

### Objetivo

No mostrar controles que no persisten y reducir densidad visual.

### Problema

`CustomFieldDef` contiene muchas propiedades, pero `createSchemaFromCustomField` solo copia algunas. Esto rompe confianza.

### Regla inmediata

``​`txt
No mostrar controles que no persisten.
``​`

### Acciones

1. Buscar definición:

``​`bash
rg "CustomFieldDef|createSchemaFromCustomField|custom field|Campo personalizado|Guardar campo" src/sisad-pdfme src
``​`

2. Crear matriz:

| Control visible | Se guarda en schema | Se guarda en __designer | Se usa en Form | Se usa en Viewer/PDF |
| --------------- | ------------------- | ----------------------- | -------------- | -------------------- |
| font            | pendiente           | pendiente               | pendiente      | pendiente            |
| validation      | pendiente           | pendiente               | pendiente      | pendiente            |
| helpText        | pendiente           | pendiente               | pendiente      | pendiente            |
| collaborative   | pendiente           | pendiente               | pendiente      | pendiente            |

3. Ocultar controles no persistidos.
4. Agregar `defaultSchema` para controles reales.
5. Reducir modal:

``​`txt
Header: 48px
Footer sticky: 52px
Body scroll interno
Secciones con divisores, no cards anidadas
Inputs 32–34px
Labels 11–12px
``​`

### Tests

``​`txt
- crear campo personalizado text con font/color/validation si están visibles.
- guardar y volver a abrir conserva valores.
- crear select/radioGroup permite options[].
- controles ocultos no aparecen si no persisten.
``​`

---

## Fase 15 — Refactor CSS/Tailwind controlado

### Objetivo

Reducir colisiones entre:

``​`txt
sisad-pdfme-global.css
sisad-pdfme-sidebar.css
sisad-tailwind-bridge.css
``​`

### Reglas

- No crear CSS disperso.
- Preferir Tailwind en JSX para nuevos componentes.
- CSS solo para:
  - tokens globales;
  - estados complejos data-attributes;
  - compat legacy;
  - estilos que Tailwind no puede expresar bien.
- No usar `!important` nuevo salvo justificación.
- No tocar `.moveable-*` ni `.selecto-*`.

### Acciones

1. Inventario:

``​`bash
rg "left-sidebar|right-sidebar|detail-view|schema-owner|catalog|data-view-mode|data-left-sidebar-density|sidebar-toggle" src/sisad-pdfme/ui/styles src/styles/sisad-tailwind-bridge.css
``​`

2. Clasificar reglas:

| Regla | Mantener | Migrar a Tailwind | Eliminar | Motivo |
| ----- | -------- | ----------------- | -------- | ------ |

3. Mover diseños nuevos de sidebars a componentes con Tailwind.
4. Dejar CSS únicamente para transiciones y data states.

### Tests visuales

``​`txt
- laboratorio y SISAD Web se ven consistentes.
- no hay colisión de line-height/font-size en catálogo.
- no hay overflow horizontal.
- botones del inspector conservan tamaño.
``​`

---

## 5. Plan de commits recomendado

### Commit 1

``​`txt
refactor(theme): consolidate schema owner tone resolution
``​`

Incluye:

``​`txt
schemaOwnershipAppearance.ts
schemaTone.ts
fieldChrome.ts
PluginIcon.tsx
schema-owner-color.spec.ts
``​`

### Commit 2

``​`txt
refactor(sidebars): share collapse handle and right rail behavior
``​`

Incluye:

``​`txt
SidebarCollapseHandle.tsx
SidebarRail.tsx si se crea
LeftSidebar.tsx
RightSidebar.tsx
Designer/index.tsx
sidebar-collapse-parity.spec.ts
``​`

### Commit 3

``​`txt
refactor(catalog): separate layout from responsive density
``​`

Incluye:

``​`txt
CatalogLayout types
LeftSidebar.tsx
SidebarButtons.tsx
LeftSidebarGroup.tsx
CSS relacionado
left-sidebar-view-modes.spec.ts
``​`

### Commit 4

``​`txt
fix(catalog): prevent duplicate insertions on double click
``​`

Incluye:

``​`txt
SidebarButtons.tsx
left-sidebar-view-modes.spec.ts o catalog-insertion.spec.ts
``​`

### Commit 5

``​`txt
refactor(inspector): apply schema-specific detail profiles
``​`

Incluye:

``​`txt
detailSchemas.ts
detailSectionTaxonomy.ts
DetailViewContent.tsx
widgets
inspector-detailview-profiles.spec.ts
``​`

### Commit 6

``​`txt
fix(options): isolate option editor events from schema insertion
``​`

Incluye:

``​`txt
InspectorOptionEditor.tsx
optionModel.ts
optionValueAdapter.ts
schema-options-editor.spec.ts
``​`

### Commit 7

``​`txt
feat(comments): add coordinate-based comment anchors
``​`

Incluye:

``​`txt
comments core
comments overlay
CommentsRail
schema-comments-anchors.spec.ts
``​`

### Commit 8

``​`txt
docs(designer): document post-codex sidebar and inspector roadmap
``​`

Incluye:

``​`txt
.ai/task-cards/*
docs/03-designer/*
plan-post-codex-sisad-pdfme.md
``​`

---

## 6. Prompt recomendado para la siguiente sesión de Codex

``​`txt
Actúa como arquitecto frontend senior experto en React, TypeScript, Tailwind, pdfme, editores PDF tipo DocuSign/Wix, Moveable, Selecto, sidebars, inspector, command bus y Playwright.

Proyecto:
~/Documents/Taylor/frontend/prueba-plugin

Ruta principal:
http://localhost:5174/lab/multi-document-routing

Contexto:
Codex ya realizó una tercera pasada donde:
- creó SidebarCollapseHandle;
- conectó LeftSidebar y RightSidebar al handle compartido;
- hizo que RightSidebar colapsado muestre rail compacto;
- amplió ownerColor/userColor/recipientColor/__designer.*;
- normalizó PluginIcon para currentColor;
- corrigió labels de ayuda del inspector;
- agregó sidebar-collapse-parity.spec.ts;
- build, lint y Playwright críticos quedaron OK.

Tu tarea NO es rehacer eso. Tu tarea es continuar desde ese estado y cerrar la siguiente fase definida en la task-card seleccionada.

Restricciones absolutas:
- No tocar Canvas/**.
- No tocar Moveable.
- No tocar Selecto.
- No tocar Paper.
- No tocar SnapshotAdapter.
- No tocar Generator ni pdf-lib.
- No tocar coordenadas, zoom, drag/drop profundo ni no-overlap.
- No tocar StepOne ni negocio SISAD Web.
- No introducir !important nuevo salvo justificación.
- No usar z-index arbitrario para tapar problemas.
- No crear CSS disperso; usar Tailwind/bridge existente.

Antes de modificar:
1. Ejecuta git status --short.
2. Revisa diff de archivos tocados por Codex.
3. Confirma que no hay cambios previos mezclados.
4. Escoge una sola fase/task-card.
5. No abras más de 8 archivos productivos.
6. No modifiques más de 6 archivos productivos por pasada.

Fase recomendada inmediata:
Separar CatalogLayout de SidebarDensity.

Implementar:
- CatalogLayout = list | tiles | icons.
- SidebarDensity = comfortable | compact | narrow.
- rich -> list.
- compact -> tiles.
- mini -> icons.
- density nunca cambia orientación ni visibilidad de texto.
- resize no cambia layout elegido por el usuario.
- reemplazar botón cíclico por control segmentado o menú explícito.
- eliminar title nativo en tooltips del catálogo.
- mantener favoritos, recientes y drag en los tres layouts.

Archivos candidatos:
- src/sisad-pdfme/ui/components/Designer/LeftSidebar.tsx
- src/sisad-pdfme/ui/components/Designer/SidebarButtons.tsx
- src/sisad-pdfme/ui/components/Designer/LeftSidebarGroup.tsx
- src/sisad-pdfme/ui/components/Designer/shared/CatalogLayoutToggle.tsx
- src/sisad-pdfme/ui/styles/sisad-pdfme-sidebar.css
- src/sisad-pdfme/ui/styles/sisad-pdfme-global.css
- src/styles/sisad-tailwind-bridge.css
- tests/e2e/left-sidebar-view-modes.spec.ts

Validación obligatoria:
- npm run build
- npm run lint
- npx playwright test tests/e2e/left-sidebar-view-modes.spec.ts --project=chromium
- npx playwright test tests/e2e/sidebar-collapse-parity.spec.ts --project=chromium

Entrega final:
- Diagnóstico corto.
- Causa raíz.
- Archivos modificados.
- Archivos prohibidos no tocados.
- Contratos preservados.
- Tests ejecutados.
- Riesgos residuales.
``​`

---

## 7. Checklist final por fase

### Antes de cada fase

``​`txt
[ ] git status revisado.
[ ] cambios previos clasificados.
[ ] una sola task-card seleccionada.
[ ] archivos prohibidos identificados.
[ ] tests relacionados definidos.
``​`

### Durante cada fase

``​`txt
[ ] no tocar Canvas/Moveable/Selecto/Paper/Snapshot/Generator/pdf-lib.
[ ] no tocar geometría ni coordenadas.
[ ] no mezclar UI con lógica de negocio.
[ ] no crear helpers paralelos si ya existe facade.
[ ] no introducir labels artificiales.
[ ] no mostrar controles que no persisten.
[ ] no dejar secciones vacías.
``​`

### Después de cada fase

``​`txt
[ ] npm run build OK.
[ ] npm run lint OK.
[ ] Playwright específico OK.
[ ] screenshots antes/después si es cambio visual.
[ ] tabla de archivos modificados.
[ ] riesgos residuales documentados.
[ ] commit pequeño y semántico.
``​`

---

## 8. Orden recomendado de ejecución

``​`txt
0. Congelar estado y limpiar worktree.
1. Validar owner color y PluginIcon.
2. Completar paridad visual de sidebars y eliminar title nativo.
3. Separar CatalogLayout de SidebarDensity.
4. Rediseñar selector de layout.
5. Compactar catálogo.
6. Corregir click/double click de inserción.
7. Reubicar Resultados.
8. Reperfilar DetailView por schema.
9. Corregir editor de opciones.
10. Corregir switches de un click.
11. Normalizar acciones rápidas vs persistentes.
12. Implementar comentarios con coordenadas.
13. Revisar modal de campos personalizados.
14. Consolidar CSS/Tailwind.
15. Documentar task-cards finales.
``​`

---

## 9. Conclusión técnica

La pasada de Codex fue correcta como base, pero todavía no cierra la deuda principal de UX/UI. Ya resolvió dos cimientos importantes: color de owner y collapse compartido. Ahora el riesgo es seguir agregando parches visuales. La siguiente etapa debe ser más estructural:

``​`txt
Estado visual único
→ Contratos de layout claros
→ Densidad independiente
→ Inspector por perfil de schema
→ Acciones sin duplicidad
→ Pruebas Playwright por caso de uso
``​`

El objetivo final no es que el diseñador “se vea más bonito”, sino que sea:

``​`txt
predecible
compacto
genérico
autoconfigurable
proporcional al tipo de schema
seguro para multiusuario
estable entre laboratorio y SISAD Web
``​`
```

<a id="file-0097"></a>

### 0097 — `plan-profundo-sisad-pdfme-diseniador.md`

- **Lenguaje:** `markdown`
- **Líneas:** `1720`
- **Tamaño original:** `47.8 KB`
- **SHA1 corto:** `5aed20856c`
- **Estado:** `completo`

```markdown
# Plan profundo de estabilización y refactor del diseñador SISAD PDFME

**Fecha:** 2026-07-12
**Proyecto:** `prueba-plugin / sisad-pdfme`
**Ruta funcional de referencia:** `http://localhost:5174/lab/multi-document-routing`
**Objetivo:** recuperar comportamiento funcional completo del diseñador, reducir duplicidad, compactar UI con Tailwind y dejar una arquitectura genérica, autoconfigurable y mantenible.

---

## 0. Resumen ejecutivo

El diseñador está en un punto donde las mejoras visuales ya no pueden tratarse como CSS aislado. Los problemas actuales —selección simple/múltiple rota, schemas que nacen bloqueados o readonly, estados desincronizados entre canvas e inspector, sidebars inconsistentes, propagación parcial de owner color, comportamiento desigual entre schemas, duplicidad en opciones, DetailView y comandos— indican una **fractura de contratos internos**.

La corrección debe ejecutarse en capas:

1. **Contrato de interacción:** selección, hit-testing, región, Moveable, Selecto, comandos y shortcuts.
2. **Contrato de acceso:** locked, readOnly, readonly, disabled, owner, permisos, estado colaborativo.
3. **Contrato de schema:** familias, capacidades, inspector, defaults, snapshot, Form/Viewer/Generator parity.
4. **Contrato visual:** field chrome, owner color, semantic color, density, sidebars, catalog layout, right sidebar list/detail.
5. **Contrato de ejecución para agentes:** task-cards, presupuesto de análisis, rutas permitidas, rutas prohibidas, validación y criterios de parada.

La prioridad no debe ser “hacer que se vea más bonito”, sino **hacer que cada acción tenga una única fuente de verdad**. Después de eso, la compactación visual con Tailwind será mucho más segura.

---

## 1. Investigación consolidada

### 1.1 Arquitectura real detectada

El proyecto ya está estructurado con capas fuertes:

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

Principio que debe respetarse:

``​`txt
Designer controla:
- canvas;
- sidebars;
- overlays;
- toolbar;
- selección;
- configuración.

Form/Viewer consumen el mismo modelo de schemas.
Generator usa el snapshot y los valores finales.
Host apps solo pasan datos, callbacks y adaptadores.
``​`

Esto implica que el host no debe reconstruir sidebars, inspector, toolbar ni renderer de schemas. El host puede elegir documento, destinatario y acciones de negocio, pero el runtime visual debe vivir dentro de `sisad-pdfme`.

---

### 1.2 Problemas funcionales confirmados por comportamiento observado

| Área | Problema | Causa probable | Impacto |
|---|---|---|---|
| Selección | No funciona bien selección simple/múltiple | Click, Selecto, Moveable y comandos resuelven selección por separado | Alto |
| Selección por SO | macOS y Windows no respetan combinaciones esperadas | No existe `selectionPolicy` por plataforma | Alto |
| Región | Selección de región no cubre todos los schemas | Hit-testing mezclado con overlays/options/toolbar | Alto |
| Lock/readonly | Schemas nacen bloqueados o aparecen bloqueados en inspector | Defaults y acceso resueltos desde múltiples capas | Crítico |
| Inspector | Dice bloqueado cuando canvas no lo refleja | `DetailView` infiere estado en vez de leer un view model único | Crítico |
| Owner color | Algunos schemas no heredan color de usuario | SVGs/estilos internos/resolvers duplicados | Medio/alto |
| LeftSidebar | Botón collapse se corta o se superpone | Handle vive dentro de área con overflow/posición desigual | Medio |
| RightSidebar | Collapse no es simétrico al izquierdo | Contrato distinto (`sidebarOpen` vs expanded/rail) | Medio/alto |
| Catálogo | Vistas rich/compact/mini confusas | Layout y densidad mezclados | Medio |
| DetailView | Demasiadas secciones genéricas | Falta matriz por familia de schema | Medio/alto |
| Custom fields | Controles visuales no persisten todas las propiedades | `CustomFieldDef` y schema creado no coinciden | Alto |
| CommandBus | Mutaciones se disparan desde varias rutas | No hay pipeline único de comandos mutables | Alto |
| Snapshot | Riesgo de perder metadata | Varios adapters/helpers pueden tocar estructura | Alto |
| CSS | Tailwind bridge + global + sidebar pisan selectores | Multiplicidad de CSS sobre mismo runtime | Medio/alto |

---

### 1.3 Investigación de modelo DocuSign-like aplicable

No se debe copiar UI, HTML, CSS ni branding. Debe tomarse como referencia funcional.

Mapping mínimo:

| DocuSign-like | SISAD PDFME |
|---|---|
| SignHere | `signature` |
| InitialHere | `initials` |
| DateSigned | `dateSigned` |
| Text | `text` |
| Number | `number` |
| Checkbox | `checkbox` |
| RadioGroup | `radioGroup` |
| List/Dropdown | `select` / `dropdown` |
| SignerAttachment | `attachment` |
| Note | `note` |
| Approve/Decline | `approve` / `decline` |
| Formula | `formula` futuro |
| Prefill | modo/propiedad de schema readonly/prefill |
| AutoPlace | anchor text + offsets + occurrence |

La conclusión funcional es que cada campo debe tener:

``​`ts
type SchemaCoreIdentity = {
  schemaUid: string;
  type: string;
  documentId?: string;
  fileId?: string;
  pageNumber: number;
  pageIndex?: number;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  ownerRecipientId?: string;
  ownerRecipientIds?: string[];
  ownerColor?: string;
  recipientColor?: string;
  userColor?: string;
  required?: boolean;
  readOnly?: boolean;
  readonly?: boolean;
  locked?: boolean;
  hidden?: boolean;
  dataLabel?: string;
  tooltip?: string;
  __designer?: Record<string, unknown>;
};
``​`

Regla crítica: **`schemaUid` identifica el campo; `dataLabel`/`fieldKey` conecta con negocio; `name`/`label` es visual.**

---

## 2. Principios de refactor

### 2.1 No corregir por síntoma

Proceso obligatorio:

``​`txt
Proceso afectado
→ componentes involucrados
→ fuente de verdad
→ estados válidos
→ datos preservados
→ validación mínima
→ implementación
``​`

Ejemplo:

``​`txt
Problema: checkboxGroup no se selecciona correctamente.
Mala solución: agregar stopPropagation en un componente.
Buena solución: resolver hit-testing root/option/toolbar desde interactionTargetResolver.
``​`

---

### 2.2 SOLID aplicado al diseñador

| Principio | Aplicación práctica |
|---|---|
| SRP | `Canvas.tsx` orquesta; `selectionPolicy.ts` decide intención; `schemaAccessResolver.ts` decide permisos; `interactionTargetResolver.ts` decide targets. |
| OCP | Un schema nuevo registra perfil/capacidades/secciones; no modifica `DetailView.tsx` ni `Canvas.tsx`. |
| LSP | Todos los schemas cumplen base serializable y no rompen Form/Viewer/Generator. |
| ISP | Props pequeñas por widget: `InspectorWidgetProps`, `SchemaListItemProps`, `CanvasInteractionContext`. |
| DIP | Componentes visuales dependen de view models y command interfaces, no de raw schema + lock manager directamente. |

---

### 2.3 Patrones recomendados

| Proceso | Patrón |
|---|---|
| Crear schema | Factory Method + Registry |
| Render schema | Template Method + Decorator |
| Editar propiedades | Strategy + Registry |
| Valores | Adapter + Strategy |
| Transformar | Command + State |
| Grupos | Composite + Command |
| Snapshot | Adapter + Memento |
| Host bridge | Facade |
| Inspector | Registry + Strategy |
| Access control | Policy/Resolver |
| Owner color | Facade + Token adapter |

---

## 3. Arquitectura objetivo

### 3.1 Nuevos módulos obligatorios

Crear o consolidar:

``​`txt
src/sisad-pdfme/ui/components/Designer/shared/selectionPolicy.ts
src/sisad-pdfme/ui/components/Designer/shared/schemaAccessModel.ts
src/sisad-pdfme/ui/components/Designer/shared/schemaAccessResolver.ts
src/sisad-pdfme/ui/components/Designer/shared/interactionTargetResolver.ts
src/sisad-pdfme/ui/components/Designer/shared/schemaOwnerAppearance.ts
src/sisad-pdfme/ui/components/Designer/shared/selectedSchemaViewModel.ts
src/sisad-pdfme/ui/components/Designer/shared/schemaCreationPolicy.ts
src/sisad-pdfme/ui/components/Designer/shared/schemaProfileRegistry.ts
src/sisad-pdfme/ui/components/Designer/shared/sidebarPanelContract.ts
``​`

No crear estos módulos como wrappers decorativos. Deben reemplazar lógica repetida.

---

### 3.2 Mapa de dependencias objetivo

``​`txt
Canvas.tsx
  -> selectionPolicy
  -> interactionTargetResolver
  -> schemaAccessResolver
  -> selectedSchemaViewModel
  -> commandBus

Moveable.tsx
  -> schemaAccessResolver
  -> transformTargetGuards / interactionTargetResolver

Selecto.tsx
  -> selectionPolicy
  -> interactionTargetResolver

RightSidebar/ListView
  -> selectedSchemaViewModel
  -> schemaAccessResolver
  -> schemaOwnerAppearance
  -> commandBus

RightSidebar/DetailView
  -> selectedSchemaViewModel
  -> schemaProfileRegistry
  -> schemaAccessResolver
  -> commandBus

Schemas/*
  -> schemaProfileRegistry
  -> fieldChrome
  -> schemaOwnerAppearance
  -> value adapters

Snapshot
  -> schema metadata contracts
  -> migrations only when needed
``​`

---

## 4. Fase 0 — Auditoría profunda obligatoria

### 4.1 Objetivo

Antes de modificar, generar evidencia de duplicidad. No tocar archivos hasta completar reportes.

### 4.2 Comandos

``​`bash
mkdir -p reports/designer-deep-audit

rg "selectSchema|selectAll|deselectAll|activeElements|onEdit|onSelect|Selecto|Moveable|regionSelection|metaKey|ctrlKey|shiftKey|altKey" src/sisad-pdfme > reports/designer-deep-audit/selection-audit.txt

rg "locked|lock|readOnly|readonly|disabled|editable|canEdit|canMove|canResize|canDelete|restrictChanges|isOwner|ownerMode" src/sisad-pdfme > reports/designer-deep-audit/access-audit.txt

rg "ownerColor|recipientColor|userColor|schemaTone|resolve.*Color|--schema-owner-color|data-schema-owner-color" src/sisad-pdfme > reports/designer-deep-audit/owner-color-audit.txt

rg "pageNumber|pageIndex|documentId|fileId|activeDocumentId|paperRefs|pageCursor|pages\[0\]|pageNumber \|\| 1" src/sisad-pdfme > reports/designer-deep-audit/multipage-audit.txt

rg "options|optionGroup|selectedOption|selectedOptionIds|selectedOptionId|checkboxGroup|radioGroup|dropdown|select|OptionListWidget|data-option-id" src/sisad-pdfme > reports/designer-deep-audit/options-audit.txt

rg "DetailView|detailSchemas|detailSectionTaxonomy|inspectorContracts|SchemaCollaborationWidget|schemaCollaborationUtils|detailWidgetRegistry" src/sisad-pdfme/ui/components/Designer/RightSidebar > reports/designer-deep-audit/inspector-audit.txt

rg "CommandBus|commandBus|selectionCommands|designerCommands|undo|redo|keyboardShortcuts|useDesignerKeyboardShortcuts" src/sisad-pdfme > reports/designer-deep-audit/commandbus-audit.txt

rg "data-view-mode|rich|compact|mini|CatalogViewMode|sidebarDensity|data-left-sidebar-density|data-right-sidebar-density|sidebarExpanded|sidebarOpen" src/sisad-pdfme > reports/designer-deep-audit/sidebar-density-audit.txt

rg "any|as any|Record<string, any>|unknown as" src/sisad-pdfme/ui src/sisad-pdfme/schemas src/sisad-pdfme/shared > reports/designer-deep-audit/type-safety-audit.txt
``​`

### 4.3 Entregables de auditoría

``​`txt
reports/designer-deep-audit/
  selection-audit.txt
  access-audit.txt
  owner-color-audit.txt
  multipage-audit.txt
  options-audit.txt
  inspector-audit.txt
  commandbus-audit.txt
  sidebar-density-audit.txt
  type-safety-audit.txt
  duplication-map.md
  risk-map.md
``​`

### 4.4 Formato de `duplication-map.md`

``​`md
# Duplication map

## Selección
- Funciones equivalentes:
- Archivos:
- Fuente única propuesta:
- Qué se elimina:

## Access / lock / readonly
...
``​`

---

## 5. Fase 1 — Política única de selección

### 5.1 Problema

La selección simple, selección múltiple, selección por región, shortcuts, ListView y toolbar no pueden operar con reglas distintas.

### 5.2 Implementar `selectionPolicy.ts`

``​`ts
export type PlatformKind = 'mac' | 'windows' | 'linux' | 'unknown';

export type SelectionIntent =
  | 'replace'
  | 'toggle'
  | 'add'
  | 'region-replace'
  | 'region-add'
  | 'clear'
  | 'inspect-only';

export type SelectionPolicyInput = {
  platform: PlatformKind;
  metaKey?: boolean;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  targetKind?: 'schema-root' | 'option-internal' | 'interactive-control' | 'canvas-empty' | 'overlay' | 'moveable-control';
  pointerKind?: 'click' | 'double-click' | 'drag-region' | 'keyboard';
};

export function detectPlatform(): PlatformKind;
export function resolveSelectionIntent(input: SelectionPolicyInput): SelectionIntent;
export function isAdditiveSelectionIntent(intent: SelectionIntent): boolean;
``​`

### 5.3 Reglas por sistema operativo

| Acción | Windows/Linux | macOS | Resultado |
|---|---|---|---|
| Click normal en schema | sin modificador | sin modificador | reemplaza selección |
| Multi click principal | `Ctrl + Shift + click` | `Command + click` | toggle/add |
| Compatibilidad | `Ctrl + click` | `Command + Shift + click` | toggle/add |
| Región normal | drag en vacío | drag en vacío | reemplaza con región |
| Región acumulativa | `Ctrl` o `Shift` + región | `Command` o `Shift` + región | agrega región |
| Click vacío | sin modificador | sin modificador | limpia selección |
| Click schema bloqueado | cualquiera | cualquiera | selecciona para inspección, no transforma |

### 5.4 Archivos a modificar

``​`txt
src/sisad-pdfme/ui/components/Designer/Canvas/Canvas.tsx
src/sisad-pdfme/ui/components/Designer/Canvas/Selecto.tsx
src/sisad-pdfme/ui/components/Designer/shared/selectionCommands.ts
src/sisad-pdfme/ui/components/Designer/shared/selectionIdentityResolver.ts
src/sisad-pdfme/ui/components/Designer/shared/useDesignerKeyboardShortcuts.ts
``​`

### 5.5 Criterios de aceptación

- Click normal reemplaza selección.
- macOS `Command + click` alterna selección.
- Windows/Linux `Ctrl + Shift + click` alterna selección.
- Región selecciona roots `[data-schema-id]` únicamente.
- Región acumulativa no borra selección previa.
- Click en option interna no crea selección independiente.
- Click en toolbar/Moveable handles no dispara Selecto.

---

## 6. Fase 2 — Hit-testing y target resolver

### 6.1 Problema

Selecto, Moveable, opciones internas, botón `+`, inputs, toolbar contextual y comentarios compiten por eventos.

### 6.2 Implementar `interactionTargetResolver.ts`

``​`ts
export type InteractionTargetKind =
  | 'schema-root'
  | 'option-internal'
  | 'group-add-option'
  | 'interactive-control'
  | 'moveable-control'
  | 'selection-toolbar'
  | 'canvas-context-menu'
  | 'comment-anchor'
  | 'canvas-empty'
  | 'unknown';

export function resolveInteractionTarget(target: EventTarget | null): {
  kind: InteractionTargetKind;
  schemaRoot: HTMLElement | null;
  schemaUid?: string;
  optionId?: string;
};

export function shouldSelectTarget(result): boolean;
export function shouldTransformTarget(result): boolean;
export function shouldIgnoreForSelecto(result): boolean;
``​`

### 6.3 Reglas de target

| Target | Selección | Transformación | Edición valor |
|---|---:|---:|---:|
| `[data-schema-id]` root | sí | según permisos | no |
| `[data-option-id]` en designer | root only | no opción interna | doble click |
| `[data-role="group-add-option"]` | no | no | agrega opción |
| input/select/textarea | no | no | sí |
| toolbar contextual | no | no | acción |
| `.moveable-*` | no | sí | no |
| comment anchor | no o inspect | no | abre comentario |
| canvas vacío | limpia/region | no | no |

### 6.4 Archivos a revisar por duplicidad

``​`txt
src/sisad-pdfme/ui/components/Designer/shared/selectableTargetGuards.ts
src/sisad-pdfme/ui/components/Designer/shared/transformTargetGuards.ts
src/sisad-pdfme/ui/components/Designer/shared/interactionTargetSelectors.ts
src/sisad-pdfme/ui/components/Designer/shared/interactionTargetPolicy.ts
src/sisad-pdfme/ui/components/Designer/Canvas/overlays/*
``​`

---

## 7. Fase 3 — Access model único: locked, readonly, owner y permisos

### 7.1 Problema

El canvas, DetailView, ListView y menú contextual no muestran el mismo estado. A veces el inspector dice bloqueado cuando el schema no está realmente bloqueado.

### 7.2 Implementar `schemaAccessModel.ts`

``​`ts
export type SchemaLockState =
  | 'unlocked'
  | 'locked-by-me'
  | 'locked-by-other'
  | 'unknown';

export type SchemaReadonlyState =
  | 'editable'
  | 'readonly'
  | 'runtime-readonly'
  | 'disabled';

export type SchemaAccessState = {
  selectable: boolean;
  inspectable: boolean;
  editable: boolean;
  movable: boolean;
  resizable: boolean;
  rotatable: boolean;
  deletable: boolean;
  duplicable: boolean;
  canChangeOwner: boolean;
  canComment: boolean;
  lockState: SchemaLockState;
  readonlyState: SchemaReadonlyState;
  ownerState: 'mine' | 'other' | 'shared' | 'unassigned';
  reason?: string;
};
``​`

### 7.3 Implementar `schemaAccessResolver.ts`

``​`ts
export type ResolveSchemaAccessInput = {
  schema: SchemaForUI;
  activeUserId?: string | null;
  activeRecipientId?: string | null;
  runtimeMode: 'designer' | 'form' | 'viewer' | 'pdf';
  commandId?: string;
  lockSnapshot?: unknown;
  collaborationContext?: unknown;
};

export function resolveSchemaAccessState(input: ResolveSchemaAccessInput): SchemaAccessState;
export function canRunSchemaCommand(commandId: string, access: SchemaAccessState): boolean;
``​`

### 7.4 Reglas funcionales

| Estado | Selecciona | Mueve | Edita DetailView | Duplicar | Eliminar |
|---|---:|---:|---:|---:|---:|
| normal | sí | sí | sí | sí | sí |
| readonly | sí | no | no | depende política | no |
| locked-by-me | sí | sí | sí | sí | sí |
| locked-by-other | sí | no | no | no | no |
| hidden | no visible o tenue | no | solo si lista lo permite | no | no |
| other-owner | sí | depende permiso | depende permiso | depende permiso | depende permiso |

### 7.5 Acciones explícitamente permitidas aunque haya lock

``​`txt
selectSchema
selectAll
deselectAll
openProperties
zoom
navigatePage
viewDetails
copyTechnicalId
commentView
``​`

### 7.6 Archivos a modificar

``​`txt
src/sisad-pdfme/collaboration/lockManager.ts
src/sisad-pdfme/collaboration/schemaLockGuard.ts
src/sisad-pdfme/ui/components/Designer/shared/actionRegistry.ts
src/sisad-pdfme/ui/components/Designer/Canvas/Moveable.tsx
src/sisad-pdfme/ui/components/Designer/Canvas/overlays/SelectionContextToolbar.tsx
src/sisad-pdfme/ui/components/Designer/Canvas/overlays/CanvasContextMenu.tsx
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/*
src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/*
``​`

---

## 8. Fase 4 — Defaults de schemas al crear/arrastrar

### 8.1 Problema

Algunos schemas aparecen bloqueados o readonly al arrastrarlos al canvas.

### 8.2 Implementar `schemaCreationPolicy.ts`

``​`ts
export type SchemaCreationContext = {
  type: string;
  activeRecipientId?: string | null;
  activeRecipientColor?: string | null;
  activeUserId?: string | null;
  documentId?: string;
  pageNumber: number;
  x: number;
  y: number;
  source: 'drag-drop' | 'click-insert' | 'paste' | 'duplicate' | 'import';
};

export function normalizeNewSchemaState<T extends SchemaForUI>(schema: T, context: SchemaCreationContext): T;
``​`

### 8.3 Defaults esperados

``​`txt
readOnly: false por defecto
readonly: undefined salvo legacy
locked: false
hidden: false
disabled: false
ownerRecipientId: activeRecipientId
ownerColor: activeRecipientColor
__designer.createdByDrop: true si aplica
__designer.access.defaultEditable: true
``​`

### 8.4 Excepciones permitidas

- `dateSigned`: puede ser readonly en Form, pero no locked en Designer.
- `formula`: readonly por naturaleza, pero seleccionable e inspeccionable.
- `prefill`: readonly en runtime, editable por sender/designer.
- schemas importados legacy: respetar estado original si viene explícito.

### 8.5 Archivos a revisar

``​`txt
src/sisad-pdfme/ui/components/Designer/shared/canvasDropPipeline.ts
src/sisad-pdfme/ui/components/Designer/shared/schemaAutoPlace.ts
src/sisad-pdfme/schemas/schemaBuilder.ts
src/sisad-pdfme/schemas/actions/actionSchemaFactory.ts
src/sisad-pdfme/schemas/signature/signingSchemaFactory.ts
src/sisad-pdfme/shared/schemaDesignerMeta.ts
``​`

---

## 9. Fase 5 — CommandBus como única vía de mutación

### 9.1 Problema

Canvas, DetailView, ListView, context menu y shortcuts pueden mutar schemas por rutas distintas.

### 9.2 Pipeline objetivo

``​`txt
UI event
  -> interactionTargetResolver
  -> selectionPolicy / schemaAccessResolver
  -> commandBus
  -> guard
  -> reducer/update
  -> snapshot dirty state
  -> view model refresh
``​`

### 9.3 Comandos mínimos a centralizar

``​`txt
selectSchema
toggleSchemaSelection
selectRegion
deselectAll
moveSchema
resizeSchema
rotateSchema
duplicateSchema
deleteSchema
lockSchema
unlockSchema
setReadonly
assignOwner
updateSchemaField
updateSchemaOptions
updateSchemaValidation
updateSchemaAppearance
updateSchemaGeometry
``​`

### 9.4 Archivos clave

``​`txt
src/sisad-pdfme/ui/commands/commandBus.ts
src/sisad-pdfme/ui/commands/designerCommands.ts
src/sisad-pdfme/commands/index.ts
src/sisad-pdfme/ui/components/Designer/shared/selectionCommands.ts
src/sisad-pdfme/ui/components/Designer/shared/actionRegistry.ts
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailWidgets.tsx
``​`

### 9.5 Criterios

- Ningún widget de DetailView hace mutación directa sin pasar por comando.
- Undo/redo puede reconocer el cambio.
- Lock guard se aplica igual para toolbar, keyboard y inspector.
- Snapshot dirty state se actualiza una vez.

---

## 10. Fase 6 — Selected schema view model

### 10.1 Problema

DetailView, ListView y canvas calculan labels, owner, status y geometría por separado.

### 10.2 Implementar `selectedSchemaViewModel.ts`

``​`ts
export type SelectedSchemaViewModel = {
  schemaUid: string;
  schemaId?: string;
  type: string;
  family: string;
  label: string;
  technicalName: string;
  documentId?: string;
  pageNumber: number;
  owner: {
    recipientId: string | null;
    label: string;
    color: string;
    mode: 'single' | 'multi' | 'shared' | 'unassigned';
  };
  access: SchemaAccessState;
  geometry: {
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
  };
  badges: Array<{ key: string; label: string; tone: 'neutral' | 'info' | 'warning' | 'danger' | 'success' }>;
};

export function buildSelectedSchemaViewModel(input): SelectedSchemaViewModel;
``​`

### 10.3 Consumidores

``​`txt
SelectionContextToolbar
CanvasContextMenu
DetailHeaderCard
DetailViewContent
SchemaCollaborationWidget
ListView Item
DocumentsRail field counters
CommentsRail field context
``​`

---

## 11. Fase 7 — Owner color y field chrome unificados

### 11.1 Problema

Algunos schemas heredan color y otros usan colores fijos internos.

### 11.2 Separar conceptos

``​`txt
Owner color:
- identifica destinatario/usuario dueño.
- debe aparecer en borde, foco, list item, inspector, drag preview.

Semantic color:
- representa significado del campo.
- approve = verde, decline = rojo, note = amarillo, etc.
``​`

### 11.3 Implementar `schemaOwnerAppearance.ts`

``​`ts
export type SchemaOwnerAppearance = {
  ownerRecipientId: string | null;
  ownerLabel: string;
  ownerColor: string;
  borderColor: string;
  backgroundColor: string;
  textColor: string;
  focusRingColor: string;
  cssVars: React.CSSProperties;
  dataAttributes: Record<string, string>;
};

export function resolveSchemaOwnerAppearance(input): SchemaOwnerAppearance;
``​`

### 11.4 Orden de resolución de color

``​`txt
1. schema.ownerColor
2. schema.userColor
3. schema.recipientColor
4. schema.__designer?.collaboration?.recipientColor
5. schema.__designer?.ownerColor
6. schema.__designer?.recipientColor
7. fallback activeRecipientColor
8. recipient.color
9. #2563EB
``​`

### 11.5 Schemas a validar uno por uno

``​`txt
src/sisad-pdfme/schemas/checkbox/index.ts
src/sisad-pdfme/schemas/checkboxGroup/index.ts
src/sisad-pdfme/schemas/radioGroup/index.ts
src/sisad-pdfme/schemas/select/index.ts
src/sisad-pdfme/schemas/text/uiRender.ts
src/sisad-pdfme/schemas/number/index.ts
src/sisad-pdfme/schemas/signature/index.ts
src/sisad-pdfme/schemas/signature/initials.ts
src/sisad-pdfme/schemas/signature/dateSigned.ts
src/sisad-pdfme/schemas/actions/approve.ts
src/sisad-pdfme/schemas/actions/decline.ts
src/sisad-pdfme/schemas/actions/attachment.ts
src/sisad-pdfme/schemas/actions/note.ts
src/sisad-pdfme/schemas/graphics/image.ts
src/sisad-pdfme/schemas/graphics/svg.ts
src/sisad-pdfme/schemas/barcodes/*
src/sisad-pdfme/schemas/tables/*
src/sisad-pdfme/schemas/shapes/*
``​`

### 11.6 Reglas visuales

- El wrapper debe exponer `--schema-owner-color`.
- El root debe tener `data-schema-owner-color` si aplica.
- SVGs del catálogo deben preferir `currentColor`.
- Semantic color no debe borrar owner accent.
- `approve`/`decline` mantienen verde/rojo en contenido, pero borde/focus/list/detail usan owner color.

---

## 12. Fase 8 — Schemas por familia y perfiles autoconfigurables

### 12.1 Problema

Cada schema tiende a inventar qué aparece en DetailView, qué capacidades tiene y cómo se renderiza.

### 12.2 Implementar `schemaProfileRegistry.ts`

``​`ts
export type SchemaFamily =
  | 'text-like'
  | 'option-based'
  | 'boolean'
  | 'signing'
  | 'action'
  | 'media'
  | 'layout'
  | 'table'
  | 'custom';

export type SchemaCapability =
  | 'selectable'
  | 'movable'
  | 'resizable'
  | 'rotatable'
  | 'editable-content'
  | 'editable-options'
  | 'required'
  | 'readonly'
  | 'validation'
  | 'appearance'
  | 'autoplace'
  | 'comments'
  | 'collaboration';

export type SchemaProfile = {
  type: string;
  family: SchemaFamily;
  displayName: string;
  capabilities: Partial<Record<SchemaCapability, boolean>>;
  inspectorSections: string[];
  defaultSize: { width: number; height: number };
  creationPolicy?: string;
  runtimeModes: Array<'designer' | 'form' | 'viewer' | 'pdf'>;
};
``​`

### 12.3 Perfiles mínimos

| Familia | Schemas | Secciones |
|---|---|---|
| text-like | text, number, date, time, emailAddress, fullname, company, title | basics, content, validation, appearance, dataLabel, help, location, collaboration, advanced |
| signing | signature, initials, dateSigned | basics, signing, appearance, dataLabel, help, location, collaboration, advanced |
| option-based | select, radioGroup, checkboxGroup | basics, options, validation, appearance, dataLabel, help, location, collaboration, advanced |
| boolean | checkbox | basics, value, validation, appearance, dataLabel, help, location, collaboration, advanced |
| action | approve, decline, attachment, note | basics, action/content/file, appearance, dataLabel, help, location, collaboration, advanced |
| media | image, svg, barcode, qr | basics, source, appearance, dataLabel, location, advanced |
| layout | line, rect, ellipse | basics, appearance, location, advanced |
| table | table, cell | basics, structure, appearance, data, location, advanced |

---

## 13. Fase 9 — DetailView / Inspector por contrato

### 13.1 Problema

El inspector debe cambiar por familia y tipo, no por parches dispersos.

### 13.2 Archivos a modificar

``​`txt
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/inspectorContracts.ts
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailSchemas.ts
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailSectionTaxonomy.ts
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailWidgetRegistry.tsx
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailWidgets.tsx
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailView.tsx
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailViewContent.tsx
``​`

### 13.3 Taxonomía de secciones

``​`txt
identity
content
options
behavior
validation
appearance
dataBindings
help
location
autoPlace
collaboration
comments
advanced
``​`

### 13.4 Reglas de UI

- No mostrar secciones vacías.
- No duplicar `Renombrar` si ya existe input de nombre.
- `Guardar` del inspector debe llamarse `Aplicar cambios` o ser eliminado si cambios son live.
- `locked/readOnly` debe venir de `SchemaAccessState`.
- `owner` debe venir de `selectedSchemaViewModel.owner`.
- Ubicación debe adaptarse a ancho: 1 o 2 columnas, nunca 3 si el panel es estrecho.
- Las acciones destructivas deben estar en footer contextual o menú, no mezcladas con metadata técnica.

### 13.5 Orden recomendado de secciones

1. Identidad y estado.
2. Configuración principal del tipo.
3. Valor/opciones/acción/firma.
4. Validación/comportamiento.
5. Apariencia.
6. Asignación y acceso.
7. Ubicación y tamaño.
8. Datos conectados.
9. Comentarios.
10. Técnico.

---

## 14. Fase 10 — Option groups, checkbox y radio

### 14.1 Problema

Checkbox, checkboxGroup y radioGroup deben compartir indicador visual, comportamiento de selección y value adapters.

### 14.2 Rutas

``​`txt
src/sisad-pdfme/schemas/options/optionIndicator.ts
src/sisad-pdfme/schemas/options/optionGroupFactory.ts
src/sisad-pdfme/schemas/options/optionGroupRenderer.ts
src/sisad-pdfme/schemas/options/optionGroupLayout.ts
src/sisad-pdfme/schemas/options/optionSelectionBehavior.ts
src/sisad-pdfme/schemas/options/optionValueAdapter.ts
src/sisad-pdfme/schemas/checkbox/index.ts
src/sisad-pdfme/schemas/checkboxGroup/index.ts
src/sisad-pdfme/schemas/radioGroup/index.ts
src/sisad-pdfme/schemas/groupSchemaRender.ts
src/sisad-pdfme/ui/components/Designer/Canvas/overlays/GroupOptionFloatingAction.tsx
``​`

### 14.3 Contrato de comportamiento

| Modo | Click simple | Doble click | Notas |
|---|---|---|---|
| Designer checkbox | selecciona schema | toggle checked | no ejecutar en click simple |
| Designer checkboxGroup | selecciona grupo | alterna opción | opción interna no es schema |
| Designer radioGroup | selecciona grupo | selecciona opción | deselecciona otras |
| Form checkbox | toggle | igual o sin extra | formulario real |
| Form radioGroup | selecciona opción | igual o sin extra | formulario real |
| Viewer/PDF | no interactúa | no interactúa | solo visual |

### 14.4 Reglas DOM

``​`txt
Root del grupo: data-schema-id
Opción interna: data-option-id
Botón agregar: data-role="group-add-option"
``​`

No poner `data-schema-id` en opciones internas.

### 14.5 Indicador común

`optionIndicator.ts` debe soportar:

``​`ts
type OptionIndicatorProps = {
  shape: 'square' | 'circle';
  checked: boolean;
  ownerColor?: string;
  semanticColor?: string;
  mode: 'designer' | 'form' | 'viewer' | 'pdf';
  disabled?: boolean;
  readOnly?: boolean;
  size?: number;
};
``​`

---

## 15. Fase 11 — LeftSidebar y RightSidebar simétricos

### 15.1 Problema

El LeftSidebar tiene colapso propio; el RightSidebar usa otra lógica. El botón del izquierdo se corta y el derecho no conserva rail simétrico.

### 15.2 Crear contrato compartido

``​`txt
src/sisad-pdfme/ui/components/Designer/shared/SidebarCollapseHandle.tsx
src/sisad-pdfme/ui/components/Designer/shared/sidebarPanelContract.ts
``​`

``​`ts
type SidebarSide = 'left' | 'right';
type SidebarPresentation = 'docked' | 'overlay';
type SidebarDensity = 'comfortable' | 'compact' | 'narrow' | 'mini';

type SidebarCollapseHandleProps = {
  side: SidebarSide;
  expanded: boolean;
  presentation: SidebarPresentation;
  density?: SidebarDensity;
  labelExpanded: string;
  labelCollapsed: string;
  onToggle: () => void;
};
``​`

### 15.3 Reglas

- Mismo tamaño, borde, sombra, hover, focus y tooltip en ambos lados.
- No debe quedar recortado por `overflow-hidden`.
- `aria-expanded` obligatorio.
- `data-side` y `data-expanded` obligatorios.
- Rail colapsado de 40–44 px.
- Panel izquierdo abierto 272–304 px.
- Panel derecho abierto 336–368 px.
- Preservar scroll, zoom y selección al abrir/cerrar.

### 15.4 Archivos

``​`txt
src/sisad-pdfme/ui/components/Designer/LeftSidebar.tsx
src/sisad-pdfme/ui/components/Designer/RightSidebar/RightSidebar.tsx
src/sisad-pdfme/ui/components/Designer/RightSidebar/layout.tsx
src/sisad-pdfme/ui/components/Designer/index.tsx
src/sisad-pdfme/ui/components/Designer/shared/SidebarCollapseHandle.tsx
src/sisad-pdfme/ui/styles/sisad-pdfme-sidebar.css
src/styles/sisad-tailwind-bridge.css
``​`

---

## 16. Fase 12 — Catálogo izquierdo compacto y autoconfigurable

### 16.1 Problema

`rich`, `compact`, `mini` mezclan layout y densidad. El usuario ve modos confusos; la densidad cambia la semántica del layout.

### 16.2 Renombrar conceptos

``​`ts
type CatalogLayout = 'list' | 'tiles' | 'icons';
type SidebarDensity = 'comfortable' | 'compact' | 'narrow';
``​`

Mapeo:

| Actual | Apariencia | Nuevo nombre |
|---|---|---|
| rich | fila horizontal con icono y texto | list |
| compact | tarjeta vertical | tiles |
| mini | solo iconos | icons |

### 16.3 Reglas

- `CatalogLayout` es decisión del usuario.
- `SidebarDensity` depende del ancho.
- La densidad no cambia `list` a `tiles` ni `tiles` a `icons`.
- El resize no debe reemplazar la preferencia del usuario.

### 16.4 Diseño objetivo

#### List

``​`txt
Altura: 36–40 px
Icono: 20–22 px
Texto: 11.5–12 px
Sin sombra permanente
Borde solo en hover/focus
``​`

#### Tiles

``​`txt
Altura: 52–58 px
Dos columnas si hay espacio
Icono: 22–24 px
Label: 1 línea
Sin card dentro de card
``​`

#### Icons

``​`txt
Botón: 38–42 px
Icono: 18–22 px
Grid: repeat(auto-fill, minmax(38px, 1fr))
Tooltip controlado
``​`

### 16.5 Corregir eventos

El catálogo no debe tener `onClick` y `onDoubleClick` haciendo la misma inserción. Contrato recomendado:

``​`txt
Click simple: insertar una vez con autoplace.
Drag: colocar con precisión.
Doble click: sin acción adicional o abre ayuda; no duplica inserción.
``​`

---

## 17. Fase 13 — RightSidebar ListView compacto

### 17.1 Problema

Todos los elementos parecen seleccionados por la barra azul. La información secundaria es inconsistente.

### 17.2 Fila estándar

``​`txt
[drag] [icono] Nombre visible                 [estado]
               Tipo · Destinatario · Pág. N
``​`

### 17.3 Estados visuales

| Estado | UI |
|---|---|
| normal | fondo neutro, sin barra azul |
| hover | fondo suave |
| seleccionado | barra owner color + fondo sutil |
| locked | candado/chip, no toda la tarjeta roja |
| readonly | chip compacto |
| hidden | opacidad o badge |

### 17.4 Funciones

- Click fila selecciona schema.
- Cambia a documento/página correcta.
- Scroll al campo.
- Pulso visual corto.
- Abre propiedades si está configurado.
- Soporta búsqueda, filtro y agrupación.

### 17.5 Agrupación futura

``​`txt
por documento
por página
por destinatario
por tipo
por estado
``​`

---

## 18. Fase 14 — CSS/Tailwind sin romper geometría

### 18.1 Regla fundamental

No tocar con CSS:

``​`txt
.moveable-*
.selecto-*
transform
left/top calculados
width/height de schema runtime
zoom geometry
paper position
scroll position
``​`

### 18.2 Tailwind permitido

- Clases en JSX para componentes nuevos.
- `sisad-tailwind-bridge.css` para compatibilidad de classNames existentes.
- Tokens CSS para colores, radios, sombras, density.
- No crear hojas nuevas dispersas.

### 18.3 Riesgos detectados

- `src/styles/tailwind.css` es fuente de Tailwind.
- `src/style.css` fue neutralizado para evitar doble emisión.
- Existen `sisad-pdfme-global.css`, `sisad-pdfme-sidebar.css`, `canvas-interactions.css`, `sisad-tailwind-bridge.css` con solapamientos.

### 18.4 Plan de decommission CSS

1. Inventariar selectores duplicados.
2. Clasificar:
   - geometry protected;
   - visual-only;
   - legacy removable;
   - host-only;
   - runtime required.
3. Migrar visual-only a Tailwind JSX o bridge.
4. Mantener geometry protected intacto.
5. Crear reporte:

``​`txt
reports/tailwind-migration/ui-styles-decommission-audit-v2.md
``​`

---

## 19. Fase 15 — Custom fields modal

### 19.1 Problema

El modal muestra propiedades que no siempre se guardan en el schema creado.

### 19.2 Regla P0

No mostrar un control si no persiste.

### 19.3 Contrato de definición

``​`ts
type CustomFieldDef = {
  id: string;
  type: string;
  label: string;
  description?: string;
  defaultSchema: Partial<SchemaForUI>;
  inspectorProfile?: string;
  capabilities?: SchemaCapability[];
};
``​`

### 19.4 Propiedades que deben persistir si se muestran

``​`txt
fontName
fontSize
fontColor
bold
italic
underline
fixedWidth
maskAsterisks
maxLength
validation
helpText
collaborationEnabled
ownerMode
options[]
defaultValue
required
readOnly
``​`

### 19.5 UI por tipo

- Text-like: valor, formato, validación, ayuda.
- Checkbox: default checked, requerido, ayuda.
- Select/radio: options editor.
- Line/shape: color, grosor, estilo.
- Attachment: mime types, max files, preview, replace.

---

## 20. Fase 16 — Snapshot y metadata

### 20.1 Datos que nunca deben perderse

``​`txt
schemaUid
type
documentId
fileId
pageNumber
pageIndex
x
y
width
height
rotation
ownerRecipientId
ownerRecipientIds
recipientId
ownerColor
recipientColor
userColor
required
readOnly
readonly
locked
hidden
groupId
optionId
selectedOptionIds
selectedOptionId
selectedValue
defaultValue
options
__designer
dataLabel
tooltip
comments
commentAnchors
``​`

### 20.2 Tests de roundtrip

- Guardar/importar mantiene documentos.
- Guardar/importar mantiene páginas.
- Duplicar conserva offset pero nuevo schemaUid.
- Paste conserva orden y offset.
- Option groups conservan options y selected values.
- Owner color no se recalcula erróneamente al cambiar usuario activo.

---

## 21. Fase 17 — Tests obligatorios

### 21.1 Unit tests

``​`bash
npx vitest run \
  tests/unit/selectionPolicy.test.ts \
  tests/unit/interactionTargetResolver.test.ts \
  tests/unit/schemaAccessResolver.test.ts \
  tests/unit/schemaCreationPolicy.test.ts \
  tests/unit/schemaOwnerAppearance.test.ts \
  tests/unit/schemaProfileRegistry.test.ts \
  tests/unit/detailView.schemaMatrix.test.ts \
  tests/unit/optionSelectionBehavior.test.ts \
  tests/unit/optionValueAdapter.test.ts \
  tests/unit/snapshotAdapter.test.ts
``​`

### 21.2 Playwright

``​`bash
npx playwright test tests/e2e/designer-selection-modifiers.spec.ts --project=chromium
npx playwright test tests/e2e/designer-selection-region.spec.ts --project=chromium
npx playwright test tests/e2e/designer-lock-readonly-sync.spec.ts --project=chromium
npx playwright test tests/e2e/designer-drag-drop-default-state.spec.ts --project=chromium
npx playwright test tests/e2e/designer-sidebar-canvas-sync.spec.ts --project=chromium
npx playwright test tests/e2e/designer-option-groups-selection.spec.ts --project=chromium
npx playwright test tests/e2e/designer-owner-color-sync.spec.ts --project=chromium
npx playwright test tests/e2e/designer-snapshot-roundtrip.spec.ts --project=chromium
npx playwright test tests/e2e/designer-catalog-layout-density.spec.ts --project=chromium
npx playwright test tests/e2e/designer-right-sidebar-listview.spec.ts --project=chromium
``​`

### 21.3 Manual QA

``​`txt
[ ] Drag text al canvas nace editable.
[ ] Drag attachment al canvas no nace locked.
[ ] Drag note al canvas no nace readonly salvo configuración explícita.
[ ] macOS Command+click selecciona múltiples.
[ ] Windows Ctrl+Shift+click selecciona múltiples.
[ ] Región selecciona varios schemas.
[ ] Región no selecciona botón + ni toolbar.
[ ] Locked-by-other se selecciona pero no se mueve.
[ ] Inspector muestra el mismo locked/readonly que canvas.
[ ] ListView y canvas usan mismo owner color.
[ ] LeftSidebar y RightSidebar colapsan con mismo patrón.
[ ] No hay scroll reset al colapsar paneles.
[ ] Option group root se selecciona con click.
[ ] Doble click en opción cambia valor solo en designer.
[ ] Form usa click simple para cambiar valores.
[ ] Viewer/PDF no interactúa.
[ ] Snapshot roundtrip conserva pageNumber/documentId/ownerColor.
``​`

---

## 22. Orden de implementación recomendado

### Sprint 0 — Congelar y auditar

``​`txt
1. git status --short
2. crear branch limpio
3. ejecutar auditorías rg
4. crear duplication-map.md
5. no modificar UI todavía
``​`

### Sprint 1 — Selección e interacción

``​`txt
1. selectionPolicy.ts
2. interactionTargetResolver.ts
3. integrar Selecto/Canvas
4. tests unitarios de policy
5. Playwright selección simple/múltiple/región
``​`

### Sprint 2 — Access y creación de schemas

``​`txt
1. schemaAccessModel.ts
2. schemaAccessResolver.ts
3. schemaCreationPolicy.ts
4. corregir defaults al drag/drop
5. sincronizar inspector/canvas/list
``​`

### Sprint 3 — CommandBus y view models

``​`txt
1. comandos mutables centralizados
2. selectedSchemaViewModel.ts
3. DetailHeaderCard/ListView consumen view model
4. toolbar contextual usa access state
``​`

### Sprint 4 — Owner color y schema profiles

``​`txt
1. schemaOwnerAppearance.ts
2. fieldChrome consume variables unificadas
3. PluginIcon currentColor
4. schemaProfileRegistry.ts
5. matriz por familia
``​`

### Sprint 5 — DetailView y sidebars compactos

``​`txt
1. inspector por contrato
2. layout de campos adaptativo
3. SidebarCollapseHandle compartido
4. CatalogLayout list/tiles/icons
5. RightSidebar ListView compacto
``​`

### Sprint 6 — Option groups y custom fields

``​`txt
1. optionIndicator único
2. optionSelectionBehavior central
3. doble click designer/click form
4. custom fields: no mostrar propiedades no persistidas
``​`

### Sprint 7 — Snapshot y regresión final

``​`txt
1. snapshot roundtrip
2. tests E2E completos
3. visual baseline
4. build/lint
5. reporte final
``​`

---

## 23. Task-cards recomendadas

### TASK-SEL-001 — SelectionPolicy y selección múltiple por plataforma

**Archivos permitidos:**

``​`txt
Canvas.tsx
Selecto.tsx
selectionCommands.ts
selectionIdentityResolver.ts
useDesignerKeyboardShortcuts.ts
selectionPolicy.ts
interactionTargetResolver.ts
``​`

**No tocar:** schemas, DetailView, SnapshotAdapter, CSS global.

**Criterio de cierre:** tests unitarios + Playwright selección modifiers.

---

### TASK-ACC-001 — AccessResolver lock/readonly sync

**Archivos permitidos:**

``​`txt
schemaAccessModel.ts
schemaAccessResolver.ts
schemaLockGuard.ts
lockManager.ts
SelectionContextToolbar.tsx
CanvasContextMenu.tsx
DetailHeaderCard.tsx
ListView/Item.tsx
``​`

**No tocar:** Moveable salvo consumo de access state.

**Criterio de cierre:** inspector y canvas muestran el mismo estado.

---

### TASK-DROP-001 — SchemaCreationPolicy defaults

**Archivos permitidos:**

``​`txt
schemaCreationPolicy.ts
canvasDropPipeline.ts
schemaAutoPlace.ts
schemaBuilder.ts
actionSchemaFactory.ts
signingSchemaFactory.ts
``​`

**Criterio de cierre:** ningún schema nuevo nace locked/readonly accidental.

---

### TASK-UI-001 — SidebarCollapseHandle simétrico

**Archivos permitidos:**

``​`txt
SidebarCollapseHandle.tsx
sidebarPanelContract.ts
LeftSidebar.tsx
RightSidebar.tsx
RightSidebar/layout.tsx
sisad-tailwind-bridge.css
``​`

**Criterio de cierre:** mismo patrón visual/funcional en ambos sidebars.

---

### TASK-SCHEMA-001 — SchemaProfileRegistry e inspector matrix

**Archivos permitidos:**

``​`txt
schemaProfileRegistry.ts
detailSchemas.ts
inspectorContracts.ts
detailSectionTaxonomy.ts
detailWidgetRegistry.tsx
schemaFamilies.ts
``​`

**Criterio de cierre:** cada schema declara familia, capacidades y secciones.

---

### TASK-OPTION-001 — Option groups y checkbox/radio unified

**Archivos permitidos:**

``​`txt
optionIndicator.ts
optionGroupFactory.ts
optionGroupRenderer.ts
optionSelectionBehavior.ts
optionValueAdapter.ts
checkbox/index.ts
checkboxGroup/index.ts
radioGroup/index.ts
GroupOptionFloatingAction.tsx
``​`

**Criterio de cierre:** click selecciona grupo; doble click cambia valor en designer.

---

### TASK-CSS-001 — CatalogLayout + density sin duplicidad

**Archivos permitidos:**

``​`txt
LeftSidebar.tsx
LeftSidebarGroup.tsx
CatalogLayoutToggle.tsx
useLeftSidebarCatalogState.ts
sisad-tailwind-bridge.css
sisad-pdfme-sidebar.css
``​`

**Criterio de cierre:** list/tiles/icons no cambian por density.

---

## 24. Prompt maestro para Codex

``​`txt
Actúa como arquitecto frontend senior experto en React, TypeScript, Tailwind, pdfme, Moveable, Selecto, CommandBus, SOLID, schemas plugin-based e inspectores tipo DocuSign-like.

Proyecto:
~/Documents/Taylor/frontend/prueba-plugin

Ruta de validación:
http://localhost:5174/lab/multi-document-routing

Problema:
El diseñador SISAD PDFME tiene regresiones funcionales en selección, canvas, schemas, lock/readonly, sidebars, owner color y DetailView. No hagas parches visuales. Primero estabiliza contratos.

Inicio obligatorio:
1. git status --short
2. Leer:
   - ai/start/START.md
   - ai/router/ROUTER.md
   - ai/router/CONTEXT_BUDGET.md
   - ai/memory/project-memory.md
3. Elegir una sola task-card.
4. Máximo 2 búsquedas rg generales.
5. Máximo 8 archivos abiertos.
6. Máximo 5 archivos modificados por pasada.
7. Si requiere más, detenerse y crear nueva task-card.

Reglas:
- No tocar StepOne, StepTwo host, ContentCustomForm negocio, Uanataca, liveness, APIs SISAD, externalForms negocio.
- No tocar Generator/pdf-lib salvo contrato explícito.
- No tocar SnapshotAdapter salvo task específica.
- No modificar Moveable/Selecto por z-index; resolver con policies/guards.
- No usar setTimeout para geometría, selección ni render.
- No crear CSS disperso.
- No usar as any nuevo.
- No duplicar inspector, sidebars, canvas ni renderer de schemas.
- Cada componente nuevo debe ser genérico y autoconfigurable.

Datos que nunca deben perderse:
schemaUid, type, documentId, fileId, pageNumber, pageIndex, x, y, width, height, rotation, ownerRecipientId, ownerRecipientIds, ownerColor, recipientColor, userColor, required, readOnly, readonly, locked, hidden, groupId, optionId, selectedOptionIds, selectedOptionId, selectedValue, defaultValue, options, __designer, dataLabel, tooltip.

Objetivo de esta pasada:
Selecciona solo una de estas tareas:
- SelectionPolicy + interactionTargetResolver.
- SchemaAccessResolver + lock/readonly sync.
- SchemaCreationPolicy para defaults de drag/drop.
- SidebarCollapseHandle simétrico.
- SchemaProfileRegistry + inspector matrix.
- Option groups unified behavior.
- CatalogLayout + density.

Entrega final:
# Resultado
## Task-card ejecutada
## Router decision
## Archivos revisados
## Diagnóstico
## Causa raíz
## Cambios realizados
## Archivos modificados
## Tests ejecutados
## Riesgos pendientes
## Siguiente task-card recomendada
``​`

---

## 25. Criterios finales de aceptación global

El plan se considera completo cuando:

``​`txt
[ ] selección simple funciona en todos los schemas;
[ ] selección múltiple funciona en macOS y Windows/Linux;
[ ] selección por región funciona sin capturar overlays;
[ ] locked/readonly se sincroniza entre canvas, list y inspector;
[ ] schemas nuevos no nacen bloqueados accidentalmente;
[ ] owner color se propaga igual en wrapper, catálogo, list, detail y preview;
[ ] LeftSidebar y RightSidebar tienen colapso simétrico;
[ ] catálogo usa list/tiles/icons + density separada;
[ ] DetailView renderiza por perfil de schema;
[ ] checkbox/radio/groups comparten optionIndicator;
[ ] custom fields no muestran controles no persistidos;
[ ] CommandBus es la vía única de mutación;
[ ] snapshot roundtrip conserva metadata crítica;
[ ] no hay hacks de z-index ni setTimeout;
[ ] no se crea CSS disperso fuera del bridge/runtime;
[ ] build, lint, unit tests y E2E críticos pasan.
``​`

---

## 26. Riesgos y decisiones pendientes

| Riesgo | Decisión recomendada |
|---|---|
| Cambios previos de Codex mezclados | Crear branch limpio y separar commits. |
| CSS global pisa Tailwind bridge | Crear auditoría de selectores y decommission por fases. |
| SnapshotAdapter muy sensible | No tocar hasta tener tests de roundtrip. |
| Moveable/Selecto frágiles | Resolver con interactionTargetResolver antes de editar componentes. |
| Inspector muy genérico | Crear matriz por familia antes de tocar widgets. |
| `any` acumulado | Task específica después de estabilizar comportamiento. |
| Option groups complejos | Mantener root como schema; options internas nunca schemas. |
| Host SISAD puede contaminar estilos | Aislar runtime y evitar selectores host sobre clases internas. |

---

## 27. Conclusión

La solución no debe ser una nueva capa visual sobre un comportamiento inestable. El diseñador necesita primero una base contractual:

``​`txt
SelectionPolicy
+ InteractionTargetResolver
+ SchemaAccessResolver
+ SchemaCreationPolicy
+ SelectedSchemaViewModel
+ SchemaOwnerAppearance
+ SchemaProfileRegistry
+ CommandBus mutation pipeline
``​`

Después de eso, la mejora UX/UI con Tailwind será estable y reutilizable. Si se empieza por compactar sidebars o cambiar estilos sin resolver esos contratos, los bugs de selección, bloqueo y sincronización volverán a aparecer.
```

<a id="file-0098"></a>

### 0098 — `.github/copilot-instructions.md`

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

<a id="file-0099"></a>

### 0099 — `ai/README.md`

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

<a id="file-0100"></a>

### 0100 — `ai/tree.md`

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

<a id="file-0101"></a>

### 0101 — `reports/jsdoc-missing-report.md`

- **Lenguaje:** `markdown`
- **Líneas:** `2254`
- **Tamaño original:** `78.0 KB`
- **SHA1 corto:** `c9bc8ee23c`
- **Estado:** `completo`

```markdown
# Reporte de JSDoc faltante

- Modo: `write`
- Scope: `api`
- Root: `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin`
- Archivos revisados: `298`
- Archivos con cambios: `249`
- Bloques JSDoc pendientes/agregados: `1479`

## Rutas incluidas

- `src/sisad-pdfme`

## Rutas excluidas

- `node_modules`
- `dist`
- `build`
- `coverage`
- `.git`
- `.next`
- `.vite`
- `.turbo`
- `.tailwind-migration-backups`
- `reports`
- `src/sisad-pdfme/pdf-lib`

## Detalle

### src/sisad-pdfme/canvas/overlayManager.ts

- Línea 36: `type` `OverlayZLevel`
- Línea 172: `method` `close`
- Línea 204: `method` `isOpen`
- Línea 208: `method` `getActive`
- Línea 212: `method` `getByType`
- Línea 247: `function` `createOverlayManager`

### src/sisad-pdfme/canvas/useCanvasRenderState.ts

- Línea 19: `interface` `CanvasRenderStateInput`

### src/sisad-pdfme/collaboration/lockManager.ts

- Línea 29: `interface` `LockTTLConfig`
- Línea 38: `variable` `DEFAULT_LOCK_TTL`
- Línea 44: `type` `LockResult`
- Línea 48: `type` `LockSubscriber`
- Línea 57: `class` `LockManager`
- Línea 155: `method` `clearInterval`

### src/sisad-pdfme/collaboration/recipientPalette.ts

- Línea 20: `type` `CollaboratorUser`
- Línea 26: `type` `RecipientAppearanceOptions`

### src/sisad-pdfme/collaboration/schemaLockGuard.ts

- Línea 48: `interface` `SchemaLockGuardOptions`

### src/sisad-pdfme/collaboration/schemaOwnershipAppearance.ts

- Línea 9: `type` `OwnerColorSource`
- Línea 15: `type` `SchemaOwnershipAppearanceOptions`
- Línea 24: `variable` `DEFAULT_PRIORITY`
- Línea 31: `type` `OwnerAwareSchema`

### src/sisad-pdfme/commands/index.ts

- Línea 12: `variable` `designerCommands`
- Línea 19: `variable` `schemaCommands`
- Línea 23: `variable` `commentCommands`
- Línea 28: `variable` `documentCommands`
- Línea 32: `function` `registerDesignerCommands`

### src/sisad-pdfme/common/constants.ts

- Línea 14: `variable` `PT_TO_MM_RATIO`
- Línea 15: `variable` `MM_TO_PT_RATIO`

### src/sisad-pdfme/common/dynamicTemplate.ts

- Línea 275: `variable` `PARALLEL_LIMIT`

### src/sisad-pdfme/common/helper.ts

- Línea 239: `function` `checkPlugins`

### src/sisad-pdfme/common/schema.ts

- Línea 138: `variable` `SchemaComment`
- Línea 176: `variable` `Schema`
- Línea 232: `variable` `BlankPdf`
- Línea 239: `variable` `CustomPdf`
- Línea 245: `variable` `LegacySchemaPageArray`
- Línea 246: `variable` `SchemaPageArray`
- Línea 257: `variable` `Inputs`
- Línea 269: `variable` `Plugin`
- Línea 293: `variable` `GeneratorOptions`
- Línea 328: `variable` `UIProps`
- Línea 333: `variable` `PreviewProps`

### src/sisad-pdfme/common/types.ts

- Línea 224: `interface` `PluginRegistry`
- Línea 237: `type` `Lang`
- Línea 238: `type` `Dict`
- Línea 239: `type` `Mode`
- Línea 240: `type` `Size`
- Línea 241: `type` `CommentScope`
- Línea 242: `type` `Schema`
- Línea 243: `type` `SchemaForUI`
- Línea 244: `type` `SchemaCommentReply`
- Línea 245: `type` `SchemaComment`
- Línea 246: `type` `CommentAnchor`
- Línea 247: `type` `PdfComment`
- Línea 248: `type` `PdfCommentReply`
- Línea 259: `type` `ColorType`
- Línea 260: `type` `BasePdf`
- Línea 261: `type` `BlankPdf`
- Línea 262: `type` `CustomPdf`
- Línea 263: `type` `Template`
- Línea 264: `type` `CommonOptions`
- Línea 265: `type` `GeneratorOptions`
- Línea 266: `type` `GenerateProps`
- Línea 267: `type` `UIOptions`
- Línea 268: `type` `UIProps`
- Línea 269: `type` `PreviewProps`
- Línea 270: `type` `DesignerProps`
- Línea 271: `type` `SchemaPageArray`
- Línea 272: `type` `LegacySchemaPageArray`

### src/sisad-pdfme/context/RecipientContext.ts

- Línea 15: `interface` `Recipient`
- Línea 28: `variable` `UNASSIGNED_SCHEMA_LABEL`
- Línea 30: `interface` `RecipientContextValue`
- Línea 50: `variable` `RecipientContext`

### src/sisad-pdfme/contracts/assignments.ts

- Línea 1: `type` `SchemaAssignments`
- Línea 3: `type` `LegacySchemaAssignments`

### src/sisad-pdfme/contracts/commands.ts

- Línea 1: `type` `CommandObserverEvent`
- Línea 12: `type` `CommandObserverPayload`
- Línea 21: `type` `CommandExecutionContext`
- Línea 25: `type` `Command`
- Línea 33: `type` `SchemaDesignerConfig`

### src/sisad-pdfme/contracts/comments.ts

- Línea 1: `type` `CommentAnchor`
- Línea 15: `type` `PdfCommentReply`
- Línea 25: `type` `PdfComment`
- Línea 41: `type` `TopLevelPdfCommentEntry`

### src/sisad-pdfme/contracts/plugins.ts

- Línea 1: `type` `SchemaInspectorSection`
- Línea 13: `type` `PluginActionDefinition`
- Línea 33: `type` `PluginStrategyDefinition`
- Línea 39: `type` `PluginFamilyDefinition`

### src/sisad-pdfme/contracts/schema.ts

- Línea 3: `type` `SchemaIdentity`
- Línea 15: `type` `CollaborativeSchemaContract`

### src/sisad-pdfme/documents/index.ts

- Línea 5: `type` `DocumentLike`
- Línea 34: `variable` `normalizeTemplatePagesForDocument`
- Línea 61: `variable` `normalizeDocuments`
- Línea 75: `variable` `resolveActiveDocument`
- Línea 88: `function` `pdfToImages`
- Línea 91: `function` `pdfToPageSizes`
- Línea 94: `function` `imagesToPdf`
- Línea 97: `variable` `getPdfPageSizes`
- Línea 99: `variable` `filterSchemasByFileAndPage`
- Línea 123: `variable` `reconcileTemplateDocuments`
- Línea 137: `variable` `mergeDesignerDocumentIntoFile`

### src/sisad-pdfme/externalForms/externalFormRunner.ts

- Línea 19: `interface` `FlowState`
- Línea 50: `interface` `ExternalFormRunnerProps`
- Línea 64: `type` `SchemaVisibility`
- Línea 130: `class` `InMemoryExternalFormStorage`
- Línea 134: `method` `saveInput`
- Línea 138: `method` `getInputs`
- Línea 149: `method` `hasInput`
- Línea 153: `method` `clearInputs`

### src/sisad-pdfme/generator/constants.ts

- Línea 1: `variable` `TOOL_NAME`

### src/sisad-pdfme/generator/helper.ts

- Línea 19: `function` `getEmbedPdfPages`
- Línea 62: `function` `validateRequiredFields`
- Línea 74: `function` `preprocessing`
- Línea 126: `function` `postProcessing`
- Línea 150: `variable` `insertPage`

### src/sisad-pdfme/generator/index.ts

- Línea 14: `variable` `generatePdf`
- Línea 16: `variable` `buildDynamicTemplate`
- Línea 18: `function` `generatePdfWithPreflight`
- Línea 24: `variable` `generatePdfBuffer`

### src/sisad-pdfme/generator/preflight.ts

- Línea 16: `type` `PdfPreflightIssueSeverity`
- Línea 18: `type` `PdfPreflightIssue`
- Línea 29: `type` `PdfPreflightPageReport`
- Línea 38: `type` `PdfPreflightReport`
- Línea 373: `variable` `createPdfPreflightReport`

### src/sisad-pdfme/generator/types.ts

- Línea 1: `type` `EmbedPdfBox`

### src/sisad-pdfme/integration/index.ts

- Línea 84: `function` `getSchemaCatalog`
- Línea 92: `function` `normalizeTemplateForRuntime`

### src/sisad-pdfme/integration/schemaController.ts

- Línea 3: `variable` `DEFAULT_TEMPLATE_SCHEMA_VERSION`
- Línea 39: `function` `createSchemaController`

### src/sisad-pdfme/runtime/runtimeModes.ts

- Línea 40: `type` `ResolveInitialUxModeArgs`

### src/sisad-pdfme/schemas/actions/actionSchemaFactory.ts

- Línea 16: `type` `NoteSchema`
- Línea 56: `type` `AttachmentSchema`

### src/sisad-pdfme/schemas/actions/approve.ts

- Línea 16: `type` `ApproveSchema`

### src/sisad-pdfme/schemas/actions/attachment.ts

- Línea 20: `variable` `MIME_TYPE_OPTIONS`

### src/sisad-pdfme/schemas/actions/decline.ts

- Línea 15: `type` `DeclineSchema`

### src/sisad-pdfme/schemas/barcodes/constants.ts

- Línea 19: `variable` `DEFAULT_BARCODE_BG_COLOR`
- Línea 21: `variable` `DEFAULT_BARCODE_COLOR`
- Línea 23: `variable` `DEFAULT_BARCODE_INCLUDETEXT`

### src/sisad-pdfme/schemas/barcodes/helper.ts

- Línea 28: `function` `validateBarcodeInput`
- Línea 130: `variable` `createBarCode`

### src/sisad-pdfme/schemas/barcodes/pdfRender.ts

- Línea 11: `function` `pdfRender`

### src/sisad-pdfme/schemas/barcodes/propPanel.ts

- Línea 191: `variable` `getPropPanelByBarcodeType`

### src/sisad-pdfme/schemas/barcodes/types.ts

- Línea 4: `interface` `BarcodeSchema`
- Línea 12: `type` `BarcodeTypes`

### src/sisad-pdfme/schemas/barcodes/uiRender.ts

- Línea 36: `function` `uiRender`

### src/sisad-pdfme/schemas/checkbox/index.ts

- Línea 18: `variable` `CHECKBOX_DOUBLE_CLICK_MS`
- Línea 21: `interface` `Checkbox`

### src/sisad-pdfme/schemas/checkboxGroup/index.ts

- Línea 41: `type` `CheckboxOption`
- Línea 43: `type` `CheckboxGroupSchema`
- Línea 315: `variable` `__test__`

### src/sisad-pdfme/schemas/constants.ts

- Línea 1: `variable` `DEFAULT_OPACITY`
- Línea 2: `variable` `HEX_COLOR_PATTERN`

### src/sisad-pdfme/schemas/date/helper.ts

- Línea 60: `interface` `AirDatepickerInstance`
- Línea 67: `type` `PickerType`
- Línea 69: `interface` `Locale`
- Línea 75: `variable` `LOCALE_MAP`
- Línea 202: `function` `getPlugin`

### src/sisad-pdfme/schemas/date/types.ts

- Línea 4: `interface` `DateSchema`

### src/sisad-pdfme/schemas/graphics/image.ts

- Línea 24: `type` `ImageSchema`

### src/sisad-pdfme/schemas/graphics/imagehelper.ts

- Línea 5: `type` `IImage`
- Línea 43: `variable` `JPG`
- Línea 82: `variable` `PNG`
- Línea 116: `type` `imageType`
- Línea 135: `variable` `getImageDimension`

### src/sisad-pdfme/schemas/graphics/svg.ts

- Línea 46: `type` `SVGSchema`

### src/sisad-pdfme/schemas/groupSchemaRender.ts

- Línea 18: `variable` `hexAlpha`
- Línea 43: `variable` `applyOptionGroupBodyVariant`
- Línea 57: `variable` `applyOptionGroupRowVariant`
- Línea 74: `type` `GroupRenderOptions`

### src/sisad-pdfme/schemas/index.ts

- Línea 151: `variable` `registerFieldPlugin`
- Línea 166: `function` `registerPlugins`
- Línea 173: `function` `getSchemaPluginByType`
- Línea 176: `function` `getBuiltInFields`
- Línea 178: `variable` `getSchemaDefinition`
- Línea 187: `function` `getSchemaFamily`
- Línea 189: `variable` `generateUniqueSchemaName`
- Línea 206: `variable` `validateSchemaNameUniqueness`
- Línea 233: `variable` `createDefaultSchema`
- Línea 297: `function` `changeSchemas`
- Línea 321: `function` `createSchemaBuilder`

### src/sisad-pdfme/schemas/modules.d.ts

- Línea 2: `type` `RenderOptions`
- Línea 11: `type` `SegmenterGranularity`
- Línea 12: `interface` `SegmenterOptions`
- Línea 16: `interface` `SegmentData`
- Línea 22: `interface` `Segments`
- Línea 25: `interface` `Segmenter`
- Línea 28: `interface` `SegmenterConstructor`

### src/sisad-pdfme/schemas/multiVariableText/helper.ts

- Línea 5: `variable` `parseVariablesInput`
- Línea 25: `variable` `getMissingVariables`
- Línea 34: `variable` `substituteVariables`
- Línea 64: `variable` `validateVariables`

### src/sisad-pdfme/schemas/multiVariableText/pdfRender.ts

- Línea 6: `function` `pdfRender`

### src/sisad-pdfme/schemas/multiVariableText/propPanel.ts

- Línea 77: `variable` `propPanel`

### src/sisad-pdfme/schemas/multiVariableText/types.ts

- Línea 3: `interface` `MultiVariableTextSchema`

### src/sisad-pdfme/schemas/multiVariableText/uiRender.ts

- Línea 12: `function` `uiRender`

### src/sisad-pdfme/schemas/options/OptionListWidget.tsx

- Línea 5: `type` `Props`
- Línea 10: `function` `OptionListWidget`

### src/sisad-pdfme/schemas/options/optionGroupEditorFactory.ts

- Línea 5: `type` `OptionGroupEditorItem`
- Línea 10: `type` `OptionGroupEditorConfig`
- Línea 25: `type` `CreateOptionGroupOptionsEditorConfig`
- Línea 36: `variable` `createOptionGroupEditor`
- Línea 151: `variable` `createOptionGroupOptionsEditor`

### src/sisad-pdfme/schemas/options/optionGroupFactory.ts

- Línea 46: `type` `OptionGroupIndicatorShape`
- Línea 48: `type` `OptionGroupPluginConfig`
- Línea 54: `type` `SimpleOption`
- Línea 56: `type` `OptionGroupDesignerSchema`
- Línea 68: `type` `OptionGroupRootRuntimeParams`
- Línea 75: `type` `OptionGroupRuntimeSharedParams`
- Línea 92: `type` `OptionGroupDesignerDimensions`
- Línea 97: `type` `OptionGroupUiRenderParams`
- Línea 107: `type` `OptionGroupDefaultSchemaParams`
- Línea 125: `type` `OptionGroupDefaultSchema`
- Línea 160: `type` `OptionGroupPropPanelConfig`
- Línea 174: `variable` `resolveOptionGroupKey`
- Línea 177: `variable` `syncDesignerOptionGroupPatch`
- Línea 187: `variable` `resolveOptionGroupReadOnly`
- Línea 217: `variable` `buildOptionGroupRuntimeSharedParams`
- Línea 235: `variable` `buildOptionGroupDesignerDimensions`
- Línea 243: `variable` `renderOptionGroupUi`
- Línea 272: `variable` `buildOptionGroupDefaultSchema`
- Línea 327: `function` `createOptionGroupPropPanelConfig`
- Línea 460: `type` `SyncParams`

### src/sisad-pdfme/schemas/options/optionGroupLayout.ts

- Línea 16: `type` `OptionGroupType`
- Línea 18: `variable` `OPTION_GROUP_TYPES`
- Línea 20: `type` `OptionGroupLayoutConfig`
- Línea 27: `variable` `CHECKBOX_GROUP_LAYOUT`
- Línea 32: `variable` `RADIO_GROUP_LAYOUT`
- Línea 37: `variable` `getOptionGroupLayoutConfig`
- Línea 66: `variable` `optionGroupDesignerWidthMM`
- Línea 69: `variable` `normalizeOptionGroupType`
- Línea 76: `variable` `isOptionGroupType`

### src/sisad-pdfme/schemas/options/optionGroupPdfRender.ts

- Línea 5: `type` `OptionGroupPdfParams`
- Línea 17: `variable` `renderOptionGroupPdf`
- Línea 34: `variable` `BOX_SIZE`
- Línea 35: `variable` `GAP`

### src/sisad-pdfme/schemas/options/optionGroupRenderer.ts

- Línea 14: `type` `OptionGroupRenderMode`
- Línea 21: `variable` `OPTION_DOUBLE_CLICK_MS`
- Línea 24: `type` `OptionGroupRuntimeParams`
- Línea 60: `variable` `createOptionGroupRuntime`

### src/sisad-pdfme/schemas/options/optionIndicator.ts

- Línea 1: `type` `OptionIndicatorShape`
- Línea 2: `type` `OptionIndicatorMode`
- Línea 4: `type` `OptionIndicatorParams`
- Línea 99: `variable` `getOptionIndicatorAriaRole`
- Línea 110: `variable` `getOptionIndicatorIcon`
- Línea 114: `variable` `renderOptionIndicatorSvg`
- Línea 116: `variable` `createOptionIndicatorElement`

### src/sisad-pdfme/schemas/options/optionModel.ts

- Línea 3: `variable` `normalizeText`
- Línea 5: `type` `NormalizeOptionGroupSourceOptions`
- Línea 10: `variable` `buildDefaultOptionGroupOptions`
- Línea 19: `variable` `normalizeOptionGroupOptions`
- Línea 29: `variable` `normalizeOptionId`
- Línea 38: `variable` `normalizeOptionsFromSource`
- Línea 75: `function` `ensureAtLeastOneOption`

### src/sisad-pdfme/schemas/options/optionPropPanel.tsx

- Línea 7: `type` `Props`
- Línea 12: `function` `OptionListEditor`

### src/sisad-pdfme/schemas/options/optionSelectionBehavior.ts

- Línea 29: `variable` `resolveSingleOptionSelection`
- Línea 41: `variable` `resolveMultiOptionSelection`
- Línea 52: `variable` `toggleMultiOptionSelection`
- Línea 81: `variable` `clampMultiOptionSelection`
- Línea 106: `variable` `normalizeStringOptions`
- Línea 120: `variable` `resolveCompactSelection`

### src/sisad-pdfme/schemas/options/optionTypes.ts

- Línea 1: `type` `OptionItem`
- Línea 8: `type` `OptionSelectionMode`
- Línea 10: `interface` `OptionGroupConfig`

### src/sisad-pdfme/schemas/options/optionValueAdapter.ts

- Línea 5: `type` `CheckboxToGroupPatchSchema`
- Línea 9: `variable` `buildCheckboxToGroupPatch`

### src/sisad-pdfme/schemas/propPanel/commonInspectorFields.ts

- Línea 11: `variable` `requiredField`
- Línea 18: `variable` `readOnlyField`
- Línea 25: `variable` `lockedField`
- Línea 32: `variable` `restrictChangesField`
- Línea 47: `variable` `placeholderTextField`
- Línea 54: `variable` `defaultValueField`
- Línea 61: `variable` `maxLengthField`
- Línea 69: `variable` `maskedField`
- Línea 76: `variable` `fixedWidthField`
- Línea 85: `variable` `tooltipField`
- Línea 93: `variable` `helpTextField`
- Línea 109: `variable` `dataLabelField`
- Línea 117: `variable` `tabLabelField`
- Línea 125: `variable` `fieldKeyField`
- Línea 142: `variable` `validationTypeField`
- Línea 165: `variable` `validationPatternField`
- Línea 174: `variable` `validationMessageField`
- Línea 182: `variable` `validationMinField`
- Línea 189: `variable` `validationMaxField`
- Línea 205: `variable` `numberFormatField`
- Línea 220: `variable` `currencyField`
- Línea 228: `variable` `decimalsField`
- Línea 236: `variable` `thousandSeparatorField`
- Línea 243: `variable` `allowNegativeField`
- Línea 250: `variable` `positiveFormatField`
- Línea 258: `variable` `negativeFormatField`
- Línea 279: `variable` `mandatoryField`
- Línea 286: `variable` `editableBySenderField`
- Línea 293: `variable` `editableByRecipientField`

### src/sisad-pdfme/schemas/radioGroup/index.ts

- Línea 12: `type` `RadioGroupSchema`
- Línea 50: `type` `RadioOption`

### src/sisad-pdfme/schemas/schemaBuilder.ts

- Línea 6: `type` `SchemaCapability`
- Línea 16: `type` `SchemaDefinition`
- Línea 25: `type` `SchemaPluginWithMetadata`
- Línea 29: `type` `AnySchemaPlugin`
- Línea 30: `type` `SchemaPluginEntry`
- Línea 34: `type` `SchemaPluginMap`
- Línea 36: `function` `renderLucideIcon`
- Línea 87: `variable` `createSchemaPlugin`
- Línea 125: `function` `getSchemaDefinition`
- Línea 150: `function` `flattenSchemaPlugins`
- Línea 164: `function` `listSchemaDefinitions`

### src/sisad-pdfme/schemas/schemaFamilies.ts

- Línea 10: `type` `SchemaFamily`
- Línea 11: `type` `LegacySchemaFamily`
- Línea 12: `type` `SchemaSemanticFamily`
- Línea 25: `type` `FamilyPreset`
- Línea 33: `type` `FamilyPresetConfig`
- Línea 40: `variable` `TEXT_TYPES`
- Línea 47: `variable` `BOOLEAN_TYPES`
- Línea 48: `variable` `MEDIA_TYPES`
- Línea 49: `variable` `ACTION_TYPES`
- Línea 50: `variable` `OPTION_TYPES`
- Línea 51: `variable` `DATE_TYPES`
- Línea 52: `variable` `SIGNING_TYPES`
- Línea 53: `variable` `TEXTUAL_TYPES`
- Línea 62: `variable` `SHAPE_BARCODE_TYPES`
- Línea 80: `variable` `SEMANTIC_FAMILY_BY_TYPE`
- Línea 104: `variable` `BASE_PROPERTY_MAP`
- Línea 165: `variable` `FAMILY_PRESETS`
- Línea 288: `variable` `LEGACY_TO_CANONICAL`
- Línea 298: `variable` `normalizeSchemaFamily`
- Línea 301: `variable` `resolveSchemaFamily`
- Línea 311: `variable` `resolveSchemaSemanticFamily`
- Línea 329: `variable` `getSchemaFamilyInspectorPreset`
- Línea 341: `variable` `getSchemaTypeInspectorPreset`
- Línea 344: `variable` `createSchemaInspectorConfig`

### src/sisad-pdfme/schemas/select/index.ts

- Línea 15: `interface` `Select`

### src/sisad-pdfme/schemas/shapes/line.ts

- Línea 12: `variable` `DEFAULT_LINE_COLOR`
- Línea 13: `variable` `HIT_POINT_HEIGHT`
- Línea 15: `interface` `LineSchema`

### src/sisad-pdfme/schemas/shapes/rectAndEllipse.ts

- Línea 8: `interface` `ShapeSchema`
- Línea 151: `variable` `rectangle`
- Línea 157: `variable` `ellipse`

### src/sisad-pdfme/schemas/shared/fieldChrome.ts

- Línea 14: `variable` `DESIGNER_OPTION_BOX_BORDER`
- Línea 15: `variable` `DESIGNER_OPTION_BOX_BG`
- Línea 65: `type` `SchemaRenderMode`
- Línea 67: `type` `FieldChromePolicyState`
- Línea 77: `type` `FieldChromePolicyInput`
- Línea 90: `type` `FieldChromePolicyResult`
- Línea 149: `variable` `resolveSchemaOwnerTone`
- Línea 247: `type` `ApplyFieldChromeOptions`

### src/sisad-pdfme/schemas/shared/renderSchemaWithChrome.ts

- Línea 17: `type` `RenderSchemaWithChromeOptions`

### src/sisad-pdfme/schemas/shared/schemaDom.ts

- Línea 93: `interface` `ActionButtonOptions`

### src/sisad-pdfme/schemas/shared/schemaGuards.ts

- Línea 13: `type` `OptionGroupSchemaLike`
- Línea 18: `type` `CheckboxGroupSchemaLike`
- Línea 22: `type` `RadioGroupSchemaLike`
- Línea 26: `function` `isOptionGroupSchema`
- Línea 32: `function` `isCheckboxGroupSchema`
- Línea 38: `function` `isRadioGroupSchema`
- Línea 44: `function` `isSelectSchema`
- Línea 48: `function` `isOptionBasedSchema`
- Línea 57: `function` `isCheckboxSchema`
- Línea 63: `type` `ActionKind`
- Línea 65: `function` `isActionSchema`
- Línea 78: `type` `SigningKind`
- Línea 80: `function` `isSigningSchema`
- Línea 92: `type` `TextLikeKind`
- Línea 103: `function` `isTextLikeSchema`
- Línea 106: `variable` `TEXT_LIKE_TYPES`
- Línea 115: `type` `RawOptionItem`
- Línea 142: `type` `SchemaIdentityLike`

### src/sisad-pdfme/schemas/shared/schemaTypes.ts

- Línea 8: `type` `UnknownRecord`
- Línea 14: `type` `Brand`
- Línea 16: `type` `SchemaUid`
- Línea 17: `type` `DocumentId`
- Línea 18: `type` `RecipientId`
- Línea 19: `type` `OptionId`
- Línea 20: `type` `GroupId`
- Línea 24: `type` `SchemaVisualFamily`
- Línea 35: `type` `SchemaVisualState`
- Línea 47: `type` `SchemaGeometryFields`
- Línea 55: `type` `SchemaIdentityFields`
- Línea 63: `type` `SchemaOwnershipFields`
- Línea 70: `type` `SchemaDocumentFields`
- Línea 76: `type` `SchemaBehaviorFields`
- Línea 112: `type` `SisadSchemaBase`
- Línea 123: `type` `OptionItem`
- Línea 131: `type` `OptionSelectionMode`
- Línea 133: `type` `OptionBasedSchema`
- Línea 150: `type` `ActionSchemaBase`
- Línea 158: `type` `ActionSchemaKind`
- Línea 160: `type` `SemanticTone`
- Línea 164: `type` `SigningSchemaBase`

### src/sisad-pdfme/schemas/signature/dateSigned.ts

- Línea 15: `variable` `DATE_FORMAT_OPTIONS`
- Línea 23: `variable` `DATE_LOCALE_MAP`

### src/sisad-pdfme/schemas/signature/propPanel.ts

- Línea 417: `variable` `propPanel`

### src/sisad-pdfme/schemas/signature/providerRegistry.ts

- Línea 4: `type` `SignatureProviderDefinition`
- Línea 36: `type` `SignatureProviderSource`
- Línea 68: `function` `registerSignatureProvider`
- Línea 76: `function` `registerSignatureProviders`
- Línea 81: `variable` `resolveSignatureProviderSource`
- Línea 96: `variable` `getAvailableSignatureProviders`
- Línea 105: `variable` `getSignatureProvider`
- Línea 117: `function` `hasSignatureProvider`
- Línea 120: `variable` `sanitizeSignatureProviderConfig`
- Línea 130: `variable` `validateSignatureProviderConfig`

### src/sisad-pdfme/schemas/signature/signingSchemaFactory.ts

- Línea 15: `type` `SigningSchemaKind`
- Línea 17: `type` `SigningSchemaFactoryConfig`

### src/sisad-pdfme/schemas/signature/types.ts

- Línea 3: `type` `SignatureMode`
- Línea 4: `type` `SignatureProviderKey`
- Línea 5: `type` `SignatureProviderConfig`
- Línea 6: `type` `SignatureProviderStatus`
- Línea 7: `type` `SignatureProviderDisplay`
- Línea 13: `type` `SignatureCapabilities`
- Línea 23: `type` `SignatureDisplayConfig`
- Línea 32: `type` `SignatureProviderSupport`
- Línea 39: `variable` `SIGNATURE_MODE_OPTIONS`
- Línea 46: `variable` `SIGNATURE_TYPE_OPTIONS`
- Línea 48: `variable` `DEFAULT_SIGNATURE_CAPABILITIES`
- Línea 58: `variable` `DEFAULT_SIGNATURE_DISPLAY`
- Línea 67: `variable` `MODE_CAPABILITIES`
- Línea 106: `variable` `MODE_DISPLAY`
- Línea 141: `variable` `LEGACY_PROVIDER_MODE_MAP`
- Línea 149: `variable` `SIGNATURE_PROVIDER_STATUS_VALUES`
- Línea 187: `variable` `resolveLegacySignatureMode`
- Línea 197: `function` `resolveSignatureProviderKey`
- Línea 207: `variable` `sanitizeSignatureMetadata`
- Línea 263: `variable` `createModeAwareCapabilities`
- Línea 271: `variable` `createModeAwareDisplay`
- Línea 289: `interface` `SignatureSchema`
- Línea 306: `variable` `normalizeSignatureSchema`

### src/sisad-pdfme/schemas/signature/validation.ts

- Línea 4: `type` `SignatureValidationResult`
- Línea 13: `variable` `validateSignatureSchema`

### src/sisad-pdfme/schemas/tables/classes.ts

- Línea 6: `type` `ContentSettings`
- Línea 8: `class` `Cell`
- Línea 32: `method` `getContentHeight`
- Línea 40: `method` `padding`
- Línea 45: `class` `Column`
- Línea 56: `method` `getMaxCustomCellWidth`
- Línea 66: `class` `Row`
- Línea 81: `method` `getMaxCellHeight`
- Línea 85: `method` `getMinimumRowHeight`
- Línea 96: `class` `Table`
- Línea 113: `method` `create`
- Línea 127: `method` `getHeadHeight`
- Línea 131: `method` `getBodyHeight`
- Línea 135: `method` `allRows`
- Línea 139: `method` `getWidth`
- Línea 143: `method` `getHeight`

### src/sisad-pdfme/schemas/tables/dynamicTemplate.ts

- Línea 6: `variable` `getDynamicHeightsForTable`
- Línea 42: `variable` `SAFETY_MARGIN`

### src/sisad-pdfme/schemas/tables/helper.ts

- Línea 16: `function` `getDefaultCellStyles`
- Línea 45: `variable` `getCellPropPanelSchema`
- Línea 169: `variable` `getColumnStylesPropPanelSchema`
- Línea 202: `variable` `getBody`
- Línea 209: `variable` `getBodyWithRange`

### src/sisad-pdfme/schemas/tables/pdfRender.ts

- Línea 10: `interface` `CreateTableArgs`
- Línea 17: `type` `Pos`
- Línea 118: `function` `pdfRender`

### src/sisad-pdfme/schemas/tables/propPanel.ts

- Línea 12: `variable` `propPanel`

### src/sisad-pdfme/schemas/tables/tableHelper.ts

- Línea 21: `type` `StyleProp`
- Línea 23: `interface` `CreateTableArgs`
- Línea 30: `interface` `UserOptions`
- Línea 252: `function` `createSingleTable`

### src/sisad-pdfme/schemas/tables/types.ts

- Línea 4: `type` `Spacing`
- Línea 5: `type` `BorderInsets`
- Línea 6: `type` `BoxDimensions`
- Línea 8: `interface` `CellStyle`
- Línea 22: `type` `CellSchema`
- Línea 24: `interface` `TableSchema`
- Línea 41: `interface` `Styles`
- Línea 58: `interface` `TableInput`
- Línea 64: `interface` `ContentInput`
- Línea 70: `interface` `Settings`
- Línea 79: `interface` `StylesProps`
- Línea 87: `type` `Section`

### src/sisad-pdfme/schemas/tables/uiRender.ts

- Línea 37: `type` `RowType`
- Línea 206: `function` `uiRender`

### src/sisad-pdfme/schemas/text/constants.ts

- Línea 3: `variable` `DEFAULT_FONT_SIZE`
- Línea 5: `variable` `ALIGN_LEFT`
- Línea 6: `variable` `ALIGN_CENTER`
- Línea 7: `variable` `ALIGN_RIGHT`
- Línea 8: `variable` `ALIGN_JUSTIFY`
- Línea 9: `variable` `DEFAULT_ALIGNMENT`
- Línea 10: `variable` `VERTICAL_ALIGN_TOP`
- Línea 11: `variable` `VERTICAL_ALIGN_MIDDLE`
- Línea 12: `variable` `VERTICAL_ALIGN_BOTTOM`
- Línea 13: `variable` `DEFAULT_VERTICAL_ALIGNMENT`
- Línea 14: `variable` `DEFAULT_LINE_HEIGHT`
- Línea 15: `variable` `DEFAULT_CHARACTER_SPACING`
- Línea 16: `variable` `DEFAULT_FONT_COLOR`
- Línea 17: `variable` `PLACEHOLDER_FONT_COLOR`
- Línea 18: `variable` `DYNAMIC_FIT_VERTICAL`
- Línea 19: `variable` `DYNAMIC_FIT_HORIZONTAL`
- Línea 20: `variable` `DEFAULT_DYNAMIC_FIT`
- Línea 21: `variable` `DEFAULT_DYNAMIC_MIN_FONT_SIZE`
- Línea 23: `variable` `DEFAULT_DYNAMIC_MAX_FONT_SIZE`
- Línea 24: `variable` `FONT_SIZE_ADJUSTMENT`
- Línea 26: `variable` `LINE_START_FORBIDDEN_CHARS`
- Línea 87: `variable` `LINE_END_FORBIDDEN_CHARS`

### src/sisad-pdfme/schemas/text/extraFormatter.ts

- Línea 30: `interface` `GroupButtonBoolean`
- Línea 36: `interface` `GroupButtonString`
- Línea 43: `type` `GroupButton`
- Línea 45: `function` `getExtraFormatterSchema`

### src/sisad-pdfme/schemas/text/helper.ts

- Línea 28: `variable` `getBrowserVerticalFontAdjustments`
- Línea 68: `function` `getFontDescentInPt`
- Línea 74: `function` `heightOfFontAtSize`
- Línea 91: `variable` `widthOfTextAtSize`
- Línea 112: `variable` `getFontKitFont`
- Línea 355: `variable` `splitTextToSize`
- Línea 375: `function` `isFirefox`
- Línea 461: `variable` `filterStartJP`
- Línea 508: `variable` `filterEndJP`

### src/sisad-pdfme/schemas/text/icons/index.ts

- Línea 13: `variable` `TextStrikethroughIcon`
- Línea 15: `variable` `TextUnderlineIcon`
- Línea 17: `variable` `TextAlignLeftIcon`
- Línea 19: `variable` `TextAlignCenterIcon`
- Línea 21: `variable` `TextAlignRightIcon`
- Línea 23: `variable` `TextAlignJustifyIcon`
- Línea 25: `variable` `TextVerticalAlignTopIcon`
- Línea 28: `variable` `TextVerticalAlignMiddleIcon`
- Línea 30: `variable` `TextVerticalAlignBottomIcon`

### src/sisad-pdfme/schemas/text/pdfRender.ts

- Línea 91: `function` `pdfRender`

### src/sisad-pdfme/schemas/text/propPanel.ts

- Línea 59: `variable` `propPanel`

### src/sisad-pdfme/schemas/text/types.ts

- Línea 4: `type` `ALIGNMENT`
- Línea 5: `type` `VERTICAL_ALIGNMENT`
- Línea 6: `type` `DYNAMIC_FONT_SIZE_FIT`
- Línea 8: `type` `FontWidthCalcValues`
- Línea 14: `interface` `TextSchema`

### src/sisad-pdfme/schemas/text/uiRender.ts

- Línea 67: `function` `uiRender`
- Línea 78: `variable` `usePlaceholder`
- Línea 188: `variable` `buildStyledTextContainer`
- Línea 299: `function` `mapVerticalAlignToFlex`

### src/sisad-pdfme/schemas/textLike/textLikePresets.ts

- Línea 10: `variable` `fullName`
- Línea 19: `variable` `emailAddress`
- Línea 28: `variable` `company`
- Línea 37: `variable` `title`

### src/sisad-pdfme/schemas/textLike/textLikeSchemaFactory.ts

- Línea 20: `type` `TextLikePresetConfig`

### src/sisad-pdfme/schemas/utils.ts

- Línea 8: `variable` `convertForPdfLayoutProps`
- Línea 47: `variable` `rotatePoint`
- Línea 66: `variable` `getDynamicHeightsForTable`
- Línea 70: `function` `addAlphaToHex`
- Línea 80: `function` `isEditable`
- Línea 97: `function` `hex2RgbColor`
- Línea 151: `function` `hex2PrintingColor`
- Línea 157: `variable` `readFile`
- Línea 185: `function` `createErrorElm`
- Línea 214: `variable` `createSvgStr`

### src/sisad-pdfme/schemas/values/schemaValueAdapter.ts

- Línea 3: `type` `SchemaRecord`
- Línea 5: `variable` `getSchemaTextValue`
- Línea 12: `variable` `getSchemaNumberValue`
- Línea 19: `variable` `getSchemaBooleanValue`
- Línea 27: `variable` `getSchemaOptionSelection`

### src/sisad-pdfme/shared/commandTypes.ts

- Línea 85: `interface` `ResizePayload`
- Línea 86: `interface` `RotatePayload`
- Línea 87: `interface` `EditPayload`
- Línea 88: `interface` `DeletePayload`
- Línea 89: `interface` `DuplicatePayload`
- Línea 90: `interface` `CopyPayload`
- Línea 91: `interface` `PastePayload`
- Línea 92: `interface` `ZOrderPayload`
- Línea 93: `interface` `AssignRecipientPayload`
- Línea 99: `interface` `LockPayload`
- Línea 100: `interface` `UnlockPayload`
- Línea 101: `interface` `CommentPayload`
- Línea 102: `interface` `GroupPayload`
- Línea 103: `interface` `UngroupPayload`

### src/sisad-pdfme/shared/interactionGuards.ts

- Línea 38: `type` `GuardResult`
- Línea 49: `type` `GuardRejectionReason`
- Línea 58: `variable` `ALLOWED`

### src/sisad-pdfme/shared/keyboardShortcuts.ts

- Línea 12: `type` `InternalAction`
- Línea 21: `type` `ShortcutAction`
- Línea 23: `interface` `ShortcutDefinition`
- Línea 46: `variable` `KEYBOARD_SHORTCUTS`
- Línea 309: `variable` `TOOLBAR_SINGLE`
- Línea 313: `variable` `TOOLBAR_MULTI`

### src/sisad-pdfme/shared/localFormStorage.ts

- Línea 22: `variable` `FORM_PREFIX`
- Línea 26: `interface` `LocalFormStorageOptions`
- Línea 34: `class` `LocalFormStorage`
- Línea 43: `method` `saveInput`
- Línea 52: `method` `getInputs`
- Línea 68: `method` `hasInput`
- Línea 80: `method` `clearInputs`
- Línea 228: `method` `length`

### src/sisad-pdfme/shared/localMode.ts

- Línea 33: `type` `CollaborationMode`
- Línea 35: `interface` `LocalModeConfig`
- Línea 50: `interface` `LocalModeOptions`
- Línea 170: `function` `diagnoseLocalMode`

### src/sisad-pdfme/shared/localSnapshotStore.ts

- Línea 23: `variable` `KEY_PREFIX`
- Línea 27: `interface` `SnapshotIndexEntry`
- Línea 34: `interface` `LocalSnapshotStoreOptions`
- Línea 43: `class` `LocalStorageQuotaError`
- Línea 45: `method` `super`
- Línea 53: `class` `SnapshotNotFoundError`
- Línea 55: `method` `super`
- Línea 62: `class` `LocalSnapshotStoreImpl`
- Línea 192: `method` `length`

### src/sisad-pdfme/shared/schemaDesignerMeta.ts

- Línea 48: `interface` `SchemaDesignerMeta`

### src/sisad-pdfme/shared/signatureRegistry.ts

- Línea 19: `interface` `SignatureCaptureContext`
- Línea 27: `interface` `SignatureExecutionContext`
- Línea 33: `type` `SignatureResult`
- Línea 37: `type` `SignatureValidation`
- Línea 57: `interface` `ExternalSignatureAdapter`
- Línea 64: `interface` `SignaturePolicy`
- Línea 79: `class` `ProviderNotRegisteredError`
- Línea 81: `method` `super`
- Línea 90: `class` `SignatureProviderRegistryImpl`
- Línea 93: `method` `register`
- Línea 97: `method` `get`
- Línea 105: `method` `tryGet`
- Línea 109: `method` `getAvailable`
- Línea 115: `method` `isRegistered`
- Línea 119: `method` `getAll`
- Línea 123: `method` `_clearForTest`
- Línea 128: `variable` `signatureProviderRegistry`
- Línea 132: `function` `getAvailableProvidersForSchema`
- Línea 151: `function` `getDefaultProviderForSchema`

### src/sisad-pdfme/shared/snapshot.ts

- Línea 34: `interface` `SnapshotPage`
- Línea 42: `interface` `SnapshotDocument`
- Línea 50: `interface` `SnapshotRecipient`
- Línea 60: `interface` `SnapshotAssignment`
- Línea 67: `interface` `SignatureConfig`
- Línea 75: `interface` `ProviderConfig`
- Línea 85: `interface` `SnapshotComment`
- Línea 95: `interface` `SnapshotMetadata`

### src/sisad-pdfme/shared/snapshotAdapter.ts

- Línea 31: `interface` `ValidationResult`
- Línea 46: `class` `SnapshotAdapterImpl`
- Línea 320: `variable` `snapshotAdapter`
- Línea 347: `function` `parsePdfmeSnapshot`
- Línea 350: `function` `extractDocumentsFromSnapshot`
- Línea 353: `function` `resolveDocumentSnapshot`
- Línea 363: `function` `resolveDocumentTemplate`
- Línea 369: `function` `extractOriginalFormFromSnapshot`
- Línea 372: `function` `extractAssignmentsFromSnapshot`
- Línea 378: `function` `serializeSnapshotForTxt`

### src/sisad-pdfme/shared/templateValidator.ts

- Línea 21: `type` `ValidationSeverity`
- Línea 23: `type` `ValidationCode`
- Línea 34: `interface` `ValidationIssue`
- Línea 50: `interface` `ValidationResult`
- Línea 64: `interface` `ValidatableSchema`
- Línea 89: `interface` `ValidatableRecipient`
- Línea 94: `interface` `ValidatablePageSize`
- Línea 99: `interface` `ValidateTemplateInput`

### src/sisad-pdfme/templates/createDefaultTemplate.ts

- Línea 3: `type` `CreateDefaultTemplateOptions`
- Línea 14: `variable` `DEFAULT_PAGE_SIZE`
- Línea 15: `variable` `DEFAULT_PADDING`

### src/sisad-pdfme/ui/Designer.tsx

- Línea 41: `type` `SchemaConfigMatcher`
- Línea 42: `type` `DesignerTemplateChangeContext`
- Línea 139: `method` `super`
- Línea 140: `method` `checkDesignerProps`
- Línea 143: `method` `saveTemplate`
- Línea 150: `method` `updateTemplate`
- Línea 152: `method` `checkTemplate`
- Línea 158: `method` `onSaveTemplate`
- Línea 162: `method` `onChangeTemplate`
- Línea 166: `method` `onPageChange`
- Línea 170: `method` `undo`
- Línea 175: `method` `redo`
- Línea 180: `method` `setZoom`
- Línea 185: `method` `getZoom`
- Línea 190: `method` `fitToWidth`
- Línea 195: `method` `fitToPage`
- Línea 200: `method` `fitToDevice`
- Línea 205: `method` `setViewportMode`
- Línea 210: `method` `getViewportMode`
- Línea 215: `method` `getCanvasMetrics`
- Línea 234: `method` `setPage`
- Línea 239: `method` `nextPage`
- Línea 244: `method` `prevPage`
- Línea 249: `method` `centerPage`
- Línea 254: `method` `setSidebarOpen`
- Línea 259: `method` `toggleSidebar`
- Línea 264: `method` `focusField`
- Línea 269: `method` `highlightField`
- Línea 274: `method` `addSchema`
- Línea 279: `method` `addSchemaByType`
- Línea 284: `method` `getSchemaConfig`
- Línea 292: `method` `setSchemaConfig`
- Línea 301: `method` `applyExternalPrefill`
- Línea 309: `method` `getPageCursor`
- Línea 313: `method` `getTotalPages`

### src/sisad-pdfme/ui/Form.tsx

- Línea 37: `method` `super`
- Línea 40: `method` `onChangeInput`
- Línea 44: `method` `onChangeInputs`
- Línea 48: `method` `onChangeFormJson`
- Línea 52: `method` `onPageChange`
- Línea 56: `method` `getPageCursor`
- Línea 60: `method` `getFormJson`
- Línea 64: `method` `getTotalPages`

### src/sisad-pdfme/ui/Viewer.tsx

- Línea 28: `method` `super`
- Línea 31: `method` `onPageChange`
- Línea 35: `method` `getPageCursor`
- Línea 39: `method` `getTotalPages`

### src/sisad-pdfme/ui/class.ts

- Línea 43: `variable` `PDFME_ROOT_KEY`
- Línea 44: `type` `ContainerWithPdfmeRoot`
- Línea 131: `method` `checkUIProps`
- Línea 177: `method` `getOptions`
- Línea 181: `method` `getTemplate`
- Línea 189: `method` `checkTemplate`
- Línea 199: `method` `checkUIOptions`
- Línea 281: `method` `super`
- Línea 282: `method` `checkPreviewProps`
- Línea 286: `method` `getInputs`
- Línea 292: `method` `setInputs`
- Línea 294: `method` `checkInputs`
- Línea 303: `type` `DataItem`
- Línea 307: `type` `StringifiedDataItem`

### src/sisad-pdfme/ui/collaboration/schemaRuntimeAccess.ts

- Línea 19: `type` `RuntimeMode`
- Línea 21: `type` `RuntimeSchemaAccessReason`
- Línea 33: `type` `RuntimeSchemaAccess`
- Línea 46: `type` `CollabCtx`
- Línea 77: `type` `SchemaAccessState`

### src/sisad-pdfme/ui/collaboration.ts

- Línea 121: `type` `CollaborationSyncState`
- Línea 134: `type` `CollaborationAdapter`
- Línea 151: `type` `SchemaStoreEntry`
- Línea 156: `type` `CommentsStoreEntry`
- Línea 163: `type` `LockStoreEntry`
- Línea 169: `type` `RoomEntry`
- Línea 175: `variable` `ROOM_REGISTRY_KEY`
- Línea 176: `variable` `YJS_LOCAL_PROVIDER`
- Línea 177: `variable` `LEGACY_PROVIDER`
- Línea 865: `variable` `createYjsCollaborationProvider`
- Línea 1414: `variable` `useCollaborationSync`

### src/sisad-pdfme/ui/collaborationContext.ts

- Línea 19: `type` `CollaborationRecipientOption`
- Línea 28: `type` `CollaborationCanEditStructureContext`
- Línea 35: `type` `CollaborationCanEditStructurePolicy`
- Línea 39: `type` `EffectiveCollaborationContext`
- Línea 54: `type` `ResolvedSchemaCollaborationState`
- Línea 115: `function` `buildRecipientColorMap`
- Línea 122: `function` `buildRecipientNameMap`
- Línea 129: `variable` `resolveActiveRecipient`
- Línea 186: `variable` `resolveOwnerMode`
- Línea 251: `variable` `schemaMatchesCollaborationView`
- Línea 268: `variable` `filterSchemasForCollaborationView`

### src/sisad-pdfme/ui/commands/commandBus.ts

- Línea 68: `type` `CommandListener`
- Línea 88: `class` `CommandBus`
- Línea 114: `method` `execute`
- Línea 122: `method` `undo`
- Línea 130: `method` `redo`
- Línea 142: `method` `canUndo`
- Línea 146: `method` `canRedo`
- Línea 150: `method` `clear`
- Línea 155: `method` `subscribe`
- Línea 163: `function` `createCommandBus`

### src/sisad-pdfme/ui/commands/designerCommands.ts

- Línea 4: `type` `PageSnapshotCommandArgs`
- Línea 14: `type` `TemplateSnapshotCommandArgs`
- Línea 23: `variable` `createPageSnapshotCommand`
- Línea 64: `variable` `createTemplateSnapshotCommand`
- Línea 107: `variable` `createCommentCommandEvent`
- Línea 117: `variable` `buildTopLevelCommentEntry`

### src/sisad-pdfme/ui/components/AppContextProvider.tsx

- Línea 8: `type` `Props`
- Línea 48: `function` `AppContextProvider`

### src/sisad-pdfme/ui/components/CtlBar.tsx

- Línea 23: `type` `ToolbarDensity`
- Línea 25: `type` `ZoomProps`
- Línea 32: `function` `Zoom`
- Línea 81: `type` `CtlBarProps`
- Línea 117: `function` `CtlBar`

### src/sisad-pdfme/ui/components/Designer/Canvas/Canvas.tsx

- Línea 102: `variable` `CONTENT_DRIVEN_INLINE_EDIT_TYPES`
- Línea 111: `type` `CanvasContextMenuState`
- Línea 118: `interface` `GuidesInterface`
- Línea 126: `type` `CanvasFeatureToggles`
- Línea 137: `type` `CanvasStyleOverrides`
- Línea 168: `type` `CanvasClassNames`
- Línea 179: `type` `CanvasComponentSlots`
- Línea 188: `interface` `CanvasProps`
- Línea 242: `function` `Canvas`
- Línea 284: `variable` `SelectoSlot`
- Línea 285: `variable` `SnapLinesSlot`
- Línea 286: `variable` `GuidesSlot`
- Línea 287: `variable` `MaskSlot`
- Línea 288: `variable` `PaddingSlot`
- Línea 289: `variable` `MoveableSlot`
- Línea 1493: `type` `ChangeArg`
- Línea 1610: `variable` `ForwardedCanvas`

### src/sisad-pdfme/ui/components/Designer/Canvas/Guides.tsx

- Línea 22: `type` `GuidesPalette`
- Línea 29: `type` `GuidesProps`
- Línea 38: `variable` `Guides`

### src/sisad-pdfme/ui/components/Designer/Canvas/Mask.tsx

- Línea 7: `type` `MaskProps`
- Línea 14: `function` `Mask`

### src/sisad-pdfme/ui/components/Designer/Canvas/Moveable.tsx

- Línea 27: `type` `Props`
- Línea 55: `function` `Moveable`

### src/sisad-pdfme/ui/components/Designer/Canvas/Padding.tsx

- Línea 47: `type` `PaddingProps`
- Línea 55: `function` `Padding`

### src/sisad-pdfme/ui/components/Designer/Canvas/Selecto.tsx

- Línea 15: `type` `SelectoPointArea`
- Línea 22: `type` `Props`
- Línea 59: `function` `Selecto`

### src/sisad-pdfme/ui/components/Designer/Canvas/SnapLines.tsx

- Línea 14: `interface` `SnapLine`
- Línea 22: `interface` `SnapComputation`
- Línea 30: `type` `SnapMatch`
- Línea 36: `interface` `Props`
- Línea 50: `variable` `LINE_COLOR`
- Línea 51: `variable` `CENTER_COLOR`
- Línea 53: `variable` `SnapLines`
- Línea 241: `function` `computeSnapResult`

### src/sisad-pdfme/ui/components/Designer/Canvas/overlays/CanvasContextMenu.tsx

- Línea 14: `type` `CanvasContextMenuPosition`
- Línea 19: `type` `CanvasContextMenuProps`
- Línea 40: `variable` `MENU_DIMENSIONS`
- Línea 46: `variable` `CanvasContextMenu`

### src/sisad-pdfme/ui/components/Designer/Canvas/overlays/CanvasOverlayManager.tsx

- Línea 20: `type` `SnapLinesSlot`
- Línea 27: `type` `CanvasOverlayManagerProps`
- Línea 49: `variable` `MICRO_TOOLBAR_SIZE`
- Línea 50: `variable` `COMPACT_TOOLBAR_SIZE`
- Línea 51: `variable` `EXPANDED_TOOLBAR_SIZE`
- Línea 53: `function` `CanvasOverlayManager`

### src/sisad-pdfme/ui/components/Designer/Canvas/overlays/CanvasStateOverlay.tsx

- Línea 26: `interface` `CanvasStateOverlayProps`
- Línea 34: `variable` `CLS`

### src/sisad-pdfme/ui/components/Designer/Canvas/overlays/CommentsOverlay.tsx

- Línea 6: `variable` `MM_TO_PX`
- Línea 9: `type` `CommentsOverlayProps`
- Línea 38: `type` `OverlayComment`
- Línea 58: `type` `OverlayAnchor`
- Línea 71: `type` `OverlaySchema`
- Línea 79: `variable` `CommentsOverlay`

### src/sisad-pdfme/ui/components/Designer/Canvas/overlays/GroupOptionFloatingAction.tsx

- Línea 8: `type` `Props`
- Línea 15: `variable` `BUTTON_GAP_PX`

### src/sisad-pdfme/ui/components/Designer/Canvas/overlays/InlineEditOverlay.tsx

- Línea 6: `type` `InlineEditSession`
- Línea 14: `type` `InlineEditOverlayProps`
- Línea 21: `function` `InlineEditOverlay`

### src/sisad-pdfme/ui/components/Designer/Canvas/overlays/InlineMetricsOverlay.tsx

- Línea 3: `type` `InlineMetricsOverlayProps`
- Línea 7: `function` `InlineMetricsOverlay`

### src/sisad-pdfme/ui/components/Designer/Canvas/overlays/SchemaDragPreview.tsx

- Línea 3: `type` `SchemaDragPreviewProps`
- Línea 12: `variable` `SchemaDragPreview`

### src/sisad-pdfme/ui/components/Designer/Canvas/overlays/SchemaDropCommitFlash.tsx

- Línea 4: `type` `SchemaDropCommitFlashProps`
- Línea 13: `variable` `MM_TO_PX`
- Línea 15: `variable` `SchemaDropCommitFlash`

### src/sisad-pdfme/ui/components/Designer/Canvas/overlays/SchemaDropPlaceholder.tsx

- Línea 3: `type` `SchemaDropPlaceholderProps`
- Línea 15: `variable` `MM_TO_PX`
- Línea 17: `variable` `SchemaDropPlaceholder`

### src/sisad-pdfme/ui/components/Designer/Canvas/overlays/SelectionContextToolbar.tsx

- Línea 11: `type` `SelectionContextToolbarProps`
- Línea 30: `variable` `SelectionContextToolbar`

### src/sisad-pdfme/ui/components/Designer/Canvas/overlays/SnapFeedbackOverlay.tsx

- Línea 5: `type` `SnapFeedbackOverlayProps`
- Línea 10: `function` `SnapFeedbackOverlay`

### src/sisad-pdfme/ui/components/Designer/Canvas/overlays/canvasContextMenuActions.tsx

- Línea 44: `type` `CanvasContextMenuMode`
- Línea 46: `type` `SelectionToolbarSelectionKind`
- Línea 56: `type` `SelectionToolbarMode`
- Línea 58: `type` `CanvasContextMenuExternalActions`
- Línea 68: `type` `CanvasContextMenuItem`
- Línea 80: `type` `CanvasContextMenuGroup`
- Línea 86: `type` `CanvasSelectionQuickAction`
- Línea 99: `type` `SelectionToolbarSection`
- Línea 105: `type` `SelectionToolbarModel`
- Línea 114: `type` `BuildContextMenuGroupsArgs`
- Línea 159: `variable` `IMAGE_TYPES`
- Línea 160: `variable` `SIGNATURE_TYPES`
- Línea 161: `variable` `CHOICE_TYPES`
- Línea 183: `variable` `NUMBER_TYPES`
- Línea 184: `variable` `TABLE_TYPES`
- Línea 196: `variable` `resolveSelectionToolbarKind`
- Línea 409: `variable` `buildSelectionToolbarModel`
- Línea 650: `variable` `buildCanvasContextMenuGroups`

### src/sisad-pdfme/ui/components/Designer/Canvas/overlays/floatingSurfaceGeometry.ts

- Línea 1: `type` `ViewportSize`
- Línea 6: `type` `FloatingSurfaceSize`
- Línea 11: `type` `SelectionBounds`
- Línea 18: `variable` `FLOATING_SURFACE_EDGE_GAP`
- Línea 20: `variable` `resolveCenteredFloatingSurfacePosition`
- Línea 43: `variable` `resolveSelectionToolbarPosition`
- Línea 83: `variable` `resolveAnchoredFloatingSurfacePosition`

### src/sisad-pdfme/ui/components/Designer/Canvas/overlays/overlayState.ts

- Línea 3: `type` `CanvasBlockReason`
- Línea 10: `type` `CanvasInteractionMode`
- Línea 19: `variable` `deriveCanvasBlockReason`
- Línea 35: `variable` `shouldDisplayBlockingMask`

### src/sisad-pdfme/ui/components/Designer/Canvas/overlays/pointerGeometry.ts

- Línea 4: `type` `PointLike`
- Línea 9: `type` `RectLike`
- Línea 18: `type` `PointerToPaperInput`
- Línea 34: `type` `PointerToPaperResult`
- Línea 50: `variable` `resolveClientPointToCanvasPoint`
- Línea 84: `variable` `resolveClientPointToPagePoint`
- Línea 88: `variable` `clampPointToPageBounds`
- Línea 103: `variable` `resolveDropPageIndex`
- Línea 119: `variable` `extractClientPoint`

### src/sisad-pdfme/ui/components/Designer/Canvas/overlays/smartPlacement.ts

- Línea 3: `type` `SmartPlacementInput`
- Línea 111: `variable` `resolveSmartDropPosition`

### src/sisad-pdfme/ui/components/Designer/Canvas/overlays/useFloatingToolbarPosition.ts

- Línea 6: `type` `Bounds`
- Línea 7: `type` `PageSize`
- Línea 8: `type` `SurfaceSize`
- Línea 10: `variable` `TOOLBAR_WIDTH`
- Línea 11: `variable` `TOOLBAR_HEIGHT`
- Línea 12: `variable` `DEFAULT_SURFACE_SIZE`
- Línea 14: `variable` `useFloatingToolbarPosition`

### src/sisad-pdfme/ui/components/Designer/Comments/CommentDialog.tsx

- Línea 4: `type` `CommentDialogProps`
- Línea 12: `function` `CommentDialog`

### src/sisad-pdfme/ui/components/Designer/LeftSidebar.tsx

- Línea 121: `variable` `PREFILL_SCHEMA_TYPES`
- Línea 132: `variable` `PREFILL_LABEL_TOKENS`
- Línea 151: `variable` `CUSTOM_LABEL_TOKENS`
- Línea 153: `type` `ActiveRecipientOption`
- Línea 164: `type` `CatalogViewMode`
- Línea 165: `type` `CatalogQuickFilter`
- Línea 166: `type` `CatalogCapability`
- Línea 167: `variable` `SHOW_ADVANCED_CATALOG_CONTROLS`
- Línea 169: `type` `CatalogSchemaItem`
- Línea 184: `type` `SidebarButtonsProps`
- Línea 202: `variable` `SidebarButtons`
- Línea 257: `variable` `SUPPORTED_CAPABILITIES`
- Línea 403: `variable` `Draggable`
- Línea 445: `variable` `SidebarShell`
- Línea 524: `type` `LeftSidebarProps`
- Línea 558: `variable` `LeftSidebar`

### src/sisad-pdfme/ui/components/Designer/LeftSidebarCustomFieldModal.tsx

- Línea 6: `type` `CustomFieldDef`
- Línea 31: `variable` `CUSTOM_FIELD_TYPE_OPTIONS`
- Línea 43: `type` `Props`
- Línea 51: `variable` `FONT_OPTIONS`
- Línea 60: `variable` `FONT_COLOR_OPTIONS`
- Línea 68: `variable` `FONT_SIZE_OPTIONS`
- Línea 77: `variable` `VALIDATION_OPTIONS`
- Línea 84: `variable` `Section`
- Línea 127: `variable` `TextField`
- Línea 161: `variable` `SelectField`
- Línea 203: `variable` `CheckboxField`
- Línea 226: `function` `CustomFieldModal`

### src/sisad-pdfme/ui/components/Designer/LeftSidebarCustomPanel.tsx

- Línea 8: `type` `RuntimeCustomSchemaDefinition`
- Línea 17: `type` `LeftSidebarCustomPanelProps`
- Línea 25: `variable` `LeftSidebarCustomPanel`

### src/sisad-pdfme/ui/components/Designer/LeftSidebarGroup.tsx

- Línea 6: `type` `LeftSidebarGroupItem`
- Línea 8: `type` `LeftSidebarGroupProps`
- Línea 18: `variable` `LeftSidebarGroup`
- Línea 91: `type` `LeftSidebarEmptyStateProps`
- Línea 95: `function` `LeftSidebarEmptyState`

### src/sisad-pdfme/ui/components/Designer/LeftSidebarSearch.tsx

- Línea 7: `type` `LeftSidebarSearchProps`
- Línea 14: `variable` `LeftSidebarSearch`

### src/sisad-pdfme/ui/components/Designer/LeftSidebarTabs.tsx

- Línea 5: `type` `LeftSidebarTab`
- Línea 6: `type` `SidebarTabOption`
- Línea 8: `type` `LeftSidebarTabsProps`
- Línea 15: `variable` `LeftSidebarTabs`

### src/sisad-pdfme/ui/components/Designer/PluginIcon.tsx

- Línea 8: `interface` `PluginIconProps`
- Línea 22: `variable` `SVGIcon`
- Línea 68: `function` `PluginIcon`

### src/sisad-pdfme/ui/components/Designer/RightSidebar/CommentsRail.tsx

- Línea 9: `type` `CommentsRailProps`
- Línea 35: `variable` `COMMENT_DATE_FORMATTER`
- Línea 67: `type` `CommentPillProps`
- Línea 72: `function` `CommentPill`
- Línea 96: `variable` `CommentsRail`

### src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/AlignWidget.tsx

- Línea 18: `variable` `LAYOUT_BUTTONS`
- Línea 29: `function` `AlignWidget`

### src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/ButtonGroupWidget.tsx

- Línea 7: `interface` `ButtonConfig`
- Línea 14: `function` `ButtonGroupWidget`

### src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/CompactConfigPanel.tsx

- Línea 8: `type` `StatusTag`
- Línea 13: `type` `CompactConfigPanelProps`
- Línea 26: `variable` `EMPTY_TAGS`
- Línea 28: `variable` `CompactConfigPanel`

### src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailFormSection.tsx

- Línea 8: `type` `DetailFormSectionProps`
- Línea 36: `variable` `DetailFormSection`

### src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailHeaderCard.tsx

- Línea 14: `type` `DetailHeaderCardProps`
- Línea 34: `variable` `DetailHeaderCard`

### src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailSectionCard.tsx

- Línea 6: `type` `DetailSectionCardProps`
- Línea 42: `type` `SectionTextProps`
- Línea 47: `function` `SectionText`
- Línea 63: `type` `SectionHeadProps`
- Línea 73: `function` `SectionHead`
- Línea 131: `variable` `DetailSectionCard`

### src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailView.tsx

- Línea 29: `type` `DetailViewProps`
- Línea 44: `type` `PositionFieldName`
- Línea 46: `type` `PositionBounds`
- Línea 148: `function` `DetailView`

### src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailViewContent.tsx

- Línea 13: `type` `DetailViewContentProps`
- Línea 24: `variable` `DetailViewContent`

### src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/InspectorPrimitives.tsx

- Línea 8: `type` `InspectorTag`
- Línea 14: `type` `InspectorTagListProps`
- Línea 22: `variable` `EMPTY_TAGS`
- Línea 24: `variable` `InspectorTagList`
- Línea 59: `type` `InspectorAction`
- Línea 67: `type` `InspectorActionRowProps`
- Línea 72: `variable` `EMPTY_ACTIONS`
- Línea 74: `variable` `InspectorActionRow`
- Línea 99: `type` `InspectorMetric`
- Línea 105: `type` `InspectorMetricRowProps`
- Línea 110: `variable` `EMPTY_METRICS`
- Línea 112: `variable` `InspectorMetricRow`
- Línea 140: `type` `InspectorSummaryCardProps`
- Línea 150: `variable` `InspectorSummaryCard`
- Línea 199: `type` `BooleanSwitchWidgetProps`
- Línea 219: `variable` `BooleanSwitchWidget`
- Línea 259: `type` `InspectorEmptyStateProps`
- Línea 266: `variable` `InspectorEmptyState`

### src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaCollaborationWidget.tsx

- Línea 25: `type` `CollaborationWidgetProps`
- Línea 36: `type` `CollaborationPatchKey`
- Línea 54: `variable` `STATE_OPTIONS`
- Línea 75: `function` `SchemaCollaborationWidget`

### src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaConnectionsShared.tsx

- Línea 6: `type` `Pair`
- Línea 8: `variable` `toPairs`
- Línea 19: `variable` `toRecord`
- Línea 27: `variable` `PairEditor`
- Línea 125: `variable` `SectionHeader`

### src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaConnectionsWidget.tsx

- Línea 21: `type` `ConfigWidgetProps`
- Línea 97: `variable` `CONNECTION_FIELD_LABELS`
- Línea 184: `function` `SchemaConnectionsWidget`

### src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaFieldCommentsWidget.tsx

- Línea 19: `type` `FieldCommentsWidgetProps`
- Línea 38: `variable` `COMMENT_TIMESTAMP_FORMATTER`

### src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaOptionsEditor.tsx

- Línea 27: `type` `ChangeSchemas`
- Línea 29: `type` `SchemaOptionsEditorProps`
- Línea 34: `type` `OptionGroupSchema`
- Línea 45: `type` `EditorKind`
- Línea 47: `type` `EditorRow`
- Línea 62: `variable` `KIND_COPY`

### src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/WidgetRenderer.tsx

- Línea 5: `type` `Props`
- Línea 9: `function` `WidgetRenderer`

### src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailHeaderUtils.ts

- Línea 5: `type` `HeaderSummary`
- Línea 41: `variable` `buildDetailHeaderSummary`

### src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailSchemas.ts

- Línea 15: `type` `DetailInspectorSectionKey`
- Línea 17: `type` `DetailInspectorSection`
- Línea 25: `type` `BuildInspectorSchemasParams`
- Línea 44: `variable` `SECTION_META`
- Línea 79: `variable` `EMPTY_TEXT_VALUES`
- Línea 147: `variable` `buildInspectorSections`

### src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailSectionTaxonomy.ts

- Línea 5: `type` `CanonicalDetailSection`
- Línea 18: `type` `LegacyDetailSection`
- Línea 31: `variable` `LEGACY_TO_CANONICAL_DETAIL_SECTION`
- Línea 45: `variable` `CANONICAL_DETAIL_SECTION_ORDER`
- Línea 59: `variable` `CANONICAL_DETAIL_SECTION_LABELS`
- Línea 118: `variable` `EMPTY_TEXT_VALUES`
- Línea 141: `variable` `OPTION_BASED_TYPES`
- Línea 142: `variable` `CHECKBOX_TYPES`
- Línea 143: `variable` `TEXT_LIKE_TYPES`
- Línea 151: `variable` `NUMBER_LIKE_TYPES`
- Línea 152: `variable` `SIGNING_TYPES`
- Línea 153: `variable` `ACTION_TYPES`
- Línea 155: `type` `DetailProfile`
- Línea 167: `variable` `DEFAULT_DETAIL_SECTION_VISIBILITY`
- Línea 179: `variable` `getDetailProfile`
- Línea 217: `variable` `getDefaultOpenSections`
- Línea 221: `variable` `getVisibleDetailSections`
- Línea 225: `variable` `resolveDetailSectionDefaultCollapsed`
- Línea 243: `type` `FieldLike`
- Línea 255: `type` `NormalizedField`
- Línea 312: `variable` `toCanonicalDetailSection`
- Línea 321: `function` `sortCanonicalDetailSections`
- Línea 326: `function` `shouldRenderDetailSection`

### src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailWidgetRegistry.tsx

- Línea 20: `type` `BuildWidgetsParams`
- Línea 108: `function` `SchemaFieldCommentsWidgetRenderer`
- Línea 118: `function` `SchemaConnectionsWidgetRenderer`
- Línea 128: `function` `SchemaCollaborationWidgetRenderer`

### src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailWidgets.tsx

- Línea 8: `variable` `COLOR_PRESETS`
- Línea 27: `variable` `ColorPickerWidget`

### src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/inspectorContracts.ts

- Línea 24: `type` `SchemaInspectorSections`
- Línea 47: `type` `SchemaInspectorFooterActions`
- Línea 53: `type` `SchemaInspectorContract`
- Línea 60: `variable` `DEFAULT_FOOTER`
- Línea 66: `variable` `TEXT_LIKE_CONTRACT`
- Línea 88: `variable` `NUMBER_LIKE_CONTRACT`
- Línea 108: `variable` `DATE_LIKE_CONTRACT`
- Línea 124: `variable` `OPTION_BASED_CONTRACT`
- Línea 143: `variable` `BOOLEAN_CONTRACT`
- Línea 160: `variable` `SIGNING_CONTRACT`
- Línea 178: `variable` `MEDIA_CONTRACT`
- Línea 192: `variable` `BARCODE_CONTRACT`
- Línea 206: `variable` `TABLE_CONTRACT`
- Línea 220: `variable` `SHAPE_CONTRACT`
- Línea 231: `variable` `FORMULA_CONTRACT`
- Línea 246: `variable` `NOTE_CONTRACT`
- Línea 258: `variable` `ACTION_CONTRACT`
- Línea 273: `variable` `ATTACHMENT_CONTRACT`
- Línea 290: `variable` `BUILTIN_CONTRACTS`
- Línea 338: `variable` `registerInspectorContract`
- Línea 345: `variable` `resolveInspectorContract`
- Línea 363: `variable` `contractSectionEnabled`

### src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/inspectorInteractionGuards.ts

- Línea 1: `variable` `INSPECTOR_INTERACTIVE_ATTR`
- Línea 3: `variable` `POINTER_EVENT_NAMES`
- Línea 5: `function` `markInspectorInteractive`
- Línea 23: `variable` `isInspectorInteractiveTarget`
- Línea 28: `function` `stopInspectorPointerEvent`

### src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/schemaCollaborationUtils.ts

- Línea 6: `variable` `joinRecipientIds`
- Línea 8: `function` `resolveOwnerMode`
- Línea 14: `function` `buildStateTag`

### src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/schemaConnectionsValidation.ts

- Línea 3: `variable` `validatePersistenceConfig`
- Línea 14: `variable` `validateFormConfig`
- Línea 25: `variable` `validateApiConfig`
- Línea 74: `variable` `getMissingConnectionFields`

### src/sisad-pdfme/ui/components/Designer/RightSidebar/DocumentsRail.tsx

- Línea 11: `type` `DesignerDocumentItem`
- Línea 21: `type` `DocumentsRailProps`
- Línea 42: `variable` `DocumentsRail`

### src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/Item.tsx

- Línea 10: `variable` `SCHEMA_TYPE_COLORS`
- Línea 35: `interface` `Props`
- Línea 92: `variable` `ItemStatusLabel`
- Línea 122: `variable` `ItemActions`
- Línea 196: `function` `Item`

### src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/ListView.tsx

- Línea 20: `variable` `ListView`

### src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/ListViewDragOverlay.tsx

- Línea 9: `type` `Props`
- Línea 16: `function` `ListViewDragOverlay`

### src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/ListViewFooter.tsx

- Línea 8: `type` `Props`
- Línea 21: `function` `ListViewFooter`

### src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/ListViewToolbar.tsx

- Línea 10: `type` `Option`
- Línea 12: `type` `Props`
- Línea 40: `variable` `ListViewToolbar`

### src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/SelectableSortableContainer.tsx

- Línea 28: `variable` `SelectableSortableContainer`

### src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/SelectableSortableItem.tsx

- Línea 22: `interface` `Props`
- Línea 35: `variable` `SelectableSortableItem`

### src/sisad-pdfme/ui/components/Designer/RightSidebar/RightSidebar.tsx

- Línea 24: `type` `RightSidebarProps`
- Línea 77: `type` `SidebarModeMeta`
- Línea 85: `variable` `PANEL_ID_BY_MODE`
- Línea 92: `variable` `TAB_ID_BY_MODE`
- Línea 128: `function` `Sidebar`
- Línea 138: `variable` `useLayoutFrame`
- Línea 146: `variable` `DocumentsRailComponent`
- Línea 147: `variable` `CommentsViewComponent`
- Línea 148: `variable` `ListViewComponent`
- Línea 149: `variable` `DetailViewComponent`

### src/sisad-pdfme/ui/components/Designer/RightSidebar/contextHeader.ts

- Línea 3: `type` `RightSidebarContextHeaderContext`
- Línea 8: `type` `RightSidebarContextHeader`
- Línea 10: `variable` `resolveRightSidebarContextHeader`

### src/sisad-pdfme/ui/components/Designer/RightSidebar/layout.tsx

- Línea 6: `variable` `SIDEBAR_H_PADDING_PX`
- Línea 7: `variable` `SIDEBAR_V_PADDING_PX`
- Línea 8: `variable` `SIDEBAR_HEADER_HEIGHT`
- Línea 10: `type` `SectionProps`
- Línea 13: `type` `SidebarFrameProps`
- Línea 16: `type` `SidebarHeaderProps`
- Línea 20: `function` `SidebarFrame`
- Línea 34: `function` `SidebarHeader`
- Línea 55: `function` `SidebarBody`
- Línea 66: `function` `SidebarFooter`

### src/sisad-pdfme/ui/components/Designer/RightSidebar/shared/SidebarSurfacePrimitives.tsx

- Línea 8: `variable` `EMPTY_BADGES`
- Línea 10: `type` `SidebarSurfaceBadge`
- Línea 17: `type` `SidebarSurfaceHeaderProps`
- Línea 27: `variable` `SidebarSurfaceHeader`
- Línea 83: `type` `SidebarSurfaceEmptyStateProps`
- Línea 91: `variable` `SidebarSurfaceEmptyState`

### src/sisad-pdfme/ui/components/Designer/SchemaDropSetupModal.tsx

- Línea 5: `type` `RecipientOption`
- Línea 10: `type` `SchemaDropDraft`
- Línea 19: `type` `SchemaDropSetupModalProps`
- Línea 31: `variable` `SchemaDropSetupModal`

### src/sisad-pdfme/ui/components/Designer/Shortcuts/ShortcutHelpButton.tsx

- Línea 7: `type` `ShortcutHelpButtonProps`
- Línea 15: `variable` `ShortcutHelpButton`

### src/sisad-pdfme/ui/components/Designer/Shortcuts/ShortcutHelpPanel.tsx

- Línea 8: `type` `ShortcutHelpPanelProps`
- Línea 39: `variable` `ShortcutHelpPanel`

### src/sisad-pdfme/ui/components/Designer/index.tsx

- Línea 107: `variable` `DESIGNER_THEME_STYLE_ID`
- Línea 120: `type` `RightSidebarContextHeaderRendererDeps`
- Línea 156: `variable` `DESIGNER_THEME_CSS`
- Línea 207: `type` `ViewportMode`
- Línea 208: `type` `UploadedPdfDocument`
- Línea 233: `type` `TemplateChangeContext`
- Línea 241: `type` `SchemaDragSession`
- Línea 255: `type` `SchemaCommentMetadata`
- Línea 261: `type` `SchemaDragSourceData`
- Línea 266: `type` `SchemaDragActiveLike`
- Línea 275: `type` `CreateCommentEventDetail`
- Línea 307: `type` `CommentAnchorDraft`
- Línea 316: `type` `TopLevelCommentEntry`
- Línea 344: `variable` `PAGE_COMMENT_SCHEMA_PREFIX`
- Línea 440: `variable` `DetachedHost`
- Línea 458: `variable` `TemplateEditor`
- Línea 537: `variable` `LeftSidebar`
- Línea 538: `variable` `RightSidebar`
- Línea 848: `variable` `IDLE_DELAY`
- Línea 2397: `type` `SchemaMatcher`

### src/sisad-pdfme/ui/components/Designer/schemaRegistry.ts

- Línea 5: `type` `CustomSchemaDefinition`
- Línea 16: `type` `CreateSchemaArgs`
- Línea 27: `variable` `STORAGE_KEY`
- Línea 127: `function` `getCustomSchemaDefinitions`
- Línea 132: `function` `subscribeCustomSchemaDefinitions`
- Línea 156: `function` `upsertCustomSchemaDefinition`
- Línea 167: `variable` `createCustomSchemaFromDefinition`

### src/sisad-pdfme/ui/components/Designer/shared/DesignerContextSummary.tsx

- Línea 4: `type` `DesignerContextSummaryProps`
- Línea 17: `variable` `DesignerContextSummary`

### src/sisad-pdfme/ui/components/Designer/shared/actionRegistry.ts

- Línea 23: `type` `ActionPriority`
- Línea 25: `type` `ActionPresentationMode`
- Línea 33: `type` `ActionContext`
- Línea 40: `type` `SchemaActionDefinition`
- Línea 158: `variable` `CORE_ACTIONS`

### src/sisad-pdfme/ui/components/Designer/shared/canvasDropPipeline.ts

- Línea 34: `type` `DropPayload`
- Línea 49: `type` `DropTarget`
- Línea 57: `type` `DropOwner`
- Línea 62: `type` `DropResult`
- Línea 68: `type` `ResolvePointerDropTargetInput`
- Línea 80: `type` `ResolvePointerDropTargetResult`
- Línea 107: `variable` `resolvePointerDropTarget`

### src/sisad-pdfme/ui/components/Designer/shared/className.ts

- Línea 7: `function` `mergeClassNames`
- Línea 10: `function` `mergeUniqueClassNames`
- Línea 13: `function` `resolveFirstClassSelector`

### src/sisad-pdfme/ui/components/Designer/shared/coordinateMath.ts

- Línea 3: `type` `Point`
- Línea 4: `type` `Rect`
- Línea 5: `type` `Size`
- Línea 6: `type` `PagePoint`
- Línea 7: `type` `PdfPoint`
- Línea 8: `type` `DOMRectLike`
- Línea 9: `type` `PointArea`
- Línea 16: `type` `SelectionRegionPageHit`
- Línea 26: `type` `SelectionRegionResult`
- Línea 31: `type` `ResolveSelectionRegionParams`
- Línea 62: `variable` `rectToPointArea`
- Línea 69: `variable` `getPageRectInViewport`
- Línea 81: `variable` `clientPointToPagePoint`
- Línea 94: `variable` `pagePointToSchemaPoint`
- Línea 99: `variable` `pagePointToPdfPoint`
- Línea 101: `variable` `rectIntersects`
- Línea 104: `variable` `resolveSelectionRegion`

### src/sisad-pdfme/ui/components/Designer/shared/designerCoordinateService.ts

- Línea 35: `type` `DesignerCoordinateServiceOptions`
- Línea 71: `class` `DesignerCoordinateService`
- Línea 92: `method` `elementRectToCanvasRect`
- Línea 117: `method` `elementRectToViewportRect`
- Línea 121: `method` `viewportToCanvasPoint`
- Línea 132: `method` `viewportToPagePoint`
- Línea 136: `method` `pagePointToSchemaPoint`
- Línea 140: `method` `schemaPointToViewport`
- Línea 151: `method` `regionViewportRectToPageRect`
- Línea 163: `method` `normalizeRect`
- Línea 167: `method` `clampRectToPage`

### src/sisad-pdfme/ui/components/Designer/shared/designerExtensions.ts

- Línea 1: `type` `RecipientToneResolver`
- Línea 3: `type` `DesignerRuntimeEventSource`
- Línea 5: `type` `DesignerRuntimeEvent`
- Línea 21: `type` `DesignerRuntimeEventListener`
- Línea 23: `type` `DesignerRuntimeEventHub`
- Línea 29: `variable` `createDesignerRuntimeEventHub`
- Línea 61: `variable` `emitDesignerRuntimeEvent`
- Línea 66: `type` `AutoPlaceDescriptor`
- Línea 78: `type` `AutoPlaceResolverOptions`
- Línea 89: `type` `AutoPlaceResolver`
- Línea 94: `type` `DesignerRuntimeExtensions`

### src/sisad-pdfme/ui/components/Designer/shared/designerLabels.ts

- Línea 1: `variable` `DEFAULT_LABEL`
- Línea 3: `variable` `TYPE_LABELS`
- Línea 36: `variable` `STATE_LABELS`
- Línea 50: `variable` `SIGNATURE_MODE_LABELS`
- Línea 66: `variable` `getSchemaTypeLabel`
- Línea 72: `variable` `getSchemaStateLabel`
- Línea 78: `variable` `getSignatureModeLabel`
- Línea 84: `variable` `getProviderViewLabel`
- Línea 86: `variable` `getFriendlyRecipientRoleLabel`
- Línea 94: `variable` `getCatalogLabel`

### src/sisad-pdfme/ui/components/Designer/shared/interactionGuards.ts

- Línea 8: `variable` `EDITABLE_SELECTOR`
- Línea 16: `variable` `ANTD_POPUP_SELECTOR`
- Línea 18: `variable` `isEditableTarget`
- Línea 23: `variable` `isAntDPopupTarget`
- Línea 28: `variable` `isAntDPopupOpen`
- Línea 33: `variable` `LEFT_SIDEBAR_SCROLL_LOCK_SELECTOR`
- Línea 42: `type` `SidebarScrollSnapshot`
- Línea 48: `type` `SidebarScrollLockRelease`
- Línea 77: `variable` `lockDesignerSidebarScroll`
- Línea 142: `function` `unlockDesignerSidebarScroll`
- Línea 146: `type` `DesignerInteractionMode`
- Línea 159: `type` `DesignerInteractionState`
- Línea 171: `type` `DesignerInteractionBlockContext`
- Línea 216: `variable` `canStartInteraction`
- Línea 247: `variable` `shouldSuppressDesignerShortcuts`
- Línea 279: `variable` `shouldHandleDesignerShortcut`
- Línea 318: `variable` `shouldSuppressCanvasRegionSelection`
- Línea 336: `type` `SchemaMutationSource`
- Línea 346: `type` `SchemaMutationGuardContext`
- Línea 356: `type` `SchemaMutationDecision`
- Línea 373: `variable` `evaluateSchemaMutationPermission`

### src/sisad-pdfme/ui/components/Designer/shared/interactionState.ts

- Línea 1: `type` `InteractionPhase`
- Línea 11: `interface` `InteractionState`
- Línea 21: `type` `InteractionStateInput`
- Línea 30: `variable` `deriveInteractionState`

### src/sisad-pdfme/ui/components/Designer/shared/interactionTargetPolicy.ts

- Línea 23: `variable` `OPTION_INTERNAL_SELECTOR`
- Línea 24: `variable` `GROUP_ADD_OPTION_SELECTOR`
- Línea 25: `variable` `INTERACTIVE_CONTROL_SELECTOR`

### src/sisad-pdfme/ui/components/Designer/shared/interactionTargetSelectors.ts

- Línea 1: `variable` `DESKTOP_INTERACTIVE_EXCLUDED_SELECTORS`
- Línea 33: `variable` `DESKTOP_EDITABLE_TARGET_SELECTORS`
- Línea 59: `variable` `ANTD_POPUP_SELECTORS`
- Línea 68: `variable` `buildSelectorList`

### src/sisad-pdfme/ui/components/Designer/shared/keyboardShortcutRegistry.ts

- Línea 13: `variable` `KEY_ALIASES`
- Línea 173: `variable` `registerShortcut`
- Línea 181: `variable` `registerShortcuts`
- Línea 183: `variable` `getShortcut`
- Línea 185: `variable` `getShortcuts`
- Línea 187: `variable` `getShortcutsByScope`
- Línea 190: `variable` `resolveShortcutByKeyboardEvent`
- Línea 281: `variable` `formatShortcutForPlatform`

### src/sisad-pdfme/ui/components/Designer/shared/keyboardShortcuts.ts

- Línea 1: `type` `ShortcutPlatform`
- Línea 3: `type` `ShortcutScope`
- Línea 13: `type` `ShortcutDefinition`
- Línea 31: `function` `isMacShortcutPlatform`
- Línea 33: `variable` `detectShortcutPlatform`
- Línea 568: `variable` `DESIGNER_SHORTCUTS`

### src/sisad-pdfme/ui/components/Designer/shared/objectGuards.ts

- Línea 3: `variable` `isRecord`
- Línea 6: `variable` `asRecord`
- Línea 9: `variable` `isSchemaRootElement`

### src/sisad-pdfme/ui/components/Designer/shared/passiveTouchListeners.ts

- Línea 1: `variable` `PASSIVE_EVENT_TYPES`
- Línea 12: `function` `installPassiveTouchListenerGuard`

### src/sisad-pdfme/ui/components/Designer/shared/recipientColor.ts

- Línea 3: `function` `normalizeHexColor`
- Línea 37: `variable` `DEFAULT_RECIPIENT_PALETTE`
- Línea 50: `variable` `DEFAULT_FALLBACK_COLOR`
- Línea 52: `type` `RecipientColorToken`

### src/sisad-pdfme/ui/components/Designer/shared/schemaAutoPlace.ts

- Línea 3: `variable` `DEFAULT_AUTO_PLACE_SCOPE`
- Línea 4: `variable` `DEFAULT_AUTO_PLACE_MATCH_MODE`
- Línea 8: `function` `buildAutoPlaceDescriptor`
- Línea 28: `function` `resolveSchemaAutoPlaceDescriptor`
- Línea 65: `function` `collectAutoPlaceRulesFromDocuments`

### src/sisad-pdfme/ui/components/Designer/shared/schemaClipboard.ts

- Línea 25: `type` `PastePolicy`
- Línea 36: `type` `ClipboardCollaborationContext`
- Línea 46: `type` `SchemaRecord`
- Línea 47: `type` `DesignerRecord`
- Línea 54: `type` `ClipboardTransientRecord`
- Línea 62: `type` `SchemaGroupBounds`
- Línea 77: `type` `SchemaClipboardPayload`
- Línea 84: `type` `SchemaClipboardContext`
- Línea 236: `variable` `sanitizeCopiedSchema`
- Línea 304: `variable` `copySchemasToClipboard`
- Línea 314: `variable` `cutSchemasToClipboard`
- Línea 324: `function` `resolvePasteOffset`
- Línea 329: `variable` `resolveUniqueSchemaName`
- Línea 349: `variable` `buildPastedSchema`
- Línea 538: `variable` `pasteSchemasFromClipboard`
- Línea 567: `variable` `duplicateSchemas`

### src/sisad-pdfme/ui/components/Designer/shared/schemaCollision.ts

- Línea 3: `type` `CollisionSchemaLike`
- Línea 12: `type` `CollisionScopeFallback`
- Línea 70: `variable` `filterSchemasByCollisionScope`

### src/sisad-pdfme/ui/components/Designer/shared/schemaInteractionCapabilities.ts

- Línea 39: `variable` `NON_RESIZABLE`
- Línea 43: `variable` `NON_ROTATABLE`
- Línea 50: `variable` `INLINE_EDITABLE`
- Línea 55: `variable` `OPTION_BASED`
- Línea 68: `variable` `SHAPES`
- Línea 74: `variable` `MEDIA`

### src/sisad-pdfme/ui/components/Designer/shared/schemaTone.ts

- Línea 3: `variable` `SCHEMA_TYPE_TONES`
- Línea 35: `type` `ToneAwareSchema`
- Línea 68: `variable` `resolveSchemaTone`
- Línea 80: `variable` `resolveSchemaToneSurface`

### src/sisad-pdfme/ui/components/Designer/shared/schemaVariableName.ts

- Línea 1: `variable` `KNOWN_PREFIXES`
- Línea 24: `function` `getSchemaVariablePrefix`
- Línea 30: `variable` `createUniqueSchemaVariableName`

### src/sisad-pdfme/ui/components/Designer/shared/selectionCommands.ts

- Línea 22: `type` `SchemaWithDesigner`
- Línea 65: `type` `AlignType`
- Línea 73: `type` `DistributeType`
- Línea 75: `type` `AlignmentMode`
- Línea 77: `type` `PageBounds`
- Línea 82: `type` `DeleteSchemasOptions`
- Línea 87: `variable` `INLINE_EDIT_REQUEST_EVENT`
- Línea 89: `type` `InlineEditTarget`
- Línea 91: `type` `InlineEditRequest`
- Línea 96: `type` `InlineEditRequestHandler`
- Línea 100: `function` `setInlineEditRequestHandler`
- Línea 109: `function` `emitInlineEditRequest`
- Línea 113: `type` `SelectionCommandSet`
- Línea 151: `type` `SelectionCommandsContext`
- Línea 245: `variable` `computeAlignedSchemas`
- Línea 263: `variable` `useSelectionBounds`
- Línea 292: `variable` `computeDistributedSchemas`
- Línea 390: `variable` `createSelectionCommands`

### src/sisad-pdfme/ui/components/Designer/shared/selectionIdentityResolver.ts

- Línea 15: `type` `SchemaElementIdentity`
- Línea 23: `type` `SelectionPageScope`
- Línea 41: `variable` `resolveSchemaIdentityFromElement`
- Línea 56: `variable` `resolveSchemaFromElement`
- Línea 76: `variable` `resolveActiveSchemasFromElements`
- Línea 84: `variable` `resolveSelectionPageScope`
- Línea 101: `variable` `resolveSelectionPageIndex`
- Línea 114: `variable` `isSameDocumentPageSelection`

### src/sisad-pdfme/ui/components/Designer/shared/useDesignerKeyboardShortcuts.ts

- Línea 13: `type` `ShortcutHandlerContext`
- Línea 23: `type` `ShortcutHandler`
- Línea 29: `type` `DesignerShortcutHandlers`
- Línea 31: `type` `UseDesignerKeyboardShortcutsParams`
- Línea 98: `variable` `DESIGNER_ROOT_SELECTOR`
- Línea 100: `variable` `shouldIgnoreShortcutEvent`
- Línea 336: `variable` `useDesignerKeyboardShortcuts`

### src/sisad-pdfme/ui/components/Designer/shared/useResponsiveDensity.ts

- Línea 3: `type` `DensityMode`
- Línea 5: `type` `ResponsiveDensityBreakpoints`
- Línea 11: `type` `UseResponsiveDensityOptions`
- Línea 15: `variable` `DEFAULT_BREAKPOINTS`
- Línea 32: `variable` `useResponsiveDensity`

### src/sisad-pdfme/ui/components/Designer/useLeftSidebarCatalogState.ts

- Línea 33: `type` `UseLeftSidebarCatalogStateArgs`
- Línea 37: `function` `useLeftSidebarCatalogState`

### src/sisad-pdfme/ui/components/ErrorScreen.tsx

- Línea 7: `function` `ErrorScreen`

### src/sisad-pdfme/ui/components/Paper.tsx

- Línea 7: `variable` `TRANSPARENT_PNG`
- Línea 10: `type` `PageBlock`
- Línea 17: `type` `StablePaperState`
- Línea 25: `type` `PaperPageProps`
- Línea 36: `variable` `PaperPage`
- Línea 83: `variable` `Paper`

### src/sisad-pdfme/ui/components/Preview.tsx

- Línea 16: `variable` `Preview`

### src/sisad-pdfme/ui/components/Renderer.tsx

- Línea 17: `type` `RendererProps`
- Línea 38: `type` `OwnerAwareSchema`
- Línea 39: `type` `DesignerStyleAwareSchema`
- Línea 57: `variable` `FILL_STYLE`
- Línea 58: `variable` `BLOCKED_DESIGNER_STYLE_KEYS`
- Línea 102: `variable` `Wrapper`
- Línea 229: `function` `Renderer`

### src/sisad-pdfme/ui/components/Root.tsx

- Línea 7: `type` `Props`
- Línea 9: `function` `Root`

### src/sisad-pdfme/ui/components/Spinner.tsx

- Línea 5: `function` `Spinner`

### src/sisad-pdfme/ui/components/StaticSchema.tsx

- Línea 5: `variable` `StaticSchema`

### src/sisad-pdfme/ui/components/UnitPager.tsx

- Línea 8: `type` `UnitButtonProps`
- Línea 24: `function` `UnitButton`
- Línea 25: `variable` `Icon`
- Línea 40: `type` `Props`
- Línea 47: `function` `UnitPager`

### src/sisad-pdfme/ui/components/shared/pageMetadata.ts

- Línea 1: `type` `PageMetadata`
- Línea 7: `variable` `buildPageMetadataAttrs`
- Línea 21: `variable` `applyPageMetadataDataset`

### src/sisad-pdfme/ui/components/shared/usePaperRefRegistry.ts

- Línea 3: `function` `usePaperRefRegistry`

### src/sisad-pdfme/ui/constants.ts

- Línea 15: `variable` `DESTROYED_ERR_MSG`
- Línea 17: `variable` `SELECTABLE_CLASSNAME`
- Línea 19: `variable` `RULER_HEIGHT`
- Línea 21: `variable` `PAGE_GAP`
- Línea 23: `variable` `LEFT_SIDEBAR_WIDTH`
- Línea 25: `variable` `RIGHT_SIDEBAR_WIDTH`
- Línea 27: `variable` `BACKGROUND_COLOR`
- Línea 29: `variable` `DEFAULT_MAX_ZOOM`
- Línea 31: `variable` `DESIGNER_CLASSNAME`
- Línea 33: `variable` `UI_CLASSNAME`

### src/sisad-pdfme/ui/contexts.ts

- Línea 17: `variable` `I18nContext`
- Línea 19: `variable` `FontContext`
- Línea 22: `variable` `PluginsRegistry`
- Línea 24: `variable` `OptionsContext`
- Línea 26: `variable` `CacheContext`

### src/sisad-pdfme/ui/designerEngine.ts

- Línea 35: `variable` `DEFAULT_SCHEMA_CONFIG_STORAGE_KEY`
- Línea 37: `type` `SchemaIdentity`
- Línea 45: `type` `SchemaCollaborativeState`
- Línea 47: `type` `SchemaCollaborativeLock`
- Línea 54: `type` `SchemaCommentReply`
- Línea 65: `type` `SchemaComment`
- Línea 83: `type` `SchemaCommentAnchor`
- Línea 97: `type` `CollaborationPresence`
- Línea 109: `type` `CollaborationHistoryEventType`
- Línea 118: `type` `CollaborationHistoryEntry`
- Línea 131: `type` `CollaborationProviderName`
- Línea 133: `type` `SchemaCollaborativeMetadata`
- Línea 158: `type` `CollaborationSyncConfig`
- Línea 190: `type` `SchemaPrefillConfig`
- Línea 201: `type` `SchemaHttpAuthConfig`
- Línea 211: `type` `SchemaHttpClientConfig`
- Línea 220: `type` `SchemaPersistenceConfig`
- Línea 228: `type` `SchemaRequestConfig`
- Línea 241: `type` `SchemaFormJsonConfig`
- Línea 251: `type` `SchemaIntegrationConfig`
- Línea 260: `type` `SchemaDesignerConfig`
- Línea 271: `type` `SchemaCreationContext`
- Línea 284: `type` `SchemaCreationContextInput`
- Línea 347: `type` `SchemaCreationHook`
- Línea 348: `type` `SchemaIdentityFactory`
- Línea 350: `type` `DesignerEngine`
- Línea 383: `type` `LeftSidebarEngineProps`
- Línea 384: `type` `RightSidebarEngineProps`
- Línea 652: `variable` `refreshSchemaCollaborativeMetadata`
- Línea 691: `variable` `resolveDesignerEngine`
- Línea 699: `variable` `getSchemaConfigStorageKey`
- Línea 702: `variable` `getSchemaDesignerConfig`
- Línea 714: `variable` `setSchemaDesignerConfig`
- Línea 725: `variable` `mergeSchemaDesignerConfig`
- Línea 749: `variable` `resolveDesignerHttpClientConfig`
- Línea 772: `type` `SchemaDataFieldSnapshot`
- Línea 777: `type` `SchemaDataSnapshot`
- Línea 785: `type` `ResolvedSchemaRequest`
- Línea 801: `type` `FormJsonEnvelope`
- Línea 814: `type` `SchemaDataRuntimeAdapter`
- Línea 829: `type` `RuntimeAdapterArgs`
- Línea 1039: `variable` `createSchemaDataRuntimeAdapter`
- Línea 1288: `variable` `attachSchemaIdentity`
- Línea 1310: `variable` `applySchemaCreationHook`
- Línea 1328: `method` `withLeftSidebar`
- Línea 1333: `method` `withRightSidebar`
- Línea 1338: `method` `withLeftSidebarProps`
- Línea 1346: `method` `withRightSidebarProps`
- Línea 1354: `method` `withCanvasFeatureToggles`
- Línea 1359: `method` `withCanvasStyleOverrides`
- Línea 1364: `method` `withCanvasClassNames`
- Línea 1369: `method` `withCanvasComponents`
- Línea 1374: `method` `withCanvasUseDefaultStyles`
- Línea 1379: `method` `withHttpAxiosConfig`
- Línea 1387: `method` `withSchemaConfigStorageKey`
- Línea 1392: `method` `withSchemaIdentityFactory`
- Línea 1397: `method` `withSchemaCreationHook`
- Línea 1402: `method` `withAutoAttachIdentity`
- Línea 1407: `method` `withSignatureProviders`
- Línea 1424: `method` `withSignatureDefaultProviderKey`
- Línea 1432: `method` `withCollaboration`
- Línea 1444: `method` `build`

### src/sisad-pdfme/ui/helper.ts

- Línea 37: `type` `HotkeysFunction`
- Línea 85: `variable` `debounce`
- Línea 103: `function` `round`
- Línea 247: `function` `destroyShortCuts`
- Línea 280: `variable` `arrayBufferToBase64`
- Línea 367: `variable` `getUniqueSchemaName`
- Línea 404: `variable` `moveCommandToChangeSchemasArg`
- Línea 450: `function` `getPagesScrollTopByIndex`
- Línea 542: `variable` `changeSchemas`
- Línea 597: `function` `useMaxZoom`
- Línea 603: `variable` `setFontNameRecursively`

### src/sisad-pdfme/ui/hooks.ts

- Línea 54: `type` `UIPreProcessorProps`
- Línea 56: `type` `PreprocessedPdfCache`
- Línea 65: `variable` `MAX_PREPROCESSED_PDF_CACHE_ENTRIES`
- Línea 293: `type` `ScrollPageCursorProps`
- Línea 303: `variable` `useScrollPageCursor`
- Línea 380: `function` `useMountStatus`
- Línea 391: `interface` `UseInitEventsParams`
- Línea 416: `variable` `useInitEvents`

### src/sisad-pdfme/ui/i18n.ts

- Línea 913: `variable` `getDict`
- Línea 915: `function` `i18n`

### src/sisad-pdfme/ui/index.ts

- Línea 32: `variable` `PdfEditor`
- Línea 33: `variable` `PdfFormView`
- Línea 34: `variable` `PdfViewer`
- Línea 35: `variable` `PdfEditorEngineBuilder`

### src/sisad-pdfme/ui/theme.ts

- Línea 15: `variable` `defaultTheme`
- Línea 34: `variable` `sisadTheme`

### src/sisad-pdfme/ui/types.ts

- Línea 22: `type` `DesignerSidebarPresentation`
- Línea 24: `type` `SidebarProps`
- Línea 46: `type` `DesignerComponentBridge`
- Línea 69: `type` `DesignerDocumentsBridge`
- Línea 80: `type` `DesignerCommentItem`
- Línea 95: `type` `DesignerCommentsBridge`
- Línea 103: `type` `DesignerRuntimeApi`
```

<a id="file-0102"></a>

### 0102 — `scripts/README.md`

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

<a id="file-0103"></a>

### 0103 — `ai/adapters/README.md`

- **Lenguaje:** `markdown`
- **Líneas:** `3`
- **Tamaño original:** `0.1 KB`
- **SHA1 corto:** `f5c142520b`
- **Estado:** `completo`

```markdown
# Adapters

Adaptadores para herramientas. Los archivos raíz deben ser copias delgadas de estos o apuntar a `ai/start/START.md`.
```

<a id="file-0104"></a>

### 0104 — `ai/agents/canvas-agent.md`

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

<a id="file-0105"></a>

### 0105 — `ai/agents/css-tailwind-agent.md`

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

<a id="file-0106"></a>

### 0106 — `ai/agents/designer-runtime-agent.md`

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

<a id="file-0107"></a>

### 0107 — `ai/agents/docs-architecture-agent.md`

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

<a id="file-0108"></a>

### 0108 — `ai/agents/inspector-agent.md`

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

<a id="file-0109"></a>

### 0109 — `ai/agents/interaction-agent.md`

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

<a id="file-0110"></a>

### 0110 — `ai/agents/lab-shell-agent.md`

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

<a id="file-0111"></a>

### 0111 — `ai/agents/README.md`

- **Lenguaje:** `markdown`
- **Líneas:** `3`
- **Tamaño original:** `0.1 KB`
- **SHA1 corto:** `89e1142ffd`
- **Estado:** `completo`

```markdown
# Agents

Cada agente representa un dominio principal. Un agente no debe cambiar de dominio durante una task-card.
```

<a id="file-0112"></a>

### 0112 — `ai/agents/registry.md`

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

<a id="file-0113"></a>

### 0113 — `ai/agents/schema-agent.md`

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

<a id="file-0114"></a>

### 0114 — `ai/agents/snapshot-agent.md`

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

<a id="file-0115"></a>

### 0115 — `ai/agents/visual-baseline-agent.md`

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

<a id="file-0116"></a>

### 0116 — `ai/baselines/img-version-baseline-protocol.md`

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

<a id="file-0117"></a>

### 0117 — `ai/baselines/README.md`

- **Lenguaje:** `markdown`
- **Líneas:** `3`
- **Tamaño original:** `0.1 KB`
- **SHA1 corto:** `48f5436d50`
- **Estado:** `completo`

```markdown
# Baselines

Protocolos de referencia visual y funcional.
```

<a id="file-0118"></a>

### 0118 — `ai/checklists/done-vs-pending.md`

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

<a id="file-0119"></a>

### 0119 — `ai/checklists/global-validation.md`

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

<a id="file-0120"></a>

### 0120 — `ai/checklists/improvement-backlog.md`

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

<a id="file-0121"></a>

### 0121 — `ai/checklists/manual-ui-regression.md`

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

<a id="file-0122"></a>

### 0122 — `ai/checklists/README.md`

- **Lenguaje:** `markdown`
- **Líneas:** `3`
- **Tamaño original:** `0.1 KB`
- **SHA1 corto:** `82829bf2f0`
- **Estado:** `completo`

```markdown
# Checklists

Checklists vivos para validar tareas y controlar pendientes.
```

<a id="file-0123"></a>

### 0123 — `ai/checklists/tailwind-migration.md`

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

<a id="file-0124"></a>

### 0124 — `ai/context/ai-docs-context.md`

- **Lenguaje:** `markdown`
- **Líneas:** `3`
- **Tamaño original:** `0.1 KB`
- **SHA1 corto:** `67baed74a9`
- **Estado:** `completo`

```markdown
# AI Docs Context

La carpeta `ai/` es fuente de verdad. Documentación antigua puede migrarse, pero no duplicarse.
```

<a id="file-0125"></a>

### 0125 — `ai/context/canvas-multipage-context.md`

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

<a id="file-0126"></a>

### 0126 — `ai/context/css-tailwind-context.md`

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

<a id="file-0127"></a>

### 0127 — `ai/context/inspector-context.md`

- **Lenguaje:** `markdown`
- **Líneas:** `3`
- **Tamaño original:** `0.1 KB`
- **SHA1 corto:** `f0d0387668`
- **Estado:** `completo`

```markdown
# Inspector Context

Inspector usa secciones declarativas. Widgets actualizan schema por command/update centralizado, no por mutación directa.
```

<a id="file-0128"></a>

### 0128 — `ai/context/README.md`

- **Lenguaje:** `markdown`
- **Líneas:** `3`
- **Tamaño original:** `0.1 KB`
- **SHA1 corto:** `c3611876d7`
- **Estado:** `completo`

```markdown
# Contexts

Contextos focales. Cargar solo uno por task-card.
```

<a id="file-0129"></a>

### 0129 — `ai/context/schema-families-context.md`

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

<a id="file-0130"></a>

### 0130 — `ai/context/selection-transform-context.md`

- **Lenguaje:** `markdown`
- **Líneas:** `3`
- **Tamaño original:** `0.2 KB`
- **SHA1 corto:** `82c62bc253`
- **Estado:** `completo`

```markdown
# Selection Transform Context

Selecto selecciona roots con `data-schema-id`. Moveable transforma roots. Excluir option internals, botón +, toolbar, inputs, contenteditable y overlays.
```

<a id="file-0131"></a>

### 0131 — `ai/context/snapshot-context.md`

- **Lenguaje:** `markdown`
- **Líneas:** `3`
- **Tamaño original:** `0.1 KB`
- **SHA1 corto:** `a7320fffe0`
- **Estado:** `completo`

```markdown
# Snapshot Context

Snapshot preserva document/page, geometry, ownership, options, selected values y `__designer`.
```

<a id="file-0132"></a>

### 0132 — `ai/context/visual-baseline-context.md`

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

<a id="file-0133"></a>

### 0133 — `ai/docs-migration/MIGRATION_FROM_OLD_STRUCTURE.md`

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

<a id="file-0134"></a>

### 0134 — `ai/memory/changelog.md`

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

<a id="file-0135"></a>

### 0135 — `ai/memory/completed-checklist.md`

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

<a id="file-0136"></a>

### 0136 — `ai/memory/decisions.md`

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

<a id="file-0137"></a>

### 0137 — `ai/memory/known-risks.md`

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

<a id="file-0138"></a>

### 0138 — `ai/memory/memory-update-protocol.md`

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

<a id="file-0139"></a>

### 0139 — `ai/memory/pending-checklist.md`

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

<a id="file-0140"></a>

### 0140 — `ai/memory/project-memory.md`

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

<a id="file-0141"></a>

### 0141 — `ai/memory/README.md`

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

<a id="file-0142"></a>

### 0142 — `ai/memory/session-handoff.md`

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

<a id="file-0143"></a>

### 0143 — `ai/playbooks/pb-ai-docs-refactor.md`

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

<a id="file-0144"></a>

### 0144 — `ai/playbooks/pb-canvas-multipage.md`

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

<a id="file-0145"></a>

### 0145 — `ai/playbooks/pb-css-tailwind-migration.md`

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

<a id="file-0146"></a>

### 0146 — `ai/playbooks/pb-inspector.md`

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

<a id="file-0147"></a>

### 0147 — `ai/playbooks/pb-schema-families.md`

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

<a id="file-0148"></a>

### 0148 — `ai/playbooks/pb-selection-transform.md`

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

<a id="file-0149"></a>

### 0149 — `ai/playbooks/pb-snapshot.md`

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

<a id="file-0150"></a>

### 0150 — `ai/playbooks/pb-visual-regression.md`

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

<a id="file-0151"></a>

### 0151 — `ai/playbooks/README.md`

- **Lenguaje:** `markdown`
- **Líneas:** `3`
- **Tamaño original:** `0.1 KB`
- **SHA1 corto:** `9c0f5c1b4f`
- **Estado:** `completo`

```markdown
# Playbooks

Procedimientos. Cargar uno por task-card.
```

<a id="file-0152"></a>

### 0152 — `ai/project/architecture-principles.md`

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

<a id="file-0153"></a>

### 0153 — `ai/project/definition-of-done.md`

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

<a id="file-0154"></a>

### 0154 — `ai/project/file-ownership-map.md`

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

<a id="file-0155"></a>

### 0155 — `ai/project/glossary.md`

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

<a id="file-0156"></a>

### 0156 — `ai/project/goals.md`

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

<a id="file-0157"></a>

### 0157 — `ai/project/non-goals.md`

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

<a id="file-0158"></a>

### 0158 — `ai/project/scope.md`

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

<a id="file-0159"></a>

### 0159 — `ai/prompts/claude-diagnose-or-implement.md`

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

<a id="file-0160"></a>

### 0160 — `ai/prompts/codex-master-prompt.md`

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

<a id="file-0161"></a>

### 0161 — `ai/prompts/copilot-task-context.md`

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

<a id="file-0162"></a>

### 0162 — `ai/prompts/create-task-card.md`

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

<a id="file-0163"></a>

### 0163 — `ai/prompts/README.md`

- **Lenguaje:** `markdown`
- **Líneas:** `3`
- **Tamaño original:** `0.1 KB`
- **SHA1 corto:** `c01bdd8aad`
- **Estado:** `completo`

```markdown
# Prompts

Prompts reutilizables. No reemplazan task-cards.
```

<a id="file-0164"></a>

### 0164 — `ai/prompts/update-memory.md`

- **Lenguaje:** `markdown`
- **Líneas:** `3`
- **Tamaño original:** `0.1 KB`
- **SHA1 corto:** `12f8d1fb49`
- **Estado:** `completo`

```markdown
# Prompt — Actualizar memoria

Actualiza memoria solo si hubo decisión estable. Usa `ai/memory/memory-update-protocol.md`.
```

<a id="file-0165"></a>

### 0165 — `ai/reports/README.md`

- **Lenguaje:** `markdown`
- **Líneas:** `3`
- **Tamaño original:** `0.1 KB`
- **SHA1 corto:** `b29048ecba`
- **Estado:** `completo`

```markdown
# Reports

Guardar reportes generados por tareas. No cargar reportes históricos salvo evidencia necesaria.
```

<a id="file-0166"></a>

### 0166 — `ai/reports/report-template.md`

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

<a id="file-0167"></a>

### 0167 — `ai/router/CONTEXT_BUDGET.md`

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

<a id="file-0168"></a>

### 0168 — `ai/router/ROUTER.md`

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

<a id="file-0169"></a>

### 0169 — `ai/router/TASK_INTAKE.md`

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

<a id="file-0170"></a>

### 0170 — `ai/rules/ai-docs-rules.md`

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

<a id="file-0171"></a>

### 0171 — `ai/rules/canvas-rules.md`

- **Lenguaje:** `markdown`
- **Líneas:** `3`
- **Tamaño original:** `0.1 KB`
- **SHA1 corto:** `b8b492add4`
- **Estado:** `completo`

```markdown
# Canvas Rules

No usar `pages[0]`, `pageNumber || 1`, ni query selector del primer paper para operaciones multipágina. Siempre resolver página real.
```

<a id="file-0172"></a>

### 0172 — `ai/rules/css-migration-rules.md`

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

<a id="file-0173"></a>

### 0173 — `ai/rules/global-rules.md`

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

<a id="file-0174"></a>

### 0174 — `ai/rules/inspector-rules.md`

- **Lenguaje:** `markdown`
- **Líneas:** `3`
- **Tamaño original:** `0.1 KB`
- **SHA1 corto:** `5b0775e76b`
- **Estado:** `completo`

```markdown
# Inspector Rules

Widgets no mutan schemas directamente. Usar command/update centralizado.
```

<a id="file-0175"></a>

### 0175 — `ai/rules/moveable-selecto-rules.md`

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

<a id="file-0176"></a>

### 0176 — `ai/rules/README.md`

- **Lenguaje:** `markdown`
- **Líneas:** `3`
- **Tamaño original:** `0.1 KB`
- **SHA1 corto:** `c368a81ce2`
- **Estado:** `completo`

```markdown
# Rules

Reglas duras. Cargar solo la regla principal de la task-card.
```

<a id="file-0177"></a>

### 0177 — `ai/rules/schema-rules.md`

- **Lenguaje:** `markdown`
- **Líneas:** `3`
- **Tamaño original:** `0.1 KB`
- **SHA1 corto:** `63343cb73b`
- **Estado:** `completo`

```markdown
# Schema Rules

Preservar schemaUid, documentId, pageNumber, ownerRecipientId, colors, groupId, optionId, selected values, options y `__designer`.
```

<a id="file-0178"></a>

### 0178 — `ai/rules/snapshot-rules.md`

- **Lenguaje:** `markdown`
- **Líneas:** `3`
- **Tamaño original:** `0.1 KB`
- **SHA1 corto:** `a9cb230906`
- **Estado:** `completo`

```markdown
# Snapshot Rules

No crear snapshot paralelo. No perder metadata. Todo roundtrip debe conservar el modelo.
```

<a id="file-0179"></a>

### 0179 — `ai/skills/canvas-multipage-skill.md`

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

<a id="file-0180"></a>

### 0180 — `ai/skills/inspector-skill.md`

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

<a id="file-0181"></a>

### 0181 — `ai/skills/memory-update-skill.md`

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

<a id="file-0182"></a>

### 0182 — `ai/skills/moveable-selecto-skill.md`

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

<a id="file-0183"></a>

### 0183 — `ai/skills/option-groups-skill.md`

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

<a id="file-0184"></a>

### 0184 — `ai/skills/prompting-skill.md`

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

<a id="file-0185"></a>

### 0185 — `ai/skills/README.md`

- **Lenguaje:** `markdown`
- **Líneas:** `3`
- **Tamaño original:** `0.1 KB`
- **SHA1 corto:** `ae3dd5bc05`
- **Estado:** `completo`

```markdown
# Skills

Skills son procedimientos reutilizables. Cada skill describe entradas, pasos y salida esperada.
```

<a id="file-0186"></a>

### 0186 — `ai/skills/snapshot-safety-skill.md`

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

<a id="file-0187"></a>

### 0187 — `ai/skills/tailwind-migration-skill.md`

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

<a id="file-0188"></a>

### 0188 — `ai/skills/visual-regression-skill.md`

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

<a id="file-0189"></a>

### 0189 — `ai/start/QUICKSTART-CLAUDE.md`

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

<a id="file-0190"></a>

### 0190 — `ai/start/QUICKSTART-CODEX.md`

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

<a id="file-0191"></a>

### 0191 — `ai/start/QUICKSTART-COPILOT.md`

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

<a id="file-0192"></a>

### 0192 — `ai/start/START.md`

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

<a id="file-0193"></a>

### 0193 — `ai/subagents/anti-hallucination-reviewer.md`

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

<a id="file-0194"></a>

### 0194 — `ai/subagents/baseline-visual-critic.md`

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

<a id="file-0195"></a>

### 0195 — `ai/subagents/code-docs-writer.md`

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

<a id="file-0196"></a>

### 0196 — `ai/subagents/css-auditor.md`

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

<a id="file-0197"></a>

### 0197 — `ai/subagents/legacy-css-guardian.md`

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

<a id="file-0198"></a>

### 0198 — `ai/subagents/memory-curator.md`

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

<a id="file-0199"></a>

### 0199 — `ai/subagents/prompt-engineer.md`

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

<a id="file-0200"></a>

### 0200 — `ai/subagents/README.md`

- **Lenguaje:** `markdown`
- **Líneas:** `3`
- **Tamaño original:** `0.1 KB`
- **SHA1 corto:** `1c4930a3aa`
- **Estado:** `completo`

```markdown
# Subagents

Los subagentes son apoyo especializado. No son dueños de procesos completos.
```

<a id="file-0201"></a>

### 0201 — `ai/subagents/regression-tester.md`

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

<a id="file-0202"></a>

### 0202 — `ai/subagents/tailwind-migrator.md`

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

<a id="file-0203"></a>

### 0203 — `ai/task-cards/README.md`

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

<a id="file-0204"></a>

### 0204 — `ai/templates/agent-template.md`

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

<a id="file-0205"></a>

### 0205 — `ai/templates/checklist-template.md`

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

<a id="file-0206"></a>

### 0206 — `ai/templates/decision-template.md`

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

<a id="file-0207"></a>

### 0207 — `ai/templates/memory-update-template.md`

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

<a id="file-0208"></a>

### 0208 — `ai/templates/README.md`

- **Lenguaje:** `markdown`
- **Líneas:** `3`
- **Tamaño original:** `0.1 KB`
- **SHA1 corto:** `d6fcb2dc12`
- **Estado:** `completo`

```markdown
# Templates

Plantillas para extender la arquitectura sin duplicar estilo.
```

<a id="file-0209"></a>

### 0209 — `ai/templates/skill-template.md`

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

<a id="file-0210"></a>

### 0210 — `ai/templates/task-card-template.md`

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

<a id="file-0211"></a>

### 0211 — `reports/designer-deep-audit/duplication-map.md`

- **Lenguaje:** `markdown`
- **Líneas:** `24`
- **Tamaño original:** `1.4 KB`
- **SHA1 corto:** `fb6f0f3ebb`
- **Estado:** `completo`

```markdown
# Duplication Map - Designer Refactor

## Selección
- **Funciones equivalentes:** `selectSchema`, `onSelect`, `handleSelect`, `onEdit`.
- **Archivos:** `Canvas.tsx`, `Selecto.tsx`, `hooks.ts`, `schemaLockGuard.ts`, `selectionCommands.ts`.
- **Fuente única propuesta:** `selectionPolicy.ts` y centralización en `CommandBus`.
- **Qué se elimina:** Lógica manual de `event.metaKey` / `event.ctrlKey` dispersa.

## Access / lock / readonly
- **Funciones equivalentes:** `isLocked`, `canEdit`, `isReadOnly`, `restrictChanges`.
- **Archivos:** `collaboration/index.ts`, `schemaLockGuard.ts`, `DetailView.tsx`, `Moveable.tsx`, `ListView.tsx`.
- **Fuente única propuesta:** `schemaAccessResolver.ts`.
- **Qué se elimina:** Comprobaciones redundantes en cada widget del inspector y guards en el canvas.

## Owner Appearance
- **Funciones equivalentes:** `resolveRecipientColor`, `getOwnerColor`, `applyTone`.
- **Archivos:** `PluginIcon.tsx`, `shared/renderSchemaWithChrome.ts`, `schemaOwnerAppearance.ts`.
- **Fuente única propuesta:** `schemaOwnerAppearance.ts` (centralizado).
- **Qué se elimina:** Cálculos de `color-mix` y tonos manuales en SVGs de schemas.

## Catálogo / Densidad
- **Funciones equivalentes:** `useDensity`, `getLayoutScale`.
- **Archivos:** `LeftSidebar.tsx`, `RightSidebar.tsx`, `SidebarBody.tsx`.
- **Fuente única propuesta:** Centralizar en `sidebarPanelContract.ts` y tokens de Tailwind.
```

<a id="file-0212"></a>

### 0212 — `reports/designer-deep-audit/risk-map.md`

- **Lenguaje:** `markdown`
- **Líneas:** `19`
- **Tamaño original:** `1.1 KB`
- **SHA1 corto:** `fb12f19730`
- **Estado:** `completo`

```markdown
# Risk Map - Designer Refactor

## 1. Selección y Hit-testing
- **Riesgo:** Conflicto entre `Selecto` y `Moveable`. Si no se detecta bien el target, el drag de región puede activarse al intentar mover un schema.
- **Riesgo:** Inconsistencia entre plataformas (macOS vs Windows). Actualmente no hay una política clara.
- **Impacto:** Alto. Los usuarios se frustran si no pueden seleccionar lo que quieren.

## 2. Acceso y Bloqueos (Lock/ReadOnly)
- **Riesgo:** Desincronización entre el Canvas y el Inspector (RightSidebar). El Inspector puede mostrar campos editables que en el Canvas están bloqueados.
- **Riesgo:** Fuga de estados `readOnly` vs `readonly` vs `locked`.
- **Impacto:** Crítico. Puede causar pérdida de datos o ediciones no autorizadas.

## 3. CommandBus
- **Riesgo:** Mutaciones paralelas. Si el inspector edita un campo directamente sin pasar por el CommandBus, se pierde el historial (Undo/Redo) y la sincronización colaborativa.
- **Impacto:** Alto.

## 4. Multipage / Z-Index
- **Riesgo:** Selección de elementos a través de páginas o capas superpuestas (Overlays).
- **Impacto:** Medio.
```

<a id="file-0213"></a>

### 0213 — `reports/tailwind-migration/baseline-regression-audit.md`

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

<a id="file-0214"></a>

### 0214 — `reports/tailwind-migration/component-migration-ledger.md`

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

<a id="file-0215"></a>

### 0215 — `reports/tailwind-migration/deep-density-spacing-audit.md`

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

<a id="file-0216"></a>

### 0216 — `reports/tailwind-migration/img-version-baseline-inventory.md`

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

<a id="file-0217"></a>

### 0217 — `reports/tailwind-migration/line-by-line-style-audit.md`

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

<a id="file-0218"></a>

### 0218 — `reports/tailwind-migration/pending-phases-progress.md`

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

<a id="file-0219"></a>

### 0219 — `reports/tailwind-migration/README.md`

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

<a id="file-0220"></a>

### 0220 — `reports/tailwind-migration/right-sidebar-scroll-tailwind-fix.md`

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

<a id="file-0221"></a>

### 0221 — `reports/tailwind-migration/right-sidebar-tailwind-only-density-fix.md`

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

<a id="file-0222"></a>

### 0222 — `reports/tailwind-migration/rightsidebar-detailview-tailwind-audit.md`

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

<a id="file-0223"></a>

### 0223 — `reports/tailwind-migration/runtime-form-viewer-tailwind-audit.md`

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

<a id="file-0224"></a>

### 0224 — `reports/tailwind-migration/schema-chrome-tailwind-audit.md`

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

<a id="file-0225"></a>

### 0225 — `reports/tailwind-migration/tc-css-04-left-sidebar-tailwind.md`

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

<a id="file-0226"></a>

### 0226 — `reports/tailwind-migration/tc-css-08-control-bar-toolbar-tailwind.md`

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

<a id="file-0227"></a>

### 0227 — `reports/tailwind-migration/tc-css-10-schemas-visual.md`

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

<a id="file-0228"></a>

### 0228 — `reports/tailwind-migration/tc-css-11-lab-audit.md`

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

<a id="file-0229"></a>

### 0229 — `reports/tailwind-migration/tc-css-option-group-selection-fix.md`

- **Lenguaje:** `markdown`
- **Líneas:** `38`
- **Tamaño original:** `4.3 KB`
- **SHA1 corto:** `de51019d12`
- **Estado:** `completo`

```markdown
# radioGroup / checkboxGroup — fix de selección y doble diseño

Problema: en `/lab/multi-document-routing` no se podían seleccionar radioGroup/checkboxGroup; wrapper colapsado a ~`2px × 81px`; doble diseño (checkboxGroup); grupos fuera de Selecto/Moveable.

## Causa raíz (confirmada empíricamente)
1. **`global.css` colapsaba el target seleccionable**: `.sisad-pdfme-ui-custom-selectable[data-schema-type="radioGroup"|"checkboxGroup"] { width: fit-content !important; height: fit-content !important; }` → el wrapper (target de Selecto/Moveable) quedaba a ~2px, ignorando `schema.width/height` del inline. **Ese `!important` es el causante del `2px × 81px`.**
2. **`Renderer.tsx`**: `isCompactChoiceSchema = schemaType === 'radioGroup'` — solo radioGroup → checkboxGroup recibía wrapper de schema normal + su render interno = **doble diseño**.

## Cambios (4 archivos — sin tocar Canvas/Moveable/Selecto)
| Archivo | Cambio |
|---|---|
| `ui/components/Renderer.tsx` | `isCompactChoiceSchema` incluye `checkboxGroup` (wrapper transparente, sin doble diseño). Añade `--schema-owner-color` al wrapperStyle. Geometría sigue de `schema.width/height`. |
| `ui/styles/sisad-pdfme-global.css` | **Elimina el `width/height: fit-content !important`** sobre el wrapper → conserva geometría del schema. Añade `overflow-visible bg-transparent`. Añade `pointer-events` por modo sobre `[data-option-id]` (designer/viewer: none; form: auto). |
| `schemas/options/optionGroupFactory.ts` | `applyOptionGroupRootRuntime`: `pointerEvents = mode === 'form' ? 'auto' : 'none'` (antes `isDesigner ? 'none' : 'auto'` — viewer quedaba interactivo). + `data-designer-selection-mode="root-only"`. |
| `schemas/options/optionGroupRenderer.ts` | `rowsInteractive = mode === 'form' && editable && !readOnly` (designer/viewer NO interactivos). Añade clases `sisad-pdfme-option-group-wrapper` / `-body` / `-indicator`. |

## Por qué NO toqué Canvas.tsx (regla 4)
La solución elegante evita modificar la integración de Moveable/Selecto: con el `option-group-root` en `pointer-events: none` (designer/viewer), los clicks sobre las opciones **pasan a través** al wrapper `.sisad-pdfme-ui-custom-selectable[data-schema-id]`, que ES el target de selección. No hace falta rutear el evento en `onMouseDownCapture`. Menor riesgo.

## Validación (Playwright, `/lab/multi-document-routing`, 0 errores)
- radioGroup wrapper **242×53px**, checkboxGroup **271×35px** (unscaled ~309×68 / 347×45) — **geometría real, ya no colapsado**. ✅
- **Click sobre el grupo → `data-schema-active="true"`** (selecciona el grupo completo). ✅
- `option-group-root` con `pointer-events: none` en designer/viewer (clicks caen al wrapper). ✅
- checkboxGroup compacto/transparente (sin doble diseño). ✅
- Build `npm run build` ✅ (exit 0) · lint Renderer.tsx sin errores.

## Reglas respetadas
No toqué coordenadas x/y/width/height/rotation (la geometría sale del schema/inline). No toqué SnapshotAdapter, Generator/PDF, Moveable, Selecto, ni Canvas.tsx. Sin `setTimeout`, sin z-index, sin `!important` nuevo (de hecho **eliminé** uno). Las opciones internas NO son schemas (sin `data-schema-id`).

## Fix del "doble diseño" (2ª iteración)
La captura reveló que los "dos diseños" **no eran dos estados** sino **dos renders distintos**: pdfme renderiza el schema **activo/seleccionado en modo `designer`** y los inactivos en `viewer`. El render de designer (`createDesignerOptionGroupEl`) dibujaba **cajas cian `#65d8de`**; el de runtime (`createOptionGroupRuntime`) dibuja los indicadores compactos. Al seleccionar, el grupo cambiaba a las cajas cian → "doble diseño".

**Fix:** en `optionGroupFactory.ts::renderOptionGroupUi`, **ignorar `renderDesigner` y usar siempre `renderRuntime`** → designer/viewer/form renderizan el MISMO diseño compacto. La selección la dibuja Moveable/Selecto encima (marco/handles/+), nunca dentro del schema.

Validación: al seleccionar un radioGroup → `activeHasDesignerBoxes: 0`, `activeHasRuntimeRows: 2`, `anyDesignerBoxesInCanvas: 0` (las cajas cian desaparecieron), diseño idéntico seleccionado/no seleccionado, geometría 242×53 intacta, 0 errores.

## Nota de colisión
`global.css` lo edita una sesión paralela en vivo (cambió durante esta tarea). Reapliqué sobre el estado actual y el build pasa; si el worker reintroduce el `fit-content`, reaplicar este cambio.
```

<a id="file-0230"></a>

### 0230 — `reports/tailwind-migration/tc-css-ownership-color.md`

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

<a id="file-0231"></a>

### 0231 — `reports/tailwind-migration/ui-styles-decommission-audit.md`

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

<a id="file-0232"></a>

### 0232 — `reports/tailwind-migration/ui-styles-decommission-progress.md`

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

<a id="file-0233"></a>

### 0233 — `ai/task-cards/active/TASK-CANVAS-002-snap-lines-and-sidebar-compactness.md`

- **Lenguaje:** `markdown`
- **Líneas:** `36`
- **Tamaño original:** `1.1 KB`
- **SHA1 corto:** `527190e6eb`
- **Estado:** `completo`

```markdown
# TASK-CANVAS-002 — Snap lines exactas y sidebars compactos

## Objetivo
Mejorar la precisión visual de las snap lines al mover schemas y compactar el comportamiento visual de ambos sidebars sin tocar geometría global ni persistencia.

## Alcance
- `src/sisad-pdfme/ui/components/Designer/Canvas/SnapLines.tsx`
- `src/sisad-pdfme/ui/components/Designer/Canvas/Canvas.tsx`
- `src/sisad-pdfme/ui/components/Designer/RightSidebar/RightSidebar.tsx`
- `src/sisad-pdfme/ui/styles/tokens.css`

## Fuera de alcance
- `Paper.tsx`
- `Selecto.tsx`
- `Moveable.tsx`
- `snapshotAdapter`
- `generator`
- `pdf-lib`

## Pasos
1. Endurecer el snap para que la guía se vea alineada con más precisión.
2. Compactar el rail colapsado del lado derecho.
3. Reducir el ancho del rail colapsado del lado izquierdo.
4. Validar que no se rompa el layout horizontal.

## Validación
- `npm run build`
- `npm run lint`
- `npx playwright test tests/e2e/sidebar-collapse-parity.spec.ts --project=chromium`

## Criterio de parada
- Si hace falta tocar geometría global, detenerse.

## Entrega final
- Resumen corto de archivos modificados
- Validación ejecutada
```

<a id="file-0234"></a>

### 0234 — `ai/task-cards/active/TASK-DOCS-001-ai-architecture-install.md`

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

<a id="file-0235"></a>

### 0235 — `ai/task-cards/active/TASK-INSPECTOR-001-detailview-density.md`

- **Lenguaje:** `markdown`
- **Líneas:** `55`
- **Tamaño original:** `1.7 KB`
- **SHA1 corto:** `2b2c127a97`
- **Estado:** `completo`

```markdown
# TASK-INSPECTOR-001 — Compactar el DetailView

## Objetivo
Reducir densidad visual del `RightSidebar` DetailView sin cambiar el contrato funcional ni las secciones canónicas ya definidas.

## Alcance
- Header del inspector
- Tarjetas de sección
- Widgets del DetailView con skin/densidad
- Descripciones y espaciado

## Fuera de alcance
- Canvas
- Moveable
- Selecto
- Paper
- Drag/drop
- Coordenadas de schema
- SnapshotAdapter
- Generator
- pdf-lib

## Archivos candidatos
- `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailHeaderCard.tsx`
- `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailViewContent.tsx`
- `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailSectionCard.tsx`
- `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailHeaderUtils.ts`
- `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailWidgets.tsx`
- `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/InspectorPrimitives.tsx`
- `src/styles/sisad-tailwind-bridge.css`

## Archivos prohibidos
- `src/sisad-pdfme/ui/components/Designer/Canvas/**`
- `src/sisad-pdfme/ui/components/Paper.tsx`
- `src/sisad-pdfme/shared/snapshotAdapter.ts`
- `src/sisad-pdfme/generator/**`
- `src/sisad-pdfme/pdf-lib/**`

## Pasos
1. Compactar header y subtítulo.
2. Reducir padding/altura de cards.
3. Ajustar descripciones y jerarquía visual.
4. Aligerar widgets sin cambiar lógica.

## Validación
- `contract_stage` muestra un inspector más compacto.
- La densidad visual baja sin perder secciones.
- No se rompe selección ni interacción del canvas.

## Criterio de parada
- Si hace falta tocar canvas o geometría, detenerse.

## Entrega final
- Resumen corto de archivos modificados
- Confirmación de build/lint
```

<a id="file-0236"></a>

### 0236 — `ai/task-cards/active/TASK-LAB-001-results-panel-placement.md`

- **Lenguaje:** `markdown`
- **Líneas:** `35`
- **Tamaño original:** `1.1 KB`
- **SHA1 corto:** `72d0bb7f83`
- **Estado:** `completo`

```markdown
# TASK-LAB-001 — Reubicar el panel de resultados del laboratorio

## Objetivo
Mover `ResultsPanel` fuera de la zona de canvas/zoom y compactar su presentación para que no interfiera con el workspace del laboratorio.

## Alcance
- `src/features/pdfcomponent/ResultsPanel.jsx`
- `src/features/pdfcomponent/PdfmeLabPage.jsx`
- `src/features/pdfcomponent/labRoutes.css`
- `src/styles/sisad-tailwind-bridge.css`

## Fuera de alcance
- `src/sisad-pdfme/**`
- `Moveable`
- `Selecto`
- `snapshotAdapter`
- `generator`
- `pdf-lib`

## Pasos
1. Convertir el modo drawer en una barra inferior compacta que no cubra el canvas cuando está cerrada.
2. Reducir la altura y densidad del cuerpo de resultados.
3. Ajustar el copy de estado vacío/cerrado a una etiqueta más breve.
4. Verificar que la colocación no rompa el layout del laboratorio.

## Validación
- `npm run lint`
- `npm run build`

## Criterio de parada
- Si hace falta tocar el runtime del diseñador o geometría del canvas, detenerse.

## Entrega final
- Resumen corto de archivos modificados
- Validación ejecutada
```

<a id="file-0237"></a>

### 0237 — `ai/task-cards/active/TASK-SCHEMA-001-option-indicator-docusign.md`

- **Lenguaje:** `markdown`
- **Líneas:** `49`
- **Tamaño original:** `1.7 KB`
- **SHA1 corto:** `a6a9d2a237`
- **Estado:** `completo`

```markdown
# TASK-SCHEMA-001 — Option indicators DocuSign-like

## Objetivo
Unificar el indicador visual y el comportamiento de checkbox, checkboxGroup y radioGroup para Designer/Form/Viewer/PDF sin duplicar DOM o lógica.

## Alcance
- `optionIndicator.ts` como fuente visual central.
- `optionGroupRenderer.ts` para click/double click por modo.
- `checkbox/index.ts` para checkbox individual.
- CSS de option groups para evitar paneles o franjas internas.

## Fuera de alcance
- `SnapshotAdapter`
- `Generator` global
- `Moveable.tsx`
- `Selecto.tsx`
- Coordenadas globales x/y/width/height/rotation salvo sincronía existente de altura de grupo.

## Archivos candidatos
- `src/sisad-pdfme/schemas/options/optionIndicator.ts`
- `src/sisad-pdfme/schemas/options/optionGroupRenderer.ts`
- `src/sisad-pdfme/schemas/checkbox/index.ts`
- `src/sisad-pdfme/ui/styles/sisad-pdfme-global.css`
- `src/styles/sisad-tailwind-bridge.css`

## Archivos prohibidos
- `src/sisad-pdfme/ui/components/Designer/Moveable.tsx`
- `src/sisad-pdfme/ui/components/Designer/Selecto.tsx`
- `SnapshotAdapter`
- `Generator` global

## Pasos
1. Centralizar visual en `optionIndicator.ts`.
2. Ajustar render de grupo para designer/form/viewer/pdf.
3. Hacer checkbox individual consistente con el helper común.
4. Reforzar CSS para eliminar paneles/fondos extra.

## Validación
- `npm run build`
- `npm run lint` si existe y no está roto por configuración
- Verificación manual en `http://localhost:5174/lab/multi-document-routing`

## Criterio de parada
Detenerse si para cumplir el objetivo hay que tocar Moveable/Selecto, snapshot, generator o geometría global.

## Entrega final
- Resumen de archivos modificados.
- Confirmación de límites respetados.
- Resultado de build/lint.
```

<a id="file-0238"></a>

### 0238 — `ai/task-cards/backlog/TASK-CANVAS-001-protect-canvas-overflow.md`

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

<a id="file-0239"></a>

### 0239 — `ai/task-cards/backlog/TASK-CSS-001-tailwind-regression-stabilization.md`

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

<a id="file-0240"></a>

### 0240 — `ai/task-cards/backlog/TASK-VISUAL-001-img-version-baseline.md`

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

<a id="file-0241"></a>

### 0241 — `ai/task-cards/completed/README.md`

- **Lenguaje:** `markdown`
- **Líneas:** `3`
- **Tamaño original:** `0.1 KB`
- **SHA1 corto:** `cadc8883fb`
- **Estado:** `completo`

```markdown
# Completed Task Cards

Mover aquí task-cards completadas con reporte final.
```

<a id="file-0242"></a>

### 0242 — `src/sisad-pdfme/common/documentacion-common-sisad-pdfme.md`

- **Lenguaje:** `markdown`
- **Líneas:** `784`
- **Tamaño original:** `21.6 KB`
- **SHA1 corto:** `9c6d9256ef`
- **Estado:** `completo`

```markdown
# Documentación técnica — `src/sisad-pdfme/common/*`

Documentación preparada para los archivos core compartidos de `@sisad-pdfme/common`.

Archivos cubiertos:

- `collaboration.ts`
- `comments.ts`
- `constants.ts`
- `dynamicTemplate.ts`
- `expression.ts`
- `helper.ts`
- `index.ts`
- `pluginRegistry.ts`
- `schema.ts`
- `types.ts`
- `version.ts`

> Criterio de arquitectura: estos archivos pertenecen al núcleo común. No deben importar React, componentes visuales, CSS, sidebars, canvas, Moveable ni Selecto. Su responsabilidad es contrato, datos, validación, helpers, plugins, comentarios, colaboración, templates dinámicos y exports públicos.

---

## 1. `collaboration.ts`

### Responsabilidad

Módulo común para colaboración, comentarios base y assignments. Centraliza normalización de usuarios/destinatarios, creación de comentarios/anclas, filtrado colaborativo y generación de índices de schemas por usuario, destinatario, documento y página.

### API pública

``​`ts
normalizeRecipientIds(value)
resolveSchemaAuthorId(schema)
schemaMatchesAuthorView(schema, filter)
filterSchemasByAuthorView(schemas, filter)
createSchemaComment(text, identity, overrides)
createSchemaCommentAnchor(anchor, identity)
upsertById(items, nextItem)
removeById(items, id)
buildSchemaAssignments(schemas)
buildUserSchemaAssignments(schemas)
buildUserRecipientAssignments(schemas, options)
validateCollaborativeSchemas(schemas)
``​`

### Encabezado recomendado

``​`ts
/**
 * collaboration.ts
 *
 * Utilidades puras de colaboración para `sisad-pdfme`.
 *
 * Este módulo no pertenece a la UI. Su función es normalizar ids,
 * crear comentarios/anclas, resolver visibilidad colaborativa y construir
 * estructuras de assignments derivadas de los schemas actuales.
 *
 * Estructuras principales:
 *
 * - SchemaAssignments:
 *   assignments[recipientId][fileId][pageKey] = [schemaUid]
 *
 * - UserRecipientSchemaAssignments:
 *   assignments[userId][recipientId][fileId][pageKey] = [schemaUid]
 *
 * Reglas:
 *
 * - `schemaUid` es la identidad técnica preferida del schema.
 * - `id` y `name` solo son fallback de compatibilidad.
 * - `ownerRecipientId/ownerRecipientIds` definen ownership funcional.
 * - `createdBy/lastModifiedBy` definen autoría colaborativa.
 * - `__shared__` representa schemas compartidos/globales.
 */
``​`

### Notas por función

#### `normalizeRecipientIds`

Normaliza ids recibidos como array o string separado por comas. Elimina espacios, valores vacíos y duplicados.

#### `createSchemaComment`

Crea un comentario completo con `id`, `scope`, `fileId`, `pageNumber`, `fieldId`, `schemaUid`, autor, fechas, texto, estado y replies.

#### `createSchemaCommentAnchor`

Crea un ancla visual de comentario asociada a documento, página, coordenada o schema.

#### `buildSchemaAssignments`

Agrupa schemas por destinatario:

``​`txt
assignments[recipientId][fileId][pageKey] = [schemaUid]
``​`

#### `buildUserSchemaAssignments`

Agrupa schemas por autor:

``​`txt
assignments[userId][fileId][pageKey] = [schemaUid]
``​`

#### `buildUserRecipientAssignments`

Agrupa por usuario y destinatario:

``​`txt
assignments[userId][recipientId][fileId][pageKey] = [schemaUid]
``​`

### Riesgos detectados

1. `createSchemaComment` y `createSchemaCommentAnchor` sobrescriben `authorId`, `authorName` y `authorColor` con `undefined` si `identity` viene vacío, aunque esos valores existan en `overrides` o `anchor`.
2. `Date.now()` se llama más de una vez para `timestamp` y `createdAt`; pueden diferir por milisegundos.
3. `normalizeText` solo acepta strings. Si el backend entrega ids numéricos, se pierden.
4. `pageNumber`, `x` y `y` solo aceptan números reales, no strings numéricos.
5. En `ownerMode: 'shared'`, `buildUserRecipientAssignments` puede guardar el mismo schema en `__unassigned__` y `__shared__`. Debes decidir si eso es trazabilidad deseada o duplicidad lógica.

---

## 2. `comments.ts`

### Responsabilidad

Fachada común para comentarios de schema y comentarios top-level del template. Soporta dos almacenamientos compatibles:

``​`txt
schema.comments[]
schema.commentAnchors[]
``​`

Y:

``​`txt
template.pdfComments[]
template.__commentAnchors[] // compatibilidad legacy
``​`

### API pública

``​`ts
findSchemaByUid(template, schemaUid)
addAnchorToSchema(schema, anchor, identity)
addCommentToSchema(schema, text, identity, anchor)
addCommentWithAnchorToTemplate(template, anchor, text, identity)
upsertTopLevelComment(template, entry)
removeTopLevelComment(template, commentId)
updateCommentInSchema(schema, commentId, updates)
deleteCommentFromSchema(schema, commentId)
resolveCommentInSchema(schema, commentId, resolved)
filterCommentsByFileAndPage(template, fileId, pageNumber)
``​`

### Encabezado recomendado

``​`ts
/**
 * comments.ts
 *
 * Capa común para gestionar comentarios y anclas del diseñador PDF.
 *
 * Este módulo opera sobre estructuras de datos, no sobre UI. Permite
 * crear, actualizar, eliminar, resolver y filtrar comentarios asociados
 * a schemas o a ubicaciones top-level del documento.
 *
 * Almacenamiento soportado:
 *
 * - `schema.comments[]` para comentarios embebidos en un campo.
 * - `schema.commentAnchors[]` para anclas visuales del campo.
 * - `template.pdfComments[]` como almacenamiento canónico top-level.
 * - `template.__commentAnchors[]` como compatibilidad legacy.
 */
``​`

### Notas por función

#### `findSchemaByUid`

Busca un schema dentro de `template.schemas` usando prioridad:

``​`txt
schemaUid → id → name
``​`

Retorna `{ pageIndex, index, schema }` o `null`.

#### `addCommentWithAnchorToTemplate`

Si el anchor contiene `schemaUid` y existe el schema, agrega el comentario dentro del schema. Si no existe, lo guarda como comentario top-level del template.

#### `filterCommentsByFileAndPage`

Devuelve comentarios de schemas y top-level, deduplicados por `commentId`, filtrando opcionalmente por `fileId` y `pageNumber`.

### Riesgos detectados

1. `commentsCount` aumenta o disminuye en cada operación, pero si se hace `upsert` sobre un comentario existente, el contador puede quedar inflado.
2. `removeTopLevelComment` elimina solo top-level; no elimina comentarios embebidos en schemas.
3. `resolveCommentInSchema` solo resuelve comentarios dentro de schema; no resuelve top-level.
4. `filterCommentsByFileAndPage` compara `fileId` usando `String`; correcto para compatibilidad, pero debe mantenerse consistente con `schema.fileId/fileTemplateId`.
5. Hay uso de `as any` en creación de anchors y comments. Sería ideal tipar mejor `PdfComment` y `TopLevelPdfCommentEntry` para reducir casts.

---

## 3. `constants.ts`

### Responsabilidad

Define constantes físicas, PDF base A4, ratios de conversión y fuente por defecto.

### API pública

``​`ts
PT_TO_PX_RATIO
PT_TO_MM_RATIO
MM_TO_PT_RATIO
ZOOM
BLANK_A4_PDF
CUSTOM_A4_PDF
BLANK_PDF
DEFAULT_FONT_NAME
DEFAULT_FONT_VALUE
``​`

### Encabezado recomendado

``​`ts
/**
 * constants.ts
 *
 * Constantes base para unidades, PDF por defecto y fuente fallback.
 *
 * Este archivo debe mantenerse estable porque afecta rendering,
 * generación PDF, conversión de unidades y templates sin PDF cargado.
 */
``​`

### Riesgos detectados

1. `BLANK_PDF` está deprecado y apunta a `CUSTOM_A4_PDF`. Conviene mantenerlo solo por compatibilidad.
2. `DEFAULT_FONT_VALUE` es una cadena base64 muy grande. No debe copiarse en logs ni documentación extensa.
3. Cambiar ratios como `PT_TO_MM_RATIO` o `ZOOM` puede romper layout y generación.

---

## 4. `dynamicTemplate.ts`

### Responsabilidad

Genera un template ajustado para contenido dinámico, especialmente tablas o schemas que pueden crecer en altura. Solo procesa templates con `BlankPdf`; si el `basePdf` es PDF real/custom, retorna el template original.

### API pública

``​`ts
getDynamicTemplate({ template, input, _cache, options, getDynamicHeights })
``​`

### Encabezado recomendado

``​`ts
/**
 * dynamicTemplate.ts
 *
 * Motor de reflujo para templates con schemas de altura dinámica.
 *
 * Su objetivo es calcular alturas reales, dividir contenido en páginas
 * cuando no cabe y devolver un nuevo template con schemas reposicionados.
 *
 * Reglas:
 *
 * - Solo aplica a `BlankPdf`.
 * - Procesa cada página de forma independiente.
 * - No propaga offset entre páginas originales.
 * - Respeta el orden original de schemas dentro de cada página.
 * - Usa `__bodyRange` y `__isSplit` para marcar schemas divididos.
 */
``​`

### Flujo interno

``​`txt
1. Verifica que basePdf sea BlankPdf.
2. Calcula alto útil de página: height - paddingTop - paddingBottom.
3. Normaliza schemas por página y los ordena por Y.
4. Calcula alturas dinámicas con concurrencia limitada.
5. Divide filas/contenido entre páginas.
6. Reordena cada página según orden original.
7. Elimina páginas vacías al final.
8. Si no hubo cambios, retorna el template original.
9. Si hubo cambios, retorna { basePdf, schemas: resultPages }.
``​`

### Riesgos detectados

1. El retorno `{ basePdf, schemas: resultPages }` puede perder metadata adicional del template original si existía, por ejemplo `documents`, `pdfComments`, `recipients`, `version`, etc.
2. El procesamiento es independiente por página. Eso es eficiente, pero significa que el overflow de una página no empuja contenido de páginas posteriores originales.
3. `orderMap` usa `schema.name` como clave. Si hay nombres repetidos, el orden puede ser ambiguo.
4. `getDynamicHeights` devuelve `[0]` si no hay alturas; esto puede crear schemas de altura 0.

### Ajuste recomendado

Preservar metadata del template:

``​`ts
return { ...template, basePdf, schemas: resultPages };
``​`

---

## 5. `expression.ts`

### Responsabilidad

Motor seguro de placeholders y expresiones dentro de contenido textual. Evalúa expresiones encerradas en `{ ... }` usando AST de `acorn`, con validación de sintaxis permitida, globals controlados y protección básica contra prototype pollution.

### API pública

``​`ts
replacePlaceholders({ content, data, schemas })
``​`

### Encabezado recomendado

``​`ts
/**
 * expression.ts
 *
 * Evaluador seguro de placeholders para contenido dinámico.
 *
 * Permite expresiones dentro de `{ ... }` usando un subconjunto controlado
 * de JavaScript evaluado desde AST, no mediante `eval`.
 *
 * Incluye:
 *
 * - cache de expresiones parseadas;
 * - parseo defensivo de strings JSON;
 * - globals permitidos;
 * - Object.assign seguro;
 * - bloqueo de `constructor`, `__proto__`, `prototype` y métodos peligrosos;
 * - helpers de fecha;
 * - fallback: si una expresión falla, conserva el placeholder original.
 */
``​`

### Comportamiento esperado

``​`txt
Entrada:  "Hola {user.name}, total: {price * qty}"
Contexto: { user: { name: "Ana" }, price: 10, qty: 3 }
Salida:   "Hola Ana, total: 30"
``​`

### Riesgos detectados

1. `parseDataCache` usa `JSON.stringify(data)` como key. En objetos grandes o con orden variable puede crecer demasiado o generar claves costosas.
2. Se permite `Date`, `Array`, `String`, `Number`, `JSON` y funciones globales. Aunque el AST está validado, conviene mantener tests de seguridad.
3. `CallExpression` permite llamar funciones si están en el contexto o globals permitidos. Esto debe ser deliberado.
4. La función conserva el placeholder original si falla, lo cual es bueno para resiliencia, pero puede ocultar errores si no hay modo debug.
5. El parser soporta expresiones con llaves anidadas mediante contador, lo cual es correcto, pero requiere tests de casos incompletos.

---

## 6. `helper.ts`

### Responsabilidad

Colección de utilidades comunes para validación, conversión de unidades, PDFs, fuentes, base64 y verificación de props.

### API pública

``​`ts
cloneDeep
getFallbackFontName
getDefaultFont
mm2pt
pt2mm
pt2px
px2mm
isHexValid
migrateTemplate
getInputFromTemplate
getB64BasePdf
isBlankPdf
b64toUint8Array
checkFont
checkPlugins
checkInputs
checkUIOptions
checkPreviewProps
checkDesignerProps
checkUIProps
checkTemplate
checkGenerateProps
``​`

### Encabezado recomendado

``​`ts
/**
 * helper.ts
 *
 * Utilidades transversales de `@sisad-pdfme/common`.
 *
 * Contiene conversiones físicas, normalización de PDF base, fuentes,
 * migración de templates legacy, conversión base64 y validaciones Zod
 * de contratos públicos.
 */
``​`

### Riesgos detectados

1. `cloneDeep = structuredClone` es limpio, pero puede fallar si recibe funciones, clases, DOM nodes u objetos no clonables.
2. `getB64BasePdf` hace `fetch` si recibe una URL en browser. Debe evitarse con URLs no confiables si el host no controla origen.
3. `migrateTemplate` muta el template recibido. Esto es intencional, pero debe documentarse porque otros helpers suelen clonar.
4. `checkFont` exige exactamente un fallback; correcto, pero puede romper integraciones si se registran fuentes sin fallback explícito.
5. `checkTemplate` migra y valida; si se usa en flujo de solo lectura, recordar que puede modificar estructura legacy.

---

## 7. `index.ts`

### Responsabilidad

Barril público de `@sisad-pdfme/common`. Reexporta constantes, helpers, colaboración, comentarios, templates dinámicos, expresiones, plugin registry y tipos.

### Encabezado recomendado

``​`ts
/**
 * index.ts
 *
 * Entrada pública de `@sisad-pdfme/common`.
 *
 * Este archivo define qué APIs quedan disponibles para el resto del
 * monorepo y para consumidores externos. Evitar exportar helpers internos
 * accidentales porque este archivo se convierte en contrato público.
 */
``​`

### Riesgos detectados

1. Todo lo exportado aquí se vuelve API pública de facto.
2. Si se elimina o renombra un export, puede romper `designer`, `form`, `viewer`, `generator` o integraciones externas.
3. Conviene separar mentalmente exports estables de compatibilidad legacy.

---

## 8. `pluginRegistry.ts`

### Responsabilidad

Wrapper de colección de plugins con métodos de búsqueda por tipo y resolución de familia/inspector para DetailView.

### API pública

``​`ts
pluginRegistry(plugins)
``​`

Retorna:

``​`ts
{
  plugins,
  entries,
  values,
  exists,
  findWithLabelByType,
  findByType,
  getFamilyByType,
  getSupportedActionsByType,
  getStrategiesByType,
  getVisibleSectionsByType,
}
``​`

### Encabezado recomendado

``​`ts
/**
 * pluginRegistry.ts
 *
 * Adaptador de plugins para resolver schemas por tipo y exponer metadata
 * de inspector/familia al diseñador.
 *
 * Une la configuración declarada por cada plugin con presets canónicos
 * de `schemaFamilies`, permitiendo que DetailView muestre secciones,
 * acciones y estrategias según el tipo de schema.
 */
``​`

### Riesgos detectados

1. `findWithLabelByType` depende de `plugin.propPanel.defaultSchema.type`. Si un plugin no define bien `defaultSchema`, no será localizable.
2. `getFamilyByType` mezcla preset base con overrides del plugin. Es correcto, pero conviene testear precedencia.
3. El archivo importa desde `../schemas/schemaFamilies.js`; eso introduce acoplamiento de `common` hacia `schemas`. Si `common` debe ser totalmente independiente, este punto debe revisarse.

---

## 9. `schema.ts`

### Responsabilidad

Contratos runtime de validación con Zod. Define enums, schemas de comentarios, anchors, schemas PDF, template, inputs, fuentes, plugins, opciones y props públicas.

### API pública

``​`ts
Lang
CommentScope
Dict
Mode
ColorType
Size
SchemaCommentReply
SchemaComment
CommentAnchor
Schema
SchemaForUI
BlankPdf
CustomPdf
BasePdf
LegacySchemaPageArray
SchemaPageArray
Template
Inputs
Font
Plugin
CommonOptions
GeneratorOptions
GenerateProps
UIOptions
UIProps
PreviewProps
DesignerProps
``​`

### Encabezado recomendado

``​`ts
/**
 * schema.ts
 *
 * Contratos Zod de `@sisad-pdfme/common`.
 *
 * Este archivo valida la forma runtime de templates, schemas, comentarios,
 * anchors, opciones UI, props públicas, plugins y fuentes.
 *
 * Todo cambio aquí puede afectar import/export, snapshot, generator,
 * designer, form, viewer e integraciones externas.
 */
``​`

### Riesgos detectados

1. `Schema` permite `.passthrough()` en varias zonas; esto da flexibilidad para plugins y snapshot, pero permite metadata no validada.
2. `ownerRecipientIds` en Zod aparece como `z.array(z.string())`, mientras otros módulos aceptan también string separado por comas. Si llega string al contrato estricto, puede fallar.
3. `commentsAnchors` y `commentAnchors` coexisten; parece compatibilidad legacy, pero debe documentarse como alias.
4. `Plugin` se valida de forma flexible, pero la calidad real del plugin depende de que `pdf`, `ui` y `propPanel.defaultSchema` estén correctamente implementados.

---

## 10. `types.ts`

### Responsabilidad

Tipos TypeScript derivados de Zod y contratos extendidos para plugins, renderer PDF, renderer UI, property panel, inspector y registry de plugins.

### API pública

Incluye:

``​`ts
PDFRenderProps
UIRenderProps
PropPanelWidgetProps
PropPanelInspectorSectionKey
PropPanelInspectorConfig
PropPanel
Plugin
Plugins
PluginRegistry
Lang
Dict
Mode
Schema
SchemaForUI
SchemaComment
CommentAnchor
Font
Template
GenerateProps
UIProps
PreviewProps
DesignerProps
SchemaPageArray
LegacySchemaPageArray
``​`

### Encabezado recomendado

``​`ts
/**
 * types.ts
 *
 * Tipos públicos de `@sisad-pdfme/common` derivados de los contratos Zod
 * y extendidos con contratos de plugins, renderer PDF, renderer UI,
 * propPanel e inspector.
 *
 * Este archivo es el contrato TypeScript principal entre common, schemas,
 * ui, generator, viewer, form e integraciones externas.
 */
``​`

### Riesgos detectados

1. `Plugins = { [key: string]: Plugin<any> }` mantiene flexibilidad, pero reduce type-safety por plugin.
2. `UIRenderProps.onChange` acepta un objeto o un array de cambios; esto es potente, pero debe mantenerse consistente con command/snapshot.
3. `PropPanelInspectorSectionKey` usa nombres como `general`, `layout`, `style`, etc.; si el DetailView usa otra taxonomía como `identity`, `box`, `appearance`, hay que mapear explícitamente.
4. `PluginRegistry.getFamilyByType` declara retorno `PluginFamilyDefinition | null`, pero la implementación actual puede devolver un objeto mezclado incluso si no hay plugin. Revisar coherencia.

---

## 11. `version.ts`

### Responsabilidad

Define la versión pública del paquete.

### API pública

``​`ts
PDFME_VERSION = '5.5.8'
``​`

### Encabezado recomendado

``​`ts
/**
 * version.ts
 *
 * Versión pública del paquete `@sisad-pdfme/common`.
 *
 * Debe actualizarse junto con cambios de contrato, snapshots,
 * migraciones o releases internos del fork SISAD PDFME.
 */
``​`

### Riesgos detectados

1. Si la versión no se actualiza al cambiar snapshot o contratos, será difícil migrar templates.
2. La versión debería estar sincronizada con package/release si existe pipeline de publicación.

---

# Recomendaciones transversales

## 1. Mantener separación estricta

Estos módulos son `common`. No deben importar:

``​`txt
React
Ant Design components
CSS
RightSidebar
Canvas
Moveable
Selecto
Designer state
DOM APIs salvo helpers explícitamente browser-aware
``​`

## 2. Fuente de verdad del schema

Mantener siempre estos campos como identidad crítica:

``​`txt
schemaUid
type
fileId / fileTemplateId
pageNumber
name
ownerRecipientId / ownerRecipientIds
ownerMode
createdBy / lastModifiedBy
userColor / ownerColor
comments / commentAnchors
``​`

## 3. Comentarios y anchors

Conviene conservar compatibilidad con:

``​`txt
template.pdfComments
template.__commentAnchors
schema.comments
schema.commentAnchors
schema.commentsAnchors
``​`

Pero documentar cuál es canónico:

``​`txt
Top-level canónico: template.pdfComments
Schema-level canónico: schema.comments + schema.commentAnchors
``​`

## 4. Validación estricta opcional

Actualmente existen validaciones ligeras. Para QA o migraciones, conviene agregar una validación fuerte separada:

``​`ts
validateTemplateIntegrity(template)
validateCollaborativeSchemaIntegrity(schemas)
validateCommentIntegrity(template)
``​`

No reemplazar las validaciones actuales si ya se usan en runtime.

## 5. Tests recomendados

### `collaboration.ts`

``​`txt
[ ] normalizeRecipientIds con array, string, duplicados y null.
[ ] buildSchemaAssignments con owner single/multi/shared.
[ ] buildUserRecipientAssignments sin owner y con shared.
[ ] createSchemaComment preserva overrides cuando identity está vacío.
``​`

### `comments.ts`

``​`txt
[ ] addCommentToSchema crea comment + anchor.
[ ] addCommentWithAnchorToTemplate guarda en schema cuando existe schemaUid.
[ ] addCommentWithAnchorToTemplate guarda top-level cuando no existe schemaUid.
[ ] filterCommentsByFileAndPage deduplica comentarios.
[ ] deleteCommentFromSchema actualiza commentsCount correctamente.
``​`

### `dynamicTemplate.ts`

``​`txt
[ ] Retorna template original si basePdf no es BlankPdf.
[ ] Divide filas cuando no caben en la página.
[ ] No deja header solo en página anterior.
[ ] No pierde metadata del template original.
``​`

### `expression.ts`

``​`txt
[ ] Reemplaza placeholders simples.
[ ] Evalúa Math, Date y JSON permitidos.
[ ] Bloquea constructor, __proto__, prototype.
[ ] Conserva placeholder original si falla.
[ ] No permite sintaxis no soportada.
``​`

### `schema.ts` / `types.ts`

``​`txt
[ ] Template valida basePdf + schemas.
[ ] Schema acepta metadata colaborativa.
[ ] CommentAnchor y SchemaComment validan pageNumber positivo.
[ ] Plugin exige pdf/ui/propPanel/defaultSchema.
``​`

---

# Cambios prioritarios sugeridos

1. En `dynamicTemplate.ts`, devolver `{ ...template, basePdf, schemas: resultPages }` para no perder metadata.
2. En `collaboration.ts`, preservar autor desde `overrides` o `anchor` cuando `identity` no lo trae.
3. En `collaboration.ts`, usar un único `now` para `timestamp` y `createdAt`.
4. En `comments.ts`, revisar si `commentsCount` debe aumentar solo al insertar y no al actualizar.
5. En `schema.ts`, decidir si `ownerRecipientIds` debe aceptar también string para compatibilidad con `normalizeRecipientIds`.
6. En `pluginRegistry.ts`, revisar si `common` puede depender de `schemas/schemaFamilies` o si ese preset debe moverse a `common`.
7. En `expression.ts`, agregar límites o limpieza de cache para evitar crecimiento indefinido.
```

<a id="file-0243"></a>

### 0243 — `src/sisad-pdfme/common/README.md`

- **Lenguaje:** `markdown`
- **Líneas:** `33`
- **Tamaño original:** `1.9 KB`
- **SHA1 corto:** `4fa79531da`
- **Estado:** `completo`

```markdown
# common-comentado — SISAD PDFME

Este ZIP contiene los archivos `.ts` del paquete `common` con comentarios de arquitectura, JSDoc y notas de responsabilidad agregadas sin modificar la lógica funcional.

## Archivos incluidos

- `collaboration.ts`: colaboración, comentarios base y assignments.
- `comments.ts`: comentarios por schema y top-level del template.
- `constants.ts`: unidades, PDF A4 vacío y fuente fallback.
- `dynamicTemplate.ts`: reflujo de schemas dinámicos y tablas multipágina.
- `expression.ts`: reemplazo de placeholders con evaluación segura de AST.
- `helper.ts`: validaciones Zod, conversión de unidades, PDF base64 y fuentes.
- `index.ts`: barrel público de `@sisad-pdfme/common`.
- `pluginRegistry.ts`: registry de plugins y resolución de inspector/familia.
- `schema.ts`: contratos Zod runtime.
- `types.ts`: tipos TypeScript públicos.
- `version.ts`: versión pública del paquete.

## Reglas de mantenimiento

1. `common` no debe importar React, CSS, Canvas, Moveable, Selecto ni componentes UI.
2. `schema.ts` y `types.ts` deben mantenerse alineados.
3. `index.ts` debe usar exports explícitos para no exponer APIs internas accidentalmente.
4. `expression.ts` no debe reemplazarse por `eval` ni `new Function` sin validación estricta de AST.
5. `dynamicTemplate.ts` requiere pruebas con multipágina y tablas antes de cualquier refactor.

## Observaciones técnicas pendientes

- Revisar si `dynamicTemplate.ts` debe preservar metadata completa del template al retornar el resultado.
- Revisar si `comments.ts` incrementa `commentsCount` aunque se reemplace un comentario existente.
- Revisar si `collaboration.ts` debe preservar author desde overrides cuando identity viene vacío.
- Revisar estrategia de cache en `expression.ts` para evitar crecimiento indefinido.
- Revisar alineación de `ownerRecipientIds` entre Zod (`string[]`) y utilidades que aceptan `string | string[]`.
```

<a id="file-0244"></a>

### 0244 — `src/sisad-pdfme/converter/documentacion-converter-sisad-pdfme.md`

- **Lenguaje:** `markdown`
- **Líneas:** `168`
- **Tamaño original:** `4.8 KB`
- **SHA1 corto:** `1824999377`
- **Estado:** `completo`

```markdown
# Documentación técnica — `@sisad-pdfme/converter`

## 1. Propósito

Este conjunto de archivos forma el paquete de conversión de SISAD PDFME. Su objetivo es aislar operaciones de bajo nivel relacionadas con PDF e imágenes:

``​`txt
PDF -> imágenes
PDF -> tamaños de página
imágenes -> PDF
``​`

El diseño separa la lógica core de conversión de los detalles de entorno. Por eso `pdf2img.ts` y `pdf2size.ts` reciben un objeto `Environment`, mientras que `index.browser.ts` y `index.node.ts` inyectan implementaciones concretas para navegador o Node.

## 2. Mapa de archivos

| Archivo | Responsabilidad |
|---|---|
| `img2pdf.ts` | Crea un PDF nuevo insertando una imagen por página. |
| `pdf2img.ts` | Renderiza páginas PDF a imágenes usando un adaptador de entorno. |
| `pdf2size.ts` | Lee tamaños de páginas PDF y los convierte a milímetros. |
| `index.browser.ts` | Entry point para navegador: PDF.js worker URL, DOM canvas y dataURL. |
| `index.node.ts` | Entry point para Node: PDF.js worker y `canvas` opcional. |
| `index.ts` | Entry point público por defecto, reexporta browser y alias semánticos. |
| `modules.d.ts` | Declaraciones TypeScript para workers de PDF.js. |
| `types.d.ts` | Tipo común `ImageType`. |

## 3. Flujo `pdf2img`

``​`txt
ArrayBuffer PDF
  -> index.browser.ts / index.node.ts
  -> pdfjsLib.getDocument(...)
  -> pdf2img.ts
  -> getPage(pageNum)
  -> page.getViewport({ scale })
  -> createCanvas(width, height)
  -> page.render(...)
  -> canvasToArrayBuffer(...)
  -> ArrayBuffer[]
``​`

Punto clave: `pdf2img.ts` no crea directamente `document.createElement` ni `require('canvas')`; esa dependencia se inyecta.

## 4. Flujo `pdf2size`

``​`txt
ArrayBuffer PDF
  -> getDocument(pdf)
  -> numPages
  -> getPage(i + 1)
  -> getViewport({ scale, rotation: 0 })
  -> pt2mm(width/height)
  -> Size[]
``​`

Esto permite que el diseñador conozca dimensiones reales del PDF en milímetros antes de renderizar páginas o ubicar schemas.

## 5. Flujo `img2pdf`

``​`txt
ArrayBuffer[] imágenes
  -> detectar jpeg/png por bytes mágicos
  -> PDFDocument.create()
  -> embedJpg/embedPng
  -> addPage()
  -> calcular tamaño página
  -> convertir márgenes mm -> pt
  -> encajar imagen sin deformar
  -> centrar imagen
  -> doc.save()
  -> ArrayBuffer PDF
``​`

## 6. Riesgos técnicos detectados

### 6.1 `index.node.ts`: `canvas` puede no existir

El archivo intenta cargar `canvas` con `require('canvas')`. Si no está instalado, `pdf2img` fallará al llamar `createCanvas(...)`. Esto es aceptable si `canvas` es una dependencia opcional, pero conviene mostrar un error más explícito antes de llamar la función.

Recomendación futura:

``​`ts
if (!createCanvas) {
  throw new Error('The optional canvas package is required to use pdf2img in Node.js');
}
``​`

### 6.2 `img2pdf.ts`: `imageType` está declarado pero no se usa

`Img2PdfOptions` contiene `imageType`, pero la implementación detecta el tipo desde el buffer y no usa esa opción. Esto no rompe, pero puede confundir.

Opciones:

``​`txt
1. Eliminar imageType de Img2PdfOptions.
2. Usarlo como override explícito antes de detectar bytes.
3. Mantenerlo documentado como reservado/futuro.
``​`

### 6.3 `pdf2img.ts`: rango end es inclusivo

El código convierte `range.end` a `end + 1`, por lo que el rango es inclusivo en la API pública.

Ejemplo:

``​`txt
start: 0, end: 0 => página 1
start: 1, end: 2 => páginas 2 y 3
``​`

Esto debe documentarse para evitar confusión con `slice`, donde el final suele ser exclusivo.

### 6.4 `pdf2size.ts`: usa Promise.all para todas las páginas

Para PDFs grandes, leer todas las páginas en paralelo puede consumir memoria. Si aparecen PDFs muy pesados, conviene cambiar a procesamiento secuencial o limitar concurrencia.

### 6.5 `index.ts`: reexporta browser por defecto

Esto está bien para builds frontend, pero en Node debe existir una configuración de package exports o import directo a `index.node.ts`.

Ejemplo futuro en `package.json`:

``​`json
{
  "exports": {
    ".": {
      "browser": "./dist/index.browser.js",
      "node": "./dist/index.node.js",
      "default": "./dist/index.browser.js"
    }
  }
}
``​`

## 7. Regla de arquitectura

Este módulo debe permanecer como infraestructura técnica. No debe importar ni conocer:

``​`txt
Designer
Canvas
Moveable
Selecto
SnapshotAdapter
schemas
DetailView
ContentCustomForm
Uanataca
reglas de negocio SISAD
``​`

Debe exponer utilidades puras consumibles por UI, generator, importadores o adaptadores.

## 8. Validación manual sugerida

``​`txt
[ ] Convertir PDF de 1 página a imagen.
[ ] Convertir PDF multipágina a imágenes.
[ ] Convertir solo rango start/end.
[ ] Leer tamaños de PDF A4.
[ ] Leer tamaños de PDF con páginas diferentes.
[ ] Convertir PNG a PDF.
[ ] Convertir JPG a PDF.
[ ] Convertir varias imágenes a PDF multipágina.
[ ] Probar browser con worker PDF.js.
[ ] Probar Node con paquete canvas instalado.
``​`
```

<a id="file-0245"></a>

### 0245 — `src/sisad-pdfme/converter/README.md`

- **Lenguaje:** `markdown`
- **Líneas:** `42`
- **Tamaño original:** `0.9 KB`
- **SHA1 corto:** `d441cd11fd`
- **Estado:** `completo`

```markdown
# Converter comentado — SISAD PDFME

Este ZIP contiene los archivos del módulo converter con comentarios técnicos agregados sin cambiar la lógica funcional.

## Archivos incluidos

``​`txt
img2pdf.ts
index.browser.ts
index.node.ts
index.ts
modules.d.ts
pdf2img.ts
pdf2size.ts
types.d.ts
documentacion-converter-sisad-pdfme.md
``​`

## Responsabilidad del módulo

El paquete converter actúa como una capa de conversión independiente del diseñador:

- `pdf2img`: renderiza páginas PDF a imágenes.
- `pdf2size`: obtiene tamaños de páginas PDF.
- `img2pdf`: crea PDF multipágina desde imágenes.
- `index.browser`: adapta PDF.js/canvas al navegador.
- `index.node`: adapta PDF.js/node-canvas a Node.

## Regla de arquitectura

Este módulo no debe conocer:

- Designer
- Canvas
- Moveable
- Selecto
- Snapshot
- schemas
- DetailView
- reglas SISAD de negocio

Debe mantenerse como utilidad técnica reutilizable por el runtime.
```

<a id="file-0246"></a>

### 0246 — `src/sisad-pdfme/runtime/documentacion-runtime-sisad-pdfme.md`

- **Lenguaje:** `markdown`
- **Líneas:** `151`
- **Tamaño original:** `4.6 KB`
- **SHA1 corto:** `cb77f6c31c`
- **Estado:** `completo`

```markdown
# Documentación técnica — Runtime SISAD PDFME

## Propósito del paquete

Este bloque de archivos centraliza la capa de runtime entre hosts React y los runtimes PDFME:

``​`txt
Host React
  ├─ buildRuntimeOptions / buildDesignerRuntimeOptions / buildRuntimeFormOptions / buildRuntimeViewerOptions
  ├─ usePdfmeRuntimeInstance
  └─ usePdfmeArtifacts
       ├─ generate
       ├─ pdf2size
       ├─ pdf2img
       └─ img2pdf
``​`

La idea correcta es que el host configure y observe, pero el runtime siga controlando `Designer`, `Form` y `Viewer`.

---

## Archivo: options.ts

Responsabilidad:

``​`txt
- definir token visual por defecto;
- fusionar theme token sin mutar opciones originales;
- construir opciones base para runtime;
- construir opciones específicas para designer/form/viewer.
``​`

Funciones principales:

- `buildRuntimeOptions`: base común para todos los modos.
- `buildDesignerRuntimeOptions`: agrega `themePreset` y `designerEngine`.
- `buildRuntimeFormOptions`: agrega `zoomLevel`, `signatureModalFlow`, `signatureSessionKey` y `signatureSigner`.
- `buildRuntimeViewerOptions`: base para viewer.

Riesgo técnico:

``​`txt
runtimeOptions se clona superficialmente. Si el host muta objetos internos luego de construir options, puede provocar cambios no controlados.
``​`

---

## Archivo: runtimeModes.ts

Responsabilidad:

``​`txt
- declarar modos válidos: designer, form, viewer;
- validar modo runtime;
- normalizar mensajes de error;
- formatear estado de página;
- resolver modo UX inicial desde query/stored/fallback.
``​`

Observación:

El storage key no vive aquí. Eso es correcto porque el almacenamiento es responsabilidad del host/lab.

---

## Archivo: usePdfmeArtifacts.ts

Responsabilidad:

``​`txt
- ejecutar generación de PDF;
- ejecutar conversión PDF → tamaños;
- ejecutar conversión PDF → imágenes;
- reconstruir PDF desde imágenes;
- manejar object URLs y revocarlos correctamente;
- reportar estados mediante onStatus.
``​`

Decisión arquitectónica importante:

``​`txt
generate, pdf2size, pdf2img e img2pdf se inyectan.
``​`

Esto evita acoplar el hook directamente a paquetes pesados y facilita pruebas unitarias.

Riesgos técnicos:

``​`txt
1. busy es boolean único. Si dos acciones se disparan al mismo tiempo, una puede limpiar busy mientras otra sigue ejecutándose.
2. runImg2Pdf usa fetch sobre object URLs. Funciona en browser, pero no es portable a SSR/test sin mock.
3. pdfSizes está tipado como any[]. Conviene reemplazarlo por Size[] si el contrato está disponible.
4. inputs/template/plugins usan any. En una fase futura se puede tipar con Template, Plugins e Inputs.
``​`

---

## Archivo: usePdfmeRuntimeInstance.ts

Responsabilidad:

``​`txt
- montar Designer/Form/Viewer en un contenedor;
- remount por cambio de mode;
- actualizar options/template/inputs sin recrear instancia innecesariamente;
- evitar echo loops entre runtime y host;
- destruir instancia de forma segura;
- exponer instanceRef.
``​`

Decisiones importantes:

``​`txt
- Designer/Form/Viewer se inyectan como constructors.
- template se clona con cloneDeep antes de entrar al runtime.
- inputs se sincronizan solo en form/viewer.
- onChangeTemplate marca templateSyncFromDesignerRef para saltar el eco inmediato.
- onChangeInput marca inputsSyncFromRuntimeRef para saltar el eco inmediato.
``​`

Riesgos técnicos:

``​`txt
1. scheduleDestroyInstance usa setTimeout(0). Está justificado para evitar carreras de nodo desmontado, pero no debe usarse para geometría/canvas.
2. getTemplateSignature usa JSON.stringify sobre basePdf + schemas. En templates muy grandes puede costar; si crece, conviene hash estable incremental.
3. El hook remonta solo por mode. Cambios profundos en runtime constructors/plugins no remountan salvo que host cambie mode o fuerce recreación.
4. options se compara por referencia. Si el host crea options nuevas en cada render, se llamará updateOptions frecuentemente.
``​`

---

## Reglas de uso

``​`txt
[ ] No poner reglas SISAD dentro de estos hooks.
[ ] No manipular Moveable/Selecto/canvas desde aquí.
[ ] No duplicar renderers de schemas.
[ ] No usar estos hooks para resolver lógica de firma real.
[ ] No introducir CSS ni z-index aquí.
[ ] Mantener generación/conversión por inyección de dependencias.
``​`

## Mejoras futuras recomendadas

``​`txt
1. Reemplazar any por tipos reales: Template, Plugins, Inputs, Size.
2. Cambiar busy boolean por contador o estado discriminado si se permiten operaciones paralelas.
3. Agregar action guards para evitar doble click simultáneo.
4. Extraer status event type a union tipada.
5. Considerar hash estable para getTemplateSignature en templates grandes.
``​`
```

<a id="file-0247"></a>

### 0247 — `src/sisad-pdfme/runtime/README.md`

- **Lenguaje:** `markdown`
- **Líneas:** `15`
- **Tamaño original:** `0.7 KB`
- **SHA1 corto:** `d3acfa205c`
- **Estado:** `completo`

```markdown
# Runtime comentado — SISAD PDFME

Este paquete contiene una versión comentada de los helpers/hooks de runtime enviados.

## Archivos

- `options.ts`: builders de opciones para Designer/Form/Viewer.
- `runtimeModes.ts`: helpers de modos runtime, errores y estado de página.
- `usePdfmeArtifacts.ts`: hook para generación PDF y conversiones derivadas.
- `usePdfmeRuntimeInstance.ts`: hook que monta/sincroniza/destroza Designer/Form/Viewer.
- `documentacion-runtime-sisad-pdfme.md`: resumen arquitectónico y riesgos técnicos.

## Regla de arquitectura

Estos archivos deben vivir como capa de runtime/adaptador. No deben contener reglas de negocio SISAD, lógica Uanataca, manipulación de canvas, CSS, Moveable, Selecto ni detalles de StepOne/StepTwo.
```

<a id="file-0248"></a>

### 0248 — `src/sisad-pdfme/ui/documentacion-ui-runtime-sisad-pdfme.md`

- **Lenguaje:** `markdown`
- **Líneas:** `168`
- **Tamaño original:** `5.7 KB`
- **SHA1 corto:** `99f9459a3f`
- **Estado:** `completo`

```markdown
# Documentación técnica — UI Runtime SISAD PDFME
Este documento acompaña los archivos comentados del runtime UI. Resume responsabilidades, API pública, límites y riesgos por archivo.

## Designer.tsx — Fachada pública del editor PDF
### Responsabilidades
- Normaliza el template con `ensureDesignerTemplate`.
- Expone callbacks `onSaveTemplate`, `onChangeTemplate`, `onPageChange`.
- Delega comandos a `DesignerRuntimeApi`: undo/redo, zoom, fit, páginas, sidebar, focus/highlight, addSchema y schema config.

### Riesgos / notas
- Debe compilarse como `.tsx` porque renderiza JSX.
- No introducir lógica de negocio o integraciones SISAD.
- Evitar mutación ambigua al setear `pdfmeVersion`; preferible construir `nextTemplate`.

## Form.tsx — Runtime interactivo de llenado
### Responsabilidades
- Hereda de `PreviewUI`.
- Renderiza `Preview` con inputs editables.
- Emite cambios por input, por lote y JSON de formulario.

### Riesgos / notas
- `onChangeInput` puede emitirse desde `setInputs` y desde Preview; cuidar duplicidad.
- No acoplar validaciones específicas de host.

## Viewer.tsx — Runtime de visualización
### Responsabilidades
- Hereda de `PreviewUI`.
- Renderiza `Preview` sin callbacks de edición.
- Mantiene cursor y total de páginas.

### Riesgos / notas
- Debe permanecer read-only.
- No agregar side effects sobre inputs.

## class.ts — Infraestructura base de lifecycle UI
### Responsabilidades
- Administra DOM container, React root, resize observer, template, options, font, lang y plugins.
- `BaseUIClass` soporta Designer/Form/Viewer.
- `PreviewUI` agrega manejo de inputs para Form/Viewer.

### Riesgos / notas
- Cambios en medición de tamaño afectan zoom y canvas.
- Destroy debe ser idempotente y defensivo.
- No crear múltiples roots React por contenedor.

## collaboration.ts — Motor de sincronización colaborativa
### Responsabilidades
- Define `CollaborationEvent`.
- Aplica eventos a schemas.
- Calcula diffs de eventos.
- Soporta locks, comments, presence/history y adaptadores Yjs/legacy.

### Riesgos / notas
- Cuidar eventos obsoletos por timestamp.
- No perder comments/commentAnchors al actualizar schema base.
- No mezclar colaboración con UI visual o negocio de host.

## collaborationContext.ts — Contexto efectivo de colaboración
### Responsabilidades
- Normaliza recipients.
- Resuelve recipient activo, roles, permisos y owner color.
- Resuelve estado colaborativo de un schema.

### Riesgos / notas
- Roles viewer/reviewer/commenter no deben editar estructura por defecto.
- No sobrescribir ownerColor de schemas existentes sin intención.

## constants.ts — Constantes UI
### Responsabilidades
- Define idioma default, mensajes, classnames, sidebars, page gap y zoom.

### Riesgos / notas
- Cambios en dimensiones impactan layout y pruebas visuales.
- No agregar constantes de negocio.

## contexts.ts — Contextos React
### Responsabilidades
- I18nContext, FontContext, PluginsRegistry, OptionsContext y CacheContext.

### Riesgos / notas
- Mantener pluginRegistry vacío por defecto para evitar bundle innecesario.

## designerEngine.ts — Configuración extensible del diseñador
### Responsabilidades
- Define tipos de schema config, colaboración, HTTP, prefill, persistence, requests, form JSON y firma.
- Aplica defaults colaborativos.
- Resuelve y fusiona config avanzada.
- Expone builder del engine.

### Riesgos / notas
- Archivo de contrato público/semipúblico: cambios pueden romper integraciones.
- Evitar `any` nuevo y switches repetidos por schema.type.
- Mantener serializabilidad en metadata de schemas.

## helper.ts — Utilidades runtime
### Responsabilidades
- Atajos de teclado.
- Conversión template <-> schemas UI.
- Base64/data URLs.
- Nombres únicos y helpers de layout.

### Riesgos / notas
- `template2SchemasList` es crítico para multipágina.
- Atajos no deben capturar inputs/textarea/select/contentEditable.
- Evitar mutaciones de template externo.

## hooks.ts — Hooks runtime y preprocesamiento
### Responsabilidades
- `useUIPreProcessor` genera backgrounds, pageSizes y escala.
- Usa cache LRU simple para PDFs procesados.
- Protege tareas async con requestId.

### Riesgos / notas
- Escala incorrecta rompe coordenadas visuales.
- Cache debe seguir acotado.
- Manejar errores de pdf2img/pdf2size sin perder último estado bueno.

## i18n.ts — Internacionalización
### Responsabilidades
- Diccionarios por idioma para UI y schemas.

### Riesgos / notas
- Toda key de Dict debe estar cubierta por cada idioma.
- No incluir términos de negocio del host.

## index.ts — Entrypoint público UI
### Responsabilidades
- Exporta Designer/Form/Viewer, aliases y estilos base.
- Reexporta designerEngine, colaboración y eventos.

### Riesgos / notas
- No agregar lógica.
- Cuidar import CSS: debe seguir siendo runtime genérico.

## theme.ts — Temas Ant Design
### Responsabilidades
- Define defaultTheme y sisadTheme.

### Riesgos / notas
- No confundir theme runtime con CSS específico de StepTwo/host.

## types.ts — Tipos públicos y bridges
### Responsabilidades
- Contratos de SidebarProps, DesignerRuntimeApi, documents/comments bridge y presentation modes.

### Riesgos / notas
- Es API pública: preferir extensiones opcionales a breaking changes.
- Mantener sincronizado con implementaciones reales del runtime API.

## Resumen de generación

| Archivo | Líneas origen | Líneas documentadas |
|---|---:|---:|
| Designer.tsx | 348 | 372 |
| Form.tsx | 130 | 151 |
| Viewer.tsx | 54 | 70 |
| class.ts | 299 | 324 |
| collaboration.ts | 1497 | 1519 |
| collaborationContext.ts | 256 | 274 |
| constants.ts | 21 | 33 |
| contexts.ts | 14 | 26 |
| designerEngine.ts | 1433 | 1454 |
| helper.ts | 601 | 622 |
| hooks.ts | 499 | 516 |
| i18n.ts | 903 | 915 |
| index.ts | 25 | 39 |
| theme.ts | 63 | 75 |
| types.ts | 147 | 161 |
```

<a id="file-0249"></a>

### 0249 — `src/sisad-pdfme/ui/README.md`

- **Lenguaje:** `markdown`
- **Líneas:** `38`
- **Tamaño original:** `2.2 KB`
- **SHA1 corto:** `a5168f86b0`
- **Estado:** `completo`

```markdown
# UI Runtime comentado — SISAD PDFME

Este paquete contiene los archivos del runtime UI documentados con comentarios de arquitectura y mantenimiento.

## Archivos incluidos

| Archivo | Origen subido | Responsabilidad principal |
|---|---|---|
| Designer.tsx | Designer.tsx | Fachada pública del diseñador, callbacks, zoom, páginas, sidebar, schemas y render React. |
| Form.tsx | Form.tsx | Runtime interactivo de llenado basado en Preview. |
| Viewer.tsx | Viewer.tsx | Runtime de solo lectura basado en Preview. |
| class.ts | class.ts | BaseUIClass y PreviewUI: lifecycle, root React, ResizeObserver, opciones, plugins e inputs. |
| collaboration.ts | collaboration(1).ts | Eventos colaborativos, locks, comentarios, presencia, historial, Yjs/legacy sync. |
| collaborationContext.ts | collaborationContext.ts | Recipient activo, permisos, owner/color y estado colaborativo efectivo. |
| constants.ts | constants(1).ts | Constantes visuales y de runtime. |
| contexts.ts | contexts.ts | Contextos React de i18n, font, plugins, options y cache. |
| designerEngine.ts | designerEngine.ts | Contratos/configuración del engine, schema config, colaboración, firma, HTTP y builder. |
| helper.ts | helper(1).ts | Atajos, conversiones, template/schema helpers, nombres únicos y utilidades UI. |
| hooks.ts | hooks.ts | Preprocesamiento de PDFs, backgrounds, pageSizes, escalas y hooks compartidos. |
| i18n.ts | i18n.ts | Diccionarios de internacionalización. |
| index.ts | index(2).ts | Entrypoint público del paquete UI. |
| theme.ts | theme.ts | Temas Ant Design default y SISAD. |
| types.ts | types(1).ts | Tipos públicos de bridges, sidebars, documentos, comentarios y runtime API. |

## Criterio aplicado

- Se agregaron comentarios JSDoc y encabezados de responsabilidad por archivo.
- No se cambió lógica funcional.
- Se normalizaron los nombres de salida quitando sufijos `(1)` y `(2)` porque esos nombres parecen provenir de la carga de archivos, no del proyecto real.
- Se añadió documentación consolidada en `documentacion-ui-runtime-sisad-pdfme.md`.

## Recomendación

Antes de reemplazar archivos en tu proyecto, compara con `git diff` y revisa especialmente los archivos grandes:

``​`bash
git diff -- src/sisad-pdfme/ui
``​`
```

<a id="file-0250"></a>

### 0250 — `.tailwind-migration-backups/20260708-111736/reports/tailwind-migration/README.md`

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

<a id="file-0251"></a>

### 0251 — `src/sisad-pdfme/ui/components/documentacion-runtime-preview-base-jsdoc.md`

- **Lenguaje:** `markdown`
- **Líneas:** `30`
- **Tamaño original:** `1.6 KB`
- **SHA1 corto:** `9ca3469d4f`
- **Estado:** `completo`

```markdown
# Documentación técnica — Runtime / Preview base

## Rol del bloque

Este bloque contiene la base visual y funcional usada por Preview/Form/Viewer en SISAD PDFME. Su propósito es convertir templates en páginas renderizables, montar schemas mediante plugins, controlar zoom/navegación y sincronizar inputs/persistencia/API/Form JSON cuando aplica.

## Fronteras importantes

- `AppContextProvider` publica contexto global: tema, labels, fuentes, plugins y opciones.
- `CtlBar` solo emite callbacks; no modifica template directamente.
- `Paper` calcula y estabiliza páginas, fondos y metadata DOM.
- `Renderer` aísla plugins imperativos dentro de un wrapper controlado por el canvas.
- `Preview` compone el runtime y aplica reglas de visibilidad/acceso antes de renderizar cada schema.
- `usePreviewRuntime` concentra cálculos dinámicos, prefill, persistencia, requests y emisión de eventos runtime.

## Reglas preservadas

- No se cambió comportamiento funcional.
- No se cambiaron nombres de componentes ni exports por defecto.
- No se agregó lógica de negocio del host.
- No se introdujeron z-index hacks ni acoplamientos a Moveable/Selecto fuera del renderer/canvas.

## Recomendaciones de QA

1. Validar Preview con 1/N páginas y 1/N inputs.
2. Validar zoom presets y menú de acciones en anchos `comfortable`, `compact` y `minimal`.
3. Validar staticSchema con basePdf blank.
4. Validar schemas readOnly con placeholders y dateSigned enlazado a signature.
5. Validar que plugins imperativos no acumulen DOM tras cambios de schema/value.
6. Validar persistencia/prefill/API del hook sin sobrescribir valores ya digitados por usuario.
```

<a id="file-0252"></a>

### 0252 — `src/sisad-pdfme/ui/components/README.md`

- **Lenguaje:** `markdown`
- **Líneas:** `28`
- **Tamaño original:** `1.1 KB`
- **SHA1 corto:** `42deab8304`
- **Estado:** `completo`

```markdown
# Runtime / Preview base — SISAD PDFME JSDoc

Este paquete contiene una copia completa de los archivos runtime/base UI enviados, con documentación JSDoc agregada o normalizada sin cambiar la lógica funcional.

## Archivos incluidos

- `AppContextProvider.tsx`
- `CtlBar.tsx`
- `ErrorScreen.tsx`
- `Paper.tsx`
- `Preview.tsx`
- `Renderer.tsx`
- `Root.tsx`
- `Spinner.tsx`
- `StaticSchema.tsx`
- `UnitPager.tsx`
- `usePreviewRuntime.ts`

## Criterio aplicado

- Se documentaron responsabilidades, contratos y límites arquitectónicos.
- Se preservaron imports, exports, callbacks y flujo funcional.
- No se introdujeron dependencias nuevas.
- No se modificaron reglas de render, selección, zoom, persistencia, prefill ni colaboración runtime.

## Observaciones

Este bloque es sensible porque conecta el runtime visual con plugins imperativos (`Renderer`), preprocesamiento de PDF (`Paper`/`Preview`) y sincronización de datos (`usePreviewRuntime`). La documentación refuerza que la geometría del canvas debe seguir controlada por schemas y servicios internos, no por estilos arbitrarios de plugins o hosts.
```

<a id="file-0253"></a>

### 0253 — `src/sisad-pdfme/ui/components/Designer/Canvas/documentacion-canvas-core-jsdoc.md`

- **Lenguaje:** `markdown`
- **Líneas:** `18`
- **Tamaño original:** `0.9 KB`
- **SHA1 corto:** `73cb31babb`
- **Estado:** `completo`

```markdown
# Reporte de documentación JSDoc — Canvas core

| Archivo | JSDoc antes | JSDoc después | Líneas antes | Líneas después |
|---|---:|---:|---:|---:|
| `Canvas.tsx` | 0 | 71 | 1613 | 1883 |
| `Guides.tsx` | 0 | 5 | 100 | 118 |
| `Mask.tsx` | 0 | 3 | 33 | 48 |
| `Moveable.tsx` | 0 | 5 | 127 | 149 |
| `Padding.tsx` | 0 | 4 | 82 | 100 |
| `Selecto.tsx` | 0 | 6 | 110 | 132 |
| `SnapLines.tsx` | 5 | 14 | 349 | 380 |

## Observaciones técnicas

- `Canvas.tsx` concentra mucha responsabilidad: selección, transformación, overlays, menú contextual, edición inline y render state. La documentación marca límites para evitar mezclar reglas de negocio del host.
- `Moveable.tsx` y `Selecto.tsx` se mantienen como adapters; sus props documentan cómo Canvas inyecta condiciones y callbacks.
- `SnapLines.tsx` mantiene el cálculo en milímetros y render en píxeles mediante `ZOOM`.
- `Guides.tsx`, `Mask.tsx` y `Padding.tsx` quedan como slots visuales puros.
```

<a id="file-0254"></a>

### 0254 — `src/sisad-pdfme/ui/components/Designer/Canvas/README.md`

- **Lenguaje:** `markdown`
- **Líneas:** `24`
- **Tamaño original:** `1.2 KB`
- **SHA1 corto:** `824d856ac8`
- **Estado:** `completo`

```markdown
# Canvas core con JSDoc — SISAD PDFME

Este paquete contiene copias completas de los archivos del core visual/interactivo del canvas con documentación JSDoc agregada o normalizada.

## Archivos incluidos

- `Canvas.tsx`: orquestador principal del canvas, Paper, Selecto, Moveable, overlays, menú contextual, edición inline y estado de render.
- `Guides.tsx`: adapter de reglas horizontales/verticales.
- `Mask.tsx`: overlay no interactivo para páginas no activas/bloqueadas.
- `Moveable.tsx`: adapter de `react-moveable`.
- `Padding.tsx`: overlay de padding para blank PDF.
- `Selecto.tsx`: adapter de `react-selecto`.
- `SnapLines.tsx`: overlay y cálculo de snap lines.

## Alcance

- No se modificó la intención funcional.
- No se agregaron dependencias.
- No se agregaron estilos globales ni hacks de z-index.
- La documentación se enfocó en contratos, responsabilidades, helpers, props, callbacks y riesgos de arquitectura.

## Regla de arquitectura

Estos archivos pertenecen al núcleo visual del diseñador. No deben incorporar lógica de host (`DigitalAgreements`, `ContentCustomForm`, `ExternalForms`), reglas de firma/Uanataca ni manipulación externa del DOM fuera de los adapters explícitos.
```

<a id="file-0255"></a>

### 0255 — `src/sisad-pdfme/ui/components/Designer/RightSidebar/documentacion-right-sidebar-rails-jsdoc.md`

- **Lenguaje:** `markdown`
- **Líneas:** `15`
- **Tamaño original:** `1.0 KB`
- **SHA1 corto:** `caf94f37b0`
- **Estado:** `completo`

```markdown
# Documentación agregada — RightSidebar Rails

## Resumen

Se documentó el bloque de composición del sidebar derecho del diseñador SISAD PDFME:

- `RightSidebar.tsx`: orquestación de modos `fields`, `detail`, `docs` y `comments`, responsive presentation, tabs y slots reemplazables.
- `DocumentsRail.tsx`: rail de páginas/documentos, acciones de subir PDF, agregar página y eliminar.
- `CommentsRail.tsx`: rail de hilos de comentarios, respuestas, estado abierto/resuelto y scroll al comentario activo.
- `layout.tsx`: primitivas de frame/header/body/footer del sidebar.
- `contextHeader.ts`: contrato para headers contextuales estáticos o funcionales.

## Nota de arquitectura

Estos archivos deben mantenerse como capa de composición visual y navegación del sidebar. No deberían incorporar reglas internas del canvas, manipulación directa de Moveable/Selecto, ni persistencia de negocio. Las mutaciones deben seguir delegándose a callbacks, bridges o comandos ya recibidos por props.
```

<a id="file-0256"></a>

### 0256 — `src/sisad-pdfme/ui/components/Designer/RightSidebar/README.md`

- **Lenguaje:** `markdown`
- **Líneas:** `18`
- **Tamaño original:** `0.7 KB`
- **SHA1 corto:** `c61f6f7ce2`
- **Estado:** `completo`

```markdown
# RightSidebar Rails — JSDoc SISAD PDFME

Este paquete contiene versiones documentadas de los archivos del sidebar derecho relacionados con documentos, comentarios, layout y resolución de header contextual.

## Archivos incluidos

- `CommentsRail.tsx`
- `contextHeader.ts`
- `DocumentsRail.tsx`
- `layout.tsx`
- `RightSidebar.tsx`

## Criterio aplicado

- Se agregó JSDoc a tipos, props, helpers y componentes principales.
- Se mantuvo la lógica funcional original.
- Se documentaron responsabilidades y restricciones de cada componente.
- Se conservó la separación esperada: el sidebar orquesta vistas, pero no manipula canvas, Moveable, Selecto ni schemas directamente.
```

<a id="file-0257"></a>

### 0257 — `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/documentacion-canvas-overlays-jsdoc.md`

- **Lenguaje:** `markdown`
- **Líneas:** `21`
- **Tamaño original:** `0.7 KB`
- **SHA1 corto:** `041b3db41b`
- **Estado:** `completo`

```markdown
# Reporte de documentación JSDoc

Se generó documentación para los 18 archivos de overlays del canvas:

- Menú contextual y modelo de acciones.
- Toolbar contextual de selección.
- Manager de overlays.
- Estado visual del canvas.
- Comentarios/pins.
- Geometría de superficies flotantes.
- Drag preview, drop placeholder y commit flash.
- Posicionamiento inteligente y conversión de coordenadas.
- Feedback de snap lines.

## Criterios aplicados

1. Mantener el código completo en cada archivo.
2. Agregar JSDoc a tipos, props, helpers y componentes principales.
3. Preservar comportamiento actual.
4. Evitar introducir lógica nueva o refactors funcionales.
5. Documentar restricciones arquitectónicas importantes cuando aplicaba.
```

<a id="file-0258"></a>

### 0258 — `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/README.md`

- **Lenguaje:** `markdown`
- **Líneas:** `35`
- **Tamaño original:** `1.3 KB`
- **SHA1 corto:** `06b922b34e`
- **Estado:** `completo`

```markdown
# Canvas overlays con JSDoc — SISAD PDFME

Este paquete contiene copias completas de los archivos enviados, con documentación JSDoc agregada o normalizada.

## Alcance

- No se cambió lógica funcional.
- No se modificaron imports/exports intencionalmente.
- No se agregaron dependencias.
- La documentación se enfoca en responsabilidades, contratos de props/tipos, helpers geométricos, reglas de overlays, menú contextual, toolbar contextual, drag/drop, comentarios y snap feedback.

## Archivos incluidos

- `CanvasContextMenu.tsx`
- `canvasContextMenuActions.tsx`
- `CanvasOverlayManager.tsx`
- `CanvasStateOverlay.tsx`
- `CommentsOverlay.tsx`
- `floatingSurfaceGeometry.ts`
- `GroupOptionFloatingAction.tsx`
- `InlineEditOverlay.tsx`
- `InlineMetricsOverlay.tsx`
- `overlayState.ts`
- `pointerGeometry.ts`
- `SchemaDragPreview.tsx`
- `SchemaDropCommitFlash.tsx`
- `SchemaDropPlaceholder.tsx`
- `SelectionContextToolbar.tsx`
- `smartPlacement.ts`
- `SnapFeedbackOverlay.tsx`
- `useFloatingToolbarPosition.ts`

## Nota de arquitectura

Estos módulos pertenecen a la capa visual/interactiva del canvas. Deben seguir sin contener reglas de negocio del host, lógica Uanataca, persistencia HTTP, manipulación directa de Moveable/Selecto ni hacks de z-index para ocultar problemas.
```

<a id="file-0259"></a>

### 0259 — `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/documentacion-detailview-inspector-jsdoc.md`

- **Lenguaje:** `markdown`
- **Líneas:** `42`
- **Tamaño original:** `1.6 KB`
- **SHA1 corto:** `7f765d6e6c`
- **Estado:** `completo`

```markdown
# Documentación aplicada — DetailView / Inspector

## Resumen

Se documentó el bloque responsable del inspector/right sidebar del diseñador SISAD PDFME:

- widgets básicos del inspector;
- tarjetas y secciones del DetailView;
- taxonomía de secciones;
- contratos de inspector por familia de schema;
- builders de schemas de form-render;
- registro de widgets;
- colaboración/asignación/bloqueo;
- conexiones/persistencia/API/form;
- guards para evitar interferencias con Selecto, Moveable y canvas.

## Criterio de documentación

La documentación se agregó con JSDoc en puntos de extensión y mantenimiento:

- tipos públicos o semipúblicos;
- componentes React exportados;
- helpers puros;
- builders declarativos;
- registros o contratos compartidos;
- funciones de validación.

## Restricciones respetadas

- No se cambió la lógica funcional.
- No se modificaron contratos de imports/exports.
- No se agregaron `!important`, z-index nuevos ni hacks visuales.
- No se tocó Canvas/Moveable/Selecto desde estos archivos.
- No se acopló la lógica del inspector a reglas del host.

## Recomendaciones técnicas

1. Mantener `detailSectionTaxonomy.ts` como fuente de verdad para visibilidad y orden de secciones.
2. Mantener `inspectorContracts.ts` como punto de extensión para tipos nuevos de schema.
3. Evitar condiciones por tipo dentro de `DetailView.tsx`; preferir contratos, presets o taxonomía.
4. En pruebas, cubrir cada sección canónica y cada widget registrado por `detailWidgetRegistry.tsx`.
5. En colaboración, validar casos de owner único, multi-owner, shared, locked by me y locked by other.
```

<a id="file-0260"></a>

### 0260 — `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/documentacion-detailview-options-comments-jsdoc.md`

- **Lenguaje:** `markdown`
- **Líneas:** `38`
- **Tamaño original:** `1.4 KB`
- **SHA1 corto:** `81bead6cd5`
- **Estado:** `completo`

```markdown
# Documentación agregada — DetailView comments/options widgets

## Archivos incluidos

### SchemaFieldCommentsWidget.tsx
Widget de comentarios por campo del inspector. Se documentaron:

- props del widget;
- normalización de comentarios;
- timestamp y formateo;
- creación de respuestas;
- persistencia mediante `changeSchemas`;
- responsabilidades y restricciones del componente.

### SchemaOptionsEditor.tsx
Editor único para opciones de `select`, `radioGroup` y `checkboxGroup`. Se documentaron:

- resolución del tipo de editor;
- modelos de fila;
- límites de selección múltiple;
- commits específicos para select/radio/checkbox;
- operaciones de fila: agregar, renombrar, eliminar, mover y marcar default;
- contrato de aislamiento respecto a canvas, Moveable y Selecto.

### WidgetRenderer.tsx
Wrapper de compatibilidad para widgets imperativos de plugins. Se documentaron:

- contrato `rootElement`;
- limpieza del contenedor;
- marcado como zona interactiva del inspector;
- restricciones para evitar acoplamiento con canvas o plugins concretos.

## Recomendaciones de QA

- Validar que agregar/responder/resolver/eliminar comentarios siga emitiendo `changeSchemas([{ key: 'comments', ... }])`.
- Probar select/radioGroup/checkboxGroup con 0, 1 y N opciones.
- Probar reordenamiento y eliminación preservando default/selección válida.
- Confirmar que clicks dentro del inspector no disparen Selecto, Moveable ni drag/drop del canvas.
```

<a id="file-0261"></a>

### 0261 — `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/README.md`

- **Lenguaje:** `markdown`
- **Líneas:** `20`
- **Tamaño original:** `1.0 KB`
- **SHA1 corto:** `068b5b3047`
- **Estado:** `completo`

```markdown
# DetailView comments/options widgets — JSDoc

Este paquete contiene copias documentadas de tres archivos del inspector del diseñador SISAD PDFME:

- `SchemaFieldCommentsWidget.tsx`: comentarios por campo dentro del inspector.
- `SchemaOptionsEditor.tsx`: editor React directo para opciones de select, radioGroup y checkboxGroup.
- `WidgetRenderer.tsx`: puente para widgets imperativos de plugins usando `rootElement`.

## Criterios aplicados

- Se conservaron imports, exports y comportamiento funcional.
- Se agregó JSDoc en props, tipos, helpers y componentes principales.
- Se añadieron comentarios de intención en zonas sensibles de render/commit.
- No se modificó la arquitectura de canvas, Moveable, Selecto ni persistencia.

## Notas técnicas

- `SchemaOptionsEditor` sigue usando `changeSchemas` como única vía de persistencia.
- `SchemaFieldCommentsWidget` mantiene comentarios embebidos en `activeSchema.comments`.
- `WidgetRenderer` conserva el render imperativo en cada render para no cambiar el contrato heredado.
```

<a id="file-0262"></a>

### 0262 — `src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/documentacion-listview-jsdoc.md`

- **Lenguaje:** `markdown`
- **Líneas:** `31`
- **Tamaño original:** `1.8 KB`
- **SHA1 corto:** `36bb6a2917`
- **Estado:** `completo`

```markdown
# Documentación técnica — ListView / Right Sidebar

## Responsabilidad general

El bloque `ListView` representa la lista lateral derecha de campos/schemas del diseñador. Su responsabilidad es presentar el inventario editable de campos, permitir búsqueda/filtro, selección, ordenamiento por drag and drop, edición masiva de nombres y acciones colaborativas como asignación de destinatario.

## Separación de responsabilidades

- `ListView.tsx`: orquesta filtros, bulk rename, eventos runtime y layout.
- `ListViewToolbar.tsx`: renderiza controles de búsqueda, filtro, acciones bulk y badges.
- `ListViewFooter.tsx`: renderiza commit/cancel en modo edición masiva.
- `SelectableSortableContainer.tsx`: integra dnd-kit, ordenamiento y selección local.
- `SelectableSortableItem.tsx`: conecta cada schema con `useSortable` y metadata colaborativa.
- `Item.tsx`: componente visual puro de fila.
- `ListViewDragOverlay.tsx`: preview flotante durante drag.

## Contratos importantes

- El drag handle vive en `Item` mediante `listeners`.
- El click de fila se maneja por un hit target dedicado.
- Las acciones de visibilidad/eliminación detienen propagación.
- La lista conserva `data-testid` usados por pruebas E2E.
- La colaboración puede filtrar schemas y tintar iconos/badges.
- El reordenamiento en vistas filtradas se fusiona con la lista completa sin reordenar elementos invisibles.

## Riesgos a vigilar

- Si cambia el criterio de `filterSchemasForCollaborationView`, revisar que bulk rename siga alineando nombres con `viewSchemas`.
- Si se agregan más filtros, `mergeVisibleOrder` debe seguir preservando elementos no visibles.
- Si se cambia la selección múltiple, coordinar `activeSchemaIds` externo con `selectedSchemas` local.
- Si se cambia el DOM del row, preservar `data-testid="right-sidebar-field-item"` y el drag handle.
```

<a id="file-0263"></a>

### 0263 — `src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/README.md`

- **Lenguaje:** `markdown`
- **Líneas:** `24`
- **Tamaño original:** `0.8 KB`
- **SHA1 corto:** `58f298f490`
- **Estado:** `completo`

```markdown
# ListView JSDoc — SISAD PDFME

Este paquete contiene copias completas documentadas de los archivos del bloque `ListView` del right sidebar.

## Archivos incluidos

- `Item.tsx`
- `ListView.tsx`
- `ListViewDragOverlay.tsx`
- `ListViewFooter.tsx`
- `ListViewToolbar.tsx`
- `SelectableSortableContainer.tsx`
- `SelectableSortableItem.tsx`

## Criterio aplicado

- Se agregó documentación JSDoc a nivel de archivo, tipos, helpers y componentes principales.
- No se cambió la lógica funcional.
- Se preservaron imports, exports, nombres públicos y contratos de pruebas.
- Se mantuvieron los `data-testid`, `data-*`, callbacks y comportamiento de dnd-kit.

## Rol de este bloque

Este conjunto implementa la lista del right sidebar donde se muestran, filtran, seleccionan, ordenan y actualizan schemas/campos del diseñador.
```

---

## Prompt sugerido para IA

```text
Analiza este contexto de proyecto. Primero identifica arquitectura, rutas críticas, dependencias y posibles riesgos. Luego responde únicamente con cambios accionables, citando rutas relativas exactas. No inventes archivos no presentes en la tabla. Si falta contexto, indícalo explícitamente.
```
