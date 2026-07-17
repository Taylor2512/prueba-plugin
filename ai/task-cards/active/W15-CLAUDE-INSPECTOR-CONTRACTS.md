# W15-CLAUDE-INSPECTOR-CONTRACTS

## Estado

`active`

## Proveedor

Claude

## Agente lógico

inspector-agent + schema-agent para contratos declarados.

## Worktree

```txt
/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin-claude
branch: ai/claude
port: 5182
```

## Objetivo

Cerrar errores unitarios del inspector antes del rediseño visual.

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
package.json
runtimeStyles.ts
```

## Casos

- `HELP` ReferenceError.
- Matriz `editable`.
- `propertyMap` required/data/validation.
- `groupId`, `groupName`, `optionsContainer`.
- Familia semántica action.
- Contratos DetailSectionCard.
- Clusters CtlBar.

## Regla

No hacer polish general ni otra auditoría.

## Handoff

`CLAUDE-W15.md`
