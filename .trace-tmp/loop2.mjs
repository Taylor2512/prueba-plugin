import { chromium } from '@playwright/test';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 1200 } });
await page.goto('http://localhost:5174/runtime/form');
await page.waitForSelector('#text-text-0');
await page.waitForTimeout(2000);
await page.evaluate(() => {
  window.__r = 0;
  const host = document.querySelector('.sisad-pdfme-lab-runtime-host') || document.body;
  new MutationObserver((rs) => { for (const r of rs) if (r.addedNodes.length || r.removedNodes.length) window.__r += 1; })
    .observe(host, { childList: true, subtree: true });
});
const sample = async (label) => {
  await page.evaluate(() => { window.__r = 0; });
  await page.waitForTimeout(2000);
  console.log(label.padEnd(30), await page.evaluate(() => window.__r));
};
await sample('reposo');
await page.locator('.sisad-pdfme-lab-runtime-host select').nth(0).selectOption('option1');
await sample('t+0s tras select');
await sample('t+2s');
await sample('t+4s');
await sample('t+6s');
await page.locator('#text-text-0').click();
await page.keyboard.type('x', { delay: 30 });
await page.locator('body').click({ position: { x: 5, y: 5 } });
await sample('tras escribir despues');
await browser.close();
