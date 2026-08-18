import { expect, test } from '@playwright/test';
import {
  abrirForm,
  CAMPOS,
  desenfocar,
  esperarValores,
  fijar,
} from '../../../support/playwright';

/**
 * Casos límite del schema `number` en la ruta que monta todas las familias.
 *
 * El aislamiento del filtro de entrada frente a los campos de texto vive en
 * `tests/e2e/form/number-input.spec.ts`; aquí sólo se fija la semántica del
 * valor (cero, decimal, negativo, vacío).
 */
test.beforeEach(async ({ page }) => {
  await abrirForm(page, '/runtime/form/digital-agreements');
});

test.describe('Form digital-agreements — entrada numérica', () => {
  // @caso SCH-005
  // @caso UC-21
  test('cero es un valor, no un vacío', async ({ page }) => {
    await fijar(page, 'number', '0');
    await esperarValores(page, { number: '0' });
  });

  // @caso SCH-005
  test('decimal y negativo', async ({ page }) => {
    await fijar(page, 'number', '3.5');
    await esperarValores(page, { number: '3.5' });

    await fijar(page, 'number', '-7');
    await esperarValores(page, { number: '-7' });
  });

  // @caso SCH-005
  // @caso RUN-004
  test('limpiar deja el campo vacío sin arrastrar siblings', async ({ page }) => {
    await fijar(page, 'text', 'Vecino');
    await fijar(page, 'number', '42');
    await fijar(page, 'number', '');
    await esperarValores(page, { number: '', text: 'Vecino' });
  });

  // @caso SCH-005
  test('la entrada alfabética no se acepta', async ({ page }) => {
    await fijar(page, 'number', '12');
    await page.locator(CAMPOS.number).pressSequentially('abc');
    await desenfocar(page);
    await expect(page.locator(CAMPOS.number)).not.toHaveText(/abc/);
  });
});
