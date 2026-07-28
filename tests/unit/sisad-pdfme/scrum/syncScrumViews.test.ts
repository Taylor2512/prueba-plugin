import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  buildActiveMarkdown,
  buildCompletedMarkdown,
  parseTableRows,
  syncScrumViews,
} from '../../../../scripts/ai/sync-scrum-views.mjs';

const sampleSprint = `# Sprint actual

| ID | Estado | Owner | Modelo | Worktree | Evidencia |
|---|---|---|---|---|---|
| [AI-001](tasks/AI-001.md) | Done | coordinator | Terra medium | actual | núcleo y enlaces verificados |
| [AI-005](tasks/AI-005.md) | Claimed | coordinator | Terra medium | actual | claim abierto |
| [CONFIG-001](task-cards/CONFIG-001-repair-public-config-api.md) | In review | claude-opus | Opus 4.8 max | actual | review |
| [CONFIG-002](task-cards/CONFIG-002-audit-configuration-sources.md) | Ready | config-specialist | Terra medium | pendiente | backlog |
| [DEDUP-001](task-cards/DEDUP-001-smart-placement.md) | Done | canvas-batch | Sol high | /workspace/wt-canvas | recorrido canónico |
| [UX-001](task-cards/UX-001-right-sidebar-listview-compactness-and-dnd.md) | In progress | claude-opus | Opus 4.8 max | actual | wip |
`;

describe('scripts/ai/sync-scrum-views.mjs', () => {
  it('parses sprint table rows', () => {
    const rows = parseTableRows(sampleSprint);
    expect(rows).toHaveLength(6);
    expect(rows[0]).toMatchObject({ id: 'AI-001', state: 'Done' });
    expect(rows[2]).toMatchObject({ id: 'CONFIG-001', state: 'In review' });
  });

  it('builds active and completed markdown from sprint rows', () => {
    const rows = parseTableRows(sampleSprint);
    const active = buildActiveMarkdown(rows);
    const completed = buildCompletedMarkdown(rows);

    expect(active).toContain('## Claimed');
    expect(active).toContain('## In progress');
    expect(active).toContain('## Review');
    expect(active).toContain('[AI-005](tasks/AI-005.md)');
    expect(active).toContain('[UX-001](task-cards/UX-001-right-sidebar-listview-compactness-and-dnd.md)');
    expect(completed).toContain('## AI / estructura');
    expect(completed).toContain('## DEDUP');
    expect(completed).not.toContain('[CONFIG-002](task-cards/CONFIG-002-audit-configuration-sources.md)');
  });

  it('syncs views into the provided paths', async () => {
    const tempDir = await mkdtemp(path.join(os.tmpdir(), 'scrum-sync-'));
    const sprintPath = path.join(tempDir, 'SPRINT-CURRENT.md');
    const activePath = path.join(tempDir, 'ACTIVE.md');
    const completedPath = path.join(tempDir, 'COMPLETED.md');

    await writeFile(sprintPath, sampleSprint, 'utf8');
    await syncScrumViews({
      sprintPath,
      activePath,
      completedPath,
    });

    const active = await readFile(activePath, 'utf8');
    const completed = await readFile(completedPath, 'utf8');

    expect(active).toContain('[CONFIG-001](task-cards/CONFIG-001-repair-public-config-api.md)');
    expect(completed).toContain('[AI-001](tasks/AI-001.md)');
  });
});
