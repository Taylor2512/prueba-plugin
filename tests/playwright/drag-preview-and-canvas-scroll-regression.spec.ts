import { expect, test } from '@playwright/test';

const ROUTE = '/lab/multi-document-routing';

const openCatalog = async (page: import('@playwright/test').Page) => {
  const toggle = page
    .getByRole('button', { name: /Abrir catálogo de campos|Cerrar catálogo de campos/i })
    .first();
  await expect(toggle).toBeVisible();
  if (/Abrir catálogo/i.test((await toggle.textContent()) || '')) {
    await toggle.click();
  }
};

test.describe('drag preview and canvas scroll regression', () => {
  test('shows drag preview and drops a field on page 2 without losing canvas scrolling', async ({ page }) => {
    await page.goto(ROUTE);
    await expect(page.locator('[data-paper-page="true"]').first()).toBeVisible();

    const pages = page.locator('[data-paper-page="true"]');
    const pageCount = await pages.count();
    test.skip(pageCount < 2, 'multi-page fixture required for this regression');

    await openCatalog(page);

    const source = page.locator('button[data-schema-type="text"]').first();
    await expect(source).toBeVisible();

    const pageTwo = pages.nth(1);
    await pageTwo.scrollIntoViewIfNeeded();

    const sourceBox = await source.boundingBox();
    const pageTwoBox = await pageTwo.boundingBox();
    expect(sourceBox).not.toBeNull();
    expect(pageTwoBox).not.toBeNull();

    const pageTwoSchemas = pageTwo.locator('.sisad-pdfme-ui-custom-selectable');
    const initialPageTwoCount = await pageTwoSchemas.count();

    await page.mouse.move((sourceBox?.x || 0) + 12, (sourceBox?.y || 0) + 12);
    await page.mouse.down();
    await page.mouse.move((pageTwoBox?.x || 0) + 80, (pageTwoBox?.y || 0) + 120);

    await expect(page.locator('.sisad-pdfme-schema-drag-preview')).toBeVisible();
    await expect(page.locator('.sisad-pdfme-schema-drag-preview[data-over-page="true"]')).toBeVisible();
    await expect(page.locator('.sisad-pdfme-schema-drop-placeholder')).toBeVisible();

    await page.mouse.up();

    await expect.poll(async () => pageTwoSchemas.count()).toBeGreaterThan(initialPageTwoCount);
    await expect(page.locator('.sisad-pdfme-schema-drag-preview')).toHaveCount(0);
  });
});
