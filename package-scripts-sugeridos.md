# Package scripts sugeridos

Agregar si no existen:

```json
{
  "scripts": {
    "ai:check:recipient-transform": "node scripts/ai/check-recipient-transform-workspace.js",
    "test:recipient-colors": "npx playwright test tests/playwright/multiuser-collaboration.spec.ts",
    "test:canvas-transform": "npx playwright test tests/playwright/canvas-interactions.spec.ts tests/playwright/shortcuts.spec.ts"
  }
}
```
