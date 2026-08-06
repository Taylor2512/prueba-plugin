#!/usr/bin/env node

/**
 * Analiza qué archivos en /pages pueden ser eliminados de forma segura.
 * Verifica dependencias y referencias antes de sugerir eliminación.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const pagesDir = path.join(__dirname, '../pages');

const filesToAnalyze = [
  'DesignerSingleUserPage.jsx',
  'DesignerMultiUserPage.jsx',
  'RuntimeFormPage.jsx',
  'RuntimeViewerPage.jsx',
  'DesignerSingleUserInfo.jsx',
  'DesignerMultiUserInfo.jsx',
  'RuntimeFormInfo.jsx',
  'RuntimeViewerInfo.jsx',
  'SchemaFamilyInfo.jsx',
  'PageFactory.jsx',
];

function isFileImported(filename) {
  const examplesDir = path.join(__dirname, '..');

  try {
    const grep = execSync(
      `grep -r "import.*from.*['\\\"].*${filename.replace(/\.[^.]+$/, '')}['\\\"]" ${examplesDir}`,
      { encoding: 'utf8', stdio: 'pipe' }
    );
    return grep.split('\n').filter(line => line.trim()).map(line => {
      const [file] = line.split(':');
      return file.replace(examplesDir, '');
    });
  } catch {
    return [];
  }
}

function analyzeFile(filename) {
  const filePath = path.join(pagesDir, filename);

  if (!fs.existsSync(filePath)) {
    return { status: 'NOT_FOUND', filename };
  }

  const imports = isFileImported(filename);
  const isImported = imports.length > 0;

  let status = 'SAFE_TO_DELETE';
  let reason = 'Not imported anywhere';

  if (isImported) {
    // Verificar si los imports son solo de generatePages (que también se está consolidando)
    const dangerousImports = imports.filter(imp => !imp.includes('generatePages'));
    if (dangerousImports.length > 0) {
      status = 'DEPENDENCIES_FOUND';
      reason = `Imported from: ${dangerousImports.join(', ')}`;
    } else {
      status = 'SAFE_TO_DELETE';
      reason = 'Only imported from generatePages (which is consolidating)';
    }
  }

  return { filename, status, reason, imports };
}

// Main analysis
console.log('\n📊 ANÁLISIS DE CONSOLIDACIÓN DE ARCHIVOS EN /pages\n');
console.log('═'.repeat(80) + '\n');

const results = {
  safe: [],
  dependencies: [],
  notFound: [],
};

filesToAnalyze.forEach(filename => {
  const analysis = analyzeFile(filename);

  if (analysis.status === 'SAFE_TO_DELETE') {
    results.safe.push(analysis);
    console.log(`✅ ${filename}`);
    console.log(`   Razón: ${analysis.reason}`);
    console.log();
  } else if (analysis.status === 'DEPENDENCIES_FOUND') {
    results.dependencies.push(analysis);
    console.log(`⚠️  ${filename}`);
    console.log(`   Razón: ${analysis.reason}`);
    console.log(`   Ubicaciones: ${analysis.imports.join(', ')}`);
    console.log();
  } else {
    results.notFound.push(analysis);
    console.log(`❓ ${filename} - No encontrado\n`);
  }
});

console.log('═'.repeat(80) + '\n');
console.log('RESUMEN:\n');
console.log(`✅ Seguros de eliminar: ${results.safe.length} archivos`);
results.safe.forEach(f => console.log(`   - ${f.filename}`));
console.log();

if (results.dependencies.length > 0) {
  console.log(`⚠️  Requieren revisión: ${results.dependencies.length} archivos`);
  results.dependencies.forEach(f => {
    console.log(`   - ${f.filename}`);
    console.log(`     → Actualizar importes en: ${f.imports.join(', ')}`);
  });
  console.log();
}

console.log(`💡 Consejo: Actualiza los importes de los archivos ⚠️  antes de eliminarlos.\n`);

// Generar script de eliminación
const safeFiles = results.safe.map(f => `src/examples/pages/${f.filename}`).join('\n');
if (results.safe.length > 0) {
  console.log('🗑️  Script de eliminación (copiar y ejecutar después de actualizar importes):\n');
  console.log('```bash');
  console.log('rm \\');
  results.safe.forEach((f, idx) => {
    const isLast = idx === results.safe.length - 1;
    console.log(`  src/examples/pages/${f.filename}${isLast ? '' : ' \\'}`);
  });
  console.log('```\n');
}

console.log('═'.repeat(80) + '\n');
