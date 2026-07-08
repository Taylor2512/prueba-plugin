#!/usr/bin/env node
/* global console, process */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const VERSION = '1.2.0';

const COMMON_IGNORE_DIRS = new Set([
  'node_modules', '.git', 'dist', 'build', '.next', '.nuxt', 'coverage',
  '.turbo', '.cache', '.idea', '.vscode', 'out', 'tmp', 'temp', 'logs',
  '.angular', '.vite', '.yarn', '.pnpm-store', 'storybook-static',
  'TestResults', 'bin', 'obj', 'packages', 'vendor',
  'unficados', 'unificados', '_unificados', 'ai-context', 'ai-contexts',
  '.history', 'backup', 'backups', 'old', 'legacy', 'archive', 'archives',
  '.parcel-cache', '.serverless', '.vercel', '.netlify', '.expo', '.gradle',
  '.mvn', 'target', 'Debug', 'Release', 'x64', 'x86', 'runtimes', 'ref', 'refint',
  'wwwroot', 'libman', 'bower_components', 'jspm_packages',
  'sisad-md-architecture-toolkit', 'ReverseEngineering'
]);


// Exclusiones absolutas por ruta. Se aplican incluso si la carpeta aparece anidada
// dentro de otro proyecto/workspace. Esto evita arrastrar dependencias, builds,
// salidas generadas para IA y artefactos de .NET/Node aunque existan en muchas ramas.
const HARD_IGNORE_DIR_PATTERNS = [
  'node_modules/**', '**/node_modules/**',
  'bower_components/**', '**/bower_components/**',
  'jspm_packages/**', '**/jspm_packages/**',
  'bin/**', '**/bin/**',
  'obj/**', '**/obj/**',
  'dist/**', '**/dist/**',
  'build/**', '**/build/**',
  'out/**', '**/out/**',
  'coverage/**', '**/coverage/**',
  'TestResults/**', '**/TestResults/**',
  'playwright-report/**', '**/playwright-report/**',
  '.git/**', '**/.git/**',
  '.next/**', '**/.next/**',
  '.nuxt/**', '**/.nuxt/**',
  '.turbo/**', '**/.turbo/**',
  '.cache/**', '**/.cache/**',
  '.vite/**', '**/.vite/**',
  '.angular/**', '**/.angular/**',
  '.parcel-cache/**', '**/.parcel-cache/**',
  '.serverless/**', '**/.serverless/**',
  '.vercel/**', '**/.vercel/**',
  '.netlify/**', '**/.netlify/**',
  'tmp/**', '**/tmp/**',
  'temp/**', '**/temp/**',
  'logs/**', '**/logs/**',
  'unficados/**', '**/unficados/**',
  'unificados/**', '**/unificados/**',
  '_unificados/**', '**/_unificados/**',
  'ai-context/**', '**/ai-context/**',
  'ai-contexts/**', '**/ai-contexts/**',
  'sisad-md-architecture-toolkit/**', '**/sisad-md-architecture-toolkit/**',
  'tools/ReverseEngineering/**', '**/tools/ReverseEngineering/**',
  'image/**', '**/image/**',
  'images/**', '**/images/**',
  'screenshots/**', '**/screenshots/**'
];

const COMMON_IGNORE_FILE_PATTERNS = [
  '**/*.map',
  '**/*.min.js',
  '**/*.min.css',
  '**/*.bundle.js',
  '**/*.bundle.css',
  '**/package-lock.json',
  '**/yarn.lock',
  '**/pnpm-lock.yaml',
  '**/bun.lockb',
  '**/ai-context-pack.mjs',
  '**/merge-*-from-folder.js',
  '**/minify-*-folder.mjs',
  '**/*unificado*.md',
  '**/codigo-frontend*.md',
  '**/codigo-backend*.md',
  '**/styles-sisad-web*.md',
  '**/documentacion-sisad-web*.md',
  '**/documentación-sisad-web*.md',
  '**/estructura-database*.md',
  '**/.DS_Store',
  '**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.webp', '**/*.ico', '**/*.svg',
  '**/*.pdf', '**/*.doc', '**/*.docx', '**/*.xls', '**/*.xlsx', '**/*.ppt', '**/*.pptx',
  '**/*.zip', '**/*.rar', '**/*.7z', '**/*.gz', '**/*.tar',
  '**/*.dll', '**/*.exe', '**/*.pdb', '**/*.db', '**/*.sqlite', '**/*.bak',
  '**/*.log', '**/*.snap', '**/*.snapshot', '**/*.tmp', '**/*.temp',
  '**/unficados/**', '**/unificados/**', '**/_unificados/**',
  '**/ai-context/**', '**/ai-contexts/**', '**/*context-pack*.md'
];

const TEST_PATTERNS = [
  '**/*.test.js', '**/*.test.jsx', '**/*.test.ts', '**/*.test.tsx',
  '**/*.spec.js', '**/*.spec.jsx', '**/*.spec.ts', '**/*.spec.tsx',
  '**/__tests__/**', '**/tests/**', '**/e2e/**', '**/playwright-report/**'
];

const STORY_PATTERNS = [
  '**/*.stories.js', '**/*.stories.jsx', '**/*.stories.ts', '**/*.stories.tsx',
  '**/*.story.js', '**/*.story.jsx', '**/*.story.ts', '**/*.story.tsx'
];

