#!/usr/bin/env bash
set -euo pipefail

MAIN="/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin"
WT_ROOT="$MAIN/.worktrees"
COORD="$MAIN/.ai-coordination/sisad-pdfme"

names=(merge codex claude copilot)
branches=(ai/integration ai/codex ai/claude ai/copilot)

cd "$MAIN"
git switch main

if [[ -n "$(git status --porcelain --untracked-files=no)" ]]; then
  echo "ERROR: main tiene cambios tracked sin guardar."
  git status --short
  exit 1
fi

mkdir -p "$WT_ROOT" "$COORD"/{locks,handoffs,status,gates,incidents}

# Protección idempotente del repositorio principal.
for rule in '.worktrees/' '.ai-coordination/' '.ai-md-architecture-backups/'; do
  grep -Fxq "$rule" .gitignore 2>/dev/null || printf '%s\n' "$rule" >> .gitignore
done

for i in "${!names[@]}"; do
  name="${names[$i]}"
  branch="${branches[$i]}"
  target="$WT_ROOT/$name"

  if git worktree list --porcelain | grep -Fxq "worktree $target"; then
    echo "OK: $name ya está registrado en $target"
    continue
  fi

  if [[ -e "$target" ]]; then
    echo "ERROR: $target existe pero no está registrado como worktree."
    exit 1
  fi

  if ! git show-ref --verify --quiet "refs/heads/$branch"; then
    git branch "$branch" main
  fi

  git worktree add "$target" "$branch"

  if [[ -d "$MAIN/node_modules" && ! -e "$target/node_modules" ]]; then
    ln -s ../../node_modules "$target/node_modules"
  fi

  for env_file in .env .env.local .env.development .env.test; do
    if [[ -e "$MAIN/$env_file" && ! -e "$target/$env_file" ]]; then
      ln -s "../../$env_file" "$target/$env_file"
    fi
  done
done

git worktree prune

echo
echo "Worktrees internos preparados:"
git worktree list

echo
echo "Abra el workspace multi-root con:"
echo "code $MAIN/SISAD-PDFME-MULTIAGENT.code-workspace"
