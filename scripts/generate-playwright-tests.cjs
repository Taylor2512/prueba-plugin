#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const src = path.join(root, 'src');
const out = path.join(root, 'tests', 'playwright');

function ensure(dir){ if(!fs.existsSync(dir)) fs.mkdirSync(dir, {recursive:true}); }
ensure(out);

function isComponentFile(name){
  return /\.(jsx|tsx|ts|js)$/.test(name);
}

function relativeSpecPath(file){
  const rel = path.relative(src, file);
  const spec = rel.replace(/\.(jsx|tsx|ts|js)$/, '.spec.ts');
  return spec;
}

function template(relPath){
  const title = relPath.replace(/\//g, ' - ');
  return `import { test, expect } from '@playwright/test';

test.describe('${title}', ()=>{
  test('${path.basename(relPath)} renders', async ({ page }) => {
    await page.goto(process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5174');
    // TODO: navigate to the route or mount the component
    // Example: await page.click('text=Open Designer');
    expect(true).toBeTruthy();
  });
});
`;
}

function walk(dir){
  for(const name of fs.readdirSync(dir)){
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if(st.isDirectory()) walk(p);
    else if(isComponentFile(name)){
      const specRel = relativeSpecPath(p);
      const outPath = path.join(out, specRel);
      ensure(path.dirname(outPath));
      if(fs.existsSync(outPath)) continue; // don't overwrite
      fs.writeFileSync(outPath, template(specRel), 'utf8');
      console.log('Created', path.relative(root, outPath));
    }
  }
}

walk(src);
console.log('Playwright skeleton generation complete');

// add a few higher-level spec skeletons if they don't exist
const outDir = out;
function ensureDir(p){ if(!fs.existsSync(p)) fs.mkdirSync(p, {recursive:true}); }
ensureDir(outDir);

const specs = {
  'pdfme-editor.spec.ts': `import { test, expect } from '@playwright/test';

test('editor loads', async ({ page }) => {
  await page.goto(process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5174');
  await expect(page).toHaveTitle(/SisadBeta|PDF/);
});
`,

  'canvas-interactions.spec.ts': `import { test, expect } from '@playwright/test';

test('canvas basic interactions', async ({ page }) => {
  await page.goto((process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5174') + '/lab/multi-document-routing');
  // TODO: add selectors and interaction steps
  await expect(page.locator('body')).toBeVisible();
});
`,

  'schema-transform.spec.ts': `import { test, expect } from '@playwright/test';

test('schema transform flow', async ({ page }) => {
  await page.goto((process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5174') + '/lab/multi-document-routing');
  // TODO: simulate schema transform
  await expect(page.locator('text=Schema')).toBeVisible();
});
`,

  'checkbox-group-docusign-behavior.spec.ts': `import { test, expect } from '@playwright/test';

test('checkbox group behavior', async ({ page }) => {
  await page.goto((process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5174') + '/lab/multi-document-routing');
  // TODO: verify checkbox group behaviors
  await expect(page.locator('input[type="checkbox"]')).toHaveCount(0);
});
`,

  'multi-document-routing-design.spec.ts': `import { test, expect } from '@playwright/test';

test('multi-document routing design smoke', async ({ page }) => {
  await page.goto((process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5174') + '/lab/multi-document-routing');
  await expect(page).toHaveURL(/multi-document-routing/);
});
`
};

let created = 0;
for(const [name, content] of Object.entries(specs)){
  const p = path.join(outDir, name);
  if(fs.existsSync(p)) continue;
  fs.writeFileSync(p, content, 'utf8');
  created++;
}
console.log('Playwright spec skeletons created:', created);
