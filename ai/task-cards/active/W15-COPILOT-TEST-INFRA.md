# W15-COPILOT-TEST-INFRA — Infraestructura de tests

## Estado
`active`

## Wave
`1.5`

## Proveedor
`Copilot`

## Agente lógico
`test-infrastructure-agent + lab-shell-agent`

## Identidad
```txt
worktree: /Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.worktrees/copilot
branch: ai/copilot
```

## Objetivo
Resolver imports y tests stale sin recrear wrappers.

## Owned paths
```txt
vitest.config.ts
tests/setup.*
src/features/pdfcomponent/**
tests/unit/features/pdfcomponent/**
tests smoke autorizados
```

## Forbidden paths
```txt
RightSidebar/DetailView/**
Canvas/**
schemas/**
browser/**
pdf-lib/**
package.json
```

## Casos
- AntD theme internal
- CaseGrid/Hero/IconButton stale
- smoke imports
- host routes
- no node_modules patch

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
/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai-coordination/sisad-pdfme/handoffs/COPILOT-W15.md
```

## Parada
Detenerse al requerir una ruta no owned o más de 5 archivos productivos.
