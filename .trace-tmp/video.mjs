import { chromium } from '@playwright/test';

const IDS = ['text-text-0', 'text-number-1', 'text-fullName-2', 'text-emailAddress-3', 'text-company-4', 'text-title-5'];

const dom = (page) =>
  page.evaluate((ids) => Object.fromEntries(ids.map((id) => [id, document.getElementById(id)?.textContent ?? '<missing>'])), IDS);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 1200 } });
await page.goto('http://localhost:5174/runtime/form');
await page.waitForSelector('#' + IDS[0]);
await page.waitForTimeout(1500);

// El usuario del vídeo ya había tocado los selects antes de escribir.
await page.locator('.sisad-pdfme-lab-runtime-host select').nth(0).selectOption({ index: 1 });
await page.waitForTimeout(500);
console.log('tras tocar select :', JSON.stringify(await dom(page)));

const write = async (id, value) => {
  const el = page.locator('#' + id);
  await el.click({ timeout: 4000 }).catch(() => console.log('  !! click falló (nodo detached):', id));
  await page.keyboard.press('ControlOrMeta+a');
  await page.keyboard.type(value, { delay: 40 });
  await page.waitForTimeout(400);
  console.log(`escrito ${id}=${value}`.padEnd(34), JSON.stringify(await dom(page)));
};

await write(IDS[0], '3');
await write(IDS[1], '33');
await write(IDS[2], '3333');
await write(IDS[4], '333');

await page.locator('body').click({ position: { x: 5, y: 5 } });
await page.waitForTimeout(600);
console.log('tras blur         :', JSON.stringify(await dom(page)));

await write(IDS[0], '33');
await page.waitForTimeout(800);
console.log('FINAL             :', JSON.stringify(await dom(page)));

await browser.close();
