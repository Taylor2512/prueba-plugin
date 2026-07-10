import { expect, test } from '@playwright/test';

test.describe('detail-view connections', () => {
  test('expanding data bindings exposes persistence, form and api controls', async ({ page }) => {
    await page.goto('/lab/multi-document-routing');
    await page.locator('button[aria-label="contract_name"]').click();

    await page.getByRole('button', { name: 'Expandir sección Datos y conexión' }).click();

    await expect(page.getByText('Persistencia, JSON y API.')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Validar' })).toBeVisible();
  });
});
