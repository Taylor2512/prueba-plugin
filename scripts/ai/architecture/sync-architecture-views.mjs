#!/usr/bin/env node
import fs from "node:fs";import path from "node:path";
const root=path.resolve(process.argv[2]||".");const audit=JSON.parse(fs.readFileSync(path.join(root,"reports/architecture/task-status-audit.json"),"utf8"));const rows=audit.rows||[],view=path.join(root,".ai/scrum/views");fs.mkdirSync(view,{recursive:true});
function doc(title,desc,filter){const r=rows.filter(filter).sort((a,b)=>a.id.localeCompare(b.id,undefined,{numeric:true}));return[`# ${title}`,"",desc,"",...(r.length?r.map(x=>`- [${x.id}](../${x.path.replace(/^\.ai\/scrum\//,"")}) — \`${x.effectiveStatus}\``):["- none"]),"","> Generated. Authority: task card + evidence + dependency DAG.",""].join("\n")}
fs.writeFileSync(path.join(view,"ACTIVE.md"),doc("Active","Work in progress/review.",x=>["IN_PROGRESS","REVIEW","READY"].includes(x.effectiveStatus)));
fs.writeFileSync(path.join(view,"BLOCKED.md"),doc("Blocked / Partial","Blocked or dependency-incomplete work.",x=>["BLOCKED","PARTIAL"].includes(x.effectiveStatus)));
fs.writeFileSync(path.join(view,"COMPLETED.md"),doc("Completed","Effective PASS tasks.",x=>x.effectiveStatus==="PASS"));
const rtp=rows.filter(x=>/^RTP-\d+$/.test(x.id)).sort((a,b)=>Number(a.id.split("-")[1])-Number(b.id.split("-")[1]));
fs.writeFileSync(path.join(view,"RUNTIME-PLATFORM.md"),["# Runtime Platform state","","| Task | Effective | Open dependencies |","|---|---|---|",...rtp.map(x=>`| [${x.id}](../${x.path.replace(/^\.ai\/scrum\//,"")}) | **${x.effectiveStatus}** | ${(x.openDependencies||[]).join(", ")||"-"} |`),"","> Generated from evidence-aware reconciliation.",""].join("\n"));
// El bloque `effective-runtime-state` apuntaba al ledger de `.ai/scrum/`, que ya
// está archivado. Reapuntarlo a la vista generada lo dejó inyectando dentro del
// propio fichero que la línea anterior acaba de escribir, con un enlace
// `./views/RUNTIME-PLATFORM.md` que desde `views/` no resuelve. Retirado: la
// vista canónica la genera esta misma ejecución y no necesita anunciarse a sí misma.
console.log(JSON.stringify({rows:rows.length,runtime:rtp.length},null,2));
