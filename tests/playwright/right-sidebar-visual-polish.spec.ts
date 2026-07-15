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

    await expect(switcherWrap).toBeVisible();
    await expect(switcher).toBeVisible();
    await expect(activeTab).toBeVisible();

    await expect(switcherWrap).toHaveClass(/bg-slate-50\/80/);
    await expect(switcherWrap).toHaveClass(/border-b/);
    await expect(switcher).toHaveClass(/rounded-full/);
    await expect(activeTab).toHaveClass(/focus-visible:outline-none/);
    await expect(activeTab).toHaveClass(/focus-visible:ring-2/);

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
