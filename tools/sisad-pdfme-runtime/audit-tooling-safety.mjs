#!/usr/bin/env node
import fs from 'node:fs';import path from 'node:path';
const root=path.resolve(process.argv[2]||'.');
const read=r=>{const p=path.join(root,r);return fs.existsSync(p)?fs.readFileSync(p,'utf8'):''};
const importer=read('scripts/tooling/importer.mjs');
const installer=read('scripts/install-project-tools.mjs');
const tests=read('scripts/install-tests.mjs');
const findings=[];
if(/function\s+copyIncoming[\s\S]*?ensureDir\(path\.dirname\(targetFile\)\);\s*copyIncoming\(/m.test(importer)) findings.push({severity:'P0',id:'IMPORTER_SELF_RECURSION',path:'scripts/tooling/importer.mjs'});
if(installer.includes('exists ? "replace" : "create"')&&installer.includes('fs.copyFileSync(source, target)')) findings.push({severity:'P0',id:'INSTALLER_BLIND_REPLACE',path:'scripts/install-project-tools.mjs'});
if(installer.includes('Object.assign(next.scripts, config.packageScripts)')) findings.push({severity:'P1',id:'PACKAGE_SCRIPT_OVERWRITE',path:'scripts/install-project-tools.mjs'});
if(tests.includes('process.exitCode = 2')&&tests.includes('continue;')&&tests.includes('fs.copyFileSync')) findings.push({severity:'P1',id:'TEST_INSTALL_PARTIAL_APPLY',path:'scripts/install-tests.mjs'});
console.log(JSON.stringify({root,findings},null,2));if(findings.some(x=>x.severity==='P0'))process.exitCode=1;
