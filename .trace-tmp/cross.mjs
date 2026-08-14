import { chromium } from '@playwright/test';

const IDS = ['text-text-0', 'text-number-1', 'text-fullName-2', 'text-emailAddress-3', 'text-company-4', 'text-title-5'];

const dom = (page) =>
  page.evaluate((ids) => ({
    text: Object.fromEntries(ids.map((id) => [id, document.getElementById(id)?.textContent ?? '<missing>'])),
    selects: Array.from(document.querySelectorAll('select')).map((s) => s.value),
  }), IDS);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 1200 } });
await page.goto('http://localhost:5174/runtime/form');
await page.waitForSelector('#' + IDS[0]);
await page.waitForTimeout(1500);

const write = async (id, value) => {
  await page.locator('#' + id).click();
  await page.keyboard.press('ControlOrMeta+a');
  await page.keyboard.type(value, { delay: 30 });
  await page.locator('body').click({ position: { x: 5, y: 5 } });
};

const selects = page.locator('select');
const nSelects = await selects.count();
console.log('selects encontrados:', nSelects);

console.log('inicial      :', JSON.stringify(await dom(page)));

// text -> select
await write(IDS[0], 'A1');
await selects.nth(0).selectOption({ index: 1 });
await page.waitForTimeout(300);
console.log('text->select :', JSON.stringify(await dom(page)));

// select -> text
await write(IDS[2], 'C1');
await page.waitForTimeout(300);
console.log('select->text :', JSON.stringify(await dom(page)));

// otro select, comprobando que el primero sobrevive
await selects.nth(1).selectOption({ index: 2 });
await page.waitForTimeout(300);
console.log('select2      :', JSON.stringify(await dom(page)));

// number -> volver a texto
await write(IDS[1], '99');
await write(IDS[4], 'D1');
await page.waitForTimeout(300);
console.log('final        :', JSON.stringify(await dom(page)));

await browser.close();
