# Runtime Platform gates

Focal first. Final release minimum:

```bash
npm run lint
npm run build
npx vitest run
npm run quality:template-contracts
npm run quality:direct-config-readers
npm run quality:source-language-boundary
npm run quality:dead-code:ci
npm run quality:duplicates:ci
npm run quality:wrapper-components
npx playwright test --project=chromium
```

Los scripts se revalidan contra `package.json` vivo en RTP-000. No copiar este bloque como
prueba de que fueron ejecutados.

Gates funcionales extra: registry-derived all-schema suite, sibling draft preservation,
atomic multi-key patch, host push no echo, Viewer zero mutation, Snapshot semantic roundtrip,
large-PDF cleanup/leak, object URL cleanup, keyboard/pointer accessibility.

<!-- runtime-execution:gates:start -->
## Execution orchestration gates

- schema completion matrix;
- pairwise sibling isolation;
- User × Document × Session isolation;
- two Forms same JS realm;
- two BrowserContexts;
- sequential/parallel/mixed/massive simulations;
- canonical PDF merge/conflicts;
- multi-document append;
- provenance manifest;
- performance/privacy/memory.
<!-- runtime-execution:gates:end -->
