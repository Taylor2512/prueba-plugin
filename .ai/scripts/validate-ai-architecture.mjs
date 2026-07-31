import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const required = [
  'AGENTS.md', '.ai/START.md', '.ai/ROUTER.md', '.ai/CONTEXT-BUDGET.md',
  '.ai/scrum/SPRINT-CURRENT.md', '.ai/scrum/CLAIMS.md'
];
let failed = false;
for (const rel of required) {
  if (!fs.existsSync(path.join(root, rel))) {
    console.error(`missing: ${rel}`);
    failed = true;
  }
}
const limits = {
  'AGENTS.md': 5000,
  'CLAUDE.md': 3000,
  '.github/copilot-instructions.md': 6000,
  '.ai/START.md': 5000,
};
for (const [rel, max] of Object.entries(limits)) {
  const file = path.join(root, rel);
  if (fs.existsSync(file) && fs.statSync(file).size > max) {
    console.error(`too large: ${rel} > ${max} bytes`);
    failed = true;
  }
}
process.exit(failed ? 1 : 0);
