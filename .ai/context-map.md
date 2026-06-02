# Context map v5

| Dominio | Contexto | Regla | Prompt | Agente |
|---|---|---|---|---|
| Contrato maestro de comportamiento | `.ai/context/application-behavior-contract-context.md` | `.ai/rules/application-behavior-contract-rules.md` | `.ai/prompts/audit-application-behavior-regressions.prompt.md` | Behavior Contract Agent |
| Implementación faltante por proceso | `.ai/context/process-flow-implementation-context.md` | `.ai/rules/component-contract-rules.md` | `.ai/prompts/implement-behavior-contract-missing-pieces.prompt.md` | Process Flow Agent |
| Regresiones de selección/shortcuts | `.ai/context/interaction-regression-context.md` | `.ai/rules/interaction-regression-rules.md` | `.ai/prompts/stabilize-selection-shortcuts-commandbus.prompt.md` | Interaction Regression Agent |
| Diseño inspirado en DocuSign/Wix | `.ai/context/docusign-ux-reference-context.md` | `.ai/rules/docusign-ux-design-rules.md` | `.ai/prompts/improve-docusign-inspired-schema-design.prompt.md` | Docusign UX Agent |
| Distribución multi-PDF/multi-página | `.ai/context/page-distribution-placement-context.md` | `.ai/rules/page-distribution-placement-rules.md` | `.ai/prompts/validate-multipdf-multipage-nooverlap.prompt.md` | Canvas Runtime Agent |
| Contratos por componente | `.ai/context/component-contracts-context.md` | `.ai/rules/component-contract-rules.md` | `.ai/prompts/complete-missing-tests-by-process.prompt.md` | Frontend Architect Agent |
| Schemas estándar y grupos | `.ai/context/standard-fields-groups-context.md` | `.ai/rules/standard-fields-group-contract-rules.md` | `.ai/prompts/harden-standard-fields-groups.prompt.md` | Standard Fields Agent |
| CheckboxGroup | `.ai/context/checkboxgroup-context.md` | `.ai/rules/standard-fields-group-contract-rules.md` | `.ai/prompts/repair-checkboxgroup-flow.prompt.md` | Schema Groups Agent |
| RadioGroup/Opción | `.ai/context/radiogroup-context.md` | `.ai/rules/standard-fields-group-contract-rules.md` | `.ai/prompts/repair-radiogroup-flow.prompt.md` | Schema Groups Agent |
| Dropdown/select | `.ai/context/dropdown-select-context.md` | `.ai/rules/standard-fields-group-contract-rules.md` | `.ai/prompts/validate-standard-field-parity.prompt.md` | Standard Fields Agent |
| No-overlap por owner | `.ai/context/no-overlap-contract-context.md` | `.ai/rules/no-overlap-rules.md` | `.ai/prompts/validate-group-no-overlap.prompt.md` | Canvas Runtime Agent |
| Form/Viewer/Generator parity | `.ai/context/form-viewer-generator-parity-context.md` | `.ai/rules/form-viewer-generator-rules.md` | `.ai/prompts/validate-standard-field-parity.prompt.md` | Form Viewer Generator Agent |
| Colores y ownership | `.ai/context/recipient-color-context.md` | `.ai/rules/schema-ownership-rules.md` | `.ai/prompts/repair-recipient-color-sync.prompt.md` | Recipient Color Agent |
| Moveable y Selecto | `.ai/context/moveable-selecto-context.md` | `.ai/rules/moveable-selecto-rules.md` | `.ai/prompts/harden-moveable-selecto-guards.prompt.md` | Moveable Selecto Agent |
| Snapshot | `.ai/context/snapshot-contract-context.md` | `.ai/rules/snapshot-contract-rules.md` | `.ai/prompts/repair-snapshot-roundtrip.prompt.md` | Snapshot Agent |
| DetailView/ListView | `.ai/context/sidebars-inspector-context.md` | `.ai/rules/sidebars-inspector-rules.md` | `.ai/prompts/refactor-right-inspector-layout.prompt.md` | Right Sidebar Inspector Agent |
| CSS/tokens | `.ai/context/css-design-system-context.md` | `.ai/rules/css-boundary-rules.md` | `.ai/prompts/audit-css-boundaries.prompt.md` | Css Agent |
