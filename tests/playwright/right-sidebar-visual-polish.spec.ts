import { expect, test } from '@playwright/test';

const openDesigner = async (page: import('@playwright/test').Page) => {
  await page.goto('/lab/multi-document-routing');
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

    await expect(switcherWrap).toHaveClass(/bg-gradient-to-b/);
    await expect(switcherWrap).toHaveClass(/border-b/);
    await expect(switcher).toHaveClass(/rounded-\[1rem\]/);
    await expect(activeTab).toHaveClass(/focus-visible:outline-none/);
    await expect(activeTab).toHaveClass(/focus-visible:ring-2/);
    await expect(leftSidebarShell).toHaveClass(/rounded-\[1\.125rem\]/);
    await expect(leftSidebarControlBand).toHaveClass(/px-1/);

    await activeTab.focus();
    await expect(activeTab).toBeFocused();

    const listItem = page.locator('.sisad-pdfme-designer-list-view-item').first();
    await expect(listItem).toBeVisible();
    const ownerColor = await listItem.getAttribute('data-schema-owner-color');
    expect(ownerColor).toBeTruthy();
    const selectedCount = await page.locator('.sisad-pdfme-designer-list-view-item[data-selected="true"]').count();
    expect(selectedCount).toBeLessThanOrEqual(1);
  });
});
