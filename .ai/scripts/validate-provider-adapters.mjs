import fs from 'node:fs';

const files = ['AGENTS.md','CLAUDE.md','CODEX.md','.github/copilot-instructions.md'];
let failed = false;
for (const file of files) {
  const text = fs.readFileSync(file, 'utf8');
  if (!text.includes('AGENTS.md') && file !== 'AGENTS.md') {
    console.error(`${file}: must reference AGENTS.md`);
    failed = true;
  }
  if (text.length > 7000) {
    console.error(`${file}: adapter too long`);
    failed = true;
  }
}
process.exit(failed ? 1 : 0);
