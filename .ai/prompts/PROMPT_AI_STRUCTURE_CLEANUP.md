# SISAD-PDFME — cleanup `.ai/**`

Do not edit source product code.

Run:

```bash
git status --short
git branch --show-current
git rev-parse HEAD
node scripts/ai/same-repo-coordinator.mjs status .
npm run architecture -- structure:audit
npm run architecture -- structure:plan
```

Inspect `reports/architecture/AI-STRUCTURE-PLAN.md`.

If there are no conflicts:

```bash
npm run architecture -- structure:apply
npm run architecture -- structure:verify
```

Then inspect:
- `git status --short`
- `git diff --check`
- `reports/architecture/AI-STRUCTURE-VERIFY.md`

Do not manually resurrect deleted projections such as root ACTIVE/COMPLETED/backlog rows.

Do not recreate worktree instructions.

If a deletion candidate has external consumers, classify it `REVIEW` and keep it.
Continue all safe locally executable cleanup without asking which item to do next.
