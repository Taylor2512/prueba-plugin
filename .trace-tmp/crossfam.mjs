import { chromium } from '@playwright/test';
const IDS = ['text-text-0','text-number-1','text-fullName-2','text-emailAddress-3','text-company-4','text-title-5'];
const state = (page) => page.evaluate((ids) => ({
  text: Object.fromEntries(ids.map((id) => [id, document.getElementById(id)?.textContent ?? '<missing>'])),
  selects: Array.from(document.querySelectorAll('.sisad-pdfme-lab-runtime-host select')).map((s) => s.value),
  radios: Array.from(document.querySelectorAll('[role="radio"]')).map((r) => r.getAttribute('aria-checked')),
  checks: Array.from(document.querySelectorAll('[role="checkbox"]')).map((r) => r.getAttribute('aria-checked')),
}), IDS);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 1200 } });
await page.goto('http://localhost:5174/runtime/form');
await page.waitForSelector('#text-text-0');
await page.waitForTimeout(2000);
const write = async (id, v) => {
  await page.locator('#' + id).click();
  await page.keyboard.press('ControlOrMeta+a');
  await page.keyboard.type(v, { delay: 30 });
  await page.locator('body').click({ position: { x: 5, y: 5 } });
  await page.waitForTimeout(250);
};
const sel = page.locator('.sisad-pdfme-lab-runtime-host select');
console.log('inicial       :', JSON.stringify(await state(page)));
await write(IDS[0], 'A1');
await sel.nth(0).selectOption('option1'); await page.waitForTimeout(400);
console.log('text->select  :', JSON.stringify(await state(page)));
await write(IDS[2], 'C1');
console.log('select->text  :', JSON.stringify(await state(page)));
await page.locator('[role="radio"]').nth(1).click(); await page.waitForTimeout(400);
console.log('text->radio   :', JSON.stringify(await state(page)));
await page.locator('[role="checkbox"]').nth(0).click(); await page.waitForTimeout(400);
console.log('radio->check  :', JSON.stringify(await state(page)));
await write(IDS[4], 'D1');
console.log('check->text   :', JSON.stringify(await state(page)));
await write(IDS[1], '0');
console.log('cero          :', JSON.stringify(await state(page)));
await browser.close();
