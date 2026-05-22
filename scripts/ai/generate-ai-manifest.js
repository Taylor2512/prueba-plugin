import { promises as fs } from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const manifestPath = path.join(repoRoot, 'MANIFEST.md');

const includePaths = [
  '.ai',
  '.claude',
  '.codex',
  '.gemini',
  '.github',
  'scripts/ai',
  'AGENTS.md',
  'CLAUDE.md',
  'CODEX.md',
  'GEMINI.md',
  'README.md',
  'docs',
  'metadata/project-analysis.json',
];

const ignoreNames = new Set(['.DS_Store']);

async function getStat(absolutePath) {
  return fs.stat(absolutePath);
}

async function collectFiles(relativePath) {
  const absolutePath = path.join(repoRoot, relativePath);
  const stat = await getStat(absolutePath);

  if (stat.isFile()) {
    return [relativePath.replace(/\\/g, '/')];
  }

  const entries = await fs.readdir(absolutePath, { withFileTypes: true });
  const nestedResults = await Promise.all(
    entries
      .filter((entry) => !ignoreNames.has(entry.name))
      .map((entry) => collectFiles(path.join(relativePath, entry.name))),
  );

  return nestedResults.flat();
}

async function main() {
  const collected = await Promise.all(includePaths.map((entry) => collectFiles(entry)));
  const files = [...new Set(collected.flat())].sort((a, b) => a.localeCompare(b));

  const lines = ['# Manifest', ''];
  for (const filePath of files) {
    lines.push(`- \`${filePath}\``);
  }
  lines.push('');

  await fs.writeFile(manifestPath, lines.join('\n'), 'utf8');
  console.log(`[ai:manifest] Wrote ${files.length} entries to MANIFEST.md`);
}

main().catch((error) => {
  console.error('[ai:manifest] Failed:', error);
  process.exitCode = 1;
});