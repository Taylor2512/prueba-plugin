# Context map

| Dominio | Contexto | Regla | Prompt |
|---|---|---|---|
| Colores y ownership por destinatario | `.ai/context/recipient-color-context.md` | `.ai/rules/schema-ownership-rules.md` | `.ai/prompts/repair-recipient-color-sync.prompt.md` |
| Iconos del catálogo y color activo | `.ai/context/schema-icon-sync-context.md` | `.ai/rules/schema-icon-color-rules.md` | `.ai/prompts/repair-schema-icon-color-sync.prompt.md` |
| Resize, rotate, drag y selección | `.ai/context/transform-controls-context.md` | `.ai/rules/transform-interaction-rules.md` | `.ai/prompts/repair-transform-collisions.prompt.md` |
| Moveable y Selecto | `.ai/context/moveable-selecto-context.md` | `.ai/rules/moveable-selecto-rules.md` | `.ai/prompts/harden-moveable-selecto-guards.prompt.md` |
| Snapshot y round-trip | `.ai/context/snapshot-contract-context.md` | `.ai/rules/snapshot-contract-rules.md` | `.ai/prompts/repair-snapshot-roundtrip.prompt.md` |
| Runner externalForms | `.ai/context/external-forms-runner-context.md` | `.ai/rules/external-forms-runner-rules.md` | `.ai/prompts/repair-external-forms-runner.prompt.md` |
| Designer engine y API pública | `.ai/context/designer-engine-context.md` | `.ai/rules/public-api-rules.md` | `.ai/prompts/stabilize-designer-engine-api.prompt.md` |
| Left/Right sidebar e inspector | `.ai/context/sidebars-inspector-context.md` | `.ai/rules/sidebars-inspector-rules.md` | `.ai/prompts/repair-sidebars-inspector.prompt.md` |
| CSS, tokens y boundaries | `.ai/context/css-design-system-context.md` | `.ai/rules/css-boundary-rules.md` | `.ai/prompts/audit-css-boundaries.prompt.md` |
| Vitest/Playwright | `.ai/context/tests-quality-context.md` | `.ai/rules/testing-quality-rules.md` | `.ai/prompts/build-regression-test-matrix.prompt.md` |
| Legacy y wrappers | `.ai/context/legacy-cleanup-context.md` | `.ai/rules/legacy-reduction-rules.md` | `.ai/prompts/audit-legacy-runtime-reduction.prompt.md` |
| Integración ContentCustomForm | `.ai/context/content-custom-form-integration-context.md` | `.ai/rules/host-runtime-boundary-rules.md` | `.ai/prompts/repair-contentcustomform-integration.prompt.md` |

## Regla de carga

Un asistente puede cargar al inicio:

```txt
1 contexto principal + 2 reglas + 1 prompt + archivos reales localizados con rg
```

Si necesita más, debe justificarlo.
