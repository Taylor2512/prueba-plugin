import { expect, test } from '@playwright/test';
import { EXAMPLE_ROUTE_PATHS } from '@/examples/routes/routeDefinitions.js';

test.describe('schema owner color', () => {
  test('canvas, header and list rows expose the same owner accent', async ({ page }) => {
    await page.goto(EXAMPLE_ROUTE_PATHS.designerMultiUser);

    const ownedSchemas = page.locator('.sisad-pdfme-ui-custom-selectable[data-schema-owner-color]');
    await expect.poll(async () => ownedSchemas.count()).toBeGreaterThan(0);

    const target = ownedSchemas.first();
    const canvasColor = await target.getAttribute('data-schema-owner-color');
    expect(canvasColor).toBeTruthy();

    await target.click({ force: true });

    const header = page.getByTestId('detail-header-card');
    await expect(header).toBeVisible();
    const headerColor = await header.getAttribute('data-schema-owner-color');
    expect(headerColor).toBeTruthy();
    expect(String(headerColor).toLowerCase()).toBe(String(canvasColor).toLowerCase());

    await page.keyboard.press('Escape');
    const listView = page.locator('.sisad-pdfme-designer-list-view');
    await expect(listView).toBeVisible();
    const listItem = listView.getByTestId('right-sidebar-field-item').first();
    await expect(listItem).toBeVisible();
    const listColor = await listItem.getAttribute('data-schema-owner-color');
    if (canvasColor && listColor) {
      expect(String(listColor).toLowerCase()).toBe(String(canvasColor).toLowerCase());
    }

    const activeRecipientDot = page.locator('[style*="--active-recipient-color"]').first();
    await expect(activeRecipientDot).toBeVisible();
  });
});
