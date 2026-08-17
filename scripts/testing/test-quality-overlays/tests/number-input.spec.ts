import { expect, test, type Locator, type Page } from '@playwright/test';

const NUMBER = '#text-number-1';
const TEXT = '#text-text-0';
const SELECT_ALL = process.platform === 'darwin' ? 'Meta+A' : 'Control+A';

const editable = async (page: Page, selector: string): Promise<Locator> => {
  const field = page.locator(selector);
  await expect(field).toBeVisible();
  await expect(field).toBeEditable();
  return field;
};

const clear = async (page: Page, selector: string): Promise<Locator> => {
  const field = await editable(page, selector);
  await field.click();
  await field.press(SELECT_ALL);
  await field.press('Backspace');
  await expect(field).toHaveText('');
  return field;
};

const typeInto = async (page: Page, selector: string, value: string): Promise<Locator> => {
  const field = await clear(page, selector);
  await field.pressSequentially(value);
  return field;
};

const commit = async (field: Locator) => field.blur();

test.beforeEach(async ({ page }) => {
  await page.goto('/runtime/form');
  await expect(page.locator(NUMBER)).toBeVisible();
});

test('control positivo: acepta dígitos y demuestra que el teclado está operativo', async ({ page }) => {
  const field = await typeInto(page, NUMBER, '123');
  await expect(field).toHaveText('123');
});

test('rechaza letras sin falso positivo de campo inoperante', async ({ page }) => {
  const field = await typeInto(page, NUMBER, 'abc1def2');
  await expect(field).toHaveText('12');
  await clear(page, NUMBER);
  await field.pressSequentially('abc');
  await expect(field).toHaveText('');
});

test('descarta letras intercaladas y conserva los dígitos', async ({ page }) => {
  const field = await typeInto(page, NUMBER, '12a3b');
  await expect(field).toHaveText('123');
});

test('acepta coma decimal como draft y canonicaliza al confirmar', async ({ page }) => {
  const field = await typeInto(page, NUMBER, '12,50');
  await expect(field).toHaveText('12,50');
  await commit(field);
  await expect(field).toHaveText('12.5');
});

test('acepta punto decimal y conserva semántica al confirmar', async ({ page }) => {
  const field = await typeInto(page, NUMBER, '0.25');
  await commit(field);
  await expect(field).toHaveText('0.25');
});

test('admite un único separador decimal', async ({ page }) => {
  const field = await typeInto(page, NUMBER, '12,5,7');
  await expect(field).toHaveText('12,57');
});

test('permite signo negativo cuando la policy no lo deshabilita', async ({ page }) => {
  const field = await typeInto(page, NUMBER, '-7');
  await commit(field);
  await expect(field).toHaveText('-7');
});

test('rechaza símbolo de moneda en format free y conserva la cifra', async ({ page }) => {
  const field = await typeInto(page, NUMBER, '$100');
  await expect(field).toHaveText('100');
});

test('el cero es valor válido y no se confunde con vacío', async ({ page }) => {
  const field = await typeInto(page, NUMBER, '0');
  await commit(field);
  await expect(field).toHaveText('0');
});

test('el guard numérico no afecta al TEXT vecino', async ({ page }) => {
  const text = await typeInto(page, TEXT, 'texto libre');
  await commit(text);
  await expect(text).toHaveText('texto libre');
  const number = await typeInto(page, NUMBER, '42');
  await expect(number).toHaveText('42');
  await expect(text).toHaveText('texto libre');
});

test('Backspace funciona con el guard activo', async ({ page }) => {
  const field = await typeInto(page, NUMBER, '123');
  await field.press('Backspace');
  await expect(field).toHaveText('12');
  await commit(field);
  await expect(field).toHaveText('12');
});

test('clear y retype mantienen el campo operativo', async ({ page }) => {
  const field = await typeInto(page, NUMBER, '123');
  await clear(page, NUMBER);
  await field.pressSequentially('45');
  await expect(field).toHaveText('45');
});

test('seleccionar todo y reemplazar no conserva residuos', async ({ page }) => {
  const field = await typeInto(page, NUMBER, '123');
  await field.press(SELECT_ALL);
  await field.pressSequentially('45');
  await expect(field).toHaveText('45');
});

test('editar en mitad del contenteditable respeta el caret', async ({ page }) => {
  const field = await typeInto(page, NUMBER, '123');
  await field.press('ArrowLeft');
  await field.pressSequentially('9');
  await expect(field).toHaveText('1293');
});

test('Enter no introduce saltos de línea', async ({ page }) => {
  const field = await typeInto(page, NUMBER, '12');
  await field.press('Enter');
  await expect(field).toHaveText('12');
});

test('blur y refocus preservan el valor canonicalizado', async ({ page }) => {
  const field = await typeInto(page, NUMBER, '12,50');
  await commit(field);
  await expect(field).toHaveText('12.5');
  await field.click();
  await field.press('End');
  await field.pressSequentially('0');
  await expect(field).toHaveText('12.50');
});
