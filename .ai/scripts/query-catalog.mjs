import fs from 'node:fs';
import path from 'node:path';

const [catalog, ...args] = process.argv.slice(2);
if (!catalog) {
  console.error('usage: node query-catalog.mjs <catalog> [--id X] [--domain X] [--tag X] [--text X] [--limit N]');
  process.exit(2);
}
const opts = {};
for (let i = 0; i < args.length; i += 2) opts[args[i].replace(/^--/, '')] = args[i + 1];
const file = path.join('.ai', 'catalogs', `${catalog}.jsonl`);
if (!fs.existsSync(file)) throw new Error(`catalog not found: ${file}`);
const rows = fs.readFileSync(file, 'utf8').split(/\r?\n/).filter(Boolean).map(JSON.parse);
const text = (opts.text ?? '').toLowerCase();
const limit = Number(opts.limit ?? 30);
const result = rows.filter(row => {
  if (opts.id && row.id !== opts.id) return false;
  if (opts.domain && String(row.domain ?? '').toLowerCase() !== opts.domain.toLowerCase()) return false;
  if (opts.tag && !(row.tags ?? []).map(String).some(x => x.toLowerCase() === opts.tag.toLowerCase())) return false;
  if (text && !JSON.stringify(row).toLowerCase().includes(text)) return false;
  return true;
}).slice(0, limit);
console.log(JSON.stringify(result, null, 2));
