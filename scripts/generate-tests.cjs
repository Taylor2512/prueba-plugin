const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const src = path.join(root, 'src');
const out = path.join(root, 'tests/unit');

function walk(dir){
  const entries = fs.readdirSync(dir, {withFileTypes:true});
  let files = [];
  for(const e of entries){
    const full = path.join(dir, e.name);
    if(e.isDirectory()) files = files.concat(walk(full));
    else if(/\.(ts|tsx|js|jsx)$/.test(e.name)) files.push(full);
  }
  return files;
}

function ensureDir(p){
  if(!fs.existsSync(p)) fs.mkdirSync(p, {recursive:true});
}

const files = walk(src);
ensureDir(out);
let created = 0;
for(const f of files){
  const rel = path.relative(src, f);
  const testPath = path.join(out, rel).replace(/\.(ts|tsx|js|jsx)$/, '.test.ts');
  const testDir = path.dirname(testPath);
  ensureDir(testDir);
  if(fs.existsSync(testPath)) continue;
  const importPath = '../../src/' + rel.replace(/\\/g, '/').replace(/\.(ts|tsx|js|jsx)$/, '');
  const content = `import { describe, it, expect } from 'vitest';\nimport * as moduleUnderTest from '${importPath}';\n\ndescribe('${rel}', ()=>{\n  it('imports without crashing', ()=>{\n    expect(moduleUnderTest).toBeTruthy();\n  });\n});\n`;
  fs.writeFileSync(testPath, content, 'utf8');
  created++;
}
console.log('Test skeleton files created:', created);
