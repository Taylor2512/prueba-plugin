#!/usr/bin/env bash
set -euo pipefail

ROOT="${1:-$(pwd)}"
MODE="${2:---dry-run}"

if [[ ! -d "$ROOT" ]]; then
  echo "ERROR: la ruta no existe o no es carpeta: $ROOT" >&2
  exit 1
fi

cd "$ROOT"

echo "Proyecto: $ROOT"
echo "Modo: $MODE"
echo

IGNORE_DIRS=(
  ".git"
  "node_modules"
  "dist"
  "build"
  "coverage"
  ".next"
  ".nuxt"
  ".turbo"
  ".cache"
  ".venv"
  "venv"
  "tmp"
  "temp"
)

FIND_ARGS=(.)

for dir in "${IGNORE_DIRS[@]}"; do
  FIND_ARGS+=( -path "./$dir" -prune -o )
done

FIND_ARGS+=( -type d -empty -print )

mapfile -t EMPTY_DIRS < <(find "${FIND_ARGS[@]}" | sort -r)

echo "Carpetas vacías encontradas: ${#EMPTY_DIRS[@]}"
echo

if [[ "${#EMPTY_DIRS[@]}" -eq 0 ]]; then
  echo "No hay carpetas vacías para eliminar."
  exit 0
fi

printf '%s\n' "${EMPTY_DIRS[@]}"

if [[ "$MODE" != "--confirm" ]]; then
  echo
  echo "DRY-RUN: no se eliminó nada."
  echo "Para eliminar realmente ejecuta:"
  echo "bash clean-empty-dirs.sh \"$ROOT\" --confirm"
  exit 0
fi

echo
echo "Eliminando carpetas vacías..."

for dir in "${EMPTY_DIRS[@]}"; do
  if [[ -d "$dir" ]]; then
    rmdir "$dir" 2>/dev/null || true
  fi
done

echo
echo "Proceso completado."