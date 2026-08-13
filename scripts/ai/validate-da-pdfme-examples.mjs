#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.argv[2] || process.cwd());
const campaign = path.join(root, '.ai/ops/campaigns/digital-agreements-pdfme-integration-v8');
const required = [
  '.ai/analysis/DA-PDFME-EXAMPLES-DEEP-AUDIT.md',
  '.ai/analysis/DA-PDFME-CONFIG-PARITY-MATRIX.md',
  '.ai/brain/40-integrations/SISAD-PDFME-EXAMPLES-TO-DIGITAL-AGREEMENTS.md',
  '.ai/brain/20-contracts/PDFME-JSON-CONFIG-HOST-BOUNDARY.md',
  '.ai/brain/70-memory/topics/digital-agreements-pdfme-examples.md',
  '.ai/brain/70-memory/deltas/2026-08-11-da-pdfme-examples-v8.md',
  '.ai/ops/campaigns/digital-agreements-pdfme-integration-v8/START.md',
  '.ai/ops/campaigns/digital-agreements-pdfme-integration-v8/TASK-INDEX.md',
];

const missing = required.filter((rel) => !fs.existsSync(path.join(root, rel)));
if (missing.length) {
  console.error('Missing required files:\n' + missing.join('\n'));
  process.exit(1);
}

const cards = fs.readdirSync(path.join(campaign, 'task-cards'))
  .filter((name) => /^DA-INT-V8-\d{3}\.md$/.test(name))
  .sort();

if (cards.length !== 12) {
  console.error(`Expected 12 task cards; found ${cards.length}`);
  process.exit(2);
}

const first = fs.readFileSync(path.join(campaign, 'task-cards/DA-INT-V8-000.md'), 'utf8');
if (!first.includes('status: ready')) {
  console.error('DA-INT-V8-000 must be ready');
  process.exit(3);
}

for (const card of cards.slice(1)) {
  const text = fs.readFileSync(path.join(campaign, 'task-cards', card), 'utf8');
  if (!text.includes('status: backlog')) {
    console.error(`${card} must start as backlog`);
    process.exit(4);
  }
}

console.log(`DA-PDFME V8 pack OK: ${cards.length} task cards; ready=DA-INT-V8-000`);
