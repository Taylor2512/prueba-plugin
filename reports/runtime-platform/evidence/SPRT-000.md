# Evidence — SPRT-000 live baseline

Date: 2026-08-13
Branch: `main`
HEAD: `d526bc66f7c51878093cc2174b0487d62ac46c55`

## Scope

Baseline of the live SISAD-PDFME source. The dirty tree contains unrelated
work; this task does not attribute those files.

## Public API confirmed

`src/sisad-pdfme/index.ts` exports the instance API, React provider and
Designer/Form/Viewer wrappers, configuration factories, snapshot bundle
operations, adapters, generator and converter aliases.

## Runtime surfaces confirmed

- Form and Viewer wrappers are exported from `src/sisad-pdfme/integration/index.ts`.
- `usePdfmeRuntimeInstance.ts` owns injected Designer/Form/Viewer lifecycle,
  input synchronization, template synchronization and isolation keys.
- Runtime modes and host reconciliation have focused contract tests.

## Configuration, schemas and artifacts

- Configuration barrel exports default/create/resolve/profile/migration/
  validation/service APIs.
- Schema family and value behavior have focused contract tests.
- Snapshot types and adapter are exported through the shared/contracts barrels.
- Generator exposes PDF generation and preflight; converter exposes browser
  implementations plus semantic aliases.

## Tests

- `npm run test:sisad-pdfme:runtime`: PASS, 4 files, 57 tests.
- `npm run test:sisad-pdfme:schemas`: PASS, 3 files, 98 tests.
- DigitalAgreements Form contract: PASS, 2 tests.

## Decision

`SPRT-000` baseline is complete. No product source was changed by this
baseline task. The next dependency is `SPRT-010`.

## Risk

The repository still contains unrelated dirty-tree changes and generated
pack/index drift. Future tasks must preserve ownership boundaries and use live
source as authority.
