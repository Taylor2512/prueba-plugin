# W15-INTEGRATION-GATE — Gate Wave 1.5

## Estado
`active`

## Wave
`1.5`

## Proveedor
`Integrador`

## Agente lógico
`integration-agent`

## Identidad
```txt
worktree: /Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.worktrees/merge
branch: ai/integration
```

## Objetivo
Integrar SHAs aceptados y ejecutar gate completo.

## Owned paths
```txt
rama ai/integration
coordinación externa/gates/**
```

## Forbidden paths
```txt
features nuevas
expected/snapshots
main antes del gate
```

## Casos
- ownership
- intersecciones
- lint/build/Vitest
- Playwright
- fast-forward

## Validación focal
```bash
npm run lint
npm run build
npx vitest run
npx playwright test <focales> --project=chromium
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
/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai-coordination/sisad-pdfme/gates/W15.md
```

## Parada
Detenerse al requerir una ruta no owned o más de 5 archivos productivos.
