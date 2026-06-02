# INSTALL_MAC.md — Instalación en macOS

Desde la raíz del proyecto:

```bash
unzip sisad-pdfme-agentic-md-architecture-v4.zip -d /tmp/sisad-pdfme-ai-v4
rsync -av /tmp/sisad-pdfme-ai-v4/ ./
```

Validación de estructura:

```bash
find .ai docs handoff tests reports .claude .codex .github .gemini -name "*.md" | wc -l
```

Validación del proyecto si ya tienes dependencias instaladas:

```bash
npm run build -- --mode development
npm run lint
```

Validación focalizada standard fields:

```bash
npx vitest run tests/unit/checkboxGroup.schema.test.ts tests/unit/schemaStandardSupport.test.ts tests/unit/schemaAutoPlace.test.ts tests/unit/schemaCollision.test.ts tests/unit/snapshotAdapter.test.ts
npx playwright test tests/playwright/checkbox-group-docusign-behavior.spec.ts tests/playwright/schema-no-overlap.spec.ts --project=chromium
```
