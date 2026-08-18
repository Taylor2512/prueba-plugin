import { expect, test } from '@playwright/test';
import { abrirForm, cambiarUsuario, selectorUsuario } from '../../support/playwright';

/**
 * Ownership real: `/runtime/form/multi-user` sí declara asignaciones per-user,
 * así que aquí el aislamiento SÍ es el contrato.
 *
 * Vive en `runtime/` y no en `form/digital-agreements/` porque lo que prueba es
 * la proyección por usuario del runtime, no el inventario de esa plantilla.
 */
test.beforeEach(async ({ page }) => {
  await abrirForm(page, '/runtime/form/multi-user');
  await expect(selectorUsuario(page)).toBeVisible();
});

test.describe('Runtime multiusuario — ownership', () => {
  // @caso DECL-UC-008
  // @caso UC-07
  test('cada usuario sólo edita los schemas que tiene asignados', async ({ page }) => {
    const campoAlice = page.locator('#text-text-0');
    const campoBob = page.locator('#text-number-1');

    await cambiarUsuario(page, 'alice');
    await expect(campoAlice).toHaveCount(1);
    await expect(campoAlice).toHaveAttribute('contenteditable', /true|plaintext-only/);
    await expect(campoBob).toHaveCount(0);

    await cambiarUsuario(page, 'bob');
    await expect(campoAlice).toHaveCount(0);
    await expect(campoBob).toHaveCount(1);
    await expect(campoBob).toHaveAttribute('contenteditable', /true|plaintext-only/);
  });
});
