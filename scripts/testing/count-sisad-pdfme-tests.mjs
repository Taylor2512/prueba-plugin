#!/usr/bin/env node
import fs from 'node:fs'; import path from 'node:path';
const root=path.resolve(process.argv[2]||'.'), suite=path.join(root,'tests/unit/sisad-pdfme-comprehensive');
const walk=(d)=>fs.existsSync(d)?fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>{const p=path.join(d,e.name);return e.isDirectory()?walk(p):[p]}):[];
const files=walk(suite).filter(f=>/\.test\.[jt]sx?$/.test(f));
const cases=files.reduce((n,f)=>n+(fs.readFileSync(f,'utf8').match(/\bit\s*\(/g)||[]).length,0);
const out={testFiles:files.length,explicitItCases:cases,note:'Informational inventory only. Raw test count is not a release gate.'};
console.log(JSON.stringify(out,null,2));
