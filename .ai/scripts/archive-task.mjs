import fs from 'node:fs';
import path from 'node:path';

const file = process.argv[2];
if (!file || !fs.existsSync(file)) throw new Error('usage: node archive-task.mjs <task-card>');
const text = fs.readFileSync(file,'utf8');
const id = text.match(/^#\s+([A-Z0-9-]+)/m)?.[1] ?? path.basename(file);
const row = {id, archivedAt:new Date().toISOString(), source:file, sha256:await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text)).then(b=>Buffer.from(b).toString('hex'))};
fs.mkdirSync('.ai/scrum/archive',{recursive:true});
fs.appendFileSync('.ai/scrum/archive/index.jsonl',JSON.stringify(row)+'\n');
console.log(JSON.stringify(row,null,2));
