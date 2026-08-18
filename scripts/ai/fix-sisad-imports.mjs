#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const base = path.join(root, 'src', 'sisad-pdfme');
const agent = 'copilot';
const task = 'auto-copilot-20260815-1';

const exts = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs']);

const walk = (dir) => {
  const out = [];
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) out.push(...walk(p));
    else if (st.isFile()) out.push(p);
  }
  return out;
};

const files = walk(base).filter((f) => exts.has(path.extname(f))); 
console.log(`Found ${files.length} files under ${base}`);

const normalizePosix = (p) => p.split(path.sep).join('/');

const runCmd = (cmd, args) => {
  const r = spawnSync(cmd, args, { encoding: 'utf8' });
  return { status: r.status, stdout: r.stdout, stderr: r.stderr };
};

const summary = { modified: [], skipped: [], errors: [] };

for (const file of files) {
  let txt = fs.readFileSync(file, 'utf8');
  const dir = path.dirname(file);
  let changed = false;

  // match import/export from '...'; dynamic import('...') is harder but we'll handle basic cases
  const regex = /(from\s+|import\(|export\s+.*\s+from\s+)(["'])(\.{1,2}\/[^"']+)(["'])/g;
  const replacements = new Map();
  let m;
  while ((m = regex.exec(txt)) !== null) {
    const rel = m[3];

    // resolve
    const targetAbs = path.resolve(dir, rel);
    if (!targetAbs.startsWith(base)) continue; // only replace if target is inside src/sisad-pdfme

    let relToBase = path.relative(base, targetAbs);
    let posixRelToBase = normalizePosix(relToBase);
    // remove extension if present
    posixRelToBase = posixRelToBase.replace(/\.(js|ts|jsx|tsx|mjs|cjs)$/, '');
    // remove trailing /index
    posixRelToBase = posixRelToBase.replace(/\/index$/, '');

    const alias = `@sisad-pdfme/${posixRelToBase}`;

    // replace only the source substring
    const originalSource = rel;
    if (originalSource === alias) continue;

    replacements.set(originalSource, alias);
  }

  if (replacements.size === 0) continue;

  // Claim the file before editing
  const relPath = normalizePosix(path.relative(root, file));
  const claimArgs = ['claim', '.', '--agent', agent, '--task', task, '--paths', relPath];
  const claim = runCmd('node', ['scripts/ai/same-repo-coordinator.mjs', ...claimArgs]);
  if (claim.status !== 0) {
    summary.skipped.push({ file: relPath, reason: claim.stderr || claim.stdout });
    console.log(`SKIP (claim failed): ${relPath}`);
    continue;
  }

  // Apply replacements
  for (const [orig, ali] of replacements.entries()) {
    // replace all occurrences of the exact string literal in import sources (with single/double quotes)
    const re = new RegExp(`(["'])${orig}(["'])`, 'g');
    if (!re.test(txt)) continue;
    txt = txt.replace(re, `$1${ali}$2`);
    changed = true;
  }

  if (!changed) {
    // release claim
    runCmd('node', ['scripts/ai/same-repo-coordinator.mjs', 'release', '.', '--agent', agent]);
    continue;
  }

  try {
    fs.writeFileSync(file, txt, 'utf8');
    summary.modified.push(relPath);
    console.log(`MODIFIED: ${relPath}`);
  } catch (err) {
    summary.errors.push({ file: relPath, error: String(err) });
    console.error(`ERROR writing ${relPath}: ${err}`);
  }

  // release claim for the agent (release accepts only --agent; keep path for symmetry)
  runCmd('node', ['scripts/ai/same-repo-coordinator.mjs', 'release', '.', '--agent', agent]);
}

console.log('\nSummary:');
console.log(`Modified: ${summary.modified.length}`);
console.log(`Skipped: ${summary.skipped.length}`);
console.log(`Errors: ${summary.errors.length}`);
if (summary.skipped.length) console.log('Skipped details:', JSON.stringify(summary.skipped, null, 2));
if (summary.errors.length) console.log('Errors details:', JSON.stringify(summary.errors, null, 2));

process.exit(0);
