import { expect, test } from '@playwright/test';

/**
 * Repro del incidente P0 "selective sibling rollback".
 *
 * Campos reales de /runtime/form (identificados desde el DOM vivo, no por
 * posición visual):
 *
 *   A = #text-text-0        type=text        uid=text-0        fila 1
 *   B = #text-number-1      type=number      uid=number-1      fila 1
 *   C = #text-fullName-2    type=fullName    uid=fullName-2    fila 1
 *   D = #text-company-4     type=company     uid=company-4     fila 2
 *
 * A y B son plugins propios; C y D son presets `textLike`. El patrón
 * "selectivo" del vídeo sigue el tipo de schema, no la posición.
 */

const A = '#text-text-0';
const B = '#text-number-1';
const C = '#text-fullName-2';
const D = '#text-company-4';

const setValue = async (page: import('@playwright/test').Page, selector: string, value: string) => {
  const field = page.locator(selector);
  await field.click();
  await page.keyboard.press('ControlOrMeta+a');
  await page.keyboard.type(value);
  await page.locator('body').click({ position: { x: 5, y: 5 } });
};

test('editar A no borra los valores de sus siblings C y D', async ({ page }) => {
  await page.goto('/runtime/form');
  await page.waitForSelector(A);

  await setValue(page, A, '3');
  await setValue(page, B, '33');
  await setValue(page, C, '3333');
  await setValue(page, D, '333');

  // Estado visual correcto antes de reeditar A.
  await expect(page.locator(A)).toHaveText('3');
  await expect(page.locator(B)).toHaveText('33');
  await expect(page.locator(C)).toHaveText('3333');
  await expect(page.locator(D)).toHaveText('333');

  // El gesto del vídeo: volver a A y añadir un carácter.
  await page.locator(A).click();
  await page.keyboard.press('End');
  await page.keyboard.type('3');
  await page.locator('body').click({ position: { x: 5, y: 5 } });

  await expect(page.locator(A)).toHaveText('33');
  await expect(page.locator(B)).toHaveText('33');
  await expect(page.locator(C)).toHaveText('3333');
  await expect(page.locator(D)).toHaveText('333');
});
