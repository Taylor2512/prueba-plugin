import { expect, test } from '@playwright/test';

const ROUTE = '/';

test.setTimeout(180000);

test.describe('multi-document routing design and showcase coverage', () => {
  test('exposes the normalized download bundle affordance on the multi-document example card', async ({ page }) => {
    await page.goto(ROUTE);

    const card = page.locator('article').filter({
      has: page.getByRole('heading', { name: 'Multidocumento integral' }),
    });
    await expect(card.first()).toBeVisible({ timeout: 15000 });

    await card.locator('details').evaluate((node) => {
      if (node instanceof HTMLDetailsElement) node.open = true;
    });

    const downloadTrigger = page.locator('button[aria-label="Descargar plantilla Multidocumento integral"]');
    await expect(downloadTrigger).toBeVisible({ timeout: 15000 });
    await expect(downloadTrigger).toHaveAttribute(
      'aria-label',
      'Descargar plantilla Multidocumento integral',
    );
  });
});
