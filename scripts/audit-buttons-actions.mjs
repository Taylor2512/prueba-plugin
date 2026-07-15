#!/usr/bin/env node
/**
 * Audita botones/acciones de forma heurística.
 * No modifica archivos.
 */
import fs from 'node:fs';
import path from 'node:path';
import { parse } from '@babel/parser';
import traverseModule from '@babel/traverse';
const traverse = traverseModule.default ?? traverseModule;

const root = process.cwd();
const targets = [
  'src/sisad-pdfme/ui/components',
  'src/features/pdfcomponent',
];

const exts = new Set(['.tsx', '.jsx', '.ts', '.js']);
const rows = [];

const getJsxName = (name) => {
  if (!name) return '';
  if (name.type === 'JSXIdentifier') return name.name;
  if (name.type === 'JSXMemberExpression') {
    const object = getJsxName(name.object);
    const property = getJsxName(name.property);
    return object && property ? `${object}.${property}` : property || object;
  }
  return '';
};

const readAttrValue = (attr) => {
  if (!attr || attr.type !== 'JSXAttribute') return null;
  if (!attr.value) return true;
  if (attr.value.type === 'StringLiteral') return attr.value.value;
  if (attr.value.type === 'JSXExpressionContainer') {
    const expr = attr.value.expression;
    if (expr.type === 'StringLiteral') return expr.value;
    if (expr.type === 'NumericLiteral') return String(expr.value);
    if (expr.type === 'BooleanLiteral') return String(expr.value);
    if (expr.type === 'Identifier') return expr.name;
    return 'expr';
  }
  return 'expr';
};

const getAttr = (openingElement, attrName) => {
  for (const attr of openingElement.attributes ?? []) {
    if (attr.type !== 'JSXAttribute') continue;
    if (getJsxName(attr.name) === attrName) return readAttrValue(attr);
  }
  return null;
};

const hasAttr = (openingElement, attrName) => getAttr(openingElement, attrName) !== null;

const classifyRow = (row) => {
  if (row.isDuplicate) return 'DUPLICATED_ACTION';
  if (row.hasDisabledAttr && (row.hasTooltipAncestor || row.hasTitleAttr)) return 'DISABLED_WITH_REASON';
  if (row.hasRoleButton && !row.hasOnClick) return 'VISUAL_ONLY_BUT_SHOULD_BE_BUTTON';
  if (!row.hasOnClick && row.isInteractiveElement) return 'MISSING_HANDLER';
  if (row.hasOnClick && !row.hasTestId) return 'MISSING_TESTID';
  return row.hasOnClick ? 'CONNECTED' : 'MISSING_HANDLER';
};

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', 'dist', 'reports', 'test-results'].includes(entry.name)) continue;
      walk(full);
      continue;
    }
    if (!exts.has(path.extname(entry.name))) continue;
    scan(full);
  }
}

function scan(file) {
  const source = fs.readFileSync(file, 'utf8');
  let ast;
  try {
    ast = parse(source, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript', 'decorators-legacy'],
    });
  } catch {
    return;
  }

  traverse(ast, {
    JSXOpeningElement(pathNode) {
      const tagName = getJsxName(pathNode.node.name);
      const hasOnClick = hasAttr(pathNode.node, 'onClick') || hasAttr(pathNode.node, 'onPointerDown') || hasAttr(pathNode.node, 'onMouseDown');
      const hasRoleButton = getAttr(pathNode.node, 'role') === 'button';
      const isInteractiveElement = tagName === 'Button' || tagName === 'button' || hasRoleButton || hasOnClick;
      if (!isInteractiveElement) return;

      const testId = getAttr(pathNode.node, 'data-testid');
      const aria = getAttr(pathNode.node, 'aria-label') ?? getAttr(pathNode.node, 'aria-labelledby');
      const title = getAttr(pathNode.node, 'title');
      const disabled = hasAttr(pathNode.node, 'disabled') || getAttr(pathNode.node, 'aria-disabled') === 'true';
      const isDuplicate = Boolean(testId) && rows.some((row) => row.testId === testId && row.file === path.relative(root, file));
      const hasTooltipAncestor = Boolean(pathNode.findParent((ancestor) =>
        ancestor.isJSXElement() && getJsxName(ancestor.node.openingElement?.name) === 'Tooltip',
      ));

      const opening = pathNode.node;
      const startLine = opening.loc?.start.line ?? 0;
      const endLine = opening.loc?.end.line ?? startLine;
      const snippet = source.slice(opening.start ?? 0, opening.end ?? opening.start ?? 0).replace(/\s+/g, ' ').slice(0, 200);

      rows.push({
        file: path.relative(root, file),
        line: startLine,
        endLine,
        snippet,
        tagName,
        testId: testId ?? '',
        aria: aria ?? '',
        title: title ?? '',
        hasOnClick,
        hasTestId: Boolean(testId),
        hasAria: Boolean(aria),
        hasTitleAttr: Boolean(title),
        hasTooltipAncestor,
        hasDisabledAttr: disabled,
        hasRoleButton,
        isInteractiveElement,
        isDuplicate,
      });
    },
  });
}

for (const target of targets) walk(path.join(root, target));

const classified = rows.map((row) => ({ ...row, classification: classifyRow(row) }));
const summary = classified.reduce((acc, row) => {
  acc[row.classification] = (acc[row.classification] || 0) + 1;
  return acc;
}, {});

const outDir = path.join(root, 'reports', 'action-audit');
fs.mkdirSync(outDir, { recursive: true });
const out = path.join(outDir, 'button-action-inventory.md');

const md = [
  '# Button Action Inventory',
  '',
  `Total candidates: ${classified.length}`,
  '',
  '## Summary',
  '',
  '| Classification | Count |',
  '|---|---:|',
  ...Object.entries(summary)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([classification, count]) => `| ${classification} | ${count} |`),
  '',
  '## Inventory',
  '',
  '| File | Line | Classification | testId | aria | onClick | disabled | tooltip | Snippet |',
  '|---|---:|---|---|---|---:|---:|---:|---|',
  ...classified.map((r) =>
    `| \`${r.file}\` | ${r.line}${r.endLine !== r.line ? `-${r.endLine}` : ''} | ${r.classification} | ${r.testId ? `\`${r.testId}\`` : '—'} | ${r.aria ? `\`${String(r.aria).replace(/\|/g, '\\|')}\`` : '—'} | ${r.hasOnClick ? 'yes' : 'no'} | ${r.hasDisabledAttr ? 'yes' : 'no'} | ${r.hasTooltipAncestor || r.hasTitleAttr ? 'yes' : 'no'} | \`${r.snippet.replace(/\|/g, '\\|')}\` |`,
  ),
].join('\n');

fs.writeFileSync(out, md);
console.log(`Wrote ${out}`);
