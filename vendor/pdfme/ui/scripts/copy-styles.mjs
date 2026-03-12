import { cpSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(scriptDir, '..');
const sourceDir = resolve(packageRoot, 'src/styles');
const esmTargetDir = resolve(packageRoot, 'dist/esm/styles');
const cjsTargetDir = resolve(packageRoot, 'dist/cjs/styles');

mkdirSync(esmTargetDir, { recursive: true });
mkdirSync(cjsTargetDir, { recursive: true });
cpSync(sourceDir, esmTargetDir, { recursive: true });
cpSync(sourceDir, cjsTargetDir, { recursive: true });
