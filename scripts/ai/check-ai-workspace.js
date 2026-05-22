import { promises as fs } from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();

const requiredFiles = [
  '.ai/INDEX.md',
  '.ai/rules/global-rules.md',
  '.ai/context/project-overview.md',
  '.ai/context/code-map.md',
  '.ai/architecture/assistant-architecture.md',
  '.ai/architecture/agent-routing.md',
  'AGENTS.md',
  'CLAUDE.md',
  'CODEX.md',
  'GEMINI.md',
  '.github/copilot-instructions.md',
];

const adapterFiles = [
  'AGENTS.md',
  'CLAUDE.md',
  'CODEX.md',
  'GEMINI.md',
  '.github/AGENTS.md',
  '.github/copilot-instructions.md',
  '.claude/README.md',
  '.codex/README.md',
  '.gemini/README.md',
];

async function exists(relativePath) {
  try {
    await fs.access(path.join(repoRoot, relativePath));
    return true;
  } catch {
    return false;
  }
}

async function listByExtension(relativeDir, extension) {
  const absoluteDir = path.join(repoRoot, relativeDir);
  const entries = await fs.readdir(absoluteDir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(extension))
    .map((entry) => entry.name)
    .sort();
}

function diffSets(source, target) {
  const sourceSet = new Set(source);
  const targetSet = new Set(target);
  return {
    missingInTarget: source.filter((item) => !targetSet.has(item)),
    extraInTarget: target.filter((item) => !sourceSet.has(item)),
  };
}

async function main() {
  const errors = [];

  for (const filePath of requiredFiles) {
    if (!(await exists(filePath))) {
      errors.push(`Missing required file: ${filePath}`);
    }
  }

  for (const filePath of adapterFiles) {
    if (!(await exists(filePath))) {
      errors.push(`Missing adapter file: ${filePath}`);
      continue;
    }

    const content = await fs.readFile(path.join(repoRoot, filePath), 'utf8');
    if (!content.includes('.ai/INDEX.md')) {
      errors.push(`Adapter does not reference .ai/INDEX.md: ${filePath}`);
    }
  }

  const promptSource = await listByExtension('.ai/prompts', '.prompt.md');
  const promptTarget = await listByExtension('.github/prompts', '.prompt.md');
  const promptDiff = diffSets(promptSource, promptTarget);
  if (promptDiff.missingInTarget.length > 0 || promptDiff.extraInTarget.length > 0) {
    errors.push(
      `Prompt sync mismatch. Missing: ${promptDiff.missingInTarget.join(', ') || 'none'}. Extra: ${promptDiff.extraInTarget.join(', ') || 'none'}.`,
    );
  }

  const instructionSource = await listByExtension('.ai/instructions', '.instructions.md');
  const instructionTarget = await listByExtension(
    '.github/instructions',
    '.instructions.md',
  );
  const instructionDiff = diffSets(instructionSource, instructionTarget);
  if (
    instructionDiff.missingInTarget.length > 0 ||
    instructionDiff.extraInTarget.length > 0
  ) {
    errors.push(
      `Instruction sync mismatch. Missing: ${instructionDiff.missingInTarget.join(', ') || 'none'}. Extra: ${instructionDiff.extraInTarget.join(', ') || 'none'}.`,
    );
  }

  if (errors.length > 0) {
    console.error('[ai:check] FAILED');
    errors.forEach((error) => console.error(`- ${error}`));
    process.exitCode = 1;
    return;
  }

  console.log('[ai:check] OK - AI workspace is consistent.');
}

main().catch((error) => {
  console.error('[ai:check] Failed:', error);
  process.exitCode = 1;
});