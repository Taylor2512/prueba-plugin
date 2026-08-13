#!/usr/bin/env bash
set -euo pipefail
ROOT="$(git rev-parse --show-toplevel)"
STATE="$ROOT/.ai/context/haiku/AUTONOMOUS-CAMPAIGN-STATE.json"

echo "Branch: $(git branch --show-current)"
echo "HEAD:   $(git rev-parse --short HEAD)"
echo "Status:"
git status --short

echo
node - "$STATE" <<'NODE'
const fs = require('node:fs');
const state = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
console.log(`Campaign: ${state.campaign_status}`);
console.log(`Current:  ${state.current_task || '-'}`);
console.log(`Last:     ${state.last_completed_task || '-'}`);
for (const task of state.tasks) {
  const mark = task.status === 'done' ? '✓' : task.status === 'ready' ? '→' : task.status === 'stopped' ? '!' : '·';
  console.log(`${mark} ${task.id.padEnd(23)} ${task.status}${task.commit ? ` ${task.commit.slice(0, 8)}` : ''}`);
}
if (state.stop) console.log(`STOP: ${JSON.stringify(state.stop)}`);
NODE
