
[PEGA AQUÍ EL SCRIPT]

#!/usr/bin/env bash
set -euo pipefail

BACKUP_DIR="${1:-.backup-ai-workspace}"
TARGET_DIR="${2:-.}"

mkdir -p "$TARGET_DIR/.ai/agents"
mkdir -p "$TARGET_DIR/.ai/prompts"
mkdir -p "$TARGET_DIR/.ai/instructions"
mkdir -p "$TARGET_DIR/.ai/skills"
mkdir -p "$TARGET_DIR/.ai/agents/legacy"

copy_if_missing() {
  local src="$1"
  local dst="$2"

  mkdir -p "$(dirname "$dst")"

  if [ -e "$dst" ]; then
    echo "SKIP  $dst (ya existe)"
  else
    cp "$src" "$dst"
    echo "COPY  $src -> $dst"
  fi
}

echo "== Agentes =="
find "$BACKUP_DIR" -type f -name "*.agent.md" | while read -r file; do
  base="$(basename "$file")"
  copy_if_missing "$file" "$TARGET_DIR/.ai/agents/$base"
done

echo "== Instructions =="
find "$BACKUP_DIR" -type f -name "*.instructions.md" | while read -r file; do
  base="$(basename "$file")"
  copy_if_missing "$file" "$TARGET_DIR/.ai/instructions/$base"
done

echo "== Prompts =="
find "$BACKUP_DIR" -type f -name "*.prompt.md" | while read -r file; do
  base="$(basename "$file")"
  copy_if_missing "$file" "$TARGET_DIR/.ai/prompts/$base"
done

echo "== Skills en formato carpeta/SKILL.md =="
find "$BACKUP_DIR" -type f -path "*/SKILL.md" | while read -r file; do
  skill_dir="$(basename "$(dirname "$file")")"
  copy_if_missing "$file" "$TARGET_DIR/.ai/skills/$skill_dir/SKILL.md"
done

echo "== Skills en formato *.skill.md =="
find "$BACKUP_DIR" -type f -name "*.skill.md" | while read -r file; do
  base="$(basename "$file" .skill.md)"
  copy_if_missing "$file" "$TARGET_DIR/.ai/skills/$base/SKILL.md"
done

echo "== Prompts/agentes híbridos legacy =="
find "$BACKUP_DIR/github-prompts.bak/agents" -type f -name "*.md" 2>/dev/null | while read -r file; do
  base="$(basename "$file")"
  copy_if_missing "$file" "$TARGET_DIR/.ai/agents/legacy/$base"
done

echo "== Resumen =="
echo "Revisa manualmente:"
echo "  - .ai/agents/legacy"
echo "  - skills duplicadas"
echo "  - prompts que realmente deban convertirse en agents"