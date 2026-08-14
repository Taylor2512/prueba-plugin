#!/usr/bin/env node
import fs from 'node:fs';import path from 'node:path';
const root=path.resolve(process.argv[2]||'.');
const f=path.join(root,'src/sisad-pdfme/contracts/assignments.ts');
if(!fs.existsSync(f)){console.error('MISSING '+path.relative(root,f));process.exit(2)}
const t=fs.readFileSync(f,'utf8');
const exports=[...t.matchAll(/export\s+type\s+SchemaAssignments\b/g)].length;
const four=t.includes('assignments[userId][recipientId][fileId][pageNumber]');
const three=t.includes('assignments[recipientId][fileId][pageNumber]');
console.log(JSON.stringify({path:path.relative(root,f),schemaAssignmentsExports:exports,documentsFourDimensionalShape:four,documentsThreeDimensionalShape:three,status:exports===1?'PASS':'DRIFT'},null,2));
if(exports!==1) process.exitCode=1;
