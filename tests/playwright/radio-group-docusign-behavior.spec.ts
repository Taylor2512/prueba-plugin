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

test.describe('radioGroup DocuSign-style behavior', () => {
  test('radioGroup is available in the catalog and renders a compact option group', async ({ page }) => {
    await page.goto('/lab/multi-document-routing');
    await openCatalog(page);
    await ensureCategoryOpen(page, 'Selecciones');

    await expect(page.locator('[data-schema-type="radioGroup"]').first()).toBeVisible();
    await page.locator('[data-schema-type="radioGroup"]').first().dblclick();

    await expect.poll(async () => page.locator('.sisad-pdfme-ui-custom-selectable[data-schema-type="radioGroup"]').count()).toBeGreaterThanOrEqual(1);
    await expect.poll(async () => page.locator('[data-radio-group-option]').count()).toBeGreaterThanOrEqual(2);

    const optionIds = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('[data-radio-group-option]')) as HTMLElement[];
      return rows.map((row) => row.getAttribute('data-radio-group-option'));
    });
    expect(optionIds.length).toBeGreaterThanOrEqual(2);
    expect(new Set(optionIds).size).toBeGreaterThanOrEqual(2);
    expect(optionIds.every(Boolean)).toBe(true);

    const radioGroup = page.locator('.sisad-pdfme-ui-custom-selectable[data-schema-type="radioGroup"]').first();
    await radioGroup.click({ force: true });
    // Floating action button is rendered outside the schema element (below Moveable control box).
    const addOption = page.locator('[data-role="group-add-option"]').first();
    await expect(addOption).toBeVisible();

    // Verify button is below the group bounding box.
    const groupBox = await radioGroup.boundingBox();
    const btnBox = await addOption.boundingBox();
    if (groupBox && btnBox) {
      expect(btnBox.y).toBeGreaterThan(groupBox.y + groupBox.height - 2);
    }

    const options = page.locator('[data-radio-group-option]');
    const before = await options.count();
    await addOption.click();
    await expect.poll(async () => options.count()).toBeGreaterThan(before);
  });

});
