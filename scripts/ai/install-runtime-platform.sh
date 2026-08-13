#!/usr/bin/env bash
set -euo pipefail
TARGET="${1:-/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin}"
SELF="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

if [[ ! -d "$TARGET/.git" ]]; then
  echo "ERROR: target no es repo Git: $TARGET" >&2; exit 2
fi

echo "Branch: $(git -C "$TARGET" branch --show-current)"
echo "HEAD:   $(git -C "$TARGET" rev-parse HEAD)"
git -C "$TARGET" status --short || true

# Aditivo, nunca --delete. Hot memory files need manual merge if already present.
rsync -a --exclude '.ai/brain/70-memory/CURRENT.md' --exclude '.ai/brain/70-memory/HANDOFF.md' \
  "$SELF/" "$TARGET/"

if [[ ! -e "$TARGET/.ai/brain/70-memory/CURRENT.md" ]]; then
  cp "$SELF/.ai/brain/70-memory/CURRENT.md" "$TARGET/.ai/brain/70-memory/CURRENT.md"
fi
if [[ ! -e "$TARGET/.ai/brain/70-memory/HANDOFF.md" ]]; then
  cp "$SELF/.ai/brain/70-memory/HANDOFF.md" "$TARGET/.ai/brain/70-memory/HANDOFF.md"
fi

node "$TARGET/scripts/ai/validate-runtime-platform.mjs" "$TARGET"
echo "Overlay RTP instalado. Ejecuta RTP-000 antes de editar producto."
