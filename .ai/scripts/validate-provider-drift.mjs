import fs from 'node:fs';

const adapters = ['CLAUDE.md','CODEX.md','.github/copilot-instructions.md'];
let failed = false;
for (const file of adapters) {
  const text = fs.readFileSync(file,'utf8');
  if (!text.includes('AGENTS.md')) { console.error(`${file}: missing AGENTS reference`); failed = true; }
  if (Buffer.byteLength(text) > 7000) { console.error(`${file}: adapter too large`); failed = true; }
}
process.exit(failed ? 1 : 0);
