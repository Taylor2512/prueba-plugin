import { expect, test } from '@playwright/test';
import { abrirForm, CAMPOS, desenfocar, fijar } from '../../support/playwright';

/**
 * Repro mínimo del incidente P0 "selective sibling rollback".
 *
 * Se conserva aparte de `sibling-isolation.spec.ts` porque reproduce la
 * SECUENCIA EXACTA del vídeo del incidente —volver a A y añadir un carácter al
 * final— y no una matriz generada. Esa secuencia es la que fallaba; una matriz
 * equivalente podría dejar de recorrerla tras un refactor y nadie lo notaría.
 *
 *   A = #text-text-0        type=text        plugin propio
 *   B = #text-number-1      type=number      plugin propio
 *   C = #text-fullName-2    type=fullName    preset textLike
 *   D = #text-company-4     type=company     preset textLike
 *
 * El patrón "selectivo" seguía el tipo de schema, no la posición.
 */
test('editar A no borra los valores de sus siblings C y D', async ({ page }) => {
  await abrirForm(page, '/runtime/form');
  await expect(page.locator(CAMPOS.text)).toBeVisible();

  await fijar(page, 'text', '3');
  await fijar(page, 'number', '33');
  await fijar(page, 'fullName', '3333');
  await fijar(page, 'company', '333');

  // Estado correcto antes de reeditar A.
  await expect(page.locator(CAMPOS.text)).toHaveText('3');
  await expect(page.locator(CAMPOS.number)).toHaveText('33');
  await expect(page.locator(CAMPOS.fullName)).toHaveText('3333');
  await expect(page.locator(CAMPOS.company)).toHaveText('333');

  // El gesto del vídeo: volver a A y añadir un carácter al final.
  const campoA = page.locator(CAMPOS.text);
  await campoA.click();
  await campoA.press('End');
  await campoA.pressSequentially('3');
  await desenfocar(page);

  await expect(page.locator(CAMPOS.text)).toHaveText('33');
  await expect(page.locator(CAMPOS.number)).toHaveText('33');
  await expect(page.locator(CAMPOS.fullName)).toHaveText('3333');
  await expect(page.locator(CAMPOS.company)).toHaveText('333');
});
