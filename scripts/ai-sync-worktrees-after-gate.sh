#!/usr/bin/env bash
set -euo pipefail
MAIN="/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin"
paths=("$MAIN/.worktrees/merge" "$MAIN/.worktrees/codex" "$MAIN/.worktrees/claude" "$MAIN/.worktrees/copilot")

cd "$MAIN"
git switch main

if [[ -n "$(git status --porcelain)" ]]; then
  echo "ERROR: main no está limpio."
  git status --short
  exit 1
fi

for path in "${paths[@]}"; do
  [[ -d "$path" ]] || { echo "ERROR: no existe $path"; exit 1; }
  if [[ -n "$(git -C "$path" status --porcelain)" ]]; then
    echo "ERROR: $path no está limpio."
    git -C "$path" status --short
    exit 1
  fi
done

read -r -p "Escribe REALINEAR para resetear las cuatro ramas al main actual: " answer
[[ "$answer" == "REALINEAR" ]] || { echo "Cancelado."; exit 0; }

for path in "${paths[@]}"; do
  git -C "$path" reset --hard main
done

git worktree prune
"$MAIN/scripts/ai-worktree-status.sh"
