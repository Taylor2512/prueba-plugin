import { expect, test } from '@playwright/test';

const openCatalog = async (page: import('@playwright/test').Page) => {
  const toggle = page
    .getByRole('button', { name: /Abrir catálogo de campos|Cerrar catálogo de campos/i })
    .first();
  await expect(toggle).toBeVisible();
  if (/Abrir catálogo/i.test((await toggle.textContent()) || '')) {
    await toggle.click();
  }
};

const ensureCategoryOpen = async (page: import('@playwright/test').Page, category: string) => {
  const toggle = page.getByRole('button', { name: new RegExp(`^Alternar categoría ${category}$`, 'i') }).first();
  await expect(toggle).toBeVisible();
  if ((await toggle.getAttribute('aria-expanded')) !== 'true') {
    await toggle.click();
  }
};

test.describe('list view regression', () => {
  test('shows a group row and a plain field row in the right sidebar list', async ({ page }) => {
    await page.goto('/lab/multi-document-routing');
    await page.keyboard.press('Escape');

    await openCatalog(page);
    await ensureCategoryOpen(page, 'Selecciones');
    await page.getByRole('button', { name: 'Opción' }).dblclick();

    // Return to the list panel after adding the group so the contract is tested in list view.
    await page.keyboard.press('Escape');

    const listView = page.locator('.sisad-pdfme-designer-list-view');
    await expect(listView).toBeVisible();
    await expect(page.locator('aside[data-panel-mode="list"]')).toBeVisible();

    const groupItem = listView.locator('.sisad-pdfme-designer-list-view-item[data-schema-type="radioGroup"]').first();
    const plainItem = listView.locator('.sisad-pdfme-designer-list-view-item[data-schema-type="text"]').first();

    await expect(groupItem).toBeVisible();
    await expect(plainItem).toBeVisible();
    await expect(groupItem).toHaveAttribute('data-schema-type', 'radioGroup');
    await expect(plainItem).toHaveAttribute('data-schema-type', 'text');
    expect(await listView.locator('.sisad-pdfme-designer-list-view-item').count()).toBeGreaterThan(1);
  });
});
