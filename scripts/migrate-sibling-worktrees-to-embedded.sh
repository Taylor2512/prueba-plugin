#!/usr/bin/env bash
set -euo pipefail

MAIN="/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin"
FRONTEND="/Users/desarrollo1/Documents/Taylor/frontend"
WT_ROOT="$MAIN/.worktrees"

old_paths=(
  "$FRONTEND/prueba-plugin-merge"
  "$FRONTEND/prueba-plugin-codex"
  "$FRONTEND/prueba-plugin-claude"
  "$FRONTEND/prueba-plugin-copilot"
)
new_names=(merge codex claude copilot)

cd "$MAIN"
mkdir -p "$WT_ROOT"

for rule in '.worktrees/' '.ai-coordination/' '.ai-md-architecture-backups/'; do
  grep -Fxq "$rule" .gitignore 2>/dev/null || printf '%s\n' "$rule" >> .gitignore
done

for i in "${!old_paths[@]}"; do
  old="${old_paths[$i]}"
  new="$WT_ROOT/${new_names[$i]}"

  [[ -e "$old" ]] || { echo "SKIP: no existe $old"; continue; }

  if ! git worktree list --porcelain | grep -Fxq "worktree $old"; then
    echo "ERROR: $old existe, pero no es un worktree registrado por $MAIN."
    echo "No se moverá automáticamente porque podría ser un clon independiente."
    exit 1
  fi

  if [[ -n "$(git -C "$old" status --porcelain)" ]]; then
    echo "ERROR: $old tiene cambios sin guardar."
    git -C "$old" status --short
    exit 1
  fi

  if [[ -e "$new" ]]; then
    echo "ERROR: destino existente: $new"
    exit 1
  fi

  echo "MOVIENDO: $old -> $new"
  git worktree move "$old" "$new"
done

git worktree repair "$WT_ROOT"/* 2>/dev/null || true
git worktree prune

echo
git worktree list

echo
echo "Migración finalizada. Abra:"
echo "$MAIN/SISAD-PDFME-MULTIAGENT.code-workspace"
