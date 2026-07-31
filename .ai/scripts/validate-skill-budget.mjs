import fs from 'node:fs';
import path from 'node:path';

const dir = '.agents/skills';
let failed = false;
let descriptionChars = 0;
for (const name of fs.readdirSync(dir)) {
  const file = path.join(dir,name,'SKILL.md');
  if (!fs.existsSync(file)) continue;
  const text = fs.readFileSync(file,'utf8');
  const desc = text.match(/^description:\s*(.+)$/m)?.[1] ?? '';
  descriptionChars += desc.length;
  if (desc.length > 160 || Buffer.byteLength(text) > 12000) {
    console.error(`${name}: exceeds skill budget`);
    failed = true;
  }
}
console.log({descriptionChars});
process.exit(failed ? 1 : 0);
