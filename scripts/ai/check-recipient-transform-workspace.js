import { promises as fs } from 'node:fs';
import path from 'node:path';

const required = [
  '.ai/context/recipient-transform-context.md',
  '.ai/prompts/recipient-transform-master-plan.prompt.md',
  '.ai/skills/active-recipient-color-contract/SKILL.md',
  '.ai/skills/moveable-selecto-resize-rotate/SKILL.md',
  'docs/06-funcionalidades/04-recipient-color-behavior.md',
];

const root = process.cwd();
const missing = [];
for (const rel of required) {
  try { await fs.access(path.join(root, rel)); }
  catch { missing.push(rel); }
}
if (missing.length) {
  console.error('[recipient-transform:check] Missing files:');
  missing.forEach((m) => console.error(`- ${m}`));
  process.exitCode = 1;
} else {
  console.log('[recipient-transform:check] OK');
}
