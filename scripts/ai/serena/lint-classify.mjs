#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = path.resolve(process.argv[2] || '.');
const result = spawnSync(
  process.platform === 'win32' ? 'npx.cmd' : 'npx',
  ['eslint', '.', '--format', 'json'],
  {
    cwd: root,
    encoding: 'utf8',
    env: process.env,
    maxBuffer: 64 * 1024 * 1024,
  },
);

let report = [];
try {
  report = JSON.parse(result.stdout || '[]');
} catch (error) {
  console.error(result.stdout);
  console.error(result.stderr);
  throw new Error(`No se pudo parsear ESLint JSON: ${error.message}`);
}

const classifyRule = (ruleId = '') => {
  if (ruleId === 'react-hooks/set-state-in-effect') return 'REACT_STATE_MODEL';
  if (ruleId?.startsWith('react-hooks/')) return 'REACT_HOOKS';
  if (ruleId === '@typescript-eslint/no-require-imports') return 'MODULE_BOUNDARY';
  if (ruleId?.startsWith('@typescript-eslint/')) return 'TYPESCRIPT';
  if (ruleId === 'import/no-unresolved') return 'IMPORT_RESOLUTION';
  if (ruleId === 'no-unused-vars') return 'DEAD_CODE_JS';
  if (ruleId === 'no-empty') return 'EMPTY_CONTROL_FLOW';
  if (ruleId === 'no-useless-escape' || ruleId === 'no-control-regex' || ruleId === 'no-irregular-whitespace') {
    return 'REGEX_TEXT_SAFETY';
  }
  if (
    ruleId === 'no-extra-boolean-cast' ||
    ruleId === 'no-constant-binary-expression' ||
    ruleId === 'no-unexpected-multiline' ||
    ruleId === 'no-undef'
  ) return 'JAVASCRIPT_CORRECTNESS';
  return 'OTHER';
};

const items = [];
for (const file of report) {
  const rel = path.relative(root, file.filePath).split(path.sep).join('/');
  for (const message of file.messages ?? []) {
    items.push({
      file: rel,
      line: message.line,
      column: message.column,
      severity: message.severity === 2 ? 'ERROR' : 'WARN',
      rule: message.ruleId ?? 'unknown',
      category: classifyRule(message.ruleId),
      message: message.message,
      fixable: Boolean(message.fix),
    });
  }
}

const categories = {};
for (const item of items) {
  categories[item.category] ??= { errors: 0, warnings: 0, files: new Set() };
  if (item.severity === 'ERROR') categories[item.category].errors += 1;
  else categories[item.category].warnings += 1;
  categories[item.category].files.add(item.file);
}

const summary = Object.fromEntries(
  Object.entries(categories)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, value]) => [
      name,
      {
        errors: value.errors,
        warnings: value.warnings,
        files: [...value.files].sort(),
      },
    ]),
);

const outputDir = path.join(root, 'reports/lint');
fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(
  path.join(outputDir, 'LINT-CLASSIFICATION.json'),
  `${JSON.stringify({ total: items.length, summary, items }, null, 2)}\n`,
);

const md = [
  '# Clasificación de lint',
  '',
  `- Total: **${items.length}**`,
  `- Errors: **${items.filter((x) => x.severity === 'ERROR').length}**`,
  `- Warnings: **${items.filter((x) => x.severity === 'WARN').length}**`,
  '',
  '| Categoría | Errors | Warnings | Archivos |',
  '|---|---:|---:|---:|',
  ...Object.entries(summary).map(
    ([name, value]) =>
      `| ${name} | ${value.errors} | ${value.warnings} | ${value.files.length} |`,
  ),
  '',
  '## Regla',
  '',
  'No convertir errores reales en ignores globales. Corregir por categoría y validar tests cercanos.',
  '',
].join('\n');

fs.writeFileSync(path.join(outputDir, 'LINT-CLASSIFICATION.md'), md, 'utf8');

console.log(JSON.stringify({
  eslintExit: result.status,
  total: items.length,
  errors: items.filter((x) => x.severity === 'ERROR').length,
  warnings: items.filter((x) => x.severity === 'WARN').length,
  categories: summary,
  reports: [
    'reports/lint/LINT-CLASSIFICATION.md',
    'reports/lint/LINT-CLASSIFICATION.json',
  ],
}, null, 2));

// Classification itself succeeds if parsing succeeded; ESLint exit is reported,
// not propagated, so the user can inspect the report even with lint errors.
