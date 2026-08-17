#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs, walk, relative, testTitles } from './test-quality/core.mjs';
const {root}=parseArgs();
const files=walk(path.join(root,'tests')).filter(f=>/\.(?:spec|test)\.[cm]?[jt]sx?$/.test(f));
const classify=rel=>rel.includes('/sisad-pdfme-comprehensive/files/')||rel.endsWith('.file.test.ts')?'structural':rel.includes('/contracts/')?'contract':rel.startsWith('tests/integration/')?'integration':/\.spec\.[cm]?[jt]sx?$/.test(rel)?'browser-e2e':'unit-other';
const layers={}; let logicalCases=0, skippedMarkers=0;
for(const file of files){const rel=relative(root,file),text=fs.readFileSync(file,'utf8'),titles=testTitles(text),layer=classify(rel),skips=(text.match(/\b(?:test|it|describe)\.skip\s*\(/g)??[]).length; layers[layer]??={files:0,logicalCases:0,skippedMarkers:0}; layers[layer].files++; layers[layer].logicalCases+=titles.length; layers[layer].skippedMarkers+=skips; logicalCases+=titles.length; skippedMarkers+=skips;}
console.log(JSON.stringify({testFiles:files.length,logicalCases,skippedMarkers,layers,note:'Informational inventory only. Raw test count is not a release gate.'},null,2));
