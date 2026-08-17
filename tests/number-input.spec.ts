import { expect, test, type Page } from '@playwright/test';

/**
 * Entrada del schema `number` en el Form.
 *
 * El campo es un `contenteditable` compartido con `text`, así que sin el guard
 * de `beforeinput` acepta cualquier carácter y solo lo rechaza al confirmar.
 * Aquí se comprueba lo que el usuario ve mientras escribe, no solo el valor
 * final.
 *
 * El campo del LAB llega con `format: 'free'`, así que también sirve para fijar
 * que la moneda es opt-in.
 */
const NUMBER = '#text-number-1';
const TEXT = '#text-text-0';

const clear = async (page: Page, selector: string) => {
  const loc = page.locator(selector);
  await loc.fill('');
};

/** Escribe sin salir del campo: deja ver el draft antes de que se confirme. */
const typeInto = async (page: Page, selector: string, value: string) => {
  const loc = page.locator(selector);
  await clear(page, selector);
  await loc.pressSequentially(value);
};

test.beforeEach(async ({ page }) => {
  await page.goto('/runtime/form');
  await page.waitForSelector(NUMBER);
});

test('no deja teclear caracteres alfabéticos', async ({ page }) => {
  await typeInto(page, NUMBER, 'abc');
  await expect(page.locator(NUMBER)).toHaveText('');
});

test('descarta las letras intercaladas y conserva los dígitos', async ({ page }) => {
  await typeInto(page, NUMBER, '12a3b');
  await expect(page.locator(NUMBER)).toHaveText('123');
});

test('acepta la coma decimal y la canonicaliza al confirmar', async ({ page }) => {
  await typeInto(page, NUMBER, '12,50');
  await expect(page.locator(NUMBER)).toHaveText('12,50');

  await page.locator(NUMBER).blur();
  await expect(page.locator(NUMBER)).toHaveText('12.5');
});

test('acepta el punto decimal igual que la coma', async ({ page }) => {
  await typeInto(page, NUMBER, '0.25');
  await page.locator(NUMBER).blur();
  await expect(page.locator(NUMBER)).toHaveText('0.25');
});

test('el navegador filtra separadores decimales repetidos', async ({ page }) => {
  await typeInto(page, NUMBER, '12,5,7');
  await expect(page.locator(NUMBER)).toHaveText('12,57');
});

test('permite el signo negativo', async ({ page }) => {
  await typeInto(page, NUMBER, '-7');
  await page.locator(NUMBER).blur();
  await expect(page.locator(NUMBER)).toHaveText('-7');
});

test('no admite símbolos de moneda mientras el formato sea libre', async ({ page }) => {
  await typeInto(page, NUMBER, '$100');
  await expect(page.locator(NUMBER)).toHaveText('100');
});

test('el cero sigue siendo un valor válido', async ({ page }) => {
  await typeInto(page, NUMBER, '0');
  await page.locator(NUMBER).blur();
  await expect(page.locator(NUMBER)).toHaveText('0');
});

test('el filtro no afecta a los campos de texto vecinos', async ({ page }) => {
  await typeInto(page, TEXT, 'texto libre');
  await page.locator(TEXT).blur();
  await expect(page.locator(TEXT)).toHaveText('texto libre');
});

test('borrar sigue funcionando con el filtro activo', async ({ page }) => {
  await typeInto(page, NUMBER, '123');
  await page.locator(NUMBER).press('Backspace');
  await expect(page.locator(NUMBER)).toHaveText('12');

  await page.locator(NUMBER).blur();
  await expect(page.locator(NUMBER)).toHaveText('12');
});
