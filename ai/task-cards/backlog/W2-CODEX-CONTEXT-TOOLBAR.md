# W2-CODEX-CONTEXT-TOOLBAR — Toolbar contextual

## Estado
`backlog`

## Wave
`W2`

## Proveedor
`Codex`

## Agente lógico
`canvas-agent + interaction-agent`

## Identidad
```txt
worktree: /Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.worktrees/codex
branch: ai/codex
```

## Objetivo
Implementar toolbar contextual después del gate anterior.

## Owned paths
```txt
Canvas/overlays/**
tests/playwright/selection-context-toolbar.spec.ts
```

## Forbidden paths
```txt
Designer/index.tsx
RightSidebar/**
```

## Casos
- flip/clamp
- no overlap
- focus
- Selecto exclusion

## Validación focal
```bash
npx eslint <archivos>
npx vitest run <tests>
npx playwright test <focal> --project=chromium
```

## Criterios
- [ ] Causa raíz.
- [ ] Ownership.
- [ ] Tests focales.
- [ ] Commit atómico.
- [ ] Sin expected falsos.
- [ ] Handoff.

## Handoff
```txt
/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai-coordination/sisad-pdfme/handoffs/W2-CODEX-CONTEXT-TOOLBAR.md
```

## Parada
Detenerse al requerir una ruta no owned o más de 5 archivos productivos.
