# Serena quality gates

Focal:

```bash
node scripts/ai/serena/serena-audit.mjs .
npm run lint
npm run typecheck
```

Semantic:

```bash
serena project index .
serena project health-check .
```

Architecture:

```bash
npm run quality -- architecture
git diff --check
```

A gate is PASS only when it was actually executed successfully.
