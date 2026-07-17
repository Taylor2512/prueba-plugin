#!/usr/bin/env bash
set -euo pipefail
MAIN="/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin"
if ! command -v code >/dev/null 2>&1; then
  echo "ERROR: el comando 'code' no está disponible."
  echo "Abra manualmente: $MAIN/SISAD-PDFME-MULTIAGENT.code-workspace"
  exit 1
fi
exec code "$MAIN/SISAD-PDFME-MULTIAGENT.code-workspace"
