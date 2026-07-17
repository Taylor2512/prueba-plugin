# Quickstart — Codex

## Worktree obligatorio

```txt
/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin-codex
branch: ai/codex
port: 5181
```

## Verificación

```bash
pwd
git branch --show-current
git status --short
```

Detente si no estás en la carpeta y rama anteriores.

## Perfil de trabajo

Codex ejecuta preferentemente:

- lógica pura;
- hooks;
- adapters;
- Canvas overlays;
- interacción;
- resolvers;
- contratos de schema;
- pruebas focales.

## Método

1. Leer `ai/start/START.md`.
2. Leer la task-card asignada.
3. Máximo 2 búsquedas `rg`.
4. Abrir máximo 8 archivos.
5. Modificar máximo 5 archivos productivos por commit.
6. Ejecutar ESLint y Vitest focales.
7. Crear commit atómico en `ai/codex`.
8. Escribir handoff externo.
9. Detenerse.

## Prohibido

- trabajar en `prueba-plugin`;
- editar `main` o `ai/integration`;
- integrar commits;
- continuar otra wave;
- ampliar scope para “aprovechar” el contexto;
- arreglar tests cambiando expected sin demostrar contrato.

## Entrega

```md
# HANDOFF — CODEX — <WAVE>
## Estado
## Commits
## Archivos
## Causa raíz
## Cambios
## Validación
## Riesgos
## Listo para integrar
```
