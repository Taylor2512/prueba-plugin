# Modelo Git

## Implementadores

Permitido:

```bash
git status
git diff
git diff --check
git add <owned paths>
git commit
git log
git show
```

Prohibido:

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
git branch -D
git worktree remove
```

## Integrador

Revisa ramas, aplica SHAs y ejecuta gate. No hace merge de ramas completas.

## Publicación

```bash
git merge --ff-only ai/integration
```

## Realineación

Solo después del gate, fast-forward y con worktrees limpios.
