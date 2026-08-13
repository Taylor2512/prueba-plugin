import fs from "node:fs";
import process from "node:process";
const dir=".ai/subagents";
let errors=0,count=0;
for(const f of fs.readdirSync(dir).filter(x=>x.endsWith(".md")&&x!=="CATALOG.md")){
 count++;const t=fs.readFileSync(`${dir}/${f}`,"utf8");
 for(const h of ["## Mission","## Tools","## Use when","## Do not use when","## Output"]){
  if(!t.includes(h)){console.error(`${f}: missing ${h}`);errors++;}
 }
}
console.log(`${count} subagents checked`);
if(errors)process.exit(1);
