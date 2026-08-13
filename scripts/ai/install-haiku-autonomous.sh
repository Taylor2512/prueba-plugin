#!/usr/bin/env bash
set -euo pipefail

PACKAGE_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
TARGET="${1:-/Users/desarrollo1/Documents/proyectos de Taylor/frontend/prueba-plugin}"
REQUIRED_BRANCH="feature/designer-pdfme"

if [[ ! -d "$TARGET/.git" ]]; then
  echo "ERROR: $TARGET no es un repositorio Git" >&2
  exit 1
fi

CURRENT_BRANCH="$(git -C "$TARGET" branch --show-current)"
if [[ "$CURRENT_BRANCH" != "$REQUIRED_BRANCH" ]]; then
  echo "STOP-BRANCH expected=$REQUIRED_BRANCH actual=$CURRENT_BRANCH" >&2
  exit 2
fi

mkdir -p "$TARGET/.ai" "$TARGET/.claude" "$TARGET/scripts/ai"
rsync -av "$PACKAGE_ROOT/.ai/" "$TARGET/.ai/"
cp "$PACKAGE_ROOT/.claude/settings.local.json" "$TARGET/.claude/settings.local.json"
rsync -av "$PACKAGE_ROOT/scripts/ai/" "$TARGET/scripts/ai/"
chmod +x "$TARGET/scripts/ai/"*.sh

EXCLUDE="$TARGET/.git/info/exclude"
mkdir -p "$(dirname "$EXCLUDE")"
touch "$EXCLUDE"
for pattern in ".claude/settings.local.json" ".ai/context/haiku/PREEXISTING-WORKTREE-MANIFEST.json"; do
  grep -Fxq "$pattern" "$EXCLUDE" || printf '%s\n' "$pattern" >> "$EXCLUDE"
done

TARGET="$TARGET" node <<'NODE'
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const root = process.env.TARGET;
const run = (args) => execFileSync('git', ['-C', root, ...args], { encoding: 'utf8' }).trim();
const branch = run(['branch', '--show-current']);
const base = run(['rev-parse', 'HEAD']);
const raw = run(['status', '--porcelain=v1']);
const tracked = run(['diff', '--name-only']).split(/\n/).filter(Boolean);
let untracked = [];
try {
  untracked = run(['ls-files', '--others', '--exclude-standard']).split(/\n/).filter(Boolean);
} catch {}
const paths = [...new Set([...tracked, ...untracked])].sort();
const classify = (p) => {
  if (p.startsWith('src/features/DigitalAgreements/') || p.startsWith('src/components/sisad-pdfme/') || p.startsWith('tests/') || p.startsWith('.ai/')) return 'campaign_or_ai';
  if (['.gitignore', '.copilotignore', 'eslint.config.js', 'package.json', 'package-lock.json'].includes(p)) return 'tooling_suspect';
  return 'other';
};
const manifest = {
  generated: true,
  generated_at: new Date().toISOString(),
  branch,
  base_commit: base,
  paths: paths.map((p) => ({ path: p, category: classify(p) })),
  raw_status: raw ? raw.split(/\n/) : [],
  policy: 'Preserve; stage only when the active task owns the path.'
};
const output = path.join(root, '.ai/context/haiku/PREEXISTING-WORKTREE-MANIFEST.json');
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, JSON.stringify(manifest, null, 2) + '\n');
NODE

node "$TARGET/scripts/ai/validate-haiku-autonomous-pack.mjs" "$TARGET"

echo
echo "Instalación completa."
echo "Rama: $CURRENT_BRANCH"
echo "Ejecutar:"
echo "  cd $TARGET"
echo "  ./scripts/ai/run-haiku-autonomous.sh"
