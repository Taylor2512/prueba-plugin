#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import {
  read, slash, loadPolicy, activeWriteClaims, safeWrite, safeRemove, safeMove,
  backupFile, mergeAliasMap, rewriteReferences, buildHierarchicalNavigation,
  walk, titleOf, runNode
} from "./ai-structure-core.mjs";

const root = path.resolve(process.argv[2] || ".");
const policy = loadPolicy(root);
const claims = activeWriteClaims(root);
if (claims.length) {
  console.error(JSON.stringify({error:"ACTIVE_WRITE_CLAIMS",claims},null,2));
  process.exit(4);
}
const reportDir=path.join(root,"reports/architecture");fs.mkdirSync(reportDir,{recursive:true});
const changes=[], replacements={...policy.knownReplacements,...policy.brainContractMoves,...policy.legacyContractMoves,...policy.moveIfPresent};

function record(action, data){changes.push({action,...data});}
function loadInstalled(rel){
  const p=path.join(root,rel);
  if(!fs.existsSync(p)) throw new Error(`MISSING_INSTALLED_TEMPLATE ${rel}`);
  return read(p);
}

// 1. Canonical Scrum governance is installed by setup; ensure it remains.
for (const rel of [
  ".ai/scrum/governance/README.md",
  ".ai/scrum/governance/STATE-AUTHORITY.md",
  ".ai/scrum/governance/MERGE-POLICY.md",
  ".ai/scrum/governance/VISUAL-UX-POLICY.md",
]) {
  if (!fs.existsSync(path.join(root,rel))) throw new Error(`MISSING_GOVERNANCE ${rel}`);
}

// 2. Archive ledger before deleting projections.
for (const [from,to] of Object.entries(policy.scrum.archiveMoves || {})) {
  const r=safeMove(root,from,to,policy);if(r.status!=="missing")record("archive",{from,to,status:r.status});
}

// 3. Move contracts into semantic Brain folders.
for (const mapping of [policy.brainContractMoves||{},policy.legacyContractMoves||{},policy.moveIfPresent||{}]) {
  for (const [from,to] of Object.entries(mapping)) {
    const r=safeMove(root,from,to,policy);
    if(r.status!=="missing")record("move",{from,to,status:r.status});
  }
}
// Remove empty legacy contracts root README/dir after link rewrite later.
if(fs.existsSync(path.join(root,".ai/brain/20-contracts/README.md"))) replacements[".ai/brain/20-contracts/README.md"]=".ai/brain/20-contracts/README.md";

// 4. Consolidate route pairs.
function mergeRoute(canonicalRel, removeRel, title, skill, extra) {
  const can=path.join(root,canonicalRel), rem=path.join(root,removeRel);
  if(!fs.existsSync(can)&&!fs.existsSync(rem))return;
  const body=[
    `# ${title}`,"",
    "## Owner question","",
    "¿Qué evidencia mínima decide el cambio en este dominio?","",
    "## Load","",
    "- task-card activa",
    `- skill principal: \`${skill}\``,
    ...(extra||[]),
    "",
    "## Output","",
    "Evidence packet, decisión, máximo cinco archivos productivos, test focal, trace IDs, gates y condición de parada.",
    "",
    "## Guardrails","",
    "- una sola ruta posee el parche;",
    "- no cargar catálogos completos si un índice resuelve la incógnita;",
    "- máximo ocho archivos de diagnóstico y dos skills salvo evidence que justifique más.",
    ""
  ].join("\n");
  safeWrite(root,canonicalRel,body,policy);record("rewrite-route",{path:canonicalRel});
}
mergeRoute(".ai/routes/runtime.md",".ai/routes/runtime.md","Route — Designer/Form/Viewer/Generator","runtime-parity",[
  "- contrato runtime/schema sólo si responde la incógnita",
]);
mergeRoute(".ai/routes/ux.md",".ai/routes/ux.md","Route — Responsive / accessibility / Tailwind","sisad-responsive-ux",[
  "- use-cases/contract de UX sólo si responde la incógnita",
]);

