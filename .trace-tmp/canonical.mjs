import { chromium } from '@playwright/test';

const IDS = ['text-text-0', 'text-number-1', 'text-fullName-2', 'text-emailAddress-3', 'text-company-4', 'text-title-5'];

const dom = (page) =>
  page.evaluate((ids) => Object.fromEntries(ids.map((id) => [id, document.getElementById(id)?.textContent ?? '<missing>'])), IDS);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
await page.goto('http://localhost:5174/runtime/form');
await page.waitForSelector('#' + IDS[0]);
await page.waitForTimeout(1500);

const write = async (id, value) => {
  await page.locator('#' + id).click();
  await page.keyboard.press('ControlOrMeta+a');
  await page.keyboard.type(value, { delay: 40 });
};

await write(IDS[0], '3');
await write(IDS[1], '33');
await write(IDS[2], '3333');
await write(IDS[4], '333');
await page.locator('body').click({ position: { x: 5, y: 5 } });
await page.waitForTimeout(300);

console.log('antes del repintado :', JSON.stringify(await dom(page)));

// Forzar un repintado completo desde los inputs canónicos usando el zoom.
const zoom = page.locator('select').filter({ hasText: '%' }).first();
if (await zoom.count()) {
  await zoom.selectOption({ index: 0 });
  await page.waitForTimeout(800);
  console.log('tras cambiar zoom   :', JSON.stringify(await dom(page)));
} else {
  const minus = page.getByRole('button', { name: /−|-|reducir|zoom out/i }).first();
  await minus.click();
  await page.waitForTimeout(800);
  console.log('tras zoom (boton)   :', JSON.stringify(await dom(page)));
}

await browser.close();
