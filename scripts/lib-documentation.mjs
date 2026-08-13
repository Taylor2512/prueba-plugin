import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export const PACKAGE_RESIDUE_DIRS = new Set(['payload', 'reference-snapshot', 'current-index']);
export const IGNORE_DIRS = new Set(['node_modules','dist','build','coverage','.git','.vite','.cache']);
export const PACKAGE_ROOT_FILES = new Set([
  'APPLY-INCREMENTALLY.md','APPLY-INSTRUCTIONS.md','ARCHITECTURE.md','AUDIT.md',
  'CHAT-KNOWLEDGE-CROSSWALK.md','CONNECTIVITY-AUDIT.md','INCREMENTAL-MIGRATION.md',
  'INSTALL.md','MANIFEST.md','MIGRATION.md','PATCH-MANIFEST.md','PROJECT-CROSSCHECK.md',
  'PROMPT-SESSION-RULE-UNIVERSAL.md','SESSION-LIFECYCLE.md','STRUCTURE.md',
  'TREE-WF-DESIGN.md','README-DA-PDFME-V4.md','README-WF-DESIGN.md','TREE.md'
]);

export const ROOT_RELOCATIONS = new Map([
  ['.ai/analysis/workflows/WF-DESIGN-DEEP-ANALYSIS.md', '.ai/analysis/workflows/WF-DESIGN-DEEP-ANALYSIS.md'],
  ['research/README.md', 'research/README.md'],
]);

export const EXPLICIT_RENAMES = new Map([
  ['.ai/migrations/V8-TO-V9.md', '.ai/migrations/AI-ARCHITECTURE-MIGRATION.md'],
  ['.ai/migrations/DA-PDFME-V4-2-TO-V4-3-HAIKU.md', '.ai/migrations/DA-PDFME-MIGRATION-HAIKU.md'],
  ['.ai/plans/PLAN_DA_PDFME_V4_3_HAIKU.md', '.ai/plans/PLAN_DA_PDFME_HAIKU.md'],
  ['.ai/prompts/haiku/PROMPT_ARRANQUE_HAIKU_DA_PDFME_V4_3.md', '.ai/prompts/haiku/PROMPT_ARRANQUE_HAIKU_DA_PDFME.md'],
  ['docs/03-estilos/01-tailwind.md', 'docs/03-estilos/01-tailwind.md'],
  ['.ai/brain/30-decisions/ADR-011-PROCESS-CENTRIC-MEMORY.md', '.ai/brain/30-decisions/ADR-011-PROCESS-CENTRIC-MEMORY.md'],
  ['.ai/brain/30-decisions/ADR-012-VISUAL-EVIDENCE-AS-BEHAVIORAL-CONTRACT.md', '.ai/brain/30-decisions/ADR-012-VISUAL-EVIDENCE-AS-BEHAVIORAL-CONTRACT.md'],
]);

export const TEXT_EXTENSIONS = new Set([
  '.md','.mdx','.txt','.json','.jsonl','.js','.jsx','.ts','.tsx','.mjs','.cjs','.yaml','.yml','.toml','.css','.scss'
]);

export const toPosix = (p) => p.split(path.sep).join('/');
export const rel = (root,p) => toPosix(path.relative(root,p));
export const exists = p => fs.existsSync(p);
export const ensureDir = p => fs.mkdirSync(p,{recursive:true});
export const sha256 = b => crypto.createHash('sha256').update(b).digest('hex');

export function walkFiles(root,{includeResidue=false}={}) {
  const out=[];
  function rec(dir, depth=0) {
    for (const e of fs.readdirSync(dir,{withFileTypes:true})) {
      if (IGNORE_DIRS.has(e.name)) continue;
      if (!includeResidue && depth===0 && PACKAGE_RESIDUE_DIRS.has(e.name)) continue;
      const p=path.join(dir,e.name);
      if (e.isDirectory()) rec(p,depth+1);
      else if (e.isFile()) out.push(p);
    }
  }
  rec(root,0);
  return out.sort();
}

