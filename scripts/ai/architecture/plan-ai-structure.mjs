#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { loadPolicy } from "./ai-structure-core.mjs";

const root = path.resolve(process.argv[2] || ".");
const policy = loadPolicy(root);
const ops = [];

for (const [from,to] of Object.entries(policy.scrum.archiveMoves || {})) {
  if (fs.existsSync(path.join(root,from))) ops.push({action:"archive",from,to});
}
for (const p of policy.scrum.deleteAfterReplacement || []) {
  if (fs.existsSync(path.join(root,p))) ops.push({action:"delete-after-replacement",path:p,replacement:policy.knownReplacements[p]});
}
for (const [from,to] of Object.entries(policy.brainContractMoves || {})) {
  if (fs.existsSync(path.join(root,from))) ops.push({action:"move-contract",from,to});
}
for (const [from,to] of Object.entries(policy.legacyContractMoves || {})) {
  if (fs.existsSync(path.join(root,from))) ops.push({action:"move-legacy-contract",from,to});
}
for (const [from,to] of Object.entries(policy.moveIfPresent || {})) {
  if (fs.existsSync(path.join(root,from))) ops.push({action:"move",from,to});
}
for (const p of policy.deleteAfterCanonicalization || []) {
  if (fs.existsSync(path.join(root,p))) ops.push({action:"canonicalize-delete",path:p,replacement:policy.knownReplacements[p]});
}
for (const pair of policy.promptPairs || []) {
  if (fs.existsSync(path.join(root,pair.remove))) ops.push({action:"merge-prompt-delete",...pair});
}

const reportDir=path.join(root,"reports/architecture");fs.mkdirSync(reportDir,{recursive:true});
fs.writeFileSync(path.join(reportDir,"ai-structure-plan.json"),JSON.stringify({operations:ops,deepArchiveCandidates:policy.deepArchiveCandidates||[]},null,2)+"\n");
fs.writeFileSync(path.join(reportDir,"AI-STRUCTURE-PLAN.md"),[
"# AI structure plan","",
`Operations: ${ops.length}`,"",
"| Action | From/path | Target |","|---|---|---|",
...ops.map((x)=>`| ${x.action} | \`${x.from||x.path||x.remove||""}\` | \`${x.to||x.replacement||x.canonical||""}\` |`),
"",
"## Deep archive candidates (review only)","",
...(policy.deepArchiveCandidates||[]).map((x)=>`- \`${x}\``),
"",
"> Plan only. No files changed.",""
].join("\n"),"utf8");
console.log(JSON.stringify({operations:ops.length,deepArchiveCandidates:(policy.deepArchiveCandidates||[]).length},null,2));
