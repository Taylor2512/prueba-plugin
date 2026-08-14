import { chromium } from '@playwright/test';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 1200 } });
await page.goto('http://localhost:5174/runtime/form');
await page.waitForSelector('#text-text-0');
await page.waitForTimeout(2500);
const info = await page.evaluate(() => {
  const host = document.querySelector('.sisad-pdfme-lab-runtime-host');
  return Array.from(host.querySelectorAll('[data-schema-family]')).map((n) => ({
    family: n.dataset.schemaFamily,
    selection: n.dataset.selectionMode || null,
    mode: n.dataset.renderMode || null,
    inputs: n.querySelectorAll('input').length,
    selects: n.querySelectorAll('select').length,
    roleNodes: n.querySelectorAll('[role]').length,
    html: n.innerHTML.slice(0, 160),
  })).filter((e) => e.family === 'option-based');
});
console.log(JSON.stringify(info, null, 1));
await browser.close();
