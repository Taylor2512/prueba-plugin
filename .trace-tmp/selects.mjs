import { chromium } from '@playwright/test';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 1200 } });
await page.goto('http://localhost:5174/runtime/form');
await page.waitForSelector('#text-text-0');
await page.waitForTimeout(2500);
const info = await page.evaluate(() => {
  const host = document.querySelector('.sisad-pdfme-lab-runtime-host');
  return Array.from(document.querySelectorAll('select')).map((s, i) => ({
    i,
    inHost: host ? host.contains(s) : null,
    family: s.closest('[data-schema-family]')?.dataset.schemaFamily || null,
    options: Array.from(s.options).map((o) => o.value).slice(0, 5),
    value: s.value,
    cls: (s.className || '').slice(0, 40),
  }));
});
console.log(JSON.stringify(info, null, 1));
await browser.close();
