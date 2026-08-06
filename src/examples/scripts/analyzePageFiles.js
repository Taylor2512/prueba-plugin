#!/usr/bin/env node

/**
 * Resume el estado actual de src/examples/pages sin depender de nombres viejos.
 * Útil para revisar el árbol real después de consolidaciones.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pagesDir = path.join(__dirname, '../pages');

const files = fs
  .readdirSync(pagesDir)
  .filter((file) => file.endsWith('.jsx') || file.endsWith('.js'))
  .sort();

const realPages = files.filter((file) => file.endsWith('Page.jsx') || file === 'UniversalPage.jsx');
const sharedFiles = files.filter((file) => !realPages.includes(file));

console.log('\n📊 Estado actual de /src/examples/pages\n');
console.log('═'.repeat(72) + '\n');
console.log(`Total de archivos: ${files.length}\n`);
console.log('Páginas reales:');
realPages.forEach((file) => console.log(`  - ${file}`));
console.log('\nCompartidos / generadores:');
sharedFiles.forEach((file) => console.log(`  - ${file}`));
console.log('\n═'.repeat(72));
