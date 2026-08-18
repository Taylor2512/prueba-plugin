import { expect, test } from '@playwright/test';
import {
  abrirForm,
  CAMPOS,
  fijar,
  instanciasRuntime,
  type ClaveCampo,
} from '../../../support/playwright';

/**
 * Estabilidad de la instancia bajo edición sostenida.
 *
 * Se cuenta el HOST del runtime, no los nodos de campo: el renderer imperativo
 * reconstruye el DOM de cada schema por diseño, así que marcar el campo
 * detectaría un repintado normal en vez de un remontaje real.
 */
test.beforeEach(async ({ page }) => {
  await abrirForm(page, '/runtime/form/digital-agreements');
});

test.describe('Form digital-agreements — estabilidad del runtime', () => {
  // @caso RUN-012
  test('escribir no remonta la instancia', async ({ page }) => {
    const antes = await instanciasRuntime(page);
    expect(antes).toBeGreaterThan(0);

    await fijar(page, 'text', 'Sin remontar');
    await fijar(page, 'company', 'Otro');
    await fijar(page, 'number', '7');

    expect(await instanciasRuntime(page)).toBe(antes);
  });

  // @caso RUN-012
  // @caso QLT-006
  test('veinte ediciones alternadas convergen sin pérdida', async ({ page }) => {
    const orden: ClaveCampo[] = ['text', 'company', 'fullName', 'email'];
    for (let i = 1; i <= 20; i += 1) {
      const clave = orden[i % orden.length];
      const valor = `v${i}`;
      await fijar(page, clave, valor);
      await expect(page.locator(CAMPOS[clave])).toHaveText(valor);
    }
  });
});
