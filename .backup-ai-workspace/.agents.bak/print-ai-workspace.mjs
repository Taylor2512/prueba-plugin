import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const ROOT = path.resolve(process.argv[2] || process.cwd(), '.github');

function walk(dir, list = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  entries.sort((a, b) => a.name.localeCompare(b.name));
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, list);
    else list.push(full);
  }
  return list;
}

if (!fs.existsSync(ROOT)) {
  console.error('No existe la carpeta .github en:', ROOT);
  process.exit(1);
}

const files = walk(ROOT);
console.log('\nAI Workspace files:\n');
for (const file of files) {
  console.log('-', path.relative(process.cwd(), file));
}

