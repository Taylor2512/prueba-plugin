# Matriz de pruebas — Standard fields

## Unitarios sugeridos

```bash
npx vitest run   tests/unit/schemaStandardSupport.test.ts   tests/unit/checkboxGroup.schema.test.ts   tests/unit/radioGroup.schema.test.ts   tests/unit/schemaAutoPlace.test.ts   tests/unit/schemaCollision.test.ts   tests/unit/snapshotAdapter.test.ts   tests/unit/detailView.schemaMatrix.test.ts   tests/unit/detailWidgetRegistry.test.tsx   tests/unit/designerCoordinateService.test.ts
```

## Playwright sugeridos

```bash
npx playwright test tests/playwright/checkbox-group-docusign-behavior.spec.ts --project=chromium
npx playwright test tests/playwright/radio-group-docusign-behavior.spec.ts --project=chromium
npx playwright test tests/playwright/standard-fields.spec.ts --project=chromium
npx playwright test tests/playwright/schema-no-overlap.spec.ts --project=chromium
npx playwright test tests/playwright/schema-transform.spec.ts --project=chromium
npx playwright test tests/playwright/detail-view-inspector.spec.ts --project=chromium
```

## Quality gate mínimo

```bash
npm run build -- --mode development
npm run lint
```