export function walkMarkdown(root,opts={}) {
  return walkFiles(root,opts).filter(p=>/\.mdx?$/i.test(p));
}

export function hasDocumentRevisionToken(s) {
  return /(^|[-_])v\d+(?=$|[-_.])/i.test(s);
}

export function normalizeComponent(name) {
  const original=name;
  let base=name;
  // Explicitly remove vN / VNN tokens used as document-generation identifiers.
  base=base.replace(/^v\d+[-_]+/i,'');
  base=base.replace(/([-_])v\d+(?=$|[-_.])/gi,'');
  // Clean separator debris only when a revision token was actually removed.
  // Names such as _examples or _legacy are intentional and must stay untouched.
  if (base!==original) {
    base=base.replace(/--+/g,'-').replace(/__+/g,'_').replace(/-_+/g,'-').replace(/_-+/g,'_');
    base=base.replace(/^[-_]+|[-_]+(?=\.)/g,'');
  }
  return base;
}

export function genericNormalizedPath(relativePath) {
  const parts=toPosix(relativePath).split('/');
  return parts.map(normalizeComponent).join('/');
}

export function proposedRename(relativePath) {
  if (EXPLICIT_RENAMES.has(relativePath)) return EXPLICIT_RENAMES.get(relativePath);
  if (ROOT_RELOCATIONS.has(relativePath)) return ROOT_RELOCATIONS.get(relativePath);
  return genericNormalizedPath(relativePath);
}

export function isGeneratedIndex(relativePath) {
  return relativePath.startsWith('.ai/index/markdown/');
}

export function isPackageResidue(relativePath) {
  const first=relativePath.split('/')[0];
  return PACKAGE_RESIDUE_DIRS.has(first) || PACKAGE_ROOT_FILES.has(relativePath);
}

export function readTextSafe(p) {
  try { return fs.readFileSync(p,'utf8'); } catch { return null; }
}

export function copyRecursive(src,dst) {
  const st=fs.statSync(src);
  if (st.isDirectory()) {
    ensureDir(dst);
    for (const e of fs.readdirSync(src)) copyRecursive(path.join(src,e),path.join(dst,e));
  } else {
    ensureDir(path.dirname(dst));
    fs.copyFileSync(src,dst);
  }
}

export function removeRecursive(p) {
  fs.rmSync(p,{recursive:true,force:true});
}

export function timestamp() {
  const d=new Date();
  const z=n=>String(n).padStart(2,'0');
  return `${d.getFullYear()}${z(d.getMonth()+1)}${z(d.getDate())}-${z(d.getHours())}${z(d.getMinutes())}${z(d.getSeconds())}`;
}

export function externalBackupPath(root) {
  const parent=path.dirname(root);
  const name=path.basename(root);
  return path.join(parent,`${name}.documentation-backup-${timestamp()}`);
}

export function resolveMarkdownTarget(sourceAbs, raw) {
  let dest=raw.trim();
  if (!dest || /^(https?:|mailto:|tel:|#)/i.test(dest) || path.isAbsolute(dest)) return null;
  dest=dest.replace(/^<|>$/g,'');
  const hash=dest.indexOf('#');
  const suffix=hash>=0?dest.slice(hash):'';
  const clean=hash>=0?dest.slice(0,hash):dest;
  if (!clean) return null;
  const abs=path.resolve(path.dirname(sourceAbs),clean);
  return {abs,clean,suffix};
}

export function rewriteMarkdownLinks(text,sourceOldAbs,sourceNewAbs,root,renameAbsMap) {
  const re=/(!?\[[^\]]*\]\()([^\s)]+)([^)]*\))/g;
  return text.replace(re,(full,prefix,target,suffixPart)=>{
    const parsed=resolveMarkdownTarget(sourceOldAbs,target);
    if (!parsed) return full;
    const mapped=renameAbsMap.get(path.resolve(parsed.abs));
    if (!mapped) return full;
    const nextRel=toPosix(path.relative(path.dirname(sourceNewAbs),mapped));
    const newTarget=(nextRel||path.basename(mapped))+parsed.suffix;
    return `${prefix}${newTarget}${suffixPart}`;
  });
}

