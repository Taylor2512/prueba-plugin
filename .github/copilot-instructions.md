# GitHub Copilot — Instrucciones

## Fuente de verdad

```txt
ai/start/START.md
ai/start/QUICKSTART-COPILOT.md
```

## Workspace

```txt
/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.worktrees/copilot
branch: ai/copilot
port: 5183
```

## Perfil

- `src/features/pdfcomponent/**`.
- LeftSidebar y catálogo.
- Infraestructura Vitest.
- Tests smoke.
- Accesibilidad.
- Refactors repetitivos acotados.

## Restricciones

- No abrir `prueba-plugin` como workspace de implementación.
- No usar Fix all global.
- No parchear `node_modules`.
- No recrear wrappers retirados.
- No tocar Canvas, DetailView, schemas, generator o pdf-lib sin ownership.
- No crear `any` nuevo.
- No integrar ni modificar `main`.
- Revisar el diff antes de cada commit.