const GENERATED_PATTERNS = [
  '**/*.generated.*', '**/*.g.cs', '**/*.designer.cs', '**/Generated/**',
  '**/generated/**', '**/Service References/**'
];

const PROFILE_CONFIG = {
  react: {
    label: 'Frontend React / Vite',
    exts: ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs', '.json'],
    defaultOutput: 'codigo-frontend.md',
    defaultMaxFileKb: 90,
    defaultMaxTotalKb: 2500,
    priority: [
      'package.json', 'vite.config.*', 'tailwind.config.*', 'postcss.config.*',
      'eslint.config.*', 'tsconfig*.json', 'jsconfig*.json',
      'src/main.*', 'src/App.*', 'src/router/**', 'src/routes/**', 'src/modules/**',
      'src/features/**', 'src/components/**', 'src/hooks/**', 'src/services/**', 'src/api/**',
      'src/store/**', 'src/context/**', 'src/utils/**', 'src/lib/**'
    ]
  },
  frontend: null,
  css: {
    label: 'Estilos CSS/Tailwind',
    exts: ['.css', '.scss', '.sass', '.less'],
    defaultOutput: 'styles.md',
    defaultMaxFileKb: 80,
    defaultMaxTotalKb: 1200,
    priority: [
      'src/index.css', 'src/App.css', '**/globals.css', '**/global.css', '**/base.css',
      '**/theme.css', '**/variables.css', '**/tailwind.css', '**/layout.css', '**/*.css'
    ]
  },
  docs: {
    label: 'Documentación Markdown',
    exts: ['.md', '.mdx'],
    defaultOutput: 'documentacion.md',
    defaultMaxFileKb: 120,
    defaultMaxTotalKb: 1800,
    priority: [
      'README.md', 'readme.md', 'docs/**', 'documentation/**', '**/*.md', '**/*.mdx'
    ]
  },
  csharp: {
    label: 'Backend .NET / C#',
    exts: ['.cs', '.csproj', '.sln', '.json', '.config', '.xml', '.cshtml', '.razor'],
    defaultOutput: 'codigo-backend.md',
    defaultMaxFileKb: 160,
    defaultMaxTotalKb: 3500,
    priority: [
      '*.sln', '**/*.csproj', '**/Program.cs', '**/Startup.cs', '**/*DbContext.cs',
      '**/Controllers/**', '**/Endpoints/**', '**/Features/**', '**/Application/**',
      '**/Domain/**', '**/Infrastructure/**', '**/Persistence/**', '**/Services/**',
      '**/Repositories/**', '**/Dtos/**', '**/DTOs/**', '**/Models/**', '**/Migrations/**'
    ]
  },
  backend: null,
  sql: {
    label: 'Estructura SQL / Base de datos',
    exts: ['.sql'],
    defaultOutput: 'estructura-database.md',
    defaultMaxFileKb: 250,
    defaultMaxTotalKb: 2500,
    priority: [
      '**/*schema*.sql', '**/*structure*.sql', '**/*estructura*.sql', '**/*tables*.sql',
      '**/*views*.sql', '**/*procedures*.sql', '**/*.sql'
    ]
  },
  full: {
    label: 'Proyecto completo filtrado para IA',
    exts: ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs', '.json', '.css', '.scss', '.md', '.mdx', '.cs', '.csproj', '.sln', '.sql', '.config', '.xml', '.razor', '.cshtml'],
    defaultOutput: 'contexto-proyecto.md',
    defaultMaxFileKb: 120,
    defaultMaxTotalKb: 5000,
    priority: ['README.md', 'package.json', '*.sln', '**/*.csproj', 'src/**', '**/Program.cs', '**/Controllers/**', '**/Features/**', '**/Domain/**', '**/Application/**', '**/Infrastructure/**', '**/*.sql', '**/*.md']
  }
};
PROFILE_CONFIG.frontend = PROFILE_CONFIG.react;
PROFILE_CONFIG.backend = PROFILE_CONFIG.csharp;

const LANGUAGE_BY_EXT = {
  '.js': 'javascript', '.jsx': 'jsx', '.ts': 'typescript', '.tsx': 'tsx',
  '.mjs': 'javascript', '.cjs': 'javascript', '.json': 'json',
  '.css': 'css', '.scss': 'scss', '.sass': 'sass', '.less': 'less',
  '.md': 'markdown', '.mdx': 'mdx', '.cs': 'csharp', '.csproj': 'xml',
  '.sln': 'text', '.sql': 'sql', '.config': 'xml', '.xml': 'xml',
  '.razor': 'razor', '.cshtml': 'cshtml'
};