// 5. Merge compact prompt pairs into canonical prompts.
const promptBodies={
"DIAGNOSE":`# DIAGNOSE\n\nDiagnostica una sola pregunta. No edites.\n\nDevuelve evidence packet, confianza, test focal y stop condition.\nCarga contexto adicional únicamente cuando una incógnita concreta lo requiera.\nNo expongas chain-of-thought.`,
"IMPLEMENT":`# IMPLEMENT\n\nImplementa una task activa respetando claim/context manifest.\n\nMáximo cinco archivos productivos salvo evidence que justifique ampliar el scope.\nIncluye test focal, trace delta, gates y stop condition.\nNo expongas chain-of-thought.`,
"MEMORY-DELTA":`# MEMORY-DELTA\n\nConvierte resultados verificados en el delta mínimo de memoria correcto.\n\nExcluye logs, hipótesis, historial transitorio y estados ya derivados de task/evidence.\nNo dupliques CURRENT/HANDOFF.\nNo expongas chain-of-thought.`,
"PROVIDER-SYNC":`# PROVIDER-SYNC\n\nCompara adapters Claude/Codex/Copilot contra AGENTS, START, routes y skills canónicos.\n\nReporta drift y corrige sólo el adapter, no la regla de negocio canónica.\nNo cargues contexto amplio sin una incógnita concreta.`,
"REVIEW":`# REVIEW\n\nRevisa diff de forma independiente: contratos, duplicidad, lifecycle, a11y, tests, seguridad y rollback.\n\nDevuelve findings priorizados y gates faltantes.\nNo edites salvo que la task lo autorice explícitamente.\nNo expongas chain-of-thought.`
};
for(const pair of policy.promptPairs||[]){
  const stem=path.basename(pair.canonical,".md");
  if(fs.existsSync(path.join(root,pair.canonical))||fs.existsSync(path.join(root,pair.remove))){
    safeWrite(root,pair.canonical,promptBodies[stem]||read(path.join(root,pair.canonical)),policy);
    record("merge-prompt",{canonical:pair.canonical,remove:pair.remove});
  }
}

