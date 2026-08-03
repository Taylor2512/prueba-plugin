import fs from 'node:fs';

let failed = false;
for (const file of fs.readdirSync('.ai/catalogs').filter(x => x.endsWith('.jsonl'))) {
  const lines = fs.readFileSync(`.ai/catalogs/${file}`,'utf8').split(/\r?\n/).filter(Boolean);
  lines.forEach((line,index) => {
    try { JSON.parse(line); }
    catch (error) { console.error(`${file}:${index+1} ${error.message}`); failed = true; }
  });
}
process.exit(failed ? 1 : 0);
