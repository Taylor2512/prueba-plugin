import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

export const absoluteSource = (sourcePath: string) => path.resolve(process.cwd(), sourcePath);
export const readSource = (sourcePath: string) => fs.readFileSync(absoluteSource(sourcePath), 'utf8');

export function parseSource(sourcePath: string) {
  const absolute = absoluteSource(sourcePath);
  const content = fs.readFileSync(absolute, 'utf8');
  const kind = sourcePath.endsWith('.tsx')
    ? ts.ScriptKind.TSX
    : sourcePath.endsWith('.jsx')
      ? ts.ScriptKind.JSX
      : sourcePath.endsWith('.js')
        ? ts.ScriptKind.JS
        : ts.ScriptKind.TS;
  return ts.createSourceFile(absolute, content, ts.ScriptTarget.Latest, true, kind);
}

export const syntaxDiagnostics = (sourcePath: string) =>
  parseSource(sourcePath).parseDiagnostics.map((diagnostic) =>
    ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'),
  );

function resolveCandidates(importer: string, specifier: string) {
  const clean = specifier.split(/[?#]/, 1)[0];
  const base = path.resolve(path.dirname(importer), clean);
  const ext = path.extname(base);
  const candidates = new Set<string>([base]);

  if (!ext) {
    for (const suffix of ['.ts','.tsx','.js','.jsx','.mjs','.cjs','.json','.css']) candidates.add(`${base}${suffix}`);
    for (const name of ['index.ts','index.tsx','index.js','index.jsx','index.mjs','index.cjs']) candidates.add(path.join(base,name));
  } else if (['.js','.jsx','.mjs','.cjs'].includes(ext)) {
    const stem = base.slice(0,-ext.length);
    for (const suffix of ['.ts','.tsx','.js','.jsx','.mjs','.cjs']) candidates.add(`${stem}${suffix}`);
  }
  return [...candidates];
}

export function unresolvedRelativeImports(sourcePath: string) {
  const importer = absoluteSource(sourcePath);
  const source = parseSource(sourcePath);
  const unresolved: string[] = [];
  const inspect = (specifier: string) => {
    if (!specifier.startsWith('.')) return;
    if (!resolveCandidates(importer,specifier).some((candidate)=>fs.existsSync(candidate))) unresolved.push(specifier);
  };

  source.forEachChild((node) => {
    if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
        node.moduleSpecifier && ts.isStringLiteralLike(node.moduleSpecifier)) {
      inspect(node.moduleSpecifier.text);
    }
  });
  return unresolved;
}
