#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.argv[2] || process.cwd());
const readJson = (rel) => JSON.parse(fs.readFileSync(path.join(root, rel), 'utf8'));
const index = readJson('.ai/context/haiku/TASK-INDEX.json');
const state = readJson('.ai/context/haiku/AUTONOMOUS-CAMPAIGN-STATE.json');
const errors = [];

if (index.automation?.downstream_repository?.required_branch !== 'feature/designer-pdfme') errors.push('required branch mismatch');
if (index.rules?.continue_automatically !== true) errors.push('continue_automatically must be true');
if (index.ready !== state.current_task) errors.push('TASK-INDEX.ready must equal state.current_task');
if (index.order.join('|') !== state.tasks.map((t) => t.id).join('|')) errors.push('task order mismatch');
if (state.tasks.filter((t) => t.status === 'ready').length !== 1) errors.push('exactly one task must be ready');
if (state.tasks.find((t) => t.id === 'DA-PDFME-V4-023A')?.status !== 'done') errors.push('023A must be done');
if (state.current_task !== 'DA-PDFME-V4-024A') errors.push('initial current task must be 024A');

const taskDirs = [
  '.ai/scrum/task-cards/digital-agreements-pdfme-v4',
  '.ai/scrum/task-cards/pdfme-upstream-haiku',
];
for (const dir of taskDirs) {
  const full = path.join(root, dir);
  for (const name of fs.readdirSync(full).filter((n) => n.endsWith('.md'))) {
    const text = fs.readFileSync(path.join(full, name), 'utf8');
    if (!text.includes('## Continuidad autónoma')) errors.push(`${name}: missing autonomous continuity`);
  }
}

for (const rel of [
  '.ai/prompts/haiku/PROMPT_EJECUCION_AUTONOMA_COMPLETA.md',
  '.claude/settings.local.json',
  'scripts/ai/run-haiku-autonomous.sh',
]) {
  if (!fs.existsSync(path.join(root, rel))) errors.push(`missing ${rel}`);
}

if (errors.length) {
  console.error('Autonomous pack invalid:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log(`Autonomous pack OK: ${index.order.length} tasks, ready=${index.ready}`);
