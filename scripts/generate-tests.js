import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const root = path.resolve(__dirname, '..');
const src = path.join(root, 'src');
const out = path.join(root, 'tests/unit');

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(walk(full));
    } else if (/\.(ts|tsx|js|jsx)$/.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
}

const files = walk(src);
ensureDir(out);
let created = 0;

for (const filePath of files) {
  const rel = path.relative(src, filePath);
  const testPath = path.join(out, rel).replace(/\.(ts|tsx|js|jsx)$/, '.test.ts');
  const testDir = path.dirname(testPath);
  ensureDir(testDir);
  if (fs.existsSync(testPath)) continue;

  const importPath = '../../src/' + rel.replace(/\\/g, '/');
  const content =
    `import { describe, it, expect } from 'vitest';\n` +
    `import * as moduleUnderTest from '${importPath}';\n\n` +
    `describe('${rel}', () => {\n` +
    `  it('imports without crashing', () => {\n` +
    `    expect(moduleUnderTest).toBeTruthy();\n` +
    `  });\n` +
    `});\n`;
  fs.writeFileSync(testPath, content, 'utf8');
  created += 1;
}

console.log('Test skeleton files created:', created);
