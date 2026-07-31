import fs from 'node:fs';

const file = '.ai/memory/INDEX.md';
const text = fs.readFileSync(file,'utf8');
const lines = text.split(/\r?\n/).length;
const bytes = Buffer.byteLength(text);
console.log({lines, bytes});
if (lines > 200 || bytes > 25000) {
  console.error('memory index exceeds startup budget');
  process.exit(1);
}
