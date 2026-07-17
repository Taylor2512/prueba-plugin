# W3-CODEX-OWNER-COLOR — Owner color

## Estado
`backlog`

## Wave
`W3`

## Proveedor
`Codex`

## Agente lógico
`designer-runtime-agent`

## Identidad
```txt
worktree: /Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.worktrees/codex
branch: ai/codex
```

## Objetivo
Implementar owner color después del gate anterior.

## Owned paths
```txt
recipients/**
collaboration/schemaOwnershipAppearance.ts
owner color tests
```

## Forbidden paths
```txt
RightSidebar/**
```

## Casos
- persisted owner
- fallback
- reassignment

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
/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai-coordination/sisad-pdfme/handoffs/W3-CODEX-OWNER-COLOR.md
```

## Parada
Detenerse al requerir una ruta no owned o más de 5 archivos productivos.
