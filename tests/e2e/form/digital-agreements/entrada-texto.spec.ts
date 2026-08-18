import { expect, test } from '@playwright/test';
import {
  abrirForm,
  CAMPOS,
  desenfocar,
  esperarValores,
  fijar,
} from '../../../support/playwright';

/**
 * Ciclo de vida de la entrada textual: escribir, reemplazar, vaciar y volver a
 * escribir. Los presets `textLike` (`fullName`, `company`, `title`) reutilizan
 * el `ui` del plugin `text`, así que se ejercitan junto al plugin base.
 */
test.beforeEach(async ({ page }) => {
  await abrirForm(page, '/runtime/form/digital-agreements');
});

test.describe('Form digital-agreements — entrada de texto', () => {
  // @caso RUN-004
  // @caso UC-21
  test('escribir, reemplazar, borrar y reescribir', async ({ page }) => {
    await fijar(page, 'text', 'Primero');
    await esperarValores(page, { text: 'Primero' });

    await fijar(page, 'text', 'Reemplazado');
    await esperarValores(page, { text: 'Reemplazado' });

    await fijar(page, 'text', '');
    await esperarValores(page, { text: '' });

    await fijar(page, 'text', 'De nuevo');
    await esperarValores(page, { text: 'De nuevo' });
  });

  // @caso SCH-004
  test('escritura rápida encadenada entre presets textLike', async ({ page }) => {
    await fijar(page, 'fullName', 'Ada Lovelace');
    await fijar(page, 'email', 'ada@example.test');
    await fijar(page, 'company', 'Analytical Engines');
    await fijar(page, 'title', 'Matematica');

    await esperarValores(page, {
      fullName: 'Ada Lovelace',
      email: 'ada@example.test',
      company: 'Analytical Engines',
      title: 'Matematica',
    });
  });

  // @caso RUN-004
  test('blur y volver a enfocar conserva el valor', async ({ page }) => {
    await fijar(page, 'text', 'Persistente');
    await page.locator(CAMPOS.company).click();
    await desenfocar(page);
    await page.locator(CAMPOS.text).click();
    await desenfocar(page);
    await esperarValores(page, { text: 'Persistente' });
  });
});
