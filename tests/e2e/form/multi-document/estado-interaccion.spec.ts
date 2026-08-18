import { expect, test } from '@playwright/test';
import {
  abrirForm,
  desenfocar,
  escribirCampo,
  leerInteraccion,
} from '../../../support/playwright';

/**
 * RTP-510.C — `touched` / `dirty` / `valid` / `completed` observables.
 *
 * Se lee el estado que expone el MODELO a través del panel del laboratorio, no
 * el DOM del campo: el renderer reconstruye los nodos, así que deducir el
 * estado del marcado probaría el repintado en vez del modelo.
 */
const CAMPO = '#text-text-0';

const fijar = async (page: import('@playwright/test').Page, valor: string) => {
  await escribirCampo(page.locator(CAMPO), valor);
  await desenfocar(page);
};

test.beforeEach(async ({ page }) => {
  await abrirForm(page, '/runtime/form/multi-document');
  await expect(page.locator(CAMPO)).toBeVisible();
});

test.describe('Form multi-document — estado de interacción', () => {
  // @caso RUN-002
  test('un campo sin tocar no está touched ni dirty', async ({ page }) => {
    const estado = await leerInteraccion(page, 'text', [
      'data-touched',
      'data-dirty',
      'data-interaction-count',
    ]);
    expect(estado['data-touched']).toBe('false');
    expect(estado['data-dirty']).toBe('false');
    expect(estado['data-interaction-count']).toBe('0');
  });

  // @caso RUN-002
  // @caso UC-21
  test('escribir marca touched y dirty en el modelo', async ({ page }) => {
    await fijar(page, 'algo nuevo');
    const estado = await leerInteraccion(page, 'text', ['data-touched', 'data-dirty']);
    expect(estado['data-touched']).toBe('true');
    expect(estado['data-dirty']).toBe('true');
  });

  // @caso RUN-002
  test('volver al valor original deja dirty en false conservando touched', async ({ page }) => {
    const original = (await page.locator(CAMPO).textContent()) ?? '';

    await fijar(page, 'modificado');
    expect((await leerInteraccion(page, 'text', ['data-dirty']))['data-dirty']).toBe('true');

    await fijar(page, original);
    const estado = await leerInteraccion(page, 'text', ['data-touched', 'data-dirty']);
    // El usuario SÍ interactuó, simplemente no dejó nada cambiado.
    expect(estado['data-touched']).toBe('true');
    expect(estado['data-dirty']).toBe('false');
  });

  // @caso RUN-002
  test('cada edición incrementa el contador de interacciones', async ({ page }) => {
    await fijar(page, 'uno');
    await fijar(page, 'dos');
    const estado = await leerInteraccion(page, 'text', ['data-interaction-count']);
    expect(Number(estado['data-interaction-count'])).toBeGreaterThanOrEqual(2);
  });

  // @caso RUN-002
  test('el panel expone estado para todos los schemas montados', async ({ page }) => {
    await page.getByTestId('-info-toggle').click();
    await expect(page.getByTestId('lab-interaction-list')).toHaveCount(1);
    const filas = page.locator('[data-testid^="lab-interaction-"][data-touched]');
    await expect.poll(() => filas.count()).toBeGreaterThan(0);
  });
});
