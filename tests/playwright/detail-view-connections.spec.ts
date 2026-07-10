import { expect, test } from '@playwright/test';

test.describe('detail-view attachment', () => {
  test('attachment exposes file rules and hides empty format/data sections', async ({ page }) => {
    await page.goto('/lab/multi-document-routing');
    await page.locator('.sisad-pdfme-ui-custom-selectable[data-schema-name="routing-primary-showcase_attachment"]').first().click({ force: true });

    await expect(page.getByText('Reglas del archivo')).toBeVisible();
    await expect(page.getByText('Asignación y bloqueo')).toBeVisible();
    await expect(page.getByTestId('detail-section-technical')).toHaveCount(0);
    await expect(page.getByTestId('detail-section-format')).toHaveCount(0);
  });
});
