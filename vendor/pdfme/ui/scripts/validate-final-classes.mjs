#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const ROOT_DIR = process.cwd();
const MANIFEST_PATH = path.resolve(ROOT_DIR, 'pdfme-final-classes.txt');
const VENDOR_SRC_DIR = path.resolve(ROOT_DIR, 'vendors/pdfme/ui/src');
const APP_STYLE_FILE = path.resolve(
  ROOT_DIR,
  'src/features/ContentCustomForm/styles/designer/step-two/StepTwo.unified.css',
);

const readUtf8 = (targetPath) => fs.readFileSync(targetPath, 'utf8');

const listFilesRecursive = (dirPath) => {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) return listFilesRecursive(fullPath);
    return [fullPath];
  });
};

if (!fs.existsSync(MANIFEST_PATH)) {
  console.error(`[validate-final-classes] Missing manifest file: ${MANIFEST_PATH}`);
  process.exit(1);
}

const manifestClasses = readUtf8(MANIFEST_PATH)
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter(Boolean);

const sourceFiles = listFilesRecursive(VENDOR_SRC_DIR).filter((filePath) =>
  /\.(tsx?|jsx?|css)$/.test(filePath),
);

const sourceChunks = sourceFiles.map((filePath) => readUtf8(filePath));
if (fs.existsSync(APP_STYLE_FILE)) sourceChunks.push(readUtf8(APP_STYLE_FILE));
const searchableSource = sourceChunks.join('\n');

const missingClasses = manifestClasses.filter((className) => !searchableSource.includes(className));

const inlineStyleMatches = sourceFiles
  .filter((filePath) => /\.(tsx?|jsx?)$/.test(filePath))
  .map((filePath) => {
    const content = readUtf8(filePath);
    const count = (content.match(/\bstyle\s*=\s*\{\{/g) || []).length;
    return { filePath, count };
  })
  .filter(({ count }) => count > 0);

if (missingClasses.length > 0) {
  console.error('[validate-final-classes] Missing class hooks from manifest:');
  missingClasses.forEach((className) => console.error(`  - ${className}`));
  process.exit(1);
}

console.log(
  `[validate-final-classes] OK. Verified ${manifestClasses.length} classes from pdfme-final-classes.txt`,
);
console.log(
  `[validate-final-classes] Inline style inventory: ${inlineStyleMatches.length} files still contain style={{...}}`,
);