export function replaceExactPathLiterals(text, root, relativeMap) {
  let out=text;
  // Longest first prevents partial replacement of a directory before a file path.
  const entries=[...relativeMap.entries()].sort((a,b)=>b[0].length-a[0].length);
  for (const [oldRel,newRel] of entries) {
    out=out.split(oldRel).join(newRel);
    // Common leading ./ form.
    out=out.split(`./${oldRel}`).join(`./${newRel}`);
  }
  return out;
}

export function patchKnownDocumentContent(relativePath,text) {
  let out=text;
  if (relativePath==='.ai/brain/30-decisions/ADR-011-PROCESS-CENTRIC-MEMORY.md') {
    out=out.replace(/^#\s+ADR-008\b/m,'# ADR-011');
  }
  if (relativePath==='.ai/brain/30-decisions/ADR-012-VISUAL-EVIDENCE-AS-BEHAVIORAL-CONTRACT.md') {
    out=out.replace(/^#\s+ADR-009\b/m,'# ADR-012');
  }
  if (relativePath==='docs/03-estilos/01-tailwind.md') {
    out = `# Tailwind en SISAD-WEB\n\nSISAD-WEB usa **Tailwind CSS 3.x**. La versión exacta la gobiernan \`package.json\` y el lockfile; no se codifica en el nombre de este documento.\n\n## Contrato actual\n\n- configuración canónica: \`tailwind.config.js\`;\n- pipeline PostCSS: Tailwind 3 + Autoprefixer;\n- entrada CSS basada en \`@tailwind base/components/utilities\`;\n- no usar sintaxis exclusiva de Tailwind 4 (\`@theme\`, \`@reference\`, \`@import "tailwindcss"\`) mientras el proyecto permanezca en 3.x;\n- migraciones de versión deben cambiar el contenido de este archivo, no crear \`01-tailwind-vN.md\`.\n\n## Fuente de verdad\n\nAntes de cambiar configuración o sintaxis, comprobar \`package.json\`, lockfile, \`tailwind.config.js\`, \`postcss.config.js\` y el CSS de entrada actual.\n`;
  }
  if (relativePath==='docs/03-estilos/02-apply-reference.md') {
    out = `# @apply y contexto Tailwind\n\n## Estado actual\n\nSISAD-WEB usa Tailwind CSS 3.x. \`@apply\` es válido, pero **\`@reference\` es sintaxis de Tailwind 4 y no forma parte del contrato actual**.\n\n## Reglas\n\n- usar utilidades Tailwind directamente en JSX/TSX para código nuevo cuando sea razonable;\n- conservar \`@apply\` en CSS existente cuando reduzca duplicación y no rompa contratos técnicos;\n- no introducir \`@reference\`, \`@theme\` ni \`@import "tailwindcss"\` sin una migración explícita del toolchain;\n- mantener CSS nativo para selectores vendor, geometría, pseudo-elementos, AG Grid, MUI internals y runtime cuando Tailwind no sea suficiente;\n- validar HMR/build después de mover imports o directivas.\n`;
  }
  return out;
}

export function uniqueAdrNumberIssues(root) {
  const dir=path.join(root,'.ai/brain/30-decisions');
  if (!fs.existsSync(dir)) return [];
  const seen=new Map(), issues=[];
  for (const name of fs.readdirSync(dir).filter(n=>/^ADR-\d+-.*\.md$/i.test(n))) {
    const id=name.match(/^ADR-(\d+)-/i)[1];
    if (seen.has(id)) issues.push([seen.get(id),name]); else seen.set(id,name);
  }
  return issues;
}
