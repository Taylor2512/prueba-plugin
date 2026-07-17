# W3-COPILOT-A11Y — A11y y rails

## Estado
`backlog`

## Wave
`W3`

## Proveedor
`Copilot`

## Agente lógico
`accessibility-agent`

## Identidad
```txt
worktree: /Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.worktrees/copilot
branch: ai/copilot
```

## Objetivo
Implementar a11y y rails después del gate anterior.

## Owned paths
```txt
accessibility specs
src/features/pdfcomponent/**
rails asignados
```

## Forbidden paths
```txt
DetailView/**
Canvas/**
```

## Casos
- keyboard
- focus
- aria
- reduced motion

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
/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai-coordination/sisad-pdfme/handoffs/W3-COPILOT-A11Y.md
```

## Parada
Detenerse al requerir una ruta no owned o más de 5 archivos productivos.
