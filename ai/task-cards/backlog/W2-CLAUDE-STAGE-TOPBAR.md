# W2-CLAUDE-STAGE-TOPBAR — Topbar y Guardar

## Estado
`backlog`

## Wave
`W2`

## Proveedor
`Claude`

## Agente lógico
`inspector-agent + designer-runtime-agent`

## Identidad
```txt
worktree: /Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.worktrees/claude
branch: ai/claude
```

## Objetivo
Implementar topbar y guardar después del gate anterior.

## Owned paths
```txt
Designer/index.tsx
CtlBar.tsx
UnitPager.tsx
save-toolbar-no-overlap.spec.ts
```

## Forbidden paths
```txt
LeftSidebar/**
Moveable.tsx
```

## Casos
- Guardar fuera del rail
- saving status
- global menu
- responsive

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
/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai-coordination/sisad-pdfme/handoffs/W2-CLAUDE-STAGE-TOPBAR.md
```

## Parada
Detenerse al requerir una ruta no owned o más de 5 archivos productivos.
