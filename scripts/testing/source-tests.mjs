import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { loadConfig, parseArgs, posix, walk, writeJson } from './core/filesystem.mjs';

/** Detecta ejecución directa; `import.meta.url` codifica los espacios de la ruta. */
const esEntrada = (url) => url === pathToFileURL(process.argv[1]).href;

/**
 * Generador de source-contracts: un test dedicado por archivo productivo.
 *
 * Lo que demuestra un source-contract es acotado a propósito: el archivo
 * existe, no tiene marcadores de conflicto, parsea y resuelve sus imports
 * relativos. NO demuestra comportamiento, y `coverage.mjs` lo excluye del
 * cómputo de casos de uso justamente por eso.
 *
 * El manifest y el contrato uno-a-uno derivan de ESTA misma enumeración, para
 * que no puedan quedarse obsoletos tras un renombrado.
 */

const EXTENSIONES = ['.ts', '.tsx', '.js', '.jsx'];

const lenguaje = (file) =>
  file.endsWith('.tsx')
    ? 'typescript-react'
    : file.endsWith('.jsx')
      ? 'javascript-react'
      : file.endsWith('.ts')
        ? 'typescript'
        : 'javascript';

const render = (relSource, target, helperAbs) => {
  let helper = posix(path.relative(path.dirname(target), helperAbs)).replace(/\.ts$/, '');
  if (!helper.startsWith('.')) helper = `./${helper}`;
  return `// @generated — source-contract de ${relSource}. Regenerar con \`npm test -- source-tests --apply\`.
import { describe, expect, it } from 'vitest';
import { statSync } from 'node:fs';
import { absoluteSource, readSource, syntaxDiagnostics, unresolvedRelativeImports } from ${JSON.stringify(helper)};

const SOURCE = ${JSON.stringify(relSource)};

describe(${JSON.stringify(relSource)}, () => {
  it('existe y no está vacío', () => {
    expect(statSync(absoluteSource(SOURCE)).isFile()).toBe(true);
    expect(readSource(SOURCE).trim().length).toBeGreaterThan(0);
  });

  it('no contiene marcadores de conflicto sin resolver', () => {
    expect(readSource(SOURCE)).not.toMatch(/^(?:<<<<<<<|=======|>>>>>>>)/m);
  });

  it('parsea sin diagnósticos de sintaxis', () => {
    expect(syntaxDiagnostics(SOURCE)).toEqual([]);
  });

  it('resuelve todos sus imports/exports relativos', () => {
    expect(unresolvedRelativeImports(SOURCE)).toEqual([]);
  });
});
`;
};

export function sourceTests({ root, apply = false } = {}) {
  const config = loadConfig(root);
  const gen = config.generated ?? {};
  const srcRoot = path.join(root, config.sourceRoot ?? 'src/sisad-pdfme');
  const testsRoot = path.join(root, gen.fileTestsDir ?? 'tests/unit/files');
  const helperAbs = path.join(root, gen.sourceContractHelper ?? 'tests/support/assertions/sourceContract.ts');

  if (!fs.existsSync(srcRoot)) throw new Error(`Falta ${config.sourceRoot}`);
  if (!fs.existsSync(helperAbs)) throw new Error(`Falta ${gen.sourceContractHelper}`);

  const sources = walk(srcRoot, (f) => EXTENSIONES.some((e) => f.endsWith(e))).sort();
  const cambios = [];

  const escribir = (target, next) => {
    const current = fs.existsSync(target) ? fs.readFileSync(target, 'utf8') : null;
    if (current === next) return;
    cambios.push({
      action: current === null ? 'create' : 'update',
      target: posix(path.relative(root, target)),
    });
    if (apply) {
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, next, 'utf8');
    }
  };

  const esperados = new Map(
    sources.map((source) => [
      path.join(testsRoot, `${path.relative(srcRoot, source)}.file.test.ts`),
      source,
    ]),
  );

  for (const [target, source] of esperados) {
    const relSource = `${posix(path.relative(root, srcRoot))}/${posix(path.relative(srcRoot, source))}`;
    escribir(target, render(relSource, target, helperAbs));
  }

  for (const stale of walk(testsRoot, (f) => f.endsWith('.file.test.ts'))) {
    if (esperados.has(stale)) continue;
    cambios.push({ action: 'remove-stale', target: posix(path.relative(root, stale)) });
    if (apply) fs.rmSync(stale, { force: true });
  }

  const entries = sources.map((source, index) => {
    const relative = posix(path.relative(srcRoot, source));
    const relSource = `${posix(path.relative(root, srcRoot))}/${relative}`;
    const content = fs.readFileSync(source, 'utf8');
    return {
      index: index + 1,
      path: relSource,
      language: lenguaje(relSource),
      lines: content.split('\n').length,
      kb: Number((Buffer.byteLength(content) / 1024).toFixed(1)),
      domain: relative.includes('/') ? relative.split('/')[0] : relative,
      testPath: posix(
        path.relative(root, path.join(testsRoot, `${path.relative(srcRoot, source)}.file.test.ts`)),
      ),
      cases: 4,
    };
  });

  const manifestPath = path.join(root, gen.manifest ?? 'tests/support/manifest/source-files.json');
  escribir(manifestPath, `${JSON.stringify(entries, null, 2)}\n`);

  const contractPath = path.join(
    root,
    gen.oneToOneContract ?? 'tests/unit/contracts/architecture/everySourceHasDedicatedTest.test.ts',
  );
  escribir(
    contractPath,
    `// @generated — regenerar con \`npm test -- source-tests --apply\`.
import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

describe('contrato uno-a-uno entre fuente y test', () => {
${entries
  .map(
    (e) =>
      `  it(${JSON.stringify(`${e.path} tiene su test dedicado`)}, () => expect(existsSync(resolve(process.cwd(), ${JSON.stringify(e.testPath)}))).toBe(true));`,
  )
  .join('\n')}
});
`,
  );

  return { mode: apply ? 'APPLY' : 'DRY-RUN', sourceFiles: sources.length, changes: cambios };
}

/** Valida el mapeo sin escribir: sustituye a validate-sisad-pdfme-test-map.mjs. */
export function validateSourceMap({ root } = {}) {
  const result = sourceTests({ root, apply: false });
  return {
    sourceFiles: result.sourceFiles,
    pending: result.changes,
    ok: result.changes.length === 0,
  };
}

if (esEntrada(import.meta.url)) {
  const { root, apply, flags } = parseArgs();
  if (flags.includes('--validate')) {
    const result = validateSourceMap({ root });
    console.log(JSON.stringify(result, null, 2));
    process.exitCode = result.ok ? 0 : 1;
  } else {
    const result = sourceTests({ root, apply });
    console.log(JSON.stringify(result, null, 2));
    if (apply) {
      writeJson(path.join(root, 'reports/testing/source-tests.json'), result);
    }
  }
}
