import { chromium } from '@playwright/test';

const IDS = ['text-text-0', 'text-number-1', 'text-fullName-2', 'text-emailAddress-3', 'text-company-4', 'text-title-5'];

const dom = (page) =>
  page.evaluate((ids) => Object.fromEntries(ids.map((id) => [id, document.getElementById(id)?.textContent ?? '<missing>'])), IDS);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
await page.goto('http://localhost:5174/runtime/form');
await page.waitForSelector('#' + IDS[0]);
await page.waitForTimeout(1500);

const expected = {};
const failures = [];

const write = async (id, value) => {
  await page.locator('#' + id).click();
  await page.keyboard.press('ControlOrMeta+a');
  if (value === '') await page.keyboard.press('Delete');
  else await page.keyboard.type(value, { delay: 40 });
  expected[id] = value;
};

const check = async (label) => {
  await page.waitForTimeout(200);
  const actual = await dom(page);
  for (const [id, want] of Object.entries(expected)) {
    if (actual[id] !== want) {
      failures.push(`${label}: ${id} esperado="${want}" actual="${actual[id]}"`);
    }
  }
};

// 1. Sembrar los seis campos.
for (const [i, id] of IDS.entries()) await write(id, id.includes('number') ? String(100 + i) : `v${i}`);
await check('seed');

// 2. Veinte ediciones alternadas.
for (let round = 0; round < 20; round += 1) {
  const id = IDS[round % IDS.length];
  await write(id, id.includes('number') ? String(200 + round) : `r${round}`);
  await check(`alternado-${round}`);
}

// 3. Borrar y reescribir el mismo valor (dedupe por firma consecutiva).
await write(IDS[2], '');
await check('borrado-C');
await write(IDS[2], 'r14');
await check('reescritura-C');

// 4. Mismo valor en dos siblings distintos.
await write(IDS[0], 'igual');
await check('mismo-valor-A');
await write(IDS[1], '777');
await check('mismo-valor-B');

// 5. Rápido A -> C -> D -> A sin pausas.
for (const id of [IDS[0], IDS[2], IDS[4], IDS[0]]) {
  await page.locator('#' + id).click();
  await page.keyboard.press('ControlOrMeta+a');
  await page.keyboard.type(id.includes('number') ? '555' : 'fast', { delay: 5 });
  expected[id] = id.includes('number') ? '555' : 'fast';
}
await page.locator('body').click({ position: { x: 5, y: 5 } });
await check('rapido');

console.log(failures.length === 0 ? 'SIN FALLOS' : `FALLOS (${failures.length}):`);
failures.slice(0, 40).forEach((f) => console.log(' -', f));
console.log('DOM final:', JSON.stringify(await dom(page)));
await browser.close();
