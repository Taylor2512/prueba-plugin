#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const [command = 'status', rootArg = '.'] = process.argv.slice(2);
const root = path.resolve(rootArg);
const queuePath = path.join(root, '.ai/knowledge/runtime-platform/TASK-QUEUE.json');

if (!fs.existsSync(queuePath)) {
  console.error(`Missing queue: ${queuePath}`);
  process.exit(2);
}

const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));

const evidenceState = (id) => {
  const file = path.join(root, queue.evidenceRoot, `${id}.md`);
  if (!fs.existsSync(file)) return { state: 'PENDING', file };
  const text = fs.readFileSync(file, 'utf8');
  if (/^\s*(?:status|estado)\s*:\s*(?:pass|done|closed|completo)\b/im.test(text) ||
      /(?:^|\n)#+\s*(?:PASS|DONE|CLOSED)\b/i.test(text)) {
    return { state: 'PASS', file };
  }
  if (/^\s*(?:status|estado)\s*:\s*blocked\b/im.test(text) ||
      /(?:^|\n)#+\s*BLOCKED\b/i.test(text)) {
    return { state: 'BLOCKED', file };
  }
  return { state: 'EVIDENCE_UNRESOLVED', file };
};

const states = new Map(queue.tasks.map((task) => [task.id, evidenceState(task.id).state]));

const runnable = queue.tasks.filter((task) => {
  if (states.get(task.id) === 'PASS') return false;
  return task.dependsOn.every((dep) => states.get(dep) === 'PASS' || !states.has(dep));
});

if (command === 'next') {
  const task = runnable[0];
  if (!task) {
    const pending = queue.tasks.filter((task) => states.get(task.id) !== 'PASS');
    if (!pending.length) {
      console.log('QUEUE_COMPLETE');
      process.exit(0);
    }
    console.log(JSON.stringify({
      status: 'NO_RUNNABLE_TASK',
      pending: pending.map((task) => ({id: task.id, state: states.get(task.id), dependsOn: task.dependsOn}))
    }, null, 2));
    process.exit(3);
  }
  console.log(JSON.stringify({
    status: 'RUNNABLE',
    task,
    state: states.get(task.id)
  }, null, 2));
  process.exit(0);
}

console.log(JSON.stringify({
  campaign: queue.campaign,
  summary: {
    total: queue.tasks.length,
    pass: [...states.values()].filter((x) => x === 'PASS').length,
    blocked: [...states.values()].filter((x) => x === 'BLOCKED').length,
    pending: [...states.values()].filter((x) => x !== 'PASS' && x !== 'BLOCKED').length,
    runnable: runnable.length,
  },
  runnable: runnable.map((task) => task.id),
  tasks: queue.tasks.map((task) => ({id: task.id, state: states.get(task.id), dependsOn: task.dependsOn}))
}, null, 2));
