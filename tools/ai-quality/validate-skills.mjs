import fs from "node:fs";
import process from "node:process";
import path from "node:path";
const root=".agents/skills";
let errors=0, count=0;
for(const name of fs.readdirSync(root)){
 const dir=path.join(root,name);
 if(!fs.statSync(dir).isDirectory()) continue;
 count++;
 const skill=path.join(dir,"SKILL.md");
 const evals=path.join(dir,"evals/cases.json");
 if(!fs.existsSync(skill)){console.error(`${name}: missing SKILL.md`);errors++;continue;}
 const text=fs.readFileSync(skill,"utf8");
 if(!/^---[\s\S]*name:\s*.+[\s\S]*description:\s*.+[\s\S]*---/.test(text)){
   console.error(`${name}: invalid frontmatter`);errors++;
 }
 if(!fs.existsSync(evals)){console.error(`${name}: missing evals`);errors++;continue;}
 const data=JSON.parse(fs.readFileSync(evals,"utf8"));
 if((data.should_trigger?.length||0)<2){console.error(`${name}: too few positive cases`);errors++;}
 if((data.should_not_trigger?.length||0)<1){console.error(`${name}: too few negative cases`);errors++;}
}
console.log(`${count} skills checked`);
if(errors)process.exit(1);
