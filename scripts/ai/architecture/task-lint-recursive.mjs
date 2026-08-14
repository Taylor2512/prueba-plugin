#!/usr/bin/env node
import fs from "node:fs";import path from "node:path";
const root=path.resolve(process.argv[2]||"."),dir=path.join(root,".ai/scrum/task-cards"),errors=[],warnings=[],ids=new Map();
function walk(d,out=[]){if(!fs.existsSync(d))return out;for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name);e.isDirectory()?walk(p,out):e.isFile()&&e.name.endsWith(".md")&&e.name.toLowerCase()!=="readme.md"&&out.push(p)}return out}
for(const f of walk(dir)){const r=path.relative(root,f).split(path.sep).join("/"),t=fs.readFileSync(f,"utf8"),id=t.match(/^id:\s*["']?([^"'\n]+)["']?\s*$/m)?.[1]||path.basename(f,".md"),st=t.match(/^(?:status|state):\s*["']?([^"'\n]+)["']?\s*$/m)?.[1];if(!id)errors.push(`${r}: missing id`);else if(ids.has(id))errors.push(`${r}: duplicate ${id} (${ids.get(id)})`);else ids.set(id,r);if(!st)warnings.push(`${r}: missing status/state`)}
console.log(JSON.stringify({scanned:ids.size,errors,warnings},null,2));if(errors.length)process.exit(1);
