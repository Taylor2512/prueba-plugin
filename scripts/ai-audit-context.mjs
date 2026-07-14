#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const forbiddenDefaultContext = [
  'ai/task-cards/completed/TASK-',
  'reports/',
  'dist/',
  'test-results/',
  '.tailwind-migration-backups/',
  'unificados/',
];

const filesToCheck = [
  'AGENTS.md',
  'CLAUDE.md',
  '.github/copilot-instructions.md',
  'ai/start/START.md',
  'ai/router/ROUTER.md',
  'ai/router/CONTEXT_BUDGET.md',
  'ai/prompts/codex-master-prompt.md',
  'ai/prompts/claude-diagnose-or-implement.md',
];

let failed = false;

for (const file of filesToCheck) {
  const full = path.join(root, file);
  if (!fs.existsSync(full)) continue;
  const text = fs.readFileSync(full, 'utf8');
  for (const token of forbiddenDefaultContext) {
    if (text.includes(token) && !text.includes('No cargar') && !text.includes('no cargar')) {
      console.error(`[ai-audit-context] posible contexto prohibido en ${file}: ${token}`);
      failed = true;
    }
  }
}

if (failed) process.exit(1);
console.log('[ai-audit-context] OK');
