#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const testsDir = path.join(root, 'tests', 'unit');

function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) walk(p);
    else if (/\.test\.(ts|tsx|js)$/.test(name)) processFile(p);
  }
}

function processFile(file) {
  let s = fs.readFileSync(file, 'utf8');
  const before = s;
  s = s.replace(/from \s*['"](\.+\/)+src\//g, (m, p1) => `from '@/`);
  // also handle require or imports without from
  s = s.replace(/(['\"])\.\.\/\.\.\/src\//g, "$1@/");
  if (s !== before) {
    fs.writeFileSync(file, s, 'utf8');
    console.log('Patched', path.relative(root, file));
  }
}

walk(testsDir);
console.log('Done');
