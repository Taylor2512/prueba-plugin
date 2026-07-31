// Baseline implementation. Replace heuristic only after AIARCH-010 review.
import fs from 'node:fs';
import path from 'node:path';

function walk(dir, out=[]) {
  for (const entry of fs.readdirSync(dir,{withFileTypes:true})) {
    const p = path.join(dir,entry.name);
    if (entry.isDirectory()) walk(p,out);
    else if (/\.(ts|tsx)$/.test(entry.name)) out.push(p);
  }
  return out;
}
const files = walk('src/sisad-pdfme');
const rows = [];
const regex = /^(?:export\s+)?(?:async\s+)?(?:function|class|const|type|interface|enum)\s+([A-Za-z_$][\w$]*)/gm;
for (const file of files) {
  const text = fs.readFileSync(file,'utf8');
  let m;
  while ((m = regex.exec(text))) {
    rows.push({path:file,name:m[1],line:text.slice(0,m.index).split('\n').length,status:'candidate'});
  }
}
fs.writeFileSync('.ai/traceability/method-registry.generated.json', JSON.stringify(rows,null,2));
console.log(`generated ${rows.length} symbols`);
