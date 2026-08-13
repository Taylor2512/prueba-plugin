import fs from "node:fs";
import process from "node:process";
const f=process.argv[2];if(!f||!fs.existsSync(f)){console.error("task file required");process.exit(1);}
const t=fs.readFileSync(f,"utf8");
const paths=[...t.matchAll(/`([^`\n]+)`/g)].map(x=>x[1]).filter(x=>/[/.]/.test(x));
console.log(JSON.stringify({task:f,paths:[...new Set(paths)],count:new Set(paths).size},null,2));
