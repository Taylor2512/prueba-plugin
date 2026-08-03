import { expect, test } from '@playwright/test';
import { EXAMPLE_ROUTE_PATHS } from '@/examples/routes/routeDefinitions.js';

const openDesigner = async (page: import('@playwright/test').Page) => {
  await page.goto(EXAMPLE_ROUTE_PATHS.designerMultiUser);
  await page.keyboard.press('Escape');
};

test.describe('right sidebar visual polish', () => {
  test('keeps the panel switcher compact and selection visually distinct', async ({ page }) => {
    await openDesigner(page);

    const switcherWrap = page.locator('.sisad-pdfme-designer-right-sidebar-panel-switcher-wrap').first();
    const switcher = page.locator('.sisad-pdfme-designer-right-sidebar-panel-switcher').first();
    const activeTab = page.locator('.sisad-pdfme-designer-right-sidebar-panel-switcher-btn[data-active="true"]').first();
    const leftSidebarShell = page.locator('.sisad-pdfme-designer-left-sidebar-shell').first();
    const leftSidebarControlBand = page.locator('.sisad-pdfme-designer-left-sidebar-control-band').first();

    await expect(switcherWrap).toBeVisible();
    await expect(switcher).toBeVisible();
    await expect(activeTab).toBeVisible();
    await expect(leftSidebarShell).toBeVisible();
    await expect(leftSidebarControlBand).toBeVisible();

    await expect(switcherWrap).toHaveClass(/bg-\[linear-gradient/);
    await expect(switcherWrap).toHaveClass(/border-slate-200\/70/);
    await expect(switcher).toHaveClass(/rounded-\[0\.9rem\]/);
    await expect(activeTab).toHaveClass(/focus-visible:outline-none/);
    await expect(activeTab).toHaveClass(/focus-visible:ring-2/);
    await expect(leftSidebarShell).toHaveClass(/rounded-\[0\.95rem\]/);
    await expect(leftSidebarControlBand).toHaveClass(/px-3/);

    await activeTab.focus();
    await expect(activeTab).toBeFocused();

    await expect(page.locator('.sisad-pdfme-designer-right-sidebar').first()).toBeVisible();
    await expect(page.locator('#sisad-pdfme-right-sidebar-tab-docs').first()).toBeVisible();
  });
});
