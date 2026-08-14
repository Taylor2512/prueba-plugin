#!/usr/bin/env node
import fs from "node:fs";import path from "node:path";import {spawnSync} from "node:child_process";
const root=path.resolve(process.argv[2]||"."),policy=JSON.parse(fs.readFileSync(path.join(root,"config/tooling/markdown-architecture-policy.json"),"utf8")),errors=[],warnings=[];
for(const hub of policy.hubs){const d=path.join(root,hub);if(fs.existsSync(d)&&fs.statSync(d).isDirectory()){const n=fs.readdirSync(d,{withFileTypes:true}).filter(e=>e.isFile()&&/\.md$/i.test(e.name)).length;if(n>=3&&!fs.existsSync(path.join(d,"README.md")))errors.push(`MISSING_HUB_README ${hub}`)}}
const af=path.join(root,"reports/architecture/task-status-audit.json");if(fs.existsSync(af)){const a=JSON.parse(fs.readFileSync(af,"utf8"));for(const x of a.rows||[])if(x.drift)errors.push(`TASK_STATUS_DRIFT ${x.id}: ${x.cardStatus}->${x.effectiveStatus}`);for(const x of a.duplicateIds||[])errors.push(`DUPLICATE_TASK_ID ${x.id}`);for(const x of a.conflicts||[])errors.push(`EVIDENCE_CONFLICT ${x.id}`)}
for(const s of policy.deprecatedSkills||[]){const p=path.join(root,".agents/skills",s,"SKILL.md");if(fs.existsSync(p))warnings.push(`DEPRECATED_SKILL_PRESENT ${s}`)}
for(const t of policy.transientCandidates||[])if(fs.existsSync(path.join(root,t)))warnings.push(`TRANSIENT_PRESENT ${t}`);
for(const p of policy.candidateOnly||[]){const a=path.join(root,p);if(fs.existsSync(a)&&fs.statSync(a).size===0)warnings.push(`EMPTY_CANDIDATE ${p}`)}
const pt=path.join(root,"scripts/project-tools.mjs");if(fs.existsSync(pt)){const r=spawnSync(process.execPath,[pt,"validate",root],{encoding:"utf8"});if(r.status!==0)errors.push(`PROJECT_TOOLS_VALIDATE exit=${r.status}`)}
fs.mkdirSync(path.join(root,"reports/architecture"),{recursive:true});fs.writeFileSync(path.join(root,"reports/architecture","ARCHITECTURE-VALIDATION.md"),["# Architecture validation","",`Errors: ${errors.length}`,`Warnings: ${warnings.length}`,"","## Errors","",...(errors.length?errors.map(x=>`- ${x}`):["- none"]),"","## Warnings","",...(warnings.length?warnings.map(x=>`- ${x}`):["- none"]),""].join("\n"));
console.log(JSON.stringify({ok:!errors.length,errors,warnings},null,2));if(errors.length)process.exit(1);
