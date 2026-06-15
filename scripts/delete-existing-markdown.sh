#!/usr/bin/env bash
set -euo pipefail
ROOT="${1:-$(pwd)}"
MODE="${2:---dry-run}"
BACKUP="${3:-}"
IGNORE=(".git" "node_modules" "dist" "build" "coverage" ".next" ".nuxt" ".turbo" ".cache" ".venv" "venv" "out" "tmp" "temp")
[[ -d "$ROOT" ]] || { echo "ERROR: ruta inválida: $ROOT" >&2; exit 1; }
cd "$ROOT"
FIND_ARGS=(.)
for d in "${IGNORE[@]}"; do FIND_ARGS+=( -path "./$d" -prune -o ); done
FIND_ARGS+=( -type f -name "*.md" -print )
mapfile -t FILES < <(find "${FIND_ARGS[@]}" | sort)
echo "Proyecto: $ROOT"
echo "Archivos .md encontrados: ${#FILES[@]}"
printf '%s
' "${FILES[@]}"
if [[ "$MODE" != "--confirm" ]]; then
  echo "DRY-RUN: no se eliminó nada. Usa --confirm para eliminar. Usa --confirm --backup para respaldar."
  exit 0
fi
if [[ "$BACKUP" == "--backup" && "${#FILES[@]}" -gt 0 ]]; then
  BACKUP_FILE="markdown-backup-$(date +%Y%m%d-%H%M%S).tar.gz"
  printf '%s
' "${FILES[@]}" | tar -czf "$BACKUP_FILE" -T -
  echo "Backup creado: $BACKUP_FILE"
fi
printf '%s\0' "${FILES[@]}" | xargs -0 rm -f
echo "Eliminación completada. Archivos .md eliminados: ${#FILES[@]}"
