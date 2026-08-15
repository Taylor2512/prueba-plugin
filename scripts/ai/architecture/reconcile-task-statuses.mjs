#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const args=process.argv.slice(2),root=path.resolve(args.find(x=>!x.startsWith("--"))||"."),apply=args.includes("--apply");
const taskRoot=path.join(root,".ai/scrum/task-cards"),reportRoot=path.join(root,"reports/architecture");

function walk(d,out=[]){if(!fs.existsSync(d))return out;for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name);e.isDirectory()?walk(p,out):out.push(p)}return out}
const rel=p=>path.relative(root,p).split(path.sep).join("/");
function front(text){const m=text.match(/^---\s*\n([\s\S]*?)\n---/),fields={};if(m)for(const line of m[1].split(/\r?\n/)){const x=line.match(/^([A-Za-z0-9_.-]+):\s*(.*?)\s*$/);if(x)fields[x[1]]=x[2].replace(/^["']|["']$/g,"")}return{match:m,fields}}
function bodyLabel(text,label){return text.match(new RegExp(`^\\*\\*(?:${label})\\s*:\\*\\*\\s*(.+?)\\s*$`,"im"))?.[1]||text.match(new RegExp(`^(?:${label})\\s*:\\s*(.+?)\\s*$`,"im"))?.[1]}
function norm(v){const s=String(v||"").trim().toLowerCase().replace(/[_-]+/g," ");if(["pass","done","closed","completed","completo","completado"].includes(s))return"PASS";if(["blocked","bloqueado"].includes(s))return"BLOCKED";if(["partial","parcial"].includes(s))return"PARTIAL";if(["in progress","active","claimed","en progreso"].includes(s))return"IN_PROGRESS";if(["review","in review","revisión","revision"].includes(s))return"REVIEW";if(["ready","listo"].includes(s))return"READY";if(["archived","archivado"].includes(s))return"ARCHIVED";return"BACKLOG"}
function evidenceState(t){const m=t.match(/^\s*(?:status|estado)\s*:\s*([A-Za-z_-]+)\s*$/im);return m?norm(m[1]):null}
function parseDeps(fields,text){const raw=[fields.depends_on,fields.dependsOn,bodyLabel(text,"Dependencias|Dependencies")].filter(Boolean).join(" ");return[...raw.matchAll(/[A-Za-z]+-\d+/g)].map(m=>m[0].toUpperCase())}
/** Elimina el estado "de display" del cuerpo, nunca del frontmatter. */
function stripDisplayState(body){
 return body
   .replace(/^\*\*(?:Estado|State|Status)\s*:\*\*\s*.+?\s*$/gim,"")
   .replace(/^(?:Estado|State|Status)\s*:\s*.+?\s*$/gim,"");
}
function canonicalize(text,id,state){
 const x=front(text);
 if(x.match){
   // El barrido de estado de display se aplica SOLO al cuerpo. Aplicarlo al
   // texto completo borraba también la línea `status:` del frontmatter, con lo
   // que `body.replace(x.match[0], ...)` dejaba de encontrar el bloque original
   // y la card acababa SIN status — leyéndose luego como BACKLOG.
   const head=text.slice(0,x.match.index+x.match[0].length);
   const rest=stripDisplayState(text.slice(head.length));
   let block=x.match[1];
   if(/^status:/m.test(block))block=block.replace(/^status:\s*.*$/m,`status: ${state}`);else block+=`\nstatus: ${state}`;
   if(!/^id:/m.test(block))block=`id: ${id}\n${block}`;
   return `---\n${block}\n---${rest}`.replace(/\n{3,}/g,"\n\n");
 }
 return `---\nid: ${id}\nstatus: ${state}\n---\n\n${stripDisplayState(text).trimStart().replace(/\n{3,}/g,"\n\n")}`;
}

const byId=new Map();
for(const file of walk(taskRoot).filter(p=>p.endsWith(".md")&&path.basename(p).toLowerCase()!=="readme.md")){
 const text=fs.readFileSync(file,"utf8"),x=front(text),id=(x.fields.id||text.match(/^#\s+([A-Za-z0-9]+(?:-[A-Za-z0-9]+)+)/m)?.[1]||path.basename(file,".md"))?.toUpperCase();
 if(!id)continue;
 const rawState=x.fields.status||x.fields.state||bodyLabel(text,"Estado|State|Status");
 const row={id,file,text,fields:x.fields,card:norm(rawState),hasCanonicalStatus:!!x.fields.status,deps:parseDeps(x.fields,text)};
 if(!byId.has(id))byId.set(id,[]);byId.get(id).push(row);
}
const duplicateIds=[...byId].filter(([,rs])=>rs.length>1),tasks=new Map([...byId].map(([id,rs])=>[id,rs[0]])),evById=new Map();
for(const base of [path.join(root,"reports"),path.join(root,".ai/evidence")])for(const file of walk(base).filter(p=>p.endsWith(".md"))){const id=path.basename(file).match(/^([A-Za-z]+-\d+)(?:\.|-)/)?.[1]?.toUpperCase();if(!id)continue;const st=evidenceState(fs.readFileSync(file,"utf8"));if(!st)continue;if(!evById.has(id))evById.set(id,[]);evById.get(id).push({file,state:st})}
const direct=new Map(),conflicts=[];
for(const[id,row]of tasks){const ev=evById.get(id)||[],states=[...new Set(ev.map(x=>x.state))];if(states.length>1){conflicts.push({id,states,files:ev.map(x=>rel(x.file))});direct.set(id,"NEEDS_REVIEW")}else direct.set(id,states[0]||row.card)}
const effective=new Map(direct);
for(let g=0;g<30;g++){let ch=false;for(const[id,row]of tasks){let st=direct.get(id);if(st==="PASS"&&row.deps.some(d=>tasks.has(d)&&effective.get(d)!=="PASS"))st="PARTIAL";if(effective.get(id)!==st){effective.set(id,st);ch=true}}if(!ch)break}
const rows=[];
for(const[id,row]of[...tasks].sort((a,b)=>a[0].localeCompare(b[0],undefined,{numeric:true}))){const ev=evById.get(id)||[],eff=effective.get(id),open=row.deps.filter(d=>tasks.has(d)&&effective.get(d)!=="PASS"),drift=eff!=="NEEDS_REVIEW"&&row.card!==eff,normalizeNeeded=!row.hasCanonicalStatus;rows.push({id,path:rel(row.file),cardStatus:row.card,evidenceStatus:ev.length?[...new Set(ev.map(x=>x.state))].join("|"):"-",effectiveStatus:eff,dependencies:row.deps,openDependencies:open,drift,normalizeNeeded});if(apply&&eff!=="NEEDS_REVIEW"&&(drift||normalizeNeeded))fs.writeFileSync(row.file,canonicalize(row.text,id,eff),"utf8")}
fs.mkdirSync(reportRoot,{recursive:true});fs.writeFileSync(path.join(reportRoot,"task-status-audit.json"),JSON.stringify({rows,conflicts,duplicateIds:duplicateIds.map(([id,rs])=>({id,paths:rs.map(r=>rel(r.file))}))},null,2)+"\n");
const important=rows.filter(x=>x.drift||x.normalizeNeeded||["BLOCKED","PARTIAL","NEEDS_REVIEW"].includes(x.effectiveStatus));fs.writeFileSync(path.join(reportRoot,"TASK-STATUS-AUDIT.md"),["# Task status audit","",`Scanned: ${rows.length}`,`Status drift: ${rows.filter(x=>x.drift).length}`,`Normalization needed: ${rows.filter(x=>x.normalizeNeeded).length}`,`Duplicate IDs: ${duplicateIds.length}`,`Evidence conflicts: ${conflicts.length}`,"","| Task | Card | Evidence | Effective | Normalize | Open deps |","|---|---|---|---|---|---|",...important.map(x=>`| ${x.id} | ${x.cardStatus} | ${x.evidenceStatus} | **${x.effectiveStatus}** | ${x.normalizeNeeded?"yes":"-"} | ${x.openDependencies.join(", ")||"-"} |`),""].join("\n"),"utf8");
console.log(JSON.stringify({scanned:rows.length,drift:rows.filter(x=>x.drift).length,normalizationNeeded:rows.filter(x=>x.normalizeNeeded).length,applied:apply?rows.filter(x=>(x.drift||x.normalizeNeeded)&&x.effectiveStatus!=="NEEDS_REVIEW").length:0,duplicateIds:duplicateIds.length,evidenceConflicts:conflicts.length},null,2));if(duplicateIds.length||conflicts.length)process.exitCode=2;
