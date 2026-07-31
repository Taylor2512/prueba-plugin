import fs from 'node:fs';

const methods = JSON.parse(fs.readFileSync('.ai/traceability/method-registry.json','utf8'));
const traces = JSON.parse(fs.readFileSync('.ai/traceability/trace-candidates.json','utf8'));
const ids = new Set(methods.map(x => x.id));
let failed = false;
for (const row of traces) {
  if (!ids.has(row.methodId)) {
    console.error(`unknown method: ${row.methodId}`);
    failed = true;
  }
}
console.log(`methods=${methods.length} traces=${traces.length}`);
process.exit(failed ? 1 : 0);
