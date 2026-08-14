#!/usr/bin/env node
import fs from "node:fs";import path from "node:path";
const args=process.argv.slice(2),root=path.resolve(args.find(x=>!x.startsWith("--"))||"."),apply=args.includes("--apply");
const policy=JSON.parse(fs.readFileSync(path.join(root,"config/tooling/markdown-architecture-policy.json"),"utf8"));
const S="<!-- sisad-architecture-hub:start -->",E="<!-- sisad-architecture-hub:end -->",toPosix=p=>p.split(path.sep).join("/");
function title(t,f){return t.match(/^#\s+(.+)$/m)?.[1]?.trim()||f}
function status(t){return t.match(/^(?:status|state):\s*["']?([^"'\n]+)["']?\s*$/m)?.[1]||""}
function upsert(t,b){const block=`${S}\n${b.trim()}\n${E}`,a=t.indexOf(S),e=t.indexOf(E);return a>=0&&e>=a?t.slice(0,a)+block+t.slice(e+E.length):`${t.trimEnd()}${t.trim()?"\n\n":""}${block}\n`}
function excluded(rel){return(policy.autoHubExcludePrefixes||[]).some(x=>rel===x||rel.startsWith(`${x}/`))}
const dirs=new Set(policy.hubs||[]);
function scan(d){
 if(!fs.existsSync(d)||!fs.statSync(d).isDirectory())return;
 const rel=toPosix(path.relative(root,d));
 if(excluded(rel))return;
 const es=fs.readdirSync(d,{withFileTypes:true}),md=es.filter(e=>e.isFile()&&/\.md$/i.test(e.name)&&e.name.toLowerCase()!=="readme.md");
 if(md.length>=3)dirs.add(rel);
 for(const e of es)if(e.isDirectory()&&!["node_modules",".git","dist","coverage","test-results","playwright-report"].includes(e.name))scan(path.join(d,e.name));
}
for(const r of policy.autoHubRoots||[])scan(path.join(root,r));
const changes=[];
for(const rd of [...dirs].filter(Boolean).sort()){const d=path.join(root,rd);if(!fs.existsSync(d)||!fs.statSync(d).isDirectory()||excluded(rd))continue;const es=fs.readdirSync(d,{withFileTypes:true}),files=es.filter(e=>e.isFile()&&/\.md$/i.test(e.name)&&e.name.toLowerCase()!=="readme.md"),sub=es.filter(e=>e.isDirectory()&&!e.name.startsWith(".")&&!excluded(toPosix(path.relative(root,path.join(d,e.name)))));if(!files.length&&!sub.length)continue;const lines=["## Navigation",""];for(const e of sub.sort((a,b)=>a.name.localeCompare(b.name))){const r=path.join(d,e.name,"README.md");lines.push(fs.existsSync(r)?`- [${e.name}](./${e.name}/README.md)`:`- \`${e.name}/\``)}for(const e of files.sort((a,b)=>a.name.localeCompare(b.name))){const t=fs.readFileSync(path.join(d,e.name),"utf8"),st=status(t);lines.push(`- [${title(t,e.name.replace(/\.md$/,""))}](./${e.name})${st?` — \`${st}\``:""}`)}lines.push("","> Managed index. Update source documents, not this list.");const r=path.join(d,"README.md"),cur=fs.existsSync(r)?fs.readFileSync(r,"utf8"):`# ${path.basename(d)}\n`,next=upsert(cur,lines.join("\n"));if(next!==cur){changes.push(toPosix(path.relative(root,r)));if(apply){fs.mkdirSync(path.dirname(r),{recursive:true});fs.writeFileSync(r,next,"utf8")}}}
console.log(JSON.stringify({planned:changes.length,applied:apply?changes.length:0,paths:changes},null,2));
