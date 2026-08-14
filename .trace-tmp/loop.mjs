import { chromium } from '@playwright/test';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 1200 } });
await page.goto('http://localhost:5174/runtime/form');
await page.waitForSelector('#text-text-0');
await page.waitForTimeout(1500);

// Observador de mutaciones sobre el host del runtime: cuenta reconstrucciones
// del nodo de un campo cualquiera para detectar repintados en bucle.
await page.evaluate(() => {
  window.__rebuilds = 0;
  const host = document.querySelector('.sisad-pdfme-lab-runtime-host') || document.body;
  const mo = new MutationObserver((records) => {
    for (const r of records) {
      if (r.addedNodes.length || r.removedNodes.length) window.__rebuilds += 1;
    }
  });
  mo.observe(host, { childList: true, subtree: true });
});

const count = () => page.evaluate(() => window.__rebuilds);

const sample = async (label) => {
  await page.evaluate(() => { window.__rebuilds = 0; });
  await page.waitForTimeout(1500);
  console.log(label.padEnd(34), 'mutaciones en 1.5s ocioso:', await count());
};

await sample('reposo inicial');

await page.locator('#text-text-0').click();
await page.keyboard.press('ControlOrMeta+a');
await page.keyboard.type('A1', { delay: 30 });
await page.locator('body').click({ position: { x: 5, y: 5 } });
await sample('tras escribir en text');

await page.locator('.sisad-pdfme-lab-runtime-host select').nth(0).selectOption({ index: 1 });
await sample('tras cambiar el primer select');

const eventsText = await page.evaluate(() => {
  const nodes = Array.from(document.querySelectorAll('*')).filter((n) => /eventos/i.test(n.textContent || '') && n.children.length < 4);
  return nodes.slice(0, 3).map((n) => (n.textContent || '').slice(0, 120));
});
console.log('panel eventos:', JSON.stringify(eventsText));

await browser.close();
