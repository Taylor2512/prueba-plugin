# W4-CLAUDE-RUNTIME-STYLES — runtimeStyles

## Estado
`backlog`

## Wave
`W4`

## Proveedor
`Claude`

## Agente lógico
`css-tailwind-agent`

## Identidad
```txt
worktree: /Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.worktrees/claude
branch: ai/claude
```

## Objetivo
Implementar runtimestyles después del gate anterior.

## Owned paths
```txt
src/sisad-pdfme/ui/runtimeStyles.ts
componentes owners
tests visuales
```

## Forbidden paths
```txt
edición paralela
```

## Casos
- KEEP
- MIGRATE
- DELETE
- technical only

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
/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai-coordination/sisad-pdfme/handoffs/W4-CLAUDE-RUNTIME-STYLES.md
```

## Parada
Detenerse al requerir una ruta no owned o más de 5 archivos productivos.
