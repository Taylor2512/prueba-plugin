# Quickstart — Integrador

## Worktree exclusivo

```txt
/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin-merge
branch: ai/integration
port: 5174
```

El integrador no implementa features mientras los agentes trabajan.

## Inicio

```bash
pwd
git branch --show-current
git status --short
```

El árbol debe estar limpio.

## Entradas

Leer:

```txt
/Users/desarrollo1/Documents/Taylor/frontend/ai-coordination/sisad-pdfme/handoffs
ai/coordination/worktrees/OWNERSHIP.md
ai/coordination/worktrees/INTEGRATION-PROTOCOL.md
```

## Responsabilidades

1. Comparar ramas contra `main`.
2. Rechazar rutas fuera de ownership.
3. Detectar intersecciones.
4. Aplicar solo SHAs aceptados.
5. Ejecutar gate.
6. No modificar expected o snapshots.
7. Publicar `ai/integration` a `main` mediante fast-forward.
8. Realinear ramas reutilizables solo después de confirmar que están limpias.

## Orden predeterminado

```txt
Codex
Copilot
Claude
```

El orden puede cambiar únicamente si el handoff declara una dependencia explícita.
