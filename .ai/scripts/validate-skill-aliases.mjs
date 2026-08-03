import fs from 'node:fs';

const rows = fs.readFileSync('.ai/catalogs/skills.jsonl','utf8').split(/\r?\n/).filter(Boolean).map(JSON.parse);
const aliases = new Map();
let failed = false;
for (const row of rows) {
  for (const alias of row.aliases ?? []) {
    if (aliases.has(alias)) { console.error(`duplicate alias ${alias}`); failed = true; }
    aliases.set(alias,row.id);
  }
}
console.log(`canonical=${rows.length} aliases=${aliases.size}`);
process.exit(failed ? 1 : 0);
