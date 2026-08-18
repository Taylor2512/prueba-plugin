import { expect, test } from '@playwright/test';
import { abrirForm, CAMPOS, NO_TEXTUALES } from '../../../support/playwright';

/**
 * `/runtime/form/digital-agreements` monta las cinco familias a la vez (texto,
 * numérico, temporal, elección, firma y acciones). Si el inventario cambia, el
 * resto de specs de esta carpeta dejan de probar lo que dicen probar, así que
 * este es el primero que debe fallar.
 */
test.describe('Form digital-agreements — inventario', () => {
  // @caso SCH-004
  test('las cinco familias están montadas en la misma página', async ({ page }) => {
    await abrirForm(page, '/runtime/form/digital-agreements');
    for (const [nombre, selector] of Object.entries({ ...CAMPOS, ...NO_TEXTUALES })) {
      await expect(page.locator(selector), `schema ${nombre}`).toHaveCount(1);
    }
  });
});
