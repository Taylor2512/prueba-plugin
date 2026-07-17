# Protocolo de integración

## Worktree

```txt
/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin-merge
branch: ai/integration
```

## Preparación

```bash
pwd
git branch --show-current
git status --short
```

## Revisar ramas

```bash
git diff --name-only main..ai/codex
git diff --name-only main..ai/copilot
git diff --name-only main..ai/claude
```

Comparar con la wave y los handoffs.

## Aplicar

Orden predeterminado:

```txt
Codex
Copilot
Claude
```

```bash
git cherry-pick <sha>
```

Aplicar solo commits aprobados; no hacer merge de ramas completas.

## Gate

```bash
git diff --check main..HEAD
npm run lint
npm run build
npx vitest run
```

Con Vitest verde:

```bash
npx playwright test \
  tests/playwright/drag-preview-and-canvas-scroll-regression.spec.ts \
  tests/playwright/right-sidebar-detail-scroll.spec.ts \
  tests/playwright/right-sidebar-docs-tab.spec.ts \
  --project=chromium
```

## Publicación

```bash
cd /Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin
git switch main
git status --short
git merge --ff-only ai/integration
```

## Realineación

Después de publicar, verificar cada worktree limpio y realinear desde `main`.

No ejecutar realineación cuando exista trabajo sin commit.
