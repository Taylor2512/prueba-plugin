import { expect, test, type Page } from '@playwright/test';
import { abrirForm, CAMPOS } from '../../support/playwright';

/**
 * Filtro de entrada del schema `number`.
 *
 * El campo es un `contenteditable` compartido con `text`, así que sin el guard
 * de `beforeinput` acepta cualquier carácter y sólo lo rechaza al confirmar.
 * Aquí se comprueba lo que el usuario ve MIENTRAS escribe, no sólo el valor
 * final: por eso se teclea sin salir del campo y se lee el borrador antes del
 * blur.
 *
 * El campo del laboratorio llega con `format: 'free'`, así que este spec
 * también fija que la moneda es opt-in.
 */
const NUMERO = CAMPOS.number;
const TEXTO = CAMPOS.text;

/** Teclea sin salir del campo: deja ver el borrador antes de que se confirme. */
const teclear = async (page: Page, selector: string, valor: string) => {
  const campo = page.locator(selector);
  await campo.click();
  await campo.press('ControlOrMeta+a');
  await campo.press('Delete');
  await campo.pressSequentially(valor);
};

test.beforeEach(async ({ page }) => {
  await abrirForm(page, '/runtime/form');
  await expect(page.locator(NUMERO)).toBeVisible();
});

// @caso SCH-005
test('no deja teclear caracteres alfabéticos', async ({ page }) => {
  await teclear(page, NUMERO, 'abc');
  await expect(page.locator(NUMERO)).toHaveText('');
});

// @caso SCH-005
test('descarta las letras intercaladas y conserva los dígitos', async ({ page }) => {
  await teclear(page, NUMERO, '12a3b');
  await expect(page.locator(NUMERO)).toHaveText('123');
});

// @caso SCH-005
test('acepta la coma decimal y la canonicaliza al confirmar', async ({ page }) => {
  await teclear(page, NUMERO, '12,50');
  await expect(page.locator(NUMERO)).toHaveText('12,50');

  await page.locator(NUMERO).blur();
  await expect(page.locator(NUMERO)).toHaveText('12.5');
});

// @caso SCH-005
test('acepta el punto decimal igual que la coma', async ({ page }) => {
  await teclear(page, NUMERO, '0.25');
  await page.locator(NUMERO).blur();
  await expect(page.locator(NUMERO)).toHaveText('0.25');
});

// @caso SCH-005
test('el navegador filtra separadores decimales repetidos', async ({ page }) => {
  await teclear(page, NUMERO, '12,5,7');
  await expect(page.locator(NUMERO)).toHaveText('12,57');
});

// @caso SCH-005
test('permite el signo negativo', async ({ page }) => {
  await teclear(page, NUMERO, '-7');
  await page.locator(NUMERO).blur();
  await expect(page.locator(NUMERO)).toHaveText('-7');
});

// @caso SCH-005
test('no admite símbolos de moneda mientras el formato sea libre', async ({ page }) => {
  await teclear(page, NUMERO, '$100');
  await expect(page.locator(NUMERO)).toHaveText('100');
});

// @caso SCH-005
// @caso UC-21
test('el cero sigue siendo un valor válido', async ({ page }) => {
  await teclear(page, NUMERO, '0');
  await page.locator(NUMERO).blur();
  await expect(page.locator(NUMERO)).toHaveText('0');
});

// @caso SCH-004
test('el filtro no afecta a los campos de texto vecinos', async ({ page }) => {
  await teclear(page, TEXTO, 'texto libre');
  await page.locator(TEXTO).blur();
  await expect(page.locator(TEXTO)).toHaveText('texto libre');
});

// @caso SCH-005
test('borrar sigue funcionando con el filtro activo', async ({ page }) => {
  await teclear(page, NUMERO, '123');
  await page.locator(NUMERO).press('Backspace');
  await expect(page.locator(NUMERO)).toHaveText('12');

  await page.locator(NUMERO).blur();
  await expect(page.locator(NUMERO)).toHaveText('12');
});
