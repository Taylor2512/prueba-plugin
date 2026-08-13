#!/usr/bin/env node
import fs from 'node:fs'; import path from 'node:path';
const root=path.resolve(process.argv[2]||'.'), src=path.join(root,'src/sisad-pdfme'), tests=path.join(root,'tests/unit/sisad-pdfme-comprehensive/files');
const exts=['.ts','.tsx','.js','.jsx'];
const walk=(d)=>fs.existsSync(d)?fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>{const p=path.join(d,e.name);return e.isDirectory()?walk(p):[p]}):[];
const sources=walk(src).filter(f=>exts.some(e=>f.endsWith(e)));
const expected=new Set(sources.map(f=>path.join(tests,`${path.relative(src,f)}.file.test.ts`)));
const actual=new Set(walk(tests).filter(f=>f.endsWith('.file.test.ts')));
const missing=[...expected].filter(x=>!actual.has(x)), stale=[...actual].filter(x=>!expected.has(x));
const rel=x=>path.relative(root,x).split(path.sep).join('/');
const out={sourceFiles:sources.length,dedicatedTests:actual.size,missing:missing.map(rel),stale:stale.map(rel),ok:!missing.length&&!stale.length};
console.log(JSON.stringify(out,null,2)); process.exitCode=out.ok?0:1;
