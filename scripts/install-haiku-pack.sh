#!/usr/bin/env bash
set -euo pipefail

SOURCE_DIR="${1:-SISAD-WEB-DA-PDFME-HAIKU-V4-3}"
TARGET_DIR="${2:-.}"

if [[ ! -d "$SOURCE_DIR/.ai" ]]; then
  echo "No existe $SOURCE_DIR/.ai" >&2
  exit 1
fi

echo "Dry run:"
rsync -avn "$SOURCE_DIR/.ai/" "$TARGET_DIR/.ai/"

echo
echo "Para aplicar:"
echo "rsync -av \"$SOURCE_DIR/.ai/\" \"$TARGET_DIR/.ai/\""
echo "No use --delete."
