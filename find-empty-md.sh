#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="${1:-.}"
MODE="${2:-strict}" # strict | soft

if [[ ! -d "$ROOT_DIR" ]]; then
  echo "Error: '$ROOT_DIR' no es un directorio válido." >&2
  exit 1
fi

echo "Buscando archivos .md vacíos en: $ROOT_DIR"
echo "Modo: $MODE"
echo

found=0

while IFS= read -r -d '' file; do
  if [[ "$MODE" == "strict" ]]; then
    if [[ ! -s "$file" ]]; then
      echo "$file"
      found=1
    fi
  else
    content="$(tr -d '[:space:]' < "$file")"
    if [[ -z "$content" ]]; then
      echo "$file"
      found=1
    fi
  fi
done < <(find "$ROOT_DIR" -type f -name "*.md" -print0)

if [[ "$found" -eq 0 ]]; then
  echo "No se encontraron archivos .md vacíos."
fi