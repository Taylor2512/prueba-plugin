#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.argv[2] || process.cwd());

const required = [
  '.ai/knowledge/EXECUTION-ORCHESTRATION-INDEX.md',
  '.ai/brain/20-contracts/execution/EXECUTION-CONTEXT-CONTRACT.md',
  '.ai/brain/20-contracts/execution/EXECUTION-PLAN-CONTRACT.md',
  '.ai/brain/20-contracts/runtime/SCHEMA-COMPLETION-CONTRACT.md',
  '.ai/brain/20-contracts/documents/PDF-COMPOSITION-CONTRACT.md',
  '.ai/brain/40-runtime/EXECUTION-ORCHESTRATION.md',
  '.ai/scrum/task-cards/runtime-platform/RTP-345.md',
  '.ai/scrum/task-cards/runtime-platform/RTP-420.md',
];

const missing = required.filter((rel) => !fs.existsSync(path.join(root, rel)));
if (missing.length) {
  console.error('Missing execution-orchestration architecture:\n' + missing.join('\n'));
  process.exit(1);
}

const taskRoot = path.join(root, '.ai/scrum/task-cards/runtime-platform');
const tasks = fs.readdirSync(taskRoot)
  .filter((name) => /^RTP-\d{3}\.md$/.test(name))
  .sort();

const ids = new Set(tasks);
for (let n = 345; n <= 420; n += 5) {
  const name = `RTP-${String(n).padStart(3, '0')}.md`;
  if (!ids.has(name)) {
    console.error(`Missing ${name}`);
    process.exit(2);
  }
}

console.log(`Execution Orchestration OK: ${tasks.length} RTP task cards total.`);
