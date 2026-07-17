# W5-RELEASE-BOUNDARY — Release boundary

## Estado
`backlog`

## Wave
`W5`

## Proveedor
`Integrador`

## Agente lógico
`integration-agent + public-api-reviewer`

## Identidad
```txt
worktree: /Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.worktrees/merge
branch: ai/integration
```

## Objetivo
Implementar release boundary después del gate anterior.

## Owned paths
```txt
boundary tests
docs API
release checklists
```

## Forbidden paths
```txt
features nuevas
```

## Casos
- core no host imports
- host no internals
- full gate

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
/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai-coordination/sisad-pdfme/handoffs/W5-RELEASE-BOUNDARY.md
```

## Parada
Detenerse al requerir una ruta no owned o más de 5 archivos productivos.