function printUsage() {
  console.log(`\nAI Context Pack v${VERSION}\n\nUso:\n  node ai-context-pack.mjs <carpeta> [salida.md] --profile <react|css|docs|csharp|sql|full> [opciones]\n\nEjemplos:\n  node ai-context-pack.mjs ./ codigo-frontend-sisad-web.md --profile react\n  node ai-context-pack.mjs ./ documentacion-sisad-web.md --profile docs\n  node ai-context-pack.mjs ./ styles-sisad-web.md --profile css\n  node ai-context-pack.mjs ./ codigo-backend-digitalAgreements.md --profile csharp\n  node ai-context-pack.mjs ./ estructura-database.md --profile sql --mode full\n\nOpciones:\n  --profile <name>          Perfil de análisis. Default: full\n  --mode <compact|full|summary>  compact limita tamaño. full evita truncar salvo archivos gigantes. summary solo índice/símbolos. Default: compact\n  --max-file-kb <n>         Máximo KB por archivo incluido\n  --max-total-kb <n>        Máximo KB total de contenido incluido\n  --max-files <n>           Máximo de archivos a incluir después de ordenar por prioridad\n  --include <glob>          Incluye solo rutas que coincidan. Repetible\n  --exclude <glob>          Excluye rutas. Repetible\n  --include-tests           Incluye tests/spec/e2e\n  --include-stories         Incluye stories\n  --include-generated       Incluye archivos generados/designer\n  --include-json-data       En React incluye JSON de datos/plantillas; por defecto solo configs\n  --strip-comments          Reduce comentarios de JS/TS/CSS/C# para bajar peso\n  --no-redact               No redacta secretos. No recomendado\n  --no-symbols              No agrega resumen de símbolos por archivo\n  --tree-depth <n>          Profundidad máxima del árbol. Default: 7\n  --help                    Muestra esta ayuda\n`);
}

function parseArgs(argv) {
  const positional = [];
  const flags = {
    profile: 'full',
    mode: 'compact',
    include: [],
    exclude: [],
    includeTests: false,
    includeStories: false,
    includeGenerated: false,
    includeJsonData: false,
    stripComments: false,
    redact: true,
    symbols: true,
    treeDepth: 7
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      flags.help = true;
    } else if (arg === '--profile') {
      flags.profile = String(argv[++i] || '').toLowerCase();
    } else if (arg === '--mode') {
      flags.mode = String(argv[++i] || 'compact').toLowerCase();
    } else if (arg === '--max-file-kb') {
      flags.maxFileKb = Number(argv[++i]);
    } else if (arg === '--max-total-kb') {
      flags.maxTotalKb = Number(argv[++i]);
    } else if (arg === '--include') {
      flags.include.push(argv[++i]);
    } else if (arg === '--exclude') {
      flags.exclude.push(argv[++i]);
    } else if (arg === '--include-tests') {
      flags.includeTests = true;
    } else if (arg === '--include-stories') {
      flags.includeStories = true;
    } else if (arg === '--include-generated') {
      flags.includeGenerated = true;
    } else if (arg === '--include-json-data') {
      flags.includeJsonData = true;
    } else if (arg === '--strip-comments') {
      flags.stripComments = true;
    } else if (arg === '--max-files') {
      flags.maxFiles = Number(argv[++i]);
    } else if (arg === '--no-redact') {
      flags.redact = false;
    } else if (arg === '--no-symbols') {
      flags.symbols = false;
    } else if (arg === '--tree-depth') {
      flags.treeDepth = Number(argv[++i]);
    } else if (arg.startsWith('--')) {
      throw new Error(`Opción no soportada: ${arg}`);
    } else {
      positional.push(arg);
    }
  }

  return { positional, flags };
}

function normalizePath(value) {
  return value.split(path.sep).join('/');
}

function normalizeRel(rootDir, filePath) {
  return normalizePath(path.relative(rootDir, filePath));
}

function globToRegExp(glob) {
  const normalized = normalizePath(glob);
  let output = '^';

  for (let i = 0; i < normalized.length; i += 1) {
    const char = normalized[i];
    const next = normalized[i + 1];
    const afterNext = normalized[i + 2];

    // **/ debe coincidir con cero o más carpetas. Así **/*.cs también toma Program.cs en raíz.
    if (char === '*' && next === '*' && afterNext === '/') {
      output += '(?:.*/)?';
      i += 2;
    } else if (char === '*' && next === '*') {
      output += '.*';
      i += 1;
    } else if (char === '*') {
      output += '[^/]*';
    } else if (char === '?') {
      output += '[^/]';
    } else {
      output += char.replace(/[|\\{}()[\]^$+?.]/g, '\\$&');
    }
  }

  output += '$';
  return new RegExp(output, 'i');
}

function matchesAny(relPath, patterns) {
  if (!patterns || patterns.length === 0) return false;
  return patterns.some((pattern) => globToRegExp(pattern).test(relPath));
}


function isFrontendConfigJson(relPath) {
  const name = path.basename(relPath).toLowerCase();
  return name === 'package.json' ||
    name === 'components.json' ||
    name === 'jsconfig.json' ||
    name.startsWith('tsconfig') && name.endsWith('.json') ||
    name === 'eslint.config.json' ||
    name === 'biome.json' ||
    name === 'prettier.json';
}

function stripCommentsForAi(content, ext) {
  if (!content) return content;
  if (['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs', '.cs', '.css', '.scss', '.less'].includes(ext)) {
    let output = content;
    output = output.replace(/\/\*[\s\S]*?\*\//g, (match) => {
      if (/license|copyright|@preserve/i.test(match)) return match;
      return '';
    });
    output = output.replace(/^\s*\/\/[^\n\r]*$/gm, '');
    output = output.replace(/\n{3,}/g, '\n\n');
    return output;
  }
  return content;
}

