import { expect, test } from '@playwright/test';
import { EXAMPLE_ROUTE_PATHS } from '@/examples/routes/routeDefinitions.js';

const ROUTE = EXAMPLE_ROUTE_PATHS.designerMultiUser;

test.describe('left sidebar density', () => {
  test('renders the sidebar and keeps density-scoped controls visible', async ({ page }) => {
    await page.goto(ROUTE);

    const sidebar = page.locator('.sisad-pdfme-designer-left-sidebar');
    await expect(sidebar).toBeVisible();

    await page.setViewportSize({ width: 1200, height: 800 });

    const search = page.locator('[data-testid="left-sidebar-search"]');
    await expect(search.first()).toBeVisible();

    const collapseHandle = page.locator('[data-testid*="sidebar-collapse"]').first();
    if (await collapseHandle.count()) {
      await expect(collapseHandle).toBeVisible();
    }
  });
});
