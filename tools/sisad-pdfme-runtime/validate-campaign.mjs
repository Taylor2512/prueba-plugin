#!/usr/bin/env node
import fs from 'node:fs';import path from 'node:path';
const root=path.resolve(process.argv[2]||'.');
const req=[
'.ai/analysis/sisad-pdfme-digital-agreements-runtime/00-EXECUTIVE.md',
'.ai/brain/20-contracts/USER-RECIPIENT-BOUNDARY.md',
'.ai/plans/PLAN_SISAD_PDFME_DIGITAL_AGREEMENTS_RUNTIME.md',
'.ai/prompts/PROMPT_SISAD_PDFME_DA_RUNTIME_BOOT.md',
'.ai/scrum/task-cards/runtime-platform/RTP-015.md',
'.ai/scrum/task-cards/runtime-platform/RTP-022.md',
'.ai/scrum/task-cards/tooling-architecture/TOOL-IMPORT-NONMARKDOWN.md',
'unificados/SISAD-PDFME-SOURCE-BASELINE.json'
];const missing=req.filter(r=>!fs.existsSync(path.join(root,r)));console.log(JSON.stringify({required:req.length,missing},null,2));if(missing.length)process.exit(1);
