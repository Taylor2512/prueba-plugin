import fs from 'node:fs';

const file = process.argv[2];
if (!file) throw new Error('usage: node distill-log.mjs <log>');
const lines = fs.readFileSync(file,'utf8').split(/\r?\n/);
const failures = lines.filter(l => /error|fail|exception|warning/i.test(l)).slice(0,20);
console.log(JSON.stringify({
  file,
  lineCount: lines.length,
  firstLines: lines.slice(0,10),
  signals: failures,
  lastLines: lines.slice(-10)
}, null, 2));
