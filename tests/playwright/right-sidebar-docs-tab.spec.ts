import { expect, test } from '@playwright/test';

test.describe('right sidebar docs tab', () => {
  test('exposes the docs tab on the multi-document routing lab and opens the documents panel', async ({ page }) => {
    await page.goto('/lab/multi-document-routing');

    const docsTab = page.locator('#sisad-pdfme-right-sidebar-tab-docs').first();
    await expect(docsTab).toBeVisible();

    await docsTab.click();

    await expect(page.locator('aside[data-panel-mode="docs"]').first()).toBeVisible();
    await expect(page.getByText('Documentos cargados').first()).toBeVisible();
  });
});
