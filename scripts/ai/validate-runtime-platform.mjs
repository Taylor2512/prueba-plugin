#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(process.argv[2]||process.cwd());
const req=[
 '.ai/brain/HOME.md',
 '.ai/brain/00-product/PRODUCT-IDENTITY.md',
 '.ai/scrum/views/RUNTIME-PLATFORM.md',
 '.ai/scrum/task-cards/runtime-platform/RTP-000.md',
 '.ai/prompts/RTP-START.md',
 '.ai/index/runtime-platform/code-files.jsonl',
 '.ai/research/RUNTIME-PDF-OFFICIAL-SOURCES.md'
];
const missing=req.filter(p=>!fs.existsSync(path.join(root,p)));
if(missing.length){console.error('Missing:\n'+missing.join('\n'));process.exit(1)}
const cards=fs.readdirSync(path.join(root,'.ai/scrum/task-cards/runtime-platform')).filter(n=>/^RTP-\d{3}\.md$/.test(n));
// runtime-execution:dynamic-cards
const minimumCards=['RTP-000.md','RTP-340.md','RTP-345.md','RTP-420.md'];
const missingCards=minimumCards.filter(n=>!cards.includes(n));
if(missingCards.length){console.error('Missing required RTP cards:\n'+missingCards.join('\n'));process.exit(2)}
const ready=cards.filter(n=>fs.readFileSync(path.join(root,'.ai/scrum/task-cards/runtime-platform',n),'utf8').includes('status: READY'));
if(ready.length>1){console.error('At most one RTP card may be READY: '+ready.join(', '));process.exit(3)}
console.log(`Runtime Platform OK: ${cards.length} task cards; ready=${ready[0]}`);
