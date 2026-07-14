#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const completedDir = path.join(root, 'ai/task-cards/completed');

if (!fs.existsSync(completedDir)) {
  console.error('No existe ai/task-cards/completed');
  process.exit(1);
}

const tasks = fs.readdirSync(completedDir)
  .filter((name) => name.startsWith('TASK-') && name.endsWith('.md'))
  .sort();

const summaryPath = path.join(completedDir, 'completed-summary.md');

const lines = [
  '# Resumen de tareas completadas protegidas',
  '',
  'Generado para evitar que agentes IA traten completed como pending.',
  '',
  ...tasks.map((name) => `- \`${name}\`: completada/protegida. No reabrir salvo regression task nueva.`),
  '',
];

fs.writeFileSync(summaryPath, lines.join('\n'), 'utf8');
console.log(`[ai-normalize-completed-tasks] escrito ${summaryPath}`);
