#!/usr/bin/env bash
set -euo pipefail
ROOT="${1:-$(pwd)}"
PACKAGE_DIR="${2:-$(pwd)}"
[[ -d "$ROOT" ]] || { echo "ERROR: root inválido: $ROOT" >&2; exit 1; }
[[ -d "$PACKAGE_DIR" ]] || { echo "ERROR: package dir inválido: $PACKAGE_DIR" >&2; exit 1; }
rsync -av "$PACKAGE_DIR"/ "$ROOT"/
echo "Arquitectura Markdown instalada en: $ROOT"
