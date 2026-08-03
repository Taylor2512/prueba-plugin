import fs from 'node:fs';
import path from 'node:path';

const id = process.argv[2];
if (!id) throw new Error('usage: node materialize-task.mjs <task-id>');
const rows = fs.readFileSync('.ai/scrum/backlog-v8.jsonl','utf8').split(/\r?\n/).filter(Boolean).map(JSON.parse);
const task = rows.find(x => x.id === id);
if (!task) throw new Error(`task not found: ${id}`);
const target = `.ai/scrum/task-cards/ready/${id}-${task.title.toLowerCase().replace(/[^a-z0-9]+/g,'-')}.md`;
if (fs.existsSync(target)) throw new Error(`already exists: ${target}`);
const body = `# ${task.id} — ${task.title}\n\n- state: Ready\n- route: ${task.route}\n- skills: ${(task.skills ?? []).join(', ')}\n- maxFiles: ${task.maxFiles}\n- maxTokens: ${task.maxTokens}\n\n## Objective\n\nMaterialized from backlog. Complete evidence, allowed paths, invariants, tests, acceptance, gates, stop and rollback before claim.\n`;
fs.writeFileSync(target,body);
console.log(target);
