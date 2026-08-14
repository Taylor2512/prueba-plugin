#!/usr/bin/env node
import fs from "node:fs";import path from "node:path";
const root=path.resolve(process.argv[2]||".");
function walk(d,out=[]){if(!fs.existsSync(d))return out;for(const e of fs.readdirSync(d,{withFileTypes:true})){if(["node_modules",".git","dist","coverage","test-results","playwright-report"].includes(e.name))continue;const p=path.join(d,e.name);e.isDirectory()?walk(p,out):out.push(p)}return out}
const rel=p=>path.relative(root,p).split(path.sep).join("/");
const md=walk(root).filter(p=>/\.mdx?$/i.test(p));
const taskRoot=path.join(root,".ai/scrum/task-cards");
const tasks=walk(taskRoot).filter(p=>p.endsWith(".md")&&path.basename(p).toLowerCase()!=="readme.md");
const rootTasks=tasks.filter(p=>path.dirname(p)===taskRoot);
const dirs=new Map();
for(const p of md){const d=path.dirname(p);if(!dirs.has(d))dirs.set(d,[]);dirs.get(d).push(p)}
const missing=[...dirs].filter(([d,rows])=>d!==root&&!fs.existsSync(path.join(d,"README.md"))).map(([d,rows])=>({dir:rel(d),count:rows.length}));
const high=missing.filter(x=>x.count>=3).sort((a,b)=>b.count-a.count);
const nums=new Map();const numbering=[];
for(const p of md){const m=path.basename(p).match(/^(\d+)-/);if(!m)continue;const k=`${rel(path.dirname(p))}|${m[1]}`;if(!nums.has(k))nums.set(k,[]);nums.get(k).push(rel(p))}
for(const [k,rows]of nums)if(rows.length>1)numbering.push({key:k,paths:rows});
const skills=walk(path.join(root,".agents/skills")).filter(p=>p.endsWith("/SKILL.md")||p.endsWith("\\SKILL.md"));
const exact=[];
for(const a of skills){const name=path.basename(path.dirname(a));const c=path.join(root,".claude/skills",name,"SKILL.md");if(fs.existsSync(c)&&fs.readFileSync(a).equals(fs.readFileSync(c)))exact.push(name)}
const transient=fs.existsSync(path.join(root,".trace-tmp"))?walk(path.join(root,".trace-tmp")).map(rel):[];
const result={markdown:md.length,tasks:tasks.length,rootTasks:rootTasks.length,missingReadmes:missing.length,highFanoutMissingReadmes:high.length,duplicateNumbering:numbering,exactProviderSkillCopies:exact,transient};
fs.mkdirSync(path.join(root,"reports/architecture"),{recursive:true});
fs.writeFileSync(path.join(root,"reports/architecture","MARKDOWN-AUDIT.json"),JSON.stringify(result,null,2)+"\n");
fs.writeFileSync(path.join(root,"reports/architecture","MARKDOWN-AUDIT.md"),["# Markdown architecture audit","",`- Markdown: ${result.markdown}`,`- Task cards: ${result.tasks}`,`- Root task cards: ${result.rootTasks}`,`- Missing README dirs: ${result.missingReadmes}`,`- High-fanout missing README: ${result.highFanoutMissingReadmes}`,`- Exact provider skill copies: ${result.exactProviderSkillCopies.length}`,`- .trace-tmp files: ${result.transient.length}`,"","## Duplicate numbering","",...(numbering.length?numbering.map(x=>`- ${x.key}: ${x.paths.join(", ")}`):["- none"]),"","## High fan-out without README","",...high.slice(0,100).map(x=>`- ${x.dir}: ${x.count}`),""].join("\n"));
console.log(JSON.stringify(result,null,2));
