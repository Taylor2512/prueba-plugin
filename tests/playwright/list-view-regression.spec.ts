import { expect, test } from '@playwright/test';
import { EXAMPLE_ROUTE_PATHS } from '@/examples/routes/routeDefinitions.js';

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
    await page.goto(EXAMPLE_ROUTE_PATHS.designerMultiUser);
    await page.keyboard.press('Escape');

    const fieldsTab = page.getByRole('tab', { name: /Abrir panel Campos/i }).first();
    await expect(fieldsTab).toBeVisible();
    await fieldsTab.click();

    await openCatalog(page);
    await ensureCategoryOpen(page, 'Selecciones');
    // Scope to the catalog button — the readable ListView labels now also contain
    // the type label "Opción", so an inexact match would collide with list rows.
    await page.locator('button[data-schema-type="radioGroup"][data-schema-label="Opción"]').first().dblclick();

    // Return to the fields panel after adding the group so the contract is tested in ListView.
    await page.keyboard.press('Escape');

    const listView = page.locator('.sisad-pdfme-designer-list-view');
    await expect(listView).toBeVisible();

    const groupItem = listView.locator('.sisad-pdfme-designer-list-view-item[data-schema-type="radioGroup"]').first();
    const plainItem = listView.locator('.sisad-pdfme-designer-list-view-item[data-schema-type="text"]').first();

    await expect(groupItem).toBeVisible();
    await expect(plainItem).toBeVisible();
    await expect(groupItem).toHaveAttribute('data-schema-type', 'radioGroup');
    await expect(plainItem).toHaveAttribute('data-schema-type', 'text');
    expect(await listView.locator('.sisad-pdfme-designer-list-view-item').count()).toBeGreaterThan(1);
  });
});