function safeReadDir(dir) {
  try {
    return fs.readdirSync(dir, { withFileTypes: true });
  } catch (error) {
    return [];
  }
}

function fileSizeKb(filePath) {
  try {
    return fs.statSync(filePath).size / 1024;
  } catch {
    return 0;
  }
}

function countLines(content) {
  if (!content) return 0;
  return content.split(/\r?\n/).length;
}

function hashContent(content) {
  return crypto.createHash('sha1').update(content).digest('hex').slice(0, 10);
}

function isLikelyGenerated(content, relPath) {
  if (matchesAny(relPath, GENERATED_PATTERNS)) return true;
  const head = content.slice(0, 2500).toLowerCase();
  return head.includes('<auto-generated') ||
    head.includes('@generated') ||
    head.includes('auto-generated') ||
    head.includes('this file was generated') ||
    head.includes('generated by');
}

function isLikelyMinified(content) {
  const lines = content.split(/\r?\n/).slice(0, 40);
  const longLines = lines.filter((line) => line.length > 900).length;
  const avgLength = lines.length ? lines.reduce((acc, line) => acc + line.length, 0) / lines.length : 0;
  return longLines >= 2 || avgLength > 450;
}

function redactSecrets(content) {
  let output = content;

  output = output.replace(/\b(eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{10,})\b/g, '[JWT_REDACTED]');
  output = output.replace(/\b[A-Za-z0-9+/]{120,}={0,2}\b/g, (match) => `[LONG_BASE64_OR_TOKEN_REDACTED length=${match.length}]`);

  const assignmentPattern = /(\b(?:password|passwd|pwd|secret|token|api[_-]?key|apikey|access[_-]?key|private[_-]?key|client[_-]?secret|connectionstring|connection_string|jwt|bearer|authorization)\b\s*[:=]\s*)(["'`]?)([^\n\r"'`,;}]+)(["'`]?)/gi;
  output = output.replace(assignmentPattern, (_full, prefix, quoteOpen, _value, quoteClose) => `${prefix}${quoteOpen}[REDACTED]${quoteClose}`);

  const jsonPattern = /("(?:password|passwd|pwd|secret|token|api[_-]?key|apikey|access[_-]?key|private[_-]?key|client[_-]?secret|connectionStrings?|jwt|authorization)"\s*:\s*")([^"\n\r]+)(")/gi;
  output = output.replace(jsonPattern, '$1[REDACTED]$3');

  return output;
}

function normalizeContent(content) {
  return content
    .replace(/\r\n/g, '\n')
    .replace(/[\t ]+$/gm, '')
    .replace(/\n{4,}/g, '\n\n\n')
    .replace(/\/\/[#@]\s*sourceMappingURL=.*$/gm, '')
    .trim();
}

function truncateMiddle(content, maxKb, options = {}) {
  const minChars = Number.isFinite(options.minChars) ? options.minChars : 1000;
  const maxChars = Math.floor(maxKb * 1024);

  if (maxChars <= 0) {
    return {
      content: '/* CONTENIDO OMITIDO POR PRESUPUESTO TOTAL. Usa --max-total-kb o --include para enfocar el contexto. */',
      truncated: true,
      omittedChars: content.length
    };
  }

  const effectiveMaxChars = Math.max(minChars, maxChars);
  if (content.length <= effectiveMaxChars) return { content, truncated: false, omittedChars: 0 };

  const headChars = Math.floor(effectiveMaxChars * 0.68);
  const tailChars = Math.floor(effectiveMaxChars * 0.24);
  const omittedChars = content.length - headChars - tailChars;
  const marker = `

/* ... CONTENIDO OMITIDO PARA REDUCIR PESO: ${omittedChars} caracteres. Usa --mode full o sube --max-file-kb si necesitas este archivo completo. ... */

`;

  return {
    content: content.slice(0, headChars) + marker + content.slice(content.length - tailChars),
    truncated: true,
    omittedChars
  };
}

function extractSymbols(content, ext) {
  const symbols = [];
  const addMatches = (regex, label, max = 12) => {
    let match;
    let count = 0;
    while ((match = regex.exec(content)) && count < max) {
      symbols.push(`${label}: ${match[1]}`);
      count += 1;
    }
  };

  if (['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs'].includes(ext)) {
    addMatches(/^\s*export\s+(?:default\s+)?(?:async\s+)?function\s+([A-Za-z0-9_$]+)/gm, 'export function');
    addMatches(/^\s*export\s+(?:default\s+)?(?:class|interface|type|enum)\s+([A-Za-z0-9_$]+)/gm, 'export type/class');
    addMatches(/^\s*export\s+const\s+([A-Za-z0-9_$]+)/gm, 'export const');
    addMatches(/^\s*(?:async\s+)?function\s+([A-Za-z0-9_$]+)/gm, 'function', 8);
    addMatches(/^\s*const\s+([A-Z][A-Za-z0-9_$]*)\s*=\s*(?:\(|memo\(|forwardRef\(|function|async)/gm, 'component/const', 8);
  } else if (ext === '.cs') {
    addMatches(/^\s*(?:public|private|internal|protected)?\s*(?:sealed\s+|static\s+|partial\s+|abstract\s+)*(?:class|record|interface|enum)\s+([A-Za-z0-9_]+)/gm, 'type');
    addMatches(/^\s*(?:public|private|internal|protected)\s+(?:async\s+)?[A-Za-z0-9_<>,?\[\]\s]+\s+([A-Za-z0-9_]+)\s*\(/gm, 'method', 12);
  } else if (ext === '.sql') {
    addMatches(/\bCREATE\s+(?:OR\s+ALTER\s+)?TABLE\s+\[?([A-Za-z0-9_.\]\[]+)/gim, 'table', 20);
    addMatches(/\bCREATE\s+(?:OR\s+ALTER\s+)?(?:PROCEDURE|PROC)\s+\[?([A-Za-z0-9_.\]\[]+)/gim, 'procedure', 20);
    addMatches(/\bCREATE\s+(?:OR\s+ALTER\s+)?VIEW\s+\[?([A-Za-z0-9_.\]\[]+)/gim, 'view', 20);
    addMatches(/\bCREATE\s+(?:OR\s+ALTER\s+)?FUNCTION\s+\[?([A-Za-z0-9_.\]\[]+)/gim, 'function', 20);
  } else if (ext === '.css' || ext === '.scss' || ext === '.less') {
    addMatches(/^\s*(:root|\.[A-Za-z0-9_-]+|#[A-Za-z0-9_-]+)\s*[,{]/gm, 'selector', 16);
  }

  return [...new Set(symbols)].slice(0, 30);
}

function getPriority(relPath, profile) {
  const priority = profile.priority || [];
  for (let i = 0; i < priority.length; i += 1) {
    if (matchesAny(relPath, [priority[i]])) return i;
  }
  return priority.length + relPath.split('/').length;
}


function isHardIgnoredDirectory(entryName, relPath) {
  if (COMMON_IGNORE_DIRS.has(entryName)) return true;
  const normalized = normalizePath(relPath).replace(/\/?$/, '/');
  return matchesAny(normalized, HARD_IGNORE_DIR_PATTERNS);
}

function walkFiles(rootDir, profile, options) {
  const included = [];
  const skipped = [];
  const outputAbs = options.outputFile ? path.resolve(options.outputFile) : null;

  function visit(dir) {
    const entries = safeReadDir(dir).sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relPath = normalizeRel(rootDir, fullPath);

      if (entry.isDirectory()) {
        if (isHardIgnoredDirectory(entry.name, relPath)) {
          skipped.push({ relPath, reason: 'directorio ignorado: dependencia/build/salida generada' });
          continue;
        }
        if (matchesAny(relPath, options.excludePatterns)) {
          skipped.push({ relPath, reason: 'directorio excluido por patrón' });
          continue;
        }
        visit(fullPath);
        continue;
      }

      if (!entry.isFile()) continue;
      if (matchesAny(relPath, HARD_IGNORE_DIR_PATTERNS)) {
        skipped.push({ relPath, reason: 'archivo dentro de directorio ignorado' });
        continue;
      }
      if (outputAbs && path.resolve(fullPath) === outputAbs) {
        skipped.push({ relPath, reason: 'archivo de salida' });
        continue;
      }

      const ext = path.extname(entry.name).toLowerCase();
      if (!profile.exts.includes(ext)) {
        skipped.push({ relPath, reason: 'extensión no incluida' });
        continue;
      }

      if (profile.label === 'Frontend React / Vite' && ext === '.json' && !options.includeJsonData && !isFrontendConfigJson(relPath)) {
        skipped.push({ relPath, reason: 'json de datos omitido en perfil react' });
        continue;
      }

      if (matchesAny(relPath, COMMON_IGNORE_FILE_PATTERNS)) {
        skipped.push({ relPath, reason: 'archivo binario/minificado/lock ignorado' });
        continue;
      }
      if (!options.includeTests && matchesAny(relPath, TEST_PATTERNS)) {
        skipped.push({ relPath, reason: 'test omitido' });
        continue;
      }
      if (!options.includeStories && matchesAny(relPath, STORY_PATTERNS)) {
        skipped.push({ relPath, reason: 'story omitida' });
        continue;
      }
      if (!options.includeGenerated && matchesAny(relPath, GENERATED_PATTERNS)) {
        skipped.push({ relPath, reason: 'generado omitido' });
        continue;
      }
      if (options.includePatterns.length > 0 && !matchesAny(relPath, options.includePatterns)) {
        skipped.push({ relPath, reason: 'no coincide con include' });
        continue;
      }
      if (matchesAny(relPath, options.excludePatterns)) {
        skipped.push({ relPath, reason: 'excluido por patrón' });
        continue;
      }

      included.push(fullPath);
    }
  }

  visit(rootDir);
  return { included, skipped };
}

function sortFiles(files, rootDir, profile) {
  return [...files].sort((a, b) => {
    const relA = normalizeRel(rootDir, a);
    const relB = normalizeRel(rootDir, b);
    const priorityA = getPriority(relA, profile);
    const priorityB = getPriority(relB, profile);
    if (priorityA !== priorityB) return priorityA - priorityB;
    const depthA = relA.split('/').length;
    const depthB = relB.split('/').length;
    if (depthA !== depthB) return depthA - depthB;
    return relA.localeCompare(relB, undefined, { sensitivity: 'base' });
  });
}

function buildIncludedTree(rootDir, files, maxDepth) {
  const root = {};
  for (const file of files) {
    const parts = normalizeRel(rootDir, file).split('/');
    let node = root;
    parts.forEach((part, index) => {
      if (index >= maxDepth) {
        node['…'] = node['…'] || {};
        return;
      }
      node[part] = node[part] || {};
      node = node[part];
    });
  }

  function render(node, prefix = '') {
    const keys = Object.keys(node).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
    const lines = [];
    keys.forEach((key, index) => {
      const isLast = index === keys.length - 1;
      lines.push(`${prefix}${isLast ? '└── ' : '├── '}${key}`);
      const child = node[key];
      if (Object.keys(child).length > 0 && key !== '…') {
        lines.push(...render(child, prefix + (isLast ? '    ' : '│   ')));
      }
    });
    return lines;
  }

  return render(root);
}

function summarizeSkipped(skipped) {
  const counts = new Map();
  for (const item of skipped) {
    counts.set(item.reason, (counts.get(item.reason) || 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
}

function buildMarkdown({ rootDir, profileName, profile, files, skipped, options }) {
  const now = new Date().toISOString();
  const rootLabel = path.basename(rootDir);
  const maxFileKb = options.mode === 'full' && !options.maxFileKbUser ? 2048 : options.maxFileKb;
  const maxTotalKb = options.mode === 'full' && !options.maxTotalKbUser ? Number.POSITIVE_INFINITY : options.maxTotalKb;
  const treeLines = buildIncludedTree(rootDir, files, options.treeDepth);
  const skippedSummary = summarizeSkipped(skipped);
  const output = [];
  const fileRows = [];
  const omittedByBudget = [];
  let totalIncludedContentKb = 0;
  let totalOriginalKb = 0;

  output.push(`# Contexto para IA — ${profile.label}`);
  output.push('');
  output.push(`> Generado con \`ai-context-pack.mjs v${VERSION}\`.`);
  output.push('');
  output.push('## Cómo usar este archivo con un proveedor de IA');
  output.push('');
  output.push('- Usa las rutas relativas como referencia; no asumas archivos que no estén listados.');
  output.push('- Prioriza la tabla de archivos y los símbolos antes de proponer cambios.');
  output.push('- Cuando sugieras modificaciones, menciona la ruta exacta del archivo afectado.');
  output.push('- Los secretos, tokens y cadenas largas se redactan automáticamente salvo que se use `--no-redact`.');
  output.push('');
  output.push('## Metadatos');
  output.push('');
  output.push(`- **Carpeta base:** \`${normalizePath(rootLabel)}\``);
  output.push(`- **Perfil:** \`${profileName}\``);
  output.push(`- **Modo:** \`${options.mode}\``);
  output.push(`- **Fecha generación:** \`${now}\``);
  output.push(`- **Extensiones incluidas:** \`${profile.exts.join(', ')}\``);
  output.push(`- **Archivos candidatos incluidos:** \`${files.length}\``);
  output.push(`- **Límite por archivo:** \`${Number.isFinite(maxFileKb) ? `${maxFileKb} KB` : 'sin límite'}\``);
  output.push(`- **Límite total de contenido:** \`${Number.isFinite(maxTotalKb) ? `${maxTotalKb} KB` : 'sin límite'}\``);
  output.push('');
  output.push('## Estructura incluida');
  output.push('');
  output.push('```text');
  output.push(rootLabel);
  output.push(...treeLines);
  output.push('```');
  output.push('');
  output.push('## Archivos incluidos');
  output.push('');
  output.push('| # | Ruta | Lenguaje | Líneas | KB original | Estado |');
  output.push('|---:|---|---|---:|---:|---|');

  const contentSections = [];

  files.forEach((file, index) => {
    const relPath = normalizeRel(rootDir, file);
    const ext = path.extname(file).toLowerCase();
    const language = LANGUAGE_BY_EXT[ext] || 'text';
    const originalKb = fileSizeKb(file);
    totalOriginalKb += originalKb;

    let raw = '';
    let readError = null;
    try {
      raw = fs.readFileSync(file, 'utf8');
    } catch (error) {
      readError = error instanceof Error ? error.message : String(error);
    }

    if (readError) {
      fileRows.push(`| ${index + 1} | \`${relPath}\` | ${language} | 0 | ${originalKb.toFixed(1)} | error lectura |`);
      contentSections.push(`\n<a id="file-${String(index + 1).padStart(4, '0')}"></a>\n\n### ${String(index + 1).padStart(4, '0')} — \`${relPath}\`\n\n> ERROR: no se pudo leer el archivo. ${readError}\n`);
      return;
    }

    if (!options.includeGenerated && isLikelyGenerated(raw, relPath)) {
      skipped.push({ relPath, reason: 'generado detectado por contenido' });
      fileRows.push(`| ${index + 1} | \`${relPath}\` | ${language} | ${countLines(raw)} | ${originalKb.toFixed(1)} | omitido generado |`);
      return;
    }

    if (isLikelyMinified(raw)) {
      skipped.push({ relPath, reason: 'minificado detectado por contenido' });
      fileRows.push(`| ${index + 1} | \`${relPath}\` | ${language} | ${countLines(raw)} | ${originalKb.toFixed(1)} | omitido minificado |`);
      return;
    }

    let content = normalizeContent(raw);
    if (options.redact) content = redactSecrets(content);
    if (options.stripComments) content = stripCommentsForAi(content, ext);

    const symbols = options.symbols ? extractSymbols(content, ext) : [];
    const lineCount = countLines(content);
    const originalHash = hashContent(raw);

    const currentBudgetKb = Buffer.byteLength(content, 'utf8') / 1024;

    if (options.mode === 'summary') {
      fileRows.push(`| ${index + 1} | \`${relPath}\` | ${language} | ${lineCount} | ${originalKb.toFixed(1)} | resumen/símbolos |`);
      const section = [];
      section.push(`\n<a id="file-${String(index + 1).padStart(4, '0')}"></a>`);
      section.push('');
      section.push(`### ${String(index + 1).padStart(4, '0')} — \`${relPath}\``);
      section.push('');
      section.push(`- **Lenguaje:** \`${language}\``);
      section.push(`- **Líneas:** \`${lineCount}\``);
      section.push(`- **Tamaño original:** \`${originalKb.toFixed(1)} KB\``);
      section.push(`- **SHA1 corto:** \`${originalHash}\``);
      section.push(`- **Estado:** \`resumen/símbolos\``);
      if (symbols.length > 0) {
        section.push(`- **Símbolos detectados:** ${symbols.map((item) => `\`${item}\``).join(', ')}`);
      } else {
        section.push('- **Símbolos detectados:** ninguno con las reglas actuales.');
      }
      section.push('');
      section.push('> Contenido omitido por `--mode summary`. Usa `--mode compact` para incluir código.');
      contentSections.push(section.join('\n'));
      return;
    }

    if (totalIncludedContentKb >= maxTotalKb) {
      omittedByBudget.push(relPath);
      fileRows.push(`| ${index + 1} | \`${relPath}\` | ${language} | ${lineCount} | ${originalKb.toFixed(1)} | omitido por presupuesto total |`);
      return;
    }

    const remainingTotalKb = Number.isFinite(maxTotalKb) ? Math.max(0, maxTotalKb - totalIncludedContentKb) : Number.POSITIVE_INFINITY;
    if (Number.isFinite(remainingTotalKb) && remainingTotalKb < 1) {
      omittedByBudget.push(relPath);
      fileRows.push(`| ${index + 1} | \`${relPath}\` | ${language} | ${lineCount} | ${originalKb.toFixed(1)} | omitido por presupuesto total |`);
      return;
    }

    const effectiveMaxFileKb = Number.isFinite(maxTotalKb) ? Math.min(maxFileKb, remainingTotalKb) : maxFileKb;
    const minChars = Number.isFinite(maxTotalKb) && remainingTotalKb < 2 ? 0 : 1000;
    const truncatedResult = truncateMiddle(content, effectiveMaxFileKb, { minChars });
    content = truncatedResult.content;
    const includedKb = Buffer.byteLength(content, 'utf8') / 1024;
    if (Number.isFinite(maxTotalKb) && totalIncludedContentKb + includedKb > maxTotalKb + 1) {
      omittedByBudget.push(relPath);
      fileRows.push(`| ${index + 1} | \`${relPath}\` | ${language} | ${lineCount} | ${originalKb.toFixed(1)} | omitido por presupuesto total |`);
      return;
    }
    totalIncludedContentKb += includedKb;

    const status = truncatedResult.truncated ? `truncado ${includedKb.toFixed(1)} KB` : 'completo';
    fileRows.push(`| ${index + 1} | \`${relPath}\` | ${language} | ${lineCount} | ${originalKb.toFixed(1)} | ${status} |`);

    const section = [];
    section.push(`\n<a id="file-${String(index + 1).padStart(4, '0')}"></a>`);
    section.push('');
    section.push(`### ${String(index + 1).padStart(4, '0')} — \`${relPath}\``);
    section.push('');
    section.push(`- **Lenguaje:** \`${language}\``);
    section.push(`- **Líneas:** \`${lineCount}\``);
    section.push(`- **Tamaño original:** \`${originalKb.toFixed(1)} KB\``);
    section.push(`- **SHA1 corto:** \`${originalHash}\``);
    section.push(`- **Estado:** \`${status}\``);
    if (symbols.length > 0) {
      section.push(`- **Símbolos detectados:** ${symbols.map((item) => `\`${item}\``).join(', ')}`);
    }
    section.push('');
    section.push(`\`\`\`${language}`);
    section.push(content.replace(/```/g, '``\u200b`'));
    section.push('```');
    contentSections.push(section.join('\n'));
  });

  output.push(...fileRows);
  output.push('');
  output.push('## Resumen de exclusiones');
  output.push('');
  if (skippedSummary.length === 0 && omittedByBudget.length === 0) {
    output.push('- No hubo exclusiones relevantes.');
  } else {
    for (const [reason, count] of summarizeSkipped(skipped)) {
      output.push(`- **${reason}:** ${count}`);
    }
    if (omittedByBudget.length > 0) {
      output.push(`- **omitidos por presupuesto total:** ${omittedByBudget.length}`);
    }
  }
  output.push('');
  output.push('## Totales');
  output.push('');
  output.push(`- **KB originales candidatos:** \`${totalOriginalKb.toFixed(1)}\``);
  output.push(`- **KB incluidos en contenido:** \`${totalIncludedContentKb.toFixed(1)}\``);
  output.push(`- **Comentarios reducidos:** \`${options.stripComments ? 'activa' : 'desactivada'}\``);
  output.push(`- **JSON de datos en React:** \`${options.includeJsonData ? 'incluido' : 'omitido por defecto'}\``);
  output.push(`- **Redacción de secretos:** \`${options.redact ? 'activa' : 'desactivada'}\``);
  output.push('');
  output.push('---');
  output.push('');
  output.push('# Contenido consolidado');
  output.push(...contentSections);
  output.push('');
  output.push('---');
  output.push('');
  output.push('## Prompt sugerido para IA');
  output.push('');
  output.push('```text');
  output.push('Analiza este contexto de proyecto. Primero identifica arquitectura, rutas críticas, dependencias y posibles riesgos. Luego responde únicamente con cambios accionables, citando rutas relativas exactas. No inventes archivos no presentes en la tabla. Si falta contexto, indícalo explícitamente.');
  output.push('```');
  output.push('');

  return output.join('\n');
}

function main() {
  let parsed;
  try {
    parsed = parseArgs(process.argv.slice(2));
  } catch (error) {
    console.error(error.message);
    printUsage();
    process.exit(1);
  }

  const { positional, flags } = parsed;
  if (flags.help) {
    printUsage();
    process.exit(0);
  }

  const inputFolder = positional[0];
  if (!inputFolder) {
    printUsage();
    process.exit(1);
  }

  const profile = PROFILE_CONFIG[flags.profile];
  if (!profile) {
    console.error(`Perfil no soportado: ${flags.profile}`);
    console.error(`Perfiles disponibles: ${Object.keys(PROFILE_CONFIG).filter((key) => PROFILE_CONFIG[key]).join(', ')}`);
    process.exit(1);
  }

  const rootDir = path.resolve(inputFolder);
  if (!fs.existsSync(rootDir) || !fs.statSync(rootDir).isDirectory()) {
    console.error(`La carpeta no existe o no es válida: ${rootDir}`);
    process.exit(1);
  }

  let outputFile = positional[1] || profile.defaultOutput;
  if (!outputFile.toLowerCase().endsWith('.md')) {
    outputFile = outputFile.replace(/\.[^.]+$/, '') + '.md';
  }

  const options = {
    mode: ['full', 'summary'].includes(flags.mode) ? flags.mode : 'compact',
    maxFileKb: Number.isFinite(flags.maxFileKb) ? flags.maxFileKb : profile.defaultMaxFileKb,
    maxTotalKb: Number.isFinite(flags.maxTotalKb) ? flags.maxTotalKb : profile.defaultMaxTotalKb,
    maxFiles: Number.isFinite(flags.maxFiles) ? flags.maxFiles : Number.POSITIVE_INFINITY,
    maxFileKbUser: Number.isFinite(flags.maxFileKb),
    maxTotalKbUser: Number.isFinite(flags.maxTotalKb),
    includePatterns: flags.include.map(normalizePath),
    excludePatterns: flags.exclude.map(normalizePath),
    includeTests: flags.includeTests,
    includeStories: flags.includeStories,
    includeGenerated: flags.includeGenerated,
    includeJsonData: flags.includeJsonData,
    stripComments: flags.stripComments,
    redact: flags.redact,
    symbols: flags.symbols,
    treeDepth: Number.isFinite(flags.treeDepth) ? flags.treeDepth : 7,
    outputFile
  };

  console.log(`Escaneando: ${rootDir}`);
  console.log(`Perfil: ${flags.profile} (${profile.label})`);
  console.log(`Salida: ${path.resolve(outputFile)}`);

  const result = walkFiles(rootDir, profile, options);
  let files = sortFiles(result.included, rootDir, profile);
  const filesBeforeMaxFiles = files.length;
  if (Number.isFinite(options.maxFiles) && files.length > options.maxFiles) {
    for (const extra of files.slice(options.maxFiles)) {
      result.skipped.push({ relPath: normalizeRel(rootDir, extra), reason: 'omitido por max-files' });
    }
    files = files.slice(0, options.maxFiles);
  }

  if (files.length === 0) {
    console.error('No se encontraron archivos para el perfil indicado.');
    process.exit(1);
  }

  const markdown = buildMarkdown({
    rootDir,
    profileName: flags.profile,
    profile,
    files,
    skipped: result.skipped,
    options
  });

  fs.writeFileSync(outputFile, markdown, 'utf8');

  const sizeKb = Buffer.byteLength(markdown, 'utf8') / 1024;
  console.log(`Archivo generado correctamente: ${path.resolve(outputFile)}`);
  console.log(`Archivos candidatos: ${files.length}${filesBeforeMaxFiles !== files.length ? ` de ${filesBeforeMaxFiles}` : ''}`);
  console.log(`Tamaño final: ${sizeKb.toFixed(1)} KB`);
  const largest = files
    .map((file) => ({ rel: normalizeRel(rootDir, file), kb: fileSizeKb(file) }))
    .sort((a, b) => b.kb - a.kb)
    .slice(0, 8);
  if (largest.length > 0) {
    console.log('Archivos más pesados considerados:');
    for (const item of largest) console.log(`  - ${item.kb.toFixed(1)} KB  ${item.rel}`);
  }
}

main();
