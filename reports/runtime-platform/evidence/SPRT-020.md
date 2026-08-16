# Evidence — SPRT-020 dedup and stable document names

Date: 2026-08-14

## Dedup baseline provenance

| Field | Value |
|---|---|
| repository | `prueba-plugin` |
| HEAD | `d526bc66f7c51878093cc2174b0487d62ac46c55` |
| report | `reports/jscpd-owned/jscpd-report.json` |
| percentage | `0.5540793837154215` |
| clones | `44` |
| duplicated lines | `538` |
| threshold | `0.57` |
| baseline source | Local current owned profile |
| decision | Local baseline initialized |

The SISAD-WEB historical baseline (`7.6118%`, 641 clones) is a different
lineage: the current profile has 477 sources and 44 clones. The local
threshold is reproducible with the existing ratchet formula:
`round2(ceil(percentage * 100) / 100 + 0.01) = 0.57`.

## Stable-name resolution

| Old path | Classification | Action | New path / exemption basis |
|---|---|---|---|
| `.ai/archive/campaigns/runtime-hardening/record/PACKAGE-MANIFEST.json` | CAMPAIGN_RECORD | preserve | `.ai/ops/**` operational namespace |
| `.ai/archive/campaigns/runtime-hardening/record/README.md` | CAMPAIGN_RECORD | preserve | `.ai/ops/**` operational namespace |
| `.ai/archive/campaigns/runtime-hardening/record/START.md` | CAMPAIGN_RECORD | preserve | `.ai/ops/**` operational namespace |
| `.ai/archive/campaigns/runtime-hardening/TASK-LEDGER.md` | TASK_CARD | preserve | `.ai/ops/**` operational namespace |
| `.ai/archive/campaigns/runtime-hardening/PLAN.md` | CAMPAIGN_RECORD | preserve | typed `PLAN_*_Vn` execution identity |
| `.ai/archive/campaigns/runtime-hardening/PROMPT-BOOT.md` | CAMPAIGN_RECORD | preserve | typed `PROMPT_*_Vn` execution identity |
| `.ai/archive/campaigns/runtime-hardening/PROMPT-MASTER.md` | CAMPAIGN_RECORD | preserve | typed `PROMPT_*_Vn` execution identity |

The validator now applies this semantic classification in both scan and
metadata paths. It does not whitelist arbitrary versioned documents.

## SchemaAssignments compatibility

- Live consumers in `src/sisad-pdfme/assignments/index.ts` and
  `src/sisad-pdfme/common/collaboration.ts` use the three-level
  recipient/document/page shape.
- No live TypeScript/JavaScript consumer imports the former four-level
  contract from `contracts/index.ts`.
- `SchemaAssignments` remains the three-level public contract;
  `UserSchemaAssignments` is an additive name for the four-level shape.
- `contracts/index.ts` exports both without duplicate declarations.
- Build and focal contracts pass, with no root public facade regression.

## Validation

| Command | Result | Meaning |
|---|---|---|
| `npm run quality:duplicates:owned` | PASS | owned profile executable |
| `npm run quality:duplicates:vendor` | PASS | vendor profile executable, zero clones |
| `npm run quality:duplicates:docs` | PASS | docs profile executable |
| `npm run quality:duplicates:ratchet` | PASS | current percentage below `0.57` |
| controlled ratchet probe at `0.58` | PASS as rejection | exit `1`, threshold enforced |
| `npm run docs:names` | PASS | versioned canonical paths `0` |
| `npm run docs:broken-links` | PASS | broken Markdown links `0` |
| `npm run docs:validate` | PASS | architecture validation green |
| tooling test | PASS | operational namespace coverage |
| `npm run test:sisad-pdfme:runtime` | PASS | 57 tests |
| `npm run test:sisad-pdfme:schemas` | PASS | 98 tests |
| DigitalAgreements Form test | PASS | 2 tests |
| `npm run build` | PASS | exit `0` |
| `git diff --check` | PASS | no whitespace errors |
