# Quickstart — GitHub Copilot

## Workspace obligatorio

```txt
/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin-copilot
branch: ai/copilot
port: 5183
```

## Antes de Agent Mode

```bash
pwd
git branch --show-current
git status --short
```

Carga:

```txt
ai/start/START.md
ai/task-cards/active/<task>.md
```

## Perfil de trabajo

Copilot ejecuta preferentemente:

- host `src/features/pdfcomponent/**`;
- LeftSidebar;
- limpieza repetitiva y tipado acotado;
- ESLint;
- infraestructura Vitest;
- accesibilidad;
- tests smoke y visuales de su dominio.

## Restricciones

- No usar `Fix all` global.
- No editar un archivo fuera de owned paths aunque aparezca en Problems.
- No parchear `node_modules`.
- No recrear wrappers muertos para satisfacer tests stale.
- No tocar Canvas, DetailView, schemas o pdf-lib sin task-card.
- Revisar cada diff antes de aceptar.
- Crear commits atómicos en `ai/copilot`.
- Escribir handoff externo y detenerse.
