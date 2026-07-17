#!/usr/bin/env bash
set -euo pipefail
MAIN="/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin"
name="${1:-}"
case "$name" in
  merge) branch="ai/integration" ;;
  codex) branch="ai/codex" ;;
  claude) branch="ai/claude" ;;
  copilot) branch="ai/copilot" ;;
  *) echo "Uso: $0 merge|codex|claude|copilot"; exit 1 ;;
esac
cd "$MAIN"
echo "Archivos main..$branch"
git diff --name-status main.."$branch"
echo
echo "Commits main..$branch"
git log --oneline main.."$branch"
