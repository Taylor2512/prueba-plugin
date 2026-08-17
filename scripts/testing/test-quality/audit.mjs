#!/usr/bin/env node
import fs from 'node:fs'; import path from 'node:path';
import {ensureDir,isBrowserSpec,isTestFile,parseArgs,readJson,relative,testTitles,walk,writeJson} from './core.mjs';
const {root,strict}=parseArgs();
const config=readJson(path.join(root,'config/tooling/test-quality.config.json'),{})??{}; const reportRoot=path.join(root,config.reportRoot??'reports/testing'); ensureDir(reportRoot);
const files=walk(path.join(root,config.testRoot??'tests')).filter(isTestFile), findings=[], titlesByName=new Map();
const add=(severity,code,p,detail)=>findings.push({severity,code,path:p,detail});
for(const file of files){
 const rel=relative(root,file), text=fs.readFileSync(file,'utf8'), titles=testTitles(text);
 for(const title of titles){const n=title.toLowerCase().trim(); if(!titlesByName.has(n))titlesByName.set(n,[]); titlesByName.get(n).push(rel); if(/^(test|test\s*\d+|stable test|spec|smoke)$/i.test(n))add('HIGH','generic-test-title',rel,title);}
 const skips=(text.match(/\b(?:test|it|describe)\.skip\s*\(/g)??[]).length, fixme=(text.match(/\btest\.fixme\s*\(/g)??[]).length, todo=(text.match(/\b(?:test|it)\.todo\s*\(/g)??[]).length;
 if(skips)add('HIGH','skipped-tests',rel,`${skips} skip marker(s)`); if(fixme)add('HIGH','fixme-tests',rel,`${fixme} fixme marker(s)`); if(todo)add('MEDIUM','todo-tests',rel,`${todo} todo marker(s)`);
 if(titles.length&&!/\bexpect\s*\(/.test(text))add('HIGH','test-file-without-expect',rel,`${titles.length} logical test(s), no expect()`);
 if(/\bwaitForTimeout\s*\(/.test(text))add('MEDIUM','fixed-wait',rel,'waitForTimeout detected');
 if(isBrowserSpec(file)){
   if(/\b(?:innerText|textContent|innerHTML|value)\s*=(?!=)/.test(text)&&/\b(?:evaluate|evaluateAll)\s*\(/.test(text))add('CRITICAL','direct-dom-mutation-browser',rel,'DOM value mutated inside evaluate()');
   if(/\bpage\.keyboard\.(?:type|insertText|press)\s*\(/.test(text))add('MEDIUM','global-page-keyboard',rel,'Prefer locator-scoped input when target identity matters');
   if(/:\s*any\b|as\s+any\b/.test(text))add('LOW','explicit-any-browser-test',rel,'Explicit any in browser spec');
 }
 if(titles.length>15){const kws=['number','multi-user','multiuser','document','pairwise','runtime','schema','ownership','viewer']; const dc=kws.filter(k=>text.toLowerCase().includes(k)).length; if(dc>=4)add('MEDIUM','multi-domain-large-spec',rel,`${titles.length} tests span ${dc} domain keywords`);}
}
for(const [title,paths] of titlesByName){const u=[...new Set(paths)]; if(title&&u.length>1)add('LOW','duplicate-test-title',u.join(', '),title);}
const number=path.join(root,'tests/number-input.spec.ts'); if(fs.existsSync(number)){const t=fs.readFileSync(number,'utf8'); if(/removeAllRanges/.test(t)&&/page\.keyboard\.type/.test(t))add('CRITICAL','number-input-old-harness','tests/number-input.spec.ts','clear()+global keyboard can lose caret in Firefox/WebKit');}
if(fs.existsSync(path.join(root,'playwright.config.js'))&&fs.existsSync(path.join(root,'playwright.config.ts')))add('CRITICAL','duplicate-playwright-config','playwright.config.js','JS and TS configs coexist');
const pw=path.join(root,'playwright.config.ts'); if(fs.existsSync(pw)){const t=fs.readFileSync(pw,'utf8'); if(/\['json'\]/.test(t)&&!/outputFile/.test(t))add('CRITICAL','raw-json-reporter-stdout','playwright.config.ts','JSON reporter has no outputFile');}
const count=path.join(root,'scripts/testing/count-sisad-pdfme-tests.mjs'); if(fs.existsSync(count)){const t=fs.readFileSync(count,'utf8'); if(/minimum\s*:\s*1000|cases\s*>=\s*1000/.test(t))add('CRITICAL','raw-test-count-gate','scripts/testing/count-sisad-pdfme-tests.mjs','Raw >=1000 count used as gate');}
const order={CRITICAL:0,HIGH:1,MEDIUM:2,LOW:3}; findings.sort((a,b)=>order[a.severity]-order[b.severity]||a.path.localeCompare(b.path)); const summary={}; for(const f of findings)summary[f.severity]=(summary[f.severity]??0)+1;
const result={testFiles:files.length,findings:findings.length,summary,items:findings}; writeJson(path.join(reportRoot,'test-audit.json'),result);
const rows=findings.length?findings.map(f=>`| ${f.severity} | ${f.code} | \`${f.path}\` | ${String(f.detail).replace(/\|/g,'\\|')} |`).join('\n'):'| — | — | — | Sin hallazgos |';
fs.writeFileSync(path.join(reportRoot,'TEST-AUDIT.md'),`# Test Audit\n\n- Test files: ${files.length}\n- Findings: ${findings.length}\n- Critical: ${summary.CRITICAL??0}\n- High: ${summary.HIGH??0}\n- Medium: ${summary.MEDIUM??0}\n- Low: ${summary.LOW??0}\n\n| Severity | Code | Path | Detail |\n|---|---|---|---|\n${rows}\n`,'utf8');
console.log(JSON.stringify(result,null,2)); if((summary.CRITICAL??0)||(strict&&(summary.HIGH??0)))process.exitCode=1;
