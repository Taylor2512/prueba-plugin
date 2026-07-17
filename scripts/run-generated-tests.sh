#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${PLAYWRIGHT_BASE_URL:-http://localhost:5174}"

printf '\n[1/3] Vitest generado\n'
npx vitest run tests/unit/generated

printf '\n[2/3] Comprobando lab: %s\n' "$BASE_URL/lab/multi-document-routing"
curl -fsS -I "$BASE_URL/lab/multi-document-routing" >/dev/null || {
  echo "El lab no está disponible. Ejecute: npm run dev -- --host 0.0.0.0" >&2
  exit 1
}

printf '\n[3/3] Playwright generado\n'
PLAYWRIGHT_BASE_URL="$BASE_URL" npx playwright test tests/playwright/generated --project=chromium
