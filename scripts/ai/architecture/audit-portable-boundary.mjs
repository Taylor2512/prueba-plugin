#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.argv[2] || ".");
const forbidden = [
  /DigitalAgreements/gi,
  /Digital Agreements/gi,
  /SISAD-WEB/gi,
];

const ignored = new Set(["node_modules",".git","dist","coverage","test-results","playwright-report"]);
const canonicalRoots = [".ai/brain",".ai/routes",".ai/knowledge",".ai/scrum/task-cards/portable-runtime",".agents/skills","docs"];

function walk(dir, out=[]) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir,{withFileTypes:true})) {
    if (ignored.has(ent.name)) continue;
    const p=path.join(dir,ent.name);
    if (ent.isDirectory()) walk(p,out);
    else out.push(p);
  }
  return out;
}
const hits=[];
for (const relRoot of canonicalRoots) {
  const abs=path.join(root,relRoot);
  for (const file of walk(abs)) {
    if (!/\.(md|mdx)$/i.test(file)) continue;
    const text=fs.readFileSync(file,"utf8");
    let count=0;
    for (const re of forbidden) { re.lastIndex=0; const m=text.match(re); if (m) count+=m.length; }
    if (count) hits.push({path:path.relative(root,file).split(path.sep).join("/"),count});
  }
}

const sourceTokens = [
  {label:"consumer-product-token-A", re:/DigitalAgreements/gi},
  {label:"consumer-product-token-B", re:/SISAD-WEB/gi},
];
const sourceHits=[];
for (const base of ["src","scripts","tools"]) {
  for (const file of walk(path.join(root,base))) {
    if (!/\.(ts|tsx|js|jsx|mjs|cjs|json|md)$/i.test(file)) continue;
    const text=fs.readFileSync(file,"utf8");
    let count=0;
    for (const t of sourceTokens) { t.re.lastIndex=0; const m=text.match(t.re); if (m) count+=m.length; }
    if (count) sourceHits.push({path:path.relative(root,file).split(path.sep).join("/"),count});
  }
}

console.log(JSON.stringify({
  canonicalMarkdownViolations: hits,
  residualSourceCoupling: sourceHits,
  note: "Residual source coupling is implementation debt; do not auto-rename product code from this audit."
}, null, 2));

process.exit(hits.length ? 2 : 0);
