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
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', (err) => consoleErrors.push(`PAGEERROR: ${err.message}`));

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

    await page.locator('.sisad-pdfme-ui-custom-selectable[data-schema-type="radioGroup"]').first().click();
    await expect.poll(async () => page.locator('[data-radio-group-add-option]').count()).toBeGreaterThanOrEqual(1);

    expect(consoleErrors, consoleErrors.join('\n')).toHaveLength(0);
  });
});
