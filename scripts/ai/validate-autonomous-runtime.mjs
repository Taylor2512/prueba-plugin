#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.argv[2] || '.');

const required = [
  '.ai/prompts/PROMPT_SISAD_PDFME_AUTONOMOUS_START.md',
  '.ai/knowledge/runtime-platform/TASK-QUEUE.json',
  '.ai/brain/20-contracts/CAPABILITY-RESOLUTION-CONTRACT.md',
  '.ai/brain/20-contracts/CONFIG-COMPILATION-CONTRACT.md',
  '.ai/brain/20-contracts/GRID-GEOMETRY-CONTRACT.md',
  '.ai/brain/20-contracts/AUTONOMOUS-EXECUTION-CONTRACT.md',
  '.ai/scrum/task-cards/runtime-platform/RTP-425.md',
  '.ai/scrum/task-cards/runtime-platform/RTP-545.md',
];

const errors = [];
for (const rel of required) {
  if (!fs.existsSync(path.join(root, rel))) errors.push(`MISSING ${rel}`);
}

const queueFile = path.join(root, '.ai/knowledge/runtime-platform/TASK-QUEUE.json');
if (fs.existsSync(queueFile)) {
  const queue = JSON.parse(fs.readFileSync(queueFile, 'utf8'));
  const ids = new Set(queue.tasks.map((x) => x.id));
  for (let n = 425; n <= 545; n += 5) {
    const id = `RTP-${n}`;
    if (!ids.has(id)) errors.push(`QUEUE_MISSING ${id}`);
    const card = path.join(root, `.ai/scrum/task-cards/runtime-platform/${id}.md`);
    if (!fs.existsSync(card)) errors.push(`CARD_MISSING ${id}`);
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(2);
}

console.log('AUTONOMOUS_RUNTIME_ARCHITECTURE_OK');
