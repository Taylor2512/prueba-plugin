import { chromium } from '@playwright/test';

const route = process.argv[2] || '/runtime/form';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
await page.goto('http://localhost:5174' + route);
await page.waitForTimeout(3500);

const info = await page.evaluate(() =>
  Array.from(document.querySelectorAll('[id]'))
    .filter((n) => n.getAttribute('contenteditable') !== null || ['INPUT', 'TEXTAREA', 'SELECT'].includes(n.tagName))
    .map((n) => {
      const r = n.getBoundingClientRect();
      return {
        id: n.id,
        tag: n.tagName,
        ce: n.getAttribute('contenteditable'),
        x: Math.round(r.x),
        y: Math.round(r.y),
        w: Math.round(r.width),
        text: (n.textContent || n.value || '').slice(0, 30),
      };
    }),
);
console.log(JSON.stringify(info, null, 1));
await browser.close();
