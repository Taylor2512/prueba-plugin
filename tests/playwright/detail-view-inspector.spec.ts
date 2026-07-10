import { expect, test } from '@playwright/test';

test.describe('detail-view inspector', () => {
  test('selecting a schema opens DetailView with geometry and identity controls', async ({ page }) => {
    await page.goto('/lab/multi-document-routing');

    await page.locator('.sisad-pdfme-ui-custom-selectable[data-schema-name="contract_name"]').first().click({ force: true });

    await expect(page.getByRole('button', { name: 'Expandir sección Ubicación y tamaño' })).toBeVisible();
    await page.getByRole('button', { name: 'Expandir sección Ubicación y tamaño' }).click();

    await expect(page.locator('input#name')).toHaveValue('contract_name');
    await expect(page.locator('input#position_x')).toHaveValue('18');
    await expect(page.locator('input#position_y')).toHaveValue('24');
    await expect(page.locator('input#width')).toHaveValue('92');
    await expect(page.locator('input#height')).toHaveValue('12');
    await expect(page.locator('input#rotate')).toHaveValue('0');
  });

});
