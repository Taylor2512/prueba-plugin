#!/usr/bin/env bash
set -euo pipefail
MAIN="/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin"
paths=("$MAIN" "$MAIN/.worktrees/merge" "$MAIN/.worktrees/codex" "$MAIN/.worktrees/claude" "$MAIN/.worktrees/copilot")

for path in "${paths[@]}"; do
  echo "============================================================"
  echo "$path"
  if [[ ! -d "$path" ]]; then
    echo "NO EXISTE"
    continue
  fi
  echo "branch: $(git -C "$path" branch --show-current)"
  echo "head:   $(git -C "$path" log -1 --oneline)"
  status="$(git -C "$path" status --short)"
  if [[ -n "$status" ]]; then
    printf '%s\n' "$status"
  else
    echo "status: limpio"
  fi
done
