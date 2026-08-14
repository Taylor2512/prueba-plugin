# SISAD-PDFME — autonomous Markdown architecture repair

Use live repository state, not the exported context pack, as final authority.

Start:

```bash
git status --short
git rev-parse HEAD
node scripts/ai/same-repo-coordinator.mjs status .
npm run architecture:audit
```

Same repo/same branch/no worktrees.

Before editing files already in another writer's claim, stop writing that surface and choose
disjoint work.

Then:

```bash
npm run architecture:repair
```

Inspect conflicts. If none:

```bash
npm run architecture:repair:apply
npm run architecture:verify
```

Rules:

- evidence > card > ledger/view;
- PASS + open dependency = PARTIAL;
- archive history instead of deleting it;
- delete `.trace-tmp` only with zero external refs and backup;
- do not remove duplicate provider skills automatically;
- regenerate views/links after path moves;
- update CURRENT/HANDOFF from the reconciled state;
- do not ask which task to continue.

Never use destructive Git or worktrees.
