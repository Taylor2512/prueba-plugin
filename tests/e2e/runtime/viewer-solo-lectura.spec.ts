import { expect, test } from '@playwright/test';
import { abrirViewer } from '../../support/playwright';

/**
 * El Viewer es la misma superficie que el Form con `mode: 'viewer'`: por eso su
 * contrato de sólo lectura merece un spec propio y no un párrafo dentro del
 * spec del Form. Si el modo dejara de aplicarse, aquí es donde debe verse.
 */
test.describe('Runtime Viewer — sólo lectura', () => {
  // @caso RUN-005
  // @caso UC-19
  test('ningún schema es editable y las elecciones están deshabilitadas', async ({ page }) => {
    await abrirViewer(page, '/runtime/viewer');
    const viewport = page.getByTestId('-runtime-viewport');

    await expect(
      viewport.locator('[contenteditable="true"], [contenteditable="plaintext-only"]'),
    ).toHaveCount(0);

    const elecciones = viewport.locator('button[role="radio"], button[role="checkbox"]');
    await expect(elecciones).toHaveCount(4);
    for (let index = 0; index < 4; index += 1) {
      await expect(elecciones.nth(index)).toBeDisabled();
    }
  });
});
