import { chromium } from '@playwright/test';

const IDS = ['text-text-0', 'text-number-1', 'text-fullName-2', 'text-emailAddress-3', 'text-company-4', 'text-title-5'];
const A = '#text-text-0';
const B = '#text-number-1';
const C = '#text-fullName-2';
const D = '#text-company-4';

const snap = (page, label) =>
  page.evaluate(
    ([ids, lbl]) => ({
      label: lbl,
      dom: Object.fromEntries(ids.map((id) => [id, document.getElementById(id)?.textContent ?? '<missing>'])),
    }),
    [IDS, label],
  );

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
page.on('pageerror', (e) => console.log('PAGEERROR', e.message));
await page.goto('http://localhost:5174/runtime/form');
await page.waitForSelector(A);
await page.waitForTimeout(1500);

const log = [];
log.push(await snap(page, 'initial'));

// Gesto realista: click en el campo, seleccionar todo, escribir, y pasar
// directamente al siguiente campo (sin blur contra el body).
const write = async (sel, value, label) => {
  await page.locator(sel).click();
  await page.keyboard.press('ControlOrMeta+a');
  await page.keyboard.type(value, { delay: 60 });
  log.push(await snap(page, `typed ${label}=${value}`));
};

await write(A, '3', 'A');
await write(B, '33', 'B');
await write(C, '3333', 'C');
await write(D, '333', 'D');

await page.locator('body').click({ position: { x: 5, y: 5 } });
await page.waitForTimeout(300);
log.push(await snap(page, 'after blur to body'));

// El gesto del vídeo: volver a A y añadir un carácter.
await page.locator(A).click();
await page.keyboard.press('End');
await page.keyboard.type('3', { delay: 60 });
log.push(await snap(page, 'A += 3 (still focused)'));

await page.locator('body').click({ position: { x: 5, y: 5 } });
await page.waitForTimeout(500);
log.push(await snap(page, 'after blur'));

for (const entry of log) {
  console.log(entry.label.padEnd(28), JSON.stringify(entry.dom));
}
await browser.close();
