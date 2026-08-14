#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(process.argv[2]||'.');
const base=path.join(root,'src','sisad-pdfme');
const exts=new Set(['.ts','.tsx','.js','.jsx']);
const rows=[];
function walk(d){if(!fs.existsSync(d))return;for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name);if(e.isDirectory())walk(p);else if(exts.has(path.extname(p))){const t=fs.readFileSync(p,'utf8');const recipient=(t.match(/\b(?:Recipient|recipient|recipients)\b/g)||[]).length;const user=(t.match(/\b(?:User|user|users)\b/g)||[]).length;if(recipient||user)rows.push({file:path.relative(root,p).split(path.sep).join('/'),recipient,user});}}}
walk(base);rows.sort((a,b)=>b.recipient-a.recipient);
console.log(JSON.stringify({root,files:rows.length,topRecipientCentric:rows.slice(0,40)},null,2));
