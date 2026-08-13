import fs from "node:fs";
import process from "node:process";
import path from "node:path";
const dir=".ai/scrum/task-cards";
const required=["# Objective","# Observable evidence","# Allowed paths","# Prohibited paths","# Invariants","# Gates","# Definition of Done"];
let errors=0;
for(const f of fs.readdirSync(dir).filter(x=>x.endsWith(".md")&&x!=="TEMPLATE.md")){
 const t=fs.readFileSync(path.join(dir,f),"utf8");
 for(const h of required) if(!t.includes(h)){console.error(`${f}: missing ${h}`);errors++;}
}
if(errors)process.exit(1);console.log("Task cards valid.");
