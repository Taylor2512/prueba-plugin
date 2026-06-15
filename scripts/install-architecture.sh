#!/usr/bin/env bash
set -euo pipefail

TARGET="${1:-}"

if [[ -z "$TARGET" ]]; then
  echo "Uso:"
  echo "bash scripts/install-architecture.sh /ruta/proyecto"
  exit 1
fi

if [[ ! -d "$TARGET" ]]; then
  echo "ERROR: target no existe: $TARGET" >&2
  exit 1
fi

SOURCE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

rsync -av "$SOURCE_DIR"/ "$TARGET"/

echo "Arquitectura instalada en: $TARGET"
