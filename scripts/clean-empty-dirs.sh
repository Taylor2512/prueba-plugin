#!/usr/bin/env bash
set -euo pipefail

ROOT="${1:-$(pwd)}"
MODE="${2:---dry-run}"

if [[ ! -d "$ROOT" ]]; then
  echo "ERROR: ruta inválida: $ROOT" >&2
  exit 1
fi

cd "$ROOT"

IGNORE_DIRS=(
  ".git" "node_modules" "dist" "build" "coverage"
  ".next" ".nuxt" ".turbo" ".cache" ".venv" "venv"
  "tmp" "temp"
)

FIND_ARGS=(.)
for dir in "${IGNORE_DIRS[@]}"; do
  FIND_ARGS+=( -path "./$dir" -prune -o )
done
FIND_ARGS+=( -type d -empty -print )

mapfile -t EMPTY_DIRS < <(find "${FIND_ARGS[@]}" | sort -r)

echo "Carpetas vacías encontradas: ${#EMPTY_DIRS[@]}"
printf '%s\n' "${EMPTY_DIRS[@]}"

if [[ "$MODE" != "--confirm" ]]; then
  echo "DRY-RUN: no se eliminó nada."
  exit 0
fi

for dir in "${EMPTY_DIRS[@]}"; do
  rmdir "$dir" 2>/dev/null || true
done

echo "Eliminación completada."
