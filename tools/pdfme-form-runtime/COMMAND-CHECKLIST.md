# Command checklist — adaptar a scripts vivos

No ejecutar a ciegas; primero revisar `package.json`/`--help`.

## Baseline

```bash
git status --short
git rev-parse HEAD
npm run lint --if-present
npm run typecheck --if-present
```

## Standalone reusable

Preferir scripts existentes:

```bash
npm test -- --run
npm run quality:template-contracts --if-present
npm run quality:direct-config-readers --if-present
npm run quality:source-language-boundary --if-present
```

## SISAD-WEB downstream

```bash
npm run audit:sisad-pdfme-boundary
npm run test:run
npm run lint
npm run build
```

Usar los nombres reales del repo vivo si difieren.

## Drift

```bash
git diff --no-index <normalized-upstream-root> <normalized-downstream-root>
```

Preferir manifest/hash por archivos owned en vez de comparar dependencias/build outputs.