// 6. Remove stale domain FILES.md, generate source indexes.
const domainsRoot=path.join(root,".ai/brain/10-domains"), indexRoot=path.join(root,".ai/index/architecture/domains");
if(fs.existsSync(domainsRoot)){
  fs.mkdirSync(indexRoot,{recursive:true});
  for(const e of fs.readdirSync(domainsRoot,{withFileTypes:true})){
    if(!e.isDirectory())continue;
    const domain=e.name, filesMd=path.join(domainsRoot,domain,"FILES.md");
    const sourceDir=path.join(root,"src/sisad-pdfme",domain);
    const sourceFiles=fs.existsSync(sourceDir)?walk(sourceDir).filter((p)=>/\.(?:ts|tsx|js|jsx)$/.test(p)):[];
    const lines=[`# Source index — ${domain}`,"",`Generated from \`src/sisad-pdfme/${domain}/\`.`,"",
      ...sourceFiles.sort().map((p)=>`- \`${slash(path.relative(root,p))}\``),""];
    safeWrite(root,slash(path.relative(root,path.join(indexRoot,`${domain}.md`))),lines.join("\n"),policy);
    if(fs.existsSync(filesMd)){safeRemove(root,slash(path.relative(root,filesMd)),policy);record("delete-stale-source-snapshot",{path:slash(path.relative(root,filesMd))});}
    const readme=path.join(domainsRoot,domain,"README.md");
    if(fs.existsSync(readme)){
      let t=read(readme);
      t=t.replace(/^Snapshot:.*$/gim,"");
      t=t.replace(/\n## Hotspots\n[\s\S]*?(?=\n## |\n<!--|$)/m,"\n");
      const start="<!-- domain-source-index:start -->",end="<!-- domain-source-index:end -->";
      const block=`${start}\n## Source index\n\nGenerated inventory: [${domain} source index](../../../index/architecture/domains/${domain}.md).\n\nDo not copy line counts into Brain; source is live authority.\n${end}`;
      const a=t.indexOf(start),b=t.indexOf(end);
      t=a>=0&&b>=a?t.slice(0,a)+block+t.slice(b+end.length):`${t.trimEnd()}\n\n${block}\n`;
      backupFile(root,readme,policy);fs.writeFileSync(readme,t.replace(/\n{3,}/g,"\n\n"),"utf8");
    }
  }
}

// 7. Canonical event/effect catalog references are handled by replacement map.

// 8. Generate current architecture map/hotspots; remove stale snapshots later.
const aiMd=walk(path.join(root,".ai")).filter((p)=>/\.mdx?$/i.test(p));
const byTop=new Map();
for(const p of aiMd){const rel=slash(path.relative(root,p)),key=rel.split("/").slice(0,2).join("/");byTop.set(key,(byTop.get(key)||0)+1);}
safeWrite(root,".ai/brain/90-reference/ARCHITECTURE-MAP.md",[
"# AI architecture map","",
"Generated structural summary. Live source and task/evidence remain authority.","",
"## Markdown by top-level area","",
...([...byTop.entries()].sort().map(([k,n])=>`- \`${k}\`: ${n}`)),"",
"## Canonical entrypoints","",
"- [Brain HOME](../HOME.md)",
"- [Scrum](../../scrum/README.md)",
"- [State sources](../../STATE-SOURCES.md)",
"- [Routes](../../routes/README.md)",
"- [Knowledge](../../knowledge/README.md)",
"- [Memory](../../memory/README.md)",""
].join("\n"),policy);

const src=path.join(root,"src/sisad-pdfme");
const hot=fs.existsSync(src)?walk(src).filter((p)=>/\.(?:ts|tsx|js|jsx)$/.test(p)).map((p)=>{
  let lines=0;try{lines=read(p).split(/\r?\n/).length}catch(error){if (!error || error.code !== 'EACCES') throw error;}return{p,lines};
}).sort((a,b)=>b.lines-a.lines).slice(0,60):[];
safeWrite(root,".ai/index/architecture/RUNTIME-HOTSPOTS.md",[
"# Runtime hotspots","","> Generated from live source; do not edit manually.","",
...hot.map((x)=>`- \`${slash(path.relative(root,x.p))}\` — ${x.lines} lines`),""
].join("\n"),policy);

// 9. Rewrite exact/relative references before deletions.
mergeAliasMap(root,replacements);
const rewritten=rewriteReferences(root,replacements,policy);
record("rewrite-references",{files:rewritten.length});

// 10. Delete replaced safe files.
const deleteSet=new Set([
  ...(policy.scrum.deleteAfterReplacement||[]),
  ...(policy.deleteAfterCanonicalization||[]),
  ...(policy.promptPairs||[]).map((x)=>x.remove),
  ".ai/brain/20-contracts/README.md",
]);
for(const rel of [...deleteSet]){
  if(fs.existsSync(path.join(root,rel))){safeRemove(root,rel,policy);record("delete",{path:rel});}
}

// 11. Remove empty directories explicitly and legacy contracts root when empty.
for(const rel of [...(policy.scrum.removeEmptyDirs||[]),".ai/contracts",".ai/quality"]){
  const p=path.join(root,rel);
  if(fs.existsSync(p)&&fs.statSync(p).isDirectory()&&fs.readdirSync(p).length===0){fs.rmdirSync(p);record("remove-empty-dir",{path:rel});}
}

// 12. Unique READMEs for previously exact duplicate hub content.
safeWrite(root,".ai/analysis/runtime-platform/README.md",[
"# Runtime Platform analysis","",
"Diagnostic and historical analysis for Runtime Platform.",
"Durable product rules belong in `../../brain/`; current execution belongs in `../../scrum/`.",
"",
"Use this folder for evidence-backed analysis, not as a second task-state authority.",""
].join("\n"),policy);
safeWrite(root,".ai/memory/topics/README.md",[
"# Stable memory topics","",
"These topics contain durable project facts with TTL/revalidation.",
"Operational CURRENT/HANDOFF topics live under `../../brain/70-memory/` and are not duplicated here.",""
].join("\n"),policy);

// 13. Brain HOME and active work become compact routing entrypoints.
safeWrite(root,".ai/brain/HOME.md",[
"# SISAD-PDFME Brain — HOME","",
"## Execution start","",
"1. [`../START.md`](../START.md)",
"2. [`../STATE-SOURCES.md`](../STATE-SOURCES.md)",
"3. [`../scrum/views/ACTIVE.md`](../scrum/views/ACTIVE.md)",
"4. current task-card + evidence",
"5. only the domain/contract needed for the question",
"",
"## Brain map","",
"- [Product](./00-product/README.md)",
"- [Domains](./10-domains/README.md)",
"- [Contracts](./20-contracts/README.md)",
"- [Decisions](./30-decisions/README.md)",
"- [Runtime](./40-runtime/README.md)",
"- [Integrations](./45-integrations/README.md)",
"- [Guides](./50-guides/README.md)",
"- [Quality](./60-quality/README.md)",
"- [Memory](./70-memory/README.md)",
"- [Reference](./90-reference/README.md)",
"",
"Do not load the whole Brain. Source + tests + evidence outrank documentation.",""
].join("\n"),policy);
safeWrite(root,".ai/brain/80-work/ACTIVE.md",[
"# Active work","",
"Canonical generated work view:",
"[`.ai/scrum/views/ACTIVE.md`](../../scrum/views/ACTIVE.md).","",
"Runtime current context:",
"[`../70-memory/CURRENT.md`](../70-memory/CURRENT.md).","",
"This file is a routing pointer, not a second task ledger.",""
].join("\n"),policy);

// If HANDOFF still contains the known obsolete seed, replace only that stale seed.
const handoff=path.join(root,".ai/brain/70-memory/HANDOFF.md");
if(fs.existsSync(handoff)&&/Next:\s*execute RTP-000/i.test(read(handoff))){
  safeWrite(root,".ai/brain/70-memory/HANDOFF.md",[
"# Handoff","",
"Start from live Git status, active claims, current task/evidence and the generated Scrum views.",
"",
"- [Current](./CURRENT.md)",
"- [Active view](../../scrum/views/ACTIVE.md)",
"- [Blocked view](../../scrum/views/BLOCKED.md)",
"",
"Do not resurrect the obsolete RTP-000 seed when the live campaign has advanced.",""
].join("\n"),policy);
  record("replace-stale-handoff-seed",{path:".ai/brain/70-memory/HANDOFF.md"});
}

// 14. Build every directory navigation so active Markdown is reachable.
const hubs=buildHierarchicalNavigation(root,policy);
record("build-hubs",{files:hubs.length});

// 15. Build a global catalog after hubs.
const mdFiles=walk(path.join(root,".ai")).filter((p)=>/\.mdx?$/i.test(p)).sort();
safeWrite(root,".ai/index/architecture/AI-CATALOG.md",[
"# AI Markdown catalog","",
"> Generated catalog. Do not edit manually.","",
...mdFiles.map((p)=>{
  const rel=slash(path.relative(root,p));
  const href=slash(path.relative(path.join(root,".ai/index/architecture"),p));
  return `- [${titleOf(read(p),path.basename(p))}](${href.startsWith(".")?href:`./${href}`}) — \`${rel}\``;
}),""
].join("\n"),policy);

// 16. Existing status/view/link tooling is authoritative when present.
runNode(root,"scripts/ai/architecture/reconcile-task-statuses.mjs",[root,"--apply"],true);
runNode(root,"scripts/ai/sync-scrum-views.mjs",[],true);
runNode(root,"scripts/ai/architecture/sync-runtime-memory.mjs",[root,"--apply"],true);
runNode(root,"scripts/project-tools.mjs",["links",root,"--apply"],true);
runNode(root,"scripts/project-tools.mjs",["index",root],true);

// Rebuild hubs after generated views/index changes.
buildHierarchicalNavigation(root,policy);

fs.writeFileSync(path.join(reportDir,"ai-structure-apply.json"),JSON.stringify({changes},null,2)+"\n");
fs.writeFileSync(path.join(reportDir,"AI-STRUCTURE-APPLY.md"),[
"# AI structure apply","",`Changes recorded: ${changes.length}`,"",
...changes.map((x)=>`- **${x.action}** ${x.path?`\`${x.path}\``:""}${x.from?` \`${x.from}\` -> \`${x.to}\``:""}${x.files?` (${x.files} files)`:""}`),
"",
`Backup root: \`${path.join(path.dirname(root),`${path.basename(root)}.${policy.backupSuffix}`)}\``,
""
].join("\n"),"utf8");
console.log(JSON.stringify({ok:true,changes:changes.length,backup:`${path.basename(root)}.${policy.backupSuffix}`},null,2));
