# Evidence — SPRT-010 tooling install/import safety

Date: 2026-08-13

## Changes

- Fixed non-Markdown importer copy path in `scripts/tooling/importer.mjs`.
- Hardened `scripts/install-project-tools.mjs` with identical/create/conflict
  planning, `keep-target` default, explicit `--conflict=prefer-source`, external
  backups and all-or-nothing apply on conflicts.
- Hardened `scripts/install-tests.mjs` with dry-run planning, conflict refusal
  before mutation and explicit `--new-only` application.
- Added JSON importer coverage to `tests/tooling/importer.test.mjs`.

## Verification

- `node tools/sisad-pdfme-runtime/audit-tooling-safety.mjs .`: PASS, no findings.
- `node --test tests/tooling/importer.test.mjs tests/tooling/project-tools.test.mjs`: PASS, 2 tests.
- Temporary installer preflight: default conflict returned code 3 and made no changes.
- Temporary installer `--new-only`: copied absent files and preserved conflict.
- Temporary project-tools installer: `keep-target` blocked all apply; explicit
  `prefer-source` replaced with an external backup.
- `git diff --check`: PASS.

## Boundary

No SISAD-PDFME runtime product source or business rules were changed. The
changes are tooling-only and preserve existing dry-run/`--apply` usage.
