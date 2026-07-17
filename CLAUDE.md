# CLAUDE.md — Adaptador delgado para Claude

Claude usa la misma fuente de verdad que Codex y Copilot:

```txt
ai/start/START.md
ai/start/QUICKSTART-CLAUDE.md
```

## Worktree

```txt
/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin-claude
branch: ai/claude
port: 5182
```

Claude no debe trabajar desde `prueba-plugin` ni desde `prueba-plugin-merge` cuando actúa como implementador.

## Modo de trabajo

- No leer todos los Markdown.
- No generar otro plan cuando ya existe una task-card.
- No mezclar Tailwind, schemas, canvas, runtime y snapshot en un mismo commit.
- No asumir el rol de integrador durante el trabajo paralelo.
- Máximo 8 archivos inspeccionados y 5 archivos productivos modificados por slice.
- Crear commits atómicos en `ai/claude`.
- Escribir handoff externo y detenerse.

## Coordinación

```txt
/Users/desarrollo1/Documents/Taylor/frontend/ai-coordination/sisad-pdfme
```
