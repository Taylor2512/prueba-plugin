# Plan 06 — Release QA

## Gate

```bash
npm run lint
npm run build
npx vitest run
npx playwright test --project=chromium
```

## Matriz

Designer sin config, recipients, Form por recipient, Viewer readonly, multi-document, reassignment, owner color, option groups, firmas, snapshot, generator, keyboard, focus y responsive.

## Boundary

Core sin imports host, host sin internals, CSS entrypoints únicos y worktrees excluidos.

## Documentación

README, API pública, integración, troubleshooting, known gaps y changelog.
