# W15-CODEX-CORE-CONTRACTS

## Estado

`active`

## Proveedor

Codex

## Agente lógico

schema-agent + interaction-agent, limitado a las rutas declaradas.

## Worktree

```txt
/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin-codex
branch: ai/codex
port: 5181
```

## Objetivo

Estabilizar contratos funcionales unitarios sin tocar UI del inspector o infraestructura de tests.

## Owned paths

```txt
src/sisad-pdfme/ui/components/Designer/shared/canvasDropPipeline.ts
src/sisad-pdfme/browser/downloads.ts
src/sisad-pdfme/schemas/checkboxGroup/index.ts
src/sisad-pdfme/schemas/options/**
src/sisad-pdfme/schemas/signature/validation.ts
src/sisad-pdfme/pdf-lib/api/form/**
tests unitarios directos de estas áreas
```

## Forbidden paths

```txt
RightSidebar/**
LeftSidebar/**
CtlBar.tsx
Designer/index.tsx
vitest.config.ts
package.json
src/features/pdfcomponent/**
```

## Casos

- `resolveNonOverlappingDropPosition`.
- Roundtrip CheckboxGroup.
- Identidad estable de `optionId`.
- Provider/P12 validation.
- `downloadUrl` con anchors mock.
- Ciclo PDFField/PDFButton.

## Validación

ESLint y Vitest focales. Build solo al cerrar el slice si no hay otro proceso pesado.

## Handoff

`CODEX-W15.md`
