# W2-COPILOT-LEFT-SIDEBAR — LeftSidebar compacto

## Estado
`backlog`

## Wave
`W2`

## Proveedor
`Copilot`

## Agente lógico
`lab-shell-agent + css-tailwind-agent`

## Identidad
```txt
worktree: /Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.worktrees/copilot
branch: ai/copilot
```

## Objetivo
Implementar leftsidebar compacto después del gate anterior.

## Owned paths
```txt
Designer/LeftSidebar*
Designer/PluginIcon.tsx
left-sidebar specs
```

## Forbidden paths
```txt
RightSidebar/**
Canvas/**
```

## Casos
- density
- favorites
- drag stability
- collapsed width

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
/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai-coordination/sisad-pdfme/handoffs/W2-COPILOT-LEFT-SIDEBAR.md
```

## Parada
Detenerse al requerir una ruta no owned o más de 5 archivos productivos.
