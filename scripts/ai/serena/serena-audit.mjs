#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.argv[2] || '.');
const findings = [];
const add = (severity, code, detail) =>
  findings.push({ severity, code, detail });

const serenaFile = path.join(root, '.serena/project.yml');
const eslintFile = path.join(root, 'eslint.config.cjs');
const packageFile = path.join(root, 'package.json');

if (!fs.existsSync(serenaFile)) {
  add('ERROR', 'SERENA_CONFIG_MISSING', '.serena/project.yml');
} else {
  const text = fs.readFileSync(serenaFile, 'utf8');

  if (!/\btypescript\b/.test(text.match(/language_servers:[\s\S]*?(?=\n[A-Za-z_][\w-]*:|$)/)?.[0] ?? '')) {
    add('ERROR', 'TYPESCRIPT_LSP_MISSING', 'language_servers');
  }

  if (!/ignore_all_files_in_gitignore:\s*true\b/.test(text)) {
    add('WARN', 'GITIGNORE_REUSE_DISABLED', 'ignore_all_files_in_gitignore');
  }

  for (const item of [
    '.venv/**',
    '**/site-packages/**',
    'test-results/**',
    'reports/testing/playwright/**',
    '.playwright-cli/**',
    'unificados/**',
  ]) {
    if (!text.includes(item)) add('WARN', 'SERENA_NOISE_NOT_IGNORED', item);
  }

  if (!/initial_prompt:\s*\|/.test(text)) {
    add('WARN', 'INITIAL_PROMPT_MISSING', 'initial_prompt');
  }

  const ignoredBlock =
    text.match(/ignored_paths:[\s\S]*?(?=\n[A-Za-z_][\w-]*:|$)/)?.[0] ?? '';

  for (const productRoot of ['src/**', 'tests/**', 'scripts/**']) {
    if (ignoredBlock.includes(productRoot)) {
      add('ERROR', 'SERENA_PRODUCT_ROOT_IGNORED', productRoot);
    }
  }
}

if (!fs.existsSync(eslintFile)) {
  add('ERROR', 'ESLINT_CONFIG_MISSING', 'eslint.config.cjs');
} else {
  const text = fs.readFileSync(eslintFile, 'utf8');

  for (const productPath of [
    'src/sisad-pdfme/common/**',
    'src/sisad-pdfme/converter/**',
    'src/sisad-pdfme/generator/**',
    'src/sisad-pdfme/schemas/**',
  ]) {
    if (text.includes(`'${productPath}'`) || text.includes(`"${productPath}"`)) {
      add('ERROR', 'PRODUCT_SOURCE_EXCLUDED_FROM_LINT', productPath);
    }
  }

  for (const layer of [
    '**/*.{js,mjs}',
    '**/*.jsx',
    '**/*.{ts,mts,cts}',
    '**/*.tsx',
  ]) {
    if (!text.includes(layer)) add('ERROR', 'LINT_LAYER_MISSING', layer);
  }
}

if (!fs.existsSync(packageFile)) {
  add('ERROR', 'PACKAGE_MISSING', 'package.json');
} else {
  const pkg = JSON.parse(fs.readFileSync(packageFile, 'utf8'));
  const expected = {
    lint: 'eslint .',
    'lint:fix': 'eslint . --fix',
    typecheck: 'tsc --noEmit',
  };

  for (const [name, value] of Object.entries(expected)) {
    if (pkg.scripts?.[name] !== value) {
      add('WARN', 'NON_CANONICAL_SCRIPT', `${name}: ${pkg.scripts?.[name] ?? 'missing'}`);
    }
  }
}

const summary = findings.reduce((acc, finding) => {
  acc[finding.severity] = (acc[finding.severity] || 0) + 1;
  return acc;
}, {});

console.log(JSON.stringify({ root, summary, findings }, null, 2));
if ((summary.ERROR || 0) > 0) process.exitCode = 1;
