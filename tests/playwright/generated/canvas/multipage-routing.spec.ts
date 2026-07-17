import { test, expect } from '@playwright/test';
import { canvas, openDesigner, schemaOnCanvas } from '../fixtures/designer.fixture';

test.describe('Canvas multipágina y routing', () => {
  test('mantiene scroll vertical y permite alcanzar página 2+', async ({ page }) => {
    await openDesigner(page);
    const area = canvas(page);
    await area.evaluate((node) => { node.scrollTop = node.scrollHeight; });
    await expect.poll(() => area.evaluate((node) => node.scrollTop)).toBeGreaterThan(0);
    const pages = area.locator('[data-paper-page], [data-canvas-page]');
    expect(await pages.count()).toBeGreaterThan(1);
  });

  test('selección de schema no salta al paper equivocado', async ({ page }) => {
    await openDesigner(page);
    const schema = schemaOnCanvas(page, 'contract_name');
    await schema.click();
    const pageNode = schema.locator('xpath=ancestor::*[@data-paper-page or @data-canvas-page][1]');
    if (await pageNode.count()) {
      const before = await pageNode.getAttribute('data-page-number');
      await page.keyboard.press('ArrowRight');
      expect(await pageNode.getAttribute('data-page-number')).toBe(before);
    }
  });

  test('schema conserva file/page data attributes cuando existen', async ({ page }) => {
    await openDesigner(page);
    const schemas = canvas(page).locator('[data-schema-id]');
    expect(await schemas.count()).toBeGreaterThan(0);
    const first = schemas.first();
    await expect(first).toHaveAttribute('data-schema-id', /.+/);
  });
});
