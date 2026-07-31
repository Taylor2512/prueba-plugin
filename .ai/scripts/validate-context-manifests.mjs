import fs from 'node:fs';
import path from 'node:path';

const dir = path.join(process.cwd(), '.ai/scrum/task-cards');
let failed = false;
for (const name of fs.readdirSync(dir).filter(n => n.endsWith('.md'))) {
  const text = fs.readFileSync(path.join(dir, name), 'utf8');
  for (const token of ['context:', 'maxFiles:', 'maxTokens:', '## Stop']) {
    if (!text.includes(token)) {
      console.error(`${name}: missing ${token}`);
      failed = true;
    }
  }
}
process.exit(failed ? 1 : 0);
