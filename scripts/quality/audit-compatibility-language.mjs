#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const cwd = process.cwd();
const strict = process.argv.includes('--strict');
const configPath = path.join(cwd, 'configs', 'compatibility-language-allowlist.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// `canonical` is current architecture vocabulary, not compatibility residue.
// The gate must detect historical/compatibility naming only.
const termPattern = /\b(?:legacy|deprecated|deprecation|backward|compatibility|compatibilidad)\b/gi;
const identifierPattern = /\b[A-Za-z_$][A-Za-z0-9_$]*(?:Legacy|legacy|Deprecated|deprecated)[A-Za-z0-9_$]*\b/g;
const allowedExtensions = new Set(['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs', '.md', '.mdx', '.json']);

const normalize = (value) => value.split(path.sep).join('/');

const globLikeMatches = (relativePath, pattern) => {
  const escaped = pattern
    .replace(/[.+^${}()|[\]\\]/g, '\\$&')
    .replace(/\*\*/g, '::DOUBLE_STAR::')
    .replace(/\*/g, '[^/]*')
    .replace(/::DOUBLE_STAR::/g, '.*');
  return new RegExp(`^${escaped}$`).test(relativePath);
};

const isExcluded = (relativePath) =>
  config.pathExclusions.some((pattern) => globLikeMatches(relativePath, pattern));

const allowedByContent = (line) =>
  config.contentPatterns.some(({ pattern }) => line.includes(pattern)) || line.includes('send-backward');

const files = [];
const walk = (absoluteDir) => {
  if (!fs.existsSync(absoluteDir)) return;
  for (const entry of fs.readdirSync(absoluteDir, { withFileTypes: true })) {
    const absolute = path.join(absoluteDir, entry.name);
    const relative = normalize(path.relative(cwd, absolute));
    if (isExcluded(relative) || isExcluded(`${relative}/`)) continue;
    if (entry.isDirectory()) walk(absolute);
    else if (allowedExtensions.has(path.extname(entry.name))) files.push({ absolute, relative });
  }
};

for (const root of config.activeSourceRoots) walk(path.join(cwd, root));

const findings = [];
for (const file of files) {
  const text = fs.readFileSync(file.absolute, 'utf8');
  const lines = text.split(/\r?\n/);
  lines.forEach((line, index) => {
    if (allowedByContent(line)) return;
    const terms = [...line.matchAll(termPattern)].map((match) => match[0]);
    const identifiers = [...line.matchAll(identifierPattern)].map((match) => match[0]);
    if (terms.length || identifiers.length) {
      findings.push({
        path: file.relative,
        line: index + 1,
        terms: [...new Set(terms.map((term) => term.toLowerCase()))],
        identifiers: [...new Set(identifiers)],
        excerpt: line.trim().slice(0, 240),
      });
    }
  });
}

const byPath = new Map();
for (const finding of findings) {
  const list = byPath.get(finding.path) || [];
  list.push(finding);
  byPath.set(finding.path, list);
}

const reportDir = path.join(cwd, 'reports', 'naming-sanitization');
fs.mkdirSync(reportDir, { recursive: true });
fs.writeFileSync(
  path.join(reportDir, 'compatibility-language-audit.json'),
  JSON.stringify({ generatedAt: new Date().toISOString(), strict, findings }, null, 2),
);

const markdown = [
  '# Compatibility language audit',
  '',
  `- Files scanned: ${files.length}`,
  `- Findings: ${findings.length}`,
  `- Mode: ${strict ? 'strict' : 'report'}`,
  '',
  ...[...byPath.entries()].flatMap(([filePath, entries]) => [
    `## \`${filePath}\``,
    '',
    ...entries.map(
      (entry) =>
        `- L${entry.line}: identifiers=[${entry.identifiers.join(', ')}] terms=[${entry.terms.join(', ')}] — ${entry.excerpt}`,
    ),
    '',
  ]),
];
fs.writeFileSync(path.join(reportDir, 'compatibility-language-audit.md'), markdown.join('\n'));

console.log(`Scanned ${files.length} files; found ${findings.length} compatibility-language occurrences.`);
console.log(`Report: ${normalize(path.relative(cwd, path.join(reportDir, 'compatibility-language-audit.md')))}`);

if (strict && findings.length > 0) {
  process.exitCode = 1;
}
