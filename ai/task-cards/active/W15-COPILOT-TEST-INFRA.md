# W15-COPILOT-TEST-INFRA

## Estado

`completed`

## Proveedor

GitHub Copilot

## Agente lógico

lab-shell-agent + visual-baseline-agent, limitado a infraestructura.

## Worktree

```txt
/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin-copilot
branch: ai/copilot
port: 5183
```

## Objetivo

Corregir resolución y tests stale sin recrear wrappers retirados.

## Owned paths

```txt
vitest.config.ts
tests/setup.*
src/features/pdfcomponent/**
tests/unit/features/pdfcomponent/**
tests/unit/App.test.ts
tests/unit/main.test.ts
tests unitarios smoke de Designer y RightSidebar
```

## Forbidden paths

```txt
RightSidebar/DetailView/**
Canvas/**
schemas/**
browser/**
pdf-lib/**
package.json
package-lock.json
```

`package.json` solo se toca con autorización del integrador.

## Casos

- Resolución `antd/es/theme/internal` en Vitest.
- Tests stale de CaseGrid/Hero/IconButton.
- Smoke imports App/main/Designer/RightSidebar.
- No parchear node_modules.
- No recrear wrappers muertos.

## Handoff

`COPILOT-W15.md`
