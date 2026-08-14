#!/usr/bin/env node
import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';
const root=path.resolve(process.argv[2]||'.');const apply=process.argv.includes('--apply');
const manifestPath=path.join(root,'.ai/migrations/sisad-pdfme-digital-agreements-runtime/brain-target-manifest.json');
if(!fs.existsSync(manifestPath)){console.error('Missing manifest '+manifestPath);process.exit(2)}
const m=JSON.parse(fs.readFileSync(manifestPath,'utf8'));const backupRoot=path.resolve(path.dirname(root),path.basename(root)+'.brain-runtime-backup-'+new Date().toISOString().replace(/[:.]/g,'-'));
const sha=p=>crypto.createHash('sha1').update(fs.readFileSync(p)).digest('hex');const actions=[];
for(const item of m.targets){const target=path.join(root,item.target);const source=path.join(root,item.source);if(!fs.existsSync(source)){actions.push({status:'MISSING_SOURCE',target:item.target});continue}if(!fs.existsSync(target)){actions.push({status:'MISSING_TARGET',target:item.target});continue}const actual=sha(target);if(!actual.startsWith(item.expectedSha1Prefix)){actions.push({status:'CONFLICT_HASH',target:item.target,expected:item.expectedSha1Prefix,actual});continue}const next=sha(source);if(actual===next){actions.push({status:'IDENTICAL',target:item.target});continue}actions.push({status:apply?'UPDATED':'WOULD_UPDATE',target:item.target,actual,next});if(apply){const backup=path.join(backupRoot,item.target);fs.mkdirSync(path.dirname(backup),{recursive:true});fs.copyFileSync(target,backup);fs.copyFileSync(source,target)}}
console.log(JSON.stringify({mode:apply?'APPLY':'DRY_RUN',backup:apply?backupRoot:null,actions},null,2));if(actions.some(a=>a.status==='CONFLICT_HASH'||a.status==='MISSING_SOURCE'))process.exitCode=2;
