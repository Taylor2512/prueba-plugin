# .ai/INDEX.md — Router de contexto SISAD PDFME v5

## Carga inicial obligatoria

1. `.ai/memory/project-memory.md`
2. `.ai/context-map.md`
3. `.ai/rules/context-loading-ladder-rules.md`
4. `.ai/agents/registry.md`

## Loop operativo

```txt
Perceive -> Retrieve -> Process Contract -> Plan -> Act -> Observe -> Guardrail -> Test -> Memory
```

## Regla de carga

- Nivel 1: cambio puntual → 1 contexto + 1 regla + 1 prompt.
- Nivel 2: bug/feature transversal → contexto de dominio + behavior contract + regla del dominio.
- Nivel 3: auditoría global → justificar lectura de snapshots o reportes grandes.

## Rutas por tarea

| Tarea | Contexto | Regla | Prompt |
|---|---|---|---|
| `behavior-contract` | `application-behavior-contract-context.md` | `application-behavior-contract-rules.md` | `audit-application-behavior-regressions.prompt.md` |
| `complete-missing-gaps` | `process-flow-implementation-context.md` | `component-contract-rules.md` | `implement-behavior-contract-missing-pieces.prompt.md` |
| `selection-shortcuts-regression` | `interaction-regression-context.md` | `interaction-regression-rules.md` | `stabilize-selection-shortcuts-commandbus.prompt.md` |
| `docusign-schema-design` | `docusign-ux-reference-context.md` | `docusign-ux-design-rules.md` | `improve-docusign-inspired-schema-design.prompt.md` |
| `multipage-no-overlap` | `page-distribution-placement-context.md` | `page-distribution-placement-rules.md` | `validate-multipdf-multipage-nooverlap.prompt.md` |
| `standard-fields-groups` | `standard-fields-groups-context.md` | `standard-fields-group-contract-rules.md` | `harden-standard-fields-groups.prompt.md` |
| `checkboxgroup-flow` | `checkboxgroup-context.md` | `standard-fields-group-contract-rules.md` | `repair-checkboxgroup-flow.prompt.md` |
| `radiogroup-flow` | `radiogroup-context.md` | `standard-fields-group-contract-rules.md` | `repair-radiogroup-flow.prompt.md` |
| `dropdown-select` | `dropdown-select-context.md` | `standard-fields-group-contract-rules.md` | `validate-standard-field-parity.prompt.md` |
| `no-overlap` | `no-overlap-contract-context.md` | `no-overlap-rules.md` | `validate-group-no-overlap.prompt.md` |
| `form-viewer-generator` | `form-viewer-generator-parity-context.md` | `form-viewer-generator-rules.md` | `validate-standard-field-parity.prompt.md` |
| `recipient-color` | `recipient-color-context.md` | `schema-ownership-rules.md` | `repair-recipient-color-sync.prompt.md` |
| `schema-icon-sync` | `schema-icon-sync-context.md` | `schema-icon-color-rules.md` | `repair-schema-icon-color-sync.prompt.md` |
| `transform-controls` | `transform-controls-context.md` | `transform-interaction-rules.md` | `repair-transform-collisions.prompt.md` |
| `moveable-selecto` | `moveable-selecto-context.md` | `moveable-selecto-rules.md` | `harden-moveable-selecto-guards.prompt.md` |
| `snapshot` | `snapshot-contract-context.md` | `snapshot-contract-rules.md` | `repair-snapshot-roundtrip.prompt.md` |
| `external-forms` | `external-forms-runner-context.md` | `external-forms-runner-rules.md` | `repair-external-forms-runner.prompt.md` |
| `css-boundaries` | `css-design-system-context.md` | `css-boundary-rules.md` | `audit-css-boundaries.prompt.md` |

## Salida mínima

```md
## Contexto usado
## Proceso/contrato afectado
## Diagnóstico con evidencia
## Plan por fases
## Validación obligatoria
## Riesgos residuales
```
