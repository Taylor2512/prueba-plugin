import { promises as fs } from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();

const syncJobs = [
  {
    sourceDir: path.join(repoRoot, '.ai', 'instructions'),
    targetDir: path.join(repoRoot, '.github', 'instructions'),
    extension: '.instructions.md',
  },
  {
    sourceDir: path.join(repoRoot, '.ai', 'prompts'),
    targetDir: path.join(repoRoot, '.github', 'prompts'),
    extension: '.prompt.md',
  },
];

const GENERATED_HEADER = [
  '<!-- AUTO-GENERATED FILE. DO NOT EDIT DIRECTLY. -->',
  '<!-- Source of truth: .ai/ -->',
  '',
].join('\n');

const isSyncCandidate = (fileName, extension) => fileName.endsWith(extension);

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function listFilesByExtension(dirPath, extension) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && isSyncCandidate(entry.name, extension))
    .map((entry) => entry.name)
    .sort();
}

async function writeSyncedFile(sourcePath, targetPath) {
  const sourceContent = await fs.readFile(sourcePath, 'utf8');
  const output = `${GENERATED_HEADER}${sourceContent}`;
  await fs.writeFile(targetPath, output, 'utf8');
}

async function removeStaleFiles(targetDir, expectedFileNames, extension) {
  const targetFiles = await listFilesByExtension(targetDir, extension);
  const expected = new Set(expectedFileNames);
  const staleFiles = targetFiles.filter((fileName) => !expected.has(fileName));

  await Promise.all(
    staleFiles.map((fileName) => fs.unlink(path.join(targetDir, fileName))),
  );

  return staleFiles;
}

async function runSyncJob({ sourceDir, targetDir, extension }) {
  await ensureDir(targetDir);

  const sourceFiles = await listFilesByExtension(sourceDir, extension);
  await Promise.all(
    sourceFiles.map((fileName) => {
      const sourcePath = path.join(sourceDir, fileName);
      const targetPath = path.join(targetDir, fileName);
      return writeSyncedFile(sourcePath, targetPath);
    }),
  );

  const removed = await removeStaleFiles(targetDir, sourceFiles, extension);
  return { synced: sourceFiles.length, removed: removed.length };
}

async function main() {
  const results = [];
  for (const job of syncJobs) {
    results.push(await runSyncJob(job));
  }

  const summary = {
    synced: results.reduce((total, item) => total + item.synced, 0),
    removed: results.reduce((total, item) => total + item.removed, 0),
  };

  console.log(
    `[ai:sync] Synced ${summary.synced} files. Removed ${summary.removed} stale files.`,
  );
}

main().catch((error) => {
  console.error('[ai:sync] Failed:', error);
  process.exitCode = 1;
});