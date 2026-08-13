import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { copyRecursive, ensureDir, timestamp } from './lib-documentation.mjs';

const packageRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const repo=path.resolve(process.argv[2]||'.');
const apply=process.argv.includes('--apply');
const dry=process.argv.includes('--dry-run') || !apply;
if(!fs.existsSync(repo)||!fs.statSync(repo).isDirectory()){console.error(`Repository not found: ${repo}`);process.exit(2);}

function run(script,args=[],{allowFail=false}={}){
  const p=spawnSync(process.execPath,[path.join(packageRoot,'scripts',script),...args],{stdio:'inherit'});
  if(p.status!==0&&!allowFail)process.exit(p.status||1);
  return p.status||0;
}
function backupIfExists(relative,backupRoot){
  const p=path.join(repo,relative);if(!fs.existsSync(p))return;
  copyRecursive(p,path.join(backupRoot,relative));
}
function copyPackageFile(sourceRel,targetRel,backupRoot){
  const src=path.join(packageRoot,sourceRel), dst=path.join(repo,targetRel);
  if(!fs.existsSync(src))throw new Error(`Package source missing: ${sourceRel}`);
  backupIfExists(targetRel,backupRoot);
  ensureDir(path.dirname(dst));fs.copyFileSync(src,dst);
}

console.log(`\nSISAD-WEB documentation repair — ${dry?'DRY-RUN':'APPLY'}\nRepository: ${repo}\n`);

if(dry){
  run('normalize-documentation.mjs',[repo]);
  console.log('\nDry-run only. No files changed. Review collisions/renames above, then run with --apply.');
  process.exit(0);
}

// One external sibling backup covers normalized documents and any durable tooling we replace.
const backup=path.join(path.dirname(repo),`${path.basename(repo)}.documentation-backup-${timestamp()}`);
ensureDir(backup);

// 1) normalize current repository and clean prior package residue.
run('normalize-documentation.mjs',[repo,'--apply','--backup',backup]);

// 2) install durable policy/decision/guide. These are additive canonical documents.
const payloadFiles=[
  ['payload/.ai/brain/20-contracts/DOCUMENTATION-NAMING.md','.ai/brain/20-contracts/DOCUMENTATION-NAMING.md'],
  ['payload/.ai/brain/30-decisions/ADR-013-STABLE-DOCUMENTATION-PATHS.md','.ai/brain/30-decisions/ADR-013-STABLE-DOCUMENTATION-PATHS.md'],
  ['payload/.ai/brain/50-guides/DOCUMENTATION-REPAIR.md','.ai/brain/50-guides/DOCUMENTATION-REPAIR.md'],
];
for(const [src,dst] of payloadFiles)copyPackageFile(src,dst,backup);

// 3) install stable documentation tools. No generation number in filenames.
const toolFiles=[
  'lib-documentation.mjs','normalize-documentation.mjs','lib-topology.mjs','build-markdown-topology.mjs',
  'apply-markdown-topology.mjs','validate-documentation-names.mjs','validate-markdown-topology.mjs',
  'validate-overlay-package.mjs'
];
for(const name of toolFiles)copyPackageFile(`scripts/${name}`,`scripts/${name}`,backup);

// Add stable quality commands without changing existing application scripts.
const packageJson=path.join(repo,'package.json');
if(fs.existsSync(packageJson)){
  backupIfExists('package.json',backup);
  const pkg=JSON.parse(fs.readFileSync(packageJson,'utf8'));
  pkg.scripts=pkg.scripts||{};
  pkg.scripts['docs:index']='node scripts/build-markdown-topology.mjs .';
  pkg.scripts['docs:connect']='node scripts/apply-markdown-topology.mjs . && node scripts/build-markdown-topology.mjs .';
  pkg.scripts['docs:names']='node scripts/validate-documentation-names.mjs .';
  pkg.scripts['docs:validate']='node scripts/validate-documentation-names.mjs . && node scripts/validate-markdown-topology.mjs .';
  fs.writeFileSync(packageJson,`${JSON.stringify(pkg,null,2)}\n`);
}

// 4) If an old overlay README survived because it was not one of the package-root files, repair only known broken entrypoints.
// Templates live in the package, so run before rebuilding topology.
run('repair-documentation-entrypoints.mjs',[repo]);

// 5) Generate topology, inject managed navigation, then regenerate because link/incoming counts changed.
run('build-markdown-topology.mjs',[repo]);
run('apply-markdown-topology.mjs',[repo]);
run('build-markdown-topology.mjs',[repo]);

// 6) Evidence is intentionally created after migration and before final topology pass.
const evidence=path.join(repo,'.ai/evidence/DOCUMENTATION-NORMALIZATION.md');
ensureDir(path.dirname(evidence));
fs.writeFileSync(evidence,`# Documentation normalization\n\n## Result\n\nCanonical Markdown paths were normalized to stable semantic names. Package/snapshot residue from prior ZIP deliveries was removed from the repository surface after external backup. Markdown references were rewritten and the derived topology index was rebuilt.\n\n## Invariants applied\n\n- no document-generation tokens such as/V2/V4 in canonical Markdown paths;\n- historical campaign/task identifiers remain content/provenance, not filename revisions;\n- one canonical root README;\n- unique ADR IDs;\n- package README never lives under payload;\n- generated indexes exclude package/snapshot residue.\n\n## Validation\n\nRun:\n\n\`\`\`bash\nnode scripts/validate-documentation-names.mjs .\nnode scripts/validate-markdown-topology.mjs .\n\`\`\`\n\n## Backup\n\nExternal sibling backup created by the migration. It is intentionally not linked by absolute path to keep repository documentation portable.\n`);
run('apply-markdown-topology.mjs',[repo]);
run('build-markdown-topology.mjs',[repo]);

// 7) Final gates.
run('validate-documentation-names.mjs',[repo]);
run('validate-markdown-topology.mjs',[repo]);

console.log(`\nPASS: documentation repair completed.\nBackup: ${backup}\nReview git status/diff before deleting the backup.\n`);
