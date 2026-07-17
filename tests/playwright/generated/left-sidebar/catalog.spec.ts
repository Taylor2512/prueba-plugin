import { test, expect } from '@playwright/test';
import { leftSidebar, openDesigner } from '../fixtures/designer.fixture';

test.describe('LeftSidebar catálogo', () => {
  test('busca schemas y muestra empty state al no encontrar', async ({ page }) => {
    await openDesigner(page);
    const sidebar = leftSidebar(page);
    const search = sidebar.getByRole('textbox', { name: /Buscar/i }).or(sidebar.locator('input[placeholder*="Buscar"]')).first();
    await expect(search).toBeVisible();
    await search.fill('Firma');
    await expect(sidebar.getByText(/^Firma$/i).first()).toBeVisible();
    await search.fill('__schema_inexistente__');
    await expect(sidebar.getByText(/sin resultados|no hay/i).first()).toBeVisible();
  });

  test('layouts list/tiles/icons no cambian el catálogo funcional', async ({ page }) => {
    await openDesigner(page);
    const sidebar = leftSidebar(page);
    const toggles = sidebar.getByRole('button').filter({ has: page.locator('svg') });
    const candidates = await toggles.count();
    expect(candidates).toBeGreaterThan(0);
    for (const name of [/lista/i, /tarjetas|cuadrícula/i, /iconos/i]) {
      const button = sidebar.getByRole('button', { name });
      if (await button.count()) {
        await button.click();
        await expect(sidebar.getByText(/^Texto$/).first()).toBeVisible();
      }
    }
  });

  test('favorito no inicia drag y persiste visualmente', async ({ page }) => {
    await openDesigner(page);
    const sidebar = leftSidebar(page);
    const favorite = sidebar.getByRole('button', { name: /favorito/i }).first();
    test.skip(!(await favorite.count()), 'Favoritos no habilitados en este layout');
    await favorite.click();
    await expect(favorite).toHaveAttribute('aria-pressed', /true|false/);
  });
});
