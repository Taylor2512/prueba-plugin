# W15-CLAUDE-INSPECTOR-CONTRACTS — Contratos inspector

## Estado
`active`

## Wave
`1.5`

## Proveedor
`Claude`

## Agente lógico
`inspector-agent + schema-agent`

## Identidad
```txt
worktree: /Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.worktrees/claude
branch: ai/claude
```

## Objetivo
Cerrar errores funcionales del inspector antes del polish.

## Owned paths
```txt
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/**
src/sisad-pdfme/schemas/actions/**
src/sisad-pdfme/schemas/schemaFamilies.ts
src/sisad-pdfme/schemas/radioGroup/index.ts
src/sisad-pdfme/schemas/propPanel/**
src/sisad-pdfme/ui/components/CtlBar.tsx
tests unitarios directos
```

## Forbidden paths
```txt
Canvas/**
LeftSidebar/**
browser/**
pdf-lib/**
vitest.config.ts
runtimeStyles.ts
```

## Casos
- HELP ReferenceError
- editable matrix
- property maps
- RadioGroup advanced
- action family
- CtlBar

## Validación focal
```bash
npx eslint <archivos>
npx vitest run <tests>
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
/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai-coordination/sisad-pdfme/handoffs/CLAUDE-W15.md
```

## Parada
Detenerse al requerir una ruta no owned o más de 5 archivos productivos.
