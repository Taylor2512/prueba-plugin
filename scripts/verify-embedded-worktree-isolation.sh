#!/usr/bin/env bash
set -euo pipefail
MAIN="/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin"
cd "$MAIN"

fail=0
for rule in '.worktrees/' '.ai-coordination/' '.ai-md-architecture-backups/'; do
  if ! grep -Fxq "$rule" .gitignore 2>/dev/null; then
    echo "FALTA EN .gitignore: $rule"
    fail=1
  fi
done

if ! git check-ignore -q .worktrees 2>/dev/null; then
  echo "ERROR: .worktrees no está ignorado por Git."
  fail=1
fi

if git ls-files '.worktrees/**' | grep -q .; then
  echo "ERROR: existen archivos de .worktrees versionados."
  fail=1
fi

if rg -n --hidden --glob '!scripts/verify-embedded-worktree-isolation.sh' '/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin-(merge|codex|claude|copilot)' ai README.md AGENTS.md CLAUDE.md .github 2>/dev/null; then
  echo "ERROR: quedan rutas antiguas de worktrees hermanos."
  fail=1
fi

if [[ "$fail" -ne 0 ]]; then
  exit 1
fi

echo "Embedded worktree isolation passed."
