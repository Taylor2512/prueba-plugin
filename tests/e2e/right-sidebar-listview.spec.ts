import { expect, test, type Page } from '@playwright/test';

const openCatalog = async (page: Page) => {
  const toggle = page.getByRole('button', { name: /Abrir catálogo de campos|Cerrar catálogo de campos/i }).first();
  await expect(toggle).toBeVisible();
  if (/Abrir catálogo/i.test((await toggle.textContent()) || '')) {
    await toggle.click();
  }
};

test.describe('right sidebar list view', () => {
  test('resolves labels, badges and owner color from a single item descriptor', async ({ page }) => {
    await page.goto('/lab/multi-document-routing');
    await page.keyboard.press('Escape');
    await openCatalog(page);

    const listView = page.locator('.sisad-pdfme-designer-list-view');
    await expect(listView).toBeVisible();
    await expect(page.locator('aside[data-panel-mode="list"]').first()).toBeVisible();

    const items = listView.getByTestId('right-sidebar-field-item');
    await expect.poll(async () => items.count()).toBeGreaterThan(0);

    const firstItem = items.first();
    await expect(firstItem).toHaveAttribute('data-schema-owner-color', /#|rgb|hsl/i);
    await expect(firstItem.getByTestId('right-sidebar-field-label')).toBeVisible();
    await expect(firstItem.getByTestId('right-sidebar-field-type')).toBeVisible();
    await expect(firstItem.getByTestId('right-sidebar-field-technical-name')).toBeVisible();
    await expect.poll(async () => listView.getByTestId('right-sidebar-field-badge').count()).toBeGreaterThan(0);

    const itemText = await firstItem.innerText();
    expect(itemText).toMatch(/Campo|Texto|Firma|Selecci|Fecha|QR|Imagen|Archivo/i);
  });
});
