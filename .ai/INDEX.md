# .ai/INDEX.md — Router de contexto

## Carga inicial obligatoria

1. `.ai/memory/project-memory.md`
2. `.ai/context-map.md`
3. `.ai/rules/context-loading-ladder-rules.md`
4. `.ai/agents/registry.md`

## Loop

```txt
Perceive -> Retrieve -> Plan -> Act -> Observe -> Guardrail -> Memory
```

## Rutas por tarea

| Tarea | Contexto | Regla | Prompt |
|---|---|---|---|
| `standard-fields-groups` | `standard-fields-groups-context.md` | `standard-fields-group-contract-rules.md` | `harden-standard-fields-groups.prompt.md` |
| `checkboxgroup-flow` | `checkboxgroup-context.md` | `standard-fields-group-contract-rules.md` | `repair-checkboxgroup-flow.prompt.md` |
| `radiogroup-flow` | `radiogroup-context.md` | `standard-fields-group-contract-rules.md` | `repair-radiogroup-flow.prompt.md` |
| `dropdown-select` | `dropdown-select-context.md` | `standard-fields-group-contract-rules.md` | `validate-standard-field-parity.prompt.md` |
| `no-overlap` | `no-overlap-contract-context.md` | `no-overlap-rules.md` | `validate-group-no-overlap.prompt.md` |
| `form-viewer-generator` | `form-viewer-generator-parity-context.md` | `form-viewer-generator-rules.md` | `validate-form-viewer-generator-parity.prompt.md` |
| `recipient-color` | `recipient-color-context.md` | `schema-ownership-rules.md` | `repair-recipient-color-sync.prompt.md` |
| `schema-icon-sync` | `schema-icon-sync-context.md` | `schema-icon-color-rules.md` | `repair-schema-icon-color-sync.prompt.md` |
| `transform-controls` | `transform-controls-context.md` | `transform-interaction-rules.md` | `repair-transform-collisions.prompt.md` |
| `moveable-selecto` | `moveable-selecto-context.md` | `moveable-selecto-rules.md` | `harden-moveable-selecto-guards.prompt.md` |
| `snapshot` | `snapshot-contract-context.md` | `snapshot-contract-rules.md` | `repair-snapshot-roundtrip.prompt.md` |
| `external-forms` | `external-forms-runner-context.md` | `external-forms-runner-rules.md` | `repair-external-forms-runner.prompt.md` |
| `designer-engine` | `designer-engine-context.md` | `public-api-rules.md` | `stabilize-designer-engine-api.prompt.md` |
| `sidebars` | `sidebars-inspector-context.md` | `sidebars-inspector-rules.md` | `repair-sidebars-inspector.prompt.md` |
| `css` | `css-design-system-context.md` | `css-boundary-rules.md` | `audit-css-boundaries.prompt.md` |
| `tests` | `tests-quality-context.md` | `testing-quality-rules.md` | `build-regression-test-matrix.prompt.md` |
| `legacy` | `legacy-cleanup-context.md` | `legacy-reduction-rules.md` | `audit-legacy-runtime-reduction.prompt.md` |
| `content-custom-form` | `content-custom-form-integration-context.md` | `host-runtime-boundary-rules.md` | `repair-contentcustomform-integration.prompt.md` |

## No cargar por defecto

- snapshots completos;
- código unificado completo;
- CSS completo;
- todos los prompts;
- todos los docs;
- reportes grandes.
