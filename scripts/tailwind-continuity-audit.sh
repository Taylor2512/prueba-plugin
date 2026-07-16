#!/usr/bin/env bash
set -eu

ROOT="${1:-.}"
FILES="
src/sisad-pdfme/ui/styles/sisad-pdfme.css
src/features/pdfcomponent/labRoutes.css
src/sisad-pdfme/ui/styles/tokens.css
src/sisad-pdfme/ui/constants.ts
"

echo "SISAD-pdfme Tailwind continuity audit"
echo "Root: $ROOT"

for rel in $FILES; do
  file="$ROOT/$rel"
  if [ ! -f "$file" ]; then
    echo "MISSING  $rel"
    continue
  fi
  lines=$(wc -l < "$file" | tr -d ' ')
  applies=$(rg -o '@apply' "$file" 2>/dev/null | wc -l | tr -d ' ')
  importants=$(rg -o '!important' "$file" 2>/dev/null | wc -l | tr -d ' ')
  echo "FILE     $rel | lines=$lines | @apply=$applies | !important=$importants"
done

if [ -d "$ROOT/src" ]; then
  inline=$(rg -g '*.tsx' -g '*.jsx' -g '*.ts' -g '*.js' -o 'style=\{' "$ROOT/src" 2>/dev/null | wc -l | tr -d ' ')
  dynamic=$(rg -g '*.tsx' -g '*.jsx' -g '*.ts' -g '*.js' '\b(bg|text|border|ring|shadow)-\$\{' "$ROOT/src" 2>/dev/null | wc -l | tr -d ' ')
  echo "SOURCE   inline-style=$inline | suspicious-dynamic-tailwind=$dynamic"
fi

echo "Audit complete. Counts are diagnostics, not automatic deletion targets."
