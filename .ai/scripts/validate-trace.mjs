import fs from 'node:fs';

const methods = new Set(fs.readFileSync('.ai/catalogs/methods.jsonl','utf8').split(/\r?\n/).filter(Boolean).map(JSON.parse).map(x=>x.id));
const behaviors = new Set(fs.readFileSync('.ai/catalogs/behaviors.jsonl','utf8').split(/\r?\n/).filter(Boolean).map(JSON.parse).map(x=>x.id));
let failed = false;
for (const edge of fs.readFileSync('.ai/catalogs/trace-edges.jsonl','utf8').split(/\r?\n/).filter(Boolean).map(JSON.parse)) {
  if (!methods.has(edge.to) || !behaviors.has(edge.from)) { console.error(edge); failed = true; }
}
process.exit(failed ? 1 : 0);
