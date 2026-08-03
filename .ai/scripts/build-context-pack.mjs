import fs from 'node:fs';
import path from 'node:path';

const taskId = process.argv[2];
if (!taskId) throw new Error('usage: node build-context-pack.mjs <task-id>');
const backlog = fs.readFileSync('.ai/scrum/backlog-v8.jsonl','utf8').split(/\r?\n/).filter(Boolean).map(JSON.parse);
const task = backlog.find(x => x.id === taskId);
if (!task) throw new Error(`task not found: ${taskId}`);

function query(catalog, predicate, limit=12) {
  const file = `.ai/catalogs/${catalog}.jsonl`;
  return fs.readFileSync(file,'utf8').split(/\r?\n/).filter(Boolean).map(JSON.parse).filter(predicate).slice(0,limit);
}
const cases = query('use-cases', row => row.domain === task.route || JSON.stringify(row).includes(task.route));
const methods = query('methods', row => row.domain === task.route || JSON.stringify(row).includes(task.route));
const pack = [
  '# Context pack',
  '',
  `- task: ${task.id} — ${task.title}`,
  `- route: ${task.route}`,
  `- skills: ${(task.skills ?? []).join(', ')}`,
  `- maxFiles: ${task.maxFiles}`,
  `- maxTokens: ${task.maxTokens}`,
  '',
  '## Use cases',
  ...cases.map(x => `- ${x.id}: ${x.name}`),
  '',
  '## Candidate methods',
  ...methods.map(x => `- ${x.id}: ${x.path}:${x.line} ${x.name}`),
  '',
  '## Stop',
  'WIP/claim conflict, budget exhausted, product scope crossed or evidence insufficient.',
].join('\n');
const dir = `.ai/evidence/${task.id}`;
fs.mkdirSync(dir,{recursive:true});
fs.writeFileSync(path.join(dir,'context-pack.md'), pack);
console.log(path.join(dir,'context-pack.md'));
