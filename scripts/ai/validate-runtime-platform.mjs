#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(process.argv[2]||process.cwd());
const req=[
 '.ai/brain/HOME.md',
 '.ai/brain/00-product/PRODUCT-IDENTITY.md',
 '.ai/plans/PLAN_MAESTRO_SISAD_PDFME_RUNTIME_PLATFORM.md',
 '.ai/scrum/RUNTIME-PLATFORM-LEDGER.md',
 '.ai/scrum/task-cards/runtime-platform/RTP-000.md',
 '.ai/prompts/RTP-START.md',
 '.ai/index/runtime-platform/code-files.jsonl',
 '.ai/research/RUNTIME-PDF-OFFICIAL-SOURCES.md'
];
const missing=req.filter(p=>!fs.existsSync(path.join(root,p)));
if(missing.length){console.error('Missing:\n'+missing.join('\n'));process.exit(1)}
const cards=fs.readdirSync(path.join(root,'.ai/scrum/task-cards/runtime-platform')).filter(n=>/^RTP-\d{3}\.md$/.test(n));
if(cards.length!==36){console.error(`Expected 36 cards, found ${cards.length}`);process.exit(2)}
const ready=cards.filter(n=>fs.readFileSync(path.join(root,'.ai/scrum/task-cards/runtime-platform',n),'utf8').includes('status: READY'));
if(ready.length!==1||ready[0]!=='RTP-000.md'){console.error('Only RTP-000 must start READY');process.exit(3)}
console.log(`Runtime Platform OK: ${cards.length} task cards; ready=${ready[0]}`);
