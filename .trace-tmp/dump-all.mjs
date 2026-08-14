import { chromium } from '@playwright/test';

const route = process.argv[2] || '/runtime/form';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 1200 } });
await page.goto('http://localhost:5174' + route);
await page.waitForTimeout(3500);

const info = await page.evaluate(() => {
  const root = document.querySelector('.sisad-pdfme-lab-runtime-host') || document.body;
  return Array.from(root.querySelectorAll('*'))
    .filter((n) => {
      const ds = n.dataset || {};
      return (
        n.getAttribute('contenteditable') !== null ||
        ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].includes(n.tagName) ||
        ds.schemaFamily ||
        ds.renderMode
      );
    })
    .map((n) => {
      const r = n.getBoundingClientRect();
      return {
        id: n.id || null,
        tag: n.tagName,
        family: n.dataset?.schemaFamily || null,
        mode: n.dataset?.renderMode || null,
        type: n.getAttribute('type'),
        y: Math.round(r.y),
        x: Math.round(r.x),
        text: (n.textContent || n.value || '').trim().slice(0, 24),
      };
    })
    .filter((n) => n.id || n.family || n.tag === 'SELECT' || n.tag === 'INPUT');
});
console.log(JSON.stringify(info, null, 1));
await browser.close();
