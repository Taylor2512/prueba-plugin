import fs from 'node:fs';

const file = process.argv[2];
if (!file) throw new Error('usage: node distill-log.mjs <log>');
const lines = fs.readFileSync(file,'utf8').split(/\r?\n/);
const signals = lines.filter(line => /error|fail|exception|warning/i.test(line)).slice(0,25);
console.log(JSON.stringify({file,lineCount:lines.length,signals,lastLines:lines.slice(-12)},null,2));
