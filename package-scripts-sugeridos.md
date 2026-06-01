# Scripts sugeridos

```json
{
  "scripts": {
    "quality:recipient-transform-workspace": "node scripts/ai/check-recipient-transform-workspace.js",
    "test:recipient-colors": "npx playwright test tests/playwright/recipient-colors.spec.ts --project=chromium",
    "test:schema-transform": "npx playwright test tests/playwright/schema-transform.spec.ts --project=chromium",
    "test:unit:recipient": "npx vitest run tests/unit/recipientColor.test.ts tests/unit/schemaTone.test.ts",
    "test:unit:snapshot": "npx vitest run tests/unit/sisad-snapshotAdapter.test.ts tests/unit/sisad-v3Contract.test.ts"
  }
}
```
