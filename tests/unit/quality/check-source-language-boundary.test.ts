import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { describe, expect, it } from 'vitest';

const SCRIPT = join(process.cwd(), 'scripts/quality/check-source-language-boundary.mjs');

function createFixtureRoot() {
  const root = mkdtempSync(join(tmpdir(), 'source-language-boundary-'));
  mkdirSync(join(root, 'src/examples'), { recursive: true });
  mkdirSync(join(root, 'src/sisad-pdfme'), { recursive: true });
  return root;
}

function runGate(root: string) {
  return execFileSync('node', [SCRIPT, `--root=${root}`], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

describe('check-source-language-boundary', () => {
  it('permite un árbol válido con JS/JSX en examples y TS en core', () => {
    const root = createFixtureRoot();
    writeFileSync(
      join(root, 'src/examples/ok.js'),
      [
        "import React from 'react';",
        "import { buildShowcaseTemplate } from '@/sisad-pdfme/labs';",
        'export const ok = buildShowcaseTemplate([{ title: "Demo", types: ["text"] }]);',
      ].join('\n'),
    );
    writeFileSync(join(root, 'src/sisad-pdfme/core.ts'), 'export const core = true;\n');

    const output = runGate(root);
    expect(output).toContain('✓ src/examples usa solo JS/JSX/JSON y entrypoints públicos');

    rmSync(root, { recursive: true, force: true });
  });

  it('falla cuando examples usa un deep import o una extensión TypeScript', () => {
    const root = createFixtureRoot();
    writeFileSync(
      join(root, 'src/examples/bad.js'),
      "import { createDefaultTemplate } from '../sisad-pdfme/templates/createDefaultTemplate.ts';\nexport const bad = createDefaultTemplate;\n",
    );

    try {
      runGate(root);
      throw new Error('expected gate to fail');
    } catch (error) {
      const output = `${(error as { stdout?: string; stderr?: string }).stdout || ''}${(error as { stdout?: string; stderr?: string }).stderr || ''}`;
      expect(output).toContain('importa una extensión TypeScript prohibida');
      expect(output).toContain('src/examples/bad.js');
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
