#!/usr/bin/env node
import fs from 'node:fs'; import path from 'node:path';
const args=process.argv.slice(2), root=path.resolve(args.find(x=>!x.startsWith('--'))||'.'), apply=args.includes('--apply');
const src=path.join(root,'src/sisad-pdfme'), tests=path.join(root,'tests/unit/sisad-pdfme-comprehensive/files'), helper=path.join(root,'tests/unit/sisad-pdfme-comprehensive/helpers/sourceContract.ts');
const exts=['.ts','.tsx','.js','.jsx'], walk=d=>fs.existsSync(d)?fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>{const p=path.join(d,e.name);return e.isDirectory()?walk(p):[p]}):[], posix=x=>x.split(path.sep).join('/');
if(!fs.existsSync(src)||!fs.existsSync(helper)){console.error('Missing src/sisad-pdfme or sourceContract helper');process.exit(2)}
const sources=walk(src).filter(f=>exts.some(e=>f.endsWith(e))).sort();
const render=(source,target)=>{const s=`src/sisad-pdfme/${posix(path.relative(src,source))}`;let h=posix(path.relative(path.dirname(target),helper)).replace(/\.ts$/,'');if(!h.startsWith('.'))h='./'+h;return `// @generated — source-contract test for ${s}
import { describe, expect, it } from 'vitest';
import { statSync } from 'node:fs';
import { absoluteSource, readSource, syntaxDiagnostics, unresolvedRelativeImports } from ${JSON.stringify(h)};
const SOURCE=${JSON.stringify(s)};
describe(${JSON.stringify(s)},()=>{it('exists and is non-empty',()=>{expect(statSync(absoluteSource(SOURCE)).isFile()).toBe(true);expect(readSource(SOURCE).trim().length).toBeGreaterThan(0)});it('contains no unresolved merge-conflict markers',()=>expect(readSource(SOURCE)).not.toMatch(/^(?:<<<<<<<|=======|>>>>>>>)/m));it('parses without syntax diagnostics',()=>expect(syntaxDiagnostics(SOURCE)).toEqual([]));it('resolves every relative import/export target',()=>expect(unresolvedRelativeImports(SOURCE)).toEqual([]));});
`;};
const expected=new Map(sources.map(s=>[path.join(tests,`${path.relative(src,s)}.file.test.ts`),s])), changes=[];
for(const [target,source] of expected){const next=render(source,target),current=fs.existsSync(target)?fs.readFileSync(target,'utf8'):null;if(current!==next){changes.push({action:current===null?'create':'update',target:posix(path.relative(root,target))});if(apply){fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,next)}}}
for(const stale of walk(tests).filter(f=>f.endsWith('.file.test.ts'))){if(!expected.has(stale)){changes.push({action:'remove-stale',target:posix(path.relative(root,stale))});if(apply)fs.rmSync(stale,{force:true})}}
console.log(JSON.stringify({mode:apply?'APPLY':'DRY-RUN',sourceFiles:sources.length,changes},null,2));
