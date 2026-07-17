# Modelo operativo Git multiagente

## Flujo permitido

```txt
main
  └─ base estable
      ├─ ai/codex
      ├─ ai/copilot
      ├─ ai/claude
      └─ ai/integration
```

Los agentes crean commits únicamente en sus ramas.

El integrador aplica commits seleccionados en `ai/integration`.

Después del gate:

```bash
cd /Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin
git merge --ff-only ai/integration
```

## Comandos permitidos a agentes

```bash
git status --short
git diff
git diff --check
git add <rutas owned>
git commit
git log
git show
```

## Comandos prohibidos a agentes implementadores

```bash
git switch
git merge
git cherry-pick
git rebase
git push
git pull
git reset --hard
git clean
git stash
git worktree remove
git branch -D
```

## Comandos del integrador

```bash
git diff --name-only main..ai/codex
git diff --name-only main..ai/copilot
git diff --name-only main..ai/claude
git cherry-pick <sha>
npm run lint
npm run build
npx vitest run
npx playwright test ...
```

## Conflictos

Un conflicto no se resuelve escogiendo automáticamente `ours` o `theirs`.

1. Identificar ownership.
2. Revisar dependencia declarada.
3. Abortar si el commit invade rutas ajenas.
4. Devolver el fallo al owner.
5. Reemitir un commit limpio.

## Realineación después de una wave

Solo con worktrees limpios y commits integrados:

```bash
git -C <worktree-agente> reset --hard main
```

Este comando lo ejecuta el coordinador, nunca el agente durante una tarea.
