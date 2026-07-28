import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const currentFile = fileURLToPath(import.meta.url);
const scriptDir = path.dirname(currentFile);
const repoRoot = path.resolve(scriptDir, '../..');
const scrumDir = path.join(repoRoot, '.ai', 'scrum');
const sprintFile = path.join(scrumDir, 'SPRINT-CURRENT.md');
const activeFile = path.join(scrumDir, 'ACTIVE.md');
const completedFile = path.join(scrumDir, 'COMPLETED.md');

const ACTIVE_STATE_ORDER = [
  { label: 'Claimed', states: ['claimed'] },
  { label: 'In progress', states: ['in progress'] },
  { label: 'Review', states: ['review', 'in review'] },
  { label: 'Blocked', states: ['blocked'] },
];

const COMPLETED_GROUP_ORDER = ['AI / estructura', 'DEDUP', 'Docs / quality', 'Configuración', 'Otros'];

const COMPLETED_GROUP_LABEL_BY_PREFIX = {
  AI: 'AI / estructura',
  DEDUP: 'DEDUP',
  DOCS: 'Docs / quality',
  QUALITY: 'Docs / quality',
  CONFIG: 'Configuración',
};

const parseTableRows = (source) => {
  const rows = [];
  const lines = source.split(/\r?\n/);
  const rowPattern = /^\|\s*\[(?<id>[^\]]+)\]\((?<path>[^)]+)\)\s*\|\s*(?<state>[^|]+?)\s*\|\s*(?<owner>[^|]+?)\s*\|\s*(?<model>[^|]+?)\s*\|\s*(?<worktree>[^|]+?)\s*\|\s*(?<evidence>[^|]+?)\s*\|$/;

  for (const line of lines) {
    const match = line.match(rowPattern);
    if (!match?.groups) continue;
    rows.push({
      id: match.groups.id.trim(),
      path: match.groups.path.trim(),
      state: match.groups.state.trim(),
      owner: match.groups.owner.trim(),
      model: match.groups.model.trim(),
      worktree: match.groups.worktree.trim(),
      evidence: match.groups.evidence.trim(),
    });
  }

  return rows;
};

const parseTaskNumber = (id) => {
  const match = id.match(/^(.*?)-(\d+)$/);
  if (!match) return Number.POSITIVE_INFINITY;
  return Number(match[2]);
};

const compareTaskIds = (left, right) => {
  const leftPrefix = left.id.split('-')[0];
  const rightPrefix = right.id.split('-')[0];
  if (leftPrefix !== rightPrefix) return leftPrefix.localeCompare(rightPrefix);
  const leftNumber = parseTaskNumber(left.id);
  const rightNumber = parseTaskNumber(right.id);
  if (leftNumber !== rightNumber) return leftNumber - rightNumber;
  return left.id.localeCompare(right.id);
};

const getCompletedGroupLabel = (id) => {
  const prefix = id.split('-')[0].toUpperCase();
  return COMPLETED_GROUP_LABEL_BY_PREFIX[prefix] || 'Otros';
};

const renderSection = (title, items, emptyText = '- Ninguna en este momento.') => {
  const lines = [`## ${title}`, ''];
  if (!items.length) {
    lines.push(emptyText);
    return lines.join('\n');
  }

  for (const item of items) {
    lines.push(`- [${item.id}](${item.path})`);
  }

  return lines.join('\n');
};

const buildActiveMarkdown = (rows) => {
  const normalized = rows.filter((row) =>
    ACTIVE_STATE_ORDER.some((entry) => entry.states.includes(row.state.toLowerCase())),
  );

  const sections = ACTIVE_STATE_ORDER.map((entry) => {
    const items = normalized
      .filter((row) => entry.states.includes(row.state.toLowerCase()))
      .sort(compareTaskIds);
    return renderSection(entry.label, items);
  });

  return [
    '# Active',
    '',
    'Vista corta de tareas en curso o en revisión. La fuente de verdad sigue siendo `SPRINT-CURRENT.md` y las leases activas viven en `CLAIMS.md`.',
    '',
    'Generada desde `SPRINT-CURRENT.md` con `npm run maintenance:sync-scrum-views`.',
    '',
    sections.join('\n\n'),
    '',
    'Las tareas `Ready` se consultan en `PRODUCT-BACKLOG.md`; esta vista solo muestra lo que ya está siendo trabajado o revisado.',
    '',
  ].join('\n');
};

const buildCompletedMarkdown = (rows) => {
  const completedRows = rows
    .filter((row) => row.state.toLowerCase() === 'done')
    .sort(compareTaskIds);

  const groupedRows = new Map();
  for (const row of completedRows) {
    const label = getCompletedGroupLabel(row.id);
    if (!groupedRows.has(label)) groupedRows.set(label, []);
    groupedRows.get(label).push(row);
  }

  const sections = [];
  for (const label of COMPLETED_GROUP_ORDER) {
    const items = groupedRows.get(label);
    if (!items || items.length === 0) continue;
    sections.push(renderSection(label, items));
  }

  return [
    '# Completed',
    '',
    'Vista navegable de tareas cerradas. La fuente de verdad sigue siendo `SPRINT-CURRENT.md`.',
    '',
    'Generada desde `SPRINT-CURRENT.md` con `npm run maintenance:sync-scrum-views`.',
    '',
    sections.join('\n\n'),
    '',
    'Las tareas `Ready` viven en `PRODUCT-BACKLOG.md`; las tareas activas o en revisión viven en `ACTIVE.md`.',
    '',
  ].join('\n');
};

export const syncScrumViews = async ({
  sprintPath = sprintFile,
  activePath = activeFile,
  completedPath = completedFile,
} = {}) => {
  const sprintSource = await readFile(sprintPath, 'utf8');
  const rows = parseTableRows(sprintSource);
  const activeMarkdown = buildActiveMarkdown(rows);
  const completedMarkdown = buildCompletedMarkdown(rows);

  await mkdir(path.dirname(activePath), { recursive: true });
  await mkdir(path.dirname(completedPath), { recursive: true });
  await Promise.all([
    writeFile(activePath, activeMarkdown, 'utf8'),
    writeFile(completedPath, completedMarkdown, 'utf8'),
  ]);

  return {
    sprintFile: sprintPath,
    activeFile: activePath,
    completedFile: completedPath,
    activeCount: rows.filter((row) => ACTIVE_STATE_ORDER.some((entry) => entry.states.includes(row.state.toLowerCase()))).length,
    completedCount: rows.filter((row) => row.state.toLowerCase() === 'done').length,
  };
};

const isExecutedDirectly = process.argv[1] ? path.resolve(process.argv[1]) === currentFile : false;

if (isExecutedDirectly) {
  syncScrumViews()
    .then((result) => {
      process.stdout.write(
        `synced scrum views: active=${result.activeCount}, completed=${result.completedCount}\n`,
      );
    })
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
}

export { buildActiveMarkdown, buildCompletedMarkdown, parseTableRows };
