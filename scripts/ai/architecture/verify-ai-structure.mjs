#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import {
  loadPolicy, scanGraph, duplicateAudit, markdownFiles, slash, runNode
} from "./ai-structure-core.mjs";

const root=path.resolve(process.argv[2]||".");
loadPolicy(root);
const errors=[],warnings=[];
const graph=scanGraph(root), exact=duplicateAudit(root);
for(const b of graph.broken) errors.push(`BROKEN_LINK ${b.source} -> ${b.href}`);
for(const o of graph.orphans) errors.push(`ACTIVE_ORPHAN ${o}`);
for(const g of exact) errors.push(`EXACT_DUPLICATE ${g.join(" = ")}`);

const forbidden=[
  ".ai/contracts"
];
for(const rel of forbidden)if(fs.existsSync(path.join(root,rel)))errors.push(`LEGACY_PATH_PRESENT ${rel}`);

for(const file of markdownFiles(root)){
 const rel=slash(path.relative(root,file));
 if(/^\.ai\/brain\/10-domains\/[^/]+\/FILES\.md$/.test(rel))errors.push(`STALE_DOMAIN_FILES ${rel}`);
 if(!rel.startsWith(".ai/archive/") && /worktrees?\s+(?:separados|required|obligatorio)/i.test(fs.readFileSync(file,"utf8")))warnings.push(`WORKTREE_LANGUAGE ${rel}`);
}

const required=[
 ".ai/scrum/governance/MERGE-POLICY.md",
 ".ai/scrum/governance/STATE-AUTHORITY.md",
 ".ai/scrum/views/ACTIVE.md",
 ".ai/scrum/views/BACKLOG.md",
 ".ai/scrum/views/BLOCKED.md",
 ".ai/scrum/views/COMPLETED.md",
 ".ai/brain/90-reference/ARCHITECTURE-MAP.md",
 ".ai/index/architecture/AI-CATALOG.md",
];
for(const rel of required)if(!fs.existsSync(path.join(root,rel)))errors.push(`REQUIRED_MISSING ${rel}`);

const pt=runNode(root,"scripts/project-tools.mjs",["validate",root],true);
if(!pt.skipped&&pt.status!==0)warnings.push(`PROJECT_TOOLS_VALIDATE_EXIT_${pt.status}`);

const reportDir=path.join(root,"reports/architecture");fs.mkdirSync(reportDir,{recursive:true});
fs.writeFileSync(path.join(reportDir,"AI-STRUCTURE-VERIFY.md"),[
"# AI structure verify","",`Errors: ${errors.length}`,`Warnings: ${warnings.length}`,"",
"## Errors","",...(errors.length?errors.map((x)=>`- ${x}`):["- none"]),"",
"## Warnings","",...(warnings.length?warnings.map((x)=>`- ${x}`):["- none"]),""
].join("\n"),"utf8");
console.log(JSON.stringify({ok:errors.length===0,errors,warnings},null,2));
if(errors.length)process.exit(1);
