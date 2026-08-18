import { expect, test } from '@playwright/test';
import { abrirForm, desenfocar, escribirCampo } from '../../support/playwright';

/**
 * El Form acepta interacción real en cada familia de schema y una familia no
 * revierte a otra.
 *
 * Antes formaba parte de `test-form-navigation.spec.ts`, mezclado con la
 * navegación del host y con el modo lectura del Viewer.
 */
test.beforeEach(async ({ page }) => {
  await abrirForm(page, '/runtime/form/digital-agreements');
});

test.describe('Form — edición por familia de schema', () => {
  // @caso SCH-004
  // @caso SCH-010
  // @caso RUN-004
  test('texto, select, número y elección conviven sin revertirse', async ({ page }) => {
    const viewport = page.getByTestId('-runtime-viewport');

    const texto = viewport
      .locator('[contenteditable="true"], [contenteditable="plaintext-only"]')
      .first();
    await expect(texto).toBeVisible();
    await escribirCampo(texto, 'Form interaction');
    await desenfocar(page);
    await expect(texto).toHaveText('Form interaction');

    const select = viewport.locator('select').first();
    await select.selectOption({ index: 1 });
    await expect(select).toHaveValue('option1');
    await expect(texto).toHaveText('Form interaction');

    const numero = viewport.locator('#text-number-1');
    await expect(numero).toBeVisible();
    await escribirCampo(numero, '42');
    await desenfocar(page);
    await expect(numero).toHaveText('42');
    await expect(texto).toHaveText('Form interaction');

    const radio = viewport.getByRole('radio', { name: 'Opción 2' });
    await radio.click();
    await expect(radio).toHaveAttribute('aria-checked', 'true');

    const checkbox = viewport.getByRole('checkbox', { name: 'Casilla 1' });
    await checkbox.click();
    await expect(checkbox).toHaveAttribute('aria-checked', 'true');
    await expect(texto).toHaveText('Form interaction');
  });

  // @caso RUN-004
  // @caso SCH-005
  test('la escritura secuencial conserva el foco en texto y en número', async ({ page }) => {
    const viewport = page.getByTestId('-runtime-viewport');

    const texto = viewport
      .locator('[contenteditable="true"], [contenteditable="plaintext-only"]')
      .first();
    await escribirCampo(texto, 'ABC 123');
    await expect(texto).toHaveText('ABC 123');

    const numero = viewport.locator('#text-number-1');
    await escribirCampo(numero, '-12.50');
    await expect(numero).toHaveText('-12.50');
    await expect(texto).toHaveText('ABC 123');
  });
});
