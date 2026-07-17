# W15-CODEX-CORE-CONTRACTS — Contratos core

## Estado
`active`

## Wave
`1.5`

## Proveedor
`Codex`

## Agente lógico
`schema-agent + interaction-agent`

## Identidad
```txt
worktree: /Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.worktrees/codex
branch: ai/codex
```

## Objetivo
Estabilizar contratos unitarios sin tocar inspector ni test infra.

## Owned paths
```txt
src/sisad-pdfme/ui/components/Designer/shared/canvasDropPipeline.ts
src/sisad-pdfme/browser/downloads.ts
src/sisad-pdfme/schemas/checkboxGroup/index.ts
src/sisad-pdfme/schemas/options/**
src/sisad-pdfme/schemas/signature/validation.ts
src/sisad-pdfme/pdf-lib/api/form/**
tests unitarios directos
```

## Forbidden paths
```txt
RightSidebar/**
LeftSidebar/**
CtlBar.tsx
vitest.config.ts
src/features/pdfcomponent/**
package.json
```

## Casos
- resolveNonOverlappingDropPosition
- CheckboxGroup roundtrip
- optionId estable
- provider/P12 validation
- downloadUrl mock
- PDFField/PDFButton

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
/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai-coordination/sisad-pdfme/handoffs/CODEX-W15.md
```

## Parada
Detenerse al requerir una ruta no owned o más de 5 archivos productivos.
