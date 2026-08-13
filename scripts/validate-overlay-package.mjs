import fs from 'node:fs';import path from 'node:path';import {walkMarkdown,rel,hasDocumentRevisionToken} from './lib-documentation.mjs';
const dir=path.resolve(process.argv[2]||'.');const errors=[];const payload=path.join(dir,'payload');
if(fs.existsSync(path.join(payload,'README.md')))errors.push('payload/README.md is forbidden');
if(fs.existsSync(payload)){for(const name of ['APPLY-INSTRUCTIONS.md','MANIFEST.md','AUDIT.md','MIGRATION.md'])if(fs.existsSync(path.join(payload,name)))errors.push(`payload/${name} is package metadata and must stay outside payload`);for(const p of walkMarkdown(payload,{includeResidue:true})){const rp=rel(payload,p);if(hasDocumentRevisionToken(rp))errors.push(`versioned Markdown path inside payload: ${rp}`);}}
for(const d of ['reference-snapshot','current-index'])if(fs.existsSync(path.join(dir,d)))errors.push(`${d}/ must not ship inside an apply package`);
if(errors.length){console.error('FAIL\n'+errors.map(x=>'- '+x).join('\n'));process.exit(1);}console.log('PASS: package is additive, version-free and cannot overwrite repository root README.');
