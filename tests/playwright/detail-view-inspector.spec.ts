import { expect, test } from '@playwright/test';

test.describe('detail-view inspector', () => {
  test('selecting a schema opens DetailView with geometry and identity controls', async ({ page }) => {
    await page.goto('/lab/multi-document-routing');

    await page.getByRole('button', { name: 'contract_name' }).click();

    await expect(page.getByRole('textbox', { name: '* Nombre del campo' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Renombrar campo' })).toBeVisible();
    await expect(page.locator('.sisad-pdfme-designer-inline-edit-btn')).toHaveCount(2);
    await expect(page.getByRole('spinbutton', { name: '* X' })).toBeVisible();
    await expect(page.getByRole('spinbutton', { name: '* Y' })).toBeVisible();
    await expect(page.getByRole('spinbutton', { name: '* Anchura' })).toBeVisible();
    await expect(page.getByRole('spinbutton', { name: '* Altura' })).toBeVisible();
  });

});
