# GitHub Copilot Instructions — Adaptador delgado

Fuente de verdad:

```txt
ai/start/START.md
ai/start/QUICKSTART-COPILOT.md
```

## Workspace obligatorio

```txt
/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin-copilot
branch: ai/copilot
port: 5183
```

## Restricciones

- No usar el checkout `prueba-plugin`.
- No usar `Fix all` global.
- No ejecutar formatters globales.
- No tocar Moveable, Selecto, geometría, snapshot, generator o pdf-lib sin task-card explícita.
- No introducir `any` nuevo.
- No duplicar canvas, sidebars, toolbar, renderer o runtime.
- Preservar metadata de schemas y contratos de Form/Viewer/Generator.
- Editar solo rutas owned.
- Crear commits atómicos solo en `ai/copilot`.
- No integrar, hacer merge ni modificar `main`.
