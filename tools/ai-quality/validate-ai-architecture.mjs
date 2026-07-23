#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const required = ['AGENTS.md', 'CLAUDE.md', '.ai/START.md', '.ai/MODEL-ROUTER.md', '.ai/DUPLICATION-POLICY.md', '.ai/scrum/SPRINT-CURRENT.md'];
const errors = [];
for (const file of required) if (!fs.existsSync(file)) errors.push(`Falta ${file}`);

function collect(dir, suffix, out=[]) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, {withFileTypes:true})) {
    const p = path.join(dir, entry.name);
    entry.isDirectory() ? collect(p, suffix, out) : entry.name.endsWith(suffix) && out.push(p);
  }
  return out;
}
for (const skill of collect('.agents/skills', 'SKILL.md')) {
  const text = fs.readFileSync(skill, 'utf8');
  if (!/^---[\s\S]*?\nname:\s*\S+[\s\S]*?\ndescription:\s*.+?\n---/m.test(text)) errors.push(`Frontmatter inválido: ${skill}`);
}
for (const file of collect('.ai', '.md').concat(collect('.agents', '.md'), collect('.github', '.md'))) {
  const text = fs.readFileSync(file, 'utf8');
  for (const match of text.matchAll(/\[[^\]]+\]\((?!https?:|#|mailto:)([^)]+)\)/g)) {
    const target = match[1].split('#')[0];
    if (!target) continue;
    const resolved = path.resolve(path.dirname(file), target);
    if (!fs.existsSync(resolved)) errors.push(`Enlace roto ${file} -> ${target}`);
  }
}
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log('Arquitectura IA válida.');
