# DigitalAgreements contract tools

These tools are frontend-only and dependency-free Node scripts.

## Baseline report

```bash
node tools/digital-agreements-contracts/report-da-contracts.mjs
```

Writes a report under `reports/digital-agreements-contracts/`.

## Validate

```bash
node tools/digital-agreements-contracts/validate-da-contracts.mjs
node tools/digital-agreements-contracts/validate-da-contracts.mjs --strict
```

Default mode reports warnings. `--strict` exits non-zero for blocking invariant failures.

## Source manifest

```bash
node tools/digital-agreements-contracts/build-da-source-manifest.mjs
```

This hashes current source and generated `unificados` packs. It does **not** regenerate
them; regeneration remains owned by the repository's existing context-pack tooling.

<!-- project-tools:navigation:start -->
## Navegación generada
<!-- project-tools:navigation:end -->
