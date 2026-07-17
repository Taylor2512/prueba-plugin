# CLAUDE.md — Adaptador para Claude

## Fuente de verdad

```txt
ai/start/START.md
ai/start/QUICKSTART-CLAUDE.md
```

## Implementación

```txt
worktree: /Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.worktrees/claude
branch: ai/claude
port: 5182
```

## Perfil recomendado

- RightSidebar, DetailView y ListView.
- Topbar, Guardar y menú global.
- Scroll ownership.
- DocumentsRail y CommentsRail.
- Arquitectura visual y accesibilidad.
- Contratos semánticos del inspector.

## Restricciones

- No transformar una task en auditoría general.
- Máximo 8 archivos abiertos y 5 productivos por commit.
- No actuar simultáneamente como integrador.
- No tocar Canvas, Moveable, Selecto, pdf-lib o snapshot sin ownership.
- No duplicar estilos estáticos entre `className` y `style`.
- No integrar commits de otros agentes.

Crear commit en `ai/claude`, escribir handoff externo y detenerse.
