# Gates de calidad

## Gate rápido por edición

```bash
npx eslint <archivos>
npx vitest run <tests-focales>
```

## Gate de task-card

```bash
npm run lint
npm run build
npm run quality:duplicates:strict
```

Añade tests unitarios o Playwright según el dominio.

## Gate de arquitectura IA

```bash
node tools/ai-quality/validate-ai-architecture.mjs
node tools/ai-quality/check-markdown-duplicates.mjs
```

## Perfiles jscpd

```bash
npx jscpd --config configs/jscpd-owned.json
npx jscpd --config configs/jscpd-vendor.json
npx jscpd --config configs/jscpd-docs.json
node tools/ai-quality/parse-jscpd-report.mjs reports/jscpd/jscpd-report.json
```

## Criterio

El gate owned no acepta nuevos clones relevantes en archivos modificados. El baseline total puede reducirse por olas; no hace falta resolver deuda ajena a la task-card.
