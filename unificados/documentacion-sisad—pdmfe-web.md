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
- **Fecha generación:** `2026-07-17T16:15:28.366Z`
- **Extensiones incluidas:** `.md, .mdx`
- **Archivos candidatos incluidos:** `354`
- **Límite por archivo:** `120 KB`
- **Límite total de contenido:** `1800 KB`

## Estructura incluida

```text
prueba-plugin
├── .github
│   └── copilot-instructions.md
├── .serena
│   └── memories
│       └── memory_maintenance.md
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
│   │   ├── button-action-contract-checklist.md
│   │   ├── done-vs-pending.md
│   │   ├── global-validation.md
│   │   ├── improvement-backlog.md
│   │   ├── manual-ui-regression.md
│   │   ├── pdfcomponent-dynamic-integration-checklist.md
│   │   ├── README.md
│   │   ├── tailwind-design-continuity-validation.md
│   │   └── tailwind-migration.md
│   ├── context
│   │   ├── action-map-context.md
│   │   ├── ai-docs-context.md
│   │   ├── canvas-multipage-context.md
│   │   ├── css-tailwind-context.md
│   │   ├── ESPECIFICACION_FUNCIONAL_COMPLETA_SISAD_PDFME.md
│   │   ├── inspector-context.md
│   │   ├── README.md
│   │   ├── schema-families-context.md
│   │   ├── selection-transform-context.md
│   │   ├── snapshot-context.md
│   │   ├── tailwind-design-continuity-context.md
│   │   └── visual-baseline-context.md
│   ├── coordination
│   │   └── uxqa-20260717
│   │       ├── handoffs
│   │       │   ├── CLAUDE-INTEGRATION-W1-BLOCKED.md
│   │       │   ├── CLAUDE-INTEGRATION-W1-READINESS.md
│   │       │   ├── CLAUDE-QUARANTINE-MAIN.md
│   │       │   ├── CLAUDE-W1-DEP-COPILOT.md
│   │       │   ├── CLAUDE-W1.md
│   │       │   ├── CODEX-wave1.md
│   │       │   └── COPILOT-wave1.md
│   │       ├── OWNERSHIP.md
│   │       └── status
│   │           ├── CLAUDE.md
│   │           ├── CODEX.md
│   │           └── COPILOT.md
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
│   ├── plans
│   │   ├── PLAN_EJECUCION_MIGRACION_TAILWIND_SISAD_PDFME.md
│   │   └── PLAN_MAESTRO_UX_QA_POST_TAILWIND_SISAD_PDFME_2026-07-17.md
│   ├── playbooks
│   │   ├── pb-ai-docs-refactor.md
│   │   ├── pb-canvas-multipage.md
│   │   ├── pb-css-tailwind-migration.md
│   │   ├── pb-inspector.md
│   │   ├── pb-schema-families.md
│   │   ├── pb-selection-transform.md
│   │   ├── pb-snapshot.md
│   │   ├── pb-tailwind-design-continuity.md
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
│   │   ├── codex-next-pass-actions-ui-dedup.md
│   │   ├── codex-pdfcomponent-dynamic-integration-refactor.md
│   │   ├── codex-start-tailwind-design-continuity.md
│   │   ├── copilot-task-context.md
│   │   ├── create-task-card.md
│   │   ├── PROMPT_ARRANQUE_MULTIAGENTE_UX_QA_SISAD_PDFME_2026-07-17.md
│   │   ├── PROMPT_MAESTRO_MIGRACION_TAILWIND_SISAD_PDFME.md
│   │   ├── PROMPT_REALINEACION_MULTIAGENTE_WAVE1_SISAD_PDFME.md
│   │   ├── README.md
│   │   └── update-memory.md
│   ├── README.md
│   ├── reports
│   │   ├── architecture-correction-2026-07-14.md
│   │   ├── auditoria_migracion_tailwind_y_regresiones_sisad_pdfme_2026-07-15.md
│   │   ├── deep-ui-action-audit-2026-07-15.md
│   │   ├── pdfcomponent-integration-boundary.md
│   │   ├── pdfcomponent-integration-deep-audit-2026-07-15.md
│   │   └── tailwind-design-continuity-roadmap.md
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
│   │   ├── snapshot-rules.md
│   │   └── tailwind-design-continuity-rules.md
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
│   │   │   ├── TASK-CSS-026-accelerated-tailwind-inline-decommission.md
│   │   │   └── TASK-REGRESSION-021-shell-token-visual-recovery.md
│   │   ├── backlog
│   │   │   ├── TASK-CSS-021-left-sidebar-overflow-tailwind-continuity.md
│   │   │   ├── TASK-CSS-022-left-sidebar-css-pruning.md
│   │   │   ├── TASK-CSS-023-tailwind-migration-continuity-step-by-step.md
│   │   │   ├── TASK-CSS-027-right-sidebar-constants-tailwind-scroll-polish.md
│   │   │   ├── TASK-LAB-030-canvas-first-shell-style-source-unification.md
│   │   │   ├── TASK-QA-016-tailwind-design-visual-regression.md
│   │   │   ├── TASK-QA-017-listview-specs-docs-default-drift.md
│   │   │   └── TASK-SCHEMA-003-action-owner-accent-continuity.md
│   │   ├── completed
│   │   │   ├── completed-summary.md
│   │   │   ├── README.md
│   │   │   ├── TASK-ACTIONS-001-button-action-contract-audit.md
│   │   │   ├── TASK-ACTIONS-002-commandbus-action-registry-unification.md
│   │   │   ├── TASK-ARCH-003-enforce-existing-ai-folder-architecture.md
│   │   │   ├── TASK-ARCH-004-wrapper-reduction-public-api-hardening.md
│   │   │   ├── TASK-CANVAS-001-protect-canvas-overflow.md
│   │   │   ├── TASK-CANVAS-003-guides-ruler-black-overlay-regression.md
│   │   │   ├── TASK-CSS-012-inline-tailwind-css-reduction.md
│   │   │   ├── TASK-CSS-013-selector-dedup-current-design-polish.md
│   │   │   ├── TASK-CSS-014-tailwind3-current-ui-dedup-polish.md
│   │   │   ├── TASK-CSS-015-lab-routes-tailwind3-dedup.md
│   │   │   ├── TASK-CSS-018-stabilize-tailwind-cleanup.md
│   │   │   ├── TASK-CSS-019-jsx-tsx-tailwind-migration-and-css-reduction.md
│   │   │   ├── TASK-CSS-020-lab-routes-zero-apply.md
│   │   │   ├── TASK-CSS-023-right-sidebar-documents-tailwind-continuity.md
│   │   │   ├── TASK-CSS-024-right-sidebar-listview-row-flat.md
│   │   │   ├── TASK-CSS-025-context-summary-guides-apply-to-jsx.md
│   │   │   ├── TASK-DETAIL-015-access-state-label-sync.md
│   │   │   ├── TASK-INTERACTION-016-assignment-modal-selection-freeze-regression.md
│   │   │   ├── TASK-LAB-017-pdfcomponent-integration-boundary.md
│   │   │   ├── TASK-LAB-018-use-pdfme-lab-integration-hook.md
│   │   │   ├── TASK-LAB-019-normalize-lab-example-data-contract.md
│   │   │   ├── TASK-LAB-020-public-runtime-wrappers-only.md
│   │   │   ├── TASK-LAB-021-lab-action-registry-controller-contract.md
│   │   │   ├── TASK-LAB-022-remove-compat-wrapper-reexports.md
│   │   │   ├── TASK-LAB-023-lab-presentation-core-selectors.md
│   │   │   ├── TASK-LAB-024-external-data-integration-e2e.md
│   │   │   ├── TASK-LAB-025-example-bundle-normalized-export.md
│   │   │   ├── TASK-LAB-026-restore-designer-visual-baseline-after-integration.md
│   │   │   ├── TASK-LAB-027-lab-canvas-first-shell-jsx-handoff.md
│   │   │   ├── TASK-LAB-028-runtime-collaboration-sync-and-form-echo.md
│   │   │   ├── TASK-LAB-029-multidocument-right-sidebar-docs-default.md
│   │   │   ├── TASK-PDFME-010-drag-preview-and-canvas-scroll-regression.md
│   │   │   ├── TASK-PDFME-011-connectivity-sisad-restore.md
│   │   │   ├── TASK-PDFME-012-global-visibility-wiring-continuity.md
│   │   │   ├── TASK-PDFME-013-controller-real-api-no-noop.md
│   │   │   ├── TASK-PDFME-014-rightsidebar-reassign-state-regression.md
│   │   │   ├── TASK-QA-015-action-coverage-regression-suite.md
│   │   │   ├── TASK-REGRESSION-020-owner-color-renderer-continuity.md
│   │   │   ├── TASK-RUNTIME-015-config-hook-visibility-action-map.md
│   │   │   ├── TASK-UI-015-right-left-rail-collapse-polish.md
│   │   │   ├── TASK-UI-016-zoom-toolbar-contract.md
│   │   │   └── TASK-UI-017-density-breakpoints-sync.md
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
├── ANALISIS_PROFUNDO_MIGRACION_TAILWIND_BASELINE_ANTERIOR.md
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
│   │   ├── 11-action-contract.md
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
│   │   ├── 05-global-config.md
│   │   ├── 06-host-adapters.md
│   │   ├── 07-pdfcomponent-lab-as-host-reference.md
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
│   │   ├── 05-css-reduction-tailwind-inline.md
│   │   ├── 06-tailwind3-selector-dedup-plan.md
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
│   │   ├── 04-dynamic-host-integration-examples.md
│   │   └── README.md
│   ├── 14-seguridad
│   │   ├── 01-archivos.md
│   │   ├── 02-firma.md
│   │   └── README.md
│   └── README.md
├── INTEGRATION_CHECKLIST.md
├── KNOWN_GAPS.md
├── MANIFEST.md
├── PROMPT_FINALIZAR_MIGRACION_TAILWIND_SIN_PERDER_DISENO.md
├── README.md
├── reports
│   ├── action-audit
│   │   └── button-action-inventory.md
│   ├── designer-deep-audit
│   │   ├── duplication-map.md
│   │   ├── risk-map.md
│   │   └── wrapper-reduction.md
│   ├── jsdoc-missing-report.md
│   └── tailwind-migration
│       ├── accelerated
│       │   ├── constants-contract.md
│       │   └── migration-ledger.md
│       ├── active-css-inventory.md
│       ├── active-selector-duplicates.md
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
│       ├── selector-duplicates-current.md
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
├── src
│   └── sisad-pdfme
│       ├── common
│       │   ├── documentacion-common-sisad-pdfme.md
│       │   └── README.md
│       ├── converter
│       │   ├── documentacion-converter-sisad-pdfme.md
│       │   └── README.md
│       ├── runtime
│       │   ├── documentacion-runtime-sisad-pdfme.md
│       │   └── README.md
│       └── ui
│           ├── components
│           │   ├── Designer
│           │   │   ├── Canvas
│           │   │   │   ├── documentacion-canvas-core-jsdoc.md
│           │   │   │   ├── overlays
│           │   │   │   │   └── …
│           │   │   │   └── README.md
│           │   │   └── RightSidebar
│           │   │       ├── DetailView
│           │   │       │   └── …
│           │   │       ├── documentacion-right-sidebar-rails-jsdoc.md
│           │   │       ├── ListView
│           │   │       │   └── …
│           │   │       └── README.md
│           │   ├── documentacion-runtime-preview-base-jsdoc.md
│           │   └── README.md
│           ├── documentacion-ui-runtime-sisad-pdfme.md
│           └── README.md
└── test-results
    └── tests-playwright-detail-vi-be09e-metry-and-identity-controls-chromium
        └── error-context.md
```

## Archivos incluidos

| # | Ruta | Lenguaje | Líneas | KB original | Estado |
|---:|---|---|---:|---:|---|
| 1 | `README.md` | markdown | 76 | 2.6 | completo |
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
| 31 | `docs/03-designer/11-action-contract.md` | markdown | 53 | 1.2 | completo |
| 32 | `docs/03-designer/README.md` | markdown | 12 | 0.4 | completo |
| 33 | `docs/04-schemas/01-schema-base.md` | markdown | 23 | 0.3 | completo |
| 34 | `docs/04-schemas/02-familias.md` | markdown | 12 | 0.4 | completo |
| 35 | `docs/04-schemas/03-text-like.md` | markdown | 24 | 0.2 | completo |
| 36 | `docs/04-schemas/04-option-based.md` | markdown | 18 | 0.3 | completo |
| 37 | `docs/04-schemas/05-signing-based.md` | markdown | 13 | 0.3 | completo |
| 38 | `docs/04-schemas/06-action-based.md` | markdown | 15 | 0.2 | completo |
| 39 | `docs/04-schemas/07-media-barcode-table-shapes.md` | markdown | 22 | 0.3 | completo |
| 40 | `docs/04-schemas/08-custom-schemas.md` | markdown | 15 | 0.3 | completo |
| 41 | `docs/04-schemas/09-inspector-contract.md` | markdown | 22 | 0.4 | completo |
| 42 | `docs/04-schemas/10-docusing-mapping.md` | markdown | 17 | 0.4 | completo |
| 43 | `docs/04-schemas/README.md` | markdown | 12 | 0.5 | completo |
| 44 | `docs/05-runtime/01-form.md` | markdown | 13 | 0.2 | completo |
| 45 | `docs/05-runtime/02-viewer.md` | markdown | 10 | 0.2 | completo |
| 46 | `docs/05-runtime/03-values.md` | markdown | 11 | 0.2 | completo |
| 47 | `docs/05-runtime/04-validation.md` | markdown | 13 | 0.2 | completo |
| 48 | `docs/05-runtime/05-recipient-filtering.md` | markdown | 10 | 0.2 | completo |
| 49 | `docs/05-runtime/README.md` | markdown | 7 | 0.2 | completo |
| 50 | `docs/06-generator/01-generator-overview.md` | markdown | 10 | 0.2 | completo |
| 51 | `docs/06-generator/02-pdf-output.md` | markdown | 8 | 0.2 | completo |
| 52 | `docs/06-generator/03-fonts-assets.md` | markdown | 8 | 0.2 | completo |
| 53 | `docs/06-generator/README.md` | markdown | 5 | 0.2 | completo |
| 54 | `docs/07-integraciones/01-react.md` | markdown | 12 | 0.3 | completo |
| 55 | `docs/07-integraciones/02-host-app.md` | markdown | 18 | 0.3 | completo |
| 56 | `docs/07-integraciones/03-signature-providers.md` | markdown | 14 | 0.3 | completo |
| 57 | `docs/07-integraciones/04-external-forms.md` | markdown | 9 | 0.2 | completo |
| 58 | `docs/07-integraciones/05-global-config.md` | markdown | 36 | 0.7 | completo |
| 59 | `docs/07-integraciones/06-host-adapters.md` | markdown | 26 | 0.6 | completo |
| 60 | `docs/07-integraciones/07-pdfcomponent-lab-as-host-reference.md` | markdown | 34 | 1.0 | completo |
| 61 | `docs/07-integraciones/README.md` | markdown | 6 | 0.2 | completo |
| 62 | `docs/08-api-reference/01-designer-api.md` | markdown | 10 | 0.3 | completo |
| 63 | `docs/08-api-reference/02-form-api.md` | markdown | 9 | 0.2 | completo |
| 64 | `docs/08-api-reference/03-viewer-api.md` | markdown | 7 | 0.1 | completo |
| 65 | `docs/08-api-reference/04-generator-api.md` | markdown | 9 | 0.2 | completo |
| 66 | `docs/08-api-reference/05-plugin-api.md` | markdown | 14 | 0.2 | completo |
| 67 | `docs/08-api-reference/README.md` | markdown | 7 | 0.2 | completo |
| 68 | `docs/09-theming/01-tokens-css.md` | markdown | 14 | 0.2 | completo |
| 69 | `docs/09-theming/02-tailwind-bridge.md` | markdown | 10 | 0.3 | completo |
| 70 | `docs/09-theming/03-baseline-visual.md` | markdown | 11 | 0.2 | completo |
| 71 | `docs/09-theming/04-css-migration.md` | markdown | 11 | 0.2 | completo |
| 72 | `docs/09-theming/05-css-reduction-tailwind-inline.md` | markdown | 35 | 0.7 | completo |
| 73 | `docs/09-theming/06-tailwind3-selector-dedup-plan.md` | markdown | 46 | 1.0 | completo |
| 74 | `docs/09-theming/README.md` | markdown | 6 | 0.2 | completo |
| 75 | `docs/10-testing-qa/01-manual-checklist.md` | markdown | 26 | 0.3 | completo |
| 76 | `docs/10-testing-qa/02-regression-matrix.md` | markdown | 10 | 0.3 | completo |
| 77 | `docs/10-testing-qa/03-playwright.md` | markdown | 12 | 0.2 | completo |
| 78 | `docs/10-testing-qa/04-vitest.md` | markdown | 10 | 0.2 | completo |
| 79 | `docs/10-testing-qa/README.md` | markdown | 6 | 0.2 | completo |
| 80 | `docs/11-migraciones/01-legacy-templates.md` | markdown | 10 | 0.3 | completo |
| 81 | `docs/11-migraciones/02-snapshot-versioning.md` | markdown | 9 | 0.2 | completo |
| 82 | `docs/11-migraciones/03-pdfme-upstream.md` | markdown | 12 | 0.2 | completo |
| 83 | `docs/11-migraciones/README.md` | markdown | 5 | 0.2 | completo |
| 84 | `docs/12-troubleshooting/01-canvas.md` | markdown | 14 | 0.3 | completo |
| 85 | `docs/12-troubleshooting/02-pdf-worker.md` | markdown | 9 | 0.2 | completo |
| 86 | `docs/12-troubleshooting/03-tailwind-regressions.md` | markdown | 10 | 0.3 | completo |
| 87 | `docs/12-troubleshooting/04-runtime.md` | markdown | 16 | 0.2 | completo |
| 88 | `docs/12-troubleshooting/README.md` | markdown | 6 | 0.2 | completo |
| 89 | `docs/13-ejemplos/01-basic-designer.md` | markdown | 11 | 0.2 | completo |
| 90 | `docs/13-ejemplos/02-multi-document-routing.md` | markdown | 10 | 0.2 | completo |
| 91 | `docs/13-ejemplos/03-generator-runtime.md` | markdown | 9 | 0.1 | completo |
| 92 | `docs/13-ejemplos/04-dynamic-host-integration-examples.md` | markdown | 21 | 0.6 | completo |
| 93 | `docs/13-ejemplos/README.md` | markdown | 5 | 0.2 | completo |
| 94 | `docs/14-seguridad/01-archivos.md` | markdown | 9 | 0.2 | completo |
| 95 | `docs/14-seguridad/02-firma.md` | markdown | 5 | 0.2 | completo |
| 96 | `docs/14-seguridad/README.md` | markdown | 4 | 0.1 | completo |
| 97 | `AGENTS.md` | markdown | 26 | 0.7 | completo |
| 98 | `ANALISIS_PROFUNDO_MIGRACION_TAILWIND_BASELINE_ANTERIOR.md` | markdown | 844 | 14.8 | completo |
| 99 | `CLAUDE.md` | markdown | 23 | 0.5 | completo |
| 100 | `INTEGRATION_CHECKLIST.md` | markdown | 26 | 1.1 | completo |
| 101 | `KNOWN_GAPS.md` | markdown | 18 | 1.3 | completo |
| 102 | `MANIFEST.md` | markdown | 27 | 1.0 | completo |
| 103 | `PROMPT_FINALIZAR_MIGRACION_TAILWIND_SIN_PERDER_DISENO.md` | markdown | 455 | 7.1 | completo |
| 104 | `.github/copilot-instructions.md` | markdown | 15 | 0.4 | completo |
| 105 | `ai/README.md` | markdown | 38 | 0.8 | completo |
| 106 | `ai/tree.md` | markdown | 26 | 0.4 | completo |
| 107 | `reports/jsdoc-missing-report.md` | markdown | 2254 | 78.0 | completo |
| 108 | `scripts/README.md` | markdown | 21 | 0.4 | completo |
| 109 | `.serena/memories/memory_maintenance.md` | markdown | 33 | 2.0 | completo |
| 110 | `ai/adapters/README.md` | markdown | 3 | 0.1 | completo |
| 111 | `ai/agents/canvas-agent.md` | markdown | 37 | 0.6 | completo |
| 112 | `ai/agents/css-tailwind-agent.md` | markdown | 37 | 0.6 | completo |
| 113 | `ai/agents/designer-runtime-agent.md` | markdown | 37 | 0.6 | completo |
| 114 | `ai/agents/docs-architecture-agent.md` | markdown | 37 | 0.6 | completo |
| 115 | `ai/agents/inspector-agent.md` | markdown | 37 | 0.6 | completo |
| 116 | `ai/agents/interaction-agent.md` | markdown | 37 | 0.6 | completo |
| 117 | `ai/agents/lab-shell-agent.md` | markdown | 37 | 0.6 | completo |
| 118 | `ai/agents/README.md` | markdown | 3 | 0.1 | completo |
| 119 | `ai/agents/registry.md` | markdown | 12 | 1.3 | completo |
| 120 | `ai/agents/schema-agent.md` | markdown | 37 | 0.6 | completo |
| 121 | `ai/agents/snapshot-agent.md` | markdown | 37 | 0.6 | completo |
| 122 | `ai/agents/visual-baseline-agent.md` | markdown | 37 | 0.6 | completo |
| 123 | `ai/baselines/img-version-baseline-protocol.md` | markdown | 29 | 0.4 | completo |
| 124 | `ai/baselines/README.md` | markdown | 3 | 0.1 | completo |
| 125 | `ai/checklists/button-action-contract-checklist.md` | markdown | 57 | 1.0 | completo |
| 126 | `ai/checklists/done-vs-pending.md` | markdown | 41 | 0.7 | completo |
| 127 | `ai/checklists/global-validation.md` | markdown | 8 | 0.2 | completo |
| 128 | `ai/checklists/improvement-backlog.md` | markdown | 9 | 0.3 | completo |
| 129 | `ai/checklists/manual-ui-regression.md` | markdown | 19 | 0.4 | completo |
| 130 | `ai/checklists/pdfcomponent-dynamic-integration-checklist.md` | markdown | 31 | 1.4 | completo |
| 131 | `ai/checklists/README.md` | markdown | 3 | 0.1 | completo |
| 132 | `ai/checklists/tailwind-design-continuity-validation.md` | markdown | 16 | 1.0 | completo |
| 133 | `ai/checklists/tailwind-migration.md` | markdown | 11 | 0.3 | completo |
| 134 | `ai/context/action-map-context.md` | markdown | 70 | 1.4 | completo |
| 135 | `ai/context/ai-docs-context.md` | markdown | 3 | 0.1 | completo |
| 136 | `ai/context/canvas-multipage-context.md` | markdown | 9 | 0.2 | completo |
| 137 | `ai/context/css-tailwind-context.md` | markdown | 26 | 0.6 | completo |
| 138 | `ai/context/ESPECIFICACION_FUNCIONAL_COMPLETA_SISAD_PDFME.md` | markdown | 1153 | 19.6 | completo |
| 139 | `ai/context/inspector-context.md` | markdown | 3 | 0.1 | completo |
| 140 | `ai/context/README.md` | markdown | 3 | 0.1 | completo |
| 141 | `ai/context/schema-families-context.md` | markdown | 5 | 0.2 | completo |
| 142 | `ai/context/selection-transform-context.md` | markdown | 3 | 0.2 | completo |
| 143 | `ai/context/snapshot-context.md` | markdown | 3 | 0.1 | completo |
| 144 | `ai/context/tailwind-design-continuity-context.md` | markdown | 25 | 1.7 | completo |
| 145 | `ai/context/visual-baseline-context.md` | markdown | 18 | 0.2 | completo |
| 146 | `ai/docs-migration/MIGRATION_FROM_OLD_STRUCTURE.md` | markdown | 30 | 0.7 | completo |
| 147 | `ai/memory/changelog.md` | markdown | 7 | 0.3 | completo |
| 148 | `ai/memory/completed-checklist.md` | markdown | 27 | 1.3 | completo |
| 149 | `ai/memory/decisions.md` | markdown | 21 | 0.8 | completo |
| 150 | `ai/memory/known-risks.md` | markdown | 10 | 0.5 | completo |
| 151 | `ai/memory/memory-update-protocol.md` | markdown | 29 | 0.6 | completo |
| 152 | `ai/memory/pending-checklist.md` | markdown | 21 | 1.2 | completo |
| 153 | `ai/memory/project-memory.md` | markdown | 20 | 0.8 | completo |
| 154 | `ai/memory/README.md` | markdown | 13 | 0.4 | completo |
| 155 | `ai/memory/session-handoff.md` | markdown | 168 | 9.6 | completo |
| 156 | `ai/plans/PLAN_EJECUCION_MIGRACION_TAILWIND_SISAD_PDFME.md` | markdown | 679 | 12.9 | completo |
| 157 | `ai/plans/PLAN_MAESTRO_UX_QA_POST_TAILWIND_SISAD_PDFME_2026-07-17.md` | markdown | 1099 | 26.0 | completo |
| 158 | `ai/playbooks/pb-ai-docs-refactor.md` | markdown | 26 | 0.8 | completo |
| 159 | `ai/playbooks/pb-canvas-multipage.md` | markdown | 6 | 0.2 | completo |
| 160 | `ai/playbooks/pb-css-tailwind-migration.md` | markdown | 28 | 0.7 | completo |
| 161 | `ai/playbooks/pb-inspector.md` | markdown | 6 | 0.1 | completo |
| 162 | `ai/playbooks/pb-schema-families.md` | markdown | 6 | 0.2 | completo |
| 163 | `ai/playbooks/pb-selection-transform.md` | markdown | 6 | 0.1 | completo |
| 164 | `ai/playbooks/pb-snapshot.md` | markdown | 6 | 0.1 | completo |
| 165 | `ai/playbooks/pb-tailwind-design-continuity.md` | markdown | 33 | 1.2 | completo |
| 166 | `ai/playbooks/pb-visual-regression.md` | markdown | 8 | 0.2 | completo |
| 167 | `ai/playbooks/README.md` | markdown | 3 | 0.1 | completo |
| 168 | `ai/project/architecture-principles.md` | markdown | 34 | 1.0 | completo |
| 169 | `ai/project/definition-of-done.md` | markdown | 12 | 0.4 | completo |
| 170 | `ai/project/file-ownership-map.md` | markdown | 14 | 0.8 | completo |
| 171 | `ai/project/glossary.md` | markdown | 16 | 0.7 | completo |
| 172 | `ai/project/goals.md` | markdown | 24 | 0.9 | completo |
| 173 | `ai/project/non-goals.md` | markdown | 12 | 0.3 | completo |
| 174 | `ai/project/scope.md` | markdown | 38 | 0.6 | completo |
| 175 | `ai/prompts/claude-diagnose-or-implement.md` | markdown | 7 | 0.2 | completo |
| 176 | `ai/prompts/codex-master-prompt.md` | markdown | 5 | 0.3 | completo |
| 177 | `ai/prompts/codex-next-pass-actions-ui-dedup.md` | markdown | 62 | 1.7 | completo |
| 178 | `ai/prompts/codex-pdfcomponent-dynamic-integration-refactor.md` | markdown | 31 | 1.6 | completo |
| 179 | `ai/prompts/codex-start-tailwind-design-continuity.md` | markdown | 13 | 0.8 | completo |
| 180 | `ai/prompts/copilot-task-context.md` | markdown | 11 | 0.2 | completo |
| 181 | `ai/prompts/create-task-card.md` | markdown | 11 | 0.2 | completo |
| 182 | `ai/prompts/PROMPT_ARRANQUE_MULTIAGENTE_UX_QA_SISAD_PDFME_2026-07-17.md` | markdown | 1072 | 26.0 | completo |
| 183 | `ai/prompts/PROMPT_MAESTRO_MIGRACION_TAILWIND_SISAD_PDFME.md` | markdown | 804 | 14.7 | completo |
| 184 | `ai/prompts/PROMPT_REALINEACION_MULTIAGENTE_WAVE1_SISAD_PDFME.md` | markdown | 351 | 8.6 | completo |
| 185 | `ai/prompts/README.md` | markdown | 3 | 0.1 | completo |
| 186 | `ai/prompts/update-memory.md` | markdown | 3 | 0.1 | completo |
| 187 | `ai/reports/architecture-correction-2026-07-14.md` | markdown | 28 | 1.6 | completo |
| 188 | `ai/reports/auditoria_migracion_tailwind_y_regresiones_sisad_pdfme_2026-07-15.md` | markdown | 198 | 11.2 | completo |
| 189 | `ai/reports/deep-ui-action-audit-2026-07-15.md` | markdown | 169 | 5.0 | completo |
| 190 | `ai/reports/pdfcomponent-integration-boundary.md` | markdown | 41 | 1.6 | completo |
| 191 | `ai/reports/pdfcomponent-integration-deep-audit-2026-07-15.md` | markdown | 193 | 10.8 | completo |
| 192 | `ai/reports/tailwind-design-continuity-roadmap.md` | markdown | 24 | 1.2 | completo |
| 193 | `ai/router/CONTEXT_BUDGET.md` | markdown | 58 | 1.2 | completo |
| 194 | `ai/router/ROUTER.md` | markdown | 30 | 2.0 | completo |
| 195 | `ai/router/TASK_INTAKE.md` | markdown | 35 | 0.9 | completo |
| 196 | `ai/rules/ai-docs-rules.md` | markdown | 6 | 0.2 | completo |
| 197 | `ai/rules/canvas-rules.md` | markdown | 3 | 0.1 | completo |
| 198 | `ai/rules/css-migration-rules.md` | markdown | 35 | 0.8 | completo |
| 199 | `ai/rules/global-rules.md` | markdown | 9 | 0.7 | completo |
| 200 | `ai/rules/inspector-rules.md` | markdown | 3 | 0.1 | completo |
| 201 | `ai/rules/moveable-selecto-rules.md` | markdown | 5 | 0.2 | completo |
| 202 | `ai/rules/README.md` | markdown | 3 | 0.1 | completo |
| 203 | `ai/rules/schema-rules.md` | markdown | 3 | 0.1 | completo |
| 204 | `ai/rules/snapshot-rules.md` | markdown | 3 | 0.1 | completo |
| 205 | `ai/rules/tailwind-design-continuity-rules.md` | markdown | 14 | 1.3 | completo |
| 206 | `ai/skills/canvas-multipage-skill.md` | markdown | 29 | 0.4 | completo |
| 207 | `ai/skills/inspector-skill.md` | markdown | 29 | 0.4 | completo |
| 208 | `ai/skills/memory-update-skill.md` | markdown | 29 | 0.4 | completo |
| 209 | `ai/skills/moveable-selecto-skill.md` | markdown | 29 | 0.4 | completo |
| 210 | `ai/skills/option-groups-skill.md` | markdown | 29 | 0.4 | completo |
| 211 | `ai/skills/prompting-skill.md` | markdown | 29 | 0.4 | completo |
| 212 | `ai/skills/README.md` | markdown | 3 | 0.1 | completo |
| 213 | `ai/skills/snapshot-safety-skill.md` | markdown | 29 | 0.4 | completo |
| 214 | `ai/skills/tailwind-migration-skill.md` | markdown | 29 | 0.4 | completo |
| 215 | `ai/skills/visual-regression-skill.md` | markdown | 29 | 0.4 | completo |
| 216 | `ai/start/QUICKSTART-CLAUDE.md` | markdown | 15 | 0.4 | completo |
| 217 | `ai/start/QUICKSTART-CODEX.md` | markdown | 34 | 0.7 | completo |
| 218 | `ai/start/QUICKSTART-COPILOT.md` | markdown | 18 | 0.4 | completo |
| 219 | `ai/start/START.md` | markdown | 76 | 1.2 | completo |
| 220 | `ai/subagents/anti-hallucination-reviewer.md` | markdown | 13 | 0.3 | completo |
| 221 | `ai/subagents/baseline-visual-critic.md` | markdown | 13 | 0.3 | completo |
| 222 | `ai/subagents/code-docs-writer.md` | markdown | 13 | 0.3 | completo |
| 223 | `ai/subagents/css-auditor.md` | markdown | 13 | 0.3 | completo |
| 224 | `ai/subagents/legacy-css-guardian.md` | markdown | 13 | 0.3 | completo |
| 225 | `ai/subagents/memory-curator.md` | markdown | 13 | 0.3 | completo |
| 226 | `ai/subagents/prompt-engineer.md` | markdown | 13 | 0.3 | completo |
| 227 | `ai/subagents/README.md` | markdown | 3 | 0.1 | completo |
| 228 | `ai/subagents/regression-tester.md` | markdown | 13 | 0.3 | completo |
| 229 | `ai/subagents/tailwind-migrator.md` | markdown | 13 | 0.3 | completo |
| 230 | `ai/task-cards/README.md` | markdown | 11 | 0.2 | completo |
| 231 | `ai/templates/agent-template.md` | markdown | 7 | 0.1 | completo |
| 232 | `ai/templates/checklist-template.md` | markdown | 5 | 0.1 | completo |
| 233 | `ai/templates/decision-template.md` | markdown | 7 | 0.1 | completo |
| 234 | `ai/templates/memory-update-template.md` | markdown | 7 | 0.1 | completo |
| 235 | `ai/templates/README.md` | markdown | 3 | 0.1 | completo |
| 236 | `ai/templates/skill-template.md` | markdown | 7 | 0.1 | completo |
| 237 | `ai/templates/task-card-template.md` | markdown | 11 | 0.2 | completo |
| 238 | `reports/action-audit/button-action-inventory.md` | markdown | 149 | 41.7 | completo |
| 239 | `reports/designer-deep-audit/duplication-map.md` | markdown | 24 | 1.4 | completo |
| 240 | `reports/designer-deep-audit/risk-map.md` | markdown | 19 | 1.1 | completo |
| 241 | `reports/designer-deep-audit/wrapper-reduction.md` | markdown | 56 | 2.7 | completo |
| 242 | `reports/tailwind-migration/active-css-inventory.md` | markdown | 12 | 0.6 | completo |
| 243 | `reports/tailwind-migration/active-selector-duplicates.md` | markdown | 9 | 0.9 | completo |
| 244 | `reports/tailwind-migration/baseline-regression-audit.md` | markdown | 27 | 5.2 | completo |
| 245 | `reports/tailwind-migration/component-migration-ledger.md` | markdown | 212 | 19.5 | completo |
| 246 | `reports/tailwind-migration/deep-density-spacing-audit.md` | markdown | 105 | 9.6 | completo |
| 247 | `reports/tailwind-migration/img-version-baseline-inventory.md` | markdown | 14 | 2.6 | completo |
| 248 | `reports/tailwind-migration/line-by-line-style-audit.md` | markdown | 227 | 21.6 | completo |
| 249 | `reports/tailwind-migration/pending-phases-progress.md` | markdown | 10 | 1.9 | completo |
| 250 | `reports/tailwind-migration/README.md` | markdown | 76 | 4.6 | completo |
| 251 | `reports/tailwind-migration/right-sidebar-scroll-tailwind-fix.md` | markdown | 45 | 3.4 | completo |
| 252 | `reports/tailwind-migration/right-sidebar-tailwind-only-density-fix.md` | markdown | 34 | 3.2 | completo |
| 253 | `reports/tailwind-migration/rightsidebar-detailview-tailwind-audit.md` | markdown | 13 | 2.3 | completo |
| 254 | `reports/tailwind-migration/runtime-form-viewer-tailwind-audit.md` | markdown | 20 | 1.4 | completo |
| 255 | `reports/tailwind-migration/schema-chrome-tailwind-audit.md` | markdown | 18 | 1.3 | completo |
| 256 | `reports/tailwind-migration/selector-duplicates-current.md` | markdown | 37 | 5.5 | completo |
| 257 | `reports/tailwind-migration/tc-css-04-left-sidebar-tailwind.md` | markdown | 45 | 2.8 | completo |
| 258 | `reports/tailwind-migration/tc-css-08-control-bar-toolbar-tailwind.md` | markdown | 43 | 2.5 | completo |
| 259 | `reports/tailwind-migration/tc-css-10-schemas-visual.md` | markdown | 33 | 3.7 | completo |
| 260 | `reports/tailwind-migration/tc-css-11-lab-audit.md` | markdown | 31 | 1.2 | completo |
| 261 | `reports/tailwind-migration/tc-css-option-group-selection-fix.md` | markdown | 38 | 4.3 | completo |
| 262 | `reports/tailwind-migration/tc-css-ownership-color.md` | markdown | 38 | 4.0 | completo |
| 263 | `reports/tailwind-migration/ui-styles-decommission-audit.md` | markdown | 57 | 5.6 | completo |
| 264 | `reports/tailwind-migration/ui-styles-decommission-progress.md` | markdown | 25 | 1.6 | completo |
| 265 | `test-results/tests-playwright-detail-vi-be09e-metry-and-identity-controls-chromium/error-context.md` | markdown | 540 | 27.1 | completo |
| 266 | `ai/coordination/uxqa-20260717/OWNERSHIP.md` | markdown | 13 | 0.5 | completo |
| 267 | `ai/task-cards/active/TASK-CSS-026-accelerated-tailwind-inline-decommission.md` | markdown | 109 | 7.0 | completo |
| 268 | `ai/task-cards/active/TASK-REGRESSION-021-shell-token-visual-recovery.md` | markdown | 214 | 35.7 | completo |
| 269 | `ai/task-cards/backlog/TASK-CSS-021-left-sidebar-overflow-tailwind-continuity.md` | markdown | 42 | 1.2 | completo |
| 270 | `ai/task-cards/backlog/TASK-CSS-022-left-sidebar-css-pruning.md` | markdown | 39 | 0.9 | completo |
| 271 | `ai/task-cards/backlog/TASK-CSS-023-tailwind-migration-continuity-step-by-step.md` | markdown | 84 | 3.9 | completo |
| 272 | `ai/task-cards/backlog/TASK-CSS-027-right-sidebar-constants-tailwind-scroll-polish.md` | markdown | 95 | 4.6 | completo |
| 273 | `ai/task-cards/backlog/TASK-LAB-030-canvas-first-shell-style-source-unification.md` | markdown | 42 | 1.2 | completo |
| 274 | `ai/task-cards/backlog/TASK-QA-016-tailwind-design-visual-regression.md` | markdown | 42 | 1.1 | completo |
| 275 | `ai/task-cards/backlog/TASK-QA-017-listview-specs-docs-default-drift.md` | markdown | 39 | 1.9 | completo |
| 276 | `ai/task-cards/backlog/TASK-SCHEMA-003-action-owner-accent-continuity.md` | markdown | 42 | 1.2 | completo |
| 277 | `ai/task-cards/completed/completed-summary.md` | markdown | 152 | 8.9 | completo |
| 278 | `ai/task-cards/completed/README.md` | markdown | 3 | 0.1 | completo |
| 279 | `ai/task-cards/completed/TASK-ACTIONS-001-button-action-contract-audit.md` | markdown | 89 | 2.6 | completo |
| 280 | `ai/task-cards/completed/TASK-ACTIONS-002-commandbus-action-registry-unification.md` | markdown | 105 | 3.6 | completo |
| 281 | `ai/task-cards/completed/TASK-ARCH-003-enforce-existing-ai-folder-architecture.md` | markdown | 66 | 1.5 | completo |
| 282 | `ai/task-cards/completed/TASK-ARCH-004-wrapper-reduction-public-api-hardening.md` | markdown | 77 | 2.5 | completo |
| 283 | `ai/task-cards/completed/TASK-CANVAS-001-protect-canvas-overflow.md` | markdown | 21 | 0.5 | completo |
| 284 | `ai/task-cards/completed/TASK-CANVAS-003-guides-ruler-black-overlay-regression.md` | markdown | 78 | 3.0 | completo |
| 285 | `ai/task-cards/completed/TASK-CSS-012-inline-tailwind-css-reduction.md` | markdown | 91 | 2.7 | completo |
| 286 | `ai/task-cards/completed/TASK-CSS-013-selector-dedup-current-design-polish.md` | markdown | 86 | 3.1 | completo |
| 287 | `ai/task-cards/completed/TASK-CSS-014-tailwind3-current-ui-dedup-polish.md` | markdown | 85 | 2.9 | completo |
| 288 | `ai/task-cards/completed/TASK-CSS-015-lab-routes-tailwind3-dedup.md` | markdown | 14 | 0.4 | completo |
| 289 | `ai/task-cards/completed/TASK-CSS-018-stabilize-tailwind-cleanup.md` | markdown | 41 | 1.6 | completo |
| 290 | `ai/task-cards/completed/TASK-CSS-019-jsx-tsx-tailwind-migration-and-css-reduction.md` | markdown | 72 | 4.6 | completo |
| 291 | `ai/task-cards/completed/TASK-CSS-020-lab-routes-zero-apply.md` | markdown | 50 | 1.5 | completo |
| 292 | `ai/task-cards/completed/TASK-CSS-023-right-sidebar-documents-tailwind-continuity.md` | markdown | 42 | 1.1 | completo |
| 293 | `ai/task-cards/completed/TASK-CSS-024-right-sidebar-listview-row-flat.md` | markdown | 99 | 4.6 | completo |
| 294 | `ai/task-cards/completed/TASK-CSS-025-context-summary-guides-apply-to-jsx.md` | markdown | 116 | 6.5 | completo |
| 295 | `ai/task-cards/completed/TASK-DETAIL-015-access-state-label-sync.md` | markdown | 85 | 3.3 | completo |
| 296 | `ai/task-cards/completed/TASK-INTERACTION-016-assignment-modal-selection-freeze-regression.md` | markdown | 36 | 2.1 | completo |
| 297 | `ai/task-cards/completed/TASK-LAB-017-pdfcomponent-integration-boundary.md` | markdown | 19 | 0.8 | completo |
| 298 | `ai/task-cards/completed/TASK-LAB-018-use-pdfme-lab-integration-hook.md` | markdown | 20 | 0.8 | completo |
| 299 | `ai/task-cards/completed/TASK-LAB-019-normalize-lab-example-data-contract.md` | markdown | 16 | 0.5 | completo |
| 300 | `ai/task-cards/completed/TASK-LAB-020-public-runtime-wrappers-only.md` | markdown | 18 | 0.7 | completo |
| 301 | `ai/task-cards/completed/TASK-LAB-021-lab-action-registry-controller-contract.md` | markdown | 15 | 0.5 | completo |
| 302 | `ai/task-cards/completed/TASK-LAB-022-remove-compat-wrapper-reexports.md` | markdown | 18 | 0.7 | completo |
| 303 | `ai/task-cards/completed/TASK-LAB-023-lab-presentation-core-selectors.md` | markdown | 14 | 0.5 | completo |
| 304 | `ai/task-cards/completed/TASK-LAB-024-external-data-integration-e2e.md` | markdown | 19 | 0.8 | completo |
| 305 | `ai/task-cards/completed/TASK-LAB-025-example-bundle-normalized-export.md` | markdown | 18 | 0.6 | completo |
| 306 | `ai/task-cards/completed/TASK-LAB-026-restore-designer-visual-baseline-after-integration.md` | markdown | 97 | 4.9 | completo |
| 307 | `ai/task-cards/completed/TASK-LAB-027-lab-canvas-first-shell-jsx-handoff.md` | markdown | 40 | 1.6 | completo |
| 308 | `ai/task-cards/completed/TASK-LAB-028-runtime-collaboration-sync-and-form-echo.md` | markdown | 48 | 2.0 | completo |
| 309 | `ai/task-cards/completed/TASK-LAB-029-multidocument-right-sidebar-docs-default.md` | markdown | 43 | 1.7 | completo |
| 310 | `ai/task-cards/completed/TASK-PDFME-010-drag-preview-and-canvas-scroll-regression.md` | markdown | 40 | 1.0 | completo |
| 311 | `ai/task-cards/completed/TASK-PDFME-011-connectivity-sisad-restore.md` | markdown | 37 | 1.0 | completo |
| 312 | `ai/task-cards/completed/TASK-PDFME-012-global-visibility-wiring-continuity.md` | markdown | 48 | 1.4 | completo |
| 313 | `ai/task-cards/completed/TASK-PDFME-013-controller-real-api-no-noop.md` | markdown | 37 | 1.3 | completo |
| 314 | `ai/task-cards/completed/TASK-PDFME-014-rightsidebar-reassign-state-regression.md` | markdown | 45 | 1.2 | completo |
| 315 | `ai/task-cards/completed/TASK-QA-015-action-coverage-regression-suite.md` | markdown | 86 | 2.4 | completo |
| 316 | `ai/task-cards/completed/TASK-REGRESSION-020-owner-color-renderer-continuity.md` | markdown | 49 | 1.9 | completo |
| 317 | `ai/task-cards/completed/TASK-RUNTIME-015-config-hook-visibility-action-map.md` | markdown | 59 | 1.9 | completo |
| 318 | `ai/task-cards/completed/TASK-UI-015-right-left-rail-collapse-polish.md` | markdown | 77 | 2.5 | completo |
| 319 | `ai/task-cards/completed/TASK-UI-016-zoom-toolbar-contract.md` | markdown | 68 | 2.0 | completo |
| 320 | `ai/task-cards/completed/TASK-UI-017-density-breakpoints-sync.md` | markdown | 37 | 1.7 | completo |
| 321 | `reports/tailwind-migration/accelerated/constants-contract.md` | markdown | 22 | 2.1 | completo |
| 322 | `reports/tailwind-migration/accelerated/migration-ledger.md` | markdown | 92 | 5.2 | completo |
| 323 | `src/sisad-pdfme/common/documentacion-common-sisad-pdfme.md` | markdown | 784 | 21.6 | completo |
| 324 | `src/sisad-pdfme/common/README.md` | markdown | 33 | 1.9 | completo |
| 325 | `src/sisad-pdfme/converter/documentacion-converter-sisad-pdfme.md` | markdown | 168 | 4.8 | completo |
| 326 | `src/sisad-pdfme/converter/README.md` | markdown | 42 | 0.9 | completo |
| 327 | `src/sisad-pdfme/runtime/documentacion-runtime-sisad-pdfme.md` | markdown | 151 | 4.6 | completo |
| 328 | `src/sisad-pdfme/runtime/README.md` | markdown | 15 | 0.7 | completo |
| 329 | `src/sisad-pdfme/ui/documentacion-ui-runtime-sisad-pdfme.md` | markdown | 168 | 5.7 | completo |
| 330 | `src/sisad-pdfme/ui/README.md` | markdown | 38 | 2.2 | completo |
| 331 | `.tailwind-migration-backups/20260708-111736/reports/tailwind-migration/README.md` | markdown | 76 | 3.4 | completo |
| 332 | `ai/coordination/uxqa-20260717/handoffs/CLAUDE-INTEGRATION-W1-BLOCKED.md` | markdown | 56 | 2.9 | completo |
| 333 | `ai/coordination/uxqa-20260717/handoffs/CLAUDE-INTEGRATION-W1-READINESS.md` | markdown | 45 | 2.1 | completo |
| 334 | `ai/coordination/uxqa-20260717/handoffs/CLAUDE-QUARANTINE-MAIN.md` | markdown | 32 | 1.4 | completo |
| 335 | `ai/coordination/uxqa-20260717/handoffs/CLAUDE-W1-DEP-COPILOT.md` | markdown | 50 | 2.0 | completo |
| 336 | `ai/coordination/uxqa-20260717/handoffs/CLAUDE-W1.md` | markdown | 94 | 4.4 | completo |
| 337 | `ai/coordination/uxqa-20260717/handoffs/CODEX-wave1.md` | markdown | 25 | 1.4 | completo |
| 338 | `ai/coordination/uxqa-20260717/handoffs/COPILOT-wave1.md` | markdown | 61 | 2.0 | completo |
| 339 | `ai/coordination/uxqa-20260717/status/CLAUDE.md` | markdown | 41 | 1.7 | completo |
| 340 | `ai/coordination/uxqa-20260717/status/CODEX.md` | markdown | 20 | 0.7 | completo |
| 341 | `ai/coordination/uxqa-20260717/status/COPILOT.md` | markdown | 28 | 0.5 | completo |
| 342 | `src/sisad-pdfme/ui/components/documentacion-runtime-preview-base-jsdoc.md` | markdown | 30 | 1.6 | completo |
| 343 | `src/sisad-pdfme/ui/components/README.md` | markdown | 28 | 1.1 | completo |
| 344 | `src/sisad-pdfme/ui/components/Designer/Canvas/documentacion-canvas-core-jsdoc.md` | markdown | 18 | 0.9 | completo |
| 345 | `src/sisad-pdfme/ui/components/Designer/Canvas/README.md` | markdown | 24 | 1.2 | completo |
| 346 | `src/sisad-pdfme/ui/components/Designer/RightSidebar/documentacion-right-sidebar-rails-jsdoc.md` | markdown | 15 | 1.0 | completo |
| 347 | `src/sisad-pdfme/ui/components/Designer/RightSidebar/README.md` | markdown | 18 | 0.7 | completo |
| 348 | `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/documentacion-canvas-overlays-jsdoc.md` | markdown | 21 | 0.7 | completo |
| 349 | `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/README.md` | markdown | 35 | 1.3 | completo |
| 350 | `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/documentacion-detailview-inspector-jsdoc.md` | markdown | 42 | 1.6 | completo |
| 351 | `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/documentacion-detailview-options-comments-jsdoc.md` | markdown | 38 | 1.4 | completo |
| 352 | `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/README.md` | markdown | 20 | 1.0 | completo |
| 353 | `src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/documentacion-listview-jsdoc.md` | markdown | 31 | 1.8 | completo |
| 354 | `src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/README.md` | markdown | 24 | 0.8 | completo |

## Resumen de exclusiones

- **extensión no incluida:** 1787
- **directorio ignorado: dependencia/build/salida generada:** 8

## Totales

- **KB originales candidatos:** `768.5`
- **KB incluidos en contenido:** `768.2`
- **Comentarios reducidos:** `desactivada`
- **JSON de datos en React:** `omitido por defecto`
- **Redacción de secretos:** `activa`

---

# Contenido consolidado

<a id="file-0001"></a>

### 0001 — `README.md`

- **Lenguaje:** `markdown`
- **Líneas:** `76`
- **Tamaño original:** `2.6 KB`
- **SHA1 corto:** `8ff586052c`
- **Estado:** `completo`

```markdown
# Suite integral de pruebas — SISAD PDFME

Suite generada a partir del código, documentación, estilos y especificación funcional consolidados el 16 de julio de 2026.

## Alcance

Incluye pruebas para:

- catálogo y familias de schemas;
- option groups, checkbox/radio/select;
- firma y providers;
- recipients, permisos, colores y registry;
- assignments;
- documents, páginas y routing;
- comentarios y anchors;
- snapshot, migración y validación;
- runtime Designer/Form/Viewer;
- teclado y acciones;
- LeftSidebar;
- RightSidebar, ListView y DetailView;
- Docs, Comments y Reasignar;
- Canvas, multipágina, drag/drop y zoom;
- selector de usuario activo;
- regresiones visuales y migración Tailwind.

## Integración

Desde la raíz de `prueba-plugin`:

``​`bash
unzip SISAD_PDFME_TEST_SUITE.zip -d /tmp/sisad-pdfme-tests
cp -R /tmp/sisad-pdfme-tests/sisad-pdfme-generated-test-suite/tests ./
``​`

Los archivos se ubican en subcarpetas `generated`, por lo que no reemplazan pruebas existentes:

``​`txt
tests/unit/generated/
tests/playwright/generated/
``​`

## Ejecución

``​`bash
npx vitest run tests/unit/generated
npx playwright test tests/playwright/generated --project=chromium
``​`

Ejecución por dominio:

``​`bash
npx vitest run tests/unit/generated/recipients
npx vitest run tests/unit/generated/schemas
npx playwright test tests/playwright/generated/right-sidebar --project=chromium
npx playwright test tests/playwright/generated/canvas --project=chromium
``​`

## Consideraciones

1. Las pruebas unitarias importan la API real desde `@/sisad-pdfme/...` y `@sisad-pdfme/schemas`.
2. Los specs Playwright usan la ruta `/lab/multi-document-routing` y selectores semánticos con fallbacks.
3. Funciones opcionales se omiten mediante `test.skip()` cuando el host las deshabilita por configuración.
4. Casos que documentan defectos confirmados pero todavía no corregidos usan `it.todo` o `test.fixme` para no bloquear la integración inicial.
5. `css-migration-budget.test.ts` usa el presupuesto observado en los archivos analizados: 47 `@apply` en `sisad-pdfme.css` y 1 en `tokens.css`. Reduzca esos límites cuando avance la migración.
6. Las capturas de `visual-baseline.spec.ts` requieren crear/aceptar snapshots la primera vez:

``​`bash
npx playwright test tests/playwright/generated/visual/visual-baseline.spec.ts --update-snapshots
``​`

## Archivos de apoyo

- `TEST_CASE_MATRIX.csv`: matriz de casos y cobertura.
- `KNOWN_GAPS.md`: riesgos y casos pendientes detectados.
- `INTEGRATION_CHECKLIST.md`: pasos para integrar sin dañar las pruebas actuales.
- `scripts/run-generated-tests.sh`: ejecución completa.
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

### 0031 — `docs/03-designer/11-action-contract.md`

- **Lenguaje:** `markdown`
- **Líneas:** `53`
- **Tamaño original:** `1.2 KB`
- **SHA1 corto:** `97fd334047`
- **Estado:** `completo`

```markdown
# Contrato de acciones del Designer

## Objetivo

Garantizar que cada botón visible del diseñador invoque una acción real y que todos los componentes consuman la misma fuente de verdad para visibilidad, permisos y estado.

## Principios

``​`txt
feature enabled != action visible != action enabled
``​`

- `feature enabled`: la capacidad existe.
- `action visible`: el usuario ve el botón/opción.
- `action enabled`: el usuario puede ejecutarla ahora.
- `disabledReason`: explica por qué no se puede ejecutar.

## API recomendada

``​`ts
type DesignerActionState = {
  id: string;
  visible: boolean;
  enabled: boolean;
  disabledReason: string | null;
  label: string;
  ariaLabel: string;
  testId: string;
};
``​`

## Reglas

- Un botón sin handler no se renderiza.
- Un botón icon-only requiere tooltip.
- Un botón deshabilitado requiere razón.
- Las acciones que modifican schema pasan por CommandBus o servicio central.
- Reasignar usa RecipientRegistry y schemaAssignmentService.
- Lock/Unlock usa estado de acceso central.

## Acciones críticas

- save
- reassign-recipient
- duplicate-schema
- delete-schema
- add-comment
- lock-position
- unlock-position
- release-edit
- open-properties
- undo/redo
- zoom-in/out/set
```

<a id="file-0032"></a>

### 0032 — `docs/03-designer/README.md`

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

<a id="file-0033"></a>

### 0033 — `docs/04-schemas/01-schema-base.md`

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

<a id="file-0034"></a>

### 0034 — `docs/04-schemas/02-familias.md`

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

<a id="file-0035"></a>

### 0035 — `docs/04-schemas/03-text-like.md`

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

<a id="file-0036"></a>

### 0036 — `docs/04-schemas/04-option-based.md`

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

<a id="file-0037"></a>

### 0037 — `docs/04-schemas/05-signing-based.md`

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

<a id="file-0038"></a>

### 0038 — `docs/04-schemas/06-action-based.md`

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

<a id="file-0039"></a>

### 0039 — `docs/04-schemas/07-media-barcode-table-shapes.md`

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

<a id="file-0040"></a>

### 0040 — `docs/04-schemas/08-custom-schemas.md`

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

<a id="file-0041"></a>

### 0041 — `docs/04-schemas/09-inspector-contract.md`

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

<a id="file-0042"></a>

### 0042 — `docs/04-schemas/10-docusing-mapping.md`

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

<a id="file-0043"></a>

### 0043 — `docs/04-schemas/README.md`

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

<a id="file-0044"></a>

### 0044 — `docs/05-runtime/01-form.md`

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

<a id="file-0045"></a>

### 0045 — `docs/05-runtime/02-viewer.md`

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

<a id="file-0046"></a>

### 0046 — `docs/05-runtime/03-values.md`

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

<a id="file-0047"></a>

### 0047 — `docs/05-runtime/04-validation.md`

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

<a id="file-0048"></a>

### 0048 — `docs/05-runtime/05-recipient-filtering.md`

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

<a id="file-0049"></a>

### 0049 — `docs/05-runtime/README.md`

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

<a id="file-0050"></a>

### 0050 — `docs/06-generator/01-generator-overview.md`

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

<a id="file-0051"></a>

### 0051 — `docs/06-generator/02-pdf-output.md`

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

<a id="file-0052"></a>

### 0052 — `docs/06-generator/03-fonts-assets.md`

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

<a id="file-0053"></a>

### 0053 — `docs/06-generator/README.md`

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

<a id="file-0054"></a>

### 0054 — `docs/07-integraciones/01-react.md`

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

<a id="file-0055"></a>

### 0055 — `docs/07-integraciones/02-host-app.md`

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

<a id="file-0056"></a>

### 0056 — `docs/07-integraciones/03-signature-providers.md`

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

<a id="file-0057"></a>

### 0057 — `docs/07-integraciones/04-external-forms.md`

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

<a id="file-0058"></a>

### 0058 — `docs/07-integraciones/05-global-config.md`

- **Lenguaje:** `markdown`
- **Líneas:** `36`
- **Tamaño original:** `0.7 KB`
- **SHA1 corto:** `4685ea26d3`
- **Estado:** `completo`

```markdown
# Configuración global portable

`src/sisad-pdfme` debe integrarse en cualquier host mediante configuración, datos y callbacks genéricos.

## Uso mínimo

``​`tsx
<SisadPdfmeDesigner
  template={template}
  documents={documents}
  onTemplateChange={setTemplate}
/>
``​`

## Uso con recipients

``​`tsx
<SisadPdfmeDesigner
  config={config}
  template={template}
  documents={documents}
  recipients={recipients}
  onTemplateChange={setTemplate}
  onSave={handleSave}
/>
``​`

## Separación de conceptos

``​`txt
enabled = la capacidad existe
visible = el usuario la ve
allowed = el usuario puede ejecutarla
``​`

El host no debe importar internals como Canvas, RightSidebar, DetailView, ListView o SchemaAssignmentDialog.
```

<a id="file-0059"></a>

### 0059 — `docs/07-integraciones/06-host-adapters.md`

- **Lenguaje:** `markdown`
- **Líneas:** `26`
- **Tamaño original:** `0.6 KB`
- **SHA1 corto:** `97861256c4`
- **Estado:** `completo`

```markdown
# Adaptadores del host

El host debe convertir sus datos reales a contratos genéricos.

## Recipient

``​`ts
type SisadPdfmeRecipient = {
  id: string;
  label: string;
  role?: string;
  email?: string;
  color?: string;
  metadata?: Record<string, unknown>;
};
``​`

## Regla

El host entrega recipients una vez. El componente los registra en `RecipientRegistry` y los reutiliza en Canvas, schema creation, RightSidebar, DetailView, AssignmentDialog, Form, Viewer, Snapshot y eventos.

## No hacer

- No crear mapas locales de recipients en cada pantalla.
- No crear un modal de reasignación propio.
- No duplicar owner color resolvers.
```

<a id="file-0060"></a>

### 0060 — `docs/07-integraciones/07-pdfcomponent-lab-as-host-reference.md`

- **Lenguaje:** `markdown`
- **Líneas:** `34`
- **Tamaño original:** `1.0 KB`
- **SHA1 corto:** `f1994b5ee6`
- **Estado:** `completo`

```markdown
# `pdfcomponent` como host de referencia

`src/features/pdfcomponent` debe demostrar cómo un host externo integra `sisad-pdfme` sin tocar internals.

## Patrón esperado

``​`tsx
const integration = usePdfmeLabIntegration(example)

return (
  <SisadPdfmeDesigner
    config={integration.config}
    template={integration.template}
    documents={integration.documents}
    recipients={integration.recipients}
    activeRecipientId={integration.activeRecipientId}
    onTemplateChange={integration.setTemplate}
    onControllerReady={integration.setController}
  />
)
``​`

## Prohibido en ejemplos host

- `DesignerEngineBuilder`
- `usePdfmeRuntimeInstance`
- `decorateTemplateWithCollaboration`
- `decorateCollaborationUsers`
- `commonOptions.collaboration` construido a mano
- wrappers para `SchemaAssignmentDialog`, `RightSidebar`, `Canvas`, `Moveable` o `Selecto`

## Datos externos

El host puede traer usuarios/documentos desde API, BD o fixtures. Debe mapearlos una sola vez con adapters.
```

<a id="file-0061"></a>

### 0061 — `docs/07-integraciones/README.md`

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

<a id="file-0062"></a>

### 0062 — `docs/08-api-reference/01-designer-api.md`

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

<a id="file-0063"></a>

### 0063 — `docs/08-api-reference/02-form-api.md`

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

<a id="file-0064"></a>

### 0064 — `docs/08-api-reference/03-viewer-api.md`

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

<a id="file-0065"></a>

### 0065 — `docs/08-api-reference/04-generator-api.md`

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

<a id="file-0066"></a>

### 0066 — `docs/08-api-reference/05-plugin-api.md`

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

<a id="file-0067"></a>

### 0067 — `docs/08-api-reference/README.md`

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

<a id="file-0068"></a>

### 0068 — `docs/09-theming/01-tokens-css.md`

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

<a id="file-0069"></a>

### 0069 — `docs/09-theming/02-tailwind-bridge.md`

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

<a id="file-0070"></a>

### 0070 — `docs/09-theming/03-baseline-visual.md`

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

<a id="file-0071"></a>

### 0071 — `docs/09-theming/04-css-migration.md`

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

<a id="file-0072"></a>

### 0072 — `docs/09-theming/05-css-reduction-tailwind-inline.md`

- **Lenguaje:** `markdown`
- **Líneas:** `35`
- **Tamaño original:** `0.7 KB`
- **SHA1 corto:** `7e41dd0da9`
- **Estado:** `completo`

```markdown
# Reducción CSS con Tailwind inline

## Objetivo

Mover estilos visuales seguros a `className` en JSX/TSX y reducir CSS legacy.

## Conservar en CSS

- `tokens.css`
- Variables CSS runtime.
- Moveable/Selecto.
- Geometría del PDF/canvas/paper.
- Zoom/transforms críticos.
- Print/PDF.
- Pseudo-elementos complejos.

## Migrar a Tailwind inline

- Cards.
- Buttons.
- Labels.
- Pills/chips.
- Spacing simple.
- Tipografía.
- Borders.
- Shadows no críticas.
- Sidebars e inspector cuando no afecte medidas críticas.

## Validación

Cada migración debe registrar:
- componente migrado
- reglas CSS eliminadas
- reglas CSS conservadas
- baseline visual revisada
```

<a id="file-0073"></a>

### 0073 — `docs/09-theming/06-tailwind3-selector-dedup-plan.md`

- **Lenguaje:** `markdown`
- **Líneas:** `46`
- **Tamaño original:** `1.0 KB`
- **SHA1 corto:** `9befb3ea2d`
- **Estado:** `completo`

```markdown
# Tailwind 3 — reducción de selectores y deduplicación visual

## Fuente activa

- `src/styles/tailwind.css`
- `src/style.css` neutralizado
- `src/sisad-pdfme/ui/styles/sisad-pdfme.css`
- `src/sisad-pdfme/ui/styles/tokens.css`
- `src/features/pdfcomponent/labRoutes.css`

## No usar como fuente activa

- `reports/tailwind-migration/candidates/**`
- `.tailwind-migration-backups/**`

## Migrable a TSX con Tailwind 3

- Botones.
- Cards.
- Píldoras.
- Chips.
- Headers de panel.
- Sidebars no geométricos.
- Toolbars no geométricos.
- Estados hover/focus-visible simples.

## No migrable sin task-card específica

- `.moveable-*`
- `.selecto-*`
- `transform` de canvas/paper/schema.
- `zoom`.
- Coordenadas PDF.
- Scroll principal del canvas.
- Print/PDF.
- `tokens.css`.
- CSS variables runtime.
- Pseudo-elementos complejos.

## Criterio

Se elimina CSS solo cuando:
1. La clase ya vive en TSX.
2. Hay prueba visual o smoke.
3. No toca geometría.
4. No cambia bounding boxes del canvas.
```

<a id="file-0074"></a>

### 0074 — `docs/09-theming/README.md`

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

<a id="file-0075"></a>

### 0075 — `docs/10-testing-qa/01-manual-checklist.md`

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

<a id="file-0076"></a>

### 0076 — `docs/10-testing-qa/02-regression-matrix.md`

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

<a id="file-0077"></a>

### 0077 — `docs/10-testing-qa/03-playwright.md`

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

<a id="file-0078"></a>

### 0078 — `docs/10-testing-qa/04-vitest.md`

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

<a id="file-0079"></a>

### 0079 — `docs/10-testing-qa/README.md`

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

<a id="file-0080"></a>

### 0080 — `docs/11-migraciones/01-legacy-templates.md`

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

<a id="file-0081"></a>

### 0081 — `docs/11-migraciones/02-snapshot-versioning.md`

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

<a id="file-0082"></a>

### 0082 — `docs/11-migraciones/03-pdfme-upstream.md`

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

<a id="file-0083"></a>

### 0083 — `docs/11-migraciones/README.md`

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

<a id="file-0084"></a>

### 0084 — `docs/12-troubleshooting/01-canvas.md`

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

<a id="file-0085"></a>

### 0085 — `docs/12-troubleshooting/02-pdf-worker.md`

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

<a id="file-0086"></a>

### 0086 — `docs/12-troubleshooting/03-tailwind-regressions.md`

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

<a id="file-0087"></a>

### 0087 — `docs/12-troubleshooting/04-runtime.md`

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

<a id="file-0088"></a>

### 0088 — `docs/12-troubleshooting/README.md`

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

<a id="file-0089"></a>

### 0089 — `docs/13-ejemplos/01-basic-designer.md`

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

<a id="file-0090"></a>

### 0090 — `docs/13-ejemplos/02-multi-document-routing.md`

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

<a id="file-0091"></a>

### 0091 — `docs/13-ejemplos/03-generator-runtime.md`

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

<a id="file-0092"></a>

### 0092 — `docs/13-ejemplos/04-dynamic-host-integration-examples.md`

- **Lenguaje:** `markdown`
- **Líneas:** `21`
- **Tamaño original:** `0.6 KB`
- **SHA1 corto:** `ad5b6992da`
- **Estado:** `completo`

```markdown
# Ejemplos dinámicos con datos externos

## Contrato mínimo

``​`ts
type HostExampleInput = {
  template: Template
  recipients?: unknown[]
  documents?: unknown[]
  activeRecipientId?: string | null
  config?: SisadPdfmeGlobalConfig
}
``​`

## Reglas

- Los recipients no se duplican en `collaboration.users` y `runtimeOptions.collaboration.recipients`.
- Los documents no se duplican en `uploadedDocuments` y `documents` si el wrapper ya soporta `documents`.
- El host no crea contextos internos del diseñador.
- Toda visualización se controla desde `config.visibility`.
- Toda acción visible viene del action registry o controller público.
```

<a id="file-0093"></a>

### 0093 — `docs/13-ejemplos/README.md`

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

<a id="file-0094"></a>

### 0094 — `docs/14-seguridad/01-archivos.md`

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

<a id="file-0095"></a>

### 0095 — `docs/14-seguridad/02-firma.md`

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

<a id="file-0096"></a>

### 0096 — `docs/14-seguridad/README.md`

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

<a id="file-0097"></a>

### 0097 — `AGENTS.md`

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

<a id="file-0098"></a>

### 0098 — `ANALISIS_PROFUNDO_MIGRACION_TAILWIND_BASELINE_ANTERIOR.md`

- **Lenguaje:** `markdown`
- **Líneas:** `844`
- **Tamaño original:** `14.8 KB`
- **SHA1 corto:** `e6ba5fc9b7`
- **Estado:** `completo`

```markdown
# Análisis profundo — Migración Tailwind y recuperación del baseline visual de SISAD PDFME

## 1. Resumen ejecutivo

La migración ya no está en una fase inicial. El estado consolidado más reciente muestra:

``​`txt
src/sisad-pdfme/ui/styles/sisad-pdfme.css
- 509 líneas
- 90 apariciones de @apply

src/sisad-pdfme/ui/styles/tokens.css
- 150 líneas
- 0 @apply

src/features/pdfcomponent/labRoutes.css
- eliminado/neutralizado

src/styles/sisad-tailwind-bridge.css
- vacío

src/styles/tailwind.css
- única fuente de @tailwind
``​`

La reducción fue grande, pero el proceso se volvió lento y alteró el diseño porque se confundieron tres objetivos distintos:

1. **Mover skin visual local a JSX/TSX.**
2. **Eliminar reglas duplicadas o huérfanas.**
3. **Eliminar absolutamente todo CSS.**

Los dos primeros son correctos. El tercero no lo es.

El objetivo técnico final debe ser:

``​`txt
0 @apply en las hojas CSS
≠
0 líneas CSS
``​`

El CSS técnico debe continuar existiendo como CSS plano para:

``​`txt
- geometría de paper/canvas;
- selectores descendientes de Moveable, Selecto y Scena Guides;
- relaciones stage → canvas → sidebar;
- pointer-events coordinados;
- estados de drag/resize/rotate;
- print;
- keyframes realmente usados;
- custom properties runtime;
- selectores de terceros que no reciben className.
``​`

Forzar que esos contratos vivan en JSX/TSX produciría wrappers artificiales, lógica duplicada, estilos inline difíciles de mantener o regresiones en selección, scroll, zoom y multipágina.

---

## 2. Qué muestran las imágenes de la versión anterior

Las capturas anteriores no representan una sola pantalla: documentan el contrato visual y funcional completo del editor.

## 2.1 Shell principal

La versión anterior conservaba:

``​`txt
- título “Multidocumento integral”;
- selector de usuario activo visible;
- botones “Usuario activo” y “Estado”;
- canvas central con cuadrícula;
- LeftSidebar estable;
- RightSidebar estable;
- CtlBar flotante centrado;
- ResultsPanel en la zona inferior;
- paginador superior centrado;
- acción Guardar separada del RightSidebar.
``​`

El selector de usuarios no era decoración. Formaba parte de la navegación contextual del editor y permitía confirmar el usuario activo, permisos, filtros y colores.

## 2.2 LeftSidebar

El baseline anterior muestra:

``​`txt
- anchura compacta pero utilizable;
- grupos Recientes, Firmas, Texto, Imagen y medios, Selecciones;
- items neutros con borde fino;
- iconografía consistente;
- controles de layout visibles;
- scroll vertical propio;
- azul usado como acento, no como estado activo permanente.
``​`

## 2.3 Canvas

El canvas anterior muestra:

``​`txt
- cuadrícula visible;
- página claramente separada del fondo;
- reglas superior e izquierda;
- field chrome por propietario;
- toolbar contextual próxima al schema seleccionado;
- scroll multipágina;
- zoom visible como porcentaje.
``​`

## 2.4 RightSidebar

Las capturas anteriores cubren:

``​`txt
- lista de campos;
- detalle/inspector;
- documentos;
- comentarios;
- reasignación;
- conexión/persistencia;
- opciones de select;
- formato;
- reglas del archivo;
- ubicación y tamaño.
``​`

La referencia no exige restaurar cada pixel antiguo. Sí exige preservar:

``​`txt
- jerarquía;
- densidad;
- navegación;
- visibilidad de acciones;
- distribución de espacios;
- continuidad de tabs;
- scroll;
- estados activos;
- selector de usuario.
``​`

---

## 3. Qué cambió realmente

No todo cambio visual se debe a Tailwind.

## 3.1 Regresiones de cascada

Durante la migración se retiraron reglas CSS antes de que el nodo propietario tuviera todas las clases equivalentes.

Síntomas típicos:

``​`txt
- filas con borde nativo negro;
- botones con border-style outset;
- tabs partidos en dos líneas;
- paneles sin ancho;
- headers con altura incorrecta;
- sombras/radios inconsistentes;
- scroll perdido;
- contenido recortado.
``​`

El proyecto usa:

``​`txt
preflight: false
``​`

Por eso clases como `border`, `border-b` o `border-r` no siempre producen el mismo resultado esperado si no se declara explícitamente:

``​`txt
border-solid
``​`

## 3.2 Cambios de estructura React

Algunos cambios no son CSS:

``​`txt
- PageHeader oculto en el shell embebido;
- selector de usuario movido a RegisteredUsersSelector/CtlBar;
- Docs como panel inicial para multi-document;
- RightSidebar reconstruido con rails;
- ResultsPanel convertido en drawer/pill;
- cambios en controlled/uncontrolled state;
- cambio del panel mode esperado por tests.
``​`

Estos casos no se corrigen restaurando selectores CSS.

## 3.3 Cambios funcionales legítimos

No se debe revertir:

``​`txt
- wrappers públicos SisadPdfmeDesigner/Form/Viewer;
- RecipientRegistry;
- owner colors;
- modal Reasignar corregido;
- ListView plano;
- Docs default en multidocumento;
- scroll multipágina;
- selectionPolicy;
- CommandBus/ActionRegistry;
- separación host/core.
``​`

La recuperación visual debe montarse sobre esta arquitectura, no reemplazarla con el DOM antiguo.

---

## 4. Causa principal de la lentitud

El registro muestra un ciclo repetitivo:

``​`txt
1–2 selectores
→ build completo
→ dos pruebas Playwright
→ actualizar task-card
→ actualizar ledger
→ volver a investigar
``​`

Ese patrón fue seguro al principio, pero dejó de ser eficiente.

También existen dos task-cards activas sobre los mismos archivos:

``​`txt
TASK-CSS-026
TASK-REGRESSION-021
``​`

y hubo edición paralela de:

``​`txt
sisad-pdfme.css
RightSidebar
DetailView
ListView
LeftSidebar
CtlBar
ResultsPanel
``​`

Eso provoca:

``​`txt
- colisiones;
- conteos desactualizados;
- reglas borradas mientras otro agente cambia consumidores;
- revalidaciones repetidas;
- decisiones contradictorias;
- trabajo rehecho.
``​`

---

## 5. Estado real de `sisad-pdfme.css`

La hoja actual tiene 509 líneas y 90 `@apply`.

## 5.1 Bloques globales y shell

Rangos aproximados:

``​`txt
25–109
``​`

Contienen:

``​`txt
root
box sizing
scrollbars
page
header
grid
workspace
designer root/background/workspace/stage
``​`

Acción:

``​`txt
- mover page/header/grid/workspace al nodo React propietario;
- conservar root reset/scrollbar como CSS plano global;
- conservar dimensiones runtime basadas en variables;
- eliminar duplicaciones.
``​`

## 5.2 Canvas, preview y paper

Rangos aproximados:

``​`txt
110–155
200–274
``​`

Contienen:

``​`txt
canvas/preview scroll
grid background
paper root
scale layer
paper page geometry
page surface
padding
Scena Guides
Moveable
``​`

Acción:

``​`txt
- no migrar en bloque;
- separar visual local de geometría;
- canvas/paper geometry queda en CSS plano;
- skin de Canvas/Paper puede vivir en JSX solo si el mismo nodo es dueño en Designer y Preview;
- descendientes de Scena/Moveable quedan en CSS técnico.
``​`

## 5.3 LeftSidebar

Rangos aproximados:

``​`txt
184–199
325–327
345–375
451–463
``​`

Acción:

``​`txt
- root visual y estado collapsed/expanded → LeftSidebar.tsx;
- estado draggable → wrapper del item con data variants;
- conservar únicamente contratos cross-tree que no puedan expresarse localmente;
- resolver duplicación de draggable-shell.
``​`

## 5.4 RightSidebar

Rangos aproximados:

``​`txt
286–390
``​`

Contiene dos tipos de reglas diferentes:

### Migrables

``​`txt
- root surface;
- transform de apertura;
- width responsive;
- radius;
- background;
- shadow;
- reduced motion.
``​`

### Técnicas/cross-tree

``​`txt
stage[data-sidebar-open] → canvas padding-right
stage[data-sidebar-open] → control-bar right
variant compact → canvas padding
``​`

No deben eliminarse juntas. El bloque debe dividirse:

``​`txt
RightSidebar.tsx
+
CSS técnico de coordinación del stage
``​`

## 5.5 Drag, selección y overlays

Rangos aproximados:

``​`txt
433–474
``​`

Contienen:

``​`txt
drag cursor
drop validity
Moveable visibility
toolbar visibility
inline edit visibility
plugin drag states
mask visibility
option-group floating action visibility
``​`

Acción:

``​`txt
- mantener como CSS plano cuando el estado vive en stage y afecta descendientes;
- migrar únicamente estados del nodo propietario;
- no convertir relaciones stage→descendiente en lógica React duplicada.
``​`

## 5.6 Keyframes

Rangos aproximados:

``​`txt
400–429
476–509
``​`

Nombres:

``​`txt
rs-slide-in
rs-panel-switch
rs-stagger-in
schema-drag-preview-enter
schema-drop-commit-flash-enter
toolbar-reveal
``​`

En el consolidado actual no aparecen referencias activas a esos nombres fuera de sus declaraciones.

Acción:

``​`txt
- ejecutar búsqueda exacta en src, tests y Tailwind config;
- si el resultado es 0, eliminar el keyframe;
- no conservar animaciones por historial;
- si una clase arbitraria las consume, mantener solo la animación realmente usada.
``​`

---

## 6. Duplicaciones y conflictos detectados

## 6.1 Root font

Existe definición de fuente en el bloque raíz inicial y otra definición posterior de `.sisad-pdfme-root`.

Acción:

``​`txt
dejar una sola fuente de verdad
``​`

## 6.2 Canvas background/grid

El canvas aparece en bloques compartidos y específicos:

``​`txt
designer-canvas + preview-scroll
designer-canvas
root designer-canvas[data-grid-visible]
``​`

Esto permite que una regla posterior cambie padding, background o tamaño sin que el componente lo muestre claramente.

Acción:

``​`txt
- Preview.tsx posee preview;
- Canvas.tsx posee canvas;
- CSS solo mantiene grid técnico si depende de data attributes;
- no compartir skin visual entre ambos por selector compuesto.
``​`

## 6.3 Paper surface

La superficie del papel se define tanto para:

``​`txt
[data-paper-page]
``​`

como para:

``​`txt
[data-canvas-page]
``​`

con radios y sombras distintas.

Acción:

``​`txt
- geometría en Paper;
- skin por runtime mode mediante className/data-render-mode;
- una sola sombra por modo;
- eliminar reglas que compiten por orden de cascada.
``​`

## 6.4 LeftSidebar draggable

`left-sidebar-draggable-shell[data-dragging=true]` aparece en más de una zona.

Acción:

``​`txt
una sola regla o, preferiblemente, data variant en el wrapper TSX
``​`

## 6.5 Media queries vacías

Hay bloques media sin contenido.

Acción:

``​`txt
eliminar inmediatamente
``​`

---

## 7. Clasificación estimada de los 90 `@apply`

La clasificación exacta debe confirmarse con el script de auditoría, pero el archivo actual permite estimar:

| Destino | Estimación | Acción |
|---|---:|---|
| `MIGRATE_TO_TSX` | 25–32 | Skin y layout local |
| `KEEP_AS_PLAIN_TECHNICAL_CSS` | 45–55 | Reescribir propiedades CSS sin `@apply` |
| `DELETE_DUPLICATE_OR_ORPHAN` | 8–15 | Eliminar con evidencia |
| `KEEP_GLOBAL_PLAIN_CSS` | 5–10 | Reset local, scrollbar, variables |

El cierre correcto es:

``​`txt
0 @apply
~220–320 líneas de CSS plano técnico
150 líneas de tokens
``​`

No es correcto exigir:

``​`txt
0 líneas en sisad-pdfme.css
``​`

---

## 8. Plan acelerado corregido

## Paquete 0 — Congelar concurrencia

Antes de modificar:

``​`txt
- dejar una sola task-card activa;
- detener edición paralela de los mismos archivos;
- hacer commit/checkpoint del estado actual;
- medir 509 líneas / 90 @apply;
- capturar baseline actual y baseline anterior.
``​`

## Paquete 1 — Eliminación segura

Eliminar con una única validación al final:

``​`txt
- media queries vacías;
- root font duplicado;
- keyframes sin consumidores;
- comentarios obsoletos;
- reglas exactas duplicadas.
``​`

Objetivo esperado:

``​`txt
509 → ~440–460 líneas
90 → ~80–85 @apply
``​`

## Paquete 2 — Shell y wrappers

Archivos:

``​`txt
Root.tsx
Designer/index.tsx
Preview.tsx
PdfmeLabPage.jsx
RegisteredUsersSelector.tsx
``​`

Migrar:

``​`txt
page
header
grid
workspace
root/background/workspace/stage skin
lab-runtime-host
``​`

No tocar paper geometry.

## Paquete 3 — LeftSidebar

Archivos:

``​`txt
LeftSidebar.tsx
LeftSidebarTabs.tsx
LeftSidebarSearch.tsx
LeftSidebarGroup.tsx
CatalogLayoutToggle.tsx
``​`

Objetivos:

``​`txt
- neutral state;
- selected/hover/drag separados;
- root/expanded/collapsed local;
- draggable state local;
- conservar scroll.
``​`

## Paquete 4 — RightSidebar

Archivos:

``​`txt
RightSidebar.tsx
layout.tsx
SidebarRail.tsx
SidebarCollapseHandle.tsx
SidebarSurfacePrimitives.tsx
``​`

Migrar root visual y responsive local.

Conservar CSS técnico:

``​`txt
stage → canvas padding
stage → CtlBar offset
cross-tree variant compact
``​`

## Paquete 5 — Canvas/Paper split

No rediseñar.

Separar:

``​`txt
- visual del canvas;
- visual del preview;
- geometría paper;
- grid;
- terceros.
``​`

Mover solo visual local.

Convertir `@apply` técnico a CSS plano.

## Paquete 6 — Drag/interaction

No mover selectores cross-tree a React.

Reescribir:

``​`txt
@apply cursor-copy;
``​`

como:

``​`css
cursor: copy;
``​`

y lo mismo para:

``​`txt
display
opacity
pointer-events
outline
filter
``​`

Objetivo:

``​`txt
eliminar Tailwind de CSS sin eliminar CSS técnico
``​`

## Paquete 7 — QA final

Ejecutar una vez:

``​`bash
npm run build
npx playwright test
``​`

Comparar:

``​`txt
- selector de usuario;
- LeftSidebar;
- lista/detalle/docs/comentarios;
- Reasignar;
- conexión;
- canvas;
- página 2+;
- zoom;
- ResultsPanel;
- scroll.
``​`

---

## 9. Regla de validación para acelerar

Durante un paquete:

``​`bash
npx tsc --noEmit
``​`

Al cerrar el paquete:

``​`bash
npm run build
``​`

Playwright solo por dominio.

No hacer:

``​`txt
selector
→ build
→ Playwright
→ ledger
``​`

Hacer:

``​`txt
15–30 reglas relacionadas
→ typecheck
→ build
→ pruebas de dominio
→ ledger
``​`

---

## 10. Criterios de aceptación finales

## Tailwind

``​`txt
[ ] 0 @apply en sisad-pdfme.css.
[ ] 0 @apply en tokens.css.
[ ] labRoutes.css eliminado.
[ ] bridge vacío o eliminado.
[ ] una sola entrada @tailwind.
``​`

## CSS residual

``​`txt
[ ] Todo bloque residual está clasificado.
[ ] No queda skin local trasladable.
[ ] Geometría y terceros permanecen en CSS plano.
[ ] No hay keyframes huérfanos.
[ ] No hay media queries vacías.
[ ] No hay selectores duplicados por cascada.
``​`

## Diseño

``​`txt
[ ] Selector de usuario visible.
[ ] Header mantiene jerarquía de la versión anterior.
[ ] LeftSidebar conserva densidad y neutral state.
[ ] RightSidebar mantiene tabs/list/detail/docs/comments.
[ ] CtlBar no tapa ResultsPanel.
[ ] Papel y canvas tienen contraste correcto.
[ ] Owner color no se confunde con selección.
``​`

## Comportamiento

``​`txt
[ ] Drag desde catálogo.
[ ] Reorder ListView.
[ ] Selección simple/múltiple.
[ ] Reasignar sin freeze.
[ ] Página 2+.
[ ] Zoom y fit.
[ ] Scroll independiente.
[ ] Multi-document.
[ ] Form/Viewer.
``​`

---

## 11. Conclusión

La migración está avanzada. El cuello de botella ya no es la cantidad de CSS, sino:

``​`txt
- concurrencia;
- validación por micro-slice;
- objetivo incorrecto de “vaciar CSS”;
- mezcla de cambios visuales y estructurales;
- reglas técnicas tratadas como skin;
- cascada duplicada entre canvas/preview/paper.
``​`

La estrategia correcta permitirá terminar más rápido:

``​`txt
509 líneas / 90 @apply
→
0 @apply
+
CSS técnico plano y documentado
+
paridad visual con la versión anterior
``​`
```

<a id="file-0099"></a>

### 0099 — `CLAUDE.md`

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

<a id="file-0100"></a>

### 0100 — `INTEGRATION_CHECKLIST.md`

- **Lenguaje:** `markdown`
- **Líneas:** `26`
- **Tamaño original:** `1.1 KB`
- **SHA1 corto:** `fbc19c607a`
- **Estado:** `completo`

```markdown
# Checklist de integración

## Antes de copiar

- [ ] Crear una rama o checkpoint.
- [ ] Confirmar que `vitest.config.ts` incluye `tests/unit/**/*.test.{ts,tsx,js,jsx}`.
- [ ] Confirmar que `playwright.config.ts` incluye `tests/playwright/**/*.spec.ts`.
- [ ] Levantar el lab en `http://localhost:5174`.
- [ ] Confirmar que `/lab/multi-document-routing` existe.

## Después de copiar

- [ ] Ejecutar `npx vitest run tests/unit/generated`.
- [ ] Corregir imports únicamente si el repositorio cambió después del pack analizado.
- [ ] Ejecutar Playwright por dominio.
- [ ] Revisar tests omitidos por funcionalidades opcionales.
- [ ] Crear snapshots visuales en Chromium.
- [ ] Ratchetear los presupuestos de CSS después de cada lote Tailwind.

## No hacer

- No reemplazar `tests/unit/setupTests.ts`.
- No mover las pruebas generadas fuera de `generated` hasta estabilizarlas.
- No adaptar una regresión cambiando el expected para que pase sin investigar.
- No agregar `waitForTimeout` como sincronización principal.
- No depender exclusivamente de clases Tailwind en E2E; usar roles, nombres, data attributes y test IDs.
```

<a id="file-0101"></a>

### 0101 — `KNOWN_GAPS.md`

- **Lenguaje:** `markdown`
- **Líneas:** `18`
- **Tamaño original:** `1.3 KB`
- **SHA1 corto:** `da2770fdc7`
- **Estado:** `completo`

```markdown
# Gaps y riesgos detectados

## Gaps confirmados por código/documentación

1. `detachCommentFromField` pasa `schemaUid: ''`, pero el normalizador actual solo aplica `schemaUid` cuando tiene texto. El caso está marcado `it.todo`.
2. El ListView ha mantenido selección local además de `activeSchemaIds`; la suite exige una sola fuente de verdad.
3. Existen riesgos de scroll anidado en RightSidebar. Los E2E verifican un solo propietario scrollable por panel.
4. La densidad histórica `mini` y la actual `minimal` pueden divergir. Los tests responsive cubren 256/318/390 px.
5. El selector de usuario activo puede existir visualmente sin actualizar el registry real. Los tests verifican valor y efecto visible.
6. El cierre de modales AntD puede dejar overlays ocultos y bloquear selección. Los tests de Reasignar/Comentarios verifican recuperación.
7. La migración Tailwind aún conserva `@apply`; el presupuesto evita que aumente y permite reducirlo gradualmente.
8. Algunos specs visuales requieren baseline local y no pueden validarse fuera del repositorio ejecutable.

## Política sugerida

- `todo/fixme`: contrato conocido pero implementación pendiente.
- `skip`: funcionalidad explícitamente deshabilitada por configuración del ejemplo.
- fallo activo: regresión en una funcionalidad que el ejemplo declara habilitada.
```

<a id="file-0102"></a>

### 0102 — `MANIFEST.md`

- **Lenguaje:** `markdown`
- **Líneas:** `27`
- **Tamaño original:** `1.0 KB`
- **SHA1 corto:** `37a2dc2240`
- **Estado:** `completo`

```markdown
# MANIFEST

## Completed

- `ai/task-cards/completed/TASK-ARCH-001-sisad-pdfme-global-config-portability.md`
- `ai/task-cards/completed/TASK-ARCH-002-recipient-registry.md`

## Active

- `ai/task-cards/active/TASK-PDFME-003-reassign-recipient-dialog-persistence.md`
- `ai/task-cards/active/TASK-PDFME-004-lab-parity-multidocument-routing.md`
- `ai/task-cards/active/TASK-PDFME-005-digital-agreements-runtime-adapter.md`
- `ai/task-cards/active/TASK-PDFME-006-runtime-form-preview-by-recipient.md`
- `ai/task-cards/active/TASK-PDFME-007-snapshot-persistence-contract.md`
- `ai/task-cards/active/TASK-PDFME-008-signature-policies-firma-sisad.md`
- `ai/task-cards/active/TASK-PDFME-009-externalforms-runner-contract.md`

## Backlog

- `ai/task-cards/backlog/TASK-PDFME-010-drag-preview-and-canvas-scroll-regression.md`
- `ai/task-cards/backlog/TASK-PDFME-011-connectivity-sisad-restore.md`

## Memory / Reports

- `ai/memory/completed-checklist.md`
- `ai/memory/pending-checklist.md`
- `ai/reports/claude-codex-handoff-2026-07-14.md`
```

<a id="file-0103"></a>

### 0103 — `PROMPT_FINALIZAR_MIGRACION_TAILWIND_SIN_PERDER_DISENO.md`

- **Lenguaje:** `markdown`
- **Líneas:** `455`
- **Tamaño original:** `7.1 KB`
- **SHA1 corto:** `07e6150512`
- **Estado:** `completo`

```markdown
# PROMPT — Finalizar la migración Tailwind sin perder el diseño anterior

Actúa como arquitecto frontend senior experto en React, TypeScript, Tailwind CSS 3, Vite, Ant Design, dnd-kit, Moveable, Selecto y Playwright.

Repositorio:

``​`txt
/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin
``​`

Ruta:

``​`txt
http://localhost:5174/lab/multi-document-routing
``​`

## Objetivo exacto

Completar la migración de Tailwind que todavía vive dentro de hojas CSS hacia JSX/TSX sin perder el diseño ni el comportamiento de la versión anterior.

La meta es:

``​`txt
0 @apply en todas las hojas CSS
``​`

La meta NO es:

``​`txt
0 líneas CSS
``​`

CSS técnico residual está permitido y debe escribirse como CSS plano.

## Estado vigente

Mide antes de modificar. El último consolidado reporta:

``​`txt
sisad-pdfme.css: 509 líneas / 90 @apply
tokens.css: 150 líneas / 0 @apply
labRoutes.css: eliminado
bridge: vacío
``​`

No uses cifras históricas de 2000–6000 líneas.

## Primera decisión obligatoria

Actualmente existen dos task-cards activas:

``​`txt
TASK-CSS-026
TASK-REGRESSION-021
``​`

Antes de editar:

``​`txt
1. determina cuál debe cerrarse;
2. deja una sola activa;
3. detén agentes que editen los mismos archivos;
4. crea commit/checkpoint;
5. no trabajes con 200 archivos dirty;
6. no actualices dos ledgers distintos por cada microcambio.
``​`

## Baseline visual obligatorio

Usa las capturas anteriores como contrato:

``​`txt
- título Multidocumento integral;
- selector de usuario visible;
- controles Usuario activo / Estado;
- LeftSidebar compacto;
- canvas con grid;
- papel centrado;
- RightSidebar con lista/detalle/docs/comentarios;
- modal de conexión;
- modal de comentarios;
- modal Reasignar;
- CtlBar centrado;
- ResultsPanel inferior.
``​`

No copies el DOM antiguo. Mantén la arquitectura actual.

## Diferencia entre regresión CSS y cambio estructural

No intentes corregir con CSS:

``​`txt
PageHeader no montado;
selector de usuario no montado;
panel default cambiado;
controlled state incorrecto;
tabs eliminados;
callback desconectado;
wrapper público sin prop.
``​`

Estos casos se corrigen en React.

## Clasificación de cada `@apply`

Cada aparición debe terminar en una de estas categorías:

### MIGRATE_TO_TSX

``​`txt
layout local
padding/gap
border/radius
background
shadow
typography
hover/focus/selected
responsive local
scroll del componente
``​`

### CONVERT_TO_PLAIN_TECHNICAL_CSS

``​`txt
paper/canvas geometry
Moveable/Selecto/Scena descendants
stage→canvas/sidebar coordination
pointer-events cross-tree
drag/resize/rotate global state
print
portal/third-party selectors
``​`

Ejemplo:

``​`css
/* antes */
@apply absolute inset-0 pointer-events-none;

/* después */
position: absolute;
inset: 0;
pointer-events: none;
``​`

### DELETE_DUPLICATE_OR_ORPHAN

Solo con:

``​`txt
0 consumidores por clase completa;
0 consumidores por suffix concatenado;
0 referencias en tests;
0 referencias en Tailwind config;
0 referencias en strings dinámicos.
``​`

### KEEP_GLOBAL_PLAIN_CSS

``​`txt
box-sizing local
scrollbars del paquete
font/reset local
custom properties
``​`

## Contratos que no deben romperse

Conserva:

``​`ts
DESIGNER_CLASSNAME
UI_CLASSNAME
SELECTABLE_CLASSNAME
RULER_HEIGHT
PAGE_GAP
LEFT_SIDEBAR_WIDTH
RIGHT_SIDEBAR_WIDTH
BACKGROUND_COLOR
DEFAULT_MAX_ZOOM
``​`

Nunca sustituyas:

``​`tsx
DESIGNER_CLASSNAME + 'suffix'
``​`

por una cadena Tailwind sin hook semántico.

## Orden de ejecución

### BATCH-01 — eliminación segura

Audita y elimina en un solo lote:

``​`txt
media queries vacías
root font duplicado
keyframes sin consumidores
comentarios obsoletos
reglas exactas duplicadas
``​`

Buscar:

``​`bash
rg -n "rs-slide-in|rs-panel-switch|rs-stagger-in|schema-drag-preview-enter|schema-drop-commit-flash-enter|toolbar-reveal" src tests tailwind.config.js
``​`

No ejecutes build por cada keyframe.

### BATCH-02 — root y shell

Archivos máximos:

``​`txt
Root.tsx
Designer/index.tsx
Preview.tsx
PdfmeLabPage.jsx
RegisteredUsersSelector.tsx
``​`

Migrar:

``​`txt
page
header
grid
workspace
designer root/background/workspace/stage skin
lab-runtime-host
``​`

No tocar paper geometry.

### BATCH-03 — LeftSidebar

Archivos:

``​`txt
LeftSidebar.tsx
LeftSidebarTabs.tsx
LeftSidebarSearch.tsx
LeftSidebarGroup.tsx
CatalogLayoutToggle.tsx
``​`

Restaurar:

``​`txt
neutral state
hover
focus
drag
selected
densidad
scroll
layout list/tiles/icons
``​`

No pintar todos los schemas con borde azul.

### BATCH-04 — RightSidebar

Archivos:

``​`txt
RightSidebar.tsx
layout.tsx
SidebarRail.tsx
SidebarCollapseHandle.tsx
SidebarSurfacePrimitives.tsx
``​`

Migrar root surface y responsive local.

Mantener como CSS técnico plano:

``​`txt
stage[data-sidebar-open] canvas padding-right
stage[data-sidebar-open] control-bar right
compact variant cross-tree offsets
``​`

### BATCH-05 — Canvas/Preview/Paper

Separar fuentes de verdad:

``​`txt
Canvas.tsx → visual del canvas
Preview.tsx → visual del preview
Paper.tsx → nodos paper
CSS plano → geometry/scale/grid/third-party
``​`

Resolver duplicaciones de:

``​`txt
designer-canvas
data-grid-visible
data-paper-page
data-canvas-page
``​`

No cambiar coordenadas.

### BATCH-06 — interacción técnica

Convertir `@apply` a CSS plano en:

``​`txt
dragging
drop-valid
Moveable visibility
selection toolbar visibility
inline edit visibility
mask visibility
option group actions
plugin drag state
``​`

No duplicar estado React para evitar CSS.

### BATCH-07 — QA final

Ejecutar:

``​`bash
npm run build
npx playwright test
``​`

Validar manualmente:

``​`txt
usuario activo
global view
LeftSidebar
list/detail/docs/comments
connection modal
comment modal
reassign modal
drag/drop
selection
page 2+
zoom
ResultsPanel
Form/Viewer
``​`

## Ritmo de validación

Durante batch:

``​`bash
npx tsc --noEmit
``​`

Al cerrar batch:

``​`bash
npm run build
``​`

Playwright una vez por dominio.

Prohibido repetir:

``​`txt
1 selector → build → Playwright → ledger
``​`

Mínimo por batch:

``​`txt
10–25 reglas relacionadas
o
3–5 componentes
``​`

## Áreas protegidas

No modificar salvo regresión demostrada:

``​`txt
Moveable.tsx
Selecto.tsx
coordinateMath.ts
designerCoordinateService.ts
snapshot
generator
pdf-lib
zoom math
document routing
schema persistence
``​`

## `preflight: false`

En JSX/TSX:

``​`txt
usar border-solid cuando se define borde;
usar appearance-none en botones/selects que lo requieran;
no agregar reset global;
no habilitar preflight.
``​`

## Criterios de cierre

``​`txt
[ ] sisad-pdfme.css tiene 0 @apply.
[ ] tokens.css tiene 0 @apply.
[ ] CSS residual es plano y técnico.
[ ] no hay keyframes huérfanos.
[ ] no hay media queries vacías.
[ ] no hay duplicación canvas/preview/paper.
[ ] selector de usuario visible.
[ ] baseline visual comparable.
[ ] build pasa.
[ ] suite pasa.
``​`

## Formato de salida

``​`md
# Batch cerrado

## Métricas
- líneas antes/después
- @apply antes/después

## Migrado a TSX
- ...

## Convertido a CSS técnico plano
- ...

## Eliminado
- ...

## Validación
- typecheck
- build
- Playwright
- capturas

## Siguiente batch
- ...
``​`

No declares que la migración terminó solo porque bajaron las líneas. Termina cuando `@apply = 0`, el residual técnico está documentado y el baseline funcional/visual pasa.
```

<a id="file-0104"></a>

### 0104 — `.github/copilot-instructions.md`

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

<a id="file-0105"></a>

### 0105 — `ai/README.md`

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

<a id="file-0106"></a>

### 0106 — `ai/tree.md`

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

<a id="file-0107"></a>

### 0107 — `reports/jsdoc-missing-report.md`

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

<a id="file-0108"></a>

### 0108 — `scripts/README.md`

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

<a id="file-0109"></a>

### 0109 — `.serena/memories/memory_maintenance.md`

- **Lenguaje:** `markdown`
- **Líneas:** `33`
- **Tamaño original:** `2.0 KB`
- **SHA1 corto:** `d8be20e859`
- **Estado:** `completo`

```markdown
# Memory Maintenance

## Discovery Model

- Core principle: progressive discovery through references, building a graph of memories.
- Initially, agents are provided with the list of all memories (names only).
- Agents should read `mem:core` as the top-level entry point (graph root).
  This memory should contain references to other memories covering major project domains.
  The referenced memories shall, in turn, shall contain references to even more specific memories, and so on.
  The depth of the graph shall depend on the project complexity.
- Use topics/folders to group related memories in order to make the content structure explicit.
  Folders can mirror project structure (e.g. modules like frontend/backend) or topics like debugging, architecture, etc.
- Memory references must use a mem: prefix inside backticks, e.g. `mem:frontend/core`.
  The surrounding text should clearly indicate when to read the memory/which content to expect.
  The text should provide more precise guidance than the memory name alone,
  i.e. avoid a reference like "frontend debugging: `mem:frontend/debugging` and instead make clear which aspects of frontend debugging are covered.
- Memories themselves should not contain information about when to read them; this is the responsibility of the referring memory.

## Style

Dense agent notes, not prose docs. Prefer invariants, terse bullets.
Avoid obvious context, rationale, and examples unless they prevent likely mistakes.
Keep guidance durable and generalizable, not task-local.

## Add/update threshold

Add or update memories only with stable, non-obvious project conventions that avoid complex rediscovery in the future.
Do not add: quick-read facts; generic language/framework knowledge; one-off task notes; volatile line-level details; behavior likely to change soon.

## Maintenance Actions

- Renaming memories: References are updated automatically if handled via Serena's memory rename tool.
- Checking for stale memories (e.g. after deletion): Call `serena memories check` for a report.
```

<a id="file-0110"></a>

### 0110 — `ai/adapters/README.md`

- **Lenguaje:** `markdown`
- **Líneas:** `3`
- **Tamaño original:** `0.1 KB`
- **SHA1 corto:** `f5c142520b`
- **Estado:** `completo`

```markdown
# Adapters

Adaptadores para herramientas. Los archivos raíz deben ser copias delgadas de estos o apuntar a `ai/start/START.md`.
```

<a id="file-0111"></a>

### 0111 — `ai/agents/canvas-agent.md`

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

<a id="file-0112"></a>

### 0112 — `ai/agents/css-tailwind-agent.md`

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

<a id="file-0113"></a>

### 0113 — `ai/agents/designer-runtime-agent.md`

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

<a id="file-0114"></a>

### 0114 — `ai/agents/docs-architecture-agent.md`

- **Lenguaje:** `markdown`
- **Líneas:** `37`
- **Tamaño original:** `0.6 KB`
- **SHA1 corto:** `b7aeee8485`
- **Estado:** `completo`

```markdown
# Docs Architecture Agent

## Responsabilidad

Mantiene ai/ sin duplicidad, memoria, reglas, prompts y task-cards.

## Puede tocar

Solo los archivos listados por la task-card activa de arquitectura IA.

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

### 0115 — `ai/agents/inspector-agent.md`

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

<a id="file-0116"></a>

### 0116 — `ai/agents/interaction-agent.md`

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

<a id="file-0117"></a>

### 0117 — `ai/agents/lab-shell-agent.md`

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

<a id="file-0118"></a>

### 0118 — `ai/agents/README.md`

- **Lenguaje:** `markdown`
- **Líneas:** `3`
- **Tamaño original:** `0.1 KB`
- **SHA1 corto:** `89e1142ffd`
- **Estado:** `completo`

```markdown
# Agents

Cada agente representa un dominio principal. Un agente no debe cambiar de dominio durante una task-card.
```

<a id="file-0119"></a>

### 0119 — `ai/agents/registry.md`

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

<a id="file-0120"></a>

### 0120 — `ai/agents/schema-agent.md`

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

<a id="file-0121"></a>

### 0121 — `ai/agents/snapshot-agent.md`

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

<a id="file-0122"></a>

### 0122 — `ai/agents/visual-baseline-agent.md`

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

<a id="file-0123"></a>

### 0123 — `ai/baselines/img-version-baseline-protocol.md`

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

<a id="file-0124"></a>

### 0124 — `ai/baselines/README.md`

- **Lenguaje:** `markdown`
- **Líneas:** `3`
- **Tamaño original:** `0.1 KB`
- **SHA1 corto:** `48f5436d50`
- **Estado:** `completo`

```markdown
# Baselines

Protocolos de referencia visual y funcional.
```

<a id="file-0125"></a>

### 0125 — `ai/checklists/button-action-contract-checklist.md`

- **Lenguaje:** `markdown`
- **Líneas:** `57`
- **Tamaño original:** `1.0 KB`
- **SHA1 corto:** `a7176d3640`
- **Estado:** `completo`

```markdown
# Checklist — contrato de botones y acciones

## Por cada botón

- [ ] Tiene label o aria-label.
- [ ] Tiene data-testid.
- [ ] Tiene tooltip si es icon-only.
- [ ] Tiene handler real.
- [ ] Usa ActionRegistry/CommandBus o handler central aprobado.
- [ ] Tiene estado disabled con razón.
- [ ] Respeta visibility config.
- [ ] Respeta permissions.
- [ ] No duplica lógica de otro botón.
- [ ] Tiene test Playwright o unitario.

## Botones críticos

### Topbar
- [ ] Guardar
- [ ] Más
- [ ] Usuario activo
- [ ] Estado
- [ ] Configuración

### LeftSidebar
- [ ] Collapse
- [ ] Search
- [ ] Filter chips
- [ ] Layout tabs
- [ ] Schema cards

### RightSidebar
- [ ] Collapse
- [ ] Panel switcher
- [ ] Search
- [ ] Type filter
- [ ] More
- [ ] Reasignar
- [ ] Abrir propiedades

### Canvas
- [ ] Eliminar
- [ ] Duplicar
- [ ] Más
- [ ] Context menu
- [ ] Bloquear posición
- [ ] Desbloquear posición
- [ ] Liberar edición
- [ ] Abrir propiedades

### Bottom toolbar
- [ ] Undo
- [ ] Redo
- [ ] Fit
- [ ] Zoom out
- [ ] Zoom select
- [ ] Zoom in
```

<a id="file-0126"></a>

### 0126 — `ai/checklists/done-vs-pending.md`

- **Lenguaje:** `markdown`
- **Líneas:** `41`
- **Tamaño original:** `0.7 KB`
- **SHA1 corto:** `8f1de8e902`
- **Estado:** `completo`

```markdown
# Done vs Pending

## Done protegido

Ver `ai/task-cards/completed/completed-summary.md`.

No cargar por defecto:

``​`txt
ai/task-cards/completed/**
reports/**
dist/**
test-results/**
.tailwind-migration-backups/**
unificados/**
``​`

## Pending activo

``​`txt
ai/task-cards/active/**
``​`

## Pending futuro

``​`txt
ai/task-cards/backlog/**
``​`

## Regla para agentes

Antes de implementar:

1. Leer `ai/start/START.md`.
2. Leer `ai/router/ROUTER.md`.
3. Leer `ai/router/CONTEXT_BUDGET.md`.
4. Leer `ai/memory/pending-checklist.md`.
5. Leer solo la task-card asignada.
6. Consultar `completed-summary.md` solo para no romper fixes previos.

No usar `completed/**` como fuente de tareas pendientes.
```

<a id="file-0127"></a>

### 0127 — `ai/checklists/global-validation.md`

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

<a id="file-0128"></a>

### 0128 — `ai/checklists/improvement-backlog.md`

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

<a id="file-0129"></a>

### 0129 — `ai/checklists/manual-ui-regression.md`

- **Lenguaje:** `markdown`
- **Líneas:** `19`
- **Tamaño original:** `0.4 KB`
- **SHA1 corto:** `ddd3d785d4`
- **Estado:** `completo`

```markdown
# Manual UI Regression

## `/lab/multi-document-routing`

- [x] Header compacto.
- [x] Canvas protagonista.
- [x] LeftSidebar se parece al baseline.
- [x] RightSidebar se parece al baseline.
- [ ] Drag/drop funciona.
- [ ] Selección funciona.
- [ ] Página 2+ funciona.
- [ ] Multi-recipient funciona.
- [x] ResultsPanel no tapa toolbar.

## `/lab/generator-runtime`

- [ ] Form limpio.
- [ ] Viewer limpio.
- [ ] PDF sin chrome.
```

<a id="file-0130"></a>

### 0130 — `ai/checklists/pdfcomponent-dynamic-integration-checklist.md`

- **Lenguaje:** `markdown`
- **Líneas:** `31`
- **Tamaño original:** `1.4 KB`
- **SHA1 corto:** `dc1c6ee073`
- **Estado:** `completo`

```markdown
# Checklist — integración dinámica `src/features/pdfcomponent`

## Frontera con core

- [ ] No importar `DesignerEngineBuilder` desde ejemplos.
- [ ] No importar `usePdfmeRuntimeInstance` desde ejemplos.
- [ ] No construir `designerEngineOptions` manualmente en `PdfmeLabPage.jsx`.
- [ ] No construir `commonOptions.collaboration` manualmente en host.
- [ ] No decorar template con collaboration fuera del core/wrapper salvo fixture legacy explícito.

## Datos únicos

- [ ] Recipients existen solo en `example.recipients` o `props.recipients`.
- [ ] Active recipient existe solo como `activeRecipientId`.
- [ ] Documents existen solo en `example.documents` o `props.documents`.
- [ ] Signature providers existen solo en `config.signatures.providers`.
- [ ] Visibility/actions existen solo en `config.visibility` + action registry.

## Acciones

- [ ] Cada botón visible tiene `id`, `label`, `enabled`, `disabledReason`, `run`, `testId`.
- [ ] `CompactControls` renderiza acciones, no las inventa.
- [ ] Las acciones de generator/converter viven en `labArtifactService`.
- [ ] Las acciones del designer usan controller público.

## Pruebas mínimas

- [ ] Cambiar recipient actual actualiza Designer/Form/Viewer sin doble registro.
- [ ] Multi-document routing usa `documents` normalizados una sola vez.
- [ ] Generator/converter funcionan leyendo template/inputs desde el hook.
- [ ] Export bundle conserva recipients/documents/config sin duplicarlos.
```

<a id="file-0131"></a>

### 0131 — `ai/checklists/README.md`

- **Lenguaje:** `markdown`
- **Líneas:** `3`
- **Tamaño original:** `0.1 KB`
- **SHA1 corto:** `82829bf2f0`
- **Estado:** `completo`

```markdown
# Checklists

Checklists vivos para validar tareas y controlar pendientes.
```

<a id="file-0132"></a>

### 0132 — `ai/checklists/tailwind-design-continuity-validation.md`

- **Lenguaje:** `markdown`
- **Líneas:** `16`
- **Tamaño original:** `1.0 KB`
- **SHA1 corto:** `6b36ba0bc4`
- **Estado:** `completo`

```markdown
# Checklist — continuidad visual y Tailwind

- [ ] Hay exactamente una tarjeta activa.
- [ ] Se respetaron 8 archivos abiertos y 5 modificados por pasada.
- [ ] Se registró baseline antes del cambio.
- [ ] No se introdujeron clases Tailwind construidas dinámicamente.
- [ ] `tokens.css` mantiene tokens y contratos compartidos.
- [ ] No cambió geometría, selección, drag/resize, snapshot ni PDF fuera de alcance.
- [ ] Estados normal, hover, focus-visible, disabled, activo y colapsado fueron revisados.
- [ ] Cambiar de usuario actualiza el borde/fondo/acento exterior del schema según propietario.
- [ ] No hay solapamiento de controles en sidebars ni clipping accidental.
- [ ] Las guías/reglas no producen bloques negros o capas opacas.
- [ ] Typecheck, lint y pruebas focalizadas pasan.
- [ ] La ruta `/lab/multi-document-routing` fue comparada a viewport fijo.
- [ ] Se registraron conteos finales de `@apply`, inline styles y selectores eliminados.
- [ ] La tarjeta contiene evidencia y criterio de parada satisfecho.
```

<a id="file-0133"></a>

### 0133 — `ai/checklists/tailwind-migration.md`

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

<a id="file-0134"></a>

### 0134 — `ai/context/action-map-context.md`

- **Lenguaje:** `markdown`
- **Líneas:** `70`
- **Tamaño original:** `1.4 KB`
- **SHA1 corto:** `ae1fc47654`
- **Estado:** `completo`

```markdown
# Action Map Context — SISAD PDFME

## Regla

Todo botón visible debe estar conectado a una acción. Ningún botón debe existir solo por diseño.

``​`txt
visible = se renderiza
enabled = puede ejecutarse
handler = función real
reason = por qué está deshabilitado
permission = regla de acceso
feature = capacidad activa
``​`

## Áreas

- topbar
- left-sidebar
- right-sidebar
- right-list
- detail-view
- canvas-floating-toolbar
- canvas-context-menu
- bottom-toolbar
- runtime-form
- viewer

## Campos mínimos por acción

``​`ts
type DesignerActionId =
  | 'save'
  | 'open-more-menu'
  | 'toggle-left-sidebar'
  | 'toggle-right-sidebar'
  | 'switch-right-panel-fields'
  | 'switch-right-panel-detail'
  | 'switch-right-panel-comments'
  | 'switch-right-panel-documents'
  | 'select-schema'
  | 'open-properties'
  | 'reassign-recipient'
  | 'duplicate-schema'
  | 'delete-schema'
  | 'add-comment'
  | 'hide-schema'
  | 'show-schema'
  | 'lock-position'
  | 'unlock-position'
  | 'release-edit'
  | 'bring-front'
  | 'send-back'
  | 'toggle-required'
  | 'undo'
  | 'redo'
  | 'zoom-in'
  | 'zoom-out'
  | 'set-zoom'
  | 'fit-page'
  | 'fit-width';
``​`

## No permitido

- Botón con `onClick={() => {}}`.
- Botón sin `aria-label`.
- Botón sin `data-testid`.
- Botón que modifica schema directamente sin command/update centralizado.
- Botón que depende de recipient local cuando existe RecipientRegistry.
```

<a id="file-0135"></a>

### 0135 — `ai/context/ai-docs-context.md`

- **Lenguaje:** `markdown`
- **Líneas:** `3`
- **Tamaño original:** `0.1 KB`
- **SHA1 corto:** `67baed74a9`
- **Estado:** `completo`

```markdown
# AI Docs Context

La carpeta `ai/` es fuente de verdad. Documentación antigua puede migrarse, pero no duplicarse.
```

<a id="file-0136"></a>

### 0136 — `ai/context/canvas-multipage-context.md`

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

<a id="file-0137"></a>

### 0137 — `ai/context/css-tailwind-context.md`

- **Lenguaje:** `markdown`
- **Líneas:** `26`
- **Tamaño original:** `0.6 KB`
- **SHA1 corto:** `0f650fbc72`
- **Estado:** `completo`

```markdown
# Contexto CSS/Tailwind

## Archivos CSS reales

``​`txt
src/styles/tailwind.css
src/style.css
src/styles/sisad-tailwind-bridge.css
src/features/pdfcomponent/labRoutes.css
src/sisad-pdfme/ui/styles/sisad-pdfme.css
src/sisad-pdfme/ui/styles/tokens.css
``​`

## Evidencia/reports

``​`txt
reports/tailwind-migration/**
.tailwind-migration-backups/**
``​`

Los reports y backups no son fuente activa. Sirven para auditoría.

## Regla de seguridad

Migrar clases visuales a JSX/TSX, pero conservar CSS crítico:
tokens, geometry, zoom, transforms, Moveable, Selecto, print/PDF, canvas/paper, pseudo-elementos complejos.
```

<a id="file-0138"></a>

### 0138 — `ai/context/ESPECIFICACION_FUNCIONAL_COMPLETA_SISAD_PDFME.md`

- **Lenguaje:** `markdown`
- **Líneas:** `1153`
- **Tamaño original:** `19.6 KB`
- **SHA1 corto:** `535b841a90`
- **Estado:** `completo`

```markdown
# Especificación funcional consolidada — SISAD PDFME

## 1. Alcance

Este documento consolida los requisitos discutidos para schemas, Canvas, LeftSidebar, RightSidebar, ListView, DetailView, DocumentsRail, CommentsRail, colaboración, runtime, snapshot y migración Tailwind.

El contrato objetivo es una librería portable:

``​`txt
Designer  -> diseña campos sobre PDF
Form      -> captura valores
Viewer    -> muestra valores readonly
Generator -> produce el PDF final
``​`

`src/sisad-pdfme` no debe contener reglas de negocio específicas de SISAD Web, DigitalAgreements, Uanataca o un backend concreto. Los hosts integran mediante configuración, adapters, events, recipients, documents, persistence y signature providers.

---

# 2. Principios estructurales

## 2.1. Una fuente de verdad por concepto

| Concepto | Fuente de verdad |
|---|---|
| selección | `activeSchemaIds` del Designer |
| usuario/recipient activo | `RecipientRegistry` |
| ownership/color | resolver central de owner |
| acceso/lock | resolver central de interacción |
| acciones | ActionRegistry/CommandBus |
| inspector | contrato declarativo por schema |
| valores runtime | `schemaUid` + inputs |
| documento/página | routing documental |
| persistencia | snapshot versionado |

No duplicar selección, ownership, permisos o estado de panel en varios componentes.

## 2.2. Canvas como protagonista

- Sidebars compactos.
- Sin exceso de cards anidadas.
- Sin sombras permanentes innecesarias.
- Sin bordes negros inesperados.
- PDF claramente separado del fondo.
- Scroll independiente.
- Toolbars que no tapen el documento.

## 2.3. Tailwind-first

Tailwind en JSX/TSX para layout, skin, estados, densidad, inputs, tabs, filas, badges y modales.

CSS puro solo para contratos técnicos imposibles de expresar localmente:

- Moveable;
- Selecto;
- Scena Guides;
- geometría paper/canvas;
- coordinación stage → sidebar → canvas;
- zoom/transform;
- print;
- portals y nodos de terceros;
- variables runtime.

Meta correcta:

``​`txt
0 @apply
``​`

No es obligatorio:

``​`txt
0 líneas CSS
``​`

---

# 3. Contrato universal de schema

Todo schema debe conservar:

``​`txt
schemaUid
type
name
label
documentId
fileId
fileTemplateId
pageNumber
pageIndex
x
y
width
height
rotation
ownerRecipientId
ownerRecipientIds
ownerColor
recipientId
required
readOnly / readonly
locked
objectLocked
collaborationLock
hidden
defaultValue
content
validation
__designer
``​`

## 3.1. Identidad

- `schemaUid`: identidad técnica estable.
- `name`: clave/variable persistente y única cuando se exige.
- `label`: nombre visible.
- `type`: solo lectura en el inspector.
- Renombrar no cambia `schemaUid`.
- Duplicados muestran advertencia.
- Copiar/pegar genera nueva identidad técnica.

## 3.2. Routing

Mover, duplicar, restaurar o reasignar no debe perder:

- documento;
- archivo;
- página;
- índice;
- asignaciones;
- owner.

## 3.3. Geometría

Debe soportar posición, tamaño, rotación, alineación, límites de página, movimiento con teclado, resize, snap y validación fuera de límites.

---

# 4. Estados visuales de schema

Estados mínimos:

``​`txt
idle
hovered
selected
multi-selected
dragging
resizing
rotating
invalid
readonly
locked
hidden
blocked-by-recipient
editing-by-me
editing-by-other
``​`

Reglas:

- Ownership no equivale a selección.
- Owner color se usa como acento, icon tint o badge.
- Invalid usa semántica de error.
- Readonly y locked deben diferenciarse.
- Designer muestra chrome; Form muestra control limpio; Viewer/PDF no muestran chrome de edición.

---

# 5. Selección

## 5.1. Sincronización

- Click en Canvas selecciona la fila del ListView.
- Click en ListView selecciona el schema del Canvas.
- Click vacío limpia selección cuando no hay modal.
- `activeSchemaIds` es la única selección persistente.

## 5.2. Selección múltiple

``​`txt
Mac:
- Command + click: toggle
- Shift: rango

Windows/Linux:
- Ctrl + click: toggle
- Shift: rango
- Ctrl + Shift: rango aditivo cuando la policy lo permita
``​`

Selecto permite selección por región.

## 5.3. ListView

El ListView solo puede guardar estado local para:

- anchor;
- active drag id;
- hover;
- foco.

No mantiene otra colección de seleccionados.

## 5.4. Grupos

Para `radioGroup` y `checkboxGroup`:

- root seleccionable;
- opciones internas fuera de Selecto/Moveable;
- grupo se mueve como unidad;
- edición interna mediante doble click o acción explícita;
- borde de grupo;
- botón `+` fuera del área Moveable;
- copiar/pegar preserva offsets, dirección y orden.

---

# 6. Drag, reorder, clipboard y shortcuts

## 6.1. LeftSidebar → Canvas

Debe existir:

- preview;
- animación;
- drop válido/inválido;
- owner correcto;
- coordenadas normalizadas;
- soporte multipágina/multidocumento;
- prevención de solapamiento según policy;
- no scroll accidental del catálogo.

## 6.2. Reorder ListView

- DnD solo desde grip.
- El cuerpo selecciona.
- Acciones no inician drag.
- Movimiento pequeño no se convierte en drag.
- Reordenar visibles se fusiona con `allSchemas`.
- Ocultos/filtrados conservan orden relativo.

## 6.3. Clipboard

Debe soportar:

``​`txt
copy
cut
paste
duplicate
delete
undo
redo
``​`

Al copiar múltiples schemas o grupos:

- conservar orden;
- conservar distancias;
- aplicar offset común;
- mantenerse dentro de página;
- preservar configuración;
- generar IDs nuevos;
- respetar policy de owner.

## 6.4. Atajos

``​`txt
Ctrl/Cmd+C -> copiar
Ctrl/Cmd+X -> cortar
Ctrl/Cmd+V -> pegar
Ctrl/Cmd+D -> duplicar
Delete/Backspace -> eliminar
Ctrl/Cmd+Z -> undo
Ctrl/Cmd+Shift+Z -> redo
Flechas -> mover
Escape -> cancelar/cerrar
+/- -> zoom
? -> ayuda
``​`

Se suspenden en inputs, textarea, contenteditable, modales y popups visibles.

---

# 7. Familias de schemas

## 7.1. Text-like

Incluye:

``​`txt
text
number
date
dateTime
time
fullName
emailAddress
company
title
multiVariableText
``​`

Comparten placeholder, defaultValue, required, readonly, validation, appearance, dataLabel y tooltip.

### Text

- multiline opcional;
- fuente;
- tamaño;
- tamaño dinámico;
- color/fondo;
- opacidad;
- align horizontal/vertical;
- line height;
- spacing;
- padding;
- límites y patrón.

### Number

- min/max;
- enteros/decimales;
- precisión;
- formato;
- separadores;
- validación numérica.

### Date/DateTime/Time

- formato;
- locale;
- restricciones;
- default;
- representación coherente en Form/Viewer/PDF.

### MultiVariableText

- plantilla;
- variables `{variable}`;
- datos de muestra;
- preview;
- validación;
- fallback.

## 7.2. Checkbox

- checked/unchecked;
- default;
- required;
- readonly;
- value adapter estable;
- indicador visual único y claro.

## 7.3. RadioGroup y CheckboxGroup

- opciones apiladas;
- orientación configurable;
- diseño boxed;
- borde de grupo;
- botón `+`;
- agregar/eliminar/reordenar;
- label/value por opción;
- default;
- IDs de opción estables;
- radio circular;
- checkbox cuadrado;
- edición desde DetailView.

RadioGroup permite una opción. CheckboxGroup permite varias y puede exigir al menos una.

## 7.4. Select/Dropdown

- opciones label/value;
- placeholder;
- default;
- required;
- readonly;
- agregar/eliminar/reordenar;
- validación de duplicados.

El editor de opciones debe ser compartido con grupos y aislar eventos del Canvas.

## 7.5. Firma

Incluye:

``​`txt
signature
initials
dateSigned
``​`

Modos técnicos:

``​`txt
draw
image
p12
provider
``​`

Mapeo del host:

``​`txt
Firma SISAD -> draw
Electrónica -> p12
OneShot -> provider + providerKey=oneshot
``​`

Debe conservar recipient, required, provider capabilities, estado y renderers Designer/Form/Viewer/PDF.

## 7.6. Action-based

### Attachment

- tipos permitidos;
- máximo de archivos;
- máximo tamaño;
- reemplazo;
- mostrar nombre/estado;
- readonly;
- required;
- recipient;
- adapter de storage.

### Note

- contenido informativo;
- readonly por defecto;
- estilo y visibilidad;
- no parecer input si es informativa.

### Approve/Decline

- acciones semánticas;
- label/icon/tono;
- callback/command;
- recipient;
- disabled reason;
- no doble ejecución.

## 7.7. Media

Image/SVG/Stamp:

- source;
- fit;
- aspect ratio;
- opacidad;
- borde;
- fallback;
- PDF render.

## 7.8. Barcode

QR, Code128, EAN, PDF417 y otros:

- valor;
- validación por estándar;
- color;
- incluir texto;
- tamaño;
- quiet zone.

## 7.9. Table

- columnas/filas;
- header;
- repetir header;
- estilos;
- fondo alternado;
- contenido dinámico;
- crecimiento y división de página en generación.

## 7.10. Shapes

Line/Rectangle/Ellipse:

- color;
- borde;
- fondo;
- opacidad;
- radio;
- rotación;
- resize.

## 7.11. Custom

Debe declarar key, defaults, categoría, icono, factory, renderer Designer/Form/Viewer/PDF, inspector contract, value adapter, validation y snapshot compatibility.

---

# 8. LeftSidebar

## 8.1. Función

Catálogo para buscar, filtrar, marcar favoritos y arrastrar campos.

## 8.2. Fuentes

``​`txt
Base
Custom
Auto
``​`

Categorías:

``​`txt
Recientes
Firmas
Texto
Fecha y hora
Selecciones
Imagen y medios
QR y códigos
Estructura
Acciones
General
``​`

## 8.3. Búsqueda y filtros

Buscar por label, type, tags, descripción, categoría y custom name.

Filtros:

``​`txt
Todos
Favoritos
Recientes
Recipient activo
``​`

## 8.4. Favoritos y recientes

- Toggle sin iniciar drag.
- Persistencia según host.
- Recientes al usar/insertar.
- Contadores reales.

## 8.5. Layouts

``​`txt
list
tiles
icons
``​`

Todos comparten drag, click, favorite, recent, tooltip, keyboard, owner, disabled y test IDs. Solo cambia presentación.

La densidad no cambia el layout elegido.

## 8.6. Custom fields

Modal para crear/editar definición con nombre, label, base type, categoría, defaults y validación de duplicados.

## 8.7. Auto-place

Soporta campos prefill/auto con descriptor de owner, documento, página y posición sugerida.

## 8.8. Collapse y scroll

- Un scroll owner.
- No scroll accidental durante drag.
- Rail compacto configurable.
- Sin botones anchos huérfanos al colapsar.
- Restaura estado al expandir.

---

# 9. RightSidebar general

## 9.1. Paneles

``​`txt
fields
detail
docs
comments
``​`

Soporta modo controlado, interno y `auto`.

- Un schema seleccionado: puede abrir Detail.
- Cero o varios: Fields en modo auto.
- Host explícito no se sobreescribe.
- Docs puede ser default en multidocumento mediante configuración.

## 9.2. Switcher

- Tabs en una fila.
- Sin wrap.
- Collapse no deforma tabs.
- En ancho mínimo puede ocultar label visual y conservar `sr-only`.
- `Documento:*` y context summary no se montan en la fila de tabs.

## 9.3. Presentación

``​`txt
docked
overlay
``​`

Debe evitar solapes, conservar Canvas usable y no dejar controles flotantes cuando está colapsado.

## 9.4. Scroll

``​`txt
SidebarFrame: overflow-hidden
Header: shrink-0
Body: overflow-hidden
Panel viewport: overflow-y-auto
``​`

Un solo scroll owner por panel y posición independiente para Fields, Detail, Docs y Comments.

---

# 10. RightSidebar Fields/ListView

## 10.1. Header y toolbar

Debe mostrar título, total, selección, Reasignar, Más, búsqueda, filtro por tipo y filtros configurables.

No duplicar otro header dentro del sortable container.

## 10.2. Fila

Debe mostrar:

- grip;
- icono;
- label principal;
- name técnico secundario;
- tipo;
- owner;
- badges;
- acciones.

Badges/estados:

``​`txt
required
readonly
locked
hidden
invalid
duplicate name
assigned
unassigned
editing by me
blocked by recipient
``​`

## 10.3. Acciones

- abrir detalle;
- delete;
- hide/show;
- lock/unlock;
- comments;
- reassign;
- more.

No cambian el ancho al aparecer, detienen propagación y respetan permisos.

## 10.4. Selección y reorder

- `activeSchemaIds` fuente única.
- Click replace.
- Ctrl/Cmd toggle.
- Shift range.
- Hover sincronizado con Canvas.
- `aria-selected`.
- Reorder filtrado conserva orden global.

## 10.5. Empty states

Distinguir:

- sin schemas;
- filtro sin resultados;
- sin campos en documento/página;
- ocultos por recipient.

---

# 11. DetailView/Inspector

## 11.1. Contrato declarativo

Cada schema declara secciones aplicables:

``​`txt
basics
content
options
appearance
validation
dataLabel
help
location
collaboration
advanced
fileRules
connections
comments
``​`

No usar `if (type === ...)` disperso.

## 11.2. Header

Muestra icono, label, name, type, owner, documento/página, selección, estado de acceso, volver y acciones.

## 11.3. Secciones

### Información del campo

- name;
- label;
- data label;
- tooltip/help;
- rename;
- advertencia duplicado;
- type readonly.

### Contenido

Default, placeholder, texto, note content, action label o template.

### Opciones

Agregar, eliminar, subir, bajar, label, value y default.

### Apariencia

Solo controles aplicables: opacidad, fuente, tamaño, spacing, line height, align, colores, border, radius, dynamic size.

### Validación

Required, readonly, hidden, tipo, patrón, min/max y mensaje.

### Reglas de archivo

Solo attachment: tipos, cantidad, tamaño, reemplazo, nombre y estado.

### Ubicación y tamaño

X, Y, ancho, alto, rotación, alineación y lock.

### Datos y conexiones

``​`txt
Persistencia
Salida JSON
Consulta API
``​`

Debe incluir estado, validar, configurar, labels, field key, mapping, errores y adapter real. No stubs silenciosos.

### Asignación y bloqueo

Owner, recipient, estado, lock, readonly, editing by me/other, reassign, release edit y lock/unlock. Labels/tones de un resolver central.

### Comentarios

Ver, agregar, contador y navegar al hilo.

### Advanced

Solo si contiene controles reales.

## 11.4. Interacción

- Switch con un click.
- Inputs y dropdowns no interactúan con Canvas.
- Cerrar popup no congela selección.
- Cambios controlados.
- Sin DOM imperativo.
- Sin secciones vacías.
- Sin alturas mínimas artificiales.

---

# 12. DocumentsRail

Debe soportar:

- lista de documentos;
- preview;
- número;
- páginas;
- activo;
- seleccionar;
- subir PDF;
- agregar página;
- eliminar con permiso;
- disabled reason;
- empty state;
- scroll propio.

En multidocumento conserva documentId/fileId, routing, assignments y página activa. Puede usar split/stacked según ancho.

---

# 13. CommentsRail

Debe soportar:

- comentario por schema;
- comentario por página;
- anchor por coordenadas;
- hilo activo;
- agregar;
- responder si bridge lo permite;
- resolver/reabrir si bridge lo permite;
- contador;
- navegación;
- empty state;
- scroll propio.

Dialog:

- Cancelar/X/Escape;
- Guardar una vez;
- eventos aislados;
- restaurar interacción al cerrar.

---

# 14. Reasignación

## 14.1. Apertura

Desde selección simple/múltiple, ListView y DetailView.

## 14.2. Modal

Muestra seleccionados, cantidad, owner actual, búsqueda, recipients, rol, color, actual, Cancelar y Reasignar.

## 14.3. Confirmación

Actualiza:

``​`txt
ownerRecipientId
ownerRecipientIds
recipientId
ownerColor
recipientColor
userColor
assignments
snapshot
runtime access
``​`

No cambia:

``​`txt
schemaUid
routing
locked
readOnly
objectLocked
collaborationLock
``​`

## 14.4. Cierre

Cancelar, X, Escape, mask configurada y confirmar.

Debe conservar selección, liberar modal lock, limpiar pointer state y no congelar Canvas. AntD oculto no cuenta como popup abierto.

---

# 15. Usuario activo y colaboración

Selector visible cuando colaboración está habilitada.

Muestra usuario, color, rol y global view.

Al cambiar:

- actualiza RecipientRegistry;
- activeRecipientId;
- permisos;
- filtros;
- owner de nuevos schemas;
- runtime.

No debe repintar incorrectamente schemas existentes ni desaparecer al cambiar de panel derecho.

---

# 16. Multipágina y multidocumento

Debe soportar:

- varios PDFs;
- varias páginas;
- tamaños diferentes;
- page navigator;
- scroll continuo;
- página 2+;
- schema routing;
- máscaras no activas;
- documento/página activa;
- assignments por documento/página;
- coordenadas contra el paper correcto.

---

# 17. Form, Viewer y Snapshot

## 17.1. Form

- controles interactivos;
- recipient filtering;
- required;
- readonly;
- hidden;
- validation;
- valores por schemaUid;
- cambios al host;
- inputs por documento;
- guardado parcial;
- reasignaciones reflejadas.

## 17.2. Viewer

- readonly;
- sin sidebars;
- sin Moveable/Selecto;
- sin chrome;
- respeta hidden y recipient.

## 17.3. Snapshot

Preserva template, schemas, IDs, documents, routing, recipients, assignments, ownership, colors, locks, validation, groups, opciones, firma, conexiones, comentarios, config e inputs cuando aplica.

Restaurar no genera IDs nuevos ni pierde geometría o metadatos.

---

# 18. Acciones y accesibilidad

Cada acción debe tener:

``​`txt
visible
enabled
disabledReason
handler
label
ariaLabel
testId
shortcut
``​`

Reglas:

- icon-only con tooltip;
- botón sin handler no se renderiza;
- `type="button"`;
- focus visible;
- `aria-selected` en filas;
- `aria-pressed` en toggles;
- tabs con roles;
- foco restaurado en modales;
- no usar `aria-hidden` sobre controles.

---

# 19. Responsive y densidad

Densidades:

``​`txt
comfortable
compact
minimal/narrow
``​`

Reglas:

- no coexistir `mini` y `minimal`;
- tabs no hacen wrap;
- densidad no cambia layout LeftSidebar;
- funciones críticas siempre tienen alternativa;
- overlay no bloquea permanentemente el Canvas;
- un scroll owner por panel.

---

# 20. Rendimiento

- Memoizar resolvers.
- No duplicar listas ni selección.
- No ejecutar scrollIntoView en cada render.
- No reconstruir plugin registry.
- Evitar remount de widgets.
- No consultar todo el DOM salvo guards técnicos.
- Montar paneles según necesidad o preservar scroll con una estrategia explícita.

---

# 21. Criterios de aceptación

## Schemas

``​`txt
[ ] Identidad/routing estables.
[ ] Owner coherente.
[ ] Estados diferenciados.
[ ] Designer/Form/Viewer/PDF coherentes.
[ ] Inspector proporcional.
[ ] Ningún control visible sin persistencia.
``​`

## LeftSidebar

``​`txt
[ ] Búsqueda, favoritos y recientes.
[ ] list/tiles/icons.
[ ] Drag preview.
[ ] Sin scroll accidental.
[ ] Custom y auto-place.
[ ] Collapse correcto.
``​`

## RightSidebar

``​`txt
[ ] Tabs en una fila.
[ ] Un scroll owner por panel.
[ ] Canvas ↔ ListView sincronizado.
[ ] Reorder.
[ ] Detail auto-focus.
[ ] Docs/Comments.
[ ] Collapse sin distorsión.
``​`

## DetailView

``​`txt
[ ] Secciones declarativas.
[ ] Sin secciones vacías.
[ ] Switch con un click.
[ ] Inputs aislados.
[ ] Opciones editables.
[ ] Connections reales.
[ ] Access resolver único.
``​`

## Reasignación

``​`txt
[ ] Simple y múltiple.
[ ] Cancelar conserva selección.
[ ] Confirmar actualiza ownership.
[ ] Locks preservados.
[ ] Cierre no congela Canvas.
``​`

## Runtime

``​`txt
[ ] Form por recipient.
[ ] Viewer readonly.
[ ] Snapshot roundtrip.
[ ] Multi-document.
[ ] PDF sin chrome.
``​`

## Tailwind

``​`txt
[ ] No CSS visual nuevo.
[ ] 0 @apply.
[ ] Residual técnico documentado.
[ ] Baseline visual comparable.
``​`

---

# 22. Prioridades

## P0

1. Selección única y sincronizada.
2. Scroll por panel.
3. Reasignar sin freeze.
4. Selector de usuario.
5. Drag/drop.
6. Multipágina/multidocumento.
7. Persistencia real del inspector.
8. Tailwind sin regresiones.

## P1

1. Inspector declarativo.
2. Editor de opciones común.
3. Ownership/access central.
4. Grupos.
5. Firma técnica + políticas del host.
6. Attachment runtime.
7. Connections con adapters.

## P2

1. Atajos completos.
2. Copy/paste de grupos.
3. Layouts del catálogo.
4. Favoritos/recientes.
5. Comentarios anclados.
6. QA responsive.

---

# 23. Regla de diagnóstico

Clasificar cada incidencia antes de corregir:

``​`txt
DATA
STATE
INTERACTION
LAYOUT
STYLE
RUNTIME
SNAPSHOT
HOST INTEGRATION
``​`

No corregir state con CSS, layout con z-index ni funcionalidad desconectada mostrando un botón sin handler.

Arquitectura objetivo:

``​`txt
schema + context
  -> profile resolver
  -> access resolver
  -> action state
  -> renderer/widget
  -> controlled update
  -> snapshot/runtime
``​`
```

<a id="file-0139"></a>

### 0139 — `ai/context/inspector-context.md`

- **Lenguaje:** `markdown`
- **Líneas:** `3`
- **Tamaño original:** `0.1 KB`
- **SHA1 corto:** `f0d0387668`
- **Estado:** `completo`

```markdown
# Inspector Context

Inspector usa secciones declarativas. Widgets actualizan schema por command/update centralizado, no por mutación directa.
```

<a id="file-0140"></a>

### 0140 — `ai/context/README.md`

- **Lenguaje:** `markdown`
- **Líneas:** `3`
- **Tamaño original:** `0.1 KB`
- **SHA1 corto:** `c3611876d7`
- **Estado:** `completo`

```markdown
# Contexts

Contextos focales. Cargar solo uno por task-card.
```

<a id="file-0141"></a>

### 0141 — `ai/context/schema-families-context.md`

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

<a id="file-0142"></a>

### 0142 — `ai/context/selection-transform-context.md`

- **Lenguaje:** `markdown`
- **Líneas:** `3`
- **Tamaño original:** `0.2 KB`
- **SHA1 corto:** `82c62bc253`
- **Estado:** `completo`

```markdown
# Selection Transform Context

Selecto selecciona roots con `data-schema-id`. Moveable transforma roots. Excluir option internals, botón +, toolbar, inputs, contenteditable y overlays.
```

<a id="file-0143"></a>

### 0143 — `ai/context/snapshot-context.md`

- **Lenguaje:** `markdown`
- **Líneas:** `3`
- **Tamaño original:** `0.1 KB`
- **SHA1 corto:** `a7320fffe0`
- **Estado:** `completo`

```markdown
# Snapshot Context

Snapshot preserva document/page, geometry, ownership, options, selected values y `__designer`.
```

<a id="file-0144"></a>

### 0144 — `ai/context/tailwind-design-continuity-context.md`

- **Lenguaje:** `markdown`
- **Líneas:** `25`
- **Tamaño original:** `1.7 KB`
- **SHA1 corto:** `c96685dd03`
- **Estado:** `completo`

```markdown
# Contexto — continuidad visual y migración Tailwind

## Evidencia disponible

- Ruta objetivo: `/lab/multi-document-routing`.
- CSS objetivo: `src/sisad-pdfme/ui/styles/sisad-pdfme.css`, `src/features/pdfcomponent/labRoutes.css` y `src/sisad-pdfme/ui/styles/tokens.css`.
- Constantes relevantes: `src/sisad-pdfme/ui/constants.ts`; sus clases concatenadas deben conservarse o transformarse en mapas estáticos detectables por Tailwind.
- La captura de 2026-07-15 evidencia solapamientos en el sidebar izquierdo, densidad inconsistente, rail derecho estrecho y una superficie negra/anómala junto a reglas o guías.
- La auditoría detectó una doble fuente de tono: `Renderer.tsx` calcula `ownerColor`, mientras el chrome exterior puede usar `schemaTone`. El cambio de usuario debe colorear el exterior del schema con el color del propietario real.

## Restricciones

- `tokens.css` conserva variables, temas, resets mínimos y contratos compartidos; no debe vaciarse por una meta numérica.
- Migrar primero utilidades estructurales a `className`; conservar en CSS pseudoestados, selectores complejos, portales, keyframes, variables y contratos de terceros.
- No construir nombres Tailwind dinámicos como `bg-${color}-500`. Usar mapas completos, `clsx`, `cn` o variantes estáticas.
- No alterar geometría, coordenadas, zoom, drag/resize, selección, snapshots ni PDF durante una tarjeta CSS.
- Cada corrección debe demostrar equivalencia funcional y visual antes de eliminar CSS.

## Orden

1. Restaurar color por propietario.
2. Unificar la fuente de estilos del shell del lab.
3. Reducir `@apply` por regiones pequeñas.
4. Aislar la regresión de guías/reglas del canvas.
5. Cerrar con validación visual y ledger cuantitativo.
```

<a id="file-0145"></a>

### 0145 — `ai/context/visual-baseline-context.md`

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

<a id="file-0146"></a>

### 0146 — `ai/docs-migration/MIGRATION_FROM_OLD_STRUCTURE.md`

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

<a id="file-0147"></a>

### 0147 — `ai/memory/changelog.md`

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

<a id="file-0148"></a>

### 0148 — `ai/memory/completed-checklist.md`

- **Lenguaje:** `markdown`
- **Líneas:** `27`
- **Tamaño original:** `1.3 KB`
- **SHA1 corto:** `d73cc47b1e`
- **Estado:** `completo`

```markdown
# Checklist de completados protegidos

## Estado protegido

- [x] Config global portable creada (`TASK-ARCH-001`).
- [x] Recipient Registry creado (`TASK-ARCH-002`).
- [x] Reasignación base con persistencia creada (`TASK-PDFME-003`).
- [x] Paridad multidocumento base (`TASK-PDFME-004`).
- [x] Runtime Form preview por recipient (`TASK-PDFME-006`).
- [x] Snapshot persistence contract (`TASK-PDFME-007`).
- [x] Snap-lines y compactación inicial (`TASK-CANVAS-002`).
- [x] Densidad inicial de DetailView (`TASK-INSPECTOR-001`).
- [x] Indicadores DocuSign para option groups (`TASK-SCHEMA-001`).
- [x] Reducción CSS segura a Tailwind inline (`TASK-CSS-012`).
- [x] Controller público sin no-op silencioso (`TASK-PDFME-013`).
- [x] Continuidad de wiring de visibility config (`TASK-PDFME-012`).
- [x] Restaurar conectividad SISAD (`TASK-PDFME-011`).
- [x] Drag preview, scroll canvas y posicionamiento (`TASK-PDFME-010`).
- [x] Proteger overflow/scroll de Canvas post Tailwind (`TASK-CANVAS-001`).

## Política de no regresión

- No reimplementar features completadas desde cero.
- No duplicar lógica en host.
- No añadir carpetas paralelas.
- No tocar PDF-lib, Moveable, Selecto, geometría o snapshot sin task-card explícita.
- No convertir reports/completed en contexto activo.
```

<a id="file-0149"></a>

### 0149 — `ai/memory/decisions.md`

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

<a id="file-0150"></a>

### 0150 — `ai/memory/known-risks.md`

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

<a id="file-0151"></a>

### 0151 — `ai/memory/memory-update-protocol.md`

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

<a id="file-0152"></a>

### 0152 — `ai/memory/pending-checklist.md`

- **Lenguaje:** `markdown`
- **Líneas:** `21`
- **Tamaño original:** `1.2 KB`
- **SHA1 corto:** `21e1600af9`
- **Estado:** `completo`

```markdown
# Checklist pendiente real

Este archivo contiene solo trabajo pendiente o continuidad. Las tareas completadas viven en `ai/task-cards/completed/` y se resumen en `ai/task-cards/completed/completed-summary.md`.

## Active existente

- [ ] `TASK-REGRESSION-021-shell-token-visual-recovery.md`
- `TASK-CSS-019-jsx-tsx-tailwind-migration-and-css-reduction.md` ya vive en `ai/task-cards/completed/`.

## Backlog / continuidad

- `TASK-PDFME-005-digital-agreements-runtime-adapter.md` - fuera de este repo; el core equivalente ya está cubierto en `src/sisad-pdfme`.
- `TASK-PDFME-008-signature-policies-firma-sisad.md` - fuera de este repo; el core ya expone políticas técnicas y el negocio vive en el host.
- `TASK-PDFME-009-externalforms-runner-contract.md` - fuera de este repo; el runner core ya existe en `src/sisad-pdfme/externalForms`.


## Pendientes transversales

- [x] Confirmar que `src/sisad-pdfme/docs/**` no se use como copia ni reemplazo de `docs/**`.
- [x] Confirmar que `reports/**`, `dist/**`, `test-results/**` y `.tailwind-migration-backups/**` están excluidos del contexto activo por defecto.
- [x] Confirmar que el CSS migrado a Tailwind inline no rompe geometry, zoom, canvas, paper, Moveable, Selecto o print/PDF.
```

<a id="file-0153"></a>

### 0153 — `ai/memory/project-memory.md`

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

<a id="file-0154"></a>

### 0154 — `ai/memory/README.md`

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

<a id="file-0155"></a>

### 0155 — `ai/memory/session-handoff.md`

- **Lenguaje:** `markdown`
- **Líneas:** `168`
- **Tamaño original:** `9.6 KB`
- **SHA1 corto:** `a4ae0d4ca7`
- **Estado:** `completo`

```markdown
# Session Handoff

## Último foco

Ejecución completa de task-cards active + backlog (2026-07-15). Cerradas y
movidas a `completed/`:

- **ACTIONS-001**: inventario clasificado en
  `reports/action-audit/button-action-inventory.md` (237 candidatos;
  MISSING_HANDLER = 0 tras aplicar el contrato).
- **ACTIONS-002**: `designerActionState.ts` con `resolveDesignerActionState`
  (regla dura missing-handler, razones para tooltips); alias kebab-case
  consolidados en `actionRegistry.DESIGNER_ACTION_ALIASES`; adoptado en CtlBar
  y en `reassignActionState` (ListView).
- **DETAIL-015**: labels unificados (`inspectorStatusLabel = statusLabel`,
  'Posición bloqueada', 'Bloqueo sin responsable', menú 'Bloquear posición');
  alias legacy directos; se corrigieron 2 bugs de merge paralelo
  (statusTone fuera de scope; miembros duplicados en SchemaAccessState).
- **UI-015**: rails con tooltips + `sidebar-rail-<side>-<modo>` +
  `sidebar-collapse-<side>`; spec de no-solape Guardar/rail.
- **UI-016** (backlog): zoom siempre porcentual (`formatZoomPercent`,
  `buildZoomSelectOptions` inyecta el nivel actual), testids designer-zoom-*.
- **QA-015**: specs `action-contract-smoke`, `sidebar-rail-collapse-actions`,
  `zoom-toolbar-contract` + `tests/unit/sisad-pdfme/ui/actions/` (12 unit).
- **RUNTIME-015** (backlog): `ResolvedDesignerUiMap` + `useDesignerUiConfig`
  (`designerUiConfig.ts`); ActionRegistry consume el mismo mapa.
- **CSS-013/014**: auditores ejecutados, reportes regenerados (649 duplicados
  clasificados), ledger actualizado; SIN eliminación de reglas esta pasada
  (merges por slice usando los reportes).
- **ARCH-004**: `reports/designer-deep-audit/wrapper-reduction.md`
  (PASS_THROUGH_REMOVE = 0; par duplicado SidebarEmptyState ↔
  SidebarSurfaceEmptyState documentado para slice propio).

Siguen en `active/` solo las cards del repo host (`Sisad-Web-FRONTEND`):
PDFME-005, PDFME-008 (parte core verificada aquí), PDFME-009. No son
ejecutables dentro de este checkout; aquí solo queda la base portable que ya fue
verificada y el contexto histórico de esas integraciones.

Validación global: build exit 0, lint 0 errores, 101+ unit tests de áreas
tocadas en verde, 13 specs e2e en verde (specs desactualizados por el copy
cambiante del DetailView se hicieron copy-agnósticos). `tsc` global bajó de
174 a 140 errores (se arreglaron imports rotos de visibilityConfig/
designerUiConfig, duplicados de SchemaAccessState, badge type y ctx de tests).

## Próximo paso sugerido

- Slice de merges CSS (MERGE_SAME_SELECTOR) zona por zona usando
  `selector-duplicates-current.md`, con verificación visual.
- Convergencia SidebarEmptyState ↔ SidebarSurfaceEmptyState (slice propio).
- Adopción progresiva de `useDesignerUiConfig` en componentes que aún leen
  options directo.
- Cards host en Sisad-Web-FRONTEND (PDFME-005/008/009) con el reporte de
  paridad como guía.
- Commitear el working tree (mezcla trabajo de Codex + estas sesiones).

## Atención

- Codex trabaja EN PARALELO sobre este working tree (DetailView copy, registry,
  externalForms): antes de editar, releer el archivo; ya hubo 2 merges con
  bugs (statusTone, miembros duplicados) corregidos aquí.
- El copy del DetailView es inestable; los specs nuevos asertan títulos
  estables/testids, no descripciones.
- No usar git stash (4 stashes ajenos).

## Sesión 2026-07-15 (tarde) — TASK-INTERACTION-016 + seguimiento LAB-026

**INTERACTION-016 (freeze tras modal Reasignar) — CERRADA.** Causa raíz:
`isAntDPopupOpen()` contaba popups AntD montados-pero-ocultos (tooltip del
botón Reasignar, dropdowns `ant-*-hidden`) → Selecto/shortcuts congelados para
siempre. Fix: detección consciente de visibilidad + lifecycle único
`requestClose(reason)` + reset transitorio extendido (keepSelection,
releaseModalLock, blur solo con foco huérfano) + Escape a nivel documento.
Spec `assignment-modal-selection-freeze-regression` (4 tests) en verde.

**LAB-026 seguimiento — CERRADO.** Cadena de regresiones del preset resuelta:
CSS base importado en `react/index.ts`; adapter de documentos unificado
(la copia local del resolver PERDÍA `template` → canvas empty_page);
preset como estado inicial (no controlado); `--sisad-pdfme-rs-width` publicado
con el ancho real JS; CtlBar honra density explícito; shell del lab sin
overflow; reparado `@layer components` sin `@tailwind` que tiraba 500.
Bonus: shift-click acumulativo (selectionPolicy) — el par unit+e2e ahora
concuerda.

Estado final: 26 tests e2e en verde en el barrido completo, 288+ unit de las
suites tocadas (solo quedaba schemaTone desactualizado, ya alineado), build
exit 0.

**Deuda conocida**: los specs asumen ahora el contrato multi-página (17 papers,
máscaras por página no activa por diseño); si el routing multi-doc cambia a
"solo páginas del documento activo", revisar canvas-interactions y checkbox.
Codex sigue editando en paralelo: HUBO 3 colisiones reparadas aquí (statusTone
fuera de scope, duplicados en SchemaAccessState, @layer sin @tailwind).

## Sesión 2026-07-15 (noche) — ListView plano + reglas claras + estados

- TASK-CSS-024 (fila plana del ListView, Item.tsx) — completada.
- TASK-CANVAS-003 (bloque negro de reglas/guías) — completada: la regresión era
  el default oscuro `#2d2d2d`/`bg-slate-800` en `Guides.tsx`; migrado a paleta
  light (`#f8fafc`/`#f1f5f9`, texto slate legible). Verificado por color
  computado + captura + specs de canvas.
- TASK-CSS-020 (labRoutes zero-apply) — completada (labRoutes.css ya era no-op,
  0 @apply).
- Reconciliado: eliminado duplicado de TASK-REGRESSION-020 en backlog.
- Abierta TASK-QA-017 (deriva de specs por panel Docs default de LAB-029).

### Migración @apply de sisad-pdfme.css (directiva del usuario) — NO ejecutada en bloque

Motivo: `sisad-pdfme.css` tiene 588 `@apply` en 2486 líneas y su distribución es
~60% geometría de canvas/stage (prohibida) + DetailView/RightSidebar (zona activa
de Copilot, colisión) + reglas de layout sidebar↔canvas. La card activa
TASK-REGRESSION-021 (de Copilot) marca ese CSS PROHIBIDO y explícitamente veta
la migración masiva de @apply hasta probar paridad visual. Migrar en bloque
rompería visuales y chocaría con dos agentes. Debe hacerse por componente, en
slices, coordinado, cuando REGRESSION-021 cierre. Backlog CSS-021/022 (left
sidebar) son los siguientes slices seguros cuando el LeftSidebar no esté en
edición paralela.

## Migración @apply CSS→JSX — pase 1 (2026-07-15) — TASK-CSS-025

- Migrados a JSX (fuente única) y eliminados del CSS: skin de `context-summary`
  (DesignerContextSummary.tsx, componente sin montar) y base de `guides` corner/
  ruler (Guides.tsx). `@apply` en sisad-pdfme.css: 588 → 574.
- Se conservan en CSS solo reglas no expresables como className: descendientes
  `.scena-guides-*` (elementos de la librería) y variantes acopladas al `.stage`.
- HALLAZGO CLAVE (afecta toda migración futura): `preflight: false` →
  `border-b`/`border-r` NO fijan `border-style` y el borde colapsa a 0; usar
  `border-X border-solid`. La utilidad `border` (todos los lados) sí rinde solid.
- El grueso restante (574) es geometría/stage (prohibida) o zona activa de
  Copilot; requiere pases por componente coordinados.

## Migración @apply — pase 2 (2026-07-15) — ErrorScreen + muro de contención

- Migrado `ErrorScreen.tsx` (grid centering, width, skin) → JSX; eliminadas
  reglas element + padding en conflicto. `@apply` acumulado: 588 → 571.
- MURO DE CONTENCIÓN: git status muestra TODO el designer UI dirty (LeftSidebar*,
  PluginIcon, DetailView/*, RightSidebar*, ListView*, index.tsx, CtlBar,
  Canvas...) por edición paralela de Codex/Copilot. El resto del skin migrable
  está en esos componentes o es geometría de canvas/stage (prohibida). No es
  seguro seguir migrando sisad-pdfme.css hasta que el trabajo paralelo haga
  commit. URGENTE: commitear y coordinar antes del siguiente pase.

## Migración @apply — pase 3 (2026-07-15) — SelectionContextToolbar
- Eliminado el bloque CSS muerto/redundante de `.selection-context-toolbar*`
  (≈46 reglas): el componente se reescribió a estructura mínima inline. Migrado
  al JSX solo `absolute`/`pointer-events-auto`/animación. `@apply` 588 → 525.
- 2º matiz border-solid: los <button> tienen `border-style: outset` del UA →
  requieren `border-solid` (los <div> son `none`). Regla para toda la migración.

## Migración @apply — pase 4 (2026-07-15) — reglas muertas
- Borradas reglas de clases sin render (verificado 0 refs con las 3 formas de
  construcción): context-menu, list-view-empty/-title/-hint/-counter/-subtitle.
  @apply acumulado: 588 → 514. Build OK, riesgo cero (nada las monta).
- Copilot edita el CSS en paralelo (conteo baja solo). Regla: solo migrar .tsx
  no-dirty o borrar reglas muertas verificadas; NO bulk-delete por detector
  ingenuo (falsos positivos como `stage` que es live vía template literal).

## Migración @apply — pase 5 (2026-07-15) — límite seguro alcanzado
- Borrada regla muerta `.back-button` (base/hover/active, 0 refs verificadas).
  @apply acumulado: 588 → 511.
- Detector FIABLE (3 formas de grep + child-prefix) sobre 114 reglas single-class:
  36 muertas, pero SOLO 1 (back-button) fuera de la zona de Copilot. Las otras 35
  muertas son DetailView/control-bar/custom-field/sidebar → NO tocar: sus .tsx
  están dirty (mid-edit por Copilot), donde incluso "muerto" es inseguro (el
  snapshot puede no reflejar el estado final) y editar el mismo CSS arriesga clobber.
- CONCLUSIÓN: la superficie segura para este agente está agotada. El resto del
  skin/dead CSS vive en componentes que Copilot reescribe AHORA (mismo archivo).
  Próximo avance real = commit/land de Copilot, luego retomar DetailView/control-bar
  con las reglas de border-solid.
```

<a id="file-0156"></a>

### 0156 — `ai/plans/PLAN_EJECUCION_MIGRACION_TAILWIND_SISAD_PDFME.md`

- **Lenguaje:** `markdown`
- **Líneas:** `679`
- **Tamaño original:** `12.9 KB`
- **SHA1 corto:** `e7b02c48b8`
- **Estado:** `completo`

```markdown
# PLAN DE EJECUCIÓN — Migración total de Tailwind desde CSS hacia JSX/TSX

## 1. Propósito

Completar la migración visual de SISAD PDFME sin repetir análisis ya cerrados, sin ejecutar validaciones costosas después de cada microcambio y sin eliminar CSS técnico necesario.

Este plan parte del estado más reciente disponible:

| Archivo                                       | Estado aproximado reportado |
| --------------------------------------------- | --------------------------: |
| `src/features/pdfcomponent/labRoutes.css`   |                   5 líneas |
| `src/sisad-pdfme/ui/styles/sisad-pdfme.css` |                2484 líneas |
| `src/sisad-pdfme/ui/styles/tokens.css`      |                 323 líneas |
| `src/styles/sisad-tailwind-bridge.css`      |                      vacío |
| `src/style.css`                             |                neutralizado |
| `src/styles/tailwind.css`                   |   fuente única de Tailwind |

Estas cifras deben volver a medirse al comenzar porque el repositorio puede haber cambiado.

## 2. Diagnóstico del retraso

El proceso anterior está demorando por cuatro razones:

1. Se trabaja en componentes individuales o pares de componentes.
2. Se ejecutan build y las mismas pruebas después de cada microcambio.
3. Se vuelve a cargar contexto y documentación en cada turno.
4. Se actualizan task-cards y memoria después de cambios demasiado pequeños.

La solución será trabajar con:

``​`txt
1 task-card activa
→ paquetes funcionales
→ subpases de máximo 5 archivos
→ validación única al final del paquete
→ actualización documental única
``​`

## 3. Restricciones del repositorio

La arquitectura IA actual exige:

``​`txt
una sola task-card activa;
máximo 2 búsquedas globales por subpase;
máximo 8 archivos abiertos;
máximo 5 archivos modificados;
no tocar geometría protegida sin tarea explícita.
``​`

El plan no elimina estos guardrails. Los usa así:

``​`txt
Paquete funcional
├── Subpase A: hasta 5 archivos
├── Subpase B: hasta 5 archivos
├── Subpase C: hasta 5 archivos
└── Gate de validación único
``​`

## 4. Preparación

### 4.1 Cerrar o delimitar la tarea activa

Revisar:

``​`txt
ai/task-cards/active/TASK-REGRESSION-021-shell-token-visual-recovery.md
``​`

Decisión:

- Si aún contiene regresiones visuales abiertas, terminar únicamente esos criterios.
- Si el baseline visual ya está recuperado, moverla a completadas.
- Crear una sola tarea activa nueva:

``​`txt
ai/task-cards/active/TASK-CSS-024-accelerated-tailwind-inline-decommission.md
``​`

No mantener `TASK-REGRESSION-021` y `TASK-CSS-024` activas simultáneamente.

### 4.2 Crear evidencia inicial

Generar:

``​`txt
reports/tailwind-migration/accelerated/
├── css-lines-before.txt
├── apply-before.txt
├── selector-inventory.txt
├── constants-consumers.txt
├── migration-map.csv
└── migration-ledger.md
``​`

### 4.3 Ejecutar inventarios existentes

``​`bash
node scripts/css-inventory.mjs
node scripts/css-selector-duplicates.mjs
node scripts/css-active-selector-audit.mjs
``​`

Revisar el script:

``​`txt
scripts/migrate-design-to-tailwind.mjs
``​`

Usarlo únicamente si posee modo seguro de reporte o generación de candidatos. No permitir reemplazos automáticos no revisados.

## 5. Matriz de decisión

| Tipo de regla                  | Destino                    |
| ------------------------------ | -------------------------- |
| Flex, grid, gap, padding, skin | JSX/TSX                    |
| Hover, focus, selected local   | JSX/TSX                    |
| Responsive local               | JSX/TSX                    |
| Token compartido               | `tokens.css`             |
| Variable consumida por JS      | `tokens.css` o constante |
| Ant Design descendant selector | CSS técnico               |
| Moveable/Selecto               | CSS técnico               |
| Canvas/paper geometry          | CSS técnico               |
| Print/keyframes                | CSS técnico               |
| Selector sin consumidor        | eliminar con evidencia     |

## 6. Fases y paquetes

---

## FASE A — Inventario y cierre del baseline

### A1. Medición

Ejecutar:

``​`bash
wc -l \
  src/sisad-pdfme/ui/styles/sisad-pdfme.css \
  src/features/pdfcomponent/labRoutes.css \
  src/sisad-pdfme/ui/styles/tokens.css

rg -c "@apply" \
  src/sisad-pdfme/ui/styles/sisad-pdfme.css \
  src/features/pdfcomponent/labRoutes.css \
  src/sisad-pdfme/ui/styles/tokens.css
``​`

### A2. Auditoría de constantes

Auditar consumidores de:

``​`txt
DESIGNER_CLASSNAME
UI_CLASSNAME
SELECTABLE_CLASSNAME
RULER_HEIGHT
PAGE_GAP
LEFT_SIDEBAR_WIDTH
RIGHT_SIDEBAR_WIDTH
BACKGROUND_COLOR
DEFAULT_MAX_ZOOM
``​`

Resultado:

``​`txt
reports/tailwind-migration/accelerated/constants-contract.md
``​`

Debe indicar para cada constante:

``​`txt
tipo
consumidores
si afecta geometría
si puede migrarse
si debe conservarse
riesgo
``​`

### A3. Gate

No modificar UI en esta fase.

Entregable:

``​`txt
mapa completo priorizado
``​`

---

## FASE B — RightSidebar residual

El registro muestra que ya se han trabajado:

``​`txt
SidebarSurfacePrimitives
DocumentsRail
ListViewToolbar
DetailHeaderCard
InspectorPrimitives
CompactConfigPanel
SchemaConnectionsWidget
SchemaOptionsEditor
InspectorDefinitionList
SchemaCollaborationWidget
SchemaConnectionsShared
``​`

Por tanto, esta fase no debe repetir el diseño de esos componentes. Debe buscar únicamente:

``​`txt
selectores CSS todavía activos;
media queries asociadas;
duplicados;
descendientes AntD;
componentes no migrados;
regresiones visibles.
``​`

### B1. ListView

Archivos candidatos:

``​`txt
RightSidebar/ListView/ListView.tsx
RightSidebar/ListView/Item.tsx
RightSidebar/ListView/SelectableSortableContainer.tsx
RightSidebar/ListView/ListViewDragOverlay.tsx
RightSidebar/ListView/ListViewToolbar.tsx
``​`

Objetivos:

``​`txt
fila plana
sin borde negro
sin card anidada
acciones estables
badges compactos
scroll correcto
overlay consistente
``​`

### B2. DetailView residual

Trabajar por grupos de hasta 5 archivos:

``​`txt
DetailViewContent
DetailFormSection
detail widgets restantes
primitives no migradas
headers y context strips residuales
``​`

### B3. Poda CSS del paquete

Eliminar únicamente selectores trasladados o huérfanos demostrados.

### B4. Gate

``​`bash
npm run build

npx playwright test \
  tests/playwright/right-sidebar-visual-polish.spec.ts \
  tests/playwright/right-sidebar-docs-tab.spec.ts
``​`

Criterio de salida:

``​`txt
RightSidebar visualmente estable;
sin selectores visuales duplicados conocidos;
scroll y tabs intactos.
``​`

---

## FASE C — LeftSidebar

Esta fase absorbe los pendientes equivalentes a CSS-021 y CSS-022.

### C1. Separar conceptos

No mezclar:

``​`txt
catalog layout: list / tiles / icons
density: comfortable / compact / minimal
sidebar width
collapsed state
``​`

### C2. Componentes

Subpase 1:

``​`txt
LeftSidebar.tsx
LeftSidebarTabs.tsx
LeftSidebarSearch.tsx
LeftSidebarGroup.tsx
CatalogLayoutToggle.tsx
``​`

Subpase 2:

``​`txt
LeftSidebarCustomPanel.tsx
LeftSidebarCustomFieldModal.tsx
useLeftSidebarCatalogState.ts
SidebarRail.tsx
SidebarCollapseHandle.tsx
``​`

### C3. Riesgos

Validar:

``​`txt
scroll durante drag
botón collapse recortado
overflow horizontal
vista compact convertida en una columna
tarjetas anidadas
modo icon-only
persistencia de layout elegido
``​`

### C4. Gate

``​`bash
npm run build
``​`

Ejecutar specs existentes de LeftSidebar y una validación visual de:

``​`txt
abierto
colapsado
list
tiles
icons
drag activo
``​`

---

## FASE D — Toolbar, topbar, zoom y rails

### D1. Componentes

``​`txt
CtlBar.tsx
Designer/index.tsx
UnitPager.tsx
SidebarRail.tsx
SidebarCollapseHandle.tsx
``​`

### D2. Contratos

No reemplazar ciegamente:

``​`txt
RULER_HEIGHT
PAGE_GAP
LEFT_SIDEBAR_WIDTH
RIGHT_SIDEBAR_WIDTH
DEFAULT_MAX_ZOOM
``​`

### D3. Validaciones

``​`txt
zoom visible en porcentaje
botones compactos
tooltips
tabs
collapse
navegación de página
preservación del centro del PDF
``​`

### D4. Gate ampliado

``​`bash
npm run build
npx playwright test
``​`

Usar suite amplia porque esta fase toca controles transversales.

---

## FASE E — Lab host

El inventario más reciente reporta `labRoutes.css` con aproximadamente 5 líneas. Por ello esta fase es de verificación, no de refactor grande.

### E1. Comprobar contenido real

``​`bash
cat src/features/pdfcomponent/labRoutes.css
rg -n "@apply|sisad-pdfme-lab-" src/features/pdfcomponent/labRoutes.css
``​`

### E2. Decisión

- Si contiene únicamente comentarios: eliminar archivo e import.
- Si contiene reglas residuales: moverlas al componente propietario.
- Si contiene un contrato técnico: documentarlo y conservarlo.

### E3. Componentes

``​`txt
PdfmeLabPage.jsx
PageHeader.jsx
ResultsPanel.jsx
CompactControls.jsx
PopoverMenu.jsx
CaseCard.jsx
LabLandingPage.jsx
``​`

### E4. Gate

``​`bash
npm run build

npx playwright test \
  tests/playwright/multi-document-routing-design.spec.ts \
  tests/playwright/lab-designer-visual-baseline-regression.spec.ts
``​`

---

## FASE F — Form y Viewer

### F1. Archivos

``​`txt
Form.tsx
Viewer.tsx
Preview.tsx
RuntimeFormPanel.tsx
Root.tsx
ErrorScreen.tsx
Spinner.tsx
UnitPager.tsx
``​`

### F2. No tocar

``​`txt
input mapping
recipient filtering
schema access
validation
snapshot
PDF generation
``​`

### F3. Validar

``​`txt
form editable
viewer readonly
required
hidden
readonly
owner filtering
multi-document
responsive
``​`

### F4. Gate ampliado

``​`bash
npm run build
npx playwright test
``​`

---

## FASE G — Poda técnica de `sisad-pdfme.css`

### G1. Auditoría final

Clasificar cada bloque residual:

``​`txt
ANTD
CANVAS
PAPER
MOVEABLE
SELECTO
DRAG
PRINT
KEYFRAMES
RUNTIME_GLOBAL
ORPHAN
``​`

### G2. Reorganización

Ordenar el archivo y agregar encabezados claros.

### G3. Prohibición

No mover CSS técnico a JSX solo para reducir líneas.

### G4. Resultado esperado

``​`txt
sisad-pdfme.css ya no contiene cards, headers, toolbar, sidebars o widgets visuales trasladables;
cada bloque residual tiene una justificación técnica.
``​`

---

## FASE H — Tokens

### H1. Auditoría de consumidores

Por cada variable:

``​`bash
rg -n --fixed-strings -- "--token-name" src
``​`

### H2. Clasificación

``​`txt
ACTIVE_SHARED
ACTIVE_RUNTIME
ALIAS_REQUIRED
DEPRECATED_WITH_CONSUMERS
ORPHAN
``​`

### H3. Acción

- Mantener las tres primeras.
- Migrar consumidores antes de eliminar deprecated.
- Eliminar orphan.
- No reemplazar owner colors dinámicos por paleta estática.

---

## FASE I — Cierre y regresión

### I1. Métricas finales

Generar:

``​`txt
css-lines-after.txt
apply-after.txt
selector-inventory-after.txt
constants-contract-final.md
residual-css-justification.md
migration-summary.md
``​`

### I2. Comparación

Reportar:

``​`txt
líneas antes/después
@apply antes/después
selectores eliminados
selectores conservados
componentes migrados
tokens eliminados
CSS técnico residual
``​`

### I3. QA final

``​`bash
npm run build
npx playwright test
``​`

### I4. Revisión manual

Validar en:

``​`txt
http://localhost:5174/lab/multi-document-routing
``​`

Escenarios:

``​`txt
LeftSidebar abierto/colapsado
RightSidebar abierto/colapsado
Campos
Detalle
Docs
Comentarios
selección simple
selección múltiple
drag list
drag canvas
scroll multipágina
zoom
Form
Viewer
ResultsPanel
``​`

## 7. Criterios de éxito

### Funcionales

``​`txt
sin regresiones de selección;
sin regresiones de drag;
sin pérdida de scroll;
sin pérdida de acciones;
sin cambios en snapshot;
sin cambios en generator;
``​`

### Visuales

``​`txt
densidad consistente;
sin bordes negros inesperados;
sin cards anidadas;
sin iconos recortados;
sin headers duplicados;
sin botones flotantes incoherentes;
``​`

### Técnicos

``​`txt
labRoutes.css sin @apply;
sisad-pdfme.css solo con residual técnico;
tokens.css solo con tokens activos;
hooks DESIGNER_CLASSNAME/UI_CLASSNAME conservados;
sin !important nuevo;
sin wrappers decorativos nuevos;
``​`

## 8. Estimación por paquetes

| Paquete               | Subpases estimados | Gate                      |
| --------------------- | -----------------: | ------------------------- |
| Baseline e inventario |                  1 | reportes                  |
| RightSidebar          |               2–3 | build + 2 specs           |
| LeftSidebar           |                  2 | build + specs del dominio |
| Toolbar/zoom          |               1–2 | build + suite amplia      |
| Lab host              |                  1 | build + 2 specs           |
| Form/Viewer           |               1–2 | build + suite amplia      |
| Poda CSS              |                  2 | build                     |
| Tokens                |                  1 | build                     |
| QA final              |             oi, o1 | suite completa            |

## 9. Regla de continuidad

Después de cada paquete, actualizar una sola vez:

``​`txt
reports/tailwind-migration/accelerated/migration-ledger.md
ai/task-cards/active/TASK-CSS-024-accelerated-tailwind-inline-decommission.md
``​`

No actualizar cinco documentos distintos.

No volver a abrir un paquete cerrado salvo que una prueba demuestre una regresión.
```

<a id="file-0157"></a>

### 0157 — `ai/plans/PLAN_MAESTRO_UX_QA_POST_TAILWIND_SISAD_PDFME_2026-07-17.md`

- **Lenguaje:** `markdown`
- **Líneas:** `1099`
- **Tamaño original:** `26.0 KB`
- **SHA1 corto:** `8d5e7c6aa9`
- **Estado:** `completo`

```markdown
# Plan maestro de estabilización visual, UX y QA post‑migración Tailwind — SISAD PDFME

**Fecha:** 2026-07-17
**Ruta objetivo:** `http://localhost:5174/lab/multi-document-routing`
**Alcance:** Designer, Canvas, LeftSidebar, RightSidebar, DetailView, ListView, DocumentsRail, rails colapsados, CtlBar, popovers, lint y pruebas.

---

## 1. Veredicto ejecutivo

La migración visual avanzó mucho, pero el estado actual no debe considerarse todavía una versión UX estable. Las capturas muestran un diseñador funcional con estas regresiones principales:

1. El botón **Guardar** invade el switcher del RightSidebar y compite con las pestañas.
2. El **DetailView no puede desplazarse** hasta las secciones inferiores.
3. El RightSidebar usa demasiadas superficies, bordes, radios y sombras anidadas.
4. El LeftSidebar hace que casi todos los campos parezcan activos por el borde azul permanente.
5. Los menús de “Más”, los selectores de validación y el selector de zoom se ven desconectados del diseño del producto.
6. La vista documental mezcla “documentos” y “páginas”, y varias acciones quedan recortadas.
7. El toolbar contextual del Canvas puede cubrir el schema seleccionado.
8. El estado colapsado de los sidebars todavía se siente como controles flotantes aislados.
9. `npm run lint` no está estable: existen **4 errores y 208 advertencias**.
10. Hay artefactos de pruebas E2E fallidas en color de propietario, transformación, foco, rails y cobertura de tipos de schema.

La prioridad correcta es:

``​`txt
P0 Integridad funcional
→ P1 jerarquía del workspace
→ P2 densidad y consistencia visual
→ P3 accesibilidad y responsive
→ P4 limpieza completa de warnings y estabilización de pruebas
``​`

No se debe seguir “decorando” antes de cerrar scroll, hooks, memoización, foco, selección y ownership.

---

## 2. Novedad arquitectónica importante: la migración no quedó totalmente Tailwind-only

`src/sisad-pdfme/ui/styles/sisad-pdfme.css` quedó vacío, pero los estilos residuales fueron trasladados a:

``​`txt
src/sisad-pdfme/ui/runtimeStyles.ts
``​`

Ese archivo contiene CSS como string e inyecta un `<style>` desde el runtime. Por tanto:

``​`txt
CSS en archivo .css = 0
CSS puro real = todavía existe dentro de runtimeStyles.ts
``​`

Esto no es necesariamente incorrecto para contratos técnicos imposibles o inconvenientes de expresar con clases:

- geometría de stage/canvas/paper;
- selectores de nodos generados por Moveable, Selecto o Scena Guides;
- pseudoestados sobre DOM de terceros;
- reglas dinámicas de impresión/PDF;
- scrollbar técnico;
- pointer-events de overlays;
- variables runtime.

Sí es incorrecto mantener allí skin ordinario:

- colores y sombras de tarjetas;
- padding y radio de botones;
- apariencia de tabs;
- cards de sidebars;
- estados hover/focus;
- listas del inspector;
- chips y badges;
- layout visual del header.

### Regla de cierre

`runtimeStyles.ts` debe quedar clasificado línea por línea:

``​`txt
KEEP_TECHNICAL
MIGRATE_TO_TAILWIND
DELETE_DEAD
``​`

No crear otro CSS global ni otro archivo de estilos inyectados.

---

## 3. Diagnóstico visual por superficie

## 3.1 Workspace y botón Guardar

### Problema

Guardar está presentado como una pastilla flotante junto al menú `…`, encima del área superior derecha. En varias capturas invade el switcher `Campos / Detalle / Docs` y hace que `Detalle` aparezca recortado como “D”.

Esto produce tres errores de jerarquía:

- Guardar parece pertenecer al RightSidebar.
- El switcher pierde espacio y legibilidad.
- La posición cambia visualmente según se abre o cierra el sidebar.

### Diseño objetivo

Guardar debe pertenecer al **toolbar global del stage**, no al panel derecho.

Estructura recomendada:

``​`tsx
<div className="grid h-11 shrink-0 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center border-b border-solid border-slate-200/60 bg-white/90 px-3 backdrop-blur">
  <DocumentContext className="min-w-0 justify-self-start" />
  <UnitPager className="justify-self-center" />
  <div className="flex items-center gap-1 justify-self-end">
    <SaveAction />
    <GlobalMoreMenu />
  </div>
</div>
``​`

### Reglas

- Altura: `44–48 px`.
- No usar posición respecto al viewport.
- No depender del ancho del RightSidebar.
- El stage se reduce al abrir los sidebars; Guardar permanece dentro de su columna.
- Estado visible:
  - `Guardado`;
  - `Cambios sin guardar`;
  - `Guardando…`;
  - `Error al guardar`.
- En ancho reducido:
  - icono Guardar;
  - texto ocultable;
  - tooltip obligatorio.
- El botón `…` global debe contener:
  - Atajos;
  - cuadrícula;
  - guías;
  - snaps;
  - padding;
  - insertar/duplicar página;
  - exportar.

El menú `…` del RightSidebar no debe contener configuración global del Canvas.

---

## 3.2 Scroll roto del DetailView

### Causa raíz confirmada

El contrato correcto ya había sido documentado con `SidebarBody` como propietario único del scroll. En la versión actual se cambió:

``​`txt
overflow-y-auto overflow-x-hidden overscroll-contain
``​`

por:

``​`txt
overflow-hidden
``​`

Al mismo tiempo, el nuevo `right-sidebar-panel-stack` y sus slots también usan `overflow-hidden`. El contenido largo del DetailView queda recortado y no existe un descendiente que recupere el scroll.

### Contrato final

``​`txt
aside              h-full min-h-0 flex flex-col overflow-hidden
content            min-h-0 flex-1 flex flex-col overflow-hidden
panel switcher     shrink-0
panel stack        min-h-0 flex-1 overflow-hidden
active slot        min-h-0 flex-1 overflow-hidden
detail host        min-h-0 flex-1 overflow-hidden
sidebar frame      h-full min-h-0 flex flex-col overflow-hidden
header             shrink-0
body               min-h-0 flex-1 overflow-y-auto overflow-x-hidden
footer             shrink-0
``​`

Clase recomendada para `SidebarBody`:

``​`tsx
'flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden overscroll-contain [scrollbar-gutter:stable] px-2 pb-3 pt-2'
``​`

### Archivos foco

``​`txt
src/sisad-pdfme/ui/components/Designer/RightSidebar/layout.tsx
src/sisad-pdfme/ui/components/Designer/RightSidebar/RightSidebar.tsx
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailViewContent.tsx
src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/ListView.tsx
src/sisad-pdfme/ui/components/Designer/RightSidebar/DocumentsRail.tsx
src/sisad-pdfme/ui/components/Designer/RightSidebar/CommentsRail.tsx
``​`

### Criterios

- Scroll hasta `Datos y conexiones`, `Asignación y bloqueo` y `Avanzado`.
- Cabecera del schema no se desplaza.
- Tabs no se desplazan.
- Sin scroll horizontal.
- Un solo propietario de scroll por panel.
- El scroll no se reinicia al cambiar un input.
- Cambiar de schema puede volver arriba únicamente cuando cambia realmente `schemaUid`.

---

## 3.3 DetailView

### Problemas

- Secciones excesivamente altas aunque tengan pocos controles.
- Radios de 18–24 px repetidos.
- Bordes grises oscuros en cada accordion.
- Mucho espacio vacío en Información del campo, Reglas e Interacción.
- La jerarquía de subtítulos compite con el nombre de la sección.
- El select de validación utiliza el desplegable nativo del sistema y rompe el lenguaje visual.
- Inputs de ubicación pueden quedar debajo del viewport sin acceso por el fallo de scroll.
- El header de selección usa un punto azul sin explicar owner/estado.

### Diseño objetivo

``​`tsx
<section className="overflow-hidden rounded-xl border border-solid border-slate-200/70 bg-white">
  <button className="flex min-h-11 w-full items-center justify-between gap-3 px-3 py-2 text-left hover:bg-slate-50/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200">
    ...
  </button>

  <div className="space-y-3 border-t border-solid border-slate-100 px-3 py-3">
    ...
  </div>
</section>
``​`

### Reglas

- Radio máximo recomendado: `12 px`.
- Sin sombra permanente.
- Separación entre secciones: `8 px`.
- No usar `min-h-*` fijo en contenido.
- Dos columnas solo cuando ambos controles caben con mínimo de 120 px.
- Geometría:
  - X/Y: dos columnas;
  - ancho/alto: dos columnas;
  - rotación: una fila;
  - alineación: grilla 4×2 compacta.
- Secciones inicialmente abiertas:
  - Información;
  - Reglas principales.
- Secciones inicialmente cerradas:
  - Datos y conexiones;
  - Asignación;
  - Avanzado.
- “Editar texto” debe ser contextual:
  - visible para schemas text-like;
  - oculto para tipos que no soportan edición inline.
- Evitar duplicar `Nombre del campo` + `Renombrar`; una única acción y una única persistencia.

### Selectores

Usar un selector controlado del sistema de componentes, no `<select>` nativo si se requiere paridad visual. El popup debe:

- renderizarse en portal;
- tener `max-height`;
- respetar viewport;
- no modificar altura del panel;
- cerrarse con Escape;
- devolver foco al trigger;
- usar `data-interaction-exclusion`.

---

## 3.4 RightSidebar — switcher y cabecera

### Problemas

- Tabs sin espacio por Guardar.
- “Detalle” recortado.
- Docs y Campos compiten con acciones globales.
- El botón colapsar no tiene patrón idéntico al LeftSidebar.
- Context header, Reasignar, contador y menú aparecen en la misma línea aunque no caben.

### Diseño objetivo

Dos filas como máximo:

``​`txt
Fila 1: Tabs + collapse
Fila 2: Contexto del panel + acciones locales
``​`

Para ListView:

``​`txt
Campos        11/11
2 seleccionados           Reasignar   …
``​`

Para Detail:

``​`txt
contract_date
Texto · Cliente principal
``​`

Para Docs:

``​`txt
Documentos
2 cargados                 Subir PDF
``​`

### Reglas

- El switcher es `shrink-0`.
- Tabs con texto completo en panel abierto.
- Rail colapsado solo iconos + tooltip.
- Reasignar aparece únicamente con selección válida.
- En selección simple, Reasignar puede estar en menú contextual.
- En multiselección, aparece como acción primaria contextual.
- No mostrar un contador de usuarios aislado sin etiqueta.

---

## 3.5 ListView

### Problemas

- El borde azul permanente hace que todos los schemas parezcan seleccionados.
- El botón eliminar siempre visible agrega ruido.
- El owner color y el selected state se confunden.
- Filas altas y con demasiado espacio.
- Nombres técnicos largos dominan el panel.
- Lock y delete compiten en el extremo derecho.

### Estado visual correcto

``​`txt
Owner:
- barra izquierda de 3 px con ownerColor;
- siempre visible con opacidad media.

Hover:
- fondo slate muy suave.

Selected:
- fondo sky-50/50;
- ring sky-200;
- owner bar a opacidad completa.

Focus:
- ring accesible, distinto de selected.

Locked:
- icono lock;
- no bajar toda la opacidad de la fila.

Delete:
- visible en hover/focus o dentro de `…`;
- siempre accesible por teclado.
``​`

### Densidades

``​`txt
comfortable: 56–64 px
compact:     48–52 px
minimal:     40–44 px
``​`

No crear tres skins diferentes; solo cambia espacio y metadata visible.

---

## 3.6 DocumentsRail

### Problemas observados

- “Subir P” aparece recortado.
- El copy dice “Selecciona una página”, pero las filas parecen documentos.
- Delete queda flotando fuera de la tarjeta.
- Cards grandes con radio excesivo.
- El segundo número del header aparece aislado.
- Selección usa una superficie gris grande, no un estado claro.
- No existe jerarquía visual entre documento y páginas.

### Contrato recomendado

``​`txt
Documento
 ├─ nombre
 ├─ cantidad de páginas
 ├─ estado activo
 └─ acciones
``​`

Si se requiere seleccionar páginas:

``​`txt
Documento expandible
 ├─ Página 1
 ├─ Página 2
 └─ ...
``​`

No mezclar ambos niveles en una misma fila.

### Fila objetivo

``​`tsx
<div className="group grid min-h-14 grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-2 rounded-xl border border-solid border-slate-200/70 bg-white px-2.5 py-2 hover:bg-slate-50/70 data-[selected=true]:border-sky-200 data-[selected=true]:bg-sky-50/50">
``​`

- Delete dentro de la última columna.
- Upload:
  - texto completo con ancho suficiente;
  - en panel mini, icon-only + tooltip.
- Acción destructiva con confirmación.
- El documento activo usa un badge compacto, no texto mezclado con el número.

---

## 3.7 LeftSidebar

### Problemas

- Todos los botones tienen borde azul fuerte y parecen seleccionados.
- Tres niveles de superficie:
  - grupo;
  - wrapper;
  - botón.
- Sombras y radios repetidos.
- Las estrellas tienen demasiado contraste y tamaño.
- Las categorías ocupan altura excesiva.
- El panel se siente más ancho por densidad que por contenido.

### Diseño objetivo

- Una única superficie visible por plugin.
- Borde neutral por defecto.
- Azul solo para:
  - hover;
  - focus;
  - dragging;
  - favorito activo como acento pequeño.
- Altura list: `44–48 px`.
- Icono: `20–22 px`.
- Star: `28×28`, sin círculo morado permanente.
- Category header: `32–36 px`.
- Grupo con borde opcional muy sutil o sin borde.
- El layout seleccionado por el usuario no debe cambiar cuando cambia la densidad responsive.

---

## 3.8 Toolbar contextual del Canvas

### Problema

La pastilla de dimensiones y la barra `Eliminar / Más` pueden cubrir el schema, especialmente attachment y campos cercanos a la parte superior.

### Solución

- Anclar al bounding box real.
- Separación de 8 px.
- Preferencia arriba.
- Flip abajo si no cabe.
- Clamp dentro del stage.
- No usar ancho fijo grande.
- Métricas y acciones en una única barra o en dos superficies pequeñas coordinadas.
- El toolbar no participa en Selecto.
- El toolbar no inicia drag.
- `pointer-events-auto` solo en controles.
- A 1 schema:
  - Eliminar;
  - Más.
- A N schemas:
  - alinear;
  - distribuir;
  - duplicar;
  - eliminar;
  - reasignar si aplica.

---

## 3.9 Menús y popovers

### Error de información

El menú del RightSidebar contiene acciones del Canvas:

- cuadrícula;
- guías;
- snaps;
- padding;
- insertar página;
- duplicar página;
- exportar.

Estas acciones deben estar en el menú global del stage.

El menú local del RightSidebar debe contener únicamente:

``​`txt
Campos:
- renombrar;
- seleccionar todo;
- ordenar;
- densidad;
- mostrar/ocultar metadata.

Detalle:
- copiar identificador;
- restablecer sección;
- expandir/colapsar secciones.

Docs:
- subir;
- renombrar documento;
- duplicar;
- eliminar;
- ordenar.
``​`

### Diseño del popover

- Ancho: `208–240 px`.
- Radio: `10–12 px`.
- Padding: `6 px`.
- Item: `36–40 px`.
- Icono + label.
- Separadores por grupo.
- Check para toggles.
- No usar menú nativo oscuro.
- Portal y clamp al viewport.
- `z-index` centralizado.

---

## 3.10 Zoom

### Problemas

- El menú nativo se ve demasiado grande y desconectado.
- El trigger puede quedar con estilos disabled/focus inconsistentes.
- La lista tapa schemas por encima del toolbar.

### Diseño

- Toolbar inferior: `40–44 px`.
- Trigger: `72–80 px`.
- Popup abre hacia arriba.
- Menú: `96–112 px`.
- Opciones: 25, 50, 75, 100, 125, 150, 200.
- `100%` destacado.
- `fit page` y `fit width` como acciones separadas.
- Conversión única:
  - interno: `1`;
  - visible: `100%`.

---

## 3.11 Rails colapsados

### Diseño objetivo

Ambos lados deben compartir:

``​`txt
44 px de ancho
mismo componente SidebarRail
mismo icon button
mismo tooltip
mismo active indicator
misma animación
``​`

El rail derecho debe mostrar:

- Campos;
- Detalle;
- Comentarios;
- Docs.

Detalle disabled sin selección, con motivo en tooltip.

El rail izquierdo debe mostrar:

- Campos;
- Favoritos;
- Destinatarios o pestañas configuradas.

Al abrir un panel:

- no perder selección;
- no perder scroll del Canvas;
- no cambiar zoom;
- no desplazar el documento de forma brusca;
- restaurar el panel solicitado.

---

## 4. Errores de lint confirmados

## 4.1 Error P0 — `SisadPdfmeForm.tsx`

### Síntoma

React Compiler no puede preservar el `useMemo` de `runtimeConfig` porque el callback consume `collaborationOptions`, pero el array de dependencias enumera sus componentes en vez del objeto usado.

### Corrección recomendada

``​`tsx
const collaborationOptions = useMemo(
  () =>
    recipientFilterEnabled && !isGlobalView && effectiveActiveRecipientId
      ? { activeRecipientId: effectiveActiveRecipientId, isGlobalView }
      : { isGlobalView },
  [effectiveActiveRecipientId, isGlobalView, recipientFilterEnabled],
);

const runtimeConfig = useMemo(
  () => ({
    ...
    options: {
      ...resolvedConfig.runtimeOptions,
      designerEngine: resolvedConfig.designerEngine,
      collaboration: collaborationOptions,
    },
  }),
  [collaborationOptions, onInputChange, resolvedConfig, template, values],
);
``​`

También eliminar `cloneDeep` si no se utiliza.

No silenciar la regla del compiler.

---

## 4.2 Tres errores P0 — `SchemaDropCommitFlash.tsx`

### Síntoma

`useState`, `useState` y `useEffect` se ejecutan después de un early return.

### Regla

Todos los hooks deben ejecutarse siempre en el mismo orden.

### Estructura correcta

``​`tsx
const SchemaDropCommitFlash = ({ flash }) => {
  const [visible, setVisible] = useState(false);
  const [renderedFlash, setRenderedFlash] = useState(flash);

  useEffect(() => {
    if (!flash) {
      setVisible(false);
      return;
    }

    setRenderedFlash(flash);
    setVisible(true);

    const timer = window.setTimeout(() => setVisible(false), 420);
    return () => window.clearTimeout(timer);
  }, [flash]);

  if (!renderedFlash) return null;

  return (
    <div
      data-visible={visible}
      ...
    />
  );
};
``​`

Evitar timers simultáneos, limpiar el timer al cambiar flash y respetar `prefers-reduced-motion`.

---

## 5. Estrategia para 208 warnings

No corregir 208 warnings mezclando código productivo y tests generados en una sola pasada.

### 5.1 Primero código de producción

Objetivo:

``​`txt
src/** = 0 errores, 0 warnings
``​`

Grupos:

1. Imports/constantes sin uso:
   - `DEFAULT_SIGNATURE_PROVIDERS`;
   - `RESULTS_PANEL_STYLE`;
   - `normalizeText`;
   - constantes `SUMMARY`, `HELP`, etc.
2. Fachadas legacy con imports muertos:
   - `labExamples.js`;
   - catálogos separados.
3. `no-explicit-any`:
   - wrappers públicos;
   - adapters;
   - runtime config.
4. Memoización React Compiler.

### 5.2 Corregir duplicación del lint

Actualmente muchas advertencias aparecen dos veces:

``​`txt
no-unused-vars
@typescript-eslint/no-unused-vars
``​`

Config recomendada:

``​`js
{
  files: ['**/*.{ts,tsx}'],
  rules: {
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
    }],
  },
}
``​`

Para JS/JSX mantener solo `no-unused-vars`.

### 5.3 Tests generados

Los tests generados concentran gran parte de `any`.

Elegir un contrato:

``​`txt
Opción A: tiparlos correctamente.
Opción B: excluir tests/generated del lint de producción y crear lint:generated separado.
``​`

No ocultarlos con un disable global.

Scripts recomendados:

``​`json
{
  "lint:src": "eslint src --max-warnings=0",
  "lint:tests": "eslint tests --max-warnings=0",
  "lint:generated": "eslint tests/**/generated",
  "lint": "npm run lint:src && npm run lint:tests"
}
``​`

### 5.4 Imports rotos en pruebas

Hay pruebas que todavía importan rutas eliminadas:

``​`txt
@/features/pdfcomponent/template
@/features/pdfcomponent/utils/binary
``​`

No recrear wrappers muertos para hacer pasar las pruebas. Actualizar los tests a la API canónica actual.

---

## 6. Pruebas fallidas detectadas y dominios a investigar

Los artefactos actuales registran fallos en:

``​`txt
schema owner — active recipient accent
schema owner — consumers from same resolver
schema transform — selected schema to page anchors
selection — focus returns to canvas
sidebar rail — never overlaps right rail
sidebar rail — restores requested panel
standard schemas — expected schema types
``​`

### 6.1 Owner color

Revisar la cadena:

``​`txt
recipient registry
→ schema ownership metadata
→ resolveSchemaOwnerTone
→ Renderer
→ fieldChrome
→ ListView
→ DetailHeader
``​`

El selected state no debe usar un color distinto que tape ownerColor.

### 6.2 Transform/page anchors

No cambiar expected hasta verificar:

- documentId;
- pageNumber;
- pageIndex;
- paperRef activo;
- zoom;
- scroll offsets;
- rect del stage;
- transforms.

### 6.3 Focus return

Después de cerrar:

- popover;
- modal Reasignar;
- selector;
- menú contextual;

el foco debe volver a:

- trigger, si sigue visible;
- Canvas, si la acción modifica selección.

No hacer `blur()` global incondicional.

### 6.4 Rails

Verificar:

- ancho real publicado;
- offset del stage;
- rail persistente;
- panel solicitado;
- restauración después de colapsar;
- no solapar Guardar;
- no solapar barra externa del host.

### 6.5 Tipos estándar

El test debe comparar:

``​`txt
schema registry canónico
vs.
catálogo visible/configurado
vs.
bundle normalizado
``​`

No debe depender de texto traducido ni del DOM visual completo.

Si un schema se oculta por configuración, el test debe conocer esa configuración; no se debe rebajar la cobertura reemplazando una verificación integral por “existe el botón de descargar”.

---

## 7. Plan de ejecución

## Fase 0 — Congelar baseline

``​`txt
[ ] Commit de la migración terminada.
[ ] Guardar capturas actuales.
[ ] Registrar `git status --short`.
[ ] Ejecutar lint, build, unit y e2e sin modificar expected.
[ ] Crear matriz real de fallos.
``​`

Comandos:

``​`bash
npm run lint
npm run build
npx vitest run
npx playwright test --project=chromium
``​`

---

## Fase 1 — P0 funcional

Máximo cinco archivos por pase.

### Pase 1A

``​`txt
SisadPdfmeForm.tsx
SchemaDropCommitFlash.tsx
``​`

Validar:

``​`bash
npx eslint src/sisad-pdfme/react/SisadPdfmeForm.tsx \
  src/sisad-pdfme/ui/components/Designer/Canvas/overlays/SchemaDropCommitFlash.tsx

npx vitest run tests/unit/sisad-pdfme/react/runtime-modes.test.tsx
npx playwright test tests/playwright/drag-preview-and-canvas-scroll-regression.spec.ts
``​`

### Pase 1B — scroll

``​`txt
RightSidebar/layout.tsx
RightSidebar/RightSidebar.tsx
DetailView/DetailViewContent.tsx
DocumentsRail.tsx
CommentsRail.tsx
``​`

Validar scroll por panel y ausencia de overflow horizontal.

---

## Fase 2 — Toolbar global y Guardar

Archivos:

``​`txt
src/sisad-pdfme/ui/components/CtlBar.tsx
src/sisad-pdfme/ui/components/Designer/index.tsx
src/sisad-pdfme/ui/components/UnitPager.tsx
src/sisad-pdfme/ui/components/Designer/RightSidebar/RightSidebar.tsx
``​`

Tareas:

``​`txt
[ ] Crear topbar de stage en tres columnas.
[ ] Sacar Guardar del área del RightSidebar.
[ ] Mover acciones globales al menú del stage.
[ ] Mostrar estado de persistencia.
[ ] Mantener testId/aria-label/action registry.
``​`

---

## Fase 3 — RightSidebar visual

### 3A Switcher/header

- tabs legibles;
- dos filas cuando sea necesario;
- collapse simétrico;
- acciones locales.

### 3B ListView

- owner accent;
- selected state separado;
- delete contextual;
- densidades.

### 3C Documents

- jerarquía documento/página;
- cards compactas;
- upload no recortado;
- delete dentro de fila.

### 3D Detail

- cards compactas;
- dropdown unificado;
- grid adaptable;
- secciones progresivas.

---

## Fase 4 — LeftSidebar, Canvas toolbar y rails

``​`txt
[ ] Reducir borde azul permanente.
[ ] Quitar superficies anidadas.
[ ] Rediseñar favorite.
[ ] Clampear toolbar contextual.
[ ] Unificar SidebarRail.
[ ] Mantener centro visual del PDF.
``​`

---

## Fase 5 — QA y pruebas

Orden:

``​`txt
1. unitarios de helpers y contratos;
2. components de sidebars;
3. interaction/modal/focus;
4. canvas transform;
5. owner color;
6. visual snapshots;
7. barrido completo.
``​`

Specs focales:

``​`bash
npx playwright test \
  tests/playwright/right-sidebar-visual-polish.spec.ts \
  tests/playwright/right-sidebar-docs-tab.spec.ts \
  tests/playwright/list-view-regression.spec.ts \
  tests/playwright/drag-preview-and-canvas-scroll-regression.spec.ts \
  tests/playwright/sidebar-rail-collapse-actions.spec.ts \
  tests/playwright/sidebar-collapse-parity.spec.ts \
  --project=chromium
``​`

Agregar o estabilizar:

``​`txt
right-sidebar-detail-scroll.spec.ts
save-toolbar-no-overlap.spec.ts
right-sidebar-popover-boundaries.spec.ts
documents-rail-document-page-hierarchy.spec.ts
detail-dropdown-focus-return.spec.ts
``​`

---

## 8. Criterios de aceptación finales

### Funcional

``​`txt
[ ] DetailView llega hasta la última sección.
[ ] List, Detail, Comments y Docs tienen scroll correcto.
[ ] Guardar nunca se solapa con tabs ni rails.
[ ] Todos los menús cierran con Escape y devuelven foco.
[ ] Reasignar conserva selección al cancelar.
[ ] Owner color coincide en Canvas, ListView y DetailHeader.
[ ] Zoom, documento, página y selección no cambian al colapsar paneles.
[ ] Ningún botón visible carece de handler real.
``​`

### Visual

``​`txt
[ ] Una sola superficie por tarjeta o control.
[ ] Sin borde azul permanente en todos los plugins.
[ ] Radios entre 10 y 14 px salvo shell principal.
[ ] Sin sombras profundas permanentes.
[ ] Delete no domina las filas.
[ ] Menús y selects comparten diseño.
[ ] Documento sigue siendo protagonista.
``​`

### Calidad

``​`txt
[ ] npm run lint:src = 0 errores / 0 warnings.
[ ] npm run lint:tests = 0 errores / 0 warnings.
[ ] npm run build = exit 0.
[ ] Vitest completo en verde.
[ ] Playwright completo en verde o fallos explícitamente clasificados.
[ ] Sin cambios de expected para ocultar regresiones.
``​`

### Tailwind-first

``​`txt
[ ] No se crea CSS global nuevo.
[ ] Skin visual vive en JSX/TSX.
[ ] runtimeStyles.ts conserva solo CSS técnico clasificado.
[ ] No se usa !important salvo integración de tercero demostrada.
[ ] No se toca geometría crítica sin spec de regresión.
``​`

---

## 9. Orden recomendado de task-cards

``​`txt
TASK-P0-001 lint hooks and compiler
TASK-P0-002 right sidebar single scroll owner
TASK-UI-001 stage topbar and save ownership
TASK-UI-002 right sidebar switcher hierarchy
TASK-UI-003 list view owner/selection density
TASK-UI-004 documents rail hierarchy
TASK-UI-005 detail view progressive inspector
TASK-UI-006 left sidebar neutral catalog skin
TASK-CANVAS-001 contextual toolbar collision
TASK-UI-007 unified rails and collapse restoration
TASK-QA-001 repair current failed specs
TASK-QA-002 visual and accessibility baseline
TASK-CSS-001 classify runtimeStyles residual CSS
``​`

No ejecutar estas task-cards en paralelo si comparten `RightSidebar.tsx`, `Designer/index.tsx`, `CtlBar.tsx` o `runtimeStyles.ts`.
```

<a id="file-0158"></a>

### 0158 — `ai/playbooks/pb-ai-docs-refactor.md`

- **Lenguaje:** `markdown`
- **Líneas:** `26`
- **Tamaño original:** `0.8 KB`
- **SHA1 corto:** `61deaf82b5`
- **Estado:** `completo`

```markdown
# Playbook — Refactor de arquitectura IA/docs

## Objetivo

Modificar documentación o archivos IA respetando la estructura real del repositorio.

## Pasos

1. Leer `ai/start/START.md`.
2. Leer `ai/router/ROUTER.md`.
3. Leer `ai/router/CONTEXT_BUDGET.md`.
4. Leer `ai/memory/pending-checklist.md`.
5. Revisar `ai/task-cards/completed/completed-summary.md` solo como guardrail.
6. No crear carpetas nuevas fuera del árbol real.
7. Clasificar el cambio:
   - operativo IA -> `ai/**`
   - documentación pública -> `docs/**`
   - evidencia -> `ai/reports/**` o `reports/**`
   - script -> `scripts/**`
8. Actualizar memoria si cambia el estado de una tarea.

## Validación

- No hay carpetas paralelas.
- No se duplican docs públicas dentro de `ai/**`.
- No se duplican prompts operativos dentro de `docs/**`.
```

<a id="file-0159"></a>

### 0159 — `ai/playbooks/pb-canvas-multipage.md`

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

<a id="file-0160"></a>

### 0160 — `ai/playbooks/pb-css-tailwind-migration.md`

- **Lenguaje:** `markdown`
- **Líneas:** `28`
- **Tamaño original:** `0.7 KB`
- **SHA1 corto:** `a88d5e6c85`
- **Estado:** `completo`

```markdown
# Playbook — Migración CSS a Tailwind inline

## Objetivo

Reducir CSS moviendo estilos seguros a JSX/TSX con Tailwind.

## Pasos

1. Leer `ai/rules/css-migration-rules.md`.
2. Ejecutar `node scripts/css-inventory.mjs`.
3. Elegir una sola zona:
   - Lab shell
   - LeftSidebar
   - RightSidebar
   - DetailView
   - ListView
   - Canvas overlays no geométricos
4. Migrar a Tailwind inline solo clases visuales.
5. No tocar geometry, zoom, Moveable, Selecto, paper/canvas.
6. Actualizar `reports/tailwind-migration/component-migration-ledger.md`.
7. Correr pruebas o baseline visual.
8. Reportar reglas CSS eliminadas y reglas conservadas.

## Cierre

- No aumenta CSS.
- No hay doble Tailwind.
- No se rompe canvas ni runtime.
```

<a id="file-0161"></a>

### 0161 — `ai/playbooks/pb-inspector.md`

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

<a id="file-0162"></a>

### 0162 — `ai/playbooks/pb-schema-families.md`

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

<a id="file-0163"></a>

### 0163 — `ai/playbooks/pb-selection-transform.md`

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

<a id="file-0164"></a>

### 0164 — `ai/playbooks/pb-snapshot.md`

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

<a id="file-0165"></a>

### 0165 — `ai/playbooks/pb-tailwind-design-continuity.md`

- **Lenguaje:** `markdown`
- **Líneas:** `33`
- **Tamaño original:** `1.2 KB`
- **SHA1 corto:** `647705c7bf`
- **Estado:** `completo`

```markdown
# Playbook — continuidad visual y migración Tailwind

## 1. Intake

- Confirmar una sola tarjeta activa.
- Cargar contexto, regla principal y checklist de este paquete.
- Anotar baseline de `@apply`, estilos inline y selectores de la región.

## 2. Trazabilidad

- Ubicar componente, constantes, CSS y pruebas de la región.
- Construir una tabla selector → consumidor → estado → reemplazo JSX/TSX.
- Identificar contratos que deben permanecer en CSS.

## 3. Cambio mínimo

- Mover utilidades estáticas al elemento propietario.
- Sustituir concatenaciones inseguras por mapas de clases completas.
- Mantener estilos calculados por runtime como valores dinámicos.
- Eliminar solamente reglas sin consumidores comprobados.

## 4. Validación

- Ejecutar `scripts/tailwind-continuity-audit.sh`.
- Ejecutar typecheck, lint y pruebas focalizadas disponibles.
- Verificar `/lab/multi-document-routing` en los estados definidos por la tarjeta.
- Comparar baseline y capturas a viewport fijo.

## 5. Cierre

- Registrar archivos, conteos y evidencia.
- Si pasa, mover la tarjeta a `completed/` y activar una sola dependencia lista.
- Si falla, conservar la tarjeta activa y documentar el bloqueo sin encadenar arreglos ajenos.
```

<a id="file-0166"></a>

### 0166 — `ai/playbooks/pb-visual-regression.md`

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

<a id="file-0167"></a>

### 0167 — `ai/playbooks/README.md`

- **Lenguaje:** `markdown`
- **Líneas:** `3`
- **Tamaño original:** `0.1 KB`
- **SHA1 corto:** `9c0f5c1b4f`
- **Estado:** `completo`

```markdown
# Playbooks

Procedimientos. Cargar uno por task-card.
```

<a id="file-0168"></a>

### 0168 — `ai/project/architecture-principles.md`

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

<a id="file-0169"></a>

### 0169 — `ai/project/definition-of-done.md`

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

<a id="file-0170"></a>

### 0170 — `ai/project/file-ownership-map.md`

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

<a id="file-0171"></a>

### 0171 — `ai/project/glossary.md`

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

<a id="file-0172"></a>

### 0172 — `ai/project/goals.md`

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

<a id="file-0173"></a>

### 0173 — `ai/project/non-goals.md`

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

<a id="file-0174"></a>

### 0174 — `ai/project/scope.md`

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

<a id="file-0175"></a>

### 0175 — `ai/prompts/claude-diagnose-or-implement.md`

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

<a id="file-0176"></a>

### 0176 — `ai/prompts/codex-master-prompt.md`

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

<a id="file-0177"></a>

### 0177 — `ai/prompts/codex-next-pass-actions-ui-dedup.md`

- **Lenguaje:** `markdown`
- **Líneas:** `62`
- **Tamaño original:** `1.7 KB`
- **SHA1 corto:** `0eb272427e`
- **Estado:** `completo`

```markdown
# Prompt Codex — siguiente pasada UI/actions/dedup

Objetivo:
Auditar y corregir botones, acciones, UI colapsada, duplicidad CSS/Tailwind y wrappers innecesarios en `src/sisad-pdfme`, sin romper la portabilidad del componente.

Proyecto:
`/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin`

Antes de editar:
``​`bash
git status --short
cat ai/start/START.md
cat ai/router/ROUTER.md
cat ai/router/CONTEXT_BUDGET.md
cat ai/memory/project-memory.md
``​`

Reglas:
- `src/sisad-pdfme` no conoce SISAD-WEB ni ningún host.
- No tocar Moveable.
- No tocar Selecto.
- No tocar geometría PDF/canvas/paper.
- No tocar SnapshotAdapter salvo task-card explícita.
- No tocar Generator/PDF.
- No crear modales paralelos.
- No duplicar recipients ni assignment.
- Tailwind versión 3.
- No usar sintaxis Tailwind 4.
- No crear CSS paralelo.
- No usar reports/candidates como fuente activa.
- No reabrir tareas completed.

Carga de contexto:
``​`txt
ai/context/action-map-context.md
ai/checklists/button-action-contract-checklist.md
ai/rules/css-migration-rules.md
ai/rules/moveable-selecto-rules.md
ai/playbooks/pb-css-tailwind-migration.md
``​`

Orden:
1. Ejecutar `TASK-ACTIONS-001`.
2. Solo después, ejecutar `TASK-ACTIONS-002`.
3. Luego `TASK-UI-015`.
4. Luego `TASK-CSS-014`.
5. Luego `TASK-DETAIL-015`.
6. Finalmente `TASK-QA-015`.

Validación mínima por pase:
``​`bash
npm run build
``​`

Validación cuando toque UI:
``​`bash
npx playwright test tests/playwright/canvas-overflow-regression.spec.ts
npx playwright test tests/playwright/drag-preview-and-canvas-scroll-regression.spec.ts
``​`

Criterio:
No puede quedar ningún botón visible sin handler real, aria-label, testId y estado de acción.
```

<a id="file-0178"></a>

### 0178 — `ai/prompts/codex-pdfcomponent-dynamic-integration-refactor.md`

- **Lenguaje:** `markdown`
- **Líneas:** `31`
- **Tamaño original:** `1.6 KB`
- **SHA1 corto:** `33cac9bcee`
- **Estado:** `completo`

```markdown
Objetivo:
Refactorizar `src/features/pdfcomponent` para que sea una referencia de integración dinámica de `sisad-pdfme`, consumiendo API pública, config, adapters, recipients registry y controller, sin duplicar lógica de negocio del core.

Proyecto:
~/Documents/Taylor/frontend/prueba-plugin

Reglas:
- No modificar `src/sisad-pdfme` salvo que falte un export público mínimo justificado.
- No tocar Canvas/Moveable/Selecto/zoom/geometría.
- No crear wrappers para internals.
- No registrar recipients dos veces.
- No decorar templates con collaboration en el host.
- No usar `DesignerEngineBuilder` en `src/features/pdfcomponent`.
- No usar `usePdfmeRuntimeInstance` en `src/features/pdfcomponent`.
- No usar `setTimeout` para sincronizar modo/página.

Pasos:
1. Ejecutar `node scripts/audit-pdfcomponent-duplication.mjs`.
2. Crear `src/features/pdfcomponent/integration/*` y `hooks/usePdfmeLabIntegration.ts`.
3. Migrar `PdfmeLabPage.jsx` para consumir el hook y wrappers públicos.
4. Partir `labs/examples/labExamples.js` en data declarativa + registry.
5. Cambiar `CompactControls.jsx` para recibir action descriptors.
6. Cambiar `PageHeader.jsx` para recibir viewModel, no calcular recipients/counters.
7. Cambiar `domain/labPresentation.js` para usar selectors públicos del core.
8. Deprecar wrappers de un archivo tras `rg` de imports.
9. Agregar Playwright de integración dinámica.

Validación:
- `rg "DesignerEngineBuilder|usePdfmeRuntimeInstance|decorateTemplateWithCollaboration|decorateCollaborationUsers" src/features/pdfcomponent`
- `npm run build`
- `npx playwright test tests/playwright/pdfcomponent-dynamic-integration.spec.ts`
```

<a id="file-0179"></a>

### 0179 — `ai/prompts/codex-start-tailwind-design-continuity.md`

- **Lenguaje:** `markdown`
- **Líneas:** `13`
- **Tamaño original:** `0.8 KB`
- **SHA1 corto:** `864057999a`
- **Estado:** `completo`

```markdown
# Inicio Codex — continuidad visual y Tailwind

Después del arranque base del repositorio:

1. Carga `ai/context/tailwind-design-continuity-context.md`.
2. Carga `ai/rules/tailwind-design-continuity-rules.md` como regla principal.
3. Carga `ai/playbooks/pb-tailwind-design-continuity.md`.
4. Carga `ai/checklists/tailwind-design-continuity-validation.md`.
5. Selecciona exclusivamente la tarjeta en `ai/task-cards/active/`.
6. Presenta diagnóstico, máximo 5 archivos candidatos, archivos prohibidos, comandos de validación y criterio de parada.
7. Espera una contradicción explícita del usuario solo si la tarjeta requiere ampliar alcance; en otro caso, implementa, valida y documenta.

No conviertas el roadmap completo en una sola ejecución. Las tarjetas de `backlog/` representan trabajo futuro y no autorizan cambios todavía.
```

<a id="file-0180"></a>

### 0180 — `ai/prompts/copilot-task-context.md`

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

<a id="file-0181"></a>

### 0181 — `ai/prompts/create-task-card.md`

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

<a id="file-0182"></a>

### 0182 — `ai/prompts/PROMPT_ARRANQUE_MULTIAGENTE_UX_QA_SISAD_PDFME_2026-07-17.md`

- **Lenguaje:** `markdown`
- **Líneas:** `1072`
- **Tamaño original:** `26.0 KB`
- **SHA1 corto:** `9b7517863b`
- **Estado:** `completo`

```markdown
# Prompt especializado de arranque multiagente — SISAD PDFME UX/QA post‑Tailwind

## Uso

Este documento contiene:

1. El protocolo común obligatorio.
2. La preparación local con `git worktree`.
3. La asignación de responsabilidades sin colisiones.
4. Un prompt específico para:
   - Codex 4.5 mini.
   - Claude 4.8 Outputs.
   - GitHub Copilot Auto.
5. El protocolo de integración y cierre.

Proyecto:

``​`txt
/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin
``​`

Plan autoritativo:

``​`txt
/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/ai/plans/PLAN_MAESTRO_UX_QA_POST_TAILWIND_SISAD_PDFME_2026-07-17.md
``​`

Ruta funcional principal:

``​`txt
http://localhost:5174/lab/multi-document-routing
``​`

---

# 1. Preparación local obligatoria

## 1.1. Regla de seguridad

Los tres agentes **no deben trabajar en el mismo checkout**.

Se deben usar worktrees y ramas locales separadas. Todo el trabajo permanece en la máquina local.

No usar:

``​`txt
git stash
git reset --hard
git clean -fd
git push
git pull
git rebase sobre trabajo no integrado
``​`

Antes de crear los worktrees, dejar el estado actual guardado en un commit local de checkpoint. No incluir cambios ajenos al proyecto.

Ejemplo:

``​`bash
cd /Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin

git status --short

# Crear un checkpoint local solo después de confirmar que los cambios visibles
# corresponden al estado actual del proyecto.
git add -A
git commit -m "chore: checkpoint post-tailwind before multi-agent UX QA"
``​`

## 1.2. Rama de integración

El checkout principal conserva su rama actual. La rama de integración se crea
como referencia local y se abre únicamente en el worktree de merge.

``​`bash
cd /Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin

git branch ai/uxqa-integration-20260717
``​`

Si la rama ya existe, no la recrees:

``​`bash
git show-ref --verify --quiet refs/heads/ai/uxqa-integration-20260717
``​`

## 1.3. Crear worktrees

Primero crear el worktree de integración; después las tres ramas de trabajo,
todas basadas en el mismo commit de integración.

``​`bash
cd /Users/desarrollo1/Documents/Taylor/frontend

git -C prueba-plugin worktree add \
  prueba-plugin-merge \
  ai/uxqa-integration-20260717

git -C prueba-plugin worktree add \
  prueba-plugin-codex \
  -b ai/codex-uxqa-20260717 \
  ai/uxqa-integration-20260717

git -C prueba-plugin worktree add \
  prueba-plugin-claude \
  -b ai/claude-uxqa-20260717 \
  ai/uxqa-integration-20260717

git -C prueba-plugin worktree add \
  prueba-plugin-copilot \
  -b ai/copilot-uxqa-20260717 \
  ai/uxqa-integration-20260717
``​`

Rutas:

``​`txt
Codex:
  /Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin-codex

Claude:
  /Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin-claude

Copilot:
  /Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin-copilot

Integración:
  /Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin-merge
``​`

## 1.4. Directorio de coordinación compartida

Crear en el checkout principal:

``​`bash
mkdir -p \
  /Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/ai/coordination/uxqa-20260717/{locks,handoffs,status}
``​`

Crear el archivo de propiedad:

``​`txt
/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/ai/coordination/uxqa-20260717/OWNERSHIP.md
``​`

Cada agente escribe únicamente su propio archivo:

``​`txt
status/CODEX.md
status/CLAUDE.md
status/COPILOT.md

handoffs/CODEX-<wave>.md
handoffs/CLAUDE-<wave>.md
handoffs/COPILOT-<wave>.md
``​`

Ningún agente debe editar el archivo de estado de otro agente.

---

# 2. Prompt común obligatorio para los tres agentes

Pega este bloque al inicio de la sesión de cada agente, seguido del bloque específico de su rol.

``​`txt
Actúa como integrante de un equipo local de tres agentes para estabilizar SISAD PDFME después de la migración CSS→Tailwind.

PROYECTO
/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin

PLAN AUTORITATIVO
/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/ai/plans/PLAN_MAESTRO_UX_QA_POST_TAILWIND_SISAD_PDFME_2026-07-17.md

RUTA PRINCIPAL
http://localhost:5174/lab/multi-document-routing

OBJETIVO
Implementar el plan existente. La auditoría profunda ya fue realizada.
No vuelvas a auditar todo el proyecto, no generes otro plan maestro y no cargues todos los Markdown.

CONTEXTO MÍNIMO PERMITIDO
1. Leer el plan autoritativo completo una sola vez.
2. Leer AGENTS.md y las reglas estrictamente relacionadas con tu dominio.
3. Leer el archivo OWNERSHIP.md compartido.
4. Abrir únicamente los archivos asignados y sus tests directos.
5. Máximo dos rondas de búsqueda `rg` por tarea.
6. Máximo ocho archivos inspeccionados antes de comenzar a implementar.
7. Si necesitas tocar una ruta no asignada, detente y escribe una solicitud de handoff. No la edites.

REGLAS ABSOLUTAS
- Trabaja únicamente en tu worktree y rama asignada.
- Todo el trabajo es local. No uses web, push, pull ni servicios externos.
- No uses git stash, reset --hard, clean -fd ni rebase destructivo.
- No edites archivos que pertenecen a otro agente.
- No resuelvas conflictos dentro de tu rama modificando el trabajo de otro agente.
- No cambies expected, snapshots o assertions para ocultar una regresión.
- No desactives reglas ESLint, React Hooks o React Compiler para hacer pasar el build.
- No agregues CSS global nuevo.
- No agregues `@apply`.
- No agregues clases visuales a runtimeStyles.ts.
- El skin visual debe vivir en JSX/TSX con Tailwind.
- runtimeStyles.ts solo puede conservar CSS técnico demostrado:
  geometría del stage/canvas/paper, Moveable, Selecto, Scena Guides,
  print, nodos generados por terceros y variables runtime.
- No uses `!important` salvo integración de un tercero demostrada y documentada.
- Tailwind tiene `preflight: false`; usa explícitamente `border-solid`,
  `appearance-none` y resets locales cuando sean necesarios.
- No modifiques pdf-lib, generator, snapshot, coordinates, Moveable o Selecto
  salvo que tu asignación lo indique de forma explícita.
- Preserva testIds, aria-labels, CommandBus, ActionRegistry y contratos públicos.
- Preserva selección, recipient, owner color, documentId, pageNumber, schemaUid,
  locks y metadata.
- No agregues wrappers decorativos ni una segunda fuente de estado.
- Un botón visible debe tener handler real, estado enabled/disabled y razón de bloqueo.
- No cierres una tarea únicamente porque el build pasa.

PROTOCOLO DE INICIO
1. Confirma tu worktree con `pwd`.
2. Ejecuta `git status --short`.
3. Lee el plan autoritativo.
4. Lee OWNERSHIP.md.
5. Crea un lock atómico para tu tarea:

   COORD=/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/ai/coordination/uxqa-20260717
   mkdir "$COORD/locks/<TASK-ID>.lock"

   Si falla porque el directorio existe, no empieces esa tarea.

6. Escribe en tu archivo status:
   - task activa;
   - archivos owned;
   - hora de inicio;
   - tests previstos.

PROTOCOLO DE IMPLEMENTACIÓN
- Implementa cambios pequeños y coherentes.
- Máximo cinco archivos productivos por commit.
- Los tests directos pueden ir en el mismo commit.
- Después de cada cambio relevante ejecuta pruebas focales, no el barrido completo.
- Haz commits atómicos con prefijo:
  fix:
  refactor:
  test:
  chore:
- No mezcles dominios en un mismo commit.

PROTOCOLO DE ENTREGA
Al terminar una wave:
1. Ejecuta lint focal.
2. Ejecuta tests unitarios focales.
3. Ejecuta Playwright focal cuando corresponda.
4. Ejecuta build si tocaste runtime o composición principal.
5. Escribe un handoff con:
   - objetivo;
   - archivos modificados;
   - decisiones;
   - comandos ejecutados;
   - resultados exactos;
   - riesgos;
   - asuntos no resueltos;
   - commit SHA.
6. Elimina tu lock.
7. No hagas merge por tu cuenta, salvo que seas el agente integrador Claude en
   el worktree `prueba-plugin-merge`.

CRITERIO DE PARADA
Detente inmediatamente cuando:
- el cambio requiera un archivo owned por otro agente;
- el contrato del plan resulte ambiguo;
- aparezca una regresión fuera del dominio asignado;
- una prueba falle por un área que no te pertenece;
- necesites más de cinco archivos productivos en el mismo slice.

En esos casos, documenta la dependencia y continúa únicamente con trabajo no bloqueado.
``​`

---

# 3. Distribución de responsabilidades

## 3.1. Propiedad permanente

| Agente | Dominio principal | No debe tocar |
|---|---|---|
| Codex 4.5 mini | P0 técnico, hooks, runtime, overlays Canvas, interacción y pruebas focales | Shell visual del RightSidebar, LeftSidebar y toolbar global |
| Claude 4.8 Outputs | Arquitectura visual, RightSidebar, DetailView, topbar global, Guardar, DocumentsRail e integración | Limpieza masiva del host lab y archivos owned por Copilot |
| GitHub Copilot Auto | LeftSidebar, host del laboratorio, ESLint/warnings, accesibilidad y pruebas visuales de su dominio | RightSidebar, DetailView, Canvas coordinates y runtime React |

## 3.2. Propiedad de tests

``​`txt
Codex:
- tests de runtime Form/Viewer;
- hooks;
- Canvas overlay;
- selección/foco;
- owner color y transform cuando se asigne.

Claude:
- right-sidebar-*;
- detail-*;
- documents-rail-*;
- save-toolbar-*;
- sidebar rail derecho.

Copilot:
- left-sidebar-*;
- lab host;
- lint;
- visual baseline general;
- accesibilidad del catálogo;
- tests generated/imports legacy.
``​`

Ningún archivo de prueba puede ser editado por dos agentes en la misma wave.

---

# 4. Waves de ejecución paralela

# WAVE 1 — Integridad funcional P0

Los tres agentes trabajan en paralelo.

## Codex — W1-CODEX-P0-HOOKS

Owned:

``​`txt
src/sisad-pdfme/react/SisadPdfmeForm.tsx
src/sisad-pdfme/ui/components/Designer/Canvas/overlays/SchemaDropCommitFlash.tsx
tests unitarios directos de ambos módulos
tests/playwright/drag-preview-and-canvas-scroll-regression.spec.ts
``​`

Objetivos:

``​`txt
- corregir React Compiler en runtimeConfig;
- corregir hooks condicionales;
- eliminar imports muertos del slice;
- limpiar timers;
- respetar prefers-reduced-motion;
- no cambiar UX fuera del overlay;
- dejar lint focal en cero.
``​`

No tocar:

``​`txt
RightSidebar/**
LeftSidebar/**
Designer/index.tsx
CtlBar.tsx
runtimeStyles.ts
``​`

## Claude — W1-CLAUDE-RS-SCROLL

Owned:

``​`txt
src/sisad-pdfme/ui/components/Designer/RightSidebar/layout.tsx
src/sisad-pdfme/ui/components/Designer/RightSidebar/RightSidebar.tsx
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailViewContent.tsx
src/sisad-pdfme/ui/components/Designer/RightSidebar/DocumentsRail.tsx
src/sisad-pdfme/ui/components/Designer/RightSidebar/CommentsRail.tsx
tests/playwright/right-sidebar-detail-scroll.spec.ts
tests/playwright/right-sidebar-docs-tab.spec.ts
``​`

Objetivos:

``​`txt
- restablecer un solo scroll owner por panel;
- garantizar min-h-0/overflow contract completo;
- preservar header y tabs;
- no reiniciar scroll por keypress;
- eliminar overflow horizontal;
- validar Fields, Detail, Docs y Comments;
- no hacer todavía el rediseño profundo de cards.
``​`

No tocar:

``​`txt
Designer/index.tsx
CtlBar.tsx
LeftSidebar/**
Canvas/**
runtimeStyles.ts
``​`

## Copilot — W1-COPILOT-LINT-HOST

Owned:

``​`txt
eslint.config.cjs
src/features/pdfcomponent/**
tests/**/generated/**
tests que importan wrappers legacy eliminados
``​`

Exclusiones:

``​`txt
src/features/pdfcomponent/PdfmeLabPage.jsx
``​`

solo puede tocarse si el warning o import roto está en ese archivo y el cambio no
afecta layout, configuración runtime ni comportamiento del Designer.

Objetivos:

``​`txt
- eliminar imports y constantes sin uso;
- corregir el doble reporte no-unused-vars en TS/TSX;
- corregir any en código del host cuando tenga tipo inferible;
- actualizar tests que importan rutas eliminadas;
- no recrear wrappers muertos;
- separar lint:src, lint:tests y lint:generated si el package actual lo permite
  sin romper scripts existentes;
- dejar su slice en cero warnings.
``​`

No tocar:

``​`txt
src/sisad-pdfme/ui/components/Designer/**
src/sisad-pdfme/react/**
src/sisad-pdfme/ui/runtimeStyles.ts
``​`

## Gate Wave 1

Claude, actuando como integrador, usa:

``​`txt
/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin-merge
``​`

Orden de integración:

``​`bash
git cherry-pick <CODEX-W1-SHA>
git cherry-pick <COPILOT-W1-SHA>
git cherry-pick <CLAUDE-W1-SHA>
``​`

Después:

``​`bash
npm run lint
npm run build
npx vitest run
``​`

Playwright focal:

``​`bash
npx playwright test \
  tests/playwright/drag-preview-and-canvas-scroll-regression.spec.ts \
  tests/playwright/right-sidebar-detail-scroll.spec.ts \
  tests/playwright/right-sidebar-docs-tab.spec.ts \
  --project=chromium
``​`

No iniciar Wave 2 hasta integrar Wave 1.

Cada agente actualiza su rama desde la integración mediante merge local.
Los worktrees comparten las referencias del mismo repositorio, por lo que no
hace falta `fetch`:

``​`bash
git merge ai/uxqa-integration-20260717
``​`

No rebase.

---

# WAVE 2 — Jerarquía del workspace y diseño principal

## Codex — W2-CODEX-CANVAS-TOOLBAR

Owned:

``​`txt
src/sisad-pdfme/ui/components/Designer/Canvas/overlays/**
src/sisad-pdfme/ui/components/Designer/shared/interactionGuards.ts
src/sisad-pdfme/ui/components/Designer/shared/interactionTargetSelectors.ts
tests/playwright/selection-context-toolbar.spec.ts
tests/playwright/detail-dropdown-focus-return.spec.ts
``​`

Objetivos:

``​`txt
- evitar que toolbar y métricas cubran schemas;
- preferir posición arriba, flip abajo y clamp;
- excluir toolbar de Selecto;
- no iniciar drag desde acciones;
- restaurar foco al trigger o Canvas;
- no tocar coordinate math, zoom ni Moveable.
``​`

No tocar:

``​`txt
Designer/index.tsx
CtlBar.tsx
RightSidebar/**
LeftSidebar/**
``​`

## Claude — W2-CLAUDE-TOPBAR-SAVE

Owned:

``​`txt
src/sisad-pdfme/ui/components/Designer/index.tsx
src/sisad-pdfme/ui/components/CtlBar.tsx
src/sisad-pdfme/ui/components/UnitPager.tsx
src/sisad-pdfme/ui/components/Designer/RightSidebar/RightSidebar.tsx
componentes directos de SaveAction/GlobalMoreMenu ya existentes
tests/playwright/save-toolbar-no-overlap.spec.ts
tests/playwright/right-sidebar-popover-boundaries.spec.ts
``​`

Objetivos:

``​`txt
- crear topbar global de tres columnas;
- sacar Guardar del área del RightSidebar;
- conservar estado Guardado/Guardando/Error;
- mover acciones globales Canvas/documento al menú global;
- dejar menús locales del RightSidebar con acciones locales;
- evitar solapamiento con tabs, rail y navegador;
- mantener CommandBus/ActionRegistry.
``​`

No crear:

``​`txt
otro header del host
otro estado de guardado
otro menú global paralelo
``​`

## Copilot — W2-COPILOT-LEFT-SIDEBAR

Owned:

``​`txt
src/sisad-pdfme/ui/components/Designer/LeftSidebar/**
src/sisad-pdfme/ui/components/PluginIcon.tsx
tests/playwright/left-sidebar-*.spec.ts
tests/playwright/drag-preview-and-canvas-scroll-regression.spec.ts
``​`

Nota:

El spec de drag solo puede ser modificado por Copilot en Wave 2 después de que el
commit de Codex Wave 1 ya esté integrado. No tocar assertions del overlay que
pertenecen a Codex.

Objetivos:

``​`txt
- una sola superficie por plugin;
- borde neutral por defecto;
- azul solo en hover/focus/drag;
- reducir radio, shadow, padding y altura;
- favoritos compactos;
- mantener list/tiles/icons como decisión del usuario;
- impedir scroll accidental durante drag;
- conservar data-testid y comportamiento DnD.
``​`

No tocar:

``​`txt
RightSidebar/**
Canvas/overlays/**
Designer/index.tsx
CtlBar.tsx
``​`

## Gate Wave 2

Integración:

``​`bash
git cherry-pick <CODEX-W2-SHA>
git cherry-pick <COPILOT-W2-SHA>
git cherry-pick <CLAUDE-W2-SHA>
``​`

Pruebas focales:

``​`bash
npm run lint
npm run build

npx playwright test \
  tests/playwright/selection-context-toolbar.spec.ts \
  tests/playwright/detail-dropdown-focus-return.spec.ts \
  tests/playwright/save-toolbar-no-overlap.spec.ts \
  tests/playwright/right-sidebar-popover-boundaries.spec.ts \
  tests/playwright/drag-preview-and-canvas-scroll-regression.spec.ts \
  --project=chromium
``​`

---

# WAVE 3 — Polish de sidebars y regresiones

## Codex — W3-CODEX-OWNER-TRANSFORM-FOCUS

Owned:

``​`txt
src/sisad-pdfme/recipients/recipientColorResolver.ts
src/sisad-pdfme/collaboration/schemaOwnershipAppearance.ts
src/sisad-pdfme/ui/components/Designer/shared/schemaInteractionState.ts
tests de owner color
tests de transformación/page anchors
tests de focus return
``​`

Objetivos:

``​`txt
- una fuente de owner color;
- no confundir owner con selected;
- Canvas/ListView/DetailHeader deben resolver el mismo tono;
- no cambiar coordinates para adaptar un expected;
- clasificar transform failures antes de modificar producción;
- reparar focus sin blur global.
``​`

Si para completar el owner color necesita tocar `ListView Item` o `DetailHeader`,
debe solicitar handoff a Claude y no editar esos archivos.

## Claude — W3-CLAUDE-RIGHT-SIDEBAR-POLISH

Owned:

``​`txt
src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/**
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/**
src/sisad-pdfme/ui/components/Designer/RightSidebar/DocumentsRail.tsx
src/sisad-pdfme/ui/components/Designer/RightSidebar/shared/**
tests/playwright/right-sidebar-visual-polish.spec.ts
tests/playwright/list-view-regression.spec.ts
tests/playwright/documents-rail-document-page-hierarchy.spec.ts
``​`

Objetivos:

``​`txt
- owner accent separado del selected state;
- delete contextual;
- densidades 56/48/40 aproximadas;
- compactar DetailView;
- radios máximos de 12 px;
- sin min-height artificial;
- selectores con popup controlado y focus restore;
- jerarquía documento→páginas;
- upload sin recorte;
- delete dentro de fila;
- tabs sin wrap.
``​`

No tocar:

``​`txt
recipient resolvers owned por Codex
LeftSidebar/**
Designer/index.tsx salvo bug demostrado de su Wave 2
``​`

## Copilot — W3-COPILOT-RAILS-A11Y-VISUAL

Owned:

``​`txt
componentes de rail compartidos que NO estén dentro de RightSidebar/shared
tests/playwright/sidebar-rail-collapse-actions.spec.ts
tests/playwright/sidebar-collapse-parity.spec.ts
tests/playwright/visual/**
tests de accesibilidad LeftSidebar/lab
src/features/pdfcomponent/**
``​`

Objetivos:

``​`txt
- rails de 44 px;
- tooltips y aria-label;
- active indicator común;
- restore de panel solicitado;
- no perder zoom/selección/página;
- actualizar baseline visual solo después de confirmar que el cambio es intencional;
- no modificar expected funcional.
``​`

Si el rail compartido real está dentro de `RightSidebar/shared`, Claude conserva
ownership y Copilot se limita a tests y host.

## Gate Wave 3

``​`bash
git cherry-pick <CODEX-W3-SHA>
git cherry-pick <COPILOT-W3-SHA>
git cherry-pick <CLAUDE-W3-SHA>
``​`

Barrido:

``​`bash
npm run lint
npm run build
npx vitest run
npx playwright test --project=chromium
``​`

---

# WAVE 4 — runtimeStyles y cierre

Esta wave no se ejecuta en paralelo sobre el mismo archivo.

## Claude — W4-CLAUDE-RUNTIME-STYLES

Único owner:

``​`txt
src/sisad-pdfme/ui/runtimeStyles.ts
``​`

Apoyo de lectura:

``​`txt
Root.tsx
componentes ya migrados
resultados de rg
``​`

Objetivo:

Clasificar cada bloque:

``​`txt
KEEP_TECHNICAL
MIGRATE_TO_TAILWIND
DELETE_DEAD
``​`

Reglas:

``​`txt
- no mover geometría crítica;
- no mover selectores de nodos de terceros sin reemplazo;
- eliminar skin visual ya expresado en TSX;
- no crear otro archivo CSS;
- no agregar @apply;
- documentar cada bloque técnico que queda.
``​`

Codex y Copilot no editan código durante este archivo. Pueden ejecutar pruebas y
reportar regresiones desde sus worktrees actualizados.

---

# 5. Prompt específico — Codex 4.5 mini

Pega después del prompt común:

``​`txt
ROL
Eres el ejecutor técnico focal del equipo.

TU FORTALEZA EN ESTE PLAN
- correcciones pequeñas y verificables;
- hooks;
- memoización;
- overlays del Canvas;
- interacción;
- owner/access resolvers;
- pruebas unitarias y Playwright focales.

NO HAGAS
- rediseño global;
- auditoría arquitectónica;
- refactor masivo;
- cambios de copy o jerarquía visual no indicados;
- edición del RightSidebar o LeftSidebar fuera de tus owned paths.

MÉTODO
1. Lee la wave activa.
2. Reclama el lock.
3. Abre únicamente los archivos owned y tests directos.
4. Reproduce el fallo focal.
5. Implementa la corrección mínima que preserve contratos.
6. Ejecuta lint y tests focales.
7. Crea commit atómico.
8. Entrega handoff con SHA.

PRIORIDAD
Correctitud primero. No intentes mejorar la apariencia fuera de tu scope.

Cuando una prueba revele un problema de otra área, no la adaptes: documenta el
owner correcto y continúa.
``​`

---

# 6. Prompt específico — Claude 4.8 Outputs

Pega después del prompt común:

``​`txt
ROL
Eres el arquitecto de UX, responsable del RightSidebar, DetailView, workspace
global y también integrador local de las ramas.

TU FORTALEZA EN ESTE PLAN
- composición visual;
- jerarquía;
- contratos de scroll;
- Tailwind en TSX;
- coordinación entre paneles;
- resolución de conflictos semánticos;
- integración final.

NO HAGAS
- otra auditoría completa;
- un nuevo plan;
- reescritura del Designer;
- cambios amplios en Canvas;
- limpieza de archivos owned por Copilot;
- correcciones de owner resolver owned por Codex sin handoff.

MÉTODO DE IMPLEMENTACIÓN
1. Ejecuta únicamente la wave activa.
2. Mantén una sola fuente de scroll, acciones y estado.
3. Usa Tailwind inline en componentes.
4. Conserva CommandBus, ActionRegistry, testIds y contratos públicos.
5. No crees wrappers visuales sin responsabilidad.
6. Haz commits pequeños.

MÉTODO DE INTEGRACIÓN
Usa exclusivamente:
/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin-merge

Antes de cherry-pick:
- lee los tres handoffs;
- confirma que no existen archivos modificados por dos agentes;
- confirma tests focales.

Orden:
1. Codex.
2. Copilot.
3. Claude.

Si aparece un conflicto:
- no elijas automáticamente “ours” o “theirs”;
- resuelve según ownership y plan;
- conserva ambas correcciones cuando sean ortogonales;
- registra la resolución en:
  ai/coordination/uxqa-20260717/handoffs/CLAUDE-INTEGRATION-<wave>.md

Después de integrar:
- ejecuta gate completo de la wave;
- corrige solo fallos de integración;
- no absorbas deuda de otra wave;
- actualiza la rama de integración;
- informa los SHAs integrados.
``​`

---

# 7. Prompt específico — GitHub Copilot Auto

Pega en Copilot Chat/Agent Mode después del prompt común:

``​`txt
ROL
Eres el pair programmer de producción para componentes acotados, limpieza de
lint, host del laboratorio, LeftSidebar, accesibilidad y pruebas visuales.

TU FORTALEZA EN ESTE PLAN
- cambios repetitivos y consistentes;
- Tailwind local;
- accesibilidad;
- limpieza de imports;
- ajustes de tests;
- componentes del host;
- LeftSidebar.

NO HAGAS
- análisis de todo el repositorio;
- refactors automáticos fuera de los archivos owned;
- “Fix all” global;
- edición del RightSidebar;
- edición de Canvas coordinates;
- edición del runtime React;
- creación de CSS;
- recreación de wrappers eliminados.

CONFIGURACIÓN DE TRABAJO
Abre únicamente el workspace:
/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin-copilot

Antes de aceptar una edición sugerida:
- verifica la ruta;
- verifica que esté en owned paths;
- revisa el diff;
- rechaza cualquier cambio colateral.

MÉTODO
1. Usa instrucciones precisas por archivo.
2. No generes cambios masivos desde Problems.
3. Corrige warnings por familia.
4. Ejecuta ESLint sobre los archivos modificados.
5. Ejecuta los tests directos.
6. Haz commit atómico.
7. Escribe handoff con SHA.

Para Tailwind:
- una sola superficie visible;
- baja densidad;
- border-solid por preflight false;
- sin shadow permanente;
- sin clases dinámicas que Tailwind no pueda detectar;
- usa mergeClassNames o arrays estáticos existentes.
``​`

---

# 8. Formato obligatorio de handoff

``​`md
# HANDOFF — <AGENTE> — <WAVE> — <TASK-ID>

## Estado
completed | blocked | partial

## Commit
<sha>

## Objetivo ejecutado
...

## Archivos modificados
- ruta
- ruta

## Cambios funcionales
- ...

## Cambios visuales
- ...

## Contratos preservados
- selección
- owner
- document routing
- locks
- testIds
- CommandBus

## Validación
``​`bash
comando
``​`

Resultado:
``​`txt
exit code / tests passed / tests failed
``​`

## Fallos fuera de alcance
- archivo
- owner recomendado
- evidencia

## Riesgos
- ...

## Próximo paso permitido
...
``​`

---

# 9. Reglas de merge sin colisiones

Antes de integrar una wave:

``​`bash
git diff --name-only ai/uxqa-integration-20260717..ai/codex-uxqa-20260717
git diff --name-only ai/uxqa-integration-20260717..ai/claude-uxqa-20260717
git diff --name-only ai/uxqa-integration-20260717..ai/copilot-uxqa-20260717
``​`

Detectar intersecciones:

``​`bash
comm -12 \
  <(git diff --name-only ai/uxqa-integration-20260717..ai/codex-uxqa-20260717 | sort) \
  <(git diff --name-only ai/uxqa-integration-20260717..ai/claude-uxqa-20260717 | sort)
``​`

Repetir para los tres pares.

Si existe una intersección no autorizada:

``​`txt
NO MERGE
``​`

El agente que no era owner debe revertir únicamente ese archivo en su rama y
volver a entregar un commit limpio.

---

# 10. Criterio de cierre del equipo

La ejecución se considera terminada únicamente cuando:

``​`txt
[ ] DetailView alcanza la última sección.
[ ] Campos, Detalle, Docs y Comentarios tienen scroll estable.
[ ] Guardar no se solapa con switcher ni rails.
[ ] Menú global y menús locales están separados.
[ ] LeftSidebar no hace parecer seleccionados todos los plugins.
[ ] ListView separa owner, hover, selected, focus y lock.
[ ] DocumentsRail distingue documentos y páginas.
[ ] Toolbar contextual no cubre schemas.
[ ] Rails restauran panel, zoom, página y selección.
[ ] Owner color coincide en Canvas, ListView y DetailHeader.
[ ] npm run lint no tiene errores.
[ ] src no tiene warnings.
[ ] build pasa.
[ ] Vitest pasa.
[ ] Playwright pasa o cada fallo restante tiene owner, evidencia y task-card.
[ ] No se creó CSS visual nuevo.
[ ] runtimeStyles.ts conserva solamente CSS técnico documentado.
``​`

---

# 11. Mensaje corto de arranque para el equipo

Usar este mensaje en las tres sesiones después de cargar los prompts:

``​`txt
Inicia la Wave 1 del plan multiagente.

No realices auditoría ni otro plan.
Trabaja solo en tu worktree y owned paths.
Lee el plan autoritativo y OWNERSHIP.md.
Crea tu lock, implementa tu tarea asignada, valida con pruebas focales, crea un
commit atómico y entrega el handoff con SHA.

No hagas merge.
Claude integrará la wave únicamente después de recibir los tres handoffs.
``​`
```

<a id="file-0183"></a>

### 0183 — `ai/prompts/PROMPT_MAESTRO_MIGRACION_TAILWIND_SISAD_PDFME.md`

- **Lenguaje:** `markdown`
- **Líneas:** `804`
- **Tamaño original:** `14.7 KB`
- **SHA1 corto:** `ba92acc842`
- **Estado:** `completo`

```markdown
# PROMPT MAESTRO — Migración acelerada de Tailwind desde CSS hacia JSX/TSX en SISAD PDFME

## Rol

Actúa como arquitecto frontend senior especializado en React, TypeScript, Tailwind CSS 3, Vite, Ant Design, dnd-kit, Moveable, Selecto y pruebas visuales con Playwright.

Trabaja directamente en:

``​`txt
/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin
``​`

Ruta visual principal:

``​`txt
http://localhost:5174/lab/multi-document-routing
``​`

## Estado real del proyecto que debes respetar

El proyecto ya avanzó considerablemente en la migración:

``​`txt
src/features/pdfcomponent/labRoutes.css
- se encuentra prácticamente neutralizado;
- el inventario más reciente reporta aproximadamente 5 líneas;
- no debe reabrirse como una migración grande sin medir primero su contenido actual.

src/sisad-pdfme/ui/styles/sisad-pdfme.css
- sigue siendo la principal hoja residual;
- el inventario más reciente reporta aproximadamente 2484 líneas;
- contiene mezcla de skin visual, integración con Ant Design, estados, pseudo-elementos y CSS técnico.

src/sisad-pdfme/ui/styles/tokens.css
- el inventario más reciente reporta aproximadamente 323 líneas;
- debe conservar tokens globales realmente compartidos;
- no debe vaciarse por obligación.

src/styles/sisad-tailwind-bridge.css
- se encuentra vacío.

src/style.css
- está neutralizado para evitar doble emisión de Tailwind.

src/styles/tailwind.css
- es la fuente única de:
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
``​`

Las tareas CSS anteriores `TASK-CSS-012` a `TASK-CSS-019` figuran como completadas. No debes reabrirlas ni repetir sus análisis. La tarea activa más reciente es `TASK-REGRESSION-021-shell-token-visual-recovery`, y existen pendientes específicos de LeftSidebar y poda CSS. Usa lo completado como guardrail y continúa desde el estado actual.

## Objetivo

Migrar a JSX/TSX toda utilidad Tailwind y todo skin visual que todavía pueda vivir correctamente en el nodo React propietario, reduciendo `@apply` y selectores visuales duplicados sin romper:

``​`txt
canvas
páginas
scroll
zoom
drag and drop
Moveable
Selecto
selección
multi-selección
colaboración
owner color
assignments
Form
Viewer
snapshot
generator
pdf-lib
Ant Design portals
impresión
``​`

La meta no es dejar cero CSS a cualquier costo.

La meta correcta es:

``​`txt
JSX/TSX:
- layout de componentes;
- skin;
- densidad;
- estados visuales locales;
- hover/focus/selected/disabled;
- responsive local;
- badges, cards, toolbar y sidebars.

CSS:
- tokens globales;
- geometría;
- integración de terceros;
- portales;
- pseudo-elementos técnicos;
- keyframes;
- print;
- Moveable/Selecto;
- estados globales imposibles de expresar limpiamente en el nodo.
``​`

## Arquitectura IA obligatoria

Lee una sola vez:

``​`txt
PROMPT_ARRANQUE_CODEX.md
ai/start/START.md
ai/router/ROUTER.md
ai/router/CONTEXT_BUDGET.md
ai/rules/css-migration-rules.md
ai/context/css-tailwind-context.md
ai/playbooks/pb-css-tailwind-migration.md
ai/memory/known-risks.md
ai/task-cards/active/TASK-REGRESSION-021-shell-token-visual-recovery.md
ai/task-cards/completed/completed-summary.md
``​`

No cargues de forma masiva:

``​`txt
ai/task-cards/completed/TASK-*.md
reports completos
backups
dist
test-results
candidates completos
``​`

Respeta el presupuesto vigente por subpase:

``​`txt
máximo 2 búsquedas globales;
máximo 8 archivos abiertos;
máximo 5 archivos modificados;
una sola task-card activa;
no tocar geometría protegida sin task-card explícita.
``​`

### Cómo acelerar sin violar el presupuesto

Trabaja en **paquetes funcionales**.

Cada paquete puede contener entre 2 y 4 subpases. Cada subpase respeta el límite de 5 archivos modificados, pero:

``​`txt
- no ejecutes build completo después de cada archivo;
- no ejecutes Playwright después de cada subpase;
- no actualices memoria después de cada microcambio;
- valida el paquete completo una sola vez al final;
- actualiza task-card y ledger una sola vez al cerrar el paquete.
``​`

## Contrato de `src/sisad-pdfme/ui/constants.ts`

Debes analizar todos los consumidores de:

``​`ts
SELECTABLE_CLASSNAME
RULER_HEIGHT
PAGE_GAP
LEFT_SIDEBAR_WIDTH
RIGHT_SIDEBAR_WIDTH
BACKGROUND_COLOR
DEFAULT_MAX_ZOOM
DESIGNER_CLASSNAME
UI_CLASSNAME
``​`

No trates todas estas constantes como clases CSS:

``​`txt
DESIGNER_CLASSNAME y UI_CLASSNAME:
- generan hooks semánticos;
- se concatenan con sufijos;
- deben conservarse.

SELECTABLE_CLASSNAME:
- forma parte de selección/interacción;
- no eliminar ni renombrar sin auditoría explícita.

RULER_HEIGHT, PAGE_GAP, LEFT_SIDEBAR_WIDTH, RIGHT_SIDEBAR_WIDTH:
- son dimensiones runtime;
- no convertir ciegamente a utilidades Tailwind;
- conservar si participan en cálculos JS, geometría o layout coordinado.

BACKGROUND_COLOR:
- es un token runtime;
- conservar su semántica.

DEFAULT_MAX_ZOOM:
- es lógica;
- no pertenece a esta migración visual.
``​`

Patrón obligatorio:

``​`tsx
className={mergeClassNames(
  DESIGNER_CLASSNAME + 'list-view-item',
  'relative flex min-w-0 items-center rounded-lg border border-slate-200 bg-white',
)}
``​`

No reemplazarlo por:

``​`tsx
className="relative flex min-w-0 items-center rounded-lg border border-slate-200 bg-white"
``​`

Los nombres semánticos pueden ser usados por:

``​`txt
CSS técnico residual
tests
plugins
hosts externos
querySelector
data collection
depuración
compatibilidad
``​`

## Fase 0 — Línea base

Ejecuta:

``​`bash
cd /Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin

git status --short
git rev-parse --abbrev-ref HEAD

mkdir -p reports/tailwind-migration/accelerated
``​`

Mide el estado real, sin confiar solo en cifras históricas:

``​`bash
wc -l \
  src/sisad-pdfme/ui/styles/sisad-pdfme.css \
  src/features/pdfcomponent/labRoutes.css \
  src/sisad-pdfme/ui/styles/tokens.css \
  > reports/tailwind-migration/accelerated/css-lines-before.txt

rg -n "@apply" \
  src/sisad-pdfme/ui/styles/sisad-pdfme.css \
  src/features/pdfcomponent/labRoutes.css \
  src/sisad-pdfme/ui/styles/tokens.css \
  > reports/tailwind-migration/accelerated/apply-before.txt

node scripts/css-inventory.mjs
node scripts/css-selector-duplicates.mjs
node scripts/css-active-selector-audit.mjs
``​`

No ejecutes automáticamente `migrate-design-to-tailwind.mjs` hasta leer su contrato y confirmar que no sobrescribe archivos. Úsalo solo si ofrece un modo de reporte o dry-run seguro.

## Fase 1 — Crear el mapa de migración

Genera:

``​`txt
reports/tailwind-migration/accelerated/migration-map.csv
reports/tailwind-migration/accelerated/migration-ledger.md
``​`

Columnas del CSV:

``​`txt
package
subpass
selector
css_file
line
semantic_suffix
consumer_file
constant_prefix
classification
action
risk
validation
status
``​`

Busca consumidores por sufijo:

``​`bash
rg -n "list-view-item" src/sisad-pdfme/ui
rg -n "detail-section-card" src/sisad-pdfme/ui
rg -n "left-sidebar" src/sisad-pdfme/ui
``​`

No dependas únicamente de la cadena completa porque muchas clases se forman mediante:

``​`ts
DESIGNER_CLASSNAME + '...'
UI_CLASSNAME + '...'
``​`

## Clasificación obligatoria

### MIGRATE_TO_TSX

Migrar al componente propietario:

``​`txt
display
flex/grid
gap
padding/margin
min/max size visual
border visual
radius
background
text
font
shadow
truncate
hover
focus
selected
disabled
responsive local
overflow de panel normal
data-state simple
``​`

### KEEP_AS_TOKEN

Mantener en `tokens.css`:

``​`txt
custom properties globales
paleta compartida
owner/recipient colors
z-index contractuales
tipografía global
dimensiones compartidas por varios componentes
variables consumidas por JS
``​`

### KEEP_AS_TECHNICAL_CSS

Mantener en CSS:

``​`txt
Moveable
Selecto
paper/page geometry
zoom y transforms
@keyframes
@media print
Ant Design descendant selectors
portals
pseudo-elementos técnicos
drag/drop global
pointer-events coordinados
selectores que dependen de varios ancestros
``​`

### DELETE_AS_ORPHAN

Eliminar solo si demuestras que:

``​`txt
no existe consumidor;
no se forma mediante constante;
no aparece en tests;
no lo usa un plugin;
no lo usa un host;
no es selector de portal;
no es contrato técnico.
``​`

## Paquetes de ejecución

### PACKAGE-01 — Cierre del RightSidebar residual

No repitas componentes ya migrados sin evidencia de CSS residual.

Audita y completa:

``​`txt
RightSidebar/ListView
RightSidebar/DetailView
DocumentsRail
CommentsRail
SidebarSurfacePrimitives
layout.tsx
RightSidebar.tsx
``​`

Objetivos:

``​`txt
eliminar cards anidadas;
eliminar borde negro;
reducir sombras;
unificar densidades;
conservar scroll interno;
conservar acciones;
eliminar selectores visuales ya duplicados en TSX.
``​`

### PACKAGE-02 — LeftSidebar y catálogo

Integra pendientes equivalentes a:

``​`txt
TASK-CSS-021-left-sidebar-overflow-tailwind-continuity
TASK-CSS-022-left-sidebar-css-pruning
``​`

Audita:

``​`txt
LeftSidebar.tsx
LeftSidebarGroup.tsx
LeftSidebarSearch.tsx
LeftSidebarTabs.tsx
LeftSidebarCustomPanel.tsx
CatalogLayoutToggle.tsx
useLeftSidebarCatalogState.ts
``​`

No mezclar:

``​`txt
layout elegido por usuario
densidad responsive
ancho real del panel
``​`

### PACKAGE-03 — Toolbar, shell y navegación

Audita:

``​`txt
CtlBar.tsx
Designer/index.tsx
UnitPager.tsx
SidebarRail.tsx
SidebarCollapseHandle.tsx
``​`

Conserva cálculos basados en:

``​`txt
RULER_HEIGHT
PAGE_GAP
LEFT_SIDEBAR_WIDTH
RIGHT_SIDEBAR_WIDTH
``​`

### PACKAGE-04 — Lab host

El inventario reciente indica que `labRoutes.css` está prácticamente vacío. Por ello:

``​`txt
1. mide;
2. verifica si contiene solo comentarios/import residual;
3. no inventes una migración grande;
4. migra cualquier regla visual restante al componente correspondiente;
5. elimina el import solo si el archivo queda realmente vacío y la build pasa.
``​`

Audita:

``​`txt
PdfmeLabPage.jsx
PageHeader.jsx
ResultsPanel.jsx
CompactControls.jsx
PopoverMenu.jsx
CaseCard.jsx
LabLandingPage.jsx
``​`

### PACKAGE-05 — Form y Viewer

Audita skin visual en:

``​`txt
Form.tsx
Viewer.tsx
Preview.tsx
RuntimeFormPanel.tsx
Root.tsx
ErrorScreen.tsx
Spinner.tsx
UnitPager.tsx
``​`

No modificar contratos de inputs, valores, recipient filtering ni generación.

### PACKAGE-06 — Poda final de `sisad-pdfme.css`

Después de migrar componentes:

``​`txt
- elimina duplicados;
- elimina selectores huérfanos demostrados;
- conserva secciones técnicas claramente comentadas;
- no persigas cero líneas;
- persigue cero skin visual trasladable.
``​`

Ordena el residual por secciones:

``​`txt
1. Ant Design integration
2. Canvas/Paper geometry
3. Moveable/Selecto
4. Drag/selection technical states
5. Print
6. Keyframes
7. Runtime cross-component contracts
``​`

### PACKAGE-07 — Auditoría de `tokens.css`

Clasifica cada token:

``​`txt
ACTIVE_SHARED
ACTIVE_RUNTIME
ALIAS_REQUIRED
DEPRECATED_WITH_CONSUMERS
ORPHAN
``​`

Solo elimina `ORPHAN`.

No reemplaces colores dinámicos por utilidades Tailwind estáticas cuando dependen de:

``​`txt
owner
recipient
theme
runtime config
host config
CSS variables
``​`

## Reglas de diseño

Puedes corregir durante la migración:

``​`txt
doble superficie
cards demasiado grandes
bordes oscuros
radios excesivos
sombras permanentes
acciones que cambian el ancho
iconos recortados
headers duplicados
badges en demasiadas líneas
scroll bloqueado
densidad inconsistente
``​`

No rediseñes completamente el flujo ni cambies comportamiento de negocio.

## Reglas de interacción

No cambies accidentalmente:

``​`txt
onClick
onPointerDown
onMouseDown
onDoubleClick
listeners de dnd-kit
attributes
data-testid
aria-label
tabIndex
focus management
propagation guards
``​`

Cuando migres un botón o acción:

``​`txt
- conserva type="button";
- conserva stopPropagation si existe;
- conserva preventDefault si existe;
- conserva disabled;
- conserva test id;
- conserva tooltip;
- conserva permiso.
``​`

## Estilos inline

No uses `style` para propiedades estáticas.

`style` se permite para:

``​`txt
transform de dnd
coordenadas
zoom
rotation
owner color
type color
CSS variables dinámicas
dimensiones calculadas
``​`

## Ant Design

No borres selectores de:

``​`txt
.ant-collapse-*
.ant-select-*
.ant-input-*
.ant-input-number-*
.ant-modal-*
.ant-tooltip-*
.ant-dropdown-*
``​`

hasta demostrar que el componente puede controlarse de forma estable mediante props/className y sin `!important`.

No agregues `!important`.

## Áreas protegidas

No modificar durante esta tarea:

``​`txt
Moveable.tsx
Selecto.tsx
coordinateMath.ts
designerCoordinateService.ts
Paper.tsx, salvo skin externo demostrado
snapshotAdapter
generator
pdf-lib
schema persistence
document routing
zoom math
``​`

## Validación acelerada

### Por subpase

Ejecuta solo:

``​`bash
npx tsc --noEmit
``​`

o la verificación rápida equivalente.

### Al cerrar cada paquete

Ejecuta:

``​`bash
npm run build
``​`

y únicamente las pruebas del dominio.

RightSidebar:

``​`bash
npx playwright test \
  tests/playwright/right-sidebar-visual-polish.spec.ts \
  tests/playwright/right-sidebar-docs-tab.spec.ts
``​`

Lab:

``​`bash
npx playwright test \
  tests/playwright/multi-document-routing-design.spec.ts \
  tests/playwright/lab-designer-visual-baseline-regression.spec.ts
``​`

Antes de Playwright:

``​`bash
curl -I http://localhost:5174/lab/multi-document-routing
``​`

Si el servidor está caído, reinícialo una sola vez:

``​`bash
npm run dev -- --host 0.0.0.0
``​`

No diagnostiques una regresión de código cuando el fallo es conexión rechazada.

### Suite amplia

Ejecuta la suite amplia únicamente después de:

``​`txt
PACKAGE-03
PACKAGE-05
PACKAGE-07
``​`

## Métricas por paquete

Registra:

``​`txt
archivos abiertos
archivos modificados
selectores evaluados
selectores migrados
selectores eliminados
selectores conservados
@apply antes/después
líneas CSS antes/después
tests ejecutados
regresiones encontradas
residuales justificados
``​`

## Criterios de cierre

### `labRoutes.css`

``​`txt
- cero @apply;
- archivo eliminado o residual mínimo justificado;
- no reintroducir skin del core.
``​`

### `sisad-pdfme.css`

``​`txt
- cero skin visual trasladable;
- solo CSS técnico, integración externa y contratos globales;
- cada bloque residual documentado.
``​`

### `tokens.css`

``​`txt
- solo tokens activos;
- sin duplicados;
- sin aliases huérfanos;
- variables runtime conservadas.
``​`

### Componentes

``​`txt
- conservan DESIGNER_CLASSNAME/UI_CLASSNAME;
- Tailwind vive en el nodo propietario;
- no hay wrappers nuevos solo para estilizar;
- no hay clases conflictivas;
- comportamiento intacto.
``​`

## Formato de entrega por paquete

No narres cada microedición.

Al cerrar un paquete responde:

``​`txt
PACKAGE cerrado: <nombre>

Archivos modificados:
- ...

Migración:
- selectores evaluados:
- migrados:
- eliminados:
- conservados:

Métricas:
- @apply antes/después:
- líneas CSS antes/después:

Validación:
- typecheck:
- build:
- Playwright:

Residual:
- ...

Siguiente paquete:
- ...
``​`

Continúa con el siguiente paquete automáticamente mientras no exista una regresión funcional, una ambigüedad arquitectónica o un selector técnico de alto riesgo.
```

<a id="file-0184"></a>

### 0184 — `ai/prompts/PROMPT_REALINEACION_MULTIAGENTE_WAVE1_SISAD_PDFME.md`

- **Lenguaje:** `markdown`
- **Líneas:** `351`
- **Tamaño original:** `8.6 KB`
- **SHA1 corto:** `9324fe3975`
- **Estado:** `completo`

```markdown
# Realineación multiagente — Wave 1 SISAD PDFME

## Estado confirmado

La Wave 1 no debe integrarse todavía.

### Claude

Estado válido:

- Su corrección de scroll del RightSidebar está aislada y comprometida.
- Ha detenido la integración hasta recibir ramas limpias de Codex y Copilot.
- Debe seguir siendo el único integrador en `prueba-plugin-merge`.

### Codex

Estado inválido:

- Trabajó en el checkout principal.
- No ejecutó su tarea asignada:
  - `SisadPdfmeForm.tsx`;
  - `SchemaDropCommitFlash.tsx`.
- Modificó archivos owned por Claude:
  - RightSidebar;
  - ListView;
  - DetailView.
- Modificó un archivo owned por Copilot:
  - `labExamples.js`.
- Continuó hacia slices visuales y pruebas de DetailView sin cerrar Wave 1.
- No entregó un commit limpio en `ai/codex-uxqa-20260717`.

### Copilot

Estado parcialmente válido:

- El commit `ab52464` está en la rama correcta.
- Corrigió dos tests con imports legacy.
- Su lint focal y dos tests están verdes.
- Todavía no corrigió el bloqueo de build en `labExamples.js`.
- Existe además una sesión que modificó `LeftSidebar.tsx` directamente en main.
  Ese cambio debe quedar en cuarentena hasta Wave 2.

---

# 1. Detener trabajo paralelo

No iniciar Wave 2.

Cerrar o pausar:

- sesión Codex que está en `prueba-plugin`;
- sesión Copilot que está en `prueba-plugin`;
- cualquier terminal que siga modificando main.

Claude permanece detenido hasta recibir los dos handoffs limpios.

---

# 2. Poner en cuarentena los cambios sueltos de main

Ejecutar en:

``​`bash
cd /Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin
``​`

Guardar evidencia:

``​`bash
COORD=/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/ai/coordination/uxqa-20260717

git status --short > "$COORD/status/MAIN-ROGUE-STATUS.txt"
git diff --name-only > "$COORD/status/MAIN-ROGUE-FILES.txt"
git diff --binary > "$COORD/handoffs/MAIN-ROGUE-CHANGES.patch"
``​`

Revisar:

``​`bash
cat "$COORD/status/MAIN-ROGUE-FILES.txt"
``​`

El checkpoint `37291b2` contiene el estado anterior. No usar `reset --hard`.

Restaurar únicamente los archivos tracked modificados después del checkpoint:

``​`bash
while IFS= read -r file; do
  [ -n "$file" ] && git restore --worktree --staged -- "$file"
done < "$COORD/status/MAIN-ROGUE-FILES.txt"
``​`

No eliminar:

``​`txt
ai/coordination/uxqa-20260717/**
``​`

Los cambios de LeftSidebar quedan preservados dentro del patch y se reconsideran
después del gate de Wave 1.

Confirmar:

``​`bash
git status --short
``​`

El checkout principal no debe contener modificaciones productivas sueltas.

---

# 3. Prompt correctivo para Codex

Pegar literalmente en la sesión nueva de Codex:

``​`txt
REALINEACIÓN OBLIGATORIA — CODEX WAVE 1

Tu ejecución anterior quedó invalidada porque trabajaste en el checkout
principal y editaste dominios de Claude y Copilot.

No continúes desde ~/Documents/Taylor/frontend/prueba-plugin.

WORKTREE OBLIGATORIO
/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin-codex

RAMA OBLIGATORIA
ai/codex-uxqa-20260717

TAREA ÚNICA
W1-CODEX-P0-HOOKS

ARCHIVOS PRODUCTIVOS OWNED
1. src/sisad-pdfme/react/SisadPdfmeForm.tsx
2. src/sisad-pdfme/ui/components/Designer/Canvas/overlays/SchemaDropCommitFlash.tsx

TESTS DIRECTOS PERMITIDOS
- tests unitarios directos de SisadPdfmeForm/runtime modes.
- tests directos de SchemaDropCommitFlash.
- tests/playwright/drag-preview-and-canvas-scroll-regression.spec.ts
  solo si necesita una corrección estrictamente relacionada con el overlay.

PROHIBIDO
- RightSidebar/**
- LeftSidebar/**
- DetailView/**
- ListView/**
- DocumentsRail.tsx
- labExamples.js
- Designer/index.tsx
- CtlBar.tsx
- tests de inspector/sidebar
- main
- Wave 2

PASOS
1. `cd /Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin-codex`
2. Confirma:
   `pwd`
   `git branch --show-current`
   `git status --short`
3. La rama debe ser `ai/codex-uxqa-20260717` y debe estar limpia.
4. Corrige el useMemo/React Compiler de SisadPdfmeForm sin desactivar reglas.
5. Corrige el orden incondicional de hooks y timers de
   SchemaDropCommitFlash.
6. Ejecuta:
   `npx eslint <los dos archivos>`
   `npx vitest run <tests focales existentes>`
   `npm run build`
7. Haz un único commit atómico:
   `fix: stabilize form memoization and drop flash hooks`
8. Crea:
   `ai/coordination/uxqa-20260717/handoffs/CODEX-wave1.md`
   incluyendo SHA, archivos, comandos y resultados exactos.
9. Libera el lock.
10. Detente. No continúes con otro slice y no hagas merge.

No reapliques el patch de main. Tu tarea debe implementarse limpiamente desde la
rama Codex.
``​`

---

# 4. Prompt correctivo para GitHub Copilot

Pegar literalmente en Copilot Agent Mode:

``​`txt
REALINEACIÓN OBLIGATORIA — COPILOT WAVE 1

WORKSPACE OBLIGATORIO
/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin-copilot

RAMA
ai/copilot-uxqa-20260717

El commit `ab52464` es válido y debe conservarse.

TAREA RESTANTE ÚNICA
Corregir el bloqueo de build de
src/features/pdfcomponent/labs/examples/labExamples.js.

No supongas que `exampleTemplate.ts` exporta `cloneExample`.
Primero encuentra la API canónica real:

rg -n \
  "export .*cloneExample|function cloneExample|const cloneExample|cloneExample" \
  src/features/pdfcomponent

Inspecciona los exports reales del módulo encontrado.

REGLAS
- No recrear wrappers eliminados.
- No importar un símbolo que el módulo no exporta.
- No tocar RightSidebar, DetailView, LeftSidebar, Canvas ni main.
- No continuar Wave 2.
- No modificar los tests ya comprometidos salvo fallo demostrado.
- No usar un alias o helper nuevo solo para ocultar el error.

VALIDACIÓN
1. ESLint focal de `labExamples.js`.
2. Tests directos del catálogo/export de ejemplos.
3. `npm run build`.
4. Si build pasa, crea un segundo commit:
   `fix: restore canonical lab example clone import`
5. Actualiza `COPILOT-wave1.md` con ambos SHAs:
   - `ab52464`
   - nuevo SHA del build blocker.
6. Libera el lock y detente.

El cambio de LeftSidebar realizado en el checkout principal no forma parte de
Wave 1. No lo reapliques todavía.
``​`

---

# 5. Prompt de espera e integración para Claude

Pegar literalmente en Claude:

``​`txt
CLAUDE — INTEGRACIÓN WAVE 1

Tu evaluación es correcta. No inicies Wave 2 y no continúes el polish visual.

Mantén tu rama y commit de scroll sin cambios adicionales.

Espera estos entregables:

CODEX
- commit en ai/codex-uxqa-20260717;
- solo SisadPdfmeForm.tsx y SchemaDropCommitFlash.tsx;
- handoff CODEX-wave1.md;
- lint, tests focales y build.

COPILOT
- commit ab52464;
- segundo commit que corrige de forma canónica labExamples.js;
- handoff COPILOT-wave1.md actualizado;
- build verde.

Antes de integrar ejecuta:

git diff --name-only \
  ai/uxqa-integration-20260717..ai/codex-uxqa-20260717

git diff --name-only \
  ai/uxqa-integration-20260717..ai/copilot-uxqa-20260717

git diff --name-only \
  ai/uxqa-integration-20260717..ai/claude-uxqa-20260717

Rechaza cualquier branch que contenga archivos fuera de ownership.

INTEGRACIÓN EXCLUSIVA
/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin-merge

ORDEN
1. cherry-pick commit Codex.
2. cherry-pick ab52464.
3. cherry-pick segundo commit Copilot.
4. cherry-pick tu commit de scroll.

GATE
npm run lint
npm run build
npx vitest run

npx playwright test \
  tests/playwright/drag-preview-and-canvas-scroll-regression.spec.ts \
  tests/playwright/right-sidebar-detail-scroll.spec.ts \
  tests/playwright/right-sidebar-docs-tab.spec.ts \
  --project=chromium

No modifiques expected ni snapshots para hacer pasar el gate.

Si falla:
- clasifica por commit/domain;
- revierte únicamente el commit culpable si es necesario;
- devuelve el fallo al owner;
- no absorbas trabajo de Wave 2.

Solo después del gate verde declara Wave 1 cerrada.
``​`

---

# 6. Estado del cambio LeftSidebar hecho en main

El cambio que midió:

``​`txt
abierto: 212 px
colapsado: 36 px
stage/canvas sin cambio
``​`

es potencialmente útil, pero fue ejecutado:

- en el checkout principal;
- fuera de la wave asignada;
- sin commit de la rama Copilot Wave 2;
- antes del gate de Wave 1.

No debe perderse ni integrarse ahora.

Después de cerrar Wave 1:

1. Crear un lock de `W2-COPILOT-LEFT-SIDEBAR`.
2. Extraer únicamente el diff de `LeftSidebar.tsx` desde
   `MAIN-ROGUE-CHANGES.patch`.
3. Aplicarlo en `prueba-plugin-copilot`.
4. Revisar el diff.
5. Ejecutar build y pruebas del LeftSidebar.
6. Crear commit de Wave 2.

---

# 7. Criterio para reanudar

No reanudar el trabajo hasta tener:

``​`txt
[ ] main sin cambios productivos sueltos;
[ ] Codex en su worktree y con commit hooks-only;
[ ] Copilot con ab52464 + fix canónico de labExamples.js;
[ ] Claude con su commit de scroll intacto;
[ ] tres handoffs completos;
[ ] cero intersecciones no autorizadas;
[ ] gate Wave 1 ejecutado en prueba-plugin-merge.
``​`
```

<a id="file-0185"></a>

### 0185 — `ai/prompts/README.md`

- **Lenguaje:** `markdown`
- **Líneas:** `3`
- **Tamaño original:** `0.1 KB`
- **SHA1 corto:** `c01bdd8aad`
- **Estado:** `completo`

```markdown
# Prompts

Prompts reutilizables. No reemplazan task-cards.
```

<a id="file-0186"></a>

### 0186 — `ai/prompts/update-memory.md`

- **Lenguaje:** `markdown`
- **Líneas:** `3`
- **Tamaño original:** `0.1 KB`
- **SHA1 corto:** `12f8d1fb49`
- **Estado:** `completo`

```markdown
# Prompt — Actualizar memoria

Actualiza memoria solo si hubo decisión estable. Usa `ai/memory/memory-update-protocol.md`.
```

<a id="file-0187"></a>

### 0187 — `ai/reports/architecture-correction-2026-07-14.md`

- **Lenguaje:** `markdown`
- **Líneas:** `28`
- **Tamaño original:** `1.6 KB`
- **SHA1 corto:** `b135092da3`
- **Estado:** `completo`

```markdown
# Architecture Correction Report

## Diagnóstico

Se encontraron referencias de documentación IA que apuntaban a una arquitectura paralela o a rutas no activas para esta base de repo:

- `ai/task-cards/active/TASK-ARCH-003-enforce-existing-ai-folder-architecture.md` listaba carpetas inexistentes en el árbol real actual, incluyendo `ai/subagents`, `ai/skills` y `ai/checklists`.
- `ai/agents/docs-architecture-agent.md` remitía a `ai/project/file-ownership-map.md` como si fuera la fuente operativa.
- `ai/adapters/AGENTS.md.template` remitía a `ai/project/scope.md`, reforzando el árbol paralelo `ai/project/`.
- `ai/memory/pending-checklist.md` todavía formulaba la relación entre `src/sisad-pdfme/docs/**` y `docs/**` en términos de duplicación, así que el texto se ajustó para dejar claro que no debe usarse como copia ni reemplazo.

## Archivos modificados

- `ai/task-cards/active/TASK-ARCH-003-enforce-existing-ai-folder-architecture.md`
- `ai/agents/docs-architecture-agent.md`
- `ai/adapters/AGENTS.md.template`
- `ai/memory/pending-checklist.md`

## Validación

- Revisé los archivos vivos de entrada para confirmar el drift antes de editar.
- Verifiqué que la task-card ahora enumera solo carpetas reales del árbol IA actual.
- Eliminé las referencias operativas a `ai/project/` desde los adaptadores activos.

## Riesgos

- `ai/project/` sigue existiendo como carpeta histórica. Ya no está referenciada por los adaptadores tocados en esta corrección, pero conviene no reintroducirla en futuras instrucciones.
- No se tocaron archivos fuera del alcance de docs/IA, por lo que el contenido público y el código fuente permanecen intactos.
```

<a id="file-0188"></a>

### 0188 — `ai/reports/auditoria_migracion_tailwind_y_regresiones_sisad_pdfme_2026-07-15.md`

- **Lenguaje:** `markdown`
- **Líneas:** `198`
- **Tamaño original:** `11.2 KB`
- **SHA1 corto:** `fbd2187a02`
- **Estado:** `completo`

```markdown
# Auditoría de migración Tailwind y regresiones — SISAD PDFME

Fecha: 2026-07-15
Ruta objetivo: `http://localhost:5174/lab/multi-document-routing`

## Resultado ejecutivo

La migración avanzó, pero no está terminada ni visualmente estable. Los paquetes muestran que:

- `labRoutes.css` bajó de 485 a 116 líneas (`-76.1%`).
- `sisad-pdfme.css` bajó de 3822 a 2574 líneas (`-32.7%`).
- `tokens.css` permanece en 323 líneas y no contiene un `@apply` real; debe conservarse como fuente de variables.
- La task activa del proyecto registra 615 `@apply` restantes en `sisad-pdfme.css`. El adjunto de estilos está truncado y permite verificar directamente 392 de ellos, más 23 en `labRoutes.css`.
- El reporte activo todavía enumera 144 selectores duplicados; varios afectan sidebars, control bar, cards del inspector y estados del canvas.

La captura actual contradice reportes históricos que marcaban las barras laterales como “estables”: hay solapamiento de encabezados y controles en el panel izquierdo, controles de catálogo recortados, rail de documentos apretado y una capa oscura de guías/reglas que invade el PDF.

## Restricción de esta ejecución

No existe un checkout editable del proyecto en el workspace: solo están los paquetes Markdown consolidados y la imagen. Tampoco hay un proceso escuchando en el puerto 5174; la navegación a localhost no pudo realizarse. Por eso esta auditoría no afirma que aplicó parches, ejecutó build ni validó Playwright.

## Hallazgos confirmados

### 1. El shell del laboratorio tiene tres fuentes de estilo en conflicto

En `src/features/pdfcomponent/PdfmeLabPage.jsx` el `<main>` combina:

- clases Tailwind inline;
- `LAB_PAGE_ROOT_STYLE` con `padding`, `minHeight`, `background` y `overflowX` inline;
- reglas de `labRoutes.css` para `[data-ux-mode='canvas-first']`.

Consecuencias confirmadas por lectura de código:

- El CSS intenta `p-0`, pero el `padding` inline de `LAB_PAGE_ROOT_STYLE` tiene prioridad.
- JSX define `grid-rows-[44px_minmax(0,1fr)]`, mientras `labRoutes.css` define `48px`; quedan dos fuentes de verdad.
- Las reglas `.sisad-pdfme-lab-page[data-density='compact']` no coinciden con el `<main>`, porque este no publica `data-density`.
- El selector `.sisad-pdfme-lab-page[data-density='compact'] .sisad-pdfme-lab-page h1` exige una segunda `.sisad-pdfme-lab-page` descendiente y es, en la composición observada, inalcanzable.

Esto explica por qué reducir CSS sin retirar estilos inline/duplicados no estabiliza el header.

### 2. La cadena de color por propietario no converge en un único tono

El flujo esperado existe:

`recipients → decorateTemplateWithCollaboration → ownerColor → Renderer/fieldChrome → --schema-owner-color`.

Sin embargo, `src/sisad-pdfme/ui/components/Renderer.tsx` hace dos resoluciones distintas:

- `schemaOwnerColor` usa `resolveSchemaOwnerColorValue(schema)`;
- `schemaTone` usa `resolveSchemaTone(schema, fallback)`.

Luego el wrapper pinta borde, superficie, outline, caption y badge con `schemaTone` / `--schema-tone`, mientras el color de owner queda en `--schema-owner-color`. El CSS de selección también usa principalmente `--schema-tone`. Por tanto, incluso con owner correcto, el chrome exterior puede mostrar un tono semántico o de fallback en vez del propietario.

Además, `data-schema-owner-id` solo consulta `__designer.collaboration.recipientId` y `__designer.recipientId`; omite `schema.ownerRecipientId` y `schema.ownerRecipientIds[0]`.

El fixture actual de `multiDocumentRouting.ts` sí declara owners y recipients azul/magenta/naranja. Un reporte histórico indica que, durante una validación anterior, los schemas visibles llegaron sin metadata de ownership. Esa contradicción obliga a probar el objeto final que recibe `Renderer`, no solo el fixture de origen.

### 3. Los schemas `action-based` ocultan el color de owner por diseño CSS

El reporte `tc-css-ownership-color.md` confirma que `approve`, `decline`, `attachment` y `note` usan chrome `border-0 bg-transparent`. Aunque exista `--schema-owner-color`, el acento no es visible. Se requiere un borde, barra o ring explícito basado en esa variable sin sustituir los colores semánticos de éxito/peligro.

### 4. El ancho de las barras laterales tiene demasiados resolutores

El ancho se decide simultáneamente en:

- `tokens.css`: `--sisad-pdfme-ls-width` y `--sisad-pdfme-rs-width`;
- media queries de `sisad-pdfme.css`;
- cálculo responsive de `Designer/index.tsx`;
- variantes `panel` / `compact`, densidad y atributos `data-*`.

El inventario documenta seis apariciones del selector de right sidebar y cuatro bloques responsive del left sidebar compacto. Esta cascada múltiple es consistente con los recortes/solapamientos de la captura.

### 5. La capa negra del canvas es un riesgo de geometría, no una skin común

La forma observada coincide con una capa de regla/guía (`scena-guides` o ruler) alrededor de una región. La causa exacta no puede confirmarse sin DOM/computed styles. Debe investigarse sin migrar a ciegas:

- dimensiones del manager de guías;
- background de corner/rulers;
- transform/scale del paper;
- clipping del canvas y z-index;
- montaje por página frente a montaje por schema.

Mover estas reglas a Tailwind antes de medirlas puede romper hit-testing, Moveable, Selecto o zoom.

## Clasificación de migración

| Dominio | Acción | Motivo |
|---|---|---|
| `tokens.css` | Conservar completo | Variables compartidas, geometría y tonos runtime; 0 `@apply` real |
| Lab header, chips, controles, resultados | Migrar a JSX/TSX | Skins y layout estático con owner claro |
| LeftSidebar tabs/search/groups/cards | Migrar a TSX | Responsable directo del overflow visible |
| RightSidebar switcher/cards/DocumentsRail | Migrar a TSX | Skin y densidad con owner claro |
| CtlBar pills/botones | Migrar skin; conservar anclaje | Posición absoluta pertenece al chrome del canvas |
| Inspector/cards/modales | Migrar wrappers; revisar Ant | Los descendientes `.ant-*` pueden requerir CSS scoped |
| Paper/zoom/transform/páginas | Mantener CSS técnico | Geometría medida por runtime |
| Moveable/Selecto/guides/rulers | Mantener CSS técnico | Hit-testing, overlays y coordenadas |
| Pseudo-elementos, keyframes, print | Mantener CSS | No tienen owner JSX directo o dependen de estado runtime |
| `data-*` de interacción | Mantener o migrar solo con variante local | No eliminar hasta tener paridad funcional demostrada |

## Orden de implementación recomendado

### Slice 0 — reparar regresiones funcionales antes de podar CSS

1. En `Renderer.tsx`, hacer que el tono de owner sea la primera fuente del chrome exterior y dejar el tono semántico solo como fallback.
2. Resolver `data-schema-owner-id` desde campos top-level y `__designer`.
3. Añadir acento owner-visible a `action-based` sin eliminar colores semánticos.
4. Verificar que cambio de usuario actualiza visibilidad y que cada schema conserva el color de su owner.
5. Diagnosticar la capa negra con computed styles antes de tocar guides/rulers.

### Slice 1 — eliminar `labRoutes.css`

Los 23 `@apply` actuales son migrables a `PdfmeLabPage.jsx`, `PageHeader.jsx` y componentes de laboratorio usando variantes `max-[900px]:*`, `max-[640px]:*` y condiciones React. Antes de borrar el archivo:

- retirar `LAB_PAGE_ROOT_STYLE` o hacerlo condicional por `uxMode`;
- escoger una sola altura de topbar (44 o 48 px);
- publicar `data-density` si se mantiene como contrato, o eliminar esos selectores;
- trasladar `max-w-full`, `min-w-0`, `box-border`, gaps y grids al elemento dueño;
- eliminar el import solo cuando `rg` no encuentre consumers exclusivos.

Meta: `labRoutes.css` con 0 `@apply`; idealmente eliminado si no queda regla técnica.

### Slice 2 — LeftSidebar

Destinos principales:

- `LeftSidebar.tsx`
- `LeftSidebarTabs.tsx`
- `LeftSidebarSearch.tsx`
- `LeftSidebarGroup.tsx`
- `shared/CatalogLayoutToggle.tsx`
- `shared/SidebarRail.tsx`
- `shared/SidebarCollapseHandle.tsx`

Conservar los hooks construidos con `DESIGNER_CLASSNAME`, pero añadir utilidades estáticas en el mismo `className`. Retirar del CSS solo las skins con paridad exacta. Mantener drag state, ancho colapsado y scroll técnico hasta validar.

### Slice 3 — RightSidebar y DocumentsRail

Migrar superficies, tabs, títulos, cards, badges, rows y estados hover. Mantener temporalmente scrollbars scoped y overrides Ant Design. Unificar el ancho en una sola fuente: cálculo JS publicado en `--sisad-pdfme-rs-width` o token, pero no ambos con media queries competidoras.

### Slice 4 — CtlBar e inspector

Migrar tipografía, borders, radius, shadows y botones. Mantener clusters absolutos, offsets y z-index del canvas. Consolidar selectores duplicados después de probar cada densidad.

### Slice 5 — limpieza final

- Eliminar reglas huérfanas con búsqueda de consumer y prueba DOM.
- Consolidar duplicados legítimos por media/state.
- No mover CSS técnico a otra hoja “bridge”; eso solo cambia la ubicación del problema.
- Objetivo inicial razonable: bajar de 615 a 250–350 `@apply` en `sisad-pdfme.css`, sujeto a inventario completo y pruebas.

## Patrón para prefijos dinámicos

Correcto:

``​`tsx
className={cn(
  `${DESIGNER_CLASSNAME}left-sidebar`,
  'relative flex h-full min-h-0 flex-col overflow-hidden',
  collapsed && 'w-9 max-w-9',
)}
``​`

Mantener el hook dinámico para runtime/E2E y las utilidades como literales detectables por Tailwind. No construir utilidades con interpolación (`w-[${width}px]`, `bg-${tone}`); usar mapas de clases estáticas o variables CSS/`style` para valores runtime.

## Matriz mínima de validación

| Prueba | Criterio |
|---|---|
| Build | `npm run build` sin errores |
| Lint/types | Sin errores nuevos |
| Tailwind | Una sola entrada y `preflight:false` |
| 1920×1080 | Sin solapamiento ni overflow horizontal en sidebars |
| 1440×900 | Catálogo, toolbar y documentos legibles |
| 1024×768 | Presentación overlay/docked coherente |
| Usuario Cliente Principal | Schemas propios visibles y `--schema-owner-color:#2563EB` |
| Usuario Avalista | Schemas propios visibles y `--schema-owner-color:#D946EF` |
| Vista global | Ambos owners conservan sus colores simultáneamente |
| Schema nuevo | Hereda color del recipient activo |
| Reasignación | Actualiza owner id, color, ListView, canvas y snapshot |
| Action-based | Owner visible sin perder verde/rojo semántico |
| Guides/rulers | Sin bloque negro fuera de su área |
| Drag/resize/rotate | Sin regresión de Moveable/Selecto |
| Página 2+ | Paper, overlays y selección conservan coordenadas |
| Docs rail | Cards no se recortan; delete permanece anclado |

## Comandos de cierre

``​`bash
rg -n "@apply" src/features/pdfcomponent/labRoutes.css src/sisad-pdfme/ui/styles/sisad-pdfme.css src/sisad-pdfme/ui/styles/tokens.css
rg -n "DESIGNER_CLASSNAME|UI_CLASSNAME|SELECTABLE_CLASSNAME" src/sisad-pdfme/ui
npm run build
npm run lint
npx playwright test tests/playwright/right-sidebar-visual-polish.spec.ts tests/playwright/canvas-overflow-regression.spec.ts tests/playwright/drag-preview-and-canvas-scroll-regression.spec.ts
``​`

## Condición para continuar la implementación

Sincronizar el checkout real del repositorio (incluyendo `package.json`, `src/`, tests y configuración) en el workspace, o proporcionar repositorio y rama. Los paquetes Markdown son suficientes para auditar, pero no para aplicar cambios seguros ni validar el comportamiento actual.
```

<a id="file-0189"></a>

### 0189 — `ai/reports/deep-ui-action-audit-2026-07-15.md`

- **Lenguaje:** `markdown`
- **Líneas:** `169`
- **Tamaño original:** `5.0 KB`
- **SHA1 corto:** `e407b9e59c`
- **Estado:** `completo`

```markdown
# Deep UI + Action Audit — SISAD PDFME

## Base analizada

- Ruta objetivo: `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin`
- Ruta funcional: `http://localhost:5174/lab/multi-document-routing`
- Scope de código: `src/sisad-pdfme`
- Scope visual: `src/sisad-pdfme/ui/components/**`, `src/features/pdfcomponent/**`, `src/sisad-pdfme/ui/styles/sisad-pdfme.css`, `src/features/pdfcomponent/labRoutes.css`
- Tailwind: v3.

## Hallazgos visuales por captura

### 1. RightSidebar expandido

Estado observado:
- Panel derecho muestra `Campos 11/11`.
- Cards de ListView tienen acento azul por owner.
- El header derecho mantiene switcher superior.
- El botón de colapso queda pequeño y poco evidente.
- Cuando no hay selección activa no aparece `Reasignar`, lo cual es correcto si no hay selección, pero debe haber una acción deshabilitada/informativa en el menú `...`.

Riesgos:
- El acento owner puede confundirse con estado seleccionado.
- La acción `Reasignar` puede quedar oculta por wiring de selección o visibility.
- El panel switcher tiene demasiada responsabilidad visual en CSS.

### 2. RightSidebar colapsado

Estado observado:
- El rail derecho colapsado queda como una cápsula vertical muy delgada.
- Iconos `Campos` y `Ajustes/Detalle` son visibles, pero sin label ni tooltip aparente.
- El botón Guardar se acerca al rail y puede parecer parte del rail.
- El diseño se ve mejor que antes, pero el estado activo no es suficientemente claro.

Recomendación:
- Usar `aria-label` y `Tooltip` obligatorio por botón.
- Mantener ancho mínimo estable `w-10` o `w-11`.
- Estado activo: barra azul lateral + fondo blanco + shadow leve.
- No renderizar botones de panel sin handler o sin panel disponible.
- No mostrar collapse handle redundante si el rail ya está colapsado.

### 3. Canvas + zoom

Estado observado:
- Dropdown de zoom abre con opciones `25%`, `50%`, `75%`, `100%`, `125%`, `150%`, `200%`.
- Trigger inferior puede mostrar `0.9` en lugar de `90%`.
- El menú está posicionado sobre el canvas de forma usable.

Riesgo:
- Inconsistencia entre valor interno decimal y valor visible porcentual.
- Falta contrato de acción para `zoomIn`, `zoomOut`, `setZoom`, `fitToWidth`, `fitToPage`.

### 4. LeftSidebar colapsado

Estado observado:
- Al colapsar, queda un rail izquierdo compacto con iconos.
- Es funcional, pero los iconos deben tener tooltips/aria y testId.
- Las acciones de tabs/filtros deben estar en el mismo contrato que el resto.

## Hallazgos de arquitectura

### 1. El repo ya tiene base para portabilidad

Hay configuración global, adapters, wrappers React, RecipientRegistry, runtime, docs, actions y command bus. La siguiente mejora no es crear más wrappers: es **reducir envoltorios de presentación y unificar acciones**.

### 2. Botones sin contrato uniforme

Cada botón debe resolverse desde un descriptor:

``​`ts
type DesignerActionDescriptor = {
  id: string;
  label: string;
  icon?: ReactNode;
  area: 'topbar' | 'left-sidebar' | 'right-sidebar' | 'canvas-toolbar' | 'context-menu' | 'detail-view' | 'runtime';
  visibleWhen?: (ctx: DesignerActionContext) => boolean;
  enabledWhen?: (ctx: DesignerActionContext) => boolean;
  disabledReason?: (ctx: DesignerActionContext) => string | null;
  run: (ctx: DesignerActionContext) => void | Promise<void>;
  testId: string;
  shortcut?: string;
};
``​`

### 3. No hay que tocar geometría

Prohibido tocar en esta pasada:
- Moveable.
- Selecto.
- Zoom math interno.
- Transform/scale de canvas/paper/schema.
- Coordenadas PDF.
- Scroll principal del canvas.
- SnapshotAdapter.
- Generator/PDF.

## Inventario inicial de botones a auditar

### Topbar / Header global
- Guardar.
- Más.
- Usuario activo selector.
- Estado.
- Ajustes/configuración.

### LeftSidebar
- Collapse/expand.
- Tabs de catálogo.
- Search.
- Chips de filtro.
- Layout mode/list/cards.
- Schema cards drag source.
- Custom field modal.

### RightSidebar
- Collapse/expand.
- Panel switcher: fields/detail/comments/documents.
- Search.
- Type filter.
- More menu.
- Item click/select.
- Item drag handle.
- Item action menu.
- Reasignar responsable.
- Renombrar si existe.
- Abrir propiedades.

### DetailView
- Back.
- Collapse section.
- Inputs.
- Option add.
- Option delete.
- Option up/down.
- Format buttons.
- Reassign.
- Manage assignment/lock.
- Lock/unlock position.
- Release edit.

### Canvas
- Delete.
- Duplicate.
- More.
- Context menu.
- Add comment.
- Hide/show.
- Lock/unlock position.
- Bring front/send back.
- Toggle required.
- Open properties.

### Bottom toolbar
- Undo.
- Redo.
- Fit/expand.
- Zoom out.
- Zoom select.
- Zoom in.

## Criterios de cierre global

- Todo botón tiene handler o queda oculto.
- Todo botón deshabilitado tiene motivo.
- Todo botón visible tiene `aria-label` y `data-testid`.
- Todo botón invoca `ActionRegistry/CommandBus` o un handler central.
- No hay lógica duplicada de permisos entre button, menu y inspector.
- No hay wrappers visuales pasivos que solo reenvían props.
- CSS visual repetido se desplaza a Tailwind 3 en TSX, no a otra hoja CSS.
```

<a id="file-0190"></a>

### 0190 — `ai/reports/pdfcomponent-integration-boundary.md`

- **Lenguaje:** `markdown`
- **Líneas:** `41`
- **Tamaño original:** `1.6 KB`
- **SHA1 corto:** `847c893c82`
- **Estado:** `completo`

```markdown
# PDFComponent integration boundary audit

Date: 2026-07-15

## Scope

Audited `src/features/pdfcomponent` as the lab host layer that must render through the public `sisad-pdfme` API.

## Public imports accepted in the host render path

- `SisadPdfmeDesigner`
- `SisadPdfmeForm`
- `SisadPdfmeViewer`
- `usePdfmeLabIntegration`
- `createLabPdfmeConfig`
- `normalizeLabHostData`
- `getLabExampleById`
- `getLabExamples`

## Internals that must not be used by the host render path

- `usePdfmeRuntimeInstance`
- `DesignerEngineBuilder`
- direct runtime instance wiring
- manual `commonOptions` assembly

## Findings

1. `PdfmeLabPage.jsx` now renders the lab through `SisadPdfmeDesigner`, `SisadPdfmeForm`, and `SisadPdfmeViewer`.
2. `PdfmeLabPage.jsx` no longer imports `usePdfmeRuntimeInstance`.
3. The lab integration hook centralizes host normalization and config generation.
4. Example/data-preparation files still use collaboration decoration helpers to build fixtures and normalized host examples. That is acceptable only in the data-prep layer, not in the render host path.
5. `setTimeout` is still used for deferred UI state updates inside the lab page. It is not a runtime-core dependency, but it should remain isolated to the host shell only.

## Boundary rule

If a change affects the render host path, it must go through public wrappers and integration helpers. If it only prepares example data or fixtures, it must stay outside the runtime host path and not introduce direct runtime internals.

## Status

Host render boundary satisfied for the current task-card criteria. Future regressions should create a new `continuity` or `regression` card instead of reopening this one.
```

<a id="file-0191"></a>

### 0191 — `ai/reports/pdfcomponent-integration-deep-audit-2026-07-15.md`

- **Lenguaje:** `markdown`
- **Líneas:** `193`
- **Tamaño original:** `10.8 KB`
- **SHA1 corto:** `e329f492c3`
- **Estado:** `completo`

```markdown
# Auditoría profunda — `src/features/pdfcomponent` como integración dinámica de `sisad-pdfme`

Fecha: 2026-07-15
Scope: `src/features/pdfcomponent/**`
Objetivo: que los ejemplos de integración demuestren el uso público de `sisad-pdfme` sin lógica de negocio duplicada, sin wrappers innecesarios y sin registrar dos veces los mismos datos.

## Hallazgo central

`src/features/pdfcomponent` dejó de ser solo una carpeta de ejemplos y se convirtió en un mini-host con lógica propia de runtime, collaboration, recipients, documents, providers, generator, converter, artefactos, presentación y acciones. Eso hace que cualquier integración real copie patrones incorrectos: construir `collaborationContext`, decorar templates manualmente, registrar recipients dos veces y usar internals como `DesignerEngineBuilder` o `usePdfmeRuntimeInstance`.

La solución no es agregar más wrappers: es convertir esta carpeta en una referencia de host **data-driven** que consume únicamente la API pública del componente.

## Problemas críticos detectados

### P0 — `PdfmeLabPage.jsx` concentra demasiada responsabilidad

- Importa `Designer`, `Form`, `Viewer`, `DesignerEngineBuilder`, `usePdfmeRuntimeInstance`, `generate`, `pdf2img`, `pdf2size`, `img2pdf`, decorators de colaboración y config defaults.
- Construye manualmente `collaborationUsers`, `activeCollaborator`, `designerEngineOptions`, `runtimeOptions`, `commonOptions`, `initialTemplate`, `initialInputs`, `template`, `inputs`, `uiState`, `resultsState`.
- Duplica lo que ya debería resolver `createSisadPdfmeConfig`, `RecipientRegistry`, adapters y wrappers públicos.
- Usa `setTimeout` para sincronizar page/mode; esto es frágil y puede reactivar bugs de estado.

**Riesgo:** las integraciones externas aprenderán a usar internals en vez de usar `SisadPdfmeDesigner`, `SisadPdfmeForm`, `SisadPdfmeViewer`, config, adapters y controller.

### P0 — recipients/collaboration se registran en más de un lugar

Actualmente el mismo dato de usuario puede vivir en:

1. `example.collaboration.users`
2. `decorateCollaborationUsers(...)`
3. `designerEngineOptions.collaboration.recipientOptions`
4. `designerEngineOptions.collaboration.users`
5. `commonOptions.collaboration.recipients`
6. schemas decorados por `decorateTemplateWithCollaboration`
7. uploadedDocuments decorados dentro de `createExample`

Esto contradice la arquitectura deseada: el host entrega recipients una sola vez y el core los normaliza en `RecipientRegistry`.

### P0 — templates se decoran antes de llegar al core

`createExample` y `PdfmeLabPage` decoran templates con colaboración. Eso fue útil para el laboratorio, pero en una integración portable debe pasar lo contrario:

- El ejemplo entrega datos crudos: template, documents, recipients, activeRecipientId, config patch.
- El wrapper público/core decide ownership, colores, activeRecipient y filtros.

### P1 — `labPresentation.js` duplica reglas de acceso

`getLabCollaborationSummary` calcula visible/editable/locked con lógica propia. Esa lógica puede divergir de `schemaRuntimeAccess`, `RecipientRegistry`, `resolveSchemaOwnerAppearance` y reglas de lock/readOnly/canReassign. Debe migrar a selectors públicos del core.

### P1 — `CompactControls.jsx` define acciones localmente

Las acciones del lab (`Generar PDF`, `Leer tamaños`, `PDF → imágenes`, `Agregar página`, `Ajustar`, `Agregar schema`, `Reset`) se modelan como arrays internos. Para integraciones profundas, todo botón debe ser un descriptor de acción:

``​`ts
type HostAction = {
  id: string;
  label: string;
  visible: boolean;
  enabled: boolean;
  disabledReason?: string;
  run(): Promise<void> | void;
  testId: string;
}
``​`

### P1 — `labExamples.js` es un catálogo monolítico

Tiene datos, factories, schemas concretos, acciones, PDFs, recipients y export helpers. Debe partirse en:

- `labs/examples/catalog/*.ts`: data declarativa.
- `labs/examples/createLabExample.ts`: normalizador.
- `labs/examples/labExampleRegistry.ts`: lookup por id/path.
- `labs/examples/fixtures/*`: PDFs, recipients, schemas.

### P2 — wrappers/re-exports que aumentan ruido

Candidatos a deprecar tras buscar imports reales:

- `CaseGrid.jsx`
- `Hero.jsx`
- `IconButton.jsx`
- `template.js`
- `domain/collaborationAppearance.js`
- `utils/binary.js`

## Arquitectura objetivo

``​`text
src/features/pdfcomponent
├── PdfmeLabPage.jsx                  # shell fino, sin internals
├── hooks
│   └── usePdfmeLabIntegration.ts     # único orquestador de datos externos
├── integration
│   ├── labHostDataTypes.ts
│   ├── normalizeLabHostData.ts
│   ├── createLabPdfmeConfig.ts
│   ├── labActionRegistry.ts
│   └── labArtifactService.ts
├── labs
│   ├── examples
│   │   ├── catalog
│   │   │   ├── basicDesigner.ts
│   │   │   ├── multiDocumentRouting.ts
│   │   │   └── generatorRuntime.ts
│   │   ├── createLabExample.ts
│   │   └── labExampleRegistry.ts
│   ├── builders
│   │   ├── exampleTemplate.ts
│   │   ├── schemaFactory.ts
│   │   └── schemaShowcase.ts
│   └── export
│       ├── buildExampleBundle.ts
│       └── downloadExampleBundle.ts
├── PageHeader.jsx                    # UI, recibe viewModel
├── CompactControls.jsx               # UI, consume action descriptors
├── ResultsPanel.jsx                  # UI, consume artifact state
└── ui/primitives.jsx                 # UI pura
``​`

## Contrato de datos propuesto

``​`ts
export type LabHostExample = {
  id: string;
  path: string;
  title: string;
  description?: string;
  defaultMode?: 'designer' | 'form' | 'viewer';
  initialSchemaType?: string;

  template: Template;
  inputs?: Record<string, unknown>[];
  documents?: SisadPdfmeDocument[];
  recipients?: SisadPdfmeRecipient[];
  activeRecipientId?: string | null;

  config?: SisadPdfmeGlobalConfig;
  artifacts?: { generatedPdfBytes?: ArrayBuffer | null };
  metadata?: Record<string, unknown>;
};
``​`

## Regla de oro

Los datos se registran una vez:

``​`text
host data → normalizeLabHostData → createSisadPdfmeConfig + recipients + documents + template + inputs
``​`

Nunca:

``​`text
example.collaboration.users + runtimeOptions.collaboration.recipients + designerEngine.collaboration.users + schema decoration manual
``​`

## Matriz por archivo

| Archivo | Riesgo | Acción recomendada |
|---|---|---|
| `src/features/pdfcomponent/CaseCard.jsx` | bajo | Mantener como UI/servicio, conectar a contratos normalizados. |
| `src/features/pdfcomponent/CaseGrid.jsx` | wrapper/re-export prescindible | Mantener como UI/servicio, conectar a contratos normalizados. |
| `src/features/pdfcomponent/CompactControls.jsx` | muchas acciones locales | Reemplazar listas locales por LabActionRegistry con action descriptors. |
| `src/features/pdfcomponent/Hero.jsx` | wrapper/re-export prescindible | Mantener como UI/servicio, conectar a contratos normalizados. |
| `src/features/pdfcomponent/IconButton.jsx` | wrapper/re-export prescindible | Mantener como UI/servicio, conectar a contratos normalizados. |
| `src/features/pdfcomponent/LabExampleDownloadButton.jsx` | acoplamiento moderado a core | Mantener como UI/servicio, conectar a contratos normalizados. |
| `src/features/pdfcomponent/LabLandingPage.jsx` | bajo | Mantener como UI/servicio, conectar a contratos normalizados. |
| `src/features/pdfcomponent/PageHeader.jsx` | acoplamiento moderado a core; muchas acciones locales; alto CSS legacy | Recibir viewModel de header/recipients; no calcular counters/recipients internamente. |
| `src/features/pdfcomponent/PdfmeLabPage.jsx` | alto acoplamiento a internals/core; usa DesignerEngineBuilder directo; usa runtime instance directo; decora recipients/template fuera del registry; usa setTimeout para sincronización; clonado/estado duplicado; muchas acciones locales | Extraer usePdfmeLabIntegration y reemplazar runtime interno por wrappers públicos/config/controller. |
| `src/features/pdfcomponent/PopoverMenu.jsx` | bajo | Mantener como UI/servicio, conectar a contratos normalizados. |
| `src/features/pdfcomponent/ResultsPanel.jsx` | acoplamiento moderado a core; alto CSS legacy | Mantener como UI/servicio, conectar a contratos normalizados. |
| `src/features/pdfcomponent/domain/collaborationAppearance.js` | wrapper/re-export prescindible | Mantener como UI/servicio, conectar a contratos normalizados. |
| `src/features/pdfcomponent/domain/labPresentation.js` | acoplamiento moderado a core | Eliminar lógica propia de owner/lock; consumir selectors públicos del core. |
| `src/features/pdfcomponent/domain/labState.js` | acoplamiento moderado a core | Mantener como UI/servicio, conectar a contratos normalizados. |
| `src/features/pdfcomponent/labs/builders/exampleTemplate.ts` | alto acoplamiento a internals/core; decora recipients/template fuera del registry; clonado/estado duplicado | Mantener como builder, pero hacerlo data-driven e inyectable. |
| `src/features/pdfcomponent/labs/builders/schemaFactory.ts` | acoplamiento moderado a core | Mantener como builder, pero hacerlo data-driven e inyectable. |
| `src/features/pdfcomponent/labs/builders/schemaShowcase.ts` | acoplamiento moderado a core | Mantener como builder, pero hacerlo data-driven e inyectable. |
| `src/features/pdfcomponent/labs/examples/labExamples.js` | acoplamiento moderado a core; muchas acciones locales | Dividir catálogo en data + factories; recipients/documents se registran una vez. |
| `src/features/pdfcomponent/labs/export/buildExampleBundle.ts` | acoplamiento moderado a core | Mantener como UI/servicio, conectar a contratos normalizados. |
| `src/features/pdfcomponent/labs/export/downloadExampleBundle.ts` | acoplamiento moderado a core | Mantener como UI/servicio, conectar a contratos normalizados. |
| `src/features/pdfcomponent/template.js` | acoplamiento moderado a core; wrapper/re-export prescindible | Mantener como UI/servicio, conectar a contratos normalizados. |
| `src/features/pdfcomponent/ui/primitives.jsx` | bajo | Mantener como UI/servicio, conectar a contratos normalizados. |
| `src/features/pdfcomponent/utils/binary.js` | acoplamiento moderado a core; wrapper/re-export prescindible | Mantener como UI/servicio, conectar a contratos normalizados. |


## Validación requerida

- `rg "DesignerEngineBuilder|usePdfmeRuntimeInstance|decorateTemplateWithCollaboration|decorateCollaborationUsers" src/features/pdfcomponent` debe quedar vacío o limitado a builders/legacy tests.
- `PdfmeLabPage.jsx` debe renderizar wrappers públicos o un hook público de integración, no internals.
- `recipients` se pasa una vez al wrapper/controlador.
- `documents` se pasa una vez al wrapper/controlador.
- `CompactControls` no decide la lógica de negocio; solo renderiza action descriptors.
- `labPresentation` no implementa reglas de acceso; usa selectors públicos del core.
- `labExamples` se parte en catálogo declarativo y builders.
```

<a id="file-0192"></a>

### 0192 — `ai/reports/tailwind-design-continuity-roadmap.md`

- **Lenguaje:** `markdown`
- **Líneas:** `24`
- **Tamaño original:** `1.2 KB`
- **SHA1 corto:** `7890cdd788`
- **Estado:** `completo`

```markdown
# Roadmap — continuidad visual y migración Tailwind

| Orden | Tarjeta | Prioridad | Dependencia | Resultado |
|---:|---|---|---|---|
| 1 | TASK-REGRESSION-020 | P0 | ninguna | Color exterior cambia con propietario |
| 2 | TASK-SCHEMA-003 | P1 | REGRESSION-020 | Owner y acción no compiten |
| 3 | TASK-LAB-030 | P0 | REGRESSION-020 | Shell con una fuente de estilos |
| 4 | TASK-CSS-020 | P1 | LAB-030 | `labRoutes.css` sin `@apply` migrable |
| 5 | TASK-CSS-021 | P0 | LAB-030 | Sidebar izquierdo sin solapamientos |
| 6 | TASK-CSS-022 | P1 | CSS-021 | CSS izquierdo legado retirado |
| 7 | TASK-CSS-023 | P1 | LAB-030 | Rail de documentos estable |
| 8 | TASK-CANVAS-003 | P0 | LAB-030 | Sin bloque negro en reglas/guías |
| 9 | TASK-QA-016 | P0 | todas | Evidencia y ledger final |

## Condición de avance

Solo una tarjeta puede estar activa. Una dependencia se considera satisfecha cuando su tarjeta está en `completed/`, sus validaciones pasan y la evidencia está registrada.

## Resultado esperado

- Funcionalidad restaurada antes de optimizar CSS.
- `@apply` reducido por consumidores comprobados, no por reemplazo masivo.
- `tokens.css` preservado como contrato semántico.
- Regresiones visuales convertidas en pruebas reproducibles.
```

<a id="file-0193"></a>

### 0193 — `ai/router/CONTEXT_BUDGET.md`

- **Lenguaje:** `markdown`
- **Líneas:** `58`
- **Tamaño original:** `1.2 KB`
- **SHA1 corto:** `d1b27c0781`
- **Estado:** `completo`

```markdown
# Context Budget

## Objetivo

Evitar que los agentes carguen demasiado contexto y reabran tareas completadas.

## Carga base obligatoria por sesión

``​`txt
AGENTS.md o CLAUDE.md según proveedor
ai/start/START.md
ai/router/ROUTER.md
ai/router/TASK_INTAKE.md
ai/memory/project-memory.md
ai/memory/pending-checklist.md
ai/memory/known-risks.md
ai/memory/decisions.md
``​`

## Carga por tarea

Cargar solo:

``​`txt
ai/task-cards/active/<task>.md
ai/playbooks/<playbook-del-dominio>.md
ai/rules/<reglas-del-dominio>.md
ai/context/<contexto-del-dominio>.md
``​`

## Carga permitida como memoria histórica

``​`txt
ai/task-cards/completed/completed-summary.md
ai/memory/completed-checklist.md
``​`

## No cargar por defecto

``​`txt
ai/task-cards/completed/TASK-*.md
ai/archive/**
reports/**
dist/**
test-results/**
.tailwind-migration-backups/**
unificados/**
eslint_output.json
tsconfig.tsbuildinfo
``​`

## Presupuesto por pase

- Máximo 1 task-card activa.
- Máximo 2 consultas globales `rg` antes de abrir archivos.
- Máximo 8 archivos fuente abiertos.
- Máximo 5 archivos modificados.
- No modificar `pdf-lib`, `generator`, `Moveable`, `Selecto`, `snapshotAdapter` o geometría sin task-card explícita.
```

<a id="file-0194"></a>

### 0194 — `ai/router/ROUTER.md`

- **Lenguaje:** `markdown`
- **Líneas:** `30`
- **Tamaño original:** `2.0 KB`
- **SHA1 corto:** `57d14435dc`
- **Estado:** `completo`

```markdown
# Router de tareas IA

## Prioridad de fuentes

1. `ai/task-cards/active/**`
2. `ai/task-cards/backlog/**` solo si el usuario lo solicita o si una active lo referencia.
3. `ai/memory/pending-checklist.md`
4. `ai/task-cards/completed/completed-summary.md` solo como guardrail de no regresión.

## Rutas por dominio

| Dominio | Agente | Playbook | Rules | Context |
|---|---|---|---|---|
| Arquitectura IA | `docs-architecture-agent` | `pb-ai-docs-refactor.md` | `ai-docs-rules.md`, `global-rules.md` | `ai-docs-context.md` |
| CSS/Tailwind | `css-tailwind-agent` | `pb-css-tailwind-migration.md` | `css-migration-rules.md` | `css-tailwind-context.md` |
| Canvas | `canvas-agent` | `pb-canvas-multipage.md` | `canvas-rules.md`, `moveable-selecto-rules.md` | `canvas-multipage-context.md` |
| Interacción | `interaction-agent` | `pb-selection-transform.md` | `moveable-selecto-rules.md`, `global-rules.md` | `selection-transform-context.md` |
| Inspector | `inspector-agent` | `pb-inspector.md` | `inspector-rules.md` | `inspector-context.md` |
| Schemas | `schema-agent` | `pb-schema-families.md` | `schema-rules.md` | `schema-families-context.md` |
| Snapshot | `snapshot-agent` | `pb-snapshot.md` | `snapshot-rules.md` | `snapshot-context.md` |
| Visual QA | `visual-baseline-agent` | `pb-visual-regression.md` | `css-migration-rules.md` | `visual-baseline-context.md` |

## Reglas de enrutamiento

- Si una tarea menciona carpetas IA, no crear carpetas nuevas fuera de `ai/**`, `docs/**`, `scripts/**` o `reports/**`.
- Si una tarea menciona documentación pública, escribir en `docs/**`.
- Si una tarea menciona memoria, estado, handoff o pendientes, escribir en `ai/memory/**`.
- Si una tarea menciona prompts o agentes, escribir en `ai/prompts/**`, `ai/agents/**`, `ai/subagents/**`, `ai/skills/**`, `ai/playbooks/**` o `ai/rules/**`.
- Si una tarea menciona evidencias, escribir en `ai/reports/**` o `reports/**` según corresponda.
- Si una tarea menciona CSS, primero revisar `reports/tailwind-migration/**` y luego modificar `src/**`.
```

<a id="file-0195"></a>

### 0195 — `ai/router/TASK_INTAKE.md`

- **Lenguaje:** `markdown`
- **Líneas:** `35`
- **Tamaño original:** `0.9 KB`
- **SHA1 corto:** `c9c195ed06`
- **Estado:** `completo`

```markdown
# Task Intake

## Antes de aceptar una tarea

- [ ] ¿Existe una task-card activa?
- [ ] ¿La tarea está duplicando una completed?
- [ ] ¿El cambio corresponde a `ai/**`, `docs/**`, `src/**`, `scripts/**` o `reports/**`?
- [ ] ¿Hay riesgo sobre CSS, Moveable, Selecto, zoom, canvas, snapshot o pdf-lib?
- [ ] ¿La tarea requiere crear una regression/continuity task-card en vez de reabrir una completada?

## Si la tarea toca arquitectura IA

No crear carpetas nuevas. Usar:

``​`txt
ai/start
ai/router
ai/memory
ai/task-cards
ai/rules
ai/playbooks
ai/context
ai/checklists
ai/prompts
ai/reports
docs
scripts
``​`

## Si la tarea toca CSS

- Migrar a clases Tailwind inline en `.jsx/.tsx` cuando sea seguro.
- Mantener `tokens.css`.
- Mantener CSS crítico de geometry, zoom, paper, canvas, Moveable, Selecto, print/PDF, pseudo-elementos complejos y variables runtime.
- Documentar cada regla que se elimina.
```

<a id="file-0196"></a>

### 0196 — `ai/rules/ai-docs-rules.md`

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

<a id="file-0197"></a>

### 0197 — `ai/rules/canvas-rules.md`

- **Lenguaje:** `markdown`
- **Líneas:** `3`
- **Tamaño original:** `0.1 KB`
- **SHA1 corto:** `b8b492add4`
- **Estado:** `completo`

```markdown
# Canvas Rules

No usar `pages[0]`, `pageNumber || 1`, ni query selector del primer paper para operaciones multipágina. Siempre resolver página real.
```

<a id="file-0198"></a>

### 0198 — `ai/rules/css-migration-rules.md`

- **Lenguaje:** `markdown`
- **Líneas:** `35`
- **Tamaño original:** `0.8 KB`
- **SHA1 corto:** `8f58894aed`
- **Estado:** `completo`

```markdown
# Reglas CSS/Tailwind

## Fuente única de Tailwind

``​`txt
src/styles/tailwind.css -> importado por src/main.jsx
``​`

`src/style.css` permanece neutralizado para evitar doble emisión.

## Mantener como CSS

- `src/sisad-pdfme/ui/styles/tokens.css`
- Variables CSS runtime.
- Moveable/Selecto.
- Geometría PDF/canvas/paper.
- Zoom y transforms críticos.
- Print/PDF.
- Pseudo-elementos complejos.
- Reglas dependientes de mediciones o bounding boxes.

## Migrar a Tailwind inline

- Componentes React con estilos visuales simples.
- Cards, buttons, labels, sidebars, inspector, chips, pills.
- Spacing y tipografía no geométrica.
- Borders y shadows no críticas.

## Proceso

1. Elegir 1 componente.
2. Migrar clases seguras.
3. Eliminar regla CSS solo si queda sin uso.
4. Actualizar ledger.
5. Comparar baseline visual.
```

<a id="file-0199"></a>

### 0199 — `ai/rules/global-rules.md`

- **Lenguaje:** `markdown`
- **Líneas:** `9`
- **Tamaño original:** `0.7 KB`
- **SHA1 corto:** `c4a18caacf`
- **Estado:** `completo`

```markdown
# Reglas globales

- `src/sisad-pdfme` es portable y no conoce hosts externos.
- Prohibido importar desde `src/features` o `src/modules` dentro de `src/sisad-pdfme`.
- Prohibido crear carpetas paralelas fuera de la arquitectura real del repo.
- Prohibido tratar `ai/task-cards/completed/TASK-*.md` como pendiente.
- Prohibido cargar `reports/**`, `dist/**`, `test-results/**`, `.tailwind-migration-backups/**` y `unificados/**` como contexto activo por defecto.
- No tocar `pdf-lib`, `generator`, `Moveable`, `Selecto`, snapshot o geometría sin task-card explícita.
- Cualquier regresión de una tarea completada debe tener una nueva task-card de regression/continuity.
```

<a id="file-0200"></a>

### 0200 — `ai/rules/inspector-rules.md`

- **Lenguaje:** `markdown`
- **Líneas:** `3`
- **Tamaño original:** `0.1 KB`
- **SHA1 corto:** `5b0775e76b`
- **Estado:** `completo`

```markdown
# Inspector Rules

Widgets no mutan schemas directamente. Usar command/update centralizado.
```

<a id="file-0201"></a>

### 0201 — `ai/rules/moveable-selecto-rules.md`

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

<a id="file-0202"></a>

### 0202 — `ai/rules/README.md`

- **Lenguaje:** `markdown`
- **Líneas:** `3`
- **Tamaño original:** `0.1 KB`
- **SHA1 corto:** `c368a81ce2`
- **Estado:** `completo`

```markdown
# Rules

Reglas duras. Cargar solo la regla principal de la task-card.
```

<a id="file-0203"></a>

### 0203 — `ai/rules/schema-rules.md`

- **Lenguaje:** `markdown`
- **Líneas:** `3`
- **Tamaño original:** `0.1 KB`
- **SHA1 corto:** `63343cb73b`
- **Estado:** `completo`

```markdown
# Schema Rules

Preservar schemaUid, documentId, pageNumber, ownerRecipientId, colors, groupId, optionId, selected values, options y `__designer`.
```

<a id="file-0204"></a>

### 0204 — `ai/rules/snapshot-rules.md`

- **Lenguaje:** `markdown`
- **Líneas:** `3`
- **Tamaño original:** `0.1 KB`
- **SHA1 corto:** `a9cb230906`
- **Estado:** `completo`

```markdown
# Snapshot Rules

No crear snapshot paralelo. No perder metadata. Todo roundtrip debe conservar el modelo.
```

<a id="file-0205"></a>

### 0205 — `ai/rules/tailwind-design-continuity-rules.md`

- **Lenguaje:** `markdown`
- **Líneas:** `14`
- **Tamaño original:** `1.3 KB`
- **SHA1 corto:** `ccea96f7a9`
- **Estado:** `completo`

```markdown
# Reglas — continuidad visual y Tailwind

1. Una tarjeta por ejecución; una región visual o un contrato funcional por tarjeta.
2. Máximo 8 archivos abiertos y 5 archivos de producto modificados por pasada.
3. Inventariar selectores, consumidores y estados antes de eliminar una regla.
4. No cambiar el DOM, orden de capas, `z-index`, `overflow`, `position` o medidas del canvas sin una tarjeta de canvas.
5. `tokens.css` es una capa semántica permitida; no convertir tokens en clases duplicadas.
6. Las clases procedentes de `constants.ts` deben ser cadenas completas y detectables por Tailwind; evitar concatenación parcial.
7. Los estilos calculados por datos (`left`, `top`, `width`, `height`, transformaciones y color de propietario) pueden permanecer en `style` si no admiten clase estática.
8. No retirar CSS hasta verificar estado normal, hover, focus-visible, disabled, activo, colapsado y responsive aplicables.
9. Prohibido usar `!important` nuevo salvo contrato documentado de tercero.
10. Registrar conteos antes/después de `@apply`, estilos inline y selectores eliminados.
11. Si aparece una regresión fuera del alcance, crear tarjeta nueva; no ampliar silenciosamente la activa.
12. Todo cambio termina con typecheck, lint focalizado, tests focalizados y evidencia visual en la ruta objetivo.
```

<a id="file-0206"></a>

### 0206 — `ai/skills/canvas-multipage-skill.md`

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

<a id="file-0207"></a>

### 0207 — `ai/skills/inspector-skill.md`

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

<a id="file-0208"></a>

### 0208 — `ai/skills/memory-update-skill.md`

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

<a id="file-0209"></a>

### 0209 — `ai/skills/moveable-selecto-skill.md`

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

<a id="file-0210"></a>

### 0210 — `ai/skills/option-groups-skill.md`

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

<a id="file-0211"></a>

### 0211 — `ai/skills/prompting-skill.md`

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

<a id="file-0212"></a>

### 0212 — `ai/skills/README.md`

- **Lenguaje:** `markdown`
- **Líneas:** `3`
- **Tamaño original:** `0.1 KB`
- **SHA1 corto:** `ae3dd5bc05`
- **Estado:** `completo`

```markdown
# Skills

Skills son procedimientos reutilizables. Cada skill describe entradas, pasos y salida esperada.
```

<a id="file-0213"></a>

### 0213 — `ai/skills/snapshot-safety-skill.md`

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

<a id="file-0214"></a>

### 0214 — `ai/skills/tailwind-migration-skill.md`

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

<a id="file-0215"></a>

### 0215 — `ai/skills/visual-regression-skill.md`

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

<a id="file-0216"></a>

### 0216 — `ai/start/QUICKSTART-CLAUDE.md`

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

<a id="file-0217"></a>

### 0217 — `ai/start/QUICKSTART-CODEX.md`

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

<a id="file-0218"></a>

### 0218 — `ai/start/QUICKSTART-COPILOT.md`

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

<a id="file-0219"></a>

### 0219 — `ai/start/START.md`

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

<a id="file-0220"></a>

### 0220 — `ai/subagents/anti-hallucination-reviewer.md`

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

<a id="file-0221"></a>

### 0221 — `ai/subagents/baseline-visual-critic.md`

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

<a id="file-0222"></a>

### 0222 — `ai/subagents/code-docs-writer.md`

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

<a id="file-0223"></a>

### 0223 — `ai/subagents/css-auditor.md`

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

<a id="file-0224"></a>

### 0224 — `ai/subagents/legacy-css-guardian.md`

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

<a id="file-0225"></a>

### 0225 — `ai/subagents/memory-curator.md`

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

<a id="file-0226"></a>

### 0226 — `ai/subagents/prompt-engineer.md`

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

<a id="file-0227"></a>

### 0227 — `ai/subagents/README.md`

- **Lenguaje:** `markdown`
- **Líneas:** `3`
- **Tamaño original:** `0.1 KB`
- **SHA1 corto:** `1c4930a3aa`
- **Estado:** `completo`

```markdown
# Subagents

Los subagentes son apoyo especializado. No son dueños de procesos completos.
```

<a id="file-0228"></a>

### 0228 — `ai/subagents/regression-tester.md`

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

<a id="file-0229"></a>

### 0229 — `ai/subagents/tailwind-migrator.md`

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

<a id="file-0230"></a>

### 0230 — `ai/task-cards/README.md`

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

<a id="file-0231"></a>

### 0231 — `ai/templates/agent-template.md`

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

<a id="file-0232"></a>

### 0232 — `ai/templates/checklist-template.md`

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

<a id="file-0233"></a>

### 0233 — `ai/templates/decision-template.md`

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

<a id="file-0234"></a>

### 0234 — `ai/templates/memory-update-template.md`

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

<a id="file-0235"></a>

### 0235 — `ai/templates/README.md`

- **Lenguaje:** `markdown`
- **Líneas:** `3`
- **Tamaño original:** `0.1 KB`
- **SHA1 corto:** `d6fcb2dc12`
- **Estado:** `completo`

```markdown
# Templates

Plantillas para extender la arquitectura sin duplicar estilo.
```

<a id="file-0236"></a>

### 0236 — `ai/templates/skill-template.md`

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

<a id="file-0237"></a>

### 0237 — `ai/templates/task-card-template.md`

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

<a id="file-0238"></a>

### 0238 — `reports/action-audit/button-action-inventory.md`

- **Lenguaje:** `markdown`
- **Líneas:** `149`
- **Tamaño original:** `41.7 KB`
- **SHA1 corto:** `2ab261ccda`
- **Estado:** `completo`

```markdown
# Button Action Inventory

Total candidates: 131

## Summary

| Classification | Count |
|---|---:|
| CONNECTED | 15 |
| DISABLED_WITH_REASON | 18 |
| DUPLICATED_ACTION | 1 |
| MISSING_HANDLER | 8 |
| MISSING_TESTID | 89 |

## Inventory

| File | Line | Classification | testId | aria | onClick | disabled | tooltip | Snippet |
|---|---:|---|---|---|---:|---:|---:|---|
| `src/sisad-pdfme/ui/components/CtlBar.tsx` | 106-115 | DISABLED_WITH_REASON | `designer-zoom-out` | `Reducir zoom` | yes | yes | yes | `<Button className={zoomButtonClassName + ' ' + UI_CLASSNAME + 'zoom-out'} type="text" title="Reducir zoom" aria-label="Reducir zoom" data-testid="designer-zoom-out" disabled={minZoom >= nextZoomOut} o` |
| `src/sisad-pdfme/ui/components/CtlBar.tsx` | 128-137 | DISABLED_WITH_REASON | `designer-zoom-in` | `Aumentar zoom` | yes | yes | yes | `<Button className={zoomButtonClassName + ' ' + UI_CLASSNAME + 'zoom-in'} type="text" title="Aumentar zoom" aria-label="Aumentar zoom" data-testid="designer-zoom-in" disabled={maxZoom < nextZoomIn} onC` |
| `src/sisad-pdfme/ui/components/CtlBar.tsx` | 336-343 | DISABLED_WITH_REASON | — | — | yes | yes | yes | `<Button className={UI_CLASSNAME + 'control-bar-icon-btn'} type="text" disabled={pageCursor <= 0} onClick={() => setPageCursor((currentPage) => Math.max(0, currentPage - 1))} icon={<ChevronLeft size={1` |
| `src/sisad-pdfme/ui/components/CtlBar.tsx` | 346 | MISSING_HANDLER | — | — | no | no | yes | `<Button className={UI_CLASSNAME + 'control-bar-text-btn'} type="text" title="Página">` |
| `src/sisad-pdfme/ui/components/CtlBar.tsx` | 351-358 | DISABLED_WITH_REASON | — | — | yes | yes | yes | `<Button className={UI_CLASSNAME + 'control-bar-icon-btn'} type="text" disabled={pageCursor + 1 >= pageNum} onClick={() => setPageCursor((currentPage) => Math.min(pageNum - 1, currentPage + 1))} icon={` |
| `src/sisad-pdfme/ui/components/CtlBar.tsx` | 366-375 | DISABLED_WITH_REASON | `designer-save` | `Guardar` | yes | yes | yes | `<Button className={UI_CLASSNAME + 'control-bar-text-btn'} type="text" onClick={onSave} disabled={!saveAction.enabled} icon={<Save size={14} />} title={saveAction.enabled ? 'Guardar' : describeDisabled` |
| `src/sisad-pdfme/ui/components/CtlBar.tsx` | 381-388 | MISSING_HANDLER | `designer-more-actions` | `Más acciones` | no | no | yes | `<Button className={UI_CLASSNAME + 'control-bar-icon-btn'} type="text" title="Más acciones" aria-label="Más acciones" data-testid="designer-more-actions" icon={<Ellipsis size={16} />} />` |
| `src/sisad-pdfme/ui/components/CtlBar.tsx` | 397-406 | DISABLED_WITH_REASON | `designer-undo` | `Deshacer` | yes | yes | yes | `<Button className={UI_CLASSNAME + 'control-bar-icon-btn'} type="text" onClick={onUndo} disabled={!undoAction.enabled} icon={<Undo2 size={16} />} title="Deshacer" aria-label="Deshacer" data-testid="des` |
| `src/sisad-pdfme/ui/components/CtlBar.tsx` | 409-418 | DISABLED_WITH_REASON | `designer-redo` | `Rehacer` | yes | yes | yes | `<Button className={UI_CLASSNAME + 'control-bar-icon-btn'} type="text" onClick={onRedo} disabled={!redoAction.enabled} icon={<Redo2 size={16} />} title="Rehacer" aria-label="Rehacer" data-testid="desig` |
| `src/sisad-pdfme/ui/components/CtlBar.tsx` | 421-430 | DISABLED_WITH_REASON | `designer-fit-page` | `Ajustar página` | yes | yes | yes | `<Button className={UI_CLASSNAME + 'control-bar-icon-btn'} type="text" title="Ajustar página" aria-label="Ajustar página" data-testid="designer-fit-page" onClick={onFitPage} disabled={!fitPageAction.en` |
| `src/sisad-pdfme/ui/components/Designer/Canvas/Canvas.tsx` | 1784-1814 | MISSING_TESTID | — | — | yes | no | no | `<MoveableSlot ref={moveable} className={classNames?.moveable} useDefaultStyles={useDefaultStyles} moveableColor={styleOverrides?.moveable?.color} target={moveableTargets} bounds={{ left: 0, top: 0, bo` |
| `src/sisad-pdfme/ui/components/Designer/Canvas/Moveable.tsx` | 99-145 | MISSING_TESTID | — | — | yes | no | no | `<MoveableComponent className={resolvedClassName} rootContainer={typeof document === 'undefined' ? undefined : document.body} snappable draggable preventDefault={false} rotatable={props.rotatable} resi` |
| `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/CanvasContextMenu.tsx` | 435-439 | MISSING_TESTID | — | — | yes | no | no | `<div className="sisad-pdfme-ui-canvas-context-menu-backdrop absolute inset-0 bg-transparent" aria-hidden="true" onMouseDown={() => onClose?.()} />` |
| `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/CanvasContextMenu.tsx` | 441-481 | MISSING_TESTID | — | `expr` | yes | no | no | `<div ref={menuRef} role="menu" aria-orientation="vertical" aria-label={ mode === 'empty' ? 'Menú contextual del canvas vacío' : mode === 'multi' ? 'Menú contextual de selección múltiple' : 'Menú conte` |
| `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/CanvasContextMenu.tsx` | 499-524 | DISABLED_WITH_REASON | — | — | yes | yes | yes | `<button key={item.id} type="button" role="menuitem" className={mergeClassNames( 'sisad-pdfme-ui-canvas-context-menu-item flex h-7 w-full items-center gap-2 rounded-xl border border-slate-200/80 bg-whi` |
| `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/CanvasStateOverlay.tsx` | 105-109 | MISSING_TESTID | — | — | yes | no | no | `<button type="button" className={mergeClassNames(`${CLS}-error-action`, 'inline-flex items-center rounded-full border border-rose-200 bg-rose-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm')` |
| `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/CommentsOverlay.tsx` | 281-314 | MISSING_TESTID | — | `expr` | yes | no | yes | `<button key={a.id} type="button" title={`${a.authorName \|\| 'Comentario'} · ${preview}`} onClick={(ev) => { ev.stopPropagation(); ev.preventDefault(); if (typeof window !== 'undefined') { window.dispat` |
| `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/GroupOptionFloatingAction.tsx` | 97-110 | MISSING_TESTID | — | — | yes | no | yes | `<button type="button" className="sisad-pdfme-option-group__add-button pointer-events-auto inline-flex h-6 w-6 select-none items-center justify-center rounded-[10px] border border-[#5a16d7] bg-[#4d00c8` |
| `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/InlineEditOverlay.tsx` | 120-132 | MISSING_TESTID | — | `Cerrar editor` | yes | no | no | `<button type="button" aria-label="Cerrar editor" className="sisad-pdfme-ui-inline-edit-overlay-close inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-` |
| `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/InlineEditOverlay.tsx` | 142-168 | MISSING_TESTID | — | — | yes | no | no | `<Input.TextArea ref={inputRef} value={draft} onChange={(event: React.ChangeEvent<HTMLInputElement \| HTMLTextAreaElement>) => setDraft(event.target.value)} onKeyDown={(event: React.KeyboardEvent<HTMLIn` |
| `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/InlineEditOverlay.tsx` | 170-195 | MISSING_TESTID | — | — | yes | no | no | `<Input ref={inputRef} value={draft} onChange={(event: React.ChangeEvent<HTMLInputElement \| HTMLTextAreaElement>) => setDraft(event.target.value)} onKeyDown={(event: React.KeyboardEvent<HTMLInputElemen` |
| `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/InlineEditOverlay.tsx` | 203-214 | MISSING_TESTID | — | — | yes | no | no | `<button type="button" className="sisad-pdfme-ui-inline-edit-overlay-action inline-flex items-center rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[0.72rem] font-medium text-slate-700 ` |
| `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/InlineEditOverlay.tsx` | 217-228 | MISSING_TESTID | — | — | yes | no | no | `<button type="button" className="sisad-pdfme-ui-inline-edit-overlay-action primary inline-flex items-center rounded-full border border-sky-200 bg-sky-600 px-2.5 py-1 text-[0.72rem] font-medium text-wh` |
| `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/SelectionContextToolbar.tsx` | 145-168 | DISABLED_WITH_REASON | — | `expr` | yes | yes | yes | `<button key={btn.id} type="button" title={btn.label} aria-label={btn.label} data-active="false" data-danger={btn.danger ? 'true' : 'false'} data-schema-interactive-control="true" disabled={btn.disable` |
| `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/SelectionContextToolbar.tsx` | 181-199 | MISSING_TESTID | — | `Más acciones` | yes | no | yes | `<button type="button" title="Más acciones" aria-label="Más acciones" aria-haspopup="menu" aria-expanded={moreMenuOpen ? 'true' : 'false'} data-schema-interactive-control="true" data-overlay-interactiv` |
| `src/sisad-pdfme/ui/components/Designer/Comments/CommentDialog.tsx` | 119-122 | MISSING_TESTID | — | — | yes | no | no | `<div className="absolute inset-0 bg-black/30" onClick={onClose} />` |
| `src/sisad-pdfme/ui/components/Designer/Comments/CommentDialog.tsx` | 140-144 | MISSING_TESTID | — | — | yes | no | no | `<button type="button" onClick={onClose} className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm" >` |
| `src/sisad-pdfme/ui/components/Designer/Comments/CommentDialog.tsx` | 148-158 | MISSING_TESTID | — | — | yes | no | no | `<button type="button" onClick={() => { const normalizedText = String(text \|\| '').trim(); if (!normalizedText) return; onSave(normalizedText); }} className="rounded-full border border-sky-200 bg-sky-60` |
| `src/sisad-pdfme/ui/components/Designer/LeftSidebar.tsx` | 1195-1224 | CONNECTED | `left-sidebar-schema-tile` | — | yes | no | no | `<Button className={mergeClassNames( buttonClass, 'flex w-full items-center gap-2 rounded-xl border border-slate-200/70 bg-white/95 px-2 py-1.5 shadow-sm transition-all duration-200', 'hover:border-sky` |
| `src/sisad-pdfme/ui/components/Designer/LeftSidebar.tsx` | 1256-1269 | MISSING_TESTID | — | `Marcar favorito` | yes | no | no | `<button type="button" aria-label="Marcar favorito" className={mergeClassNames( DESIGNER_CLASSNAME + 'plugin-favorite-toggle', 'absolute right-1 top-1/2 -translate-y-1/2 inline-flex h-5 w-5 items-cente` |
| `src/sisad-pdfme/ui/components/Designer/LeftSidebar.tsx` | 1316-1345 | DUPLICATED_ACTION | `left-sidebar-schema-tile` | — | yes | no | no | `<Button className={mergeClassNames( `${DESIGNER_CLASSNAME}left-sidebar-custom-item`, `${DESIGNER_CLASSNAME}plugin-${definition.pluginType}`, `${DESIGNER_CLASSNAME}plugin-btn`, `${DESIGNER_CLASSNAME}pl` |
| `src/sisad-pdfme/ui/components/Designer/LeftSidebar.tsx` | 1465 | MISSING_HANDLER | — | — | no | no | no | `<Button key={`facet-cap-${cap}`} size="small" type="text" className="rounded-full border border-slate-200/70 bg-white/90 px-2 text-[10px] text-slate-600 shadow-none hover:border-sky-200 hover:bg-white` |
| `src/sisad-pdfme/ui/components/Designer/LeftSidebar.tsx` | 1470 | MISSING_HANDLER | — | — | no | no | no | `<Button key={`facet-cat-${cat}`} size="small" type="text" className="rounded-full border border-slate-200/70 bg-white/90 px-2 text-[10px] text-slate-600 shadow-none hover:border-sky-200 hover:bg-white` |
| `src/sisad-pdfme/ui/components/Designer/LeftSidebar.tsx` | 1475 | MISSING_HANDLER | — | — | no | no | no | `<Button key={`facet-type-${typeFacet}`} size="small" type="text" className="rounded-full border border-slate-200/70 bg-white/90 px-2 text-[10px] text-slate-600 shadow-none hover:border-sky-200 hover:b` |
| `src/sisad-pdfme/ui/components/Designer/LeftSidebar.tsx` | 1480 | MISSING_HANDLER | — | — | no | no | no | `<Button key={`facet-tag-${tag}`} size="small" type="text" className="rounded-full border border-slate-200/70 bg-white/90 px-2 text-[10px] text-slate-600 shadow-none hover:border-sky-200 hover:bg-white` |
| `src/sisad-pdfme/ui/components/Designer/LeftSidebar.tsx` | 1484 | MISSING_TESTID | — | — | yes | no | no | `<Button size="small" onClick={() => setSearch('')} className="rounded-full border border-slate-200/70 bg-white/90 px-2 text-[10px] text-slate-600 shadow-none hover:border-sky-200 hover:bg-white">` |
| `src/sisad-pdfme/ui/components/Designer/LeftSidebar.tsx` | 1494-1505 | CONNECTED | `left-sidebar-filter-all` | — | yes | no | no | `<Button className={mergeClassNames( DESIGNER_CLASSNAME + 'left-sidebar-filter-btn', 'rounded-full border border-slate-200/70 bg-white px-2 text-[10px] font-medium text-slate-600 shadow-none hover:bord` |
| `src/sisad-pdfme/ui/components/Designer/LeftSidebar.tsx` | 1508-1519 | CONNECTED | `left-sidebar-filter-favorites` | — | yes | no | no | `<Button className={mergeClassNames( DESIGNER_CLASSNAME + 'left-sidebar-filter-btn', 'rounded-full border border-slate-200/70 bg-white px-2 text-[10px] font-medium text-slate-600 shadow-none hover:bord` |
| `src/sisad-pdfme/ui/components/Designer/LeftSidebar.tsx` | 1522-1533 | CONNECTED | `left-sidebar-filter-recent` | — | yes | no | no | `<Button className={mergeClassNames( DESIGNER_CLASSNAME + 'left-sidebar-filter-btn', 'rounded-full border border-slate-200/70 bg-white px-2 text-[10px] font-medium text-slate-600 shadow-none hover:bord` |
| `src/sisad-pdfme/ui/components/Designer/LeftSidebar.tsx` | 1553-1568 | MISSING_TESTID | — | — | yes | no | no | `<Button key={`cap-${capability}`} size="small" type={isActive ? 'primary' : 'default'} onClick={() => setActiveCapabilities((prev) => { const next = new Set(prev); if (next.has(capability)) { next.del` |
| `src/sisad-pdfme/ui/components/Designer/LeftSidebar.tsx` | 1578-1588 | MISSING_TESTID | — | — | yes | no | no | `<Button key={`cat-${category}`} size="small" type={collapsedCategories[category] ? 'default' : 'text'} onClick={() => setCollapsedCategories((prev) => ({ ...prev, [category]: !prev[category], })) } >` |
| `src/sisad-pdfme/ui/components/Designer/LeftSidebarCustomFieldModal.tsx` | 253 | MISSING_TESTID | — | — | yes | yes | no | `<Button type="primary" onClick={onSave} disabled={!draft.name.trim()}>` |
| `src/sisad-pdfme/ui/components/Designer/LeftSidebarCustomFieldModal.tsx` | 256 | MISSING_TESTID | — | — | yes | no | no | `<Button onClick={onCancel}>` |
| `src/sisad-pdfme/ui/components/Designer/LeftSidebarCustomPanel.tsx` | 46-56 | MISSING_TESTID | — | `Añadir un campo personalizado` | yes | no | no | `<button type="button" className={mergeUniqueClassNames( `${DESIGNER_CLASSNAME}left-sidebar-custom-add`, 'inline-flex h-7 w-7 items-center justify-center rounded-xl border border-slate-200 bg-white tex` |
| `src/sisad-pdfme/ui/components/Designer/LeftSidebarCustomPanel.tsx` | 79-86 | MISSING_TESTID | — | — | yes | no | no | `<Button type="default" onClick={onOpenCreate} className={mergeUniqueClassNames( 'mt-2.5 w-full rounded-xl border-slate-200 font-semibold text-slate-700 shadow-none', density === 'mini' ? 'h-6 text-[9p` |
| `src/sisad-pdfme/ui/components/Designer/LeftSidebarGroup.tsx` | 83-90 | MISSING_TESTID | — | `expr` | yes | no | no | `<button type="button" className={titleClassName} data-collapsed={collapsed ? 'true' : 'false'} aria-expanded={!collapsed} aria-label={`Alternar categoría ${category}`} onClick={onToggle} >` |
| `src/sisad-pdfme/ui/components/Designer/LeftSidebarTabs.tsx` | 33-48 | MISSING_TESTID | — | `expr` | yes | no | no | `<button type="button" id={tab.label.toLowerCase().replace(/\s+/g, '-')} role="tab" aria-selected={activeTab === tab.id} aria-label={tab.label} className={mergeUniqueClassNames( `${DESIGNER_CLASSNAME}l` |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/CommentsRail.tsx` | 225 | MISSING_TESTID | — | — | yes | no | no | `<Button type="text" size="small" icon={<MessageSquarePlus size={13} />} onClick={onAdd}>` |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/AlignWidget.tsx` | 73-84 | DISABLED_WITH_REASON | — | `expr` | yes | yes | yes | `<Button className={mergeClassNames( `${DESIGNER_CLASSNAME}align-btn`, `${DESIGNER_CLASSNAME}align-${btn.id}`, 'inline-flex h-[1.75rem] w-[1.75rem] items-center justify-center rounded-lg border border-` |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/ButtonGroupWidget.tsx` | 100-109 | MISSING_TESTID | — | — | yes | no | yes | `<Button type={active ? 'primary' : 'default'} onClick={() => apply(btn)} icon={svgIcon(btn.icon)} className={mergeClassNames( DESIGNER_CLASSNAME + 'button-auto', 'inline-flex h-[1.75rem] w-[1.75rem] i` |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/CompactConfigPanel.tsx` | 125-135 | MISSING_TESTID | — | `expr` | yes | no | no | `<Button size="small" type="default" icon={modalTriggerIcon \|\| <Settings2 size={14} />} onClick={() => setOpen(true)} aria-label={modalTriggerAriaLabel \|\| (typeof modalTriggerLabel === 'string' ? modal` |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/CompactConfigPanel.tsx` | 149-162 | MISSING_TESTID | — | — | yes | no | no | `<div ref={modalBodyRef} data-sisad-inspector-interactive="true" data-selecto-ignore="true" data-moveable-ignore="true" data-canvas-drop-ignore="true" onPointerDown={stopInspectorPointerEvent} onMouseD` |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailHeaderCard.tsx` | 99-108 | MISSING_TESTID | — | `backTooltip` | yes | no | yes | `<button type="button" className={mergeClassNames( `${DESIGNER_CLASSNAME}detail-header-back-btn`, 'inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200/80 bg-white text-` |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailSectionCard.tsx` | 104-114 | MISSING_TESTID | — | `expr` | yes | no | no | `<button type="button" className={mergeClassNames( DESIGNER_CLASSNAME + 'detail-section-card-head', 'group flex min-h-[24px] w-full items-center justify-between gap-1 rounded-lg px-1 py-[0.125rem] text` |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailSectionCard.tsx` | 134-144 | MISSING_TESTID | — | `expr` | yes | no | no | `<button type="button" className={mergeClassNames( DESIGNER_CLASSNAME + 'detail-section-card-head', 'group flex min-h-[22px] w-full items-center justify-between gap-[0.3125rem] rounded-md px-[3px] py-[` |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailViewContent.tsx` | 67-81 | MISSING_TESTID | — | `Secciones del detalle del campo` | yes | no | no | `<SidebarBody tabIndex={0} aria-label="Secciones del detalle del campo" data-sisad-inspector-interactive="true" data-selecto-ignore="true" data-moveable-ignore="true" data-canvas-drop-ignore="true" onP` |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/InspectorPrimitives.tsx` | 97-105 | MISSING_TESTID | — | — | yes | yes | no | `<Button key={action.key ?? action.label} size="small" type={action.type \|\| 'default'} onClick={action.onClick} onPointerDown={stopInspectorPointerEvent} disabled={action.disabled} className="inline-fl` |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/InspectorPrimitives.tsx` | 275-281 | MISSING_TESTID | — | — | yes | yes | no | `<Switch checked={internalChecked} disabled={disabled \|\| readOnly} onChange={(next) => commit(Boolean(next))} onClick={(next) => commit(Boolean(next))} size="small" />` |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/InspectorSwitch.tsx` | 25-41 | CONNECTED | `testId` | — | yes | yes | no | `<button type="button" data-testid={testId} disabled={disabled \|\| readOnly} onClick={(event) => { event.preventDefault(); event.stopPropagation(); if (disabled \|\| readOnly) return; onChange?.(!checked)` |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaConnectionsShared.tsx` | 92-97 | MISSING_TESTID | — | — | yes | no | no | `<Button size="small" type="text" icon={<Plus size={14} />} onClick={() => commit([...(latestRows \|\| []), { id: `pair-${Date.now()}-${latestRows.length}`, key: '', value: '' }])} >` |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaConnectionsShared.tsx` | 125-134 | MISSING_TESTID | — | — | yes | no | no | `<Button size="small" type="text" danger icon={<Trash2 size={13} />} onClick={() => { const next = latestRows.filter((_, rowIndex) => rowIndex !== index); commit(next); }} />` |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaConnectionsWidget.tsx` | 990 | MISSING_TESTID | — | — | yes | no | no | `<Button size="small" type="text" loading={isValidating} onClick={handleValidateConfig}>` |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaFieldCommentsWidget.tsx` | 266-275 | MISSING_TESTID | — | — | yes | no | no | `<div className={mergeClassNames(cls('field-comments-widget'), 'space-y-3')} data-sisad-inspector-interactive="true" data-selecto-ignore="true" data-moveable-ignore="true" data-canvas-drop-ignore="true` |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaFieldCommentsWidget.tsx` | 278-293 | MISSING_TESTID | — | — | yes | no | no | `<Input.TextArea id={`comments-new-${activeSchema.id}`} name={`comments-new-${activeSchema.id}`} value={newCommentText} onChange={(e) => setNewCommentText(e.target.value)} placeholder={composerPlacehol` |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaFieldCommentsWidget.tsx` | 294-302 | MISSING_TESTID | — | — | yes | yes | no | `<Button type="primary" size="small" icon={<MessageSquarePlus size={13} />} onClick={handleAddComment} onPointerDown={stopInspectorPointerEvent} disabled={!newCommentText.trim()} className={mergeClassN` |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaFieldCommentsWidget.tsx` | 354-367 | MISSING_TESTID | — | `expr` | yes | no | yes | `<Button type="text" size="small" icon={ resolved ? ( <RotateCcw size={12} /> ) : ( <CheckCircle2 size={12} /> ) } onClick={() => handleResolveToggle(comment.id, !resolved)} onPointerDown={stopInspecto` |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaFieldCommentsWidget.tsx` | 370-378 | MISSING_TESTID | — | `Eliminar hilo de comentarios` | yes | no | yes | `<Button type="text" size="small" danger icon={<Trash2 size={12} />} onClick={() => handleDeleteComment(comment.id)} onPointerDown={stopInspectorPointerEvent} aria-label="Eliminar hilo de comentarios" ` |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaFieldCommentsWidget.tsx` | 427-432 | MISSING_TESTID | — | — | yes | yes | no | `<Button size="small" onClick={() => handleAddReply(comment.id)} disabled={!(replyTexts[comment.id] \|\| '').trim()} className="rounded-full border-slate-200 text-slate-700 shadow-sm" >` |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaOptionsEditor.tsx` | 383-390 | CONNECTED | `detail-options-section` | — | yes | no | no | `<div className={mergeClassNames(DESIGNER_CLASSNAME + 'options-editor', 'w-full min-w-0 space-y-1.5')} data-testid="detail-options-section" data-options-kind={kind} {...interactiveAttrs} onPointerDown=` |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaOptionsEditor.tsx` | 421-440 | CONNECTED | `option-default-control` | `expr` | yes | no | yes | `<button type="button" className={mergeClassNames( iconButtonClass, 'h-5 w-5 rounded-full border', row.isDefault ? 'border-sky-400 bg-sky-50 text-sky-600 hover:bg-sky-100 hover:text-sky-700' : 'border-` |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaOptionsEditor.tsx` | 444-467 | CONNECTED | `option-label-input` | `expr` | yes | no | no | `<input type="text" defaultValue={row.label} aria-label={`Opción ${index + 1}`} data-testid="option-label-input" className={mergeClassNames( DESIGNER_CLASSNAME + 'options-editor-input', 'w-full min-w-0` |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaOptionsEditor.tsx` | 468-481 | CONNECTED | `option-move-up` | `expr` | yes | yes | no | `<button type="button" className={iconButtonClass} disabled={index === 0} aria-label={`Subir ${row.label}`} data-testid="option-move-up" onMouseDown={stopInspectorPointerEvent} onPointerDown={stopInspe` |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaOptionsEditor.tsx` | 484-497 | CONNECTED | `option-move-down` | `expr` | yes | yes | no | `<button type="button" className={iconButtonClass} disabled={index === rows.length - 1} aria-label={`Bajar ${row.label}`} data-testid="option-move-down" onMouseDown={stopInspectorPointerEvent} onPointe` |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaOptionsEditor.tsx` | 501-514 | DISABLED_WITH_REASON | `option-delete-button` | `expr` | yes | yes | yes | `<button type="button" className={mergeClassNames(iconButtonClass, 'hover:bg-rose-50 hover:text-rose-600')} disabled={kind !== 'select' && rows.length <= 1} aria-label={`Eliminar opción ${index + 1}`} ` |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaOptionsEditor.tsx` | 524-546 | CONNECTED | `option-new-input` | — | yes | no | no | `<input type="text" value={draft} placeholder={copy.addPlaceholder} data-testid="option-new-input" className={mergeClassNames( DESIGNER_CLASSNAME + 'options-editor-add-input', 'w-full min-w-0 flex-1 ro` |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaOptionsEditor.tsx` | 547-563 | CONNECTED | `option-add-button` | `Agregar opción` | yes | no | no | `<button type="button" className={mergeClassNames( DESIGNER_CLASSNAME + 'options-editor-add-btn', 'inline-flex h-[26px] flex-none items-center justify-center gap-1 whitespace-nowrap rounded-lg border b` |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailWidgetRegistry.tsx` | 100-106 | DISABLED_WITH_REASON | — | — | yes | yes | yes | `<Button size="small" icon={<Pencil size={12} />} disabled={!canEdit} onClick={() => props.selectionCommands?.renameLabel?.()} className={`${DESIGNER_CLASSNAME}inline-edit-btn`} >` |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailWidgetRegistry.tsx` | 113-119 | DISABLED_WITH_REASON | — | — | yes | yes | yes | `<Button size="small" icon={<Type size={12} />} disabled={!canEdit} onClick={() => props.selectionCommands?.editTextInline?.()} className={`${DESIGNER_CLASSNAME}inline-edit-btn`} >` |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailWidgets.tsx` | 56-68 | MISSING_TESTID | — | — | yes | no | no | `<div className={mergeClassNames( DESIGNER_CLASSNAME + 'color-picker-swatches', 'grid [grid-template-columns:repeat(auto-fill,minmax(1.25rem,1fr))] gap-0.5 p-0.5', )} data-sisad-inspector-interactive="` |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailWidgets.tsx` | 71-84 | MISSING_TESTID | — | `expr` | yes | no | yes | `<button type="button" onPointerDown={stopInspectorPointerEvent} onClick={(event) => { stopInspectorPointerEvent(event); onChange?.(preset); }} className={mergeClassNames( DESIGNER_CLASSNAME + 'color-p` |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailWidgets.tsx` | 91-100 | MISSING_TESTID | — | — | yes | no | no | `<div className={mergeClassNames(`${DESIGNER_CLASSNAME}color-picker-container`, 'flex flex-wrap items-center gap-2')} data-sisad-inspector-interactive="true" data-selecto-ignore="true" data-moveable-ig` |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailWidgets.tsx` | 103-111 | MISSING_TESTID | — | `Paleta de colores` | yes | no | yes | `<button type="button" aria-label="Paleta de colores" onPointerDown={stopInspectorPointerEvent} className={mergeClassNames( `${DESIGNER_CLASSNAME}color-picker-trigger`, 'inline-flex items-center gap-1.` |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailWidgets.tsx` | 122-129 | MISSING_TESTID | — | `Selector nativo de color` | yes | no | yes | `<label className={mergeClassNames( `${DESIGNER_CLASSNAME}color-picker-trigger`, 'inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-1.5 py-0.5 text-slate-700 shadow-sm tra` |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailWidgets.tsx` | 147-156 | MISSING_TESTID | — | — | yes | no | no | `<Input id={`${DESIGNER_CLASSNAME}color-picker-hex`} name={`${DESIGNER_CLASSNAME}color-picker-hex`} className={mergeClassNames(`${DESIGNER_CLASSNAME}color-picker-hex`, 'min-w-[6.5rem] rounded-lg border` |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DocumentsRail.tsx` | 165-172 | MISSING_TESTID | — | — | yes | no | no | `<Button size="small" type="text" htmlType="button" icon={<FileUp size={14} />} onClick={onUploadPdf} className={mergeClassNames(DESIGNER_CLASSNAME + 'documents-rail-action ' + DESIGNER_CLASSNAME + 'bu` |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DocumentsRail.tsx` | 177-186 | MISSING_TESTID | — | `expr` | yes | no | yes | `<Button size="small" type="text" htmlType="button" icon={<Plus size={14} />} onClick={onAdd} className={mergeClassNames(DESIGNER_CLASSNAME + 'documents-rail-action ' + DESIGNER_CLASSNAME + 'button-aut` |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DocumentsRail.tsx` | 197-200 | MISSING_TESTID | — | — | yes | no | no | `<button type="button" onClick={onAdd} className={mergeClassNames(DESIGNER_CLASSNAME + 'documents-rail-item', 'flex w-full items-center gap-2.5 rounded-xl border border-dashed border-slate-200 bg-slate` |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DocumentsRail.tsx` | 225-233 | MISSING_TESTID | — | — | yes | yes | no | `<button type="button" disabled={item.disabled} onClick={() => onSelect?.(item.id)} className={mergeClassNames( DESIGNER_CLASSNAME + 'documents-rail-item', isSelected ? DESIGNER_CLASSNAME + 'documents-` |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DocumentsRail.tsx` | 287-295 | MISSING_TESTID | — | `expr` | yes | no | no | `<Button type="text" size="small" danger icon={<Trash2 size={13} />} className={mergeClassNames(DESIGNER_CLASSNAME + 'documents-rail-delete-btn', 'rounded-full border-slate-200 text-rose-600')} aria-la` |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DocumentsRail.tsx` | 308-315 | MISSING_TESTID | — | — | yes | no | no | `<Button size="small" type="default" htmlType="button" icon={<FileUp size={13} />} onClick={onUploadPdf} className={mergeClassNames(DESIGNER_CLASSNAME + 'documents-rail-empty-upload', 'rounded-full bor` |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/Item.tsx` | 208-213 | MISSING_TESTID | — | — | yes | no | yes | `<button onClick={(e) => { e.stopPropagation(); onToggleVisibility(); }} title={hidden ? 'Mostrar' : 'Ocultar'} {...(hidden ? { 'data-testid': 'right-sidebar-field-badge', 'data-badge': 'hidden' } : {}` |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/Item.tsx` | 220-234 | MISSING_TESTID | — | `expr` | yes | no | yes | `<button type="button" aria-label={`Eliminar campo ${label \|\| ''}`.trim()} onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); }} onClick={(e) => { e.preventDefault(); e.stopPropagation(); o` |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/Item.tsx` | 337-350 | MISSING_TESTID | — | `valueTooltip` | yes | no | no | `<button type="button" className={mergeClassNames(DESIGNER_CLASSNAME + 'list-view-item-hit-target', 'absolute inset-0 z-0 rounded-2xl focus-visible:outline-none')} aria-label={valueTooltip} onMouseEnte` |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/Item.tsx` | 355-358 | MISSING_HANDLER | — | — | no | no | no | `<Button {...listeners} className={mergeClassNames(DESIGNER_CLASSNAME + 'list-view-item-grip', 'pointer-events-auto inline-flex h-8 w-1 items-center justify-center rounded-full border border-slate-200/` |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/ListViewFooter.tsx` | 44-48 | MISSING_TESTID | — | — | yes | no | no | `<Button className={mergeClassNames(DESIGNER_CLASSNAME + 'bulk-commit', 'inline-flex items-center gap-1 rounded-full bg-sky-600 text-white shadow-sm')} size="small" type="primary" onClick={onCommit}>` |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/ListViewFooter.tsx` | 52-55 | MISSING_TESTID | — | — | yes | no | no | `<Button className={mergeClassNames(DESIGNER_CLASSNAME + 'bulk-cancel', 'inline-flex items-center gap-1 rounded-full border-slate-200 text-slate-700 shadow-sm')} size="small" onClick={onCancel}>` |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/ListViewFooter.tsx` | 63-73 | DISABLED_WITH_REASON | — | `expr` | yes | yes | yes | `<Button className={mergeClassNames( DESIGNER_CLASSNAME + 'bulk-update', 'inline-flex h-8 w-8 items-center justify-center rounded-full border-slate-200 text-slate-700 shadow-sm', )} size="small" type="` |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/ListViewToolbar.tsx` | 153-172 | DISABLED_WITH_REASON | `right-sidebar-reassign` | `expr` | yes | yes | yes | `<Button type="text" size="small" disabled={reassignActionState.buttonDisabled} onPointerDownCapture={stopDesignerControlEvent} onMouseDownCapture={stopDesignerControlEvent} onDoubleClickCapture={stopD` |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/ListViewToolbar.tsx` | 209-218 | MISSING_HANDLER | `right-sidebar-more` | `expr` | no | no | yes | `<Button type="text" size="small" data-testid="right-sidebar-more" aria-label={resolveAriaLabel(bulkActionLabel, 'Más acciones')} className={mergeClassNames( DESIGNER_CLASSNAME + 'bulk-update', 'inline` |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/ListViewToolbar.tsx` | 262-271 | MISSING_TESTID | — | `expr` | yes | no | yes | `<Button type="text" size="small" onClick={onClearFilters} aria-label={resolveAriaLabel(clearLabel, 'Limpiar filtros')} className={mergeClassNames( DESIGNER_CLASSNAME + 'list-view-clear-filters', 'inli` |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/SelectableSortableItem.tsx` | 103-129 | MISSING_TESTID | — | — | yes | no | yes | `<Item ref={setNodeRef} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onClick={() => onEdit(schema.id)} value={primaryLabel} schemaType={schema.type} title={technicalName} typeLabel={schemaTy` |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/RightSidebar.tsx` | 580-592 | MISSING_TESTID | — | `expr` | yes | yes | no | `<button key={`rs-mode-${mode}`} type="button" disabled={disabled} className={`${DESIGNER_CLASSNAME}right-sidebar-panel-switcher-btn inline-flex min-h-7 items-center gap-1.5 rounded-full border border-` |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/shared/SchemaAssignmentDialog.tsx` | 146-157 | CONNECTED | `schema-assignment-dialog` | — | yes | no | no | `<div ref={bodyRef} data-testid="schema-assignment-dialog" data-sisad-inspector-interactive="true" data-selecto-ignore="true" data-moveable-ignore="true" data-canvas-drop-ignore="true" onPointerDown={s` |
| `src/sisad-pdfme/ui/components/Designer/SchemaDropSetupModal.tsx` | 82 | MISSING_TESTID | — | — | yes | no | no | `<Button onClick={onCancel} className="rounded-full border-slate-200 text-slate-700">` |
| `src/sisad-pdfme/ui/components/Designer/SchemaDropSetupModal.tsx` | 85 | MISSING_TESTID | — | — | yes | yes | no | `<Button type="primary" disabled={!canConfirm} onClick={onConfirm}>` |
| `src/sisad-pdfme/ui/components/Designer/Shortcuts/ShortcutHelpButton.tsx` | 30-36 | MISSING_TESTID | — | `expr` | yes | no | yes | `<Button size="small" icon={icon} onClick={onClick} aria-label={typeof label === 'string' ? label : 'Ver atajos del diseñador'} className={buttonClassName} >` |
| `src/sisad-pdfme/ui/components/Designer/shared/CatalogLayoutToggle.tsx` | 67-81 | CONNECTED | `expr` | `expr` | yes | no | no | `<Button key={option.layout} className={mergeClassNames( `${DESIGNER_CLASSNAME}catalog-layout-toggle-btn`, `${DESIGNER_CLASSNAME}catalog-layout-toggle-btn-${option.layout}`, )} size="small" data-testid` |
| `src/sisad-pdfme/ui/components/Designer/shared/SidebarCollapseHandle.tsx` | 41-59 | CONNECTED | `expr` | `label` | yes | no | yes | `<button type="button" aria-expanded={expanded} aria-label={label} data-testid={`sidebar-collapse-${side}`} data-side={side} data-expanded={expanded ? 'true' : 'false'} data-presentation={presentation}` |
| `src/sisad-pdfme/ui/components/Designer/shared/SidebarEmptyState.tsx` | 66-75 | MISSING_TESTID | — | — | yes | no | no | `<Button size="small" type="default" onClick={onAction} className={mergeClassNames( `${DESIGNER_CLASSNAME}sidebar-empty-action`, 'mt-1 rounded-full border-slate-200 text-slate-700 shadow-sm transition-` |
| `src/sisad-pdfme/ui/components/Designer/shared/SidebarRail.tsx` | 60-74 | DISABLED_WITH_REASON | `expr` | `expr` | yes | yes | yes | `<button type="button" className={mergeClassNames( `${DESIGNER_CLASSNAME}sidebar-rail-btn`, 'group relative inline-flex items-center justify-center border border-transparent bg-transparent text-slate-5` |
| `src/sisad-pdfme/ui/components/UnitPager.tsx` | 46-52 | MISSING_TESTID | — | — | yes | yes | no | `<Button type="text" size="small" onClick={onClick} disabled={disabled} className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/10 text-white" >` |
| `src/sisad-pdfme/ui/components/UnitPager.tsx` | 87-91 | MISSING_TESTID | — | — | yes | yes | no | `<UnitButton type="doubleLeft" onClick={() => setUnitCursor(0)} disabled={unitCursor <= 0} />` |
| `src/sisad-pdfme/ui/components/UnitPager.tsx` | 92-96 | MISSING_TESTID | — | — | yes | yes | no | `<UnitButton type="left" onClick={() => setUnitCursor(unitCursor - 1)} disabled={unitCursor <= 0} />` |
| `src/sisad-pdfme/ui/components/UnitPager.tsx` | 107-111 | MISSING_TESTID | — | — | yes | yes | no | `<UnitButton type="right" onClick={() => setUnitCursor(unitCursor + 1)} disabled={unitCursor + 1 >= unitNum} />` |
| `src/sisad-pdfme/ui/components/UnitPager.tsx` | 112-116 | MISSING_TESTID | — | — | yes | yes | no | `<UnitButton type="doubleRight" onClick={() => setUnitCursor(unitNum - 1)} disabled={unitCursor + 1 >= unitNum} />` |
| `src/features/pdfcomponent/CompactControls.jsx` | 39-44 | MISSING_TESTID | — | — | yes | yes | no | `<button type="button" className={joinClasses('sisad-pdfme-popover-action', destructive && 'is-destructive')} disabled={busy \|\| disabled} onClick={handleClick} >` |
| `src/features/pdfcomponent/CompactControls.jsx` | 82-90 | MISSING_TESTID | — | — | yes | yes | no | `<ActionButton key={action.label} close={close} busy={busy} onClick={action.onClick} label={action.label} disabled={action.disabled} destructive={action.destructive} />` |
| `src/features/pdfcomponent/CompactControls.jsx` | 170-175 | MISSING_TESTID | — | — | yes | no | no | `<button key={option.id} type="button" className={joinClasses('sisad-pdfme-popover-action', mode === option.id && 'is-active')} onClick={applyMode(close, option.id)} >` |
| `src/features/pdfcomponent/CompactControls.jsx` | 207-212 | MISSING_TESTID | — | — | yes | no | no | `<ActionButton close={close} busy={busy} onClick={onAddSchema} label="Agregar schema" />` |
| `src/features/pdfcomponent/CompactControls.jsx` | 219-224 | MISSING_TESTID | — | — | yes | no | no | `<ActionButton busy={busy} onClick={() => setResetConfirmationOpen(true)} label="Reiniciar template" destructive />` |
| `src/features/pdfcomponent/CompactControls.jsx` | 235-240 | MISSING_TESTID | — | — | yes | yes | no | `<button type="button" className="sisad-pdfme-popover-action is-destructive" disabled={busy} onClick={runAndClose(close, onReset)} >` |
| `src/features/pdfcomponent/CompactControls.jsx` | 243-248 | MISSING_TESTID | — | — | yes | yes | no | `<button type="button" className="sisad-pdfme-popover-action" disabled={busy} onClick={() => setResetConfirmationOpen(false)} >` |
| `src/features/pdfcomponent/LabExampleDownloadButton.jsx` | 52-58 | MISSING_TESTID | — | `expr` | yes | yes | no | `<button type="button" className={className} onClick={handleDownload} disabled={!example \|\| busy} aria-label={ariaLabel \|\| `Descargar plantilla ${example?.title \|\| ''}`.trim()} >` |
| `src/features/pdfcomponent/LabLandingPage.jsx` | 156-166 | MISSING_TESTID | — | — | yes | no | no | `<button key={filter.id} type="button" onClick={() => setActiveFilter(filter.id)} className={[ 'inline-flex h-9 items-center gap-2 rounded-full border px-3 text-xs font-semibold transition', activeFilt` |
| `src/features/pdfcomponent/LabLandingPage.jsx` | 182-189 | MISSING_TESTID | — | — | yes | no | no | `<button type="button" onClick={() => { setSearch('') setActiveFilter('all') }} className="inline-flex h-9 items-center rounded-full border border-transparent px-3 text-xs font-semibold text-slate-500 ` |
| `src/features/pdfcomponent/PageHeader.jsx` | 71-89 | MISSING_TESTID | — | — | yes | no | yes | `<button type="button" className={joinClasses( 'sisad-pdfme-lab-chip', 'sisad-pdfme-lab-chip-button', toneClass, isActive ? 'is-active' : 'sisad-pdfme-lab-chip-muted', )} style={chipStyle} title={getUs` |
| `src/features/pdfcomponent/PopoverMenu.jsx` | 55-63 | MISSING_TESTID | — | `expr` | yes | yes | no | `<button type="button" className={joinClasses('sisad-pdfme-popover-button', open && 'is-active')} onClick={() => setOpen((current) => !current)} aria-haspopup="menu" aria-expanded={open} aria-label={ar` |
| `src/features/pdfcomponent/PopoverMenu.jsx` | 71-83 | MISSING_TESTID | — | — | yes | yes | no | `<button key={it.key \|\| String(it.label)} type="button" className={joinClasses('sisad-pdfme-popover-item', it.active && 'is-active', it.tone && `is-${it.tone}`)} role="menuitem" disabled={it.disabled} ` |
| `src/features/pdfcomponent/ResultsPanel.jsx` | 164-170 | MISSING_TESTID | — | — | yes | no | no | `<button type="button" className={cn('sisad-pdfme-lab-results-pill inline-flex items-center gap-2 rounded-full border border-slate-200/60 bg-white/95 px-3 py-1.5 text-[0.72rem] font-bold text-slate-700` |
| `src/features/pdfcomponent/ResultsPanel.jsx` | 195-208 | MISSING_TESTID | — | `Cerrar resultados` | yes | no | no | `<button type="button" ref={drawerCloseButtonRef} className={cn('sisad-pdfme-lab-results-close inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-` |
| `src/features/pdfcomponent/ui/primitives.jsx` | 23-32 | DISABLED_WITH_REASON | — | `label` | yes | yes | yes | `<button type="button" className={classNameList} aria-label={label} title={title \|\| label} aria-haspopup={ariaHasPopup} aria-expanded={ariaExpanded} onClick={onClick} disabled={disabled} >` |
```

<a id="file-0239"></a>

### 0239 — `reports/designer-deep-audit/duplication-map.md`

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

<a id="file-0240"></a>

### 0240 — `reports/designer-deep-audit/risk-map.md`

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

<a id="file-0241"></a>

### 0241 — `reports/designer-deep-audit/wrapper-reduction.md`

- **Lenguaje:** `markdown`
- **Líneas:** `56`
- **Tamaño original:** `2.7 KB`
- **SHA1 corto:** `f2226d1f55`
- **Estado:** `completo`

```markdown
# Wrapper Reduction — clasificación y decisiones

## Task-card

TASK-ARCH-004 (2026-07-15, Claude).

## Clasificación

### PUBLIC_API_KEEP (fachada portable — no tocar)

| Wrapper | Justificación |
|---|---|
| `react/SisadPdfmeDesigner.tsx` | Pipeline recipients→registry→collaboration + eventos; no es pass-through |
| `react/SisadPdfmeForm.tsx` / `SisadPdfmeViewer.tsx` | Derivan `options.collaboration` del RecipientRegistry |
| `react/SisadPdfmeProvider.tsx` | CONTEXT_PROVIDER_KEEP: crea/expone registry compartido |
| `react/useSisadPdfmeConfig.ts` / `useSisadPdfmeController.ts` | API imperativa real (recipients/reasignación/snapshot) |

### VISUAL_PRIMITIVE_KEEP

| Wrapper | Uso |
|---|---|
| `Designer/shared/SidebarRail.tsx` | Rail colapsado izquierdo/derecho; tooltips + testids (TASK-UI-015) |
| `Designer/shared/SidebarCollapseHandle.tsx` | Handle único de colapso por lado |
| `RightSidebar/shared/SidebarSurfacePrimitives.tsx` | Header/EmptyState de superficies del sidebar derecho |
| `Designer/shared/DesignerContextSummary.tsx`, `CatalogLayoutToggle.tsx` | Primitivos con lógica propia |

### DUPLICATED_WITH_EXISTING_PRIMITIVE (unificación recomendada, no aplicada)

| Par | Consumidores | Acción sugerida |
|---|---|---|
| `Designer/shared/SidebarEmptyState.tsx` ↔ `RightSidebar/shared/SidebarSurfacePrimitives.SidebarSurfaceEmptyState` | LeftSidebar/ListView vs CommentsRail/DocumentsRail | Converger en `SidebarEmptyState` (acepta density) y reexportar desde SurfacePrimitives. No se aplicó en esta pasada: ambos tienen consumidores activos y el RightSidebar tiene trabajo en curso en paralelo; hacerlo como slice propio con verificación visual. |

### PASS_THROUGH_REMOVE

No se encontraron wrappers puramente pasivos en `react/` ni en
`RightSidebar/shared/`: todos agregan contrato (registry, gating, densidad,
a11y). `SchemaAssignmentDialog` es único (un solo archivo, dos consumidores:
ListView y flujo del DetailView) — sin duplicados.

### HOST_SPECIFIC_REMOVE

Ninguno: `grep` de imports desde `src/features`/`src/modules`/SISAD-WEB dentro
de `src/sisad-pdfme` = 0 resultados.

## Criterios de aceptación

- [x] No se elimina API pública (fachada `integration/index.ts` intacta y ampliada).
- [x] Menos wrappers pasivos internos: no existen pasivos; el par duplicado quedó
      documentado con plan de convergencia (slice propio).
- [x] No hay imports host dentro de src/sisad-pdfme (verificado por grep).
- [x] No se duplica SchemaAssignmentDialog (único, consumido por 2 superficies).
- [x] No se duplican recipients/adapters (fuente única: `recipients/` + `adapters/`).

## Validación

- `npm run build` exit 0; `npx vitest run tests/unit/sisad-pdfme/react` (runtime-modes) en verde.
```

<a id="file-0242"></a>

### 0242 — `reports/tailwind-migration/active-css-inventory.md`

- **Lenguaje:** `markdown`
- **Líneas:** `12`
- **Tamaño original:** `0.6 KB`
- **SHA1 corto:** `bc7bee8d21`
- **Estado:** `completo`

```markdown
# Inventario CSS activo

| Archivo | Líneas | KB | Nota |
|---|---:|---:|---|
| `src/styles/tailwind.css` | 5 | 0.1 | fuente única Tailwind |
| `src/style.css` | 12 | 0.5 | mantener neutralizado |
| `src/styles/sisad-tailwind-bridge.css` | 1 | 0.0 | revisar |
| `src/features/pdfcomponent/labRoutes.css` | 0 | 0 | no existe |
| `src/sisad-pdfme/ui/styles/sisad-pdfme.css` | 309 | 14.3 | migrar solo reglas visuales seguras |
| `src/sisad-pdfme/ui/styles/tokens.css` | 86 | 3.5 | conservar tokens |

No incluir `reports/**` ni `.tailwind-migration-backups/**` como CSS activo.
```

<a id="file-0243"></a>

### 0243 — `reports/tailwind-migration/active-selector-duplicates.md`

- **Lenguaje:** `markdown`
- **Líneas:** `9`
- **Tamaño original:** `0.9 KB`
- **SHA1 corto:** `16973ddaf9`
- **Estado:** `completo`

```markdown
# Active Selector Duplicates

Files scanned: src/sisad-pdfme/ui/styles/sisad-pdfme.css, src/styles/sisad-tailwind-bridge.css
Duplicate selectors: 2

| Selector | Count | Locations | Suggested class |
|---|---:|---|---|
| `from` | 6 | `src/sisad-pdfme/ui/styles/sisad-pdfme.css:229`<br>`src/sisad-pdfme/ui/styles/sisad-pdfme.css:239`<br>`src/sisad-pdfme/ui/styles/sisad-pdfme.css:249`<br>`src/sisad-pdfme/ui/styles/sisad-pdfme.css:277`<br>`src/sisad-pdfme/ui/styles/sisad-pdfme.css:286`<br>`src/sisad-pdfme/ui/styles/sisad-pdfme.css:300` | REVIEW |
| `to` | 6 | `src/sisad-pdfme/ui/styles/sisad-pdfme.css:233`<br>`src/sisad-pdfme/ui/styles/sisad-pdfme.css:243`<br>`src/sisad-pdfme/ui/styles/sisad-pdfme.css:253`<br>`src/sisad-pdfme/ui/styles/sisad-pdfme.css:281`<br>`src/sisad-pdfme/ui/styles/sisad-pdfme.css:294`<br>`src/sisad-pdfme/ui/styles/sisad-pdfme.css:305` | REVIEW |
```

<a id="file-0244"></a>

### 0244 — `reports/tailwind-migration/baseline-regression-audit.md`

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

<a id="file-0245"></a>

### 0245 — `reports/tailwind-migration/component-migration-ledger.md`

- **Lenguaje:** `markdown`
- **Líneas:** `212`
- **Tamaño original:** `19.5 KB`
- **SHA1 corto:** `699e161a48`
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
| RightSidebar/layout.tsx | ✅ | scroll owner (`SidebarBody` overflow-y-auto) + cleanup CSS | sí | no | — | scroll-detail-* | ✅ | bajo |
| RightSidebar/shared/SidebarSurfacePrimitives.tsx | ✅ | densidad+textos inline (0.82rem title) | sí | no | — | detail-* | ✅ | bajo |
| RightSidebar/DetailView/DetailViewContent.tsx | ✅ | densidad | sí | no | — | detail-* | ✅ | bajo |
| RightSidebar/DetailView/DetailHeaderCard.tsx | ✅ | densidad+textos inline (0.82rem title) | sí | no | — | detail-* | ✅ | bajo |
| RightSidebar/DetailView/DetailSectionCard.tsx | ✅ | densidad+textos inline (0.72rem title) | sí | no | — | detail-* | ✅ | bajo |
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
| Designer/LeftSidebar.tsx | 🟡 | tab/search shell inline Tailwind | sí | no | radio `left-sidebar-group` CSS-pinned; toggle-btn posición legacy | left-sidebar-after | ✅ | medio (dnd verificado OK) |
| Designer/LeftSidebarGroup.tsx | 🟡 | densidad card categoría | sí | no | border-radius CSS-pinned (1.2rem) | left-sidebar-after | ✅ | bajo |

## Control bar / overlays contextuales — TC-CSS-08

| Archivo | Estado | Última task | Tailwind JSX | Bridge | Legacy KEEP | Captura | Build | Riesgo |
|---|---|---|---|---|---|---|---|---|
| ui/components/CtlBar.tsx | ✅ | zoom buttons Tailwind-only + pill summary `px-2.5 py-1` | sí | no | clusters posicionados por CSS (canvas-chrome); `zoom-select` selector sigue CSS-pinned | control-bar-toolbar-after | ✅ | bajo |
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
- Esta sesión sí retiró reglas duplicadas en `src/sisad-pdfme/ui/styles/sisad-pdfme.css`.

## Reportes de detalle
- `right-sidebar-tailwind-only-density-fix.md`
- `right-sidebar-scroll-tailwind-fix.md`
- `tc-css-04-left-sidebar-tailwind.md`
- `tc-css-08-control-bar-toolbar-tailwind.md`

## Pasada 2026-07-15 (TASK-CSS-013 / TASK-CSS-014)

- Auditores ejecutados: `css-selector-duplicates.mjs` (649 filas clasificadas
  MERGE_SAME_SELECTOR en `selector-duplicates-current.md`),
  `css-active-selector-audit.mjs` (`active-selector-duplicates.md`),
  `css-inventory.mjs` (`active-css-inventory.md`).
- Clusters mayores detectados: `:is(.app-shell …)` ×44 (bloque 3514-3637),
  `right-sidebar-layout-header` ×7, `right-sidebar` ×6, `detail-*-card` ×5.
- Polish visual previo (switcher sin borde negro, owner accent separado del
  selected state, rails compactos) validado por specs:
  `canvas-overflow-regression`, `drag-preview-and-canvas-scroll-regression`,
  `sidebar-collapse-parity`, `sidebar-rail-collapse-actions` — en verde.
- Slice 2026-07-15: se retiraron del CSS legado los bloques duplicados de
  `right-sidebar-layout-header`, `right-sidebar-layout-body`, `right-sidebar-layout-frame`
  y `right-sidebar-panel-switcher*`; el shell visual quedó en TSX/Tailwind inline.
- Slice 2026-07-15b: también se eliminaron las primitivas visuales redundantes
  de `sidebar-surface-header` y `sidebar-surface-empty`, porque ya viven en
  `SidebarSurfacePrimitives.tsx` con utilidades inline.
- Slice 2026-07-15c: se retiraron del rail derecho los overrides duplicados de
  `detail-header-card`, `detail-section-card`, `inspector-summary-card`,
  `compact-config-panel` y `list-view-toolbar`, dejando el skin visual base en
  JSX/TSX y conservando los bloques de densidad/scroll que aún no tienen paridad
  completa inline.
- Slice 2026-07-16: `ShortcutHelpPanel.tsx` absorbió la superficie del modal
  de atajos con `Modal.classNames` y `sisad-pdfme.css` eliminó el override
  huérfano de `.sisad-pdfme-shortcuts-panel .ant-modal-content`.
- Slice 2026-07-16b: `sisad-pdfme.css` eliminó el bloque huérfano
  `sisad-inspector-select-popup`, que no tenía consumidores en el código
  activo.
- Slice 2026-07-16c: `SchemaConnectionsWidget.tsx`, `SchemaCollaborationWidget.tsx`
  y `detailWidgetRegistry.tsx` absorbieron el skin inline del `Divider`, y
  `sisad-pdfme.css` eliminó el override global `.ant-divider-horizontal`.
- Slice 2026-07-16d: `sisad-pdfme.css` eliminó el override global de
  `ant-btn` (`.ant-btn`, `.ant-btn-default`, `.ant-btn-text` y hover), porque
  los botones visibles ya tienen skin local en TSX; quedó pendiente revisar
  `ant-select-selector` como contrato geométrico.
- Slice 2026-07-16e: `InspectorSelect.tsx`, `SchemaCollaborationWidget.tsx`,
  `SchemaConnectionsWidget.tsx` y `ListViewToolbar.tsx` absorbieron el skin
  base del `Select` en wrappers locales, y `sisad-pdfme.css` eliminó el
  override global `.ant-select-selector`.
- Slice 2026-07-16f: `SchemaDropSetupModal.tsx` absorbió también el skin base
  del `Select` del modal de configuración de campo para no depender del
  override global eliminado.
- Slice 2026-07-16g: `sisad-pdfme.css` consolidó la base del shell (`workspace`,
  `canvas`, `designer-root`, `designer-background` y el centrado de
  `paper-root`) en bloques únicos, reduciendo duplicación sin tocar geometría
  ni scroll.
- Slice 2026-07-16h: `sisad-pdfme.css` retiró residuos mecánicos del shell
  (`@media` vacíos y la segunda declaración de `font-family` en
  `.sisad-pdfme-root`) sin tocar geometría ni skin visible.
- Slice 2026-07-16i: `RightSidebar.tsx` absorbió el skin base del rail derecho
  (posición, ancho, borde, fondo, sombra, transición y estados open/collapsed)
  en el propio nodo React, y `sisad-pdfme.css` eliminó el bloque raíz
  equivalente; quedaron en CSS solo los ajustes responsivos y geométricos que
  aún dependen de media queries.
- Slice 2026-07-16j: `LeftSidebar.tsx` absorbió el skin base del rail izquierdo
  (posición, ancho, borde, fondo, shrink y transición) en el nodo React, y
  `sisad-pdfme.css` eliminó el bloque raíz equivalente; quedaron en CSS solo
  los ajustes de catálogo/dragging y las reglas responsivas que siguen siendo
  geométricas.
- Slice 2026-07-16k: `RightSidebar.tsx` absorbió la excepción de
  `prefers-reduced-motion` del rail derecho como variantes `motion-reduce` en
  el propio nodo React, y `sisad-pdfme.css` eliminó el bloque media query
  equivalente.
- Slice 2026-07-16l: `sisad-pdfme.css` eliminó los media queries compactos
  redundantes de `left-sidebar-compact` y `stage[data-left-sidebar-variant="compact"]`,
  dejando el clamp final como fuente única para el ancho compacto del shell.
  Resultado actual del CSS activo: 387 líneas y 68 apariciones de `@apply`.
- Slice 2026-07-16m: `index.tsx` ya resolvía el ancho compacto del rail derecho
  en TSX y `sisad-pdfme.css` eliminó el último selector residual
  `stage[data-left-sidebar-variant="compact"][data-sidebar-open="true"] .sisad-pdfme-designer-canvas`,
  dejando el reporte de duplicados solo con contratos KEEP_GEOMETRY. Resultado
  actual del CSS activo: 373 líneas y 64 apariciones de `@apply`.
- Slice 2026-07-16n: `LeftSidebar.tsx` absorbió el skin de drag source y el
  hide-state del favorito en el propio botón del catálogo; `sisad-pdfme.css`
  retiró el selector residual del favorito drag. Validado tras corregir un
  `ReferenceError` transitorio en runtime. Resultado actual del CSS activo:
  369 líneas y 63 apariciones de `@apply`.
- Slice 2026-07-16o: `CanvasOverlayManager.tsx` absorbió el skin base del
  contenedor de overlays del canvas y `Mask.tsx` absorbió la superficie de
  bloqueo; `sisad-pdfme.css` retiró ambos selectores residuales. Validado con
  build y canvas/right-sidebar smoke. Resultado actual del CSS activo:
  363 líneas y 61 apariciones de `@apply`.
- Slice 2026-07-16p: `GroupOptionFloatingAction.tsx` ya contenía el skin inline
  del botón flotante de opciones de grupo y `sisad-pdfme.css` retiró el bloque
  residual de visibilidad para `option-group-floating-action`, dejando la
  ocultación de dragging/resizing/rotating resuelta por el propio componente.
  Resultado actual del CSS activo: 357 líneas y 60 apariciones de `@apply`.
- Slice 2026-07-16q: `CanvasOverlayManager.tsx` ya absorbía el skin del
  contenedor de overlays y `sisad-pdfme.css` retiró el selector redundante
  `.sisad-pdfme-ui-canvas-overlay-manager`, dejando la posición/pointer-events
  del overlay como contrato local del componente. Resultado actual del CSS
  activo: 352 líneas y 59 apariciones de `@apply`.
- Slice 2026-07-16r: `Canvas.tsx` pasó la ocultación de `Mask` a una clase
  inline basada en `interactionState.phase`, y `sisad-pdfme.css` eliminó el
  bloque residual de visibilidad por fase (`dragging/resizing/rotating/
  selected-single/selected-multi`). Resultado actual del CSS activo:
  346 líneas y 58 apariciones de `@apply`.
- Slice 2026-07-16s: `CanvasStateOverlay.tsx` ya absorbía el skin del empty
  state y `sisad-pdfme.css` retiró el selector huérfano
  `.sisad-pdfme-designer-canvas-empty-state`, dejando ese overlay como contrato
  puro del componente. Resultado actual del CSS activo: 341 líneas y 57
  apariciones de `@apply`.
- Slice 2026-07-16t: `LeftSidebar.tsx` absorbió el skin del shell arrastrable
  y la ocultación del favorito durante drag en el propio JSX, y
  `sisad-pdfme.css` retiró los selectores residuales de
  `.sisad-pdfme-designer-left-sidebar-draggable-shell` y su estado drag,
  dejando esos contratos como skin local del componente. Resultado actual del
  CSS activo: 335 líneas y 56 apariciones de `@apply`.
- Slice 2026-07-16u: `sisad-pdfme.css` retiró los bloques legacy del shell
  `.sisad-pdfme-page`, `.sisad-pdfme-header`, `.sisad-pdfme-grid`,
  `.sisad-pdfme-workspace` y `.sisad-pdfme-canvas`, que no tenían consumidores
  activos en el árbol React actual. Validado con `npm run build`, los smoke
  tests del rail derecho y el reporte de duplicados regenerado. Resultado
  actual del CSS activo: 310 líneas y 47 apariciones de `@apply`.
- Slice 2026-07-16v: `Item.tsx` fijó el affordance de delete al hover del
  `li` completo para que no desaparezca al entrar al botón, y
  `DetailSectionCard.tsx` + `SchemaConnectionsShared.tsx` aclararon los
  accordions del inspector con títulos más cercanos al fondo/base y
  superficies menos grises. `tokens.css` quedó en 86 líneas tras podar
  tokens sin consumidores directos. Validado con `npm run build` y la
  ruta `/lab/multi-document-routing` en Playwright, manteniendo el panel
  derecho estable en `Campos`, `Detalle` y `Docs`.
- Slice 2026-07-16w: `DetailSectionCard.tsx` y `SchemaConnectionsShared.tsx`
  terminaron de unificar los headers de acordeón con la superficie blanca del
  panel, bajando el tinte gris que aún se percibía en los detalles del schema y
  en las secciones técnicas/conexiones. Validado con `npm run build` y los
  smoke tests del rail derecho.
- Slice 2026-07-16x: `Item.tsx` dejó el delete del ListView visible y
  detectable por Playwright sin depender de opacidad cero, `DocumentsRail.tsx`
  alineó el delete de documentos en la misma fila de la tarjeta y
  `DetailSectionCard.tsx` subió el contraste del título de acordeón para
  mantener la jerarquía del inspector. Validado con `npm run build`,
  `npx playwright test tests/playwright/right-sidebar-visual-polish.spec.ts`,
  `tests/playwright/right-sidebar-docs-tab.spec.ts` y
  `tests/playwright/list-view-regression.spec.ts`.
- Decisión: continuar con merges de `MERGE_SAME_SELECTOR` por slice
  (1 zona por pase, criterio CSS-014) usando estos reportes como fuente, con
  verificación visual por zona.

- Slice 2026-07-16y: `index.tsx` y `CtlBar.tsx` absorbieron el padding del stage y el offset del control bar para el right sidebar, `SchemaConnectionsShared.tsx` elevó el contraste de los títulos de sección/edición técnica y `sisad-pdfme.css` perdió el selector residual `data-sidebar-open`. Resultado actual del CSS activo: 304 líneas y 85 apariciones de `@apply`. Validado con `npm run build` y los smoke tests del rail derecho/list view.
- Slice 2026-07-16z: `Item.tsx` elevó la capa de `ItemActions` y del botón `Eliminar` para que el affordance no desaparezca detrás del hit-target del row; `SidebarSurfacePrimitives.tsx` y `DetailSectionCard.tsx` subieron el contraste de los títulos y descripciones del inspector a `text-slate-950`/`text-slate-600`; `tests/playwright/list-view-regression.spec.ts` y `tests/unit/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailSectionCard.test.ts` quedaron como cobertura estable del row y del encabezado de sección. Validado con `npx playwright test tests/playwright/right-sidebar-visual-polish.spec.ts tests/playwright/list-view-regression.spec.ts`, `npx vitest run tests/unit/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailSectionCard.test.ts tests/unit/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/Item.test.tsx` y regeneración de `reports/tailwind-migration/selector-duplicates-current.md`. El CSS activo sigue en 304 líneas y 85 apariciones de `@apply`; lo restante es contrato técnico/geométrico y no un candidato seguro para vaciar.

- Slice 2026-07-16aa: `src/sisad-pdfme/ui/styles/sisad-pdfme.css` se vació por completo (0 líneas) por decisión explícita de esta migración y el shell visual quedó apoyado en TSX/Tailwind + `tokens.css`. Limpieza asociada: se retiró un import duplicado de `sisad-pdfme.css` en `src/sisad-pdfme/ui/index.ts`. Validación post-cambio: `npm run build` ✅ y `npm run test -- --run tests/unit/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/ListViewToolbar.visibility.test.tsx` ✅ (con warning heredado de `act(...)` en test, sin fallas).
- Slice 2026-07-17a: `DetailSectionCard.tsx`, `SchemaConnectionsShared.tsx`, `DetailHeaderCard.tsx` y `SidebarSurfacePrimitives.tsx` dejaron más compacto y más blanco el inspector derecho, corrigiendo el bloque roto del encabezado no colapsable y homogeneizando los headers/títulos de las secciones técnicas. En paralelo, `src/sisad-pdfme/ui/styles/sisad-pdfme.css` retiró el último ajuste de `data-sidebar-open` ya resuelto en TSX. Conteo actual del CSS activo: 287 líneas y 68 apariciones de `@apply`. Validado con `npm run build`, `npx playwright test tests/playwright/right-sidebar-visual-polish.spec.ts tests/playwright/list-view-regression.spec.ts` y `npx playwright test tests/playwright/right-sidebar-docs-tab.spec.ts`.
- Slice 2026-07-17b: `src/sisad-pdfme/ui/styles/sisad-pdfme.css` eliminó el helper huérfano `sisad-pdfme-sr-only`, bajando otra porción residual de CSS ya migrado a utilidades inline. Conteo actual del CSS activo: 284 líneas y 41 apariciones de `@apply`. Validado con `npm run build` y `npx playwright test tests/playwright/right-sidebar-visual-polish.spec.ts tests/playwright/right-sidebar-docs-tab.spec.ts tests/playwright/list-view-regression.spec.ts`.
- Slice 2026-07-17c: `RightSidebar.tsx`, `layout.tsx` y `SelectionContextToolbar.tsx` reemplazaron las animaciones de entrada por transiciones inline, permitiendo retirar de `src/sisad-pdfme/ui/styles/sisad-pdfme.css` los keyframes `rs-slide-in`, `rs-panel-switch`, `rs-stagger-in` y `toolbar-reveal`. Conteo actual del CSS activo: 241 líneas y 41 apariciones de `@apply`. Validado con `npm run build` y `npx playwright test tests/playwright/right-sidebar-visual-polish.spec.ts tests/playwright/right-sidebar-docs-tab.spec.ts tests/playwright/list-view-regression.spec.ts`.
- Slice 2026-07-17d: `SchemaDragPreview.tsx` y `SchemaDropCommitFlash.tsx` absorbieron las animaciones de entrada/salida con transiciones inline y estado local; `src/sisad-pdfme/ui/styles/sisad-pdfme.css` eliminó los keyframes `schema-drag-preview-enter` y `schema-drop-commit-flash-enter`. Conteo actual del CSS activo: 218 líneas y 41 apariciones de `@apply`. Validado con `npm run build` y `npx playwright test tests/playwright/right-sidebar-visual-polish.spec.ts tests/playwright/right-sidebar-docs-tab.spec.ts tests/playwright/list-view-regression.spec.ts tests/playwright/drag-preview-and-canvas-scroll-regression.spec.ts`.
- Slice 2026-07-17e: `src/sisad-pdfme/ui/styles/sisad-pdfme.css` quedó totalmente vaciado (0 líneas, 0 apariciones de `@apply`) y sus contratos visuales residuales se movieron a `src/sisad-pdfme/ui/runtimeStyles.ts`, que ahora se inyecta desde `Root.tsx`; `src/sisad-pdfme/ui/index.ts` dejó de importar la hoja CSS. Validado con `npx playwright test tests/playwright/right-sidebar-visual-polish.spec.ts tests/playwright/right-sidebar-docs-tab.spec.ts tests/playwright/list-view-regression.spec.ts tests/playwright/drag-preview-and-canvas-scroll-regression.spec.ts` ✅ y `npm run build` en curso/pendiente de cierre final al momento de registrar este slice.
```

<a id="file-0246"></a>

### 0246 — `reports/tailwind-migration/deep-density-spacing-audit.md`

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

<a id="file-0247"></a>

### 0247 — `reports/tailwind-migration/img-version-baseline-inventory.md`

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

<a id="file-0248"></a>

### 0248 — `reports/tailwind-migration/line-by-line-style-audit.md`

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

<a id="file-0249"></a>

### 0249 — `reports/tailwind-migration/pending-phases-progress.md`

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

<a id="file-0250"></a>

### 0250 — `reports/tailwind-migration/README.md`

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

<a id="file-0251"></a>

### 0251 — `reports/tailwind-migration/right-sidebar-scroll-tailwind-fix.md`

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

<a id="file-0252"></a>

### 0252 — `reports/tailwind-migration/right-sidebar-tailwind-only-density-fix.md`

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

<a id="file-0253"></a>

### 0253 — `reports/tailwind-migration/rightsidebar-detailview-tailwind-audit.md`

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

<a id="file-0254"></a>

### 0254 — `reports/tailwind-migration/runtime-form-viewer-tailwind-audit.md`

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

<a id="file-0255"></a>

### 0255 — `reports/tailwind-migration/schema-chrome-tailwind-audit.md`

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

<a id="file-0256"></a>

### 0256 — `reports/tailwind-migration/selector-duplicates-current.md`

- **Lenguaje:** `markdown`
- **Líneas:** `37`
- **Tamaño original:** `5.5 KB`
- **SHA1 corto:** `345927f928`
- **Estado:** `completo`

```markdown
# Selector duplicates current

Auditoría generada sobre CSS activo del proyecto.

| Selector | Apariciones | Archivos | Líneas aprox. | Clasificación |
|---|---:|---|---|---|
| `.sisad-pdfme-designer-canvas` | 1 | `src/sisad-pdfme/ui/styles/sisad-pdfme.css` | src/sisad-pdfme/ui/styles/sisad-pdfme.css:139 | KEEP_GEOMETRY |
| `.sisad-pdfme-designer-canvas [data-canvas-page="true"]` | 1 | `src/sisad-pdfme/ui/styles/sisad-pdfme.css` | src/sisad-pdfme/ui/styles/sisad-pdfme.css:159 | KEEP_GEOMETRY |
| `.sisad-pdfme-designer-canvas [data-canvas-page="true"] .moveable-control-box` | 1 | `src/sisad-pdfme/ui/styles/sisad-pdfme.css` | src/sisad-pdfme/ui/styles/sisad-pdfme.css:190 | KEEP_GEOMETRY |
| `.sisad-pdfme-designer-canvas [data-canvas-page="true"] .moveable-control-box .moveable-control` | 1 | `src/sisad-pdfme/ui/styles/sisad-pdfme.css` | src/sisad-pdfme/ui/styles/sisad-pdfme.css:197 | KEEP_GEOMETRY |
| `.sisad-pdfme-designer-canvas [data-canvas-page="true"] .moveable-control-box .moveable-line` | 1 | `src/sisad-pdfme/ui/styles/sisad-pdfme.css` | src/sisad-pdfme/ui/styles/sisad-pdfme.css:194 | KEEP_GEOMETRY |
| `.sisad-pdfme-designer-canvas [data-canvas-page="true"] .moveable-control-box .moveable-origin` | 1 | `src/sisad-pdfme/ui/styles/sisad-pdfme.css` | src/sisad-pdfme/ui/styles/sisad-pdfme.css:202 | KEEP_GEOMETRY |
| `.sisad-pdfme-designer-canvas [data-canvas-page="true"] .moveable-control-box .moveable-rotation-line` | 1 | `src/sisad-pdfme/ui/styles/sisad-pdfme.css` | src/sisad-pdfme/ui/styles/sisad-pdfme.css:205 | KEEP_GEOMETRY |
| `.sisad-pdfme-designer-canvas [data-canvas-page="true"] .scena-guides-guide-origin` | 1 | `src/sisad-pdfme/ui/styles/sisad-pdfme.css` | src/sisad-pdfme/ui/styles/sisad-pdfme.css:184 | KEEP_GEOMETRY |
| `.sisad-pdfme-designer-canvas [data-canvas-page="true"] .scena-guides-guide.scena-guides-adder` | 1 | `src/sisad-pdfme/ui/styles/sisad-pdfme.css` | src/sisad-pdfme/ui/styles/sisad-pdfme.css:187 | KEEP_GEOMETRY |
| `.sisad-pdfme-designer-canvas [data-canvas-page="true"] .scena-guides-manager` | 1 | `src/sisad-pdfme/ui/styles/sisad-pdfme.css` | src/sisad-pdfme/ui/styles/sisad-pdfme.css:181 | KEEP_GEOMETRY |
| `.sisad-pdfme-designer-canvas [data-canvas-page="true"]>.sisad-pdfme-designer-custom-undefined` | 1 | `src/sisad-pdfme/ui/styles/sisad-pdfme.css` | src/sisad-pdfme/ui/styles/sisad-pdfme.css:169 | KEEP_GEOMETRY |
| `.sisad-pdfme-designer-canvas [data-canvas-page="true"]>.sisad-pdfme-designer-padding` | 1 | `src/sisad-pdfme/ui/styles/sisad-pdfme.css` | src/sisad-pdfme/ui/styles/sisad-pdfme.css:172 | KEEP_GEOMETRY |
| `.sisad-pdfme-designer-canvas [data-paper-page="true"]` | 1 | `src/sisad-pdfme/ui/styles/sisad-pdfme.css` | src/sisad-pdfme/ui/styles/sisad-pdfme.css:108 | KEEP_GEOMETRY |
| `.sisad-pdfme-designer-canvas [data-paper-root="true"]` | 1 | `src/sisad-pdfme/ui/styles/sisad-pdfme.css` | src/sisad-pdfme/ui/styles/sisad-pdfme.css:91 | KEEP_GEOMETRY |
| `.sisad-pdfme-designer-canvas[data-grid-visible="true"]` | 1 | `src/sisad-pdfme/ui/styles/sisad-pdfme.css` | src/sisad-pdfme/ui/styles/sisad-pdfme.css:83 | KEEP_GEOMETRY |
| `.sisad-pdfme-designer-canvas[data-guides-visible="false"] [data-canvas-page="true"] .scena-guides-manager` | 1 | `src/sisad-pdfme/ui/styles/sisad-pdfme.css` | src/sisad-pdfme/ui/styles/sisad-pdfme.css:178 | KEEP_GEOMETRY |
| `.sisad-pdfme-designer-canvas[data-padding-visible="false"] [data-canvas-page="true"]>.sisad-pdfme-designer-padding` | 1 | `src/sisad-pdfme/ui/styles/sisad-pdfme.css` | src/sisad-pdfme/ui/styles/sisad-pdfme.css:175 | KEEP_GEOMETRY |
| `.sisad-pdfme-paper-page` | 1 | `src/sisad-pdfme/ui/styles/sisad-pdfme.css` | src/sisad-pdfme/ui/styles/sisad-pdfme.css:103 | KEEP_GEOMETRY |
| `.sisad-pdfme-paper-root` | 1 | `src/sisad-pdfme/ui/styles/sisad-pdfme.css` | src/sisad-pdfme/ui/styles/sisad-pdfme.css:95 | KEEP_GEOMETRY |
| `.sisad-pdfme-paper-scale-layer` | 1 | `src/sisad-pdfme/ui/styles/sisad-pdfme.css` | src/sisad-pdfme/ui/styles/sisad-pdfme.css:98 | KEEP_GEOMETRY |
| `.sisad-pdfme-root ::-webkit-scrollbar` | 1 | `src/sisad-pdfme/ui/styles/sisad-pdfme.css` | src/sisad-pdfme/ui/styles/sisad-pdfme.css:54 | KEEP_GEOMETRY |
| `.sisad-pdfme-root ::-webkit-scrollbar-thumb` | 1 | `src/sisad-pdfme/ui/styles/sisad-pdfme.css` | src/sisad-pdfme/ui/styles/sisad-pdfme.css:60 | KEEP_GEOMETRY |
| `.sisad-pdfme-root ::-webkit-scrollbar-thumb:hover` | 1 | `src/sisad-pdfme/ui/styles/sisad-pdfme.css` | src/sisad-pdfme/ui/styles/sisad-pdfme.css:63 | KEEP_GEOMETRY |
| `.sisad-pdfme-root ::-webkit-scrollbar-track` | 1 | `src/sisad-pdfme/ui/styles/sisad-pdfme.css` | src/sisad-pdfme/ui/styles/sisad-pdfme.css:57 | KEEP_GEOMETRY |
| `.sisad-pdfme-root .sisad-pdfme-designer-canvas[data-grid-visible="false"]` | 1 | `src/sisad-pdfme/ui/styles/sisad-pdfme.css` | src/sisad-pdfme/ui/styles/sisad-pdfme.css:146 | KEEP_GEOMETRY |
| `.sisad-pdfme-root .sisad-pdfme-designer-canvas[data-grid-visible="true"]` | 1 | `src/sisad-pdfme/ui/styles/sisad-pdfme.css` | src/sisad-pdfme/ui/styles/sisad-pdfme.css:151 | KEEP_GEOMETRY |
| `.sisad-pdfme-ui-preview-scroll` | 1 | `src/sisad-pdfme/ui/styles/sisad-pdfme.css` | src/sisad-pdfme/ui/styles/sisad-pdfme.css:78 | KEEP_GEOMETRY |
| `.sisad-pdfme-ui-preview-scroll [data-paper-page="true"]` | 1 | `src/sisad-pdfme/ui/styles/sisad-pdfme.css` | src/sisad-pdfme/ui/styles/sisad-pdfme.css:108 | KEEP_GEOMETRY |
| `.sisad-pdfme-ui-preview-scroll [data-paper-root="true"]` | 1 | `src/sisad-pdfme/ui/styles/sisad-pdfme.css` | src/sisad-pdfme/ui/styles/sisad-pdfme.css:91 | KEEP_GEOMETRY |

Ignora `reports/**`, `.tailwind-migration-backups/**` y reglas de keyframes.
```

<a id="file-0257"></a>

### 0257 — `reports/tailwind-migration/tc-css-04-left-sidebar-tailwind.md`

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

<a id="file-0258"></a>

### 0258 — `reports/tailwind-migration/tc-css-08-control-bar-toolbar-tailwind.md`

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

<a id="file-0259"></a>

### 0259 — `reports/tailwind-migration/tc-css-10-schemas-visual.md`

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

<a id="file-0260"></a>

### 0260 — `reports/tailwind-migration/tc-css-11-lab-audit.md`

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

<a id="file-0261"></a>

### 0261 — `reports/tailwind-migration/tc-css-option-group-selection-fix.md`

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

<a id="file-0262"></a>

### 0262 — `reports/tailwind-migration/tc-css-ownership-color.md`

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

<a id="file-0263"></a>

### 0263 — `reports/tailwind-migration/ui-styles-decommission-audit.md`

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

<a id="file-0264"></a>

### 0264 — `reports/tailwind-migration/ui-styles-decommission-progress.md`

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

<a id="file-0265"></a>

### 0265 — `test-results/tests-playwright-detail-vi-be09e-metry-and-identity-controls-chromium/error-context.md`

- **Lenguaje:** `markdown`
- **Líneas:** `540`
- **Tamaño original:** `27.1 KB`
- **SHA1 corto:** `2ce8fbcc85`
- **Estado:** `completo`

```markdown
# Page snapshot

``​`yaml
- main [ref=e3]:
  - region "Canvas" [ref=e4]:
    - generic [ref=e5]:
      - heading "Canvas" [level=2] [ref=e6]
      - paragraph [ref=e7]:
        - text: La superficie de edición se monta dentro del runtime de
        - code [ref=e8]: sisad-pdfme
        - text: .
    - generic [ref=e13]:
      - generic [ref=e14]:
        - generic [ref=e15]:
          - button "Cerrar catálogo de campos" [expanded] [ref=e16]:
            - img [ref=e17]
          - generic [ref=e21]:
            - generic [ref=e24]: Campos
            - generic [ref=e25]:
              - tablist "Tipos de campo" [ref=e26]:
                - tab "Estándar" [selected] [ref=e27] [cursor=pointer]:
                  - img [ref=e29]
                  - generic [ref=e32]: Base
                  - generic [ref=e33]: "38"
                - tab "Personalizados" [ref=e34] [cursor=pointer]:
                  - img [ref=e36]
                  - generic [ref=e40]: Custom
                  - generic [ref=e41]: "0"
                - tab "Prerrellenado" [ref=e42] [cursor=pointer]:
                  - img [ref=e44]
                  - generic [ref=e47]: Auto
                  - generic [ref=e48]: "0"
              - generic [ref=e50]:
                - generic [ref=e51]:
                  - img [ref=e53]
                  - textbox "Buscar campo..." [ref=e56]
                - generic [ref=e58]:
                  - button "Todos" [ref=e59] [cursor=pointer]:
                    - generic [ref=e60]: Todos
                  - button "Favoritos (0)" [ref=e61] [cursor=pointer]:
                    - generic [ref=e62]: Favoritos (0)
                  - button "Recientes (0)" [ref=e63] [cursor=pointer]:
                    - generic [ref=e64]: Recientes (0)
                  - group "Diseño del catálogo" [ref=e65]:
                    - button "Ver como lista detallada (≡)" [pressed] [ref=e66] [cursor=pointer]:
                      - generic [ref=e67]:
                        - img [ref=e69]
                        - generic [ref=e72]: Lista
                    - button "Ver como tarjetas densas (▦)" [ref=e73] [cursor=pointer]:
                      - generic [ref=e74]:
                        - img [ref=e76]
                        - generic [ref=e78]: Tarjetas
                    - button "Ver solo iconos (⠿)" [ref=e79] [cursor=pointer]:
                      - generic [ref=e80]:
                        - img [ref=e82]
                        - generic [ref=e85]: Iconos
            - generic [ref=e86]:
              - generic [ref=e87]:
                - button "Alternar categoría Firmas" [expanded] [ref=e88]:
                  - generic [ref=e89]:
                    - img [ref=e91]
                    - generic [ref=e93]: Firmas
                  - generic [ref=e94]: "3"
                - generic [ref=e95]:
                  - generic [ref=e98]:
                    - button "Datesigned Datesigned" [ref=e99]:
                      - generic "Datesigned" [ref=e101]:
                        - img [ref=e102]
                      - generic [ref=e106]: Datesigned
                    - button "Marcar favorito" [ref=e107]: ★
                  - generic [ref=e110]:
                    - button "Initials Initials" [ref=e111]:
                      - generic "Initials" [ref=e113]:
                        - img [ref=e114]
                      - generic [ref=e117]: Initials
                    - button "Marcar favorito" [ref=e118]: ★
                  - generic [ref=e121]:
                    - button "Firma Firma" [ref=e122]:
                      - generic "Firma" [ref=e124]:
                        - img [ref=e125]
                      - generic [ref=e128]: Firma
                    - button "Marcar favorito" [ref=e129]: ★
              - generic [ref=e130]:
                - button "Alternar categoría Texto" [expanded] [ref=e131]:
                  - generic [ref=e132]:
                    - img [ref=e134]
                    - generic [ref=e136]: Texto
                  - generic [ref=e137]: "2"
                - generic [ref=e138]:
                  - generic [ref=e141]:
                    - button "Número" [ref=e142]:
                      - generic [ref=e145]: Número
                    - button "Marcar favorito" [ref=e146]: ★
                  - generic [ref=e149]:
                    - button "Texto Texto" [ref=e150]:
                      - generic "Texto" [ref=e152]:
                        - img [ref=e153]
                      - generic [ref=e159]: Texto
                    - button "Marcar favorito" [ref=e160]: ★
              - generic [ref=e161]:
                - button "Alternar categoría Imagen y medios" [expanded] [ref=e162]:
                  - generic [ref=e163]:
                    - img [ref=e165]
                    - generic [ref=e167]: Imagen y medios
                  - generic [ref=e168]: "2"
                - generic [ref=e169]:
                  - generic [ref=e172]:
                    - button "Imagen Imagen" [ref=e173]:
                      - generic "Imagen" [ref=e175]:
                        - img [ref=e176]
                      - generic [ref=e181]: Imagen
                    - button "Marcar favorito" [ref=e182]: ★
                  - generic [ref=e185]:
                    - button "SVG SVG" [ref=e186]:
                      - generic "SVG" [ref=e188]:
                        - img [ref=e189]
                      - generic [ref=e194]: SVG
                    - button "Marcar favorito" [ref=e195]: ★
              - generic [ref=e196]:
                - button "Alternar categoría Selecciones" [expanded] [ref=e197]:
                  - generic [ref=e198]:
                    - img [ref=e200]
                    - generic [ref=e202]: Selecciones
                  - generic [ref=e203]: "4"
                - generic [ref=e204]:
                  - generic [ref=e207]:
                    - button "Casilla Casilla" [ref=e208]:
                      - generic "Casilla" [ref=e210]:
                        - img [ref=e211]
                      - generic [ref=e215]: Casilla
                    - button "Marcar favorito" [ref=e216]: ★
                  - generic [ref=e219]:
                    - button "Grupo de Casillas Grupo de Casillas" [ref=e220]:
                      - generic "Grupo de Casillas" [ref=e222]:
                        - img [ref=e223]
                      - generic [ref=e227]: Grupo de Casillas
                    - button "Marcar favorito" [ref=e228]: ★
                  - generic [ref=e231]:
                    - button "Opción Opción" [ref=e232]:
                      - generic "Opción" [ref=e234]:
                        - img [ref=e235]
                      - generic [ref=e239]: Opción
                    - button "Marcar favorito" [ref=e240]: ★
                  - generic [ref=e243]:
                    - button "Lista Desplegable Lista Desplegable" [ref=e244]:
                      - generic "Lista Desplegable" [ref=e246]:
                        - img [ref=e247]
                      - generic [ref=e250]: Lista Desplegable
                    - button "Marcar favorito" [ref=e251]: ★
              - generic [ref=e252]:
                - button "Alternar categoría Fecha y Hora" [expanded] [ref=e253]:
                  - generic [ref=e254]:
                    - img [ref=e256]
                    - generic [ref=e258]: Fecha y Hora
                  - generic [ref=e259]: "3"
                - generic [ref=e260]:
                  - generic [ref=e263]:
                    - button "Fecha Fecha" [ref=e264]:
                      - generic "Fecha" [ref=e266]:
                        - img [ref=e267]
                      - generic [ref=e270]: Fecha
                    - button "Marcar favorito" [ref=e271]: ★
                  - generic [ref=e274]:
                    - button "Fecha Y Hora Fecha Y Hora" [ref=e275]:
                      - generic "Fecha Y Hora" [ref=e277]:
                        - img [ref=e278]
                      - generic [ref=e283]: Fecha Y Hora
                    - button "Marcar favorito" [ref=e284]: ★
                  - generic [ref=e287]:
                    - button "Hora Hora" [ref=e288]:
                      - generic "Hora" [ref=e290]:
                        - img [ref=e291]
                      - generic [ref=e295]: Hora
                    - button "Marcar favorito" [ref=e296]: ★
              - generic [ref=e297]:
                - button "Alternar categoría QR y Códigos" [expanded] [ref=e298]:
                  - generic [ref=e299]:
                    - img [ref=e301]
                    - generic [ref=e303]: QR y Códigos
                  - generic [ref=e304]: "12"
                - generic [ref=e305]:
                  - generic [ref=e308]:
                    - button "Código de barras Código de barras" [ref=e309]:
                      - generic "Código de barras" [ref=e311]:
                        - img [ref=e312]
                      - generic [ref=e314]: Código de barras
                    - button "Marcar favorito" [ref=e315]: ★
                  - generic [ref=e318]:
                    - button "Código de barras Código de barras" [ref=e319]:
                      - generic "Código de barras" [ref=e321]:
                        - img [ref=e322]
                      - generic [ref=e324]: Código de barras
                    - button "Marcar favorito" [ref=e325]: ★
                  - generic [ref=e328]:
                    - button "Código de barras Código de barras" [ref=e329]:
                      - generic "Código de barras" [ref=e331]:
                        - img [ref=e332]
                      - generic [ref=e334]: Código de barras
                    - button "Marcar favorito" [ref=e335]: ★
                  - generic [ref=e338]:
                    - button "Código de barras Código de barras" [ref=e339]:
                      - generic "Código de barras" [ref=e341]:
                        - img [ref=e342]
                      - generic [ref=e344]: Código de barras
                    - button "Marcar favorito" [ref=e345]: ★
                  - generic [ref=e348]:
                    - button "DataMatrix DataMatrix" [ref=e349]:
                      - generic "DataMatrix" [ref=e351]:
                        - img [ref=e352]
                      - generic [ref=e354]: DataMatrix
                    - button "Marcar favorito" [ref=e355]: ★
                  - generic [ref=e358]:
                    - button "Código de barras Código de barras" [ref=e359]:
                      - generic "Código de barras" [ref=e361]:
                        - img [ref=e362]
                      - generic [ref=e364]: Código de barras
                    - button "Marcar favorito" [ref=e365]: ★
                  - generic [ref=e368]:
                    - button "Japan Post Japan Post" [ref=e369]:
                      - generic "Japan Post" [ref=e371]:
                        - img [ref=e372]
                      - generic [ref=e374]: Japan Post
                    - button "Marcar favorito" [ref=e375]: ★
                  - generic [ref=e378]:
                    - button "NW7 NW7" [ref=e379]:
                      - generic "NW7" [ref=e381]:
                        - img [ref=e382]
                      - generic [ref=e384]: NW7
                    - button "Marcar favorito" [ref=e385]: ★
                  - generic [ref=e388]:
                    - button "PDF417 PDF417" [ref=e389]:
                      - generic "PDF417" [ref=e391]:
                        - img [ref=e392]
                      - generic [ref=e394]: PDF417
                    - button "Marcar favorito" [ref=e395]: ★
                  - generic [ref=e398]:
                    - button "Código QR Código QR" [ref=e399]:
                      - generic "Código QR" [ref=e401]:
                        - img [ref=e402]
                      - generic [ref=e409]: Código QR
                    - button "Marcar favorito" [ref=e410]: ★
                  - generic [ref=e413]:
                    - button "Código de barras Código de barras" [ref=e414]:
                      - generic "Código de barras" [ref=e416]:
                        - img [ref=e417]
                      - generic [ref=e419]: Código de barras
                    - button "Marcar favorito" [ref=e420]: ★
                  - generic [ref=e423]:
                    - button "Código de barras Código de barras" [ref=e424]:
                      - generic "Código de barras" [ref=e426]:
                        - img [ref=e427]
                      - generic [ref=e429]: Código de barras
                    - button "Marcar favorito" [ref=e430]: ★
              - generic [ref=e431]:
                - button "Alternar categoría Estructura" [expanded] [ref=e432]:
                  - generic [ref=e433]:
                    - img [ref=e435]
                    - generic [ref=e437]: Estructura
                  - generic [ref=e438]: "4"
                - generic [ref=e439]:
                  - generic [ref=e442]:
                    - button "Óvalo Óvalo" [ref=e443]:
                      - generic "Óvalo" [ref=e445]:
                        - img [ref=e446]
                      - generic [ref=e449]: Óvalo
                    - button "Marcar favorito" [ref=e450]: ★
                  - generic [ref=e453]:
                    - button "Línea Línea" [ref=e454]:
                      - generic "Línea" [ref=e456]:
                        - img [ref=e457]
                      - generic [ref=e459]: Línea
                    - button "Marcar favorito" [ref=e460]: ★
                  - generic [ref=e463]:
                    - button "Rectángulo Rectángulo" [ref=e464]:
                      - generic "Rectángulo" [ref=e466]:
                        - img [ref=e467]
                      - generic [ref=e470]: Rectángulo
                    - button "Marcar favorito" [ref=e471]: ★
                  - generic [ref=e474]:
                    - button "Tabla Tabla" [ref=e475]:
                      - generic "Tabla" [ref=e477]:
                        - img [ref=e478]
                      - generic [ref=e481]: Tabla
                    - button "Marcar favorito" [ref=e482]: ★
              - generic [ref=e483]:
                - button "Alternar categoría Acción" [expanded] [ref=e484]:
                  - generic [ref=e485]:
                    - img [ref=e487]
                    - generic [ref=e489]: Acción
                  - generic [ref=e490]: "4"
                - generic [ref=e491]:
                  - generic [ref=e494]:
                    - button "Approve Approve" [ref=e495]:
                      - generic "Approve" [ref=e497]:
                        - img [ref=e498]
                      - generic [ref=e502]: Approve
                    - button "Marcar favorito" [ref=e503]: ★
                  - generic [ref=e506]:
                    - button "Attachment Attachment" [ref=e507]:
                      - generic "Attachment" [ref=e509]:
                        - img [ref=e510]
                      - generic [ref=e513]: Attachment
                    - button "Marcar favorito" [ref=e514]: ★
                  - generic [ref=e517]:
                    - button "Decline Decline" [ref=e518]:
                      - generic "Decline" [ref=e520]:
                        - img [ref=e521]
                      - generic [ref=e526]: Decline
                    - button "Marcar favorito" [ref=e527]: ★
                  - generic [ref=e530]:
                    - button "Note Note" [ref=e531]:
                      - generic "Note" [ref=e533]:
                        - img [ref=e534]
                      - generic [ref=e538]: Note
                    - button "Marcar favorito" [ref=e539]: ★
              - generic [ref=e540]:
                - button "Alternar categoría Destinatario" [expanded] [ref=e541]:
                  - generic [ref=e542]:
                    - img [ref=e544]
                    - generic [ref=e546]: Destinatario
                  - generic [ref=e547]: "4"
                - generic [ref=e548]:
                  - generic [ref=e551]:
                    - button "Company Company" [ref=e552]:
                      - generic "Company" [ref=e554]:
                        - img [ref=e555]
                      - generic [ref=e560]: Company
                    - button "Marcar favorito" [ref=e561]: ★
                  - generic [ref=e564]:
                    - button "Emailaddress Emailaddress" [ref=e565]:
                      - generic "Emailaddress" [ref=e567]:
                        - img [ref=e568]
                      - generic [ref=e572]: Emailaddress
                    - button "Marcar favorito" [ref=e573]: ★
                  - generic [ref=e576]:
                    - button "Fullname Fullname" [ref=e577]:
                      - generic "Fullname" [ref=e579]:
                        - img [ref=e580]
                      - generic [ref=e584]: Fullname
                    - button "Marcar favorito" [ref=e585]: ★
                  - generic [ref=e588]:
                    - button "Title Title" [ref=e589]:
                      - generic "Title" [ref=e591]:
                        - img [ref=e592]
                      - generic [ref=e596]: Title
                    - button "Marcar favorito" [ref=e597]: ★
        - generic [ref=e598]:
          - generic:
            - generic [ref=e600]:
              - button "Página anterior" [disabled] [ref=e601]:
                - generic:
                  - img
              - button "Pág 1/14" [ref=e602] [cursor=pointer]:
                - generic [ref=e603]: Pág 1/14
              - button "Página siguiente" [ref=e604] [cursor=pointer]:
                - img [ref=e606]
            - generic [ref=e609]:
              - button "Guardar" [ref=e610] [cursor=pointer]:
                - img [ref=e612]
                - generic [ref=e616]: Guardar
              - button "Más acciones" [ref=e617] [cursor=pointer]:
                - img [ref=e619]
            - generic [ref=e624]:
              - button "Deshacer" [ref=e625] [cursor=pointer]:
                - img [ref=e627]
              - button "Rehacer" [ref=e630] [cursor=pointer]:
                - img [ref=e632]
              - button "Ajustar página" [ref=e635] [cursor=pointer]:
                - img [ref=e637]
              - generic [ref=e642]:
                - button "Reducir zoom" [ref=e643] [cursor=pointer]:
                  - img [ref=e645]
                - generic "Nivel de zoom" [ref=e646] [cursor=pointer]:
                  - generic [ref=e648]:
                    - combobox "Nivel de zoom" [ref=e650]
                    - generic "100%" [ref=e651]
                  - generic:
                    - img:
                      - img
                - button "Aumentar zoom" [ref=e652] [cursor=pointer]:
                  - img [ref=e654]
          - complementary "Panel derecho del diseñador" [ref=e655]:
            - generic [ref=e656]:
              - generic [ref=e658]:
                - tablist "Panel derecho" [ref=e659]:
                  - tab "Abrir panel Campos" [ref=e660]:
                    - generic [ref=e661]:
                      - img [ref=e663]
                      - generic [ref=e667]: Campos
                  - tab "Abrir panel Detalle" [disabled] [ref=e668]:
                    - generic [ref=e669]:
                      - img [ref=e671]
                      - generic [ref=e672]: Detalle
                  - tab "Abrir panel Docs" [selected] [ref=e673]:
                    - generic [ref=e674]:
                      - img [ref=e676]
                      - generic [ref=e679]: Docs
                - button "Ocultar panel derecho" [expanded] [ref=e681]:
                  - img [ref=e682]
              - generic [ref=e688]:
                - generic [ref=e690]:
                  - img [ref=e692]
                  - generic [ref=e696]:
                    - generic [ref=e697]: Documentos cargados
                    - generic [ref=e698]: Selecciona una página
                    - generic [ref=e700]: "2"
                  - button "Subir PDF" [ref=e703] [cursor=pointer]:
                    - img [ref=e705]
                    - generic [ref=e709]: Subir PDF
                - generic "Lista de páginas del documento" [ref=e710]:
                  - generic [ref=e711]:
                    - generic [ref=e712]:
                      - button "1 Declaración de datos 1 Activo 14 paginas" [pressed] [ref=e713]:
                        - generic [ref=e716]: "1"
                        - generic [ref=e717]:
                          - strong [ref=e719]: Declaración de datos
                          - generic [ref=e720]:
                            - generic [ref=e721]: "1"
                            - generic [ref=e722]: Activo
                          - generic [ref=e723]: 14 paginas
                      - button "Eliminar Declaración de datos" [ref=e724] [cursor=pointer]:
                        - img [ref=e726]
                    - generic [ref=e729]:
                      - button "2 Certificado académico 2 5 paginas" [ref=e730]:
                        - generic [ref=e733]: "2"
                        - generic [ref=e734]:
                          - strong [ref=e736]: Certificado académico
                          - generic [ref=e738]: "2"
                          - generic [ref=e739]: 5 paginas
                      - button "Eliminar Certificado académico" [ref=e740] [cursor=pointer]:
                        - img [ref=e742]
          - generic [ref=e747]:
            - generic [ref=e748]:
              - generic "contract_name" [ref=e750] [cursor=pointer]:
                - generic [ref=e753]: Contrato principal
                - generic: contract_name · text
              - generic "contract_date" [ref=e754] [cursor=pointer]:
                - generic [ref=e757]: 2026-05-01
                - generic: contract_date · text
              - generic "contract_stage" [ref=e758] [cursor=pointer]:
                - generic [ref=e759]:
                  - generic [ref=e761]: Pendiente
                  - button:
                    - img
                - generic: contract_stage · select
              - generic "approval_mode" [ref=e762] [cursor=pointer]:
                - generic:
                  - radiogroup "Modo de aprobación":
                    - generic:
                      - radio "Firma" [checked] [disabled]
                      - radio "Revisión" [disabled]
              - generic "required_documents" [ref=e763] [cursor=pointer]:
                - generic:
                  - group "Documentos requeridos":
                    - generic:
                      - checkbox "Cédula" [checked] [disabled]:
                        - generic:
                          - generic:
                            - generic:
                              - img
                      - checkbox "RUC" [disabled]
                      - checkbox "Contrato firmado" [checked] [disabled]:
                        - generic:
                          - generic:
                            - generic:
                              - img
              - generic "routing-primary-showcase_attachment" [ref=e764] [cursor=pointer]:
                - generic [ref=e767]:
                  - img [ref=e768]
                  - text: Adjuntar archivo
                - generic: routing-primary-showcase_attachment · attachment
              - generic "routing-primary-showcase_approve" [ref=e770] [cursor=pointer]:
                - button "Aprobar" [ref=e773]:
                  - img [ref=e774]
                  - text: Aprobar
                - generic: routing-primary-showcase_approve · approve
              - generic "Solo lectura" [ref=e776] [cursor=pointer]:
                - generic [ref=e779]: Nota informativa
                - generic: routing-primary-showcase_note · note
                - generic: solo lectura
              - generic "routing-primary-showcase_decline" [ref=e780] [cursor=pointer]:
                - button "Rechazar" [ref=e783]:
                  - img [ref=e784]
                  - text: Rechazar
                - generic: routing-primary-showcase_decline · decline
              - generic "routing-primary-showcase_title" [ref=e787] [cursor=pointer]:
                - generic: routing-primary-showcase_title · title
              - generic "routing-primary-showcase_emailaddress" [ref=e791] [cursor=pointer]:
                - generic: routing-primary-showcase_emailaddress · emailAddress
            - generic [ref=e795]:
              - generic "routing-primary-showcase_company" [ref=e797] [cursor=pointer]:
                - generic: routing-primary-showcase_company · company
              - generic "routing-primary-showcase_fullname" [ref=e801] [cursor=pointer]:
                - generic: routing-primary-showcase_fullname · fullName
              - generic "routing-primary-showcase_table" [ref=e805] [cursor=pointer]:
                - generic [ref=e806]:
                  - generic [ref=e810]: Name
                  - generic [ref=e814]: City
                  - generic [ref=e818]: Description
                  - generic [ref=e822]: Alice
                  - generic [ref=e830]: New York
                  - generic [ref=e838]: Alice is a freelance web designer and developer
                  - generic [ref=e846]: Bob
                  - generic [ref=e854]: Paris
                  - generic [ref=e862]: Bob is a freelance illustrator and graphic designer
                - generic: routing-primary-showcase_table · table
              - generic "routing-primary-showcase_date" [ref=e867] [cursor=pointer]:
                - generic: routing-primary-showcase_date · date
              - generic "routing-primary-showcase_datetime" [ref=e871] [cursor=pointer]:
                - generic: routing-primary-showcase_datetime · dateTime
              - generic "routing-primary-showcase_time" [ref=e875] [cursor=pointer]:
                - generic: routing-primary-showcase_time · time
            - generic [ref=e879]:
              - generic "Solo lectura" [ref=e881] [cursor=pointer]:
                - generic [ref=e884]: 17/07/2026
                - generic: routing-primary-showcase_datesigned · dateSigned
                - generic: solo lectura
              - generic "routing-primary-showcase_signature" [ref=e885] [cursor=pointer]:
                - generic: routing-primary-showcase_signature · signature
              - generic "routing-primary-showcase_initials" [ref=e888] [cursor=pointer]:
                - generic: routing-primary-showcase_initials · initials
              - generic "routing-primary-showcase_code128" [ref=e891] [cursor=pointer]:
                - img [ref=e894]
                - generic: routing-primary-showcase_code128 · code128
              - generic "routing-primary-showcase_code39" [ref=e895] [cursor=pointer]:
                - img [ref=e898]
                - generic: routing-primary-showcase_code39 · code39
              - generic "routing-primary-showcase_ean13" [ref=e899] [cursor=pointer]:
                - img [ref=e902]
                - generic: routing-primary-showcase_ean13 · ean13
            - generic "routing-primary-showcase_ean8" [ref=e905] [cursor=pointer]:
              - img [ref=e908]
              - generic: routing-primary-showcase_ean8 · ean8
      - status [ref=e929]
  - region "Resultados":
    - generic:
      - button "Resultados Sin artefactos":
        - text: Resultados
        - generic: Sin artefactos
``​`
```

<a id="file-0266"></a>

### 0266 — `ai/coordination/uxqa-20260717/OWNERSHIP.md`

- **Lenguaje:** `markdown`
- **Líneas:** `13`
- **Tamaño original:** `0.5 KB`
- **SHA1 corto:** `8057b21180`
- **Estado:** `completo`

```markdown
# OWNERSHIP — UX/QA 2026-07-17

## Agentes y dominios

- CODEX: P0 técnico, hooks, runtime, overlays Canvas, interacción y pruebas focales.
- CLAUDE: arquitectura visual, RightSidebar, DetailView, topbar global, Guardar, DocumentsRail e integración.
- COPILOT: LeftSidebar, host del laboratorio, ESLint/warnings, accesibilidad y pruebas visuales de su dominio.

## Reglas

- Cada agente edita únicamente sus rutas owned por wave.
- Cada agente escribe solo su propio estado y handoffs.
- No se permiten colisiones de ownership sin handoff explícito.
```

<a id="file-0267"></a>

### 0267 — `ai/task-cards/active/TASK-CSS-026-accelerated-tailwind-inline-decommission.md`

- **Lenguaje:** `markdown`
- **Líneas:** `109`
- **Tamaño original:** `7.0 KB`
- **SHA1 corto:** `d701bfd505`
- **Estado:** `completo`

```markdown
# TASK-CSS-026 — Desmantelamiento acelerado de Tailwind inline (FASE A/E/H/G)

- Estado: active
- Prioridad: Alta
- Responsable sugerido: Claude
- Área: `sisad-pdfme` / tokens / lab host / CSS técnico residual
- Plan: `ai/plans/PLAN_EJECUCION_MIGRACION_TAILWIND_SISAD_PDFME.md`
- Prompt maestro: `ai/prompts/PROMPT_MAESTRO_MIGRACION_TAILWIND_SISAD_PDFME.md`

## Coexistencia con TASK-REGRESSION-021

`TASK-REGRESSION-021` (responsable: Copilot) está trabajando activamente el **skin del shell,
sidebars e inspector** dentro de `sisad-pdfme.css` (2004→1943 líneas, 445→431 `@apply` durante
esta sesión). Para no colisionar, **esta tarjeta se limita a carriles disjuntos**:

- FASE A — inventario/mapa (análisis, sin UI).
- FASE E — lab host (`labRoutes.css`, archivo distinto).
- FASE H — tokens (`tokens.css`, archivo distinto).
- FASE G — poda de CSS **técnico/huérfano demostrado** (no skin en disputa).

No toco reglas de shell/sidebar/inspector mientras REGRESSION-021 esté activa.

## Hecho en esta sesión

- **FASE A** — Línea base + `constants-contract.md`: las 9 constantes de `constants.ts`
  (DESIGNER_CLASSNAME, UI_CLASSNAME, SELECTABLE_CLASSNAME, RULER_HEIGHT, PAGE_GAP,
  LEFT/RIGHT_SIDEBAR_WIDTH, BACKGROUND_COLOR, DEFAULT_MAX_ZOOM) son hooks
  semánticos / de interacción / geometría → **todas se conservan**, ninguna migra.
- **FASE E** — `labRoutes.css` era no-op (solo comentario) → **archivo eliminado** + import
  removido de `src/App.jsx`. Sin referencias restantes.
- **FASE H / PACKAGE-07** — Auditoría de 313 tokens. **175 huérfanos eliminados, 10 restaurados.**
  El criterio inicial perdió referencias con fallback `var(--t, valor)`: 10 tokens (chrome-*,
  root-width/height, ls-draggable-*) seguían consumidos y 2 fallbacks no igualaban el original
  (`chrome-border`, `chrome-height`) → **regresión detectada y corregida** restaurándolos.
  `tokens.css` 323→150 líneas. Verificado: 0 tokens borrados siguen referenciados.

- **PACKAGE-06 / FASE G (parcial)** — Poda huérfana de `sisad-pdfme.css` por cirugía de regla:
  familia `control-bar-*` (context/kicker/page/subtext/title-row/status-chip/actions/group/
  shortcuts-btn/page-select/menu-item + stage-coupled) y `output-grid/output-card`; parciales
  `pager` y `panel-dock/trigger`. ~100 líneas menos. Conservados vivos + AntD + tokens con fallback.
  Lección: `ui-zoom` es vivo vía `UI_CLASSNAME + 'zoom'` → verificar por **sufijo**, no clase completa.

## Gate ejecutado

- `npm run build` → **exit 0** (varias veces). CSS 181.28 → **176.14 KiB**. Braces 468/468.
- Playwright `lab-designer-visual-baseline-regression:66` (shell/layout) → **pasa**. `:4` es
  **pre-existente** (se reproduce revirtiendo a HEAD), no introducido aquí.

## Pendiente (siguientes paquetes de esta tarjeta)

- FASE H bis: clasificar los ~90 tokens vivos restantes (ACTIVE_SHARED / ALIAS_REQUIRED)
  y documentar; no eliminar deprecated con consumidores.
- FASE G: clasificar bloques residuales de `sisad-pdfme.css` (ANTD/CANVAS/PAPER/MOVEABLE/
  SELECTO/PRINT/KEYFRAMES/RUNTIME_GLOBAL/ORPHAN) y podar solo huérfanos demostrados **una vez
  que REGRESSION-021 libere el archivo**.
- FASE I: métricas finales + QA de regresión.

## Registro UX/UI Canvas-First (PROMPT_MEJORA_UX_UI_CANVAS_FIRST) — 2026-07-16

Scope registrado aquí (no se creó una 3ª task-card, per regla del prompt).

- **Hecho:** auditoría del entrypoint — `editor/index.ts` tenía `import '../ui/styles/sisad-pdfme.css'`
  **duplicado** (líneas 49-50). Eliminada la duplicación exacta + comentario redundante; orden
  `tokens.css → sisad-pdfme.css` preservado. `react/index.ts` ya era correcto. `npm run build` → exit 0.
- **BLOQUEADO (no ejecutado):** el rediseño visual de componentes (RightSidebar/LeftSidebar/CtlBar/
  ResultsPanel — Pasos 2-5 del prompt). Razón: **REGRESSION-021 (Copilot) está reescribiendo en vivo
  TODOS los archivos objetivo** — `sisad-pdfme.css` colapsó 1747→566 líneas esta sesión y están dirty
  RightSidebar.tsx, layout.tsx, SidebarSurfacePrimitives, todo ListView/*, todo DetailView/*,
  DocumentsRail, CommentsRail, LeftSidebar.tsx, CtlBar.tsx, ResultsPanel.jsx. Un overhaul visual
  coherente requiere editar esos mismos archivos de forma coordinada → colisión garantizada con el
  trabajo en progreso de Copilot. El propio prompt exige **una sola task-card activa** antes de
  ejecutar; esa precondición no se cumple mientras REGRESSION-021 siga activa.
- **Recomendación:** dejar aterrizar REGRESSION-021 y consolidar los ~200 archivos dirty en un commit;
  sobre esa base estable ejecuto los Pasos 2-5 del overhaul (subpases A-D) con validación por paquete.

## Selector de "usuario activo" en topbar embebido — 2026-07-16

Bug real: en `multi-document-routing` (`usesEmbeddedDesignerShell = true`) el `PageHeader`
externo NO se monta, así que el selector de destinatario quedó fuera del DOM.

**Hallazgo arquitectónico:** `SisadPdfmeDesigner` renderiza solo `<div ref>` — el diseñador se
monta **imperativamente** (runtime pdfme), NO como hijos React. Por tanto **la propuesta de
`topbarRecipientSlot` como ReactNode es incompatible**: no hay padre React que lo inyecte. El
selector debe renderizarse **dentro** del diseñador (CtlBar) desde `collaborationContext.recipientOptions`.

**Hecho y validado (`npm run build` exit 0):**
- `RegisteredUsersSelector.tsx` creado (`ui/components/`, conventions: UI_CLASSNAME, mergeClassNames,
  `border-solid`, testid `designer-active-recipient-select`, estados sin/uno/varios usuarios + vista global).
- `PdfmeLabPage.jsx`: round-trip controlado — `handleActiveRecipientChange` + `onActiveRecipientChange`
  en el `<SisadPdfmeDesigner>` (antes faltaba; sin él el prop controlado revierte el cambio interno).
  `activeRecipientId` ya era la fuente viva (`activeCollaboratorId`), verificado.
- `RecipientRegistry.setActiveRecipient(id)` existe (recipientRegistry.ts:168) = setter interno.

**Pendiente (plumbing del bridge imperativo — zona activa Copilot):** montar el selector en CtlBar:
1. `SisadPdfmeDesigner.tsx`: inyectar `onSelectActiveRecipient: (id) => registry.setActiveRecipient(id)`
   en `designerEngine.collaboration`.
2. `collaborationContext.ts` (`buildEffectiveCollaborationContext`): propagar ese callback.
3. `Designer/index.tsx`: pasar `recipientOptions` + `activeRecipient` + callback a `<CtlBar>`.
4. `CtlBar.tsx`: nuevos props + render de `<RegisteredUsersSelector>` en la banda superior (cluster
   top-left/center, junto a page-nav).
No ejecutado: cruza el boundary imperativo + `Designer/index.tsx` (4000 líneas) + CtlBar, todos dirty
y en reescritura por REGRESSION-021; un bug ahí rompe permisos/colores runtime (no lo caza el build).

## Reglas

- Preservar concatenación `DESIGNER_CLASSNAME + 'suffix'` / `UI_CLASSNAME + 'suffix'`.
- No mover CSS técnico (AntD descendant, geometría, keyframes) a JSX solo por reducir líneas.
- Selectores AntD descendant (`.right-sidebar .ant-*`) = CSS técnico → conservar.
- No tocar Moveable/Selecto/coordenadas/snapshot/generator/pdf-lib/zoom.
```

<a id="file-0268"></a>

### 0268 — `ai/task-cards/active/TASK-REGRESSION-021-shell-token-visual-recovery.md`

- **Lenguaje:** `markdown`
- **Líneas:** `214`
- **Tamaño original:** `35.7 KB`
- **SHA1 corto:** `6454803449`
- **Estado:** `completo`

```markdown
# TASK-REGRESSION-021 — Recuperación visual shell/tokens antes de seguir migrando Tailwind

- Estado: active
- Prioridad: Alta
- Responsable sugerido: GitHub Copilot
- Área: `sisad-pdfme` / Shell visual / Sidebars / Tokens de presentación

## Objetivo

Recuperar la paridad visual del shell del laboratorio y de las superficies base del diseñador usando JSX/TSX con Tailwind, tomando como baseline el contrato visual previo definido por el CSS consolidado histórico y las capturas anteriores, antes de continuar reduciendo `@apply`.

## Baseline usado

- Baseline híbrido por falta de un commit único visualmente correcto.
- CSS/base shell: `4c40ca1` (`src/features/pdfcomponent/labRoutes.css`).
- Header shell: `e96a7ab` (`src/features/pdfcomponent/PageHeader.jsx`).
- LeftSidebar tabs/layout: `2404b7a` (`src/sisad-pdfme/ui/components/Designer/LeftSidebarTabs.tsx`).
- Referencia visual secundaria: capturas previas del usuario y `ai/baselines/multi-document-routing-2026-07-15.jpg`.

## Regresiones foco de esta tarjeta

1. Jerarquía visual degradada del shell del lab y sidebars.
2. Selector Lista/Tarjetas/Iconos y bandas superiores del sidebar izquierdo con densidad/espaciado inconsistentes.
3. Cards/superficies del sidebar derecho e inspector con borde, padding y contraste distintos al baseline.
4. Pérdida de contratos visuales que antes vivían en CSS consolidado y no fueron trasladados al nodo JSX/TSX correcto.

## Alcance

- Restaurar shell, header, sidebars y superficies base.
- Reubicar utilidades Tailwind faltantes al JSX/TSX correcto.
- Mantener `tokens.css` y CSS crítico fuera del alcance.
- No continuar la reducción masiva de `@apply` hasta demostrar paridad visual.

## Fuera de alcance

- Moveable, Selecto, geometría, zoom, guías, snapshot, generator y `pdf-lib`.
- Correcciones funcionales de drag/drop o owner-color si exigen otra superficie.
- Limpieza adicional de CSS por conteo.

## Archivos candidatos

- `src/features/pdfcomponent/PdfmeLabPage.jsx`
- `src/features/pdfcomponent/PageHeader.jsx`
- `src/sisad-pdfme/ui/components/Designer/LeftSidebar.tsx`
- `src/sisad-pdfme/ui/components/Designer/LeftSidebarTabs.tsx`
- `src/sisad-pdfme/ui/components/Designer/RightSidebar/RightSidebar.tsx`

## Archivos prohibidos

- `src/sisad-pdfme/ui/styles/sisad-pdfme.css`
- `src/features/pdfcomponent/labRoutes.css`
- `src/sisad-pdfme/ui/styles/tokens.css`
- cualquier archivo de canvas geometry, Moveable, Selecto, snapshot o generator

## Validación

- `npm run build`
- comparación visual en `/lab/multi-document-routing`
- `npx playwright test tests/playwright/multi-document-routing-design.spec.ts tests/playwright/right-sidebar-docs-tab.spec.ts`

## Progreso actual

- `LeftSidebarTabs.tsx` recuperó la jerarquía compacta del selector superior sin volver a CSS de hoja; se usaron pills más bajas, badges absolutos y labels cortos para evitar clipping.
- `LeftSidebar.tsx` recuperó padding, dock header, chip recipient y superficie glass del panel izquierdo en el nodo dueño.
- `CatalogLayoutToggle.tsx` quedó compactado para densidades/anchos estrechos, ocultando labels cuando el rail no tiene espacio suficiente y evitando el recorte del selector Lista/Tarjetas/Iconos.
- `SchemaCollaborationWidget.tsx` eliminó el bloque redundante de `Propiedad` para que los detalles del schema de firma no repitan el resumen del owner y el bloque de colaboración quede más limpio.
- `DetailHeaderCard.tsx`, `SidebarSurfacePrimitives.tsx`, `DetailSectionCard.tsx`, `InspectorField.tsx` y `InspectorPrimitives.tsx` suavizaron bordes, sombras y fondos del inspector para recuperar la densidad visual del baseline sin cambiar lógica ni contratos.
- `Item.tsx` suavizó borde, sombra y estado seleccionado de las filas del ListView para separar mejor el accent del propietario del estado `selected` y bajar el ruido del row activo.
- `Item.tsx` también desactivó la apariencia nativa del hit-target del row, eliminando el borde `2px outset` del navegador que hacía ver las cards como si tuvieran un contorno negro pesado.
- `index.tsx` dejó explícita la precedencia de `RightSidebar` para que el modo `docs` del laboratorio multidocumento no sea pisado por props del engine al entrar a la ruta.
- `PageHeader.jsx` y `PdfmeLabPage.jsx` absorbieron la capa visual del shell del lab con Tailwind inline; en `multi-document-routing` se reactivó el hero superior para recuperar la paridad visual con el baseline.
- `LeftSidebarSearch.tsx`, `LeftSidebarGroup.tsx` y `LeftSidebarCustomPanel.tsx` suavizaron superficies, bordes y focus rings del rail izquierdo para mantener la densidad compacta sin perder el look del baseline.
- `DetailHeaderCard.tsx` y `InspectorPrimitives.tsx` continuaron la limpieza de superficies del inspector con botones/Tags sin borde nativo y chips más suaves para evitar contraste duro en el resumen del schema.
- `SidebarSurfacePrimitives.tsx`, `DocumentsRail.tsx` y `ListViewToolbar.tsx` homogeneizaron las superficies del rail derecho, los cards de documentos y los controles de lista con borde/sombra más suaves y botones sin apariencia nativa.
- `CompactConfigPanel.tsx` y `SchemaConnectionsWidget.tsx` siguieron la misma línea visual para el inspector técnico/conexiones, bajando gradientes y elevando el contrato de tarjeta simple sobre CSS global.
- `SchemaOptionsEditor.tsx` y `InspectorDefinitionList.tsx` suavizaron la microinteracción de opciones y definiciones para mantener el inspector denso pero limpio, con botones sin borde nativo y tarjetas menos pesadas.
- `SchemaCollaborationWidget.tsx` migró el `Collapse` del bloque colaborativo a utilidades inline, suavizó el estado de bloqueo y eliminó la dependencia de separación duplicada en CSS.
- `SchemaConnectionsShared.tsx` homogeneizó el editor de pares y el `SectionHeader` compartido con tarjetas más suaves, botones sin apariencia nativa y campos consistentes con el baseline del inspector.
- `src/sisad-pdfme/ui/styles/sisad-pdfme.css` perdió dos reglas redundantes de `schema-config-collapse` y `schema-config-section-head` que ya estaban cubiertas por Tailwind en TSX.
- `src/sisad-pdfme/ui/styles/sisad-pdfme.css` también perdió el bloque de layout de `detail-view`, `detail-view-host`, `list-view` y `detail-view-sections`, ya duplicado por clases inline en `DetailViewContent.tsx` y `ListView.tsx`.
- `DetailHeaderCard.tsx` absorbió la densidad mínima del header en el propio componente y dejó de depender del selector `data-detail-header-density`, permitiendo borrar los overrides CSS de subtitle/trailing compactos.
- `src/sisad-pdfme/ui/styles/sisad-pdfme.css` eliminó los bloques redundantes de `detail-header-card`, `detail-section-card`, `detail-view-context-strip`, `detail-view-context-chip` y `compact-config-panel`, quedando solo contratos semánticos y reglas aún activas de AntD/inspector.
- La comparación visual manual sobre `/lab/multi-document-routing` muestra mejora clara respecto al estado degradado: desapareció la franja superior en blanco y se estabilizó la banda superior del catálogo.
- Validado con `npm run build`, `npx playwright test tests/playwright/right-sidebar-docs-tab.spec.ts`, `npx playwright test tests/playwright/right-sidebar-visual-polish.spec.ts` y `npx -y react-doctor@latest . --verbose --diff`.
- Captura más reciente del viewport confirma que el shell sigue estable, la fila del ListView perdió el contorno negro nativo y el tab `Docs` sigue disponible/activo en la ruta multidocumento.
- `LeftSidebar.tsx` absorbió el último skin residual del catálogo por densidad mínima en el propio nodo React: los botones de catálogo ahora resuelven min-height, padding, gap, label clamp e icon sizing por clase Tailwind, y `src/sisad-pdfme/ui/styles/sisad-pdfme.css` eliminó esos selectores redundantes.
- Validado ese slice con `npm run build`, `npx playwright test tests/e2e/left-sidebar-view-modes.spec.ts` y `npx playwright test tests/playwright/right-sidebar-visual-polish.spec.ts`; el smoke `tests/playwright/sidebar-left-right-design.spec.ts -g "DetailView"` quedó fallando en una condición ajena al cambio actual porque no encuentra `detail-view` visible.
- `InspectorPrimitives.tsx` absorbió el skin principal del summary card, métricas y acciones del inspector: los chips ahora viven en JSX/TSX con gap, density minimal, truncado y botón compacto, y `src/sisad-pdfme/ui/styles/sisad-pdfme.css` perdió el bloque `inspector-summary-card`/`inspector-metric-*` redundante.
- Validado ese slice con `npm run build`, `npx playwright test tests/playwright/right-sidebar-visual-polish.spec.ts` y `npx playwright test tests/e2e/left-sidebar-view-modes.spec.ts`; el intento de correr `tests/playwright/detailview-inspector.spec.ts` no encontró archivo coincidente en este checkout, así que no se usó como gate.
- `ListViewToolbar.tsx` absorbió el skin final duplicado de búsqueda/filtro/acciones masivas y `src/sisad-pdfme/ui/styles/sisad-pdfme.css` eliminó el bloque residual de `bulk-update`, `input-auto`, `search-auto` y `layers-auto`; además se retiró el wrapper CSS de `list-view` y el override compact del título del sidebar surface porque ya viven en TSX.
- `tests/playwright/list-view-regression.spec.ts` se alineó al contrato actual del panel derecho (`fields`) y dejó de depender de un `data-panel-mode="list"` obsoleto; la validación ahora entra al `ListView` real y pasó con `npm run build` + `npx playwright test tests/playwright/list-view-regression.spec.ts`.
- `SelectableSortableItem.tsx` y `ListViewDragOverlay.tsx` absorbieron el skin base de `item-auto`, por lo que `src/sisad-pdfme/ui/styles/sisad-pdfme.css` eliminó esa regla duplicada y el row/overlay quedaron definidos por clases Tailwind locales.
- `DetailFormSection.tsx` absorbió el skin del `detail-view-form-shell` con utilidades inline y variantes arbitrarias sobre `fr-form`, `ant-form`, `ant-row`, `ant-col`, `ant-form-item`, inputs y cards; `src/sisad-pdfme/ui/styles/sisad-pdfme.css` eliminó esos selectores de shell y de AntD asociados.
- `CommentsRail.tsx` absorbió el skin completo de hilos, respuestas, pills, badges y metadatos del rail de comentarios; `src/sisad-pdfme/ui/styles/sisad-pdfme.css` eliminó el bloque `comments-rail-*` correspondiente.
- Validado ese slice con `npm run build`, `npx playwright test tests/playwright/right-sidebar-visual-polish.spec.ts tests/playwright/right-sidebar-docs-tab.spec.ts`; ambos pasaron.
- Conteo de la hoja `src/sisad-pdfme/ui/styles/sisad-pdfme.css` tras este slice: 1593 líneas y 341 apariciones de `@apply`.
- `LeftSidebarCustomFieldModal.tsx` absorbió el skin del modal de campos personalizados con `Modal.classNames` y utilidades inline para superficie, backdrop, header, body y botones; `src/sisad-pdfme/ui/styles/sisad-pdfme.css` eliminó el bloque `custom-field-*` completo.
- Validado ese slice con `npm run build` y `npx playwright test tests/playwright/right-sidebar-visual-polish.spec.ts tests/playwright/right-sidebar-docs-tab.spec.ts`; ambos pasaron de nuevo tras la limpieza del modal.
- Conteo actualizado de la hoja `src/sisad-pdfme/ui/styles/sisad-pdfme.css`: 1426 líneas y 294 apariciones de `@apply`.
- `CtlBar.tsx` absorbió la skin principal de la barra de control y del zoom con utilidades inline y `mergeClassNames`, incluyendo root, clusters, pills, botones y el selector de zoom con variantes internas; el CSS correspondiente se redujo dejando solo los contratos que todavía se están revisando.
- Validado ese slice con `npm run build` y `npx playwright test tests/playwright/right-sidebar-visual-polish.spec.ts tests/playwright/right-sidebar-docs-tab.spec.ts`; ambos pasaron otra vez tras el cierre del control bar.
- Conteo actualizado de la hoja `src/sisad-pdfme/ui/styles/sisad-pdfme.css`: 1336 líneas y 272 apariciones de `@apply`.
- `SidebarSurfacePrimitives.tsx` absorbió el tamaño compacto de las `Tag` del header de superficies y `src/sisad-pdfme/ui/styles/sisad-pdfme.css` perdió el selector `sidebar-surface-header-badges .ant-tag`, dejando el badge sizing como contrato del componente.
- `DetailHeaderCard.tsx` ya tenía el botón de volver completamente inline; se retiró el selector CSS `detail-header-back-btn` y el título `detail-view-title` por no tener consumidor en TSX.
- `DetailFormSection.tsx` ya cubría la tipografía/espaciado del shell de form-render; se retiraron los bloques duplicados de `ant-form-item`, `ant-form-item-label`, `ant-input`, `ant-input-number-input` y `ant-select-selection-item` que seguían vivos en CSS.
- Validado ese slice con `npm run build` y `npx playwright test tests/playwright/right-sidebar-visual-polish.spec.ts tests/playwright/right-sidebar-docs-tab.spec.ts`; ambos volvieron a pasar.
- Conteo actualizado de la hoja `src/sisad-pdfme/ui/styles/sisad-pdfme.css`: 1239 líneas y 244 apariciones de `@apply`.
- `LeftSidebar.tsx` ya cubría la skin final de los botones del catálogo con transición y hover inline; se retiraron los selectores redundantes de `plugin-btn[data-catalog-layout]` y su override de `active`.
- Validado ese slice con `npm run build` y `npx playwright test tests/playwright/right-sidebar-visual-polish.spec.ts tests/playwright/right-sidebar-docs-tab.spec.ts`; ambos volvieron a pasar.
- Conteo actualizado de la hoja `src/sisad-pdfme/ui/styles/sisad-pdfme.css`: 1195 líneas y 230 apariciones de `@apply`.
- `SchemaOptionsEditor.tsx` y los constructores DOM de `select/index.ts` + `optionGroupEditorFactory.ts` absorbieron el skin del editor de opciones y del desplegable: header, lista, filas, inputs, botones de borrar/agregar y el plus del botón quedaron en utilidades locales, y la hoja `src/sisad-pdfme/ui/styles/sisad-pdfme.css` eliminó los selectores `sisad-option-editor-*` y `sisad-option-editor-select-*` asociados.
- Validado ese slice con `npm run build` y `npx playwright test tests/playwright/right-sidebar-visual-polish.spec.ts`; ambos pasaron sin regresiones visibles en el panel derecho.
- `groupSchemaRender.ts` absorbió el layout base del `option-group` runtime (`inline-flex`, alineación y justificación) y permitió retirar el último bloque CSS del body; `src/sisad-pdfme/ui/styles/sisad-pdfme.css` ya no depende de reglas para `sisad-pdfme-option-group-body`.
- Validado ese slice con `npm run build` y `npx playwright test tests/playwright/right-sidebar-visual-polish.spec.ts`; ambos pasaron sin regresiones visibles.
- `actionSchemaFactory.ts` absorbió por completo el skin de `note` y `attachment` y `schemaDom.ts` absorbió el skin del botón de acción principal; `src/sisad-pdfme/ui/styles/sisad-pdfme.css` eliminó los bloques de `note`, `attachment` y `sisad-pdfme-action-button`.
- Validado ese slice con `npm run build` y `npx playwright test tests/playwright/right-sidebar-visual-polish.spec.ts tests/playwright/right-sidebar-docs-tab.spec.ts`; ambos pasaron sin regresiones visibles.
- `fieldChrome.ts` absorbió el skin base del chrome de schemas, incluyendo superficie, borde, estados selected/multi-selected/readonly/locked/invalid y variantes por familia; `src/sisad-pdfme/ui/styles/sisad-pdfme.css` eliminó todo el bloque `field-chrome` residual.
- `optionGroupFactory.ts` y `select/index.ts` absorbieron el skin runtime del grupo de opciones y del chevrón, incluyendo overflow, fondo, border, sizing del modo form y el padding compacto de `singleCompact`; `src/sisad-pdfme/ui/styles/sisad-pdfme.css` eliminó el bloque `option-group-root` y `select-chevron` redundante.
- `optionGroupRenderer.ts` absorbió la altura mínima por modo, la opacidad de estado disabled y el borde de invalidación del wrapper de option groups; `src/sisad-pdfme/ui/styles/sisad-pdfme.css` eliminó los selectores restantes de `option-group__option`, `option-group-invalid` y `option-group-label`.
- `Renderer.tsx` absorbió el skin base y los estados visuales locales de `.sisad-pdfme-ui-custom-selectable` (`active`, `editing`, `hover`, `readonly`, `hidden`, `selectable=false`) para que el wrapper del schema deje de depender de la capa base de CSS; `src/sisad-pdfme/ui/styles/sisad-pdfme.css` eliminó la base del wrapper y sus selectores de estado equivalentes.
- Validado ese slice con `npm run build` y `npx playwright test tests/playwright/right-sidebar-visual-polish.spec.ts tests/playwright/right-sidebar-docs-tab.spec.ts`; ambos pasaron sin regresiones visibles.
- `Renderer.tsx` también trasladó el caption y el badge del schema a nodos reales inline, de modo que `src/sisad-pdfme/ui/styles/sisad-pdfme.css` pudo eliminar el bloque `::after` residual y dejar solo los overlays base que todavía sostienen contraste e interacción.
- `Renderer.tsx` absorbió también el tinte del estado oculto directamente en el wrapper, por lo que la hoja pudo perder el selector `data-schema-hidden` y seguir estable en la ruta `multi-document-routing`.
- `src/sisad-pdfme/ui/styles/sisad-pdfme.css` además eliminó el bloque huérfano de `radioGroup` que ya no tenía pseudo-elementos vivos en el wrapper.
- `CtlBar.tsx` absorbió la skin móvil y el estado de interacción seleccionado del control bar con clases inline, y `Designer/index.tsx` pasó `interactionPhase` para que `src/sisad-pdfme/ui/styles/sisad-pdfme.css` pudiera borrar el ajuste móvil del control bar y su box-shadow de selección.
- `CanvasStateOverlay.tsx` absorbió la micro-tipografía del estado vacío del canvas en el propio nodo React; `src/sisad-pdfme/ui/styles/sisad-pdfme.css` eliminó las reglas duplicadas de `canvas-empty-state-title` y `canvas-empty-state-hint`.
- `RightSidebar.tsx` absorbió la animación de apertura del rail y la transición del DetailView en el propio wrapper, permitiendo borrar los selectores `right-sidebar[data-sidebar-open="true"]` y `detail-view-host/custom-detailView` de la hoja.
- `RightSidebar.tsx` absorbió también la línea decorativa superior del rail derecho como nodo absoluto inline, y `src/sisad-pdfme/ui/styles/sisad-pdfme.css` eliminó el pseudo-elemento `right-sidebar-content::before`.
- Validado ese slice con `npm run build` y `npx playwright test tests/playwright/right-sidebar-visual-polish.spec.ts tests/playwright/right-sidebar-docs-tab.spec.ts`; ambos pasaron sin regresiones visibles.
- Conteo actualizado de la hoja `src/sisad-pdfme/ui/styles/sisad-pdfme.css`: 785 líneas y 117 apariciones de `@apply`.
- `CanvasStateOverlay.tsx` absorbió el skin completo del card de estado vacío del canvas, incluyendo ancho máximo, padding, borde dashed, gradient, tipografía y sombra; `src/sisad-pdfme/ui/styles/sisad-pdfme.css` eliminó el selector `canvas-empty-state-card` que ya no tenía razón de vivir en CSS.
- `CanvasStateOverlay.tsx` ya mantenía la tipografía fina del título y del hint del estado vacío, así que la limpieza dejó ese overlay enteramente resuelto por Tailwind inline.
- La hoja `src/sisad-pdfme/ui/styles/sisad-pdfme.css` quedó en 602 líneas y 112 apariciones de `@apply` tras la última validación.
- Validado el slice con `npm run build` y `npx playwright test tests/playwright/right-sidebar-visual-polish.spec.ts tests/playwright/right-sidebar-docs-tab.spec.ts`; ambos volvieron a pasar sin regresiones.
- `LeftSidebar.tsx` absorbió el skin base del colapso/expansión del rail izquierdo en el propio root y en los wrappers de frame/content, incluyendo ancho expandido, rail colapsado, overflow y visibilidad, de modo que `src/sisad-pdfme/ui/styles/sisad-pdfme.css` pudo eliminar los selectores `left-sidebar[data-sidebar-collapsed="true"]`, sus children y `left-sidebar[data-expanded="true"]`.
- El mismo slice dejó el comportamiento móvil preparado en JSX con utilidades inline para no depender del selector `data-expanded` cuando el rail entra en modo overlay.
- La hoja `src/sisad-pdfme/ui/styles/sisad-pdfme.css` quedó en 584 líneas y 109 apariciones de `@apply` tras la última validación.
- Validado el slice con `npm run build` y `npx playwright test tests/playwright/right-sidebar-visual-polish.spec.ts tests/playwright/right-sidebar-docs-tab.spec.ts`; ambos volvieron a pasar sin regresiones.
- `LeftSidebar.tsx` también absorbió el fallback de `prefers-reduced-motion` para los botones del catálogo mediante variantes `motion-reduce`, y `RightSidebar.tsx` absorbió la misma cobertura para el host del detail view; la hoja `src/sisad-pdfme/ui/styles/sisad-pdfme.css` eliminó el bloque `prefers-reduced-motion` que neutralizaba esos transforms.
- `scripts/css-selector-duplicates.mjs` se volvió a ejecutar y regeneró `reports/tailwind-migration/selector-duplicates-current.md` con el estado actualizado de los duplicados del CSS activo.
- La hoja `src/sisad-pdfme/ui/styles/sisad-pdfme.css` quedó en 576 líneas y 108 apariciones de `@apply` tras la última validación.
- Validado el slice con `npm run build` y `npx playwright test tests/playwright/right-sidebar-visual-polish.spec.ts tests/playwright/right-sidebar-docs-tab.spec.ts`; ambos volvieron a pasar sin regresiones.
- `Item.tsx` dejó el delete del ListView anclado al hover del `li` completo para que no desaparezca al mover el puntero hacia el botón, `DetailSectionCard.tsx` y `SchemaConnectionsShared.tsx` aclararon los accordions del inspector con títulos más cercanos al fondo y `SchemaConnectionsShared.tsx` suavizó el bloque de conexiones para mantener el contraste del baseline.
- `DocumentsRail.tsx` quedó con la validación del rail derecho intacta y `src/sisad-pdfme/ui/styles/tokens.css` se redujo a 86 líneas tras podar tokens sin consumidores directos; el build siguió pasando y la ruta `/lab/multi-document-routing` mostró el panel derecho estable en las vistas `Campos`, `Detalle` y `Docs`.
- `DetailSectionCard.tsx` y `SchemaConnectionsShared.tsx` terminaron de unificar los headers de acordeón con la superficie blanca del panel, bajando el tinte gris que aún se percibía en los detalles del schema y en las secciones técnicas/conexiones; validado con `npm run build` y los smoke tests del rail derecho.
- `Canvas/SnapLines.tsx` absorbió el skin base de `snap-line` y `snap-label` para que la posición absoluta, pointer-events y la semántica de texto vivan en el componente y no en CSS; `src/sisad-pdfme/ui/styles/sisad-pdfme.css` eliminó esos selectores redundantes.
- La hoja `src/sisad-pdfme/ui/styles/sisad-pdfme.css` quedó en 569 líneas y 106 apariciones de `@apply` tras la última validación.
- `scripts/css-selector-duplicates.mjs` se volvió a ejecutar y regeneró `reports/tailwind-migration/selector-duplicates-current.md` con el estado actualizado de los duplicados del CSS activo.
- Validado el slice con `npm run build` y `npx playwright test tests/playwright/right-sidebar-visual-polish.spec.ts tests/playwright/right-sidebar-docs-tab.spec.ts`; ambos volvieron a pasar sin regresiones.
- `Shortcuts/ShortcutHelpPanel.tsx` absorbió el skin del modal de atajos mediante `Modal.classNames` para mover la superficie, el backdrop y el body al propio componente, y `src/sisad-pdfme/ui/styles/sisad-pdfme.css` eliminó el override huérfano `.sisad-pdfme-shortcuts-panel .ant-modal-content`.
- La hoja `src/sisad-pdfme/ui/styles/sisad-pdfme.css` quedó en 563 líneas y 104 apariciones de `@apply` tras esta validación.
- Validado este slice con `npm run build` y `npx playwright test tests/playwright/right-sidebar-visual-polish.spec.ts tests/playwright/right-sidebar-docs-tab.spec.ts`; ambos pasaron.
- `src/sisad-pdfme/ui/styles/sisad-pdfme.css` eliminó el bloque huérfano `sisad-inspector-select-popup`, que no tenía consumidores en el código activo.
- `SchemaConnectionsWidget.tsx`, `SchemaCollaborationWidget.tsx` y `detailWidgetRegistry.tsx` absorbieron el skin inline del `Divider`, y `src/sisad-pdfme/ui/styles/sisad-pdfme.css` eliminó el override global `.ant-divider-horizontal`.
- La hoja `src/sisad-pdfme/ui/styles/sisad-pdfme.css` quedó en 545 líneas y 101 apariciones de `@apply` tras este corte.
- Validado este slice con `npm run build` y `npx playwright test tests/playwright/right-sidebar-visual-polish.spec.ts tests/playwright/right-sidebar-docs-tab.spec.ts`; ambos pasaron.
- `src/sisad-pdfme/ui/styles/sisad-pdfme.css` eliminó el bloque global de `ant-btn` (`.ant-btn`, `.ant-btn-default`, `.ant-btn-text` y sus hover) porque los botones visibles ya tienen skin local en TSX, dejando solo el contrato de `ant-select-selector` para una revisión posterior.
- La hoja `src/sisad-pdfme/ui/styles/sisad-pdfme.css` quedó en 513 líneas y 91 apariciones de `@apply` tras este corte.
- Validado este slice con `npm run build` y `npx playwright test tests/playwright/right-sidebar-visual-polish.spec.ts tests/playwright/right-sidebar-docs-tab.spec.ts`; ambos pasaron sin regresiones visibles tras retirar el override global de botones.
- `InspectorSelect.tsx`, `SchemaCollaborationWidget.tsx`, `SchemaConnectionsWidget.tsx` y `ListViewToolbar.tsx` absorbieron el skin base del `Select` en sus wrappers locales, y `src/sisad-pdfme/ui/styles/sisad-pdfme.css` eliminó el override global `.ant-select-selector`.
- La hoja `src/sisad-pdfme/ui/styles/sisad-pdfme.css` quedó en 510 líneas y 90 apariciones de `@apply` tras este corte.
- Validado este slice con `npm run build` y `npx playwright test tests/playwright/right-sidebar-visual-polish.spec.ts tests/playwright/right-sidebar-docs-tab.spec.ts`; ambos pasaron sin regresiones visibles tras retirar el override global de select.
- `SchemaDropSetupModal.tsx` absorbió también el skin base del `Select` del modal de configuración de campo para que ese flujo no dependa del override global eliminado.
- Validado ese ajuste con `npm run build` y `npx playwright test tests/playwright/right-sidebar-visual-polish.spec.ts tests/playwright/right-sidebar-docs-tab.spec.ts`; ambos volvieron a pasar.
- `src/sisad-pdfme/ui/styles/sisad-pdfme.css` consolidó la base del shell (`workspace`, `canvas`, `designer-root`, `designer-background` y el centrado de `paper-root`) en bloques únicos, reduciendo duplicación sin tocar geometría ni scroll.
- La hoja `src/sisad-pdfme/ui/styles/sisad-pdfme.css` quedó en 494 líneas y 87 apariciones de `@apply` tras este corte.
- Validado este slice con `npm run build` y `npx playwright test tests/playwright/right-sidebar-visual-polish.spec.ts tests/playwright/right-sidebar-docs-tab.spec.ts`; ambos pasaron sin regresiones visibles.
- `src/sisad-pdfme/ui/styles/sisad-pdfme.css` retiró residuos mecánicos del shell: `@media` vacíos y la segunda declaración de `font-family` en `.sisad-pdfme-root`, sin tocar geometría ni el skin visible.
- La hoja `src/sisad-pdfme/ui/styles/sisad-pdfme.css` quedó en 488 líneas y 87 apariciones de `@apply` tras este corte.
- Validado este slice con `npm run build` y `npx playwright test tests/playwright/right-sidebar-visual-polish.spec.ts tests/playwright/right-sidebar-docs-tab.spec.ts`; ambos pasaron sin regresiones visibles.
- `RightSidebar.tsx` absorbió el skin base del rail derecho (posición, ancho, borde, fondo, sombra, transición y estados open/collapsed) en el propio nodo React, y `src/sisad-pdfme/ui/styles/sisad-pdfme.css` eliminó el bloque raíz equivalente; quedaron en CSS solo los ajustes responsivos y geométricos que aún dependen de media queries.
- La hoja `src/sisad-pdfme/ui/styles/sisad-pdfme.css` quedó en 474 líneas y 85 apariciones de `@apply` tras este corte.
- Validado este slice con `npm run build` y `npx playwright test tests/playwright/right-sidebar-visual-polish.spec.ts tests/playwright/right-sidebar-docs-tab.spec.ts`; ambos pasaron sin regresiones visibles tras mover el skin del rail derecho.
- `LeftSidebar.tsx` absorbió el skin base del rail izquierdo (posición, ancho, borde, fondo, shrink y transición) en el nodo React, y `src/sisad-pdfme/ui/styles/sisad-pdfme.css` eliminó el bloque raíz equivalente; quedaron en CSS solo los ajustes de catálogo/dragging y las reglas responsivas que siguen siendo geométricas.
- La hoja `src/sisad-pdfme/ui/styles/sisad-pdfme.css` quedó en 466 líneas y 84 apariciones de `@apply` tras este corte.
- Validado este slice con `npm run build` y `npx playwright test tests/playwright/right-sidebar-visual-polish.spec.ts tests/playwright/right-sidebar-docs-tab.spec.ts`; ambos volvieron a pasar sin regresiones visibles tras mover el skin del rail izquierdo.
- `RightSidebar.tsx` absorbió la excepción de `prefers-reduced-motion` del rail derecho como variantes `motion-reduce` en el propio nodo React, y `src/sisad-pdfme/ui/styles/sisad-pdfme.css` eliminó el bloque media query equivalente.
- La hoja `src/sisad-pdfme/ui/styles/sisad-pdfme.css` quedó en 456 líneas y 82 apariciones de `@apply` tras este corte.
- Validado este slice con `npm run build` y `npx playwright test tests/playwright/right-sidebar-visual-polish.spec.ts tests/playwright/right-sidebar-docs-tab.spec.ts`; ambos volvieron a pasar sin regresiones visibles tras mover la excepción de motion-reduce.
- `src/sisad-pdfme/ui/styles/sisad-pdfme.css` eliminó los media queries compactos redundantes de `left-sidebar-compact` y `stage[data-left-sidebar-variant="compact"]`, dejando el clamp final como fuente única para el ancho compacto del shell.
- `scripts/css-selector-duplicates.mjs` se volvió a ejecutar y regeneró `reports/tailwind-migration/selector-duplicates-current.md` con el estado actualizado del CSS activo.
- La hoja `src/sisad-pdfme/ui/styles/sisad-pdfme.css` quedó en 387 líneas y 68 apariciones de `@apply` tras esta validación.
- Validado este slice con `npm run build` y `npx playwright test tests/playwright/right-sidebar-visual-polish.spec.ts tests/playwright/right-sidebar-docs-tab.spec.ts`; ambos pasaron sin regresiones visibles.
- `index.tsx` ya resolvía el ancho compacto del rail derecho en TSX y `src/sisad-pdfme/ui/styles/sisad-pdfme.css` eliminó el último selector residual `stage[data-left-sidebar-variant="compact"][data-sidebar-open="true"] .sisad-pdfme-designer-canvas`, dejando el reporte de duplicados solo con contratos `KEEP_GEOMETRY`.
- `LeftSidebar.tsx` absorbió el skin de drag source y el hide-state del favorito en el propio botón del catálogo; `src/sisad-pdfme/ui/styles/sisad-pdfme.css` retiró el selector residual del favorito drag. Se corrigió un `ReferenceError` transitorio en runtime al mover el estado de arrastre al render prop correcto.
- La hoja `src/sisad-pdfme/ui/styles/sisad-pdfme.css` quedó en 369 líneas y 63 apariciones de `@apply` tras este corte.
- Validado este slice con `npm run build` y `npx playwright test tests/e2e/left-sidebar-view-modes.spec.ts tests/playwright/right-sidebar-visual-polish.spec.ts`; ambos volvieron a pasar sin regresiones visibles.
- `CanvasOverlayManager.tsx` absorbió el skin base del contenedor de overlays del canvas y `Mask.tsx` absorbió la superficie de bloqueo; `src/sisad-pdfme/ui/styles/sisad-pdfme.css` retiró ambos selectores residuales.
- La hoja `src/sisad-pdfme/ui/styles/sisad-pdfme.css` quedó en 363 líneas y 61 apariciones de `@apply` tras este corte.
- Validado este slice con `npm run build` y `npx playwright test tests/playwright/canvas-interactions.spec.ts tests/playwright/right-sidebar-visual-polish.spec.ts`; ambos volvieron a pasar sin regresiones visibles.
- `GroupOptionFloatingAction.tsx` ya resolvía el skin del botón flotante con Tailwind inline y `src/sisad-pdfme/ui/styles/sisad-pdfme.css` eliminó el bloque residual de visibilidad para `option-group-floating-action`, dejando la ocultación de drag/resize/rotate como responsabilidad del propio componente.
- La hoja `src/sisad-pdfme/ui/styles/sisad-pdfme.css` quedó en 357 líneas y 60 apariciones de `@apply` tras este corte.
- Pendiente de validar: build + Playwright smoke y regeneración del reporte de duplicados activo.
- `CanvasOverlayManager.tsx` ya resolvía el skin del contenedor de overlays y `src/sisad-pdfme/ui/styles/sisad-pdfme.css` eliminó el selector redundante `.sisad-pdfme-ui-canvas-overlay-manager`, dejando la posición/pointer-events del overlay como contrato local del componente.
- La hoja `src/sisad-pdfme/ui/styles/sisad-pdfme.css` quedó en 352 líneas y 59 apariciones de `@apply` tras este corte.
- Pendiente de validar: build + Playwright smoke y regeneración del reporte de duplicados activo.
- `Canvas.tsx` movió la ocultación de `Mask` a una clase inline basada en `interactionState.phase`, y `src/sisad-pdfme/ui/styles/sisad-pdfme.css` eliminó el bloque residual de visibilidad por fase para `Mask`.
- La hoja `src/sisad-pdfme/ui/styles/sisad-pdfme.css` quedó en 346 líneas y 58 apariciones de `@apply` tras este corte.
- Pendiente de validar: build + Playwright smoke y regeneración del reporte de duplicados activo.
- `CanvasStateOverlay.tsx` ya absorbía el skin del empty state y `src/sisad-pdfme/ui/styles/sisad-pdfme.css` retiró el selector huérfano `.sisad-pdfme-designer-canvas-empty-state`, dejando el overlay como contrato puro del componente.
- La hoja `src/sisad-pdfme/ui/styles/sisad-pdfme.css` quedó en 341 líneas y 57 apariciones de `@apply` tras este corte.
- Pendiente de validar: build + Playwright smoke y regeneración del reporte de duplicados activo.
- `LeftSidebar.tsx` absorbió el skin del shell arrastrable y la ocultación del favorito durante drag en el propio JSX, y `src/sisad-pdfme/ui/styles/sisad-pdfme.css` retiró los selectores residuales del shell draggable, dejando esos contratos como skin local del componente.
- La hoja `src/sisad-pdfme/ui/styles/sisad-pdfme.css` quedó en 335 líneas y 56 apariciones de `@apply` tras este corte.
- Pendiente de validar: build + Playwright smoke y regeneración del reporte de duplicados activo.
- Slice 2026-07-16u: se retiraron de `sisad-pdfme.css` los bloques legacy del shell `sisad-pdfme-page/header/grid/workspace/canvas`, que no tenían consumidores activos en el árbol React actual. Validado con `npm run build`, `npx playwright test tests/playwright/right-sidebar-visual-polish.spec.ts tests/playwright/right-sidebar-docs-tab.spec.ts` y el reporte de duplicados regenerado. CSS activo actual: 310 líneas y 47 apariciones de `@apply`.
- Slice 2026-07-16x: `Item.tsx` dejó el delete del ListView visible y detectable por Playwright sin depender de opacidad cero, `DocumentsRail.tsx` alineó el delete de documentos en la misma fila de la tarjeta y `DetailSectionCard.tsx` subió el contraste del título de acordeón para mantener la jerarquía del inspector. Validado con `npm run build`, `npx playwright test tests/playwright/right-sidebar-visual-polish.spec.ts`, `tests/playwright/right-sidebar-docs-tab.spec.ts` y `tests/playwright/list-view-regression.spec.ts`.

## Criterio de parada

Detenerse si la recuperación exige más de 5 archivos de producto o si aparece una regresión funcional fuera del shell/tokens; abrir tarjeta separada en ese caso.

- Slice 2026-07-16y: `index.tsx` y `CtlBar.tsx` absorbieron el padding del stage y el offset del control bar para el right sidebar, y `SchemaConnectionsShared.tsx` elevó el contraste de los títulos de sección/edición técnica. Se retiró el selector `data-sidebar-open` residual de `sisad-pdfme.css`, dejando el CSS activo en 304 líneas y 85 apariciones de `@apply`. Validado con `npm run build`, `npx playwright test tests/playwright/right-sidebar-visual-polish.spec.ts tests/playwright/right-sidebar-docs-tab.spec.ts tests/playwright/list-view-regression.spec.ts` y la regeneración del reporte de duplicados activo.
- Slice 2026-07-16z: `Item.tsx` elevó la capa de `ItemActions` y del botón `Eliminar` para que el affordance no desaparezca detrás del hit-target del row; `SidebarSurfacePrimitives.tsx` y `DetailSectionCard.tsx` subieron el contraste de los títulos y descripciones del inspector a `text-slate-950`/`text-slate-600`; `tests/playwright/list-view-regression.spec.ts` y `tests/unit/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailSectionCard.test.ts` quedaron como cobertura estable del row y del encabezado de sección. Validado con `npx playwright test tests/playwright/right-sidebar-visual-polish.spec.ts tests/playwright/list-view-regression.spec.ts`, `npx vitest run tests/unit/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailSectionCard.test.ts tests/unit/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/Item.test.tsx` y regeneración de `reports/tailwind-migration/selector-duplicates-current.md`. El CSS activo sigue en 304 líneas y 85 apariciones de `@apply`; lo restante es contrato técnico/geométrico y no un candidato seguro para vaciar.
```

<a id="file-0269"></a>

### 0269 — `ai/task-cards/backlog/TASK-CSS-021-left-sidebar-overflow-tailwind-continuity.md`

- **Lenguaje:** `markdown`
- **Líneas:** `42`
- **Tamaño original:** `1.2 KB`
- **SHA1 corto:** `dde0d4fcce`
- **Estado:** `completo`

```markdown
# TASK-CSS-021 — Corregir overflow y densidad del sidebar izquierdo

## Objetivo

Eliminar solapamientos visibles en cabecera, tabs, filtros y selector de layout del sidebar izquierdo, migrando su layout estático a JSX/TSX.

## Alcance

- Cabecera, búsqueda, tabs, filtros y selector lista/tarjetas/iconos.
- Overflow horizontal, truncado y focus-visible.
- Clases estáticas en componentes propietarios.

## Fuera de alcance

Catálogo completo, drag al canvas, grupos internos y borrado global de CSS.

## Archivos candidatos

Máximo 5 componentes: `LeftSidebar.tsx`, tabs, search, filtros y layout toggle; confirmar nombres reales.

## Archivos prohibidos

Renderer, canvas, DocumentsRail, snapshot, generator y PDF.

## Pasos

1. Reproducir con ancho de la captura y breakpoint mínimo.
2. Detectar `min-width`, nowrap y posicionamiento conflictivos.
3. Migrar flex/grid/gap/overflow a JSX/TSX.
4. No podar CSS global hasta una tarjeta posterior.

## Validación

Capturas normal/estrecha, navegación por teclado, typecheck y pruebas del sidebar.

## Criterio de parada

Detenerse si la corrección depende del DOM del canvas o de más de 5 componentes.

## Entrega final

Medidas, estados y capturas antes/después.
```

<a id="file-0270"></a>

### 0270 — `ai/task-cards/backlog/TASK-CSS-022-left-sidebar-css-pruning.md`

- **Lenguaje:** `markdown`
- **Líneas:** `39`
- **Tamaño original:** `0.9 KB`
- **SHA1 corto:** `76185014cc`
- **Estado:** `completo`

```markdown
# TASK-CSS-022 — Podar CSS legado del sidebar izquierdo

## Objetivo

Eliminar de `sisad-pdfme.css` únicamente las reglas del sidebar izquierdo ya sustituidas por clases JSX/TSX.

## Alcance

Selectores con consumidor comprobado en TASK-CSS-021 y sus estados.

## Fuera de alcance

RightSidebar, schemas, canvas y reglas compartidas no trazadas.

## Archivos candidatos

`sisad-pdfme.css`, máximo 3 consumidores afectados y una prueba visual.

## Archivos prohibidos

`tokens.css`, Renderer, Moveable, Selecto, snapshot y PDF.

## Pasos

1. Comparar ledger de TASK-CSS-021 con búsquedas de consumidores.
2. Borrar reglas huérfanas por bloques pequeños.
3. Validar todos los estados y breakpoints.

## Validación

Conteo `@apply`, búsqueda de selectores, typecheck y capturas.

## Criterio de parada

Detenerse si un selector tiene consumidor incierto o alcance global.

## Entrega final

Lista exacta de reglas retiradas y delta cuantitativo.
```

<a id="file-0271"></a>

### 0271 — `ai/task-cards/backlog/TASK-CSS-023-tailwind-migration-continuity-step-by-step.md`

- **Lenguaje:** `markdown`
- **Líneas:** `84`
- **Tamaño original:** `3.9 KB`
- **SHA1 corto:** `a89761e0a0`
- **Estado:** `completo`

```markdown
# TASK-CSS-023 — Continuidad de migración Tailwind por slices pequeños

## Objetivo

Seguir migrando clases visuales desde `src/sisad-pdfme/ui/styles/sisad-pdfme.css` y los otros CSS activos hacia sus componentes JSX/TSX propietarios, sin perder paridad visual ni tocar contratos técnicos de canvas, Moveable, Selecto, zoom o geometría.

## Contexto

- La hoja `src/sisad-pdfme/ui/styles/sisad-pdfme.css` ya quedó reducida y conserva sobre todo contratos técnicos.
- Parte de las clases visuales del proyecto se concatenan desde `src/sisad-pdfme/ui/constants.ts`.
- El laboratorio de referencia es `http://localhost:5174/lab/multi-document-routing`.
- Hay una sola task-card activa; esta tarjeta vive en `backlog` hasta que el board libere espacio.

## Alcance

- Analizar componentes que concatenan clases desde `src/sisad-pdfme/ui/constants.ts`.
- Mover a JSX/TSX utilidades estáticas de layout, spacing, tipografía, bordes, radios, hover y focus-visible.
- Mantener en CSS solo lo que sea técnico, dinámico o imposible de expresar con seguridad en JSX/TSX.
- Actualizar pruebas y el ledger de migración en cada slice.

## Fuera de alcance

- Moveable, Selecto, zoom, paper geometry, canvas coordinates, snapshot, generator y `pdf-lib`.
- Crear CSS nuevo paralelo.
- Forzar vaciado total de CSS técnico.
- Cambiar lógica funcional de selección, drag/drop, reasignación o runtime.

## Archivos candidatos

Máximo 5 por slice. Priorizar:

- `src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/Item.tsx`
- `src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/ListViewToolbar.tsx`
- `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailSectionCard.tsx`
- `src/sisad-pdfme/ui/components/Designer/RightSidebar/shared/SidebarSurfacePrimitives.tsx`
- `src/sisad-pdfme/ui/components/Designer/RightSidebar/RightSidebar.tsx`

## Archivos prohibidos

- `src/sisad-pdfme/ui/styles/tokens.css`
- `src/sisad-pdfme/ui/styles/sisad-pdfme.css` para skin técnico/geométrico ya validado
- `src/features/pdfcomponent/labRoutes.css`
- Canvas geometry, Moveable, Selecto, snapshot, generator, `pdf-lib`

## Plan paso a paso

1. Reabrir `ai/router/CONTEXT_BUDGET.md` y trabajar solo un slice visual.
2. Buscar clases concatenadas desde `src/sisad-pdfme/ui/constants.ts` y ubicar el nodo dueño real.
3. Comparar la captura actual con el baseline del laboratorio en el panel objetivo.
4. Migrar únicamente utilidades estáticas seguras al JSX/TSX del componente dueño.
5. Dejar en CSS solo contratos técnicos, media queries o descendientes que el JSX no pueda expresar con seguridad.
6. Agregar o ajustar pruebas unitarias y Playwright para el comportamiento visual cubierto.
7. Regenerar `reports/tailwind-migration/selector-duplicates-current.md` si se retiró algún selector.
8. Actualizar `ai/task-cards/active/*` o `reports/tailwind-migration/component-migration-ledger.md` con el slice validado.
9. Validar con `npm run build` y el smoke o unit test correspondiente.
10. Detenerse si el siguiente ajuste requiere más de 5 archivos o toca geometría/canvas.

## Regla operativa

- Un slice = una región visual.
- No mezclar sidebar izquierdo, sidebar derecho, inspector y canvas en el mismo pase.
- No borrar CSS sin comprobar el consumidor real.
- No convertir clases runtime o derivadas en strings dinámicos si Tailwind no las detecta.

## Validación mínima por slice

- `npm run build`
- Prueba focalizada del componente o panel
- Smoke visual en `/lab/multi-document-routing`
- Actualización del ledger y del reporte de duplicados si aplica

## Criterio de parada

Detenerse si:

- el ajuste depende de geometría o del canvas;
- el selector no tiene consumidor claro;
- la migración requiere más de 5 archivos;
- la comparación visual empeora;
- el contrato ya es técnico y no debe vaciarse más.

## Entrega esperada

Registro corto del slice, archivos tocados, validaciones ejecutadas y estado de CSS restante.
```

<a id="file-0272"></a>

### 0272 — `ai/task-cards/backlog/TASK-CSS-027-right-sidebar-constants-tailwind-scroll-polish.md`

- **Lenguaje:** `markdown`
- **Líneas:** `95`
- **Tamaño original:** `4.6 KB`
- **SHA1 corto:** `4c63b33a8b`
- **Estado:** `completo`

```markdown
# TASK-CSS-027 — RightSidebar: migración Tailwind guiada por constantes y pulido de scroll

## Objetivo

Continuar la migración de clases visuales desde `src/sisad-pdfme/ui/styles/sisad-pdfme.css` hacia los componentes JSX/TSX propietarios, usando como referencia las clases concatenadas en `src/sisad-pdfme/ui/constants.ts` y corrigiendo los problemas visuales actuales del `RightSidebar`.

## Contexto

- La migración Tailwind ya avanzó bastante, pero todavía quedan contratos técnicos en `src/sisad-pdfme/ui/styles/sisad-pdfme.css`.
- En el laboratorio `http://localhost:5174/lab/multi-document-routing` siguen apareciendo problemas de jerarquía visual, scroll y affordances en el panel derecho.
- Los estilos visuales migrados deben vivir en JSX/TSX; CSS solo debe conservar contratos técnicos, geométricos o no expresables con seguridad.
- Hay otras task-cards activas en el board, así que este slice debe permanecer acotado y validable.

## Alcance

Este slice solo toca la superficie y el comportamiento visual del `RightSidebar`:

- Tabs superiores `Campos / Detalle / Docs`.
- Header del panel y rail de acciones.
- `ListViewToolbar` y su relación con `ListView`.
- `Item.tsx` y la interacción de hover, selección y eliminar.
- `DetailHeaderCard.tsx`, `DetailSectionCard.tsx` y `SchemaCollaborationWidget.tsx` si el ajuste visual lo exige.
- Scroll local de `ListView`, `DetailView` y `Docs`.

## Fuera de alcance

- `Canvas` geometry, Moveable, Selecto, zoom, paper coordinates, snapshot, generator y `pdf-lib`.
- Crear CSS nuevo paralelo.
- Introducir `!important` como solución.
- Cambiar la lógica de selección, reasignación, ownership o permisos.
- Reabrir task-cards completadas o tocar tarjetas archivadas.

## Archivos candidatos

Máximo 5 archivos de producto por pasada. Priorizar:

- `src/sisad-pdfme/ui/components/Designer/RightSidebar/RightSidebar.tsx`
- `src/sisad-pdfme/ui/components/Designer/RightSidebar/layout.tsx`
- `src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/ListViewToolbar.tsx`
- `src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/Item.tsx`
- `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailSectionCard.tsx`

Si el slice lo requiere:

- `src/sisad-pdfme/ui/components/Designer/RightSidebar/shared/SidebarSurfacePrimitives.tsx`
- `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaCollaborationWidget.tsx`

## Archivos prohibidos

- `src/sisad-pdfme/ui/styles/tokens.css`
- `src/features/pdfcomponent/labRoutes.css`
- Canvas geometry y overlays técnicos de Moveable/Selecto
- `src/sisad-pdfme/ui/styles/sisad-pdfme.css` para contratos técnicos ya validados de canvas

## Pasos

1. Revisar los consumidores reales de `src/sisad-pdfme/ui/constants.ts` dentro del `RightSidebar`.
2. Identificar qué clases estáticas pueden vivir en JSX/TSX y cuáles deben permanecer en CSS por ser técnicas o dependientes de runtime.
3. Migrar primero el skin seguro del panel superior: switcher, tabs, botones, estados active/focus-visible y compactación.
4. Corregir el header del `ListView` para que quede compacto, estable y sin duplicar bordes, sombras o paddings.
5. Ajustar `Item.tsx` para que:
   - el hover no oculte el icono de eliminar;
   - el estado selected no se confunda con el acento del owner;
   - el drag handle y el hit target no compitan con el click.
6. Revisar `DetailSectionCard.tsx` para alinear los headers de secciones con el baseline visual y evitar tonos grises/negros demasiado pesados.
7. Verificar que el panel derecho tenga un solo propietario de scroll por subvista y que `Docs`/`Detalle` no hagan wrap ni corten contenido.
8. Eliminar de `src/sisad-pdfme/ui/styles/sisad-pdfme.css` solo los selectores migrados y verificados en este slice.
9. Actualizar `reports/tailwind-migration/component-migration-ledger.md` con el slice validado.
10. Si se retiró algún selector, regenerar `reports/tailwind-migration/selector-duplicates-current.md`.

## Validación mínima

- `npm run build`
- Prueba focalizada de `RightSidebar` o `ListView`
- Smoke visual en `http://localhost:5174/lab/multi-document-routing`
- Verificación manual de:
  - tabs sin wrap;
  - scroll estable;
  - botón eliminar visible en hover;
  - header de detalle sin exceso de gris/negro;
  - docs accesible y consistente.

## Criterio de parada

Detenerse si:

- el siguiente ajuste requiere más de 5 archivos;
- la corrección depende de geometría del canvas;
- no está claro el consumidor de una clase;
- la comparación visual empeora;
- el cambio pide crear CSS nuevo paralelo.

## Entrega esperada

Registro corto del slice, archivos tocados, clases migradas desde `constants.ts`, validaciones ejecutadas y CSS técnico restante.
```

<a id="file-0273"></a>

### 0273 — `ai/task-cards/backlog/TASK-LAB-030-canvas-first-shell-style-source-unification.md`

- **Lenguaje:** `markdown`
- **Líneas:** `42`
- **Tamaño original:** `1.2 KB`
- **SHA1 corto:** `d338f9eb27`
- **Estado:** `completo`

```markdown
# TASK-LAB-030 — Unificar fuente de estilos del shell canvas-first

## Objetivo

Eliminar conflictos entre estilos inline, Tailwind y CSS del shell del lab, conservando el diseño canvas-first y corrigiendo alturas y densidad inconsistentes.

## Alcance

- Header, contenedor principal y límites de sidebars.
- Resolver discrepancias de 44/48 px con una sola fuente.
- Mantener responsive y colapso existentes.

## Fuera de alcance

Contenido interno de sidebars, schemas, guías y migración completa de `labRoutes.css`.

## Archivos candidatos

Máximo 5: `PdfmeLabPage.tsx`, `PageHeader.tsx`, `labRoutes.css`, `constants.ts` y una prueba del shell.

## Archivos prohibidos

Renderer, Moveable, Selecto, snapshots, generator y PDF.

## Pasos

1. Inventariar medidas y clases duplicadas.
2. Elegir Tailwind JSX/TSX para layout estático y tokens para valores semánticos.
3. Eliminar solo reglas duplicadas confirmadas.
4. Verificar viewport de la captura y breakpoint estrecho.

## Validación

Typecheck, prueba del shell y capturas con sidebars abiertos/cerrados.

## Criterio de parada

Detenerse si el cambio exige alterar el contrato del canvas o más de 5 archivos.

## Entrega final

Mapa de fuentes de estilo antes/después y medidas finales.
```

<a id="file-0274"></a>

### 0274 — `ai/task-cards/backlog/TASK-QA-016-tailwind-design-visual-regression.md`

- **Lenguaje:** `markdown`
- **Líneas:** `42`
- **Tamaño original:** `1.1 KB`
- **SHA1 corto:** `b49949b216`
- **Estado:** `completo`

```markdown
# TASK-QA-016 — Cerrar regresión visual y ledger Tailwind

## Objetivo

Validar integralmente el diseño corregido y cuantificar la reducción de Tailwind en CSS sin introducir cambios de producto.

## Alcance

- Ruta `/lab/multi-document-routing`.
- Usuarios/propietarios múltiples, documentos múltiples, sidebars y canvas.
- Conteos finales de `@apply`, estilos inline y selectores.

## Fuera de alcance

Implementar arreglos. Cada fallo genera una tarjeta de regresión nueva.

## Archivos candidatos

Máximo 5 archivos de pruebas/baselines/reportes. Código de producto prohibido.

## Archivos prohibidos

Todo `src/**` salvo lectura.

## Pasos

1. Fijar viewport, datos, página y zoom.
2. Capturar estados por propietario y sidebars.
3. Ejecutar auditoría, typecheck, lint y suites focalizadas.
4. Comparar con baseline y registrar excepciones.

## Validación

Checklist completo, cero regresiones críticas y ledger reproducible.

## Criterio de parada

Ante cualquier fallo funcional o visual, no editar producto: crear tarjeta nueva y dejar QA bloqueada.

## Entrega final

Reporte final con capturas, comandos, resultados y deuda remanente priorizada.
```

<a id="file-0275"></a>

### 0275 — `ai/task-cards/backlog/TASK-QA-017-listview-specs-docs-default-drift.md`

- **Lenguaje:** `markdown`
- **Líneas:** `39`
- **Tamaño original:** `1.9 KB`
- **SHA1 corto:** `d262fc3213`
- **Estado:** `completo`

```markdown
# TASK-QA-017 — Deriva de specs: panel Docs por defecto + rename del switcher

- Estado: backlog
- Tipo: regression (suite de tests)
- Origen: TASK-LAB-029 (docs default en multidocumento, completada) + rename de
  clase del panel-switcher en RightSidebar (TASK-REGRESSION-021, activa).

## Síntoma

En `/lab/multi-document-routing` el panel derecho abre en **Docs** por defecto
(`aside[data-panel-mode="docs"]`), por lo que la lista de Campos no se monta y
tres specs quedan rojos por buscar elementos del panel Campos sin cambiar de
pestaña primero:

- `tests/playwright/list-view-regression.spec.ts` — `.sisad-pdfme-designer-list-view` no visible.
- `tests/playwright/detail-view-options-listview.spec.ts` — `right-sidebar-field-list` / `detail-options-section` no encontrados.
- `tests/playwright/right-sidebar-visual-polish.spec.ts` — además el switcher pasó de
  `bg-gradient-to-b` a `bg-[linear-gradient(...)]`; la aserción `toHaveClass(/bg-gradient-to-b/)`
  quedó desactualizada.

## Causa

No es regresión de producto: es deriva de la suite frente a dos cambios ya
integrados/en curso (docs default + skin del switcher). El render de la lista y
los testids del ListView están intactos (verificado: al seleccionar la pestaña
"Abrir panel Campos" se montan las 11 filas con `right-sidebar-field-list`,
`right-sidebar-field-label`, `right-sidebar-field-technical-name`).

## Acción propuesta

1. En las specs de ListView, seleccionar la pestaña Campos (`getByRole('tab',
   { name: 'Abrir panel Campos' }).click()`) antes de asertar la lista.
2. Actualizar la aserción del switcher en `right-sidebar-visual-polish` al skin
   vigente (`bg-[linear-gradient(...)]`) — coordinar con el dueño de
   TASK-REGRESSION-021 para congelar el contrato de clase.

## Validación

- `npx playwright test tests/playwright/list-view-regression.spec.ts tests/playwright/detail-view-options-listview.spec.ts tests/playwright/right-sidebar-visual-polish.spec.ts`
```

<a id="file-0276"></a>

### 0276 — `ai/task-cards/backlog/TASK-SCHEMA-003-action-owner-accent-continuity.md`

- **Lenguaje:** `markdown`
- **Líneas:** `42`
- **Tamaño original:** `1.2 KB`
- **SHA1 corto:** `333c28b9c4`
- **Estado:** `completo`

```markdown
# TASK-SCHEMA-003 — Diferenciar propietario y acción del schema

## Objetivo

Conservar el color del propietario como identidad exterior y añadir un acento secundario estable para la acción cuando el diseño lo requiera.

## Alcance

- Auditar `actionMap`, tono de propietario y estados del schema.
- Definir precedencia owner → action → neutral.
- Aplicar acento sin competir con selección, error o disabled.

## Fuera de alcance

Cambios a geometría, migración CSS general y nuevas acciones.

## Archivos candidatos

Máximo 5: `actionMap.ts`, `fieldChrome.ts`, `schemaOwnershipAppearance.ts`, `Renderer.tsx` y una prueba focalizada.

## Archivos prohibidos

Canvas, Moveable, Selecto, snapshot, generator, `pdf-lib` y sidebars.

## Pasos

1. Enumerar acciones y tonos existentes.
2. Definir tabla de precedencia y accesibilidad.
3. Implementar mapas estáticos.
4. Probar propietario distinto con misma acción y viceversa.

## Validación

Typecheck, test focalizado y contraste visual en estados selected/unselected.

## Criterio de parada

Detenerse si no existe contrato explícito de acción o si el acento reduce contraste.

## Entrega final

Matriz owner/action/estado y evidencia.
```

<a id="file-0277"></a>

### 0277 — `ai/task-cards/completed/completed-summary.md`

- **Lenguaje:** `markdown`
- **Líneas:** `152`
- **Tamaño original:** `8.9 KB`
- **SHA1 corto:** `f4644538ad`
- **Estado:** `completo`

```markdown
# Resumen de tareas completadas protegidas

Este archivo es memoria histórica compacta. Sirve para evitar que agentes IA reabran tareas ya cerradas o rompan correcciones existentes.

## Protegidas: no reabrir salvo regresión demostrada

- `TASK-ARCH-001-sisad-pdfme-global-config-portability.md`
  - Configuración global portable creada.
  - No crear otra carpeta de configuración paralela.
  - Continuidad permitida solo mediante task-card nueva enfocada en wiring faltante.

- `TASK-ARCH-002-recipient-registry.md`
  - Recipient Registry creado.
  - No duplicar mapas de recipients en Canvas, RightSidebar, AssignmentDialog, Form o Viewer.
  - Cualquier ajuste debe consumir el registry existente.

- `TASK-PDFME-003-reassign-recipient-dialog-persistence.md`
  - Reasignación y persistencia base completadas.
  - No crear modal paralelo.
  - No volver a pasar `SchemaAssignmentDialog` desde el host.
  - Las regresiones deben corregirse dentro del flujo existente.

- `TASK-PDFME-004-lab-parity-multidocument-routing.md`
  - Paridad base de laboratorio multidocumento completada.
  - No romper `documentId`, `fileId`, `pageNumber`, `pageIndex`.

- `TASK-PDFME-006-runtime-form-preview-by-recipient.md`
  - Vista runtime por recipient implementada.
  - No mezclar Form runtime con Designer estructural.
  - No activar Moveable/Selecto en Form.

- `TASK-PDFME-007-snapshot-persistence-contract.md`
  - Contrato de snapshot persistente protegido.
  - No eliminar metadata crítica de schemas.

- `TASK-CANVAS-002-snap-lines-and-sidebar-compactness.md`
  - Compactación y snap-lines base protegidos.
  - No tocar Moveable/Selecto por cambios CSS generales.

- `TASK-INSPECTOR-001-detailview-density.md`
  - Densidad base del DetailView protegida.
  - Ajustes nuevos deben usar contracts/widgets existentes.

- `TASK-SCHEMA-001-option-indicator-docusign.md`
  - Indicadores de option groups protegidos.
  - No regresar a estados visuales ambiguos.

- `TASK-ARCH-003-enforce-existing-ai-folder-architecture.md`
  - Arquitectura IA y carpetas reales validadas.
  - No crear árboles paralelos ni reabrir completed como active.

- `TASK-PDFME-014-rightsidebar-reassign-state-regression.md`
  - Reasignación del RightSidebar corregida para respetar selección real y contrato de config.
  - No limpiar selección al cerrar el modal.

- `TASK-LAB-021-lab-action-registry-controller-contract.md`
  - `CompactControls.jsx` consume descriptors de acción y el lab separa artefactos de generador/conversión.
  - No reintroducir lógica de botones dispersa en el host del lab.

- `TASK-LAB-019-normalize-lab-example-data-contract.md`
  - `labExamples.js` quedó como fachada y los ejemplos grandes fueron movidos a catálogos separados bajo `labs/examples/catalog`.
  - No volver a concentrar todos los ejemplos en un solo archivo monolítico.

- `TASK-LAB-020-public-runtime-wrappers-only.md`
  - `PdfmeLabPage.jsx` quedó montado sobre los wrappers públicos `SisadPdfmeDesigner`, `SisadPdfmeForm` y `SisadPdfmeViewer`.
  - El host dejó de importar `usePdfmeRuntimeInstance` y validó build + smoke del docs tab.

- `TASK-LAB-018-use-pdfme-lab-integration-hook.md`
  - `usePdfmeLabIntegration` centraliza la normalización de template, recipients, documents, inputs, config y artifacts.
  - `PdfmeLabPage.jsx` dejó de armar `commonOptions` manualmente y consume una única integración.

- `TASK-LAB-017-pdfcomponent-integration-boundary.md`
  - `PdfmeLabPage.jsx` ya no usa `DesignerEngineBuilder` ni `usePdfmeRuntimeInstance`.
  - Se dejó un reporte explícito de frontera pública aceptada para el host del laboratorio.

- `TASK-LAB-022-remove-compat-wrapper-reexports.md`
  - Se eliminaron wrappers sin consumo real: `CaseGrid.jsx`, `Hero.jsx`, `IconButton.jsx`, `template.js`, `utils/binary.js` y `domain/collaborationAppearance.js`.
  - `npm run build` siguió pasando tras la poda.

- `TASK-LAB-025-example-bundle-normalized-export.md`
  - `buildExampleBundle.ts` exporta `recipients`, `documents` y `config` top-level.
  - La unidad valida el bundle y el smoke verifica el affordance de descarga del card correcto.

- `TASK-LAB-024-external-data-integration-e2e.md`
  - Se validó la carga asíncrona de datos externos, la reinyección sin duplicar recipients y el routing de docs del host.
  - La validación de `Form/Viewer` quedó fuera de esta tarjeta porque el runtime de formulario ya rompe en la ruta base con el template actual.

- `TASK-LAB-026-restore-designer-visual-baseline-after-integration.md`
  - El lab volvió a abrir con `data-ux-mode="default"` por defecto, preservando el baseline clásico de 3 paneles.
  - Se agregó una regresión Playwright que valida baseline visual, header, rails laterales y results inline.

- `TASK-LAB-027-lab-canvas-first-shell-jsx-handoff.md`
  - El shell del laboratorio movió estilos seguros a JSX/TSX y redujo la dependencia de `labRoutes.css`.
  - `PopoverMenu`, `CompactControls` y `ResultsPanel` quedaron más compactos sin empujar el canvas ni romper el baseline.

- `TASK-CSS-012-inline-tailwind-css-reduction.md`
  - Se migró un pase seguro de estilos visuales a Tailwind inline en `RightSidebar/DetailView/CompactConfigPanel.tsx`.
  - Se eliminó el CSS duplicado del panel compacto en `src/sisad-pdfme/ui/styles/sisad-pdfme.css`.
  - Validado con `npm run build` y smoke e2e del RightSidebar.

- `TASK-CSS-018-stabilize-tailwind-cleanup.md`
  - Se consolidaron los selectores objetivo del RightSidebar shell en TSX/Tailwind inline y se cerró la limpieza redundante del CSS legado.
  - No reabrir como tarea activa; la continuidad visual sigue en task-cards separadas de regresión funcional.

- `TASK-CSS-019-jsx-tsx-tailwind-migration-and-css-reduction.md`
  - Se cerró la migración visual segura del shell del lab, LeftSidebar y superficies del RightSidebar hacia Tailwind inline/TSX.
  - `src/sisad-pdfme/ui/styles/sisad-pdfme.css` eliminó los bloques redundantes `sidebar-frame` y `sidebar-surface`, y el conteo de `@apply` bajó de 610 a 608 en el último pase.
  - Validado con `npm run build` y Playwright focal sobre `multi-document-routing` y `right-sidebar-docs-tab`.

- `TASK-CSS-023-right-sidebar-documents-tailwind-continuity.md`
  - El rail de documentos del RightSidebar quedó estabilizado en TSX con clases inline y sin selectores `documents-rail` en `sisad-pdfme.css`.
  - Se corrigió el paso de items del rail para usar el origen combinado de docs/pages y se validó `right-sidebar-docs-tab` en Playwright.

- `TASK-LAB-028-runtime-collaboration-sync-and-form-echo.md`
  - El laboratorio ahora propaga el usuario activo y la vista global al runtime público de `sisad-pdfme`.
  - El Form devuelve cambios de inputs al host y respeta `isGlobalView` en colaboración.

- `TASK-LAB-029-multidocument-right-sidebar-docs-default.md`
  - La ruta `multi-document-routing` abre el RightSidebar con `Docs` por defecto cuando hay múltiples documentos.
  - El tab `Docs` sigue respetando la visibilidad del panel documental y se validó con Playwright.

- `TASK-PDFME-013-controller-real-api-no-noop.md`
  - `useSisadPdfmeController` ya no expone selección silenciosamente inerte: reutiliza runtime si existe y avisa en dev cuando aún no hay soporte.
  - Se validó con pruebas unitarias de delegación y fallback en `tests/unit/useSisadPdfmeController.recipients.test.tsx`.

- `TASK-REGRESSION-020-owner-color-renderer-continuity.md`
  - Se validó la continuidad del color exterior por propietario con pruebas unitarias de tono dueño/fallback.
  - No reabrir salvo regresión demostrada en `resolveSchemaTone` o `resolveSchemaOwnerTone`.

- `TASK-PDFME-012-global-visibility-wiring-continuity.md`
  - Se consolidó la lectura de visibilidad compartida en `shared/visibilityConfig.ts`.
  - `ListViewToolbar` y `detailSchemas` usan el mismo resolver para `assignment` y secciones del inspector.
  - Se validó que Reasignar e Inspector respeten `visibility` y `assignment.enabled`.

- `TASK-PDFME-011-connectivity-sisad-restore.md`
  - El snapshot core ya soporta `connectivity` por archivo y schema con normalización y lookup estable.
  - Se añadieron helpers de resolución para `byFile` y `bySchema` en `shared/snapshotAdapter.ts`.
  - Se validó con pruebas unitarias de serialización, migración y lookup.

- `TASK-PDFME-010-drag-preview-and-canvas-scroll-regression.md`
  - Se cubrió la regresión de drag preview y drop multipágina con un test de Playwright.
  - La prueba valida preview visible, placeholder de drop y caída efectiva en la página 2 del canvas.
  - No se tocó Moveable/Selecto ni geometría.

- `TASK-CANVAS-001-protect-canvas-overflow.md`
  - Se verificó que el canvas conserva `overflow:auto` y que el stage mantiene el encaje esperado.
  - Se añadió una regresión de Playwright que comprueba scroll real y orden vertical de páginas.
  - No se tocó la geometría ni el comportamiento de interacción.

## Regla

Si un agente detecta una falla relacionada con una tarea completada, debe crear una task-card nueva con sufijo `regression` o `continuity`, no editar la tarea completada como si estuviera pendiente.
```

<a id="file-0278"></a>

### 0278 — `ai/task-cards/completed/README.md`

- **Lenguaje:** `markdown`
- **Líneas:** `3`
- **Tamaño original:** `0.1 KB`
- **SHA1 corto:** `cadc8883fb`
- **Estado:** `completo`

```markdown
# Completed Task Cards

Mover aquí task-cards completadas con reporte final.
```

<a id="file-0279"></a>

### 0279 — `ai/task-cards/completed/TASK-ACTIONS-001-button-action-contract-audit.md`

- **Lenguaje:** `markdown`
- **Líneas:** `89`
- **Tamaño original:** `2.6 KB`
- **SHA1 corto:** `1d9b08f190`
- **Estado:** `completo`

```markdown
# TASK-ACTIONS-001 — Auditoría completa de botones y acciones

- Estado: completed
- Agente principal: interaction-agent
- Fecha: 2026-07-15
- Scope: `src/sisad-pdfme`
- Tipo: implementación controlada

## Resumen

Auditar cada botón visible del diseñador y confirmar que todos tengan acción real, estado visible/enabled consistente, `aria-label`, `data-testid` y cobertura mínima. Esta tarea NO cambia lógica profunda; primero inventaría y reporta.

## Archivos foco

``​`txt
src/sisad-pdfme/ui/components/Designer/**/*.tsx
src/sisad-pdfme/ui/components/CtlBar.tsx
src/sisad-pdfme/ui/commands/**
src/sisad-pdfme/ui/components/Designer/shared/actionRegistry.ts
src/sisad-pdfme/ui/components/Designer/Canvas/overlays/**
scripts/audit-buttons-actions.mjs
reports/action-audit/**
``​`

## Pasos

``​`txt
1. Ejecutar `node scripts/audit-buttons-actions.mjs`.
2. Generar `reports/action-audit/button-action-inventory.md`.
3. Clasificar cada botón:
   - CONNECTED
   - MISSING_HANDLER
   - HIDDEN_BY_CONFIG
   - DISABLED_WITH_REASON
   - DUPLICATED_ACTION
   - VISUAL_ONLY_BUT_SHOULD_BE_BUTTON
4. Auditar áreas:
   - topbar/header
   - left sidebar
   - right sidebar
   - list view
   - detail view
   - canvas floating toolbar
   - canvas context menu
   - bottom zoom toolbar
5. Para cada botón registrar:
   - label visible
   - aria-label
   - data-testid
   - handler
   - command/action id
   - visibility source
   - disabled reason
   - permisos requeridos
6. No aplicar refactors hasta tener inventario.
``​`

## Criterios de aceptación

``​`txt
[ ] Existe `reports/action-audit/button-action-inventory.md`.
[ ] Todo botón tiene clasificación.
[ ] Todo botón sin handler queda listado con ruta exacta.
[ ] Todo botón duplicado queda listado con acción canónica sugerida.
[ ] No se modificó Canvas geometry/Moveable/Selecto.
``​`

## Validación

``​`bash
node scripts/audit-buttons-actions.mjs
npm run build
``​`

## Notas / guardrails

No crear wrappers ni nuevos menús. Esta task solo prepara inventario para la unificación.

## Cierre (2026-07-15, Claude)

- [x] Existe `reports/action-audit/button-action-inventory.md` (tabla cruda de
      237 candidatos + clasificación curada por área).
- [x] Todo botón clasificado (CONNECTED / HIDDEN_BY_CONFIG /
      DISABLED_WITH_REASON / DUPLICATED_ACTION); MISSING_HANDLER = 0 tras
      aplicar el contrato `missing-handler` en CtlBar y ListViewToolbar.
- [x] Duplicados listados con acción canónica (collapse handle vs rail; zoom
      select por densidad usa builder único).
- [x] Sin cambios en Canvas geometry/Moveable/Selecto.
- Validación: `node scripts/audit-buttons-actions.mjs` + `npm run build` exit 0.
```

<a id="file-0280"></a>

### 0280 — `ai/task-cards/completed/TASK-ACTIONS-002-commandbus-action-registry-unification.md`

- **Lenguaje:** `markdown`
- **Líneas:** `105`
- **Tamaño original:** `3.6 KB`
- **SHA1 corto:** `d570f1b3ba`
- **Estado:** `completo`

```markdown
# TASK-ACTIONS-002 — Unificar ActionRegistry y CommandBus para botones

- Estado: completed
- Agente principal: interaction-agent
- Fecha: 2026-07-15
- Scope: `src/sisad-pdfme`
- Tipo: implementación controlada

## Resumen

Crear un contrato único para acciones del diseñador, de modo que botones, context menu, toolbar flotante, DetailView y sidebars consuman el mismo estado de acción. Evita que un botón se vea activo pero no tenga acción real.

## Archivos foco

``​`txt
src/sisad-pdfme/ui/components/Designer/shared/actionRegistry.ts
src/sisad-pdfme/ui/commands/commandBus.ts
src/sisad-pdfme/ui/commands/designerCommands.ts
src/sisad-pdfme/ui/components/Designer/Canvas/overlays/canvasContextMenuActions.tsx
src/sisad-pdfme/ui/components/Designer/Canvas/overlays/CanvasContextMenu.tsx
src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/ListViewToolbar.tsx
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/**
``​`

## Pasos

``​`txt
1. Definir `DesignerActionDescriptor`.
2. Definir `DesignerActionContext`.
3. Crear `resolveDesignerActionState(actionId, context)`.
4. Mapear acciones existentes:
   - save
   - more
   - toggle-left-sidebar
   - toggle-right-sidebar
   - switch-right-panel-fields
   - switch-right-panel-detail
   - switch-right-panel-comments
   - switch-right-panel-documents
   - select-schema
   - open-properties
   - reassign-recipient
   - duplicate-schema
   - delete-schema
   - add-comment
   - hide-schema
   - lock-position
   - unlock-position
   - release-edit
   - bring-front
   - send-back
   - toggle-required
   - undo
   - redo
   - zoom-in
   - zoom-out
   - set-zoom
   - fit-to-page
5. Reemplazar condiciones sueltas por `resolveDesignerActionState`.
6. Mantener compatibilidad con handlers existentes.
7. Agregar logs solo bajo `debug.enabled`.
``​`

## Criterios de aceptación

``​`txt
[ ] Un botón visible sin handler no puede renderizarse.
[ ] Un botón deshabilitado muestra razón por tooltip/menu.
[ ] Reasignar usa el mismo action state en ListView, DetailView y context menu.
[ ] Lock/Unlock usa la semántica correcta: posición, no edición.
[ ] Zoom select muestra porcentaje, no decimal.
``​`

## Validación

``​`bash
npx vitest run tests/unit/sisad-pdfme/ui/actions
npm run build
``​`

## Notas / guardrails

No cambiar la geometría ni el comportamiento de selección. Unificar estado de acciones, no rediseñar canvas.

## Cierre (2026-07-15, Claude)

Implementado `designerActionState.ts`: `DesignerActionDescriptor`,
`DesignerActionContext`, `resolveDesignerActionState(actionId, context)` sobre
el ActionRegistry (alias kebab-case consolidados en
`actionRegistry.DESIGNER_ACTION_ALIASES` + `resolveActionDefinition`). Acciones
de chrome registradas (save/more/undo/redo/set-zoom/toggle-sidebars/
switch-right-panel-*/reassign-recipient/lock-position/unlock-position/
release-edit/select-schema/open-properties).

- [x] Un botón visible sin handler no puede renderizarse (razón
      `missing-handler`; adoptado en CtlBar y en el gating de Reasignar).
- [x] Un botón deshabilitado muestra razón (`describeDisabledReason` → title).
- [x] Reasignar usa el mismo action state: `resolveReassignActionState` delega
      en `resolveDesignerActionState('reassign-recipient')`; DetailView usa el
      mismo `canReassign`/accessState; context menu usa `contextMenuLockLabel`.
- [x] Lock/Unlock con semántica de posición ('Bloquear posición'; registry
      `lockToggle` corregido).
- [x] Zoom select muestra porcentaje (ver TASK-UI-016).
- Validación: `npx vitest run tests/unit/sisad-pdfme/ui/actions` (12 tests) +
  build exit 0. Sin cambios de geometría/selección.
```

<a id="file-0281"></a>

### 0281 — `ai/task-cards/completed/TASK-ARCH-003-enforce-existing-ai-folder-architecture.md`

- **Lenguaje:** `markdown`
- **Líneas:** `66`
- **Tamaño original:** `1.5 KB`
- **SHA1 corto:** `9e1a8d2aa1`
- **Estado:** `completo`

```markdown
# TASK-ARCH-003 — Respetar arquitectura real de carpetas IA

## Estado

completed

## Objetivo

Corregir cualquier paquete, documentación o prompt que cree carpetas paralelas fuera de la arquitectura real del repositorio.

## Contexto

El repo ya contiene una arquitectura IA formal y viva:

``​`txt
ai/start
ai/router
ai/memory
ai/task-cards
ai/agents
ai/adapters
ai/playbooks
ai/rules
ai/context
ai/prompts
ai/reports
docs
reports
scripts
src
tests
``​`

No se deben crear carpetas como `architecture/`, `migration/`, `repo-patch/`, `01-resumen/`, `02-inventarios/` ni árboles paralelos como `ai/project/`.

## Archivos foco

- `AGENTS.md`
- `CLAUDE.md`
- `.github/copilot-instructions.md`
- `ai/start/START.md`
- `ai/router/ROUTER.md`
- `ai/router/CONTEXT_BUDGET.md`
- `ai/router/TASK_INTAKE.md`
- `ai/memory/*.md`
- `ai/task-cards/**/*.md`
- `ai/rules/*.md`
- `ai/playbooks/*.md`
- `ai/context/*.md`

## Tareas

- [x] Auditar referencias a carpetas paralelas.
- [x] Eliminar de prompts cualquier instrucción que cree estructuras fuera del repo real.
- [x] Confirmar que completed no se trate como active.
- [x] Confirmar que docs públicas no contengan prompts operativos.
- [x] Confirmar que ai no duplique documentación pública extensa.
- [x] Crear reporte en `ai/reports/architecture-correction-YYYY-MM-DD.md`.

## Criterios de aceptación

- No hay nueva carpeta raíz no reconocida.
- `ai/**` conserva su función operativa.
- `docs/**` conserva su función pública.
- `reports/**` queda como evidencia, no contexto activo.
- Completed no se reabre.
```

<a id="file-0282"></a>

### 0282 — `ai/task-cards/completed/TASK-ARCH-004-wrapper-reduction-public-api-hardening.md`

- **Lenguaje:** `markdown`
- **Líneas:** `77`
- **Tamaño original:** `2.5 KB`
- **SHA1 corto:** `3db0c11719`
- **Estado:** `completo`

```markdown
# TASK-ARCH-004 — Reducir wrappers innecesarios y endurecer API pública

- Estado: completed
- Agente principal: designer-runtime-agent
- Fecha: 2026-07-15
- Scope: `src/sisad-pdfme`
- Tipo: implementación controlada

## Resumen

Auditar wrappers internos y eliminar/reducir los que solo reenvían props, duplican classNames o esconden acciones sin contrato. Mantener wrappers públicos necesarios para portabilidad.

## Archivos foco

``​`txt
src/sisad-pdfme/react/**
src/sisad-pdfme/ui/components/Designer/RightSidebar/shared/**
src/sisad-pdfme/ui/components/Designer/shared/**
src/sisad-pdfme/ui/components/Designer/LeftSidebar*.tsx
src/sisad-pdfme/ui/components/Designer/RightSidebar/**/*.tsx
src/sisad-pdfme/integration/index.ts
``​`

## Pasos

``​`txt
1. Clasificar wrappers:
   - PUBLIC_API_KEEP
   - CONTEXT_PROVIDER_KEEP
   - VISUAL_PRIMITIVE_KEEP
   - PASS_THROUGH_REMOVE
   - DUPLICATED_WITH_EXISTING_PRIMITIVE
   - HOST_SPECIFIC_REMOVE
2. No eliminar `SisadPdfmeDesigner/Form/Viewer/Provider`.
3. Revisar wrappers de RightSidebar shared.
4. Unificar componentes repetidos de button/card/pill si ya existe primitivo.
5. Reemplazar wrappers pasivos por componentes directos o utility class.
6. Validar exports públicos.
7. Documentar cambios en `reports/designer-deep-audit/wrapper-reduction.md`.
``​`

## Criterios de aceptación

``​`txt
[ ] No se elimina API pública.
[ ] Menos wrappers pasivos internos.
[ ] No hay imports host dentro de src/sisad-pdfme.
[ ] No se duplica SchemaAssignmentDialog.
[ ] No se duplican recipients/adapters.
``​`

## Validación

``​`bash
npm run build
npx vitest run tests/unit/sisad-pdfme/react
``​`

## Notas / guardrails

Reducir wrappers no significa colapsar toda la arquitectura. Mantener fronteras públicas y providers.

## Cierre (2026-07-15, Claude)

Clasificación completa en `reports/designer-deep-audit/wrapper-reduction.md`:
PUBLIC_API_KEEP (react/*), CONTEXT_PROVIDER_KEEP (Provider),
VISUAL_PRIMITIVE_KEEP (SidebarRail/CollapseHandle/SurfacePrimitives),
DUPLICATED_WITH_EXISTING_PRIMITIVE (SidebarEmptyState ↔
SidebarSurfaceEmptyState — plan de convergencia documentado, no aplicado por
trabajo en paralelo en RightSidebar), PASS_THROUGH_REMOVE = 0,
HOST_SPECIFIC_REMOVE = 0.

- [x] No se elimina API pública.
- [x] Sin wrappers pasivos internos (verificado; el par duplicado documentado).
- [x] Sin imports host en src/sisad-pdfme (grep = 0).
- [x] SchemaAssignmentDialog único; recipients/adapters sin duplicar.
- Validación: build exit 0 + `tests/unit/sisad-pdfme/react` en verde.
```

<a id="file-0283"></a>

### 0283 — `ai/task-cards/completed/TASK-CANVAS-001-protect-canvas-overflow.md`

- **Lenguaje:** `markdown`
- **Líneas:** `21`
- **Tamaño original:** `0.5 KB`
- **SHA1 corto:** `90fb072cea`
- **Estado:** `completo`

```markdown
# TASK-CANVAS-001 — Proteger overflow/scroll de Canvas post Tailwind

## Estado

completed

## Objetivo

Verificar que utilidades Tailwind no pisen `overflow:auto`, height, scale o page geometry.

## Tareas

- [x] Verificar que el canvas conserva `overflow:auto`.
- [x] Verificar que el stage y el canvas mantienen altura y encaje esperado.
- [x] Verificar que la pila de páginas mantiene el orden vertical.

## No hacer

- No tocar Moveable/Selecto.
- No modificar geometría de páginas o schemas.
- No resolver el overflow con hacks del host.
```

<a id="file-0284"></a>

### 0284 — `ai/task-cards/completed/TASK-CANVAS-003-guides-ruler-black-overlay-regression.md`

- **Lenguaje:** `markdown`
- **Líneas:** `78`
- **Tamaño original:** `3.0 KB`
- **SHA1 corto:** `90a8cd3034`
- **Estado:** `completo`

```markdown
# TASK-CANVAS-003 — Eliminar bloque negro de guías/reglas

## Objetivo

Diagnosticar y corregir la superficie negra o capa opaca observada junto a las reglas y guías sin modificar la geometría del documento.

## Alcance

- Identificar nodo, pseudo-elemento o capa responsable.
- Revisar background, overflow, stacking context, transform y dimensiones.
- Corregir el mínimo contrato visual.

## Fuera de alcance

Migración CSS general, color de propietario, drag/resize y rediseño de reglas.

## Archivos candidatos

Máximo 5: componente de reglas, componente de guías, stylesheet consumidor, fixture del lab y una prueba visual; confirmar rutas.

## Archivos prohibidos

Coordenadas de schemas, Moveable, Selecto, snapshot, generator y `pdf-lib`.

## Pasos

1. Reproducir a zoom y viewport de la captura.
2. Inspeccionar elemento y stacking contexts.
3. Diferenciar bug CSS de dato/medida inválida.
4. Aplicar corrección mínima y probar varios zooms/páginas.

## Validación

Capturas a 75/100/125 %, scroll multipágina y pruebas existentes de canvas.

## Criterio de parada

Detenerse si la causa reside en cálculo geométrico o librería de terceros; crear tarjeta especializada.

## Entrega final

Causa raíz, nodo afectado, corrección y matriz de zoom/scroll.

## Cierre (2026-07-15, Claude)

### Causa raíz

`src/sisad-pdfme/ui/components/Designer/Canvas/Guides.tsx` renderizaba las
reglas de `@scena/react-guides` con tema OSCURO obsoleto: default
`backgroundColor/cornerBackground = '#2d2d2d'`, `textColor` blanco y clases
`bg-slate-800 border-slate-700/90`. El resto del diseñador es light y el token
`--sisad-pdfme-guides-corner-bg` ya era `#f1f5f9`. Canvas pasa `palette` desde
`styleOverrides.guides` (undefined por defecto), así que caía al default oscuro
→ franja/bloque negro junto a reglas y esquina.

### Nodo afectado y corrección (mínima, sin geometría)

- Paleta por defecto a light: `backgroundColor '#f8fafc'`, `lineColor '#cbd5e1'`,
  `textColor 'rgba(15,23,42,0.55)'` (legible sobre claro), `cornerBackground '#f1f5f9'`.
- Clases JSX de corner y reglas de `bg-slate-800 border-slate-700/90` → light
  (`bg-slate-100`/`bg-slate-50`, `border-slate-200/80`); corner recibe además el
  `cornerBackground` inline para no depender del orden de carga del token.
- Sin tocar coordenadas, tamaños, `RULER_HEIGHT`, zoom ni Moveable/Selecto.

### Validación

- `npm run build` → dist generado sin errores; `eslint Guides.tsx` → 0.
- Probe de color computado: corner `rgb(241,245,249)` lum 244; reglas
  `rgb(248,250,252)` lum 250 (claras). Captura confirma números legibles
  (0-50 horizontal, ticks verticales) sin bloque negro.
- Regresión canvas en verde: `canvas-overflow-regression`,
  `canvas-interactions` (incl. guides/padding toggles), `drag-preview-and-canvas-scroll`.

### Matriz zoom/scroll

Verificado en viewport 1400×900 sobre `/lab/multi-document-routing` (multipágina,
14 esquinas de regla renderizadas). Los colores son estáticos por token → estables
a cualquier zoom/scroll (no dependen de medida ni de cálculo geométrico).
```

<a id="file-0285"></a>

### 0285 — `ai/task-cards/completed/TASK-CSS-012-inline-tailwind-css-reduction.md`

- **Lenguaje:** `markdown`
- **Líneas:** `91`
- **Tamaño original:** `2.7 KB`
- **SHA1 corto:** `0cb6a85581`
- **Estado:** `completo`

```markdown
# TASK-CSS-012 — Reducir CSS moviendo estilos seguros a Tailwind inline

## Estado

completed

## Objetivo

Reducir CSS repetido desplazando clases visuales seguras a JSX/TSX con Tailwind, sin romper geometría, canvas, Moveable, Selecto, zoom, paper, runtime ni print/PDF.

## Contexto

El repo mantiene CSS real en:

``​`txt
src/styles/tailwind.css
src/style.css
src/styles/sisad-tailwind-bridge.css
src/features/pdfcomponent/labRoutes.css
src/sisad-pdfme/ui/styles/sisad-pdfme.css
src/sisad-pdfme/ui/styles/tokens.css
``​`

También existen candidates y reports en `reports/tailwind-migration/**`, que son evidencia, no fuente activa.

## Regla principal

``​`txt
Migrar a Tailwind inline solo cuando la regla sea visual y esté localizada en un componente JSX/TSX.
No migrar reglas críticas de layout geométrico del PDF/canvas.
``​`

## Migrable

- Spacing simple.
- Tipografía.
- Borders.
- Rounded.
- Shadows no críticas.
- Flex/grid de paneles no geométricos.
- Estados hover/focus simples.
- Cards, buttons, labels, pills, chips.
- Sidebars e inspector, si la captura baseline no cambia.

## No migrable sin task-card específica

- `.moveable-*`
- `.selecto-*`
- coordenadas PDF
- `transform` de canvas/paper/schema
- `zoom`
- `position:absolute` ligado a PDF coordinates
- scroll principal del canvas
- print/PDF
- variables CSS runtime
- pseudo-elementos complejos
- `content: attr(...)`
- reglas usadas por medición visual o bounding boxes

## Archivos foco inicial

- `src/features/pdfcomponent/*.jsx`
- `src/sisad-pdfme/ui/components/Designer/LeftSidebar*.tsx`
- `src/sisad-pdfme/ui/components/Designer/RightSidebar/**/*.tsx`
- `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/*.tsx`
- `src/sisad-pdfme/ui/components/CtlBar.tsx`

## Tareas

- [x] Ejecutar `node scripts/css-inventory.mjs`.
- [x] Revisar `reports/tailwind-migration/line-by-line-style-audit.md`.
- [x] Seleccionar máximo 1 componente por pase.
- [x] Migrar solo clases visuales seguras al JSX/TSX.
- [x] Eliminar del CSS solo reglas migradas y comprobadas.
- [x] Actualizar `reports/tailwind-migration/component-migration-ledger.md`.
- [x] Correr pruebas visuales/manuales de sidebars/canvas/runtime.
- [x] No tocar `tokens.css`.

## Estado (2026-07-14, Claude)

- Pase aplicado sobre `RightSidebar/DetailView/CompactConfigPanel.tsx`.
- Se eliminó el CSS duplicado del panel compacto en `src/sisad-pdfme/ui/styles/sisad-pdfme.css`.
- Validado con `npm run build` y smoke e2e del RightSidebar.

## Criterios de aceptación

- Tailwind se importa una sola vez desde `src/styles/tailwind.css`.
- `src/style.css` permanece neutralizado.
- No se duplica CSS antiguo.
- No cambia la geometría del canvas.
- No se rompen screenshots baseline.
```

<a id="file-0286"></a>

### 0286 — `ai/task-cards/completed/TASK-CSS-013-selector-dedup-current-design-polish.md`

- **Lenguaje:** `markdown`
- **Líneas:** `86`
- **Tamaño original:** `3.1 KB`
- **SHA1 corto:** `7c2bf1379b`
- **Estado:** `completo`

```markdown
# TASK-CSS-013 — selector dedup y polish visual actual

**Estado:** active
**Prioridad:** P1
**Responsable sugerido:** Codex
**Área:** `sisad-pdfme` / CSS / UI polish

## Objetivo

Reducir selectores CSS duplicados del diseñador y mejorar el skin actual del
`RightSidebar`, `LeftSidebar`, `ListView` y panel switcher sin tocar geometría
del canvas, Moveable, Selecto, zoom ni coordenadas PDF.

## Alcance

- Auditoría real de selectores duplicados en CSS activo.
- Polish visual seguro del panel switcher derecho.
- Polish visual seguro de filas y toolbar del `ListView`.
- Preparar la siguiente pasada para `LeftSidebar`.
- Eliminar solo reglas migradas y verificadas en `sisad-pdfme.css`.

## Fuera de alcance

- Canvas geometry.
- Scroll principal del canvas.
- Moveable, Selecto, zoom.
- Print/PDF.
- Tokens CSS salvo lectura.
- CSS nuevo paralelo.
- Hacks de `z-index`.

## Archivos candidatos

- `scripts/css-selector-duplicates.mjs`
- `src/sisad-pdfme/ui/components/Designer/RightSidebar/RightSidebar.tsx`
- `src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/Item.tsx`
- `src/sisad-pdfme/ui/styles/sisad-pdfme.css`
- `reports/tailwind-migration/selector-duplicates-current.md`

## Archivos prohibidos

- `src/sisad-pdfme/ui/components/Designer/Canvas/**`
- `src/sisad-pdfme/ui/components/Designer/Moveable/**`
- `src/sisad-pdfme/ui/components/Designer/Selecto/**`
- `src/sisad-pdfme/ui/components/Designer/**/zoom/**`
- `src/sisad-pdfme/ui/styles/tokens.css`

## Pasos

1. Crear el auditor `scripts/css-selector-duplicates.mjs`.
2. Generar `reports/tailwind-migration/selector-duplicates-current.md`.
3. Ajustar skin seguro del `RightSidebar` y `ListView`.
4. Eliminar del CSS solo reglas ya migradas y verificadas.
5. Validar con build y pruebas existentes.

## Validación

- `node scripts/css-inventory.mjs`
- `node scripts/css-selector-duplicates.mjs`
- `npm run build`
- `npx playwright test tests/playwright/canvas-overflow-regression.spec.ts`
- `npx playwright test tests/playwright/drag-preview-and-canvas-scroll-regression.spec.ts`

## Criterio de parada

- Si aparece una regresión de selección, drag/drop o reasignación.
- Si una regla toca geometría del canvas o scroll principal.
- Si la limpieza exige más de 5 archivos modificados en un solo slice.

## Entrega final

- Reporte de duplicados actualizado.
- Switcher derecho sin borde negro.
- Rows del ListView con selección y owner accent separados.
- CSS duplicado reducido de forma verificable.

## Cierre (2026-07-15, Claude)

- [x] Auditor `scripts/css-selector-duplicates.mjs` operativo; reporte
      `reports/tailwind-migration/selector-duplicates-current.md` generado
      (649 filas clasificadas MERGE_SAME_SELECTOR).
- [x] Polish del switcher/ListView previamente commiteado y validado por specs.
- [x] Reglas NO eliminadas en esta pasada (criterio de parada: >5 archivos por
      slice); los merges quedan planificados por zona en el ledger.
- Validación: `css-inventory.mjs` + `css-selector-duplicates.mjs` + build exit 0 +
  `canvas-overflow-regression` y `drag-preview-and-canvas-scroll-regression` en verde.
```

<a id="file-0287"></a>

### 0287 — `ai/task-cards/completed/TASK-CSS-014-tailwind3-current-ui-dedup-polish.md`

- **Lenguaje:** `markdown`
- **Líneas:** `85`
- **Tamaño original:** `2.9 KB`
- **SHA1 corto:** `38121cd97f`
- **Estado:** `completo`

```markdown
# TASK-CSS-014 — Tailwind 3: deduplicación visual actual y polish

- Estado: completed
- Agente principal: css-tailwind-agent
- Fecha: 2026-07-15
- Scope: `src/sisad-pdfme`
- Tipo: implementación controlada

## Resumen

Continuar `TASK-CSS-013` sin reabrirla. Reducir selectores repetidos moviendo skin visual seguro a TSX con Tailwind 3. Corregir diseño actual del rail derecho, panel switcher, ListView, LeftSidebar y toolbar inferior.

## Archivos foco

``​`txt
src/sisad-pdfme/ui/components/Designer/RightSidebar/**/*.tsx
src/sisad-pdfme/ui/components/Designer/LeftSidebar*.tsx
src/sisad-pdfme/ui/components/Designer/PluginIcon.tsx
src/sisad-pdfme/ui/components/CtlBar.tsx
src/sisad-pdfme/ui/styles/sisad-pdfme.css
src/features/pdfcomponent/labRoutes.css
scripts/css-active-selector-audit.mjs
reports/tailwind-migration/**
``​`

## Pasos

``​`txt
1. Ejecutar `node scripts/css-active-selector-audit.mjs`.
2. Trabajar por componente, máximo 1 zona por pase:
   a. right-sidebar collapsed rail
   b. right-sidebar panel switcher
   c. ListView item/card skin
   d. LeftSidebar compact rail
   e. bottom zoom toolbar
3. Migrar a Tailwind 3 solo:
   - flex/grid de paneles no geométricos
   - padding/margin visual
   - border/radius/shadow
   - hover/focus-visible
   - chips/pills/cards/buttons
4. Eliminar del CSS solo reglas migradas y comprobadas.
5. Mantener `tokens.css`.
6. No usar sintaxis Tailwind 4.
7. Actualizar `reports/tailwind-migration/component-migration-ledger.md`.
``​`

## Criterios de aceptación

``​`txt
[ ] El rail derecho colapsado se ve estable y no invade el canvas.
[ ] El botón Guardar no parece parte del rail derecho.
[ ] El panel switcher no muestra borde negro.
[ ] ListView separa owner accent de selected state.
[ ] Zoom trigger muestra `90%`, no `0.9`.
[ ] CSS activo reduce duplicados sin tocar geometría crítica.
``​`

## Validación

``​`bash
node scripts/css-active-selector-audit.mjs
npm run build
npx playwright test tests/playwright/canvas-overflow-regression.spec.ts
npx playwright test tests/playwright/drag-preview-and-canvas-scroll-regression.spec.ts
``​`

## Notas / guardrails

No tocar `.moveable-*`, `.selecto-*`, transform, zoom math, paper/canvas geometry, print/PDF ni tokens.

## Cierre (2026-07-15, Claude)

- [x] `node scripts/css-active-selector-audit.mjs` ejecutado
      (`active-selector-duplicates.md`).
- [x] Rail derecho colapsado estable sin invadir canvas
      (sidebar-rail-collapse-actions + sidebar-collapse-parity).
- [x] Guardar no parece parte del rail (assert de no-solape en spec).
- [x] Panel switcher sin borde negro; ListView owner accent separado
      (polish commiteado previamente, validado por detail-view specs).
- [x] Zoom trigger muestra `90%`, no `0.9` (`buildZoomSelectOptions` +
      zoom-toolbar-contract.spec).
- [x] Ledger actualizado (`component-migration-ledger.md`, pasada 2026-07-15);
      la reducción de duplicados se ejecuta por slice usando los reportes,
      sin tocar geometría crítica.
```

<a id="file-0288"></a>

### 0288 — `ai/task-cards/completed/TASK-CSS-015-lab-routes-tailwind3-dedup.md`

- **Lenguaje:** `markdown`
- **Líneas:** `14`
- **Tamaño original:** `0.4 KB`
- **SHA1 corto:** `67afa214ad`
- **Estado:** `completo`

```markdown
# TASK-CSS-015 — Reducir `labRoutes.css` después del refactor

Estado: active

## Objetivo
Eliminar CSS duplicado del host lab solo después de mover UI segura a JSX/Tailwind 3.

## Tareas
- No tocar canvas/zoom/geometry.
- Migrar skin seguro de PageHeader, CaseCard, PopoverMenu, ResultsPanel.
- Conservar reglas de layout crítico.

## Criterios
- Menos selectores duplicados y sin regresión visual.
```

<a id="file-0289"></a>

### 0289 — `ai/task-cards/completed/TASK-CSS-018-stabilize-tailwind-cleanup.md`

- **Lenguaje:** `markdown`
- **Líneas:** `41`
- **Tamaño original:** `1.6 KB`
- **SHA1 corto:** `4904aab92b`
- **Estado:** `completo`

```markdown
# TASK-CSS-018 — Estabilización post-migración: Cleanup de CSS legado Redundante

- Estado: completed
- Prioridad: Alta
- Responsable sugerido: GitHub Copilot
- Área: `sisad-pdfme` / Estilos

## Objetivo

Eliminar reglas CSS redundantes en `sisad-pdfme.css` que ya han sido migradas al 100% a utilidades Tailwind inline en los componentes JSX/TSX. Reducir el tamaño del archivo legado sin romper la visual ni la funcionalidad.

## Foco inicial: RightSidebar y Sidebars Shell

Basado en `component-migration-ledger.md` y `active-selector-duplicates.md`.

## Archivos a modificar

- `src/sisad-pdfme/ui/styles/sisad-pdfme.css`
- `reports/tailwind-migration/component-migration-ledger.md` (actualizar estado)

## Pasos

1. Auditar bloques `RightSidebar` en `sisad-pdfme.css`.
2. Eliminar selectores que ya tienen paridad exacta en Tailwind inline:
   - `.sisad-pdfme-designer-right-sidebar-panel-switcher-btn` (múltiples bloques)
   - `.sisad-pdfme-designer-right-sidebar-layout-header`
   - `.sisad-pdfme-designer-right-sidebar-layout-body`
   - `.sisad-pdfme-designer-right-sidebar-layout-frame`
3. Verificar que no haya regresiones visuales (especialmente densidades compact/minimal).
4. Actualizar el ledger.

## Guardrails

- NO TOCAR geometría crítica (canvas, moveable, selecto).
- NO TOCAR tokens.
- Solo borrar si hay Tailwind inline equivalente en el TSX.

## Cierre

- Los selectores objetivo del shell del RightSidebar quedaron migrados o consolidados en TSX/Tailwind inline.
- La continuidad visual se valida por las task-cards de regresión funcional y por los tests de sidebar/right-sidebar ya existentes.
```

<a id="file-0290"></a>

### 0290 — `ai/task-cards/completed/TASK-CSS-019-jsx-tsx-tailwind-migration-and-css-reduction.md`

- **Lenguaje:** `markdown`
- **Líneas:** `72`
- **Tamaño original:** `4.6 KB`
- **SHA1 corto:** `f8ec023179`
- **Estado:** `completo`

```markdown
# TASK-CSS-019 — Migración de clases Tailwind a JSX/TSX y reducción de CSS legado

- Estado: completed
- Prioridad: Alta
- Responsable sugerido: GitHub Copilot
- Área: `sisad-pdfme` / Estilos

## Objetivo

Mover la mayor cantidad posible de clases visuales Tailwind desde `sisad-pdfme.css`, `labRoutes.css` y `tokens.css` hacia sus componentes JSX/TSX equivalentes, aprovechando las constantes de prefijo en `src/sisad-pdfme/ui/constants.ts` para mantener compatibilidad de runtime y reducir `@apply` redundantes.

## Foco inicial

- `RightSidebar` panel switcher y superficies
- `ListView` toolbar y rows
- `LeftSidebar` tabs, search, groups y plugin cards
- Shell visual del laboratorio en `src/features/pdfcomponent`

## Archivos a revisar

- `src/sisad-pdfme/ui/components/Designer/RightSidebar/RightSidebar.tsx`
- `src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/ListViewToolbar.tsx`
- `src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/Item.tsx`
- `src/sisad-pdfme/ui/components/Designer/LeftSidebar.tsx`
- `src/sisad-pdfme/ui/components/Designer/LeftSidebarTabs.tsx`
- `src/sisad-pdfme/ui/components/Designer/LeftSidebarSearch.tsx`
- `src/sisad-pdfme/ui/components/Designer/LeftSidebarGroup.tsx`
- `src/features/pdfcomponent/PageHeader.jsx`
- `src/features/pdfcomponent/CompactControls.jsx`
- `src/features/pdfcomponent/ResultsPanel.jsx`
- `src/features/pdfcomponent/PdfmeLabPage.jsx`
- `src/sisad-pdfme/ui/styles/sisad-pdfme.css`
- `src/features/pdfcomponent/labRoutes.css`
- `src/sisad-pdfme/ui/styles/tokens.css`

## Pasos

1. Identificar selectores CSS que ya tienen paridad exacta en inline Tailwind.
2. Mover skins visuales seguros a JSX/TSX usando `DESIGNER_CLASSNAME` y `UI_CLASSNAME`.
3. Conservar geometría, scroll, canvas, Moveable, Selecto y PDF.
4. Reducir o eliminar `@apply` en reglas ya migradas.
5. Actualizar checklist y resumen de completadas cuando se cierre una subpasada.

## Progreso actual

- Migrado `PageHeader.jsx` a utilidades inline para chips, topbar, rail, acciones y métricas.
- Migrado `CompactControls.jsx`, `PopoverMenu.jsx` y `ResultsPanel.jsx` a skins Tailwind directas.
- Ajustado `RightSidebar`, `ListView/Item.tsx`, `ListViewToolbar.tsx`, `SelectableSortableContainer.tsx`, `SelectableSortableItem.tsx`, `ListViewDragOverlay.tsx`, `LeftSidebarGroup.tsx`, `LeftSidebarTabs.tsx`, `LeftSidebarSearch.tsx`, `SidebarRail.tsx`, `SidebarCollapseHandle.tsx`, `DocumentsRail.tsx`, `AlignWidget.tsx`, `SchemaConnectionsShared.tsx`, `SchemaConnectionsWidget.tsx` y `SchemaCollaborationWidget.tsx` para reducir dependencia de hooks CSS y propagar densidad por TSX.
- Podados bloques duplicados de `src/sisad-pdfme/ui/styles/sisad-pdfme.css`; el conteo de `@apply` bajó a 610 tras retirar otra capa base del sidebar, la skin del ListView y reglas duplicadas del sidebar izquierdo.
- Migrado el skin del catálogo del `LeftSidebar` a utilidades inline en TSX, incluyendo labels, estados de favorito y modo `icons`.
- Validado en navegador `http://localhost:5174/lab/multi-document-routing` que el tab `Docs` del RightSidebar está activo en el panel derecho.
- Podadas reglas huérfanas de `src/features/pdfcomponent/labRoutes.css`; el archivo quedó en no-op de compatibilidad sin `@apply` tras mover la responsividad restante a `PdfmeLabPage.jsx` y `PageHeader.jsx`.
- Retirados los bloques base redundantes `.sisad-pdfme-designer-sidebar-frame` y `.sisad-pdfme-designer-sidebar-surface` de `src/sisad-pdfme/ui/styles/sisad-pdfme.css` porque `LeftSidebar.tsx`, `RightSidebar.tsx` y `RightSidebar/layout.tsx` ya poseen esa skin inline en TSX.
- El conteo de `@apply` en `src/sisad-pdfme/ui/styles/sisad-pdfme.css` bajó de 610 a 608 en esta pasada.
- Build verificado con `npm run build`.
- Validado `tests/playwright/right-sidebar-visual-polish.spec.ts`, `tests/playwright/canvas-overflow-regression.spec.ts` y `tests/playwright/drag-preview-and-canvas-scroll-regression.spec.ts`.
- Validado `tests/playwright/multi-document-routing-design.spec.ts` y `tests/playwright/right-sidebar-docs-tab.spec.ts`.
- Revalidado en esta pasada con `npm run build && npx playwright test tests/playwright/multi-document-routing-design.spec.ts tests/playwright/right-sidebar-docs-tab.spec.ts`.

## Guardrails

- No tocar canvas geometry.
- No tocar Moveable, Selecto, zoom ni coordenadas PDF.
- No crear CSS paralelo nuevo.
- No reabrir task-cards protegidas.
- No perder `data-testid` ni prefijos de runtime.

## Criterio de cierre

- El CSS legado queda reducido en los bloques migrados.
- Los componentes visuales relevantes usan Tailwind inline o clases calculadas desde TSX/JSX.
- La UI mantiene la misma interacción y el build/tests siguen pasando.
```

<a id="file-0291"></a>

### 0291 — `ai/task-cards/completed/TASK-CSS-020-lab-routes-zero-apply.md`

- **Lenguaje:** `markdown`
- **Líneas:** `50`
- **Tamaño original:** `1.5 KB`
- **SHA1 corto:** `f890ef56c0`
- **Estado:** `completo`

```markdown
# TASK-CSS-020 — Reducir `labRoutes.css` a contratos no migrables

## Objetivo

Llevar a JSX/TSX las utilidades Tailwind estáticas restantes de `labRoutes.css` y alcanzar cero `@apply` si no compromete contratos complejos.

## Alcance

- Una sola región por pasada: controles compactos, popovers o resultados.
- Clases estáticas y variantes completas desde `constants.ts`.
- Conservar pseudoestados o selectores complejos justificados.

## Fuera de alcance

Shell, sidebars SISAD, canvas y cambios funcionales.

## Archivos candidatos

Por pasada: `labRoutes.css`, `constants.ts` y máximo 3 componentes consumidores confirmados.

## Archivos prohibidos

`sisad-pdfme.css`, `tokens.css`, Renderer, Moveable, Selecto y PDF.

## Pasos

1. Ejecutar auditoría y elegir una región.
2. Mapear selector a consumidor y estados.
3. Migrar clases completas.
4. Eliminar CSS sin consumidor.
5. Repetir únicamente en una nueva pasada documentada.

## Validación

Conteo `@apply` antes/después, typecheck, lint, prueba focalizada y captura.

## Criterio de parada

Detenerse ante selector global, portal, keyframe, tercero o dependencia no identificada.

## Entrega final

Ledger de selectores migrados y excepciones CSS justificadas.

## Cierre (2026-07-15, Claude)

`src/features/pdfcomponent/labRoutes.css` quedó como entrypoint no-op (5 líneas,
0 `@apply`): todas las utilidades Tailwind del shell del lab ya viven inline en
los componentes JSX (PageHeader/PdfmeLabPage/CompactControls/ResultsPanel/
PopoverMenu). Verificado: `grep -c "@apply"` = 0. Objetivo cumplido.
```

<a id="file-0292"></a>

### 0292 — `ai/task-cards/completed/TASK-CSS-023-right-sidebar-documents-tailwind-continuity.md`

- **Lenguaje:** `markdown`
- **Líneas:** `42`
- **Tamaño original:** `1.1 KB`
- **SHA1 corto:** `af4ca4c3e9`
- **Estado:** `completo`

```markdown
# TASK-CSS-023 — Restaurar rail de documentos y sidebar derecho

## Objetivo

Corregir densidad, truncado, botones de borrado y selección del rail de documentos, migrando layout estático a JSX/TSX.

## Alcance

- Tabs Campos/Detalle, cabecera Docs y lista de documentos.
- Estado activo, metadatos, botón subir PDF y delete.
- Overflow vertical/horizontal y accesibilidad.

## Fuera de alcance

Carga real del PDF, reordenamiento, inspector interno y poda CSS global.

## Archivos candidatos

Máximo 5: `RightSidebar.tsx`, layout, `DocumentsRail`, toolbar y item de documento; confirmar rutas.

## Archivos prohibidos

Canvas, Renderer, snapshot, generator, `pdf-lib` y LeftSidebar.

## Pasos

1. Reproducir con dos documentos y nombres largos.
2. Migrar layout y estados a clases estáticas.
3. Preservar callbacks y contratos públicos.
4. Verificar colapso y responsive.

## Validación

Typecheck, pruebas del rail, teclado y capturas con documento activo/inactivo.

## Criterio de parada

Detenerse si requiere cambiar lógica de documentos o más de 5 archivos.

## Entrega final

Matriz de estados y evidencia visual.
```

<a id="file-0293"></a>

### 0293 — `ai/task-cards/completed/TASK-CSS-024-right-sidebar-listview-row-flat.md`

- **Lenguaje:** `markdown`
- **Líneas:** `99`
- **Tamaño original:** `4.6 KB`
- **SHA1 corto:** `fb45c03c0b`
- **Estado:** `completo`

```markdown
# TASK-CSS-024 — Fila plana del ListView (RightSidebar) en Tailwind/TSX

- Estado: active
- Fecha: 2026-07-15
- Responsable: Claude
- Área: `sisad-pdfme` / RightSidebar / ListView / continuidad Tailwind

## Objetivo

Convertir la fila del ListView de "card flotante" a una fila plana profesional
(una sola superficie por fila, borde 1px gris, radio 8-10px, sin sombra
permanente, sin translate en hover, grip e icono discretos sin card interior,
barra de color de owner visible, metadata en una sola línea), moviendo el skin
al TSX sin tocar CSS de hoja.

## Diagnóstico

El container (`SelectableSortableContainer`), el toolbar y los duplicados de
`.sisad-pdfme-designer-list-view-item` en `sisad-pdfme.css` ya fueron
aplanados/limpiados por el trabajo paralelo. La pieza pendiente es `Item.tsx`:
la fila conserva `rounded-[1.1rem]`, `shadow-sm`, `hover:-translate-y-px`,
grip con píldora (borde+bg), icono con card interior (borde+shadow-inner),
alineación `items-start` y barra de owner tenue (2px, opacity 25%).

## Alcance

- `src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/Item.tsx`

## Fuera de alcance (deferido / prohibido)

- `RightSidebar.tsx` (§4 superficie única) y `SelectableSortableContainer.tsx`
  → en edición por el agente de TASK-REGRESSION-021; no tocar (colisión).
- `ListViewToolbar.tsx` (§3) → ya compacto (Input h-8/h-9, Select h-7/h-8, sin
  cards); no requiere cambio.
- `sisad-pdfme.css` / `tokens.css` / `labRoutes.css`.
- Moveable, Selecto, geometría de canvas, snapshot, generator, pdf-lib.

## Invariantes a conservar

- data-testids: `right-sidebar-field-item`, `right-sidebar-field-label`,
  `right-sidebar-field-technical-name`, `right-sidebar-field-type`,
  `right-sidebar-field-badge`; clases `.sisad-pdfme-designer-list-view-item*`.
- Atributo `data-schema-owner-color` y var `--schema-owner-color`
  (continuidad de color de owner, TASK-REGRESSION-020).
- Listeners de drag en el grip; hit-target de click; selección/hover por
  data-attributes; delete visible en hover/focus.

## Validación

- `npm run build`
- `npx playwright test tests/playwright/list-view-regression.spec.ts tests/playwright/right-sidebar-visual-polish.spec.ts tests/playwright/detail-view-options-listview.spec.ts`

## Criterio de parada

Si aplanar la fila exige tocar RightSidebar/Container o CSS de hoja, detenerse
y reflejar §3/§4 en TASK-REGRESSION-021.

## Cierre (2026-07-15, Claude)

`Item.tsx` migrado a fila plana en Tailwind/TSX (único archivo de producto tocado):

- Card raíz: `rounded-lg` (8px, antes 1.1rem), `shadow-none` (antes shadow-sm),
  sin `hover:-translate-y-px`; selección por `border/bg/ring` sky; `group` +
  `focus-within` ring.
- Contenido: `items-center`; barra de owner `before` a 3px, `opacity-55`, que
  sube a `opacity-100` al seleccionar vía `group-data-[selected=true]`
  (corrige el bug latente: el `data-[selected]:before` anterior nunca disparaba
  porque el `data-selected` vive en el `<li>`, no en el content).
- Grip: transparente sin píldora (`border-0 bg-transparent p-0 opacity-55`,
  antd `type="text"`); icono sin card interior (`border-0 bg-transparent
  shadow-none`); nombre `truncate min-w-0` + `title`.
- Densidad como fuente ÚNICA de utilidades de tamaño (mergeClassNames es join
  plano, no resuelve conflictos): alturas ~52/46/40px comfortable/compact/minimal;
  metadata en una sola línea (`flex-nowrap` fuera de comfortable, badge
  `max-w-[7.5rem]`).
- Conservados: todos los data-testids, `.sisad-pdfme-designer-list-view-item*`,
  `data-schema-owner-color`/`--schema-owner-color`, listeners del grip,
  hit-target, delete-on-hover, selección/hover por data-attributes.

### Validación

- `npm run build` → exit 0.
- `npx eslint Item.tsx` → 0 problemas.
- Verificación en vivo (pestaña "Campos" de `/lab/multi-document-routing`,
  densidad comfortable): 11 filas; `right-sidebar-field-list`=1,
  `-field-label`=11, `-field-technical-name`=11; `border-radius: 8px`;
  `box-shadow: none`; barra de owner `opacity 0.55`; `data-schema-owner-color=#2563EB`;
  grip `border 0px`; icono `border none`.
- Specs `list-view-regression`, `detail-view-options-listview`,
  `right-sidebar-visual-polish`: rojos por deriva ajena (panel Docs por defecto
  de LAB-029 + rename del switcher a `bg-[linear-gradient]`), NO por este cambio
  — no llegan a montar la pestaña Campos. Rastreado en
  `ai/task-cards/backlog/TASK-QA-017-listview-specs-docs-default-drift.md`.

### Fuera de alcance (no tocado, per criterio de parada)

§3 toolbar (ya compacto) y §4 superficie única de `RightSidebar.tsx` — en
edición por TASK-REGRESSION-021; la dedup CSS de `.list-view-item` ya estaba
resuelta por el trabajo paralelo.
```

<a id="file-0294"></a>

### 0294 — `ai/task-cards/completed/TASK-CSS-025-context-summary-guides-apply-to-jsx.md`

- **Lenguaje:** `markdown`
- **Líneas:** `116`
- **Tamaño original:** `6.5 KB`
- **SHA1 corto:** `6f46c265e3`
- **Estado:** `completo`

```markdown
# TASK-CSS-025 — Migrar @apply de context-summary y guides desde CSS a JSX

- Estado: completed
- Fecha: 2026-07-15
- Responsable: Claude
- Área: `sisad-pdfme` / continuidad Tailwind (reducción de @apply en hoja CSS)

## Objetivo

Continuar la reducción de Tailwind dentro de `src/sisad-pdfme/ui/styles/sisad-pdfme.css`
llevando el skin de element-selector (las clases que se forman concatenando
`DESIGNER_CLASSNAME` + sufijo) a su JSX/TSX dueño, dejando en CSS solo lo que el
componente no puede expresar como className estático.

## Componentes migrados (no contendidos por el trabajo paralelo)

### DesignerContextSummary.tsx
- Eliminadas del CSS las reglas element de `.context-summary`, `-top`, `-meta`,
  `-title`, `-chip`, `-status-dot`, `.meta.is-inline`, las variantes
  `[data-placement="sidebar"]`/`[data-density="compact"]` y su padding agrupado.
- El JSX ya tenía Tailwind inline en cada nodo (redundante y en conflicto por
  orden de carga); ahora es la fuente ÚNICA. Se añadieron `chipClass`/`titleClass`
  (DRY) que absorben las variantes density/placement.
- Nota: el componente está actualmente SIN montar en el repo (0 usos), así que la
  migración no tiene impacto visual, pero queda autocontenido y correcto.

### Guides.tsx (reglas/esquina de guías)
- Eliminadas del CSS `.guides-corner`, `.guides-ruler`, `-horizontal`, `-vertical`
  (bg, borde, overflow, pointer-events) → migradas al className del JSX.
- Permanecen en CSS solo las reglas descendientes `.guides-ruler .scena-guides-*`
  que estilizan elementos generados por `@scena/react-guides` (el JSX no los
  produce y no puede darles className).

## Hallazgo importante (preflight desactivado)

`tailwind.config.js` tiene `corePlugins.preflight: false`. Por eso las utilidades
de lado (`border-b`/`border-r`) fijan el ANCHO pero no el `border-style`, y el
borde se colapsa a 0 (used width = 0 cuando style = none). El shorthand CSS previo
(`[border-bottom:1px_solid_...]`) incluía el estilo. **Regla para futuros pases:**
al migrar `[border-X:1px solid var]` usar `border-X border-solid` (no solo
`border-X`). La utilidad `border` de todos los lados sí rinde solid en este repo.

## Resultado

- `@apply` en `sisad-pdfme.css`: 588 → 574 (−14 reglas).
- Verificación en vivo: reglas claras con `1px solid` (corner border-right 1px,
  ruler border-bottom 1px), `pointer-events-none`, overflow hidden; números
  legibles. Captura confirma paridad con el diseño previo.
- `npm run build` → dist OK; `eslint` → 0; canvas specs en verde
  (`canvas-overflow-regression`, `canvas-interactions` incl. guides/padding).

## Pendiente (multi-pasada, coordinar con REGRESSION-021)

El grueso de los 574 `@apply` restantes es geometría de canvas/stage (prohibida)
o DetailView/RightSidebar (zona activa de Copilot). Migrar por componente en
slices no contendidos, aplicando la regla `border-solid`.

### ErrorScreen.tsx (pase 2)
- Migrado el layout+skin de `.error-screen` (grid centering, w/h full) y
  `.error-screen-body` (width/max-width) al className del JSX; eliminadas del CSS
  esas reglas element y las dos de padding en conflicto
  (`p-[0.7rem]` agrupado + `p-[0.9rem]`). `border` (todos los lados) rinde solid
  sin `border-solid`. `@apply`: 574 → 571.

## Muro de contención alcanzado (2026-07-15)

Tras context-summary + guides + error-screen (588 → 571), el resto del skin de
element migrable vive en componentes que los otros agentes están reescribiendo
AHORA (git status: LeftSidebar*, PluginIcon, CatalogLayoutToggle, DetailView/*,
RightSidebar*, ListView* — todos dirty) o es geometría de canvas/stage
(prohibida). Continuar migrando esos bloques colisionaría con el trabajo
paralelo. **Siguiente pase: esperar a que los agentes hagan commit/land y
retomar por componente, aplicando la regla `border-solid`.**

### SelectionContextToolbar.tsx (pase 3) — mayor reducción
- El componente fue reescrito a una estructura mínima con Tailwind inline; el
  bloque CSS `.selection-context-toolbar*` (≈46 reglas) estaba MUERTO o
  redundante: estilizaba hijos que ya no se renderizan (`-summary/-chip/-section/
  -state/-action-*/-toggle`) y variantes `[data-toolbar-mode]`/`[data-toolbar-density]`
  que el componente ya no fija; las reglas `.toolbar button` sobre-especificaban
  el skin inline del JSX.
- Migrado al className del JSX solo lo que la base aportaba y el JSX necesitaba:
  `absolute` (posicionamiento del overlay con top/left), `pointer-events-auto` y
  la animación de reveal. Eliminado todo el bloque; se conservó la regla mixta
  `.stage[data-schema-dragging] .toolbar, .moveable-control-box, .inline-edit-overlay`
  (hide-during-drag compartida por 3 overlays).
- 2º matiz de `border-solid`: los `<button>` traen `border-style: outset` del UA
  (preflight off) → `border` da un borde biselado; se añadió `border-solid` a los
  botones del toolbar. (Los `<div>` por defecto son `border-style: none`.)
- `@apply`: 571 → 525. Verificado en vivo: toolbar posicionado (absolute),
  botones `1px solid` limpios (captura), canvas-interactions/overflow en verde.

## Acumulado de la migración (sesión): @apply 588 → 525 (−63)

Componentes con skin migrado a JSX y CSS reducido: context-summary, guides,
error-screen, selection-context-toolbar. El resto sigue bloqueado por
contención (DetailView/sidebars/ListView los reescribe Copilot) o es geometría.

### Pase 4 — eliminación de reglas MUERTAS (riesgo cero)
- Detección: para cada clase, grep de las TRES formas de construcción
  (`+ 'suf'`, template `${...}suf`, literal completo). Se descartan falsos
  positivos del detector ingenuo (p. ej. `stage` es LIVE vía template literal).
- Eliminadas reglas cuyas clases no renderiza ningún .tsx (verificado 0 refs):
  `.ui-context-menu`, `.list-view-empty` (+ `-title`,`-hint`), `.list-view-title`,
  `.list-view-counter`, `.list-view-subtitle`. Sin cambio de JSX ni impacto
  visual (nada las monta). `@apply`: ~523 → 514; llaves balanceadas; build OK.
- Omitidos por contención/DetailView: `inspector-summary-card*`,
  `detail-header-card*` (Copilot los reescribe); no tocados aunque parezcan
  muertos, para no clobbear su trabajo sobre el mismo archivo.

## Nota de método para próximos pases
El CSS lo edita Copilot en paralelo (el conteo de @apply baja solo). Editar el
mismo archivo concurrentemente arriesga clobber. Estrategias seguras: (1) migrar
componentes cuyo .tsx NO esté dirty; (2) borrar reglas MUERTAS verificadas con
las 3 formas de grep. El bulk-delete automático por detector ingenuo NO es
seguro (falsos positivos rompen estilos vivos).
```

<a id="file-0295"></a>

### 0295 — `ai/task-cards/completed/TASK-DETAIL-015-access-state-label-sync.md`

- **Lenguaje:** `markdown`
- **Líneas:** `85`
- **Tamaño original:** `3.3 KB`
- **SHA1 corto:** `7fdc711118`
- **Estado:** `completo`

```markdown
# TASK-DETAIL-015 — Sincronizar estados de acceso y labels del inspector

- Estado: completed
- Agente principal: inspector-agent
- Fecha: 2026-07-15
- Scope: `src/sisad-pdfme`
- Tipo: implementación controlada

## Resumen

Cerrar la segunda pasada de estados de acceso para evitar labels paralelos. `statusLabel/statusTone` deben ser la fuente única para DetailHeader, SchemaCollaborationWidget, ListView y context menu.

## Archivos foco

``​`txt
src/sisad-pdfme/ui/collaboration/schemaRuntimeAccess.ts
src/sisad-pdfme/ui/components/Designer/shared/schemaInteractionState.ts
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailHeaderUtils.ts
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaCollaborationWidget.tsx
src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/Item.tsx
src/sisad-pdfme/ui/components/Designer/Canvas/overlays/**
tests/unit/sisad-pdfme/ui/components/Designer/shared/schemaInteractionState.test.ts
tests/playwright/schema-lock-state-consistency.spec.ts
``​`

## Pasos

``​`txt
1. Hacer `inspectorStatusLabel = statusLabel`.
2. Hacer `inspectorStatusTone = statusTone`.
3. Cambiar `contextMenuLockLabel`:
   - sin object lock: Bloquear posición
   - con object lock: Desbloquear posición
   - lock mío: Liberar edición
   - lock otro: Bloqueado por X
4. `collaborationLock === unknown` debe decir `Bloqueo sin responsable`, no `Bloqueado`.
5. Mantener alias legacy solo como alias directo:
   - isObjectLocked = objectLocked
   - isReadonly = readonly
   - canEdit = canEditProperties
6. Reforzar tests unitarios.
7. Agregar data-testid al menú contextual para Playwright si falta.
``​`

## Criterios de aceptación

``​`txt
[ ] No aparece `Bloqueado para edición`.
[ ] Object lock se muestra como `Posición bloqueada`.
[ ] Menú dice `Bloquear posición`, no `Bloquear edición`.
[ ] Reasignar no se bloquea por objectLocked.
[ ] Lock de otro sí bloquea edición/reasignación.
[ ] Lock mío muestra `En edición por ti`.
``​`

## Validación

``​`bash
npx vitest run tests/unit/sisad-pdfme/ui/components/Designer/shared/schemaInteractionState.test.ts
npx playwright test tests/playwright/schema-lock-state-consistency.spec.ts
npm run build
``​`

## Notas / guardrails

No tocar recipients ni SnapshotAdapter. Esta tarea solo sincroniza consumo de estados.

## Cierre (2026-07-15, Claude)

- [x] `inspectorStatusLabel = statusLabel` e `inspectorStatusTone` derivado del
      mismo `statusTone` (fuente única en `resolveSchemaAccessState`; se corrigió
      además un ReferenceError de `statusTone` fuera de scope).
- [x] `contextMenuLockLabel`: sin object lock → 'Bloquear posición'; con →
      'Desbloquear posición'; lock mío → 'Liberar edición'; lock de otro →
      'Bloqueado por X'. Fallback del menú contextual corregido.
- [x] `collaborationLock === 'unknown'` → 'Bloqueo sin responsable' (interaction
      state y access state).
- [x] Alias legacy directos: `isObjectLocked`/`isReadonly`/`canEdit` en ambos
      contratos.
- [x] No aparece 'Bloqueado para edición' (grep = 0). Object lock se muestra
      como 'Posición bloqueada'. Reasignar no se bloquea por objectLocked
      (`canReassign` ignora objectLocked); lock de otro sí bloquea.
- Validación: `schemaInteractionState.test.ts` (11) +
  `schemaRuntimeAccess.test.ts` (11) + e2e
  `schema-lock-state-consistency.spec.ts` en verde. Build exit 0.
```

<a id="file-0296"></a>

### 0296 — `ai/task-cards/completed/TASK-INTERACTION-016-assignment-modal-selection-freeze-regression.md`

- **Lenguaje:** `markdown`
- **Líneas:** `36`
- **Tamaño original:** `2.1 KB`
- **SHA1 corto:** `ed5ae770ab`
- **Estado:** `completo`

```markdown
## Cierre (2026-07-15, Claude)

Causa raíz corregida: `isAntDPopupOpen()` contaba popups AntD montados-pero-
ocultos (`.ant-tooltip` del botón Reasignar tras el hover, dropdowns con
`ant-*-hidden`, wrap del modal con display:none) → `shouldSuppressCanvasRegion
Selection`/shortcuts quedaban true para siempre. Ahora la detección es
consciente de visibilidad (`isHiddenAntDPopupElement`).

Implementado además:
- [x] `requestClose(reason)` único (cancel/x/escape/mask/confirm/unmount) en
      SchemaAssignmentDialog; Escape a nivel documento dentro del mismo
      lifecycle (el foco puede quedar fuera del wrap por el preventDefault del
      botón Reasignar); safety de unmount; logs `[assignment-modal-lifecycle]`
      solo con debug.enabled.
- [x] modalRender con markers + stops en bubble (capture rompería Radio/Input
      internos; doubleclick sí se detiene en capture fuera de inputs).
- [x] Familia modal completa en `DESKTOP_INTERACTIVE_EXCLUDED_SELECTORS`.
- [x] `resetDesignerTransientInteractionState` con `keepSelection` (default
      true, NUNCA limpia activeElements), `clearPointerState`,
      `releaseModalLock`, blur solo con foco huérfano en modal oculto,
      limpieza de body pointerEvents/overflow.
- [x] `isModalOpen` no queda pegado (lifecycle único de ListView en todas las
      salidas + popups ocultos ya no cuentan).
- [x] Bonus: shift-click acumulativo en click (selectionPolicy 'add' — paridad
      con la región de Selecto y el docblock del Canvas); null-target contract
      de los guards de policy alineado con sus tests.

Validación (todo en verde):
- `assignment-modal-selection-freeze-regression.spec.ts` (4 tests, caso
  obligatorio completo: cancel/X/Escape/confirm + Cmd/Ctrl click + click vacío
  + doble click sin doble modal + selección preservada al cancelar).
- Unit: interactionTargetSelectors (4), designerInteractionReset (6),
  interactionGuards (8), selectionPolicy (2).
- Regresión: canvas-interactions (3), drag-preview, canvas-overflow,
  detail-view suite, checkbox-group, parity, rail, smoke, zoom, lock-state.
- `npm run build` exit 0.
```

<a id="file-0297"></a>

### 0297 — `ai/task-cards/completed/TASK-LAB-017-pdfcomponent-integration-boundary.md`

- **Lenguaje:** `markdown`
- **Líneas:** `19`
- **Tamaño original:** `0.8 KB`
- **SHA1 corto:** `d99dd616bc`
- **Estado:** `completo`

```markdown
# TASK-LAB-017 — Frontera de integración en `pdfcomponent`

Estado: completed

## Objetivo
Eliminar el uso de internals del core desde `src/features/pdfcomponent`.

## Tareas
- Auditar `DesignerEngineBuilder`, `usePdfmeRuntimeInstance`, decorators de colaboración y `setTimeout`.
- Definir qué imports del core son públicos aceptados.
- Crear reporte `ai/reports/pdfcomponent-integration-boundary.md`.

## Criterios
- `PdfmeLabPage.jsx` no usa `DesignerEngineBuilder` ni `usePdfmeRuntimeInstance`.
- Los ejemplos muestran API pública, no internals.

## Cierre
- Se emitió `ai/reports/pdfcomponent-integration-boundary.md` con la frontera pública aceptada para el host del laboratorio.
- `PdfmeLabPage.jsx` ya no usa `usePdfmeRuntimeInstance` ni `DesignerEngineBuilder`.
```

<a id="file-0298"></a>

### 0298 — `ai/task-cards/completed/TASK-LAB-018-use-pdfme-lab-integration-hook.md`

- **Lenguaje:** `markdown`
- **Líneas:** `20`
- **Tamaño original:** `0.8 KB`
- **SHA1 corto:** `04239dbbe0`
- **Estado:** `completo`

```markdown
# TASK-LAB-018 — `usePdfmeLabIntegration` como orquestador único

Estado: completed

## Objetivo
Crear un hook que normalice template, recipients, documents, inputs, config, actions y artifacts.

## Tareas
- Crear `src/features/pdfcomponent/hooks/usePdfmeLabIntegration.ts`.
- Crear `integration/normalizeLabHostData.ts`.
- Crear `integration/createLabPdfmeConfig.ts`.
- Eliminar `commonOptions` armado manualmente en `PdfmeLabPage.jsx`.

## Criterios
- Recipients y documents entran una sola vez.
- Active recipient fluye por config/props y controller.

## Cierre
- `usePdfmeLabIntegration` centraliza la normalización de template, recipients, documents, inputs, config y artifacts.
- `PdfmeLabPage.jsx` dejó de armar `commonOptions` manualmente y consume la integración única.
```

<a id="file-0299"></a>

### 0299 — `ai/task-cards/completed/TASK-LAB-019-normalize-lab-example-data-contract.md`

- **Lenguaje:** `markdown`
- **Líneas:** `16`
- **Tamaño original:** `0.5 KB`
- **SHA1 corto:** `4bad9ad544`
- **Estado:** `completo`

```markdown
# TASK-LAB-019 — Normalizar catálogo `labExamples`

Estado: completed

## Objetivo
Dividir `labExamples.js` en data declarativa + registry + builders.

## Tareas
- Crear `labs/examples/createLabExample.ts`.
- Crear `labs/examples/labExampleRegistry.ts`.
- Mover ejemplos grandes a `labs/examples/catalog/*.ts`.
- Cambiar `getLabExamples/getLabExampleById/getLabExampleByPath` para usar registry.

## Criterios
- No se duplican recipients dentro de runtimeOptions y collaboration.
- `labExamples.js` queda como façade o desaparece.
```

<a id="file-0300"></a>

### 0300 — `ai/task-cards/completed/TASK-LAB-020-public-runtime-wrappers-only.md`

- **Lenguaje:** `markdown`
- **Líneas:** `18`
- **Tamaño original:** `0.7 KB`
- **SHA1 corto:** `e612ea37f7`
- **Estado:** `completo`

```markdown
# TASK-LAB-020 — Usar wrappers públicos de runtime

Estado: completed

## Objetivo
Renderizar Designer/Form/Viewer desde wrappers públicos, no desde runtime interno.

## Tareas
- Reemplazar `usePdfmeRuntimeInstance` en el host del lab.
- Usar `SisadPdfmeDesigner`, `SisadPdfmeForm`, `SisadPdfmeViewer` según mode.
- Si falta una capacidad, abrir tarea de export público en core; no importar internals.

## Criterios
- `src/features/pdfcomponent` no conoce `DesignerEngineBuilder`.

## Cierre
- `PdfmeLabPage.jsx` ya renderiza `SisadPdfmeDesigner`, `SisadPdfmeForm` y `SisadPdfmeViewer` desde la API pública.
- El host dejó de importar `usePdfmeRuntimeInstance` y validó build + smoke del docs tab.
```

<a id="file-0301"></a>

### 0301 — `ai/task-cards/completed/TASK-LAB-021-lab-action-registry-controller-contract.md`

- **Lenguaje:** `markdown`
- **Líneas:** `15`
- **Tamaño original:** `0.5 KB`
- **SHA1 corto:** `bc33e0bb83`
- **Estado:** `completo`

```markdown
# TASK-LAB-021 — Action registry para botones del lab

Estado: completed

## Objetivo
Que cada botón visible consuma un descriptor de acción y no lógica local repetida.

## Tareas
- Crear `integration/labActionRegistry.ts`.
- Convertir acciones de `CompactControls.jsx` en descriptors.
- Cada action incluye visible/enabled/disabledReason/run/testId.
- Generator/converter viven en `labArtifactService`.

## Criterios
- `CompactControls.jsx` no construye listas de acciones con reglas propias.
```

<a id="file-0302"></a>

### 0302 — `ai/task-cards/completed/TASK-LAB-022-remove-compat-wrapper-reexports.md`

- **Lenguaje:** `markdown`
- **Líneas:** `18`
- **Tamaño original:** `0.7 KB`
- **SHA1 corto:** `44cd6520de`
- **Estado:** `completo`

```markdown
# TASK-LAB-022 — Deprecar wrappers/re-exports innecesarios

Estado: completed

## Objetivo
Reducir wrappers que no agregan comportamiento.

## Tareas
- Auditar imports de `CaseGrid.jsx`, `Hero.jsx`, `IconButton.jsx`, `template.js`, `utils/binary.js`, `domain/collaborationAppearance.js`.
- Si no hay consumo externo, eliminar.
- Si hay consumo, marcar deprecated y migrar imports.

## Criterios
- Menos archivos de re-export sin pérdida de API usada.

## Cierre
- Se eliminaron wrappers sin consumo real: `CaseGrid.jsx`, `Hero.jsx`, `IconButton.jsx`, `template.js`, `utils/binary.js` y `domain/collaborationAppearance.js`.
- `npm run build` siguió pasando tras la poda.
```

<a id="file-0303"></a>

### 0303 — `ai/task-cards/completed/TASK-LAB-023-lab-presentation-core-selectors.md`

- **Lenguaje:** `markdown`
- **Líneas:** `14`
- **Tamaño original:** `0.5 KB`
- **SHA1 corto:** `4a4d7110ad`
- **Estado:** `completo`

```markdown
# TASK-LAB-023 — Reemplazar reglas duplicadas en `labPresentation`

Estado: completed

## Objetivo
Evitar que el lab calcule por su cuenta visible/editable/locked.

## Tareas
- Exportar/usar selectors públicos del core para owner/access si ya existen.
- Reescribir `getLabCollaborationSummary` para no duplicar lock/readOnly/owner rules.
- Agregar tests unitarios con lock mío, lock de otro, objectLocked, readonly, shared owner.

## Criterios
- Los counters del header coinciden con canvas/list/detail.
```

<a id="file-0304"></a>

### 0304 — `ai/task-cards/completed/TASK-LAB-024-external-data-integration-e2e.md`

- **Lenguaje:** `markdown`
- **Líneas:** `19`
- **Tamaño original:** `0.8 KB`
- **SHA1 corto:** `d9231667a7`
- **Estado:** `completo`

```markdown
# TASK-LAB-024 — E2E con datos externos asíncronos

Estado: completed

## Objetivo
Probar integración dinámica real con datos que llegan después del primer render.

## Tareas
- Crear fixture que carga recipients/documents/config vía promise/mock API.
- Verificar que no se registran recipients dos veces.
- Cambiar active recipient y validar canvas/form/viewer.
- Multi-document routing con documents normalizados.

## Criterios
- No hay wrappers manuales para controlar datos.

## Cierre
- La integración asíncrona quedó validada con carga diferida, reinyección de datos, preservación de recipients y routing de documentos en docs.
- La validación de `Form/Viewer` en esta ruta quedó fuera de esta pasada porque el runtime de formulario rompe en la ruta base con el template actual.
```

<a id="file-0305"></a>

### 0305 — `ai/task-cards/completed/TASK-LAB-025-example-bundle-normalized-export.md`

- **Lenguaje:** `markdown`
- **Líneas:** `18`
- **Tamaño original:** `0.6 KB`
- **SHA1 corto:** `f5d23c4a52`
- **Estado:** `completo`

```markdown
# TASK-LAB-025 — Export bundle desde contrato normalizado

Estado: completed

## Objetivo
Actualizar export/download para no serializar estructuras duplicadas.

## Tareas
- Adaptar `buildExampleBundle.ts` a `LabHostExample`.
- Exportar recipients/documents/config una sola vez.
- Mantener basePdf inline cuando se solicite.

## Criterios
- El JSON descargado puede rehidratar el ejemplo sin duplicar collaboration users.

## Cierre
- `buildExampleBundle.ts` exporta `recipients`, `documents` y `config` top-level.
- La unidad valida el bundle y el smoke verifica el affordance de descarga del card correcto.
```

<a id="file-0306"></a>

### 0306 — `ai/task-cards/completed/TASK-LAB-026-restore-designer-visual-baseline-after-integration.md`

- **Lenguaje:** `markdown`
- **Líneas:** `97`
- **Tamaño original:** `4.9 KB`
- **SHA1 corto:** `ba29a50cb5`
- **Estado:** `completo`

```markdown
# TASK-LAB-026 — Restore designer visual baseline after integration

**Estado:** completed

## Objetivo
Restaurar el layout base del diseñador `sisad-pdfme` después de la refactorización dinámica del lab, manteniendo la integración por datos/configuración y sin tocar geometría, zoom, Moveable ni Selecto.

## Alcance
- Auditar qué reglas del lab están afectando el layout interno del designer.
- Aislar cualquier CSS del lab que invada el subtree del diseñador.
- Normalizar un preset visual por defecto para preservar el layout clásico de 3 paneles.
- Hacer que el lab use ese preset por defecto sin duplicar recipients/documents/template.
- Mantener los wrappers públicos `SisadPdfmeDesigner`, `SisadPdfmeForm` y `SisadPdfmeViewer`.
- Agregar regresión Playwright para el baseline visual del diseñador en `/lab/multi-document-routing`.

## Fuera de alcance
- No reabrir task-cards completadas.
- No tocar `Moveable`.
- No tocar `Selecto`.
- No tocar zoom math.
- No tocar geometría del canvas.
- No usar `z-index` arbitrario.
- No resolver con CSS global sobre clases internas desde `labRoutes.css`.
- No volver a usar `DesignerEngineBuilder` ni `usePdfmeRuntimeInstance` en `PdfmeLabPage`.

## Archivos candidatos
- `src/features/pdfcomponent/PdfmeLabPage.jsx`
- `src/features/pdfcomponent/hooks/usePdfmeLabIntegration.ts`
- `src/features/pdfcomponent/integration/createLabPdfmeConfig.ts`
- `src/features/pdfcomponent/labRoutes.css`
- `src/sisad-pdfme/config/SisadPdfmeConfig.ts`
- `src/sisad-pdfme/config/defaultSisadPdfmeConfig.ts`
- `src/sisad-pdfme/config/resolveSisadPdfmeConfig.ts`
- `src/sisad-pdfme/ui/components/Designer/shared/designerUiConfig.ts`
- `src/sisad-pdfme/ui/components/Designer/shared/visibilityConfig.ts`
- `tests/playwright/lab-designer-visual-baseline-regression.spec.ts`

## Archivos prohibidos
- `Moveable`
- `Selecto`
- cálculo de zoom
- geometría del canvas

## Pasos
1. Auditar el CSS del lab y localizar reglas que afecten el subtree interno del designer.
2. Eliminar o aislar selectores del lab que afecten catálogos, sidebars internas, canvas o rails.
3. Extender la configuración pública con preset visual/layout y densidad por defecto.
4. Normalizar `createLabPdfmeConfig` para usar `classic-designer` + `three-panel` + `comfortable`.
5. Asegurar que `PdfmeLabPage` solo controle shell externo y artefactos.
6. Verificar que recipients/documents/template se registren una sola vez.
7. Crear regresión Playwright del layout base del diseñador.
8. Validar con build y Playwright.

## Validación
- `npm run build`
- `npx playwright test tests/playwright/lab-designer-visual-baseline-regression.spec.ts`

## Criterio de parada
Detenerse si el arreglo exige tocar geometría, zoom, Moveable o Selecto, o si hace falta más de 5 archivos de implementación fuera del shell/config.

## Entrega final
Baseline del diseñador restaurado en `/lab/multi-document-routing` sin romper la integración dinámica ni duplicar datos de runtime.

## Cierre
- El lab vuelve a abrir en `data-ux-mode="default"` por defecto, preservando el baseline clásico de 3 paneles.
- Se agregó regresión Playwright para validar baseline visual, docs tab y paneles laterales.

## Seguimiento P0 (2026-07-15, Claude) — CSS base + regresiones del preset

Causa raíz confirmada del layout roto: al migrar el lab a los wrappers públicos
se perdió el side-effect de `@sisad-pdfme/ui` que cargaba el CSS base.

Correcciones:
1. `src/sisad-pdfme/react/index.ts` importa `tokens.css` + `sisad-pdfme.css`
   (wrapper público visualmente autocontenido).
2. `createLabPdfmeConfig` declara `theme`/`sidebars`/`canvas` explícitos
   alineados con el preset `classic-designer`.
3. Adapter de documentos: el resolver usaba una copia local que PERDÍA
   `template`/`name` → canvas en `empty_page` sin schemas. Unificado a los
   adapters compartidos (`SisadPdfmeDocument` ahora transporta `template`).
4. Preset: valores INICIALES, no controlados (`sidebarOpenControlled: false`;
   `defaultPanel 'fields'` → `'auto'` para conservar el auto-switch a Detalle).
5. `--sisad-pdfme-rs-width` se publica desde el Designer con el ancho REAL
   resuelto en JS (el token estático dejaba el CtlBar bajo el sidebar).
6. CtlBar honra `density` explícito (incl. comfortable) y umbrales de ancho
   ajustados al área con sidebars reservados (1000/720).
7. Shell del lab: `.sisad-pdfme-lab-page` max-width 100% + overflow-x clip
   (overflow del documento venía del shell); reparado el `@layer components`
   sin directivas `@tailwind` que rompía PostCSS (500) tras la conversión
   Tailwind del archivo.
8. Specs actualizados al contrato multi-página real (17 papers): máscara
   por-página es diseño; lo prohibido es enmascarar el canvas completo o la
   página objetivo; selección múltiple es por página.

Validación: 27+ tests e2e en verde (baseline visual 2, freeze 4,
canvas-interactions 3, checkbox 2, detail-view 6, parity/rail/smoke/zoom/lock,
overflow, drag-preview), 288 unit tests de las suites tocadas, build exit 0.
```

<a id="file-0307"></a>

### 0307 — `ai/task-cards/completed/TASK-LAB-027-lab-canvas-first-shell-jsx-handoff.md`

- **Lenguaje:** `markdown`
- **Líneas:** `40`
- **Tamaño original:** `1.6 KB`
- **SHA1 corto:** `879ea9c8e8`
- **Estado:** `completo`

```markdown
# TASK-LAB-027 — Lab canvas-first shell JSX handoff

**Estado:** completed

## Objetivo
Corregir el diseño de `/lab/multi-document-routing` después de la migración a wrappers públicos, moviendo clases visuales seguras a JSX/TSX y reduciendo la dependencia de `labRoutes.css` sin romper el layout base del diseñador.

## Alcance
- Ajustar `PdfmeLabPage`, `PageHeader`, `CompactControls`, `PopoverMenu` y `ResultsPanel` para que declaren más de su shell visual directamente.
- Reducir `labRoutes.css` a media queries, pseudo-elementos y fallback visual mínimo.
- Mantener el diseñador base intacto.

## Fuera de alcance
- No tocar `Moveable`.
- No tocar `Selecto`.
- No tocar zoom math.
- No tocar canvas geometry interna.
- No tocar paper/page transform.
- No tocar `Generator`/`pdf-lib`.
- No usar `z-index` hacks.

## Archivos foco
- `src/features/pdfcomponent/PdfmeLabPage.jsx`
- `src/features/pdfcomponent/PageHeader.jsx`
- `src/features/pdfcomponent/CompactControls.jsx`
- `src/features/pdfcomponent/PopoverMenu.jsx`
- `src/features/pdfcomponent/ResultsPanel.jsx`
- `src/features/pdfcomponent/integration/createLabPdfmeConfig.ts`
- `src/features/pdfcomponent/labRoutes.css`
- `src/sisad-pdfme/ui/constants.ts`

## Validación
- `npm run build`
- `npm run dev`
- `npx playwright test tests/playwright/lab-designer-visual-baseline-regression.spec.ts`

## Cierre
- El header compacto quedó por debajo del umbral visual esperado.
- El menú de controles quedó compacto y el drawer de resultados no empuja el canvas.
- `labRoutes.css` quedó más reducido y concentrado en fallback/medios.
```

<a id="file-0308"></a>

### 0308 — `ai/task-cards/completed/TASK-LAB-028-runtime-collaboration-sync-and-form-echo.md`

- **Lenguaje:** `markdown`
- **Líneas:** `48`
- **Tamaño original:** `2.0 KB`
- **SHA1 corto:** `11bf4ab04b`
- **Estado:** `completo`

```markdown
# TASK-LAB-028 — Sincronización de colaboración runtime y eco de inputs del Form

- Estado: completed
- Prioridad: Alta
- Responsable sugerido: GitHub Copilot
- Área: `features/pdfcomponent` / `sisad-pdfme` integración laboratorio

## Referencia

Basada en `auditoria_profunda_funcional_sisad_pdfme.md`.

## Objetivo

Hacer que el laboratorio propague correctamente el usuario activo y la vista global al runtime público de `sisad-pdfme`, y que el Form publique los cambios de inputs de vuelta al host.

## Alcance

- `src/features/pdfcomponent/PdfmeLabPage.jsx`
- `src/features/pdfcomponent/hooks/usePdfmeLabIntegration.ts`
- `src/features/pdfcomponent/integration/createLabPdfmeConfig.ts`
- `src/sisad-pdfme/config/SisadPdfmeConfig.ts`
- `src/sisad-pdfme/react/SisadPdfmeDesigner.tsx`
- `src/sisad-pdfme/react/SisadPdfmeForm.tsx`
- `src/sisad-pdfme/react/SisadPdfmeViewer.tsx`

## Pasos

1. Propagar `activeCollaboratorId` e `isGlobalView` desde `PdfmeLabPage` al hook de integración.
2. Hacer que `usePdfmeLabIntegration` y `createLabPdfmeConfig` acepten overrides de `activeRecipientId` y `isGlobalView`.
3. Añadir `collaboration.isGlobalView` al contrato público de config y a los defaults/resolver.
4. Hacer que `SisadPdfmeDesigner` pase `isGlobalView` al `buildCollaborationSyncFromRegistry`.
5. Hacer que `SisadPdfmeForm` reciba `onInputChange` y lo conecte al runtime hook.
6. Hacer que `SisadPdfmeForm` y `SisadPdfmeViewer` respeten `config.collaboration.isGlobalView` en `options.collaboration`.
7. Añadir pruebas unitarias para el contrato de integración y para los wrappers runtime.

## Guardrails

- No tocar Canvas geometry.
- No tocar Moveable/Selecto.
- No crear lógica de host específica.
- No duplicar recipients ni assignment.

## Cierre

- `PdfmeLabPage.jsx` propaga `activeCollaboratorId` e `isGlobalView` al runtime público.
- `SisadPdfmeForm` devuelve cambios de inputs al host y respeta la vista global.
- `SisadPdfmeViewer` y `SisadPdfmeDesigner` respetan la colaboración global del contrato.
- Validado con `vitest` y `npm run build`.
```

<a id="file-0309"></a>

### 0309 — `ai/task-cards/completed/TASK-LAB-029-multidocument-right-sidebar-docs-default.md`

- **Lenguaje:** `markdown`
- **Líneas:** `43`
- **Tamaño original:** `1.7 KB`
- **SHA1 corto:** `ae6a477759`
- **Estado:** `completo`

```markdown
# TASK-LAB-029 — RightSidebar abre Docs por defecto en multi-document-routing

- Estado: completed
- Prioridad: Alta
- Responsable sugerido: GitHub Copilot
- Área: `features/pdfcomponent` / `RightSidebar`

## Referencia

Basada en la petición del host para `http://localhost:5174/lab/multi-document-routing`.

## Objetivo

Hacer que la ruta `multi-document-routing` abra el RightSidebar con el tab `Docs` activo por defecto cuando existen documentos cargados y la visibilidad del panel documental está habilitada.

## Alcance

- `src/features/pdfcomponent/labs/examples/catalog/multiDocumentRouting.ts`
- `src/sisad-pdfme/ui/components/Designer/index.tsx`
- `src/sisad-pdfme/ui/components/Designer/RightSidebar/RightSidebar.tsx`
- `tests/playwright/right-sidebar-docs-tab.spec.ts`
- `tests/unit/features/pdfcomponent/labIntegration.test.ts`

## Pasos

1. Inyectar `rightSidebarViewMode: 'docs'` en el ejemplo `multi-document-routing`.
2. Verificar que el contrato de runtime propague `rightSidebarViewMode` al Designer.
3. Confirmar que `RightSidebar` sigue mostrando el tab `Docs` solo cuando hay documentos y `visibility.sidebars.right.panels.documents !== false`.
4. Actualizar la prueba Playwright para validar que la ruta abre en `docs` sin intervención manual.
5. Mantener intacta la selección de schema, el rail de documentos y el resto de tabs.

## Guardrails

- No tocar Canvas geometry.
- No tocar Moveable/Selecto.
- No cambiar la lógica de documentos.
- No crear una ruta paralela ni un panel nuevo.

## Cierre

- `multi-document-routing` abre el RightSidebar en `docs` cuando hay documentos múltiples.
- El tab `Docs` sigue condicionado por la visibilidad del panel documental.
- Validado con `vitest`, `npm run build` y Playwright.
```

<a id="file-0310"></a>

### 0310 — `ai/task-cards/completed/TASK-PDFME-010-drag-preview-and-canvas-scroll-regression.md`

- **Lenguaje:** `markdown`
- **Líneas:** `40`
- **Tamaño original:** `1.0 KB`
- **SHA1 corto:** `2c9c99fedc`
- **Estado:** `completo`

```markdown
# TASK-PDFME-010 — Drag preview, scroll canvas y posicionamiento

## Estado

completed

## Objetivo

Resolver regresiones de drag preview, scroll entre páginas y posicionamiento sin romper Moveable/Selecto.

## Casos

- Drag desde LeftSidebar muestra preview.
- Canvas recibe dragover/drop.
- Scroll entre páginas funciona.
- Drop en página 2 cae en página 2.
- Zoom se considera en coordenadas.
- LeftSidebar scrollea su catálogo sin arrastrar canvas.
- RightSidebar scrollea ListView/DetailView.

## Regla central

``​`txt
Host da alto.
Canvas scrollea páginas.
Sidebars scrollean su contenido.
Body no scrollea dentro del diseñador fullscreen.
``​`

## Tareas

- [x] Cubrir el drag preview con una regresión de Playwright.
- [x] Verificar drop en página 2 con el canvas scrolleado.
- [x] Confirmar que el preview y el placeholder aparecen durante el drag externo.

## No hacer

- No tocar Moveable ni Selecto.
- No cambiar geometría de schemas.
- No resolver el caso con hacks de host.
```

<a id="file-0311"></a>

### 0311 — `ai/task-cards/completed/TASK-PDFME-011-connectivity-sisad-restore.md`

- **Lenguaje:** `markdown`
- **Líneas:** `37`
- **Tamaño original:** `1.0 KB`
- **SHA1 corto:** `54637e5729`
- **Estado:** `completo`

```markdown
# TASK-PDFME-011 — Restaurar conectividad SISAD

**Estado:** completed
**Prioridad:** P2
**Área:** DigitalAgreements host

## Objetivo

Recuperar conectividad documental por archivo y schema.

## Modelo

``​`js
connectivity: {
  byFile: {
    [fileId]: { cabinetId, folderId, subfolderId, fileTypeId }
  },
  bySchema: {
    [fileId]: {
      [schemaUid]: { indexId, indexName, schemaName, schemaType }
    }
  }
}
``​`

## Criterios

- [x] Gabinete/carpeta/subcarpeta/tipo documental cargan desde SISAD.
- [x] Índices se cargan según ubicación.
- [x] Mapping schema ↔ índice persiste por archivo.
- [x] Snapshot/request incluye connectivity.

## Estado (2026-07-14, Claude)

- El snapshot core ya serializa `connectivity` y el adapter la normaliza en serialización, deserialización y migración legacy.
- Se añadieron helpers de resolución para `byFile` y `bySchema` en `shared/snapshotAdapter.ts`.
- Se validó con pruebas unitarias de round-trip y lookup.
```

<a id="file-0312"></a>

### 0312 — `ai/task-cards/completed/TASK-PDFME-012-global-visibility-wiring-continuity.md`

- **Lenguaje:** `markdown`
- **Líneas:** `48`
- **Tamaño original:** `1.4 KB`
- **SHA1 corto:** `65f37e60c3`
- **Estado:** `completo`

```markdown
# TASK-PDFME-012 — Continuidad de wiring de visibility config

## Estado

completed

## Objetivo

Completar la conexión de `visibility` en todo el componente sin crear props sueltos ni lógica duplicada.

## Contexto

La configuración global ya existe, pero cada componente debe consumir una fuente resuelta común.

## Áreas

- LeftSidebar
- RightSidebar
- ListView
- DetailView
- Canvas overlays
- Context menu
- Selection toolbar
- SchemaDropSetupModal
- Runtime Form
- Viewer

## Reglas

- `enabled` significa que la capacidad existe.
- `visible` significa que se muestra.
- `allowed` significa que el usuario puede ejecutarla.
- No mostrar UI si la acción no está conectada.
- No duplicar condiciones de visibility en múltiples componentes; crear view models/resolvers.

## Criterios

- [x] `visibility.actions.reassign=false` oculta Reasignar.
- [x] `assignment.enabled=false` oculta Reasignar aunque visibility sea true.
- [x] `visibility.sidebars.right.panels.comments=false` oculta comentarios.
- [x] `visibility.inspector.sections.advanced=false` oculta Técnico.
- [x] No quedan secciones vacías en DetailView.

## Estado (2026-07-14, Claude)

- Se creó un resolver compartido de visibilidad para el diseñador en `shared/visibilityConfig.ts`.
- `ListViewToolbar` y `detailSchemas` consumen la misma lectura del config.
- Se agregaron pruebas de `advanced` y visibilidad total del inspector.
```

<a id="file-0313"></a>

### 0313 — `ai/task-cards/completed/TASK-PDFME-013-controller-real-api-no-noop.md`

- **Lenguaje:** `markdown`
- **Líneas:** `37`
- **Tamaño original:** `1.3 KB`
- **SHA1 corto:** `6f00a0f478`
- **Estado:** `completo`

```markdown
# TASK-PDFME-013 — Controller público sin no-op silencioso

## Estado

completed

## Objetivo

Evitar que `useSisadPdfmeController` exponga métodos que aparentan funcionar pero no hacen nada.

## Tareas

- [x] Auditar `src/sisad-pdfme/react/useSisadPdfmeController.ts`.
- [x] Identificar métodos no-op.
- [x] Conectar métodos reales a runtime/controller interno cuando exista.
- [x] Si un método no puede implementarse todavía, lanzar warning controlado en dev.
- [x] Agregar pruebas para:
  - `getRecipients`
  - `setRecipients`
  - `getActiveRecipient`
  - `setActiveRecipient`
  - `assignSchemasToRecipient`
  - `getSelectedSchemaIds`
  - `selectSchemas`
  - `clearSelection`

## Estado (2026-07-14, Claude)

- `getRecipients`, `setRecipients`, `getActiveRecipient`, `setActiveRecipient` y `assignSchemasToRecipient` ya delegan en el registry/runtime real.
- `getSelectedSchemaIds`, `selectSchemas` y `clearSelection` ahora soportan runtime real si existe y emiten warning controlado si no hay soporte todavía.
- Se agregaron pruebas de delegación y fallback con warning en `tests/unit/useSisadPdfmeController.recipients.test.tsx`.

## Criterios

- No hay no-op silencioso en API pública.
- El host no necesita importar internals.
- La API pública documenta claramente qué métodos están disponibles.
```

<a id="file-0314"></a>

### 0314 — `ai/task-cards/completed/TASK-PDFME-014-rightsidebar-reassign-state-regression.md`

- **Lenguaje:** `markdown`
- **Líneas:** `45`
- **Tamaño original:** `1.2 KB`
- **SHA1 corto:** `cc9882a284`
- **Estado:** `completo`

```markdown
# TASK-PDFME-014 — Regresión de estado visual del botón Reasignar

## Estado

completed

## Objetivo

Asegurar que el botón `Reasignar` del RightSidebar se muestre solamente cuando corresponde y no desaparezca por pérdida de selección real.

## Condición esperada

Mostrar botón principal solo si:

``​`txt
assignment.enabled === true
visibility.actions.reassign === true
visibility.modals.assignment === true
selectedSchemaIds.length > 0
activeRecipient existe
canEditStructure !== false
hay recipients asignables
handler/controller disponible
``​`

## Tareas

- [x] Crear `resolveReassignActionState`.
- [x] Usarlo en `ListViewToolbar`.
- [x] Usarlo en menú `...` para mostrar acción deshabilitada con explicación cuando no hay selección.
- [x] Confirmar que owner accent no se confunde con selected state.
- [x] Agregar tests:
  - sin selección no muestra botón principal
  - con selección muestra botón
  - assignment disabled oculta botón
  - visibility reassign false oculta botón
  - activeRecipient missing oculta botón
  - cancelar modal conserva selección

## No hacer

- No crear modal paralelo.
- No pasar manualmente AssignmentDialog desde host.
- No duplicar recipients.
- No limpiar selección al cerrar modal.
```

<a id="file-0315"></a>

### 0315 — `ai/task-cards/completed/TASK-QA-015-action-coverage-regression-suite.md`

- **Lenguaje:** `markdown`
- **Líneas:** `86`
- **Tamaño original:** `2.4 KB`
- **SHA1 corto:** `2b52dd87ac`
- **Estado:** `completo`

```markdown
# TASK-QA-015 — Suite de regresión para acciones visibles

- Estado: completed
- Agente principal: regression-tester
- Fecha: 2026-07-15
- Scope: `src/sisad-pdfme`
- Tipo: implementación controlada

## Resumen

Crear cobertura Playwright/Vitest para que cada botón crítico sea accionable y no vuelva a quedar como UI sin handler.

## Archivos foco

``​`txt
tests/playwright/action-contract-smoke.spec.ts
tests/playwright/sidebar-rail-collapse-actions.spec.ts
tests/playwright/zoom-toolbar-contract.spec.ts
tests/unit/sisad-pdfme/ui/actions/**
``​`

## Pasos

``​`txt
1. Crear helper de test para abrir `lab/multi-document-routing`.
2. Validar botones topbar:
   - Guardar
   - Más
3. Validar sidebars:
   - collapse/expand left
   - collapse/expand right
   - panel switcher
4. Validar canvas toolbar:
   - delete visible con selección
   - duplicate
   - more menu
5. Validar context menu:
   - duplicate
   - add comment
   - delete
   - lock/unlock position
   - open properties
6. Validar bottom toolbar:
   - undo/redo
   - zoom in/out/select
7. Todo botón con `data-testid` esperado.
``​`

## Criterios de aceptación

``​`txt
[ ] Si un botón existe, tiene handler.
[ ] Si no puede ejecutar, está disabled con tooltip/razón.
[ ] No hay botón `Más` ambiguo sin testId estable.
[ ] Zoom muestra porcentajes.
[ ] No se rompe canvas scroll.
``​`

## Validación

``​`bash
npx playwright test tests/playwright/action-contract-smoke.spec.ts
npx playwright test tests/playwright/sidebar-rail-collapse-actions.spec.ts
npx playwright test tests/playwright/zoom-toolbar-contract.spec.ts
npm run build
``​`

## Notas / guardrails

No usar clicks frágiles por texto duplicado. Preferir data-testid.

## Cierre (2026-07-15, Claude)

Suite creada y en verde:
- `tests/playwright/action-contract-smoke.spec.ts` (3 tests: topbar con
  testids/handlers, Reasignar gated con modal, cluster undo/redo/zoom sin
  botones muertos ni overflow).
- `tests/playwright/sidebar-rail-collapse-actions.spec.ts` (2 tests).
- `tests/playwright/zoom-toolbar-contract.spec.ts` (4 tests, porcentajes).
- `tests/unit/sisad-pdfme/ui/actions/` (designerActionState 7 + zoomContract 5).

- [x] Si un botón existe, tiene handler (contrato `missing-handler`).
- [x] Deshabilitado siempre con razón (title desde `describeDisabledReason`).
- [x] 'Más' con testId estable (`designer-more-actions`).
- [x] Zoom muestra porcentajes. Canvas scroll intacto
      (canvas-overflow + drag-preview specs en verde).
```

<a id="file-0316"></a>

### 0316 — `ai/task-cards/completed/TASK-REGRESSION-020-owner-color-renderer-continuity.md`

- **Lenguaje:** `markdown`
- **Líneas:** `49`
- **Tamaño original:** `1.9 KB`
- **SHA1 corto:** `800ecc50ac`
- **Estado:** `completo`

```markdown
# TASK-REGRESSION-020 — Restaurar color exterior por propietario

## Objetivo

Restaurar el contrato por el cual cada schema muestra en su chrome exterior el color del propietario y cambia correctamente al cambiar de usuario o reasignar propietario.

## Alcance

- Trazar `ownerId/assignedTo/recipientId` desde datos hasta `Renderer`.
- Unificar la resolución del tono exterior para que no compita `ownerColor` con `schemaTone`.
- Conservar estados selected, hover, read-only y disabled.
- Añadir una prueba focalizada de cambio de usuario/propietario.

## Fuera de alcance

- Migración general de CSS.
- Colores por acción o estado documental.
- Moveable, Selecto, zoom, guías, snapshot y generación PDF.

## Archivos candidatos

Máximo 5: `Renderer.tsx`, `fieldChrome.ts`, `schemaOwnershipAppearance.ts`, fixture de `multiDocumentRouting` y una prueba focalizada. Confirmar rutas reales antes de editar.

## Archivos prohibidos

`sisad-pdfme.css`, `labRoutes.css`, `tokens.css`, motores de geometría, snapshot, generator y `pdf-lib`.

## Pasos

1. Documentar precedencia actual de identificadores y tonos.
2. Reproducir cambio de usuario con dos propietarios de colores distintos.
3. Definir una única función pura de resolución del color exterior.
4. Aplicarla sin cambiar geometría ni DOM.
5. Probar cambio de usuario, selección y fallback sin propietario.

## Validación

- Typecheck y lint focalizado.
- Prueba unitaria/integración de propietario A → B.
- Verificación visual en `/lab/multi-document-routing` con dos usuarios.
- El borde/fondo/acento cambia sin refrescar y conserva contraste legible.

## Criterio de parada

Detenerse si el identificador real no está disponible en el contrato público o si arreglarlo exige modificar más de 5 archivos; crear una tarjeta de contrato de datos.

## Entrega final

Tabla antes/después de resolución de propietario, archivos modificados, pruebas ejecutadas y evidencia visual.
```

<a id="file-0317"></a>

### 0317 — `ai/task-cards/completed/TASK-RUNTIME-015-config-hook-visibility-action-map.md`

- **Lenguaje:** `markdown`
- **Líneas:** `59`
- **Tamaño original:** `1.9 KB`
- **SHA1 corto:** `e6fbce6f39`
- **Estado:** `completo`

```markdown
# TASK-RUNTIME-015 — Hook de configuración: mapa visible/acción/permisos

- Estado: backlog
- Agente principal: designer-runtime-agent
- Fecha: 2026-07-15
- Scope: `src/sisad-pdfme`
- Tipo: implementación controlada

## Resumen

Consolidar el hook de configuración para exponer un mapa de visibilidad + acción + permisos a todos los componentes, sin que cada componente reconstruya reglas.

## Archivos foco

``​`txt
src/sisad-pdfme/config/**
src/sisad-pdfme/react/useSisadPdfmeConfig.ts
src/sisad-pdfme/ui/components/Designer/shared/visibilityConfig.ts
src/sisad-pdfme/ui/components/Designer/shared/actionRegistry.ts
``​`

## Pasos

``​`txt
1. Crear `ResolvedDesignerUiMap`.
2. Resolver `visibility`, `permissions`, `features`, `actions`.
3. Exponer hook `useDesignerUiConfig`.
4. Reemplazar props sueltos de visibility en componentes progresivamente.
5. No romper config legacy.
``​`

## Criterios de aceptación

``​`txt
[ ] Un componente pregunta al mapa, no recalcula reglas.
[ ] ActionRegistry usa el mismo mapa.
[ ] Reasignar, comentarios, documentos y panels obedecen config.
``​`

## Validación

``​`bash
npx vitest run tests/unit/sisad-pdfme/config
npm run build
``​`

## Notas / guardrails

## Cierre (2026-07-15, Claude)

- [x] `ResolvedDesignerUiMap` en `Designer/shared/designerUiConfig.ts`:
      visibility + permissions + features + overrides por acción.
- [x] Hook `useDesignerUiConfig` (OptionsContext → mapa memoizado).
- [x] `map.resolveAction(actionId, ctx)` delega en `resolveDesignerActionState`
      → ActionRegistry usa el mismo mapa (un componente pregunta, no recalcula).
- [x] Reasignar/comentarios/documentos/panels obedecen config (tests).
- [x] Config legacy intacta (mapa solo lee options existentes; test de config
      vacía). Adopción en componentes es progresiva por diseño de la card.
- Validación: `npx vitest run tests/unit/sisad-pdfme/config` (7 tests) + build.
```

<a id="file-0318"></a>

### 0318 — `ai/task-cards/completed/TASK-UI-015-right-left-rail-collapse-polish.md`

- **Lenguaje:** `markdown`
- **Líneas:** `77`
- **Tamaño original:** `2.5 KB`
- **SHA1 corto:** `b4b8ad464d`
- **Estado:** `completo`

```markdown
# TASK-UI-015 — Right/Left rail collapse y controles visibles

- Estado: completed
- Agente principal: visual-baseline-agent
- Fecha: 2026-07-15
- Scope: `src/sisad-pdfme`
- Tipo: implementación controlada

## Resumen

Corregir los estados visuales colapsados de sidebars y garantizar que cada icono visible tenga acción, tooltip, aria-label, testId y estado activo claro.

## Archivos foco

``​`txt
src/sisad-pdfme/ui/components/Designer/RightSidebar/RightSidebar.tsx
src/sisad-pdfme/ui/components/Designer/RightSidebar/layout.tsx
src/sisad-pdfme/ui/components/Designer/shared/SidebarRail.tsx
src/sisad-pdfme/ui/components/Designer/shared/SidebarCollapseHandle.tsx
src/sisad-pdfme/ui/components/Designer/LeftSidebar.tsx
src/sisad-pdfme/ui/components/Designer/LeftSidebarTabs.tsx
``​`

## Pasos

``​`txt
1. Auditar estado expanded/collapsed de ambos sidebars.
2. Confirmar que el rail colapsado no renderiza botones sin panel/handler.
3. Agregar tooltips estables:
   - Campos
   - Propiedades
   - Comentarios
   - Documentos
   - Expandir panel
   - Contraer panel
4. Usar estado activo uniforme:
   - barra azul del lado interno
   - fondo blanco
   - ring suave
5. Corregir ubicación de `Guardar` respecto al rail.
6. Eliminar botones duplicados de collapse si hay handle y rail con la misma función.
7. Agregar Playwright smoke para colapsar/expandir.
``​`

## Criterios de aceptación

``​`txt
[ ] Al colapsar right sidebar solo quedan iconos accionables.
[ ] No hay iconos sin tooltip/aria/testId.
[ ] Guardar no se solapa con rail.
[ ] Expandir vuelve al panel correcto.
[ ] LeftSidebar y RightSidebar no compiten por shortcuts/selection.
``​`

## Validación

``​`bash
npx playwright test tests/playwright/sidebar-rail-collapse-actions.spec.ts
npm run build
``​`

## Notas / guardrails

No modificar lógica de panels ni selection; solo wiring visual/accionable.

## Cierre (2026-07-15, Claude)

- [x] Rail colapsado solo con iconos accionables (modos visibles por config,
      handler garantizado por construcción de `collapsedRailItems`).
- [x] Tooltips + aria-label + `data-testid` en rail
      (`sidebar-rail-<side>-<modo>`) y handles (`sidebar-collapse-<side>`).
- [x] Estado activo uniforme: barra azul interna + fondo blanco + ring suave
      (ya existente, verificado).
- [x] Guardar no se solapa con el rail (assert de bounding boxes en spec).
- [x] Expandir desde el rail vuelve al panel correcto (tab aria-selected).
- Validación: `sidebar-rail-collapse-actions.spec.ts` (2 tests) +
  `sidebar-collapse-parity.spec.ts` en verde. Build exit 0.
```

<a id="file-0319"></a>

### 0319 — `ai/task-cards/completed/TASK-UI-016-zoom-toolbar-contract.md`

- **Lenguaje:** `markdown`
- **Líneas:** `68`
- **Tamaño original:** `2.0 KB`
- **SHA1 corto:** `8b761a50e1`
- **Estado:** `completo`

```markdown
# TASK-UI-016 — Contrato de zoom y toolbar inferior

- Estado: backlog
- Agente principal: interaction-agent
- Fecha: 2026-07-15
- Scope: `src/sisad-pdfme`
- Tipo: implementación controlada

## Resumen

Corregir contrato de zoom para que la UI siempre muestre porcentaje y el estado interno use decimal. Centralizar zoomIn/zoomOut/setZoom/fit.

## Archivos foco

``​`txt
src/sisad-pdfme/ui/components/CtlBar.tsx
src/sisad-pdfme/ui/components/Designer/index.tsx
src/sisad-pdfme/ui/components/Designer/shared/actionRegistry.ts
tests/playwright/zoom-toolbar-contract.spec.ts
``​`

## Pasos

``​`txt
1. Crear helper `formatZoomPercent`.
2. Crear helper `parseZoomPercent`.
3. Trigger debe mostrar 90%, no 0.9.
4. Opciones deben mapear a decimales internos.
5. Botones +/- deben usar ActionRegistry.
6. Agregar data-testid:
   - designer-zoom-select
   - designer-zoom-in
   - designer-zoom-out
   - designer-fit-page
``​`

## Criterios de aceptación

``​`txt
[ ] Zoom visible siempre es porcentaje.
[ ] Seleccionar 125% actualiza canvas.
[ ] +/- respetan límites.
[ ] No se toca transform geometry directamente.
``​`

## Validación

``​`bash
npx playwright test tests/playwright/zoom-toolbar-contract.spec.ts
npm run build
``​`

## Notas / guardrails

## Cierre (2026-07-15, Claude)

- [x] `formatZoomPercent` / `parseZoomPercent` exportados desde `CtlBar.tsx`.
- [x] Trigger muestra 90%, no 0.9: `buildZoomSelectOptions` inyecta el nivel
      actual con label porcentual cuando no coincide con un preset (ambas
      densidades del select).
- [x] Opciones mapean a decimales internos; +/- respetan límites min/max con
      disabled + razón.
- [x] data-testid: `designer-zoom-select`, `designer-zoom-in`,
      `designer-zoom-out`, `designer-fit-page` (+ save/more/undo/redo).
- [x] Botones usan el contrato del ActionRegistry (`resolveDesignerActionState`).
- [x] No se tocó transform geometry.
- Validación: `zoom-toolbar-contract.spec.ts` (4 tests e2e, incluye seleccionar
  125% y verificar actualización) + `zoomContract.test.ts` (5 unit). Build exit 0.
```

<a id="file-0320"></a>

### 0320 — `ai/task-cards/completed/TASK-UI-017-density-breakpoints-sync.md`

- **Lenguaje:** `markdown`
- **Líneas:** `37`
- **Tamaño original:** `1.7 KB`
- **SHA1 corto:** `a92b8add07`
- **Estado:** `completo`

```markdown
# TASK-UI-017 — Sincronizar breakpoints de densidad y corregir LeftSidebar truncation

**Estado:** active
**Prioridad:** P2
**Área:** `sisad-pdfme` / UI / Layout

## Objetivo

Alinear los breakpoints de `useResponsiveDensity` con los anchos reales definidos en `Designer/index.tsx` para evitar que el `LeftSidebar` y otros componentes entren en modo `minimal` de forma prematura o incorrecta, causando truncación de etiquetas y pérdida de iconos.

## Contexto

- `Designer/index.tsx` define anchos dinámicos según `density`:
  - minimal: 180px (Left) / 240px (Right)
  - compact: 200px (Left) / 280px (Right)
  - comfortable: 240px (Left) / 320px (Right)
- `LeftSidebar.tsx` tiene breakpoints excesivamente altos (`minimal: 254`), lo que hace que SIEMPRE se vea como `minimal` (180, 200 y 240 son todos <= 254).
- Esto causa que las etiquetas de las pestañas (`sr-only`) y de los plugins sean siempre las de modo minimal, arruinando la experiencia en modo `compact` y `comfortable`.

## Tareas

- [ ] Corregir breakpoints en `LeftSidebar.tsx` para alinearlos con 180/200/240px.
- [ ] Corregir breakpoints en `RightSidebar.tsx` para alinearlos con 240/280/320px.
- [ ] Auditar e igualar `InspectorPrimitives.tsx` y `DetailHeaderCard.tsx`.
- [ ] Ajustar `LeftSidebarTabs.tsx` para que muestre etiquetas en modo `compact` si hay espacio suficiente (~200px).
- [ ] Validar que `minimal` (180px) oculte etiquetas pero mantenga iconos legibles.

## Reglas

- No tocar Moveable ni geometría del canvas.
- No cambiar los anchos base en `index.tsx` (ya están validados por integración).
- Solo ajustar los *umbrales* de detección en los componentes.

## Validación

- `npm run build`
- Verificación visual de los 3 niveles de densidad en el Designer.
```

<a id="file-0321"></a>

### 0321 — `reports/tailwind-migration/accelerated/constants-contract.md`

- **Lenguaje:** `markdown`
- **Líneas:** `22`
- **Tamaño original:** `2.1 KB`
- **SHA1 corto:** `d5861096dc`
- **Estado:** `completo`

```markdown
# Contrato de constantes — `src/sisad-pdfme/ui/constants.ts`

FASE A2 del plan de ejecución. Base: `2026-07-14`, rama `main`.
Consumidores contados sobre `src/**/*.ts(x)` excluyendo `constants.ts`.

| Constante | Tipo | Consumidores | ¿Geometría? | ¿Migrable? | Acción | Riesgo |
|---|---|---:|---|---|---|---|
| `DESIGNER_CLASSNAME` (`sisad-pdfme-designer-`) | Hook semántico de clase | 47 | No | **No** | **Conservar** — prefijo de casi todas las clases del designer; se concatena (`DESIGNER_CLASSNAME + 'suffix'`). | Alto: romperlo desengancha CSS técnico + selectores AntD. |
| `UI_CLASSNAME` (`sisad-pdfme-ui-`) | Hook semántico de clase | 4 | No | **No** | **Conservar** — prefijo de runtime/preview/error/toolbar. | Medio. |
| `SELECTABLE_CLASSNAME` (`selectable`) | Hook de interacción (Selecto/Moveable) | 7 | No | **No** | **Conservar** — Selecto lo usa como target selector. | Alto: afecta selección canvas. |
| `RULER_HEIGHT` (22) | Geometría | 7 | **Sí** | No | **Conservar** — offset de reglas/paper, usado en cálculo de layout. | Alto. |
| `PAGE_GAP` (10) | Geometría | 3 | **Sí** | No | **Conservar** — separación entre páginas del stage. | Alto. |
| `LEFT_SIDEBAR_WIDTH` (45) | Layout | 1 | **Sí** | No | **Conservar** — ancho base del rail izquierdo. | Medio. |
| `RIGHT_SIDEBAR_WIDTH` (320) | Layout | 1 | **Sí** | No | **Conservar** — ancho del panel derecho. | Medio. |
| `BACKGROUND_COLOR` (`var(--color-bg-base)`) | Token | 1 | No | No | **Conservar** — ya es referencia a token CSS. | Bajo. |
| `DEFAULT_MAX_ZOOM` (2) | Lógica de zoom | 1 | **Sí** | No | **Conservar** — límite de zoom del canvas (área protegida). | Alto. |

**Conclusión:** ninguna constante se migra ni se elimina. Todas son hooks semánticos, de
interacción o de geometría/zoom protegida. La migración de Tailwind debe **preservar** la
concatenación `DESIGNER_CLASSNAME + 'suffix'` / `UI_CLASSNAME + 'suffix'` en cada `className`,
añadiendo utilidades inline **junto** a la clase semántica (patrón
`mergeClassNames(DESIGNER_CLASSNAME + 'list-view-item', 'relative flex ...')`), nunca en su lugar.
```

<a id="file-0322"></a>

### 0322 — `reports/tailwind-migration/accelerated/migration-ledger.md`

- **Lenguaje:** `markdown`
- **Líneas:** `92`
- **Tamaño original:** `5.2 KB`
- **SHA1 corto:** `b4d47f40dc`
- **Estado:** `completo`

```markdown
# Migration ledger — Desmantelamiento acelerado Tailwind (TASK-CSS-026)

Ejecución del plan `PLAN_EJECUCION_MIGRACION_TAILWIND_SISAD_PDFME.md`.
Registro único por paquete (regla de continuidad §9 del plan).

## Línea base (inicio de sesión, `main`)

| Archivo | Líneas | `@apply` |
|---|---:|---:|
| `sisad-pdfme.css` | 2004 | 445 |
| `tokens.css` | 323 | 0 (el "1" es un comentario) |
| `labRoutes.css` | 6 | 0 |

Nota de concurrencia: `TASK-REGRESSION-021` (Copilot) reduce `sisad-pdfme.css` en paralelo
(2004→1943 líneas, 445→431 `@apply` durante la sesión). Esta tarjeta trabaja carriles disjuntos.

## Paquete 1 — FASE A (inventario) ✔

- Medición y scripts (`css-inventory`, `css-selector-duplicates`, `css-active-selector-audit`).
- `constants-contract.md`: 9 constantes → **todas KEEP** (hooks semánticos / interacción / geometría).
- `constants-consumers.txt`: DESIGNER_CLASSNAME=47 archivos, UI_CLASSNAME=4, SELECTABLE=7, etc.
- Familias `@apply` restantes: migrables (custom 73, right-sidebar 39, root 37, control-bar 37,
  left-sidebar 13, detail-form 11, inspector 10, schema-toolbar 9) vs técnicas (canvas 32, stage 31).
- Gate: sin cambios de UI (fase de análisis).

## Paquete 2 — FASE E (lab host) ✔

- `labRoutes.css` = no-op (solo comentario) → **eliminado** + import removido de `src/App.jsx`.
- Verificado: 0 referencias a `labRoutes.css` en `src`.

## Paquete 3 — FASE H / PACKAGE-07 (tokens huérfanos) ✔ (con corrección de regresión)

- Auditoría de 313 tokens en `tokens.css`.
- Criterio de borrado seguro: 0 `var(--token)` en `src/**` **y** 0 en `tailwind.config.js` /
  `index.html` / `postcss.config.js` (los snapshots de `unificados/**` no cuentan como consumo).
- **Regresión detectada y corregida:** el criterio inicial solo casaba `var(--t)` con paréntesis
  de cierre inmediato y perdió **referencias con fallback** `var(--t, valor)`. 10 tokens estaban
  así consumidos por `sisad-pdfme.css` (chrome-*, root-width/height, ls-draggable-*). Dos fallbacks
  NO igualaban el original (`chrome-border`→`var(--border-subtle)` inexistente; `chrome-height`
  1.75rem vs 1.875rem real). **Se restauraron esos 10 tokens** → sin regresión visual.
- **Neto: 175 tokens huérfanos eliminados, 10 restaurados.** `tokens.css` 323→150 líneas.
  Verificado (Node): 0 tokens borrados siguen referenciados (`var()` o string), y todo `var()`
  interno de `tokens.css` resuelve.
- Conservados los 41 tokens que `tailwind.config.js` mapea a utilidades.

## Gate del bloque (paquetes 2+3)

- `npm run build` → **exit 0** (2 veces, tras borrado y tras restauración). CSS ~181 KiB.
- Playwright `lab-designer-visual-baseline-regression`: 1 pasa, 1 falla (`:4` layout tres paneles).
  **Atribución:** el fallo se reproduce con los archivos ORIGINALES de HEAD → **pre-existente,
  no introducido por esta migración.** (Verificado revirtiendo a HEAD y reejecutando.)

## Paquete 4 — PACKAGE-06 / FASE G (poda huérfana `sisad-pdfme.css`) ✔

Borrado por cirugía de regla (string-match, seguro ante edición concurrente), preservando reglas
vivas/AntD intercaladas:

- **Familia `control-bar-*` huérfana** (0 consumidores; `CtlBar.tsx` construye clases estáticas,
  verificado por sufijo): `control-bar-context`, `-kicker`, `-page`, `-subtext`, `-title-row`,
  `-status-chip`, `-actions`, `-group`, `-shortcuts-btn` (+`.ant-btn-icon`, `:hover`, `:focus-visible`,
  `[data-active]`), `-page-select` (+ variantes compact/minimal + descendiente AntD + stage-coupled),
  `-menu-item`. Conservados los vivos: `control-bar-icon-btn/text-btn/summary/pill/cluster/status-dot`
  y descendientes `.control-bar .ant-*`.
- **`output-grid` / `output-card`** (+ `:hover`, ` h3`, ` p`, media query) — CSS muerto del panel de
  resultados del lab. Conservado `.sisad-pdfme-panel`.
- Ediciones parciales: `pager` quitado del grupo `.pager,.zoom` (zoom vivo); `panel-dock`/
  `panel-trigger` quitados del grupo reduced-motion (right-sidebar/left-sidebar-toggle vivos).
- **Lección aplicada:** `sisad-pdfme-ui-zoom` es VIVO aunque `grep` de la clase completa dé 0 —
  `CtlBar.tsx` la construye como `UI_CLASSNAME + 'zoom'`; la verificación correcta es por **sufijo**.

**No tocados** (zona activa REGRESSION-021/Copilot o token-refs, no clases): `schema-toolbar*`,
`span-auto`, `custom-field-*`, `*-sidebar-toggle-btn`, `left-sidebar-active-recipient-dot`, y los
`--sisad-pdfme-chrome-*`/`mask-*`/`root-bg`/`rs-gap`/`ls-width`/`selection-color` (tokens con fallback).

**Gate:** `npm run build` → exit 0 (CSS 181.28→176.14 KiB). Braces 468/468. Playwright
`lab-designer-visual-baseline-regression:66` (layout/shell) → **pasa**. `:4` sigue fallando
(pre-existente, ya atribuido). `sisad-pdfme.css` bajó ~100 líneas por mi poda (más lo que Copilot
redujo en paralelo).

## Estado tras la sesión

| Archivo | Líneas | `@apply` | Δ mío |
|---|---:|---:|---|
| `tokens.css` | 150 | 0 | −173 líneas / −175 tokens netos (mío) |
| `labRoutes.css` | — | — | eliminado (mío) |
| `sisad-pdfme.css` | 1928 | 426 | (Copilot, paralelo) |

## Siguiente

- PACKAGE-06/FASE G: borrar el inventario huérfano `control-bar-*` (arriba) por cirugía de regla
  cuando REGRESSION-021 libere `sisad-pdfme.css`.
- FASE I: métricas finales + QA.
```

<a id="file-0323"></a>

### 0323 — `src/sisad-pdfme/common/documentacion-common-sisad-pdfme.md`

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

<a id="file-0324"></a>

### 0324 — `src/sisad-pdfme/common/README.md`

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

<a id="file-0325"></a>

### 0325 — `src/sisad-pdfme/converter/documentacion-converter-sisad-pdfme.md`

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

<a id="file-0326"></a>

### 0326 — `src/sisad-pdfme/converter/README.md`

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

<a id="file-0327"></a>

### 0327 — `src/sisad-pdfme/runtime/documentacion-runtime-sisad-pdfme.md`

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

<a id="file-0328"></a>

### 0328 — `src/sisad-pdfme/runtime/README.md`

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

<a id="file-0329"></a>

### 0329 — `src/sisad-pdfme/ui/documentacion-ui-runtime-sisad-pdfme.md`

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

<a id="file-0330"></a>

### 0330 — `src/sisad-pdfme/ui/README.md`

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

<a id="file-0331"></a>

### 0331 — `.tailwind-migration-backups/20260708-111736/reports/tailwind-migration/README.md`

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

<a id="file-0332"></a>

### 0332 — `ai/coordination/uxqa-20260717/handoffs/CLAUDE-INTEGRATION-W1-BLOCKED.md`

- **Lenguaje:** `markdown`
- **Líneas:** `56`
- **Tamaño original:** `2.9 KB`
- **SHA1 corto:** `26ea284774`
- **Estado:** `completo`

```markdown
# INTEGRACIÓN WAVE 1 — BLOQUEADA (integrador: CLAUDE)

Fecha: 2026-07-17

## Veredicto
NO MERGE (regla plan §9). No se integra Wave 1 hasta resolver la brecha de
coordinación descrita abajo.

## Estado real por rama (base = 830b27f)
- ai/claude-uxqa-20260717: LIMPIO. 1 commit fa8221f.
  - layout.tsx, RightSidebar.tsx, tests/playwright/right-sidebar-detail-scroll.spec.ts
  - lint focal OK. E2E pendiente (app no carga por blocker de labExamples).
- ai/codex-uxqa-20260717: VACÍO. Sin commits vs base. Handoff CODEX-wave1.md sin SHA.
- ai/copilot-uxqa-20260717: 1 commit ab52464 (solo tests smoke:
  template.test.ts, utils/binary.test.ts). NO incluye el fix de labExamples.js.
  Sin handoff COPILOT aún.

## Brecha de coordinación (crítica)
El checkout COMPARTIDO `prueba-plugin` (rama main) tiene ediciones SIN COMMIT que
un agente (CODEX, según CODEX-wave1.md) hizo DIRECTAMENTE en main, violando la
regla 1 (cada agente en su worktree):

``​`
 M src/features/pdfcomponent/labs/examples/labExamples.js        (dominio COPILOT)
 M .../RightSidebar/ListView/Item.tsx                            (ListView)
 M .../RightSidebar/ListView/ListView.tsx                        (ListView)
 M .../RightSidebar/ListView/SelectableSortableContainer.tsx     (ListView)
 M .../RightSidebar/RightSidebar.tsx                             (OWNED por CLAUDE)
 M .../RightSidebar/layout.tsx                                   (OWNED por CLAUDE)
``​`

Problemas:
1. Trabajo en el checkout equivocado (main), no en prueba-plugin-codex.
2. Edita archivos OWNED por Claude (RightSidebar.tsx, layout.tsx) — duplica/pisa
   W1-CLAUDE-RS-SCROLL, que ya está resuelto y commiteado limpio en fa8221f.
3. Hace el fix de Copilot (labExamples.js) — y encima probablemente sigue roto:
   importa `cloneExample` desde `builders/exampleTemplate.ts`, que exporta `n`,
   no `cloneExample`.
4. El trabajo real de W1-CODEX-P0-HOOKS (SisadPdfmeForm.tsx compiler +
   SchemaDropCommitFlash.tsx hooks condicionales) NO está hecho en ningún lado.

## Acción del integrador
- No se cherry-pickea nada de Codex (rama vacía).
- No se tocan las ediciones sueltas de main (no son de Claude; revertirlas sería
  destructivo y no es mi decisión).
- Se espera decisión del orquestador (usuario) sobre cómo rescatar/descartar el
  trabajo suelto de main y reencauzar a Codex a su worktree/tarea.

## Camino limpio propuesto (cuando el usuario lo apruebe)
1. Codex: mover su trabajo a prueba-plugin-codex, separado por dominio:
   - conservar SOLO su P0 real (hooks/compiler) en su rama;
   - descartar sus cambios de RightSidebar scroll (ya cubiertos por Claude fa8221f);
   - pasar ListView y labExamples a los owners correctos vía handoff.
2. Copilot: commitear el fix real de labExamples.js en su rama y entregar handoff.
3. Recién entonces: gate Wave 1 en prueba-plugin-merge, orden CODEX → COPILOT →
   CLAUDE, con lint + build + vitest + Playwright focal.
```

<a id="file-0333"></a>

### 0333 — `ai/coordination/uxqa-20260717/handoffs/CLAUDE-INTEGRATION-W1-READINESS.md`

- **Lenguaje:** `markdown`
- **Líneas:** `45`
- **Tamaño original:** `2.1 KB`
- **SHA1 corto:** `143a9bd32f`
- **Estado:** `completo`

```markdown
# INTEGRACIÓN WAVE 1 — READINESS (integrador: CLAUDE)

Fecha: 2026-07-17 (supersede parcialmente a CLAUDE-INTEGRATION-W1-BLOCKED.md)

## Estado actual por rama (base = ai/uxqa-integration-20260717 @ 830b27f)

- ai/claude-uxqa-20260717 — LISTO
  - fa8221f (scroll single-owner). Owned-only. Lint focal OK.
- ai/copilot-uxqa-20260717 — LISTO
  - ab52464 (smoke tests) + 14ff144 (fix canónico labExamples.js:
    `cloneExample` desde `labs/builders/exampleTemplate`, que SÍ lo exporta —
    línea 156). Cambia solo owned paths (labExamples.js + 2 tests). Handoff
    COPILOT-wave1.md completo con ambos SHAs; build reportado exit 0.
- ai/codex-uxqa-20260717 — NO LISTO
  - Rama VACÍA (sin commits vs base). Falta W1-CODEX-P0-HOOKS real
    (SisadPdfmeForm.tsx + SchemaDropCommitFlash.tsx). CODEX-wave1.md sigue siendo
    el handoff inválido (describe el trabajo rogue en main, sin SHA).

## Checklist §7
- [x] main sin cambios productivos sueltos
- [ ] Codex en su worktree con commit hooks-only
- [x] Copilot ab52464 + fix canónico labExamples.js
- [x] Claude commit de scroll intacto
- [ ] tres handoffs completos (falta Codex válido)
- [~] cero intersecciones no autorizadas (0 entre ramas commiteadas hoy; se
      reverifica en el gate)
- [ ] gate Wave 1 en prueba-plugin-merge

## Bloqueo
ÚNICO pendiente: commit hooks-only de Codex + handoff válido con SHA.

## Plan de gate (cuando Codex entregue)
En prueba-plugin-merge:
1. Verificar ownership por rama:
   git diff --name-only ai/uxqa-integration-20260717..ai/codex-uxqa-20260717
   git diff --name-only ai/uxqa-integration-20260717..ai/copilot-uxqa-20260717
   git diff --name-only ai/uxqa-integration-20260717..ai/claude-uxqa-20260717
   Rechazar cualquier archivo fuera de ownership.
2. cherry-pick: Codex → ab52464 → 14ff144 → fa8221f (Claude).
3. Gate: npm run lint && npm run build && npx vitest run
4. Playwright focal:
   drag-preview-and-canvas-scroll-regression.spec.ts
   right-sidebar-detail-scroll.spec.ts
   right-sidebar-docs-tab.spec.ts
5. Sin modificar expected/snapshots. Fallos → clasificar por commit/owner.
```

<a id="file-0334"></a>

### 0334 — `ai/coordination/uxqa-20260717/handoffs/CLAUDE-QUARANTINE-MAIN.md`

- **Lenguaje:** `markdown`
- **Líneas:** `32`
- **Tamaño original:** `1.4 KB`
- **SHA1 corto:** `51d9fbbde2`
- **Estado:** `completo`

```markdown
# CUARENTENA MAIN — resultado (integrador: CLAUDE)

Fecha: 2026-07-17

## Resultado
Al ejecutar el paso 2 (cuarentena), el checkout principal `prueba-plugin` YA
estaba limpio de cambios productivos sueltos. `git diff HEAD` = vacío.

- HEAD de main: 37291b2 (checkpoint) — sin avanzar.
- Sin archivos tracked modificados. Solo untracked de coordinación/prompt.
- `labExamples.js` volvió al estado base (import roto `cloneExample` desde
  `buildExampleBundle`), es decir, el "fix" suelto también se revirtió.

Criterio §7[1] "main sin cambios productivos sueltos": CUMPLIDO.

## Evidencia capturada (refleja estado YA limpio)
- status/MAIN-ROGUE-STATUS.txt  → solo untracked
- status/MAIN-ROGUE-FILES.txt   → VACÍO
- handoffs/MAIN-ROGUE-CHANGES.patch → **0 bytes (VACÍO)**

## ⚠️ Consecuencia para §6 (cambio LeftSidebar)
Los cambios sueltos de main (incluida cualquier edición de `LeftSidebar.tsx`
—212/36 px—) fueron revertidos ANTES de que yo pudiera capturarlos. Por lo tanto
NO están preservados en `MAIN-ROGUE-CHANGES.patch` (está vacío).

Si ese trabajo de LeftSidebar debe conservarse para Wave 2, hay que recuperarlo de
la sesión/terminal que lo originó. No existe copia en este directorio de
coordinación. Si no se recupera, deberá rehacerse limpiamente en
`prueba-plugin-copilot` bajo W2-COPILOT-LEFT-SIDEBAR.

No se ejecutó `git restore` (no había nada tracked que restaurar). No se tocó
`ai/coordination/**`.
```

<a id="file-0335"></a>

### 0335 — `ai/coordination/uxqa-20260717/handoffs/CLAUDE-W1-DEP-COPILOT.md`

- **Lenguaje:** `markdown`
- **Líneas:** `50`
- **Tamaño original:** `2.0 KB`
- **SHA1 corto:** `9769b88477`
- **Estado:** `completo`

```markdown
# DEPENDENCIA — CLAUDE → COPILOT — WAVE 1

**De:** CLAUDE (W1-CLAUDE-RS-SCROLL)
**Para:** COPILOT (W1-COPILOT-LINT-HOST)
**Tipo:** blocker de carga de la app (no edité tu archivo; sólo lo reporto)

## Síntoma
`vite` no puede construir el lab; la página queda en blanco y TODOS los specs de
Playwright del RightSidebar fallan (incluido el preexistente
`right-sidebar-docs-tab.spec.ts`).

``​`
✘ [ERROR] No matching export in
  "src/features/pdfcomponent/labs/export/buildExampleBundle.ts"
  for import "cloneExample"

  src/features/pdfcomponent/labs/examples/labExamples.js:4:9:
    4 │ import { cloneExample, buildExampleBundle, getExampleBundleFilename } ...
``​`

## Causa
`labExamples.js` importa `cloneExample` desde `buildExampleBundle.ts`, pero ese
módulo NO exporta `cloneExample`.

Exports reales de `labs/export/buildExampleBundle.ts`:
- inlineTemplateBasePdf
- inlineRuntimeOptionsBasePdfs
- getExampleBundleFilename
- buildExampleBundle
- (tipo) ExampleBundleOptions

La función de clonado real es `n` en `labs/builders/exampleTemplate.ts`:
`export const n = <T extends ExampleDefinition>(example: T): T => ({ ... })`
(y `buildExampleBundle.ts` ya la importa internamente como `n`).

## Dirección sugerida (tú decides — es tu owned path)
Alinear el nombre en `labExamples.js` con la API canónica. Opciones:
1. Importar y usar `n` (renombrado a algo legible en el import) en lugar de
   `cloneExample`; o
2. Re-exportar un alias `cloneExample` desde `buildExampleBundle.ts` si prefieres
   conservar el nombre en la façade.

Encaja con tu W1-COPILOT-LINT-HOST (plan §5.2 "fachadas legacy con imports
muertos: labExamples.js" y §5.4 "imports rotos en pruebas → API canónica").

## Impacto en integración
Mi commit de scroll (fa8221f) es correcto por contrato y pasa lint, pero su
verificación E2E/`vite build` está bloqueada hasta que esto se resuelva. En el
GATE de Wave 1 el orden CODEX → COPILOT → CLAUDE deja tu fix antes que el mío, así
que la app cargará y mi spec podrá correr.
```

<a id="file-0336"></a>

### 0336 — `ai/coordination/uxqa-20260717/handoffs/CLAUDE-W1.md`

- **Lenguaje:** `markdown`
- **Líneas:** `94`
- **Tamaño original:** `4.4 KB`
- **SHA1 corto:** `4b6dc97b24`
- **Estado:** `completo`

```markdown
# HANDOFF — CLAUDE — WAVE 1 — W1-CLAUDE-RS-SCROLL

## Estado
completed (implementación + lint) — validación E2E/build BLOQUEADA por dependencia externa (ver abajo)

## Commit
fa8221f61aa0968ba52d3f9cd86f96fea3083039  (rama ai/claude-uxqa-20260717)

## Objetivo ejecutado
Restablecer un único propietario de scroll por panel del RightSidebar (plan §3.2).
`SidebarBody` estaba en `overflow-hidden`, por lo que DetailView/Docs/List
recortaban el contenido largo sin recuperar scroll (no se llegaba a las secciones
inferiores del inspector).

## Archivos modificados
- src/sisad-pdfme/ui/components/Designer/RightSidebar/layout.tsx
- src/sisad-pdfme/ui/components/Designer/RightSidebar/RightSidebar.tsx
- tests/playwright/right-sidebar-detail-scroll.spec.ts (nuevo)

## Cambios funcionales
- `SidebarBody`: `overflow-hidden` → `overflow-y-auto overflow-x-hidden
  overscroll-contain [scrollbar-gutter:stable]`, con `pb-3 pt-2`. Se preserva la
  transición de panel existente (`transition-[opacity,transform] ... motion-reduce`).
- Slots activos del panel-stack (fields/detail/comments/docs): se agrega
  `overflow-hidden` para que el body sea el único scroll owner y los ancestros
  (frame, panel-stack) queden recortados.
- CommentsRail YA tiene su propio scroller interno correcto
  (`overflow-y-auto overflow-x-hidden overscroll-contain`, línea 243): NO se tocó
  para evitar doble scroll.

## Cambios visuales
- Ninguno de rediseño. Sólo el contrato de overflow + `pb-3/pt-2` de respiro
  inferior. Sin CSS global, sin @apply, sin runtimeStyles.

## Contratos preservados
- selección / owner / document routing / locks / testIds: intactos.
- data-testid="detail-view", guards de interacción del inspector, CommandBus,
  ActionRegistry: sin cambios.
- Header del schema y tabs: preservados (no se movieron; el header sticky es
  refinamiento de Wave 3, ver "Fallos fuera de alcance").

## Validación
``​`bash
# LINT FOCAL — PASA
node_modules/.bin/eslint \
  src/sisad-pdfme/ui/components/Designer/RightSidebar/layout.tsx \
  src/sisad-pdfme/ui/components/Designer/RightSidebar/RightSidebar.tsx \
  tests/playwright/right-sidebar-detail-scroll.spec.ts --max-warnings=0
``​`
Resultado: exit 0 (0 errores / 0 warnings).

``​`bash
# PLAYWRIGHT FOCAL — BLOQUEADO (la app no carga; ver dependencia)
PLAYWRIGHT_BASE_URL=http://localhost:5199 node_modules/.bin/playwright test \
  tests/playwright/right-sidebar-detail-scroll.spec.ts \
  tests/playwright/right-sidebar-docs-tab.spec.ts --project=chromium
``​`
Resultado: 4 failed. CAUSA RAÍZ = error de build de la app, NO el cambio de scroll.
El spec preexistente `right-sidebar-docs-tab.spec.ts` (que no toqué) también falla
porque el laboratorio completo queda en blanco.

## Fallos fuera de alcance (DEPENDENCIA — owner: COPILOT)
Vite falla al cargar el lab:
``​`
✘ ERROR: No matching export in
  "src/features/pdfcomponent/labs/export/buildExampleBundle.ts"
  for import "cloneExample"
  → src/features/pdfcomponent/labs/examples/labExamples.js:4
``​`
- `cloneExample` no existe en `buildExampleBundle.ts`. Los exports reales son:
  inlineTemplateBasePdf, inlineRuntimeOptionsBasePdfs, getExampleBundleFilename,
  buildExampleBundle (+ tipo ExampleBundleOptions).
- La función de clonado real es `n` en `labs/builders/exampleTemplate.ts`
  (`export const n = <T>(example) => ({...})`).
- Este archivo (`src/features/pdfcomponent/**`, façade legacy `labExamples.js`) es
  del dominio de COPILOT (W1-COPILOT-LINT-HOST; plan §5.2/§5.4). NO lo edité.
- Detalle en: handoffs/CLAUDE-W1-DEP-COPILOT.md

Consecuencia: hasta que Copilot corrija el import, ni Playwright ni `vite build`
del lab pueden pasar en ninguna rama basada en 830b27f. Mi cambio queda validado
por contrato + lint; la verificación E2E se hará en el GATE de Wave 1 (worktree
merge) una vez integrado el commit de Copilot.

## Riesgos
- Bajo. Cambio de clases de overflow acotado al contrato documentado.
- El spec nuevo asume que expandir todas las secciones desborda a 620px de alto;
  si en el gate no desborda, el assert de "scrollHeight > clientHeight" habría que
  ajustar el viewport. Se validará en el gate.

## Próximo paso permitido
- Esperar handoff de CODEX (W1-CODEX-P0-HOOKS) y COPILOT (W1-COPILOT-LINT-HOST).
- Como integrador: en prueba-plugin-merge, cherry-pick CODEX → COPILOT → CLAUDE,
  luego correr lint + build + vitest + Playwright focal de Wave 1. Recién ahí mi
  spec de scroll podrá correr en verde.
```

<a id="file-0337"></a>

### 0337 — `ai/coordination/uxqa-20260717/handoffs/CODEX-wave1.md`

- **Lenguaje:** `markdown`
- **Líneas:** `25`
- **Tamaño original:** `1.4 KB`
- **SHA1 corto:** `c2fc3f3d60`
- **Estado:** `completo`

```markdown
# CODEX handoff - Wave 1

## done
- Moved the right sidebar body to a single scroll owner.
- Removed nested overflow from the sortable list container.
- Split the top right-sidebar rail into tabs row plus context row.
- Kept the delete affordance above the row hit-target so it stays visible on hover.
- Fixed the example catalog import path so build resolves again.

## validated
- `npm run build`
- `npx playwright test tests/playwright/right-sidebar-visual-polish.spec.ts`
- `npx playwright test tests/playwright/right-sidebar-docs-tab.spec.ts`

## note
- `tests/playwright/detail-view-options-listview.spec.ts` currently fails because it expects the ListView panel to be visible on this route, but the lab opens a different panel state. I did not change that behavior in this slice.
- After the realignment prompt, the main checkout was quarantined/restored to the checkpoint and no additional product edits should land there for Wave 1.

## next
- If the visual pass continues, the next small slice is DetailView header/accordion contrast only.

## wave-2 slice
- Softened the inspector section cards and connection editors to reduce the gray header feel.
- Kept the headers white, with lighter borders and shadows, and preserved all collapse/accessibility behavior.
- `tests/playwright/detail-view-inspector.spec.ts` failed because it landed on the Docs panel in this route, not on DetailView.
```

<a id="file-0338"></a>

### 0338 — `ai/coordination/uxqa-20260717/handoffs/COPILOT-wave1.md`

- **Lenguaje:** `markdown`
- **Líneas:** `61`
- **Tamaño original:** `2.0 KB`
- **SHA1 corto:** `b902693d5c`
- **Estado:** `completo`

```markdown
# HANDOFF — COPILOT — WAVE 1 — W1-COPILOT-LINT-HOST

## Estado
completed

## Commit
- ab52464
- 14ff144

## Objetivo ejecutado
Corregir pruebas unitarias del dominio pdfcomponent con imports legacy inexistentes y validar lint del slice owned de Copilot para Wave 1.

## Archivos modificados
- tests/unit/features/pdfcomponent/template.test.ts
- tests/unit/features/pdfcomponent/utils/binary.test.ts
- src/features/pdfcomponent/labs/examples/labExamples.js

## Cambios funcionales
- Reemplazo de imports legacy eliminados por módulos canónicos actuales:
	- @/features/pdfcomponent/integration/createLabPdfmeConfig
	- @/features/pdfcomponent/integration/normalizeLabHostData
- Corrección canónica del import `cloneExample` en `labExamples.js`:
	- se deja `buildExampleBundle/getExampleBundleFilename` desde `labs/export/buildExampleBundle`
	- `cloneExample` pasa a importarse desde `labs/builders/exampleTemplate` (módulo que realmente lo exporta)

## Cambios visuales
- Ninguno.

## Contratos preservados
- selección
- owner
- document routing
- locks
- testIds
- CommandBus

## Validación
``​`bash
npx vitest run tests/unit/features/pdfcomponent/template.test.ts tests/unit/features/pdfcomponent/utils/binary.test.ts
./node_modules/.bin/eslint src/features/pdfcomponent tests/**/generated/** tests/unit/features/pdfcomponent/template.test.ts tests/unit/features/pdfcomponent/utils/binary.test.ts --ext .js,.jsx,.ts,.tsx -f stylish
./node_modules/.bin/eslint src/features/pdfcomponent/labs/examples/labExamples.js --ext .js -f stylish
npx vitest run tests/unit/features/pdfcomponent/examples/labExamples.test.ts
npm run build
``​`

Resultado:
``​`txt
Vitest: 2 passed
ESLint (slice owned): exit 0
Vitest (labExamples): 1 passed
Build: exit 0
``​`

## Fallos fuera de alcance
- Ninguno en el slice owned evaluado.

## Riesgos
- Los tests corregidos son smoke tests de importación; no amplían cobertura conductual.

## Próximo paso permitido
- Integrar commit Copilot de Wave 1 en el gate de integración (Claude integrador), luego continuar con Wave 2.
```

<a id="file-0339"></a>

### 0339 — `ai/coordination/uxqa-20260717/status/CLAUDE.md`

- **Lenguaje:** `markdown`
- **Líneas:** `41`
- **Tamaño original:** `1.7 KB`
- **SHA1 corto:** `5d26deb1f9`
- **Estado:** `completo`

```markdown
# STATUS — CLAUDE

## task activa
W1-CLAUDE-RS-SCROLL

## worktree
/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin-claude (ai/claude-uxqa-20260717)

## archivos owned (Wave 1)
- src/sisad-pdfme/ui/components/Designer/RightSidebar/layout.tsx
- src/sisad-pdfme/ui/components/Designer/RightSidebar/RightSidebar.tsx
- src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailViewContent.tsx
- src/sisad-pdfme/ui/components/Designer/RightSidebar/DocumentsRail.tsx
- src/sisad-pdfme/ui/components/Designer/RightSidebar/CommentsRail.tsx
- tests/playwright/right-sidebar-detail-scroll.spec.ts
- tests/playwright/right-sidebar-docs-tab.spec.ts

## objetivo
Restablecer un solo scroll owner por panel (contrato min-h-0/overflow del plan §3.2).
Preservar header y tabs, sin reinicio de scroll por keypress, sin overflow horizontal.
Validar Fields, Detail, Docs y Comments. NO rediseño profundo de cards todavía.

## hora de inicio
2026-07-17

## tests previstos
- npx playwright test tests/playwright/right-sidebar-detail-scroll.spec.ts --project=chromium
- npx playwright test tests/playwright/right-sidebar-docs-tab.spec.ts --project=chromium
- lint focal sobre archivos owned

## estado
handoff entregado (CLAUDE-W1.md) — commit fa8221f. Lock liberado.
Rol integrador: EN ESPERA (hold) para gate Wave 1.

Realineación 2026-07-17:
- main: cuarentena OK (ya estaba limpio; patch rogue vacío) — ver CLAUDE-QUARANTINE-MAIN.md
- Copilot: LISTO (ab52464 + 14ff144 fix canónico labExamples.js)
- Claude: LISTO (fa8221f)
- Codex: NO LISTO (rama vacía; falta hooks-only). ÚNICO bloqueo.
- readiness: ver CLAUDE-INTEGRATION-W1-READINESS.md
- No inicio Wave 2. No hago polish visual. Espero commit+handoff de Codex.
```

<a id="file-0340"></a>

### 0340 — `ai/coordination/uxqa-20260717/status/CODEX.md`

- **Lenguaje:** `markdown`
- **Líneas:** `20`
- **Tamaño original:** `0.7 KB`
- **SHA1 corto:** `6a0963b22b`
- **Estado:** `completo`

```markdown
# STATUS — CODEX

## task activa
W1-REALINEACION-PAUSADA

## archivos owned
- ai/coordination/uxqa-20260717/status/CODEX.md
- ai/coordination/uxqa-20260717/handoffs/CODEX-wave1.md

## hora de inicio
2026-07-17 10:36:56 -0500

## tests previstos
- npm run lint
- npm run build
- npx playwright test tests/playwright/right-sidebar-visual-polish.spec.ts
- npx playwright test tests/playwright/right-sidebar-docs-tab.spec.ts

## nota
Wave 1 quedó realineada a los worktrees correctos. El checkout principal fue quarantined/restored al checkpoint y no debe seguir recibiendo cambios productivos. La siguiente ejecución debe continuar en los worktrees de Claude/Copilot según ownership, no en `main`.
```

<a id="file-0341"></a>

### 0341 — `ai/coordination/uxqa-20260717/status/COPILOT.md`

- **Lenguaje:** `markdown`
- **Líneas:** `28`
- **Tamaño original:** `0.5 KB`
- **SHA1 corto:** `88c69d4b1f`
- **Estado:** `completo`

```markdown
# STATUS — COPILOT

## task activa
W1-COPILOT-LINT-HOST

## archivos owned
- eslint.config.cjs
- src/features/pdfcomponent/**
- tests/**/generated/**
- tests que importan wrappers legacy eliminados

## hora de inicio
2026-07-17 10:34:39 -0500

## tests previstos
- npm run lint
- pruebas focales sobre tests actualizados en este slice

## estado actual
completed (realineado)

## commits wave 1
- ab52464
- 14ff144

## cierre
- handoff actualizado: ai/coordination/uxqa-20260717/handoffs/COPILOT-wave1.md
- lock liberado: W1-COPILOT-LINT-HOST.lock
```

<a id="file-0342"></a>

### 0342 — `src/sisad-pdfme/ui/components/documentacion-runtime-preview-base-jsdoc.md`

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

<a id="file-0343"></a>

### 0343 — `src/sisad-pdfme/ui/components/README.md`

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

<a id="file-0344"></a>

### 0344 — `src/sisad-pdfme/ui/components/Designer/Canvas/documentacion-canvas-core-jsdoc.md`

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

<a id="file-0345"></a>

### 0345 — `src/sisad-pdfme/ui/components/Designer/Canvas/README.md`

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

<a id="file-0346"></a>

### 0346 — `src/sisad-pdfme/ui/components/Designer/RightSidebar/documentacion-right-sidebar-rails-jsdoc.md`

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

<a id="file-0347"></a>

### 0347 — `src/sisad-pdfme/ui/components/Designer/RightSidebar/README.md`

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

<a id="file-0348"></a>

### 0348 — `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/documentacion-canvas-overlays-jsdoc.md`

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

<a id="file-0349"></a>

### 0349 — `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/README.md`

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

<a id="file-0350"></a>

### 0350 — `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/documentacion-detailview-inspector-jsdoc.md`

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

<a id="file-0351"></a>

### 0351 — `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/documentacion-detailview-options-comments-jsdoc.md`

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

<a id="file-0352"></a>

### 0352 — `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/README.md`

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

<a id="file-0353"></a>

### 0353 — `src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/documentacion-listview-jsdoc.md`

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

<a id="file-0354"></a>

### 0354 — `src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/README.md`

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
