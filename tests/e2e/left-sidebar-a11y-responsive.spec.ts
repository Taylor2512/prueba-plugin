import { expect, test } from '@playwright/test';

const ROUTE = '/lab/multi-document-routing';

test.describe('left sidebar a11y responsive', () => {
  test('keeps toolbar controls discoverable in compact layouts', async ({ page }) => {
    await page.goto(ROUTE);

    const sidebar = page.locator('.sisad-pdfme-designer-left-sidebar');
    await expect(sidebar).toBeVisible();

    const tabs = page.locator('[data-testid="designer-left-sidebar-tab"]');
    await expect(tabs.first()).toBeVisible();

    const buttons = page.locator('.sisad-pdfme-designer-left-sidebar [role="button"]');
    await expect(buttons.first()).toBeVisible();
  });
});
