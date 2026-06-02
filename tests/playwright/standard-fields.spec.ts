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

test.describe('standard fields catalog', () => {
  test('exposes canonical labels for number and dropdown/select and renders the expected schema types', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', (err) => consoleErrors.push(`PAGEERROR: ${err.message}`));

    await page.goto('/lab/multi-document-routing');
    await openCatalog(page);
    await ensureCategoryOpen(page, 'Texto');
    await ensureCategoryOpen(page, 'Selecciones');

    await expect(page.locator('[data-schema-type="number"]').first()).toBeVisible();
    await expect(page.locator('[data-schema-type="select"]').first()).toBeVisible();

    await page.locator('[data-schema-type="number"]').first().dblclick();
    await expect.poll(async () => page.locator('.sisad-pdfme-ui-custom-selectable[data-schema-type="number"]').count()).toBeGreaterThanOrEqual(1);

    await page.locator('[data-schema-type="select"]').first().dblclick();
    await expect.poll(async () => page.locator('.sisad-pdfme-ui-custom-selectable[data-schema-type="select"]').count()).toBeGreaterThanOrEqual(1);

    expect(consoleErrors, consoleErrors.join('\n')).toHaveLength(0);
  });
});
