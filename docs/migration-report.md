# Migration Report — centralizing sisad-pdfme designer code

Date: 2026-03-16

Summary
- Goal: consolidate designer/business logic and UI under `src/sisad-pdfme`.
- Phase 1 & 2 (completed): moved core runtime hook, domain, utils, template, page and `ControlPanel` into `src/sisad-pdfme` and updated imports.

Files added under `src/sisad-pdfme`
- `src/sisad-pdfme/hooks/usePdfmeLab.js` (migrated from `src/features/sisad-pdfme/usePdfmeLab.js`)
- `src/sisad-pdfme/domain/labState.js` (migrated)
- `src/sisad-pdfme/utils/binary.js` (migrated)
- `src/sisad-pdfme/template.js` (migrated)
- `src/sisad-pdfme/pages/PdfmeLabPage.jsx` (migrated from features)
- `src/sisad-pdfme/ui/components/ControlPanel.jsx` (moved from `src/components/ui`)

Files removed (original locations)
- `src/features/sisad-pdfme/usePdfmeLab.js`
- `src/features/sisad-pdfme/domain/labState.js`
- `src/features/sisad-pdfme/utils/binary.js`
- `src/features/sisad-pdfme/template.js`
- `src/features/sisad-pdfme/PdfmeLabPage.jsx`
- `src/components/ui/ControlPanel.jsx`

Verification
- Ran unit tests: `npm test` — all unit tests passed.

Notes & rationale
- Only designer-specific UI (e.g., `ControlPanel`) and runtime logic were moved. Generic UI components in `src/components/ui` (e.g., `InlineCode`, `FeatureList`, `TechBadge`, `SectionCard`) were left in place as they are app-wide.
- Imports were updated so pages now import designer artifacts from `src/sisad-pdfme` paths.

Next recommended steps (proposed)
1. Move remaining designer-specific components still outside `src/sisad-pdfme` (none detected except `ControlPanel` which is already moved). Verify by searching for references to `../components/ui/ControlPanel` (done).
2. Consolidate designer styles into `src/sisad-pdfme/ui/styles/` and minimize global CSS coupling; migrate rules from `src/styles/global.css` that are designer-specific.
3. Move any page-level E2E tests or Playwright helpers that target designer flows under `tests/playwright` to `src/sisad-pdfme/tests/playwright` or keep them grouped but update paths if needed.
4. Run full E2E test suite (`npm run test:e2e`) in CI or locally after migrating assets to validate runtime behavior.

Commands
```bash
# Run unit tests
npm test

# Run Playwright E2E (after dev server is running)
npm run test:e2e
```

If you want, I can now:
- apply step 2 (consolidate designer styles) and update imports — reply `sí` to proceed; or
- produce a detailed per-file migration plan before making more changes — reply `lista-completa`.
