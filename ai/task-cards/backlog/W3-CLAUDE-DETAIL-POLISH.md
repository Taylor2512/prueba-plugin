# W3-CLAUDE-DETAIL-POLISH — Polish inspector

## Estado
`backlog`

## Wave
`W3`

## Proveedor
`Claude`

## Agente lógico
`inspector-agent`

## Identidad
```txt
worktree: /Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.worktrees/claude
branch: ai/claude
```

## Objetivo
Implementar polish inspector después del gate anterior.

## Owned paths
```txt
RightSidebar/ListView/**
RightSidebar/DetailView/**
DocumentsRail.tsx
```

## Forbidden paths
```txt
Canvas/**
runtimeStyles.ts
```

## Casos
- density
- hierarchy
- documents/pages
- a11y

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
/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai-coordination/sisad-pdfme/handoffs/W3-CLAUDE-DETAIL-POLISH.md
```

## Parada
Detenerse al requerir una ruta no owned o más de 5 archivos productivos.
