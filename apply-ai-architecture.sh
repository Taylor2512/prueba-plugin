#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SOURCE="$SCRIPT_DIR"
REPO="/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin"
MODE="dry-run"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --repo) REPO="$2"; shift 2 ;;
    --apply) MODE="apply"; shift ;;
    --dry-run) MODE="dry-run"; shift ;;
    *) echo "Argumento desconocido: $1"; exit 1 ;;
  esac
done

if [[ ! -d "$REPO/.git" && ! -f "$REPO/.git" ]]; then
  echo "ERROR: no parece repositorio Git: $REPO"
  exit 1
fi

TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP="$REPO/.ai-md-architecture-backups/$TIMESTAMP"
ROOT_FILES=(
  README.md AGENTS.md CLAUDE.md .github/copilot-instructions.md .rgignore
  SISAD-PDFME-MULTIAGENT.code-workspace
  scripts/README.md scripts/ai-context-ignore.json
  scripts/validate-ai-architecture.py scripts/bootstrap-ai-worktrees.sh
  scripts/migrate-sibling-worktrees-to-embedded.sh
  scripts/ai-worktree-status.sh scripts/ai-worktree-diff.sh
  scripts/ai-open-workspace.sh scripts/ai-sync-worktrees-after-gate.sh
  scripts/verify-embedded-worktree-isolation.sh
  scripts/gitignore-ai-worktrees.fragment
)

echo "Repositorio: $REPO"
echo "Modo: $MODE"
echo "Backup: $BACKUP"

if [[ "$MODE" == "dry-run" ]]; then
  echo "REPLACE ai/"
  for rel in "${ROOT_FILES[@]}"; do
    [[ -e "$REPO/$rel" ]] && echo "REPLACE $rel" || echo "CREATE  $rel"
  done
  echo "APPEND .gitignore rules: .worktrees/ .ai-coordination/ .ai-md-architecture-backups/"
  exit 0
fi

mkdir -p "$BACKUP"
if [[ -d "$REPO/ai" ]]; then cp -a "$REPO/ai" "$BACKUP/ai"; rm -rf "$REPO/ai"; fi
for rel in "${ROOT_FILES[@]}" .gitignore; do
  if [[ -e "$REPO/$rel" ]]; then
    mkdir -p "$BACKUP/$(dirname "$rel")"
    cp -a "$REPO/$rel" "$BACKUP/$rel"
  fi
done

cp -a "$SOURCE/ai" "$REPO/ai"
for rel in "${ROOT_FILES[@]}"; do
  mkdir -p "$REPO/$(dirname "$rel")"
  cp -a "$SOURCE/$rel" "$REPO/$rel"
done

for rule in '.worktrees/' '.ai-coordination/' '.ai-md-architecture-backups/'; do
  grep -Fxq "$rule" "$REPO/.gitignore" 2>/dev/null || printf '%s\n' "$rule" >> "$REPO/.gitignore"
done

chmod +x "$REPO/scripts/"*.sh "$REPO/scripts/validate-ai-architecture.py"
python3 "$REPO/scripts/validate-ai-architecture.py" "$REPO"

echo "Arquitectura embedded-worktrees aplicada."
echo "Backup: $BACKUP"
git -C "$REPO" status --short
